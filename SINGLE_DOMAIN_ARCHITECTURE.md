# 🎯 Architecture simplifiée - Un seul domaine

## Structure finale

```
fourmis.com/              → Page d'accueil (site vitrine)
fourmis.com/contact       → Contact
fourmis.com/app/login     → Connexion/Inscription
fourmis.com/app/dashboard → Dashboard
fourmis.com/app/missions  → Missions
```

## Solution : Fusionner dans apps/web

On va utiliser **apps/web** comme projet principal et y ajouter les pages du site vitrine.

### Structure des dossiers

```
apps/web/
├── app/
│   ├── [locale]/           # Routes i18n (existant)
│   │   ├── login/
│   │   ├── dashboard/
│   │   └── ...
│   ├── (marketing)/        # Groupe de routes pour le site vitrine
│   │   ├── page.tsx        # Page d'accueil (/)
│   │   ├── contact/
│   │   └── mentions-legales/
│   └── layout.tsx
├── components/
│   ├── marketing/          # Composants du site vitrine
│   │   ├── HeroSection.tsx
│   │   ├── Header.tsx
│   │   └── ...
│   └── ui/                 # Composants shadcn
└── ...
```

## Avantages de cette approche

✅ **Un seul domaine** : `fourmis.com` pour tout
✅ **Un seul projet Vercel** : Déploiement simplifié
✅ **Un seul build** : Plus rapide, moins de config
✅ **Cookies partagés** : Auth fonctionne partout
✅ **Pas de rewrites** : Pas de complexité réseau
✅ **SEO optimal** : Tout sous le même domaine

## Migration à faire

1. **Copier les composants du site vitrine dans apps/web**
   ```
   apps/site/components/ → apps/web/components/marketing/
   ```

2. **Créer le groupe de routes (marketing)**
   ```
   apps/web/app/(marketing)/
   ```

3. **Déplacer les pages du site**
   ```
   apps/site/app/page.tsx → apps/web/app/(marketing)/page.tsx
   apps/site/app/contact/ → apps/web/app/(marketing)/contact/
   ```

4. **Supprimer apps/site** (optionnel, on peut garder pour référence)

## Routes finales

### Site vitrine (publiques)
- `/` - Page d'accueil avec hero
- `/contact` - Contact
- `/mentions-legales` - Mentions légales

### Web app (authentifiées)
- `/app/login` - Connexion (actuellement `/[locale]/login`)
- `/app/dashboard` - Dashboard
- `/app/missions` - Missions
- `/app/profile` - Profil

### API
- `/api/auth/*` - Routes d'authentification
- `/api/health` - Health check

## Étapes de migration

Je vais créer la structure maintenant ?
