'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Target, 
  Users, 
  Trophy, 
  Calendar,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';

const menuItems = [
  {
    icon: Home,
    label: { fr: 'Accueil', en: 'Home' },
    href: '/dashboard',
  },
  {
    icon: Target,
    label: { fr: 'Missions', en: 'Missions' },
    href: '/dashboard/missions',
  },
  {
    icon: Users,
    label: { fr: 'Associations', en: 'Clubs' },
    href: '/dashboard/associations',
  },
  {
    icon: Trophy,
    label: { fr: 'Badges', en: 'Badges' },
    href: '/dashboard/badges',
  },
  {
    icon: Calendar,
    label: { fr: 'Événements', en: 'Events' },
    href: '/dashboard/events',
  },
  {
    icon: Settings,
    label: { fr: 'Paramètres', en: 'Settings' },
    href: '/dashboard/settings',
  },
];

interface SidebarProps {
  locale?: 'fr' | 'en';
}

export default function Sidebar({ locale = 'fr' }: SidebarProps) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
        <span className="text-3xl">🐜</span>
        <span className="text-2xl font-bold text-[#18534F]">Fourmis</span>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                ${
                  isActive
                    ? 'bg-[#ECF8F6] text-[#18534F]'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-[#18534F]'
                }
              `}
            >
              <Icon className="h-5 w-5" />
              {item.label[locale]}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-gray-200 p-3">
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          {locale === 'fr' ? 'Se déconnecter' : 'Sign out'}
        </button>
      </div>
    </div>
  );
}
