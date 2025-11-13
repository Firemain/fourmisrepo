'use client';

import { useLocale } from '@/lib/i18n/LocaleContext';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Briefcase,
  Users,
  Calendar,
  UserCheck,
  ChevronRight,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';

interface Contact {
  street: string;
  city: string;
  postalCode: string;
  phoneNumber: string | null;
}

interface Tag {
  id: string;
  name: string;
}

interface Mission {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  status: string;
  coverImageUrl: string | null;
  registrationsCount: number;
}

interface Association {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  siteUrl: string | null;
  email: string | null;
  contact: Contact | null;
  tags: Tag[];
  missions: Mission[];
  stats: {
    missionsCount: number;
    membersCount: number;
  };
}

interface AssociationDetailClientProps {
  association: Association;
}

export default function AssociationDetailClient({ association }: AssociationDetailClientProps) {
  const { locale } = useLocale();
  const router = useRouter();

  const t = {
    fr: {
      back: 'Retour aux associations',
      description: 'Description',
      contact: 'Contact',
      address: 'Adresse',
      phone: 'Téléphone',
      email: 'Email',
      website: 'Site web',
      visit: 'Visiter',
      send: 'Envoyer un email',
      missions: 'Missions disponibles',
      noMissions: 'Aucune mission disponible pour le moment',
      members: 'membres',
      seeDetails: 'Voir les détails',
      participants: 'participants',
      spotsLeft: 'places restantes',
      status: {
        DRAFT: 'Brouillon',
        PUBLISHED: 'Publiée',
        IN_PROGRESS: 'En cours',
        COMPLETED: 'Terminée',
        CANCELLED: 'Annulée',
      },
    },
    en: {
      back: 'Back to associations',
      description: 'Description',
      contact: 'Contact',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      website: 'Website',
      visit: 'Visit',
      send: 'Send email',
      missions: 'Available missions',
      noMissions: 'No missions available at the moment',
      members: 'members',
      seeDetails: 'See details',
      participants: 'participants',
      spotsLeft: 'spots left',
      status: {
        DRAFT: 'Draft',
        PUBLISHED: 'Published',
        IN_PROGRESS: 'In Progress',
        COMPLETED: 'Completed',
        CANCELLED: 'Cancelled',
      },
    },
  };

  const text = t[locale];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-700';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#ECF8F6]">
      {/* Header avec retour */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push('/dashboard/associations')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#18534F] transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">{text.back}</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête de l'association */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          {/* Bannière avec gradient */}
          <div className="h-32 bg-gradient-to-br from-[#18534F] via-[#226D68] to-[#D6955B] relative">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
          </div>

          {/* Contenu de l'en-tête */}
          <div className="px-6 sm:px-8 pb-8">
            {/* Logo */}
            <div className="relative -mt-16 mb-6">
              <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg bg-white flex items-center justify-center overflow-hidden">
                {association.logoUrl ? (
                  <img
                    src={association.logoUrl}
                    alt={association.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Briefcase size={48} className="text-[#18534F]" />
                )}
              </div>
            </div>

            {/* Nom et tags */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">{association.name}</h1>
              {association.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {association.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 rounded-full text-sm font-medium bg-[#ECF8F6] text-[#18534F] border border-[#18534F]/20"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-6 mb-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Briefcase size={20} className="text-[#18534F]" />
                <span className="font-semibold text-gray-900">{association.stats.missionsCount}</span>
                <span className="text-sm">missions</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users size={20} className="text-[#226D68]" />
                <span className="font-semibold text-gray-900">{association.stats.membersCount}</span>
                <span className="text-sm">{text.members}</span>
              </div>
            </div>

            {/* Description */}
            {association.description && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">{text.description}</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {association.description}
                </p>
              </div>
            )}

            {/* Contact et actions */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Informations de contact */}
              <div className="bg-[#ECF8F6] rounded-xl p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 mb-3">{text.contact}</h3>

                {association.contact && (
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin size={18} className="text-[#18534F] mt-0.5 flex-shrink-0" />
                    <div className="text-gray-700">
                      <div>{association.contact.street}</div>
                      <div>
                        {association.contact.postalCode} {association.contact.city}
                      </div>
                    </div>
                  </div>
                )}

                {association.contact?.phoneNumber && (
                  <div className="flex items-center gap-3 text-sm">
                    <Phone size={18} className="text-[#18534F] flex-shrink-0" />
                    <a
                      href={`tel:${association.contact.phoneNumber}`}
                      className="text-gray-700 hover:text-[#18534F] transition-colors"
                    >
                      {association.contact.phoneNumber}
                    </a>
                  </div>
                )}

                {association.email && (
                  <div className="flex items-center gap-3 text-sm">
                    <Mail size={18} className="text-[#18534F] flex-shrink-0" />
                    <a
                      href={`mailto:${association.email}`}
                      className="text-gray-700 hover:text-[#18534F] transition-colors"
                    >
                      {association.email}
                    </a>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                {association.siteUrl && (
                  <a
                    href={association.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#18534F] text-white rounded-xl hover:bg-[#226D68] transition-all shadow-md hover:shadow-lg"
                  >
                    <ExternalLink size={20} />
                    <span className="font-medium">{text.visit}</span>
                  </a>
                )}
                {association.email && (
                  <a
                    href={`mailto:${association.email}`}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-[#18534F] text-[#18534F] rounded-xl hover:bg-[#ECF8F6] transition-all"
                  >
                    <Mail size={20} />
                    <span className="font-medium">{text.send}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Missions disponibles */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Briefcase className="text-[#18534F]" size={28} />
            {text.missions}
          </h2>

          {association.missions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <Briefcase size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">{text.noMissions}</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {association.missions.map((mission) => {
                const spotsLeft = mission.maxParticipants - mission.registrationsCount;
                return (
                  <button
                    key={mission.id}
                    onClick={() => router.push(`/dashboard/missions/${mission.id}`)}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-left group"
                  >
                    {/* Image de couverture */}
                    {mission.coverImageUrl ? (
                      <div className="h-48 overflow-hidden">
                        <img
                          src={mission.coverImageUrl}
                          alt={mission.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-[#18534F] to-[#226D68] flex items-center justify-center">
                        <Briefcase size={64} className="text-white/50" />
                      </div>
                    )}

                    {/* Contenu */}
                    <div className="p-5">
                      {/* Status badge */}
                      <div className="mb-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            mission.status
                          )}`}
                        >
                          {text.status[mission.status as keyof typeof text.status]}
                        </span>
                      </div>

                      {/* Titre */}
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#18534F] transition-colors">
                        {mission.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {mission.description}
                      </p>

                      {/* Dates */}
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <Calendar size={16} className="text-[#18534F]" />
                        <span>
                          {format(new Date(mission.startDate), 'dd MMM yyyy', {
                            locale: locale === 'fr' ? fr : enUS,
                          })}{' '}
                          -{' '}
                          {format(new Date(mission.endDate), 'dd MMM yyyy', {
                            locale: locale === 'fr' ? fr : enUS,
                          })}
                        </span>
                      </div>

                      {/* Participants */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <UserCheck size={16} className="text-[#226D68]" />
                          <span className="text-gray-700">
                            <span className="font-semibold text-gray-900">
                              {mission.registrationsCount}
                            </span>
                            /{mission.maxParticipants} {text.participants}
                          </span>
                        </div>
                        {spotsLeft > 0 && (
                          <span className="text-xs font-medium text-[#18534F]">
                            {spotsLeft} {text.spotsLeft}
                          </span>
                        )}
                      </div>

                      {/* Action */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-[#18534F] group-hover:text-[#226D68] transition-colors">
                          <span className="font-medium text-sm">{text.seeDetails}</span>
                          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
