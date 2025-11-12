import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AssociationsClient from './_components/AssociationsClient';

export default async function AssociationsPage() {
  const supabase = await createClient();

  // 1. Vérifier l'authentification
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 2. Récupérer toutes les associations avec leurs informations
  const { data: associations, error } = await supabase
    .from('associations')
    .select(`
      id,
      name,
      description,
      logo_url,
      site_url,
      status,
      email,
      contact:contacts (
        street,
        city,
        postal_code,
        country
      ),
      tags:association_tags_relation (
        tag:association_tags (
          id,
          name
        )
      ),
      missions (
        id
      ),
      members:association_members (
        id
      )
    `)
    .eq('status', 'ACTIVE')
    .order('name');

  if (error) {
    console.error('Error fetching associations:', error);
  }

  // 3. Formater les données
  const formattedAssociations = (associations || []).map((assoc) => ({
    id: assoc.id,
    name: assoc.name,
    description: assoc.description || '',
    logoUrl: assoc.logo_url,
    siteUrl: assoc.site_url,
    email: assoc.email,
    location: assoc.contact ? {
      city: assoc.contact.city,
      postalCode: assoc.contact.postal_code,
      country: assoc.contact.country,
    } : null,
    tags: assoc.tags?.map((t: any) => ({
      id: t.tag.id,
      name: t.tag.name,
    })) || [],
    stats: {
      missionsCount: assoc.missions?.length || 0,
      membersCount: assoc.members?.length || 0,
    },
  }));

  return <AssociationsClient associations={formattedAssociations} />;
}
