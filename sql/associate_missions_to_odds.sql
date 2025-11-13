-- ============================================
-- Associer les missions aux ODDs appropriés
-- ============================================

-- Note: Exécuter d'abord create_mission_odds_table.sql et populate_odds.sql

-- 1. Formation PSC1 → ODD 3 (Santé)
INSERT INTO mission_odds (mission_id, odd_id)
SELECT 
  '3e188483-106f-4cad-92ad-d49eab2fa856',
  id
FROM odds WHERE number = 3
ON CONFLICT (mission_id, odd_id) DO NOTHING;

-- 2. Collecte de dons alimentaires → ODD 2 (Faim zéro)
INSERT INTO mission_odds (mission_id, odd_id)
SELECT 
  'mm444444-4444-4444-4444-444444444444',
  id
FROM odds WHERE number = 2
ON CONFLICT (mission_id, odd_id) DO NOTHING;

-- 3. Tri des dons → ODD 2 (Faim zéro)
INSERT INTO mission_odds (mission_id, odd_id)
SELECT 
  'mm666666-6666-6666-6666-666666666666',
  id
FROM odds WHERE number = 2
ON CONFLICT (mission_id, odd_id) DO NOTHING;

-- 4. Livraison à domicile → ODD 1 (Pas de pauvreté) + ODD 2 (Faim zéro)
INSERT INTO mission_odds (mission_id, odd_id)
SELECT 
  'mm111100-1111-1111-1111-111111111111',
  id
FROM odds WHERE number IN (1, 2)
ON CONFLICT (mission_id, odd_id) DO NOTHING;

-- 5. Banque alimentaire → ODD 2 (Faim zéro)
INSERT INTO mission_odds (mission_id, odd_id)
SELECT 
  'mm222200-2222-2222-2222-222222222222',
  id
FROM odds WHERE number = 2
ON CONFLICT (mission_id, odd_id) DO NOTHING;

-- 6. Sensibilisation gaspillage → ODD 12 (Consommation responsable)
INSERT INTO mission_odds (mission_id, odd_id)
SELECT 
  'mm333300-3333-3333-3333-333333333333',
  id
FROM odds WHERE number = 12
ON CONFLICT (mission_id, odd_id) DO NOTHING;

-- 7. Atelier Initiation au Code → ODD 4 (Éducation de qualité)
INSERT INTO mission_odds (mission_id, odd_id)
SELECT 
  'bf5ca991-b59c-4e69-87be-5ccc81f7dcc4',
  id
FROM odds WHERE number = 4
ON CONFLICT (mission_id, odd_id) DO NOTHING;

-- 8. Atelier Python → ODD 4 (Éducation de qualité)
INSERT INTO mission_odds (mission_id, odd_id)
SELECT 
  'mm777777-7777-7777-7777-777777777777',
  id
FROM odds WHERE number = 4
ON CONFLICT (mission_id, odd_id) DO NOTHING;

-- 9. Hackathon étudiant → ODD 9 (Industrie, innovation et infrastructure)
INSERT INTO mission_odds (mission_id, odd_id)
SELECT 
  'mm888888-8888-8888-8888-888888888888',
  id
FROM odds WHERE number = 9
ON CONFLICT (mission_id, odd_id) DO NOTHING;

-- 10. Atelier Web Dev → ODD 4 (Éducation de qualité)
INSERT INTO mission_odds (mission_id, odd_id)
SELECT 
  'mm999999-9999-9999-9999-999999999999',
  id
FROM odds WHERE number = 4
ON CONFLICT (mission_id, odd_id) DO NOTHING;

-- 11. Conférence IA → ODD 9 (Industrie, innovation)
INSERT INTO mission_odds (mission_id, odd_id)
SELECT 
  'mm101010-1010-1010-1010-101010101010',
  id
FROM odds WHERE number = 9
ON CONFLICT (mission_id, odd_id) DO NOTHING;

-- 12. Organisation Soirée de Rentrée → ODD 11 (Villes et communautés durables)
INSERT INTO mission_odds (mission_id, odd_id)
SELECT 
  '7821da32-ac10-4751-9f10-09d0b60e6965',
  id
FROM odds WHERE number = 11
ON CONFLICT (mission_id, odd_id) DO NOTHING;

-- Vérification
SELECT 
  m.title as mission,
  o.number as odd_number,
  o.name as odd_name,
  o.category,
  o.color
FROM mission_odds mo
JOIN missions m ON mo.mission_id = m.id
JOIN odds o ON mo.odd_id = o.id
ORDER BY o.number;
