'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogIn, UserPlus, Sparkles, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations('auth');
  const { signIn, signUp } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string>('student');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    const { error } = await signUp(email, password, {
      full_name: fullName,
      role: role,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      // Redirect to a confirmation page or auto-login
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ECF8F6] via-white to-[#FEEAA1]/20 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#18534F] mb-4">
            <span className="text-3xl">🐜</span>
          </div>
          <h1 className="text-3xl font-bold text-[#18534F] mb-2">Fourmis</h1>
          <p className="text-muted-foreground">
            {t('registerTitle')}
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="gap-2">
              <LogIn className="w-4 h-4" />
              {t('login')}
            </TabsTrigger>
            <TabsTrigger value="register" className="gap-2">
              <UserPlus className="w-4 h-4" />
              {t('register')}
            </TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>{t('login')}</CardTitle>
                <CardDescription>
                  {t('loginDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">{t('email')}</Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="vous@exemple.com"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">{t('password')}</Label>
                      <a
                        href="#"
                        className="text-sm text-[#18534F] hover:underline"
                      >
                        {t('forgotPassword')}
                      </a>
                    </div>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="rounded border-gray-300"
                      disabled={isLoading}
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm text-muted-foreground"
                    >
                      {t('rememberMe')}
                    </label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#18534F] hover:bg-[#226D68]"
                    disabled={isLoading}
                  >
                    {isLoading ? t('loading') || 'Chargement...' : t('signIn')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Register Tab */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>{t('register')}</CardTitle>
                <CardDescription>
                  {t('registerDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">{t('fullName')}</Label>
                    <Input
                      id="register-name"
                      name="fullName"
                      type="text"
                      placeholder="Jean Dupont"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">{t('email')}</Label>
                    <Input
                      id="register-email"
                      name="email"
                      type="email"
                      placeholder="vous@exemple.com"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">{t('password')}</Label>
                    <Input
                      id="register-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">{t('role')}</Label>
                    <Select 
                      required 
                      value={role} 
                      onValueChange={setRole}
                      disabled={isLoading}
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder={t('selectRole')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#FEEAA1]" />
                            {t('student')}
                          </div>
                        </SelectItem>
                        <SelectItem value="association">
                          <div className="flex items-center gap-2">
                            <span className="text-[#226D68]">🤝</span>
                            {t('association')}
                          </div>
                        </SelectItem>
                        <SelectItem value="school">
                          <div className="flex items-center gap-2">
                            <span className="text-[#18534F]">🏫</span>
                            {t('school')}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      className="mt-1 rounded border-gray-300"
                      required
                      disabled={isLoading}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-muted-foreground"
                    >
                      {t('acceptTerms')}{' '}
                      <a href="#" className="text-[#18534F] hover:underline">
                        {t('termsOfUse')}
                      </a>{' '}
                      {t('and')}{' '}
                      <a href="#" className="text-[#18534F] hover:underline">
                        {t('privacyPolicy')}
                      </a>
                    </label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#18534F] hover:bg-[#226D68]"
                    disabled={isLoading}
                  >
                    {isLoading ? t('loading') || 'Chargement...' : t('signUp')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          {t('communityBadge', { count: '10,000' })}
        </p>
      </div>
    </div>
  );
}
