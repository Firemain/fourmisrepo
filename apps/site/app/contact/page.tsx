import Link from "next/link";

export default function Contact() {
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
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-4xl font-bold text-primary">Contactez-nous</h1>

        <div className="rounded-xl bg-white p-8 shadow-md">
          <p className="mb-6 text-lg text-secondary">
            Vous avez une question, une suggestion ou souhaitez en savoir plus sur Fourmis ?
            N&apos;hésitez pas à nous contacter !
          </p>

          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-primary">
                Nom complet
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Jean Dupont"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-primary">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="jean.dupont@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-primary">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Votre message..."
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary-600"
            >
              Envoyer le message
            </button>
          </form>
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
