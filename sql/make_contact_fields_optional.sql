-- Rendre les champs d'adresse optionnels dans la table contacts
-- pour permettre la création de contacts sans adresse complète

ALTER TABLE public.contacts 
  ALTER COLUMN country DROP NOT NULL,
  ALTER COLUMN city DROP NOT NULL,
  ALTER COLUMN postal_code DROP NOT NULL,
  ALTER COLUMN street DROP NOT NULL;

-- Vérification
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'contacts' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
