'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { Globe, User, Bell, Shield, Palette } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SettingsPage() {
  const { user } = useAuth();
  const { locale, setLocale } = useLocale();
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Sauvegarder la langue
  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale as 'fr' | 'en');
  };

  const t = {
    fr: {
      title: 'Paramètres',
      subtitle: 'Gérez vos préférences et votre compte',
      language: 'Langue',
      languageDesc: 'Choisissez la langue de l\'interface',
      french: 'Français',
      english: 'English',
      notifications: 'Notifications',
      notificationsDesc: 'Gérez vos notifications',
      pushNotifications: 'Notifications push',
      pushDesc: 'Recevoir des notifications sur votre appareil',
      emailNotifications: 'Notifications par email',
      emailDesc: 'Recevoir des emails pour les mises à jour importantes',
      profile: 'Profil',
      profileDesc: 'Informations personnelles',
      email: 'Email',
      privacy: 'Confidentialité',
      privacyDesc: 'Gérez vos données personnelles',
      theme: 'Thème',
      themeDesc: 'Personnalisez l\'apparence',
      light: 'Clair',
      dark: 'Sombre',
      auto: 'Automatique',
    },
    en: {
      title: 'Settings',
      subtitle: 'Manage your preferences and account',
      language: 'Language',
      languageDesc: 'Choose your interface language',
      french: 'Français',
      english: 'English',
      notifications: 'Notifications',
      notificationsDesc: 'Manage your notifications',
      pushNotifications: 'Push notifications',
      pushDesc: 'Receive notifications on your device',
      emailNotifications: 'Email notifications',
      emailDesc: 'Receive emails for important updates',
      profile: 'Profile',
      profileDesc: 'Personal information',
      email: 'Email',
      privacy: 'Privacy',
      privacyDesc: 'Manage your personal data',
      theme: 'Theme',
      themeDesc: 'Customize appearance',
      light: 'Light',
      dark: 'Dark',
      auto: 'Auto',
    },
  };

  const text = t[locale];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{text.title}</h1>
        <p className="text-gray-600">{text.subtitle}</p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Langue */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-[#ECF8F6] rounded-lg">
              <Globe className="w-6 h-6 text-[#18534F]" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {text.language}
              </h2>
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
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-[#ECF8F6] rounded-lg">
              <User className="w-6 h-6 text-[#18534F]" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {text.profile}
              </h2>
              <p className="text-sm text-gray-600 mb-4">{text.profileDesc}</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {text.email}
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-[#ECF8F6] rounded-lg">
              <Bell className="w-6 h-6 text-[#18534F]" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {text.notifications}
              </h2>
              <p className="text-sm text-gray-600 mb-4">{text.notificationsDesc}</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{text.pushNotifications}</p>
                    <p className="text-sm text-gray-600">{text.pushDesc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications(!notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications ? 'bg-[#18534F]' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{text.emailNotifications}</p>
                    <p className="text-sm text-gray-600">{text.emailDesc}</p>
                  </div>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      emailNotifications ? 'bg-[#18534F]' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        emailNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confidentialité */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-[#ECF8F6] rounded-lg">
              <Shield className="w-6 h-6 text-[#18534F]" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {text.privacy}
              </h2>
              <p className="text-sm text-gray-600">{text.privacyDesc}</p>
            </div>
          </div>
        </div>

        {/* Thème */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-[#ECF8F6] rounded-lg">
              <Palette className="w-6 h-6 text-[#18534F]" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {text.theme}
              </h2>
              <p className="text-sm text-gray-600 mb-4">{text.themeDesc}</p>
              <Select defaultValue="light">
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">☀️ {text.light}</SelectItem>
                  <SelectItem value="dark">🌙 {text.dark}</SelectItem>
                  <SelectItem value="auto">🔄 {text.auto}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
