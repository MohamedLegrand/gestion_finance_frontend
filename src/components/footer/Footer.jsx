import { Link } from "react-router-dom";

const Footer = () => {
  const annee = new Date().getFullYear();

  return (
    <footer className="bg-purple-950 text-white">

      {/* Section principale */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Colonne 1 — Logo + description */}
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.jpg"
                alt="MyNkap Logo"
                className="h-9 w-9 rounded-full object-cover"
              />
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
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-purple-800 hover:bg-purple-600 flex items-center justify-center transition-colors duration-200"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-purple-800 hover:bg-purple-600 flex items-center justify-center transition-colors duration-200"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-purple-800 hover:bg-purple-600 flex items-center justify-center transition-colors duration-200"
              >
                <svg className="w-4 h-4 fill-none stroke-white stroke-2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="white" />
                </svg>
              </a>
              
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-purple-800 hover:bg-purple-600 flex items-center justify-center transition-colors duration-200"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
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
                href="mailto:contact@mynkap.com"
                className="text-sm text-purple-200 hover:text-white transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                contact@mynkap.com
              </a>
              
              <a
                href="tel:+237600000000"
                className="text-sm text-purple-200 hover:text-white transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                </svg>
                +237 600 000 000
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
              {[
                { label: "Confidentialité", to: "/confidentialite" },
                { label: "Conditions d'utilisation", to: "/conditions" },
                { label: "Cookies", to: "/cookies" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-sm text-purple-300 hover:text-white transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>

          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;