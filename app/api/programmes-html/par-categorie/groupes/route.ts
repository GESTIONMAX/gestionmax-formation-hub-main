import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Templates HTML de démonstration par catégorie
const mockHtmlTemplatesWithCategories = [
  {
    id: 'html-web',
    titre: 'Développement Web HTML',
    description: 'Templates HTML pour les formations en développement web',
    formations: [
      {
        id: 'html-web-1',
        titre: 'HTML/CSS Fondamentaux',
        description: 'Apprenez les bases du développement web avec HTML et CSS',
        duree: '14h',
        prix: '980€',
        niveau: 'Débutant',
        participants: 'Tout public',
        objectifs: [
          'Comprendre la structure d\'une page web',
          'Maîtriser les éléments HTML fondamentaux',
          'Créer des mises en page CSS responsive'
        ],
        prerequis: 'Aucune connaissance préalable requise',
        modalites: 'Formation à distance ou en présentiel',
        programmeUrl: '/programmes/html/html-css-fondamentaux.html'
      },
      {
        id: 'html-web-2',
        titre: 'Accessibilité Web',
        description: 'Apprenez à rendre vos sites web accessibles à tous les utilisateurs',
        duree: '7h',
        prix: '790€',
        niveau: 'Intermédiaire',
        participants: 'Développeurs web, intégrateurs',
        objectifs: [
          'Comprendre les normes WCAG',
          'Implémenter des pratiques d\'accessibilité',
          'Tester et améliorer l\'accessibilité d\'un site existant'
        ],
        prerequis: 'Connaissances en HTML et CSS',
        modalites: 'Formation à distance ou en présentiel',
        programmeUrl: '/programmes/html/accessibilite-web.html'
      }
    ]
  },
  {
    id: 'html-ml',
    titre: 'Machine Learning',
    description: 'Templates HTML pour les formations en machine learning et IA',
    formations: [
      {
        id: 'html-ml-1',
        titre: 'Introduction au Machine Learning',
        description: 'Découvrez les fondamentaux du machine learning et ses applications',
        duree: '21h',
        prix: '1590€',
        niveau: 'Débutant à Intermédiaire',
        participants: 'Data analysts, développeurs, professionnels IT',
        objectifs: [
          'Comprendre les concepts fondamentaux du ML',
          'Maîtriser les algorithmes de base',
          'Implémenter des solutions simples avec scikit-learn'
        ],
        prerequis: 'Notions de programmation Python et statistiques',
        modalites: 'Formation à distance ou en présentiel',
        programmeUrl: '/programmes/ml/template-ultra-optimise.html'
      }
    ]
  }
];

/**
 * Tente de charger les templates HTML depuis le système de fichiers
 * @returns Array de templates HTML par catégorie ou null en cas d'erreur
 */
async function loadHtmlTemplatesFromFileSystem() {
  try {
    // Chemin vers le répertoire des templates HTML
    const templatesDir = path.join(process.cwd(), 'public', 'programmes');
    
    // Vérifier si le répertoire existe
    if (!fs.existsSync(templatesDir)) {
      console.log('Répertoire des templates HTML non trouvé:', templatesDir);
      return null;
    }
    
    // Obtenir la liste des sous-répertoires (catégories)
    const categories = fs.readdirSync(templatesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && dirent.name !== 'generated') // Exclure le répertoire 'generated'
      .map(dirent => dirent.name);
    
    if (categories.length === 0) {
      console.log('Aucune catégorie de template trouvée');
      return null;
    }
    
    // Construire l'objet de templates par catégorie
    const templatesByCategory = categories.map(categoryName => {
      const categoryPath = path.join(templatesDir, categoryName);
      const categoryFiles = fs.readdirSync(categoryPath)
        .filter(file => file.endsWith('.html'));
      
      // Extraire les métadonnées de chaque template HTML (simulation)
      const formations = categoryFiles.map(file => {
        // Simuler l'extraction de métadonnées depuis le fichier HTML
        // Dans une implémentation réelle, il faudrait parser le fichier HTML
        return {
          id: `${categoryName}-${file.replace('.html', '')}`,
          titre: file.replace('.html', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: `Formation ${file.replace('.html', '').replace(/-/g, ' ')}`,
          duree: '14h', // Valeurs par défaut
          prix: '980€',
          niveau: 'Tous niveaux',
          participants: 'Professionnels du secteur',
          objectifs: ['Objectif 1', 'Objectif 2', 'Objectif 3'],
          prerequis: 'Selon le programme',
          modalites: 'Formation à distance ou en présentiel',
          programmeUrl: `/programmes/${categoryName}/${file}`
        };
      });
      
      return {
        id: `html-${categoryName}`,
        titre: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
        description: `Templates HTML pour les formations en ${categoryName}`,
        formations
      };
    });
    
    return templatesByCategory;
  } catch (error) {
    console.error('Erreur lors du chargement des templates HTML:', error);
    return null;
  }
}

/**
 * @route GET /api/programmes-html/par-categorie/groupes
 * @description Récupère tous les templates HTML de programmes regroupés par catégorie
 * @access Public
 */
export async function GET() {
  try {
    console.log('API - GET /api/programmes-html/par-categorie/groupes - Récupération des templates HTML');
    
    // Tenter de charger les templates depuis le système de fichiers
    const templatesFromFileSystem = await loadHtmlTemplatesFromFileSystem();
    
    if (templatesFromFileSystem && templatesFromFileSystem.length > 0) {
      console.log('Templates HTML chargés depuis le système de fichiers:', templatesFromFileSystem.length);
      return NextResponse.json(templatesFromFileSystem);
    } else {
      // Utiliser les templates mock en cas d'échec
      console.log('Utilisation des templates HTML mock');
      return NextResponse.json(mockHtmlTemplatesWithCategories);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des templates HTML:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des templates HTML' },
      { status: 500 }
    );
  }
}
