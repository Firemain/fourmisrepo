-- Migration: Ajouter le champ address à la table missions
-- Date: 2025-01-10
-- Description: Ajoute une colonne pour stocker l'adresse/lieu de la mission

-- Ajouter la colonne address
ALTER TABLE missions
ADD COLUMN address TEXT;

-- Commentaire pour documenter le champ
COMMENT ON COLUMN missions.address IS 'Adresse ou lieu où se déroule la mission';
