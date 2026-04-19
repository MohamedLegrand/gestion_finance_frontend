const Heros = () => {
  return (
    <div id="accueil" className="text-center">
      <h1 className="text-5xl font-bold text-purple-900 mb-4">
        Bienvenue sur MyNkap
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Gérez vos finances personnelles en toute simplicité
      </p>
      <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
        Commencer gratuitement
      </button>
    </div>
  );
};

export default Heros;