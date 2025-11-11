'use client';

import { useState, useEffect } from 'react';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { createClient } from '@/lib/supabase/client';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { TimePicker } from '@/components/ui/time-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CreateMissionModalProps {
  associationId: string;
  currentMemberId: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface AssociationMember {
  id: string;
  first_name: string;
  last_name: string;
  status: string;
}

export function CreateMissionModal({ associationId, currentMemberId, onClose, onSuccess }: CreateMissionModalProps) {
  const { locale } = useLocale();
  const supabase = createClient();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    // Champs pour le contact/adresse
    street: '',
    apartmentNumber: '',
    city: '',
    postalCode: '',
    country: 'France',
    start_at: undefined as Date | undefined,
    end_at: undefined as Date | undefined,
    start_time: '',
    duration: '',
    maximum_participant: '',
    recurrence_type: 'NONE',
    association_member_id: currentMemberId,
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [associationMembers, setAssociationMembers] = useState<AssociationMember[]>([]);

  const t = {
    fr: {
      newMission: 'Nouvelle Mission',
      missionTitle: 'Titre de la mission',
      missionDescription: 'Description',
      addressSection: 'Adresse de la mission',
      street: 'Rue',
      streetPlaceholder: '123 Rue de la République',
      apartmentNumber: 'Numéro d\'appartement / Complément',
      apartmentPlaceholder: 'Bâtiment A, Étage 2...',
      city: 'Ville',
      cityPlaceholder: 'Paris',
      postalCode: 'Code postal',
      postalCodePlaceholder: '75001',
      country: 'Pays',
      phonePlaceholder: '+33 6 12 34 56 78',
      memberLabel: 'Membre responsable',
      memberPlaceholder: 'Sélectionner un membre',
      memberHelp: 'Ce membre sera le contact principal pour cette mission',
      recurrenceType: 'Récurrence',
      recurrenceNone: 'Ponctuelle',
      recurrenceDaily: 'Quotidienne',
      recurrenceWeekly: 'Hebdomadaire',
      recurrenceMonthly: 'Mensuelle',
      recurrenceHelpNone: 'Mission ponctuelle (une seule fois)',
      recurrenceHelpDaily: 'Mission répétée tous les jours',
      recurrenceHelpWeekly: 'Mission répétée chaque semaine (même jour)',
      recurrenceHelpMonthly: 'Mission répétée chaque mois (même date)',
      startDate: 'Date de début',
      firstOccurrence: 'Première occurrence',
      lastOccurrence: 'Dernière occurrence',
      selectDate: 'Sélectionner la date',
      repeatedEvery: 'Répété chaque ',
      repeatedOn: 'Répété le ',
      ofEachMonth: ' de chaque mois',
      startTime: 'Heure de début',
      selectTime: 'Sélectionner l\'heure',
      missionDuration: 'Durée',
      minutes: 'minutes',
      maxParticipants: 'Nombre maximum de participants',
      cancel: 'Annuler',
      create: 'Créer la mission',
      loading: 'Création...',
      you: '(Vous)',
    },
    en: {
      newMission: 'New Mission',
      missionTitle: 'Mission Title',
      missionDescription: 'Description',
      addressSection: 'Mission Address',
      street: 'Street',
      streetPlaceholder: '123 Main Street',
      apartmentNumber: 'Apartment / Additional info',
      apartmentPlaceholder: 'Building A, Floor 2...',
      city: 'City',
      cityPlaceholder: 'Paris',
      postalCode: 'Postal Code',
      postalCodePlaceholder: '75001',
      country: 'Country',
      phonePlaceholder: '+33 6 12 34 56 78',
      memberLabel: 'Responsible member',
      memberPlaceholder: 'Select a member',
      memberHelp: 'This member will be the main contact for this mission',
      recurrenceType: 'Recurrence',
      recurrenceNone: 'One-time mission',
      recurrenceDaily: 'Daily',
      recurrenceWeekly: 'Weekly',
      recurrenceMonthly: 'Monthly',
      recurrenceHelpNone: 'One-time mission',
      recurrenceHelpDaily: 'Mission repeated daily',
      recurrenceHelpWeekly: 'Mission repeated weekly (same day)',
      recurrenceHelpMonthly: 'Mission repeated monthly (same date)',
      startDate: 'Start date',
      firstOccurrence: 'First occurrence',
      lastOccurrence: 'Last occurrence',
      selectDate: 'Select date',
      repeatedEvery: 'Repeated every ',
      repeatedOn: 'Repeated on the ',
      ofEachMonth: ' of each month',
      startTime: 'Start time',
      selectTime: 'Select time',
      missionDuration: 'Duration',
      minutes: 'minutes',
      maxParticipants: 'Maximum number of participants',
      cancel: 'Cancel',
      create: 'Create Mission',
      loading: 'Creating...',
      you: '(You)',
    },
  };

  const text = t[locale];

  // Charger les membres de l'association
  useEffect(() => {
    const loadAssociationMembers = async () => {
      try {
        console.log('🔍 Loading members for association:', associationId);
        
        // Les membres ont first_name et last_name directement dans la table association_members
        const { data: members, error } = await supabase
          .from('association_members')
          .select('id, first_name, last_name, status')
          .eq('association_id', associationId)
          .eq('status', 'ACTIVE'); // Seulement les membres actifs

        if (error) {
          console.error('❌ Error loading association members:', error);
          console.error('Error details:', JSON.stringify(error, null, 2));
        } else {
          console.log('✅ Loaded members:', members);
          console.log('📊 Number of members:', members?.length || 0);
          if (members && members.length > 0) {
            setAssociationMembers(members as AssociationMember[]);
          } else {
            console.warn('⚠️ No members found for association:', associationId);
          }
        }
      } catch (err) {
        console.error('💥 Exception:', err);
      }
    };

    if (associationId) {
      loadAssociationMembers();
    } else {
      console.warn('⚠️ No associationId provided');
    }
  }, [associationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Générer un ID pour le contact
      const contactId = crypto.randomUUID();

      // 2. Créer d'abord le contact avec l'adresse
      const { data: contactData, error: contactError } = await supabase
        .from('contacts')
        .insert({
          id: contactId,
          street: formData.street,
          apartment_number: formData.apartmentNumber || null,
          city: formData.city,
          postal_code: formData.postalCode,
          country: formData.country,
          phone_number: formData.phoneNumber || null,
        })
        .select('id')
        .single();

      if (contactError || !contactData) {
        console.error('Error creating contact:', contactError);
        setError(contactError?.message || 'Erreur lors de la création du contact');
        setLoading(false);
        return;
      }

      // 2. Combiner la date et l'heure
      let startDateTime = formData.start_at;
      if (startDateTime && formData.start_time) {
        const [hours, minutes] = formData.start_time.split(':');
        startDateTime = new Date(startDateTime);
        startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      }

      // 3. Générer un ID pour la mission
      const missionId = crypto.randomUUID();

      // 4. Créer la mission avec le contact_id
      const { error: insertError } = await supabase
        .from('missions')
        .insert({
          id: missionId,
          association_id: associationId,
          association_member_id: formData.association_member_id,
          contact_id: contactData.id,
          title: formData.title,
          description: formData.description || null,
          start_at: startDateTime?.toISOString(),
          end_at: formData.end_at?.toISOString() || null,
          duration: formData.duration ? parseInt(formData.duration) : null,
          maximum_participant: formData.maximum_participant ? parseInt(formData.maximum_participant) : null,
          recurrence_type: formData.recurrence_type,
          status: 'PUBLISHED',
        });

      if (insertError) {
        console.error('Error creating mission:', insertError);
        setError(insertError.message);
      } else {
        onSuccess();
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const getRecurrenceHelp = () => {
    switch (formData.recurrence_type) {
      case 'NONE':
        return text.recurrenceHelpNone;
      case 'DAILY':
        return text.recurrenceHelpDaily;
      case 'WEEKLY':
        if (formData.start_at) {
          return text.repeatedEvery + new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(formData.start_at);
        }
        return text.recurrenceHelpWeekly;
      case 'MONTHLY':
        if (formData.start_at) {
          return text.repeatedOn + formData.start_at.getDate() + text.ofEachMonth;
        }
        return text.recurrenceHelpMonthly;
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{text.newMission}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {text.missionTitle} *
            </label>
            <Input
              type="text"
              required
              value={formData.title}
              onChange={(e: any) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex: Formation aux premiers secours"
              className="h-11"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {text.missionDescription}
            </label>
            <textarea
              value={formData.description}
              onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18534F] text-sm"
              placeholder="Décrivez la mission, les objectifs..."
            />
          </div>

          {/* Adresse - Section complète */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-900">{text.addressSection}</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {text.street} *
              </label>
              <Input
                type="text"
                required
                value={formData.street}
                onChange={(e: any) => setFormData({ ...formData, street: e.target.value })}
                placeholder={text.streetPlaceholder}
                className="h-11"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {text.city} *
                </label>
                <Input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e: any) => setFormData({ ...formData, city: e.target.value })}
                  placeholder={text.cityPlaceholder}
                  className="h-11"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {text.postalCode} *
                </label>
                <Input
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={(e: any) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder={text.postalCodePlaceholder}
                  className="h-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {text.country} *
              </label>
              <Input
                type="text"
                required
                value={formData.country}
                onChange={(e: any) => setFormData({ ...formData, country: e.target.value })}
                className="h-11"
              />
            </div>

          </div>

          {/* Membre responsable */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {text.memberLabel} *
            </label>
            <Select 
              value={formData.association_member_id} 
              onValueChange={(value) => setFormData({ ...formData, association_member_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={text.memberPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {associationMembers.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.first_name} {member.last_name}
                    {member.id === currentMemberId && ` ${text.you}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              {text.memberHelp}
            </p>
          </div>

          {/* Type de récurrence */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {text.recurrenceType}
            </label>
            <Select 
              value={formData.recurrence_type} 
              onValueChange={(value) => setFormData({ ...formData, recurrence_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">{text.recurrenceNone}</SelectItem>
                <SelectItem value="DAILY">{text.recurrenceDaily}</SelectItem>
                <SelectItem value="WEEKLY">{text.recurrenceWeekly}</SelectItem>
                <SelectItem value="MONTHLY">{text.recurrenceMonthly}</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              {getRecurrenceHelp()}
            </p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.recurrence_type === 'NONE' ? text.startDate : text.firstOccurrence} *
              </label>
              <DatePicker
                date={formData.start_at}
                onDateChange={(date) => setFormData({ ...formData, start_at: date })}
                placeholder={text.selectDate}
                locale={locale}
                withTime={false}
              />
            </div>

            {formData.recurrence_type !== 'NONE' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {text.lastOccurrence}
                </label>
                <DatePicker
                  date={formData.end_at}
                  onDateChange={(date) => setFormData({ ...formData, end_at: date })}
                  placeholder={text.selectDate}
                  locale={locale}
                  withTime={false}
                />
              </div>
            )}
          </div>

          {/* Heure et Durée */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {text.startTime} *
              </label>
              <TimePicker
                time={formData.start_time}
                onTimeChange={(time) => setFormData({ ...formData, start_time: time })}
                placeholder={text.selectTime}
                locale={locale}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {text.missionDuration} *
                <span className="text-xs text-gray-500 ml-2">
                  ({text.minutes})
                </span>
              </label>
              <Input
                type="number"
                required
                value={formData.duration}
                onChange={(e: any) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="120"
                min="1"
                className="h-11"
              />
            </div>
          </div>

          {/* Participants */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {text.maxParticipants}
            </label>
            <Input
              type="number"
              value={formData.maximum_participant}
              onChange={(e: any) => setFormData({ ...formData, maximum_participant: e.target.value })}
              placeholder="20"
              min="1"
              className="h-11"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              {text.cancel}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#18534F] hover:bg-[#226D68]"
            >
              {loading ? text.loading : text.create}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
