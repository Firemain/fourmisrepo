'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { checkOnboardingStatus } from '@/lib/auth/onboarding';
import { LocaleProvider, useLocale } from '@/lib/i18n/LocaleContext';
import Sidebar from '@/components/dashboard/Sidebar';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user } = useAuth();
  const { locale } = useLocale();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Vérifier si l'utilisateur a complété son onboarding
    const checkOnboarding = async () => {
      const hasCompleted = await checkOnboardingStatus(user.id);
      if (!hasCompleted) {
        router.push('/onboarding');
      } else {
        setIsCheckingOnboarding(false);
      }
    };

    checkOnboarding();
  }, [user, router]);

  if (!user || isCheckingOnboarding) {
    return (
      <div className="min-h-screen bg-[#ECF8F6] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#18534F] rounded-full mb-4">
            <span className="text-3xl">🐜</span>
          </div>
          <p className="text-gray-600">
            {locale === 'fr' ? 'Chargement...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#ECF8F6] overflow-hidden">
      <Sidebar locale={locale} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocaleProvider>
      <DashboardContent>{children}</DashboardContent>
    </LocaleProvider>
  );
}
