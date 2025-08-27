import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Listing de toutes les catégories de programmes...');
  
  const categories = await prisma.categorieProgramme.findMany({
    include: {
      _count: {
        select: {
          programmes: true
        }
      }
    }
  });
  
  console.log(`Total: ${categories.length} catégories trouvées\n`);
  
  // Afficher les catégories avec leurs informations
  categories.forEach(cat => {
    console.log(`ID: ${cat.id}`);
    console.log(`Titre: ${cat.titre}`);
    console.log(`Code: ${cat.code}`);
    console.log(`Description: ${cat.description}`);
    console.log(`Ordre: ${cat.ordre}`);
    console.log(`Nombre de programmes: ${cat._count.programmes}`);
    console.log(`-----------------------------------`);
  });

  // Trouver la catégorie qui contient "Digital" dans le titre
  const digitalCategories = categories.filter(cat => 
    cat.titre && cat.titre.toLowerCase().includes('digital')
  );

  if (digitalCategories.length > 0) {
    console.log('\nCatégories contenant "Digital" dans le titre:');
    digitalCategories.forEach(cat => {
      console.log(`- ${cat.titre} (ID: ${cat.id}, Code: ${cat.code})`);
    });
  }
}

main()
  .catch((e) => {
    console.error('Erreur lors de la récupération des catégories:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
