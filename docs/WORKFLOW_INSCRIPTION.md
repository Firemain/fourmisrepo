# 📋 Workflow d'inscription et gestion des comptes

## 🎯 Vue d'ensemble

### Principe de base
- **Inscription publique** : Étudiants uniquement (STUDENT)
- **Inscription par invitation** : Écoles (SCHOOL) et Associations (ASSOCIATION)
- **Admin plateforme** : Vous, avec accès total

---

## 🎓 Inscription ÉTUDIANT (publique)

### Processus
1. L'étudiant va sur `/login`
2. Clique sur "Créer un compte"
3. Remplit : nom complet, email, mot de passe
4. Reçoit un email de confirmation Supabase
5. Clique sur le lien dans l'email
6. Se connecte avec ses identifiants

### Données créées automatiquement
- ✅ **auth.users** (Supabase) : compte d'authentification
- ✅ **user_profiles** : profil avec `role: STUDENT`
- ⏳ **school_members** : À créer lors de l'onboarding (voir ci-dessous)

### Onboarding étudiant (après première connexion)
Lors de la première connexion au dashboard, l'étudiant doit compléter :
- **Informations personnelles** : prénom, nom
- **École** : sélection dans une liste
- **Niveau académique** : sélection selon l'école
- **Contact** : adresse, téléphone

➡️ Cela créera une ligne dans `school_members` liée à `user_profiles`

---

## 🏫 Inscription ÉCOLE (par invitation)

### Option A : Via interface admin (à créer)
1. Vous allez sur `/admin/schools` (page à créer)
2. Cliquez sur "Inviter une école"
3. Remplissez :
   - Nom de l'école
   - Type (PRIMARY, SECONDARY, HIGH_SCHOOL, UNIVERSITY)
   - Nom/prénom de l'admin école
   - Email de l'admin école
   - Adresse complète
4. Le système :
   - Crée la ligne `schools`
   - Crée la ligne `school_admins`
   - Crée la ligne `contacts`
   - **Envoie un email d'invitation** avec lien d'activation

### Option B : Via Supabase directement (temporaire)
1. Vous allez dans Supabase Dashboard > SQL Editor
2. Exécutez :
```sql
-- 1. Créer le contact
INSERT INTO contacts (id, country, city, postal_code, street)
VALUES (gen_random_uuid(), 'France', 'Paris', '75001', '1 rue de l''École')
RETURNING id; -- Notez cet ID

-- 2. Créer l'école
INSERT INTO schools (id, name, contact_id, type, status)
VALUES (gen_random_uuid(), 'École Example', '<ID_DU_CONTACT>', 'UNIVERSITY', 'ACTIVE')
RETURNING id; -- Notez cet ID

-- 3. Créer l'admin école
INSERT INTO school_admins (id, school_id, first_name, last_name, contact_id, email)
VALUES (
  gen_random_uuid(),
  '<ID_DE_L_ECOLE>',
  'Jean',
  'Dupont',
  '<ID_DU_CONTACT>',
  'jean.dupont@ecole.fr'
);

-- 4. Inviter via Supabase Auth
-- Aller dans Authentication > Users > Invite user
-- Email: jean.dupont@ecole.fr
-- Envoyer l'invitation
```

3. L'admin école reçoit l'email d'invitation Supabase
4. Il clique, définit son mot de passe
5. **Il faut alors lier manuellement** (via trigger Supabase ou fonction) :
   - Récupérer son `auth.uid`
   - Mettre à jour `school_admins.user_profile_id`

---

## 🤝 Inscription ASSOCIATION (par invitation)

### Même principe que pour les écoles

1. Vous créez l'association via interface admin ou SQL :
```sql
-- 1. Créer le contact (optionnel pour association)
INSERT INTO contacts (id, country, city, postal_code, street)
VALUES (gen_random_uuid(), 'France', 'Lyon', '69001', '10 rue de l''Asso')
RETURNING id;

-- 2. Créer l'association
INSERT INTO associations (id, name, description, email, contact_id, status)
VALUES (
  gen_random_uuid(),
  'Association Exemple',
  'Une super association étudiante',
  'contact@asso.fr',
  '<ID_DU_CONTACT>',
  'ACTIVE'
)
RETURNING id;

-- 3. Créer le membre admin de l'asso
INSERT INTO association_members (
  id, association_id, first_name, last_name, contact_id, email, status
)
VALUES (
  gen_random_uuid(),
  '<ID_DE_L_ASSO>',
  'Marie',
  'Martin',
  '<ID_DU_CONTACT>',
  'marie.martin@asso.fr',
  'ACTIVE'
);
```

---

## 🔐 Workflow technique à implémenter

### 1. Trigger Supabase sur `auth.users` (IMPORTANT)

Actuellement, vous avez probablement un trigger qui crée `user_profiles` automatiquement.
Il faut l'améliorer pour gérer les liens avec les autres tables.

**Fichier à créer** : `supabase/migrations/XXXXX_handle_new_user.sql`

```sql
-- Fonction appelée après création d'un user dans auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- 1. Créer le profil utilisateur
  INSERT INTO public.user_profiles (user_id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'STUDENT')
  );

  -- 2. Si c'est un admin école, lier à school_admins
  IF (NEW.raw_user_meta_data->>'role' = 'SCHOOL') THEN
    UPDATE public.school_admins
    SET user_profile_id = NEW.id
    WHERE email = NEW.email
    AND user_profile_id IS NULL;
  END IF;

  -- 3. Si c'est une association, lier à association_members
  IF (NEW.raw_user_meta_data->>'role' = 'ASSOCIATION') THEN
    UPDATE public.association_members
    SET user_profile_id = NEW.id
    WHERE email = NEW.email
    AND user_profile_id IS NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger qui appelle cette fonction
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. Fonction onboarding étudiant

**Fichier à créer** : `apps/web/app/api/onboarding/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const {
    firstName,
    lastName,
    schoolId,
    academicLevelId,
    type,
    // Contact
    country,
    city,
    postalCode,
    street,
    phoneNumber,
  } = body;

  // 1. Créer le contact
  const { data: contact, error: contactError } = await supabase
    .from('contacts')
    .insert({
      country,
      city,
      postal_code: postalCode,
      street,
      phone_number: phoneNumber,
    })
    .select()
    .single();

  if (contactError) {
    return NextResponse.json({ error: contactError }, { status: 500 });
  }

  // 2. Créer le school_member
  const { error: memberError } = await supabase
    .from('school_members')
    .insert({
      school_id: schoolId,
      first_name: firstName,
      last_name: lastName,
      type,
      academic_level_id: academicLevelId,
      contact_id: contact.id,
      email: user.email,
      user_profile_id: user.id,
    });

  if (memberError) {
    return NextResponse.json({ error: memberError }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
```

---

## 📊 Résumé des tables et relations

### Étudiant (STUDENT)
```
auth.users (Supabase)
  ↓
user_profiles (role: STUDENT)
  ↓
school_members (lien avec école + niveau)
  ↓
contacts (adresse, téléphone)
```

### Admin École (SCHOOL)
```
auth.users (Supabase) ← invitation
  ↓
user_profiles (role: SCHOOL)
  ↓
school_admins (lien avec école)
  ↓
schools + contacts
```

### Association (ASSOCIATION)
```
auth.users (Supabase) ← invitation
  ↓
user_profiles (role: ASSOCIATION)
  ↓
association_members (lien avec asso)
  ↓
associations + contacts
```

---

## 🚀 Prochaines étapes

### Court terme (à faire maintenant)
- [ ] Créer la migration Supabase avec le trigger `handle_new_user()`
- [ ] Créer la page `/onboarding` pour que les étudiants complètent leur profil
- [ ] Tester l'inscription étudiant + onboarding

### Moyen terme
- [ ] Créer `/admin/schools` pour inviter des écoles
- [ ] Créer `/admin/associations` pour inviter des associations
- [ ] Email templates personnalisés pour les invitations
- [ ] Dashboard admin avec gestion des validations

### Long terme
- [ ] Système de validation des inscriptions (status PENDING)
- [ ] Import CSV massif d'étudiants par les écoles
- [ ] Emails de bienvenue personnalisés par rôle
