const Tarif = () => {
  const plans = [
    {
      name: "Gratuit",
      price: "0€",
      features: ["Budget de base", "Suivi des dépenses", "Support email"]
    },
    {
      name: "Pro",
      price: "9.99€",
      features: ["Budget illimité", "Objectifs d'épargne", "Rapports avancés", "Support prioritaire"]
    },
    {
      name: "Entreprise",
      price: "29.99€",
      features: ["Tout ce que propose Pro", "API dédiée", "Comptes multiples", "Support 24/7"]
    }
  ];

  return (
    <div id="tarifs" className="mt-20">
      <h2 className="text-3xl font-bold text-center text-purple-900 mb-12">
        Nos Tarifs
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-xl font-bold text-purple-800 mb-2">{plan.name}</h3>
            <p className="text-3xl font-bold text-purple-600 mb-4">{plan.price}</p>
            <ul className="text-gray-600 mb-6">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="mb-2">✓ {feature}</li>
              ))}
            </ul>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200">
              Choisir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tarif;