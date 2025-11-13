-- Ajouter le default UUID pour l'id de school_members
ALTER TABLE public.school_members 
  ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Vérification
SELECT column_name, column_default 
FROM information_schema.columns 
WHERE table_name = 'school_members' 
  AND column_name = 'id';
