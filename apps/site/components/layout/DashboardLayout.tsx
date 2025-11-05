"use client";

import { useState } from "react";
import { 
  Menu, 
  X, 
  Bell, 
  Settings, 
  LogOut, 
  User,
  ChevronDown
} from "lucide-react";
import Link from "next/link";

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface User {
  id: string;
  name: string;
  email: string;
  school?: string;
  promotion?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: Tab[];
}

const DashboardLayout = ({ children, user, activeTab, setActiveTab, tabs }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Safety check for user object
  if (!user) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🐜</div>
          <h1 className="text-2xl font-bold text-forest-green mb-2">Chargement...</h1>
          <p className="text-light-brown">Préparation de votre dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-beige sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and mobile menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-forest-green hover:text-light-green transition-colors"
              >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-forest-green rounded-full flex items-center justify-center">
                  <span className="text-cream font-bold text-lg">🐜</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-forest-green">FOURMIS</h1>
                  <p className="text-xs text-light-brown opacity-80">(FOR US)</p>
                </div>
              </Link>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-forest-green hover:text-light-green transition-colors">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 p-2 rounded-full hover:bg-beige transition-colors"
                >
                  <div className="w-8 h-8 bg-light-green rounded-full flex items-center justify-center">
                    <span className="text-forest-green font-bold text-sm">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-forest-green">{user.name}</p>
                    <p className="text-xs text-light-brown">{user.school}</p>
                  </div>
                  <ChevronDown size={16} className="text-light-brown" />
                </button>

                {/* Profile dropdown menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-beige py-2 z-50">
                    <button className="w-full px-4 py-2 text-left text-forest-green hover:bg-beige transition-colors flex items-center space-x-2">
                      <User size={16} />
                      <span>Mon profil</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-forest-green hover:bg-beige transition-colors flex items-center space-x-2">
                      <Settings size={16} />
                      <span>Paramètres</span>
                    </button>
                    <hr className="my-2 border-beige" />
                    <button className="w-full px-4 py-2 text-left text-red-500 hover:bg-red-50 transition-colors flex items-center space-x-2">
                      <LogOut size={16} />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6 pt-20 lg:pt-6">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-forest-green text-white shadow-lg'
                      : 'text-forest-green hover:bg-light-green/20 hover:text-forest-green'
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;