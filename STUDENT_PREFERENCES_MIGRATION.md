# Migration Student Preferences - Guide de Déploiement

## 📋 Résumé
Cette migration ajoute la table `student_preferences` pour stocker les préférences des étudiants et alimenter l'algorithme de Machine Learning pour les recommandations de missions.

## 🗄️ Structure de la table

```sql
student_preferences
├── id (UUID, PRIMARY KEY)
├── user_id (UUID, FK → auth.users)
├── user_profile_id (UUID, FK → user_profiles)
├── interests (TEXT[]) - Domaines d'intérêt
├── availability (TEXT) - Disponibilité hebdomadaire
├── group_size (TEXT) - Préférence de taille de groupe
├── mission_swipes (JSONB) - Historique des swipes
├── completed_at (TIMESTAMP) - Date de completion du questionnaire
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## 🚀 Étapes de déploiement

### Option 1 : Via Supabase Dashboard (Recommandé)

1. **Ouvrir le SQL Editor** de Supabase
   - Aller sur https://supabase.com/dashboard
   - Sélectionner votre projet
   - Cliquer sur "SQL Editor" dans le menu latéral

2. **Exécuter la migration**
   - Copier le contenu de `supabase/migrations/20250110_student_preferences.sql`
   - Coller dans l'éditeur SQL
   - Cliquer sur "Run" pour exécuter

3. **Vérifier la création**
   ```sql
   -- Vérifier que la table existe
   SELECT * FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'student_preferences';

   -- Vérifier les policies RLS
   SELECT * FROM pg_policies 
   WHERE tablename = 'student_preferences';
   ```

### Option 2 : Via CLI Supabase

```bash
# Si vous avez Supabase CLI installé
cd C:\Users\87fug\Documents\fourmis
supabase migration up
```

### Option 3 : Exécution manuelle du SQL

Copiez et collez ce SQL dans le SQL Editor :

```sql
-- Copier le contenu complet de:
-- supabase/migrations/20250110_student_preferences.sql
```

## 📊 Données d'exemple (Optionnel)

Pour tester, vous pouvez insérer des données d'exemple :

```sql
-- Exemple de préférences étudiant
INSERT INTO public.student_preferences (
    user_id,
    user_profile_id,
    interests,
    availability,
    group_size,
    mission_swipes,
    completed_at
) VALUES (
    'YOUR-USER-ID-HERE'::uuid,
    'YOUR-USER-PROFILE-ID-HERE'::uuid,
    ARRAY['Éducation', 'Sport', 'Technologie'],
    '3-5h par semaine',
    'En petit groupe (2-5 personnes)',
    '[
        {"missionId": "mission-1", "liked": true, "timestamp": "2025-01-10T10:00:00Z"},
        {"missionId": "mission-2", "liked": false, "timestamp": "2025-01-10T10:05:00Z"}
    ]'::jsonb,
    NOW()
);
```

## 🔒 Sécurité (RLS)

Les policies Row Level Security sont automatiquement créées :

✅ **Students can view their own preferences** - SELECT  
✅ **Students can insert their own preferences** - INSERT  
✅ **Students can update their own preferences** - UPDATE  
✅ **Students can delete their own preferences** - DELETE  
✅ **Admins can view all preferences** - SELECT (avec rôle ADMIN)

## 🔍 Vérifications post-déploiement

### 1. Vérifier la table
```sql
\d public.student_preferences
```

### 2. Vérifier les index
```sql
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'student_preferences';
```

### 3. Vérifier les triggers
```sql
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'student_preferences';
```

### 4. Tester l'insertion
```sql
-- En tant qu'étudiant connecté
INSERT INTO public.student_preferences (
    user_id,
    user_profile_id,
    interests
) VALUES (
    auth.uid(),
    (SELECT id FROM user_profiles WHERE user_id = auth.uid()),
    ARRAY['Test']
);
```

## 📱 Utilisation dans l'application

### Frontend (React/Next.js)

```typescript
import { supabase } from '@/lib/supabase/client';

// Sauvegarder les préférences
const savePreferences = async (preferences: StudentPreferences) => {
  const { data, error } = await supabase
    .from('student_preferences')
    .upsert({
      user_id: user.id,
      user_profile_id: userProfile.id,
      interests: preferences.interests,
      availability: preferences.availability,
      group_size: preferences.groupSize,
      mission_swipes: preferences.missionSwipes,
      completed_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id'
    });
    
  return { data, error };
};

// Récupérer les préférences
const getPreferences = async (userId: string) => {
  const { data, error } = await supabase
    .from('student_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();
    
  return { data, error };
};
```

## 🤖 Machine Learning - Structure des données

### Format des données pour l'algorithme

```json
{
  "user_id": "uuid",
  "interests": ["Éducation", "Sport"],
  "availability": "3-5h par semaine",
  "group_size": "En petit groupe",
  "mission_swipes": [
    {
      "missionId": "mission-uuid-1",
      "liked": true,
      "timestamp": "2025-01-10T10:00:00Z"
    },
    {
      "missionId": "mission-uuid-2", 
      "liked": false,
      "timestamp": "2025-01-10T10:05:00Z"
    }
  ]
}
```

### Encodage pour ML

```python
# Exemple d'encodage pour TensorFlow/PyTorch

# Interests → One-hot encoding
interests_categories = ['Éducation', 'Environnement', 'Sport', 'Culture', 'Solidarité', 'Technologie']

# Availability → Ordinal encoding
availability_levels = {
    '1-2h par semaine': 1,
    '3-5h par semaine': 2,
    '6-10h par semaine': 3,
    'Plus de 10h par semaine': 4
}

# Group size → One-hot encoding
group_sizes = ['Seul(e)', 'En petit groupe', 'En grand groupe', 'Peu importe']

# Mission swipes → Collaborative filtering matrix
# User × Mission → {-1: disliked, 0: not seen, 1: liked}
```

## 🔄 Rollback (si nécessaire)

En cas de problème, pour supprimer la table :

```sql
-- ⚠️ ATTENTION : Ceci supprimera toutes les données !
DROP TABLE IF EXISTS public.student_preferences CASCADE;
DROP FUNCTION IF EXISTS update_student_preferences_updated_at();
```

## ✅ Checklist finale

- [ ] Migration SQL exécutée sans erreur
- [ ] Table visible dans Supabase Dashboard
- [ ] Policies RLS activées
- [ ] Index créés
- [ ] Trigger updated_at fonctionnel
- [ ] Test d'insertion/lecture réussi
- [ ] Frontend connecté à la table
- [ ] Schéma Prisma mis à jour (`pnpm db:generate` si nécessaire)

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifier les logs Supabase (Dashboard → Logs)
2. Vérifier les permissions RLS
3. Tester les requêtes SQL manuellement
4. Vérifier que auth.uid() retourne bien l'utilisateur connecté

---

**Date de création** : 10 janvier 2025  
**Fichiers modifiés** :
- `packages/prisma/schema.prisma`
- `supabase/migrations/20250110_student_preferences.sql`
- `apps/web/app/dashboard/missions/page.tsx`
