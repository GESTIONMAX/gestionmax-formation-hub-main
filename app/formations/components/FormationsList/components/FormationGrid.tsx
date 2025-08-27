import { ProgrammeFormation } from "@/types/ProgrammeFormation";
import FormationCard from "./FormationCard";
import EmptyState from "./EmptyState";

interface FormationGridProps {
  isLoading: boolean;
  programmes: ProgrammeFormation[];
  type?: string;
  onViewDetail: (programme: ProgrammeFormation) => void;
  onEdit: (programme: ProgrammeFormation) => void;
  onDelete: (id: string) => void;
  onGeneratePDF: (programme: ProgrammeFormation) => void;
  onToggleActive: (id: string, newState: boolean) => void;
  onDuplicate: (id: string) => void;
  onCreate: () => void;
}

/**
 * Affiche une grille de programmes de formation ou un état vide si aucun programme n'est disponible
 */
const FormationGrid = ({
  isLoading,
  programmes,
  type,
  onViewDetail,
  onEdit,
  onDelete,
  onGeneratePDF,
  onToggleActive,
  onDuplicate,
  onCreate
}: FormationGridProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (programmes.length === 0) {
    return <EmptyState type={type} onCreate={onCreate} />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {programmes.map((programme) => (
        <FormationCard
          key={programme.id}
          programme={programme}
          onViewDetail={onViewDetail}
          onEdit={onEdit}
          onDelete={onDelete}
          onGeneratePDF={onGeneratePDF}
          onToggleActive={onToggleActive}
          onDuplicate={onDuplicate}
        />
      ))}
    </div>
  );
};

export default FormationGrid;
