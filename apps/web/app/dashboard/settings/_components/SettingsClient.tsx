'use client';

import { useState } from 'react';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { useRouter } from 'next/navigation';
import {
  Globe,
  User,
  MapPin,
  Phone,
  Calendar,
  Save,
  Edit2,
  Check,
  X,
  Info,
  Link as LinkIcon,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';

interface Contact {
  id: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string | null;
}

interface AcademicLevel {
  id: string;
  name: string;
}

interface StudentData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  calendarUrl: string | null;
  contact: Contact | null;
  academicLevel: AcademicLevel | null;
}

interface SettingsClientProps {
  studentData: StudentData;
}

export default function SettingsClient({ studentData }: SettingsClientProps) {
  const { locale, setLocale } = useLocale();
  const router = useRouter();
  const { showToast, ToastComponent } = useToast();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingCalendar, setIsEditingCalendar] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // États pour les champs modifiables
  const [firstName, setFirstName] = useState(studentData.firstName);
  const [lastName, setLastName] = useState(studentData.lastName);
  const [phoneNumber, setPhoneNumber] = useState(studentData.contact?.phoneNumber || '');
  const [street, setStreet] = useState(studentData.contact?.street || '');
  const [city, setCity] = useState(studentData.contact?.city || '');
  const [postalCode, setPostalCode] = useState(studentData.contact?.postalCode || '');
  const [country, setCountry] = useState(studentData.contact?.country || '');
  const [calendarUrl, setCalendarUrl] = useState(studentData.calendarUrl || '');

  const t = {
    fr: {
      title: 'Paramètres',
      subtitle: 'Gérez vos préférences et informations personnelles',
      language: 'Langue',
      languageDesc: 'Choisissez la langue de l\'interface',
      french: 'Français',
      english: 'English',
      profile: 'Profil',
      profileDesc: 'Vos informations personnelles',
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'Email',
      academicLevel: 'Niveau d\'études',
      phone: 'Téléphone',
      address: 'Adresse',
      addressDesc: 'Votre adresse de contact',
      street: 'Rue',
      city: 'Ville',
      postalCode: 'Code postal',
      country: 'Pays',
      calendar: 'Calendrier dynamique',
      calendarDesc: 'Liez votre calendrier pour synchroniser vos disponibilités',
      calendarUrl: 'URL du calendrier (iCal, Google Calendar...)',
      calendarPlaceholder: 'https://calendar.google.com/calendar/ical/...',
      calendarHelp: 'Collez l\'URL de votre calendrier iCal ou Google Calendar. Cela nous permettra de voir vos disponibilités et de vous proposer des missions adaptées.',
      edit: 'Modifier',
      save: 'Enregistrer',
      cancel: 'Annuler',
      saving: 'Enregistrement...',
      savedProfile: 'Profil mis à jour avec succès',
      savedAddress: 'Adresse mise à jour avec succès',
      savedCalendar: 'Calendrier mis à jour avec succès',
      error: 'Une erreur est survenue',
    },
    en: {
      title: 'Settings',
      subtitle: 'Manage your preferences and personal information',
      language: 'Language',
      languageDesc: 'Choose your interface language',
      french: 'Français',
      english: 'English',
      profile: 'Profile',
      profileDesc: 'Your personal information',
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email',
      academicLevel: 'Academic level',
      phone: 'Phone',
      address: 'Address',
      addressDesc: 'Your contact address',
      street: 'Street',
      city: 'City',
      postalCode: 'Postal code',
      country: 'Country',
      calendar: 'Dynamic calendar',
      calendarDesc: 'Link your calendar to sync your availability',
      calendarUrl: 'Calendar URL (iCal, Google Calendar...)',
      calendarPlaceholder: 'https://calendar.google.com/calendar/ical/...',
      calendarHelp: 'Paste your iCal or Google Calendar URL. This will allow us to see your availability and suggest suitable missions.',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      saving: 'Saving...',
      savedProfile: 'Profile updated successfully',
      savedAddress: 'Address updated successfully',
      savedCalendar: 'Calendar updated successfully',
      error: 'An error occurred',
    },
  };

  const text = t[locale];

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale as 'fr' | 'en');
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/student/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: studentData.id,
          firstName,
          lastName,
        }),
      });

      if (!response.ok) throw new Error('Failed to update');

      showToast(text.savedProfile, 'success');
      setIsEditingProfile(false);
      router.refresh();
    } catch (error) {
      showToast(text.error, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAddress = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/student/update-address', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactId: studentData.contact?.id,
          street,
          city,
          postalCode,
          country,
          phoneNumber,
        }),
      });

      if (!response.ok) throw new Error('Failed to update');

      showToast(text.savedAddress, 'success');
      setIsEditingAddress(false);
      router.refresh();
    } catch (error) {
      showToast(text.error, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCalendar = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/student/update-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: studentData.id,
          calendarUrl,
        }),
      });

      if (!response.ok) throw new Error('Failed to update');

      showToast(text.savedCalendar, 'success');
      setIsEditingCalendar(false);
      router.refresh();
    } catch (error) {
      showToast(text.error, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {ToastComponent}
      <div className="min-h-screen bg-[#ECF8F6] p-8">
        <div className="max-w-4xl mx-auto">
          {/* En-tête */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{text.title}</h1>
            <p className="text-gray-600">{text.subtitle}</p>
        </div>

        <div className="space-y-6">
          {/* Langue */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-[#ECF8F6] rounded-lg shrink-0">
                <Globe className="w-6 h-6 text-[#18534F]" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">{text.language}</h2>
                <p className="text-sm text-gray-600 mb-4">{text.languageDesc}</p>
                <Select value={locale} onValueChange={handleLocaleChange}>
                  <SelectTrigger className="w-full max-w-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">🇫🇷 {text.french}</SelectItem>
                    <SelectItem value="en">🇬🇧 {text.english}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Profil */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-[#ECF8F6] rounded-lg shrink-0">
                <User className="w-6 h-6 text-[#18534F]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-semibold text-gray-900">{text.profile}</h2>
                  {!isEditingProfile && (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#18534F] hover:bg-[#ECF8F6] rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                      {text.edit}
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-4">{text.profileDesc}</p>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {text.firstName}
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={!isEditingProfile}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500 focus:ring-2 focus:ring-[#18534F] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {text.lastName}
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={!isEditingProfile}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500 focus:ring-2 focus:ring-[#18534F] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {text.email}
                    </label>
                    <input
                      type="email"
                      value={studentData.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    />
                  </div>

                  {studentData.academicLevel && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {text.academicLevel}
                      </label>
                      <input
                        type="text"
                        value={studentData.academicLevel.name}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                    </div>
                  )}

                  {isEditingProfile && (
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-[#18534F] text-white rounded-lg hover:bg-[#226D68] transition-colors disabled:opacity-50"
                      >
                        <Check size={16} />
                        {isSaving ? text.saving : text.save}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingProfile(false);
                          setFirstName(studentData.firstName);
                          setLastName(studentData.lastName);
                        }}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <X size={16} />
                        {text.cancel}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Adresse */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-[#ECF8F6] rounded-lg shrink-0">
                <MapPin className="w-6 h-6 text-[#18534F]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-semibold text-gray-900">{text.address}</h2>
                  {!isEditingAddress && (
                    <button
                      onClick={() => setIsEditingAddress(true)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#18534F] hover:bg-[#ECF8F6] rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                      {text.edit}
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-4">{text.addressDesc}</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {text.street}
                    </label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      disabled={!isEditingAddress}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500 focus:ring-2 focus:ring-[#18534F] focus:border-transparent"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {text.postalCode}
                      </label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        disabled={!isEditingAddress}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500 focus:ring-2 focus:ring-[#18534F] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {text.city}
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        disabled={!isEditingAddress}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500 focus:ring-2 focus:ring-[#18534F] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {text.country}
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      disabled={!isEditingAddress}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500 focus:ring-2 focus:ring-[#18534F] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Phone size={16} />
                      {text.phone}
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={!isEditingAddress}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500 focus:ring-2 focus:ring-[#18534F] focus:border-transparent"
                    />
                  </div>

                  {isEditingAddress && (
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleSaveAddress}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-[#18534F] text-white rounded-lg hover:bg-[#226D68] transition-colors disabled:opacity-50"
                      >
                        <Check size={16} />
                        {isSaving ? text.saving : text.save}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingAddress(false);
                          setStreet(studentData.contact?.street || '');
                          setCity(studentData.contact?.city || '');
                          setPostalCode(studentData.contact?.postalCode || '');
                          setCountry(studentData.contact?.country || '');
                          setPhoneNumber(studentData.contact?.phoneNumber || '');
                        }}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <X size={16} />
                        {text.cancel}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Calendrier dynamique */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-[#ECF8F6] rounded-lg shrink-0">
                <Calendar className="w-6 h-6 text-[#18534F]" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-semibold text-gray-900">{text.calendar}</h2>
                  {!isEditingCalendar && (
                    <button
                      onClick={() => setIsEditingCalendar(true)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#18534F] hover:bg-[#ECF8F6] rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                      {text.edit}
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-4">{text.calendarDesc}</p>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <LinkIcon size={16} />
                      {text.calendarUrl}
                    </label>
                    <input
                      type="url"
                      value={calendarUrl}
                      onChange={(e) => setCalendarUrl(e.target.value)}
                      placeholder={text.calendarPlaceholder}
                      disabled={!isEditingCalendar}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-50 disabled:text-gray-500 focus:ring-2 focus:ring-[#18534F] focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                    <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-900">{text.calendarHelp}</p>
                  </div>

                  {isEditingCalendar && (
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleSaveCalendar}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-[#18534F] text-white rounded-lg hover:bg-[#226D68] transition-colors disabled:opacity-50"
                      >
                        <Check size={16} />
                        {isSaving ? text.saving : text.save}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingCalendar(false);
                          setCalendarUrl(studentData.calendarUrl || '');
                        }}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <X size={16} />
                        {text.cancel}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
