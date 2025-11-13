-- Vérifier les niveaux académiques disponibles
SELECT * FROM public.ref_academic_levels;

-- Si vide, créer un niveau par défaut
-- INSERT INTO public.ref_academic_levels (id, name, school_id)
-- VALUES ('11111111-1111-1111-1111-111111111111', 'Non renseigné', '22222222-2222-2222-2222-222222222222');
