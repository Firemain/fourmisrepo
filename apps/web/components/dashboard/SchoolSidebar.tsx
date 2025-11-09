'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, GraduationCap, Settings, LogOut, School } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

interface SchoolSidebarProps {
  locale: 'fr' | 'en';
}

export default function SchoolSidebar({ locale }: SchoolSidebarProps) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const translations = {
    fr: {
      home: 'Accueil',
      students: 'Étudiants',
      teachers: 'Enseignants',
      levels: 'Niveaux académiques',
      settings: 'Paramètres',
      logout: 'Déconnexion',
    },
    en: {
      home: 'Home',
      students: 'Students',
      teachers: 'Teachers',
      levels: 'Academic Levels',
      settings: 'Settings',
      logout: 'Logout',
    },
  };

  const t = translations[locale];

  const menuItems = [
    { href: '/dashboard-school', icon: Home, label: t.home },
    { href: '/dashboard-school/students', icon: Users, label: t.students },
    { href: '/dashboard-school/teachers', icon: GraduationCap, label: t.teachers },
    { href: '/dashboard-school/levels', icon: School, label: t.levels },
    { href: '/dashboard-school/settings', icon: Settings, label: t.settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/dashboard-school" className="flex items-center gap-2">
          <span className="text-3xl">🏫</span>
          <div>
            <span className="text-xl font-bold text-[#18534F] block">Fourmis</span>
            <span className="text-xs text-gray-500">École</span>
          </div>
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[#ECF8F6] text-[#18534F] font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>{t.logout}</span>
        </button>
      </div>
    </aside>
  );
}
