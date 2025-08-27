import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Clock, Users, CheckCircle, FileDown, Eye, Calendar, Computer, Globe, ShoppingBag, Search, BarChart, Code, Lightbulb, Sparkles, BookOpen } from "lucide-react";
import { Formation } from "./types";
import FormationDetailsModal from "./FormationDetailsModal";

interface FormationCardProps {
  formation: Formation;
  onPositionnement: (titre: string) => void;
}

// Fonction pour déterminer l'icône à afficher en fonction de l'ID ou du titre de la formation
const getFormationIcon = (formation: Formation) => {
  const id = formation.id.toLowerCase();
  const titre = formation.titre.toLowerCase();
  
  if (id.includes('wp') || titre.includes('wordpress')) {
    return <Globe className="h-6 w-6 text-blue-600" />;
  } else if (id.includes('wc') || titre.includes('woocommerce') || titre.includes('e-commerce')) {
    return <ShoppingBag className="h-6 w-6 text-purple-600" />;
  } else if (id.includes('seo') || titre.includes('référencement')) {
    return <Search className="h-6 w-6 text-green-600" />;
  } else if (id.includes('marketing') || titre.includes('marketing')) {
    return <BarChart className="h-6 w-6 text-orange-600" />;
  } else if (id.includes('dev') || titre.includes('développement')) {
    return <Code className="h-6 w-6 text-gray-700" />;
  } else if (titre.includes('stratégie') || titre.includes('inbound')) {
    return <Lightbulb className="h-6 w-6 text-yellow-600" />;
  } else if (titre.includes('avancé')) {
    return <Sparkles className="h-6 w-6 text-purple-500" />;
  }
  
  // Icône par défaut
  return <BookOpen className="h-6 w-6 text-blue-500" />;
};

const FormationCard = ({ formation, onPositionnement }: FormationCardProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  
  // Extraire la durée en heures et jours
  const dureeMatch = formation.duree?.match(/\d+/);
  const heures = dureeMatch ? dureeMatch[0] : "14";
  const jours = Math.ceil(parseInt(heures) / 7);
  
  return (
    <>
      <FormationDetailsModal 
        formation={formation}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      />
      
      <Card className="hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden h-full border rounded-md">
        {/* En-tête avec texture dynamique */}
        <div className="relative overflow-hidden">
          {/* Texture de fond dynamique */}
          <div 
            className="absolute inset-0 opacity-10" 
            style={{
              backgroundImage: `linear-gradient(30deg, #4f46e5 12%, transparent 12.5%, transparent 87%, #4f46e5 87.5%, #4f46e5),
                               linear-gradient(150deg, #4f46e5 12%, transparent 12.5%, transparent 87%, #4f46e5 87.5%, #4f46e5),
                               linear-gradient(30deg, #4f46e5 12%, transparent 12.5%, transparent 87%, #4f46e5 87.5%, #4f46e5),
                               linear-gradient(150deg, #4f46e5 12%, transparent 12.5%, transparent 87%, #4f46e5 87.5%, #4f46e5),
                               linear-gradient(60deg, #4f46e577 25%, transparent 25.5%, transparent 75%, #4f46e577 75%, #4f46e577)`,
              backgroundSize: '10px 18px',
              backgroundPosition: '0 0, 0 0, 5px 9px, 5px 9px, 0 0'
            }}
          />
          {/* Contenu de l'en-tête */}
          <div className="flex items-center p-4 relative z-10">
            <div className="mr-3 bg-white p-2 rounded-md shadow-sm">
              <Computer className="h-6 w-6 text-blue-700" />
            </div>
            
            <div className="flex-1">
              <p className="text-xs font-medium text-blue-600 mb-0.5">Réf: {formation.id}</p>
              <h3 className="font-semibold text-gray-900 line-clamp-2">{formation.titre}</h3>
            </div>
          </div>
        </div>
        
        <CardContent className="p-4 pt-3 flex flex-col gap-2">
          <div className="flex flex-col gap-1.5 mb-2">
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Clock className="h-4 w-4 mr-2" />
              <span>{heures} heures ({jours} jour{jours > 1 ? 's' : ''})</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              <span>{formation.participants || 'Tout public'}</span>
            </div>

            <div className="flex items-center text-sm font-medium text-blue-600">
              <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
              <span>Formation présentielle individuelle</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 text-gray-600 mb-4">
            
            <div className="flex items-start">
              <CheckCircle className="h-4 w-4 mr-2 mt-0.5" />
              <p className="flex-1"><span className="font-medium">Prérequis:</span> {formation.prerequis || "Maîtriser son environnement et les fonctions de base pour utiliser un ordinateur"}</p>
            </div>
            
            <div className="flex items-start">
              <Computer className="h-4 w-4 mr-2 mt-0.5" />
              <p className="flex-1"><span className="font-medium">Catégorie:</span> Maîtriser les Bases du Digital</p>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 mt-auto pt-3">
            {/* Version 1: Avec icônes */}
            <div className="flex flex-col gap-2">
              {/* Bouton Consulter supprimé à la demande de l'utilisateur */}
              
              <button 
                onClick={() => setModalOpen(true)}
                className="flex items-center justify-center py-2 px-4 bg-[#1869ba] text-white rounded hover:bg-[#145a9e] transition-colors w-full"
              >
                <FileDown className="h-4 w-4 mr-2" /> Consulter
              </button>
              
              <button 
                onClick={() => onPositionnement(formation.titre)}
                className="flex items-center justify-center py-2 px-4 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors w-full"
              >
                <Calendar className="h-4 w-4 mr-2" /> Réserver un entretien de positionnement
              </button>
            </div>
            
            {/* Version 2: Sans icônes (commentée pour le moment) 
            <div className="flex flex-col gap-2">
              <!-- Bouton Consulter supprimé à la demande de l'utilisateur -->
              
              <button 
                onClick={() => setModalOpen(true)}
                className="py-2 px-4 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors w-full"
              >
                Consulter
              </button>
              
              <button 
                onClick={() => onPositionnement(formation.titre)}
                className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition-colors w-full"
              >
                Réserver un entretien de positionnement
              </button>
            </div>
            */}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default FormationCard;
