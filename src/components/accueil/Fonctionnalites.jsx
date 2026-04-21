// src/components/Fonctionnalites.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Fonctionnalites = () => {
  const [imageErrors, setImageErrors] = useState({
    categories: false,
    budget: false,
    transaction: false
  });

  const fonctionnalitesList = [
    {
      id: 1,
      title: "Gestion intelligente des catégories",
      description: "Organisez vos dépenses par catégories personnalisables pour une meilleure visualisation de vos habitudes de consommation. Créez, modifiez et adaptez vos catégories selon vos besoins réels.",
      imageKey: "categories",
      imagePath: "/images/fonctionnalite/categories.jpg",
      icon: "",
      features: [
        "Catégories illimitées",
        "Sous-catégories",
        "Icônes personnalisables",
        "Analyse par catégorie"
      ],
      bgColor: "from-purple-500 to-indigo-500"
    },
    {
      id: 2,
      title: "Budgets intelligents à atteindre",
      description: "Définissez des objectifs budgétaires réalistes et suivez votre progression en temps réel. Recevez des alertes lorsque vous approchez de vos limites et ajustez vos dépenses pour rester sur la bonne voie.",
      imageKey: "budget",
      imagePath: "/images/fonctionnalite/budget.jpg",
      icon: "",
      features: [
        "Budgets mensuels",
        "Alertes personnalisées",
        "Suivi en temps réel",
        "Recommandations"
      ],
      bgColor: "from-blue-500 to-cyan-500"
    },
    {
      id: 3,
      title: "Transactions simplifiées",
      description: "Ajoutez, modifiez et suivez toutes vos transactions en quelques secondes. Une interface intuitive pour ne plus jamais oublier une dépense et garder une trace complète de vos finances.",
      imageKey: "transaction",
      imagePath: "/images/fonctionnalite/transaction.jpg",
      icon: "",
      features: [
        "Ajout rapide",
        "Transactions récurrentes",
        "Pièces jointes",
        "Recherche avancée"
      ],
      bgColor: "from-emerald-500 to-teal-500"
    }
  ];

  useEffect(() => {
    // Précharger les images
    fonctionnalitesList.forEach((item) => {
      const img = new Image();
      img.src = item.imagePath;
      img.onerror = () => {
        setImageErrors(prev => ({ ...prev, [item.imageKey]: true }));
      };
    });
  }, []);

  return (
    <div id="fonctionnalites" className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête de section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-4">
            <span className="text-purple-600 text-sm font-semibold">⚡ Fonctionnalités clés</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Tout ce dont vous avez besoin pour
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600"> gérer vos finances</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Découvrez les outils puissants qui vous aideront à prendre le contrôle de votre argent
          </p>
        </div>

        {/* Grille des fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {fonctionnalitesList.map((item, index) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                {!imageErrors[item.imageKey] ? (
                  <img
                    src={item.imagePath}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={() =>
                      setImageErrors(prev => ({ ...prev, [item.imageKey]: true }))
                    }
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${item.bgColor} flex items-center justify-center`}>
                    <span className="text-white text-6xl">{item.icon}</span>
                  </div>
                )}
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                
                {/* Badge icône */}
                <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">{item.icon}</span>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {item.description}
                </p>

                {/* Liste des fonctionnalités */}
                <ul className="space-y-2 mb-6">
                  {item.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-500">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Bouton d'action */}
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:gap-3 transition-all duration-300"
                >
                  Découvrir
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Section bonus - Avantages supplémentaires */}
        <div className="mt-20 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-4">
                <span className="text-sm font-semibold">🎁 Bonus exclusif</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Et bien plus encore...
              </h3>
              <p className="text-purple-200 mb-6">
                MyNkap ne s'arrête pas là ! Profitez de nombreuses autres fonctionnalités pour une gestion financière complète et sans stress.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-white/10 rounded-full px-4 py-2 text-sm">📊 Rapports détaillés</span>
                <span className="bg-white/10 rounded-full px-4 py-2 text-sm">📱 Application mobile</span>
                <span className="bg-white/10 rounded-full px-4 py-2 text-sm">🔐 Sécurité bancaire</span>
                <span className="bg-white/10 rounded-full px-4 py-2 text-sm">💬 Support 24/7</span>
                <span className="bg-white/10 rounded-full px-4 py-2 text-sm">🔄 Synchronisation cloud</span>
                <span className="bg-white/10 rounded-full px-4 py-2 text-sm">📈 Analyses prédictives</span>
              </div>
            </div>
            <div className="text-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-white text-purple-900 font-bold py-4 px-8 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Commencer gratuitement
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="text-purple-300 text-sm mt-3">Essai gratuit de 30 jours • Sans engagement</p>
            </div>
          </div>
        </div>

        {/* Statistiques de confiance */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">50k+</div>
            <div className="text-sm text-gray-500">Transactions traitées</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">10k+</div>
            <div className="text-sm text-gray-500">Utilisateurs actifs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">98%</div>
            <div className="text-sm text-gray-500">Satisfaction client</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">24/7</div>
            <div className="text-sm text-gray-500">Support disponible</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Fonctionnalites;