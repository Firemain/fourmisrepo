# @fourmis/prisma

Schéma Prisma et client de base de données pour toutes les apps Fourmis.

## Installation

Ce package est déjà installé dans le monorepo. Pour l'utiliser dans une app :

```json
{
  "dependencies": {
    "@fourmis/prisma": "workspace:*"
  }
}
```

## Configuration

1. Créer un fichier `.env` à la racine du projet :

```env
DATABASE_URL=postgresql://user:password@localhost:5432/fourmis
```

2. Générer le client Prisma :

```bash
npm run db:generate
```

3. Pousser le schéma vers la base de données :

```bash
npm run db:push
```

## Usage

```tsx
import { prisma } from "@fourmis/prisma";

// Récupérer toutes les missions
const missions = await prisma.mission.findMany({
  include: {
    association: true,
    school: true,
  },
});

// Créer une mission
const mission = await prisma.mission.create({
  data: {
    title: "Mission bénévolat",
    description: "Description de la mission",
    hours: 10,
    associationId: "uuid",
    schoolId: "uuid",
  },
});
```

## Modèles disponibles

- **Profile** : Utilisateurs (étudiants, associations, écoles, admin)
- **Mission** : Missions proposées par les associations
- **Registration** : Inscriptions des étudiants aux missions

## Scripts

- `npm run db:generate` : Générer le client Prisma
- `npm run db:push` : Pousser le schéma vers la DB
- `npm run db:migrate` : Créer une migration
- `npm run db:studio` : Ouvrir Prisma Studio
