-- Migration: Ajouter contact_id à la table missions et supprimer address
-- Date: 2025-01-11
-- Description: Ajoute une référence au contact pour stocker l'adresse de la mission
--              et supprime l'ancien champ address (deprecated)

-- 1. Ajouter la colonne contact_id (TEXT pour matcher contacts.id)
ALTER TABLE missions
ADD COLUMN contact_id TEXT;

-- 2. Ajouter la contrainte de clé étrangère
ALTER TABLE missions
ADD CONSTRAINT missions_contact_id_fkey
FOREIGN KEY (contact_id)
REFERENCES contacts(id)
ON DELETE SET NULL;

-- 3. Créer un index pour améliorer les performances
CREATE INDEX idx_missions_contact_id ON missions(contact_id);

-- 4. Supprimer la colonne address (deprecated, remplacé par contact_id)
ALTER TABLE missions
DROP COLUMN IF EXISTS address;

-- Note: end_at est conservé car utilisé pour les missions ponctuelles (date de fin)
--       Pour les missions récurrentes, end_at représente la date de dernière occurrence
