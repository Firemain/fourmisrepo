'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/i18n/LocaleContext';
import AssociationCard from './AssociationCard';
import AssociationFilters from './AssociationFilters';
import { Users, Search } from 'lucide-react';

interface Association {
  id: string;
  name: string;
  description: string;
  logoUrl: string | null;
  siteUrl: string | null;
  email: string | null;
  location: {
    city: string;
    postalCode: string;
    country: string;
  } | null;
  tags: Array<{
    id: string;
    name: string;
  }>;
  stats: {
    missionsCount: number;
    membersCount: number;
  };
}

interface AssociationsClientProps {
  associations: Association[];
}

export default function AssociationsClient({ associations }: AssociationsClientProps) {
  const { locale } = useLocale();
  const [searchValue, setSearchValue] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const t = {
    fr: {
      title: 'Associations',
      subtitle: 'Découvre les associations partenaires de ton école',
      search: 'Rechercher une association...',
      allTags: 'Tous les domaines',
      noResults: 'Aucune association trouvée',
      tryAdjust: 'Essaie d\'ajuster tes critères de recherche',
      association: 'association',
      associations: 'associations',
    },
    en: {
      title: 'Associations',
      subtitle: 'Discover partner associations from your school',
      search: 'Search for an association...',
      allTags: 'All domains',
      noResults: 'No associations found',
      tryAdjust: 'Try adjusting your search criteria',
      association: 'association',
      associations: 'associations',
    },
  };

  const text = t[locale];

  // Extraire tous les tags uniques
  const allTags = Array.from(
    new Set(
      associations.flatMap((a) => a.tags.map((t) => JSON.stringify({ id: t.id, name: t.name })))
    )
  ).map((t) => JSON.parse(t));

  // Filtrer les associations
  const filteredAssociations = associations.filter((assoc) => {
    const matchesSearch = 
      searchValue === '' ||
      assoc.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      assoc.description.toLowerCase().includes(searchValue.toLowerCase()) ||
      assoc.location?.city.toLowerCase().includes(searchValue.toLowerCase());

    const matchesTag = 
      !selectedTag || 
      assoc.tags.some((tag) => tag.id === selectedTag);

    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#ECF8F6]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto p-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-[#18534F]" size={32} />
            <h1 className="text-4xl font-bold text-gray-900">{text.title}</h1>
          </div>
          <p className="text-[#226D68] text-lg">{text.subtitle}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8 space-y-6">
        {/* Filtres */}
        <AssociationFilters
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
          tags={allTags}
          locale={locale}
        />

        {/* Compteur */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{filteredAssociations.length}</span>{' '}
            {filteredAssociations.length > 1 ? text.associations : text.association}
          </p>
        </div>

        {/* Grille d'associations */}
        {filteredAssociations.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssociations.map((association) => (
              <AssociationCard 
                key={association.id} 
                association={association} 
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {text.noResults}
            </h3>
            <p className="text-gray-600">{text.tryAdjust}</p>
          </div>
        )}
      </div>
    </div>
  );
}
