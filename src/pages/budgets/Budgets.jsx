import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Budgets = () => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const [moisActuel, setMoisActuel] = useState(new Date().getMonth() + 1);
  const [anneeActuelle, setAnneeActuelle] = useState(new Date().getFullYear());

  const [modalOuvert, setModalOuvert] = useState(false); 
  const [modeEdition, setModeEdition] = useState(false);
  const [budgetSelectionne, setBudgetSelectionne] = useState(null);
  const [formData, setFormData] = useState({
    categorie: "",
    montant_limite: "",
    mois: new Date().getMonth() + 1,
    annee: new Date().getFullYear(),
  });
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [stats, setStats] = useState({
    total_budgets: 0,
    total_limite: 0,
    total_depense: 0,
    budgets_depasses: 0,
    budgets_alertes: 0,
  });

  const token = localStorage.getItem("access_token");

  const moisOptions = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (token) {
      fetchBudgets();
    }
  }, [moisActuel, anneeActuelle]);

  useEffect(() => {
    calculateStats();
  }, [budgets]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/finances/categories/?type=depense",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Erreur chargement catégories:", err);
    }
  };

  const fetchBudgets = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        mois: moisActuel,
        annee: anneeActuelle,
      });

      const response = await fetch(
        `http://127.0.0.1:8000/api/finances/budgets/?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 401) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      const data = await response.json();
      setBudgets(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Impossible de charger les budgets.");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalLimite = budgets.reduce(
      (sum, b) => sum + parseFloat(b.montant_limite || 0), 0
    );
    const totalDepense = budgets.reduce(
      (sum, b) => sum + parseFloat(b.montant_depense || 0), 0
    );
    const budgetsDepasses = budgets.filter(
      (b) => parseFloat(b.pourcentage_utilise || 0) >= 100
    ).length;
    const budgetsAlertes = budgets.filter(
      (b) => b.alerte_80 && parseFloat(b.pourcentage_utilise || 0) < 100
    ).length;

    setStats({
      total_budgets: budgets.length,
      total_limite: totalLimite,
      total_depense: totalDepense,
      budgets_depasses: budgetsDepasses,
      budgets_alertes: budgetsAlertes,
    });
  };

  const validerFormulaire = () => {
    const errors = {};
    if (!formData.categorie)
      errors.categorie = "La catégorie est requise.";
    if (
      !formData.montant_limite ||
      isNaN(parseFloat(formData.montant_limite)) ||
      parseFloat(formData.montant_limite) <= 0
    )
      errors.montant_limite = "Le montant doit être un nombre positif.";
    if (!formData.mois)
      errors.mois = "Le mois est requis.";
    if (!formData.annee)
      errors.annee = "L'année est requise.";

    if (!modeEdition) {
      const budgetExistant = budgets.find(
        (b) =>
          b.categorie == formData.categorie &&
          b.mois == formData.mois &&
          b.annee == formData.annee
      );
      if (budgetExistant)
        errors.categorie = "Un budget existe déjà pour cette catégorie ce mois-ci.";
    }
    return errors;
  };

  const ouvrirModalCreation = () => {
    setModeEdition(false);
    setBudgetSelectionne(null);
    setFormData({
      categorie: "",
      montant_limite: "",
      mois: moisActuel,
      annee: anneeActuelle,
    });
    setFormErrors({});
    setSuccessMessage("");
    setModalOuvert(true);
  };

  const ouvrirModalEdition = (budget) => {
    setModeEdition(true);
    setBudgetSelectionne(budget);
    setFormData({
      categorie: budget.categorie,
      montant_limite: budget.montant_limite,
      mois: budget.mois,
      annee: budget.annee,
    });
    setFormErrors({});
    setSuccessMessage("");
    setModalOuvert(true);
  };

  const fermerModal = () => {
    setModalOuvert(false);
    setFormErrors({});
    setSuccessMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validerFormulaire();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormLoading(true);
    try {
      // Swagger attend : categorie, montant_limite, mois, annee
      const payload = {
        categorie: parseInt(formData.categorie),
        montant_limite: parseFloat(formData.montant_limite).toFixed(2),
        mois: parseInt(formData.mois),
        annee: parseInt(formData.annee),
      };

      const url = modeEdition
        ? `http://127.0.0.1:8000/api/finances/budgets/${budgetSelectionne.id}/`
        : "http://127.0.0.1:8000/api/finances/budgets/";

      const method = modeEdition ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSuccessMessage(
          modeEdition
            ? "Budget modifié avec succès !"
            : "Budget créé avec succès !"
        );
        fetchBudgets();
        setTimeout(() => fermerModal(), 1500);
      } else {
        const data = await response.json();
        const apiErrors = {};
        Object.keys(data).forEach((key) => {
          apiErrors[key] = Array.isArray(data[key]) ? data[key][0] : data[key];
        });
        setFormErrors(apiErrors);
      }
    } catch (err) {
      setFormErrors({ general: "Erreur serveur. Réessayez." });
    } finally {
      setFormLoading(false);
    }
  };

  const handleSupprimer = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce budget ?")) return;
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/finances/budgets/${id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 204) {
        fetchBudgets();
      }
    } catch (err) {
      setError("Erreur lors de la suppression.");
    }
  };

  const changerMois = (direction) => {
    let nouveauMois = moisActuel + direction;
    let nouvelleAnnee = anneeActuelle;
    if (nouveauMois > 12) { nouveauMois = 1; nouvelleAnnee++; }
    else if (nouveauMois < 1) { nouveauMois = 12; nouvelleAnnee--; }
    setMoisActuel(nouveauMois);
    setAnneeActuelle(nouvelleAnnee);
  };

  const formatMontant = (montant) => {
    if (!montant && montant !== 0) return "0 FCFA";
    return `${parseFloat(montant).toLocaleString("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} FCFA`;
  };

  const getCategorieInfo = (categorieId) => {
    return categories.find((c) => c.id == categorieId) || {
      nom: "Catégorie",
      icone: "📦",
      couleur: "#7C3AED",
    };
  };

  const getPourcentageColor = (pourcentage) => {
    if (pourcentage >= 100) return "bg-red-500";
    if (pourcentage >= 80) return "bg-orange-500";
    if (pourcentage >= 50) return "bg-yellow-500";
    return "bg-purple-500";
  };

  const getAlerteMessage = (budget) => {
    const pourcentage = parseFloat(budget.pourcentage_utilise || 0);
    if (pourcentage >= 100)
      return { message: "Budget dépassé !", type: "danger" };
    if (pourcentage >= 80 && budget.alerte_80)
      return { message: `Alerte : ${pourcentage.toFixed(0)}% utilisé`, type: "warning" };
    return null;
  };

  if (loading && budgets.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-40">
          <div className="flex flex-col items-center gap-4">
            <svg className="w-12 h-12 animate-spin text-purple-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-gray-500 font-medium">Chargement des budgets...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10">

        {/* Entête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Budgets</h1>
            <p className="text-gray-500 text-sm mt-1">
              Gérez vos budgets mensuels par catégorie
            </p>
          </div>
          <button
            onClick={ouvrirModalCreation}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-sm font-bold rounded-xl transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouveau budget
          </button>
        </div>

        {/* Cartes statistiques */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-purple-700 rounded-2xl p-4 text-white col-span-2 lg:col-span-1">
            <p className="text-purple-200 text-xs font-medium mb-1">Total budgets</p>
            <p className="text-3xl font-black">{stats.total_budgets}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-xs font-medium mb-1">Budget total</p>
            <p className="text-sm font-bold text-gray-900">{formatMontant(stats.total_limite)}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-xs font-medium mb-1">Dépensé</p>
            <p className="text-sm font-bold text-gray-900">{formatMontant(stats.total_depense)}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-xs font-medium mb-1">Dépassés</p>
            <p className={`text-lg font-bold ${stats.budgets_depasses > 0 ? "text-red-600" : "text-gray-900"}`}>
              {stats.budgets_depasses}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className="text-gray-500 text-xs font-medium mb-1">Alerte ≥80%</p>
            <p className={`text-lg font-bold ${stats.budgets_alertes > 0 ? "text-orange-500" : "text-gray-900"}`}>
              {stats.budgets_alertes}
            </p>
          </div>
        </div>

        {/* Sélecteur mois/année */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => changerMois(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <p className="text-xl font-black text-gray-900">
              {moisOptions[moisActuel - 1]} {anneeActuelle}
            </p>
            <button
              onClick={() => changerMois(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Liste budgets */}
        {budgets.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {budgets.map((budget) => {
              const categorieInfo = getCategorieInfo(budget.categorie);
              const pourcentage = parseFloat(budget.pourcentage_utilise || 0);
              const alerte = getAlerteMessage(budget);

              return (
                <div
                  key={budget.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="p-5">

                    {/* En-tête carte */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                          style={{ backgroundColor: `${categorieInfo.couleur || "#7C3AED"}20` }}
                        >
                          {categorieInfo.icone || "📦"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {budget.categorie_nom || categorieInfo.nom}
                          </p>
                          <p className="text-xs text-gray-400">
                            {moisOptions[budget.mois - 1]} {budget.annee}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400 mb-1">Limite</p>
                        <p className="text-sm font-bold text-gray-900">
                          {formatMontant(budget.montant_limite)}
                        </p>
                      </div>
                    </div>

                    {/* Barre progression */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs font-semibold text-gray-600">
                          Dépensé : {formatMontant(budget.montant_depense)}
                        </p>
                        <p className="text-xs font-bold text-gray-500">
                          {pourcentage.toFixed(1)}%
                        </p>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${getPourcentageColor(pourcentage)}`}
                          style={{ width: `${Math.min(pourcentage, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Restant : {formatMontant(budget.montant_restant)}
                      </p>
                    </div>

                    {/* Alerte */}
                    {alerte && (
                      <div className={`mb-3 p-2 rounded-lg text-xs font-semibold ${
                        alerte.type === "danger"
                          ? "bg-red-50 text-red-600"
                          : "bg-orange-50 text-orange-600"
                      }`}>
                        ⚠️ {alerte.message}
                      </div>
                    )}

                    {/* Badges alertes backend */}
                    <div className="flex items-center gap-2 mb-3">
                      {budget.alerte_80 && (
                        <span className="text-xs bg-orange-100 text-orange-600 font-semibold px-2 py-0.5 rounded-full">
                          80% atteint
                        </span>
                      )}
                      {budget.alerte_100 && (
                        <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                          100% atteint
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => ouvrirModalEdition(budget)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Modifier
                      </button>
                      <button
                        onClick={() => handleSupprimer(budget.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Supprimer
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium mb-2">
              Aucun budget pour {moisOptions[moisActuel - 1]} {anneeActuelle}
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Définissez des budgets pour mieux contrôler vos dépenses.
            </p>
            <button
              onClick={ouvrirModalCreation}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Créer un budget
            </button>
          </div>
        )}

      </div>

      {/* Modal */}
      {modalOuvert && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">

            <div className="bg-purple-800 px-6 py-5 flex items-center justify-between sticky top-0 rounded-t-3xl">
              <h2 className="text-lg font-black text-white">
                {modeEdition ? "Modifier le budget" : "Nouveau budget"}
              </h2>
              <button
                onClick={fermerModal}
                className="w-8 h-8 rounded-full bg-purple-700 hover:bg-purple-600 flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-6 py-6">

              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm text-green-700 font-semibold">{successMessage}</p>
                </div>
              )}

              {formErrors.general && (
                <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-xl">
                  <p className="text-sm text-red-700 font-semibold">{formErrors.general}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Catégorie */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Catégorie <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="categorie"
                    value={formData.categorie}
                    onChange={handleChange}
                    disabled={modeEdition}
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm text-gray-800 focus:outline-none focus:border-purple-500 transition-all ${
                      modeEdition ? "bg-gray-100 cursor-not-allowed" : "bg-gray-50"
                    } ${
                      formErrors.categorie
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icone} {cat.nom}
                      </option>
                    ))}
                  </select>
                  {formErrors.categorie && (
                    <p className="text-xs text-red-500 font-medium">{formErrors.categorie}</p>
                  )}
                </div>

                {/* Montant limite */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Montant limite (FCFA) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="montant_limite"
                    value={formData.montant_limite}
                    onChange={handleChange}
                    placeholder="Ex : 50000"
                    step="1000"
                    min="1"
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all ${
                      formErrors.montant_limite
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 bg-gray-50 hover:border-purple-300"
                    }`}
                  />
                  {formErrors.montant_limite && (
                    <p className="text-xs text-red-500 font-medium">{formErrors.montant_limite}</p>
                  )}
                </div>

                {/* Mois */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Mois <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="mois"
                    value={formData.mois}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:border-purple-500 transition-all"
                  >
                    {moisOptions.map((mois, index) => (
                      <option key={index + 1} value={index + 1}>{mois}</option>
                    ))}
                  </select>
                  {formErrors.mois && (
                    <p className="text-xs text-red-500 font-medium">{formErrors.mois}</p>
                  )}
                </div>

                {/* Année */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Année <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="annee"
                    value={formData.annee}
                    onChange={handleChange}
                    min="2020"
                    max="2030"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:border-purple-500 transition-all"
                  />
                  {formErrors.annee && (
                    <p className="text-xs text-red-500 font-medium">{formErrors.annee}</p>
                  )}
                </div>

                {/* Info */}
                <div className="p-3 bg-blue-50 rounded-xl">
                  <p className="text-xs text-blue-700">
                    💡 Le suivi du budget se fera automatiquement à partir de vos transactions dans cette catégorie pour la période sélectionnée.
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full py-3.5 bg-purple-800 hover:bg-purple-900 disabled:bg-purple-400 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {formLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {modeEdition ? "Modification..." : "Création..."}
                    </>
                  ) : (
                    modeEdition ? "Modifier le budget" : "Créer le budget"
                  )}
                </button>

              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Budgets;