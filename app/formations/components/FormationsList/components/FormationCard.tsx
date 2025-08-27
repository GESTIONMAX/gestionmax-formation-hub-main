import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Archive, BookOpen, Calendar, Clock, Download, Edit, Eye, FileText, GitBranch, Info, Trash2, Users } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { ProgrammeFormation } from "@/types/ProgrammeFormation";

interface FormationCardProps {
  programme: ProgrammeFormation;
  onViewDetail: (programme: ProgrammeFormation) => void;
  onEdit: (programme: ProgrammeFormation) => void;
  onDelete: (id: string) => void;
  onGeneratePDF?: (programme: ProgrammeFormation) => void;
  onToggleActive?: (id: string, newState: boolean) => void;
  onDuplicate?: (id: string) => void;
}

/**
 * Composant affichant une carte pour un programme de formation avec ses détails et actions
 */
const FormationCard = ({ 
  programme, 
  onViewDetail, 
  onEdit, 
  onDelete, 
  onGeneratePDF,
  onToggleActive,
  onDuplicate
}: FormationCardProps) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{programme.pictogramme}</span>
            <CardTitle className="text-lg">{programme.titre || programme.code || "Sans titre"}</CardTitle>
          </div>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {programme.duree}
            </Badge>
            <Badge variant={programme.type === "catalogue" ? "default" : "outline"} className="flex items-center gap-1">
              {programme.type === "catalogue" ? (
                <FileText className="h-3 w-3" />
              ) : (
                <Archive className="h-3 w-3" />
              )}
              {programme.type === "catalogue" ? "Catalogue" : "Sur-mesure"}
            </Badge>
            {programme.type === "sur-mesure" && programme.beneficiaireId && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {programme.beneficiaireId}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {programme.description || "Description non disponible"}
      </p>
      
      <div className="space-y-2 mb-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          <span>Public: {programme.publicConcerne || "Non défini"}</span>
        </div>
        <div className="flex items-center gap-1">
          <Info className="h-3 w-3" />
          <span>Prérequis: {programme.prerequis || "Aucun"}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>Code: {programme.code}</span>
        </div>
        {programme.categorieId && (
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            <span>Catégorie: {programme.categorie?.titre || programme.categorieId}</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onViewDetail(programme)}
          className="flex items-center gap-1"
        >
          <Eye className="h-3 w-3" /> Détails
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onEdit(programme)}
          className="flex items-center gap-1"
        >
          <Edit className="h-3 w-3" /> Modifier
        </Button>
        {onGeneratePDF && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onGeneratePDF(programme)}
            className="flex items-center gap-1"
          >
            <Download className="h-3 w-3" /> PDF
          </Button>
        )}
        {onDuplicate && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDuplicate(programme.id)}
            className="flex items-center gap-1"
          >
            <GitBranch className="h-3 w-3" /> Dupliquer
          </Button>
        )}
        {onToggleActive && (
          <Button 
            variant={programme.actif ? "destructive" : "default"}
            size="sm" 
            onClick={() => onToggleActive(programme.id, !programme.actif)}
            className="flex items-center gap-1"
          >
            {programme.actif ? "Désactiver" : "Activer"}
          </Button>
        )}
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => onDelete(programme.id)}
          className="flex items-center gap-1"
        >
          <Trash2 className="h-3 w-3" /> Supprimer
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default FormationCard;
