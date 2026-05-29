// backend/routes/auth.js — VERSION COMPLÈTE
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const { protect } = require('../middleware/auth');
const { sendWelcomeEmail, sendResetPasswordEmail, sendPasswordChangedEmail } = require('../utils/emailService');

// ── JWT ──
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRE || '7d'
});

// ── PASSPORT GOOGLE ──
passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:  `${process.env.BACKEND_URL}/api/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });
    if (user) {
      if (!user.avatar && profile.photos[0]?.value) {
        user.avatar = profile.photos[0].value;
        await user.save();
      }
      return done(null, user);
    }
    const baseName = profile.displayName.toLowerCase().replace(/\s+/g, '').slice(0, 15);
    let username = baseName;
    let count = 0;
    while (await User.findOne({ username })) { count++; username = `${baseName}${count}`; }

    user = await User.create({
      prenom:   profile.name.givenName || profile.displayName.split(' ')[0],
      nom:      profile.name.familyName || profile.displayName.split(' ')[1] || '',
      email:    profile.emails[0].value,
      username,
      password: Math.random().toString(36).slice(-12) + 'Aa1!',
      avatar:   profile.photos[0]?.value || '',
      isVerified: true,
    });
    await Portfolio.create({ user: user._id });

    // Email de bienvenue
    try { await sendWelcomeEmail(user); } catch (e) { console.error('Email erreur:', e.message); }

    return done(null, user);
  } catch (err) { return done(err, null); }
}));

// ── POST /api/auth/register ──
router.post('/register', async (req, res) => {
  try {
    const { prenom, nom, email, username, password } = req.body;
    if (!prenom || !nom || !email || !username || !password)
      return res.status(400).json({ success: false, message: 'Tous les champs sont requis' });

    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' });

    if (await User.findOne({ username: username.toLowerCase() }))
      return res.status(400).json({ success: false, message: "Ce nom d'utilisateur est déjà pris" });

    const user = await User.create({ prenom, nom, email, username: username.toLowerCase(), password });
    await Portfolio.create({ user: user._id });

    // Email de bienvenue
    try { await sendWelcomeEmail(user); } catch (e) { console.error('Email erreur:', e.message); }

    const token = generateToken(user._id);
    res.status(201).json({
      success: true, token,
      user: { id: user._id, prenom: user.prenom, nom: user.nom, email: user.email, username: user.username }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/auth/login ──
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });

    const token = generateToken(user._id);
    res.json({
      success: true, token,
      user: { id: user._id, prenom: user.prenom, nom: user.nom, email: user.email, username: user.username }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/auth/me ──
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// ── POST /api/auth/check-username ──
router.post('/check-username', async (req, res) => {
  const { username } = req.body;
  if (!username || username.length < 3)
    return res.json({ available: false, message: 'Minimum 3 caractères' });
  const exists = await User.findOne({ username: username.toLowerCase() });
  res.json({ available: !exists, message: exists ? 'Nom déjà pris' : 'Disponible !' });
});

// ── POST /api/auth/forgot-password ──
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: 'Aucun compte avec cet email' });

    // Génère un token de reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 heure
    await user.save();

    await sendResetPasswordEmail(user, resetToken);
    res.json({ success: true, message: 'Email de réinitialisation envoyé !' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/auth/reset-password ──
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user)
      return res.status(400).json({ success: false, message: 'Token invalide ou expiré' });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    await sendPasswordChangedEmail(user);

    const jwtToken = generateToken(user._id);
    res.json({ success: true, message: 'Mot de passe modifié avec succès !', token: jwtToken });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GOOGLE OAUTH ──
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/auth?error=google` }),
  (req, res) => {
    const token = generateToken(req.user._id);
    const user = {
      id: req.user._id, prenom: req.user.prenom, nom: req.user.nom,
      email: req.user.email, username: req.user.username,
      avatar: req.user.avatar, template: req.user.template,
    };
    const params = new URLSearchParams({ token, user: JSON.stringify(user) });
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?${params}`);
  }
);

module.exports = router;
