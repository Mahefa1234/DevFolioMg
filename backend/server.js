const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');
const userRoutes = require('./routes/user');

const app = express();

// ── CORS — accepte toutes les origines Vercel + localhost ──
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://dev-folio-mg-front.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Autoriser les requêtes sans origine (Postman, curl)
    if (!origin) return callback(null, true);
    // Autoriser toutes les URLs vercel.app pour les previews
    if (origin.includes('vercel.app') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS non autorisé'), false);
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── ROUTES ──
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/portfolio', require('./routes/portfolio'));
app.use('/api/user',      require('./routes/user'));

// ── HEALTH CHECK ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'DevFolioMG API running 🇲🇬' });
});

// ── ERROR HANDLER ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur'
  });
});

// ── MONGODB ──
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log('✅ MongoDB connecté');
  } catch (err) {
    console.error('❌ Erreur MongoDB:', err.message);
  }
};
connectDB();

// ── EXPORT Vercel ──
module.exports = app;

// ── Local ──
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
}
//test