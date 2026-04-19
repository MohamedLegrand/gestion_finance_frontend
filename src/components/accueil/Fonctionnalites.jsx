const Fonctionnalites = () => {
  const fonctionnalitesList = [
    {
      title: "Suivez vos dépenses",
      description: "Gérez facilement votre budget au quotidien"
    },
    {
      title: "Objectifs d'épargne",
      description: "Atteignez vos objectifs financiers plus rapidement"
    },
    {
      title: "Rapports détaillés",
      description: "Visualisez vos finances avec des graphiques clairs"
    }
  ];

  return (
    <div id="fonctionnalites" className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
      {fonctionnalitesList.map((item, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">
            {item.title}
          </h3>
          <p className="text-gray-600">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Fonctionnalites;