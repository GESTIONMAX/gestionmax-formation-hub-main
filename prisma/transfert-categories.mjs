import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Début du transfert des formations et suppression de la catégorie "Maîtrisez les Bases du Digital"...');
  
  // 1. Trouver la catégorie source "Maîtrisez les Bases du Digital"
  const categorieSource = await prisma.categorieProgramme.findFirst({
    where: {
      code: "digital"
    },
    include: {
      programmes: true
    }
  });
  
  if (!categorieSource) {
    console.error('❌ Catégorie "Maîtrisez les Bases du Digital" (code: digital) non trouvée.');
    process.exit(1);
  }
  
  console.log(`Catégorie source trouvée: ${categorieSource.titre} (ID: ${categorieSource.id})`);
  console.log(`Nombre de programmes associés: ${categorieSource.programmes.length}`);
  
  // 2. Trouver la catégorie cible "Artisans Web"
  const categorieCible = await prisma.categorieProgramme.findUnique({
    where: {
      code: "ARTISANS-WEB"
    }
  });
  
  if (!categorieCible) {
    console.error('❌ Catégorie cible "Artisans Web" non trouvée.');
    process.exit(1);
  }
  
  console.log(`Catégorie cible trouvée: ${categorieCible.titre} (ID: ${categorieCible.id})`);
  
  // 3. Lister les programmes à transférer
  console.log('\nProgrammes à transférer:');
  for (const programme of categorieSource.programmes) {
    console.log(`- ${programme.code}: ${programme.titre}`);
  }
  
  // 4. Transférer tous les programmes vers la catégorie "Artisans Web"
  console.log('\nTransfert des programmes en cours...');
  
  for (const programme of categorieSource.programmes) {
    await prisma.programmeFormation.update({
      where: { id: programme.id },
      data: { categorieId: categorieCible.id }
    });
    
    console.log(`✅ Programme "${programme.titre}" transféré vers "${categorieCible.titre}"`);
  }
  
  // 5. Vérifier qu'il n'y a plus de programmes dans la catégorie source
  const programmesRestants = await prisma.programmeFormation.count({
    where: { categorieId: categorieSource.id }
  });
  
  if (programmesRestants > 0) {
    console.error(`⚠️ Il reste encore ${programmesRestants} programmes dans la catégorie source.`);
  } else {
    console.log('✅ Tous les programmes ont été transférés avec succès.');
    
    // 6. Supprimer la catégorie source
    await prisma.categorieProgramme.delete({
      where: { id: categorieSource.id }
    });
    
    console.log(`🗑️ Catégorie "${categorieSource.titre}" supprimée avec succès.`);
  }
  
  // 7. Afficher la liste des programmes maintenant dans "Artisans Web"
  const programmesArtisansWeb = await prisma.programmeFormation.findMany({
    where: { categorieId: categorieCible.id },
    select: { id: true, code: true, titre: true }
  });
  
  console.log(`\nTotal des programmes dans la catégorie Artisans Web: ${programmesArtisansWeb.length}`);
  programmesArtisansWeb.forEach(prog => {
    console.log(`- ${prog.code}: ${prog.titre}`);
  });
}

main()
  .catch((e) => {
    console.error('Erreur lors du transfert des programmes:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
