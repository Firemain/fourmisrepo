'use client';

import { useState, useRef } from 'react';
import { useLocale } from '@/lib/i18n/LocaleContext';
import MissionFilters from './MissionFilters';
import MissionCard from './MissionCard';
import RecommendedMissions from './RecommendedMission';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Mission {
  id: string;
  title: string;
  description: string;
  start_at: string;
  end_at: string;
  duration: number;
  maxParticipants: number;
  location: string;
  status: string; // ✅ Ajouté pour le badge de statut
  association: string;
  associationId: string;
  participants: number;
  odd: number[];
  difficulty: 'Facile' | 'Modéré' | 'Avancé';
  skills: string[];
  matchScore?: number;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  preferences: any | null;
}

interface MissionsClientProps {
  missions: Mission[];
  user: User;
}

export default function MissionsClient({ missions, user }: MissionsClientProps) {
  const { locale } = useLocale();
  const [searchValue, setSearchValue] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  
  const t = {
    fr: {
      hero: 'Découvre et participe aux missions qui te correspondent',
      recommendedTitle: 'Découvre les missions faites pour toi !',
      recommendedDesc: 'Complète ton questionnaire de préférences pour que nous puissions te recommander les missions qui correspondent le mieux à tes intérêts et compétences.',
      takeQuiz: 'Faire le questionnaire',
      viewAll: 'Voir toutes les missions',
      allMissions: 'Toutes les missions',
      mission: 'mission',
      missions: 'missions',
      noMissions: 'Aucune mission ne correspond à tes critères.',
      adjustFilters: 'Essaie d\'ajuster tes filtres pour voir plus de résultats.'
    },
    en: {
      hero: 'Discover and participate in missions that match you',
      recommendedTitle: 'Discover missions made for you!',
      recommendedDesc: 'Complete your preferences quiz so we can recommend missions that best match your interests and skills.',
      takeQuiz: 'Take the quiz',
      viewAll: 'View all missions',
      allMissions: 'All missions',
      mission: 'mission',
      missions: 'missions',
      noMissions: 'No missions match your criteria.',
      adjustFilters: 'Try adjusting your filters to see more results.'
    }
  };

  const text = t[locale];
  
  // Ref pour scroller vers la section "Toutes les missions"
  const allMissionsSectionRef = useRef<HTMLDivElement>(null);

  // Mock user interests (à remplacer par les vraies préférences)
  const userInterests = user.preferences?.interests || ['Environnement', 'Social', 'Éducation'];
  
  // Vérifier si l'utilisateur a des préférences
  const hasPreferences = !!user.preferences;

  // Fonction pour scroller vers "Toutes les missions"
  const scrollToAllMissions = () => {
    allMissionsSectionRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Algorithme de recommandation simple (à améliorer)
  const recommendedMissions = missions
    .slice(0, 2)
    .map((mission, index) => ({
      ...mission,
      matchScore: 95 - (index * 7) // Mock score
    }));

  // IDs des missions recommandées pour les exclure de la grille principale
  const recommendedMissionIds = new Set(recommendedMissions.map(m => m.id));

  // Filtrer les missions (SANS les missions recommandées)
  const filteredMissions = missions
    .filter(mission => !recommendedMissionIds.has(mission.id)) // ✅ Exclure les recommandées
    .filter(mission => {
      const matchesSearch = 
        mission.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        mission.association.toLowerCase().includes(searchValue.toLowerCase()) ||
        mission.description.toLowerCase().includes(searchValue.toLowerCase());
      
      // TODO: Implémenter les filtres par catégorie
      const matchesFilter = activeFilter === 'Tous' || true;
      
      return matchesSearch && matchesFilter;
    });

  const handleMissionClick = (mission: Mission) => {
    setSelectedMission(mission);
    // TODO: Ouvrir le modal de détails
    console.log('Mission clicked:', mission);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h${mins.toString().padStart(2, '0')}`;
  };

  // Transformer les données pour MissionCard
  const transformMissionForCard = (mission: Mission) => ({
    id: mission.id,
    title: mission.title,
    association: mission.association,
    description: mission.description,
    duration: formatDuration(mission.duration),
    participants: mission.participants,
    maxParticipants: mission.maxParticipants,
    location: mission.location,
    date: mission.start_at,
    status: mission.status, // ✅ Ajouté pour le badge de statut
    odd: mission.odd,
    difficulty: mission.difficulty,
    skills: mission.skills
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#ECF8F6]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Missions</h1>
          <p className="text-[#226D68] text-lg">
            {text.hero}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Missions recommandées "Pour toi" OU message pour faire le questionnaire */}
        {hasPreferences ? (
          recommendedMissions.length > 0 && (
            <RecommendedMissions
              missions={recommendedMissions.map(transformMissionForCard)}
              userInterests={userInterests}
              onMissionClick={handleMissionClick}
            />
          )
        ) : (
          <div className="bg-gradient-to-br from-[#ECF8F6] to-white border-2 border-[#18534F] rounded-2xl p-8 shadow-lg">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-[#FEEAA1] rounded-full flex items-center justify-center">
                  <Sparkles className="text-[#18534F]" size={32} />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[#18534F] mb-3">
                  {text.recommendedTitle}
                </h3>
                <p className="text-gray-700 mb-6 text-lg">
                  {text.recommendedDesc}
                </p>
                <div className="flex gap-4">
                  <Link href="/dashboard/missions?setup=true">
                    <Button className="bg-[#18534F] text-white hover:bg-[#226D68] px-6 py-3 rounded-full font-medium flex items-center gap-2 shadow-md hover:shadow-lg transition-all">
                      {text.takeQuiz}
                      <ArrowRight size={20} />
                    </Button>
                  </Link>
                  <Button 
                    onClick={scrollToAllMissions}
                    variant="outline" 
                    className="border-2 border-[#18534F] text-[#18534F] hover:bg-[#ECF8F6] px-6 py-3 rounded-full font-medium"
                  >
                    {text.viewAll}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtres */}
        <MissionFilters
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Titre de la section principale */}
        <div ref={allMissionsSectionRef} className="border-t border-gray-200 pt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {text.allMissions}
            <span className="ml-3 text-base font-normal text-gray-500">
              ({filteredMissions.length} {filteredMissions.length > 1 ? text.missions : text.mission})
            </span>
          </h2>
        </div>

        {/* Grille de toutes les missions (SANS les recommandées) */}
        {filteredMissions.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMissions.map((mission) => (
                <MissionCard
                  key={mission.id}
                  mission={transformMissionForCard(mission)}
                  onDetailsClick={() => handleMissionClick(mission)}
                />
              ))}
            </div>

            {/* Load more (si on a plus de missions) */}
            {filteredMissions.length >= 9 && (
              <div className="text-center">
                <Button className="bg-white text-[#18534F] border-2 border-[#18534F] px-8 py-3 rounded-full hover:bg-[#18534F] hover:text-white transition-all duration-300 transform hover:scale-105">
                  Voir plus de missions
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {text.noMissions}
            </h3>
            <p className="text-gray-600">
              {text.adjustFilters}
            </p>
          </div>
        )}
      </div>

      {/* TODO: Ajouter le modal de détails de mission */}
    </div>
  );
}
