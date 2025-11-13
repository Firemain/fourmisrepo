import * as React from 'react';

interface StudentInvitationEmailProps {
  firstName: string;
  schoolName: string;
  invitationLink: string;
}

export function StudentInvitationEmail({
  firstName,
  schoolName,
  invitationLink,
}: StudentInvitationEmailProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body
        style={{
          backgroundColor: '#ECF8F6',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          padding: '40px 20px',
        }}
      >
        <div
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* En-tête avec couleur primaire */}
          <div
            style={{
              backgroundColor: '#18534F',
              padding: '40px 30px',
              textAlign: 'center',
            }}
          >
            <h1
              style={{
                color: '#ffffff',
                fontSize: '28px',
                fontWeight: 'bold',
                margin: '0 0 10px 0',
              }}
            >
              🎓 Bienvenue sur Fourmis !
            </h1>
            <p
              style={{
                color: '#FEEAA1',
                fontSize: '16px',
                margin: 0,
              }}
            >
              Valorisez votre engagement étudiant
            </p>
          </div>

          {/* Contenu principal */}
          <div style={{ padding: '40px 30px' }}>
            <p
              style={{
                fontSize: '16px',
                color: '#333333',
                lineHeight: '1.6',
                marginBottom: '20px',
              }}
            >
              Bonjour {firstName || 'étudiant(e)'} 👋
            </p>

            <p
              style={{
                fontSize: '16px',
                color: '#333333',
                lineHeight: '1.6',
                marginBottom: '20px',
              }}
            >
              <strong style={{ color: '#18534F' }}>{schoolName}</strong> vous
              invite à rejoindre <strong>Fourmis</strong>, la plateforme qui
              valorise l'engagement étudiant et vous connecte avec des
              associations locales.
            </p>

            <div
              style={{
                backgroundColor: '#ECF8F6',
                borderLeft: '4px solid #18534F',
                padding: '20px',
                marginBottom: '30px',
                borderRadius: '4px',
              }}
            >
              <p
                style={{
                  fontSize: '14px',
                  color: '#226D68',
                  margin: 0,
                  lineHeight: '1.6',
                }}
              >
                <strong>Avec Fourmis, vous pourrez :</strong>
                <br />
                • Participer à des missions associatives
                <br />
                • Valoriser vos compétences et votre engagement
                <br />
                • Obtenir des attestations officielles
                <br />• Contribuer aux Objectifs de Développement Durable
              </p>
            </div>

            {/* Bouton CTA */}
            <div style={{ textAlign: 'center', margin: '40px 0' }}>
              <a
                href={invitationLink}
                style={{
                  display: 'inline-block',
                  backgroundColor: '#18534F',
                  color: '#ffffff',
                  padding: '16px 40px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                Créer mon compte
              </a>
            </div>

            <p
              style={{
                fontSize: '14px',
                color: '#666666',
                textAlign: 'center',
                marginTop: '30px',
              }}
            >
              Ce lien d'invitation est valable pendant <strong>7 jours</strong>.
            </p>

            <div
              style={{
                marginTop: '30px',
                paddingTop: '30px',
                borderTop: '1px solid #E5E7EB',
              }}
            >
              <p
                style={{
                  fontSize: '13px',
                  color: '#999999',
                  lineHeight: '1.6',
                }}
              >
                Si le bouton ne fonctionne pas, copiez et collez ce lien dans
                votre navigateur :
                <br />
                <a
                  href={invitationLink}
                  style={{
                    color: '#18534F',
                    wordBreak: 'break-all',
                  }}
                >
                  {invitationLink}
                </a>
              </p>
            </div>
          </div>

          {/* Pied de page */}
          <div
            style={{
              backgroundColor: '#F9FAFB',
              padding: '30px',
              textAlign: 'center',
              borderTop: '1px solid #E5E7EB',
            }}
          >
            <p
              style={{
                fontSize: '14px',
                color: '#666666',
                margin: '0 0 10px 0',
              }}
            >
              Vous avez des questions ?{' '}
              <a
                href="mailto:support@fourmis.fr"
                style={{ color: '#18534F', textDecoration: 'none' }}
              >
                Contactez-nous
              </a>
            </p>
            <p
              style={{
                fontSize: '12px',
                color: '#999999',
                margin: 0,
              }}
            >
              © 2025 Fourmis - Plateforme de valorisation de l'engagement
              étudiant
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
