'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { useToast } from '@/components/ui/toast';
import { createClient } from '@/lib/supabase/client';
import { checkOnboardingStatus } from '@/lib/auth/onboarding';
import { getUserRole } from '@/lib/auth/getUserRole';
import { School, GraduationCap, MapPin, Phone } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface School {
  id: string;
  name: string;
  type: string;
}

interface AcademicLevel {
  id: string;
  display_name: string;
  name: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast, ToastComponent } = useToast();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [schools, setSchools] = useState<School[]>([]);
  const [academicLevels, setAcademicLevels] = useState<AcademicLevel[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState('');

  // Vérifier le rôle et rediriger vers le bon dashboard
  useEffect(() => {
    if (!user) return;

    const checkRoleAndStatus = async () => {
      // 1. Récupérer le rôle de l'utilisateur
      const role = await getUserRole(user.id);
      
      // 2. Si admin école ou association, rediriger directement
      if (role === 'SCHOOL') {
        router.push('/dashboard-school');
        return;
      }
      
      if (role === 'ASSOCIATION') {
        router.push('/dashboard-association');
        return;
      }

      // 3. Pour les étudiants, vérifier si l'onboarding est complété
      if (role === 'STUDENT') {
        const hasCompleted = await checkOnboardingStatus(user.id);
        if (hasCompleted) {
          router.push('/dashboard');
        } else {
          setIsCheckingStatus(false);
        }
      } else {
        // Rôle inconnu, afficher le formulaire
        setIsCheckingStatus(false);
      }
    };

    checkRoleAndStatus();
  }, [user, router]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    schoolId: '',
    academicLevelId: '',
    type: 'STUDENT' as 'STUDENT' | 'STAFF',
    country: 'France',
    city: '',
    postalCode: '',
    street: '',
    apartmentNumber: '',
    phoneNumber: '',
  });

  // Charger les écoles
  useEffect(() => {
    const fetchSchools = async () => {
      const { data, error } = await supabase
        .from('schools')
        .select('id, name, type')
        .eq('status', 'ACTIVE')
        .order('name');

      if (error) {
        console.error('Error fetching schools:', error);
      } else {
        setSchools(data || []);
      }
    };

    fetchSchools();
  }, [supabase]);

  // Charger les niveaux académiques quand une école est sélectionnée
  useEffect(() => {
    if (!selectedSchoolId) {
      setAcademicLevels([]);
      return;
    }

    const fetchAcademicLevels = async () => {
      const { data, error } = await supabase
        .from('ref_academic_levels')
        .select('id, display_name, name')
        .eq('school_id', selectedSchoolId)
        .order('display_name');

      if (error) {
        console.error('Error fetching academic levels:', error);
      } else {
        setAcademicLevels(data || []);
      }
    };

    fetchAcademicLevels();
  }, [selectedSchoolId, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorData = data as { error?: string };
        throw new Error(errorData.error || 'Une erreur est survenue');
      }

      showToast('✅ Votre profil a été complété avec succès !', 'success');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Onboarding error:', error);
      showToast(
        error instanceof Error ? error.message : 'Erreur lors de la création du profil',
        'error'
      );
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const element = e.target;
    const name = ('name' in element ? element.name : '') as string;
    const value = ('value' in element ? element.value : '') as string;
    
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'schoolId') {
      setSelectedSchoolId(value);
      setFormData((prev) => ({ ...prev, academicLevelId: '' }));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#ECF8F6] flex items-center justify-center">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (isCheckingStatus) {
    return (
      <div className="min-h-screen bg-[#ECF8F6] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#18534F] rounded-full mb-4">
            <span className="text-3xl">🐜</span>
          </div>
          <p className="text-gray-600">Vérification du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ECF8F6] py-12 px-4">
      {ToastComponent}
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#18534F] rounded-full mb-4">
            <span className="text-3xl">🐜</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenue sur Fourmis !
          </h1>
          <p className="text-gray-600">
            Complétez votre profil pour accéder à toutes les fonctionnalités
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations personnelles */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#18534F]" />
                Informations personnelles
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18534F] focus:border-transparent"
                    placeholder="Jean"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18534F] focus:border-transparent"
                    placeholder="Dupont"
                  />
                </div>
              </div>
            </div>

            {/* Informations scolaires */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <School className="w-5 h-5 text-[#18534F]" />
                Informations scolaires
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="schoolId" className="block text-sm font-medium text-gray-700 mb-1">
                    École *
                  </label>
                  <Select
                    value={formData.schoolId}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, schoolId: value, academicLevelId: '' }));
                      setSelectedSchoolId(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez votre école" />
                    </SelectTrigger>
                    <SelectContent>
                      {schools.map((school) => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedSchoolId && (
                  <div>
                    <label htmlFor="academicLevelId" className="block text-sm font-medium text-gray-700 mb-1">
                      Niveau académique *
                    </label>
                    <Select
                      value={formData.academicLevelId}
                      onValueChange={(value) => 
                        setFormData((prev) => ({ ...prev, academicLevelId: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        {academicLevels.map((level) => (
                          <SelectItem key={level.id} value={level.id}>
                            {level.display_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            {/* Coordonnées */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#18534F]" />
                Coordonnées
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      Ville *
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18534F] focus:border-transparent"
                      placeholder="Paris"
                    />
                  </div>
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Code postal *
                    </label>
                    <input
                      id="postalCode"
                      name="postalCode"
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18534F] focus:border-transparent"
                      placeholder="75001"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse *
                  </label>
                  <input
                    id="street"
                    name="street"
                    type="text"
                    required
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18534F] focus:border-transparent"
                    placeholder="10 rue de la République"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="apartmentNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Appartement (optionnel)
                    </label>
                    <input
                      id="apartmentNumber"
                      name="apartmentNumber"
                      type="text"
                      value={formData.apartmentNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18534F] focus:border-transparent"
                      placeholder="Bât. A, Appt. 12"
                    />
                  </div>
                  <div>
                    <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      Téléphone (optionnel)
                    </label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18534F] focus:border-transparent"
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#18534F] text-white py-3 rounded-lg font-semibold hover:bg-[#226D68] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Création en cours...' : 'Compléter mon profil'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
