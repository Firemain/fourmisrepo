'use client';

import { useLocale } from '@/lib/i18n/LocaleContext';
import { Mail, Briefcase, Calendar, UserCheck, UserX } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Member = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  joinedAt: string;
  missionCount: number;
  contact: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
  } | null;
};

type Props = {
  members: Member[];
};

export default function MembersListClient({ members }: Props) {
  const { locale } = useLocale();

  const t = {
    fr: {
      title: 'Membres de l\'association',
      subtitle: 'Gérez les membres de votre association et suivez leur activité',
      totalMembers: 'Membres actifs',
      activeMissions: 'Missions actives',
      searchPlaceholder: 'Rechercher un membre...',
      status: 'Statut',
      contact: 'Téléphone',
      missions: 'Missions',
      joinedOn: 'Membre depuis',
      noContact: 'Pas de téléphone',
      noMembers: 'Aucun membre',
      noMembersDesc: 'Il n\'y a pas encore de membres dans votre association.',
      active: 'Actif',
      inactive: 'Inactif',
      mission: 'mission',
      missions_plural: 'missions',
    },
    en: {
      title: 'Association Members',
      subtitle: 'Manage your association members and track their activity',
      totalMembers: 'Active members',
      activeMissions: 'Active missions',
      searchPlaceholder: 'Search for a member...',
      status: 'Status',
      contact: 'Phone',
      missions: 'Missions',
      joinedOn: 'Member since',
      noContact: 'No phone number',
      noMembers: 'No members',
      noMembersDesc: 'There are no members in your association yet.',
      active: 'Active',
      inactive: 'Inactive',
      mission: 'mission',
      missions_plural: 'missions',
    },
  };

  const text = t[locale];

  // Statistiques
  const activeMembers = members.filter(m => m.status === 'ACTIVE').length;
  const totalMissions = members.reduce((sum, m) => sum + m.missionCount, 0);

  // Formater la date d'adhésion
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Initiales pour l'avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="p-8 space-y-6">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{text.title}</h1>
        <p className="text-gray-600">{text.subtitle}</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#18534F]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{text.totalMembers}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{activeMembers}</p>
            </div>
            <div className="w-12 h-12 bg-[#ECF8F6] rounded-full flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-[#18534F]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#226D68]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{text.activeMissions}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalMissions}</p>
            </div>
            <div className="w-12 h-12 bg-[#ECF8F6] rounded-full flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-[#226D68]" />
            </div>
          </div>
        </div>
      </div>

      {/* Liste des membres */}
      {members.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserX className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{text.noMembers}</h3>
          <p className="text-gray-600">{text.noMembersDesc}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Membre
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {text.contact}
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {text.status}
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {text.missions}
                </TableHead>
                <TableHead className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  {text.joinedOn}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member, index) => (
                <TableRow
                  key={member.id}
                  style={{
                    animation: 'fadeInUp 0.5s ease-out forwards',
                    animationDelay: `${index * 50}ms`,
                    opacity: 0,
                  }}
                >
                  {/* Membre */}
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#18534F] to-[#226D68] flex items-center justify-center text-white font-semibold text-sm shrink-0">
                        {getInitials(member.firstName, member.lastName)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {member.firstName} {member.lastName}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Contact */}
                  <TableCell className="px-6 py-4">
                    {member.contact?.phoneNumber ? (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{member.contact.phoneNumber}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 italic">{text.noContact}</span>
                    )}
                  </TableCell>

                  {/* Statut */}
                  <TableCell className="px-6 py-4">
                    {member.status === 'ACTIVE' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <UserCheck className="w-3 h-3" />
                        {text.active}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <UserX className="w-3 h-3" />
                        {text.inactive}
                      </span>
                    )}
                  </TableCell>

                  {/* Missions */}
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#ECF8F6] flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-[#18534F]" />
                      </div>
                      <span className="font-semibold text-gray-900">
                        {member.missionCount}
                      </span>
                      <span className="text-sm text-gray-600">
                        {member.missionCount <= 1 ? text.mission : text.missions_plural}
                      </span>
                    </div>
                  </TableCell>

                  {/* Date d'adhésion */}
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {formatDate(member.joinedAt)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
