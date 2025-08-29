import { useState, useEffect } from "react";
import { useToast } from ".//use-toast";
import api from "@/services/api";

export interface Reclamation {
  id: string;
  nom: string;
  email: string;
  telephone?: string;
  sujet: string;
  message: string;
  statut: 'nouvelle' | 'en_cours' | 'resolue' | 'fermee';
  priorite: 'basse' | 'normale' | 'haute' | 'urgente';
  assigneeId?: string;
  assignee?: {
    id: string;
    name: string;
    email: string;
  };
  notesInternes?: string;
  dateResolution?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CreateReclamationData {
  nom: string;
  email: string;
  telephone?: string;
  sujet: string;
  message: string;
  priorite?: 'basse' | 'normale' | 'haute' | 'urgente';
}

export const useReclamations = () => {
  const [reclamations, setReclamations] = useState<Reclamation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReclamations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/reclamations');
      
      if (!Array.isArray(response.data)) {
        throw new Error('Format de réponse inattendu de l\'API');
      }
      
      setReclamations(response.data);
    } catch (error: any) {
      console.error('Erreur lors du chargement des réclamations:', error);
      toast({
        title: "Erreur",
        description: `Impossible de charger les réclamations: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createReclamation = async (data: CreateReclamationData) => {
    try {
      const response = await api.post('/api/reclamations', data);
      await fetchReclamations(); // Recharger la liste des réclamations
      
      toast({
        title: "Réclamation créée",
        description: "Votre réclamation a été enregistrée avec succès.",
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la création de la réclamation:', error);
      toast({
        title: "Erreur",
        description: `Impossible de créer la réclamation: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateReclamation = async (id: string, updates: Partial<Reclamation>) => {
    try {
      const response = await api.put(`/api/reclamations/${id}`, updates);
      await fetchReclamations(); // Recharger la liste des réclamations
      
      toast({
        title: "Réclamation mise à jour",
        description: "La réclamation a été mise à jour avec succès.",
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour de la réclamation:', error);
      toast({
        title: "Erreur",
        description: `Impossible de mettre à jour la réclamation: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteReclamation = async (id: string) => {
    try {
      await api.delete(`/api/reclamations/${id}`);
      await fetchReclamations(); // Recharger la liste des réclamations
      
      toast({
        title: "Réclamation supprimée",
        description: "La réclamation a été supprimée avec succès.",
      });
    } catch (error: any) {
      console.error('Erreur lors de la suppression de la réclamation:', error);
      toast({
        title: "Erreur",
        description: `Impossible de supprimer la réclamation: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchReclamations();
  }, []);

  return {
    reclamations,
    loading,
    refresh: fetchReclamations,
    createReclamation,
    updateReclamation,
    deleteReclamation,
  };
};
