'use client';

import { Sparkles } from 'lucide-react';
import MissionCard from './MissionCard';

interface Mission {
  id: string;
  title: string;
  association: string;
  description: string;
  duration: string;
  participants: number;
  maxParticipants: number;
  location: string;
  date: string;
  odd: number[];
  difficulty: 'Facile' | 'Modéré' | 'Avancé';
  skills: string[];
  matchScore?: number;
}

interface RecommendedMissionsProps {
  missions: Mission[];
  userInterests: string[];
  onMissionClick: (mission: Mission) => void;
}

export default function RecommendedMissions({
  missions,
  userInterests,
  onMissionClick
}: RecommendedMissionsProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-[#18534F] flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#FEEAA1]" />
          Missions recommandées pour toi
        </h3>
        <button className="text-[#18534F] hover:text-[#226D68] transition-colors font-medium">
          Voir tout
        </button>
      </div>

      {/* Bandeau d'explication */}
      <div className="bg-gradient-to-r from-[#ECF8F6] to-[#18534F]/10 rounded-xl p-4 border border-[#18534F]/20 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-[#18534F] rounded-full flex items-center justify-center">
            <span className="text-white text-sm">🎯</span>
          </div>
          <span className="font-semibold text-[#18534F]">Basé sur tes préférences</span>
        </div>
        <p className="text-sm text-[#226D68]">
          Ces missions correspondent à tes centres d'intérêt :{' '}
          {userInterests.map((interest, i) => (
            <span key={interest}>
              <strong>{interest}</strong>
              {i < userInterests.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
      </div>

      {/* Grille de missions recommandées */}
      <div className="grid md:grid-cols-2 gap-6">
        {missions.map((mission) => (
          <div key={mission.id} className="relative">
            {mission.matchScore && (
              <div className="absolute -top-2 -right-2 bg-[#18534F] text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-lg">
                {mission.matchScore}% match
              </div>
            )}
            <MissionCard mission={mission} onDetailsClick={onMissionClick} />
          </div>
        ))}
      </div>
    </div>
  );
}