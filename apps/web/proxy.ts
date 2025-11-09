import createIntlMiddleware from 'next-intl/middleware';
import { locales } from './i18n/request';
import { type NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale: 'fr',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/app': '/app',
  }
});

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Si c'est une route de l'app (/app/*), appliquer i18n
  // MAIS seulement si elle n'a pas déjà un locale
  const hasLocale = locales.some(locale => pathname.startsWith(`/app/${locale}`));
  
  if (pathname.startsWith('/app') && !hasLocale) {
    // Update Supabase session
    const supabaseResponse = await updateSession(request);
    
    // Apply i18n (va ajouter le locale)
    const intlResponse = intlMiddleware(request);
    
    // Merge cookies
    if (supabaseResponse.cookies.getAll().length > 0) {
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        intlResponse.cookies.set(cookie);
      });
    }
    
    return intlResponse;
  }

  // Pour les routes avec locale déjà présent, juste Supabase
  if (pathname.startsWith('/app') && hasLocale) {
    return await updateSession(request);
  }

  // Pour les autres routes (site vitrine), juste Supabase
  return await updateSession(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)']
};
