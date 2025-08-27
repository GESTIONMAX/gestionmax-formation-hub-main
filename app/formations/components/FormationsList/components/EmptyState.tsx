import { Button } from "../../../../components/ui/button";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  type?: string;
  onCreate: () => void;
}

/**
 * Composant affiché lorsqu'aucun programme n'est disponible
 */
const EmptyState = ({ type, onCreate }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-10 px-4 border-2 border-dashed border-gray-200 rounded-lg">
    <h3 className="text-lg font-medium mb-2">
      {type === "catalogue" 
        ? "Aucun programme catalogue disponible" 
        : type === "sur-mesure" 
          ? "Aucun programme sur-mesure disponible" 
          : "Aucun programme disponible"}
    </h3>
    <p className="text-gray-500 text-center mb-6">
      {type === "catalogue" 
        ? "Commencez par créer votre premier programme catalogue standardisé" 
        : type === "sur-mesure" 
          ? "Dupliquez un programme catalogue ou créez un programme sur-mesure" 
          : "Commencez par créer votre premier programme de formation"}
    </p>
    <Button onClick={onCreate} className="flex items-center gap-2">
      <Plus className="h-4 w-4" /> Nouveau programme
    </Button>
  </div>
);

export default EmptyState;
