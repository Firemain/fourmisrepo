import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AppLocaleLayout({
  children,
  params
}: Props) {
  const { locale } = await params;
  
  // Vérifier que la locale est supportée
  const supportedLocales = ['fr', 'en'];
  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  // Récupérer les messages de traduction
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
}
