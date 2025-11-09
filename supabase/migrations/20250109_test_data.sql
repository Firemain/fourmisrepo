-- Script de données de test pour Fourmis
-- À exécuter dans Supabase SQL Editor

-- ========================================
-- 1. CONTACTS & ÉCOLES
-- ========================================

DO $$
DECLARE
  contact_school_id uuid := gen_random_uuid();
  school_id uuid := gen_random_uuid();
BEGIN
  -- Créer le contact pour l'école
  INSERT INTO public.contacts (id, country, city, postal_code, street, phone_number, created_at, updated_at)
  VALUES (
    contact_school_id,
    'France',
    'Gif-sur-Yvette',
    '91190',
    '3 Rue Joliot Curie',
    '01 69 15 78 91',
    NOW(),
    NOW()
  );

  -- Créer l'école
  INSERT INTO public.schools (id, name, contact_id, type, status, created_at, updated_at)
  VALUES (
    school_id,
    'Université Paris-Saclay',
    contact_school_id,
    'UNIVERSITY',
    'ACTIVE',
    NOW(),
    NOW()
  );

  -- Insérer les niveaux académiques
  INSERT INTO public.ref_academic_levels (id, school_id, name, display_name, created_at, updated_at)
  VALUES 
    (gen_random_uuid(), school_id, 'L1', 'Licence 1', NOW(), NOW()),
    (gen_random_uuid(), school_id, 'L2', 'Licence 2', NOW(), NOW()),
    (gen_random_uuid(), school_id, 'L3', 'Licence 3', NOW(), NOW()),
    (gen_random_uuid(), school_id, 'M1', 'Master 1', NOW(), NOW()),
    (gen_random_uuid(), school_id, 'M2', 'Master 2', NOW(), NOW());
END $$;

-- ========================================
-- 2. CONTACTS & ASSOCIATIONS
-- ========================================

DO $$
DECLARE
  contact_croix_rouge_id uuid := gen_random_uuid();
  contact_restos_id uuid := gen_random_uuid();
  contact_bde_id uuid := gen_random_uuid();
  contact_club_info_id uuid := gen_random_uuid();
  contact_enactus_id uuid := gen_random_uuid();
BEGIN
  -- Contacts pour les associations
  INSERT INTO public.contacts (id, country, city, postal_code, street, phone_number, created_at, updated_at)
  VALUES 
    (contact_croix_rouge_id, 'France', 'Paris', '75015', '98 rue Didot', '01 44 43 11 00', NOW(), NOW()),
    (contact_restos_id, 'France', 'Paris', '75010', '45 rue de Paradis', NULL, NOW(), NOW()),
    (contact_bde_id, 'France', 'Gif-sur-Yvette', '91190', '3 Rue Joliot Curie', NULL, NOW(), NOW()),
    (contact_club_info_id, 'France', 'Gif-sur-Yvette', '91190', '3 Rue Joliot Curie', NULL, NOW(), NOW()),
    (contact_enactus_id, 'France', 'Paris', '75008', '24 avenue Marceau', NULL, NOW(), NOW());

  -- Associations
  INSERT INTO public.associations (id, name, description, logo_url, site_url, email, contact_id, status, created_at, updated_at)
  VALUES 
    (
      gen_random_uuid(),
      'Croix-Rouge Française',
      'Association humanitaire française. Missions de secourisme, aide aux personnes vulnérables, et sensibilisation aux gestes qui sauvent.',
      'https://upload.wikimedia.org/wikipedia/fr/thumb/8/8d/Croix-Rouge_fran%C3%A7aise_%28logo%29.svg/1200px-Croix-Rouge_fran%C3%A7aise_%28logo%29.svg.png',
      'https://www.croix-rouge.fr',
      'contact@croix-rouge.fr',
      contact_croix_rouge_id,
      'ACTIVE',
      NOW(),
      NOW()
    ),
    (
      gen_random_uuid(),
      'Restos du Cœur',
      'Association loi de 1901 reconnue d''utilité publique. Distribution de repas, aide à l''insertion sociale et professionnelle.',
      NULL,
      'https://www.restosducoeur.org',
      'contact@restosducoeur.org',
      contact_restos_id,
      'ACTIVE',
      NOW(),
      NOW()
    ),
    (
      gen_random_uuid(),
      'Bureau des Étudiants (BDE)',
      'Organisation des événements étudiants, animation de la vie du campus, représentation des étudiants.',
      NULL,
      NULL,
      'bde@universite-paris-saclay.fr',
      contact_bde_id,
      'ACTIVE',
      NOW(),
      NOW()
    ),
    (
      gen_random_uuid(),
      'Club Informatique',
      'Ateliers de programmation, hackathons, conférences tech, projets open-source. Ouvert à tous les niveaux.',
      NULL,
      NULL,
      'club.info@universite-paris-saclay.fr',
      contact_club_info_id,
      'ACTIVE',
      NOW(),
      NOW()
    ),
    (
      gen_random_uuid(),
      'Enactus',
      'Projets entrepreneuriaux à impact social et environnemental. Compétitions nationales et internationales.',
      NULL,
      'https://enactus.fr',
      'enactus@universite-paris-saclay.fr',
      contact_enactus_id,
      'ACTIVE',
      NOW(),
      NOW()
    );
END $$;

-- ========================================
-- 3. MEMBRES D'ASSOCIATIONS & MISSIONS
-- ========================================

DO $$
DECLARE
  croix_rouge_id uuid;
  restos_id uuid;
  bde_id uuid;
  club_info_id uuid;
  
  contact_member_cr uuid := gen_random_uuid();
  contact_member_restos uuid := gen_random_uuid();
  contact_member_bde uuid := gen_random_uuid();
  contact_member_club uuid := gen_random_uuid();
  
  member_cr_id uuid := gen_random_uuid();
  member_restos_id uuid := gen_random_uuid();
  member_bde_id uuid := gen_random_uuid();
  member_club_id uuid := gen_random_uuid();
BEGIN
  -- Récupérer les IDs des associations
  SELECT id INTO croix_rouge_id FROM public.associations WHERE name = 'Croix-Rouge Française' LIMIT 1;
  SELECT id INTO restos_id FROM public.associations WHERE name = 'Restos du Cœur' LIMIT 1;
  SELECT id INTO bde_id FROM public.associations WHERE name = 'Bureau des Étudiants (BDE)' LIMIT 1;
  SELECT id INTO club_info_id FROM public.associations WHERE name = 'Club Informatique' LIMIT 1;

  -- Créer des contacts pour les membres responsables
  INSERT INTO public.contacts (id, country, city, postal_code, street, phone_number, created_at, updated_at)
  VALUES 
    (contact_member_cr, 'France', 'Paris', '75015', '98 rue Didot', '06 12 34 56 78', NOW(), NOW()),
    (contact_member_restos, 'France', 'Paris', '75010', '45 rue de Paradis', '06 23 45 67 89', NOW(), NOW()),
    (contact_member_bde, 'France', 'Gif-sur-Yvette', '91190', '3 Rue Joliot Curie', '06 34 56 78 90', NOW(), NOW()),
    (contact_member_club, 'France', 'Gif-sur-Yvette', '91190', '3 Rue Joliot Curie', '06 45 67 89 01', NOW(), NOW());

  -- Créer des membres responsables pour chaque association
  INSERT INTO public.association_members (id, association_id, first_name, last_name, status, contact_id, email, created_at, updated_at)
  VALUES 
    (member_cr_id, croix_rouge_id, 'Sophie', 'Martin', 'ACTIVE', contact_member_cr, 'sophie.martin@croix-rouge.fr', NOW(), NOW()),
    (member_restos_id, restos_id, 'Pierre', 'Dubois', 'ACTIVE', contact_member_restos, 'pierre.dubois@restosducoeur.org', NOW(), NOW()),
    (member_bde_id, bde_id, 'Julie', 'Bernard', 'ACTIVE', contact_member_bde, 'julie.bernard@bde.fr', NOW(), NOW()),
    (member_club_id, club_info_id, 'Thomas', 'Petit', 'ACTIVE', contact_member_club, 'thomas.petit@club-info.fr', NOW(), NOW());

  -- Missions (avec association_member_id)
  INSERT INTO public.missions (id, association_id, association_member_id, title, description, start_at, end_at, maximum_participant, recurrence_type, duration, status, created_at, updated_at)
  VALUES 
    (
      gen_random_uuid(),
      croix_rouge_id,
      member_cr_id,
      'Formation Premiers Secours (PSC1)',
      'Apprenez les gestes qui sauvent lors d''une formation complète aux premiers secours. Certificat officiel délivré.',
      NOW() + INTERVAL '7 days',
      NOW() + INTERVAL '7 days' + INTERVAL '8 hours',
      20,
      'NONE',
      480,
      'PUBLISHED',
      NOW(),
      NOW()
    ),
    (
      gen_random_uuid(),
      croix_rouge_id,
      member_cr_id,
      'Collecte de dons alimentaires',
      'Participation à une collecte de dons dans un supermarché local. Sensibilisation du public et tri des dons.',
      NOW() + INTERVAL '3 days',
      NOW() + INTERVAL '3 days' + INTERVAL '4 hours',
      15,
      'NONE',
      240,
      'PUBLISHED',
      NOW(),
      NOW()
    ),
    (
      gen_random_uuid(),
      restos_id,
      member_restos_id,
      'Distribution de repas',
      'Aide à la distribution des repas chauds et des colis alimentaires. Accueil et écoute des bénéficiaires.',
      NOW() + INTERVAL '2 days',
      NOW() + INTERVAL '2 days' + INTERVAL '3 hours',
      10,
      'WEEKLY',
      180,
      'PUBLISHED',
      NOW(),
      NOW()
    ),
    (
      gen_random_uuid(),
      bde_id,
      member_bde_id,
      'Organisation Soirée de Rentrée',
      'Participe à l''organisation de la soirée de rentrée : logistique, communication, accueil des participants.',
      NOW() + INTERVAL '10 days',
      NOW() + INTERVAL '10 days' + INTERVAL '6 hours',
      25,
      'NONE',
      360,
      'PUBLISHED',
      NOW(),
      NOW()
    ),
    (
      gen_random_uuid(),
      club_info_id,
      member_club_id,
      'Atelier Initiation au Code',
      'Anime un atelier d''initiation à la programmation pour les débutants. Thème : Python et création d''un jeu simple.',
      NOW() + INTERVAL '5 days',
      NOW() + INTERVAL '5 days' + INTERVAL '2 hours',
      8,
      'WEEKLY',
      120,
      'PUBLISHED',
      NOW(),
      NOW()
    );

END $$;

-- ========================================
-- 4. AFFICHER LES RÉSULTATS
-- ========================================

SELECT '✅ École créée :' as info;
SELECT s.name, c.city, s.status 
FROM public.schools s
JOIN public.contacts c ON s.contact_id = c.id;

SELECT '✅ Niveaux académiques créés :' as info;
SELECT al.display_name, al.name, s.name as school 
FROM public.ref_academic_levels al
JOIN public.schools s ON al.school_id = s.id;

SELECT '✅ Associations créées :' as info;
SELECT name, status FROM public.associations ORDER BY name;

SELECT '✅ Missions créées :' as info;
SELECT m.title, a.name as association, m.duration, m.maximum_participant
FROM public.missions m
JOIN public.associations a ON m.association_id = a.id
ORDER BY a.name, m.title;

SELECT '
========================================
✅ DONNÉES DE TEST CRÉÉES AVEC SUCCÈS !
========================================

Prochaines étapes :
1. Créer un compte étudiant via /login
2. Compléter l''onboarding en sélectionnant "Université Paris-Saclay"
3. Explorer les missions disponibles
4. Tester les dashboards école et association via :
   - http://localhost:3000/dashboard-school
   - http://localhost:3000/dashboard-association

Pour créer un admin d''association :
- Modifier le role dans user_profiles : UPDATE user_profiles SET role = ''ASSOCIATION'' WHERE user_id = ''ton_user_id'';

Pour créer un admin école :
- Modifier le role dans user_profiles : UPDATE user_profiles SET role = ''SCHOOL'' WHERE user_id = ''ton_user_id'';
' as instructions;
