"use client";

import { useState } from "react";
import { ChevronRight, User, Building2, School, Award } from "lucide-react";

const ConceptSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      icon: <User size={32} />,
      title: "Étudiant",
      description: "Je cherche des missions qui me correspondent",
      details: "Questionnaire personnalisé pour identifier vos centres d'intérêt et compétences"
    },
    {
      icon: <Building2 size={32} />,
      title: "Trouve une mission",
      description: "Le matching automatique me propose des associations",
      details: "Algorithme intelligent qui connecte étudiants et associations selon les affinités"
    },
    {
      icon: <School size={32} />,
      title: "S'engage",
      description: "Je participe à des actions concrètes et valorisantes",
      details: "Missions diversifiées : environnement, social, culturel, solidarité..."
    },
    {
      icon: <Award size={32} />,
      title: "Obtient un badge",
      description: "Mon engagement est reconnu et certifié",
      details: "Système de badges et de reconnaissance académique pour valoriser l'investissement"
    }
  ];

  return (
    <section id="concept" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-forest-green mb-6">
            Le Concept
          </h2>
          <p className="text-xl text-light-brown max-w-3xl mx-auto">
            Une plateforme qui connecte étudiants, associations et écoles pour transformer l'engagement en valeur académique
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Progress bar */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-beige rounded-full transform -translate-y-1/2 hidden md:block">
              <div 
                className="h-full bg-light-green rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>

            {/* Steps */}
            <div className="grid md:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`relative group cursor-pointer transition-all duration-300 ${
                    index <= activeStep ? 'opacity-100' : 'opacity-60'
                  }`}
                  onMouseEnter={() => setActiveStep(index)}
                >
                  {/* Step circle */}
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-300 relative z-10 ${
                    index <= activeStep 
                      ? 'bg-forest-green text-cream shadow-lg transform scale-110' 
                      : 'bg-beige text-light-brown group-hover:bg-light-green group-hover:text-forest-green'
                  }`}>
                    {step.icon}
                  </div>

                  {/* Arrow for mobile */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden flex justify-center mb-4">
                      <ChevronRight className="text-light-green" size={24} />
                    </div>
                  )}

                  {/* Content card */}
                  <div className={`bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 transform ${
                    index <= activeStep 
                      ? 'shadow-xl -translate-y-2 border-2 border-light-green/20' 
                      : 'group-hover:shadow-xl group-hover:-translate-y-2'
                  }`}>
                    <h3 className="text-xl font-bold text-forest-green mb-2">{step.title}</h3>
                    <p className="text-light-brown mb-3">{step.description}</p>
                    <p className="text-sm text-light-brown/80">{step.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center bg-light-green/10 rounded-full px-6 py-3 border-2 border-light-green/20">
            <span className="text-forest-green font-medium mr-3">Un parcours simple et gamifié</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-light-green rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-forest-green rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-light-brown rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConceptSection;