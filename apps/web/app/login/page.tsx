'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { useToast } from '@/components/ui/toast';
import { checkOnboardingStatus } from '@/lib/auth/onboarding';
import { getUserRole } from '@/lib/auth/getUserRole';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const { showToast, ToastComponent } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
        setIsLoading(false);
      } else {
        // Vérifier le rôle de l'utilisateur
        const supabase = (await import('@/lib/supabase/client')).createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const role = await getUserRole(user.id);
          
          // Rediriger selon le rôle
          if (role === 'SCHOOL') {
            router.push('/dashboard-school');
          } else if (role === 'ASSOCIATION') {
            router.push('/dashboard-association');
          } else if (role === 'STUDENT') {
            // Pour les étudiants, vérifier l'onboarding
            const hasCompletedOnboarding = await checkOnboardingStatus(user.id);
            if (hasCompletedOnboarding) {
              router.push('/dashboard');
            } else {
              router.push('/onboarding');
            }
          } else {
            // Rôle inconnu, aller vers onboarding
            router.push('/onboarding');
          }
        } else {
          router.push('/onboarding');
        }
      }
    } else {
      const fullName = formData.get('fullName') as string;
      const { error } = await signUp(email, password, {
        full_name: fullName,
        role: 'STUDENT', // Tous les nouveaux comptes sont des étudiants
      });
      if (error) {
        setError(error.message);
        setIsLoading(false);
      } else {
        showToast(
          '✉️ Un email de confirmation a été envoyé ! Vérifiez votre boîte de réception pour activer votre compte.',
          'success',
          7000
        );
        // Ne pas rediriger immédiatement, laisser voir le message
        setTimeout(() => {
          setIsLogin(true); // Basculer vers le mode connexion
        }, 2000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#ECF8F6] flex items-center justify-center p-4">
      {ToastComponent}
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-4xl">🐜</span>
            <span className="text-2xl font-bold text-[#18534F]">Fourmis</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Se connecter' : 'Créer un compte'}
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Accédez à votre espace' : 'Rejoignez la communauté'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required={!isLogin}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18534F] focus:border-transparent"
                  placeholder="Jean Dupont"
                />
                <p className="mt-2 text-xs text-gray-500">
                  🎓 Vous créez un compte étudiant. Les comptes écoles et associations sont sur invitation uniquement.
                </p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18534F] focus:border-transparent"
                placeholder="vous@exemple.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18534F] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#18534F] text-white py-3 rounded-lg font-semibold hover:bg-[#226D68] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Chargement...' : isLogin ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-sm text-[#18534F] hover:underline"
            >
              {isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
