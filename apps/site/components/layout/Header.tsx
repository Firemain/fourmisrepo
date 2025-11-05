"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "#concept", label: "Concept" },
    { href: "#targets", label: "Pour qui ?" },
    { href: "#how-it-works", label: "Fonctionnement" },
    { href: "#value", label: "Valeur ajoutée" },
    { href: "#team", label: "Équipe" }
  ];

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b border-beige">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-forest-green rounded-full flex items-center justify-center">
              <span className="text-cream font-bold text-lg">🐜</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-forest-green">FOURMIS</h1>
              <p className="text-xs text-light-brown opacity-80">(FOR US)</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-forest-green hover:text-light-green transition-colors font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="bg-forest-green text-white px-6 py-2 rounded-full hover:bg-light-green hover:text-forest-green transition-all duration-300 transform hover:scale-105 font-medium"
            >
              Se connecter
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-forest-green hover:text-light-green transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-beige">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href="/login"
                  className="text-forest-green hover:text-light-green transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <Link
                href="/dashboard/student"
                className="bg-forest-green text-white px-6 py-2 rounded-full hover:bg-light-green hover:text-forest-green transition-all duration-300 text-center font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Se connecter
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;