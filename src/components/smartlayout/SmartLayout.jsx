// src/components/smartlayout/SmartLayout.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../header/Header";
import HeaderConnected from "../headerconnected/HeaderConnected";
import Footer from "../footer/Footer";

export default function SmartLayout({ children }) {
  const location = useLocation();
  const [showHeader, setShowHeader] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollTimeout, setScrollTimeout] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
  }, [location.pathname]);

  // 1. Gestion automatique selon la route
  useEffect(() => {
    const hiddenHeaderRoutes = ["/login", "/register"];
    const hiddenFooterRoutes = ["/login", "/register"];

    const path = location.pathname;

    // Pour les utilisateurs connectés, on garde toujours le header et footer visibles
    if (isAuthenticated) {
      setShowHeader(true);
      setShowFooter(true);
      return;
    }

    // Gestion pour les utilisateurs non connectés
    setShowHeader(!hiddenHeaderRoutes.includes(path));
    setShowFooter(!hiddenFooterRoutes.includes(path));
  }, [location.pathname, isAuthenticated]);

  // 2. Cache header au scroll (uniquement pour utilisateurs non connectés)
  useEffect(() => {
    // Pas de cache auto pour utilisateurs connectés
    if (isAuthenticated) return;

    const disableAutoHideRoutes = ["/login", "/register"];
    if (disableAutoHideRoutes.includes(location.pathname)) return;

    const handleScroll = () => {
      const currentY = window.scrollY;

      if (scrollTimeout) clearTimeout(scrollTimeout);

      if (currentY > lastScrollY && currentY > 100) {
        const timeout = setTimeout(() => {
          setShowHeader(false);
        }, 150);
        setScrollTimeout(timeout);
      } else if (currentY < lastScrollY && currentY < lastScrollY - 5) {
        setShowHeader(true);
        if (scrollTimeout) clearTimeout(scrollTimeout);
      }

      setLastScrollY(currentY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [lastScrollY, scrollTimeout, location.pathname, isAuthenticated]);

  // 3. Ajustement dynamique du margin-top
  const getHeaderHeight = () => {
    if (!showHeader) return 0;
    return isAuthenticated ? 80 : 96; // h-20 = 80px, h-24 = 96px
  };

  useEffect(() => {
    const mainElement = document.querySelector(".smartlayout-main");
    if (mainElement) {
      const headerHeight = getHeaderHeight();
      mainElement.style.marginTop = showHeader ? `${headerHeight}px` : "0";
    }
  }, [showHeader, isAuthenticated]);

  // Sélectionner le bon header
  const renderHeader = () => {
    if (!showHeader) return null;
    return isAuthenticated ? <HeaderConnected /> : <Header />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header avec animation Tailwind */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
          !showHeader ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        {renderHeader()}
      </div>

      {/* Contenu principal */}
      <main className="flex-1 transition-all duration-300 smartlayout-main">
        {children}
      </main>

      {/* Footer */} 
      {showFooter && <Footer />}
    </div>
  );
}