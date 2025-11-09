"use client";

import Link from "next/link";
import { ArrowRight, Users, School, Building2, Target, Award, Heart, Sparkles, Zap, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/20">
      {/* Animated background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-accent/30 to-highlight/30 blur-3xl transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
            top: '10%',
            left: '5%',
          }}
        />
        <div
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-secondary/20 to-primary/20 blur-3xl transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * -0.03}px)`,
            bottom: '10%',
            right: '5%',
          }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-primary/10 bg-white/70 backdrop-blur-md">
        <nav className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="group flex items-center space-x-3">
              <div className="relative">
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300 inline-block">🐜</span>
                <div className="absolute -inset-2 bg-accent/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-highlight bg-clip-text text-transparent">
                Fourmis
              </span>
            </Link>
            <Link
              href="/fr/login"
              className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-primary via-secondary to-primary bg-size-200 bg-pos-0 hover:bg-pos-100 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-500 hover:shadow-xl hover:shadow-primary/30"
            >
              <span className="relative z-10">Se connecter</span>
              <div className="absolute inset-0 bg-gradient-to-r from-highlight/0 via-highlight/20 to-highlight/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="mx-auto max-w-7xl w-full relative z-10">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge */}
            <div className="flex justify-center mb-8">
              <div className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent/80 via-highlight/80 to-accent/80 text-sm font-medium text-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>La nouvelle génération de l&apos;engagement étudiant</span>
                <Zap className="w-4 h-4 animate-pulse delay-75" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent via-highlight to-accent opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-center mb-8">
              <span className="block text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-4">
                <span className="inline-block bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient">
                  L&apos;engagement
                </span>
              </span>
              <span className="block text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight">
                <span className="inline-block bg-gradient-to-r from-highlight via-accent to-highlight bg-clip-text text-transparent">
                  réinventé
                </span>
                <span className="inline-block text-primary ml-4 animate-bounce-slow">🐜</span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-center text-xl sm:text-2xl text-secondary/80 max-w-3xl mx-auto mb-12 leading-relaxed">
              Connectez vos <span className="font-bold text-primary underline decoration-accent decoration-4">passions</span> avec des <span className="font-bold text-secondary underline decoration-highlight decoration-4">missions</span> qui ont du sens
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
              <Link
                href="/fr/login"
                className="group relative overflow-hidden w-full sm:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-primary bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-bold text-lg shadow-2xl shadow-primary/40 transition-all duration-500 hover:scale-105 hover:shadow-primary/60"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Commencer l&apos;aventure
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/30 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>

              <Link
                href="#discover"
                className="group relative w-full sm:w-auto px-10 py-5 rounded-2xl border-3 border-primary/30 bg-white/50 backdrop-blur-sm text-primary font-bold text-lg hover:border-primary hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <span className="flex items-center justify-center gap-2">
                  Découvrir
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                </span>
              </Link>
            </div>

            {/* Stats - Asymmetric Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent via-accent/80 to-highlight p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-rotate-1">
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="text-5xl font-black text-primary mb-2">1000+</div>
                  <div className="text-sm font-semibold text-primary/80 uppercase tracking-wide">Étudiants engagés</div>
                  <TrendingUp className="absolute top-6 right-6 w-8 h-8 text-primary/20" />
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-secondary p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 sm:-translate-y-4">
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="text-5xl font-black text-white mb-2">200+</div>
                  <div className="text-sm font-semibold text-white/80 uppercase tracking-wide">Associations</div>
                  <Heart className="absolute top-6 right-6 w-8 h-8 text-white/20" />
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-secondary/90 to-primary p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:rotate-1">
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="text-5xl font-black text-white mb-2">50+</div>
                  <div className="text-sm font-semibold text-white/80 uppercase tracking-wide">Écoles connectées</div>
                  <Award className="absolute top-6 right-6 w-8 h-8 text-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-1/4 left-10 w-20 h-20 rounded-full bg-gradient-to-br from-accent to-highlight opacity-30 blur-xl animate-float" />
        <div className="absolute bottom-1/4 right-10 w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary opacity-20 blur-2xl animate-float-delayed" />
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
                    href="/fr/login"
                    className="text-secondary transition-colors hover:text-primary"
                  >
                    Se connecter
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