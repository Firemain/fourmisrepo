'use client';

import { Calendar, Clock, Users, MapPin, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
}

interface MissionCardProps {
  mission: Mission;
  onDetailsClick: (mission: Mission) => void;
}

export default function MissionCard({ mission, onDetailsClick }: MissionCardProps) {
  const difficultyColors = {
    Facile: 'bg-green-100 text-green-800 border border-green-200',
    Modéré: 'bg-[#FEEAA1] text-[#D6955B] border border-[#D6955B]',
    Avancé: 'bg-orange-100 text-orange-800 border border-orange-200'
  };

  const participationPercentage = (mission.participants / mission.maxParticipants) * 100;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group border border-gray-100">
      {/* Header avec ODDs et Favoris */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-wrap gap-2">
          {mission.odd.length > 0 ? (
            mission.odd.map((odd) => (
              <Badge
                key={odd}
                className="bg-[#ECF8F6] text-[#18534F] hover:bg-[#18534F] hover:text-white border-0 transition-colors"
              >
                ODD {odd}
              </Badge>
            ))
          ) : (
            <Badge className="bg-[#ECF8F6] text-[#18534F] border-0">
              Mission générale
            </Badge>
          )}
        </div>
        <Heart className="text-[#226D68] hover:text-red-500 cursor-pointer transition-colors group-hover:scale-110" size={20} />
      </div>

      {/* Titre et Association */}
      <h4 className="font-bold text-[#18534F] mb-2 text-lg group-hover:text-[#226D68] transition-colors">{mission.title}</h4>
      <div className="flex items-center gap-2 mb-1">
        <p className="text-sm text-[#D6955B] font-semibold">{mission.association}</p>
      </div>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{mission.description}</p>

      {/* Informations */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin size={14} className="text-[#D6955B]" />
            <span className="font-medium">{mission.location}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar size={14} className="text-[#226D68]" />
            <span className="font-medium">{new Date(mission.date).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
        
        {/* Compétences */}
        {mission.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {mission.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-[#FEEAA1] text-[#D6955B] px-2 py-1 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Barre de progression des participants */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-[#D6955B]" />
            <span className="text-gray-700 font-medium">Participants</span>
          </div>
          <span className="text-[#18534F] font-bold">
            {mission.participants}/{mission.maxParticipants}
          </span>
        </div>
        <div className="w-full bg-[#ECF8F6] rounded-full h-2">
          <div
            className="bg-gradient-to-r from-[#D6955B] to-[#FEEAA1] h-2 rounded-full transition-all duration-500"
            style={{ width: `${participationPercentage}%` }}
          />
        </div>
      </div>

      {/* Footer avec durée et difficulté */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Clock size={16} className="text-[#226D68]" />
            <span className="font-semibold">{mission.duration}</span>
          </div>
        </div>
        <Button
          onClick={() => onDetailsClick(mission)}
          className="bg-[#18534F] text-white px-5 py-2 rounded-full hover:bg-[#226D68] transition-all duration-300 transform hover:scale-105"
        >
          Détails
        </Button>
      </div>
    </div>
  );
}