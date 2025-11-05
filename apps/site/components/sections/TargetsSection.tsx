"use client";

import { useState } from "react";
import { GraduationCap, Users, School as School2, Award, TrendingUp, Target } from "lucide-react";

const TargetsSection = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const targets = [
    {
      title: "Étudiants",
      emoji: "🎓",
      description: "Trouvez des missions qui vous passionnent et enrichissez votre CV",
      benefits: [
        "Missions adaptées à vos centres d'intérêt",
        "Système de gamification avec badges",
        "Reconnaissance académique officielle",
        "CV enrichi et différenciant",
        "Réseau professionnel élargi"
      ],
      color: "bg-light-green",
      icon: <GraduationCap size={40} />,
      stats: "85% des étudiants enrichissent leur CV"
    },
    {
      title: "Associations",
      emoji: "🤝",
      description: "Recrutez facilement des bénévoles motivés et engagés",
      benefits: [
        "Recrutement ciblé et efficace",
        "Visibilité accrue auprès des jeunes",
        "Statistiques d'impact détaillées",
        "Gestion simplifiée des bénévoles",
        "Partenariats avec les écoles"
      ],
      color: "bg-forest-green",
      icon: <Users size={40} />,
      stats: "60% d'augmentation des bénévoles"
    },
    {
      title: "Écoles",
      emoji: "🏫",
      description: "Valorisez l'engagement de vos étudiants et renforcez votre attractivité",
      benefits: [
        "Dashboard centralisé de suivi",
        "Certification automatique des heures",
        "Valorisation RSE de l'établissement",
        "Statistiques d'engagement détaillées",
        "Attractivité institutionnelle renforcée"
      ],
      color: "bg-light-brown",
      icon: <School2 size={40} />,
      stats: "40% d'amélioration de l'attractivité"
    }
  ];

  return (
    <section id="targets" className="py-20 bg-gradient-to-br from-beige to-cream">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-forest-green mb-6">
            Pour qui ?
          </h2>
          <p className="text-xl text-light-brown max-w-3xl mx-auto">
            Une solution qui bénéficie à tous les acteurs de l'écosystème étudiant
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {targets.map((target, index) => (
            <div
              key={index}
              className={`relative group cursor-pointer transition-all duration-500 transform ${
                hoveredCard === index ? 'scale-105 -translate-y-4' : 'hover:scale-102 hover:-translate-y-2'
              }`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Card */}
              <div className={`bg-white rounded-3xl p-8 shadow-lg transition-all duration-500 relative overflow-hidden ${
                hoveredCard === index ? 'shadow-2xl' : 'group-hover:shadow-xl'
              }`}>
                {/* Background decoration */}
                <div className={`absolute -top-4 -right-4 w-24 h-24 ${target.color} rounded-full opacity-10 transition-all duration-500 ${
                  hoveredCard === index ? 'scale-150 opacity-20' : ''
                }`}></div>

                {/* Icon */}
                <div className={`w-20 h-20 ${target.color} rounded-2xl flex items-center justify-center mb-6 text-white relative z-10 transition-all duration-300 ${
                  hoveredCard === index ? 'animate-bounce-gentle' : ''
                }`}>
                  {target.icon}
                </div>

                {/* Emoji */}
                <div className="text-4xl mb-4">{target.emoji}</div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-forest-green mb-4">{target.title}</h3>
                <p className="text-light-brown mb-6">{target.description}</p>

                {/* Benefits */}
                <ul className="space-y-3 mb-6">
                  {target.benefits.map((benefit, benefitIndex) => (
                    <li 
                      key={benefitIndex}
                      className={`flex items-start space-x-3 transition-all duration-300 ${
                        hoveredCard === index 
                          ? 'opacity-100 transform translate-x-0' 
                          : 'opacity-70'
                      }`}
                      style={{ 
                        transitionDelay: hoveredCard === index ? `${benefitIndex * 100}ms` : '0ms' 
                      }}
                    >
                      <div className={`w-2 h-2 ${target.color} rounded-full mt-2 flex-shrink-0`}></div>
                      <span className="text-sm text-light-brown">{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* Stats */}
                <div className={`inline-flex items-center ${target.color} text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  hoveredCard === index ? 'animate-pulse' : ''
                }`}>
                  <TrendingUp size={16} className="mr-2" />
                  {target.stats}
                </div>

                {/* Hover effect overlay */}
                <div className={`absolute inset-0 ${target.color} opacity-0 transition-all duration-500 rounded-3xl ${
                  hoveredCard === index ? 'opacity-5' : ''
                }`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-8 py-4 shadow-lg border border-light-green/20">
            <Target className="text-forest-green mr-3" size={24} />
            <span className="text-forest-green font-semibold">Une solution complète pour tous</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TargetsSection;