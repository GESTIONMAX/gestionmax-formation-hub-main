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
 * Gestionnaire GET pour récupérer tous les programmes de formation
 * Supporte les filtres via query params:
 * - categorie: filtre par ID de catégorie
 * - actif: filtre par état actif/inactif (true/false)
 * - visible: filtre par visibilité (true/false)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorieId = searchParams.get('categorie');
    const estActif = searchParams.get('actif') === 'true';
    const estVisible = searchParams.get('visible') !== 'false'; // Par défaut true
    const query = searchParams.get('q') || '';
    
    const where: any = {};
    
    // Filtres
    if (categorieId) {
      where.categorieId = categorieId;
    }
    
    // Par défaut, on récupère uniquement les programmes actifs
    where.estActif = estActif || true;
    
    // Par défaut, on récupère uniquement les programmes visibles
    where.estVisible = estVisible;
    
    // Recherche textuelle
    if (query) {
      where.OR = [
        { titre: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { code: { contains: query, mode: 'insensitive' } },
      ];
    }
    
    const programmes = await prisma.programmeFormation.findMany({
      where,
      orderBy: {
        titre: 'asc'
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

    // Conversion du format Prisma au format de notre application
    const programmesFormatted: ProgrammeFormation[] = programmes.map(prog => ({
      id: prog.id,
      code: prog.code,
      titre: prog.titre,
      description: prog.description,
      type: prog.type as 'catalogue' | 'sur-mesure',
      niveau: prog.niveau,
      participants: prog.participants,
      duree: prog.duree,
      prix: prog.prix,
      objectifs: prog.objectifs,
      prerequis: prog.prerequis,
      modalites: prog.modalites,
      programmeUrl: prog.programmeUrl,
      categorie: prog.categorie ? {
        id: prog.categorie.id,
        titre: prog.categorie.titre,
        code: prog.categorie.code
      } : undefined
    }));

    return NextResponse.json(programmesFormatted);
  } catch (error) {
    console.error('Erreur GET programmes:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des programmes' },
      { status: 500 }
    );
  }
}

/**
 * Gestionnaire GET pour récupérer un programme de formation spécifique par ID
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validation des données
    if (!data.titre || !data.description || !data.type) {
      return NextResponse.json(
        { error: 'Données invalides. Titre, description et type sont obligatoires.' },
        { status: 400 }
      );
    }
    
    // Création du programme dans la base de données
    const nouveauProgramme = await prisma.programmeFormation.create({
      data: {
        code: data.code || `FORM-${Date.now().toString().slice(-6)}`,
        titre: data.titre,
        description: data.description,
        type: data.type,
        duree: data.duree || '7h',
        prix: data.prix || 'Sur devis',
        niveau: data.niveau || 'Tous niveaux',
        participants: data.participants || 'Tout public',
        objectifs: data.objectifs || [],
        prerequis: data.prerequis || 'Aucun prérequis spécifique',
        modalites: data.modalites || 'Présentiel individuel',
        categorieId: data.categorieId,
        estActif: true,
        estVisible: data.estVisible !== false,
        publicConcerne: data.publicConcerne || 'Tout public',
        contenuDetailleJours: data.contenuDetailleJours || '',
        modalitesAcces: data.modalitesAcces || 'Formation accessible dès acceptation du devis',
        modalitesTechniques: data.modalitesTechniques || 'Ordinateur et connexion internet requis',
        formateurId: data.formateurId,
        formateur: data.formateur || 'Aurélien Lien'
      }
    });
    
    return NextResponse.json(nouveauProgramme, { status: 201 });
  } catch (error) {
    console.error('Erreur POST programmes:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création du programme' },
      { status: 500 }
    );
  }
}
