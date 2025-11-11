'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EditMissionModalProps {
  mission: {
    id: string;
    title: string;
    description: string | null;
    start_at: string;
    end_at: string | null;
    duration: number | null;
    maximum_participant: number | null;
    recurrence_type: string;
    status: string;
  };
  associationId: string;
  currentMemberId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditMissionModal({
  mission,
  onClose,
  onSuccess,
}: EditMissionModalProps) {
  const supabase = createClient();

  const [formData, setFormData] = useState({
    title: mission.title,
    description: mission.description || '',
    start_at: new Date(mission.start_at),
    end_at: mission.end_at ? new Date(mission.end_at) : undefined,
    duration: mission.duration?.toString() || '',
    maximum_participant: mission.maximum_participant?.toString() || '',
    recurrence_type: mission.recurrence_type,
    status: mission.status,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: updateError } = await supabase
        .from('missions')
        .update({
          title: formData.title,
          description: formData.description || null,
          start_at: formData.start_at.toISOString(),
          end_at: formData.end_at?.toISOString() || null,
          duration: formData.duration ? parseInt(formData.duration) : null,
          maximum_participant: formData.maximum_participant
            ? parseInt(formData.maximum_participant)
            : null,
          recurrence_type: formData.recurrence_type,
          status: formData.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', mission.id);

      if (updateError) {
        console.error('Error updating mission:', updateError);
        setError('Erreur lors de la modification de la mission');
        return;
      }

      onSuccess();
    } catch (err) {
      console.error('Error:', err);
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">Modifier la mission</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Titre */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">
              Titre de la mission *
            </label>
            <Input
              value={formData.title}
              onChange={(e: any) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Distribution de repas"
              required
              className="h-11"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">Description</label>
            <textarea
              value={formData.description}
              onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Décrivez votre mission..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#18534F] focus:ring-2 focus:ring-[#18534F]/20 outline-none transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date de début */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Date de début *
              </label>
              <DatePicker
                date={formData.start_at}
                onDateChange={(date) => date && setFormData({ ...formData, start_at: date })}
              />
            </div>

            {/* Date de fin */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">Date de fin</label>
              <DatePicker
                date={formData.end_at}
                onDateChange={(date) => setFormData({ ...formData, end_at: date })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Durée */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Durée (minutes)
              </label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e: any) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="120"
                min="0"
                className="h-11"
              />
            </div>

            {/* Participants max */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Participants maximum
              </label>
              <Input
                type="number"
                value={formData.maximum_participant}
                onChange={(e: any) =>
                  setFormData({ ...formData, maximum_participant: e.target.value })
                }
                placeholder="20"
                min="1"
                className="h-11"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Récurrence */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">Récurrence</label>
              <Select
                value={formData.recurrence_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, recurrence_type: value })
                }
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">Ponctuelle</SelectItem>
                  <SelectItem value="DAILY">Quotidienne</SelectItem>
                  <SelectItem value="WEEKLY">Hebdomadaire</SelectItem>
                  <SelectItem value="MONTHLY">Mensuelle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Statut */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">Statut</label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Brouillon</SelectItem>
                  <SelectItem value="PUBLISHED">Publiée</SelectItem>
                  <SelectItem value="ARCHIVED">Archivée</SelectItem>
                  <SelectItem value="CANCELLED">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="h-11 px-6"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.title}
              className="h-11 px-6 bg-[#18534F] hover:bg-[#226D68]"
            >
              {loading ? 'Modification...' : 'Enregistrer les modifications'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
