const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');
const userRoutes = require('./routes/user');

const app = express();

// ── MIDDLEWARE ──
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── ROUTES ──
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/user', userRoutes);

// ── HEALTH CHECK ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'DevFolioMG API running' });
});

// ── ERROR HANDLER ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur'
  });
});

// ── MONGODB CONNECTION ──
mongoose.connect(process.env.MONGO_URI, {
  family: 4
})
  .then(() => {
    console.log('✅ MongoDB connecté');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`));
  })
  .catch(err => {
    console.error('❌ Erreur MongoDB:', err.message);
    process.exit(1);
  });