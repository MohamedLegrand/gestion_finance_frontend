// src/pages/Contact.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Contact = () => {
  const annee = new Date().getFullYear();
  const [imageUrl, setImageUrl] = useState('');
  const [imageError, setImageError] = useState(false);
  
  // État pour les icônes des réseaux sociaux
  const [socialIcons, setSocialIcons] = useState({
    facebook: '',
    linkedin: '',
    whatsapp: '',
    github: ''
  });
  const [iconsError, setIconsError] = useState({
    facebook: false,
    linkedin: false,
    whatsapp: false,
    github: false
  });

  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    // Déterminer le chemin de base selon l'environnement
    const basePath = process.env.PUBLIC_URL || '';
    
    // Charger l'image de fond de la hero section
    const imgPath = `${basePath}/images/footer/contact.jpg`;
    setImageUrl(imgPath);
    
    // Précharger l'image de fond
    const img = new Image();
    img.src = imgPath;
    img.onload = () => setImageError(false);
    img.onerror = () => setImageError(true);
    
    // Charger les icônes des réseaux sociaux
    const socialPaths = {
      facebook: `${basePath}/images/icones/facebook.jpg`,
      linkedin: `${basePath}/images/icones/linkedin.jpg`,
      whatsapp: `${basePath}/images/icones/whatsapp.jpg`,
      github: `${basePath}/images/icones/github.jpg`
    };
    
    setSocialIcons(socialPaths);
    
    // Précharger les icônes
    Object.entries(socialPaths).forEach(([key, path]) => {
      const socialImg = new Image();
      socialImg.src = path;
      socialImg.onload = () => {
        setIconsError(prev => ({ ...prev, [key]: false }));
      };
      socialImg.onerror = () => {
        setIconsError(prev => ({ ...prev, [key]: true }));
      };
    });
  }, []);

  // Style de fond avec fallback
  const backgroundStyle = {
    backgroundImage: imageError || !imageUrl
      ? 'linear-gradient(135deg, #4c1d95 0%, #2e1065 100%)'
      : `linear-gradient(to bottom, rgba(88, 28, 135, 0.92), rgba(59, 7, 100, 0.96)), url(${imageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulation d'envoi (à remplacer par votre API)
    setTimeout(() => {
      console.log('Formulaire soumis:', formData);
      setSubmitStatus('success');
      setFormData({
        nom: '',
        email: '',
        sujet: '',
        message: ''
      });
      setIsSubmitting(false);
      
      // Cacher le message après 5 secondes
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  // Composant d'icône avec fallback
  const SocialIcon = ({ iconKey, href, label }) => {
    if (iconsError[iconKey] || !socialIcons[iconKey]) {
      // Fallback textuel si l'image ne charge pas
      return (
        <a 
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-100 p-2 rounded-lg hover:bg-purple-100 transition-colors group inline-flex items-center justify-center w-10 h-10"
        >
          <span className="text-gray-600 group-hover:text-purple-600 font-bold text-sm">
            {label.charAt(0)}
          </span>
        </a>
      );
    }
    
    return (
      <a 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gray-100 p-2 rounded-lg hover:bg-purple-100 transition-colors group overflow-hidden"
      >
        <img 
          src={socialIcons[iconKey]} 
          alt={label}
          className="w-6 h-6 object-contain group-hover:scale-110 transition-transform"
        />
      </a>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero section avec image de fond */}
      <div 
        className="relative text-white py-20 md:py-28"
        style={backgroundStyle}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Icône/Illustration */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
            Contactez-nous
          </h1>
          <p className="text-lg md:text-xl text-purple-200 max-w-2xl mx-auto">
            Une question ? Un problème ? Nous sommes là pour vous aider
          </p>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-purple-200">
            <span>📞 Réponse sous 24h</span>
            <span>•</span>
            <span>💬 Support gratuit</span>
            <span>•</span>
            <span>🤝 Service client dédié</span>
          </div>
        </div>
        
        {/* Effet de vague en bas */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg className="relative block w-full h-12" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                  fill="#F9FAFB" opacity="0.8"></path>
          </svg>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Informations de contact - Colonne de gauche */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-purple-200">
                Informations
              </h2>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4 group">
                  <div className="bg-purple-100 p-3 rounded-xl group-hover:bg-purple-200 transition-colors">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                    <a href="mailto:legrandmohamed67@gmail.com" className="text-gray-600 hover:text-purple-600 transition-colors">
                      legrandmohamed67@gmail.com
                    </a>
                  </div>
                </div>

                {/* Téléphone */}
                <div className="flex items-start gap-4 group">
                  <div className="bg-purple-100 p-3 rounded-xl group-hover:bg-purple-200 transition-colors">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Téléphone</h3>
                    <a href="tel:+237677246900" className="text-gray-600 hover:text-purple-600 transition-colors">
                      +237 677 246 900
                    </a>
                  </div>
                </div>

                {/* Adresse - Yaoundé */}
                <div className="flex items-start gap-4 group">
                  <div className="bg-purple-100 p-3 rounded-xl group-hover:bg-purple-200 transition-colors">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Localisation</h3>
                    <p className="text-gray-600">Yaoundé, Cameroun</p>
                    <p className="text-sm text-gray-500 mt-1">Quartier Mvog-Mbi, Rue 1234</p>
                  </div>
                </div>

                {/* Horaires */}
                <div className="flex items-start gap-4 group">
                  <div className="bg-purple-100 p-3 rounded-xl group-hover:bg-purple-200 transition-colors">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Horaires</h3>
                    <p className="text-gray-600">Lun - Ven: 9h - 18h</p>
                    <p className="text-gray-600">Sam: 10h - 14h</p>
                    <p className="text-gray-600">Dim: Fermé</p>
                  </div>
                </div>
              </div>

              {/* Réseaux sociaux avec images personnalisées */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4">Suivez-nous</h3>
                <div className="flex gap-4">
                  <SocialIcon 
                    iconKey="facebook" 
                    href="https://facebook.com/mynkap" 
                    label="Facebook" 
                  />
                  <SocialIcon 
                    iconKey="linkedin" 
                    href="https://linkedin.com/company/mynkap" 
                    label="LinkedIn" 
                  />
                  <SocialIcon 
                    iconKey="whatsapp" 
                    href="https://wa.me/237677246900" 
                    label="WhatsApp" 
                  />
                  <SocialIcon 
                    iconKey="github" 
                    href="https://github.com/mynkap" 
                    label="GitHub" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de contact - Colonne de droite */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Envoyez-nous un message
              </h2>
              <p className="text-gray-600 mb-6">
                Nous vous répondrons dans les plus brefs délais
              </p>

              {/* Message de succès */}
              {submitStatus === 'success' && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-green-800 font-medium">
                      Message envoyé avec succès ! Nous vous répondrons rapidement.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Nom */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      placeholder="Jean Dupont"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                      placeholder="jean@exemple.com"
                    />
                  </div>
                </div>

                {/* Sujet */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Sujet *
                  </label>
                  <input
                    type="text"
                    name="sujet"
                    value={formData.sujet}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    placeholder="Question sur l'application"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
                    placeholder="Décrivez votre demande..."
                  ></textarea>
                </div>

                {/* Bouton d'envoi */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Envoyer le message
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  En soumettant ce formulaire, vous acceptez que nous traitions vos données 
                  conformément à notre politique de confidentialité.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton retour */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <Link 
          to="/" 
          className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold group"
        >
          <svg className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default Contact;