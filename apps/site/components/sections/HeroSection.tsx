"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users, Target, Award } from "lucide-react";

export default function HeroSection() {
  // En dev: localhost:3001, en prod: /app
  const webAppUrl = process.env.NEXT_PUBLIC_WEB_APP_URL || 'http://localhost:3001';
  
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-cream via-light-beige to-light-green overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-forest-green/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-light-green/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-warm-brown/10 rounded-full blur-lg"></div>
      </div>

      <div className="relative container mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center px-4 py-2 bg-forest-green/10 rounded-full text-forest-green font-medium text-sm"
              >
                🐜 FOURMIS (FOR US)
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-5xl lg:text-6xl font-bold text-forest-green leading-tight"
              >
                L'engagement étudiant,{" "}
                <span className="text-warm-brown">simple</span>,{" "}
                <span className="text-light-green">motivant</span> et{" "}
                <span className="text-forest-green">valorisé</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-xl text-warm-brown/80 leading-relaxed max-w-lg"
              >
                Transformer l'engagement étudiant en valeur académique et institutionnelle
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a href={`${webAppUrl}/login`} target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group bg-forest-green text-white px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 hover:bg-forest-green/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Commencer l&apos;aventure
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </a>
              
              <a href="#concept">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-forest-green text-forest-green px-8 py-4 rounded-full font-semibold text-lg hover:bg-forest-green hover:text-white transition-all duration-300"
                >
                  En savoir plus
                </motion.button>
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="grid grid-cols-3 gap-6 pt-8"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-forest-green">70%</div>
                <div className="text-sm text-warm-brown/70">des jeunes veulent s'engager</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-forest-green">1.5M</div>
                <div className="text-sm text-warm-brown/70">associations en France</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-forest-green">100%</div>
                <div className="text-sm text-warm-brown/70">valorisation garantie</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
              {/* Mascotte Fourmi */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-center mb-6"
              >
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-warm-brown to-forest-green rounded-full flex items-center justify-center text-6xl shadow-lg">
                  🐜
                </div>
              </motion.div>

              {/* Éléments flottants */}
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="flex items-center gap-3 bg-light-green/20 rounded-full px-4 py-3"
                >
                  <Users className="w-5 h-5 text-forest-green" />
                  <span className="text-forest-green font-medium">Trouve ta mission</span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                  className="flex items-center gap-3 bg-warm-brown/20 rounded-full px-4 py-3 ml-8"
                >
                  <Target className="w-5 h-5 text-warm-brown" />
                  <span className="text-warm-brown font-medium">Engage-toi</span>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6, duration: 0.6 }}
                  className="flex items-center gap-3 bg-forest-green/20 rounded-full px-4 py-3"
                >
                  <Award className="w-5 h-5 text-forest-green" />
                  <span className="text-forest-green font-medium">Gagne des badges</span>
                </motion.div>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-light-green to-forest-green rounded-full flex items-center justify-center text-2xl shadow-lg"
            >
              🏆
            </motion.div>
            
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, -15, 15, 0]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-warm-brown to-light-beige rounded-full flex items-center justify-center text-xl shadow-lg"
            >
              ⭐
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}