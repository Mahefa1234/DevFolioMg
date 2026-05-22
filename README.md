# DevFolioMG 🇲🇬

Générateur de portfolios pour développeurs malgaches.
**Stack :** React + Vite + Tailwind (frontend) · Node.js + Express + MongoDB (backend)

---

## 📁 Structure

```
devfoliomg/
├── frontend/          ← React + Vite + Tailwind
│   └── src/
│       ├── api/          ← Axios + appels API
│       ├── context/      ← AuthContext (JWT)
│       ├── pages/        ← LandingPage, AuthPage, Dashboard, PublicPortfolio
│       └── App.jsx       ← Routing React Router v6
│
└── backend/           ← Node.js + Express + MongoDB
    ├── models/           ← User.js, Portfolio.js
    ├── routes/           ← auth.js, portfolio.js, user.js
    ├── middleware/       ← auth.js (JWT protect)
    └── server.js
```

---

## 🚀 Installation

### 1. Backend
```bash
cd backend
cp .env.example .env
# Remplis ton .env avec tes clés MongoDB, Cloudinary, etc.
npm install
npm run dev
# → http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## 🔌 API Endpoints

### Auth
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | /api/auth/register | Inscription |
| POST | /api/auth/login | Connexion |
| GET  | /api/auth/me | Profil connecté |
| POST | /api/auth/check-username | Vérifier disponibilité |

### Portfolio
| Méthode | Route | Description |
|---------|-------|-------------|
| GET  | /api/portfolio/me | Mon portfolio |
| PUT  | /api/portfolio/me | Modifier infos |
| POST | /api/portfolio/projet | Ajouter projet |
| PUT  | /api/portfolio/projet/:id | Modifier projet |
| DELETE | /api/portfolio/projet/:id | Supprimer projet |
| POST | /api/portfolio/experience | Ajouter expérience |
| DELETE | /api/portfolio/experience/:id | Supprimer expérience |
| POST | /api/portfolio/competence | Ajouter compétence |
| DELETE | /api/portfolio/competence/:id | Supprimer compétence |
| GET  | /api/portfolio/:username | Portfolio public |

### User
| Méthode | Route | Description |
|---------|-------|-------------|
| PUT | /api/user/profile | Modifier profil |
| PUT | /api/user/password | Changer mot de passe |
| POST | /api/user/avatar | Upload photo |

---

## 📄 Pages React

| Route | Page | Accès |
|-------|------|-------|
| / | LandingPage | Public |
| /auth | AuthPage | Public (redirige si connecté) |
| /dashboard | Dashboard | Privé (JWT requis) |
| /p/:username | PublicPortfolio | Public |
| * | NotFound | Public |

---

## 🛠️ Prochaines étapes

- [ ] Dashboard complet (projets, expériences, compétences)
- [ ] PublicPortfolio (3 templates)
- [ ] Export PDF CV
- [ ] Upload photo Cloudinary
- [ ] Statistiques de visites

---

🇲🇬 **Fait à Madagascar** · DevFolioMG 2025
