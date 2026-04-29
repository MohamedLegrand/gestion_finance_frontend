// src/pages/comptes/Comptes.jsx

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Comptes = () => {
  const navigate = useNavigate();
  const [comptes, setComptes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtreType, setFiltreType] = useState("");
  const [modalOuvert, setModalOuvert] = useState(false);
  const [modeEdition, setModeEdition] = useState(false);
  const [compteSelectionne, setCompteSelectionne] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    type: "mobile_money",
    solde: "",
    devise: "XAF",
    actif: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [soldeTotal, setSoldeTotal] = useState(0);

  const token = localStorage.getItem("access_token");

  // Types de comptes disponibles
  const typesCompte = [
    { value: "mobile_money", label: "Mobile Money", icone: "📱", couleur: "bg-blue-500" },
    { value: "banque", label: "Compte Bancaire", icone: "🏦", couleur: "bg-green-500" },
    { value: "especes", label: "Espèces", icone: "💵", couleur: "bg-emerald-500" },
    { value: "carte_credit", label: "Carte de Crédit", icone: "💳", couleur: "bg-red-500" },
    { value: "epargne", label: "Épargne", icone: "💰", couleur: "bg-purple-500" },
  ];

  // Devises disponibles
  const devises = [
    { value: "XAF", label: "FCFA", symbole: "FCFA" },
    { value: "EUR", label: "Euro", symbole: "€" },
    { value: "USD", label: "Dollar", symbole: "$" },
  ];

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchComptes();
    fetchSoldeTotal();
  }, [filtreType]);

  const fetchComptes = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = filtreType
        ? `http://127.0.0.1:8000/api/finances/comptes/?type=${filtreType}`
        : "http://127.0.0.1:8000/api/finances/comptes/";

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      const data = await response.json();
      setComptes(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError("Impossible de charger les comptes.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSoldeTotal = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/finances/comptes/solde/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        // La réponse peut être un objet avec le solde total
        const total = data.solde_total || data.total || Object.values(data)[0] || 0;
        setSoldeTotal(total);
      }
    } catch (err) {
      console.error("Erreur chargement solde total:", err);
    }
  };

  const validerFormulaire = () => {
    const errors = {};
    if (!formData.nom.trim()) errors.nom = "Le nom du compte est requis.";
    if (!formData.type) errors.type = "Le type de compte est requis.";
    if (!formData.solde || isNaN(parseFloat(formData.solde))) {
      errors.solde = "Le solde doit être un nombre valide.";
    }
    if (!formData.devise) errors.devise = "La devise est requise.";
    return errors;
  };

  const ouvrirModalCreation = () => {
    setModeEdition(false);
    setCompteSelectionne(null);
    setFormData({
      nom: "",
      type: "mobile_money",
      solde: "",
      devise: "XAF",
      actif: true,
    });
    setFormErrors({});
    setSuccessMessage("");
    setModalOuvert(true);
  };

  const ouvrirModalEdition = (compte) => {
    setModeEdition(true);
    setCompteSelectionne(compte);
    setFormData({
      nom: compte.nom,
      type: compte.type,
      solde: compte.solde,
      devise: compte.devise,
      actif: compte.actif,
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
    const { name, value, type: inputType, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: inputType === "checkbox" ? checked : value,
    }));
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
      const url = modeEdition
        ? `http://127.0.0.1:8000/api/finances/comptes/${compteSelectionne.id}/`
        : "http://127.0.0.1:8000/api/finances/comptes/";

      const method = modeEdition ? "PUT" : "POST";

      // Pour l'édition, ne pas envoyer le solde si on veut éviter les incohérences
      const dataToSend = modeEdition
        ? {
            nom: formData.nom,
            type: formData.type,
            devise: formData.devise,
            actif: formData.actif,
          }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        setSuccessMessage(
          modeEdition
            ? "Compte modifié avec succès !"
            : "Compte créé avec succès !"
        );
        fetchComptes();
        fetchSoldeTotal();
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
    if (!window.confirm("Voulez-vous vraiment supprimer ce compte ? La suppression d'un compte peut affecter vos transactions.")) return;
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/finances/comptes/${id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 204) {
        fetchComptes();
        fetchSoldeTotal();
      }
    } catch (err) {
      setError("Erreur lors de la suppression.");
    }
  };

  const getTypeInfo = (type) => {
    return typesCompte.find(t => t.value === type) || typesCompte[0];
  };

  const formatMontant = (montant, devise = "XAF") => {
    if (!montant && montant !== 0) return "0 FCFA";
    const nombre = parseFloat(montant).toLocaleString("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    const deviseInfo = devises.find(d => d.value === devise);
    const symbole = deviseInfo?.symbole || devise;
    return `${nombre} ${symbole}`;
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

  // Filtrer les comptes par type
  const comptesFiltres = comptes.filter(compte =>
    filtreType ? compte.type === filtreType : true
  );

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="w-12 h-12 animate-spin text-purple-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-gray-500 font-medium">Chargement des comptes...</p>
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
            <h1 className="text-2xl font-black text-gray-900">Mes comptes</h1>
            <p className="text-gray-500 text-sm mt-1">
              Gérez vos comptes bancaires, portefeuilles et comptes d'épargne
            </p>
          </div>
          <button
            onClick={ouvrirModalCreation}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-sm font-bold rounded-xl transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouveau compte
          </button>
        </div>

        {/* Carte solde total */}
        <div className="mb-6 bg-gradient-to-r from-purple-700 to-purple-800 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-purple-200 text-sm font-medium">Solde total de tous vos comptes</p>
              <p className="text-3xl font-black mt-1">{formatMontant(soldeTotal)}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-purple-200">
                {comptesFiltres.length} compte(s)
              </p>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={() => setFiltreType("")}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              filtreType === ""
                ? "bg-purple-700 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300"
            }`}
          >
            Tous
          </button>
          {typesCompte.map((type) => (
            <button
              key={type.value}
              onClick={() => setFiltreType(type.value)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                filtreType === type.value
                  ? "bg-purple-700 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300"
              }`}
            >
              <span>{type.icone}</span>
              <span>{type.label}</span>
            </button>
          ))}
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

        {/* Liste des comptes */}
        {comptesFiltres.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {comptesFiltres.map((compte) => {
              const typeInfo = getTypeInfo(compte.type);
              return (
                <div
                  key={compte.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                          style={{ backgroundColor: `${typeInfo.couleur}20` }}
                        >
                          <span>{typeInfo.icone}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{compte.nom}</p>
                          <p className="text-xs text-gray-400 capitalize">
                            {typeInfo.label}
                          </p>
                        </div>
                      </div>
                      {!compte.actif && (
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          Inactif
                        </span>
                      )}
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-gray-400 mb-1">Solde</p>
                      <p className="text-xl font-black text-gray-900">
                        {formatMontant(compte.solde, compte.devise)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400 mb-5">
                      <span>Créé le {formatDate(compte.date_creation)}</span>
                      <span className="capitalize">{compte.devise}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                      <Link
                        to={`/transactions?compte_id=${compte.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Transactions
                      </Link>
                      <button
                        onClick={() => ouvrirModalEdition(compte)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Modifier
                      </button>
                      <button
                        onClick={() => handleSupprimer(compte.id)}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium mb-2">Aucun compte trouvé</p>
            <p className="text-sm text-gray-400 mb-4">
              {filtreType
                ? "Aucun compte ne correspond à ce filtre."
                : "Commencez par créer votre premier compte."}
            </p>
            {!filtreType && (
              <button
                onClick={ouvrirModalCreation}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Créer un compte
              </button>
            )}
          </div>
        )}

      </div>

      {/* Modal création / édition */}
      {modalOuvert && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">

            {/* Entête modal */}
            <div className="bg-purple-800 px-6 py-5 flex items-center justify-between">
              <h2 className="text-lg font-black text-white">
                {modeEdition ? "Modifier le compte" : "Nouveau compte"}
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

            {/* Corps modal */}
            <div className="px-6 py-6">

              {/* Message succès */}
              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-sm text-green-700 font-semibold">{successMessage}</p>
                </div>
              )}

              {/* Erreur générale */}
              {formErrors.general && (
                <div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-xl">
                  <p className="text-sm text-red-700 font-semibold">{formErrors.general}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Nom */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Nom du compte <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Ex : Compte courant, Épargne, Orange Money..."
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all ${
                      formErrors.nom
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 bg-gray-50 hover:border-purple-300"
                    }`}
                  />
                  {formErrors.nom && (
                    <p className="text-xs text-red-500 font-medium">{formErrors.nom}</p>
                  )}
                </div>

                {/* Type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Type de compte <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {typesCompte.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, type: type.value }))}
                        className={`py-3 rounded-xl text-sm font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                          formData.type === type.value
                            ? "bg-purple-700 text-white border-purple-700"
                            : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
                        }`}
                      >
                        <span>{type.icone}</span>
                        <span>{type.label}</span>
                      </button>
                    ))}
                  </div>
                  {formErrors.type && (
                    <p className="text-xs text-red-500 font-medium">{formErrors.type}</p>
                  )}
                </div>

                {/* Solde (uniquement à la création) */}
                {!modeEdition && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-gray-700">
                      Solde initial <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="solde"
                      value={formData.solde}
                      onChange={handleChange}
                      placeholder="0"
                      step="0.01"
                      className={`w-full px-4 py-3 rounded-xl border-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all ${
                        formErrors.solde
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 bg-gray-50 hover:border-purple-300"
                      }`}
                    />
                    {formErrors.solde && (
                      <p className="text-xs text-red-500 font-medium">{formErrors.solde}</p>
                    )}
                  </div>
                )}

                {/* Devise */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Devise <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="devise"
                    value={formData.devise}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-sm text-gray-800 focus:outline-none focus:border-purple-500 transition-all"
                  >
                    {devises.map((devise) => (
                      <option key={devise.value} value={devise.value}>
                        {devise.label} ({devise.symbole})
                      </option>
                    ))}
                  </select>
                  {formErrors.devise && (
                    <p className="text-xs text-red-500 font-medium">{formErrors.devise}</p>
                  )}
                </div>

                {/* Actif (seulement en édition) */}
                {modeEdition && (
                  <div className="flex items-center justify-between py-2">
                    <label className="text-sm font-bold text-gray-700">Compte actif</label>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, actif: !prev.actif }))}
                      className={`w-12 h-6 rounded-full transition-all duration-200 ${
                        formData.actif ? "bg-purple-600" : "bg-gray-300"
                      } relative`}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200 ${
                          formData.actif ? "left-6" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>
                )}

                {/* Bouton submit */}
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
                    modeEdition ? "Modifier le compte" : "Créer le compte"
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

export default Comptes;