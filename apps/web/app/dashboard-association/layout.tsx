import AssociationDashboardLayoutClient from './_components/AssociationDashboardLayoutClient';

export default function AssociationDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // All authentication and permission checks are now handled by middleware
  // See: apps/web/middleware.ts and lib/supabase/middleware.ts
  return <AssociationDashboardLayoutClient>{children}</AssociationDashboardLayoutClient>;
}


