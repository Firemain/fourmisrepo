"use client";

import { useState } from "react";
import { Linkedin, Mail, Heart, Code, Palette, Target, Users, Lightbulb } from "lucide-react";

const TeamSection = () => {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

  const teamMembers = [
    {
      name: "Sophie Martin",
      role: "CEO & Co-fondatrice",
      avatar: "👩‍💼",
      description: "Experte en engagement étudiant et innovation sociale",
      skills: ["Leadership", "Vision stratégique", "Engagement social"],
      color: "bg-forest-green",
      icon: <Target size={24} />
    },
    {
      name: "Thomas Dubois",
      role: "CTO & Co-fondateur",
      avatar: "👨‍💻",
      description: "Développeur full-stack passionné par l'impact social",
      skills: ["React", "Node.js", "Architecture"],
      color: "bg-light-green",
      icon: <Code size={24} />
    },
    {
      name: "Emma Rousseau",
      role: "UX/UI Designer",
      avatar: "👩‍🎨",
      description: "Designer créative spécialisée en gamification",
      skills: ["Design System", "Gamification", "User Research"],
      color: "bg-light-brown",
      icon: <Palette size={24} />
    },
    {
      name: "Lucas Petit",
      role: "Développeur Frontend",
      avatar: "👨‍🔬",
      description: "Expert en interfaces interactives et animations",
      skills: ["React", "Animation", "Performance"],
      color: "bg-forest-green",
      icon: <Lightbulb size={24} />
    },
    {
      name: "Camille Moreau",
      role: "Responsable Partenariats",
      avatar: "👩‍🤝‍👨",
      description: "Spécialiste relations écoles et associations",
      skills: ["Partenariats", "Communication", "Stratégie"],
      color: "bg-light-green",
      icon: <Users size={24} />
    },
    {
      name: "Antoine Garcia",
      role: "Data Analyst",
      avatar: "👨‍📊",
      description: "Analyste data pour optimiser le matching",
      skills: ["Data Science", "Machine Learning", "Analytics"],
      color: "bg-light-brown",
      icon: <Target size={24} />
    }
  ];

  return (
    <section id="team" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-forest-green mb-6">
            Notre Équipe
          </h2>
          <p className="text-xl text-light-brown max-w-3xl mx-auto">
            Une équipe passionnée par l'engagement étudiant et l'innovation sociale
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-cream to-beige rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 cursor-pointer"
              onMouseEnter={() => setHoveredMember(index)}
              onMouseLeave={() => setHoveredMember(null)}
            >
              {/* Background decoration */}
              <div className={`absolute -top-4 -right-4 w-20 h-20 ${member.color} rounded-full opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all duration-500`}></div>

              {/* Avatar */}
              <div className="text-center mb-6">
                <div className={`w-24 h-24 ${member.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg group-hover:scale-110 transition-transform duration-300 relative`}>
                  <span className="text-4xl">{member.avatar}</span>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                    {member.icon}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-forest-green mb-2">{member.name}</h3>
                <p className={`${member.color} text-white inline-block px-4 py-1 rounded-full text-sm font-medium mb-4`}>
                  {member.role}
                </p>
                <p className="text-light-brown text-sm mb-6">{member.description}</p>

                {/* Skills */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {member.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className={`bg-white/60 text-forest-green px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                        hoveredMember === index ? 'bg-white shadow-md transform scale-105' : ''
                      }`}
                      style={{
                        transitionDelay: hoveredMember === index ? `${skillIndex * 100}ms` : '0ms'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Contact buttons */}
                <div className={`flex justify-center space-x-4 transition-all duration-300 ${
                  hoveredMember === index ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
                }`}>
                  <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-forest-green hover:bg-light-green hover:text-white transition-all duration-300 shadow-md">
                    <Mail size={18} />
                  </button>
                  <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-forest-green hover:bg-light-green hover:text-white transition-all duration-300 shadow-md">
                    <Linkedin size={18} />
                  </button>
                </div>
              </div>

              {/* Hover overlay */}
              <div className={`absolute inset-0 ${member.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-all duration-500`}></div>
            </div>
          ))}
        </div>

        {/* Bottom message */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center bg-gradient-to-r from-light-green/20 to-forest-green/20 rounded-full px-8 py-4 border border-light-green/30">
            <Heart className="text-forest-green mr-3" size={24} />
            <span className="text-forest-green font-semibold">
              Une équipe unie par la passion de l'engagement étudiant
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;