'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Role } from '@fourmis/types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: Role;
  userName?: string;
  userEmail?: string;
}

export default function DashboardLayout({
  children,
  userRole = 'student', // Default pour le dev, sera remplacé par l'auth
  userName = 'Jean Dupont',
  userEmail = 'jean.dupont@exemple.com',
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        userRole={userRole} 
        userName={userName} 
        userEmail={userEmail} 
      />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
