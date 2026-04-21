// src/pages/Confidentialite.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Confidentialite = () => {
  const annee = new Date().getFullYear();
  const [imageUrl, setImageUrl] = useState('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Déterminer le chemin de base selon l'environnement
    const basePath = process.env.PUBLIC_URL || '';
    const imgPath = `${basePath}/images/footer/confidentialite.jpg`;
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
            Politique de confidentialité
          </h1>
          <p className="text-lg md:text-xl text-purple-200 max-w-2xl mx-auto">
            La protection de vos données personnelles est notre priorité absolue
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-purple-200">
            <span>🔒 Sécurisé</span>
            <span>•</span>
            <span>🛡️ RGPD conforme</span>
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

      {/* Contenu principal - Identique à votre version originale */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          
          {/* Introduction */}
          <div className="mb-8">
            <p className="text-gray-600 leading-relaxed mb-4">
              Chez <span className="font-semibold text-purple-700">MyNkap</span> ("nous", "notre", "nos"), 
              nous accordons une grande importance à la protection de vos données personnelles. 
              Cette politique de confidentialité explique comment nous collectons, utilisons, 
              partageons et protégeons vos informations lorsque vous utilisez notre application 
              de gestion financière.
            </p>
            <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded-r-lg">
              <p className="text-sm text-purple-800">
                <span className="font-semibold">📌 Résumé :</span> Nous collectons uniquement les 
                données nécessaires à la gestion de vos finances. Vos données sont sécurisées 
                et jamais vendues à des tiers.
              </p>
            </div>
          </div>

          {/* 1. Informations collectées */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">
              1. Informations que nous collectons
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-purple-700 mb-2">
                  a) Informations personnelles
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Nom, prénom et adresse email</li>
                  <li>Numéro de téléphone</li>
                  <li>Photo de profil (optionnelle)</li>
                  <li>Pays et devise préférée</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-purple-700 mb-2">
                  b) Données financières
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Transactions (revenus et dépenses)</li>
                  <li>Catégories de dépenses personnalisées</li>
                  <li>Objectifs d'épargne et budgets</li>
                  <li>Comptes bancaires liés (si intégration)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-700 mb-2">
                  c) Données techniques
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                  <li>Adresse IP et type d'appareil</li>
                  <li>Système d'exploitation et navigateur</li>
                  <li>Cookies et technologies similaires</li>
                  <li>Journaux d'utilisation de l'application</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 2. Utilisation des données */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">
              2. Comment nous utilisons vos données
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow">
                <div className="text-purple-600 text-2xl mb-2">📊</div>
                <h3 className="font-semibold text-gray-800 mb-1">Gestion financière</h3>
                <p className="text-sm text-gray-600">
                  Pour suivre vos dépenses, créer des budgets et analyser vos habitudes financières
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow">
                <div className="text-purple-600 text-2xl mb-2">🔔</div>
                <h3 className="font-semibold text-gray-800 mb-1">Notifications</h3>
                <p className="text-sm text-gray-600">
                  Pour vous envoyer des alertes budgétaires et des rappels personnalisés
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow">
                <div className="text-purple-600 text-2xl mb-2">📈</div>
                <h3 className="font-semibold text-gray-800 mb-1">Amélioration du service</h3>
                <p className="text-sm text-gray-600">
                  Pour analyser l'utilisation et améliorer nos fonctionnalités
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow">
                <div className="text-purple-600 text-2xl mb-2">🛡️</div>
                <h3 className="font-semibold text-gray-800 mb-1">Sécurité</h3>
                <p className="text-sm text-gray-600">
                  Pour protéger votre compte contre les accès non autorisés
                </p>
              </div>
            </div>
          </div>

          {/* 3. Protection des données */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">
              3. Comment nous protégeons vos données
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="space-y-3 text-gray-600">
                <p>✅ <span className="font-semibold">Chiffrement :</span> AES-256 en transit et au repos</p>
                <p>✅ <span className="font-semibold">Authentification :</span> Support 2FA</p>
                <p>✅ <span className="font-semibold">Sauvegardes :</span> Quotidiennes et sécurisées</p>
              </div>
              <div className="space-y-3 text-gray-600">
                <p>✅ <span className="font-semibold">Accès limité :</span> Personnel autorisé uniquement</p>
                <p>✅ <span className="font-semibold">Conformité :</span> RGPD et normes internationales</p>
                <p>✅ <span className="font-semibold">Audits :</span> Réguliers et indépendants</p>
              </div>
            </div>
          </div>

          {/* 4. Partage des données */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">
              4. Partage des informations
            </h2>
            <p className="text-gray-600 mb-3">
              Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations 
              uniquement dans les cas suivants :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
              <li><span className="font-semibold">Prestataires de services :</span> Hébergement cloud, analyse de données, support client</li>
              <li><span className="font-semibold">Obligations légales :</span> Si requis par la loi ou pour protéger nos droits</li>
              <li><span className="font-semibold">Consentement explicite :</span> Avec votre autorisation préalable</li>
            </ul>
          </div>

          {/* 5. Vos droits */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">
              5. Vos droits
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-gray-200 p-4 rounded-lg hover:border-purple-300 transition-colors">
                <div className="font-semibold text-purple-700 mb-2">📖 Droit d'accès</div>
                <p className="text-sm text-gray-600">Obtenir une copie de toutes vos données personnelles</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg hover:border-purple-300 transition-colors">
                <div className="font-semibold text-purple-700 mb-2">✏️ Droit de rectification</div>
                <p className="text-sm text-gray-600">Corriger vos informations inexactes</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg hover:border-purple-300 transition-colors">
                <div className="font-semibold text-purple-700 mb-2">🗑️ Droit à l'effacement</div>
                <p className="text-sm text-gray-600">Supprimer votre compte et toutes vos données</p>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg hover:border-purple-300 transition-colors">
                <div className="font-semibold text-purple-700 mb-2">📤 Droit à la portabilité</div>
                <p className="text-sm text-gray-600">Exporter vos données dans un format standard</p>
              </div>
            </div>
          </div>

          {/* 6. Cookies */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">
              6. Utilisation des cookies
            </h2>
            <p className="text-gray-600 mb-3">
              Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez contrôler 
              les cookies via les paramètres de votre navigateur.
            </p>
            <Link 
              to="/cookies" 
              className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold group"
            >
              En savoir plus sur notre politique des cookies
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* 7. Conservation des données */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">
              7. Conservation des données
            </h2>
            <p className="text-gray-600">
              Nous conservons vos données tant que votre compte est actif. En cas de suppression 
              de compte, toutes vos données sont définitivement effacées dans un délai maximum 
              de 30 jours, sauf obligation légale de conservation.
            </p>
          </div>

          {/* 8. Contact */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">
              8. Nous contacter
            </h2>
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl">
              <p className="text-gray-700 mb-4">
                Pour toute question concernant cette politique ou vos données personnelles, 
                vous pouvez nous contacter :
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 group">
                  <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <a href="mailto:legrandmohamed67@gmail.com" className="text-purple-700 hover:text-purple-900 font-medium">
                    legrandmohamed67@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <a href="tel:+237677246900" className="text-purple-700 hover:text-purple-900 font-medium">
                    +237 677 246 900
                  </a>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Cameroun</span>
                </div>
              </div>
            </div>
          </div>

          {/* 9. Modifications */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
              Les modifications seront publiées sur cette page avec une date de mise à jour révisée. 
              Nous vous encourageons à consulter régulièrement cette politique.
            </p>
            <p className="text-sm text-gray-500 mt-3">
              <span className="font-semibold">Date de la dernière révision :</span> {annee}
            </p>
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

export default Confidentialite;