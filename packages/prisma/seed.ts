import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seed...');

  // 1. Créer des contacts
  const contact1 = await prisma.contact.create({
    data: {
      country: 'France',
      city: 'Paris',
      postalCode: '75001',
      street: '1 Rue de la Paix',
      phoneNumber: '+33123456789',
    },
  });

  const contact2 = await prisma.contact.create({
    data: {
      country: 'France',
      city: 'Lyon',
      postalCode: '69001',
      street: '10 Place Bellecour',
      phoneNumber: '+33987654321',
    },
  });

  console.log('✅ Contacts créés');

  // 2. Créer une école
  const school = await prisma.school.create({
    data: {
      name: 'Université Paris Sciences',
      contactId: contact1.id,
      type: 'UNIVERSITY',
      status: 'ACTIVE',
    },
  });

  console.log('✅ École créée');

  // 3. Créer un niveau académique
  const academicLevel = await prisma.refAcademicLevel.create({
    data: {
      name: 'L3_INFO',
      displayName: 'Licence 3 Informatique',
      schoolId: school.id,
    },
  });

  console.log('✅ Niveau académique créé');

  // 4. Créer des associations
  const association1 = await prisma.association.create({
    data: {
      name: 'Les Restos du Cœur',
      description: 'Association caritative française fondée en 1985 par Coluche',
      email: 'contact@restosducoeur.org',
      status: 'ACTIVE',
      contactId: contact2.id,
    },
  });

  const association2 = await prisma.association.create({
    data: {
      name: 'Emmaüs',
      description: 'Mouvement laïc de lutte contre la pauvreté et l\'exclusion',
      email: 'contact@emmaus-france.org',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Associations créées');

  // 5. Créer des membres d'association
  const assoMember1 = await prisma.associationMember.create({
    data: {
      associationId: association1.id,
      firstName: 'Marie',
      lastName: 'Dubois',
      email: 'marie.dubois@restosducoeur.org',
      status: 'ACTIVE',
      contactId: contact2.id,
    },
  });

  const assoMember2 = await prisma.associationMember.create({
    data: {
      associationId: association2.id,
      firstName: 'Pierre',
      lastName: 'Martin',
      email: 'pierre.martin@emmaus-france.org',
      status: 'ACTIVE',
      contactId: contact2.id,
    },
  });

  console.log('✅ Membres d\'association créés');

  // 6. Créer des tags de mission
  const tag1 = await prisma.missionTag.create({
    data: { name: 'Solidarité' },
  });

  const tag2 = await prisma.missionTag.create({
    data: { name: 'Environnement' },
  });

  const tag3 = await prisma.missionTag.create({
    data: { name: 'Éducation' },
  });

  console.log('✅ Tags créés');

  // 7. Créer des missions
  const mission1 = await prisma.mission.create({
    data: {
      associationId: association1.id,
      associationMemberId: assoMember1.id,
      title: 'Distribution de repas',
      description: 'Aide à la distribution de repas chauds pour les personnes dans le besoin',
      startAt: new Date('2024-12-01T09:00:00'),
      endAt: new Date('2024-12-01T13:00:00'),
      maximumParticipant: 10,
      duration: 240, // 4 heures
      status: 'PUBLISHED',
      recurrenceType: 'WEEKLY',
    },
  });

  const mission2 = await prisma.mission.create({
    data: {
      associationId: association1.id,
      associationMemberId: assoMember1.id,
      title: 'Collecte alimentaire',
      description: 'Participation à une collecte alimentaire en supermarché',
      startAt: new Date('2024-12-15T14:00:00'),
      endAt: new Date('2024-12-15T18:00:00'),
      maximumParticipant: 15,
      duration: 240,
      status: 'PUBLISHED',
      recurrenceType: 'NONE',
    },
  });

  const mission3 = await prisma.mission.create({
    data: {
      associationId: association2.id,
      associationMemberId: assoMember2.id,
      title: 'Tri de vêtements',
      description: 'Aide au tri et à l\'organisation des dons de vêtements',
      startAt: new Date('2024-12-10T10:00:00'),
      endAt: new Date('2024-12-10T16:00:00'),
      maximumParticipant: 8,
      duration: 360, // 6 heures
      status: 'PUBLISHED',
      recurrenceType: 'MONTHLY',
    },
  });

  console.log('✅ Missions créées');

  // 8. Lier les tags aux missions
  await prisma.missionTags.createMany({
    data: [
      { missionId: mission1.id, tagId: tag1.id },
      { missionId: mission2.id, tagId: tag1.id },
      { missionId: mission3.id, tagId: tag1.id },
      { missionId: mission3.id, tagId: tag2.id },
    ],
  });

  console.log('✅ Tags liés aux missions');

  // 9. Créer un étudiant
  const student = await prisma.schoolMember.create({
    data: {
      schoolId: school.id,
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean.dupont@university.fr',
      type: 'STUDENT',
      academicLevelId: academicLevel.id,
      contactId: contact1.id,
    },
  });

  console.log('✅ Étudiant créé');

  // 10. Créer des inscriptions
  await prisma.missionRegistration.createMany({
    data: [
      {
        missionId: mission1.id,
        schoolMemberId: student.id,
        status: 'CONFIRMED',
      },
      {
        missionId: mission3.id,
        schoolMemberId: student.id,
        status: 'PENDING',
      },
    ],
  });

  console.log('✅ Inscriptions créées');

  console.log('\n🎉 Seed terminé avec succès !');
  console.log('\nRésumé :');
  console.log(`- ${await prisma.school.count()} école(s)`);
  console.log(`- ${await prisma.association.count()} association(s)`);
  console.log(`- ${await prisma.mission.count()} mission(s)`);
  console.log(`- ${await prisma.schoolMember.count()} étudiant(s)`);
  console.log(`- ${await prisma.missionRegistration.count()} inscription(s)`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
