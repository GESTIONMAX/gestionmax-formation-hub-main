import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Convertit une formation catalogue en formation sur mesure
 * Crée une copie du programme avec une relation vers l'original
 * et définit le type sur "sur-mesure"
 */
async function convertirVersFormationSurMesure(programmeId, beneficiaireInfo = null) {
  console.log(`Conversion du programme ${programmeId} en formation sur mesure...`);

  try {
    // 1. Récupérer les données du programme catalogue original
    const programmeOriginal = await prisma.programmeFormation.findUnique({
      where: { id: programmeId },
      include: {
        categorie: true,
      }
    });

    if (!programmeOriginal) {
      console.error(`❌ Programme avec l'ID ${programmeId} non trouvé.`);
      return null;
    }

    // 2. Générer un code unique pour la version sur mesure
    const codeBase = programmeOriginal.code;
    const version = programmeOriginal.version;
    const codeSurMesure = `${codeBase}-SM-${new Date().getTime().toString().slice(-4)}`;

    // 3. Préparer les données du nouveau programme sur mesure
    // On exclut l'ID pour en générer un nouveau
    const { id, ...donneesOriginal } = programmeOriginal;

    // 4. Créer la version sur mesure avec les données du catalogue et les changements nécessaires
    const programmeSurMesure = await prisma.programmeFormation.create({
      data: {
        ...donneesOriginal,
        code: codeSurMesure,
        typeProgramme: "sur-mesure",
        version: version + 1,
        estVisible: false, // La version sur mesure n'est pas visible dans le catalogue
        programmeSourId: programmeId, // Relation avec le programme original
        objectifsSpecifiques: programmeOriginal.objectifsSpecifiques || 
          "À définir selon les besoins spécifiques du bénéficiaire",
        beneficiaireId: beneficiaireInfo?.id || null,
        // Si des infos bénéficiaire sont fournies, on peut personnaliser davantage
        description: beneficiaireInfo ? 
          `Formation personnalisée basée sur ${programmeOriginal.titre} - Adaptée pour ${beneficiaireInfo.nom}` : 
          `Version sur mesure de ${programmeOriginal.titre}`,
      },
    });

    console.log(`✅ Programme sur mesure créé avec succès!`);
    console.log(`ID: ${programmeSurMesure.id}`);
    console.log(`Code: ${programmeSurMesure.code}`);
    console.log(`Type: ${programmeSurMesure.typeProgramme}`);
    console.log(`Titre: ${programmeSurMesure.titre}`);
    console.log(`Basé sur: ${programmeOriginal.titre} (${programmeOriginal.code})`);

    return programmeSurMesure;
  } catch (error) {
    console.error("❌ Erreur lors de la conversion:", error);
    return null;
  }
}

/**
 * Test la fonctionnalité avec un ID de programme existant
 */
async function testerConversion(programmeId) {
  try {
    // Exemple d'information bénéficiaire (optionnel)
    const beneficiaire = {
      id: null, // Dans un cas réel, ce serait l'ID du bénéficiaire
      nom: "Jean Martin",
      entreprise: "Artisan Plomberie",
    };

    const resultat = await convertirVersFormationSurMesure(programmeId, beneficiaire);
    
    if (resultat) {
      // Afficher la liste des formations dans la même catégorie
      const categorie = await prisma.categorieProgramme.findUnique({
        where: { id: resultat.categorieId },
        include: {
          programmes: {
            where: {
              OR: [
                { id: programmeId }, // Programme original
                { id: resultat.id }  // Programme sur mesure créé
              ]
            }
          }
        }
      });

      if (categorie) {
        console.log(`\nCatégorie: ${categorie.titre}`);
        console.log(`Programmes liés:`);
        
        categorie.programmes.forEach(prog => {
          console.log(`- ${prog.titre} (${prog.code}) - Type: ${prog.typeProgramme || 'catalogue'}`);
        });
      }
    }

  } catch (error) {
    console.error("❌ Erreur dans le test:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Si exécuté directement, attendre un ID en paramètre
if (process.argv.length > 2) {
  const programmeId = process.argv[2];
  testerConversion(programmeId)
    .catch(e => {
      console.error(e);
      process.exit(1);
    });
} else {
  console.log("Veuillez fournir un ID de programme à convertir:");
  console.log("Usage: node convert-to-sur-mesure.mjs <programmeId>");
}

// Exporter la fonction pour utilisation dans d'autres modules
export { convertirVersFormationSurMesure };
