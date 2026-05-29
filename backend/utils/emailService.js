// backend/utils/emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── Template email de base ──
const emailTemplate = (content) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <style>
    body { margin:0; padding:0; background:#f6f5f0; font-family:'Helvetica Neue',Arial,sans-serif; }
    .container { max-width:560px; margin:40px auto; background:#fff; border-radius:16px; overflow:hidden; border:1px solid #e2e1d8; }
    .header { background:#1a1a14; padding:28px 36px; text-align:center; }
    .logo { color:#fff; font-size:18px; font-weight:700; letter-spacing:-0.5px; }
    .logo-dot { color:#25a058; }
    .body { padding:36px; }
    .footer { background:#f6f5f0; padding:20px 36px; text-align:center; border-top:1px solid #e2e1d8; }
    .footer p { margin:0; font-size:11px; color:#9a9a8a; }
    h2 { margin:0 0 16px; font-size:22px; color:#1a1a14; font-weight:700; }
    p { margin:0 0 14px; font-size:14px; color:#4a4a40; line-height:1.7; }
    .btn { display:inline-block; background:#1a1a14; color:#fff; text-decoration:none; padding:12px 28px; border-radius:100px; font-size:14px; font-weight:600; margin:16px 0; }
    .btn-green { background:#1d6a40; }
    .highlight { background:#e8f5ee; border:1px solid #b8ddc8; border-radius:8px; padding:12px 16px; margin:16px 0; }
    .highlight p { margin:0; color:#1d6a40; font-weight:600; font-size:13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">DevFolio<span class="logo-dot">MG</span></div>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} DevFolioMG · Le portfolio des développeurs malgaches</p>
      <p style="margin-top:4px;">🇲🇬 Fait à Madagascar</p>
    </div>
  </div>
</body>
</html>
`;

// ── Email de bienvenue ──
const sendWelcomeEmail = async (user) => {
  const content = `
    <h2>Bienvenue sur DevFolioMG, ${user.prenom} ! 🎉</h2>
    <p>Ton compte a été créé avec succès. Tu peux maintenant créer ton portfolio professionnel en quelques minutes.</p>
    <div class="highlight">
      <p>🔗 Ton lien portfolio : devfoliomg.vercel.app/p/${user.username}</p>
    </div>
    <p>Pour commencer, complète ton profil :</p>
    <ul style="color:#4a4a40;font-size:14px;line-height:2;">
      <li>📸 Ajoute ta photo de profil</li>
      <li>✍️ Rédige ta bio</li>
      <li>🚀 Ajoute tes projets</li>
      <li>💼 Ajoute tes expériences</li>
      <li>🎨 Choisis ton template</li>
    </ul>
    <a href="${process.env.FRONTEND_URL}/dashboard" class="btn btn-green">Accéder à mon dashboard →</a>
    <p style="font-size:12px;color:#9a9a8a;">Si tu n'as pas créé ce compte, ignore cet email.</p>
  `;
  await transporter.sendMail({
    from: `"DevFolioMG" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: `Bienvenue sur DevFolioMG, ${user.prenom} ! 🎉`,
    html: emailTemplate(content),
  });
};

// ── Email mot de passe oublié ──
const sendResetPasswordEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const content = `
    <h2>Réinitialisation de ton mot de passe</h2>
    <p>Tu as demandé la réinitialisation de ton mot de passe. Clique sur le bouton ci-dessous pour choisir un nouveau mot de passe.</p>
    <a href="${resetUrl}" class="btn">Réinitialiser mon mot de passe</a>
    <p>Ce lien expire dans <strong>1 heure</strong>.</p>
    <p style="font-size:12px;color:#9a9a8a;">Si tu n'as pas demandé cette réinitialisation, ignore cet email. Ton mot de passe ne sera pas modifié.</p>
  `;
  await transporter.sendMail({
    from: `"DevFolioMG" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Réinitialisation de ton mot de passe — DevFolioMG',
    html: emailTemplate(content),
  });
};

// ── Email de confirmation de réinitialisation ──
const sendPasswordChangedEmail = async (user) => {
  const content = `
    <h2>Mot de passe modifié ✅</h2>
    <p>Ton mot de passe a été modifié avec succès.</p>
    <p>Si tu n'es pas à l'origine de cette modification, contacte-nous immédiatement en répondant à cet email.</p>
    <a href="${process.env.FRONTEND_URL}/auth" class="btn">Se connecter</a>
  `;
  await transporter.sendMail({
    from: `"DevFolioMG" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Ton mot de passe a été modifié — DevFolioMG',
    html: emailTemplate(content),
  });
};

module.exports = { sendWelcomeEmail, sendResetPasswordEmail, sendPasswordChangedEmail };
