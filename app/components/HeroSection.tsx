import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Award, CheckCircle } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-blue-700">
      <div className="relative z-10 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Formations WordPress pour Professionnelles à Antibes
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 leading-relaxed">
            Développez vos compétences WordPress avec un formateur certifié. 
            Formations éligibles FAF et conformes Qualiopi.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Link href="/catalogue" passHref>
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Voir le catalogue
              </Button>
            </Link>
            <Link href="/contact" passHref>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-white/10 hover:bg-white/20 border-white text-white">
                Demander un entretien de positionnement
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="text-base px-5 py-2 bg-white/20 hover:bg-white/30">
              <Award className="h-5 w-5 mr-2" />
              Certifié Qualiopi
            </Badge>
            <Badge variant="secondary" className="text-base px-5 py-2 bg-white/20 hover:bg-white/30">
              <CheckCircle className="h-5 w-5 mr-2" />
              Éligible CPF
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
