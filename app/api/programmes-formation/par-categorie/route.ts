import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { ProgrammeFormation } from '@/types/programme';

// Utilisation de PrismaClient avec singleton pattern pour éviter trop de connexions
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient();
  }
  prisma = (global as any).prisma;
}
// L'API n'utilise que Prisma comme source de vérité, suppression du mock
/**
  {
    id: '1',
    titre: 'Artisans Web',
    code: 'ARTISANS-WEB',
    description: 'Formations web dédiées aux artisans et professionnels des métiers manuels',
    formations: [
      {
        id: 'A007',
        titre: 'Structurer et préparer son offre pour la digitalisation',
        description: 'Apprenez à préparer efficacement votre entreprise à la transformation digitale',
        duree: '14h',
        prix: '1150€',
        niveau: 'Tous niveaux',
        participants: 'Artisans, entrepreneurs, chefs d\'atelier',
        objectifs: [
          'Structurer son offre pour une présentation digitale',
          'Préparer sa stratégie de transformation numérique',
          'Identifier les canaux digitaux adaptés à son métier'
        ],
        prerequis: 'Aucun',
        modalites: 'Formation en présentiel ou à distance',
        tauxParticipation: '98%',
        tauxReussite: '95%'
      },
      {
        id: 'A008-BD-WC',
        titre: 'Marketing digital Brevo + Techniques de vente en ligne (Woocommerce)',
        description: 'Maîtrisez les outils d\'emailing marketing et de vente en ligne pour développer votre activité',
        duree: '21h',
        prix: '1250€',
        niveau: 'Débutant à Intermédiaire',
        participants: 'Artisans, entrepreneurs, TPE/PME',
        objectifs: [
          'Créer des campagnes email efficaces avec Brevo',
          'Mettre en place une boutique en ligne avec WooCommerce',
          'Optimiser ses techniques de vente digitale'
        ],
        prerequis: 'Connaissances de base en informatique',
        modalites: 'Formation en présentiel ou à distance',
        tauxParticipation: '97%',
        tauxReussite: '94%'
      },
      {
        id: 'A009-SW-MA',
        titre: 'Gestion de la sécurité (WordPress) + Techniques d\'analyse statistiques Web',
        description: 'Sécurisez votre site WordPress et analysez efficacement vos données web',
        duree: '14h',
        prix: '1150€',
        niveau: 'Intermédiaire',
        participants: 'Artisans, entrepreneurs, gestionnaires de site',
        objectifs: [
          'Sécuriser efficacement un site WordPress',
          'Mettre en place des outils d\'analyse web',
          'Interpréter les données pour optimiser sa présence en ligne'
        ],
        prerequis: 'Avoir un site WordPress existant',
        modalites: 'Formation en présentiel ou à distance',
        tauxParticipation: '96%',
        tauxReussite: '93%'
      },
      {
        id: 'A010-WP-IM',
        titre: 'Créer et gérer un site WordPress & Stratégie de contenu InboundMarketing',
        description: 'Développez votre présence en ligne avec WordPress et une stratégie de contenu attractive',
        duree: '21h',
        prix: '1350€',
        niveau: 'Débutant à Intermédiaire',
        participants: 'Artisans, entrepreneurs, TPE/PME',
        objectifs: [
          'Créer et personnaliser un site WordPress professionnel',
          'Élaborer une stratégie de contenu Inbound Marketing',
          'Attirer et convertir des prospects grâce au contenu'
        ],
        prerequis: 'Connaissances de base en informatique',
        modalites: 'Formation en présentiel ou à distance',
        tauxParticipation: '98%',
        tauxReussite: '95%'
      },
      {
        id: 'A011-SW-SEO',
        titre: 'SEO : Les fondamentaux (SEOPress)',
        description: 'Maîtrisez les techniques de référencement naturel avec le plugin SEOPress',
        duree: '14h',
        prix: '1150€',
        niveau: 'Débutant à Intermédiaire',
        participants: 'Artisans, entrepreneurs, responsables de site web',
        objectifs: [
          'Comprendre les fondamentaux du référencement naturel',
          'Configurer et utiliser efficacement SEOPress',
          'Améliorer la visibilité de son site dans les moteurs de recherche'
        ],
        prerequis: 'Avoir un site WordPress existant',
        modalites: 'Formation en présentiel ou à distance',
        tauxParticipation: '97%',
        tauxReussite: '94%'
      },
      {
        id: 'A012-CV-WEB-WC',
        titre: 'Maîtriser Canva pour le web, les réseaux sociaux et la vente en ligne',
        description: 'Créez des visuels professionnels pour votre communication digitale et votre e-commerce',
        duree: '14h',
        prix: '990€',
        niveau: 'Tous niveaux',
        participants: 'Artisans, entrepreneurs, créateurs de contenu',
        objectifs: [
          'Maîtriser l\'interface et les fonctionnalités de Canva',
          'Créer des visuels optimisés pour le web et les réseaux sociaux',
          'Développer une identité visuelle cohérente pour sa boutique en ligne'
        ],
        prerequis: 'Aucun',
        modalites: 'Formation en présentiel ou à distance',
        tauxParticipation: '99%',
        tauxReussite: '97%'
      },
      {
        id: 'A014-FB-LI',
        titre: 'Maîtriser Facebook Ads et LinkedIn Ads pour une stratégie publicitaire efficace',
        description: 'Développez votre visibilité et générez des leads qualifiés grâce aux plateformes publicitaires sociales',
        duree: '14h',
        prix: '1250€',
        niveau: 'Débutant à Intermédiaire',
        participants: 'Artisans, entrepreneurs, responsables marketing',
        objectifs: [
          'Créer et optimiser des campagnes Facebook Ads',
          'Mettre en place des campagnes LinkedIn Ads ciblées',
          'Analyser les performances et optimiser son ROI'
        ],
        prerequis: 'Avoir des comptes professionnels sur Facebook et LinkedIn',
        modalites: 'Formation en présentiel ou à distance',
        tauxParticipation: '96%',
        tauxReussite: '93%'
      },
      {
        id: 'A015-IA-GPT',
        titre: 'Génération de contenu avec ChatGPT + Automatisation Marketing',
        description: 'Exploitez l\'IA pour créer du contenu pertinent et automatiser vos processus marketing',
        duree: '14h',
        prix: '1350€',
        niveau: 'Tous niveaux',
        participants: 'Artisans, entrepreneurs, créateurs de contenu',
        objectifs: [
          'Utiliser efficacement ChatGPT pour la création de contenu',
          'Mettre en place des workflows d\'automatisation marketing',
          'Gagner en productivité grâce aux outils d\'IA'
        ],
        prerequis: 'Connaissances de base en marketing digital',
        modalites: 'Formation en présentiel ou à distance',
        tauxParticipation: '98%',
        tauxReussite: '95%'
      },
      {
        id: 'A016-IA-CGPT-WP',
        titre: 'Intégrer ChatGPT et optimiser votre relation client grâce à l\'IA',
        description: 'Transformez votre approche client en utilisant l\'intelligence artificielle sur votre site web',
        duree: '14h',
        prix: '1250€',
        niveau: 'Intermédiaire',
        participants: 'Artisans, entrepreneurs, gestionnaires de site',
        objectifs: [
          'Intégrer des solutions basées sur ChatGPT à votre site WordPress',
          'Améliorer l\'expérience utilisateur grâce à l\'IA',
          'Optimiser votre service client avec des réponses automatisées intelligentes'
        ],
        prerequis: 'Avoir un site WordPress existant',
        modalites: 'Formation en présentiel ou à distance',
        tauxParticipation: '97%',
        tauxReussite: '94%'
      },
      {
        id: 'A017-MK-AUTO',
        titre: 'Lancez vos premières automatisations avec Make pour gagner en efficacité',
        description: 'Optimisez vos processus métier grâce à l\'automatisation sans code',
        duree: '14h',
        prix: '1150€',
        niveau: 'Débutant à Intermédiaire',
        participants: 'Artisans, entrepreneurs, TPE/PME',
        objectifs: [
          'Comprendre les principes de l\'automatisation de processus',
          'Configurer et utiliser la plateforme Make (ex-Integromat)',
          'Créer des scénarios d\'automatisation adaptés à votre activité'
        ],
        prerequis: 'Connaissances de base en informatique',
        modalites: 'Formation en présentiel ou à distance',
        tauxParticipation: '96%',
        tauxReussite: '93%'
      },
      {
        id: 'A018-DF-AUTO',
        titre: 'Dématérialisez vos formulaires et automatisez vos données',
        description: 'Optimisez la collecte et le traitement de vos données clients grâce aux formulaires numériques',
        duree: '14h',
        prix: '990€',
        niveau: 'Tous niveaux',
        participants: 'Artisans, entrepreneurs, administratifs',
        objectifs: [
          'Créer des formulaires digitaux professionnels',
          'Automatiser la collecte et le traitement des données',
          'Optimiser vos processus administratifs'
        ],
        prerequis: 'Connaissances de base en informatique',
        modalites: 'Formation en présentiel ou à distance',
        tauxParticipation: '97%',
        tauxReussite: '95%'
      }
    ]
  },
  {
    id: '2',
    titre: 'Artisans Gestion',
    code: 'ARTISANS-GESTION',
    description: 'Formations en gestion pour artisans et professionnels des métiers manuels',
    formations: []
  },
  {
    id: '3',
    titre: 'Développement WEB',
    code: 'DEV-WEB',
    description: 'Formations en développement web et technologies front-end/back-end',
    formations: []
  },
  {
    id: '4',
    titre: 'Anglais',
    code: 'ANGLAIS',
    description: 'Formations en anglais professionnel pour tous niveaux',
    formations: []
  }
];

**/

/**
 * @route GET /api/programmes-formation/par-categorie
 * @description Récupère tous les programmes de formation regroupés par catégorie
 * @access Public
 */
export async function GET() {
  try {
    console.log('API - GET /api/programmes-formation/par-categorie - Récupération des programmes par catégorie');
    
    // Récupération depuis Prisma (source unique de vérité)
    const categories = await prisma.categorieProgramme.findMany({
      include: {
        programmes: {
          where: {
            estActif: true,
            estVisible: true
          },
          select: {
            id: true,
            code: true,
            titre: true,
            description: true,
            duree: true,
            prix: true,
            niveau: true,
            participants: true,
            objectifs: true,
            prerequis: true,
            modalites: true,
            programmeUrl: true,
            pictogramme: true,
            type: true,
            typeProgramme: true
          }
        }
      },
      orderBy: {
        ordre: 'asc'
      },
      // Filtrer pour n'inclure que les catégories souhaitées
      where: {
        code: {
          in: ["ARTISANS-WEB", "ARTISANS-GESTION", "DEV-WEB", "ANGLAIS"]
        }
      }
    });
    
    console.log('Catégories chargées depuis Prisma (API):', categories.map(c => c.titre));
    
    // Transformer les données Prisma au format attendu par le front-end
    const formattedCategories = categories.map(cat => ({
      id: cat.id,
      titre: cat.titre,
      code: cat.code || '',
      description: cat.description || '',
      formations: cat.programmes.map(prog => ({
        id: prog.id,
        titre: prog.titre,
        description: prog.description || '',
        duree: prog.duree || '7h',
        prix: prog.prix || '980€',
        niveau: prog.niveau || 'Débutant',
        participants: prog.participants || 'Tout public',
        objectifs: Array.isArray(prog.objectifs) ? prog.objectifs : ['Objectif à définir'],
        prerequis: prog.prerequis || 'Aucun prérequis spécifique',
        modalites: prog.modalites || 'Formation à distance ou en présentiel',
        type: prog.type || 'standard',
        typeProgramme: prog.typeProgramme || 'catalogue',
        programmeUrl: prog.programmeUrl || `/formations/${prog.id}`
      }))
    }));
    
    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error('Erreur lors de la récupération des programmes par catégorie:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des programmes par catégorie' },
      { status: 500 }
    );
  }
}
