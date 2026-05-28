// routes/auth.js — VERSION COMPLÈTE avec Google OAuth
// Remplace ton fichier backend/routes/auth.js par celui-ci

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const { protect } = require('../middleware/auth');

// ── JWT ──
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRE || '7d'
});

// ── PASSPORT GOOGLE ──
passport.use(new GoogleStrategy({
  clientID:     process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL:  process.env.GOOGLE_CALLBACK_URL || `${process.env.BACKEND_URL}/api/auth/google/callback`,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Cherche si l'utilisateur existe déjà
    let user = await User.findOne({ email: profile.emails[0].value });

    if (user) {
      // Met à jour l'avatar si pas encore défini
      if (!user.avatar && profile.photos[0]?.value) {
        user.avatar = profile.photos[0].value;
        await user.save();
      }
      return done(null, user);
    }

    // Crée un nouveau username unique depuis le nom Google
    const baseName = profile.displayName.toLowerCase().replace(/\s+/g, '').slice(0, 15);
    let username = baseName;
    let count = 0;
    while (await User.findOne({ username })) {
      count++;
      username = `${baseName}${count}`;
    }

    // Crée le nouvel utilisateur
    user = await User.create({
      prenom:   profile.name.givenName || profile.displayName.split(' ')[0],
      nom:      profile.name.familyName || profile.displayName.split(' ')[1] || '',
      email:    profile.emails[0].value,
      username,
      password: Math.random().toString(36).slice(-12) + 'Aa1!', // password aléatoire
      avatar:   profile.photos[0]?.value || '',
      isVerified: true,
    });

    // Crée portfolio vide
    await Portfolio.create({ user: user._id });

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// ── ROUTES CLASSIQUES ──

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { prenom, nom, email, username, password } = req.body;
    if (!prenom || !nom || !email || !username || !password)
      return res.status(400).json({ success: false, message: 'Tous les champs sont requis' });

    const emailExists = await User.findOne({ email });
    if (emailExists)
      return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' });

    const usernameExists = await User.findOne({ username: username.toLowerCase() });
    if (usernameExists)
      return res.status(400).json({ success: false, message: "Ce nom d'utilisateur est déjà pris" });

    const user = await User.create({ prenom, nom, email, username: username.toLowerCase(), password });
    await Portfolio.create({ user: user._id });

    const token = generateToken(user._id);
    res.status(201).json({
      success: true, token,
      user: { id: user._id, prenom: user.prenom, nom: user.nom, email: user.email, username: user.username }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });

    const user = await User.findOne({ email }).select('+password');
    if (!user)
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
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

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

// POST /api/auth/check-username
router.post('/check-username', async (req, res) => {
  const { username } = req.body;
  if (!username || username.length < 3)
    return res.json({ available: false, message: 'Minimum 3 caractères' });
  const exists = await User.findOne({ username: username.toLowerCase() });
  res.json({ available: !exists, message: exists ? 'Nom déjà pris' : 'Disponible !' });
});

// ── ROUTES GOOGLE OAUTH ──

// GET /api/auth/google — redirige vers Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
}));

// GET /api/auth/google/callback — Google redirige ici après auth
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/auth?error=google` }),
  (req, res) => {
    const token = generateToken(req.user._id);
    const user = {
      id: req.user._id,
      prenom: req.user.prenom,
      nom: req.user.nom,
      email: req.user.email,
      username: req.user.username,
      avatar: req.user.avatar,
      template: req.user.template,
    };
    // Redirige vers le frontend avec le token dans l'URL
    const params = new URLSearchParams({ token, user: JSON.stringify(user) });
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?${params}`);
  }
);

module.exports = router;
