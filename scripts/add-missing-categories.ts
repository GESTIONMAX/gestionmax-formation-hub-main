import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addMissingCategories() {
  console.log('Ajout des catégories manquantes...');
  
  const categoriesToAdd = [
    {
      titre: 'Artisans Gestion',
      code: 'ART-GEST',
      description: 'Formations dédiées à la gestion pour les artisans',
      ordre: 2
    },
    {
      titre: 'Développement',
      code: 'DEV',
      description: 'Formations en développement informatique et web',
      ordre: 3
    },
    {
      titre: 'Anglais',
      code: 'ENG',
      description: 'Formations en langue anglaise',
      ordre: 4
    }
  ];
  
  for (const categorie of categoriesToAdd) {
    try {
      // Vérifier si la catégorie existe déjà
      const existing = await prisma.categorieProgramme.findFirst({
        where: {
          OR: [
            { titre: categorie.titre },
            { code: categorie.code }
          ]
        }
      });
      
      if (existing) {
        console.log(`La catégorie "${categorie.titre}" existe déjà.`);
        continue;
      }
      
      // Créer la nouvelle catégorie
      const created = await prisma.categorieProgramme.create({
        data: categorie
      });
      
      console.log(`Catégorie "${created.titre}" créée avec succès.`);
    } catch (error) {
      console.error(`Erreur lors de la création de la catégorie "${categorie.titre}":`, error);
    }
  }
  
  console.log('Opération terminée.');
}

// Exécuter la fonction
addMissingCategories()
  .catch(e => {
    console.error('Erreur lors de l\'exécution du script:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
