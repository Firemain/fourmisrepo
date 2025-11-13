# ⚡ Actions immédiates à faire

## 1. Configuration des variables d'environnement (2 min)

Crée le fichier `apps/web/.env.local` avec :

```env
# Supabase (tu dois déjà avoir ces valeurs)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...  # ⚠️ À récupérer dans Supabase > Settings > API

# App
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Resend (voir étape 2)
RESEND_API_KEY=re_xxx...
RESEND_FROM_EMAIL=Fourmis <onboarding@fourmis.fr>
```

### Où trouver SUPABASE_SERVICE_ROLE_KEY ?

1. Va sur ton projet Supabase
2. Settings (icône engrenage) > API
3. Section "Project API keys"
4. Copie la clé "service_role" (⚠️ secret, ne jamais commit)

## 2. Configuration Resend (5 min)

### Créer un compte (gratuit)

1. Va sur https://resend.com
2. Clique sur "Sign Up"
3. Crée un compte avec ton email

### Obtenir la clé API

1. Une fois connecté, va dans **API Keys**
2. Clique sur "Create API Key"
3. Nomme-la (ex: "Fourmis Dev")
4. Copie la clé (commence par `re_`)
5. Colle-la dans `.env.local` comme `RESEND_API_KEY`

### Option 1 : Mode test (recommandé pour dev)

En mode test, les emails ne sont envoyés qu'à l'adresse email de ton compte Resend.
Pas besoin de configuration de domaine.

**Utilisation :**
- Invite n'importe quel email
- L'email sera envoyé à TON adresse Resend
- Tu peux quand même tester le lien d'invitation

### Option 2 : Configurer un domaine (pour prod)

1. Dans Resend, va dans **Domains**
2. Clique sur "Add Domain"
3. Entre ton domaine (ex: `fourmis.fr`)
4. Ajoute les enregistrements DNS demandés
5. Attends la vérification (quelques minutes)
6. Change `RESEND_FROM_EMAIL` pour utiliser ton domaine

## 3. Test rapide (3 min)

### Lancer l'app

```bash
pnpm dev:web
```

### Tester l'invitation

1. Connecte-toi en tant qu'admin d'école
   - URL: http://localhost:3001/login

2. Va sur la page étudiants
   - URL: http://localhost:3001/dashboard-school/students

3. Clique sur "Inviter des étudiants"

4. Teste avec un email (utilise TON email si mode test Resend)
   ```
   Email: ton-email@example.com
   Prénom: Test
   Nom: Étudiant
   ```

5. Clique sur "Envoyer les invitations"

6. Vérifie l'email reçu (dans ta boîte si mode test)

7. Clique sur le lien dans l'email

8. Crée le compte avec un mot de passe

9. Vérifie que tu es redirigé vers `/dashboard`

### Vérifier dans Supabase

```sql
-- Voir l'invitation créée
SELECT * FROM student_invitations ORDER BY created_at DESC LIMIT 1;

-- Voir le compte créé
SELECT * FROM user_profiles WHERE email = 'ton-email@example.com';

-- Voir la liaison école
SELECT * FROM school_members 
WHERE user_profile_id = (
  SELECT id FROM user_profiles WHERE email = 'ton-email@example.com'
);
```

## 4. Test CSV (optionnel, 2 min)

Crée un fichier `test-invitations.csv` :

```csv
email,firstName,lastName
etudiant1@test.fr,Marie,Martin
etudiant2@test.fr,Paul,Bernard
etudiant3@test.fr,Sophie,Dubois
```

Dans le modal :
1. Va sur l'onglet "CSV"
2. Upload le fichier (ou copie-colle le contenu)
3. Vérifie le preview
4. Envoie

## ✅ Checklist complète

- [ ] `.env.local` créé avec toutes les variables
- [ ] `SUPABASE_SERVICE_ROLE_KEY` récupérée
- [ ] Compte Resend créé
- [ ] `RESEND_API_KEY` configurée
- [ ] App lancée avec `pnpm dev:web`
- [ ] Test invitation manuel réussi
- [ ] Email reçu
- [ ] Compte créé depuis l'invitation
- [ ] Liaison école vérifiée dans Supabase
- [ ] (Optionnel) Test CSV réussi

## 🐛 Problèmes courants

### "Non authentifié" lors de l'envoi d'invitation
→ Vérifie que tu es bien connecté en tant qu'admin d'école

### "Erreur lors de l'envoi d'email"
→ Vérifie que `RESEND_API_KEY` est correcte
→ En mode test, utilise TON email de compte Resend

### "Invitation invalide"
→ Le token a peut-être expiré (7 jours)
→ Crée une nouvelle invitation

### Erreur lors de la création du compte
→ Vérifie que `SUPABASE_SERVICE_ROLE_KEY` est définie
→ Vérifie que l'email n'existe pas déjà

## 📚 Documentation

- **Guide complet** : `docs/STUDENT_INVITATIONS.md`
- **Guide setup** : `docs/SETUP_INVITATIONS.md`
- **Résumé** : `SYSTEME_INVITATIONS_COMPLETE.md`

## 🎯 Et après ?

Une fois que tout fonctionne :

1. Push la branche :
   ```bash
   git push origin feature/school-registration
   ```

2. Teste en environnement de staging/prod :
   - Change `NEXT_PUBLIC_APP_URL` pour l'URL de prod
   - Configure le domaine Resend
   - Change `RESEND_FROM_EMAIL` avec ton domaine

3. Améliorations futures (voir `SETUP_INVITATIONS.md`) :
   - Dashboard des invitations
   - Resend d'invitation
   - Analytics
   - etc.

---

**Bon test ! 🚀**

Si tu as des questions ou problèmes, tout est documenté dans les fichiers mentionnés ci-dessus.
