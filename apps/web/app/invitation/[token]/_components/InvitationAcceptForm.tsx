'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Mail, Lock, User, GraduationCap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';

interface InvitationData {
  email: string;
  firstName: string;
  lastName: string;
  token: string;
  schoolName: string;
}

interface InvitationAcceptFormProps {
  invitation: InvitationData;
}

export default function InvitationAcceptForm({
  invitation,
}: InvitationAcceptFormProps) {
  const router = useRouter();
  const { showToast, ToastComponent } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: invitation.email,
    firstName: invitation.firstName,
    lastName: invitation.lastName,
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/accept-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: invitation.token,
          firstName: formData.firstName,
          lastName: formData.lastName,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      showToast('Compte créé avec succès ! Redirection vers la connexion...', 'success');

      // Rediriger vers le login après 2 secondes
      setTimeout(() => {
        router.push('/login?message=account_created');
      }, 2000);
    } catch (error) {
      console.error('Error accepting invitation:', error);
      showToast(
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue lors de la création du compte',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {ToastComponent}
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        {/* En-tête avec logo de l'école */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <GraduationCap className="w-6 h-6 text-[#18534F]" />
            <h1 className="text-2xl font-bold text-gray-900">Bienvenue !</h1>
          </div>
          <p className="text-gray-600">
            <span className="font-semibold">{invitation.schoolName}</span> vous
            invite à rejoindre Fourmis
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email (readonly) */}
          <div>
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Email
            </Label>
            <div className="mt-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
          </div>

          {/* Prénom */}
          <div>
            <Label htmlFor="firstName" className="text-gray-700 font-medium">
              Prénom *
            </Label>
            <div className="mt-1 relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className={`pl-10 ${errors.firstName ? 'border-red-500' : ''}`}
                placeholder="Votre prénom"
              />
            </div>
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          {/* Nom */}
          <div>
            <Label htmlFor="lastName" className="text-gray-700 font-medium">
              Nom *
            </Label>
            <div className="mt-1 relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className={`pl-10 ${errors.lastName ? 'border-red-500' : ''}`}
                placeholder="Votre nom"
              />
            </div>
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>

          {/* Mot de passe */}
          <div>
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Mot de passe *
            </Label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                placeholder="Au moins 8 caractères"
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Confirmation mot de passe */}
          <div>
            <Label
              htmlFor="confirmPassword"
              className="text-gray-700 font-medium"
            >
              Confirmer le mot de passe *
            </Label>
            <div className="mt-1 relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className={`pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="Confirmez votre mot de passe"
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Bouton de soumission */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#18534F] hover:bg-[#226D68] text-white h-11 text-base font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Création du compte...
              </>
            ) : (
              'Créer mon compte'
            )}
          </Button>
        </form>

        {/* Lien vers login si déjà un compte */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Vous avez déjà un compte ?{' '}
            <a
              href="/login"
              className="text-[#18534F] hover:text-[#226D68] font-semibold"
            >
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
