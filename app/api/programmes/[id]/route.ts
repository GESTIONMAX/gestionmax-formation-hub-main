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

/**
 * Gestionnaire GET pour récupérer un programme de formation spécifique par ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID du programme non spécifié' },
        { status: 400 }
      );
    }

    const programme = await prisma.programmeFormation.findUnique({
      where: { id },
      include: {
        categorie: {
          select: {
            id: true,
            titre: true,
            code: true
          }
        }
      }
    });

    if (!programme) {
      return NextResponse.json(
        { error: 'Programme non trouvé' },
        { status: 404 }
      );
    }

    // Conversion du format Prisma au format de notre application
    const programmeFormatted: ProgrammeFormation = {
      id: programme.id,
      code: programme.code,
      titre: programme.titre,
      description: programme.description,
      type: programme.type as 'catalogue' | 'sur-mesure',
      niveau: programme.niveau,
      participants: programme.participants,
      duree: programme.duree,
      prix: programme.prix,
      objectifs: programme.objectifs,
      prerequis: programme.prerequis,
      modalites: programme.modalites,
      programmeUrl: programme.programmeUrl,
      categorie: programme.categorie ? {
        id: programme.categorie.id,
        titre: programme.categorie.titre,
        code: programme.categorie.code
      } : undefined,
      tauxParticipation: '100%', // À remplacer par une vraie donnée si disponible
      tauxReussite: '95%' // À remplacer par une vraie donnée si disponible
    };

    return NextResponse.json(programmeFormatted);
  } catch (error) {
    console.error('Erreur GET programme par ID:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération du programme' },
      { status: 500 }
    );
  }
}

/**
 * Gestionnaire PUT pour mettre à jour un programme de formation
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID du programme non spécifié' },
        { status: 400 }
      );
    }

    const programme = await prisma.programmeFormation.findUnique({
      where: { id }
    });

    if (!programme) {
      return NextResponse.json(
        { error: 'Programme non trouvé' },
        { status: 404 }
      );
    }

    const programmeModifie = await prisma.programmeFormation.update({
      where: { id },
      data: {
        titre: data.titre || programme.titre,
        description: data.description || programme.description,
        duree: data.duree || programme.duree,
        prix: data.prix || programme.prix,
        niveau: data.niveau || programme.niveau,
        participants: data.participants || programme.participants,
        objectifs: data.objectifs || programme.objectifs,
        prerequis: data.prerequis || programme.prerequis,
        modalites: data.modalites || programme.modalites,
        estActif: data.estActif !== undefined ? data.estActif : programme.estActif,
        estVisible: data.estVisible !== undefined ? data.estVisible : programme.estVisible,
        categorieId: data.categorieId || programme.categorieId,
        programmeUrl: data.programmeUrl || programme.programmeUrl,
        dateModification: new Date()
      },
      include: {
        categorie: {
          select: {
            id: true,
            titre: true,
            code: true
          }
        }
      }
    });

    return NextResponse.json(programmeModifie);
  } catch (error) {
    console.error('Erreur PUT programme par ID:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour du programme' },
      { status: 500 }
    );
  }
}

/**
 * Gestionnaire DELETE pour supprimer un programme de formation
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID du programme non spécifié' },
        { status: 400 }
      );
    }

    // Vérifier si le programme existe
    const programme = await prisma.programmeFormation.findUnique({
      where: { id }
    });

    if (!programme) {
      return NextResponse.json(
        { error: 'Programme non trouvé' },
        { status: 404 }
      );
    }

    // Au lieu de supprimer définitivement, on peut désactiver le programme
    await prisma.programmeFormation.update({
      where: { id },
      data: {
        estActif: false,
        estVisible: false
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE programme par ID:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression du programme' },
      { status: 500 }
    );
  }
}
