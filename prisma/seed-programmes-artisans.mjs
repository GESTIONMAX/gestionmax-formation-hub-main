import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

// Liste des codes de programme spécifiquement demandés pour Artisans Web
const codesArtisansWeb = [
  "A007",
  "A008-BD-WC",
  "A009-SW-MA",
  "A010-WP-IM",
  "A011-SW",
  "A012-CV-WEB-WC",
  "A014-FB-LI",
  "A015-IA-GPT",
  "A016-IA-CGPT-WP",
  "A017-MK-AUTO",
  "A018-DF-AUTO"
];

// Titres complets des formations pour certains codes
const titresProgrammes = {
  "A007": "Structurer et préparer son offre pour la digitalisation",
  "A008-BD-WC": "Marketing digital Brevo + Techniques de vente en ligne (Woocommerce)",
  "A009-SW-MA": "Gestion de la sécurité (WordPress) + Techniques d'analyse statistiques Web",
  "A010-WP-IM": "Créer et gérer un site WordPress & Stratégie de contenu InboundMarketing",
  "A011-SW": "SEO : Les fondamentaux (SEOPress) avec le plugin SEOPRESS",
  "A012-CV-WEB-WC": "Maîtriser Canva pour le web, les réseaux sociaux et la vente en ligne",
  "A014-FB-LI": "Maîtriser Facebook Ads et LinkedIn Ads pour une stratégie publicitaire efficace",
  "A015-IA-GPT": "Génération de contenu avec ChatGPT + Automatisation Marketing",
  "A016-IA-CGPT-WP": "Intégrer ChatGPT et optimiser votre relation client grace à l'IA",
  "A017-MK-AUTO": "Lancez vos premières automatisations avec Make pour gagner en efficacité",
  "A018-DF-AUTO": "Dématérialisez vos formulaires et automatisez vos données"
};

// Fonction pour extraire le titre d'un fichier HTML
async function extractTitleFromHtml(filePath) {
  try {
    const content = await fs.promises.readFile(filePath, 'utf8');
    const titleMatch = content.match(/<title>(.*?)<\/title>/);
    if (titleMatch && titleMatch[1]) {
      return titleMatch[1].replace('Programme de formation - ', '').trim();
    }
    return null;
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier ${filePath}:`, error);
    return null;
  }
}

async function main() {
  // Récupérer la catégorie Artisans Web
  const artisansWebCategorie = await prisma.categorieProgramme.findUnique({
    where: { code: 'ARTISANS-WEB' }
  });

  if (!artisansWebCategorie) {
    console.error("Catégorie ARTISANS-WEB non trouvée. Exécutez d'abord le script seed-categories.mjs.");
    process.exit(1);
  }

  // Récupérer la liste des fichiers HTML dans le dossier programmes/ml
  const programmesDirPath = path.join(__dirname, '..', 'public', 'programmes', 'ml');
  console.log(`Recherche des fichiers dans le répertoire: ${programmesDirPath}`);
  
  const files = await fs.promises.readdir(programmesDirPath);
  const htmlFiles = files.filter(file => file.endsWith('.html') && !file.includes('template') && !file.includes('exemple'));

  console.log(`Fichiers HTML trouvés: ${htmlFiles.length}`);

  // Pour chaque code de programme demandé pour Artisans Web
  for (const code of codesArtisansWeb) {
    // Vérifier si un programme avec ce code existe déjà
    const existingProgramme = await prisma.programmeFormation.findFirst({
      where: { 
        OR: [
          { code: code },
          { code: { startsWith: code } }
        ]
      }
    });

    if (existingProgramme) {
      console.log(`Programme existant: ${existingProgramme.code} - ${existingProgramme.titre}`);
      
      // Mettre à jour la catégorie du programme existant
      await prisma.programmeFormation.update({
        where: { id: existingProgramme.id },
        data: { categorieId: artisansWebCategorie.id }
      });

      console.log(`✅ Programme ${existingProgramme.code} associé à la catégorie Artisans Web`);
      continue;
    }

    // Chercher un fichier HTML correspondant au code
    const matchingFiles = htmlFiles.filter(file => file.startsWith(`${code}`));
    
    if (matchingFiles.length > 0) {
      // Prendre le fichier optimisé s'il existe, sinon le premier
      const preferredFile = matchingFiles.find(file => file.includes('optimise')) || matchingFiles[0];
      const filePath = path.join(programmesDirPath, preferredFile);
      
      console.log(`Traitement du fichier ${preferredFile} pour le code ${code}`);
      
      // Extraire le titre du fichier HTML
      let titre = await extractTitleFromHtml(filePath);
      
      // Si le titre n'est pas trouvé dans le HTML, utiliser le titre prédéfini ou une valeur par défaut
      titre = titre || titresProgrammes[code] || `Formation ${code}`;
      
      // Créer le programme
      const newProgramme = await prisma.programmeFormation.create({
        data: {
          code: code,
          titre: titre.toUpperCase(), // Format cohérent avec l'existant
          description: `${titre}. Formation professionnelle pour artisans et professionnels.`,
          duree: "7h",
          prix: "980€",
          niveau: "Débutant",
          participants: "Tout public",
          objectifs: ["Maîtriser les fondamentaux", "Appliquer les bonnes pratiques"],
          prerequis: "Aucun prérequis spécifique",
          publicConcerne: "Artisans, entrepreneurs et professionnels",
          contenuDetailleJours: "Contenu détaillé à personnaliser",
          horaires: "9h-12h30 et 14h-17h30",
          modalites: "En présentiel ou à distance",
          modalitesAcces: "Formation accessible après validation du dossier",
          modalitesTechniques: "Ordinateur et connexion internet requis",
          modalitesReglement: "Paiement à l'inscription",
          contactOrganisme: "GestionMax - aurelien@gestionmax.fr - 06.46.02.24.68",
          formateur: "Aurélien Lien",
          ressourcesDisposition: "Support de formation PDF",
          modalitesEvaluation: "QCM et exercices pratiques",
          sanctionFormation: "Attestation de fin de formation",
          niveauCertification: "Formation non certifiante",
          delaiAcceptation: "2 semaines",
          accessibiliteHandicap: "Nous contacter pour adapter la formation",
          cessationAbandon: "En cas d'abandon, merci de nous contacter",
          programmeUrl: `/programmes/ml/${preferredFile}`,
          tauxParticipation: "98%",
          tauxReussite: "95%",
          type: "formation",
          typeProgramme: "standard",
          estActif: true,
          estVisible: true,
          categorieId: artisansWebCategorie.id
        }
      });
      
      console.log(`✅ Programme ${code} créé avec succès: ${newProgramme.titre}`);
    } else {
      // Si aucun fichier ne correspond, créer un programme avec les informations disponibles
      console.log(`⚠️ Aucun fichier trouvé pour ${code}, création avec données par défaut`);
      
      // Utiliser le titre prédéfini ou une valeur par défaut
      const titre = titresProgrammes[code] || `Formation ${code}`;
      
      const newProgramme = await prisma.programmeFormation.create({
        data: {
          code: code,
          titre: titre.toUpperCase(), // Format cohérent avec l'existant
          description: `${titre}. Formation professionnelle pour artisans et professionnels.`,
          duree: "7h",
          prix: "980€",
          niveau: "Débutant",
          participants: "Tout public",
          objectifs: ["Maîtriser les fondamentaux", "Appliquer les bonnes pratiques"],
          prerequis: "Aucun prérequis spécifique",
          publicConcerne: "Artisans, entrepreneurs et professionnels",
          contenuDetailleJours: "Contenu détaillé à personnaliser",
          horaires: "9h-12h30 et 14h-17h30",
          modalites: "En présentiel ou à distance",
          modalitesAcces: "Formation accessible après validation du dossier",
          modalitesTechniques: "Ordinateur et connexion internet requis",
          modalitesReglement: "Paiement à l'inscription",
          contactOrganisme: "GestionMax - aurelien@gestionmax.fr - 06.46.02.24.68",
          formateur: "Aurélien Lien",
          ressourcesDisposition: "Support de formation PDF",
          modalitesEvaluation: "QCM et exercices pratiques",
          sanctionFormation: "Attestation de fin de formation",
          niveauCertification: "Formation non certifiante",
          delaiAcceptation: "2 semaines",
          accessibiliteHandicap: "Nous contacter pour adapter la formation",
          cessationAbandon: "En cas d'abandon, merci de nous contacter",
          programmeUrl: null,
          tauxParticipation: "98%",
          tauxReussite: "95%",
          type: "formation",
          typeProgramme: "standard",
          estActif: true,
          estVisible: true,
          categorieId: artisansWebCategorie.id
        }
      });
      
      console.log(`✅ Programme ${code} créé avec succès (sans fichier HTML): ${newProgramme.titre}`);
    }
  }

  // Liste finale des programmes dans la catégorie
  const programmesArtisansWeb = await prisma.programmeFormation.findMany({
    where: { categorieId: artisansWebCategorie.id },
    select: { id: true, code: true, titre: true }
  });

  console.log(`\nTotal des programmes dans la catégorie Artisans Web: ${programmesArtisansWeb.length}`);
  programmesArtisansWeb.forEach(prog => {
    console.log(`- ${prog.code}: ${prog.titre}`);
  });
}

main()
  .catch((e) => {
    console.error('Erreur lors de la création des programmes:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
