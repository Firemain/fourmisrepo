import { createClient } from '@/lib/supabase/server';
import { prisma } from '@fourmis/prisma';

/**
 * Récupère le profil utilisateur complet depuis la base de données
 * Inclut les relations (schoolMember, associationMember, schoolAdmin)
 * 
 * @returns Le profil utilisateur avec toutes les relations, ou null si non connecté
 */
export async function getUserProfile() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await prisma.userProfile.findUnique({
    where: { userId: user.id },
    include: {
      schoolMember: {
        include: {
          school: true,
          academicLevel: true,
          contact: true,
        },
      },
      associationMember: {
        include: {
          association: true,
          contact: true,
        },
      },
      schoolAdmin: {
        include: {
          school: true,
          contact: true,
        },
      },
    },
  });

  return profile;
}

/**
 * Récupère uniquement le profil de base (sans relations)
 * Plus rapide si tu n'as pas besoin des données complètes
 */
export async function getUserProfileBasic() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await prisma.userProfile.findUnique({
    where: { userId: user.id },
  });

  return profile;
}

/**
 * Type helper pour le profil complet avec relations
 */
export type UserProfileComplete = NonNullable<Awaited<ReturnType<typeof getUserProfile>>>;
