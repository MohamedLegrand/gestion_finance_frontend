import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Transferts = () => {
  const navigate = useNavigate();
  const [transferts, setTransferts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comptes, setComptes] = useState([]);

  const [filtres, setFiltres] = useState({
    annee: new Date().getFullYear(),
    mois: new Date().getMonth() + 1,
    compte_source_id: "",
    compte_destination_id: "",
  });
  const [showFilters, setShowFilters] = useState(true);

  const [modalOuvert, setModalOuvert] = useState(false);
  const [formData, setFormData] = useState({
    compte_source: "",
    compte_destination: "",
    montant: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [stats, setStats] = useState({
    montant_total: 0,
    nombre_transferts: 0,
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

  const formatMontant = (montant) => {
    if (!montant && montant !== 0) return "0 FCFA";
    return `${parseFloat(montant).toLocaleString("fr-FR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} FCFA`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getCompteSolde = (compteId) => {
    const compte = comptes.find((c) => c.id == compteId);
    return compte ? parseFloat(compte.solde) : 0;
  };

  const calculateStats = (transfertsList) => {
    const total = transfertsList.reduce(
      (sum, t) => sum + parseFloat(t.montant || 0), 0
    );
    setStats({
      montant_total: total,
      nombre_transferts: transfertsList.length,
    });
  };

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

  const fetchTransferts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Swagger : annee, mois, compte_source_id, compte_destination_id
      const params = new URLSearchParams();
      if (filtres.annee) params.append("annee", filtres.annee);
      if (filtres.mois) params.append("mois", filtres.mois);
      if (filtres.compte_source_id)
        params.append("compte_source_id", filtres.compte_source_id);
      if (filtres.compte_destination_id)
        params.append("compte_destination_id", filtres.compte_destination_id);

      const response = await fetch(
        `http://127.0.0.1:8000/api/finances/transferts/?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 401) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      const data = await response.json();
      const transfertsData = Array.isArray(data) ? data : [];
      setTransferts(transfertsData);
      calculateStats(transfertsData);
    } catch (err) {
      setError("Impossible de charger les transferts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchComptes();
  }, []);

  useEffect(() => {
    if (token) {
      fetchTransferts();
    }
  }, [filtres]);

  const validerFormulaire = () => {
    const errors = {};
    if (!formData.compte_source)
      errors.compte_source = "Le compte source est requis.";
    if (!formData.compte_destination)
      errors.compte_destination = "Le compte destination est requis.";
    if (
      formData.compte_source &&
      formData.compte_destination &&
      formData.compte_source === formData.compte_destination
    )
      errors.compte_destination =
        "Les comptes source et destination doivent être différents.";
    if (
      !formData.montant ||
      isNaN(parseFloat(formData.montant)) ||
      parseFloat(formData.montant) <= 0
    )
      errors.montant = "Le montant doit être un nombre positif.";
    if (!formData.date)
      errors.date = "La date est requise.";

    // Vérifier solde suffisant
    if (formData.compte_source && formData.montant) {
      const solde = getCompteSolde(formData.compte_source);
      if (parseFloat(formData.montant) > solde)
        errors.montant = `Solde insuffisant. Disponible : ${formatMontant(solde)}`;
    }

    return errors;
  };

  const ouvrirModalCreation = () => {
    setFormData({
      compte_source: "",
      compte_destination: "",
      montant: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
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
      // Swagger POST : compte_source, compte_destination, montant, description, date
      const payload = {
        compte_source: parseInt(formData.compte_source),
        compte_destination: parseInt(formData.compte_destination),
        montant: parseFloat(formData.montant).toFixed(2),
        description: formData.description || "",
        date: formData.date,
      };

      const response = await fetch(
        "http://127.0.0.1:8000/api/finances/transferts/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        setSuccessMessage("Transfert effectué avec succès !");
        await fetchTransferts();
        await fetchComptes();
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
        "Voulez-vous vraiment annuler ce transfert ? Les soldes seront restaurés."
      )
    )
      return;
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/finances/transferts/${id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 204) {
        await fetchTransferts();
        await fetchComptes();
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
      compte_source_id: "",
      compte_destination_id: "",
    });
  };

  const comptesActifs = comptes.filter((c) => c.actif !== false);
  const comptesDestination = comptesActifs.filter(
    (c) => c.id != formData.compte_source
  );

  if (loading && transferts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-40">
          <div className="flex flex-col items-center gap-4">
            <svg className="w-12 h-12 animate-spin text-purple-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-gray-500 font-medium">Chargement des transferts...</p>
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
            <h1 className="text-2xl font-black text-gray-900">Transferts</h1>
            <p className="text-gray-500 text-sm mt-1">
              Déplacez de l'argent entre vos comptes
            </p>
          </div>
          <button
            onClick={ouvrirModalCreation}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-sm font-bold rounded-xl transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Nouveau transfert
          </button>
        </div>

        {/* Cartes statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
          <div className="bg-purple-700 rounded-2xl p-5 text-white shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-200 text-sm font-medium">Montant total transféré</p>
              <svg className="w-5 h-5 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <p className="text-2xl font-black">{formatMontant(stats.montant_total)}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 text-sm font-medium">Nombre de transferts</p>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-2xl font-black text-gray-900">{stats.nombre_transferts}</p>
            <p className="text-xs text-gray-400 mt-1">Ce mois-ci</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 text-sm font-medium">Moyenne par transfert</p>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-2xl font-black text-gray-900">
              {formatMontant(
                stats.nombre_transferts > 0
                  ? stats.montant_total / stats.nombre_transferts
                  : 0
              )}
            </p>
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
              {(filtres.compte_source_id || filtres.compte_destination_id) && (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Compte source</label>
                  <select
                    name="compte_source_id"
                    value={filtres.compte_source_id}
                    onChange={handleFiltreChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-purple-500 transition-all"
                  >
                    <option value="">Tous</option>
                    {comptesActifs.map((compte) => (
                      <option key={compte.id} value={compte.id}>{compte.nom}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Compte destination</label>
                  <select
                    name="compte_destination_id"
                    value={filtres.compte_destination_id}
                    onChange={handleFiltreChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-purple-500 transition-all"
                  >
                    <option value="">Tous</option>
                    {comptesActifs.map((compte) => (
                      <option key={compte.id} value={compte.id}>{compte.nom}</option>
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

        {/* Liste transferts */}
        {transferts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {transferts.map((transfert) => (
              <div
                key={transfert.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="p-5">

                  {/* En-tête */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Transfert</p>
                        <p className="text-xs text-gray-400">{formatDate(transfert.date)}</p>
                      </div>
                    </div>
                    <span className="text-lg font-black text-purple-700">
                      {formatMontant(transfert.montant)}
                    </span>
                  </div>

                  {/* Comptes */}
                  <div className="bg-gray-50 rounded-xl p-3 mb-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 text-center">
                        <p className="text-xs text-gray-400 mb-1">De</p>
                        <p className="text-sm font-bold text-gray-800 truncate">
                          {transfert.compte_source_nom || "—"}
                        </p>
                      </div>
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                      <div className="flex-1 text-center">
                        <p className="text-xs text-gray-400 mb-1">Vers</p>
                        <p className="text-sm font-bold text-gray-800 truncate">
                          {transfert.compte_destination_nom || "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {transfert.description && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold">Note :</span> {transfert.description}
                      </p>
                    </div>
                  )}

                  {/* Action — swagger : DELETE uniquement, pas de PUT */}
                  <div className="pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleSupprimer(transfert.id)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Annuler le transfert
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium mb-2">Aucun transfert trouvé</p>
            <p className="text-sm text-gray-400 mb-4">
              {filtres.compte_source_id || filtres.compte_destination_id
                ? "Aucun transfert ne correspond à ces filtres."
                : "Effectuez votre premier transfert entre comptes."}
            </p>
            <button
              onClick={ouvrirModalCreation}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Effectuer un transfert
            </button>
          </div>
        )}

      </div>

      {/* Modal création uniquement */}
      {modalOuvert && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

            <div className="bg-purple-800 px-6 py-5 flex items-center justify-between sticky top-0 rounded-t-3xl">
              <h2 className="text-lg font-black text-white">Nouveau transfert</h2>
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

                {/* Compte source */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Compte source <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="compte_source"
                    value={formData.compte_source}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm text-gray-800 focus:outline-none focus:border-purple-500 transition-all bg-gray-50 ${
                      formErrors.compte_source
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <option value="">Sélectionnez un compte source</option>
                    {comptesActifs.map((compte) => (
                      <option key={compte.id} value={compte.id}>
                        {compte.nom} — {formatMontant(compte.solde)}
                      </option>
                    ))}
                  </select>
                  {formErrors.compte_source && (
                    <p className="text-xs text-red-500 font-medium">{formErrors.compte_source}</p>
                  )}
                </div>

                {/* Compte destination */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Compte destination <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="compte_destination"
                    value={formData.compte_destination}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm text-gray-800 focus:outline-none focus:border-purple-500 transition-all bg-gray-50 ${
                      formErrors.compte_destination
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <option value="">Sélectionnez un compte destination</option>
                    {comptesDestination.map((compte) => (
                      <option key={compte.id} value={compte.id}>
                        {compte.nom} — {formatMontant(compte.solde)}
                      </option>
                    ))}
                  </select>
                  {formErrors.compte_destination && (
                    <p className="text-xs text-red-500 font-medium">{formErrors.compte_destination}</p>
                  )}
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
                    placeholder="Ex : 10000"
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
                  {formData.compte_source && (
                    <p className="text-xs text-gray-400">
                      Solde disponible : {formatMontant(getCompteSolde(formData.compte_source))}
                    </p>
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
                    placeholder="Ex : Virement mensuel, Remboursement..."
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all resize-none"
                  />
                </div>

                {/* Info */}
                <div className="p-3 bg-blue-50 rounded-xl">
                  <p className="text-xs text-blue-700">
                    💡 Le transfert débitera le compte source et créditera le compte destination automatiquement.
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
                      Transfert en cours...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Effectuer le transfert
                    </>
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

export default Transferts;