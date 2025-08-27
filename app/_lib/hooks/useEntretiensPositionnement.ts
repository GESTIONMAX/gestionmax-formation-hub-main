"use client";

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useToast } from '../../components/ui/use-toast';

// Types pour les entretiens de positionnement
export interface EntretienPositionnement {
  id: string;
  code: string;
  dateEntretien: string;
  beneficiaire: Beneficiaire;
  beneficiaireId: string;
  statut: 'en_attente' | 'termine' | 'annule';
  commentaires?: string;
  objectifsIdentifies?: string[];
  besoinsSpecifiques?: string[];
}

export interface Beneficiaire {
  id: string;
  nom: string;
  prenom: string;
  email: string;
}

/**
 * Hook pour gérer les entretiens de positionnement
 * @returns Méthodes et données pour interagir avec les entretiens de positionnement
 */
export const useEntretiensPositionnement = () => {
  const [entretiens, setEntretiens] = useState<EntretienPositionnement[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // Instance axios préconfigurée
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  });

  /**
   * Récupère la liste des entretiens de positionnement
   */
  const fetchEntretiens = useCallback(async () => {
    setLoading(true);
    try {
      // En production, appeler l'API réelle
      // const response = await api.get('/api/entretiens-positionnement');
      // const data = response.data;
      
      // Pour le développement, utiliser des données simulées
      // Simule un délai réseau
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockEntretiens: EntretienPositionnement[] = [
        {
          id: 'pos-001',
          code: 'POS-001',
          dateEntretien: '2025-08-12',
          beneficiaire: {
            id: 'ben-001',
            nom: 'Dupont',
            prenom: 'Jean',
            email: 'jean.dupont@example.com'
          },
          beneficiaireId: 'ben-001',
          statut: 'termine',
          commentaires: 'Entretien concluant, bénéficiaire très motivé.',
          objectifsIdentifies: [
            'Maîtriser React et NextJS',
            'Comprendre les bases de données SQL'
          ]
        },
        {
          id: 'pos-002',
          code: 'POS-002',
          dateEntretien: '2025-08-15',
          beneficiaire: {
            id: 'ben-002',
            nom: 'Martin',
            prenom: 'Marie',
            email: 'marie.martin@example.com'
          },
          beneficiaireId: 'ben-002',
          statut: 'termine',
          commentaires: 'Besoins spécifiques identifiés en data science.',
          objectifsIdentifies: [
            'Apprendre Python pour la data science',
            'Maîtriser les outils de visualisation de données'
          ],
          besoinsSpecifiques: [
            'Support de cours adapté pour malvoyant'
          ]
        }
      ];
      
      setEntretiens(mockEntretiens);
      
    } catch (error) {
      console.error('Erreur lors du chargement des entretiens:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les entretiens de positionnement',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Récupère un entretien par son ID
   * @param id ID de l'entretien à récupérer
   */
  const getEntretienById = useCallback((id: string) => {
    return entretiens.find(e => e.id === id);
  }, [entretiens]);

  /**
   * Récupère un bénéficiaire par son ID
   * @param id ID du bénéficiaire à récupérer
   */
  const getBeneficiaireById = useCallback((id: string) => {
    const entretien = entretiens.find(e => e.beneficiaire.id === id);
    return entretien?.beneficiaire;
  }, [entretiens]);

  // Charger les entretiens au montage du composant
  useEffect(() => {
    fetchEntretiens();
  }, [fetchEntretiens]);

  return {
    entretiens,
    loading,
    fetchEntretiens,
    getEntretienById,
    getBeneficiaireById
  };
};

export default useEntretiensPositionnement;
