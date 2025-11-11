'use client';

import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MissionDetailHeaderProps {
  title: string;
  status: string;
  associationName: string;
  missionId: string;
  locale: 'fr' | 'en';
  onEdit?: () => void;
  onDelete?: () => void;
}

const translations = {
  fr: {
    back: 'Retour aux missions',
    edit: 'Modifier',
    delete: 'Supprimer',
  },
  en: {
    back: 'Back to missions',
    edit: 'Edit',
    delete: 'Delete',
  },
};

export function MissionDetailHeader({
  title,
  status,
  associationName,
  locale,
  onEdit,
  onDelete,
}: MissionDetailHeaderProps) {
  const router = useRouter();
  const text = translations[locale];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-700';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-700';
      case 'ARCHIVED':
        return 'bg-yellow-100 text-yellow-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      fr: {
        PUBLISHED: 'Publiée',
        DRAFT: 'Brouillon',
        ARCHIVED: 'Archivée',
        CANCELLED: 'Annulée',
      },
      en: {
        PUBLISHED: 'Published',
        DRAFT: 'Draft',
        ARCHIVED: 'Archived',
        CANCELLED: 'Cancelled',
      },
    };
    return labels[locale][status as keyof typeof labels.fr] || status;
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-[#18534F] mb-4 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        {text.back}
      </button>

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(status)}`}
            >
              {getStatusLabel(status)}
            </span>
          </div>
          <p className="text-gray-600">{associationName}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="px-4 py-2.5 border-2 border-[#18534F] text-[#18534F] hover:bg-[#ECF8F6] rounded-xl transition-colors flex items-center gap-2 font-semibold"
          >
            <Edit className="w-4 h-4" />
            {text.edit}
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors flex items-center gap-2 font-semibold"
          >
            <Trash2 className="w-4 h-4" />
            {text.delete}
          </button>
        </div>
      </div>
    </div>
  );
}
