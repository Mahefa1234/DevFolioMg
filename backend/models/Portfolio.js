const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  titre: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  image: { type: String, default: '' },
  imagePublicId: { type: String, default: '' },
  lien: { type: String, default: '' },
  github: { type: String, default: '' },
  technologies: [{ type: String }],
  ordre: { type: Number, default: 0 }
});

const ExperienceSchema = new mongoose.Schema({
  poste: { type: String, required: true },
  entreprise: { type: String, required: true },
  lieu: { type: String },
  dateDebut: { type: String, required: true },
  dateFin: { type: String, default: 'Présent' },
  enCours: { type: Boolean, default: false },
  description: { type: String },
  ordre: { type: Number, default: 0 }
});

const CompetenceSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  niveau: { type: Number, min: 1, max: 100, default: 80 },
  categorie: { type: String, default: 'Autre' }
});

const PortfolioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  titre: { type: String, default: '' },
  bio: { type: String, default: '', maxlength: 500 },
  disponible: { type: Boolean, default: true },
  telephone: { type: String, default: '' },
  ville: { type: String, default: '' },
  pays: { type: String, default: 'Madagascar' },
  linkedin: { type: String, default: '' },
  github: { type: String, default: '' },
  facebook: { type: String, default: '' },
  siteWeb: { type: String, default: '' },
  projets: [ProjectSchema],
  experiences: [ExperienceSchema],
  competences: [CompetenceSchema],
  vues: { type: Number, default: 0 },
  vuesMois: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', PortfolioSchema);
