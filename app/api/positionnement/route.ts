import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

// Schéma de validation pour les demandes de positionnement
const positionnementSchema = z.object({
  // Champs obligatoires selon le modèle Prisma
  nom: z.string().min(1, 'Le nom est requis'),
  prenom: z.string().min(1, 'Le prénom est requis'),
  email: z.string().email('Email invalide'),
  dateDispo: z.string().min(1, 'La disponibilité est requise'),
  attentes: z.string().min(1, 'Les attentes sont requises'),
  situationActuelle: z.string().min(1, 'La situation actuelle est requise'),
  pratiqueActuelle: z.string().min(1, 'La pratique actuelle est requise'),
  
  // Champs optionnels
  telephone: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
  formation: z.string().nullable().optional(),
  entreprise: z.string().nullable().optional(),
  hasHandicap: z.boolean().optional(),
  detailsHandicap: z.string().nullable().optional(),
  besoinHandicap: z.string().nullable().optional(),
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
 * GET - Récupère toutes les demandes de positionnement
 * 
 * Endpoint: /api/positionnement
 * @query {string} statut - Filtrer par statut (optionnel)
 * 
 * @returns {Object} Liste des demandes de positionnement triées par date de création décroissante
 */
export async function GET(request: NextRequest) {
  try {
    // Extraction des paramètres de requête pour filtrage
    const searchParams = request.nextUrl.searchParams;
    const statut = searchParams.get('statut');
    
    // Construction du filtre dynamique
    const where: any = {};
    if (statut) where.statut = statut;
    
    // Récupérer toutes les demandes de positionnement avec Prisma
    const positionnements = await prisma.positionnementRequest.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Renvoyer les données dans le format attendu par le hook
    return NextResponse.json({ data: positionnements });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des demandes de positionnement:', error);
    return NextResponse.json(
      { error: `Erreur serveur: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * POST - Crée une nouvelle demande de positionnement
 * 
 * Endpoint: /api/positionnement
 * @body {Object} Données de la demande de positionnement à créer
 * 
 * @returns {Object} La demande de positionnement créée
 */
export async function POST(request: NextRequest) {
  try {
    // Récupérer les données du formulaire
    const rawData = await request.json();
    
    // Validation des données avec Zod
    const validationResult = positionnementSchema.safeParse(rawData);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const data = validationResult.data;
    
    // Préparer les données pour Prisma avec tous les champs requis
    const processedData = {
      // Champs obligatoires
      nomBeneficiaire: data.nom,
      prenomBeneficiaire: data.prenom,
      emailBeneficiaire: data.email,
      dateDispo: data.dateDispo,
      attentes: data.attentes,
      situationActuelle: data.situationActuelle,
      pratiqueActuelle: data.pratiqueActuelle,
      
      // Champs optionnels avec valeurs par défaut
      telephoneBeneficiaire: data.telephone || null,
      commentaires: data.message || null,
      formationSelectionnee: data.formation || null,
      entreprise: data.entreprise || null,
      statut: 'nouvelle',
      
      // Champs pour le handicap
      hasHandicap: data.hasHandicap || false,
      detailsHandicap: data.detailsHandicap || null,
      besoinHandicap: data.besoinHandicap || null,
    };
    
    // Créer la demande de positionnement avec Prisma
    const nouveauPositionnement = await prisma.positionnementRequest.create({
      data: processedData
    });
    
    // Renvoyer la demande créée dans le format attendu par le hook
    return NextResponse.json({ data: nouveauPositionnement });
  } catch (error: any) {
    console.error('Erreur lors de la création de la demande de positionnement:', error);
    return NextResponse.json(
      { error: `Erreur création: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * PUT - Met à jour une demande de positionnement existante par son ID
 * 
 * Endpoint: /api/positionnement?id=...
 * @param {string} id - ID de la demande à mettre à jour (dans le searchParam)
 * @body {Object} Données à mettre à jour
 * @returns {Object} La demande mise à jour
 */
export async function PUT(request: NextRequest) {
  try {
    // Récupérer l'ID de la demande à mettre à jour
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de la demande manquant' },
        { status: 400 }
      );
    }
    
    // Vérifier si la demande existe
    const existingDemande = await prisma.positionnementRequest.findUnique({
      where: { id }
    });
    
    if (!existingDemande) {
      return NextResponse.json(
        { error: 'Demande de positionnement non trouvée' },
        { status: 404 }
      );
    }
    
    // Récupérer et valider les données du formulaire
    const rawData = await request.json();
    
    // Validation des données avec Zod (partielle pour une mise à jour)
    const validationResult = positionnementSchema.partial().safeParse(rawData);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const data = validationResult.data;
    
    // Préparer les données pour la mise à jour
    const updateData: any = {};
    
    // Mapper les champs du formulaire vers les champs Prisma
    if (data.nom) updateData.nomBeneficiaire = data.nom;
    if (data.prenom) updateData.prenomBeneficiaire = data.prenom;
    if (data.email) updateData.emailBeneficiaire = data.email;
    if (data.telephone) updateData.telephoneBeneficiaire = data.telephone;
    if (data.message) updateData.commentaires = data.message;
    if (data.formation) updateData.formationSelectionnee = data.formation;
    if (data.entreprise) updateData.entreprise = data.entreprise;
    if (data.dateDispo) updateData.dateDispo = data.dateDispo;
    if (data.attentes) updateData.attentes = data.attentes;
    if (data.situationActuelle) updateData.situationActuelle = data.situationActuelle;
    if (data.pratiqueActuelle) updateData.pratiqueActuelle = data.pratiqueActuelle;
    if (data.hasHandicap !== undefined) updateData.hasHandicap = data.hasHandicap;
    if (data.detailsHandicap) updateData.detailsHandicap = data.detailsHandicap;
    if (data.besoinHandicap) updateData.besoinHandicap = data.besoinHandicap;
    
    // Mettre à jour la demande
    const updatedDemande = await prisma.positionnementRequest.update({
      where: { id },
      data: updateData
    });
    
    // Renvoyer la demande mise à jour
    return NextResponse.json({ data: updatedDemande });
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de la demande:', error);
    return NextResponse.json(
      { error: `Erreur mise à jour: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Supprime une demande de positionnement par son ID
 * 
 * Endpoint: /api/positionnement?id=...
 * @param {string} id - ID de la demande à supprimer (dans le searchParam)
 * @returns {Object} Confirmation de suppression
 */
export async function DELETE(request: NextRequest) {
  try {
    // Récupérer l'ID de la demande à supprimer
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID de la demande manquant' },
        { status: 400 }
      );
    }
    
    // Vérifier si la demande existe
    const existingDemande = await prisma.positionnementRequest.findUnique({
      where: { id }
    });
    
    if (!existingDemande) {
      return NextResponse.json(
        { error: 'Demande de positionnement non trouvée' },
        { status: 404 }
      );
    }
    
    // Supprimer la demande
    await prisma.positionnementRequest.delete({
      where: { id }
    });
    
    // Renvoyer la confirmation
    return NextResponse.json({ success: true, message: 'Demande de positionnement supprimée avec succès' });
  } catch (error: any) {
    console.error('Erreur lors de la suppression de la demande:', error);
    return NextResponse.json(
      { error: `Erreur suppression: ${error.message}` },
      { status: 500 }
    );
  }
}
