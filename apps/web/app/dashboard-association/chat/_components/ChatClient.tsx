'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/i18n/LocaleContext';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';

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
  currentUserName: string;
};

export default function ChatClient({ conversations, currentUserName }: Props) {
  const { locale } = useLocale();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    conversations.length > 0 ? conversations[0].id : null
  );

  const t = {
    fr: {
      title: 'Discussions',
      subtitle: 'Échangez avec les participants de vos missions',
      noConversations: 'Aucune discussion',
      noConversationsDesc: 'Vous n\'avez pas encore de missions avec des discussions actives.',
      selectConversation: 'Sélectionnez une discussion pour commencer',
    },
    en: {
      title: 'Discussions',
      subtitle: 'Chat with your mission participants',
      noConversations: 'No discussions',
      noConversationsDesc: 'You don\'t have any missions with active discussions yet.',
      selectConversation: 'Select a discussion to start',
    },
  };

  const text = t[locale];
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  return (
    <div className="h-[calc(100vh-2rem)] p-8 flex flex-col">
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{text.title}</h1>
        <p className="text-gray-600">{text.subtitle}</p>
      </div>

      {/* Zone de chat */}
      {conversations.length === 0 ? (
        <div className="flex-1 bg-white rounded-xl shadow-sm p-12 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">💬</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{text.noConversations}</h3>
            <p className="text-gray-600">{text.noConversationsDesc}</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden flex">
          {/* Liste des conversations (sidebar gauche) */}
          <ConversationList
            conversations={conversations}
            selectedId={selectedConversationId}
            onSelect={setSelectedConversationId}
            locale={locale}
          />

          {/* Fenêtre de chat (zone principale) */}
          {selectedConversation ? (
            <ChatWindow
              conversation={selectedConversation}
              currentUserName={currentUserName}
              locale={locale}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-500">
                <span className="text-6xl mb-4 block">💬</span>
                <p>{text.selectConversation}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
