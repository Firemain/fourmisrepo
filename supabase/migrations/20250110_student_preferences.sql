-- Migration: Student Preferences Table
-- Description: Table pour stocker les préférences des étudiants pour le ML et les recommandations
-- Date: 2025-01-10

-- Create student_preferences table
CREATE TABLE IF NOT EXISTS public.student_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_profile_id TEXT NOT NULL UNIQUE REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    
    -- Préférences structurées
    interests TEXT[] DEFAULT '{}',
    availability TEXT,
    group_size TEXT,
    
    -- Swipes de missions (JSON pour flexibility)
    mission_swipes JSONB,
    
    -- Métadonnées
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_student_preferences_user_id ON public.student_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_student_preferences_user_profile_id ON public.student_preferences(user_profile_id);
CREATE INDEX IF NOT EXISTS idx_student_preferences_interests ON public.student_preferences USING GIN(interests);
CREATE INDEX IF NOT EXISTS idx_student_preferences_mission_swipes ON public.student_preferences USING GIN(mission_swipes);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_student_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
CREATE TRIGGER trigger_update_student_preferences_updated_at
    BEFORE UPDATE ON public.student_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_student_preferences_updated_at();

-- RLS Policies
ALTER TABLE public.student_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: Les étudiants peuvent voir leurs propres préférences
CREATE POLICY "Students can view their own preferences"
    ON public.student_preferences
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Les étudiants peuvent insérer leurs propres préférences
CREATE POLICY "Students can insert their own preferences"
    ON public.student_preferences
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Les étudiants peuvent mettre à jour leurs propres préférences
CREATE POLICY "Students can update their own preferences"
    ON public.student_preferences
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Les étudiants peuvent supprimer leurs propres préférences
CREATE POLICY "Students can delete their own preferences"
    ON public.student_preferences
    FOR DELETE
    USING (auth.uid() = user_id);

-- Policy: Les admins peuvent tout voir (optionnel)
CREATE POLICY "Admins can view all preferences"
    ON public.student_preferences
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE user_profiles.user_id = auth.uid()
            AND user_profiles.role = 'ADMIN'
        )
    );

-- Commentaires pour la documentation
COMMENT ON TABLE public.student_preferences IS 'Préférences des étudiants pour les recommandations ML';
COMMENT ON COLUMN public.student_preferences.interests IS 'Domaines d''intérêt (Éducation, Environnement, Sport, etc.)';
COMMENT ON COLUMN public.student_preferences.availability IS 'Disponibilité habituelle (1-2h, 3-5h, etc.)';
COMMENT ON COLUMN public.student_preferences.group_size IS 'Préférence de taille de groupe (Seul, Petit groupe, etc.)';
COMMENT ON COLUMN public.student_preferences.mission_swipes IS 'Historique des swipes de missions au format JSON: [{"missionId": "...", "liked": true, "timestamp": "..."}]';
COMMENT ON COLUMN public.student_preferences.completed_at IS 'Date de completion du questionnaire initial';
