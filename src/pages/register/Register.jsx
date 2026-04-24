import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validerFormulaire = () => {
    const newErrors = {};
    if (!formData.username.trim())
      newErrors.username = "Le nom d'utilisateur est requis.";
    if (!formData.first_name.trim())
      newErrors.first_name = "Le prénom est requis.";
    if (!formData.last_name.trim())
      newErrors.last_name = "Le nom est requis.";
    if (!formData.email.trim())
      newErrors.email = "L'email est requis.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "L'email n'est pas valide.";
    if (!formData.password.trim())
      newErrors.password = "Le mot de passe est requis.";
    else if (formData.password.length < 6)
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères.";
    if (!formData.phone.trim())
      newErrors.phone = "Le numéro de téléphone est requis.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validerFormulaire();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      const response = await fetch("http://127.0.0.1:8000/api/account/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.status === 201) {
        setSuccessMessage("Compte créé avec succès ! Redirection...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        const apiErrors = {};
        Object.keys(data).forEach((key) => {
          apiErrors[key] = Array.isArray(data[key]) ? data[key][0] : data[key];
        });
        setErrors(apiErrors);
      }
    } catch (error) {
      setErrors({ general: "Erreur de connexion au serveur. Réessayez." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-50 flex items-center justify-center px-4 py-12">

      {/* Cadre principal */}
      <div className="w-full max-w-lg border-2 border-purple-300 rounded-3xl shadow-2xl overflow-hidden">

        {/* Bandeau violet en haut */}
        <div className="bg-purple-800 px-8 py-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-1.5 bg-white rounded-full">
              <img
                src="/images/logo.jpg"
                alt="MyNkap Logo"
                className="h-16 w-16 rounded-full object-cover"
              />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white">
            Créer un compte
          </h1>
          <p className="text-purple-200 mt-1.5 text-sm">
            Rejoignez MyNkap et prenez le contrôle de vos finances
          </p>
        </div>

        {/* Corps du formulaire */}
        <div className="bg-white px-8 py-8">

          {/* Message succès */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-300 rounded-xl flex items-center gap-3">
              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-green-700 font-semibold">{successMessage}</p>
            </div>
          )}

          {/* Erreur générale */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 rounded-xl flex items-center gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-700 font-semibold">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Prénom + Nom */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Jean"
                  className={`w-full px-4 py-3 rounded-xl border-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all duration-200 ${
                    errors.first_name
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 bg-gray-50 hover:border-purple-300"
                  }`}
                />
                {errors.first_name && (
                  <p className="text-xs text-red-500 font-medium">{errors.first_name}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Dupont"
                  className={`w-full px-4 py-3 rounded-xl border-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all duration-200 ${
                    errors.last_name
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 bg-gray-50 hover:border-purple-300"
                  }`}
                />
                {errors.last_name && (
                  <p className="text-xs text-red-500 font-medium">{errors.last_name}</p>
                )}
              </div>
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700">
                Nom d'utilisateur <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="jean_dupont"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all duration-200 ${
                    errors.username
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 bg-gray-50 hover:border-purple-300"
                  }`}
                />
              </div>
              {errors.username && (
                <p className="text-xs text-red-500 font-medium">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700">
                Adresse email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jean@exemple.com"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all duration-200 ${
                    errors.email
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 bg-gray-50 hover:border-purple-300"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Téléphone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700">
                Numéro de téléphone <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+237 677 246 900"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all duration-200 ${
                    errors.phone
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 bg-gray-50 hover:border-purple-300"
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-500 font-medium">{errors.phone}</p>
              )}
            </div>

            {/* Mot de passe */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700">
                Mot de passe <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 caractères"
                  className={`w-full pl-11 pr-12 py-3 rounded-xl border-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all duration-200 ${
                    errors.password
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 bg-gray-50 hover:border-purple-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Bouton submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-purple-800 hover:bg-purple-900 disabled:bg-purple-400 text-white font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-2 text-base"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Création en cours...
                </>
              ) : (
                <>
                  Créer mon compte
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>

          </form>

          {/* Séparateur */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OU</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Lien connexion */}
          <p className="text-center text-sm text-gray-500">
            Vous avez déjà un compte ?{" "}
            <Link
              to="/login"
              className="text-purple-700 font-bold hover:text-purple-900 transition-colors"
            >
              Se connecter
            </Link>
          </p>

        </div>

        {/* Bandeau bas */}
        <div className="bg-purple-50 border-t-2 border-purple-200 px-8 py-4 text-center">
          <p className="text-xs text-gray-400">
            En créant un compte vous acceptez nos{" "}
            <Link to="/conditions" className="text-purple-600 font-semibold hover:text-purple-800">
              Conditions d'utilisation
            </Link>{" "}
            et notre{" "}
            <Link to="/confidentialite" className="text-purple-600 font-semibold hover:text-purple-800">
              Politique de confidentialité
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;