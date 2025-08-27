import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { CategorieFormation } from '../../types/programme';

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

/**
 * Gestionnaire GET pour récupérer toutes les catégories de programmes
 */
export async function GET() {
  try {
    // Récupération des catégories depuis la base de données Prisma
    const categories = await prisma.categorieProgramme.findMany({
      orderBy: {
        ordre: 'asc'
      },
      include: {
        // Inclure le nombre de programmes par catégorie
        _count: {
          select: { programmes: true }
        }
      }
    });

    // Conversion du format Prisma au format de notre application
    const categoriesFormatted: CategorieFormation[] = categories.map(cat => ({
      id: cat.id,
      titre: cat.titre,
      code: cat.code,
      description: cat.description,
      nombreFormations: cat._count.programmes
    }));

    return NextResponse.json(categoriesFormatted);
  } catch (error) {
    console.error('Erreur GET categories-programme:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des catégories' },
      { status: 500 }
    );
  }
}

/**
 * Gestionnaire POST pour créer une nouvelle catégorie
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validation basique
    if (!data.titre) {
      return NextResponse.json(
        { error: 'Le titre de la catégorie est obligatoire' },
        { status: 400 }
      );
    }

    // Vérifier si le code existe déjà
    const code = data.code || data.titre.substring(0, 3).toUpperCase();
    const existingCategorie = await prisma.categorieProgramme.findUnique({
      where: { code }
    });

    if (existingCategorie) {
      return NextResponse.json(
        { error: `Une catégorie avec le code ${code} existe déjà` },
        { status: 409 }
      );
    }
    
    // Création de la catégorie dans la base de données via Prisma
    const nouvelleCategorie = await prisma.categorieProgramme.create({
      data: {
        titre: data.titre,
        code: code,
        description: data.description || '',
        ordre: data.ordre || 0
      }
    });
    
    // Conversion au format de l'application
    const categorieFormatted: CategorieFormation = {
      id: nouvelleCategorie.id,
      titre: nouvelleCategorie.titre,
      code: nouvelleCategorie.code,
      description: nouvelleCategorie.description
    };
    
    return NextResponse.json(categorieFormatted, { status: 201 });
  } catch (error) {
    console.error('Erreur POST categories-programme:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la catégorie' },
      { status: 500 }
    );
  }
}
