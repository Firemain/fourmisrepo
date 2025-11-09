# 📋 Configuration Déploiement - fourmis.com/app

## Structure finale

```
fourmis.com          → Site vitrine (apps/site)
    ↓ rewrite
fourmis.com/app/*    → Web app (apps/web)
```

## En développement

```
localhost:3000       → Site vitrine
localhost:3001       → Web app
```

Le site redirige vers `http://localhost:3001/login`

## En production sur Vercel

### 1. Créer deux projets Vercel

**Projet 1 : Site vitrine (`fourmis`)**
- Repository: `fourmisrepo`
- Root Directory: `apps/site`
- Framework: Next.js
- Build Command: `cd ../.. && pnpm turbo run build --filter=@fourmis/site`
- Output Directory: `.next`
- Install Command: `pnpm install`

**Variables d'environnement** :
```
NEXT_PUBLIC_WEB_APP_URL=/app
```

**Domaines** :
- `fourmis.com` (principal)
- `www.fourmis.com` (optionnel)

---

**Projet 2 : Web app (`fourmis-app`)**
- Repository: `fourmisrepo`
- Root Directory: `apps/web`
- Framework: Next.js
- Build Command: `cd ../.. && pnpm turbo run build --filter=@fourmis/web`
- Output Directory: `.next`
- Install Command: `pnpm install`

**Variables d'environnement** :
```
NEXT_PUBLIC_SITE_URL=https://fourmis.com
NEXT_PUBLIC_SUPABASE_URL=https://sifvyuubkunropeqtroh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ta-clef-anon>
SUPABASE_SERVICE_ROLE_KEY=<ta-clef-service>
DATABASE_URL=<ta-database-url>
DIRECT_URL=<ta-direct-url>
```

**Domaine temporaire** :
- `fourmis-app.vercel.app` (généré automatiquement)

### 2. Configurer le rewrite dans le site

Le fichier `vercel.json` à la racine redirige `/app` vers la web app :

```json
{
  "rewrites": [
    {
      "source": "/app",
      "destination": "https://fourmis-app.vercel.app"
    },
    {
      "source": "/app/:path*",
      "destination": "https://fourmis-app.vercel.app/:path*"
    }
  ]
}
```

### 3. Configurer Supabase

Dans Supabase Dashboard → Authentication → URL Configuration :

**Site URL** :
```
https://fourmis.com
```

**Redirect URLs** :
```
https://fourmis.com/app/auth/callback
https://fourmis.com/app/*
http://localhost:3001/*
http://localhost:3001/auth/callback
```

## Comment ça fonctionne ?

1. Utilisateur visite `fourmis.com` → Voit le site vitrine
2. Clique sur "Se connecter" → Redirigé vers `/app/login`
3. Vercel rewrite : `/app/*` → `fourmis-app.vercel.app/*`
4. L'utilisateur voit `fourmis.com/app/login` dans son navigateur
5. Mais en réalité, c'est la web app qui répond

## Avantages de cette architecture

✅ **Même domaine** : `fourmis.com` pour tout
✅ **Cookies partagés** : Pas de problème de CORS
✅ **SEO optimal** : Tout sous le même domaine
✅ **Apps indépendantes** : Déploiements séparés
✅ **Scalabilité** : Chaque app scale indépendamment

## Commandes de déploiement

### Déployer le site vitrine
```bash
cd apps/site
vercel --prod
```

### Déployer la web app
```bash
cd apps/web
vercel --prod
```

### Mettre à jour le vercel.json
Après le premier déploiement de la web app, note son URL (ex: `fourmis-app.vercel.app`) et mets à jour le `vercel.json` si nécessaire.

## Tester en local

```bash
# Terminal 1 : Site vitrine
pnpm dev:site

# Terminal 2 : Web app  
pnpm dev:web
```

Puis visite :
- http://localhost:3000 → Site vitrine
- Clique sur "Se connecter" → Redirigé vers http://localhost:3001/login

## 🚨 Important

⚠️ Le fichier `vercel.json` doit être à la racine du **site vitrine** (apps/site) sur Vercel, pas à la racine du monorepo.

**Solution** : Déplace `vercel.json` dans `apps/site/` avant le déploiement :

```bash
Move-Item vercel.json apps/site/vercel.json
```

Ou crée-le directement dans le dashboard Vercel dans Settings → General → Configuration File.
