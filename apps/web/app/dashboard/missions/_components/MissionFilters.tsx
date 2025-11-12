'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MissionFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function MissionFilters({
  searchValue,
  onSearchChange,
  activeFilter,
  onFilterChange
}: MissionFiltersProps) {
  const categories = [
    'Tous',
    'Environnement',
    'Social',
    'Éducation',
    'Santé',
    'Culture',
    'Sport'
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.currentTarget.value);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Barre de recherche */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          type="text"
          placeholder="Rechercher une mission, une association..."
          value={searchValue}
          onChange={handleSearchChange}
          className="pl-10 pr-10 py-6 border-gray-200 focus:border-[#18534F] focus:ring-[#18534F] rounded-xl"
        />
        {searchValue && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Filtres par catégorie */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Catégories</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              onClick={() => onFilterChange(category)}
              variant={activeFilter === category ? 'default' : 'outline'}
              className={`rounded-full transition-all duration-300 ${
                activeFilter === category
                  ? 'bg-[#18534F] text-white hover:bg-[#226D68]'
                  : 'bg-white text-[#18534F] border-[#18534F] hover:bg-[#ECF8F6]'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Filtres actifs */}
      {(searchValue || activeFilter !== 'Tous') && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {searchValue && (
                <div className="bg-[#ECF8F6] text-[#18534F] px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  <span>Recherche: "{searchValue}"</span>
                  <button onClick={() => onSearchChange('')}>
                    <X size={14} />
                  </button>
                </div>
              )}
              {activeFilter !== 'Tous' && (
                <div className="bg-[#ECF8F6] text-[#18534F] px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  <span>{activeFilter}</span>
                  <button onClick={() => onFilterChange('Tous')}>
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onSearchChange('');
                onFilterChange('Tous');
              }}
              className="text-[#18534F] hover:text-[#226D68]"
            >
              Tout effacer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}