import Link from "next/link";

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-primary/10 bg-white/50 backdrop-blur-sm">
        <nav className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-3xl font-bold text-primary">
              🐜 Fourmis
            </Link>
            <Link
              href="/app"
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-600"
            >
              Se connecter
            </Link>
          </div>
        </nav>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-4xl font-bold text-primary">Mentions légales</h1>

        <div className="space-y-8 rounded-xl bg-white p-8 shadow-md">
          <section>
            <h2 className="mb-4 text-2xl font-semibold text-primary">1. Éditeur du site</h2>
            <p className="text-secondary">
              Le site Fourmis est édité par [Nom de la société ou association]
              <br />
              Siège social : [Adresse complète]
              <br />
              Email : contact@fourmis.fr
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-primary">
              2. Directeur de la publication
            </h2>
            <p className="text-secondary">
              Le directeur de la publication est [Nom du directeur].
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-primary">3. Hébergement</h2>
            <p className="text-secondary">
              Le site est hébergé par Vercel Inc.
              <br />
              440 N Barranca Ave #4133
              <br />
              Covina, CA 91723
              <br />
              États-Unis
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-primary">
              4. Propriété intellectuelle
            </h2>
            <p className="text-secondary">
              L&apos;ensemble du contenu de ce site (textes, images, vidéos, etc.) est protégé
              par le droit d&apos;auteur. Toute reproduction, même partielle, est interdite sans
              autorisation préalable.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-primary">
              5. Données personnelles
            </h2>
            <p className="text-secondary">
              Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de
              rectification et de suppression de vos données personnelles. Pour exercer ce
              droit, contactez-nous à : contact@fourmis.fr
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-semibold text-primary">6. Cookies</h2>
            <p className="text-secondary">
              Ce site utilise des cookies pour améliorer l&apos;expérience utilisateur. En
              naviguant sur ce site, vous acceptez l&apos;utilisation de cookies.
            </p>
          </section>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-secondary hover:text-primary">
            ← Retour à l&apos;accueil
          </Link>
        </div>
      </main>
    </div>
  );
}
