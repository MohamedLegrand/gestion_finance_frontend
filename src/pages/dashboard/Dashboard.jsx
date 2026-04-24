// src/pages/dashboard/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("access_token");
    
    if (!token) {
      navigate("/login");
      return;
    }
    
    setUserName(username || "Utilisateur");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Bonjour, {userName} ! 
          </h1>
          <p className="text-gray-600 mt-2">
            Bienvenue sur votre espace personnel MyNkap
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Déconnexion
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 text-sm">Solde total</span>
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900">2 450 000 FCFA</div>
          <div className="text-sm text-green-600 mt-2">+12.5% vs mois dernier</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 text-sm">Dépenses</span>
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900">845 000 FCFA</div>
          <div className="text-sm text-red-600 mt-2">+8.2% vs mois dernier</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 text-sm">Épargne</span>
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900">605 000 FCFA</div>
          <div className="text-sm text-blue-600 mt-2">Objectif à 75%</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 text-sm">Budget restant</span>
            <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="text-2xl font-bold text-gray-900">155 000 FCFA</div>
          <div className="text-sm text-purple-600 mt-2">Sur 300 000 FCFA</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Dernières transactions</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { nom: "Achat alimentation", montant: "-25 000 FCFA", date: "Aujourd'hui", type: "depense" },
            { nom: "Virement reçu", montant: "+150 000 FCFA", date: "Hier", type: "revenu" },
            { nom: "Netflix", montant: "-7 500 FCFA", date: "Il y a 3 jours", type: "depense" },
            { nom: "Salaire", montant: "+450 000 FCFA", date: "Il y a 5 jours", type: "revenu" },
          ].map((transaction, index) => (
            <div key={index} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === "revenu" ? "bg-green-100" : "bg-red-100"
                }`}>
                  <svg className={`w-5 h-5 ${
                    transaction.type === "revenu" ? "text-green-600" : "text-red-600"
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                      transaction.type === "revenu" 
                        ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
                        : "M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
                    } />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.nom}</p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
              </div>
              <span className={`font-semibold ${
                transaction.type === "revenu" ? "text-green-600" : "text-red-600"
              }`}>
                {transaction.montant}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-400">
        <p>↓ Scrolle vers le bas pour voir le header disparaître (uniquement si non connecté) ↓</p>
      </div>
    </div>
  );
};

export default Dashboard;