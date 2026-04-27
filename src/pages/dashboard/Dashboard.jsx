import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchDashboard(token);
  }, [navigate]);

  const fetchDashboard = async (token) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/dashboard/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError("Impossible de charger le dashboard. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  const formatMontant = (montant) => {
    if (!montant) return "0 FCFA";
    return `${Number(montant).toLocaleString("fr-FR")} FCFA`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getNomMois = (mois) => {
    const moisNoms = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    return moisNoms[mois - 1] || "";
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="w-12 h-12 animate-spin text-purple-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-gray-500 font-medium">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  // Erreur
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-800 font-semibold mb-4">{error}</p>
          <button
            onClick={() => fetchDashboard(localStorage.getItem("access_token"))}
            className="px-6 py-2 bg-purple-700 text-white rounded-xl font-semibold hover:bg-purple-800 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10">

        {/* Entête */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              Bonjour, {data?.utilisateur} ! 
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              {getNomMois(data?.mois_en_cours)} {data?.annee_en_cours} — Voici un aperçu de vos finances
            </p>
          </div>
          <Link
            to="/transactions"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-sm font-bold rounded-xl transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle transaction
          </Link>
        </div>

        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          {/* Solde total */}
          <div className="bg-purple-700 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-purple-200 text-sm font-medium">Solde total</span>
              <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-black">{formatMontant(data?.solde_total)}</p>
            <p className="text-purple-300 text-xs mt-2">
              {data?.comptes?.length || 0} compte(s) actif(s)
            </p>
          </div>

          {/* Revenus du mois */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 text-sm font-medium">Revenus du mois</span>
              <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900">
              {formatMontant(data?.bilan_mensuel?.total_revenus)}
            </p>
            <p className="text-green-600 text-xs font-semibold mt-2">
              ↑ Ce mois-ci
            </p>
          </div>

          {/* Dépenses du mois */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 text-sm font-medium">Dépenses du mois</span>
              <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900">
              {formatMontant(data?.bilan_mensuel?.total_depenses)}
            </p>
            <p className="text-red-500 text-xs font-semibold mt-2">
              ↓ Ce mois-ci
            </p>
          </div>

          {/* Épargne du mois */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-500 text-sm font-medium">Épargne du mois</span>
              <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900">
              {formatMontant(data?.bilan_mensuel?.epargne)}
            </p>
            <p className="text-blue-500 text-xs font-semibold mt-2">
              Revenus - Dépenses
            </p>
          </div>

        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Dernières transactions */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">
                Dernières transactions
              </h2>
              <Link
                to="/transactions"
                className="text-sm text-purple-600 font-semibold hover:text-purple-800 transition-colors"
              >
                Voir tout →
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {data?.dernieres_transactions?.length > 0 ? (
                data.dernieres_transactions.map((transaction) => (
                  <div key={transaction.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        transaction.type === "revenu" ? "bg-green-100" : "bg-red-100"
                      }`}>
                        <svg className={`w-5 h-5 ${
                          transaction.type === "revenu" ? "text-green-600" : "text-red-600"
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                            transaction.type === "revenu"
                              ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                              : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                          } />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {transaction.description || transaction.categorie_nom || "Transaction"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {transaction.compte_nom} • {formatDate(transaction.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${
                        transaction.type === "revenu" ? "text-green-600" : "text-red-600"
                      }`}>
                        {transaction.type === "revenu" ? "+" : "-"}
                        {formatMontant(transaction.montant)}
                      </span>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {transaction.categorie_nom}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-12 text-center">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm font-medium">Aucune transaction ce mois-ci</p>
                  <Link
                    to="/transactions"
                    className="inline-block mt-3 text-sm text-purple-600 font-semibold hover:text-purple-800"
                  >
                    Ajouter une transaction →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Colonne droite */}
          <div className="flex flex-col gap-6">

            {/* Mes comptes */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">Mes comptes</h2>
                <Link
                  to="/comptes"
                  className="text-sm text-purple-600 font-semibold hover:text-purple-800 transition-colors"
                >
                  Gérer →
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {data?.comptes?.length > 0 ? (
                  data.comptes.map((compte) => (
                    <div key={compte.id} className="px-6 py-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{compte.nom}</p>
                          <p className="text-xs text-gray-400 capitalize">{compte.type.replace("_", " ")}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-gray-900">
                        {formatMontant(compte.solde)}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center">
                    <p className="text-gray-500 text-sm">Aucun compte</p>
                    <Link
                      to="/comptes"
                      className="inline-block mt-2 text-sm text-purple-600 font-semibold hover:text-purple-800"
                    >
                      Ajouter un compte →
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* État des budgets */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base font-bold text-gray-900">Budgets du mois</h2>
                <Link
                  to="/budgets"
                  className="text-sm text-purple-600 font-semibold hover:text-purple-800 transition-colors"
                >
                  Voir tout →
                </Link>
              </div>
              <div className="px-6 py-4 flex flex-col gap-4">
                {data?.etat_budgets?.length > 0 ? (
                  data.etat_budgets.map((budget) => (
                    <div key={budget.budget_id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-sm font-semibold text-gray-800">
                          {budget.categorie}
                        </p>
                        <p className="text-xs font-bold text-gray-500">
                          {Number(budget.pourcentage_utilise).toFixed(0)}%
                        </p>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            Number(budget.pourcentage_utilise) >= 100
                              ? "bg-red-500"
                              : Number(budget.pourcentage_utilise) >= 80
                              ? "bg-orange-400"
                              : "bg-purple-500"
                          }`}
                          style={{
                            width: `${Math.min(Number(budget.pourcentage_utilise), 100)}%`
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-400">
                          {formatMontant(budget.montant_depense)} dépensé
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatMontant(budget.montant_limite)}
                        </p>
                      </div>
                      {budget.alertes?.length > 0 && (
                        <p className={`text-xs font-semibold mt-1 ${
                          budget.alertes[0].type === "danger"
                            ? "text-red-500"
                            : "text-orange-500"
                        }`}>
                          ⚠️ {budget.alertes[0].message}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center">
                    <p className="text-gray-500 text-sm">Aucun budget ce mois-ci</p>
                    <Link
                      to="/budgets"
                      className="inline-block mt-2 text-sm text-purple-600 font-semibold hover:text-purple-800"
                    >
                      Créer un budget →
                    </Link>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Dépenses par catégorie */}
        {data?.depenses_par_categorie?.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900">
                Dépenses par catégorie — {getNomMois(data?.mois_en_cours)}
              </h2>
            </div>
            <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.depenses_par_categorie.map((cat, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">{cat.categorie_icone || "📦"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {cat.categorie_nom}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatMontant(cat.total)} ({Number(cat.pourcentage).toFixed(1)}%)
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;