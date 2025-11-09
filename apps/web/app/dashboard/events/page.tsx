'use client';

import { useLocale } from '@/lib/i18n/LocaleContext';

export default function EventsPage() {
  const { locale } = useLocale();

  const t = {
    fr: {
      title: 'Événements 📅',
      subtitle: 'Découvrez les événements à venir et inscrivez-vous',
      construction: 'Page en construction',
      soon: 'Cette fonctionnalité sera bientôt disponible !',
    },
    en: {
      title: 'Events 📅',
      subtitle: 'Discover upcoming events and register',
      construction: 'Under construction',
      soon: 'This feature will be available soon!',
    },
  };

  const text = t[locale];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{text.title}</h1>
        <p className="text-gray-600">{text.subtitle}</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{text.construction}</h2>
        <p className="text-gray-600">{text.soon}</p>
      </div>
    </div>
  );
}
