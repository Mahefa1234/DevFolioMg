const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const { protect } = require('../middleware/auth');

// ── Helper : géolocalisation via IP ──
async function getCountryFromIP(ip) {
  try {
    // Ignorer les IPs locales
    if (!ip || ip === '::1' || ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return { pays: 'Local', ville: '' };
    }
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=country,city,status`);
    const data = await res.json();
    if (data.status === 'success') {
      return { pays: data.country || 'Inconnu', ville: data.city || '' };
    }
  } catch (_) {}
  return { pays: 'Inconnu', ville: '' };
}

// ── POST /api/analytics/track — enregistrer une vue ──
router.post('/track', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ success: false });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ success: false });

    // Récupérer l'IP réelle (Vercel / proxy)
    const ip = (
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.headers['x-real-ip'] ||
      req.socket?.remoteAddress ||
      ''
    );

    const { pays, ville } = await getCountryFromIP(ip);

    await Analytics.create({
      portfolioUsername: username,
      portfolioUser: user._id,
      ip,
      pays,
      ville,
      page: `/p/${username}`,
      userAgent: req.headers['user-agent'] || '',
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/analytics/me — stats de mon portfolio ──
router.get('/me', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Vues des 30 derniers jours
    const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [totalVues, vuesParJour, paysStats] = await Promise.all([
      Analytics.countDocuments({ portfolioUser: userId }),

      Analytics.aggregate([
        { $match: { portfolioUser: userId, createdAt: { $gte: since30 } } },
        { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }},
        { $sort: { _id: 1 } }
      ]),

      Analytics.aggregate([
        { $match: { portfolioUser: userId } },
        { $group: { _id: '$pays', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
    ]);

    res.json({
      success: true,
      stats: {
        totalVues,
        vuesParJour: vuesParJour.map(v => ({ date: v._id, count: v.count })),
        pays: paysStats.map(p => ({ pays: p._id || 'Inconnu', count: p.count })),
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/analytics/admin — stats globales (admin) ──
router.get('/admin', protect, async (req, res) => {
  try {
    // Vérifier que c'est l'admin (email spécifique)
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    if (req.user.email !== ADMIN_EMAIL) {
      return res.status(403).json({ success: false, message: 'Accès refusé' });
    }

    const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      usersParJour,
      totalVues,
      vuesParJour,
      paysStats,
      topPortfolios,
      recentUsers,
    ] = await Promise.all([
      User.countDocuments(),

      User.aggregate([
        { $match: { createdAt: { $gte: since30 } } },
        { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }},
        { $sort: { _id: 1 } }
      ]),

      Analytics.countDocuments(),

      Analytics.aggregate([
        { $match: { createdAt: { $gte: since30 } } },
        { $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }},
        { $sort: { _id: 1 } }
      ]),

      Analytics.aggregate([
        { $group: { _id: '$pays', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),

      Analytics.aggregate([
        { $group: { _id: '$portfolioUsername', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),

      User.find().sort({ createdAt: -1 }).limit(20)
        .select('prenom nom email username avatar createdAt'),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        usersParJour: usersParJour.map(u => ({ date: u._id, count: u.count })),
        totalVues,
        vuesParJour: vuesParJour.map(v => ({ date: v._id, count: v.count })),
        pays: paysStats.map(p => ({ pays: p._id || 'Inconnu', count: p.count })),
        topPortfolios: topPortfolios.map(t => ({ username: t._id, vues: t.count })),
        recentUsers,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
module.exports.getCountryFromIP = getCountryFromIP;
