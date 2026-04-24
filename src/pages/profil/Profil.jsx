// src/pages/profil/Profil.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Profil = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("informations");
  
  // Données du profil
  const [profil, setProfil] = useState({
    id: "",
    phone: "",
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    date_joined: ""
  });

  // Données pour changer le mot de passe
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: ""
  });

  // Récupérer les infos du localStorage
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }
    
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    
    setProfil(prev => ({
      ...prev,
      username: username || "",
      email: email || ""
    }));
    
    fetchProfil();
  }, [navigate]);

  // Récupérer le profil depuis l'API
  const fetchProfil = async () => {
    const token = localStorage.getItem("access_token");
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/account/profile/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setProfil(prev => ({
          ...prev,
          id: data.id || "",
          phone: data.phone || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          date_joined: data.date_joined || ""
        }));
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour le profil
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setSuccessMessage("");

    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/account/profile/", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone: profil.phone,
          first_name: profil.first_name,
          last_name: profil.last_name
        })
      });

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (response.ok) {
        setSuccessMessage("Profil mis à jour avec succès !");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const data = await response.json();
        setErrors(data);
      }
    } catch (error) {
      setErrors({ general: "Erreur de connexion au serveur" });
    } finally {
      setSaving(false);
    }
  };

  // Changer le mot de passe
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});
    setSuccessMessage("");

    if (passwordData.new_password !== passwordData.confirm_password) {
      setErrors({ confirm_password: "Les mots de passe ne correspondent pas" });
      setSaving(false);
      return;
    }

    const token = localStorage.getItem("access_token");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/account/change-password/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          old_password: passwordData.old_password,
          new_password: passwordData.new_password
        })
      });

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (response.ok) {
        setSuccessMessage("Mot de passe modifié avec succès !");
        setPasswordData({
          old_password: "",
          new_password: "",
          confirm_password: ""
        });
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        const data = await response.json();
        setErrors(data);
      }
    } catch (error) {
      setErrors({ general: "Erreur de connexion au serveur" });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfil(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-3 border-purple-800 mx-auto"></div>
          <p className="mt-6 text-gray-600 font-medium">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* En-tête avec carte de bienvenue */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-800 to-purple-600 px-8 py-8">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold text-purple-800">
                      {profil.username?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-purple-50 transition-colors">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {profil.first_name && profil.last_name 
                      ? `${profil.first_name} ${profil.last_name}`
                      : profil.username}
                  </h1>
                  <p className="text-purple-200 mt-1">Membre depuis {new Date(profil.date_joined).getFullYear()}</p>
                </div>
              </div>
            </div>
            
            {/* Stats rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-8 py-6 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Nom d'utilisateur</p>
                  <p className="text-sm font-semibold text-gray-800">{profil.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-semibold text-gray-800">{profil.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">ID utilisateur</p>
                  <p className="text-sm font-semibold text-gray-800">#{profil.id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages d'état */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-xl flex items-center gap-3 animate-fade-in">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm text-green-700 font-semibold">{successMessage}</p>
          </div>
        )}

        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-xl flex items-center gap-3 animate-fade-in">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700 font-semibold">{errors.general}</p>
          </div>
        )}

        {/* Tabs navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex gap-8">
              <button
                onClick={() => setActiveTab("informations")}
                className={`pb-4 px-1 text-sm font-semibold transition-all duration-200 ${
                  activeTab === "informations"
                    ? "text-purple-700 border-b-2 border-purple-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Informations personnelles
                </div>
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`pb-4 px-1 text-sm font-semibold transition-all duration-200 ${
                  activeTab === "security"
                    ? "text-purple-700 border-b-2 border-purple-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Sécurité
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Formulaire Informations */}
        {activeTab === "informations" && (
          <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden animate-fade-in">
            <form onSubmit={handleSubmit} className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Informations générales</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Prénom */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={profil.first_name}
                    onChange={handleChange}
                    placeholder="Votre prénom"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all duration-200"
                  />
                </div>

                {/* Nom */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={profil.last_name}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all duration-200"
                  />
                </div>

                {/* Nom d'utilisateur (lecture seule) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom d'utilisateur
                  </label>
                  <input
                    type="text"
                    value={profil.username}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 mt-1">Le nom d'utilisateur ne peut pas être modifié</p>
                </div>

                {/* Email (lecture seule) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    value={profil.email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>

                {/* Téléphone */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Numéro de téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profil.phone}
                    onChange={handleChange}
                    placeholder="+237 6XX XXX XXX"
                    className={`w-full px-4 py-3 rounded-xl border-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all duration-200 ${
                      errors.phone
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 font-medium mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Boutons */}
              <div className="flex gap-4 pt-8">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-purple-800 hover:bg-purple-900 disabled:bg-purple-400 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Enregistrement...
                    </>
                  ) : (
                    "Enregistrer les modifications"
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200"
                >
                  Retour au tableau de bord
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Formulaire Sécurité */}
        {activeTab === "security" && (
          <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden animate-fade-in">
            <form onSubmit={handlePasswordChange} className="p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Changer le mot de passe</h2>
              
              <div className="space-y-6">
                {/* Ancien mot de passe */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    name="old_password"
                    value={passwordData.old_password}
                    onChange={handlePasswordInputChange}
                    placeholder="Votre mot de passe actuel"
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-purple-500 transition-all duration-200 ${
                      errors.old_password
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200"
                    }`}
                  />
                  {errors.old_password && (
                    <p className="text-xs text-red-500 font-medium mt-1">{errors.old_password}</p>
                  )}
                </div>

                {/* Nouveau mot de passe */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordInputChange}
                    placeholder="Nouveau mot de passe"
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-purple-500 transition-all duration-200 ${
                      errors.new_password
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200"
                    }`}
                  />
                  {errors.new_password && (
                    <p className="text-xs text-red-500 font-medium mt-1">{errors.new_password}</p>
                  )}
                </div>

                {/* Confirmation */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordInputChange}
                    placeholder="Confirmer le nouveau mot de passe"
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:border-purple-500 transition-all duration-200 ${
                      errors.confirm_password
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200"
                    }`}
                  />
                  {errors.confirm_password && (
                    <p className="text-xs text-red-500 font-medium mt-1">{errors.confirm_password}</p>
                  )}
                </div>
              </div>

              {/* Conseils de sécurité */}
              <div className="mt-6 p-4 bg-purple-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-purple-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-purple-800">Conseils de sécurité</p>
                    <ul className="text-xs text-purple-600 mt-1 space-y-1">
                      <li>• Utilisez au moins 8 caractères</li>
                      <li>• Mélangez lettres majuscules, minuscules, chiffres et symboles</li>
                      <li>• Évitez les mots de passe déjà utilisés</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Boutons */}
              <div className="flex gap-4 pt-8">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-purple-800 hover:bg-purple-900 disabled:bg-purple-400 text-white font-semibold rounded-xl transition-all duration-200 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Modification...
                    </>
                  ) : (
                    "Changer le mot de passe"
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => setActiveTab("informations")}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all duration-200"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Styles CSS pour les animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Profil;