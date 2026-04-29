import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Transactions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comptes, setComptes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [filtres, setFiltres] = useState({
    annee: new Date().getFullYear(),
    mois: new Date().getMonth() + 1,
    type: "",
    compte_id: "",
    categorie_id: "",
  });
  const [showFilters, setShowFilters] = useState(true);

  const [modalOuvert, setModalOuvert] = useState(false);
  const [modeEdition, setModeEdition] = useState(false);
  const [transactionSelectionnee, setTransactionSelectionnee] = useState(null);
  const [formData, setFormData] = useState({
    compte: "",
    categorie: "",
    montant: "",
    type: "depense",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [stats, setStats] = useState({
    total_revenus: 0,
    total_depenses: 0,
    solde: 0,
  });

  const token = localStorage.getItem("access_token");

  const moisOptions = [
    { value: 1, label: "Janvier" },
    { value: 2, label: "Février" },
    { value: 3, label: "Mars" },
    { value: 4, label: "Avril" },
    { value: 5, label: "Mai" },
    { value: 6, label: "Juin" },
    { value: 7, label: "Juillet" },
    { value: 8, label: "Août" },
    { value: 9, label: "Septembre" },
    { value: 10, label: "Octobre" },
    { value: 11, label: "Novembre" },
    { value: 12, label: "Décembre" },
  ];

  const anneeOptions = () => {
    const anneeCourante = new Date().getFullYear();
    const annees = [];
    for (let i = anneeCourante - 3; i <= anneeCourante + 2; i++) {
      annees.push({ value: i, label: i });
    }
    return annees;
  };

  // Récupérer compte_id depuis l'URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const compteId = params.get("compte_id");
    if (compteId) {
      setFiltres((prev) => ({ ...prev, compte_id: compteId }));
    }
  }, [location.search]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchComptes();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (token) {
      fetchTransactions();
      fetchStats();
    }
  }, [filtres]);

  const fetchComptes = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/finances/comptes/",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.ok) {
        const data = await response.json();
        setComptes(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Erreur comptes:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/finances/categories/",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.ok) {
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Erreur catégories:", err);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      // Swagger : annee, mois, type, compte_id, categorie_id
      const params = new URLSearchParams();
      if (filtres.annee) params.append("annee", filtres.annee);
      if (filtres.mois) params.append("mois", filtres.mois);
      if (filtres.type) params.append("type", filtres.type);
      if (filtres.compte_id) params.append("compte_id", filtres.compte_id);
      if (filtres.categorie_id) params.append("categorie_id", filtres.categorie_id);

      const response = await fetch(
        `http://127.0.0.1:8000/api/finances/transactions/?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 401) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      const data = await response.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Impossible de charger les transactions.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Swagger : annee et mois sont requis (*)
      const response = await fetch(
        `http://127.0.0.1:8000/api/finances/transactions/statistiques/?annee=${filtres.annee}&mois=${filtres.mois}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.ok) {
        const data = await response.json();
        // Le swagger retourne additionalProp1/2/3
        // On cherche les bonnes clés
        const totalRevenus =
          parseFloat(data.total_revenus || data.bilan_mensuel?.total_revenus || 0);
        const totalDepenses =
          parseFloat(data.total_depenses || data.bilan_mensuel?.total_depenses || 0);
        setStats({
          total_revenus: totalRevenus,
          total_depenses: totalDepenses,
          solde: totalRevenus - totalDepenses,
        });
      }
    } catch (err) {
      console.error("Erreur stats:", err);
    }
  };

  const validerFormulaire = () => {
    const errors = {};
    if (!formData.compte)
      errors.compte = "Le compte est requis.";
    if (!formData.categorie)
      errors.categorie = "La catégorie est requise.";
    if (
      !formData.montant ||
      isNaN(parseFloat(formData.montant)) ||
      parseFloat(formData.montant) <= 0
    )
      errors.montant = "Le montant doit être un nombre positif.";
    if (!formData.type)
      errors.type = "Le type est requis.";
    if (!formData.date)
      errors.date = "La date est requise.";
    return errors;
  };

  const ouvrirModalCreation = () => {
    setModeEdition(false);
    setTransactionSelectionnee(null);
    setFormData({
      compte: "",
      categorie: "",
      montant: "",
      type: "depense",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
    setFormErrors({});
    setSuccessMessage("");
    setModalOuvert(true);
  };

  const ouvrirModalEdition = (transaction) => {
    setModeEdition(true);
    setTransactionSelectionnee(transaction);
    setFormData({
      compte: transaction.compte,
      categorie: transaction.categorie,
      montant: Math.abs(parseFloat(transaction.montant)),
      type: transaction.type,
      description: transaction.description || "",
      date: transaction.date,
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
    if (name === "type") {
      setFormData((prev) => ({ ...prev, [name]: value, categorie: "" }));
    }
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
      // Swagger POST : compte, categorie, montant, type, description, date
      // Le montant doit être positif, le type indique si c'est une dépense ou revenu
      const payload = {
        compte: parseInt(formData.compte),
        categorie: parseInt(formData.categorie),
        montant: parseFloat(formData.montant).toFixed(2),
        type: formData.type,
        description: formData.description || "",
        date: formData.date,
      };

      const url = modeEdition
        ? `http://127.0.0.1:8000/api/finances/transactions/${transactionSelectionnee.id}/`
        : "http://127.0.0.1:8000/api/finances/transactions/";

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
            ? "Transaction modifiée avec succès !"
            : "Transaction créée avec succès !"
        );
        fetchTransactions();
        fetchStats();
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
    if (
      !window.confirm(
        "Voulez-vous vraiment supprimer cette transaction ? Cette action est irréversible."
      )
    )
      return;
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/finances/transactions/${id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 204) {
        fetchTransactions();
        fetchStats();
      }
    } catch (err) {
      setError("Erreur lors de la suppression.");
    }
  };

  const handleFiltreChange = (e) => {
    const { name, value } = e.target;
    setFiltres((prev) => ({ ...prev, [name]: value }));
  };

  const resetFiltres = () => {
    setFiltres({
      annee: new Date().getFullYear(),
      mois: new Date().getMonth() + 1,
      type: "",
      compte_id: "",
      categorie_id: "",
    });
  };

  const formatMontant = (montant) => {
    const nombre = Math.abs(parseFloat(montant || 0)).toLocaleString("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return `${nombre} FCFA`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Filtrer catégories selon le type sélectionné dans le formulaire
  const getCategoriesFiltrees = () =>
    formData.type
      ? categories.filter((cat) => cat.type === formData.type)
      : categories;

  if (loading && transactions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-40">
          <div className="flex flex-col items-center gap-4">
            <svg className="w-12 h-12 animate-spin text-purple-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-gray-500 font-medium">Chargement des transactions...</p>
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
            <h1 className="text-2xl font-black text-gray-900">Transactions</h1>
            <p className="text-gray-500 text-sm mt-1">
              Gérez vos dépenses et revenus
            </p>
          </div>
          <button
            onClick={ouvrirModalCreation}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-sm font-bold rounded-xl transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle transaction
          </button>
        </div>

        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <div className="bg-green-500 rounded-2xl p-5 text-white shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-100 text-sm font-medium">Total revenus</p>
              <svg className="w-5 h-5 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-2xl font-black">+{formatMontant(stats.total_revenus)}</p>
          </div>

          <div className="bg-red-500 rounded-2xl p-5 text-white shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-red-100 text-sm font-medium">Total dépenses</p>
              <svg className="w-5 h-5 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            </div>
            <p className="text-2xl font-black">-{formatMontant(stats.total_depenses)}</p>
          </div>

          <div className={`rounded-2xl p-5 text-white shadow-sm ${
            stats.solde >= 0 ? "bg-purple-600" : "bg-orange-500"
          }`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-100 text-sm font-medium">Solde du mois</p>
              <svg className="w-5 h-5 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-2xl font-black">
              {stats.solde >= 0 ? "+" : "-"}{formatMontant(Math.abs(stats.solde))}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 text-sm font-medium">Transactions</p>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-2xl font-black text-gray-900">{transactions.length}</p>
            <p className="text-xs text-gray-400 mt-1">Ce mois-ci</p>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6 overflow-hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="font-semibold text-gray-700">Filtres</span>
              {(filtres.type || filtres.compte_id || filtres.categorie_id) && (
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                  Actifs
                </span>
              )}
            </div>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${showFilters ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showFilters && (
            <div className="px-6 pb-6 pt-2 border-t border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

                {/* Année */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Année</label>
                  <select
                    name="annee"
                    value={filtres.annee}
                    onChange={handleFiltreChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-purple-500 transition-all"
                  >
                    {anneeOptions().map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Mois */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Mois</label>
                  <select
                    name="mois"
                    value={filtres.mois}
                    onChange={handleFiltreChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-purple-500 transition-all"
                  >
                    {moisOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Type */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Type</label>
                  <select
                    name="type"
                    value={filtres.type}
                    onChange={handleFiltreChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-purple-500 transition-all"
                  >
                    <option value="">Tous</option>
                    <option value="depense">Dépenses</option>
                    <option value="revenu">Revenus</option>
                  </select>
                </div>

                {/* Compte */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Compte</label>
                  <select
                    name="compte_id"
                    value={filtres.compte_id}
                    onChange={handleFiltreChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-purple-500 transition-all"
                  >
                    <option value="">Tous les comptes</option>
                    {comptes.map((compte) => (
                      <option key={compte.id} value={compte.id}>{compte.nom}</option>
                    ))}
                  </select>
                </div>

                {/* Catégorie */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Catégorie</label>
                  <select
                    name="categorie_id"
                    value={filtres.categorie_id}
                    onChange={handleFiltreChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-purple-500 transition-all"
                  >
                    <option value="">Toutes</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.nom}</option>
                    ))}
                  </select>
                </div>

              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={resetFiltres}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-purple-700 font-medium transition-colors"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          )}
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

        {/* Liste transactions */}
        {transactions.length > 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm font-bold text-gray-700">
                {transactions.length} transaction(s) trouvée(s)
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Catégorie</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Compte</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Montant</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {formatDate(transaction.date)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900">
                          {transaction.description || "Sans description"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                          transaction.type === "depense"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}>
                          {transaction.categorie_nom || "—"}
                        </span>
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {transaction.compte_nom || "—"}
                        </span>
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`text-sm font-bold ${
                          transaction.type === "depense"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}>
                          {transaction.type === "depense" ? "-" : "+"}
                          {formatMontant(transaction.montant)}
                        </span>
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => ouvrirModalEdition(transaction)}
                            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleSupprimer(transaction.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium mb-2">Aucune transaction trouvée</p>
            <p className="text-sm text-gray-400 mb-4">
              Aucune transaction ne correspond à vos filtres.
            </p>
            <button
              onClick={ouvrirModalCreation}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter une transaction
            </button>
          </div>
        )}

      </div>

      {/* Modal */}
      {modalOuvert && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

            <div className="bg-purple-800 px-6 py-5 flex items-center justify-between sticky top-0 rounded-t-3xl">
              <h2 className="text-lg font-black text-white">
                {modeEdition ? "Modifier la transaction" : "Nouvelle transaction"}
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

                {/* Type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, type: "depense", categorie: "" }))
                      }
                      className={`py-3 rounded-xl text-sm font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                        formData.type === "depense"
                          ? "bg-red-500 text-white border-red-500"
                          : "bg-white text-gray-600 border-gray-200 hover:border-red-300"
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                      </svg>
                      Dépense
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, type: "revenu", categorie: "" }))
                      }
                      className={`py-3 rounded-xl text-sm font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                        formData.type === "revenu"
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-white text-gray-600 border-gray-200 hover:border-green-300"
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Revenu
                    </button>
                  </div>
                </div>

                {/* Montant */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Montant (FCFA) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="montant"
                    value={formData.montant}
                    onChange={handleChange}
                    placeholder="Ex : 5000"
                    step="1"
                    min="1"
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all ${
                      formErrors.montant
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 bg-gray-50 hover:border-purple-300"
                    }`}
                  />
                  {formErrors.montant && (
                    <p className="text-xs text-red-500 font-medium">{formErrors.montant}</p>
                  )}
                </div>

                {/* Date */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm text-gray-800 focus:outline-none focus:border-purple-500 transition-all ${
                      formErrors.date
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 bg-gray-50 hover:border-purple-300"
                    }`}
                  />
                  {formErrors.date && (
                    <p className="text-xs text-red-500 font-medium">{formErrors.date}</p>
                  )}
                </div>

                {/* Compte */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Compte <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="compte"
                    value={formData.compte}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm text-gray-800 focus:outline-none focus:border-purple-500 transition-all ${
                      formErrors.compte
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 bg-gray-50 hover:border-purple-300"
                    }`}
                  >
                    <option value="">Sélectionnez un compte</option>
                    {comptes.map((compte) => (
                      <option key={compte.id} value={compte.id}>
                        {compte.nom} — {formatMontant(compte.solde)}
                      </option>
                    ))}
                  </select>
                  {formErrors.compte && (
                    <p className="text-xs text-red-500 font-medium">{formErrors.compte}</p>
                  )}
                </div>

                {/* Catégorie — filtrée selon le type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Catégorie <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="categorie"
                    value={formData.categorie}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm text-gray-800 focus:outline-none focus:border-purple-500 transition-all ${
                      formErrors.categorie
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 bg-gray-50 hover:border-purple-300"
                    }`}
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {getCategoriesFiltrees().map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icone} {cat.nom}
                      </option>
                    ))}
                  </select>
                  {formErrors.categorie && (
                    <p className="text-xs text-red-500 font-medium">{formErrors.categorie}</p>
                  )}
                  {getCategoriesFiltrees().length === 0 && (
                    <p className="text-xs text-orange-500 font-medium">
                      Aucune catégorie pour ce type.{" "}
                      <Link to="/categories" className="text-purple-600 underline">
                        Créez-en une
                      </Link>
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Description
                    <span className="text-gray-400 font-normal ml-1">(optionnel)</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Ex : Achat supermarché, Salaire avril..."
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all resize-none"
                  />
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
                    modeEdition ? "Modifier la transaction" : "Créer la transaction"
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

export default Transactions;