'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'fr' | 'en';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('fr');
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger la langue depuis localStorage au montage
  useEffect(() => {
    const savedLocale = localStorage.getItem('fourmis-locale') as Locale | null;
    if (savedLocale) {
      setLocaleState(savedLocale);
    }
    setIsLoaded(true);
  }, []);

  // Fonction pour changer la langue
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('fourmis-locale', newLocale);
  };

  // Ne pas rendre les enfants tant que la langue n'est pas chargée
  if (!isLoaded) {
    return null;
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
