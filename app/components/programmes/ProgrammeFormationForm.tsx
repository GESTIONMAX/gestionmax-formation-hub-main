"use client";

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { X, Plus, CheckSquare } from 'lucide-react';
import { ProgrammeFormation } from '@/types/ProgrammeFormation';
import { CategorieFormation } from '@/types/categorie';
import { Checkbox } from '../ui/checkbox';
import { DatePicker } from '../ui/date-picker';

interface ProgrammeFormationFormProps {
  programme: ProgrammeFormation | null;
  categories: CategorieFormation[];
  onSave: (programmeData: Partial<ProgrammeFormation>) => Promise<void>;
  onCancel: () => void;
  type?: 'catalogue' | 'sur-mesure';
}

export const ProgrammeFormationForm = ({
  programme,
  categories,
  onSave,
  onCancel,
  type = 'catalogue'
}: ProgrammeFormationFormProps) => {
  // État local pour le formulaire
  const [formData, setFormData] = useState<Partial<ProgrammeFormation>>(
    programme || {
      type: type,
      estActif: true,
      verificationJuridique: false
    }
  );
  
  // État pour les champs de type tableau
  const [objectifs, setObjectifs] = useState<string[]>(programme?.objectifs || []);
  const [competencesVisees, setCompetencesVisees] = useState<string[]>(programme?.competencesVisees || []);
  
  // État pour les dates
  const [dateVerificationJuridique, setDateVerificationJuridique] = useState<Date | undefined>
    (programme?.dateVerificationJuridique ? new Date(programme.dateVerificationJuridique) : undefined);
  const [dateControle, setDateControle] = useState<Date | undefined>
    (programme?.dateControle ? new Date(programme.dateControle) : undefined);
  
  // État pour l'onglet actif
  const [activeTab, setActiveTab] = useState("general");
  
  // Mettre à jour l'état du formulaire avec les données du programme si elles changent
  useEffect(() => {
    if (programme) {
      setFormData(programme);
      setObjectifs(programme.objectifs || []);
      setCompetencesVisees(programme.competencesVisees || []);
      
      // Mise à jour des dates
      if (programme.dateVerificationJuridique) {
        setDateVerificationJuridique(new Date(programme.dateVerificationJuridique));
      } else {
        setDateVerificationJuridique(undefined);
      }
      
      if (programme.dateControle) {
        setDateControle(new Date(programme.dateControle));
      } else {
        setDateControle(undefined);
      }
    } else {
      setFormData({ type: type, estActif: true, verificationJuridique: false });
      setObjectifs([]);
      setCompetencesVisees([]);
      setDateVerificationJuridique(undefined);
      setDateControle(undefined);
    }
  }, [programme, type]);
  
  // Gérer les changements dans le formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Gérer les champs de type nombre
  const handleNumberChange = (name: string, value: string) => {
    const numValue = value ? parseFloat(value) : undefined;
    setFormData(prev => ({ ...prev, [name]: numValue }));
  };
  
  // Gérer les champs de type tableau
  const addArrayItem = (array: string[], setArray: React.Dispatch<React.SetStateAction<string[]>>) => {
    setArray([...array, '']);
  };
  
  const updateArrayItem = (array: string[], setArray: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
    const newArray = [...array];
    newArray[index] = value;
    setArray(newArray);
  };
  
  const removeArrayItem = (array: string[], setArray: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
    setArray(array.filter((_, i) => i !== index));
  };
  
  // Gestion des checkboxes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  // Gestion des dates
  const handleDateChange = (name: string, date: Date | undefined) => {
    if (name === 'dateVerificationJuridique') {
      setDateVerificationJuridique(date);
    } else if (name === 'dateControle') {
      setDateControle(date);
    }
    setFormData(prev => ({ ...prev, [name]: date }));
  };
  
  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Fusionner les données du formulaire avec les tableaux et dates
    const finalFormData = {
      ...formData,
      objectifs: objectifs.filter(item => item.trim() !== ''),
      competencesVisees: competencesVisees.filter(item => item.trim() !== ''),
      dateVerificationJuridique: dateVerificationJuridique,
      dateControle: dateControle
    };
    
    await onSave(finalFormData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="qualiopi">Qualiopi</TabsTrigger>
          <TabsTrigger value="objectifs">Objectifs</TabsTrigger>
          <TabsTrigger value="veille">Veille légale</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titre">Titre *</Label>
              <Input
                id="titre"
                name="titre"
                value={formData.titre || ''}
                onChange={handleChange}
                placeholder="Titre du programme"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categorieId">Catégorie *</Label>
              <Select 
                name="categorieId" 
                value={formData.categorieId || ''} 
                onValueChange={(value) => handleSelectChange('categorieId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(categorie => (
                    <SelectItem key={categorie.id} value={categorie.id}>
                      {categorie.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select 
                name="type" 
                value={formData.type || type} 
                onValueChange={(value) => handleSelectChange('type', value as 'catalogue' | 'sur-mesure')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="catalogue">Catalogue</SelectItem>
                  <SelectItem value="sur-mesure">Sur-mesure</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estActif">Statut *</Label>
              <Select 
                name="estActif" 
                value={formData.estActif ? 'true' : 'false'} 
                onValueChange={(value) => handleSelectChange('estActif', value === 'true')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Actif</SelectItem>
                  <SelectItem value="false">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duree">Durée (heures) *</Label>
              <Input
                id="duree"
                name="duree"
                type="number"
                value={formData.duree || ''}
                onChange={(e) => handleNumberChange('duree', e.target.value)}
                min={1}
                placeholder="21"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="niveau">Niveau</Label>
              <Select 
                name="niveau" 
                value={formData.niveau || ''} 
                onValueChange={(value) => handleSelectChange('niveau', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debutant">Débutant</SelectItem>
                  <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                  <SelectItem value="avance">Avancé</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="prix">Prix (€)</Label>
              <Input
                id="prix"
                name="prix"
                type="number"
                value={formData.prix || ''}
                onChange={(e) => handleNumberChange('prix', e.target.value)}
                min={0}
                step={0.01}
                placeholder="1500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tarifIntraEntreprise">Tarif intra-entreprise (€)</Label>
              <Input
                id="tarifIntraEntreprise"
                name="tarifIntraEntreprise"
                type="number"
                value={formData.tarifIntraEntreprise || ''}
                onChange={(e) => handleNumberChange('tarifIntraEntreprise', e.target.value)}
                min={0}
                step={0.01}
                placeholder="2500"
              />
            </div>
            
            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Description du programme de formation"
                className="h-32"
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="qualiopi" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prerequis">Prérequis</Label>
              <Textarea
                id="prerequis"
                name="prerequis"
                value={formData.prerequis || ''}
                onChange={handleChange}
                placeholder="Prérequis pour suivre la formation"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="publicVise">Public visé *</Label>
              <Textarea
                id="publicVise"
                name="publicVise"
                value={formData.publicVise || ''}
                onChange={handleChange}
                placeholder="Public cible de la formation"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="modalites">Modalités d'évaluation *</Label>
              <Textarea
                id="modalites"
                name="modalites"
                value={formData.modalites || ''}
                onChange={handleChange}
                placeholder="Modalités d'évaluation de la formation"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accessibilite">Accessibilité PSH</Label>
              <Textarea
                id="accessibilite"
                name="accessibilite"
                value={formData.accessibilite || ''}
                onChange={handleChange}
                placeholder="Informations sur l'accessibilité de la formation aux personnes en situation de handicap"
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="objectifs" className="space-y-4">
          <div className="space-y-6">
            <div>
              <Label className="mb-2 block">Objectifs</Label>
              <div className="space-y-2">
                {objectifs.map((objectif, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={objectif}
                      onChange={(e) => updateArrayItem(objectifs, setObjectifs, index, e.target.value)}
                      placeholder="Objectif de la formation"
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeArrayItem(objectifs, setObjectifs, index)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem(objectifs, setObjectifs)}
                  className="mt-2"
                >
                  <Plus size={16} className="mr-2" /> Ajouter un objectif
                </Button>
              </div>
            </div>
            
            <div>
              <Label className="mb-2 block">Compétences visées</Label>
              <div className="space-y-2">
                {competencesVisees.map((competence, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={competence}
                      onChange={(e) => updateArrayItem(competencesVisees, setCompetencesVisees, index, e.target.value)}
                      placeholder="Compétence visée par la formation"
                    />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeArrayItem(competencesVisees, setCompetencesVisees, index)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem(competencesVisees, setCompetencesVisees)}
                  className="mt-2"
                >
                  <Plus size={16} className="mr-2" /> Ajouter une compétence
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="veille" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="verificationJuridique" 
                  checked={formData.verificationJuridique || false}
                  onCheckedChange={(checked) => handleCheckboxChange('verificationJuridique', checked as boolean)}
                />
                <Label htmlFor="verificationJuridique" className="font-medium">Vérification juridique effectuée</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateVerificationJuridique">Date de vérification juridique</Label>
                <DatePicker
                  id="dateVerificationJuridique"
                  selected={dateVerificationJuridique}
                  onSelect={(date) => handleDateChange('dateVerificationJuridique', date)}
                  placeholderText="Sélectionner une date"
                  disabled={!formData.verificationJuridique}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="referenceTexte">Référence du texte légal</Label>
                <Input
                  id="referenceTexte"
                  name="referenceTexte"
                  value={formData.referenceTexte || ''}
                  onChange={handleChange}
                  placeholder="Ex: Article L.6313-1 du Code du travail"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="actionNonRespect">Action en cas de non-respect</Label>
                <Textarea
                  id="actionNonRespect"
                  name="actionNonRespect"
                  value={formData.actionNonRespect || ''}
                  onChange={handleChange}
                  placeholder="Actions à entreprendre en cas de non-respect"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="organismeControle">Organisme de contrôle</Label>
                <Input
                  id="organismeControle"
                  name="organismeControle"
                  value={formData.organismeControle || ''}
                  onChange={handleChange}
                  placeholder="Ex: DIRECCTE, Qualiopi"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateControle">Date du dernier contrôle</Label>
                <DatePicker
                  id="dateControle"
                  selected={dateControle}
                  onSelect={(date) => handleDateChange('dateControle', date)}
                  placeholderText="Sélectionner une date"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="resultatControle">Résultat du contrôle</Label>
                <Select 
                  value={formData.resultatControle || ''} 
                  onValueChange={(value) => handleSelectChange('resultatControle', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un résultat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conforme">Conforme</SelectItem>
                    <SelectItem value="conforme_avec_reserves">Conforme avec réserves</SelectItem>
                    <SelectItem value="non_conforme">Non conforme</SelectItem>
                    <SelectItem value="en_attente">En attente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="commentaireControle">Commentaire sur le contrôle</Label>
                <Textarea
                  id="commentaireControle"
                  name="commentaireControle"
                  value={formData.commentaireControle || ''}
                  onChange={handleChange}
                  placeholder="Commentaires ou observations sur le contrôle"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          {programme ? 'Mettre à jour' : 'Créer le programme'}
        </Button>
      </div>
    </form>
  );
};

export default ProgrammeFormationForm;
