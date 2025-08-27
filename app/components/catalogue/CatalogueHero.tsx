
const CatalogueHero = () => {
  return (
    <section className="relative bg-blue-600">
      <div className="absolute inset-0 z-0">
        <img 
          src="/formation-wordpress-antibes.webp" 
          alt="Formation WordPress Antibes" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-blue-700/70"></div>
      </div>
      <div className="relative z-10 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Formations WordPress Professionnelles
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            Développez vos compétences WordPress avec un formateur certifié. Formations 
            éligibles CPF et conformes Qualiopi.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <a href="#formations" className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium py-3 px-6 rounded-md transition-colors">
              Voir le catalogue
            </a>
            <a href="/contact" className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-md transition-colors">
              Demander un devis
            </a>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-cyan-500/90 text-white px-5 py-2 rounded-full text-sm font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Certifié Qualiopi
            </span>
            <span className="bg-cyan-500/90 text-white px-5 py-2 rounded-full text-sm font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Éligible CPF
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CatalogueHero;
