import { useState, useEffect, useCallback } from "react";
import { useProgrammesFormation } from "../../../../_lib/hooks/useProgrammesFormation";
import { useToast } from "../../../../_lib/hooks/use-toast";
import { ProgrammeFormation } from "@/types/ProgrammeFormation";
import { generateFormationPDF } from "@/utils/pdfGenerator";
import { programmeFormationToPdfFormation } from "@/utils/typeAdapters";

type ViewMode = "list" | "form" | "detail" | "import";
type FilteredProgrammes = {
  catalogue: ProgrammeFormation[];
  surMesure: ProgrammeFormation[];
};

/**
 * Hook personnalisé pour gérer l'état et les actions sur la vue des formations
 */
export const useFormationsView = () => {
  // État local
  const [view, setView] = useState<ViewMode>("list");
  const [activeTab, setActiveTab] = useState("tous");
  const [editingFormation, setEditingFormation] = useState<ProgrammeFormation | null>(null);
  const [selectedFormation, setSelectedFormation] = useState<ProgrammeFormation | null>(null);
  const [programmesFiltered, setProgrammesFiltered] = useState<FilteredProgrammes>({ catalogue: [], surMesure: [] });
  
  // Hooks externes
  const { 
    programmes, 
    categories, 
    loading: isLoading, 
    createProgramme, 
    updateProgramme, 
    deleteProgramme,
    toggleProgrammeActive,
    duplicateProgramme
  } = useProgrammesFormation();
  const { toast } = useToast();
  
  // Filtrer les programmes par type
  useEffect(() => {
    if (programmes) {
      setProgrammesFiltered({
        catalogue: programmes.filter(p => p.type === "catalogue"),
        surMesure: programmes.filter(p => p.type === "sur-mesure")
      });
    }
  }, [programmes]);
  
  // Handlers
  const handleCreate = useCallback(() => {
    setEditingFormation(null);
    setView("form");
    toast({
      title: "Création de programme",
      description: "Veuillez remplir le formulaire pour créer un nouveau programme."
    });
  }, [toast]);

  // Version corrigée pour éviter la boucle infinie
  const handleEdit = useCallback((formation: ProgrammeFormation) => {
    console.log('=== FONCTION HANDLEEDIT APPELÉE ===');
    console.log('handleEdit appelé avec formation:', formation);

    // Approche sécurisée pour éviter la boucle infinie
    // 1. Définir d'abord la vue pour qu'elle soit prête
    setView("form");
    
    // 2. Ensuite définir l'objet de formation avec un léger délai
    // pour s'assurer que le changement de vue a eu lieu d'abord
    setTimeout(() => {
      setEditingFormation(formation);
      console.log('Formation définie pour édition:', formation.titre || formation.code);
    }, 0);
    
    console.log('handleEdit terminé, view changée à "form"');
  }, [setEditingFormation, setView]);

  const handleDelete = useCallback(async (id: string) => {
    console.log('handleDelete appelé avec id:', id);
    try {
      await deleteProgramme(id);
      toast({
        title: "Programme supprimé",
        description: "Le programme a été supprimé avec succès.",
      });
    } catch (error) {
      console.error('Erreur dans deleteProgramme:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le programme.",
        variant: "destructive",
      });
    }
  }, [deleteProgramme, toast]);

  const handleSubmit = useCallback(async (formData: Omit<ProgrammeFormation, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingFormation) {
        const updateData: Partial<ProgrammeFormation> = {};
        Object.keys(formData).forEach(key => {
          if (formData[key as keyof typeof formData] !== undefined) {
            (updateData as any)[key] = formData[key as keyof typeof formData];
          }
        });
        await updateProgramme(editingFormation.id, updateData);
        toast({
          title: "Programme modifié",
          description: "Le programme a été modifié avec succès.",
        });
      } else {
        await createProgramme(formData);
        toast({
          title: "Programme créé",
          description: "Le programme a été créé avec succès.",
        });
      }
      setView("list");
      setEditingFormation(null);
    } catch (error) {
      console.error('Erreur dans handleSubmit:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le programme.",
        variant: "destructive",
      });
    }
  }, [createProgramme, editingFormation, toast, updateProgramme]);

  const handleViewDetail = useCallback((formation: ProgrammeFormation) => {
    setSelectedFormation(formation);
    setView("detail");
  }, []);

  const handleBackToList = useCallback(() => {
    setView("list");
    setSelectedFormation(null);
    setEditingFormation(null);
  }, []);

  const handleShowImport = useCallback(() => {
    setView("import");
  }, []);

  const handleImportSuccess = useCallback(() => {
    setView("list");
    toast({
      title: "Import réussi",
      description: "Les programmes ont été importés avec succès.",
    });
  }, [toast]);

  const handleToggleActive = useCallback(async (id: string, newState: boolean) => {
    try {
      await toggleProgrammeActive(id, newState);
      toast({
        title: newState ? "Programme activé" : "Programme désactivé",
        description: `Le programme a été ${newState ? "activé" : "désactivé"} avec succès.`,
      });
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      toast({
        title: "Erreur",
        description: "Impossible de changer le statut du programme.",
        variant: "destructive",
      });
    }
  }, [toggleProgrammeActive, toast]);

  const handleDuplicate = useCallback(async (id: string) => {
    try {
      await duplicateProgramme(id);
      toast({
        title: "Programme dupliqué",
        description: "Le programme a été dupliqué avec succès dans la bibliothèque sur-mesure.",
      });
    } catch (error) {
      console.error('Erreur lors de la duplication:', error);
      toast({
        title: "Erreur",
        description: "Impossible de dupliquer le programme.",
        variant: "destructive",
      });
    }
  }, [duplicateProgramme, toast]);

  const handleGeneratePDF = useCallback(async (programme: ProgrammeFormation) => {
    try {
      const pdfFormation = programmeFormationToPdfFormation(programme);
      await generateFormationPDF(pdfFormation);
      toast({
        title: "PDF généré",
        description: "Le PDF a été généré et téléchargé avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
  }, []);

  return {
    // État
    view,
    activeTab,
    editingFormation,
    selectedFormation,
    programmes,
    programmesFiltered,
    categories,
    isLoading,
    
    // Compteurs
    totalCount: programmes.length,
    catalogueCount: programmesFiltered.catalogue.length,
    surMesureCount: programmesFiltered.surMesure.length,
    
    // Handlers
    handleCreate,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleViewDetail,
    handleBackToList,
    handleShowImport,
    handleImportSuccess,
    handleToggleActive,
    handleDuplicate,
    handleGeneratePDF,
    handleTabChange
  };
};

export default useFormationsView;
