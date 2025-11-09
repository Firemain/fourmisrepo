'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { 
  Home, 
  Briefcase, 
  Users, 
  School, 
  Settings, 
  LogOut,
  BookOpen,
  TrendingUp,
  Calendar,
  Award,
  ChevronDown
} from 'lucide-react';
import { Role } from '@fourmis/types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: Role[];
  translationKey: string;
}

const getNavigationItems = (t: (key: string) => string): NavItem[] => [
  {
    label: t('dashboard'),
    translationKey: 'dashboard',
    href: '/dashboard',
    icon: <Home className="w-5 h-5" />,
    roles: ['student', 'association', 'school', 'admin'],
  },
  {
    label: t('missions'),
    translationKey: 'missions',
    href: '/dashboard/missions',
    icon: <Briefcase className="w-5 h-5" />,
    roles: ['student', 'association', 'school', 'admin'],
  },
  {
    label: t('myRegistrations'),
    translationKey: 'myRegistrations',
    href: '/dashboard/registrations',
    icon: <Calendar className="w-5 h-5" />,
    roles: ['student'],
  },
  {
    label: t('myPoints'),
    translationKey: 'myPoints',
    href: '/dashboard/points',
    icon: <Award className="w-5 h-5" />,
    roles: ['student'],
  },
  {
    label: t('stats'),
    translationKey: 'stats',
    href: '/dashboard/stats',
    icon: <TrendingUp className="w-5 h-5" />,
    roles: ['association', 'school', 'admin'],
  },
  {
    label: t('associations'),
    translationKey: 'associations',
    href: '/dashboard/associations',
    icon: <Users className="w-5 h-5" />,
    roles: ['school', 'admin'],
  },
  {
    label: t('schools'),
    translationKey: 'schools',
    href: '/dashboard/schools',
    icon: <School className="w-5 h-5" />,
    roles: ['admin'],
  },
  {
    label: t('docs'),
    translationKey: 'docs',
    href: '/dashboard/docs',
    icon: <BookOpen className="w-5 h-5" />,
    roles: ['student', 'association', 'school', 'admin'],
  },
];

interface SidebarProps {
  userRole: Role;
  userName?: string;
  userEmail?: string;
}

export function Sidebar({ userRole, userName = 'Utilisateur', userEmail }: SidebarProps) {
  const pathname = usePathname();
  const t = useTranslations('nav');
  const tAuth = useTranslations('auth');
  
  const navigationItems = getNavigationItems(t);
  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  const getRoleLabel = (role: Role) => {
    const labels: Record<Role, string> = {
      student: tAuth('student'),
      association: tAuth('association'),
      school: tAuth('school'),
      admin: 'Admin',
    };
    return labels[role];
  };

  const getRoleColor = (role: Role) => {
    const colors: Record<Role, string> = {
      student: 'bg-blue-100 text-blue-700 border-blue-200',
      association: 'bg-green-100 text-green-700 border-green-200',
      school: 'bg-purple-100 text-purple-700 border-purple-200',
      admin: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[role];
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#18534F] to-[#226D68] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
            <span className="text-2xl">🐜</span>
          </div>
          <span className="text-xl font-bold text-[#18534F]">Fourmis</span>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start px-2 h-auto py-2">
              <div className="flex items-center gap-3 w-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-[#18534F]/10 text-[#18534F] font-semibold">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
                  {userEmail && (
                    <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>
              <Badge variant="outline" className={getRoleColor(userRole)}>
                {getRoleLabel(userRole)}
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <Settings className="w-4 h-4 mr-2" />
                Paramètres
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => {
                // TODO: Implémenter la déconnexion avec Supabase
                window.location.href = '/login';
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              {tAuth('logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all ${
                isActive
                  ? 'bg-[#18534F] text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-[#18534F]'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Footer */}
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/docs">
            <Button variant="outline" className="flex-1 justify-start gap-2">
              <BookOpen className="w-4 h-4" />
              {t('docs')}
            </Button>
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </aside>
  );
}
