// src/components/Tarif.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Tarif = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    // Animation d'entrée
    setAnimationClass("animate-fade-in-up");
  }, []);

  const plans = [
    {
      id: 1,
      name: "Gratuit",
      nameFr: "Gratuit",
      priceMonthly: 0,
      priceYearly: 0,
      currency: "FCFA",
      image: "/images/tarif/cadeau.jpg",
      imageAlt: "Cadeau - Plan Gratuit",
      description: "Pour démarrer et découvrir MyNkap",
      features: [
        "✅ Jusqu'à 50 transactions par mois",
        "✅ Création de 3 catégories personnalisées",
        "✅ 1 budget actif",
        "✅ Export CSV basique",
        "✅ Graphiques simples",
        "✅ Support par email (48h)",
        "✅ Application web accessible"
      ],
      buttonText: "Commencer gratuitement",
      buttonVariant: "outline",
      popular: false,
      bgColor: "from-gray-50 to-gray-100",
      borderColor: "border-gray-200",
      link: "/register"
    },
    {
      id: 2,
      name: "Premium",
      nameFr: "Premium",
      priceMonthly: 1500,
      priceYearly: 15000,
      currency: "FCFA",
      image: "/images/tarif/etoile.jpg",
      imageAlt: "Étoile - Plan Premium",
      description: "Pour une gestion financière complète",
      features: [
        "✅ Transactions ILLIMITÉES",
        "✅ Catégories ILLIMITÉES",
        "✅ Budgets ILLIMITÉS",
        "✅ Export CSV et PDF",
        "✅ Graphiques avancés et détaillés",
        "✅ Objectifs d'épargne personnalisés",
        "✅ Alertes et notifications en temps réel",
        "✅ Support prioritaire (24h max)",
        "✅ Synchronisation multi-appareils",
        "✅ Historique illimité"
      ],
      buttonText: "Devenir Premium",
      buttonVariant: "primary",
      popular: true,
      bgColor: "from-purple-50 to-indigo-50",
      borderColor: "border-purple-300",
      link: "/register?plan=premium"
    },
    {
      id: 3,
      name: "Intelligent",
      nameFr: "Intelligent IA",
      priceMonthly: 3500,
      priceYearly: 35000,
      currency: "FCFA",
      image: "/images/tarif/ia.jpg",
      imageAlt: "Intelligence Artificielle - Plan Intelligent IA",
      description: "La gestion financière augmentée par l'IA",
      features: [
        "✅ Toutes les fonctionnalités Premium",
        "✅ Analyse prédictive des dépenses",
        "✅ Catégorisation automatique intelligente",
        "✅ Recommandations personnalisées",
        "✅ Détection de transactions suspectes",
        "✅ Assistant virtuel 24/7 (chatbot IA)",
        "✅ Optimisation automatique du budget",
        "✅ Prévisions financières sur 3 mois",
        "✅ Alertes prédictives avant dépassement",
        "✅ Rapport mensuel généré par IA",
        "✅ Conseils financiers personnalisés",
        "✅ Support prioritaire 24/7"
      ],
      buttonText: "Essayer l'IA gratuitement",
      buttonVariant: "gradient",
      popular: false,
      bgColor: "from-indigo-50 to-purple-50",
      borderColor: "border-indigo-300",
      link: "/register?plan=ia"
    }
  ];

  const getPrice = (plan) => {
    if (billingCycle === "yearly") {
      return plan.priceYearly;
    }
    return plan.priceMonthly;
  };

  const getPriceDisplay = (plan) => {
    const price = getPrice(plan);
    if (price === 0) return "Gratuit";
    
    const formattedPrice = new Intl.NumberFormat('fr-FR').format(price);
    
    if (billingCycle === "yearly") {
      return `${formattedPrice} FCFA/an`;
    }
    return `${formattedPrice} FCFA/mois`;
  };

  const getMonthlyEquivalent = (plan) => {
    if (billingCycle === "yearly" && plan.priceYearly > 0) {
      const monthlyEquivalent = Math.round(plan.priceYearly / 12);
      return `${new Intl.NumberFormat('fr-FR').format(monthlyEquivalent)} FCFA/mois`;
    }
    return null;
  };

  const getSavings = (plan) => {
    if (billingCycle === "yearly" && plan.priceYearly > 0) {
      const monthlyTotal = plan.priceMonthly * 12;
      const savings = monthlyTotal - plan.priceYearly;
      const savingsPercent = Math.round((savings / monthlyTotal) * 100);
      return `Économisez ${savingsPercent}%`;
    }
    return null;
  };

  return (
    <div id="tarifs" className={`py-16 md:py-24 bg-gradient-to-br from-gray-50 to-gray-100 ${animationClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête de section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2 mb-4">
            <span className="text-purple-600 text-sm font-semibold">💰 Tarifs transparents</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Choisissez la formule qui vous correspond
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Des prix adaptés à tous les budgets. Passez à la vitesse supérieure dès aujourd'hui.
          </p>
        </div>

        {/* Bascule mensuel/annuel */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <span className={`text-sm font-semibold ${billingCycle === 'monthly' ? 'text-purple-700' : 'text-gray-400'}`}>
            Mensuel
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative w-16 h-8 bg-purple-200 rounded-full transition-colors duration-300 focus:outline-none"
            aria-label="Basculer entre paiement mensuel et annuel"
          >
            <span
              className={`absolute top-1 w-6 h-6 bg-purple-600 rounded-full transition-transform duration-300 ${
                billingCycle === 'yearly' ? 'translate-x-9' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-semibold ${billingCycle === 'yearly' ? 'text-purple-700' : 'text-gray-400'}`}>
            Annuel
            <span className="ml-1 text-xs text-green-600 font-normal">-17%</span>
          </span>
        </div>

        {/* Grille des tarifs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative bg-gradient-to-br ${plan.bgColor} rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                plan.popular ? 'ring-2 ring-purple-500 md:scale-105' : ''
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Badge populaire */}
              {plan.popular && (
                <div className="absolute top-0 right-0 z-10">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                    🌟 Le plus populaire
                  </div>
                </div>
              )}

              {/* Contenu */}
              <div className="p-6 md:p-8">
                {/* Image et titre */}
                <div className="text-center mb-6">
                  <div className="mb-4">
                    <img 
                      src={plan.image} 
                      alt={plan.imageAlt}
                      className="w-24 h-24 object-cover rounded-full mx-auto shadow-md hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">{plan.nameFr}</h3>
                  <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                </div>

                {/* Prix */}
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-purple-600">
                    {getPriceDisplay(plan)}
                  </div>
                  {getMonthlyEquivalent(plan) && (
                    <div className="text-sm text-gray-400 mt-1">
                      soit {getMonthlyEquivalent(plan)}
                    </div>
                  )}
                  {getSavings(plan) && (
                    <div className="text-xs text-green-600 font-semibold mt-1">
                      🎉 {getSavings(plan)}
                    </div>
                  )}
                </div>

                {/* Liste des fonctionnalités */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Ce qui est inclus :</p>
                  <ul className="space-y-2">
                    {plan.features.slice(0, 6).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-500 flex-shrink-0">✓</span>
                        <span>{feature.substring(2)}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* Afficher plus de fonctionnalités pour Premium et Intelligent */}
                  {plan.features.length > 6 && (
                    <div className="mt-2">
                      <details className="group">
                        <summary className="text-xs text-purple-500 cursor-pointer hover:text-purple-700">
                          + {plan.features.length - 6} fonctionnalités supplémentaires
                        </summary>
                        <ul className="mt-2 space-y-2">
                          {plan.features.slice(6).map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="text-green-500 flex-shrink-0">✓</span>
                              <span>{feature.substring(2)}</span>
                            </li>
                          ))}
                        </ul>
                      </details>
                    </div>
                  )}
                </div>

                {/* Bouton d'action avec lien optimisé pour production */}
                <Link
                  to={plan.link}
                  className={`block w-full text-center font-semibold py-3 px-6 rounded-xl transition-all duration-300 ${
                    plan.buttonVariant === 'primary'
                      ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg'
                      : plan.buttonVariant === 'gradient'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg'
                      : 'border-2 border-purple-300 text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  {plan.buttonText}
                </Link>

                {/* Mention spéciale pour l'essai */}
                {plan.id === 3 && (
                  <p className="text-xs text-center text-gray-400 mt-3">
                    30 jours d'essai gratuit • Sans engagement
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Comparaison des fonctionnalités */}
        <div className="mt-20 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 px-6 py-4">
            <h3 className="text-xl font-bold text-white text-center">
              Comparaison détaillée des fonctionnalités
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-gray-700 font-semibold">Fonctionnalité</th>
                  <th className="px-6 py-4 text-center text-gray-700 font-semibold">Gratuit</th>
                  <th className="px-6 py-4 text-center text-purple-700 font-semibold">Premium</th>
                  <th className="px-6 py-4 text-center text-indigo-700 font-semibold">Intelligent IA</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-3 text-gray-600">Transactions par mois</td>
                  <td className="px-6 py-3 text-center text-gray-500">50 max</td>
                  <td className="px-6 py-3 text-center text-green-600 font-semibold">Illimité</td>
                  <td className="px-6 py-3 text-center text-green-600 font-semibold">Illimité</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-6 py-3 text-gray-600">Catégories personnalisables</td>
                  <td className="px-6 py-3 text-center text-gray-500">3 max</td>
                  <td className="px-6 py-3 text-center text-green-600 font-semibold">Illimité</td>
                  <td className="px-6 py-3 text-center text-green-600 font-semibold">Illimité</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-3 text-gray-600">Budgets actifs</td>
                  <td className="px-6 py-3 text-center text-gray-500">1 max</td>
                  <td className="px-6 py-3 text-center text-green-600 font-semibold">Illimité</td>
                  <td className="px-6 py-3 text-center text-green-600 font-semibold">Illimité</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-6 py-3 text-gray-600">Export des données</td>
                  <td className="px-6 py-3 text-center text-gray-500">CSV basique</td>
                  <td className="px-6 py-3 text-center text-green-600">CSV + PDF</td>
                  <td className="px-6 py-3 text-center text-green-600">CSV + PDF + Excel</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-3 text-gray-600">Intelligence artificielle</td>
                  <td className="px-6 py-3 text-center text-gray-400">❌</td>
                  <td className="px-6 py-3 text-center text-gray-400">❌</td>
                  <td className="px-6 py-3 text-center text-green-600 font-semibold">✅</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-6 py-3 text-gray-600">Assistant virtuel</td>
                  <td className="px-6 py-3 text-center text-gray-400">❌</td>
                  <td className="px-6 py-3 text-center text-gray-400">❌</td>
                  <td className="px-6 py-3 text-center text-green-600 font-semibold">✅</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="px-6 py-3 text-gray-600">Support</td>
                  <td className="px-6 py-3 text-center text-gray-500">Email (48h)</td>
                  <td className="px-6 py-3 text-center text-green-600">Prioritaire (24h)</td>
                  <td className="px-6 py-3 text-center text-green-600">24/7 prioritaire</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="px-6 py-3 text-gray-600">Moyens de paiement</td>
                  <td className="px-6 py-3 text-center text-gray-400">-</td>
                  <td className="px-6 py-3 text-center text-gray-600">Orange Money, MTN, Carte</td>
                  <td className="px-6 py-3 text-center text-gray-600">Orange Money, MTN, Carte</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Moyens de paiement acceptés */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-3">Moyens de paiement acceptés :</p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="inline-flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
              📱 Orange Money
            </span>
            <span className="inline-flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
              📱 MTN Mobile Money
            </span>
            <span className="inline-flex items-center gap-2 text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow-sm">
              💳 Carte Bancaire (Visa/Mastercard)
            </span>
          </div>
        </div>

        {/* FAQ rapide sur les tarifs */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Tous nos abonnements incluent 30 jours d'essai gratuit. 
            Annulation à tout moment, sans frais supplémentaires.
          </p>
          <Link to="/contact" className="inline-block mt-4 text-purple-600 hover:text-purple-700 text-sm font-semibold transition-colors">
            Une question sur nos tarifs ? Contactez-nous →
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Tarif;