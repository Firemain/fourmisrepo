# 🚀 Guide de déploiement Vercel - Fourmis

## Architecture de déploiement

```
fourmis.com              → Site vitrine (apps/site)
fourmis.com/app/*        → Web app (apps/web) via rewrite
```

## Option 1 : Un seul projet Vercel avec rewrites (Recommandé)

### 1. Créer un projet Vercel pour le site vitrine

```bash
cd apps/site
vercel
```

**Configuration** :
- Project Name: `fourmis`
- Framework: Next.js
- Root Directory: `apps/site`
- Build Command: `cd ../.. && pnpm turbo run build --filter=@fourmis/site`
- Output Directory: `.next`
- Install Command: `pnpm install`

### 2. Ajouter les variables d'environnement (Production)

Dans Vercel Dashboard → Settings → Environment Variables :

**Pour le site (fourmis) :**
```
NEXT_PUBLIC_WEB_APP_URL=/app
```

**Pour la web app (fourmis-app) :**
```
NEXT_PUBLIC_SUPABASE_URL=https://sifvyuubkunropeqtroh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clef-anon
DATABASE_URL=votre-database-url
DIRECT_URL=votre-direct-url
NEXT_PUBLIC_SITE_URL=https://fourmis.com
```

### 3. Configurer le domaine

**Site vitrine (fourmis)** :
- Domain: `fourmis.com`
- Domain: `www.fourmis.com` (optionnel)

**Web app (fourmis-app)** :
- Domain: `app.fourmis.com` (domaine temporaire)

### 4. Configurer les rewrites

Dans `vercel.json` à la racine du site vitrine :

```json
{
  "rewrites": [
    {
      "source": "/app/:path*",
      "destination": "https://app.fourmis.com/:path*"
    }
  ]
}
```

## Option 2 : Deux sous-domaines séparés (Plus simple)

### Structure
```
fourmis.com       → Site vitrine
app.fourmis.com   → Web app
```

### Avantages
- ✅ Plus simple à configurer
- ✅ Pas de rewrites complexes
- ✅ Meilleure séparation des concerns
- ✅ Plus facile à scaler indépendamment

### Configuration

**1. Site vitrine**
```bash
cd apps/site
vercel --prod
```
- Domain: `fourmis.com`, `www.fourmis.com`

**2. Web app**
```bash
cd apps/web
vercel --prod
```
- Domain: `app.fourmis.com`

**3. Variables d'environnement**

Site vitrine :
```
NEXT_PUBLIC_WEB_APP_URL=https://app.fourmis.com
```

Web app :
```
NEXT_PUBLIC_SITE_URL=https://fourmis.com
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
DATABASE_URL=...
DIRECT_URL=...
```

## Option 3 : Vercel Monorepo (Le plus clean)

### Configuration avec Turborepo

**1. Créer `vercel.json` à la racine du monorepo**

```json
{
  "buildCommand": "pnpm turbo run build",
  "outputDirectory": "apps/site/.next",
  "installCommand": "pnpm install"
}
```

**2. Configurer chaque app**

Dans `turbo.json` :
```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    }
  }
}
```

**3. Déployer depuis la racine**

```bash
vercel
```

Vercel détectera automatiquement le monorepo et proposera de créer un projet par app.

## Configuration DNS (pour fourmis.com/app)

Si tu veux vraiment `fourmis.com/app` (même domaine), tu dois :

### 1. Déployer les deux apps séparément
```
Site : fourmis-site.vercel.app
App  : fourmis-app.vercel.app
```

### 2. Configurer le domaine principal sur le site
```
fourmis.com → fourmis-site.vercel.app
```

### 3. Ajouter un rewrite dans le site

`apps/site/vercel.json` :
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

### 4. Configurer les variables d'environnement

Site (`apps/site/.env.production`) :
```
NEXT_PUBLIC_WEB_APP_URL=/app
```

Web app (`apps/web/.env.production`) :
```
NEXT_PUBLIC_SITE_URL=https://fourmis.com
```

## Recommandation finale 🎯

**Pour un MVP rapide** : Option 2 (sous-domaines)
- `fourmis.com` → Site vitrine
- `app.fourmis.com` → Web app

**Pourquoi ?**
- ✅ Configuration Vercel en 5 minutes
- ✅ Pas de rewrites complexes
- ✅ Chaque app est indépendante
- ✅ Plus facile à débugger
- ✅ Meilleure performance (pas de proxy)

**Pour une architecture pro** : Option 3 (Monorepo Vercel)
- Tout est géré par Turborepo
- Déploiement atomique
- Partage de packages optimisé

## Commandes de déploiement

### Développement local
```bash
# Site vitrine
pnpm dev:site

# Web app
pnpm dev:web

# Les deux en même temps
pnpm dev:site & pnpm dev:web
```

### Déploiement Vercel

**Premier déploiement** :
```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer le site
cd apps/site
vercel

# Déployer la web app
cd apps/web
vercel
```

**Déploiements suivants** :
```bash
# Production
vercel --prod

# Preview (branch)
vercel
```

## Configuration des domaines dans Vercel

### 1. Acheter le domaine
- Chez OVH, Namecheap, Google Domains, etc.

### 2. Ajouter le domaine dans Vercel
1. Aller sur le projet → Settings → Domains
2. Ajouter `fourmis.com`
3. Ajouter `app.fourmis.com`

### 3. Configurer les DNS
Chez ton registrar, ajouter ces enregistrements :

```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
CNAME   app     cname.vercel-dns.com
```

### 4. Attendre la propagation DNS (5-30 min)

## Checklist avant production

- [ ] Variables d'environnement configurées dans Vercel
- [ ] Domaines ajoutés et DNS configurés
- [ ] SSL/HTTPS activé automatiquement par Vercel
- [ ] Supabase configuré avec les bons callback URLs
- [ ] Build réussi en local (`pnpm build`)
- [ ] Tests d'authentification en staging
- [ ] Analytics configurés (optionnel)

## Callbacks Supabase à configurer

Dans Supabase Dashboard → Authentication → URL Configuration :

**Site URL** :
```
https://fourmis.com
```

**Redirect URLs** :
```
https://fourmis.com/app/auth/callback
https://app.fourmis.com/auth/callback
http://localhost:3001/auth/callback
```

---

**Tu es prêt à déployer ! 🚀**
