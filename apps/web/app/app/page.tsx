import { redirect } from 'next/navigation';

export default function AppRootPage() {
  // Rediriger vers /app/fr (locale par défaut)
  redirect('/app/fr');
}
