'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { Globe, User, Bell, Shield, Palette, Building2, Users, Mail } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function AssociationSettingsPage() {
  const { user } = useAuth();
  const { locale, setLocale } = useLocale();
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [memberNotifications, setMemberNotifications] = useState(true);
  const [missionNotifications, setMissionNotifications] = useState(true);

  // Sauvegarder la langue
  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale as 'fr' | 'en');
  };

  const t = {
    fr: {
      title: 'Paramètres de l\'association',
      subtitle: 'Gérez les préférences de votre association',
      
      // Langue
      language: 'Langue',
      languageDesc: 'Choisissez la langue de l\'interface',
      french: 'Français',
      english: 'English',
      
      // Compte
      account: 'Compte',
      accountDesc: 'Informations du compte gestionnaire',
      email: 'Email du gestionnaire',
      
      // Association
      association: 'Association',
      associationDesc: 'Informations de votre association',
      associationName: 'Nom de l\'association',
      associationEmail: 'Email de contact',
      
      // Notifications
      notifications: 'Notifications',
      notificationsDesc: 'Gérez vos notifications',
      pushNotifications: 'Notifications push',
      pushDesc: 'Recevoir des notifications sur votre appareil',
      emailNotifications: 'Notifications par email',
      emailDesc: 'Recevoir des emails pour les mises à jour importantes',
      memberNotifications: 'Notifications membres',
      memberDesc: 'Être notifié des nouvelles inscriptions de membres',
      missionNotifications: 'Notifications missions',
      missionDesc: 'Être notifié des inscriptions aux missions',
      
      // Confidentialité
      privacy: 'Confidentialité',
      privacyDesc: 'Gérez la visibilité de votre association',
      
      // Thème
      theme: 'Thème',
      themeDesc: 'Personnalisez l\'apparence',
      light: 'Clair',
      dark: 'Sombre',
      auto: 'Automatique',
      
      // Membres
      members: 'Gestion des membres',
      membersDesc: 'Paramètres liés aux membres de l\'association',
    },
    en: {
      title: 'Association Settings',
      subtitle: 'Manage your association preferences',
      
      language: 'Language',
      languageDesc: 'Choose your interface language',
      french: 'Français',
      english: 'English',
      
      account: 'Account',
      accountDesc: 'Manager account information',
      email: 'Manager email',
      
      association: 'Association',
      associationDesc: 'Your association information',
      associationName: 'Association name',
      associationEmail: 'Contact email',
      
      notifications: 'Notifications',
      notificationsDesc: 'Manage your notifications',
      pushNotifications: 'Push notifications',
      pushDesc: 'Receive notifications on your device',
      emailNotifications: 'Email notifications',
      emailDesc: 'Receive emails for important updates',
      memberNotifications: 'Member notifications',
      memberDesc: 'Be notified of new member registrations',
      missionNotifications: 'Mission notifications',
      missionDesc: 'Be notified of mission registrations',
      
      privacy: 'Privacy',
      privacyDesc: 'Manage your association visibility',
      
      theme: 'Theme',
      themeDesc: 'Customize appearance',
      light: 'Light',
      dark: 'Dark',
      auto: 'Auto',
      
      members: 'Member management',
      membersDesc: 'Settings related to association members',
    },
  };

  const text = t[locale];

  return (
    <div className="p-8 bg-[#ECF8F6] min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Building2 className="w-8 h-8 text-[#18534F]" />
          {text.title}
        </h1>
        <p className="text-gray-600">{text.subtitle}</p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Langue */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#18534F]">
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

        {/* Compte gestionnaire */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#226D68]">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-[#ECF8F6] rounded-lg">
              <User className="w-6 h-6 text-[#226D68]" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {text.account}
              </h2>
              <p className="text-sm text-gray-600 mb-4">{text.accountDesc}</p>
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

        {/* Association */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#D6955B]">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-[#ECF8F6] rounded-lg">
              <Building2 className="w-6 h-6 text-[#D6955B]" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {text.association}
              </h2>
              <p className="text-sm text-gray-600 mb-4">{text.associationDesc}</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {text.associationName}
                  </label>
                  <input
                    type="text"
                    placeholder="Association des étudiants"
                    className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18534F]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {text.associationEmail}
                  </label>
                  <input
                    type="email"
                    placeholder="contact@association.fr"
                    className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18534F]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#FEEAA1]">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-[#ECF8F6] rounded-lg">
              <Bell className="w-6 h-6 text-[#D6955B]" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {text.notifications}
              </h2>
              <p className="text-sm text-gray-600 mb-4">{text.notificationsDesc}</p>
              <div className="space-y-4">
                {/* Push notifications */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
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

                {/* Email notifications */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
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

                {/* Member notifications */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900">{text.memberNotifications}</p>
                    <p className="text-sm text-gray-600">{text.memberDesc}</p>
                  </div>
                  <button
                    onClick={() => setMemberNotifications(!memberNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      memberNotifications ? 'bg-[#18534F]' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        memberNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Mission notifications */}
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">{text.missionNotifications}</p>
                    <p className="text-sm text-gray-600">{text.missionDesc}</p>
                  </div>
                  <button
                    onClick={() => setMissionNotifications(!missionNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      missionNotifications ? 'bg-[#18534F]' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        missionNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gestion des membres */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#226D68]">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-[#ECF8F6] rounded-lg">
              <Users className="w-6 h-6 text-[#226D68]" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                {text.members}
              </h2>
              <p className="text-sm text-gray-600">{text.membersDesc}</p>
            </div>
          </div>
        </div>

        {/* Confidentialité */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#18534F]">
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
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-[#D6955B]">
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 bg-[#ECF8F6] rounded-lg">
              <Palette className="w-6 h-6 text-[#D6955B]" />
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
