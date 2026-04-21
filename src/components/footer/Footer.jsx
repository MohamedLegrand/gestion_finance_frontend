// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Footer = () => {
  const annee = new Date().getFullYear();
  const [socialIcons, setSocialIcons] = useState({
    facebook: '',
    whatsapp: '',
    github: '',
    linkedin: ''
  });
  const [logoUrl, setLogoUrl] = useState('');
  const [iconsError, setIconsError] = useState({
    facebook: false,
    whatsapp: false,
    github: false,
    linkedin: false
  });

  useEffect(() => {
    // Déterminer le chemin de base selon l'environnement
    const basePath = process.env.PUBLIC_URL || '';
    
    // Charger le logo
    setLogoUrl(`${basePath}/images/logo.jpg`);
    
    // Charger les icônes des réseaux sociaux
    const socialPaths = {
      facebook: `${basePath}/images/icones/facebook.jpg`,
      whatsapp: `${basePath}/images/icones/whatsapp.jpg`,
      github: `${basePath}/images/icones/github.jpg`,
      linkedin: `${basePath}/images/icones/linkedin.jpg`
    };
    
    setSocialIcons(socialPaths);
    
    // Précharger les icônes pour détecter les erreurs
    Object.entries(socialPaths).forEach(([key, path]) => {
      const img = new Image();
      img.src = path;
      img.onerror = () => {
        setIconsError(prev => ({ ...prev, [key]: true }));
      };
    });
  }, []);

  // Composant d'icône avec fallback
  const SocialIcon = ({ iconKey, href, label }) => {
    if (iconsError[iconKey] || !socialIcons[iconKey]) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-full bg-purple-800 hover:bg-purple-600 flex items-center justify-center transition-colors duration-200"
        >
          <span className="text-white text-sm font-bold">{label.charAt(0)}</span>
        </a>
      );
    }
    
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-purple-800 hover:bg-purple-600 flex items-center justify-center transition-colors duration-200 overflow-hidden"
      >
        <img 
          src={socialIcons[iconKey]} 
          alt={label}
          className="w-full h-full object-cover"
        />
      </a>
    );
  };

  return (
    <footer className="bg-purple-950 text-white">

      {/* Section principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Colonne 1 — Logo + description */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="MyNkap Logo"
                  className="h-9 w-9 rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML += '<span className="text-xl font-bold tracking-tight">MyNkap</span>';
                  }}
                />
              )}
              <span className="text-xl font-bold tracking-tight">
                MyNkap
              </span>
            </div>
            <p className="text-sm text-purple-200 leading-relaxed">
              Gérez vos finances personnelles en toute simplicité.
              Suivez vos dépenses, budgets et objectifs d'épargne
              au quotidien.
            </p>

            {/* Réseaux sociaux */}
            <div className="flex items-center gap-4 mt-2">
              <SocialIcon
                iconKey="facebook"
                href="https://facebook.com/mynkap"
                label="Facebook"
              />
              <SocialIcon
                iconKey="whatsapp"
                href="https://wa.me/237677246900"
                label="WhatsApp"
              />
              <SocialIcon
                iconKey="github"
                href="https://github.com/mynkap"
                label="GitHub"
              />
              <SocialIcon
                iconKey="linkedin"
                href="https://linkedin.com/company/mynkap"
                label="LinkedIn"
              />
            </div>
          </div>

          {/* Colonne 2 — Produit */}
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-purple-300">
              Produit
            </h3>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Fonctionnalités", to: "/fonctionnalites" },
                { label: "Tarifs", to: "/tarifs" },
                { label: "Témoignages", to: "/temoignages" },
                { label: "Nouveautés", to: "/nouveautes" },
                { label: "Feuille de route", to: "/roadmap" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-purple-200 hover:text-white transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 — Ressources */}
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-purple-300">
              Ressources
            </h3>
            <ul className="flex flex-col gap-3">
              {[
                { label: "À propos", to: "/apropos" },
                { label: "Blog", to: "/blog" },
                { label: "Centre d'aide", to: "/aide" },
                { label: "Contact", to: "/contact" },
                { label: "Partenaires", to: "/partenaires" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-purple-200 hover:text-white transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 4 — Newsletter */}
          <div className="flex flex-col gap-5">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-purple-300">
              Newsletter
            </h3>
            <p className="text-sm text-purple-200 leading-relaxed">
              Recevez nos conseils financiers et nos nouveautés
              directement dans votre boîte mail.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="votre@email.com"
                className="w-full px-4 py-2.5 rounded-lg bg-purple-900 border border-purple-700 text-sm text-white placeholder-purple-400 focus:outline-none focus:border-purple-400 transition-colors duration-200"
              />
              <button className="w-full px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-sm font-semibold text-white transition-colors duration-200">
                S'abonner
              </button>
            </div>

            {/* Contact direct */}
            <div className="flex flex-col gap-2 mt-2">
              <a
                href="mailto:legrandmohamed67@gmail.com"
                className="text-sm text-purple-200 hover:text-white transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                legrandmohamed67@gmail.com
              </a>
              
              <a
                href="tel:+237677246900"
                className="text-sm text-purple-200 hover:text-white transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                +237 677 246 900
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Séparateur */}
      <div className="border-t border-purple-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Copyright */}
            <p className="text-sm text-purple-300">
              © {annee} MyNkap. Tous droits réservés.
            </p>

            {/* Liens légaux */}
            <div className="flex items-center gap-6">
              <Link
                to="/confidentialite"
                className="text-sm text-purple-300 hover:text-white transition-colors duration-200"
              >
                Politique de confidentialité
              </Link>
              <Link
                to="/conditions"
                className="text-sm text-purple-300 hover:text-white transition-colors duration-200"
              >
                Conditions d'utilisation
              </Link>
              <Link
                to="/cookies"
                className="text-sm text-purple-300 hover:text-white transition-colors duration-200"
              >
                Politique des cookies
              </Link>
            </div>

          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;