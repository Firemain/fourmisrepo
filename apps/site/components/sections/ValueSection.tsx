"use client";

import { useState } from "react";
import { User, School, Building2, TrendingUp, Award, Users, Target, BookOpen, Heart } from "lucide-react";

const ValueSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  const valueProps = [
    {
      target: "L'étudiant",
      icon: <User size={32} />,
      color: "bg-light-green",
      emoji: "🎓",
      benefits: [
        {
          icon: <Target size={24} />,
          title: "Missions personnalisées",
          description: "Des opportunités adaptées à vos passions et compétences",
          impact: "+75% de satisfaction d'engagement"
        },
        {
          icon: <Award size={24} />,
          title: "Reconnaissance académique",
          description: "Badges et crédits ECTS pour valoriser votre investissement",
          impact: "Jusqu'à 6 crédits ECTS validés"
        },
        {
          icon: <BookOpen size={24} />,
          title: "CV différenciant",
          description: "Portfolio d'engagement certifié par les établissements",
          impact: "+40% d'attractivité sur le marché"
        }
      ]
    },
    {
      target: "L'école",
      icon: <School size={32} />,
      color: "bg-forest-green",
      emoji: "🏫",
      benefits: [
        {
          icon: <TrendingUp size={24} />,
          title: "Suivi centralisé",
          description: "Dashboard complet pour monitorer l'engagement étudiant",
          impact: "-60% de temps administratif"
        },
        {
          icon: <Users size={24} />,
          title: "Attractivité renforcée",
          description: "Valorisation RSE et engagement social de l'établissement",
          impact: "+35% d'attractivité institutionnelle"
        },
        {
          icon: <Award size={24} />,
          title: "Certification automatique",
          description: "Validation officielle des heures d'engagement étudiant",
          impact: "100% de traçabilité garantie"
        }
      ]
    },
    {
      target: "L'association",
      icon: <Building2 size={32} />,
      color: "bg-light-brown",
      emoji: "🤝",
      benefits: [
        {
          icon: <Users size={24} />,
          title: "Recrutement ciblé",
          description: "Accès à des bénévoles motivés et pré-qualifiés",
          impact: "+80% de rétention bénévole"
        },
        {
          icon: <TrendingUp size={24} />,
          title: "Visibilité accrue",
          description: "Exposition auprès de milliers d'étudiants engagés",
          impact: "x3 candidatures qualifiées"
        },
        {
          icon: <Target size={24} />,
          title: "Impact mesurable",
          description: "Statistiques détaillées sur l'efficacité des actions",
          impact: "+50% d'efficacité mesurée"
        }
      ]
    }
  ];

  return (
    <section id="value" className="py-20 bg-gradient-to-br from-cream via-beige to-light-green/10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-forest-green mb-6">
            Valeur ajoutée
          </h2>
          <p className="text-xl text-light-brown max-w-3xl mx-auto">
            Une solution qui génère de la valeur pour chaque acteur de l'écosystème
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {valueProps.map((prop, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`flex items-center space-x-3 px-6 py-3 rounded-full font-semibold transition-all duration-300 transform ${
                activeTab === index
                  ? `${prop.color} text-white shadow-lg scale-105`
                  : 'bg-white text-forest-green hover:bg-light-green/10 hover:scale-102'
              }`}
            >
              <span className="text-2xl">{prop.emoji}</span>
              <span>Pour {prop.target.toLowerCase()}</span>
              <div className={`transition-all duration-300 ${activeTab === index ? 'text-white' : 'text-forest-green'}`}>
                {prop.icon}
              </div>
            </button>
          ))}
        </div>

        {/* Active tab content */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-white/20">
            <div className="text-center mb-12">
              <div className="text-6xl mb-4">{valueProps[activeTab].emoji}</div>
              <h3 className="text-3xl font-bold text-forest-green mb-4">
                Pour {valueProps[activeTab].target}
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {valueProps[activeTab].benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
                  style={{
                    animationDelay: `${index * 150}ms`,
                    opacity: 0,
                    animation: 'slideInUp 0.6s ease-out forwards'
                  }}
                >
                  {/* Icon */}
                  <div className={`w-16 h-16 ${valueProps[activeTab].color} rounded-xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300`}>
                    {benefit.icon}
                  </div>

                  {/* Content */}
                  <h4 className="text-xl font-bold text-forest-green mb-3">
                    {benefit.title}
                  </h4>
                  <p className="text-light-brown mb-4">
                    {benefit.description}
                  </p>

                  {/* Impact metric */}
                  <div className={`inline-flex items-center ${valueProps[activeTab].color} text-white px-4 py-2 rounded-full text-sm font-semibold`}>
                    <TrendingUp size={16} className="mr-2" />
                    {benefit.impact}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom quote */}
            <div className="text-center mt-12">
              <div className="inline-flex items-center bg-gradient-to-r from-light-green/20 to-forest-green/20 rounded-full px-8 py-4 border border-light-green/30">
                <Heart className="text-forest-green mr-3" size={24} />
                <span className="text-forest-green font-semibold">
                  "Une solution gagnant-gagnant-gagnant pour tous les acteurs"
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueSection;