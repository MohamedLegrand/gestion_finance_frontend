// src/pages/Apropos.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Apropos = () => {
  const annee = new Date().getFullYear();
  const [imageUrl, setImageUrl] = useState('');
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Déterminer le chemin de base selon l'environnement pour le déploiement
    const basePath = process.env.PUBLIC_URL || '';
    const imgPath = `${basePath}/images/legrand.jpeg`;
    setImageUrl(imgPath);
    
    // Précharger l'image
    const img = new Image();
    img.src = imgPath;
    img.onload = () => {
      setImageError(false);
      setImageLoaded(true);
    };
    img.onerror = () => {
      setImageError(true);
      setImageLoaded(false);
    };
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero section avec image de fond - Version déploiement */}
      <div className="relative bg-gradient-to-r from-purple-900 to-purple-700 text-white py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Icône/Illustration */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 animate-bounce">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
            À propos de MyNkap
          </h1>
          <p className="text-lg md:text-xl text-purple-200 max-w-2xl mx-auto">
            Découvrez l'histoire, la mission et les valeurs de notre application
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-purple-200">
            <span>🚀 Innovation</span>
            <span>•</span>
            <span>🔒 Sécurité</span>
            <span>•</span>
            <span>💡 Transparence</span>
          </div>
        </div>
        
        {/* Effet de vague en bas */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg className="relative block w-full h-12" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                  fill="#F9FAFB" opacity="0.8"></path>
          </svg>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Section MyNkap - Présentation de l'application */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 transform hover:shadow-xl transition-all duration-300">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">MyNkap en quelques mots</h2>
            <div className="w-20 h-1 bg-purple-600 mx-auto"></div>
          </div>
          
          <p className="text-gray-600 leading-relaxed mb-6 text-center max-w-3xl mx-auto">
            <span className="font-semibold text-purple-700">MyNkap</span> est une application de gestion financière 
            innovante conçue pour vous aider à maîtriser vos finances personnelles. Simple, intuitive et puissante, 
            elle vous permet de suivre vos dépenses, d'épargner intelligemment et d'atteindre vos objectifs financiers.
          </p>

          {/* Notre Histoire */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Notre Histoire</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              MyNkap a été fondée en <span className="font-semibold text-purple-700">2026</span> avec une vision claire : 
              démocratiser la gestion financière et la rendre accessible à tous, des particuliers aux petites entreprises. 
              Après des mois de recherche, de développement et de tests rigoureux, MyNkap est devenue une référence 
              en matière de suivi financier intelligent.
            </p>
          </div>

          {/* Notre Mission */}
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Notre Mission</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Chez MyNkap, nous croyons fermement que tout le monde mérite de maîtriser ses finances. 
              Notre mission est de fournir des outils simples, intuitifs et puissants pour aider chaque 
              utilisateur à prendre le contrôle de ses finances, à épargner intelligemment et à réaliser 
              ses projets de vie.
            </p>
          </div>
        </div>

        {/* Section développeur - Après la présentation de MyNkap */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12 transform hover:scale-[1.01] transition-all duration-300">
          <div className="bg-gradient-to-r from-purple-800 to-purple-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white text-center">👨‍💻 Le Créateur de MyNkap</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image du développeur */}
            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-8 flex items-center justify-center">
              <div className="relative">
                {!imageError && imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt="Mohamed Legrand - Ingénieur en Génie Logiciel"
                    className={`w-64 h-64 rounded-full object-cover border-4 border-purple-500 shadow-2xl transition-all duration-700 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                    onLoad={() => setImageLoaded(true)}
                  />
                ) : (
                  <div className="w-64 h-64 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl">
                    <span className="text-white text-6xl font-bold">ML</span>
                  </div>
                )}
                {/* Badge */}
                <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  🎓 Expert 2026
                </div>
              </div>
            </div>
            
            {/* Informations développeur */}
            <div className="p-8 flex flex-col justify-center">
              <div className="mb-4">
                <span className="text-purple-600 font-semibold text-sm uppercase tracking-wide">Fondateur & Lead Developer</span>
                <h2 className="text-3xl font-bold text-gray-800 mt-2">Mohamed Legrand</h2>
                <p className="text-gray-600 mt-1">Ingénieur de Travaux Informatiques en Génie Logiciel</p>
              </div>
              
              <div className="space-y-3 text-gray-600">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p><span className="font-semibold">Analyste en UML et Merise</span> - Expert en modélisation de systèmes complexes</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p><span className="font-semibold">Développeur Web Full Stack</span> - Reactjs, python-django et Go-Fiber</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p>Diplômé en Génie Logiciel avec mention</p>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p>Passionné par les technologies innovantes et la finance</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nos Valeurs */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Nos Valeurs Fondamentales</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-purple-50 p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-3">🔓</div>
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Transparence Totale</h3>
              <p className="text-sm text-gray-600">
                Des informations claires, honnêtes et accessibles. Pas de frais cachés, pas de surprises.
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-3">💡</div>
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Innovation Continue</h3>
              <p className="text-sm text-gray-600">
                Des fonctionnalités toujours plus performantes et adaptées aux besoins réels des utilisateurs.
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Sécurité Maximale</h3>
              <p className="text-sm text-gray-600">
                Vos données financières sont protégées par les meilleures technologies de chiffrement.
              </p>
            </div>
          </div>
        </div>

        {/* Fonctionnalités clés */}
        <div className="bg-gradient-to-r from-purple-900 to-purple-700 rounded-2xl shadow-lg p-8 mb-8 text-white">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Pourquoi choisir MyNkap ?</h2>
            <p className="text-purple-200">Une application pensée pour vous simplifier la vie</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center group cursor-pointer">
              <div className="bg-white/10 rounded-xl p-4 group-hover:bg-white/20 transition-all duration-300">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="font-semibold mb-1">Suivi Intelligent</h3>
                <p className="text-sm text-purple-200">Analyse automatique de vos dépenses</p>
              </div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="bg-white/10 rounded-xl p-4 group-hover:bg-white/20 transition-all duration-300">
                <div className="text-3xl mb-2">🎯</div>
                <h3 className="font-semibold mb-1">Objectifs d'épargne</h3>
                <p className="text-sm text-purple-200">Atteignez vos projets plus rapidement</p>
              </div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="bg-white/10 rounded-xl p-4 group-hover:bg-white/20 transition-all duration-300">
                <div className="text-3xl mb-2">📈</div>
                <h3 className="font-semibold mb-1">Rapports Détaillés</h3>
                <p className="text-sm text-purple-200">Visualisez vos finances en un clin d'œil</p>
              </div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="bg-white/10 rounded-xl p-4 group-hover:bg-white/20 transition-all duration-300">
                <div className="text-3xl mb-2">🔐</div>
                <h3 className="font-semibold mb-1">Données Sécurisées</h3>
                <p className="text-sm text-purple-200">Chiffrement de bout en bout</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-3xl font-bold text-purple-600">2026</div>
            <p className="text-sm text-gray-600 mt-1">Année de création</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-3xl font-bold text-purple-600">10k+</div>
            <p className="text-sm text-gray-600 mt-1">Utilisateurs actifs</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-3xl font-bold text-purple-600">100%</div>
            <p className="text-sm text-gray-600 mt-1">Satisfaction client</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="text-3xl font-bold text-purple-600">24/7</div>
            <p className="text-sm text-gray-600 mt-1">Support disponible</p>
          </div>
        </div>

        {/* Boutons de navigation avec liens optimisés pour le déploiement */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold group"
          >
            <svg className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour à l'accueil
          </Link>
          
          <Link 
            to="/contact" 
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold group"
          >
            Nous contacter
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Apropos;