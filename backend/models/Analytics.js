const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  portfolioUsername: { type: String, required: true, index: true },
  portfolioUser:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ip:                { type: String, default: '' },
  pays:              { type: String, default: 'Inconnu' },
  ville:             { type: String, default: '' },
  page:              { type: String, default: '/' },
  userAgent:         { type: String, default: '' },
}, { timestamps: true });

// Index pour les requêtes fréquentes
AnalyticsSchema.index({ createdAt: -1 });
AnalyticsSchema.index({ portfolioUser: 1, createdAt: -1 });

module.exports = mongoose.model('Analytics', AnalyticsSchema);
