-- ============================================
-- Table de jonction Mission-ODD
-- ============================================

-- Créer la table mission_odds
CREATE TABLE IF NOT EXISTS mission_odds (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  mission_id TEXT NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  odd_id TEXT NOT NULL REFERENCES odds(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contrainte d'unicité pour éviter les doublons
  UNIQUE(mission_id, odd_id)
);

-- Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_mission_odds_mission_id ON mission_odds(mission_id);
CREATE INDEX IF NOT EXISTS idx_mission_odds_odd_id ON mission_odds(odd_id);

-- Commentaires
COMMENT ON TABLE mission_odds IS 'Table de jonction entre les missions et les ODDs (Objectifs de Développement Durable)';
COMMENT ON COLUMN mission_odds.mission_id IS 'Référence vers la mission';
COMMENT ON COLUMN mission_odds.odd_id IS 'Référence vers l''ODD';
