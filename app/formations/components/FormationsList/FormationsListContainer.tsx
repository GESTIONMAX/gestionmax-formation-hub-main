import { Tabs, TabsContent } from "../../../components/ui/tabs";
import { Button } from "../../../components/ui/button";
import { Plus, Upload } from "lucide-react";
import FormationCard from "./components/FormationCard";
import FormationGrid from "./components/FormationGrid";
import TabNavigation from "./components/TabNavigation";
import useFormationsView from "./hooks/useFormationsView";
import FormationDetail from "../FormationDetail";
import ProgrammeForm from "../ProgrammeForm";
import FormationImport from "../FormationImport";
import MentionsLegales from "../MentionsLegales";
import { CategorieFormation } from "@/types/categorie";

/**
 * Composant principal pour la gestion des programmes de formation
 * Utilise le pattern Container/Presenter avec useFormationsView pour la logique
 */
const FormationsListContainer = () => {
  // Récupération de toute la logique et l'état depuis le hook personnalisé
  const {
    view,
    activeTab,
    editingFormation,
    selectedFormation,
    programmes,
    programmesFiltered,
    categories,
    isLoading,
    totalCount,
    catalogueCount,
    surMesureCount,
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
  } = useFormationsView();

  // Rendu conditionnel basé sur la vue actuelle
  if (view === "form") {
    return (
      <ProgrammeForm
        onSubmit={handleSubmit}
        onCancel={handleBackToList}
        programme={editingFormation}
        categories={categories as CategorieFormation[]}
      />
    );
  } 
  
  if (view === "detail" && selectedFormation) {
    return (
      <FormationDetail
        formation={selectedFormation}
        onBack={handleBackToList}
        onGeneratePDF={() => handleGeneratePDF(selectedFormation)}
      />
    );
  } 
  
  if (view === "import") {
    return <FormationImport onSuccess={handleImportSuccess} onBack={handleBackToList} />;
  }

  // Vue liste par défaut
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold">Bibliothèque unifiée de programmes</h1>
        <div className="flex gap-2">
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Nouveau programme
          </Button>
          <Button 
            variant="outline" 
            onClick={handleShowImport}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" /> Importer
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} className="w-full">
        <TabNavigation 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          totalCount={totalCount}
          catalogueCount={catalogueCount}
          surMesureCount={surMesureCount}
        />
        
        <TabsContent value="tous">
          <FormationGrid 
            isLoading={isLoading}
            programmes={programmes}
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onGeneratePDF={handleGeneratePDF}
            onToggleActive={handleToggleActive}
            onDuplicate={handleDuplicate}
            onCreate={handleCreate}
          />
        </TabsContent>
        
        <TabsContent value="catalogue">
          <FormationGrid 
            isLoading={isLoading}
            programmes={programmesFiltered.catalogue}
            type="catalogue"
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onGeneratePDF={handleGeneratePDF}
            onToggleActive={handleToggleActive}
            onDuplicate={handleDuplicate}
            onCreate={handleCreate}
          />
        </TabsContent>
        
        <TabsContent value="sur-mesure">
          <FormationGrid 
            isLoading={isLoading}
            programmes={programmesFiltered.surMesure}
            type="sur-mesure"
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onGeneratePDF={handleGeneratePDF}
            onToggleActive={handleToggleActive}
            onDuplicate={handleDuplicate}
            onCreate={handleCreate}
          />
        </TabsContent>
        
        <TabsContent value="mentions">
          <MentionsLegales />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormationsListContainer;
