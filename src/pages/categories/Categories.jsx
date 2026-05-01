import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtreType, setFiltreType] = useState("");
  const [modalOuvert, setModalOuvert] = useState(false);
  const [modeEdition, setModeEdition] = useState(false);
  const [categorieSelectionnee, setCategorieSelectionnee] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    type: "depense",
    icone: "",
    couleur: "#7C3AED",
  });
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const token = localStorage.getItem("access_token");

  const iconesDisponibles = [
    "🍽️", "🚌", "🏠", "💊", "🎬", "👗", "📚", "⚽",
    "✈️", "💡", "📱", "🎵", "🛒", "💼", "🏋️", "🎮",
    "💰", "💸", "🏦", "📈", "🎁", "🍺", "☕", "🐾",
  ];

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchCategories();
  }, [filtreType]);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = filtreType
        ? `http://127.0.0.1:8000/api/finances/categories/?type=${filtreType}`
        : "http://127.0.0.1:8000/api/finances/categories/";

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
      setCategories(Array.isArray(data) ? data : [data]);
    } catch (err) {
      setError("Impossible de charger les catégories.");
    } finally {
      setLoading(false);
    }
  };

  const validerFormulaire = () => {
    const errors = {};
    if (!formData.nom.trim())
      errors.nom = "Le nom est requis.";
    if (!formData.type)
      errors.type = "Le type est requis.";
    return errors;
  };

  const ouvrirModalCreation = () => {
    setModeEdition(false);
    setCategorieSelectionnee(null);
    setFormData({ nom: "", type: "depense", icone: "", couleur: "#7C3AED" });
    setFormErrors({});
    setModalOuvert(true);
  };

  const ouvrirModalEdition = (categorie) => {
    setModeEdition(true);
    setCategorieSelectionnee(categorie);
    setFormData({
      nom: categorie.nom,
      type: categorie.type,
      icone: categorie.icone || "",
      couleur: categorie.couleur || "#7C3AED",
    });
    setFormErrors({});
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
      const url = modeEdition
        ? `http://127.0.0.1:8000/api/finances/categories/${categorieSelectionnee.id}/`
        : "http://127.0.0.1:8000/api/finances/categories/";

      const method = modeEdition ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage(
          modeEdition
            ? "Catégorie modifiée avec succès !"
            : "Catégorie créée avec succès !"
        );
        fetchCategories();
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
    if (!window.confirm("Voulez-vous vraiment supprimer cette catégorie ?")) return;
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/finances/categories/${id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 204) {
        fetchCategories();
      }
    } catch (err) {
      setError("Erreur lors de la suppression.");
    }
  };

  const categoriesDepense = categories.filter((c) => c.type === "depense");
  const categoriesRevenu = categories.filter((c) => c.type === "revenu");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10">

        {/* Entête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Catégories</h1>
            <p className="text-gray-500 text-sm mt-1">
              Organisez vos transactions par catégorie
            </p>
          </div>
          <button
            onClick={ouvrirModalCreation}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-sm font-bold rounded-xl transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle catégorie
          </button>
        </div>

        {/* Filtres */}
        <div className="flex items-center gap-3 mb-6">
          {[
            { label: "Toutes", value: "" },
            { label: "Dépenses", value: "depense" },
            { label: "Revenus", value: "revenu" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFiltreType(f.value)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                filtreType === f.value
                  ? "bg-purple-700 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300"
              }`}
            >
              {f.label}
            </button>
          ))}
          <span className="text-sm text-gray-400 ml-2">
            {categories.length} catégorie(s)
          </span>
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

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="w-10 h-10 animate-spin text-purple-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : (
          <div className="flex flex-col gap-8">

            {/* Catégories dépenses */}
            {(filtreType === "" || filtreType === "depense") && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <h2 className="text-base font-bold text-gray-800">
                    Dépenses ({categoriesDepense.length})
                  </h2>
                </div>
                {categoriesDepense.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categoriesDepense.map((cat) => (
                      <div
                        key={cat.id}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:border-purple-200 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                            style={{ backgroundColor: cat.couleur ? `${cat.couleur}20` : "#F3F0FF" }}
                          >
                            {cat.icone || "📦"}
                          </div>
                          <span className="text-xs font-semibold text-red-500 bg-red-50 px-2.5 py-1 rounded-full">
                            Dépense
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{cat.nom}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Créée le {new Date(cat.date_creation).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                          <button
                            onClick={() => ouvrirModalEdition(cat)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Modifier
                          </button>
                          <button
                            onClick={() => handleSupprimer(cat.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
                    <p className="text-gray-400 text-sm">Aucune catégorie de dépense</p>
                    <button
                      onClick={ouvrirModalCreation}
                      className="mt-3 text-sm text-purple-600 font-semibold hover:text-purple-800"
                    >
                      Créer une catégorie →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Catégories revenus */}
            {(filtreType === "" || filtreType === "revenu") && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <h2 className="text-base font-bold text-gray-800">
                    Revenus ({categoriesRevenu.length})
                  </h2>
                </div>
                {categoriesRevenu.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categoriesRevenu.map((cat) => (
                      <div
                        key={cat.id}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:border-purple-200 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                            style={{ backgroundColor: cat.couleur ? `${cat.couleur}20` : "#F0FFF4" }}
                          >
                            {cat.icone || "💰"}
                          </div>
                          <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                            Revenu
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{cat.nom}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            Créée le {new Date(cat.date_creation).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-50">
                          <button
                            onClick={() => ouvrirModalEdition(cat)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Modifier
                          </button>
                          <button
                            onClick={() => handleSupprimer(cat.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
                    <p className="text-gray-400 text-sm">Aucune catégorie de revenu</p>
                    <button
                      onClick={ouvrirModalCreation}
                      className="mt-3 text-sm text-purple-600 font-semibold hover:text-purple-800"
                    >
                      Créer une catégorie →
                    </button>
                  </div>
                )}
              </div>
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
                {modeEdition ? "Modifier la catégorie" : "Nouvelle catégorie"}
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
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Ex : Alimentation"
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
                    Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, type: "depense" }))}
                      className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                        formData.type === "depense"
                          ? "bg-red-500 text-white border-red-500"
                          : "bg-white text-gray-600 border-gray-200 hover:border-red-300"
                      }`}
                    >
                      💸 Dépense
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, type: "revenu" }))}
                      className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                        formData.type === "revenu"
                          ? "bg-green-500 text-white border-green-500"
                          : "bg-white text-gray-600 border-gray-200 hover:border-green-300"
                      }`}
                    >
                      💰 Revenu
                    </button>
                  </div>
                </div>

                {/* Icône */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Icône
                  </label>
                  <div className="grid grid-cols-8 gap-2">
                    {iconesDisponibles.map((icone) => (
                      <button
                        key={icone}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, icone }))}
                        className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${
                          formData.icone === icone
                            ? "bg-purple-100 border-2 border-purple-500 scale-110"
                            : "bg-gray-50 border border-gray-200 hover:bg-purple-50"
                        }`}
                      >
                        {icone}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Couleur */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-gray-700">
                    Couleur
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      name="couleur"
                      value={formData.couleur}
                      onChange={handleChange}
                      className="w-12 h-10 rounded-lg border-2 border-gray-200 cursor-pointer"
                    />
                    <span className="text-sm text-gray-500 font-mono">
                      {formData.couleur}
                    </span>
                    <div
                      className="w-10 h-10 rounded-xl"
                      style={{ backgroundColor: `${formData.couleur}30` }}
                    />
                  </div>
                </div>

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
                    modeEdition ? "Modifier la catégorie" : "Créer la catégorie"
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

export default Categories;