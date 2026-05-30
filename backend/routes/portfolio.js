const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// ── GET /api/portfolio/me — mon portfolio ──
router.get('/me', protect, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    if (!portfolio) return res.status(404).json({ success: false, message: 'Portfolio introuvable' });
    res.json({ success: true, portfolio });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/portfolio/me — mettre à jour mon portfolio ──
router.put('/me', protect, async (req, res) => {
  try {
    const { titre, bio, disponible, telephone, ville, pays, linkedin, github, facebook, siteWeb } = req.body;
    const portfolio = await Portfolio.findOneAndUpdate(
      { user: req.user._id },
      { titre, bio, disponible, telephone, ville, pays, linkedin, github, facebook, siteWeb },
      { new: true, runValidators: true }
    );
    res.json({ success: true, portfolio });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/portfolio/projet — ajouter un projet ──
router.post('/projet', protect, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    portfolio.projets.push(req.body);
    await portfolio.save();
    res.status(201).json({ success: true, portfolio });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/portfolio/projet/:id — modifier un projet ──
router.put('/projet/:id', protect, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    const projet = portfolio.projets.id(req.params.id);
    if (!projet) return res.status(404).json({ success: false, message: 'Projet introuvable' });
    Object.assign(projet, req.body);
    await portfolio.save();
    res.json({ success: true, portfolio });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/portfolio/projet/:id — supprimer un projet ──
router.delete('/projet/:id', protect, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    portfolio.projets.pull(req.params.id);
    await portfolio.save();
    res.json({ success: true, portfolio });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/portfolio/experience — ajouter une expérience ──
router.post('/experience', protect, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    portfolio.experiences.push(req.body);
    await portfolio.save();
    res.status(201).json({ success: true, portfolio });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/portfolio/experience/:id ──
router.delete('/experience/:id', protect, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    portfolio.experiences.pull(req.params.id);
    await portfolio.save();
    res.json({ success: true, portfolio });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/portfolio/competence ──
router.post('/competence', protect, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    portfolio.competences.push(req.body);
    await portfolio.save();
    res.status(201).json({ success: true, portfolio });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/portfolio/competence/:id ──
router.delete('/competence/:id', protect, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ user: req.user._id });
    portfolio.competences.pull(req.params.id);
    await portfolio.save();
    res.json({ success: true, portfolio });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/portfolio/:username — portfolio public ──
router.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ success: false, message: 'Portfolio introuvable' });

    const portfolio = await Portfolio.findOne({ user: user._id });
    if (!portfolio || !user.isPublic) return res.status(404).json({ success: false, message: 'Portfolio non disponible' });

    // Incrémenter vues (compteur simple existant)
    portfolio.vues += 1;
    await portfolio.save();

    // ── Tracking Analytics détaillé ──
    try {
      const Analytics = require('../models/Analytics');
      const ip = (
        req.headers['x-forwarded-for']?.split(',')[0].trim() ||
        req.headers['x-real-ip'] ||
        req.socket?.remoteAddress || ''
      );
      // Géolocalisation async (non bloquant)
      fetch(`http://ip-api.com/json/${ip}?fields=country,city,status`)
        .then(r => r.json())
        .then(geo => {
          Analytics.create({
            portfolioUsername: user.username,
            portfolioUser: user._id,
            ip,
            pays: geo.status === 'success' ? (geo.country || 'Inconnu') : 'Inconnu',
            ville: geo.status === 'success' ? (geo.city || '') : '',
            page: `/p/${user.username}`,
            userAgent: req.headers['user-agent'] || '',
          }).catch(() => {});
        })
        .catch(() => {});
    } catch (_) {}
    // ── Fin tracking ──

    res.json({
      success: true,
      user: { prenom: user.prenom, nom: user.nom, username: user.username, avatar: user.avatar, template: user.template },
      portfolio
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
