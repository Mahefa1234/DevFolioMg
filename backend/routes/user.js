const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ── PUT /api/user/profile — modifier profil ──
router.put('/profile', protect, async (req, res) => {
  try {
    const { prenom, nom, template, isPublic } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { prenom, nom, template, isPublic },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/user/password — changer mot de passe ──
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Mot de passe actuel incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Mot de passe modifié avec succès' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/user/avatar — upload photo ──
router.post('/avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Aucun fichier fourni' });

    // Supprimer ancien avatar si existe
    if (req.user.avatarPublicId) {
      await cloudinary.uploader.destroy(req.user.avatarPublicId);
    }

    // Upload vers Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'devfoliomg/avatars', transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }] },
        (error, result) => error ? reject(error) : resolve(result)
      ).end(req.file.buffer);
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: result.secure_url, avatarPublicId: result.public_id },
      { new: true }
    );

    res.json({ success: true, avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
