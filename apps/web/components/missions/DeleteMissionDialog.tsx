'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteMissionDialogProps {
  missionId: string;
  missionTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locale?: 'fr' | 'en';
}

const translations = {
  fr: {
    title: 'Supprimer la mission',
    description: 'Êtes-vous sûr de vouloir supprimer',
    warning: 'Cette action est irréversible. Toutes les inscriptions associées seront également supprimées.',
    confirmationLabel: 'Pour confirmer, tapez',
    confirmationWord: 'supprimer',
    confirmationPlaceholder: 'Tapez "supprimer" pour confirmer',
    cancel: 'Annuler',
    confirm: 'Supprimer',
    deleting: 'Suppression...',
    success: 'Mission supprimée avec succès',
    error: 'Erreur lors de la suppression',
  },
  en: {
    title: 'Delete Mission',
    description: 'Are you sure you want to delete',
    warning: 'This action is irreversible. All associated registrations will also be deleted.',
    confirmationLabel: 'To confirm, type',
    confirmationWord: 'delete',
    confirmationPlaceholder: 'Type "delete" to confirm',
    cancel: 'Cancel',
    confirm: 'Delete',
    deleting: 'Deleting...',
    success: 'Mission deleted successfully',
    error: 'Error deleting mission',
  },
};

export function DeleteMissionDialog({
  missionId,
  missionTitle,
  open,
  onOpenChange,
  locale = 'fr',
}: DeleteMissionDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const text = translations[locale];

  const isConfirmationValid = confirmationText.toLowerCase() === text.confirmationWord.toLowerCase();

  // Réinitialiser le champ quand le dialogue se ferme
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setConfirmationText('');
    }
    onOpenChange(newOpen);
  };

  const handleDelete = async () => {
    if (!isConfirmationValid) return;
    
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/missions/${missionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' })) as { error: string };
        console.error('Delete failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(errorData.error || 'Failed to delete mission');
      }

      // Fermer le dialogue
      onOpenChange(false);
      
      // Rafraîchir la page pour recharger les missions
      router.refresh();
    } catch (error) {
      console.error('Error deleting mission:', error);
      // eslint-disable-next-line no-alert
      window.alert(text.error + '\n' + (error instanceof Error ? error.message : ''));
    } finally {
      setIsDeleting(false);
      setConfirmationText('');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="bg-white border-2 border-[#18534F]/20 shadow-2xl max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 border-2 border-red-200 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-xl font-bold text-[#18534F]">
              {text.title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-700 space-y-4">
            <div className="text-base">
              {text.description} <span className="font-bold text-[#18534F]">"{missionTitle}"</span> ?
            </div>
            <div className="flex items-start gap-3 p-4 bg-amber-50 border-2 border-amber-300 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900 font-medium">
                {text.warning}
              </div>
            </div>
            
            {/* Champ de confirmation textuelle */}
            <div className="space-y-2 pt-2">
              <label htmlFor="confirmation-input" className="block text-sm font-semibold text-[#18534F]">
                {text.confirmationLabel} <span className="font-bold text-red-600">{text.confirmationWord}</span>
              </label>
              <input
                id="confirmation-input"
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText((e.target as HTMLInputElement).value)}
                placeholder={text.confirmationPlaceholder}
                disabled={isDeleting}
                className="w-full h-12 px-4 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed text-base"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-3">
          <AlertDialogCancel 
            disabled={isDeleting}
            className="h-12 px-6 border-2 border-[#18534F] cursor-pointer text-[#18534F] hover:bg-[#ECF8F6] font-semibold rounded-xl transition-colors"
            onClick={() => setConfirmationText('')}
          >
            {text.cancel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting || !isConfirmationValid}
            className="h-12 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-lg hover:shadow-xl"
          >
            {isDeleting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {text.deleting}
              </div>
            ) : (
              <div className="flex items-center gap-2 ">
                <Trash2 className="w-4 h-4" />
                {text.confirm}
              </div>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
