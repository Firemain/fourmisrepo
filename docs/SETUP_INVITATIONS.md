# 🚀 Guide de mise en place - Système d'invitation d'étudiants

## ✅ Ce qui a été créé

### 1. Base de données
- ✅ Table `student_invitations` créée (script SQL exécuté)
- ✅ Vue `active_student_invitations` 
- ✅ Fonction de nettoyage `cleanup_expired_invitations()`

### 2. Composants UI
- ✅ `Dialog` component créé
- ✅ `InviteStudentsModal` avec onglets Manuel/CSV
- ✅ Bouton "Inviter des étudiants" dans le dashboard école

### 3. API Routes
- ✅ `POST /api/school/invite-students` - Création d'invitations + envoi emails
- ✅ `POST /api/auth/accept-invitation` - Acceptation et création de compte

### 4. Pages
- ✅ `/invitation/[token]` - Page d'acceptation d'invitation
- ✅ `InvitationAcceptForm` - Formulaire de création de compte

### 5. Emails
- ✅ Template `StudentInvitationEmail` avec design Fourmis
- ✅ Intégration Resend pour l'envoi

## 📋 Configuration requise

### Variables d'environnement (.env.local)

Copie le fichier `.env.example` vers `.env.local` et remplis les valeurs :

```bash
# Supabase (déjà configuré normalement)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...  # ⚠️ Important pour la création de comptes

# App URL (pour les liens d'invitation)
NEXT_PUBLIC_APP_URL=http://localhost:3001  # En dev
# NEXT_PUBLIC_APP_URL=https://fourmis.fr    # En prod

# Resend (pour les emails)
RESEND_API_KEY=re_xxx...  # À obtenir sur https://resend.com
RESEND_FROM_EMAIL=Fourmis <onboarding@fourmis.fr>
```

### Obtenir les clés Resend

1. Va sur https://resend.com
2. Crée un compte (gratuit : 100 emails/jour, 3000/mois)
3. Va dans **API Keys**
4. Crée une nouvelle clé
5. Configure ton domaine d'envoi (ou utilise le domaine test)

## 🧪 Test du système

### 1. Test de l'invitation

```bash
# 1. Lance l'app
pnpm dev:web

# 2. Connecte-toi en tant qu'admin d'école
# URL: http://localhost:3001/login

# 3. Va sur la page étudiants
# URL: http://localhost:3001/dashboard-school/students

# 4. Clique sur "Inviter des étudiants"

# 5. Teste l'ajout manuel
Email: test@example.com
Prénom: Jean
Nom: Dupont

# 6. Ou teste le CSV
email,firstName,lastName
test1@example.com,Marie,Martin
test2@example.com,Paul,Bernard

# 7. Clique sur "Envoyer les invitations"
```

### 2. Vérifier dans Supabase

```sql
-- Voir les invitations créées
SELECT * FROM student_invitations
ORDER BY created_at DESC;

-- Voir les invitations actives (non expirées, non utilisées)
SELECT * FROM active_student_invitations;
```

### 3. Test de l'acceptation

```bash
# 1. Récupère le token depuis la table student_invitations
# ou depuis l'email reçu

# 2. Va sur l'URL d'invitation
http://localhost:3001/invitation/[TOKEN]

# 3. Remplis le formulaire
# - Email : pré-rempli (readonly)
# - Prénom : pré-rempli (modifiable)
# - Nom : pré-rempli (modifiable)
# - Mot de passe : minimum 8 caractères
# - Confirmation

# 4. Clique sur "Créer mon compte"

# 5. Vérifie la redirection vers /dashboard
```

### 4. Vérifier la création du compte

```sql
-- Voir le nouveau user
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 1;

-- Voir le profil créé
SELECT * FROM user_profiles
WHERE email = 'test@example.com';

-- Voir la liaison école
SELECT sm.*, s.name as school_name
FROM school_members sm
JOIN schools s ON s.id = sm.school_id
WHERE sm.user_profile_id = '...';

-- Voir l'invitation marquée comme utilisée
SELECT * FROM student_invitations
WHERE email = 'test@example.com';
-- used_at devrait être rempli
```

## 🔧 Dépannage

### L'email n'est pas envoyé

**Vérifier :**
1. `RESEND_API_KEY` est défini dans `.env.local`
2. Le domaine est vérifié sur Resend (ou utilise le domaine test)
3. Les logs du serveur : `console.log` dans l'API route

**Solution temporaire :**
Récupère le token directement dans la DB et teste avec l'URL manuelle.

### Erreur "Invitation invalide"

**Causes possibles :**
- Token expiré (> 7 jours)
- Token déjà utilisé (`used_at` non null)
- Token inexistant

**Solution :**
```sql
-- Réinitialiser une invitation pour test
UPDATE student_invitations
SET used_at = NULL,
    expires_at = NOW() + INTERVAL '7 days'
WHERE email = 'test@example.com';
```

### Erreur lors de la création du compte

**Vérifier :**
1. `SUPABASE_SERVICE_ROLE_KEY` est bien défini
2. L'email n'existe pas déjà dans `auth.users`
3. Les logs du serveur pour voir l'erreur exacte

**Nettoyer un compte de test :**
```sql
-- Supprimer un étudiant de test
DELETE FROM school_members WHERE user_profile_id = '...';
DELETE FROM user_profiles WHERE email = 'test@example.com';
-- Puis dans le dashboard Supabase Auth, supprimer le user
```

## 📊 Monitoring

### Requêtes utiles

```sql
-- Statistiques des invitations
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN used_at IS NOT NULL THEN 1 END) as utilisees,
  COUNT(CASE WHEN used_at IS NULL AND expires_at > NOW() THEN 1 END) as actives,
  COUNT(CASE WHEN expires_at < NOW() AND used_at IS NULL THEN 1 END) as expirees
FROM student_invitations;

-- Invitations par école
SELECT 
  s.name as ecole,
  COUNT(*) as invitations_envoyees,
  COUNT(CASE WHEN si.used_at IS NOT NULL THEN 1 END) as comptes_crees
FROM student_invitations si
JOIN schools s ON s.id = si.school_id
GROUP BY s.id, s.name
ORDER BY invitations_envoyees DESC;

-- Taux de conversion
SELECT 
  s.name as ecole,
  COUNT(*) as invitations,
  COUNT(CASE WHEN si.used_at IS NOT NULL THEN 1 END) as acceptees,
  ROUND(
    100.0 * COUNT(CASE WHEN si.used_at IS NOT NULL THEN 1 END) / COUNT(*),
    2
  ) as taux_conversion
FROM student_invitations si
JOIN schools s ON s.id = si.school_id
GROUP BY s.id, s.name;
```

## 🎯 Prochaines étapes

### Améliorations possibles

1. **Resend d'invitation**
   - Bouton pour renvoyer une invitation expirée
   - Génère un nouveau token

2. **Gestion des invitations**
   - Page pour voir toutes les invitations envoyées
   - Annuler une invitation
   - Voir le statut (en attente, acceptée, expirée)

3. **Notifications**
   - Email de confirmation à l'admin quand un étudiant s'inscrit
   - Rappel avant expiration (J-1)

4. **Import CSV amélioré**
   - Validation des doublons
   - Preview avant envoi
   - Rapport d'import (succès/échecs)

5. **Analytics**
   - Dashboard avec stats d'invitations
   - Graphiques de conversion
   - Export CSV des invitations

## ✨ Features implémentées

- ✅ Invitation manuelle (formulaire)
- ✅ Import CSV (upload + paste)
- ✅ Validation email
- ✅ Génération de tokens uniques
- ✅ Expiration 7 jours
- ✅ Envoi d'email avec template
- ✅ Page d'acceptation sécurisée
- ✅ Création automatique du compte
- ✅ Liaison automatique à l'école
- ✅ Marquage one-time use
- ✅ Gestion des erreurs
- ✅ UI/UX responsive
- ✅ i18n ready

## 📝 Notes de sécurité

- Tokens UUID v4 (impossibles à deviner)
- Expiration automatique après 7 jours
- One-time use (marqué comme utilisé)
- Vérification de l'admin avant création d'invitations
- Service role key utilisée côté serveur uniquement
- Email confirmation automatique (pas de lien à cliquer)
