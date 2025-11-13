-- Nettoyer les données de test orphelines
-- À exécuter dans Supabase SQL Editor

-- 1. Supprimer les school_members sans user_profile
DELETE FROM public.school_members 
WHERE user_profile_id NOT IN (SELECT id FROM public.user_profiles);

-- 2. Voir les emails des users orphelins (pour vérification)
SELECT email FROM auth.users 
WHERE id NOT IN (SELECT user_id FROM public.user_profiles);

-- 3. Pour supprimer les users orphelins, il faut utiliser l'interface Supabase
-- Allez dans Authentication > Users et supprimez manuellement les users listés ci-dessus

-- 4. Réinitialiser les invitations de test (optionnel - décommenter si besoin)
-- UPDATE public.student_invitations 
-- SET used_at = NULL 
-- WHERE email = 'fourmis.project@gmail.com';
