// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import ScrollToTop from "./components/scrolltotop/ScrollToTop"; 

// Importez vos pages/components depuis leurs dossiers respectifs
import Accueil from "./pages/accueil/Accueil";
import Apropos from "./pages/apropos/Apropos";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";

//footer page
import Confidentialite from "./pages/confidentialite/Confidentialite";
import Conditions from "./pages/conditions/Conditions";
import Cookies from "./pages/cookies/Cookies";
import Contact from "./pages/contact/Contact";

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL || "/"}>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/apropos" element={<Apropos />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Footer pages */}
            <Route path="/confidentialite" element={<Confidentialite />} />
            <Route path="/conditions" element={<Conditions />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;