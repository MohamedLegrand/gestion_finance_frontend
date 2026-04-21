import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useScrollToTop from "../../hooks/useScrollToTop";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [logoError, setLogoError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { scrollToTop, scrollToElement } = useScrollToTop();

  useEffect(() => {
    // Déterminer le chemin de base selon l'environnement
    const basePath = process.env.PUBLIC_URL || '';
    const imgPath = `${basePath}/images/logo.jpg`;
    setLogoUrl(imgPath);
    
    // Précharger le logo
    const img = new Image();
    img.src = imgPath;
    img.onerror = () => setLogoError(true);
  }, []);

  const handleNavigation = (path, sectionId = null) => {
    // Si on est sur la page d'accueil et qu'on veut scroller vers une section
    if (location.pathname === "/" && sectionId) {
      scrollToElement(sectionId);
    } 
    // Si on est sur une autre page et qu'on veut aller à l'accueil + scroller
    else if (location.pathname !== "/" && sectionId) {
      navigate("/");
      // Attendre que la page d'accueil soit chargée avant de scroller
      setTimeout(() => {
        scrollToElement(sectionId);
      }, 100);
    }
    // Navigation simple vers une page
    else {
      navigate(path);
    }
    setMenuOpen(false);
  };

  const handleScrollToTop = () => {
    if (location.pathname === "/") {
      scrollToTop();
    } else {
      navigate("/");
    }
    setMenuOpen(false);
  };

  const navigateTo = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <header className="w-full bg-purple-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between h-24">

          {/* Logo + Nom */}
          <button
            onClick={handleScrollToTop}
            className="flex items-center gap-4 cursor-pointer group"
          >
            {!logoError && logoUrl ? (
              <img
                src={logoUrl}
                alt="MyNkap Logo"
                className="h-14 w-14 rounded-full object-cover border-2 border-purple-300 group-hover:border-white transition-colors duration-200"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="h-14 w-14 rounded-full bg-purple-600 border-2 border-purple-300 group-hover:border-white transition-colors duration-200 flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
            )}
            <div className="flex flex-col items-start">
              <span className="text-2xl font-black text-white tracking-tight leading-tight">
                MyNkap
              </span>
              <span className="text-xs text-purple-300 font-medium tracking-widest uppercase">
                Gestion financière
              </span>
            </div>
          </button>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-2">
            <button
              onClick={handleScrollToTop}
              className="text-sm font-semibold text-purple-200 hover:text-white hover:bg-purple-700 transition-all duration-200 cursor-pointer px-4 py-2.5 rounded-lg"
            >
              Accueil
            </button>
            <button
              onClick={() => handleNavigation("/", "fonctionnalites")}
              className="text-sm font-semibold text-purple-200 hover:text-white hover:bg-purple-700 transition-all duration-200 cursor-pointer px-4 py-2.5 rounded-lg"
            >
              Fonctionnalités
            </button>
            <button
              onClick={() => handleNavigation("/", "tarifs")}
              className="text-sm font-semibold text-purple-200 hover:text-white hover:bg-purple-700 transition-all duration-200 cursor-pointer px-4 py-2.5 rounded-lg"
            >
              Tarifs
            </button>
            <button
              onClick={() => navigateTo("/apropos")}
              className="text-sm font-semibold text-purple-200 hover:text-white hover:bg-purple-700 transition-all duration-200 cursor-pointer px-4 py-2.5 rounded-lg"
            >
              À propos
            </button>
          </nav>

          {/* Boutons auth desktop */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigateTo("/login")}
              className="text-sm font-semibold text-white border border-purple-400 hover:border-white hover:bg-purple-700 transition-all duration-200 px-6 py-2.5 rounded-xl cursor-pointer"
            >
              Connexion
            </button>
            <button
              onClick={() => navigateTo("/register")}
              className="text-sm font-semibold text-purple-800 bg-white hover:bg-purple-50 transition-all duration-200 px-6 py-2.5 rounded-xl cursor-pointer shadow-md"
            >
              S'inscrire gratuitement
            </button>
          </div>

          {/* Bouton menu mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-2 p-3 rounded-xl hover:bg-purple-700 transition-colors"
            aria-label="Menu"
          >
            <span className={`block w-7 h-0.5 bg-white transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2.5" : ""}`} />
            <span className={`block w-7 h-0.5 bg-white transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-7 h-0.5 bg-white transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2.5" : ""}`} />
          </button>

        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden border-t border-purple-700 bg-purple-900 px-6 py-6 flex flex-col gap-2">
          <button
            onClick={handleScrollToTop}
            className="text-sm font-semibold text-purple-200 hover:text-white hover:bg-purple-700 py-3 px-4 rounded-lg transition-all text-left cursor-pointer"
          >
            Accueil
          </button>
          <button
            onClick={() => handleNavigation("/", "fonctionnalites")}
            className="text-sm font-semibold text-purple-200 hover:text-white hover:bg-purple-700 py-3 px-4 rounded-lg transition-all text-left cursor-pointer"
          >
            Fonctionnalités
          </button>
          <button
            onClick={() => handleNavigation("/", "tarifs")}
            className="text-sm font-semibold text-purple-200 hover:text-white hover:bg-purple-700 py-3 px-4 rounded-lg transition-all text-left cursor-pointer"
          >
            Tarifs
          </button>
          <button
            onClick={() => navigateTo("/apropos")}
            className="text-sm font-semibold text-purple-200 hover:text-white hover:bg-purple-700 py-3 px-4 rounded-lg transition-all text-left cursor-pointer"
          >
            À propos
          </button>
          <div className="flex flex-col gap-3 pt-4 mt-2 border-t border-purple-700">
            <button
              onClick={() => navigateTo("/login")}
              className="text-sm font-semibold text-white py-3 text-center border border-purple-500 hover:border-white rounded-xl hover:bg-purple-700 transition-all cursor-pointer"
            >
              Connexion
            </button>
            <button
              onClick={() => navigateTo("/register")}
              className="text-sm font-semibold text-purple-800 bg-white hover:bg-purple-50 py-3 text-center rounded-xl transition-all cursor-pointer shadow-md"
            >
              S'inscrire gratuitement
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;