// src/pages/Cookies.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Cookies = () => {
  const annee = new Date().getFullYear();
  const [imageUrl, setImageUrl] = useState('');
  const [imageError, setImageError] = useState(false);
  const [preferences, setPreferences] = useState({
    necessaires: true,
    fonctionnels: false,
    analytiques: false,
    publicitaires: false
  });

  useEffect(() => {
    // Déterminer le chemin de base selon l'environnement
    const basePath = process.env.PUBLIC_URL || '';
    const imgPath = `${basePath}/images/footer/cookies.jpg`;
    setImageUrl(imgPath);
    
    // Précharger l'image pour vérifier son existence
    const img = new Image();
    img.src = imgPath;
    img.onload = () => setImageError(false);
    img.onerror = () => setImageError(true);
  }, []);

  // Style de fond avec fallback
  const backgroundStyle = {
    backgroundImage: imageError || !imageUrl
      ? 'linear-gradient(135deg, #4c1d95 0%, #2e1065 100%)'
      : `linear-gradient(to bottom, rgba(88, 28, 135, 0.92), rgba(59, 7, 100, 0.96)), url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  const handlePreferenceChange = (type) => {
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const sauvegarderPreferences = () => {
    // Ici vous implémenterez la sauvegarde des préférences cookies
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    alert('Vos préférences ont été sauvegardées !');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero section avec image de fond */}
      <div 
        className="relative text-white py-20 md:py-28"
        style={backgroundStyle}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Icône/Illustration */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
            Politique des cookies
          </h1>
          <p className="text-lg md:text-xl text-purple-200 max-w-2xl mx-auto">
            Nous utilisons des cookies pour améliorer votre expérience sur MyNkap
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-purple-200">
            <span>🍪 Transparence totale</span>
            <span>•</span>
            <span>⚙️ Vous contrôlez tout</span>
            <span>•</span>
            <span>📅 Mise à jour : {annee}</span>
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          
          {/* Introduction */}
          <div className="mb-8">
            <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded-r-lg mb-6">
              <p className="text-sm text-purple-800">
                <span className="font-semibold">🍪 En bref :</span> Les cookies nous aident à vous offrir 
                la meilleure expérience possible sur MyNkap. Vous contrôlez entièrement vos préférences.
              </p>
            </div>
            
            <p className="text-gray-600 leading-relaxed mb-4">
              Cette politique explique comment <span className="font-semibold text-purple-700">MyNkap</span> 
              utilise les cookies et technologies similaires pour améliorer votre expérience, 
              analyser notre performance et personnaliser le contenu.
            </p>
          </div>

          {/* 1. Qu'est-ce qu'un cookie */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">
              1. Qu'est-ce qu'un cookie ?
            </h2>
            <p className="text-gray-600 mb-3">
              Un cookie est un petit fichier texte stocké sur votre appareil (ordinateur, tablette ou smartphone) 
              lorsque vous visitez un site web. Il permet de mémoriser vos actions et préférences pendant une 
              certaine période, afin que vous n'ayez pas à les ré-indiquer à chaque visite.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-3">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">🔍 Exemple :</span> Un cookie peut mémoriser votre devise préférée 
                (FCFA, EUR, USD) pour que vous n'ayez pas à la sélectionner à chaque connexion.
              </p>
            </div>
          </div>

          {/* 2. Types de cookies utilisés */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">
              2. Types de cookies que nous utilisons
            </h2>
            
            <div className="space-y-4">
              {/* Cookies nécessaires */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-600 text-xl">✓</span>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Cookies strictement nécessaires
                      </h3>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Toujours actifs
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      Indispensables au fonctionnement du site. Ils vous permettent de naviguer et 
                      d'utiliser les fonctionnalités essentielles comme la connexion à votre compte.
                    </p>
                    <p className="text-xs text-gray-500">
                      Exemples : Session utilisateur, sécurité, chargement équilibré
                    </p>
                  </div>
                  <div className="ml-4">
                    <button 
                      disabled
                      className="w-10 h-6 bg-green-500 rounded-full relative cursor-not-allowed opacity-75"
                    >
                      <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Cookies fonctionnels */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-purple-600 text-xl">⚙️</span>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Cookies fonctionnels
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      Améliorent votre expérience en mémorisant vos préférences (devise, langue, 
                      catégories personnalisées).
                    </p>
                    <p className="text-xs text-gray-500">
                      Exemples : Devise préférée, thème sombre/clair, catégories favorites
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => handlePreferenceChange('fonctionnels')}
                      className={`w-10 h-6 rounded-full relative transition-colors ${
                        preferences.fonctionnels ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.fonctionnels ? 'right-1' : 'left-1'
                      }`}></span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Cookies analytiques */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-blue-600 text-xl">📊</span>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Cookies analytiques / performance
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      Nous aident à comprendre comment les utilisateurs interagissent avec MyNkap, 
                      quelles fonctionnalités sont les plus populaires, et comment améliorer nos services.
                    </p>
                    <p className="text-xs text-gray-500">
                      Exemples : Pages visitées, temps passé, taux de clics (données anonymisées)
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => handlePreferenceChange('analytiques')}
                      className={`w-10 h-6 rounded-full relative transition-colors ${
                        preferences.analytiques ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.analytiques ? 'right-1' : 'left-1'
                      }`}></span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Cookies publicitaires */}
              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-yellow-600 text-xl">🎯</span>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Cookies publicitaires / ciblage
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      Utilisés pour vous proposer des publicités pertinentes en fonction de vos 
                      centres d'intérêt et limiter le nombre d'affichages répétitifs.
                    </p>
                    <p className="text-xs text-gray-500">
                      Exemples : Offres personnalisées, campagnes marketing, partenaires publicitaires
                    </p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => handlePreferenceChange('publicitaires')}
                      className={`w-10 h-6 rounded-full relative transition-colors ${
                        preferences.publicitaires ? 'bg-purple-600' : 'bg-gray-300'
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        preferences.publicitaires ? 'right-1' : 'left-1'
                      }`}></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bouton sauvegarder */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={sauvegarderPreferences}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-semibold hover:shadow-lg"
              >
                Sauvegarder mes préférences
              </button>
            </div>
          </div>

          {/* 3. Durée de vie des cookies */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">
              3. Durée de conservation
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow">
                <div className="font-semibold text-purple-700 mb-1">🍪 Cookies de session</div>
                <p className="text-sm text-gray-600">Expirent lorsque vous fermez votre navigateur</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow">
                <div className="font-semibold text-purple-700 mb-1">📦 Cookies persistants</div>
                <p className="text-sm text-gray-600">Restent jusqu'à 12 mois ou jusqu'à suppression manuelle</p>
              </div>
            </div>
          </div>

          {/* 4. Cookies tiers */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">
              4. Cookies tiers
            </h2>
            <p className="text-gray-600 mb-3">
              Nous utilisons certains services tiers qui peuvent déposer leurs propres cookies :
            </p>
            <div className="space-y-2 text-gray-600">
              <div className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span><span className="font-semibold">Google Analytics :</span> Analyse d'audience (anonymisé)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span><span className="font-semibold">Stripe / Paystack :</span> Paiements sécurisés (si applicable)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span><span className="font-semibold">Sendinblue / Mailchimp :</span> Envoi d'emails transactionnels</span>
              </div>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4 rounded-r-lg">
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">ℹ️ Note :</span> Nous ne contrôlons pas les cookies déposés par ces tiers. 
                Consultez leurs politiques respectives pour plus d'informations.
              </p>
            </div>
          </div>

          {/* 5. Gestion des cookies */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">
              5. Comment gérer vos cookies
            </h2>
            <p className="text-gray-600 mb-3">
              Vous pouvez à tout moment modifier vos préférences cookies via :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li>Le panneau de préférences ci-dessus</li>
              <li>Les paramètres de votre navigateur (Chrome, Firefox, Safari, Edge)</li>
              <li>La suppression manuelle des cookies via les outils de navigation</li>
            </ul>
            
            <div className="grid md:grid-cols-2 gap-3 mt-4">
              <a 
                href="https://support.google.com/chrome/answer/95647" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-1 hover:translate-x-1 transition-transform"
              >
                🟢 Chrome → Paramètres cookies
              </a>
              <a 
                href="https://support.mozilla.org/fr/kb/effacer-les-cookies-pour-supprimer-les-donnees-des-sites" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-1 hover:translate-x-1 transition-transform"
              >
                🦊 Firefox → Gérer les cookies
              </a>
              <a 
                href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-1 hover:translate-x-1 transition-transform"
              >
                🧭 Safari → Préférences cookies
              </a>
              <a 
                href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-1 hover:translate-x-1 transition-transform"
              >
                🌐 Edge → Supprimer cookies
              </a>
            </div>
          </div>

          {/* 6. Impact du blocage des cookies */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">
              6. Impact du blocage des cookies
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-gray-700 mb-2">
                <span className="font-semibold text-red-700">⚠️ Attention :</span> Si vous désactivez certains cookies :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>Certaines fonctionnalités pourraient ne plus fonctionner correctement</li>
                <li>Vous devrez peut-être vous reconnecter plus souvent</li>
                <li>Vos préférences (devise, langue) ne seront pas mémorisées</li>
                <li>Les analyses de performance seront limitées</li>
              </ul>
              <p className="text-sm text-gray-600 mt-2">
                <span className="font-semibold">✅ Bon à savoir :</span> Le blocage des cookies n'affecte jamais la sécurité 
                de vos données financières.
              </p>
            </div>
          </div>

          {/* 7. Modifications */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Nous pouvons mettre à jour cette politique des cookies périodiquement. 
              Les modifications seront publiées sur cette page avec une date de révision mise à jour.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              <span className="font-semibold">Dernière modification :</span> {annee}
            </p>
          </div>

          {/* Lien vers politique confidentialité */}
          <div className="mt-6 pt-4 text-center">
            <Link 
              to="/confidentialite" 
              className="text-purple-600 hover:text-purple-700 text-sm font-semibold inline-flex items-center gap-1 group"
            >
              📖 Consulter notre politique de confidentialité
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Bouton retour */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <Link 
          to="/" 
          className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold group"
        >
          <svg className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default Cookies;