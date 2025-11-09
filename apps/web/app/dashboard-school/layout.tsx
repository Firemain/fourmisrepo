'use client';

import { LocaleProvider, useLocale } from '@/lib/i18n/LocaleContext';
import SchoolSidebar from '@/components/dashboard/SchoolSidebar';

function SchoolDashboardContent({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();

  return (
    <div className="flex h-screen bg-[#ECF8F6] overflow-hidden">
      <SchoolSidebar locale={locale} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default function SchoolDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocaleProvider>
      <SchoolDashboardContent>{children}</SchoolDashboardContent>
    </LocaleProvider>
  );
}
