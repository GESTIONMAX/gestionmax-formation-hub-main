"use client";

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ProgrammeFormation } from '@/app/types/programme';
import { useEntretiensPositionnement } from '../../_lib/hooks/useEntretiensPositionnement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface ProgrammeFormationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (programme: Partial<ProgrammeFormation>) => Promise<void>;
  programme: ProgrammeFormation | null;
  categories: ProgrammeFormation['categorie'][];
  type: 'catalogue' | 'sur-mesure';
}

/**
 * @description Modal de création/édition d'un programme de formation
 * Conforme aux exigences Qualiopi pour la collecte des informations légales obligatoires
 */
export const ProgrammeFormationModal = ({
  isOpen,
  onClose,
  onSave,
  programme,
  categories,
  type
}: ProgrammeFormationModalProps) => {
  // État initial du formulaire
  const initialFormState: Partial<ProgrammeFormation> = {
    titre: '',
    description: '',
    code: '',
    duree: 0,
    objectifsPedagogiques: '',
    publicVise: '',
    prerequis: '',
    modalites: 'Présentiel',
    tarifIntraEntreprise: 0,
    tarifInterEntreprise: 0,
    categorieId: '',
    programmeDetaille: '',
    estActif: true,
    accessibilite: 'Formation accessible aux personnes en situation de handicap',
    type: type,
  };
  
  // État du formulaire
  const [formData, setFormData] = useState<Partial<ProgrammeFormation>>(initialFormState);
  const [saving, setSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("informations");
  
  // Utilisation du hook pour les entretiens de positionnement
  const { entretiens, loading: loadingEntretiens, getEntretienById } = useEntretiensPositionnement();
  
  // Initialiser le formulaire avec les données du programme si en mode édition
  useEffect(() => {
    if (programme) {
      setFormData({ ...programme });
    } else {
      setFormData({ ...initialFormState, type });
    }
  }, [programme, type]);
  
  // Gestionnaire de changement de champs
  const handleChange = (field: keyof ProgrammeFormation, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      await onSave(formData);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {programme ? 'Modifier un programme de formation' : 'Créer un nouveau programme de formation'}
            </DialogTitle>
            <DialogDescription>
              {programme 
                ? 'Modifiez les informations du programme de formation.' 
                : `Créez un nouveau programme de formation de type ${type === 'catalogue' ? 'catalogue' : 'sur-mesure'}.`}
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="mb-4">
              <TabsTrigger value="informations">Informations générales</TabsTrigger>
              <TabsTrigger value="details">Détails pédagogiques</TabsTrigger>
              <TabsTrigger value="mentions">Mentions légales</TabsTrigger>
              {formData.type === 'sur-mesure' && (
                <TabsTrigger value="specifiques">Spécificités sur-mesure</TabsTrigger>
              )}
            </TabsList>
            
            {/* Onglet Informations générales */}
            <TabsContent value="informations" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titre">Titre du programme *</Label>
                  <Input
                    id="titre"
                    value={formData.titre || ''}
                    onChange={(e) => handleChange('titre', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="code">Code formation *</Label>
                  <Input
                    id="code"
                    value={formData.code || ''}
                    onChange={(e) => handleChange('code', e.target.value)}
                    placeholder="ex: DEV-WEB-01"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="categorie">Catégorie *</Label>
                    <Select
                      value={formData.categorieId || ''}
                      onValueChange={(value) => handleChange('categorieId', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Type de programme *</Label>
                    <Select
                      value={formData.type || 'catalogue'}
                      onValueChange={(value) => handleChange('type', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="catalogue">Catalogue</SelectItem>
                        <SelectItem value="sur-mesure">Sur-mesure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Onglet Détails pédagogiques */}
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="objectifs">Objectifs pédagogiques *</Label>
                  <Textarea
                    id="objectifs"
                    value={formData.objectifsPedagogiques || ''}
                    onChange={(e) => handleChange('objectifsPedagogiques', e.target.value)}
                    rows={3}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="programmeDetaille">Programme détaillé *</Label>
                  <Textarea
                    id="programmeDetaille"
                    value={formData.programmeDetaille || ''}
                    onChange={(e) => handleChange('programmeDetaille', e.target.value)}
                    rows={5}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="publicVise">Public visé *</Label>
                  <Input
                    id="publicVise"
                    value={formData.publicVise || ''}
                    onChange={(e) => handleChange('publicVise', e.target.value)}
                    placeholder="ex: Développeurs web, Chefs de projet"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="prerequis">Prérequis</Label>
                  <Input
                    id="prerequis"
                    value={formData.prerequis || ''}
                    onChange={(e) => handleChange('prerequis', e.target.value)}
                    placeholder="ex: Connaissances de base en programmation"
                  />
                </div>
              </div>
            </TabsContent>
            
            {/* Onglet Mentions légales (exigences Qualiopi) */}
            <TabsContent value="mentions" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duree">Durée (heures) *</Label>
                  <Input
                    id="duree"
                    type="number"
                    value={formData.duree || 0}
                    onChange={(e) => handleChange('duree', parseInt(e.target.value))}
                    min={0}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="modalites">Modalités *</Label>
                  <Select
                    value={formData.modalites || 'Présentiel'}
                    onValueChange={(value) => handleChange('modalites', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Présentiel">Présentiel</SelectItem>
                      <SelectItem value="Distanciel">Distanciel</SelectItem>
                      <SelectItem value="Mixte">Mixte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tarifIntra">Tarif intra-entreprise (€ HT) *</Label>
                  <Input
                    id="tarifIntra"
                    type="number"
                    value={formData.tarifIntraEntreprise || 0}
                    onChange={(e) => handleChange('tarifIntraEntreprise', parseInt(e.target.value))}
                    min={0}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tarifInter">Tarif inter-entreprise (€ HT)</Label>
                  <Input
                    id="tarifInter"
                    type="number"
                    value={formData.tarifInterEntreprise || 0}
                    onChange={(e) => handleChange('tarifInterEntreprise', parseInt(e.target.value))}
                    min={0}
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="accessibilite">Accessibilité *</Label>
                  <Textarea
                    id="accessibilite"
                    value={formData.accessibilite || 'Formation accessible aux personnes en situation de handicap'}
                    onChange={(e) => handleChange('accessibilite', e.target.value)}
                    rows={2}
                    required
                  />
                </div>
              </div>
            </TabsContent>

            {/* Onglet Spécificités sur-mesure */}
            {formData.type === 'sur-mesure' && (
              <TabsContent value="specifiques" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="positionnementRequestId" className="flex items-center gap-2">
                      Entretien de positionnement
                      <span className="text-xs text-muted-foreground">(sélectionnez un entretien pour lier automatiquement l'apprenant)</span>
                    </Label>
                    <Select
                      value={formData.positionnementRequestId || ''}
                      onValueChange={(value) => {
                        handleChange('positionnementRequestId', value);
                        // Auto-compléter l'ID du bénéficiaire et les objectifs spécifiques
                        if (value) {
                          const entretien = getEntretienById(value);
                          if (entretien) {
                            // Remplir l'ID du bénéficiaire automatiquement
                            handleChange('beneficiaireId', entretien.beneficiaireId);
                            
                            // Proposer les objectifs identifiés lors de l'entretien comme objectifs spécifiques
                            if (entretien.objectifsIdentifies?.length) {
                              const objectifsFormattés = entretien.objectifsIdentifies.join('\n');
                              if (!formData.objectifsSpecifiques) {
                                handleChange('objectifsSpecifiques', objectifsFormattés);
                              }
                            }
                          }
                        } else {
                          // Si aucun entretien n'est sélectionné, vider l'ID du bénéficiaire
                          handleChange('beneficiaireId', '');
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un entretien de positionnement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Aucun</SelectItem>
                        {loadingEntretiens ? (
                          <div className="flex items-center justify-center p-2 text-sm text-gray-500">
                            Chargement des entretiens...
                          </div>
                        ) : entretiens.length > 0 ? (
                          entretiens.map((entretien) => (
                            <SelectItem key={entretien.id} value={entretien.id}>
                              Entretien #{entretien.code} - {entretien.beneficiaire.prenom} {entretien.beneficiaire.nom} ({new Date(entretien.dateEntretien).toLocaleDateString()})
                            </SelectItem>
                          ))
                        ) : (
                          <div className="flex items-center justify-center p-2 text-sm text-gray-500">
                            Aucun entretien disponible
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="beneficiaireId">ID du bénéficiaire</Label>
                    <div className="flex gap-2">
                      <Input
                        id="beneficiaireId"
                        value={formData.beneficiaireId || ''}
                        onChange={(e) => handleChange('beneficiaireId', e.target.value)}
                        placeholder="ID du bénéficiaire (rempli automatiquement si un entretien est sélectionné)"
                        readOnly={!!formData.positionnementRequestId} // Lecture seule si un entretien est sélectionné
                      />
                      {formData.beneficiaireId && (
                        <Button 
                          type="button" 
                          variant="outline"
                          size="icon"
                          onClick={() => handleChange('beneficiaireId', '')}
                          disabled={!!formData.positionnementRequestId}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="objectifsSpecifiques">Objectifs spécifiques</Label>
                    <Textarea
                      id="objectifsSpecifiques"
                      value={formData.objectifsSpecifiques || ''}
                      onChange={(e) => handleChange('objectifsSpecifiques', e.target.value)}
                      rows={4}
                      placeholder="Objectifs spécifiques pour cet apprenant basés sur son entretien de positionnement"
                    />
                  </div>
                </div>
                
                {!formData.positionnementRequestId && (
                  <div className="bg-blue-50 p-4 rounded-md text-blue-800 text-sm mt-2">
                    <div className="font-semibold">Conseil</div>
                    <p>Pour une formation réellement personnalisée, liez ce programme à un entretien de positionnement.</p>
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Enregistrement...' : programme ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProgrammeFormationModal;
