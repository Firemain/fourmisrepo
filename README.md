# 🐜 Fourmis

**Plateforme de valorisation de l'engagement étudiant**

Fourmis connecte **étudiants**, **associations** et **écoles** pour faciliter l'engagement étudiant et valoriser les expériences associatives.

---

## 🏗️ Architecture

Ce projet est un **monorepo Turborepo** avec :

### 📱 Applications

- **`apps/site`** : Site vitrine public (Next.js 15)
- **`apps/web`** : Dashboard web pour écoles/associations/admin (Next.js 15)
- **`apps/mobile`** : Application mobile étudiants (Expo React Native)

### 📦 Packages partagés

- **`packages/ui`** : Design system (composants, thème, couleurs)
- **`packages/lib`** : Logique partagée (hooks, helpers, API clients)
- **`packages/prisma`** : Schéma Prisma et client de base de données
- **`packages/types`** : Types TypeScript partagés

---

## 🎨 Palette de couleurs

| Couleur    | Hex       | Usage                          |
| ---------- | --------- | ------------------------------ |
| Primary    | `#18534F` | Boutons principaux, navigation |
| Secondary  | `#226D68` | Accents secondaires            |
| Background | `#ECF8F6` | Fond général                   |
| Accent     | `#FEEAA1` | Éléments d'accentuation        |
| Highlight  | `#D6955B` | Mise en évidence               |

---

## 🚀 Démarrage rapide

### Prérequis

- Node.js >= 20
- npm >= 10
- Compte Supabase (pour la base de données et l'auth)

### Installation

```bash
# Cloner le repo
git clone https://github.com/votre-username/fourmis.git
cd fourmis

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés Supabase

# Générer le client Prisma
npm run db:generate

# Pousser le schéma Prisma vers Supabase
npm run db:push
```

### Lancer les applications

```bash
# Site vitrine (http://localhost:3000)
npm run dev:site

# Web app (http://localhost:3001)
npm run dev:web

# App mobile (Expo)
npm run dev:mobile

# Tout en même temps
npm run dev
```

---

## 📜 Scripts disponibles

| Script            | Description                              |
| ----------------- | ---------------------------------------- |
| `dev:site`        | Démarre le site vitrine                  |
| `dev:web`         | Démarre la web app                       |
| `dev:mobile`      | Démarre l'app mobile (Expo)              |
| `dev`             | Démarre toutes les apps                  |
| `build`           | Build toutes les apps                    |
| `lint`            | Lint tout le code                        |
| `format`          | Formate le code avec Prettier            |
| `db:migrate`      | Crée une migration Prisma                |
| `db:push`         | Pousse le schéma Prisma vers la DB       |
| `db:generate`     | Génère le client Prisma                  |
| `clean`           | Nettoie les dépendances et caches        |

---

## 🛠️ Stack technique

### Frontend

- **Next.js 15** (App Router)
- **React 19**
- **TailwindCSS** + **shadcn/ui**
- **Expo** + **React Native**
- **NativeWind** (Tailwind pour React Native)

### Backend

- **Supabase** (PostgreSQL + Auth + Storage)
- **Prisma ORM**
- **Next.js API Routes**

### Tooling

- **Turborepo** (monorepo)
- **TypeScript**
- **ESLint** + **Prettier**
- **TanStack Query** (gestion d'état)
- **Zod** (validation)

---

## 📂 Structure du projet

```
fourmis/
├─ apps/
│  ├─ site/          # Site vitrine public
│  ├─ web/           # Dashboard web
│  └─ mobile/        # App mobile Expo
├─ packages/
│  ├─ ui/            # Design system
│  ├─ lib/           # Logique partagée
│  ├─ prisma/        # Schéma DB
│  └─ types/         # Types partagés
├─ .github/
│  └─ copilot-instructions.md
├─ turbo.json
├─ package.json
├─ .env.example
└─ README.md
```

---

## 🗄️ Schéma de base de données

### Modèles principaux

- **`Profile`** : Utilisateurs (étudiants, assos, écoles, admin)
- **`Mission`** : Missions proposées par les associations
- **`Registration`** : Inscriptions des étudiants aux missions

### Rôles

- `student` : Étudiant
- `association` : Association
- `school` : École
- `admin` : Administrateur

---

## 🌍 Déploiement

### Site vitrine & Web app

- Hébergement : **Vercel**
- Base de données : **Supabase**

### App mobile

- Build : **Expo EAS**
- Distribution : App Store / Google Play

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Merci de :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/ma-feature`)
3. Commit (`git commit -m 'Ajout de ma feature'`)
4. Push (`git push origin feature/ma-feature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

MIT © Fourmis

---

## 🐜 Fait avec ❤️ pour valoriser l'engagement étudiant
