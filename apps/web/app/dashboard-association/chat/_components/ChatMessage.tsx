'use client';

type Props = {
  content: string;
  senderName: string;
  timestamp: string;
  isCurrentUser: boolean;
  locale: 'fr' | 'en';
  animationDelay: number;
};

export default function ChatMessage({
  content,
  senderName,
  timestamp,
  isCurrentUser,
  locale,
  animationDelay,
}: Props) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return locale === 'fr' ? 'Aujourd\'hui' : 'Today';
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return locale === 'fr' ? 'Hier' : 'Yesterday';
    }
    return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
      style={{
        animation: 'fadeInUp 0.3s ease-out forwards',
        animationDelay: `${animationDelay}ms`,
        opacity: 0,
      }}
    >
      <div className={`max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        {/* Nom de l'expéditeur */}
        {!isCurrentUser && (
          <span className="text-xs font-medium text-gray-600 px-3">
            {senderName}
          </span>
        )}

        {/* Bulle de message */}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isCurrentUser
              ? 'bg-[#18534F] text-white rounded-br-sm'
              : 'bg-white text-gray-900 rounded-bl-sm border border-gray-200'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap wrap-break-word">{content}</p>
        </div>

        {/* Timestamp */}
        <span className={`text-xs text-gray-500 px-3`}>
          {formatDate(timestamp)} {formatTime(timestamp)}
        </span>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
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
