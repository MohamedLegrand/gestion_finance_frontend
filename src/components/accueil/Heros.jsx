// src/components/Heros.jsx
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const Heros = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [imageErrors, setImageErrors] = useState({
    dashboard: false,
    croissance: false,
    gestion: false,
    confiance: false
  });

  const slides = [
    {
      id: 0,
      title: "Tableau de bord interactif",
      description: "Visualisez l'ensemble de vos finances en un seul endroit. Graphiques intuitifs, catégories personnalisables et analyses en temps réel pour une meilleure compréhension de vos habitudes de dépenses.",
      imageKey: "dashboard",
      bgColor: "from-purple-600 to-indigo-600",
      buttonText: "Découvrir le dashboard",
      icon: "📊",
      link: "/register",
      features: ["Analyses en temps réel", "Graphiques personnalisables", "Export de données"]
    },
    {
      id: 1,
      title: "Boostez votre croissance financière",
      description: "Une meilleure gestion de votre argent conduit naturellement à une croissance durable. Suivez vos progrès, atteignez vos objectifs d'épargne et regardez votre patrimoine grandir jour après jour.",
      imageKey: "croissance",
      bgColor: "from-blue-600 to-cyan-600",
      buttonText: "Commencer à épargner",
      icon: "📈",
      link: "/register",
      features: ["Objectifs personnalisés", "Suivi de progression", "Conseils personnalisés"]
    },
    {
      id: 2,
      title: "Contrôle total sur votre argent",
      description: "Vous êtes aux commandes ! Gérez vos budgets, planifiez vos dépenses et prenez des décisions éclairées. MyNkap vous donne tous les outils pour maîtriser parfaitement vos finances.",
      imageKey: "gestion",
      bgColor: "from-emerald-600 to-teal-600",
      buttonText: "Prendre le contrôle",
      icon: "🎮",
      link: "/register",
      features: ["Budgets illimités", "Alertes personnalisées", "Catégories sur mesure"]
    },
    {
      id: 3,
      title: "Sécurité et confidentialité absolue",
      description: "Vos données sont protégées par un chiffrement bancaire AES-256. Nous ne vendons jamais vos informations et respectons strictement les normes RGPD. Faites confiance à MyNkap pour sécuriser votre avenir financier.",
      imageKey: "confiance",
      bgColor: "from-rose-600 to-pink-600",
      buttonText: "En savoir plus",
      icon: "🔒",
      link: "/confidentialite",
      features: ["Chiffrement AES-256", "Conformité RGPD", "Sauvegarde automatique"]
    }
  ];

  // Préchargement des images
  useEffect(() => {
    const paths = {
      dashboard: "/images/heros/dashboard.jpg",
      croissance: "/images/heros/croissance.jpg",
      gestion: "/images/heros/gestion.jpg",
      confiance: "/images/heros/confiance.jpg"
    };

    Object.entries(paths).forEach(([key, path]) => {
      const img = new Image();
      img.src = path;
      img.onerror = () => {
        setImageErrors(prev => ({ ...prev, [key]: true }));
      };
    });
  }, []);

  // Auto-play du carrousel
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % slides.length);
      }, 6000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = useCallback((index) => {
    setActiveSlide(index);
    setIsAutoPlaying(false);
    // Réactiver l'auto-play après 10 secondes d'inactivité
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, [slides.length]);

  const currentSlide = slides[activeSlide];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      
      {/* Pattern décoratif de fond */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">

        {/* ─── Phrase d'accroche avec animation ─── */}
        <div className="text-center mb-12 md:mb-16 animate-fade-in-down">
          <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-purple-700 font-semibold text-sm">Plus de 10 000 utilisateurs satisfaits</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-gray-900 leading-tight mb-6">
            Augmentez vos revenus avec une
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600"> meilleure gestion </span>
            de vos finances
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            MyNkap vous aide à prendre le contrôle de votre argent,
            réduire vos dépenses inutiles et construire un avenir
            financier solide. Simple, rapide et sécurisé.
          </p>

          {/* CTA rapides */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Commencer gratuitement
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <button className="inline-flex items-center gap-2 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-8 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Voir la démo
            </button>
          </div>
        </div>

        {/* ─── Slides avec animation ─── */}
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[500px]">
          
          {/* Partie gauche - Texte avec animation */}
          <div className="space-y-6 animate-slide-in-left">
            {/* Badge slide */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full px-4 py-2 shadow-sm">
              <span className="text-2xl">{currentSlide.icon}</span>
              <span className="text-purple-700 font-semibold text-sm">
                Fonctionnalité clé
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {currentSlide.title}
            </h2>

            <p className="text-base text-gray-600 leading-relaxed">
              {currentSlide.description}
            </p>

            {/* Features list */}
            <div className="flex flex-wrap gap-3 pt-2">
              {currentSlide.features.map((feature, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {feature}
                </span>
              ))}
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to={currentSlide.link}
                className={`inline-flex items-center justify-center gap-2 bg-gradient-to-r ${currentSlide.bgColor} text-white font-semibold py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 group`}
              >
                {currentSlide.buttonText}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 border-2 border-purple-300 text-purple-700 font-semibold py-3 px-8 rounded-xl hover:bg-purple-50 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Déjà inscrit ? Connexion
              </Link>
            </div>

            {/* Statistiques avec barre de progression */}
            <div className="pt-8 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">10k+</div>
                  <div className="text-xs text-gray-500">Utilisateurs actifs</div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                    <div className="bg-purple-600 h-1 rounded-full" style={{ width: "85%" }}></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">98%</div>
                  <div className="text-xs text-gray-500">Satisfaction client</div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                    <div className="bg-purple-600 h-1 rounded-full" style={{ width: "98%" }}></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">24/7</div>
                  <div className="text-xs text-gray-500">Support disponible</div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                    <div className="bg-purple-600 h-1 rounded-full" style={{ width: "100%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Partie droite - Image avec animation */}
          <div className="relative animate-slide-in-right">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
              {!imageErrors[currentSlide.imageKey] ? (
                <img
                  src={`/images/heros/${currentSlide.imageKey}.jpg`}
                  alt={currentSlide.title}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  onError={() =>
                    setImageErrors(prev => ({
                      ...prev,
                      [currentSlide.imageKey]: true
                    }))
                  }
                />
              ) : (
                <div className={`w-full h-96 bg-gradient-to-br ${currentSlide.bgColor} flex flex-col items-center justify-center`}>
                  <span className="text-white text-8xl mb-4">{currentSlide.icon}</span>
                  <span className="text-white text-sm opacity-75">Image illustrative</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              
              {/* Overlay de gradient au hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-transparent to-purple-600/0 group-hover:from-purple-600/10 group-hover:to-purple-600/10 transition-all duration-500"></div>
            </div>

            {/* Badges flottants */}
            <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 animate-bounce-slow hidden lg:block">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-800">30 jours gratuits</div>
                  <div className="text-xs text-gray-500">Sans engagement</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3 animate-bounce-slow animation-delay-1000 hidden lg:block">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-800">Sans carte bancaire</div>
                  <div className="text-xs text-gray-500">Inscription rapide</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Indicateurs de slide améliorés */}
        <div className="flex justify-center gap-3 mt-16">
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`group transition-all duration-300 rounded-full ${
                activeSlide === index
                  ? "w-16 h-3 bg-gradient-to-r from-purple-600 to-indigo-600"
                  : "w-3 h-3 bg-gray-300 hover:bg-purple-400"
              }`}
              aria-label={`Aller au slide ${index + 1}`}
            >
              {activeSlide === index && (
                <span className="sr-only">Slide {index + 1} actif</span>
              )}
            </button>
          ))}
        </div>

        {/* Boutons navigation améliorés */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 hidden lg:flex items-center justify-center"
          aria-label="Slide précédent"
        >
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 hidden lg:flex items-center justify-center"
          aria-label="Slide suivant"
        >
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

      </div>

      {/* Vague décorative améliorée */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none">
        <svg className="relative block w-full h-16 md:h-24" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            fill="#ffffff"
            opacity="0.9"
          />
        </svg>
      </div>

    </div>
  );
};

export default Heros;