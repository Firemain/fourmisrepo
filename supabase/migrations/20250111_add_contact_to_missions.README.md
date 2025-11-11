# Migration: Contact ID pour les Missions

## 📋 Description

Cette migration ajoute une colonne `contact_id` à la table `missions` pour stocker l'adresse de manière structurée via la table `contacts`, suivant le pattern utilisé par les autres entités (School, Association, etc.).

## 🎯 Objectif

Au lieu de stocker l'adresse comme un simple `String` dans la colonne `address`, on crée maintenant un enregistrement `Contact` complet avec :
- `street` (rue)
- `apartment_number` (complément d'adresse)
- `city` (ville)
- `postal_code` (code postal)
- `country` (pays)
- `phone_number` (téléphone optionnel)

## 📦 Fichiers modifiés

### 1. **Schema Prisma** (`packages/prisma/schema.prisma`)
```prisma
model Mission {
  // ...
  contactId  String?  @map("contact_id") // Nouveau champ
  address    String?  // Deprecated - conservé pour rétrocompatibilité
  // ...
  
  // Nouvelle relation
  contact    Contact? @relation(fields: [contactId], references: [id], onDelete: SetNull)
}

model Contact {
  // ...
  missions   Mission[] // Nouvelle relation inverse
}
```

### 2. **Migration SQL** (`supabase/migrations/20250111_add_contact_to_missions.sql`)
- Ajoute la colonne `contact_id` (UUID, nullable)
- Crée la contrainte de clé étrangère vers `contacts`
- Ajoute un index pour les performances

### 3. **Modal de création** (`CreateMissionModal.tsx`)
- Formulaire d'adresse complet avec champs séparés
- Crée d'abord un `Contact` puis la `Mission` avec `contact_id`

## 🚀 Déploiement

### Étape 1: Appliquer la migration Supabase

1. Aller sur **Supabase Dashboard** → **SQL Editor**
2. Copier le contenu de `supabase/migrations/20250111_add_contact_to_missions.sql`
3. Exécuter la requête
4. Vérifier que la colonne `contact_id` existe dans la table `missions`

```sql
-- Vérification
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'missions' AND column_name = 'contact_id';
```

### Étape 2: Redémarrer le serveur Next.js

```bash
pnpm dev:web
```

### Étape 3: Tester la création de mission

1. Se connecter en tant qu'association
2. Aller sur **Missions** → **Créer une mission**
3. Remplir le formulaire avec l'adresse complète :
   - Rue: `123 Rue de la République`
   - Complément: `Bâtiment A`
   - Ville: `Paris`
   - Code postal: `75001`
   - Pays: `France`
   - Téléphone: `+33 6 12 34 56 78` (optionnel)
4. Créer la mission
5. Vérifier dans Supabase que :
   - Un nouveau `Contact` a été créé
   - La `Mission` a un `contact_id` qui pointe vers ce contact

## 🔍 Vérifications SQL

### Voir les missions avec leur adresse

```sql
SELECT 
  m.id,
  m.title,
  m.address as old_address, -- Ancien champ (deprecated)
  c.street,
  c.apartment_number,
  c.city,
  c.postal_code,
  c.country
FROM missions m
LEFT JOIN contacts c ON m.contact_id = c.id
ORDER BY m.created_at DESC;
```

### Compter les missions avec/sans contact

```sql
SELECT 
  COUNT(*) FILTER (WHERE contact_id IS NOT NULL) as with_contact,
  COUNT(*) FILTER (WHERE contact_id IS NULL) as without_contact
FROM missions;
```

## 📝 Notes importantes

1. **Rétrocompatibilité** : La colonne `address` est conservée pour ne pas casser les missions existantes
2. **Nouvelles missions** : Utiliseront obligatoirement `contact_id`
3. **Migration des données** : Les missions existantes peuvent être migrées manuellement si besoin
4. **Suppression** : Quand un contact est supprimé, `contact_id` est mis à `NULL` (pas de suppression en cascade)

## 🔄 Rollback (si nécessaire)

```sql
-- Supprimer la colonne contact_id
ALTER TABLE missions DROP COLUMN contact_id;

-- Supprimer l'index
DROP INDEX IF EXISTS idx_missions_contact_id;
```

## ✅ Checklist de déploiement

- [ ] Migration SQL exécutée sur Supabase
- [ ] Client Prisma régénéré (`pnpm prisma generate`)
- [ ] Serveur redémarré
- [ ] Test de création de mission réussi
- [ ] Vérification des données dans Supabase
- [ ] Documentation mise à jour
