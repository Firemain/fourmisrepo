# Fourmis Web App

Application web de dashboard pour la plateforme Fourmis.

## Fonctionnalités

- 🔐 **Authentification** : Login/Register (UI prête, auth Supabase à implémenter)
- 🎯 **Dashboard adaptatif** : Interface qui s'adapte selon le rôle utilisateur
- 👥 **3 types de rôles** :
  - **Étudiant** : Voir missions, s'inscrire, suivre ses points
  - **Association** : Créer missions, gérer inscriptions, voir stats
  - **École** : Gérer associations, valider missions, statistiques globales
  - **Admin** : Accès complet à toutes les fonctionnalités

## Structure

```
app/
├── login/page.tsx          # Page de connexion/inscription
├── dashboard/
│   ├── layout.tsx          # Layout avec sidebar adaptative
│   ├── page.tsx            # Dashboard principal
│   ├── missions/           # Liste et gestion des missions
│   ├── registrations/      # Inscriptions (étudiant)
│   ├── points/             # Points et progression (étudiant)
│   ├── stats/              # Statistiques (asso/école)
│   ├── associations/       # Gestion associations (école)
│   └── settings/           # Paramètres du compte

components/
└── layout/
    └── Sidebar.tsx         # Navigation principale avec filtrage par rôle
```

## Développement

```bash
pnpm dev:web
```

L'app tourne sur http://localhost:3001

## À faire

- [ ] Implémenter l'authentification Supabase
- [ ] Créer middleware pour protéger les routes par rôle
- [ ] Connecter les pages au backend Prisma
- [ ] Ajouter TanStack Query pour la gestion des données
