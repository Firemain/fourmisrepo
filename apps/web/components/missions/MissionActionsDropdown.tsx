'use client';

import { useRouter } from 'next/navigation';
import { Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MissionActionsDropdownProps {
  missionId: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  locale?: 'fr' | 'en';
  stopPropagation?: boolean;
}

const translations = {
  fr: {
    actions: 'Actions',
    view: 'Voir les détails',
    edit: 'Modifier',
    delete: 'Supprimer',
  },
  en: {
    actions: 'Actions',
    view: 'View Details',
    edit: 'Edit',
    delete: 'Delete',
  },
};

export function MissionActionsDropdown({
  missionId,
  onEdit,
  onDelete,
  onView,
  locale = 'fr',
  stopPropagation = true,
}: MissionActionsDropdownProps) {
  const router = useRouter();
  const text = translations[locale];

  const handleView = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    if (onView) {
      onView();
    } else {
      router.push(`/dashboard-association/missions/${missionId}`);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    if (onEdit) {
      onEdit();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    if (stopPropagation) e.stopPropagation();
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white border-2 border-gray-200 shadow-xl">
        <DropdownMenuLabel className="font-semibold text-gray-900">
          {text.actions}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          onClick={handleView}
          className="cursor-pointer hover:bg-[#ECF8F6] focus:bg-[#ECF8F6]"
        >
          <Eye className="w-4 h-4 mr-2 text-[#18534F]" />
          <span className="font-medium">{text.view}</span>
        </DropdownMenuItem>

        {onEdit && (
          <DropdownMenuItem
            onClick={handleEdit}
            className="cursor-pointer hover:bg-[#ECF8F6] focus:bg-[#ECF8F6]"
          >
            <Edit className="w-4 h-4 mr-2 text-[#226D68]" />
            <span className="font-medium">{text.edit}</span>
          </DropdownMenuItem>
        )}

        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-red-600 cursor-pointer hover:bg-red-50 focus:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              <span className="font-medium">{text.delete}</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
