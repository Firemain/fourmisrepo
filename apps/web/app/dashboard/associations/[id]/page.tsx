import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AssociationDetailClient from './_components/AssociationDetailClient';

interface AssociationDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AssociationDetailPage({ params }: AssociationDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Vérifier l'authentification
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 2. Récupérer les détails de l'association
  const { data: association, error } = await supabase
    .from('associations')
    .select(`
      id,
      name,
      description,
      logo_url,
      site_url,
      email,
      contact:contacts (
        street,
        city,
        postal_code,
        phone_number
      ),
      tags:association_tags_relation (
        tag:association_tags (
          id,
          name
        )
      ),
      missions (
        id,
        title,
        description,
        start_at,
        end_at,
        maximum_participant,
        status,
        registrations:mission_registrations (id)
      ),
      members:association_members (id)
    `)
    .eq('id', id)
    .single();

  if (error || !association) {
    console.log('❌ Association not found:', error?.message);
    redirect('/dashboard/associations');
  }

  // 3. Formater les données
  const formattedAssociation = {
    id: association.id,
    name: association.name,
    description: association.description,
    logoUrl: association.logo_url,
    siteUrl: association.site_url,
    email: association.email,
    contact: association.contact
      ? {
          street: (association.contact as any).street,
          city: (association.contact as any).city,
          postalCode: (association.contact as any).postal_code,
          phoneNumber: (association.contact as any).phone_number,
        }
      : null,
    tags: (association.tags || []).map((t: any) => ({
      id: t.tag.id,
      name: t.tag.name,
    })),
    missions: (association.missions || []).map((m: any) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      startDate: m.start_at,
      endDate: m.end_at,
      maxParticipants: m.maximum_participant || 0,
      status: m.status,
      coverImageUrl: null, // Pas d'image de couverture dans le schéma actuel
      registrationsCount: m.registrations?.length || 0,
    })),
    stats: {
      missionsCount: association.missions?.length || 0,
      membersCount: association.members?.length || 0,
    },
  };

  return <AssociationDetailClient association={formattedAssociation} />;
}
