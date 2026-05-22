const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  prenom: { type: String, required: true, trim: true },
  nom: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 8, select: false },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true, minlength: 3 },
  avatar: { type: String, default: '' },
  avatarPublicId: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  template: { type: String, default: 'minimal', enum: ['minimal', 'dark', 'forest'] },
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// ── Hash password avant sauvegarde ──
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Comparer password ──
UserSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
