'use client';

import { LocaleProvider, useLocale } from '@/lib/i18n/LocaleContext';
import AssociationSidebar from '@/components/dashboard/AssociationSidebar';

function AssociationDashboardContent({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();

  return (
    <div className="flex h-screen bg-[#ECF8F6] overflow-hidden">
      <AssociationSidebar locale={locale} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default function AssociationDashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocaleProvider>
      <AssociationDashboardContent>{children}</AssociationDashboardContent>
    </LocaleProvider>
  );
}
