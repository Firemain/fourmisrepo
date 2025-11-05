"use client";

import { Heart, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-forest-green text-cream py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo et mission */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-light-green rounded-full flex items-center justify-center">
                <span className="text-forest-green font-bold text-lg">🐜</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">FOURMIS</h3>
                <p className="text-xs opacity-80">(FOR US)</p>
              </div>
            </div>
            <p className="text-sm opacity-90">
              Transformer l'engagement étudiant en valeur académique et institutionnelle.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="font-semibold text-light-green">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#concept" className="hover:text-light-green transition-colors">Concept</a></li>
              <li><a href="#targets" className="hover:text-light-green transition-colors">Pour qui ?</a></li>
              <li><a href="#how-it-works" className="hover:text-light-green transition-colors">Fonctionnement</a></li>
              <li><a href="#value" className="hover:text-light-green transition-colors">Valeur ajoutée</a></li>
              <li><a href="#team" className="hover:text-light-green transition-colors">Équipe</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-light-green">Contact</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-light-green" />
                <span>contact@fourmis.app</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-light-green" />
                <span>Paris, France</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-light-green/20 mt-12 pt-8 text-center">
          <p className="text-sm opacity-80 flex items-center justify-center space-x-1">
            <span>Fait avec</span>
            <Heart size={16} className="text-light-green animate-pulse" />
            <span>pour l'engagement étudiant</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;