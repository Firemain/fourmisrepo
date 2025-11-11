'use client';

import { useState } from 'react';
import { Send, Users, Info } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { Button } from '@/components/ui/button';

type Conversation = {
  id: string;
  missionTitle: string;
  participants: number;
};

type Props = {
  conversation: Conversation;
  currentUserName: string;
  locale: 'fr' | 'en';
};

// Messages mockés pour la démo
const mockMessages = [
  {
    id: '1',
    content: 'Bonjour à tous ! Merci de vous être inscrits pour cette mission.',
    senderName: 'Marie Dupont',
    senderId: 'ref-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isCurrentUser: true,
  },
  {
    id: '2',
    content: 'Bonjour ! Je suis ravi de participer. Faut-il apporter quelque chose ?',
    senderName: 'Pierre Martin',
    senderId: 'user-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
    isCurrentUser: false,
  },
  {
    id: '3',
    content: 'Non, tout est fourni sur place. Pensez juste à venir 15 minutes avant l\'heure de début.',
    senderName: 'Marie Dupont',
    senderId: 'ref-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    isCurrentUser: true,
  },
  {
    id: '4',
    content: 'Parfait, merci pour l\'info !',
    senderName: 'Pierre Martin',
    senderId: 'user-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
    isCurrentUser: false,
  },
  {
    id: '5',
    content: 'Bonjour, à quelle heure commence la mission ?',
    senderName: 'Sophie Bernard',
    senderId: 'user-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
    isCurrentUser: false,
  },
];

export default function ChatWindow({ conversation, currentUserName, locale }: Props) {
  const [messageText, setMessageText] = useState('');

  const t = {
    fr: {
      participants: 'participants',
      typeMessage: 'Écrivez votre message...',
      send: 'Envoyer',
      missionInfo: 'Informations',
    },
    en: {
      participants: 'participants',
      typeMessage: 'Type your message...',
      send: 'Send',
      missionInfo: 'Information',
    },
  };

  const text = t[locale];

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    // TODO: Envoyer le message via l'API
    console.log('Sending message:', messageText);
    
    setMessageText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-900">{conversation.missionTitle}</h2>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Users className="w-4 h-4" />
              {conversation.participants} {text.participants}
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Info className="w-4 h-4" />
            {text.missionInfo}
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {mockMessages.map((message, index) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            senderName={message.senderName}
            timestamp={message.timestamp}
            isCurrentUser={message.isCurrentUser}
            locale={locale}
            animationDelay={index * 50}
          />
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText((e.target as HTMLTextAreaElement).value)}
            onKeyPress={handleKeyPress}
            placeholder={text.typeMessage}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#18534F] focus:border-transparent"
            rows={2}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className="bg-[#18534F] hover:bg-[#226D68] text-white px-6"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
