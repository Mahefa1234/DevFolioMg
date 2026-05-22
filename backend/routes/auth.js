const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const { protect } = require('../middleware/auth');

// ── Générer JWT ──
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// ── POST /api/auth/register ──
router.post('/register', async (req, res) => {
  try {
    const { prenom, nom, email, username, password } = req.body;

    if (!prenom || !nom || !email || !username || !password) {
      return res.status(400).json({ success: false, message: 'Tous les champs sont requis' });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé' });

    const usernameExists = await User.findOne({ username: username.toLowerCase() });
    if (usernameExists) return res.status(400).json({ success: false, message: 'Ce nom d\'utilisateur est déjà pris' });

    const user = await User.create({ prenom, nom, email, username: username.toLowerCase(), password });

    // Créer portfolio vide
    await Portfolio.create({ user: user._id });

    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
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
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
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
  if (!username || username.length < 3) return res.json({ available: false, message: 'Minimum 3 caractères' });
  const exists = await User.findOne({ username: username.toLowerCase() });
  res.json({ available: !exists, message: exists ? 'Nom déjà pris' : 'Disponible !' });
});

module.exports = router;
