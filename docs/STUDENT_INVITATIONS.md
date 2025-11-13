# 🎓 Système d'invitation étudiante

## Vue d'ensemble

Le système d'invitation permet aux écoles d'inviter des étudiants à rejoindre la plateforme Fourmis de manière sécurisée et contrôlée.

## 🔄 Flow complet

```
1. Admin école → Ouvre modal d'invitation
2. Admin → Saisit emails (manuel ou CSV)
3. Système → Crée invitations en base avec tokens uniques
4. Système → Envoie emails avec liens d'invitation
5. Étudiant → Clique sur lien dans email
6. Étudiant → Arrive sur page d'inscription pré-remplie
7. Étudiant → Crée son compte
8. Système → Associe compte à l'école automatiquement
```

## 📁 Architecture

### 1. Base de données

**Table : `student_invitations`**
```sql
- id (UUID)
- school_id (FK vers schools)
- email (email de l'étudiant)
- first_name, last_name (optionnels)
- token (UUID unique pour le lien)
- expires_at (7 jours par défaut)
- used_at (NULL si non utilisée)
- created_by (FK vers user_profiles)
```

### 2. API Routes

**`/api/school/invite-students`** (POST)
- Crée les invitations en base
- Envoie les emails (TODO)
- Retourne les invitations créées

**`/api/auth/accept-invitation`** (POST) - À créer
- Valide le token d'invitation
- Crée le compte étudiant
- Marque l'invitation comme utilisée

### 3. Pages

**`/dashboard-school/students`**
- Affiche liste étudiants
- Bouton "Inviter des étudiants"

**`/auth/invitation/[token]`** - À créer
- Page d'inscription pour étudiant invité
- Formulaire pré-rempli avec email
- Création compte Supabase Auth

### 4. Composants

**`InviteStudentsModal`**
- Modal avec 2 onglets (manuel/CSV)
- Validation emails
- Envoi invitations

**`StudentsListClient`** - À modifier
- Ajouter bouton "Inviter"
- Afficher invitations en attente

## 🚀 Étapes d'implémentation

### ✅ Phase 1 : Base (Complétée)
- [x] Script SQL table invitations
- [x] Modèle Prisma
- [x] Modal d'invitation
- [x] API route création invitations

### 🔄 Phase 2 : En cours
- [ ] Ajouter bouton dans StudentsListClient
- [ ] Page d'acceptation d'invitation
- [ ] API route acceptation

### ⏳ Phase 3 : À venir
- [ ] Service d'envoi d'emails (Resend)
- [ ] Templates d'emails
- [ ] Gestion invitations expirées
- [ ] Ré-envoi d'invitation

## 📧 Templates Email (À implémenter)

```typescript
// packages/lib/src/emails/student-invitation.tsx
export function StudentInvitationEmail({
  firstName,
  schoolName,
  invitationLink,
}) {
  return (
    <Html>
      <Head />
      <Body>
        <h1>Bienvenue {firstName} !</h1>
        <p>{schoolName} vous invite à rejoindre Fourmis</p>
        <a href={invitationLink}>Créer mon compte</a>
        <p>Ce lien expire dans 7 jours</p>
      </Body>
    </Html>
  );
}
```

## 🔒 Sécurité

- ✅ Tokens UUID uniques
- ✅ Expiration 7 jours
- ✅ Validation admin école
- ✅ One-time use (used_at)
- ✅ Association automatique école

## 📊 SQL Utiles

```sql
-- Voir toutes les invitations actives
SELECT * FROM active_student_invitations;

-- Nettoyer invitations expirées
SELECT cleanup_expired_invitations();

-- Stats invitations par école
SELECT 
  s.name,
  COUNT(*) as total_invitations,
  COUNT(used_at) as used,
  COUNT(*) - COUNT(used_at) as pending
FROM student_invitations si
JOIN schools s ON si.school_id = s.id
GROUP BY s.id, s.name;
```

## 🎨 UI/UX

### Modal d'invitation
- **Onglet Manuel** : Formulaires pour email, prénom, nom
- **Onglet CSV** : Upload fichier ou paste
- **Validation** : Regex email, déduplication
- **Feedback** : Toast succès/erreur

### Page invitation
- **URL** : `/auth/invitation/{token}`
- **Contenu** : Form inscription pré-rempli
- **Validation** : Token valide, non expiré, non utilisé
- **Redirection** : /dashboard après création compte

## 🧪 Testing

```bash
# 1. Exécuter le SQL
# Copier-coller create_student_invitations.sql dans Supabase

# 2. Tester l'API
curl -X POST http://localhost:3000/api/school/invite-students \
  -H "Content-Type: application/json" \
  -d '{
    "schoolId": "xxx",
    "students": [
      {"email": "test@example.com", "firstName": "Test", "lastName": "User"}
    ]
  }'

# 3. Vérifier en base
SELECT * FROM student_invitations ORDER BY created_at DESC LIMIT 10;
```

## 🔜 Prochaines étapes

1. ✅ Exécuter SQL sur Supabase
2. ⏳ Ajouter bouton "Inviter" dans StudentsListClient
3. ⏳ Créer page `/auth/invitation/[token]`
4. ⏳ Implémenter envoi emails (Resend)
5. ⏳ Tester flow complet end-to-end
