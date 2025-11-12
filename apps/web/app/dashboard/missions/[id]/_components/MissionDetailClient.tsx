'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Tag,
  Heart,
  Share2,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { registerForMission, unregisterFromMission } from '../../actions';

interface Mission {
  id: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string | null;
  duration: number;
  maximumParticipant: number | null;
  status: string;
  recurrenceType: string;
  association: {
    id: string;
    name: string;
    description: string;
    logoUrl: string | null;
  };
  location: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  } | null;
  tags: Array<{
    id: string;
    name: string;
  }>;
  stats: {
    totalRegistrations: number;
    spotsLeft: number | null;
  };
  userRegistration: {
    id: string;
    status: string;
  } | null;
}

interface MissionDetailClientProps {
  mission: Mission;
  schoolMemberId: string;
  locale: 'fr' | 'en';
}

export default function MissionDetailClient({
  mission,
  schoolMemberId,
  locale,
}: MissionDetailClientProps) {
  const router = useRouter();
  const { showToast, ToastComponent } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const t = {
    fr: {
      backToMissions: 'Retour aux missions',
      confirmedStatus: 'Inscription confirmée',
      pendingStatus: 'En attente de validation',
      aboutAssociation: 'À propos de l\'association',
      practicalInfo: 'Informations pratiques',
      date: 'Date',
      duration: 'Durée',
      location: 'Lieu',
      spots: 'Places',
      spot: 'place',
      spots_plural: 'places',
      remaining: 'restante',
      remaining_plural: 'restantes',
      enrolled: 'inscrits',
      register: 'S\'inscrire',
      full: 'Complet',
      registering: 'Inscription...',
      cancelRegistration: 'Annuler mon inscription',
      cancelTitle: 'Annuler l\'inscription',
      irreversible: 'Cette action est irréversible',
      confirmPrompt: 'Pour confirmer, veuillez taper',
      confirmText: 'ANNULER',
      confirmPlaceholder: 'Tapez ANNULER',
      back: 'Retour',
      confirm: 'Confirmer',
      canceling: 'Annulation...',
      registrationSuccess: 'Votre demande a été envoyée à l\'association.',
      registrationError: 'Impossible de s\'inscrire.',
      unregistrationSuccess: 'Désinscription réussie',
      unregistrationError: 'Impossible de se désinscrire.',
      linkCopied: 'Lien copié !',
      error: 'Une erreur est survenue.'
    },
    en: {
      backToMissions: 'Back to missions',
      confirmedStatus: 'Registration confirmed',
      pendingStatus: 'Pending validation',
      aboutAssociation: 'About the association',
      practicalInfo: 'Practical information',
      date: 'Date',
      duration: 'Duration',
      location: 'Location',
      spots: 'Spots',
      spot: 'spot',
      spots_plural: 'spots',
      remaining: 'remaining',
      remaining_plural: 'remaining',
      enrolled: 'enrolled',
      register: 'Register',
      full: 'Full',
      registering: 'Registering...',
      cancelRegistration: 'Cancel registration',
      cancelTitle: 'Cancel registration',
      irreversible: 'This action is irreversible',
      confirmPrompt: 'To confirm, please type',
      confirmText: 'CANCEL',
      confirmPlaceholder: 'Type CANCEL',
      back: 'Back',
      confirm: 'Confirm',
      canceling: 'Canceling...',
      registrationSuccess: 'Your request has been sent to the association.',
      registrationError: 'Unable to register.',
      unregistrationSuccess: 'Successfully unregistered',
      unregistrationError: 'Unable to unregister.',
      linkCopied: 'Link copied!',
      error: 'An error occurred.'
    }
  };

  const text = t[locale];

  const isRegistered = !!mission.userRegistration;
  const isConfirmed = mission.userRegistration?.status === 'CONFIRMED';
  const isPending = mission.userRegistration?.status === 'PENDING';
  const isFull = mission.stats.spotsLeft !== null && mission.stats.spotsLeft <= 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours}h`;
    return `${hours}h${mins}`;
  };

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      const result = await registerForMission(mission.id, schoolMemberId);
      if (result.success) {
        showToast(text.registrationSuccess, 'success');
        router.refresh();
      } else {
        showToast(result.error || text.registrationError, 'error');
      }
    } catch (error) {
      showToast(text.error, 'error');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleUnregister = async () => {
    if (!mission.userRegistration) return;
    
    setIsRegistering(true);
    try {
      const result = await unregisterFromMission(mission.userRegistration.id);
      if (result.success) {
        showToast(text.unregistrationSuccess, 'success');
        setShowCancelModal(false);
        setConfirmText('');
        router.refresh();
      } else {
        showToast(result.error || text.unregistrationError, 'error');
      }
    } catch (error) {
      showToast(text.error, 'error');
    } finally {
      setIsRegistering(false);
    }
  };

  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (url && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast(text.linkCopied, 'success');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#ECF8F6]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link
            href="/dashboard/missions"
            className="inline-flex items-center gap-2 text-[#18534F] hover:text-[#226D68] transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">{text.backToMissions}</span>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Carte principale */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              {/* Badge de statut */}
              {isConfirmed && (
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                  <CheckCircle size={16} />
                  {text.confirmedStatus}
                </div>
              )}
              {isPending && (
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-full text-sm font-medium">
                  <AlertCircle size={16} />
                  {text.pendingStatus}
                </div>
              )}

              {/* Titre et association */}
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {mission.title}
              </h1>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-lg text-[#D6955B] font-semibold">
                  {mission.association.name}
                </span>
              </div>

              {/* Tags */}
              {mission.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {mission.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      className="bg-[#FEEAA1] text-[#D6955B] hover:bg-[#D6955B] hover:text-white"
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Description */}
              <div className="prose prose-gray max-w-none mb-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {mission.description}
                </p>
              </div>
            </div>

            {/* À propos de l'association */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {text.aboutAssociation}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {mission.association.description}
              </p>
            </div>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Informations pratiques */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                {text.practicalInfo}
              </h3>

              <div className="space-y-4 mb-6">
                {/* Date */}
                <div className="flex items-start gap-3">
                  <Calendar className="text-[#18534F] mt-1 shrink-0" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">{text.date}</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(mission.startAt)}
                    </p>
                  </div>
                </div>

                {/* Durée */}
                <div className="flex items-start gap-3">
                  <Clock className="text-[#18534F] mt-1 shrink-0" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">{text.duration}</p>
                    <p className="font-medium text-gray-900">
                      {formatDuration(mission.duration)}
                    </p>
                  </div>
                </div>

                {/* Lieu */}
                {mission.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="text-[#18534F] mt-1 shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">{text.location}</p>
                      <p className="font-medium text-gray-900">
                        {mission.location.street}
                      </p>
                      <p className="text-sm text-gray-600">
                        {mission.location.postalCode} {mission.location.city}
                      </p>
                    </div>
                  </div>
                )}

                {/* Places disponibles */}
                {mission.stats.spotsLeft !== null && (
                  <div className="flex items-start gap-3">
                    <Users className="text-[#18534F] mt-1 shrink-0" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">{text.spots}</p>
                      <p className="font-medium text-gray-900">
                        {mission.stats.spotsLeft} {mission.stats.spotsLeft > 1 ? text.spots_plural : text.spot} {mission.stats.spotsLeft > 1 ? text.remaining_plural : text.remaining}
                      </p>
                      <p className="text-xs text-gray-500">
                        {mission.stats.totalRegistrations} / {mission.maximumParticipant} {text.enrolled}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Boutons d'action */}
              <div className="space-y-3">
                {!isRegistered ? (
                  <Button
                    onClick={handleRegister}
                    disabled={isRegistering || isFull}
                    className="w-full bg-[#18534F] hover:bg-[#226D68] text-white transition-colors"
                  >
                    {isRegistering ? text.registering : isFull ? text.full : text.register}
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowCancelModal(true)}
                    disabled={isRegistering}
                    className="w-full bg-rose-100 hover:bg-rose-200 text-rose-700 transition-colors"
                  >
                    {text.cancelRegistration}
                  </Button>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsSaved(!isSaved)}
                    className={`flex-1 transition-all ${
                      isSaved 
                        ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' 
                        : 'bg-[#18534F] text-white hover:bg-[#226D68]'
                    }`}
                  >
                    <Heart
                      size={18}
                      className={isSaved ? 'fill-rose-600' : ''}
                    />
                  </Button>
                  <Button 
                    onClick={handleShare} 
                    className="flex-1 bg-[#18534F] text-white hover:bg-[#226D68] transition-colors"
                  >
                    <Share2 size={18} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modale de confirmation d'annulation */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {text.cancelTitle}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {text.irreversible}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setConfirmText('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-700 mb-4">
                {text.confirmPrompt}{' '}
                <span className="font-semibold text-gray-900">{text.confirmText}</span> :
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={text.confirmPlaceholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18534F] focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowCancelModal(false);
                  setConfirmText('');
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                {text.back}
              </Button>
              <Button
                onClick={handleUnregister}
                disabled={confirmText !== text.confirmText || isRegistering}
                className="flex-1 bg-rose-100 hover:bg-rose-200 text-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isRegistering ? text.canceling : text.confirm}
              </Button>
            </div>
          </div>
        </div>
      )}

      {ToastComponent}
    </div>
  );
}
