'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/app/fr/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🐜</div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ECF8F6] via-white to-[#FEEAA1]/20">
      {/* Header */}
      <header className="border-b border-primary/10 bg-white/70 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <span className="text-3xl">🐜</span>
              <span className="text-xl font-bold text-[#18534F]">Fourmis</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button 
                onClick={handleSignOut}
                variant="outline"
                size="sm"
              >
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#18534F] mb-2">
            Bienvenue ! 👋
          </h1>
          <p className="text-xl text-muted-foreground">
            Votre dashboard Fourmis
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Mes missions</h3>
            <p className="text-muted-foreground mb-4">Gérez vos engagements</p>
            <Button className="w-full bg-[#18534F] hover:bg-[#226D68]">
              Voir mes missions
            </Button>
          </div>

          <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Mon profil</h3>
            <p className="text-muted-foreground mb-4">Personnalisez votre espace</p>
            <Button className="w-full" variant="outline">
              Modifier mon profil
            </Button>
          </div>

          <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Mes badges</h3>
            <p className="text-muted-foreground mb-4">Consultez vos récompenses</p>
            <Button className="w-full" variant="outline">
              Voir mes badges
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
