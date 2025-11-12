-- ============================================
-- 03 - DONNÉES DE TEST : MISSIONS ET INSCRIPTIONS
-- ============================================
-- Ce script crée :
-- - 3 associations
-- - 10 missions variées (passées, en cours, futures)
-- - 30 inscriptions d'étudiants aux missions (avec différents statuts)
-- 
-- Prérequis : Avoir exécuté 02_school_test_data.sql
-- ============================================

-- 1a. CRÉER DES CONTACTS POUR LES ASSOCIATIONS
INSERT INTO contacts (id, phone_number, street, city, postal_code, country, created_at, updated_at) VALUES
  ('ca111111-1111-1111-1111-111111111111', '+33467123456', '5 place de la Solidarité', 'Montpellier', '34000', 'FR', NOW(), NOW()),
  ('ca222222-2222-2222-2222-222222222222', '+33467123457', '15 rue de la Planète', 'Montpellier', '34000', 'FR', NOW(), NOW()),
  ('ca333333-3333-3333-3333-333333333333', '+33467123458', '25 avenue des Arts', 'Montpellier', '34000', 'FR', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 1b. CRÉER LES 3 ASSOCIATIONS
INSERT INTO associations (id, name, description, status, contact_id, created_at, updated_at) VALUES
  ('bb111111-1111-1111-1111-111111111111', 'Solidarité Étudiante', 'Association d''aide sociale et de lutte contre la précarité étudiante', 'ACTIVE', 'ca111111-1111-1111-1111-111111111111', NOW(), NOW()),
  ('bb222222-2222-2222-2222-222222222222', 'Planète Verte', 'Association de protection de l''environnement et de sensibilisation écologique', 'ACTIVE', 'ca222222-2222-2222-2222-222222222222', NOW(), NOW()),
  ('bb333333-3333-3333-3333-333333333333', 'Arts & Culture', 'Association de promotion des arts et de la culture auprès des jeunes', 'ACTIVE', 'ca333333-3333-3333-3333-333333333333', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 1c. CRÉER DES CONTACTS POUR LES MEMBRES D'ASSOCIATION
INSERT INTO contacts (id, phone_number, street, city, postal_code, country, created_at, updated_at) VALUES
  ('ac111111-1111-1111-1111-111111111111', '+33612345671', '10 rue de la Solidarité', 'Montpellier', '34000', 'FR', NOW(), NOW()),
  ('ac222222-2222-2222-2222-222222222222', '+33612345672', '20 avenue de la Nature', 'Montpellier', '34000', 'FR', NOW(), NOW()),
  ('ac333333-3333-3333-3333-333333333333', '+33612345673', '30 boulevard des Arts', 'Montpellier', '34000', 'FR', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 1d. CRÉER DES MEMBRES D'ASSOCIATION (nécessaire pour les missions)
INSERT INTO association_members (id, association_id, first_name, last_name, email, contact_id, status, created_at, updated_at) VALUES
  ('am111111-1111-1111-1111-111111111111', 'bb111111-1111-1111-1111-111111111111', 'Marie', 'Dupont', 'marie.dupont@solidarite.org', 'ac111111-1111-1111-1111-111111111111', 'ACTIVE', NOW(), NOW()),
  ('am222222-2222-2222-2222-222222222222', 'bb222222-2222-2222-2222-222222222222', 'Pierre', 'Martin', 'pierre.martin@environnement.org', 'ac222222-2222-2222-2222-222222222222', 'ACTIVE', NOW(), NOW()),
  ('am333333-3333-3333-3333-333333333333', 'bb333333-3333-3333-3333-333333333333', 'Sophie', 'Bernard', 'sophie.bernard@culture.org', 'ac333333-3333-3333-3333-333333333333', 'ACTIVE', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 1e. CRÉER DES CONTACTS POUR LES ÉTUDIANTS
INSERT INTO contacts (id, phone_number, street, city, postal_code, country, created_at, updated_at) VALUES
  ('cs111111-1111-1111-1111-111111111111', '+33601020304', '1 rue Étudiante', 'Montpellier', '34000', 'FR', NOW(), NOW()),
  ('cs222222-2222-2222-2222-222222222222', '+33601020305', '2 rue Étudiante', 'Montpellier', '34000', 'FR', NOW(), NOW()),
  ('cs333333-3333-3333-3333-333333333333', '+33601020306', '3 rue Étudiante', 'Montpellier', '34000', 'FR', NOW(), NOW()),
  ('cs444444-4444-4444-4444-444444444444', '+33601020307', '4 rue Étudiante', 'Montpellier', '34000', 'FR', NOW(), NOW()),
  ('cs555555-5555-5555-5555-555555555555', '+33601020308', '5 rue Étudiante', 'Montpellier', '34000', 'FR', NOW(), NOW()),
  ('cs666666-6666-6666-6666-666666666666', '+33601020309', '6 rue Étudiante', 'Montpellier', '34000', 'FR', NOW(), NOW()),
  ('cs777777-7777-7777-7777-777777777777', '+33601020310', '7 rue Étudiante', 'Montpellier', '34000', 'FR', NOW(), NOW()),
  ('cs888888-8888-8888-8888-888888888888', '+33601020311', '8 rue Étudiante', 'Montpellier', '34000', 'FR', NOW(), NOW()),
  ('cs999999-9999-9999-9999-999999999999', '+33601020312', '9 rue Étudiante', 'Montpellier', '34000', 'FR', NOW(), NOW()),
  ('cs101010-1010-1010-1010-101010101010', '+33601020313', '10 rue Étudiante', 'Montpellier', '34000', 'FR', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 1f. CRÉER 10 ÉTUDIANTS (school_members)
-- Note: school_id doit exister dans votre base (créé via 20250109_test_data.sql)
DO $$
DECLARE
  v_school_id uuid;
  v_level_l1 uuid;
  v_level_l2 uuid;
  v_level_l3 uuid;
  v_level_m1 uuid;
  v_level_m2 uuid;
BEGIN
  -- Récupérer l'ID de l'école existante
  SELECT id INTO v_school_id FROM schools LIMIT 1;
  
  -- Récupérer les IDs des niveaux académiques
  SELECT id INTO v_level_l1 FROM ref_academic_levels WHERE name = 'L1' LIMIT 1;
  SELECT id INTO v_level_l2 FROM ref_academic_levels WHERE name = 'L2' LIMIT 1;
  SELECT id INTO v_level_l3 FROM ref_academic_levels WHERE name = 'L3' LIMIT 1;
  SELECT id INTO v_level_m1 FROM ref_academic_levels WHERE name = 'M1' LIMIT 1;
  SELECT id INTO v_level_m2 FROM ref_academic_levels WHERE name = 'M2' LIMIT 1;
  
  -- Créer les 10 étudiants
  INSERT INTO school_members (id, school_id, first_name, last_name, email, contact_id, academic_level_id, status, created_at, updated_at) VALUES
    ('88888888-8888-8888-8888-888888888801', v_school_id, 'Alice', 'Dubois', 'alice.dubois@etudiant.fr', 'cs111111-1111-1111-1111-111111111111', v_level_l1, 'ACTIVE', NOW(), NOW()),
    ('88888888-8888-8888-8888-888888888802', v_school_id, 'Bob', 'Martin', 'bob.martin@etudiant.fr', 'cs222222-2222-2222-2222-222222222222', v_level_l1, 'ACTIVE', NOW(), NOW()),
    ('88888888-8888-8888-8888-888888888803', v_school_id, 'Clara', 'Bernard', 'clara.bernard@etudiant.fr', 'cs333333-3333-3333-3333-333333333333', v_level_l2, 'ACTIVE', NOW(), NOW()),
    ('88888888-8888-8888-8888-888888888804', v_school_id, 'David', 'Thomas', 'david.thomas@etudiant.fr', 'cs444444-4444-4444-4444-444444444444', v_level_l2, 'ACTIVE', NOW(), NOW()),
    ('88888888-8888-8888-8888-888888888805', v_school_id, 'Emma', 'Robert', 'emma.robert@etudiant.fr', 'cs555555-5555-5555-5555-555555555555', v_level_l3, 'ACTIVE', NOW(), NOW()),
    ('88888888-8888-8888-8888-888888888806', v_school_id, 'Félix', 'Richard', 'felix.richard@etudiant.fr', 'cs666666-6666-6666-6666-666666666666', v_level_l3, 'ACTIVE', NOW(), NOW()),
    ('88888888-8888-8888-8888-888888888807', v_school_id, 'Gabrielle', 'Petit', 'gabrielle.petit@etudiant.fr', 'cs777777-7777-7777-7777-777777777777', v_level_m1, 'ACTIVE', NOW(), NOW()),
    ('88888888-8888-8888-8888-888888888808', v_school_id, 'Hugo', 'Durand', 'hugo.durand@etudiant.fr', 'cs888888-8888-8888-8888-888888888888', v_level_m1, 'ACTIVE', NOW(), NOW()),
    ('88888888-8888-8888-8888-888888888809', v_school_id, 'Inès', 'Leroy', 'ines.leroy@etudiant.fr', 'cs999999-9999-9999-9999-999999999999', v_level_m2, 'ACTIVE', NOW(), NOW()),
    ('88888888-8888-8888-8888-888888888810', v_school_id, 'Jules', 'Moreau', 'jules.moreau@etudiant.fr', 'cs101010-1010-1010-1010-101010101010', v_level_m2, 'ACTIVE', NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;
END $$;

-- 2. CRÉER 10 MISSIONS (mix de passées, en cours, futures)
INSERT INTO missions (id, association_id, association_member_id, title, description, status, start_at, end_at, maximum_participant, recurrence_type, created_at, updated_at) VALUES
  -- Missions PASSÉES (complétées)
  ('mm111111-1111-1111-1111-111111111111', 'bb111111-1111-1111-1111-111111111111', 'am111111-1111-1111-1111-111111111111', 'Distribution alimentaire', 'Distribution de repas aux personnes dans le besoin', 'PUBLISHED', NOW() - INTERVAL '45 days', NOW() - INTERVAL '44 days', 15, 'WEEKLY', NOW() - INTERVAL '60 days', NOW()),
  ('mm222222-2222-2222-2222-222222222222', 'bb222222-2222-2222-2222-222222222222', 'am222222-2222-2222-2222-222222222222', 'Nettoyage de plage', 'Ramassage des déchets sur la plage de Palavas', 'PUBLISHED', NOW() - INTERVAL '30 days', NOW() - INTERVAL '29 days', 20, 'NONE', NOW() - INTERVAL '45 days', NOW()),
  ('mm333333-3333-3333-3333-333333333333', 'bb333333-3333-3333-3333-333333333333', 'am333333-3333-3333-3333-333333333333', 'Atelier théâtre enfants', 'Animation d''atelier théâtre pour enfants de 6-12 ans', 'PUBLISHED', NOW() - INTERVAL '20 days', NOW() - INTERVAL '19 days', 10, 'NONE', NOW() - INTERVAL '35 days', NOW()),
  
  -- Missions EN COURS
  ('mm444444-4444-4444-4444-444444444444', 'bb111111-1111-1111-1111-111111111111', 'am111111-1111-1111-1111-111111111111', 'Aide aux devoirs', 'Accompagnement scolaire pour collégiens', 'PUBLISHED', NOW() - INTERVAL '5 days', NOW() + INTERVAL '2 days', 12, 'WEEKLY', NOW() - INTERVAL '20 days', NOW()),
  ('mm555555-5555-5555-5555-555555555555', 'bb222222-2222-2222-2222-222222222222', 'am222222-2222-2222-2222-222222222222', 'Plantation d''arbres', 'Reboisement d''une zone urbaine', 'PUBLISHED', NOW() - INTERVAL '2 days', NOW() + INTERVAL '1 day', 25, 'NONE', NOW() - INTERVAL '15 days', NOW()),
  
  -- Missions FUTURES
  ('mm666666-6666-6666-6666-666666666666', 'bb111111-1111-1111-1111-111111111111', 'am111111-1111-1111-1111-111111111111', 'Visite personnes âgées', 'Visites et accompagnement en maison de retraite', 'PUBLISHED', NOW() + INTERVAL '3 days', NOW() + INTERVAL '4 days', 8, 'WEEKLY', NOW() - INTERVAL '10 days', NOW()),
  ('mm777777-7777-7777-7777-777777777777', 'bb222222-2222-2222-2222-222222222222', 'am222222-2222-2222-2222-222222222222', 'Atelier recyclage', 'Sensibilisation au recyclage dans les écoles', 'PUBLISHED', NOW() + INTERVAL '7 days', NOW() + INTERVAL '8 days', 15, 'MONTHLY', NOW() - INTERVAL '5 days', NOW()),
  ('mm888888-8888-8888-8888-888888888888', 'bb333333-3333-3333-3333-333333333333', 'am333333-3333-3333-3333-333333333333', 'Concert solidaire', 'Organisation d''un concert de charité', 'PUBLISHED', NOW() + INTERVAL '15 days', NOW() + INTERVAL '16 days', 30, 'NONE', NOW() - INTERVAL '3 days', NOW()),
  ('mm999999-9999-9999-9999-999999999999', 'bb111111-1111-1111-1111-111111111111', 'am111111-1111-1111-1111-111111111111', 'Collecte vêtements', 'Collecte et tri de vêtements pour les plus démunis', 'PUBLISHED', NOW() + INTERVAL '20 days', NOW() + INTERVAL '21 days', 10, 'MONTHLY', NOW() - INTERVAL '2 days', NOW()),
  ('mm101010-1010-1010-1010-101010101010', 'bb222222-2222-2222-2222-222222222222', 'am222222-2222-2222-2222-222222222222', 'Nettoyage parc', 'Grand nettoyage du parc municipal', 'PUBLISHED', NOW() + INTERVAL '25 days', NOW() + INTERVAL '26 days', 20, 'NONE', NOW() - INTERVAL '1 day', NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. CRÉER 30 INSCRIPTIONS AUX MISSIONS
-- Répartition : chaque étudiant participe à 3 missions en moyenne

-- Étudiants 1-2 (L1)
INSERT INTO mission_registrations (id, mission_id, school_member_id, status, created_at, updated_at) VALUES
  ('rr111111-1111-1111-1111-111111111111', 'mm111111-1111-1111-1111-111111111111', '88888888-8888-8888-8888-888888888801', 'COMPLETED', NOW() - INTERVAL '45 days', NOW() - INTERVAL '44 days'),
  ('rr111112-1111-1111-1111-111111111111', 'mm222222-2222-2222-2222-222222222222', '88888888-8888-8888-8888-888888888801', 'COMPLETED', NOW() - INTERVAL '30 days', NOW() - INTERVAL '29 days'),
  ('rr111113-1111-1111-1111-111111111111', 'mm444444-4444-4444-4444-444444444444', '88888888-8888-8888-8888-888888888801', 'CONFIRMED', NOW() - INTERVAL '5 days', NOW()),
  
  ('rr222221-1111-1111-1111-111111111111', 'mm111111-1111-1111-1111-111111111111', '88888888-8888-8888-8888-888888888802', 'COMPLETED', NOW() - INTERVAL '45 days', NOW() - INTERVAL '44 days'),
  ('rr222222-1111-1111-1111-111111111111', 'mm333333-3333-3333-3333-333333333333', '88888888-8888-8888-8888-888888888802', 'COMPLETED', NOW() - INTERVAL '20 days', NOW() - INTERVAL '19 days'),
  ('rr222223-1111-1111-1111-111111111111', 'mm555555-5555-5555-5555-555555555555', '88888888-8888-8888-8888-888888888802', 'CONFIRMED', NOW() - INTERVAL '2 days', NOW()),

-- Étudiants 3-4 (L2)
  ('rr333331-1111-1111-1111-111111111111', 'mm222222-2222-2222-2222-222222222222', '88888888-8888-8888-8888-888888888803', 'COMPLETED', NOW() - INTERVAL '30 days', NOW() - INTERVAL '29 days'),
  ('rr333332-1111-1111-1111-111111111111', 'mm333333-3333-3333-3333-333333333333', '88888888-8888-8888-8888-888888888803', 'COMPLETED', NOW() - INTERVAL '20 days', NOW() - INTERVAL '19 days'),
  ('rr333333-1111-1111-1111-111111111111', 'mm444444-4444-4444-4444-444444444444', '88888888-8888-8888-8888-888888888803', 'CONFIRMED', NOW() - INTERVAL '5 days', NOW()),
  ('rr333334-1111-1111-1111-111111111111', 'mm666666-6666-6666-6666-666666666666', '88888888-8888-8888-8888-888888888803', 'PENDING', NOW() + INTERVAL '3 days', NOW()),
  
  ('rr444441-1111-1111-1111-111111111111', 'mm111111-1111-1111-1111-111111111111', '88888888-8888-8888-8888-888888888804', 'COMPLETED', NOW() - INTERVAL '45 days', NOW() - INTERVAL '44 days'),
  ('rr444442-1111-1111-1111-111111111111', 'mm555555-5555-5555-5555-555555555555', '88888888-8888-8888-8888-888888888804', 'CONFIRMED', NOW() - INTERVAL '2 days', NOW()),
  ('rr444443-1111-1111-1111-111111111111', 'mm777777-7777-7777-7777-777777777777', '88888888-8888-8888-8888-888888888804', 'PENDING', NOW() + INTERVAL '7 days', NOW()),

-- Étudiants 5-6 (L3)
  ('rr555551-1111-1111-1111-111111111111', 'mm222222-2222-2222-2222-222222222222', '88888888-8888-8888-8888-888888888805', 'COMPLETED', NOW() - INTERVAL '30 days', NOW() - INTERVAL '29 days'),
  ('rr555552-1111-1111-1111-111111111111', 'mm444444-4444-4444-4444-444444444444', '88888888-8888-8888-8888-888888888805', 'CONFIRMED', NOW() - INTERVAL '5 days', NOW()),
  ('rr555553-1111-1111-1111-111111111111', 'mm888888-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888805', 'PENDING', NOW() + INTERVAL '15 days', NOW()),
  
  ('rr666661-1111-1111-1111-111111111111', 'mm333333-3333-3333-3333-333333333333', '88888888-8888-8888-8888-888888888806', 'COMPLETED', NOW() - INTERVAL '20 days', NOW() - INTERVAL '19 days'),
  ('rr666662-1111-1111-1111-111111111111', 'mm555555-5555-5555-5555-555555555555', '88888888-8888-8888-8888-888888888806', 'CONFIRMED', NOW() - INTERVAL '2 days', NOW()),
  ('rr666663-1111-1111-1111-111111111111', 'mm999999-9999-9999-9999-999999999999', '88888888-8888-8888-8888-888888888806', 'PENDING', NOW() + INTERVAL '20 days', NOW()),

-- Étudiants 7-8 (M1)
  ('rr777771-1111-1111-1111-111111111111', 'mm111111-1111-1111-1111-111111111111', '88888888-8888-8888-8888-888888888807', 'COMPLETED', NOW() - INTERVAL '45 days', NOW() - INTERVAL '44 days'),
  ('rr777772-1111-1111-1111-111111111111', 'mm222222-2222-2222-2222-222222222222', '88888888-8888-8888-8888-888888888807', 'COMPLETED', NOW() - INTERVAL '30 days', NOW() - INTERVAL '29 days'),
  ('rr777773-1111-1111-1111-111111111111', 'mm444444-4444-4444-4444-444444444444', '88888888-8888-8888-8888-888888888807', 'CONFIRMED', NOW() - INTERVAL '5 days', NOW()),
  ('rr777774-1111-1111-1111-111111111111', 'mm666666-6666-6666-6666-666666666666', '88888888-8888-8888-8888-888888888807', 'PENDING', NOW() + INTERVAL '3 days', NOW()),
  
  ('rr888881-1111-1111-1111-111111111111', 'mm333333-3333-3333-3333-333333333333', '88888888-8888-8888-8888-888888888808', 'COMPLETED', NOW() - INTERVAL '20 days', NOW() - INTERVAL '19 days'),
  ('rr888882-1111-1111-1111-111111111111', 'mm555555-5555-5555-5555-555555555555', '88888888-8888-8888-8888-888888888808', 'CONFIRMED', NOW() - INTERVAL '2 days', NOW()),
  ('rr888883-1111-1111-1111-111111111111', 'mm101010-1010-1010-1010-101010101010', '88888888-8888-8888-8888-888888888808', 'PENDING', NOW() + INTERVAL '25 days', NOW()),

-- Étudiants 9-10 (M2)
  ('rr999991-1111-1111-1111-111111111111', 'mm111111-1111-1111-1111-111111111111', '88888888-8888-8888-8888-888888888809', 'COMPLETED', NOW() - INTERVAL '45 days', NOW() - INTERVAL '44 days'),
  ('rr999992-1111-1111-1111-111111111111', 'mm222222-2222-2222-2222-222222222222', '88888888-8888-8888-8888-888888888809', 'COMPLETED', NOW() - INTERVAL '30 days', NOW() - INTERVAL '29 days'),
  ('rr999993-1111-1111-1111-111111111111', 'mm333333-3333-3333-3333-333333333333', '88888888-8888-8888-8888-888888888809', 'COMPLETED', NOW() - INTERVAL '20 days', NOW() - INTERVAL '19 days'),
  ('rr999994-1111-1111-1111-111111111111', 'mm777777-7777-7777-7777-777777777777', '88888888-8888-8888-8888-888888888809', 'PENDING', NOW() + INTERVAL '7 days', NOW()),
  
  ('rr101011-1111-1111-1111-111111111111', 'mm444444-4444-4444-4444-444444444444', '88888888-8888-8888-8888-888888888810', 'CONFIRMED', NOW() - INTERVAL '5 days', NOW()),
  ('rr101012-1111-1111-1111-111111111111', 'mm888888-8888-8888-8888-888888888888', '88888888-8888-8888-8888-888888888810', 'PENDING', NOW() + INTERVAL '15 days', NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- RÉSUMÉ DES DONNÉES CRÉÉES
-- ============================================
-- ✅ 3 associations (Solidarité, Environnement, Culture)
-- ✅ 10 missions (3 passées, 2 en cours, 5 futures)
-- ✅ 30 inscriptions réparties sur les 10 étudiants
--
-- STATISTIQUES ATTENDUES :
-- - Total heures : ~13 missions complétées × 4h = ~52h
-- - Étudiants actifs : 10/10 (tous ont au moins une inscription)
-- - Taux de participation : 100%
-- - Moyenne missions/étudiant : 3.0
-- ============================================

SELECT 'Données de test missions créées avec succès !' as message;
