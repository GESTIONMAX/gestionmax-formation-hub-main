"use client";

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { ProgrammeFormation } from '@/types/ProgrammeFormation';
import { CategorieFormation } from '@/types/categorie';

export const useProgrammesFormation = () => {
  const [programmes, setProgrammes] = useState<ProgrammeFormation[]>([]);
  const [categories, setCategories] = useState<CategorieFormation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'catalogue' | 'sur-mesure'>('catalogue');
  const [searchTerm, setSearchTerm] = useState('');
  
  // État pour le modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProgramme, setCurrentProgramme] = useState<ProgrammeFormation | null>(null);
  
  // Chargement des programmes
  const fetchProgrammes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/programmes-formation');
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des programmes');
      }
      
      const data = await response.json();
      setProgrammes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur de chargement des programmes:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Chargement des catégories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories-programme');
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des catégories');
      }
      
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Erreur de chargement des catégories:', err);
    }
  }, []);
  
  // Chargement initial
  useEffect(() => {
    Promise.all([fetchProgrammes(), fetchCategories()]);
  }, [fetchProgrammes, fetchCategories]);
  
  // Filtrer les programmes par type et terme de recherche
  const filteredProgrammes = programmes.filter(prog => {
    const matchesType = prog.type === selectedType;
    const matchesSearch = 
      !searchTerm || 
      prog.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prog.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesSearch;
  });
  
  // Créer un nouveau programme
  const createProgramme = async (programmeData: Partial<ProgrammeFormation>) => {
    try {
      const response = await fetch('/api/programmes-formation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(programmeData),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la création du programme');
      }
      
      const newProgramme = await response.json();
      setProgrammes(prev => [...prev, newProgramme]);
      toast.success('Programme créé avec succès');
      return newProgramme;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur de création du programme:', err);
      throw err;
    }
  };
  
  // Mettre à jour un programme existant
  const updateProgramme = async (id: string, programmeData: Partial<ProgrammeFormation>) => {
    try {
      const response = await fetch(`/api/programmes-formation/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(programmeData),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du programme');
      }
      
      const updatedProgramme = await response.json();
      setProgrammes(prev => prev.map(p => p.id === id ? updatedProgramme : p));
      toast.success('Programme mis à jour avec succès');
      return updatedProgramme;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur de mise à jour du programme:', err);
      throw err;
    }
  };
  
  // Supprimer un programme
  const deleteProgramme = async (id: string) => {
    try {
      const response = await fetch(`/api/programmes-formation/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du programme');
      }
      
      setProgrammes(prev => prev.filter(p => p.id !== id));
      toast.success('Programme supprimé avec succès');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur de suppression du programme:', err);
      throw err;
    }
  };
  
  // Dupliquer un programme (catalogue vers sur-mesure)
  const duplicateProgramme = async (id: string) => {
    try {
      // 1. Récupérer les détails du programme à dupliquer
      const programmeToDuplicate = programmes.find(p => p.id === id);
      
      if (!programmeToDuplicate) {
        throw new Error('Programme non trouvé');
      }
      
      // 2. Créer une copie modifiée (sur-mesure)
      const { id: _, createdAt, updatedAt, ...programmeData } = programmeToDuplicate;
      
      const duplicatedData = {
        ...programmeData,
        type: 'sur-mesure' as const,
        titre: `${programmeData.titre} (sur-mesure)`,
        programmeSourId: id, // Référence au programme original
      };
      
      // 3. Appeler l'API pour dupliquer et archiver le template HTML si nécessaire
      const response = await fetch('/api/programmes-formation/dupliquer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(duplicatedData),
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la duplication du programme');
      }
      
      const newProgramme = await response.json();
      setProgrammes(prev => [...prev, newProgramme]);
      toast.success('Programme dupliqué avec succès');
      
      // Ouvrir le modal d'édition avec le programme dupliqué
      setCurrentProgramme(newProgramme);
      setIsModalOpen(true);
      
      return newProgramme;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error('Erreur de duplication du programme:', err);
      throw err;
    }
  };
  
  // Gérer l'ouverture du modal pour la création
  const openCreateModal = () => {
    setCurrentProgramme(null);
    setIsModalOpen(true);
  };
  
  // Gérer l'ouverture du modal pour la modification
  const openEditModal = (programme: ProgrammeFormation) => {
    setCurrentProgramme(programme);
    setIsModalOpen(true);
  };
  
  // Gérer la fermeture du modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProgramme(null);
  };
  
  // Fonction pour sauvegarder (création ou mise à jour)
  const saveProgramme = async (programmeData: Partial<ProgrammeFormation>) => {
    if (currentProgramme?.id) {
      await updateProgramme(currentProgramme.id, programmeData);
    } else {
      await createProgramme(programmeData);
    }
    closeModal();
    await fetchProgrammes(); // Rafraîchir la liste
  };
  
  return {
    programmes: filteredProgrammes,
    allProgrammes: programmes,
    categories,
    loading,
    error,
    selectedType,
    setSelectedType,
    searchTerm,
    setSearchTerm,
    createProgramme,
    updateProgramme,
    deleteProgramme,
    duplicateProgramme,
    refreshProgrammes: fetchProgrammes,
    isModalOpen,
    currentProgramme,
    openCreateModal,
    openEditModal,
    closeModal,
    saveProgramme,
  };
};

export default useProgrammesFormation;
