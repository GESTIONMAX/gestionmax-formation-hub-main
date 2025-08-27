"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import ProcessusPedagogique from "../components/ProcessusPedagogique";
import PositionnementForm from "../components/rendez-vous/PositionnementForm";
import CatalogueHeader from "../components/catalogue/CatalogueHeader";
import CatalogueHero from "../components/catalogue/CatalogueHero";
import FormationsList from "../components/catalogue/FormationsList";
import FormationsAdaptabilite from "../components/catalogue/FormationsAdaptabilite";
import CustomFormationCTA from "../components/catalogue/CustomFormationCTA";
import WordPressFAQ from "../components/wordpress/WordPressFAQ";
import { Formation, CategorieFormation } from "../components/catalogue/types";

import Footer from "../components/Footer";

export default function CataloguePage() {
  const [showPositionnementForm, setShowPositionnementForm] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<string>("");
  const [categoriesFormations, setCategoriesFormations] = useState<CategorieFormation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCatalogueFormations = async () => {
      try {
        setLoading(true);
        console.log("Démarrage du chargement catalogue...");
        
        // Utiliser l'API comme source unique de vérité
        const response = await axios.get('/api/programmes-formation/par-categorie');
        
        if (response.data && Array.isArray(response.data)) {
          // Les données sont déjà formatées correctement par l'API
          console.log('Catégories chargées depuis l\'API:', response.data.map((c: any) => c.titre));
          
          // Mise à jour de l'état directement avec les données de l'API
          setCategoriesFormations(response.data);
          setLoading(false);
          return;
        }
      } catch (err: any) {
        console.error("Erreur lors du chargement des données depuis l'API:", err);
        setError(err.message || "Une erreur est survenue lors du chargement du catalogue");
        setLoading(false);
      }
    };

    fetchCatalogueFormations();
  }, []);
  
  // Log simple pour confirmer que les données sont chargées
  console.log("Nombre de catégories chargées:", categoriesFormations.length);

  // Affichage des états de chargement et d'erreur
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <CatalogueHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Chargement...</span>
            </div>
            <h2 className="mt-4 text-xl font-semibold">Chargement du catalogue...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <CatalogueHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 bg-red-50 rounded-lg max-w-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold text-red-700 mb-2">Erreur de chargement</h2>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Utiliser directement les catégories sans filtrage (le filtrage est fait côté API)
  const categoriesToDisplay = categoriesFormations;

  const handlePositionnement = (formationTitre: string) => {
    console.log(`Ouverture du formulaire de positionnement pour: ${formationTitre}`);
    setSelectedFormation(formationTitre);
    setShowPositionnementForm(true);
  };

  const handlePositionnementSubmit = (data: any) => {
    console.log("Données du positionnement:", data);
    setShowPositionnementForm(false);
    setSelectedFormation("");
  };

  // Log simple avant rendu
  console.log("Nombre de catégories envoyées au composant FormationsList:", categoriesToDisplay.length);
  
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <CatalogueHeader />
        <CatalogueHero />
        <FormationsAdaptabilite />
        <ProcessusPedagogique />
        <FormationsList 
          categoriesFormations={categoriesToDisplay}
          onPositionnement={handlePositionnement} 
        />
        {/* FAQ WordPress intégrée juste après la liste des formations */}
        <WordPressFAQ />
        <CustomFormationCTA />
        <Footer />
      </div>

      <Dialog open={showPositionnementForm} onOpenChange={setShowPositionnementForm}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Rendez-vous de positionnement - {selectedFormation}</DialogTitle>
          </DialogHeader>
          <PositionnementForm
            formationTitre={selectedFormation}
            onSubmit={handlePositionnementSubmit}
            onCancel={() => {
              setShowPositionnementForm(false);
              setSelectedFormation("");
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
