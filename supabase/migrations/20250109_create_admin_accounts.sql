-- Script pour créer des comptes admin école et association de test
-- ⚠️ IMPORTANT : Ces utilisateurs doivent d'abord être créés manuellement dans Supabase Auth
-- Ce script ne fait que lier les comptes auth existants aux tables métier

-- ========================================
-- INSTRUCTIONS
-- ========================================
-- 1. Créer d'abord les utilisateurs via Supabase Dashboard > Authentication > Add User
--    - Admin École : admin-ecole@test.com / password123
--    - Admin Asso : admin-asso@test.com / password123
-- 
-- 2. Copier les user_id de ces utilisateurs depuis la table auth.users
--
-- 3. Remplacer les UUIDs ci-dessous par les vrais user_id
--
-- 4. Exécuter ce script dans Supabase SQL Editor
-- ========================================

DO $$
DECLARE
  -- ⚠️ REMPLACER CES UUIDs PAR LES VRAIS user_id depuis auth.users
  auth_user_id_school uuid := 'REMPLACER_PAR_UUID_AUTH_SCHOOL';  -- UUID de admin-ecole@test.com
  auth_user_id_asso uuid := 'REMPLACER_PAR_UUID_AUTH_ASSO';      -- UUID de admin-asso@test.com
  
  -- Variables pour les IDs
  school_id uuid;
  croix_rouge_id uuid;
  
  contact_admin_school_id uuid := gen_random_uuid();
  contact_admin_asso_id uuid := gen_random_uuid();
  
  user_profile_school_id uuid := gen_random_uuid();
  user_profile_asso_id uuid := gen_random_uuid();
  
  school_admin_id uuid := gen_random_uuid();
  asso_member_id uuid := gen_random_uuid();
BEGIN
  
  -- Récupérer l'ID de l'école Paris-Saclay
  SELECT id INTO school_id FROM public.schools WHERE name = 'Université Paris-Saclay' LIMIT 1;
  
  -- Récupérer l'ID de la Croix-Rouge
  SELECT id INTO croix_rouge_id FROM public.associations WHERE name = 'Croix-Rouge Française' LIMIT 1;
  
  -- ========================================
  -- 1. CRÉER ADMIN ÉCOLE
  -- ========================================
  
  -- Contact pour admin école
  INSERT INTO public.contacts (id, country, city, postal_code, street, phone_number, created_at, updated_at)
  VALUES (
    contact_admin_school_id,
    'France',
    'Gif-sur-Yvette',
    '91190',
    '3 Rue Joliot Curie',
    '01 69 15 00 00',
    NOW(),
    NOW()
  );
  
  -- User Profile pour admin école
  INSERT INTO public.user_profiles (id, user_id, email, full_name, role, created_at, updated_at)
  VALUES (
    user_profile_school_id,
    auth_user_id_school,
    'admin-ecole@test.com',
    'Directeur École',
    'SCHOOL',
    NOW(),
    NOW()
  );
  
  -- School Admin
  INSERT INTO public.school_admins (id, school_id, first_name, last_name, contact_id, email, user_profile_id, created_at, updated_at)
  VALUES (
    school_admin_id,
    school_id,
    'Directeur',
    'École',
    contact_admin_school_id,
    'admin-ecole@test.com',
    user_profile_school_id,
    NOW(),
    NOW()
  );
  
  -- ========================================
  -- 2. CRÉER ADMIN ASSOCIATION
  -- ========================================
  
  -- Contact pour admin asso
  INSERT INTO public.contacts (id, country, city, postal_code, street, phone_number, created_at, updated_at)
  VALUES (
    contact_admin_asso_id,
    'France',
    'Paris',
    '75015',
    '98 rue Didot',
    '06 98 76 54 32',
    NOW(),
    NOW()
  );
  
  -- User Profile pour admin asso
  INSERT INTO public.user_profiles (id, user_id, email, full_name, role, created_at, updated_at)
  VALUES (
    user_profile_asso_id,
    auth_user_id_asso,
    'admin-asso@test.com',
    'Responsable Croix-Rouge',
    'ASSOCIATION',
    NOW(),
    NOW()
  );
  
  -- Association Member
  INSERT INTO public.association_members (id, association_id, first_name, last_name, status, contact_id, email, user_profile_id, created_at, updated_at)
  VALUES (
    asso_member_id,
    croix_rouge_id,
    'Responsable',
    'Croix-Rouge',
    'ACTIVE',
    contact_admin_asso_id,
    'admin-asso@test.com',
    user_profile_asso_id,
    NOW(),
    NOW()
  );
  
  -- ========================================
  -- AFFICHER LES RÉSULTATS
  -- ========================================
  
  RAISE NOTICE '✅ Comptes admin créés avec succès !';
  RAISE NOTICE '';
  RAISE NOTICE '🏫 Admin École :';
  RAISE NOTICE '   Email: admin-ecole@test.com';
  RAISE NOTICE '   Mot de passe: password123';
  RAISE NOTICE '   Dashboard: http://localhost:3000/dashboard-school';
  RAISE NOTICE '';
  RAISE NOTICE '🤝 Admin Association (Croix-Rouge) :';
  RAISE NOTICE '   Email: admin-asso@test.com';
  RAISE NOTICE '   Mot de passe: password123';
  RAISE NOTICE '   Dashboard: http://localhost:3000/dashboard-association';
  
END $$;

-- Vérifier les comptes créés
SELECT 
  up.email,
  up.role,
  up.full_name
FROM user_profiles up
WHERE up.role IN ('SCHOOL', 'ASSOCIATION')
ORDER BY up.role;
