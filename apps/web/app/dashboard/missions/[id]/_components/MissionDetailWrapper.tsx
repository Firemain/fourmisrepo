'use client';

import { useLocale } from '@/lib/i18n/LocaleContext';
import MissionDetailClient from './MissionDetailClient';

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

interface MissionDetailWrapperProps {
  mission: Mission;
  schoolMemberId: string;
}

export default function MissionDetailWrapper({ mission, schoolMemberId }: MissionDetailWrapperProps) {
  const { locale } = useLocale();
  
  return <MissionDetailClient mission={mission} schoolMemberId={schoolMemberId} locale={locale} />;
}
