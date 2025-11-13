import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { redirect } from 'next/navigation';
import InvitationAcceptForm from './_components/InvitationAcceptForm';

export default async function InvitationPage({
  params,
}: {
  params: { token: string };
}) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // Vérifier si l'utilisateur est déjà connecté
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Si l'utilisateur est déjà connecté, rediriger vers le dashboard
    redirect('/dashboard');
  }

  // Valider le token d'invitation
  const { data: invitation, error } = await supabase
    .from('student_invitations')
    .select(
      `
      *,
      school:schools (
        id,
        name,
        logo_url
      )
    `
    )
    .eq('token', params.token)
    .is('used_at', null)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ECF8F6] px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invitation invalide
          </h1>
          <p className="text-gray-600 mb-6">
            Cette invitation est expirée, a déjà été utilisée, ou n&apos;existe
            pas.
          </p>
          <a
            href="/login"
            className="inline-block bg-[#18534F] text-white px-6 py-3 rounded-lg hover:bg-[#226D68] transition-colors"
          >
            Retour à la connexion
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#ECF8F6] px-4 py-12">
      <InvitationAcceptForm
        invitation={{
          email: invitation.email,
          firstName: invitation.first_name || '',
          lastName: invitation.last_name || '',
          token: invitation.token,
          schoolName: invitation.school?.name || '',
          schoolLogo: invitation.school?.logo_url || '',
        }}
      />
    </div>
  );
}
