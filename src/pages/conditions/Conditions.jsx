// src/pages/Conditions.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Conditions = () => {
  const annee = new Date().getFullYear();
  const [imageUrl, setImageUrl] = useState('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Déterminer le chemin de base selon l'environnement
    const basePath = process.env.PUBLIC_URL || '';
    const imgPath = `${basePath}/images/footer/conditions.jpg`;
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
            Conditions d'utilisation
          </h1>
          <p className="text-lg md:text-xl text-purple-200 max-w-2xl mx-auto">
            En utilisant MyNkap, vous acceptez nos conditions générales
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-purple-200">
            <span>⚖️ Contrat légal</span>
            <span>•</span>
            <span>📋 Version {annee}</span>
            <span>•</span>
            <span>✅ En vigueur immédiatement</span>
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
            <p className="text-gray-600 leading-relaxed mb-4">
              En utilisant l'application <span className="font-semibold text-purple-700">MyNkap</span> ("l'Application", "notre service", "nous", "notre"), 
              vous acceptez de respecter et d'être lié par les présentes conditions d'utilisation. 
              Veuillez les lire attentivement avant d'utiliser nos services.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ <span className="font-semibold">Avertissement :</span> Ces conditions constituent un contrat légal entre vous et MyNkap. 
                En vous inscrivant, vous acceptez tous les termes ci-dessous.
              </p>
            </div>
          </div>

          {/* 1. Acceptation des conditions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">
              1. Acceptation des conditions
            </h2>
            <p className="text-gray-600 leading-relaxed">
              En accédant à notre application ou en créant un compte, vous confirmez que vous avez lu, 
              compris et accepté ces conditions. Si vous n'acceptez pas ces conditions, veuillez ne pas 
              utiliser nos services.
            </p>
          </div>

          {/* 2. Éligibilité */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">
              2. Éligibilité
            </h2>
            <div className="space-y-3 text-gray-600">
              <p>✅ Vous devez avoir <span className="font-semibold">au moins 18 ans</span> pour utiliser nos services</p>
              <p>✅ Vous devez être <span className="font-semibold">capable juridiquement</span> de conclure un contrat</p>
              <p>✅ Vous ne devez pas avoir été <span className="font-semibold">précédemment banni</span> de notre service</p>
              <p>✅ Vous devez fournir des <span className="font-semibold">informations exactes et complètes</span> lors de l'inscription</p>
            </div>
          </div>

          {/* 3. Création et sécurité du compte */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">
              3. Création et sécurité du compte
            </h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                Vous êtes responsable de la confidentialité de vos identifiants de connexion. 
                Vous acceptez de :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Choisir un mot de passe <span className="font-semibold">fort et unique</span></li>
                <li>Ne pas <span className="font-semibold">partager votre compte</span> avec d'autres personnes</li>
                <li><span className="font-semibold">Nous informer immédiatement</span> de toute utilisation non autorisée</li>
                <li><span className="font-semibold">Déconnecter votre session</span> après chaque utilisation sur un appareil partagé</li>
                <li>Être seul responsable de toutes les activités effectuées via votre compte</li>
              </ul>
              <div className="bg-blue-50 p-4 rounded-lg mt-3">
                <p className="text-sm text-blue-800">
                  💡 <span className="font-semibold">Conseil :</span> Activez l'authentification à deux facteurs (2FA) dans vos paramètres 
                  pour une sécurité renforcée.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Utilisation du service */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">
              4. Utilisation du service
            </h2>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-700">Ce que vous pouvez faire :</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Suivre vos revenus et dépenses personnelles</li>
                <li>Créer des budgets et objectifs d'épargne</li>
                <li>Générer des rapports financiers personnalisés</li>
                <li>Exporter vos données pour usage personnel</li>
                <li>Partager vos rapports avec vos conseillers financiers</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-red-600 mt-4">Ce que vous ne pouvez PAS faire :</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                <li>Utiliser le service à des fins <span className="font-semibold">illégales ou frauduleuses</span></li>
                <li>Tenter d'<span className="font-semibold">accéder aux comptes d'autres utilisateurs</span></li>
                <li><span className="font-semibold">Publier ou partager</span> des informations fausses ou trompeuses</li>
                <li><span className="font-semibold">Copier, modifier ou distribuer</span> notre code ou notre design</li>
                <li>Utiliser des <span className="font-semibold">robots ou outils automatisés</span> pour extraire des données</li>
                <li><span className="font-semibold">Perturber ou surcharger</span> nos serveurs</li>
              </ul>
            </div>
          </div>

          {/* 5. Abonnements et paiements */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">
              5. Abonnements et paiements
            </h2>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                  <div className="font-semibold text-purple-700 mb-2">📊 Version Gratuite</div>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Suivi illimité des transactions</li>
                    <li>Jusqu'à 3 budgets actifs</li>
                    <li>Export CSV mensuel</li>
                    <li>Support par email</li>
                  </ul>
                </div>
                <div className="border border-gray-200 p-4 rounded-lg bg-purple-50 hover:shadow-md transition-shadow">
                  <div className="font-semibold text-purple-700 mb-2">⭐ Version Premium</div>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Budgets et objectifs illimités</li>
                    <li>Export CSV/PDF illimité</li>
                    <li>Catégories personnalisées avancées</li>
                    <li>Support prioritaire 24/7</li>
                    <li>Conseils financiers personnalisés</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-gray-600 mt-3">
                Les abonnements Premium sont facturés mensuellement ou annuellement. 
                Le paiement est prélevé automatiquement à chaque échéance. Vous pouvez 
                annuler à tout moment depuis vos paramètres de compte.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">💰 Remboursements :</span> Nous offrons une garantie satisfait ou remboursé 
                  de 14 jours sur tout nouvel abonnement Premium. Au-delà, aucun remboursement 
                  ne sera effectué pour la période en cours.
                </p>
              </div>
            </div>
          </div>

          {/* 6. Propriété intellectuelle */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">
              6. Propriété intellectuelle
            </h2>
            <p className="text-gray-600 mb-3">
              L'application MyNkap, son code source, son design, ses logos, ses icônes et tous 
              ses éléments visuels sont la propriété exclusive de MyNkap et sont protégés par 
              les lois sur la propriété intellectuelle.
            </p>
            <p className="text-gray-600">
              Vous conservez la propriété de <span className="font-semibold">vos données financières</span>. Cependant, 
              vous nous accordez une licence pour utiliser, traiter et stocker ces données 
              uniquement dans le but de vous fournir nos services.
            </p>
          </div>

          {/* 7. Confidentialité des données */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">
              7. Confidentialité des données
            </h2>
            <p className="text-gray-600 mb-3">
              La protection de vos données personnelles est notre priorité. Notre 
              <Link to="/confidentialite" className="text-purple-600 hover:text-purple-700 mx-1">
                Politique de confidentialité
              </Link>
              détaille comment nous collectons, utilisons et protégeons vos informations.
            </p>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-800">
                🔒 <span className="font-semibold">Engagement :</span> Nous ne vendons jamais vos données personnelles à des tiers. 
                Vos informations financières sont chiffrées et sécurisées.
              </p>
            </div>
          </div>

          {/* 8. Suspension et résiliation */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">
              8. Suspension et résiliation
            </h2>
            <div className="space-y-3">
              <p className="text-gray-600">
                <span className="font-semibold">Par vous :</span> Vous pouvez supprimer votre compte à tout moment 
                depuis les paramètres. La suppression est définitive après 30 jours.
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Par nous :</span> Nous nous réservons le droit de suspendre ou résilier 
                votre compte si vous :
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>Violer l'une de ces conditions</li>
                <li>Utiliser le service de manière frauduleuse</li>
                <li>Ne pas payer vos abonnements (comptes Premium)</li>
                <li>Porter préjudice à d'autres utilisateurs ou à notre plateforme</li>
              </ul>
            </div>
          </div>

          {/* 9. Limitation de responsabilité */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">
              9. Limitation de responsabilité
            </h2>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-800 leading-relaxed">
                ⚖️ MyNkap fournit des <span className="font-semibold">outils de suivi financier</span> mais ne fournit pas 
                de conseils financiers professionnels. Vous êtes seul responsable de vos décisions 
                financières. Nous ne sommes pas responsables des pertes financières, des erreurs de 
                saisie ou des décisions prises sur la base des données fournies par notre application.
              </p>
            </div>
            <div className="mt-4 space-y-2 text-gray-600 text-sm">
              <p>Dans toute la mesure permise par la loi, MyNkap ne pourra être tenu responsable :</p>
              <ul className="list-disc list-inside ml-4">
                <li>Des dommages indirects ou consécutifs</li>
                <li>Des interruptions de service temporaires</li>
                <li>Des pertes de données dues à des défaillances techniques</li>
                <li>Des actions de tiers non autorisées</li>
              </ul>
            </div>
          </div>

          {/* 10. Modification des conditions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">
              10. Modification des conditions
            </h2>
            <p className="text-gray-600">
              Nous pouvons modifier ces conditions à tout moment. Les modifications seront 
              publiées sur cette page avec une date de mise à jour révisée. Pour les changements 
              importants, nous vous enverrons une notification par email. Votre utilisation 
              continue du service après les modifications constitue votre acceptation des 
              nouvelles conditions.
            </p>
          </div>

          {/* 11. Loi applicable */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">
              11. Loi applicable
            </h2>
            <p className="text-gray-600">
              Ces conditions sont régies par les lois en vigueur au Cameroun. Tout litige 
              sera soumis à la juridiction exclusive des tribunaux de Douala, Cameroun.
            </p>
          </div>

          {/* 12. Contact */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-purple-200">
              12. Nous contacter
            </h2>
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl">
              <p className="text-gray-700 mb-4">
                Pour toute question concernant ces conditions d'utilisation, vous pouvez nous contacter :
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
              </div>
            </div>
          </div>

          {/* 13. Accord complet */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Ces conditions constituent l'intégralité de l'accord entre vous et MyNkap concernant 
              l'utilisation de nos services. Si une disposition est jugée inapplicable, les autres 
              dispositions restent en vigueur.
            </p>
            <p className="text-sm text-gray-500 mt-3">
              <span className="font-semibold">Date de la dernière révision :</span> {annee}
            </p>
          </div>

        </div>
      </div>

      {/* Boutons de navigation */}
      <div className="max-w-4xl mx-auto px-4 pb-12 flex flex-col sm:flex-row gap-4 justify-between">
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
          to="/confidentialite" 
          className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold group"
        >
          Lire notre politique de confidentialité
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default Conditions;