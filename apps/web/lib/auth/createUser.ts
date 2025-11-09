import { createClient } from '@/lib/supabase/server';
import { prisma } from '@fourmis/prisma';

// ============================================
// TYPES
// ============================================

type StudentData = {
  schoolId: string;
  firstName: string;
  lastName: string;
  academicLevelId: string;
  contactId: string;
};

type AssociationMemberData = {
  associationId: string;
  firstName: string;
  lastName: string;
  contactId: string;
};

type SchoolAdminData = {
  schoolId: string;
  firstName: string;
  lastName: string;
  contactId: string;
};

type RoleSpecificData = StudentData | AssociationMemberData | SchoolAdminData;

// ============================================
// FONCTION PRINCIPALE
// ============================================

/**
 * Crée un utilisateur complet avec authentification + profil + données spécifiques au rôle
 * 
 * @param email - Email de l'utilisateur
 * @param password - Mot de passe
 * @param fullName - Nom complet
 * @param role - Rôle (STUDENT, ASSOCIATION, SCHOOL, ADMIN)
 * @param roleData - Données spécifiques selon le rôle
 * @returns Le profil utilisateur créé ou une erreur
 */
export async function createUserWithRole(
  email: string,
  password: string,
  fullName: string,
  role: 'STUDENT' | 'ASSOCIATION' | 'SCHOOL' | 'ADMIN',
  roleData?: RoleSpecificData
) {
  const supabase = await createClient();

  try {
    // 1. Créer l'utilisateur dans Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role,
          full_name: fullName,
        },
      },
    });

    if (authError) {
      return { error: authError.message, data: null };
    }

    if (!authData.user) {
      return { error: 'Utilisateur non créé', data: null };
    }

    // 2. Attendre un peu que le trigger crée le user_profile
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 3. Récupérer le profil créé par le trigger
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: authData.user.id },
    });

    if (!userProfile) {
      return { error: 'Profil non créé par le trigger', data: null };
    }

    // 4. Créer les données spécifiques selon le rôle
    if (roleData) {
      switch (role) {
        case 'STUDENT':
          const studentData = roleData as StudentData;
          await prisma.schoolMember.create({
            data: {
              schoolId: studentData.schoolId,
              firstName: studentData.firstName,
              lastName: studentData.lastName,
              type: 'STUDENT',
              academicLevelId: studentData.academicLevelId,
              contactId: studentData.contactId,
              email: email,
              userProfileId: userProfile.id, // ✅ Lien avec user_profiles.id
            },
          });
          break;

        case 'ASSOCIATION':
          const assoData = roleData as AssociationMemberData;
          await prisma.associationMember.create({
            data: {
              associationId: assoData.associationId,
              firstName: assoData.firstName,
              lastName: assoData.lastName,
              status: 'ACTIVE',
              contactId: assoData.contactId,
              email: email,
              userProfileId: userProfile.id, // ✅ Lien avec user_profiles.id
            },
          });
          break;

        case 'SCHOOL':
          const schoolData = roleData as SchoolAdminData;
          await prisma.schoolAdmin.create({
            data: {
              schoolId: schoolData.schoolId,
              firstName: schoolData.firstName,
              lastName: schoolData.lastName,
              contactId: schoolData.contactId,
              email: email,
              userProfileId: userProfile.id, // ✅ Lien avec user_profiles.id
            },
          });
          break;

        case 'ADMIN':
          // Les admins n'ont pas de données supplémentaires
          break;
      }
    }

    // 5. Récupérer le profil complet avec relations
    const completeProfile = await prisma.userProfile.findUnique({
      where: { id: userProfile.id },
      include: {
        schoolMember: {
          include: {
            school: true,
            academicLevel: true,
          },
        },
        associationMember: {
          include: {
            association: true,
          },
        },
        schoolAdmin: {
          include: {
            school: true,
          },
        },
      },
    });

    return { data: completeProfile, error: null };
  } catch (error: any) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    return { error: error.message, data: null };
  }
}

// ============================================
// FONCTION SIMPLIFIÉE (sans données de rôle)
// ============================================

/**
 * Crée un utilisateur simple (juste auth + profil, sans données spécifiques)
 * Utile pour les admins ou pour une inscription en 2 étapes
 */
export async function createSimpleUser(
  email: string,
  password: string,
  fullName: string,
  role: 'STUDENT' | 'ASSOCIATION' | 'SCHOOL' | 'ADMIN'
) {
  const supabase = await createClient();

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role,
          full_name: fullName,
        },
      },
    });

    if (authError) {
      return { error: authError.message, data: null };
    }

    // Attendre que le trigger crée le profil
    await new Promise((resolve) => setTimeout(resolve, 500));

    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: authData.user!.id },
    });

    return { data: userProfile, error: null };
  } catch (error: any) {
    return { error: error.message, data: null };
  }
}
