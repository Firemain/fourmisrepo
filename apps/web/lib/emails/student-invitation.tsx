import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Button,
} from '@react-email/components';

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
    <Html>
      <Head />
      <Body
        style={{
          backgroundColor: '#ECF8F6',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          padding: '40px 20px',
        }}
      >
        <Container
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
          <Section
            style={{
              backgroundColor: '#18534F',
              padding: '40px 30px',
              textAlign: 'center' as const,
            }}
          >
            <Text
              style={{
                color: '#ffffff',
                fontSize: '28px',
                fontWeight: 'bold',
                margin: '0 0 10px 0',
              }}
            >
              🎓 Bienvenue sur Fourmis !
            </Text>
            <Text
              style={{
                color: '#FEEAA1',
                fontSize: '16px',
                margin: 0,
              }}
            >
              Valorisez votre engagement étudiant
            </Text>
          </Section>

          {/* Contenu principal */}
          <Section style={{ padding: '40px 30px' }}>
            <Text
              style={{
                fontSize: '16px',
                color: '#333333',
                lineHeight: '1.6',
                marginBottom: '20px',
              }}
            >
              Bonjour {firstName || 'étudiant(e)'} 👋
            </Text>

            <Text
              style={{
                fontSize: '16px',
                color: '#333333',
                lineHeight: '1.6',
                marginBottom: '20px',
              }}
            >
              <strong style={{ color: '#18534F' }}>{schoolName}</strong> vous
              invite à rejoindre <strong>Fourmis</strong>, la plateforme qui
              valorise l&apos;engagement étudiant et vous connecte avec des
              associations locales.
            </Text>

            <Section
              style={{
                backgroundColor: '#ECF8F6',
                borderLeft: '4px solid #18534F',
                padding: '20px',
                marginBottom: '30px',
                borderRadius: '4px',
              }}
            >
              <Text
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
              </Text>
            </Section>

            {/* Bouton CTA */}
            <Section style={{ textAlign: 'center' as const, margin: '40px 0' }}>
              <Button
                href={invitationLink}
                style={{
                  backgroundColor: '#18534F',
                  color: '#ffffff',
                  padding: '16px 40px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  display: 'inline-block',
                }}
              >
                Créer mon compte
              </Button>
            </Section>

            <Text
              style={{
                fontSize: '14px',
                color: '#666666',
                textAlign: 'center' as const,
                marginTop: '30px',
              }}
            >
              Ce lien d&apos;invitation est valable pendant{' '}
              <strong>7 jours</strong>.
            </Text>

            <Section
              style={{
                marginTop: '30px',
                paddingTop: '30px',
                borderTop: '1px solid #E5E7EB',
              }}
            >
              <Text
                style={{
                  fontSize: '13px',
                  color: '#999999',
                  lineHeight: '1.6',
                }}
              >
                Si le bouton ne fonctionne pas, copiez et collez ce lien dans
                votre navigateur :
                <br />
                <Link
                  href={invitationLink}
                  style={{
                    color: '#18534F',
                    wordBreak: 'break-all' as const,
                  }}
                >
                  {invitationLink}
                </Link>
              </Text>
            </Section>
          </Section>

          {/* Pied de page */}
          <Section
            style={{
              backgroundColor: '#F9FAFB',
              padding: '30px',
              textAlign: 'center' as const,
              borderTop: '1px solid #E5E7EB',
            }}
          >
            <Text
              style={{
                fontSize: '14px',
                color: '#666666',
                margin: '0 0 10px 0',
              }}
            >
              Vous avez des questions ?{' '}
              <Link
                href="mailto:support@fourmis.fr"
                style={{ color: '#18534F', textDecoration: 'none' }}
              >
                Contactez-nous
              </Link>
            </Text>
            <Text
              style={{
                fontSize: '12px',
                color: '#999999',
                margin: 0,
              }}
            >
              © 2025 Fourmis - Plateforme de valorisation de l&apos;engagement
              étudiant
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
