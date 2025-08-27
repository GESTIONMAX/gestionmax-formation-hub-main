import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Nettoyage de la base de données pour éviter les doublons
  console.log('Suppression des programmes de formation existants...');
  await prisma.programmeFormation.deleteMany({});
  
  // Création des catégories - Nouvelles catégories demandées par le client
  const categories = [
    {
      code: 'ARTISANS-WEB',
      titre: 'Artisans Web',
      description: 'Formations web dédiées aux artisans et professionnels des métiers manuels',
      ordre: 1
    },
    {
      code: 'ARTISANS-GESTION',
      titre: 'Artisans Gestion',
      description: 'Formations en gestion pour artisans et professionnels des métiers manuels',
      ordre: 2
    },
    {
      code: 'DEV-WEB',
      titre: 'Développement WEB',
      description: 'Formations en développement web et technologies front-end/back-end',
      ordre: 3
    },
    {
      code: 'ANGLAIS',
      titre: 'Anglais',
      description: 'Formations en anglais professionnel pour tous niveaux',
      ordre: 4
    }
  ]

  console.log(`Début de la création des ${categories.length} catégories...`)

  // Création des programmes de formation pour la catégorie Artisans Web
  const programmesArtisansWeb = [
    {
      code: 'A007',
      titre: 'Créer son site vitrine avec WordPress',
      description: 'Apprenez à créer et gérer un site vitrine professionnel avec WordPress',
      duree: '21h',
      prix: '1490€',
      niveau: 'Débutant',
      participants: 'Artisans, TPE, PME',
      objectifs: ['Créer un site vitrine professionnel', 'Maîtriser l\'interface WordPress', 'Gérer son contenu de façon autonome'],
      prerequis: 'Aucune connaissance technique requise',
      modalites: 'Formation en présentiel ou à distance'
    },
    {
      code: 'A008-BD-WC',
      titre: 'Boutique en ligne avec WooCommerce',
      description: 'Créez une boutique en ligne performante avec WordPress et WooCommerce',
      duree: '28h',
      prix: '1890€',
      niveau: 'Intermédiaire',
      participants: 'Artisans, commerçants, créateurs',
      objectifs: ['Configurer une boutique WooCommerce', 'Gérer les produits et commandes', 'Paramétrer les options de livraison et paiement'],
      prerequis: 'Connaissances de base de WordPress',
      modalites: 'Formation en présentiel ou à distance'
    },
    {
      code: 'A009-SW-MA',
      titre: 'Site web pour les métiers d\'art',
      description: 'Créez un site web adapté aux spécificités des métiers d\'art',
      duree: '21h',
      prix: '1490€',
      niveau: 'Débutant',
      participants: 'Artisans d\'art, créateurs, artistes',
      objectifs: ['Mettre en valeur son travail artisanal en ligne', 'Créer une identité visuelle cohérente', 'Présenter son portfolio et ses réalisations'],
      prerequis: 'Aucune connaissance technique requise',
      modalites: 'Formation en présentiel ou à distance'
    },
    {
      code: 'A010-SW-FB',
      titre: 'Facebook pour artisans',
      description: 'Utilisez efficacement Facebook pour promouvoir votre activité artisanale',
      duree: '14h',
      prix: '990€',
      niveau: 'Débutant',
      participants: 'Artisans tous secteurs',
      objectifs: ['Créer et optimiser sa page Facebook professionnelle', 'Élaborer une stratégie de contenu efficace', 'Utiliser la publicité Facebook à petit budget'],
      prerequis: 'Disposer d\'un compte Facebook personnel',
      modalites: 'Formation en présentiel ou à distance'
    },
    {
      code: 'A011-SW-IG',
      titre: 'Instagram pour artisans',
      description: 'Développez votre présence sur Instagram et attirez de nouveaux clients',
      duree: '14h',
      prix: '990€',
      niveau: 'Débutant',
      participants: 'Artisans tous secteurs',
      objectifs: ['Créer un compte Instagram professionnel attractif', 'Produire des photos et vidéos de qualité', 'Développer sa communauté et sa visibilité'],
      prerequis: 'Disposer d\'un smartphone avec appareil photo',
      modalites: 'Formation en présentiel ou à distance'
    },
    {
      code: 'A012-SW-GM',
      titre: 'Google My Business pour artisans',
      description: 'Améliorez votre visibilité locale avec Google My Business',
      duree: '7h',
      prix: '590€',
      niveau: 'Débutant',
      participants: 'Artisans tous secteurs',
      objectifs: ['Créer et optimiser sa fiche Google My Business', 'Gérer les avis clients', 'Améliorer son référencement local'],
      prerequis: 'Disposer d\'une adresse email Google',
      modalites: 'Formation en présentiel ou à distance'
    },
    {
      code: 'A013-SW-CANVA',
      titre: 'Canva pour artisans',
      description: 'Créez facilement vos supports visuels professionnels avec Canva',
      duree: '7h',
      prix: '590€',
      niveau: 'Débutant',
      participants: 'Artisans tous secteurs',
      objectifs: ['Maîtriser l\'interface Canva', 'Créer des visuels pour réseaux sociaux, flyers, cartes de visite', 'Respecter sa charte graphique'],
      prerequis: 'Aucune connaissance en design requise',
      modalites: 'Formation en présentiel ou à distance'
    },
    {
      code: 'A014-SW-PHOTO',
      titre: 'Photographie produit pour artisans',
      description: 'Réalisez des photos professionnelles de vos créations avec votre smartphone',
      duree: '14h',
      prix: '990€',
      niveau: 'Débutant',
      participants: 'Artisans tous secteurs',
      objectifs: ['Maîtriser les techniques de base de la photo', 'Créer un studio photo à petit budget', 'Retoucher simplement ses images'],
      prerequis: 'Disposer d\'un smartphone avec appareil photo',
      modalites: 'Formation en présentiel ou à distance'
    },
    {
      code: 'A015-SW-VIDEO',
      titre: 'Vidéo marketing pour artisans',
      description: 'Créez des vidéos impactantes pour promouvoir votre savoir-faire',
      duree: '14h',
      prix: '990€',
      niveau: 'Débutant',
      participants: 'Artisans tous secteurs',
      objectifs: ['Maîtriser les techniques de base de la vidéo', 'Scénariser et tourner avec son smartphone', 'Monter et publier ses vidéos'],
      prerequis: 'Disposer d\'un smartphone avec caméra',
      modalites: 'Formation en présentiel ou à distance'
    },
    {
      code: 'A016-SW-RESEAUX',
      titre: 'Stratégie réseaux sociaux pour artisans',
      description: 'Développez une présence cohérente et efficace sur les réseaux sociaux',
      duree: '21h',
      prix: '1490€',
      niveau: 'Intermédiaire',
      participants: 'Artisans tous secteurs',
      objectifs: ['Définir sa stratégie social media', 'Choisir les plateformes adaptées à son activité', 'Créer un calendrier éditorial efficace'],
      prerequis: 'Être présent sur au moins un réseau social',
      modalites: 'Formation en présentiel ou à distance'
    },
    {
      code: 'A017-SW-CONTENU',
      titre: 'Création de contenu pour artisans',
      description: 'Apprenez à créer du contenu engageant qui met en valeur votre expertise',
      duree: '14h',
      prix: '990€',
      niveau: 'Débutant à Intermédiaire',
      participants: 'Artisans tous secteurs',
      objectifs: ['Identifier les contenus pertinents pour son audience', 'Rédiger des textes efficaces', 'Créer des visuels cohérents'],
      prerequis: 'Aucun prérequis spécifique',
      modalites: 'Formation en présentiel ou à distance'
    },
    {
      code: 'A018-SW-EMAIL',
      titre: 'Email marketing pour artisans',
      description: 'Utilisez l\'email marketing pour fidéliser vos clients et développer votre activité',
      duree: '14h',
      prix: '990€',
      niveau: 'Débutant',
      participants: 'Artisans tous secteurs',
      objectifs: ['Constituer et gérer sa base de contacts', 'Créer des campagnes d\'emailing efficaces', 'Analyser les résultats et optimiser ses envois'],
      prerequis: 'Disposer d\'une base de contacts clients',
      modalites: 'Formation en présentiel ou à distance'
    }
  ];

  for (const categorie of categories) {
    // Vérifier si la catégorie existe déjà pour éviter les doublons
    const existingCategorie = await prisma.categorieProgramme.findUnique({
      where: {
        code: categorie.code
      }
    })

    let categorieId: string;
    
    if (!existingCategorie) {
      const newCategorie = await prisma.categorieProgramme.create({
        data: categorie
      });
      categorieId = newCategorie.id;
      console.log(`Catégorie créée: ${categorie.titre}`);
    } else {
      console.log(`La catégorie ${categorie.titre} existe déjà, mise à jour...`);
      await prisma.categorieProgramme.update({
        where: {
          code: categorie.code
        },
        data: {
          titre: categorie.titre,
          description: categorie.description,
          ordre: categorie.ordre
        }
      });
      categorieId = existingCategorie.id;
    }
    
    // Ajouter les programmes de formation pour la catégorie Artisans Web
    if (categorie.code === 'ARTISANS-WEB') {
      console.log(`Création des programmes pour la catégorie ${categorie.titre}...`);
      
      for (const programme of programmesArtisansWeb) {
        await prisma.programmeFormation.create({
          data: {
            // Données de base du programme
            code: programme.code,
            titre: programme.titre,
            description: programme.description,
            duree: programme.duree,
            prix: programme.prix,
            niveau: programme.niveau,
            participants: programme.participants,
            objectifs: programme.objectifs,
            prerequis: programme.prerequis,
            modalites: programme.modalites,
            
            // Champs obligatoires additionnels
            type: "Formation",
            publicConcerne: programme.participants,
            contenuDetailleJours: "Contenu détaillé à fournir",
            modalitesAcces: "Formation accessible à tous",
            modalitesTechniques: "Ordinateur avec connexion internet",
            modalitesReglement: "Chèque ou virement bancaire",
            formateur: "Aurélien Lien",
            ressourcesDisposition: "Support de cours numérique",
            modalitesEvaluation: "QCM et exercices pratiques",
            sanctionFormation: "Attestation de fin de formation",
            niveauCertification: "Formation non certifiante",
            delaiAcceptation: "15 jours avant le début de la formation",
            accessibiliteHandicap: "Locaux accessibles aux PMR, adaptation possible",
            cessationAbandon: "En cas d'abandon, facturation au prorata temporis",
            
            // Relations
            categorie: {
              connect: {
                id: categorieId
              }
            }
          }
        });
        console.log(`Programme créé: ${programme.titre}`);
      }
    }
  }

  console.log(`Seed terminé avec succès.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
