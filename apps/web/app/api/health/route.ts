import { NextResponse } from 'next/server';
import { prisma } from '@fourmis/prisma';

export async function GET() {
  try {
    // Test de connexion à la base de données
    await prisma.$connect();
    
    // Compter les associations
    const associationsCount = await prisma.association.count();
    
    // Compter les missions
    const missionsCount = await prisma.mission.count();
    
    // Compter les inscriptions
    const registrationsCount = await prisma.missionRegistration.count();

    return NextResponse.json({
      success: true,
      message: 'Connexion à la base de données réussie !',
      stats: {
        associations: associationsCount,
        missions: missionsCount,
        registrations: registrationsCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Erreur de connexion à la base de données',
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
