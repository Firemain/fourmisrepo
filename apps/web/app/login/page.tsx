'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { useToast } from '@/components/ui/toast';
import { checkOnboardingStatus } from '@/lib/auth/onboarding';
import { getUserRole } from '@/lib/auth/getUserRole';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Sparkles, Target, Users, Trophy } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-[#ECF8F6] via-white to-[#FEEAA1]/20 flex">
      {ToastComponent}
      
      {/* Colonne gauche - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#18534F] via-[#226D68] to-[#18534F] p-12 flex-col justify-between relative overflow-hidden">
        {/* Décorations d'arrière-plan */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FEEAA1] rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D6955B] rounded-full opacity-10 blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        {/* Logo et branding */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <span className="text-5xl group-hover:scale-110 transition-transform">🐜</span>
            <span className="text-3xl font-bold text-white">Fourmis</span>
          </Link>
          <p className="text-[#ECF8F6] text-lg mt-4 max-w-md">
            La plateforme qui valorise ton engagement étudiant
          </p>
        </div>

        {/* Features */}
        <div className="relative z-10 space-y-8">
          <h2 className="text-3xl font-bold text-white mb-8">
            Rejoins la communauté Fourmis
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 bg-[#FEEAA1] rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Target className="text-[#18534F]" size={24} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Trouve ta mission</h3>
                <p className="text-[#ECF8F6]/80">
                  Participe à des missions qui correspondent à tes valeurs et passions
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 bg-[#D6955B] rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Trophy className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Gagne des badges</h3>
                <p className="text-[#ECF8F6]/80">
                  Valorise ton engagement et débloquer des récompenses exclusives
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Users className="text-[#18534F]" size={24} />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Connecte-toi</h3>
                <p className="text-[#ECF8F6]/80">
                  Rencontre des étudiants et des associations qui partagent tes centres d'intérêt
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#FEEAA1] mb-1">500+</div>
            <div className="text-[#ECF8F6]/80 text-sm">Étudiants</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#FEEAA1] mb-1">50+</div>
            <div className="text-[#ECF8F6]/80 text-sm">Associations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#FEEAA1] mb-1">1000+</div>
            <div className="text-[#ECF8F6]/80 text-sm">Missions</div>
          </div>
        </div>
      </div>

      {/* Colonne droite - Formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <span className="text-4xl">🐜</span>
              <span className="text-2xl font-bold text-[#18534F]">Fourmis</span>
            </Link>
          </div>

          {/* Titre */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ECF8F6] rounded-full mb-4">
              <Sparkles className="text-[#18534F]" size={16} />
              <span className="text-sm font-medium text-[#18534F]">
                {isLogin ? 'Bon retour parmi nous !' : 'Bienvenue sur Fourmis'}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Se connecter' : 'Créer un compte'}
            </h1>
            <p className="text-gray-600">
              {isLogin ? 'Accédez à votre espace personnel' : 'Rejoignez la communauté étudiante'}
            </p>
          </div>

          {/* Formulaire */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm flex items-start gap-3">
                <div className="w-5 h-5 bg-rose-200 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-rose-800 text-xs font-bold">!</span>
                </div>
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required={!isLogin}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#18534F] focus:border-transparent transition-all"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <p className="mt-3 px-4 py-3 text-xs text-[#226D68] bg-[#ECF8F6] rounded-lg flex items-start gap-2">
                    <span className="text-base shrink-0">🎓</span>
                    <span>Vous créez un compte <strong>étudiant</strong>. Les comptes écoles et associations sont sur invitation uniquement.</span>
                  </p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#18534F] focus:border-transparent transition-all"
                    placeholder="vous@exemple.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#18534F] focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#18534F] to-[#226D68] text-white py-3.5 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Chargement...</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? 'Se connecter' : 'Créer mon compte'}</span>
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">ou</span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="mt-6 text-sm text-[#18534F] hover:text-[#226D68] font-medium hover:underline transition-colors"
              >
                {isLogin ? "Pas encore de compte ? Créer un compte" : 'Déjà un compte ? Se connecter'}
              </button>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-8">
            En continuant, vous acceptez nos{' '}
            <Link href="/terms" className="text-[#18534F] hover:underline">
              conditions d'utilisation
            </Link>{' '}
            et notre{' '}
            <Link href="/privacy" className="text-[#18534F] hover:underline">
              politique de confidentialité
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
