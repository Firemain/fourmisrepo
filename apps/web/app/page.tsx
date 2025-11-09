import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#ECF8F6]">
      <header className="border-b border-gray-200 bg-white">
        <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🐜</span>
              <span className="text-2xl font-bold text-[#18534F]">Fourmis</span>
            </div>
            <Link
              href="/fr/login"
              className="rounded-lg bg-[#18534F] px-6 py-2 text-white hover:bg-[#226D68] transition-colors"
            >
              Se connecter
            </Link>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Valorisez votre engagement étudiant
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            La plateforme qui transforme l'engagement étudiant en valeur académique et institutionnelle
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/fr/login"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#18534F] px-8 py-4 text-lg font-semibold text-white hover:bg-[#226D68] transition-colors"
            >
              Commencer l'aventure
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#discover"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-[#18534F] px-8 py-4 text-lg font-semibold text-[#18534F] hover:bg-[#18534F] hover:text-white transition-colors"
            >
              Découvrir
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-4xl font-bold text-[#18534F] mb-2">1000+</div>
              <div className="text-gray-600">Étudiants engagés</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-4xl font-bold text-[#18534F] mb-2">50+</div>
              <div className="text-gray-600">Associations</div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-4xl font-bold text-[#18534F] mb-2">20+</div>
              <div className="text-gray-600">Écoles connectées</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}