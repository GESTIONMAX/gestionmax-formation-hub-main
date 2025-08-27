import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

// Schéma de validation pour les compétences
const competenceSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  description: z.string().min(1, 'La description est requise'),
  categorie: z.string().min(1, 'La catégorie est requise'),
  domaineDeveloppement: z.string().min(1, 'Le domaine de développement est requis'),
  niveauActuel: z.number().int().min(0, 'Le niveau actuel doit être positif'),
  objectifNiveau: z.number().int().min(0, 'L\'objectif de niveau doit être positif'),
  statut: z.string().min(1, 'Le statut est requis'),
  actionPrevue: z.string().min(1, 'L\'action prévue est requise'),
  plateformeFomation: z.string().nullable().optional(),
  lienFormation: z.string().nullable().optional(),
  typePreuve: z.string().min(1, 'Le type de preuve est requis'),
  contenuPreuve: z.string().min(1, 'Le contenu de la preuve est requis'),
  formateurId: z.string().nullable().optional(),
});

// Schéma pour les mises à jour (tous les champs sont optionnels)
const competenceUpdateSchema = competenceSchema.partial();

// Initialiser Prisma en singleton pour éviter trop de connexions
const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * GET - Récupère toutes les compétences ou une compétence spécifique par ID
 * 
 * Endpoint: /api/competences
 * @query {string} id - ID de la compétence à récupérer (optionnel)
 * @query {string} categorie - Filtrer par catégorie (optionnel)
 * @query {string} formateurId - Filtrer par formateur (optionnel)
 * @query {string} statut - Filtrer par statut (optionnel)
 * 
 * @returns {Object} Liste des compétences ou compétence spécifique
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const categorie = searchParams.get('categorie');
    const formateurId = searchParams.get('formateurId');
    const statut = searchParams.get('statut');
    
    // Construction du filtre dynamique
    const where: any = {};
    if (id) where.id = id;
    if (categorie) where.categorie = categorie;
    if (formateurId) where.formateurId = formateurId;
    if (statut) where.statut = statut;
    
    // Si un ID est fourni, récupérer une compétence spécifique
    if (id) {
      const competence = await prisma.competence.findUnique({
        where: { id }
      });
      
      if (!competence) {
        return NextResponse.json(
          { error: 'Compétence non trouvée' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ data: competence });
    }
    
    // Sinon, récupérer toutes les compétences avec filtres éventuels
    const competences = await prisma.competence.findMany({
      where,
      orderBy: {
        dateModification: 'desc'
      }
    });
    
    return NextResponse.json({ data: competences });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des compétences:', error);
    return NextResponse.json(
      { error: `Erreur serveur: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * POST - Crée une nouvelle compétence
 * 
 * Endpoint: /api/competences
 * @body {Object} Données de la compétence à créer
 * 
 * @returns {Object} La compétence créée
 */
export async function POST(request: NextRequest) {
  try {
    const rawData = await request.json();
    
    // Validation des données avec Zod
    const validationResult = competenceSchema.safeParse(rawData);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const data = validationResult.data;
    
    // Mapper les champs du formulaire aux champs Prisma
    const competenceData = {
      nom: data.nom,
      description: data.description,
      categorie: data.categorie,
      domaineDeveloppement: data.domaineDeveloppement,
      niveauActuel: data.niveauActuel,
      objectifNiveau: data.objectifNiveau,
      statut: data.statut,
      actionPrevue: data.actionPrevue,
      plateformeFomation: data.plateformeFomation,
      lienFormation: data.lienFormation,
      typePreuve: data.typePreuve,
      contenuPreuve: data.contenuPreuve,
      formateurId: data.formateurId
    };
    
    // Créer la compétence avec Prisma
    const nouvelleCompetence = await prisma.competence.create({
      data: competenceData
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Compétence créée avec succès',
      data: nouvelleCompetence 
    });
  } catch (error: any) {
    console.error('Erreur lors de la création de la compétence:', error);
    return NextResponse.json(
      { error: `Erreur création: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * PUT - Met à jour une compétence existante par son ID
 * 
 * Endpoint: /api/competences?id=...
 * @param {string} id - ID de la compétence à mettre à jour (dans le searchParam)
 * @body {Object} Données à mettre à jour
 * 
 * @returns {Object} La compétence mise à jour
 */
export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de la compétence manquant' },
        { status: 400 }
      );
    }
    
    // Vérifier si la compétence existe
    const existingCompetence = await prisma.competence.findUnique({
      where: { id }
    });
    
    if (!existingCompetence) {
      return NextResponse.json(
        { error: 'Compétence non trouvée' },
        { status: 404 }
      );
    }
    
    const rawData = await request.json();
    
    // Validation des données avec Zod (partielle pour une mise à jour)
    const validationResult = competenceUpdateSchema.safeParse(rawData);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const data = validationResult.data;
    
    // Mettre à jour la compétence avec Prisma
    const updatedCompetence = await prisma.competence.update({
      where: { id },
      data
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Compétence mise à jour avec succès',
      data: updatedCompetence 
    });
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de la compétence:', error);
    return NextResponse.json(
      { error: `Erreur mise à jour: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Supprime une compétence par son ID
 * 
 * Endpoint: /api/competences?id=...
 * @param {string} id - ID de la compétence à supprimer (dans le searchParam)
 * 
 * @returns {Object} Confirmation de suppression
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de la compétence manquant' },
        { status: 400 }
      );
    }
    
    // Vérifier si la compétence existe
    const existingCompetence = await prisma.competence.findUnique({
      where: { id }
    });
    
    if (!existingCompetence) {
      return NextResponse.json(
        { error: 'Compétence non trouvée' },
        { status: 404 }
      );
    }
    
    // Supprimer la compétence
    await prisma.competence.delete({
      where: { id }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Compétence supprimée avec succès' 
    });
  } catch (error: any) {
    console.error('Erreur lors de la suppression de la compétence:', error);
    return NextResponse.json(
      { error: `Erreur suppression: ${error.message}` },
      { status: 500 }
    );
  }
}
