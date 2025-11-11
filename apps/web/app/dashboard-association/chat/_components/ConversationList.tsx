'use client';

import { MessageCircle, Users } from 'lucide-react';

type Conversation = {
  id: string;
  missionTitle: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  participants: number;
};

type Props = {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  locale: 'fr' | 'en';
};

export default function ConversationList({ conversations, selectedId, onSelect, locale }: Props) {
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return locale === 'fr' ? 'À l\'instant' : 'Just now';
    }
    if (diffInMinutes < 60) {
      return locale === 'fr' ? `Il y a ${diffInMinutes}min` : `${diffInMinutes}min ago`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return locale === 'fr' ? `Il y a ${diffInHours}h` : `${diffInHours}h ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    return locale === 'fr' ? `Il y a ${diffInDays}j` : `${diffInDays}d ago`;
  };

  return (
    <div className="w-80 border-r border-gray-200 flex flex-col">
      {/* En-tête de la liste */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-[#18534F]" />
          {locale === 'fr' ? 'Mes missions' : 'My missions'}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {conversations.length} {locale === 'fr' ? 'discussion(s)' : 'discussion(s)'}
        </p>
      </div>

      {/* Liste des conversations */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation, index) => (
          <button
            key={conversation.id}
            onClick={() => onSelect(conversation.id)}
            className={`w-full p-4 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors ${
              selectedId === conversation.id ? 'bg-[#ECF8F6] hover:bg-[#ECF8F6]' : ''
            }`}
            style={{
              animation: 'fadeInLeft 0.3s ease-out forwards',
              animationDelay: `${index * 50}ms`,
              opacity: 0,
            }}
          >
            {/* Titre de la mission */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
                {conversation.missionTitle}
              </h4>
              {conversation.unreadCount > 0 && (
                <span className="shrink-0 w-5 h-5 bg-[#18534F] text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {conversation.unreadCount}
                </span>
              )}
            </div>

            {/* Dernier message */}
            <p className="text-sm text-gray-600 line-clamp-1 mb-2">
              {conversation.lastMessage}
            </p>

            {/* Footer : heure + participants */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{getTimeAgo(conversation.lastMessageTime)}</span>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{conversation.participants}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
