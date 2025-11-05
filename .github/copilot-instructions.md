# Fourmis - Instructions du projet

## Vue d'ensemble
Fourmis est une plateforme de valorisation de l'engagement étudiant qui connecte étudiants, associations et écoles.

## Architecture
- Monorepo Turborepo TypeScript
- apps/site: Site vitrine Next.js 15
- apps/web: Dashboard web Next.js 15
- apps/mobile: App mobile Expo React Native
- packages/ui: Design system partagé
- packages/lib: Logique partagée
- packages/prisma: Schéma et client Prisma
- packages/types: Types TypeScript partagés

## Stack technique
- Next.js 15 (App Router)
- Expo + React Native
- Supabase (PostgreSQL + Auth)
- Prisma ORM
- TailwindCSS + shadcn/ui
- NativeWind (mobile)
- TanStack Query
- Zod

## Palette de couleurs
- primary: #18534F
- secondary: #226D68
- background: #ECF8F6
- accent: #FEEAA1
- highlight: #D6955B

## Scripts disponibles
- `pnpm dev:site`: Lancer le site vitrine
- `pnpm dev:web`: Lancer la web app
- `pnpm dev:mobile`: Lancer l'app mobile
- `pnpm db:migrate`: Migrer la base de données
- `pnpm build`: Build toutes les apps
- `pnpm lint`: Linter le code
