'use client';

interface User {
  firstName: string;
  lastName: string;
}

interface DashboardHeaderProps {
  user: User;
  locale: 'fr' | 'en';
}

export default function DashboardHeader({ user, locale }: DashboardHeaderProps) {
  const t = {
    fr: {
      welcome: 'Bienvenue',
      subtitle: 'Voici votre espace personnel Fourmis',
    },
    en: {
      welcome: 'Welcome',
      subtitle: 'Here is your personal Fourmis space',
    },
  };

  const text = t[locale];

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {text.welcome}, {user.firstName} ! 👋
        </h1>
        <p className="text-[#226D68] text-lg">
          {text.subtitle}
        </p>
      </div>
    </div>
  );
}
