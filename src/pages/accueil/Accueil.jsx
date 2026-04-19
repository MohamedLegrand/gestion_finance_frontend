import Heros from "../../components/accueil/Heros";
import Fonctionnalites from "../../components/accueil/Fonctionnalites";
import Tarif from "../../components/accueil/Tarif";
import Apropos from "../../components/accueil/Apropos";

const Accueil = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Heros />
      <Fonctionnalites />
      <Tarif />
      <Apropos />
    </div>
  );
};

export default Accueil;