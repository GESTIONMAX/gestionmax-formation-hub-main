import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Récupérer l'ID de la catégorie Artisans Web
  const categorieArtisansWeb = await prisma.categorieProgramme.findUnique({
    where: { code: "ARTISANS-WEB" }
  });

  if (!categorieArtisansWeb) {
    console.error("Catégorie ARTISANS-WEB non trouvée. Exécutez d'abord le script seed-categories.mjs.");
    process.exit(1);
  }

  console.log(`Catégorie ARTISANS-WEB trouvée avec ID: ${categorieArtisansWeb.id}`);

  // Liste des codes des formations à associer à cette catégorie
  const formationCodes = [
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

  console.log('Début de la mise à jour des programmes de formation...');

  // Pour chaque code de formation, vérifier s'il existe et mettre à jour sa catégorie
  for (const code of formationCodes) {
    // Vérifier si la formation existe déjà
    const formation = await prisma.programmeFormation.findFirst({
      where: {
        OR: [
          { code: code },
          { code: { startsWith: code } } // Pour gérer les cas où le code est un préfixe (ex: A011-SW pour A011-SW-SEOPRESS)
        ]
      }
    });

    if (formation) {
      console.log(`Programme trouvé: ${formation.code} - ${formation.titre}`);

      // Mettre à jour la catégorie
      await prisma.programmeFormation.update({
        where: { id: formation.id },
        data: { categorieId: categorieArtisansWeb.id }
      });
      
      console.log(`✅ Programme ${formation.code} associé à la catégorie Artisans Web`);
    } else {
      console.log(`⚠️ Programme avec code ${code} non trouvé. Création non automatique.`);
    }
  }

  console.log('\nAssociation des programmes à la catégorie Artisans Web terminée!');

  // Vérifier tous les programmes associés à cette catégorie
  const programmesAssocies = await prisma.programmeFormation.findMany({
    where: { categorieId: categorieArtisansWeb.id }
  });

  console.log(`\nProgrammes associés à Artisans Web (${programmesAssocies.length}) :`);
  programmesAssocies.forEach(prog => {
    console.log(`- ${prog.code}: ${prog.titre}`);
  });
}

main()
  .catch((e) => {
    console.error('Erreur lors de l\'association des programmes aux catégories:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
