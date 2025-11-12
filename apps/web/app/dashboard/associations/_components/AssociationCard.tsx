'use client';

import { MapPin, Users, Briefcase, ExternalLink, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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

interface AssociationCardProps {
  association: Association;
  locale: 'fr' | 'en';
}

export default function AssociationCard({ association, locale }: AssociationCardProps) {
  const t = {
    fr: {
      missions: 'missions',
      mission: 'mission',
      members: 'membres',
      member: 'membre',
      visitSite: 'Visiter le site',
      sendEmail: 'Envoyer un email',
      seeMore: 'En savoir plus',
    },
    en: {
      missions: 'missions',
      mission: 'mission',
      members: 'members',
      member: 'member',
      visitSite: 'Visit website',
      sendEmail: 'Send email',
      seeMore: 'Learn more',
    },
  };

  const text = t[locale];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Header avec logo */}
      <div className="relative h-32 bg-gradient-to-br from-[#18534F] to-[#226D68] flex items-center justify-center overflow-hidden">
        {/* Décorations */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#FEEAA1] rounded-full opacity-20 blur-2xl translate-x-8 -translate-y-8"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full opacity-10 blur-2xl -translate-x-8 translate-y-8"></div>
        
        {association.logoUrl ? (
          <img
            src={association.logoUrl}
            alt={association.name}
            className="relative z-10 w-16 h-16 object-contain rounded-lg bg-white p-2"
          />
        ) : (
          <div className="relative z-10 w-16 h-16 bg-white rounded-lg flex items-center justify-center text-3xl">
            👥
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-6">
        {/* Nom de l'association */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#18534F] transition-colors line-clamp-1">
          {association.name}
        </h3>

        {/* Localisation */}
        {association.location && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <MapPin size={16} className="text-[#D6955B] shrink-0" />
            <span className="line-clamp-1">
              {association.location.city}, {association.location.country}
            </span>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 min-h-[3.75rem]">
          {association.description || 'Aucune description disponible.'}
        </p>

        {/* Tags */}
        {association.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {association.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag.id}
                className="bg-[#ECF8F6] text-[#18534F] hover:bg-[#18534F] hover:text-white text-xs"
              >
                {tag.name}
              </Badge>
            ))}
            {association.tags.length > 3 && (
              <Badge className="bg-gray-100 text-gray-600 text-xs">
                +{association.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 bg-[#ECF8F6] rounded-lg flex items-center justify-center">
              <Briefcase size={16} className="text-[#18534F]" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{association.stats.missionsCount}</p>
              <p className="text-xs text-gray-500">
                {association.stats.missionsCount > 1 ? text.missions : text.mission}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-8 h-8 bg-[#FEEAA1] rounded-lg flex items-center justify-center">
              <Users size={16} className="text-[#D6955B]" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{association.stats.membersCount}</p>
              <p className="text-xs text-gray-500">
                {association.stats.membersCount > 1 ? text.members : text.member}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {association.siteUrl && (
            <a
              href={association.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#18534F] text-white rounded-lg hover:bg-[#226D68] transition-colors text-sm font-medium"
            >
              <ExternalLink size={16} />
              {text.visitSite}
            </a>
          )}
          {association.email && (
            <a
              href={`mailto:${association.email}`}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-[#ECF8F6] text-[#18534F] rounded-lg hover:bg-[#18534F] hover:text-white transition-colors text-sm font-medium"
            >
              <Mail size={16} />
              {text.sendEmail}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
