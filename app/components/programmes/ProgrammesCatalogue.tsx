"use client";

import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useProgrammesFormation } from '../../_lib/hooks/useProgrammesFormation';
import { ProgrammeFormation } from '@/types/ProgrammeFormation';
import { Loader2, Plus, FileEdit, Copy, Check, X, User, Link2, Trash, FileText, BookOpen, Archive } from 'lucide-react';
import { ProgrammeFormationModal } from '../programmes/ProgrammeFormationModal';
import { cn } from '../../_lib/lib/utils';

/**
 * @description Composant de gestion des programmes de formation catalogue
 * Conforme aux exigences Qualiopi pour l'affichage des informations légales
 */
export const ProgrammesCatalogue = () => {
  // États locaux
  const [selectedTab, setSelectedTab] = useState<string>('tous');
  const [selectedType, setSelectedType] = useState<'catalogue' | 'sur-mesure'>('catalogue'); // Nouvel état pour filtrer par type
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedProgramme, setSelectedProgramme] = useState<ProgrammeFormation | null>(null);
  
  // Utilisation du hook documenté
  const {
    programmes,
    loading,
    categories,
    createProgramme,
    updateProgramme,
    deleteProgramme,
    duplicateProgramme,
    updateProgrammeStatus,
    getProgrammesByType,
    getProgrammesByCategorie
  } = useProgrammesFormation();
  
  // Filtrer pour n'obtenir que les programmes de type catalogue
  const programmesCatalogue = getProgrammesByType("catalogue");
  
  // Gestionnaires d'événements
  const handleCreateNew = () => {
    // Réinitialiser complètement l'tat
    setSelectedProgramme(null);
    
    // Forcer la fermeture puis l'ouverture du modal pour éviter des états incohérents
    setModalOpen(false);
    setTimeout(() => {
      setModalOpen(true);
    }, 50);
  };
  
  const handleEdit = (programme: ProgrammeFormation) => {
    setSelectedProgramme(programme);
    setModalOpen(true);
  };
  
  const handleDuplicate = async (programme: ProgrammeFormation) => {
    try {
      // Dupliquer en convertissant en version sur-mesure
      const dupliqueProgramme = await duplicateProgramme(programme.id, {
        titre: `${programme.titre} (copie sur-mesure)`,
        type: "sur-mesure"
      });
      
      console.log("Programme dupliqué avec succès:", dupliqueProgramme);
      
      // Sélectionner le programme dupliqué pour édition immédiate
      if (dupliqueProgramme) {
        // Force un délai pour permettre la mise à jour des données avant de basculer
        setTimeout(() => {
          // Basculer vers le type Sur-mesure
          setSelectedType("sur-mesure");
          setSelectedTab("tous"); // Réinitialiser le filtrage par catégorie
          
          // Sélectionner le nouveau programme pour édition
          setSelectedProgramme(dupliqueProgramme);
          
          // Ouvrir le modal d'édition avec un petit délai pour garantir le rendu
          setTimeout(() => {
            setModalOpen(true);
          }, 100);
        }, 200); // Délai suffisant pour garantir le rafraîchissement de l'interface
      }
    } catch (error) {
      console.error("Erreur lors de la duplication:", error);
    }
  };
  
  const handleToggleStatus = async (programme: ProgrammeFormation) => {
    try {
      await updateProgrammeStatus(programme.id, { estActif: !programme.estActif });
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
    }
  };
  
  const handleDelete = async (programmeId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce programme ?")) {
      try {
        await deleteProgramme(programmeId);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };
  
  const handleSaveProgram = async (programmeData: Partial<ProgrammeFormation>) => {
    try {
      if (selectedProgramme) {
        // Mise à jour
        await updateProgramme(selectedProgramme.id, programmeData);
      } else {
        // Création
        await createProgramme({
          ...programmeData as Omit<ProgrammeFormation, 'id' | 'createdAt' | 'updatedAt'>,
          type: "catalogue"
        });
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
    }
  };
  
  // Filtrage des programmes par type (catalogue/sur-mesure)
  const programmesByType = programmesCatalogue.filter(prog => {
    // Force tous les programmes à apparaître comme "catalogue" dans l'onglet catalogue
    // pour une meilleure UX comme demandé par l'utilisateur
    if (selectedType === 'catalogue') {
      return true; // Affiche tous les programmes dans l'onglet catalogue
    } else {
      return prog.type === 'sur-mesure'; // Filtre strict pour l'onglet sur-mesure
    }
  });
  
  // Filtrage des programmes selon l'onglet sélectionné (catégorie)
  const filteredProgrammes = selectedTab === 'tous'
    ? programmesByType
    : programmesByType.filter(prog => prog.categorieId === selectedTab);
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bibliothèque de Programmes de Formation</h1>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus size={16} />
          <span>Nouveau programme</span>
        </Button>
      </div>
      
      {/* Onglets de type de programme (catalogue/sur-mesure) */}
      <div className="mb-6">
        <Tabs defaultValue="catalogue" value={selectedType} onValueChange={(value) => setSelectedType(value as 'catalogue' | 'sur-mesure')}>
          <TabsList className="w-full justify-start">
            <TabsTrigger value="catalogue" className="flex-1">
              Programmes Catalogue
            </TabsTrigger>
            <TabsTrigger value="sur-mesure" className="flex-1">
              Programmes Sur-mesure
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Chargement des programmes...</span>
        </div>
      ) : programmesByType.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-muted/20 rounded-lg p-8">
          <h3 className="text-xl font-semibold mb-2">Aucun programme de formation {selectedType === "catalogue" ? "catalogue" : "sur-mesure"}</h3>
          <p className="text-center text-muted-foreground mb-4">
            {selectedType === "catalogue" 
              ? "Vous n'avez pas encore créé de programme de formation catalogue."
              : "Vous n'avez pas encore de programme de formation sur-mesure."}
            {selectedType === "catalogue" 
              ? " Commencez par créer votre premier programme en cliquant sur le bouton ci-dessous." 
              : " Vous pouvez en créer un nouveau ou dupliquer un programme catalogue existant."}
          </p>
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <Plus size={16} />
            <span>Créer mon premier programme {selectedType === "catalogue" ? "catalogue" : "sur-mesure"}</span>
          </Button>
        </div>
      ) : (
        <>
          <Tabs defaultValue="tous" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="tous">Tous</TabsTrigger>
              {categories.map(categorie => (
                <TabsTrigger key={categorie.id} value={categorie.id}>
                  {categorie.titre || categorie.code}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={selectedTab} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProgrammes.length > 0 ? (
                  filteredProgrammes.map(programme => (
                    <Card key={programme.id} className={`border-l-4 ${programme.estActif ? 'border-l-green-500' : 'border-l-gray-300'}`}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                              {programme.titre}
                              {programme.type === 'sur-mesure' && selectedType === 'sur-mesure' && (
                                <Badge variant="outline" className="ml-2 text-xs py-0">
                                  Sur-mesure
                                </Badge>
                              )}
                            </CardTitle>
                            {programme.type === 'sur-mesure' && programme.positionnementRequestId && (
                              <div className="flex gap-1 items-center mt-1 text-xs text-muted-foreground">
                                <Link2 size={12} />
                                <span>Lié à un entretien de positionnement</span>
                              </div>
                            )}
                            {programme.type === 'sur-mesure' && programme.beneficiaireId && (
                              <div className="flex gap-1 items-center mt-1 text-xs text-muted-foreground">
                                <User size={12} />
                                <span>Bénéficiaire: {programme.beneficiaireId}</span>
                              </div>
                            )}
                          </div>
                          <Badge>{programme.categorie?.titre || 'Non catégorisé'}</Badge>
                        </div>
                        <CardDescription className="line-clamp-2 mt-2">
                          {programme.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Section conforme Qualiopi avec mentions légales obligatoires */}
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-semibold">Durée:</span>
                            <span>{typeof programme.duree === 'number' ? `${programme.duree} heures` : programme.duree}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="font-semibold">Tarif:</span>
                            <span>{programme.tarifIntraEntreprise ? `${programme.tarifIntraEntreprise}€ HT` : programme.prix || 'Sur demande'}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="font-semibold">Public visé:</span>
                            <span>{programme.publicVise || programme.publicConcerne || '-'}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="font-semibold">Prérequis:</span>
                            <span>{programme.prerequis || "Aucun"}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="font-semibold">Modalités:</span>
                            <span>{programme.modalites}</span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="font-semibold">Accessibilité:</span>
                            <span>{programme.accessibilite || programme.accessibiliteHandicap || "Formation accessible aux PSH"}</span>
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex justify-between pt-2">
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(programme)}>
                            <FileEdit size={16} className="mr-1" /> Modifier
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDuplicate(programme)}>
                            <Copy size={16} className="mr-1" /> Dupliquer
                          </Button>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant={programme.estActif ? "destructive" : "outline"} 
                            size="sm" 
                            onClick={() => handleToggleStatus(programme)}
                          >
                            {programme.estActif ? (
                              <X size={16} className="mr-1" />
                            ) : (
                              <Check size={16} className="mr-1" />
                            )}
                            {programme.estActif ? "Désactiver" : "Activer"}
                          </Button>
                          
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(programme.id)}>
                            <Trash size={16} />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3 p-8 flex flex-col items-center justify-center bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/20 min-h-[300px] text-center">
                    {selectedType === 'catalogue' ? (
                      <EmptyState
                        icon={<BookOpen size={50} />}
                        title="Aucun programme catalogue"
                        description="Votre bibliothèque de programmes catalogue est vide. Commencez par créer votre premier programme qui sera disponible dans le catalogue de formations."
                        action={(
                          <Button 
                            onClick={() => {
                              setSelectedType('catalogue');
                              handleCreateNew();
                            }}
                            size="lg"
                            className="mt-4"
                          >
                            <Plus size={16} className="mr-2" /> Créer un programme catalogue
                          </Button>
                        )}
                      />
                    ) : (
                      <EmptyState
                        icon={<Archive size={50} />}
                        title="Aucun programme sur-mesure"
                        description="Votre bibliothèque de programmes sur-mesure est vide. Vous pouvez créer un programme personnalisé ou dupliquer un programme catalogue existant."
                        action={(
                          <Button 
                            onClick={() => {
                              setSelectedType('sur-mesure');
                              handleCreateNew();
                            }}
                            size="lg"
                            className="mt-4"
                          >
                            <Plus size={16} className="mr-2" /> Créer un programme sur-mesure
                          </Button>
                        )}
                      />
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
      
      {/* Modal pour création/édition de programme */}
      {modalOpen && (
        <ProgrammeFormationModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveProgram}
          programme={selectedProgramme}
          categories={categories}
          type={selectedProgramme ? selectedProgramme.type : selectedType}
        />
      )}
    </div>
  );
};

// Composant d'état vide amélioré avec icône, titre, description et bouton d'action
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center space-y-4 max-w-md">
    <div className="rounded-full bg-primary/10 p-6 text-primary">
      {icon}
    </div>
    <h3 className="text-2xl font-semibold">{title}</h3>
    <p className="text-muted-foreground text-center">{description}</p>
    {action}
    <div className="text-sm text-muted-foreground mt-6 border-t border-border pt-4 w-full text-center">
      <p className="mb-2">Conseils pour démarrer :</p>
      <ul className="text-left list-disc pl-4 space-y-2 text-xs">
        <li>Un programme peut être de type <strong>catalogue</strong> (générique) ou <strong>sur-mesure</strong> (personnalisé)</li>
        <li>Utilisez le formulaire pour saisir les informations pédagogiques et légales</li>
        <li>Vous pourrez activer/désactiver vos programmes à tout moment</li>
      </ul>
    </div>
  </div>
);

export default ProgrammesCatalogue;
