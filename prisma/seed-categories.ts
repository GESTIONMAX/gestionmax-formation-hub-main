import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Catégories à créer
  const categories = [
    {
      code: "ARTISANS-WEB",
      titre: "Artisans Web",
      description: "Formations sur les outils web pour artisans",
      ordre: 1
    },
    {
      code: "ARTISANS-GESTION",
      titre: "Artisans Gestion",
      description: "Formations sur la gestion d'entreprise pour artisans",
      ordre: 2
    },
    {
      code: "DEV-WEB",
      titre: "Développement WEB",
      description: "Formations sur le développement web",
      ordre: 3
    },
    {
      code: "ANGLAIS",
      titre: "Anglais",
      description: "Formations en langue anglaise",
      ordre: 4
    }
  ];

  console.log('Début de la création des catégories...');

  // Créer ou mettre à jour chaque catégorie
  for (const categorie of categories) {
    const existingCategorie = await prisma.categorieProgramme.findUnique({
      where: { code: categorie.code }
    });

    if (existingCategorie) {
      console.log(`La catégorie ${categorie.titre} (${categorie.code}) existe déjà.`);
      
      // Mettre à jour si nécessaire
      await prisma.categorieProgramme.update({
        where: { id: existingCategorie.id },
        data: {
          titre: categorie.titre,
          description: categorie.description,
          ordre: categorie.ordre
        }
      });
      console.log(`Catégorie ${categorie.titre} mise à jour.`);
    } else {
      // Créer la catégorie
      const newCategorie = await prisma.categorieProgramme.create({
        data: categorie
      });
      console.log(`Catégorie ${newCategorie.titre} (${newCategorie.code}) créée avec succès!`);
    }
  }

  console.log('Création des catégories terminée!');
}

main()
  .catch((e) => {
    console.error('Erreur lors de la création des catégories:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
