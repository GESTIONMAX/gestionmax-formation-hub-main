import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

// Schéma de validation pour les réclamations
const reclamationSchema = z.object({
  // Champs obligatoires
  nom: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  sujet: z.string().min(1, 'Le sujet est requis'),
  message: z.string().min(1, 'Le message est requis'),
  
  // Champs optionnels
  telephone: z.string().nullable().optional(),
  priorite: z.enum(['basse', 'normale', 'haute', 'urgente']).default('normale'),
  statut: z.enum(['nouvelle', 'en_cours', 'resolue', 'fermee']).default('nouvelle'),
  notesInternes: z.string().nullable().optional(),
  dateResolution: z.string().or(z.date()).nullable().optional(),
  assigneeId: z.string().nullable().optional(),
});

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
 * GET - Récupère toutes les réclamations avec filtrage optionnel
 * 
 * Endpoint: /api/reclamations
 * @query {string} statut - Filtrer par statut (optionnel)
 * @query {string} priorite - Filtrer par priorité (optionnel)
 * @query {string} assigneeId - Filtrer par assigné (optionnel)
 * 
 * @returns {Object} Liste des réclamations triées par date de création décroissante
 */
export async function GET(request: NextRequest) {
  try {
    // Extraction des paramètres de requête pour filtrage
    const searchParams = request.nextUrl.searchParams;
    const statut = searchParams.get('statut');
    const priorite = searchParams.get('priorite');
    const assigneeId = searchParams.get('assignee');
    
    // Construction du filtre dynamique
    const where: any = {};
    if (statut) where.statut = statut;
    if (priorite) where.priorite = priorite;
    if (assigneeId) where.assigneeId = assigneeId;
    
    // Récupérer toutes les réclamations avec Prisma et filtrage
    const reclamations = await prisma.reclamation.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Renvoyer les données au format attendu (avec enveloppe data)
    return NextResponse.json({ data: reclamations });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des réclamations:', error);
    return NextResponse.json(
      { error: `Erreur serveur: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * POST - Crée une nouvelle réclamation
 * 
 * Endpoint: /api/reclamations
 * @body {Object} Données de la réclamation à créer
 * 
 * @returns {Object} La réclamation créée
 */
export async function POST(request: NextRequest) {
  try {
    // Récupérer les données du formulaire
    const rawData = await request.json();
    
    // Validation des données avec Zod
    const validationResult = reclamationSchema.safeParse(rawData);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const data = validationResult.data;
    
    // Traitement des données avant création
    const processedData: any = {
      nom: data.nom,
      email: data.email,
      sujet: data.sujet,
      message: data.message,
      telephone: data.telephone || null,
      priorite: data.priorite,
      statut: data.statut || 'nouvelle', // Statut par défaut
      notesInternes: data.notesInternes || null,
      assigneeId: data.assigneeId || null,
      dateResolution: data.dateResolution ? new Date(data.dateResolution) : null,
    };
    
    // Créer la réclamation avec Prisma
    const nouvelleReclamation = await prisma.reclamation.create({
      data: processedData
    });
    
    // Renvoyer la réclamation créée (avec enveloppe data)
    return NextResponse.json({ data: nouvelleReclamation });
  } catch (error: any) {
    console.error('Erreur lors de la création de la réclamation:', error);
    return NextResponse.json(
      { error: `Erreur création: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * PUT - Met à jour une réclamation existante par son ID
 * 
 * Endpoint: /api/reclamations?id=...
 * @param {string} id - ID de la réclamation à mettre à jour (dans le searchParam)
 * @body {Object} Données à mettre à jour
 * @returns {Object} La réclamation mise à jour
 */
export async function PUT(request: NextRequest) {
  try {
    // Récupérer l'ID de la réclamation à mettre à jour
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de la réclamation manquant' },
        { status: 400 }
      );
    }
    
    // Vérifier si la réclamation existe
    const existingReclamation = await prisma.reclamation.findUnique({
      where: { id }
    });
    
    if (!existingReclamation) {
      return NextResponse.json(
        { error: 'Réclamation non trouvée' },
        { status: 404 }
      );
    }
    
    // Récupérer et valider les données du formulaire
    const rawData = await request.json();
    
    // Validation des données avec Zod (partielle pour une mise à jour)
    const validationResult = reclamationSchema.partial().safeParse(rawData);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const data = validationResult.data;
    
    // Traiter la date de résolution si elle est fournie
    const processedData: any = { ...data };
    if (data.dateResolution) {
      processedData.dateResolution = new Date(data.dateResolution);
    }
    
    // Mettre à jour la réclamation
    const updatedReclamation = await prisma.reclamation.update({
      where: { id },
      data: processedData
    });
    
    // Renvoyer la réclamation mise à jour (avec enveloppe data)
    return NextResponse.json({ data: updatedReclamation });
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de la réclamation:', error);
    return NextResponse.json(
      { error: `Erreur mise à jour: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Supprime une réclamation par son ID
 * 
 * Endpoint: /api/reclamations?id=...
 * @param {string} id - ID de la réclamation à supprimer (dans le searchParam)
 * @returns {Object} Confirmation de suppression
 */
export async function DELETE(request: NextRequest) {
  try {
    // Récupérer l'ID de la réclamation à supprimer
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de la réclamation manquant' },
        { status: 400 }
      );
    }
    
    // Vérifier si la réclamation existe
    const existingReclamation = await prisma.reclamation.findUnique({
      where: { id }
    });
    
    if (!existingReclamation) {
      return NextResponse.json(
        { error: 'Réclamation non trouvée' },
        { status: 404 }
      );
    }
    
    // Supprimer la réclamation
    await prisma.reclamation.delete({
      where: { id }
    });
    
    // Renvoyer la confirmation (avec enveloppe success)
    return NextResponse.json({ success: true, message: 'Réclamation supprimée avec succès' });
  } catch (error: any) {
    console.error('Erreur lors de la suppression de la réclamation:', error);
    return NextResponse.json(
      { error: `Erreur suppression: ${error.message}` },
      { status: 500 }
    );
  }
}
