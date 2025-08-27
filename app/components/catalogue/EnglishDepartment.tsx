import React from "react";
import PartenaireFormations from "../PartenaireFormations";
import EnglishFAQ from "../english/EnglishFAQ";

const EnglishDepartment = () => {
  return (
    <div className="english-department">
      {/* Section d'introduction du département anglais */}
      <section className="py-8 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-indigo-900 mb-4">
              Partenariats internationaux
            </h3>
            <div className="flex justify-center mt-3 mb-6">
              <div className="h-1 w-24 bg-indigo-600 rounded"></div>
            </div>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-8">
              Développez vos compétences linguistiques pour vous démarquer dans un contexte professionnel international. 
              Nos formations d'anglais sont conçues spécifiquement pour répondre aux besoins des professionnels.
            </p>
            
            <div className="flex justify-center">
              <div className="p-4 bg-white rounded-lg shadow-md inline-flex items-center">
                <p className="font-semibold text-gray-700 mr-3">En partenariat avec</p>
                <div className="relative h-12 w-40">
                  <img
                    src="/partenaires/english4french.png"
                    alt="English4French Logo"
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Intégration du composant PartenaireFormations */}
      <PartenaireFormations />
      
      {/* Note: EnglishFAQ est déjà inclus dans PartenaireFormations */}
    </div>
  );
};

export default EnglishDepartment;
