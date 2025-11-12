'use client';

import { Search, Filter } from 'lucide-react';

interface Tag {
  id: string;
  name: string;
}

interface AssociationFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  selectedTag: string | null;
  onTagChange: (tagId: string | null) => void;
  tags: Tag[];
  locale: 'fr' | 'en';
}

export default function AssociationFilters({
  searchValue,
  onSearchChange,
  selectedTag,
  onTagChange,
  tags,
  locale,
}: AssociationFiltersProps) {
  const t = {
    fr: {
      search: 'Rechercher une association...',
      allDomains: 'Tous les domaines',
    },
    en: {
      search: 'Search for an association...',
      allDomains: 'All domains',
    },
  };

  const text = t[locale];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={text.search}
          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18534F] focus:border-transparent transition-all"
        />
      </div>

      {/* Filtres par tags */}
      {tags.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Filter size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Domaines d'action</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onTagChange(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedTag === null
                  ? 'bg-[#18534F] text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {text.allDomains}
            </button>
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => onTagChange(tag.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTag === tag.id
                    ? 'bg-[#18534F] text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
