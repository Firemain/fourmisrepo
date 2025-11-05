"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Check, Heart, Users as Users2, Award, Star } from "lucide-react";

const HowItWorksSection = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Questionnaire de préférences",
      description: "Identifiez vos centres d'intérêt et compétences",
      visual: "🎯",
      details: [
        "Domaines d'intérêt (environnement, social, culturel...)",
        "Compétences existantes et à développer",
        "Disponibilité et contraintes",
        "Préférences d'engagement (individuel/équipe)"
      ],
      color: "bg-light-green"
    },
    {
      title: "Matching automatique",
      description: "Notre algorithme trouve les associations qui vous correspondent",
      visual: "🔍",
      details: [
        "Analyse des profils étudiants et associatifs",
        "Géolocalisation des missions",
        "Compatibilité des planning",
        "Score de matching personnalisé"
      ],
      color: "bg-forest-green"
    },
    {
      title: "Proposition de missions",
      description: "Découvrez des opportunités adaptées à votre profil",
      visual: "📋",
      details: [
        "Missions classées par pertinence",
        "Descriptions détaillées des actions",
        "Durée et engagement requis",
        "Impact social et personnel attendu"
      ],
      color: "bg-light-brown"
    },
    {
      title: "Réalisation seul ou avec des amis",
      description: "Engagez-vous à votre façon, individuellement ou en équipe",
      visual: "👥",
      details: [
        "Mode solo pour l'autonomie",
        "Équipes d'amis pour la motivation",
        "Suivi en temps réel des actions",
        "Communication avec l'association"
      ],
      color: "bg-light-green"
    },
    {
      title: "Valorisation de l'engagement",
      description: "Badges, classement et reconnaissance académique",
      visual: "🏆",
      details: [
        "Système de badges gamifié",
        "Classements entre étudiants",
        "Certificats académiques officiels",
        "Portfolio d'engagement enrichi"
      ],
      color: "bg-forest-green"
    }
  ];

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % steps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-forest-green mb-6">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-light-brown max-w-3xl mx-auto">
            Un parcours en 5 étapes simples pour transformer votre engagement
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'bg-forest-green scale-125'
                    : index < currentStep
                    ? 'bg-light-green'
                    : 'bg-beige hover:bg-light-brown'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-gradient-to-br from-cream to-beige rounded-3xl p-8 md:p-12 shadow-xl">
            {/* Navigation buttons */}
            <button
              onClick={prevStep}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-forest-green hover:bg-light-green hover:text-white transition-all duration-300 z-10"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button
              onClick={nextStep}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-forest-green hover:bg-light-green hover:text-white transition-all duration-300 z-10"
            >
              <ChevronRight size={24} />
            </button>

            {/* Step content */}
            <div className="text-center mb-8">
              <div className="text-8xl mb-6 animate-bounce-subtle">
                {steps[currentStep].visual}
              </div>
              <div className="inline-flex items-center bg-white/80 rounded-full px-4 py-2 mb-4">
                <span className="text-sm font-semibold text-forest-green">
                  Étape {currentStep + 1} / {steps.length}
                </span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-forest-green mb-4">
                {steps[currentStep].title}
              </h3>
              <p className="text-xl text-light-brown mb-8 max-w-2xl mx-auto">
                {steps[currentStep].description}
              </p>
            </div>

            {/* Details */}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {steps[currentStep].details.map((detail, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 bg-white/60 rounded-xl p-4 transition-all duration-500 transform hover:scale-105`}
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    opacity: 0,
                    animation: 'slideInUp 0.6s ease-out forwards'
                  }}
                >
                  <div className={`w-8 h-8 ${steps[currentStep].color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Check size={16} className="text-white" />
                  </div>
                  <span className="text-forest-green font-medium">{detail}</span>
                </div>
              ))}
            </div>

            {/* Bottom stats */}
            <div className="flex justify-center mt-12">
              <div className="grid grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                  <Heart className="text-light-green mb-2" size={24} />
                  <span className="text-2xl font-bold text-forest-green">95%</span>
                  <span className="text-sm text-light-brown">Satisfaction</span>
                </div>
                <div className="flex flex-col items-center">
                  <Users2 className="text-forest-green mb-2" size={24} />
                  <span className="text-2xl font-bold text-forest-green">12k+</span>
                  <span className="text-sm text-light-brown">Étudiants</span>
                </div>
                <div className="flex flex-col items-center">
                  <Star className="text-light-brown mb-2" size={24} />
                  <span className="text-2xl font-bold text-forest-green">4.8/5</span>
                  <span className="text-sm text-light-brown">Note moyenne</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;