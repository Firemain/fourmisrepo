import { Users, Mail, MoreVertical } from 'lucide-react';

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  level: string;
  enrolledOn: string;
  status: string;
}

interface MissionParticipantsListProps {
  participants: Participant[];
  locale: 'fr' | 'en';
}

const translations = {
  fr: {
    participants: 'Participants',
    noParticipants: 'Aucun participant pour le moment',
    waitingForParticipants: 'En attente de participants',
    enrolledOn: 'Inscrit le',
    confirmed: 'Confirmé',
    pending: 'En attente',
    completed: 'Terminé',
    cancelled: 'Annulé',
    contactStudent: 'Contacter',
    viewProfile: 'Voir le profil',
  },
  en: {
    participants: 'Participants',
    noParticipants: 'No participants yet',
    waitingForParticipants: 'Waiting for participants',
    enrolledOn: 'Enrolled on',
    confirmed: 'Confirmed',
    pending: 'Pending',
    completed: 'Completed',
    cancelled: 'Cancelled',
    contactStudent: 'Contact',
    viewProfile: 'View Profile',
  },
};

export function MissionParticipantsList({ participants, locale }: MissionParticipantsListProps) {
  const text = translations[locale];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-700';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      CONFIRMED: text.confirmed,
      PENDING: text.pending,
      COMPLETED: text.completed,
      CANCELLED: text.cancelled,
    };
    return statusMap[status] || status;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (id: string) => {
    const colors = ['#18534F', '#226D68', '#D6955B', '#FEEAA1', '#4F46E5', '#7C3AED'];
    const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Users className="w-6 h-6 text-[#18534F]" />
        {text.participants} ({participants.length})
      </h2>

      {participants.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">{text.noParticipants}</p>
          <p className="text-sm text-gray-500 mt-1">{text.waitingForParticipants}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#18534F] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: getAvatarColor(participant.id) }}
                >
                  {getInitials(participant.firstName, participant.lastName)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {participant.firstName} {participant.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{participant.level}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {text.enrolledOn}: {participant.enrolledOn}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    participant.status
                  )}`}
                >
                  {getStatusLabel(participant.status)}
                </span>

                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={text.contactStudent}
                >
                  <Mail className="w-4 h-4 text-gray-600" />
                </button>

                <button
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title={text.viewProfile}
                >
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
