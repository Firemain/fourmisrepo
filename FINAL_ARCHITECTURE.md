# ✅ Architecture finale - Un seul projet

## Structure apps/web

```
apps/web/
├── app/
│   ├── layout.tsx              → Layout racine (HTML, AuthProvider)
│   ├── page.tsx                → Page d'accueil (site vitrine) "/"
│   ├── contact/                → Page contact "/contact"
│   ├── mentions-legales/       → Mentions légales "/mentions-legales"
│   │
│   ├── app/                    → Groupe de routes pour l'app "/app/*"
│   │   ├── layout.tsx          → Layout app (optionnel)
│   │   ├── login/              → "/app/login"
│   │   │   └── page.tsx
│   │   ├── dashboard/          → "/app/dashboard"
│   │   │   └── page.tsx
│   │   └── missions/           → "/app/missions"  
│   │       └── page.tsx
│   │
│   └── api/                    → Routes API
│       ├── auth/
│       └── health/
│
├── components/
│   ├── ui/                     → shadcn/ui components
│   └── marketing/              → Composants site vitrine
│
├── lib/
│   ├── auth/                   → AuthContext, helpers
│   └── supabase/               → Supabase clients
│
└── proxy.ts                    → Middleware Next.js 15+
```

## Routes finales

### Site vitrine (public)
- `/` - Page d'accueil avec hero, stats, CTA
- `/contact` - Formulaire de contact
- `/mentions-legales` - Mentions légales

### Application (authentifiée)
- `/app/login` - Connexion/Inscription
- `/app/dashboard` - Dashboard principal
- `/app/missions` - Liste des missions
- `/app/profile` - Profil utilisateur

## Déploiement Vercel

**Un seul projet** :
- Domaine : `fourmis.com`
- Toutes les routes sous le même domaine
- `fourmis.com` → Site vitrine
- `fourmis.com/app/login` → Application

## Avantages

✅ **Simplicité maximale**
- Un seul projet Next.js
- Un seul déploiement
- Pas de rewrites complexes

✅ **Performance**
- Pas de proxy entre les apps
- Cookies partagés automatiquement
- SSR optimal

✅ **SEO**
- Tout sous le même domaine
- Navigation fluide
- Pas de redirections

## Migration en cours

apps/site → apps/web (fusionné)
- ✅ Structure créée
- ✅ Layout racine avec AuthProvider
- ✅ Page d'accueil (/) créée
- ✅ Pages app/login et app/dashboard créées
- 🔄 Correction de la 404 en cours
