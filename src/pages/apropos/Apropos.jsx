const Apropos = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-purple-900 mb-6 text-center">
          À propos de MyNkap
        </h1>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold text-purple-800 mb-3">
              Notre Histoire
            </h2>
            <p className="text-gray-600 leading-relaxed">
              MyNkap est né d'une vision simple : rendre la gestion financière accessible à tous. 
              Fondée en 2024, notre plateforme aide des milliers d'utilisateurs à mieux gérer 
              leurs finances personnelles.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-purple-800 mb-3">
              Notre Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Nous croyons que tout le monde mérite de maîtriser ses finances. Notre mission 
              est de fournir des outils simples et puissants pour vous aider à atteindre 
              vos objectifs financiers.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-purple-800 mb-3">
              Nos Valeurs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Transparence</h3>
                <p className="text-sm text-gray-600">Des informations claires et honnêtes</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Innovation</h3>
                <p className="text-sm text-gray-600">Des fonctionnalités toujours plus performantes</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Sécurité</h3>
                <p className="text-sm text-gray-600">Vos données sont protégées</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Apropos;