"use client";

import { useState, useEffect } from "react";
import { useToast } from ".//use-toast";
import api from "@/services/api";
import { ApiError, ApiResponse } from "@/types";
import { ProgrammeFormation } from "@/types/programme";

// Note: L'interface ProgrammeFormation est maintenant importée depuis @/types/programme

/**
 * @description Hook personnalisé pour gérer les programmes de formation (CRUD)
 * @note Composant client - Nécessite la directive "use client" et utilise les API navigateur
 *
 * @returns {Object} Fonctions et états pour manipuler les programmes de formation
 * @returns {ProgrammeFormation[]} programmes - Liste des programmes de formation
 * @returns {boolean} loading - Indicateur de chargement
 * @returns {Function} createProgramme - Création d'un nouveau programme
 * @returns {Function} updateProgramme - Mise à jour d'un programme
 * @returns {Function} deleteProgramme - Suppression d'un programme
 * @returns {Function} duplicateProgramme - Duplication d'un programme (ex: catalogue vers sur-mesure)
 * @returns {Function} updateProgrammeStatus - Mise à jour du statut (actif/inactif)
 * @returns {Function} getProgrammesByCategorie - Filtrage par catégorie
 * @returns {Function} getProgrammesByType - Filtrage par type (catalogue/sur-mesure)
 * @returns {Function} refreshProgrammes - Rechargement des programmes
 */
/**
 * @description Hook de gestion des programmes de formation
 * 
 * Ce hook fournit toutes les fonctionnalités nécessaires pour interagir avec les programmes
 * de formation. Il encapsule les opérations CRUD (Create, Read, Update, Delete), la recherche,
 * le filtrage et la gestion des statuts des programmes.
 *
 * @returns {Object} Objet contenant les états et fonctions pour gérer les programmes de formation
 * @returns {ProgrammeFormation[]} programmes - Liste des programmes de formation
 * @returns {boolean} loading - État de chargement des programmes
 * @returns {ProgrammeFormation["categorie"][]} categories - Liste des catégories de programmes
 * @returns {boolean} loadingCategories - État de chargement des catégories
 * @returns {Function} fetchProgrammes - Fonction pour charger les programmes
 * @returns {Function} createProgramme - Fonction pour créer un programme
 * @returns {Function} updateProgramme - Fonction pour mettre à jour un programme
 * @returns {Function} deleteProgramme - Fonction pour supprimer un programme
 * @returns {Function} duplicateProgramme - Fonction pour dupliquer un programme
 * @returns {Function} updateProgrammeStatus - Fonction pour mettre à jour le statut d'un programme
 * @returns {Function} getProgrammesByCategorie - Fonction pour filtrer les programmes par catégorie
 * @returns {Function} getProgrammesByType - Fonction pour filtrer les programmes par type
 * 
 * @example
 * // Utilisation dans un composant
 * const {
 *   programmes,
 *   loading,
 *   createProgramme,
 *   updateProgramme,
 *   deleteProgramme
 * } = useProgrammesFormation();
 * 
 * // Afficher la liste des programmes
 * return (
 *   <div>
 *     {loading ? (
 *       <p>Chargement...</p>
 *     ) : (
 *       <ul>
 *         {programmes.map(prog => (
 *           <li key={prog.id}>{prog.titre}</li>
 *         ))}
 *       </ul>
 *     )}
 *   </div>
 * );
 */
export const useProgrammesFormation = () => {
  /**
   * @description État stockant la liste des programmes de formation
   */
  const [programmes, setProgrammes] = useState<ProgrammeFormation[]>([]);
  
  /**
   * @description État de chargement général des programmes
   */
  const [loading, setLoading] = useState(true);
  
  /**
   * @description Hook de notification pour afficher des alertes utilisateur
   */
  const { toast } = useToast();

  // Données simulées pour démonstration quand l'API n'est pas disponible
  const MOCK_PROGRAMMES: ProgrammeFormation[] = [
    {
      id: "1",
      code: "DEV-WEB-01",
      type: "catalogue",
      titre: "Développement Web Front-End",
      description: "Formation complète sur les technologies front-end modernes incluant HTML5, CSS3 et JavaScript.",
      niveau: "Débutant",
      participants: "8 à 12 personnes",
      duree: "35 heures",
      prix: "1950€ HT",
      objectifs: [
        "Maîtriser les fondamentaux du développement web",
        "Créer des interfaces utilisateur modernes et responsives",
        "Comprendre et utiliser JavaScript et ses frameworks"
      ],
      prerequis: "Connaissances de base en informatique",
      modalites: "Formation en présentiel ou à distance",
      pictogramme: "💻",
      estActif: true,
      contenuDetailleHtml: "<h2>Module 1: Introduction au HTML5</h2><p>Structure, balises sémantiques, formulaires avancés</p>",
      publicConcerne: "Tout public souhaitant se former au développement web",
      contenuDetailleJours: "Jour 1: HTML5, Jour 2: CSS3, Jour 3: JavaScript, Jour 4-5: Projets",
      modalitesAcces: "Inscription en ligne ou par téléphone",
      modalitesTechniques: "Ordinateur avec connexion internet, environnement de développement",
      modalitesReglement: "Paiement par virement bancaire ou CB",
      formateur: "Experts en développement web avec +5 ans d'expérience",
      ressourcesDisposition: "Support de cours, exercices pratiques, accès à une plateforme en ligne",
      modalitesEvaluation: "QCM et projet pratique",
      sanctionFormation: "Attestation de fin de formation",
      niveauCertification: "N/A",
      delaiAcceptation: "15 jours avant le début de la formation",
      accessibiliteHandicap: "Locaux accessibles aux personnes à mobilité réduite",
      cessationAbandon: "Remboursement au prorata des heures suivies",
      beneficiaireId: null,
      objectifsSpecifiques: null,
      positionnementRequestId: null,
      programmeUrl: "https://www.example.com/programmes/dev-web-01",
      programme: "<h1>Programme détaillé</h1><p>Formation développement web complète</p>",
      categorie: {
        id: "1",
        code: "DEV",
        titre: "Développement informatique",
        description: "Formations en développement informatique",
      },
      categorieId: "1",
      createdAt: new Date('2023-05-10'),
      updatedAt: new Date('2023-09-18')
    },
    {
      id: "2",
      code: "DATA-SCIENCE-01",
      type: "catalogue",
      titre: "Introduction à la Data Science",
      description: "Découvrez les fondamentaux de la data science et apprenez à manipuler et analyser des données.",
      niveau: "Intermédiaire",
      participants: "6 à 10 personnes",
      duree: "21 heures",
      prix: "1450€ HT",
      objectifs: [
        "Comprendre les concepts de base de la data science",
        "Manipuler et nettoyer des jeux de données",
        "Créer des visualisations pertinentes",
        "S'initier au machine learning"
      ],
      prerequis: "Connaissances en programmation et statistiques de base",
      modalites: "Formation en présentiel ou à distance",
      pictogramme: "📊",
      estActif: true,
      contenuDetailleHtml: "<h2>Module 1: Introduction à Python pour la Data Science</h2><p>Pandas, NumPy, visualisation avec Matplotlib</p>",
      publicConcerne: "Analystes, développeurs et professionnels de l'informatique",
      contenuDetailleJours: "Jour 1: Python et librairies, Jour 2: Analyse de données, Jour 3: Machine Learning",
      modalitesAcces: "Inscription via le site web",
      modalitesTechniques: "Ordinateur avec Python installé, accès à Google Colab",
      modalitesReglement: "Paiement à l'inscription",
      formateur: "Data Scientists expérimentés",
      ressourcesDisposition: "Notebooks Jupyter, datasets, documentation",
      modalitesEvaluation: "Projet d'analyse de données réel",
      sanctionFormation: "Attestation de compétences",
      niveauCertification: "N/A",
      delaiAcceptation: "10 jours avant le début",
      accessibiliteHandicap: "Formation adaptable selon les besoins",
      cessationAbandon: "Remboursement si annulation 7 jours avant",
      beneficiaireId: null,
      objectifsSpecifiques: null,
      positionnementRequestId: null,
      programmeUrl: "https://www.example.com/programmes/data-science-01",
      programme: "<h1>Programme Data Science</h1><p>Formation aux fondamentaux de la data science</p>",
      categorie: {
        id: "2",
        code: "DATA",
        titre: "Data Science & IA",
        description: "Formations en science des données et intelligence artificielle",
      },
      categorieId: "2",
      createdAt: new Date('2023-06-15'),
      updatedAt: new Date('2023-10-05')
    },
    {
      id: "3",
      code: "SM-DEVOPS-01",
      type: "sur-mesure",
      titre: "DevOps pour entreprise",
      description: "Formation sur mesure adaptée aux besoins spécifiques de votre entreprise en matière de DevOps.",
      niveau: "Avancé",
      participants: "4 à 8 personnes",
      duree: "28 heures",
      prix: "Sur devis",
      objectifs: [
        "Mettre en place une chaîne CI/CD adaptée à votre environnement",
        "Maîtriser les outils DevOps spécifiques à votre infrastructure",
        "Optimiser les processus de déploiement"
      ],
      prerequis: "Expérience en administration système et développement",
      modalites: "Formation en intra-entreprise",
      pictogramme: "🔄",
      estActif: false,
      contenuDetailleHtml: "<h2>Module 1: CI/CD avec GitLab</h2><p>Configuration, pipelines, automatisation</p>",
      publicConcerne: "Équipes techniques de l'entreprise",
      contenuDetailleJours: "Jour 1-2: CI/CD, Jour 3: Conteneurs, Jour 4: Monitoring",
      modalitesAcces: "Formation réservée aux collaborateurs de l'entreprise",
      modalitesTechniques: "Environnement technique de l'entreprise",
      modalitesReglement: "Facturation après la formation",
      formateur: "Expert DevOps sénior",
      ressourcesDisposition: "Documentation technique, scripts, exercices pratiques",
      modalitesEvaluation: "Mise en situation réelle",
      sanctionFormation: "Attestation de compétences DevOps",
      niveauCertification: "N/A",
      delaiAcceptation: "30 jours avant le début",
      accessibiliteHandicap: "Adaptable selon les besoins spécifiques",
      cessationAbandon: "Voir conditions contractuelles",
      beneficiaireId: "client-123",
      objectifsSpecifiques: "Réduire le temps de déploiement de 75% sur les applications critiques",
      positionnementRequestId: "pos-456",
      programmeUrl: "https://www.example.com/programmes/sm-devops-01",
      programme: "<h1>Programme DevOps Personnalisé</h1><p>Formation adaptée aux besoins de l'entreprise</p>",
      categorie: {
        id: "3",
        code: "DEVOPS",
        titre: "DevOps & Cloud",
        description: "Formations en DevOps et technologies cloud",
      },
      categorieId: "3",
      createdAt: new Date('2023-09-01'),
      updatedAt: new Date('2023-11-20')
    }
  ];

  /**
   * @description Charge la liste complète des programmes de formation depuis l'API
   * @note Cette fonction est appelée automatiquement au montage du composant et met à jour l'état local
   * 
   * @returns {Promise<void>}
   * @throws {Error} Capture les erreurs en interne mais ne les propage pas
   * 
   * @example
   * // Rafraîchir manuellement la liste des programmes
   * await fetchProgrammes();
   * console.log(`${programmes.length} programmes chargés`);
   */
  const fetchProgrammes = async () => {
    try {
      setLoading(true);
      console.log('Chargement des programmes de formation...');
      const response = await api.get('/api/programmes-formation');
      console.log('Programmes chargés:', response.data.length, 'items');
      setProgrammes(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des programmes:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les programmes de formation',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgrammes();
  }, []);

  /**
   * @description Crée un nouveau programme de formation
   * 
   * @param {Omit<ProgrammeFormation, 'id' | 'createdAt' | 'updatedAt'>} programmeData - Données du programme sans id et dates automatiques
   * @returns {Promise<ProgrammeFormation>} Le programme créé
   * @throws {Error} Si la création échoue
   * 
   * @example
   * // Créer un nouveau programme de formation
   * const nouveauProgramme = await createProgramme({
   *   code: "DEV-WEB-02",
   *   titre: "Développement Web Full-Stack",
   *   type: "catalogue",
   *   // autres propriétés obligatoires...
   * });
   */
  const createProgramme = async (programmeData: Omit<ProgrammeFormation, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('Création d\'un nouveau programme avec les données:', programmeData);
      const response = await api.post('/api/programmes-formation', programmeData);
      console.log('Programme créé avec succès:', response.data);
      
      const newProgramme = response.data;
      setProgrammes(prev => [newProgramme, ...prev]);
      
      toast({
        title: 'Programme créé',
        description: `Programme "${newProgramme.titre}" créé avec succès`,
      });
      
      return newProgramme;
    } catch (error) {
      console.error('Erreur lors de la création du programme:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le programme',
        variant: 'destructive',
      });
      throw error;
    }
  };

  /**
   * @description Met à jour un programme de formation existant
   * 
   * @param {string} id - Identifiant du programme à mettre à jour
   * @param {Partial<ProgrammeFormation>} programmeData - Données partielles à mettre à jour
   * @returns {Promise<ProgrammeFormation>} Le programme mis à jour
   * @throws {Error} Si la mise à jour échoue
   * 
   * @example
   * // Mettre à jour un programme existant
   * const programmeModifie = await updateProgramme("prog-123", {
   *   titre: "Nouveau titre",
   *   description: "Nouvelle description"
   * });
   */
  const updateProgramme = async (id: string, programmeData: Partial<ProgrammeFormation>) => {
    try {
      console.log('Mise à jour du programme', id, 'avec les données:', programmeData);
      const response = await api.put(`/api/programmes-formation/${id}`, programmeData);
      const updatedProgramme = response.data;
      setProgrammes(prev => prev.map(p => (p.id === id ? updatedProgramme : p)));
      toast({
        title: 'Programme mis à jour',
        description: `Programme "${updatedProgramme.titre}" mis à jour avec succès`,
      });
      return updatedProgramme;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le programme',
        variant: 'destructive',
      });
      throw error;
    }
  };

  /**
   * @description Supprime un programme de formation
   * 
   * @param {string} id - Identifiant du programme à supprimer
   * @returns {Promise<void>}
   * @throws {Error} Si la suppression échoue
   * 
   * @example
   * // Supprimer un programme
   * await deleteProgramme("prog-123");
   * console.log("Programme supprimé");
   */
  const deleteProgramme = async (id: string) => {
    try {
      // Trouver le programme pour l'inclure dans la notification
      const programmeToDelete = programmes.find(p => p.id === id);
      console.log('Suppression du programme:', id, programmeToDelete?.titre);
      await api.delete(`/api/programmes-formation/${id}`);
      setProgrammes(prev => prev.filter(p => p.id !== id));
      toast({
        title: 'Programme supprimé',
        description: programmeToDelete
          ? `Programme "${programmeToDelete.titre}" supprimé`
          : 'Programme supprimé avec succès',
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le programme',
        variant: 'destructive',
      });
      throw error;
    }
  };

  /**
   * @description État pour les catégories de programmes de formation disponibles
   */
  const [categories, setCategories] = useState<ProgrammeFormation["categorie"][]>([]);
  
  /**
   * @description État de chargement des catégories
   */
  const [loadingCategories, setLoadingCategories] = useState(false);

  /**
   * @description Charge les catégories de programmes depuis l'API
   * @returns {Promise<void>}
   * @throws {Error} Capture les erreurs en interne mais ne les propage pas
   * 
   * @example
   * // Recharger manuellement les catégories
   * await fetchCategories();
   * console.log("Catégories rechargées");
   */
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      console.log('Chargement des catégories de programmes...');
      const response = await api.get('/api/categories-programme');
      setCategories(response.data);
      console.log('Catégories chargées avec succès:', response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Charger les catégories au montage du composant
  useEffect(() => {
    fetchCategories();
  }, []);

  /**
   * @description Filtre les programmes par catégorie
   * 
   * @param {string} categorieId - Identifiant de la catégorie à filtrer
   * @returns {ProgrammeFormation[]} Liste des programmes appartenant à la catégorie
   * 
   * @example
   * // Récupérer les programmes de la catégorie "Développement Web"
   * const programmesDevWeb = getProgrammesByCategorie("cat-dev-web");
   */
  const getProgrammesByCategorie = (categorieId: string) => {
    return programmes.filter(prog => prog.categorieId === categorieId);
  };

  /**
   * @description Filtre les programmes par type (catalogue ou sur-mesure)
   * 
   * @param {"catalogue" | "sur-mesure"} type - Type de programme à filtrer
   * @returns {ProgrammeFormation[]} Liste des programmes du type spécifié
   * 
   * @example
   * // Récupérer tous les programmes catalogue
   * const programmesCatalogue = getProgrammesByType("catalogue");
   * 
   * @example
   * // Récupérer tous les programmes sur-mesure
   * const programmesSurMesure = getProgrammesByType("sur-mesure");
   */
  const getProgrammesByType = (type: "catalogue" | "sur-mesure") => {
    return programmes.filter(prog => prog.type === type);
  };

  /**
   * @description Duplique un programme existant avec des modifications (par ex: de catalogue vers sur-mesure)
   * @note Cette fonction tente d'abord d'utiliser un endpoint spécifique de duplication, puis recourt à une création standard en cas d'échec
   * 
   * @param {string} id - Identifiant du programme source à dupliquer
   * @param {Partial<ProgrammeFormation>} modificationData - Modifications à appliquer à la copie
   * @returns {Promise<ProgrammeFormation>} Le programme dupliqué
   * @throws {Error} Si la duplication échoue ou si le programme source n'est pas trouvé
   * 
   * @example
   * // Dupliquer un programme catalogue en version sur-mesure
   * const programmeSurMesure = await duplicateProgramme("prog-catalogue-123", {
   *   type: "sur-mesure",
   *   titre: "Formation DevOps Personnalisée - Client ABC",
   *   beneficiaireId: "client-123",
   *   objectifsSpecifiques: "Objectifs adaptés au client ABC"
   * });
   */
  const duplicateProgramme = async (id: string, modificationData: Partial<ProgrammeFormation>) => {
    try {
      console.log('duplicateProgramme appelé avec id:', id, 'et modifications:', modificationData);
      
      // Récupérer le programme source
      const sourceProgramme = programmes.find(p => p.id === id);
      if (!sourceProgramme) {
        console.error('Programme source introuvable avec id:', id);
        throw new Error('Programme source introuvable');
      }
      console.log('Programme source trouvé:', sourceProgramme);

      // Vérifier s'il s'agit d'une duplication vers sur-mesure
      const isSurMesureConversion = 
        (sourceProgramme.type === 'catalogue' && modificationData.type === 'sur-mesure');
      
      // Extraire le chemin du template HTML source si disponible
      const sourceTemplatePath = sourceProgramme.programmeUrl;
      
      // Créer un nouveau programme basé sur le programme source avec les modifications
      const duplicateData = {
        ...sourceProgramme,
        ...modificationData,
        id: undefined // Le backend va générer un nouvel ID
      };
      console.log('Données pour duplication préparées:', duplicateData);

      // Essayons d'abord une approche alternative si l'API originale échoue
      let response;
      try {
        // Approche 1: Endpoint spécifique de duplication
        console.log('Tentative d\'appel API 1: /api/programmes-formation/duplicate');
        response = await api.post('/api/programmes-formation/duplicate', { 
          sourceId: id,
          newData: duplicateData
        });
      } catch (dupError) {
        console.warn('Première tentative échouée, essai avec création standard...', dupError);
        
        // Approche 2: Créer un nouveau programme avec les données dupliquées
        console.log('Tentative d\'appel API 2: /api/programmes-formation (création standard)');
        const newProgrammeData = {
          ...duplicateData,
          id: undefined,
          createdAt: undefined,
          updatedAt: undefined
        };
        response = await api.post('/api/programmes-formation', newProgrammeData);
      }

      const duplicatedProgramme = response.data;
      console.log('Programme dupliqué avec succès:', duplicatedProgramme);
      
      // Si c'est une conversion vers sur-mesure et qu'il y a un template source, archiver le template
      if (isSurMesureConversion && sourceTemplatePath) {
        try {
          console.log('Archivage du template HTML:', sourceTemplatePath);
          // Appel à l'API d'archivage
          const archiveResponse = await api.post('/api/programmes-html/archive', {
            sourcePath: sourceTemplatePath,
            programmeId: duplicatedProgramme.id,
            programmeTitle: duplicatedProgramme.titre
          });
          
          if (archiveResponse.data.success) {
            console.log('Template archivé avec succès:', archiveResponse.data.archivedPath);
            // Mettre à jour l'URL du programme avec le chemin archivé
            if (archiveResponse.data.archivedPath) {
              await updateProgramme(duplicatedProgramme.id, {
                programmeUrl: archiveResponse.data.archivedPath
              });
              duplicatedProgramme.programmeUrl = archiveResponse.data.archivedPath;
            }
          }
        } catch (archiveError) {
          console.error('Erreur lors de l\'archivage du template:', archiveError);
          // On continue malgré l'erreur d'archivage, mais on log l'erreur
        }
      }
      
      setProgrammes(prev => [duplicatedProgramme, ...prev]);

      toast({
        title: 'Programme dupliqué',
        description: `Programme "${duplicatedProgramme.titre}" créé avec succès`,
      });

      return duplicatedProgramme;
    } catch (error) {
      console.error('Erreur lors de la duplication:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de dupliquer le programme',
        variant: 'destructive',
      });
      throw error;
    }
  };

  /**
   * @description Met à jour le statut d'activation d'un programme (actif/inactif)
   * @note Cette fonction tente d'utiliser un endpoint dédié au statut, puis recourt à une mise à jour standard en cas d'échec
   * 
   * @param {string} id - Identifiant du programme à modifier
   * @param {{ estActif: boolean }} options - Options avec le statut d'activation
   * @param {boolean} options.estActif - Nouveau statut d'activation (true = actif, false = inactif)
   * @returns {Promise<ProgrammeFormation>} Le programme mis à jour
   * @throws {Error} Si la mise à jour du statut échoue
   * 
   * @example
   * // Activer un programme
   * await updateProgrammeStatus("prog-123", { estActif: true });
   * 
   * @example
   * // Désactiver un programme
   * await updateProgrammeStatus("prog-456", { estActif: false });
   */
  const updateProgrammeStatus = async (id: string, { estActif }: { estActif: boolean }) => {
    console.log('updateProgrammeStatus appelé avec id:', id, 'estActif:', estActif);
    try {
      // Récupérer le programme pour les logs
      const programme = programmes.find(p => p.id === id);
      console.log('Programme trouvé pour mise à jour de statut:', programme);
      
      // Essayer plusieurs approches en cas d'échec
      let response;
      try {
        // Approche 1: Endpoint dédié au statut
        console.log('Tentative API 1: PATCH /api/programmes-formation/:id/status');
        response = await api.patch(`/api/programmes-formation/${id}/status`, { estActif });
      } catch (statusError) {
        console.warn('Première tentative échouée, essai avec mise à jour standard...', statusError);
        
        // Approche 2: Update standard
        console.log('Tentative API 2: PUT /api/programmes-formation/:id (update standard)');
        response = await api.put(`/api/programmes-formation/${id}`, { estActif });
      }
      
      const updated = response.data;
      console.log('Programme mis à jour avec succès:', updated);
      
      // Mettre à jour l'état local avant la notification
      setProgrammes(prev => prev.map(p => (p.id === id ? updated : p)));
      console.log('Liste des programmes mise à jour');
      
      toast({
        title: estActif ? 'Programme activé' : 'Programme désactivé',
        description: `Le statut du programme a été mis à jour`,
      });
      
      return updated;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut du programme',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    programmes,
    loading,
    createProgramme,
    updateProgramme,
    deleteProgramme,
    duplicateProgramme,
    updateProgrammeStatus,
    categories,
    loadingCategories,
    getProgrammesByCategorie,
    getProgrammesByType,
    refreshProgrammes: fetchProgrammes
  };
};
