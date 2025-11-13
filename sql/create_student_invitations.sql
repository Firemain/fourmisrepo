-- ============================================
-- Table des invitations étudiantes
-- ============================================

-- Créer la table student_invitations
CREATE TABLE IF NOT EXISTS student_invitations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  school_id TEXT NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  token TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_by TEXT REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Contrainte : une invitation active par email et école
  UNIQUE(school_id, email, used_at)
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_student_invitations_school_id ON student_invitations(school_id);
CREATE INDEX IF NOT EXISTS idx_student_invitations_email ON student_invitations(email);
CREATE INDEX IF NOT EXISTS idx_student_invitations_token ON student_invitations(token);
CREATE INDEX IF NOT EXISTS idx_student_invitations_expires_at ON student_invitations(expires_at);

-- Commentaires
COMMENT ON TABLE student_invitations IS 'Invitations envoyées par les écoles aux étudiants';
COMMENT ON COLUMN student_invitations.token IS 'Token unique pour le lien d''invitation';
COMMENT ON COLUMN student_invitations.expires_at IS 'Date d''expiration de l''invitation (7 jours par défaut)';
COMMENT ON COLUMN student_invitations.used_at IS 'Date d''utilisation de l''invitation (NULL si non utilisée)';
COMMENT ON COLUMN student_invitations.created_by IS 'Utilisateur de l''école qui a créé l''invitation';

-- Fonction pour nettoyer les invitations expirées (optionnel, pour cron job)
CREATE OR REPLACE FUNCTION cleanup_expired_invitations()
RETURNS void AS $$
BEGIN
  DELETE FROM student_invitations
  WHERE expires_at < NOW()
  AND used_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Vue pour les invitations actives (non expirées, non utilisées)
CREATE OR REPLACE VIEW active_student_invitations AS
SELECT 
  i.*,
  s.name as school_name,
  up.full_name as invited_by_name
FROM student_invitations i
JOIN schools s ON i.school_id = s.id
LEFT JOIN user_profiles up ON i.created_by = up.id
WHERE i.used_at IS NULL
AND i.expires_at > NOW();

COMMENT ON VIEW active_student_invitations IS 'Vue des invitations actives (non expirées et non utilisées)';
