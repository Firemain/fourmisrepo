import Link from "next/link";
import { ArrowRight, Users, School, Building2, Target, Award, Heart } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-primary/10 bg-white/80 backdrop-blur-sm">
        <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-3xl">🐜</span>
              <span className="text-2xl font-bold text-primary">Fourmis</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link
                href="#fonctionnement"
                className="hidden text-sm font-medium text-secondary transition-colors hover:text-primary md:block"
              >
                Fonctionnement
              </Link>
              <Link
                href="#pour-qui"
                className="hidden text-sm font-medium text-secondary transition-colors hover:text-primary md:block"
              >
                Pour qui ?
              </Link>
              <Link
                href="/contact"
                className="hidden text-sm font-medium text-secondary transition-colors hover:text-primary md:block"
              >
                Contact
              </Link>
              <Link
                href="/app"
                className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-600 hover:shadow-lg"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-white to-accent/10 px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-primary sm:text-6xl lg:text-7xl">
              Valoriser l&apos;engagement
              <br />
              étudiant 🇫🇷
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-secondary">
              Fourmis connecte{" "}
              <span className="font-semibold text-primary">étudiants</span>,{" "}
              <span className="font-semibold text-primary">associations</span> et{" "}
              <span className="font-semibold text-primary">écoles</span> pour faciliter
              l&apos;engagement et reconnaître les expériences associatives.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/app"
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-primary-600 hover:shadow-xl sm:w-auto"
              >
                Accéder à la plateforme
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="w-full rounded-lg border-2 border-primary bg-transparent px-8 py-4 text-lg font-semibold text-primary transition-all hover:bg-primary hover:text-white sm:w-auto"
              >
                En savoir plus
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid gap-8 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-6 text-center shadow-md">
              <div className="mb-2 text-4xl font-bold text-primary">1000+</div>
              <div className="text-sm text-secondary">Étudiants engagés</div>
            </div>
            <div className="rounded-xl bg-white p-6 text-center shadow-md">
              <div className="mb-2 text-4xl font-bold text-primary">200+</div>
              <div className="text-sm text-secondary">Associations partenaires</div>
            </div>
            <div className="rounded-xl bg-white p-6 text-center shadow-md">
              <div className="mb-2 text-4xl font-bold text-primary">50+</div>
              <div className="text-sm text-secondary">Écoles connectées</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pour qui ? */}
      <section id="pour-qui" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-primary">Pour qui ?</h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary">
              Fourmis s&apos;adresse à tous les acteurs de l&apos;engagement étudiant
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Étudiants */}
            <div className="group rounded-2xl bg-white p-8 shadow-md transition-all hover:shadow-xl">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-accent">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-primary">
                Pour les étudiants
              </h3>
              <p className="mb-6 leading-relaxed text-secondary">
                Découvrez des missions associatives, engagez-vous dans des projets qui vous
                ressemblent et valorisez votre expérience.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-secondary">
                  <Target className="mt-0.5 h-5 w-5 flex-shrink-0 text-highlight" />
                  <span>Trouver des missions adaptées à vos centres d&apos;intérêt</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-secondary">
                  <Award className="mt-0.5 h-5 w-5 flex-shrink-0 text-highlight" />
                  <span>Valoriser votre engagement dans votre parcours</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-secondary">
                  <Heart className="mt-0.5 h-5 w-5 flex-shrink-0 text-highlight" />
                  <span>Développer vos compétences et votre réseau</span>
                </li>
              </ul>
            </div>

            {/* Associations */}
            <div className="group rounded-2xl bg-white p-8 shadow-md transition-all hover:shadow-xl">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-highlight/20">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-primary">
                Pour les associations
              </h3>
              <p className="mb-6 leading-relaxed text-secondary">
                Publiez vos missions, recrutez des étudiants motivés et gérez facilement vos
                bénévoles.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-secondary">
                  <Target className="mt-0.5 h-5 w-5 flex-shrink-0 text-highlight" />
                  <span>Publier vos missions en quelques clics</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-secondary">
                  <Award className="mt-0.5 h-5 w-5 flex-shrink-0 text-highlight" />
                  <span>Accéder à une communauté d&apos;étudiants engagés</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-secondary">
                  <Heart className="mt-0.5 h-5 w-5 flex-shrink-0 text-highlight" />
                  <span>Gérer simplement vos bénévoles</span>
                </li>
              </ul>
            </div>

            {/* Écoles */}
            <div className="group rounded-2xl bg-white p-8 shadow-md transition-all hover:shadow-xl">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-xl bg-secondary/20">
                <School className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-primary">Pour les écoles</h3>
              <p className="mb-6 leading-relaxed text-secondary">
                Suivez l&apos;engagement de vos étudiants et intégrez la valorisation dans
                votre programme pédagogique.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm text-secondary">
                  <Target className="mt-0.5 h-5 w-5 flex-shrink-0 text-highlight" />
                  <span>Suivre l&apos;engagement de vos étudiants</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-secondary">
                  <Award className="mt-0.5 h-5 w-5 flex-shrink-0 text-highlight" />
                  <span>Valider les expériences associatives</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-secondary">
                  <Heart className="mt-0.5 h-5 w-5 flex-shrink-0 text-highlight" />
                  <span>Intégrer l&apos;engagement au cursus</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="fonctionnement" className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-primary">
              Comment ça marche ?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-secondary">
              Un processus simple en 3 étapes
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl font-bold text-white">
                1
              </div>
              <h3 className="mb-3 text-xl font-bold text-primary">Inscrivez-vous</h3>
              <p className="text-secondary">
                Créez votre compte en quelques secondes et accédez à la plateforme
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-3xl font-bold text-white">
                2
              </div>
              <h3 className="mb-3 text-xl font-bold text-primary">
                Trouvez votre mission
              </h3>
              <p className="text-secondary">
                Parcourez les missions proposées et postulez à celles qui vous intéressent
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-highlight text-3xl font-bold text-white">
                3
              </div>
              <h3 className="mb-3 text-xl font-bold text-primary">
                Valorisez votre engagement
              </h3>
              <p className="text-secondary">
                Faites reconnaître vos heures d&apos;engagement par votre école
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-gradient-to-r from-primary to-secondary p-12 text-center text-white shadow-2xl">
            <h2 className="mb-4 text-4xl font-bold">
              Rejoignez la communauté Fourmis
            </h2>
            <p className="mb-8 text-xl opacity-90">
              Des milliers d&apos;étudiants, associations et écoles font déjà partie de
              l&apos;aventure.
            </p>
            <Link
              href="/app"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-4 text-lg font-semibold text-primary transition-transform hover:scale-105"
            >
              Commencer maintenant
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/10 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <span className="text-3xl">🐜</span>
                <span className="text-xl font-bold text-primary">Fourmis</span>
              </div>
              <p className="text-secondary">
                La plateforme qui valorise l&apos;engagement étudiant en France.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-lg font-semibold text-primary">Liens rapides</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/contact"
                    className="text-secondary transition-colors hover:text-primary"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mentions-legales"
                    className="text-secondary transition-colors hover:text-primary"
                  >
                    Mentions légales
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-lg font-semibold text-primary">
                Réseaux sociaux
              </h4>
              <p className="text-secondary">Suivez-nous pour rester informés</p>
            </div>
          </div>
          <div className="mt-8 border-t border-primary/10 pt-8 text-center text-sm text-secondary">
            <p>&copy; {new Date().getFullYear()} Fourmis. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}