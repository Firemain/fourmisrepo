# Structure de la page Missions (Mode Server/Client Components)

## Architecture

Cette page utilise le pattern **Server Components** + **Client Components** de Next.js 15.

### Fichiers

#### `page.tsx` (Server Component)
- **Rôle** : Fetch les données côté serveur
- **Responsabilités** :
  - Vérifier l'authentification (`supabase.auth.getUser()`)
  - Récupérer le profil utilisateur
  - Récupérer l'association member
  - Fetch toutes les missions de l'association
  - Passer les données aux Client Components

#### `_components/MissionsClient.tsx` (Client Component)
- **Rôle** : Interface utilisateur interactive
- **Responsabilités** :
  - Afficher le header et les stats
  - Gérer le filtrage par statut et recherche
  - Afficher le tableau des missions
  - Ouvrir le modal de création
  - Utiliser `router.refresh()` pour recharger les données après création

#### `_components/CreateMissionModal.tsx` (Client Component)
- **Rôle** : Modal de création de mission
- **Responsabilités** :
  - Charger les membres de l'association
  - Gérer le formulaire avec Zod validation (futur)
  - Soumettre les données via Supabase client
  - Appeler `onSuccess()` pour trigger un refresh

## Flux de données

```
1. Server: page.tsx
   ↓ Fetch missions from Supabase
   ↓ Pass data as props

2. Client: MissionsClient.tsx
   ↓ Display data
   ↓ User clicks "Créer une mission"
   
3. Client: CreateMissionModal.tsx
   ↓ User fills form
   ↓ Submit to Supabase
   ↓ Call onSuccess()
   
4. Client: MissionsClient.tsx
   ↓ router.refresh()
   ↓ Re-fetch data on server
   ↓ Re-render with new data
```

## Avantages de cette architecture

✅ **SEO-friendly** : Les missions sont render côté serveur
✅ **Performance** : Data fetching parallèle avec Suspense (futur)
✅ **Type-safe** : Props typés entre Server et Client
✅ **Sécurité** : Pas de clés API exposées côté client pour le fetch initial
✅ **UX** : Interactivité client-side (filtres, modals)
✅ **Simplicité** : Pas de gestion d'état complexe (useQuery, etc.)

## Prochaines améliorations

- [ ] Ajouter Suspense avec loading.tsx
- [ ] Créer un component MissionCard réutilisable
- [ ] Ajouter la validation Zod dans le formulaire
- [ ] Implémenter l'édition de mission
- [ ] Implémenter la suppression de mission
- [ ] Ajouter Server Actions pour les mutations
