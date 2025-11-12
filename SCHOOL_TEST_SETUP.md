# 🏫 Guide de création des données de test SCHOOL

## 📋 Étapes à suivre

### 1️⃣ Exécuter le script SQL
1. Va sur **Supabase Dashboard** : https://app.supabase.com
2. Sélectionne ton projet
3. Va dans **SQL Editor** (menu de gauche)
4. Clique sur **"+ New query"**
5. Copie tout le contenu de `supabase/seed/02_school_test_data.sql`
6. Colle-le dans l'éditeur
7. Clique sur **"Run"**

✅ Cela va créer :
- 1 école (Université Paris-Saclay)
- 5 niveaux académiques (Licence 1-3, Master 1-2)
- 10 étudiants
- 1 profil admin (school@example.com) - **SANS compte auth encore**

---

### 2️⃣ Créer le compte admin dans Supabase Auth

1. Va dans **Authentication** > **Users** (menu de gauche)
2. Clique sur **"Add User"** (en haut à droite)
3. Sélectionne **"Create new user"**
4. Remplis :
   - **Email** : `school@example.com`
   - **Password** : `password123`
   - **Auto Confirm User** : ✅ **OUI** (cocher la case)
5. Clique sur **"Create user"**
6. **Copie l'UUID** de l'utilisateur créé (format : `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

---

### 3️⃣ Lier le compte auth au profil school

1. Retourne dans **SQL Editor**
2. Crée une nouvelle query
3. Colle cette commande **EN REMPLAÇANT** `YOUR_USER_ID` par l'UUID copié :

```sql
UPDATE user_profiles 
SET user_id = 'YOUR_USER_ID' 
WHERE email = 'school@example.com';
```

4. Clique sur **"Run"**

✅ Le compte est maintenant lié au profil school_admin !

---

### 4️⃣ Tester la connexion

1. Va sur ton app : http://localhost:3000/login
2. Connecte-toi avec :
   - **Email** : `school@example.com`
   - **Password** : `password123`
3. Tu seras automatiquement redirigé vers `/dashboard-school` 🎉

---

## 📊 Données créées

### École
- **Nom** : Université Paris-Saclay
- **Type** : Université
- **Adresse** : 3 Rue Joliot Curie, 91190 Gif-sur-Yvette

### Niveaux académiques
- Licence 1 (L1)
- Licence 2 (L2)
- Licence 3 (L3)
- Master 1 (M1)
- Master 2 (M2)

### Admin
- **Nom** : Directeur Paris-Saclay
- **Email** : school@example.com
- **Rôle** : SCHOOL

### Étudiants (10 total)
- 2 en Licence 1
- 2 en Licence 2
- 2 en Licence 3
- 2 en Master 1
- 2 en Master 2

### Inscriptions missions
- Si des missions existent déjà :
  - 3 étudiants inscrits (REGISTERED)
  - 2 étudiants avec missions complétées (COMPLETED)

---

## 🐛 Dépannage

### ❌ Erreur "duplicate key value violates unique constraint"
- Signifie que les données existent déjà
- Supprime d'abord les anciennes données ou change les UUIDs dans le script

### ❌ Erreur "user_id already exists"
- Un autre profil utilise déjà cet user_id
- Vérifie dans la table user_profiles :
```sql
SELECT * FROM user_profiles WHERE user_id = 'YOUR_USER_ID';
```

### ❌ Connexion impossible / Redirection vers /dashboard
- Vérifie que le user_id a bien été mis à jour :
```sql
SELECT user_id, email, role FROM user_profiles WHERE email = 'school@example.com';
```
- Vérifie que le school_admin existe :
```sql
SELECT * FROM school_admins WHERE user_profile_id IN (
  SELECT id FROM user_profiles WHERE email = 'school@example.com'
);
```

---

## 🔄 Réinitialiser les données

Pour supprimer toutes les données de test et recommencer :

```sql
-- Supprimer dans l'ordre (contraintes FK)
DELETE FROM mission_registrations WHERE school_member_id IN (
  SELECT id FROM school_members WHERE school_id = '22222222-2222-2222-2222-222222222222'
);
DELETE FROM school_members WHERE school_id = '22222222-2222-2222-2222-222222222222';
DELETE FROM school_admins WHERE school_id = '22222222-2222-2222-2222-222222222222';
DELETE FROM user_profiles WHERE email = 'school@example.com';
DELETE FROM ref_academic_levels WHERE school_id = '22222222-2222-2222-2222-222222222222';
DELETE FROM schools WHERE id = '22222222-2222-2222-2222-222222222222';

-- Supprimer les contacts (optionnel)
DELETE FROM contacts WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '44444444-4444-4444-4444-444444444444',
  '77777777-7777-7777-7777-777777777771',
  '77777777-7777-7777-7777-777777777772',
  '77777777-7777-7777-7777-777777777773',
  '77777777-7777-7777-7777-777777777774',
  '77777777-7777-7777-7777-777777777775',
  '77777777-7777-7777-7777-777777777776',
  '77777777-7777-7777-7777-777777777777',
  '77777777-7777-7777-7777-777777777778',
  '77777777-7777-7777-7777-777777777779',
  '77777777-7777-7777-7777-777777777780'
);

-- Supprimer le user dans Auth (à faire manuellement dans l'interface)
```

Puis réexécute le script depuis l'étape 1.
