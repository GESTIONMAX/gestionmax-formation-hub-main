import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

// Schéma de validation pour les rendez-vous
const rendezvousSchema = z.object({
  // Champs obligatoires
  type: z.enum(['positionnement', 'suivi', 'bilan', 'accompagnement']).default('positionnement'),
  status: z.enum(['nouveau', 'planifie', 'realise', 'annule']).default('nouveau'),
  prenom: z.string().min(1, 'Le prénom est requis'),
  nom: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  
  // Champs optionnels
  telephone: z.string().nullable().optional(),
  objectifs: z.array(z.string()).default([]),
  niveau: z.string().nullable().optional(),
  formationTitre: z.string().nullable().optional(),
  formationSelectionnee: z.string().nullable().optional(),
  entreprise: z.string().nullable().optional(),
  dateRdv: z.string().or(z.date()).nullable().optional(),
  
  // Informations additionnelles
  synthese: z.string().nullable().optional(),
  commentaires: z.string().nullable().optional(),
  canal: z.enum(['visio', 'telephone', 'presentiel']).default('visio'),
  
  // Relations
  programmeFormationId: z.string().nullable().optional(),
  formationId: z.string().nullable().optional(),
  beneficiaireId: z.string().nullable().optional(),
  
  // Financement
  isFinancement: z.boolean().optional(),
  typeFinancement: z.string().nullable().optional(),
  organismeFinanceur: z.string().nullable().optional(),
  
  // Handicap
  hasHandicap: z.boolean().optional(),
  detailsHandicap: z.string().nullable().optional(),
  besoinHandicap: z.string().nullable().optional(),
  
  // Entreprise
  nomEntreprise: z.string().nullable().optional(),
  siret: z.string().nullable().optional(),
  adresseEntreprise: z.string().nullable().optional(),
  interlocuteurNom: z.string().nullable().optional(),
  interlocuteurEmail: z.string().nullable().optional(),
  interlocuteurTelephone: z.string().nullable().optional(),
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
 * GET - Récupère tous les rendez-vous
 * 
 * Endpoint: /api/rendezvous
 * 
 * @returns {Object} Liste des rendez-vous triés par date de création décroissante
 */
export async function GET(request: NextRequest) {
  try {
    // Extraction des paramètres de requête pour filtrage
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const beneficiaireId = searchParams.get('beneficiaire');
    const formationId = searchParams.get('formation');
    
    // Construction du filtre dynamique
    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;
    if (beneficiaireId) where.beneficiaireId = beneficiaireId;
    if (formationId) where.formationId = formationId;
    
    // Récupération des rendez-vous avec filtres et inclusion des relations
    const rendezvous = await prisma.rendezvous.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        // Inclure les relations selon le schéma Prisma (si elles existent)
        // programmeFormation: true,
        // beneficiaire: true,
      }
    });
    
    // Renvoyer les données dans le format attendu
    return NextResponse.json({ data: rendezvous });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des rendez-vous:', error);
    return NextResponse.json(
      { error: `Erreur serveur: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * POST - Crée un nouveau rendez-vous
 * 
 * Endpoint: /api/rendezvous
 * 
 * @body {Object} Données du rendez-vous à créer
 * 
 * @returns {Object} Le rendez-vous créé
 */
export async function POST(request: NextRequest) {
  try {
    // Récupérer et valider les données du formulaire
    const rawData = await request.json();
    
    // Validation des données avec Zod
    const validationResult = rendezvousSchema.safeParse(rawData);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const data = validationResult.data;
    
    // Traitement des données avant création
    const processedData: any = {
      // Champs obligatoires
      type: data.type,
      status: data.status,
      prenom: data.prenom,
      nom: data.nom,
      email: data.email,
      
      // Champs optionnels 
      telephone: data.telephone || null,
      objectifs: data.objectifs || [],
      niveau: data.niveau || null,
      formationTitre: data.formationTitre || null,
      formationSelectionnee: data.formationSelectionnee || null,
      synthese: data.synthese || null,
      commentaires: data.commentaires || null,
      canal: data.canal,
      
      // Date de rendez-vous (conversion si nécessaire)
      dateRdv: data.dateRdv ? new Date(data.dateRdv) : null,
    };
    
    // Traitement des champs conditionnels
    if (data.hasHandicap) {
      processedData.hasHandicap = data.hasHandicap;
      processedData.detailsHandicap = data.detailsHandicap;
      processedData.besoinHandicap = data.besoinHandicap;
    }
    
    if (data.isFinancement) {
      processedData.isFinancement = data.isFinancement;
      processedData.typeFinancement = data.typeFinancement;
      processedData.organismeFinanceur = data.organismeFinanceur;
    }
    
    if (data.nomEntreprise) {
      processedData.nomEntreprise = data.nomEntreprise;
      processedData.siret = data.siret;
      processedData.adresseEntreprise = data.adresseEntreprise;
      processedData.interlocuteurNom = data.interlocuteurNom;
      processedData.interlocuteurEmail = data.interlocuteurEmail;
      processedData.interlocuteurTelephone = data.interlocuteurTelephone;
    }
    
    // Gestion des relations (si présentes)
    if (data.programmeFormationId) {
      processedData.programmeFormationId = data.programmeFormationId;
    }
    
    if (data.beneficiaireId) {
      processedData.beneficiaireId = data.beneficiaireId;
    }
    
    if (data.formationId) {
      processedData.formationId = data.formationId;
    }
    
    // Créer le rendez-vous avec Prisma
    const nouveauRendezvous = await prisma.rendezvous.create({
      data: processedData
    });
    
    // Renvoyer le rendez-vous créé 
    return NextResponse.json({ data: nouveauRendezvous });
  } catch (error: any) {
    console.error('Erreur lors de la création du rendez-vous:', error);
    return NextResponse.json(
      { error: `Erreur création: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * PUT - Met à jour un rendez-vous existant par son ID
 * 
 * Endpoint: /api/rendezvous
 * @param {string} id - ID du rendez-vous à mettre à jour (dans le searchParam)
 * @body {Object} Données à mettre à jour
 * @returns {Object} Le rendez-vous mis à jour
 */
export async function PUT(request: NextRequest) {
  try {
    // Récupérer l'ID du rendez-vous à mettre à jour
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID du rendez-vous manquant' },
        { status: 400 }
      );
    }
    
    // Vérifier si le rendez-vous existe
    const existingRendezvous = await prisma.rendezvous.findUnique({
      where: { id }
    });
    
    if (!existingRendezvous) {
      return NextResponse.json(
        { error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }
    
    // Récupérer et valider les données du formulaire
    const rawData = await request.json();
    
    // Validation des données avec Zod (partielle pour une mise à jour)
    const validationResult = rendezvousSchema.partial().safeParse(rawData);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const data = validationResult.data;
    
    // Traiter la date si elle est fournie
    const processedData: any = { ...data };
    if (data.dateRdv) {
      processedData.dateRdv = new Date(data.dateRdv);
    }
    
    // Mettre à jour le rendez-vous
    const updatedRendezvous = await prisma.rendezvous.update({
      where: { id },
      data: processedData
    });
    
    // Renvoyer le rendez-vous mis à jour
    return NextResponse.json({ data: updatedRendezvous });
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du rendez-vous:', error);
    return NextResponse.json(
      { error: `Erreur mise à jour: ${error.message}` },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Supprime un rendez-vous par son ID
 * 
 * Endpoint: /api/rendezvous
 * @param {string} id - ID du rendez-vous à supprimer (dans le searchParam)
 * @returns {Object} Confirmation de suppression
 */
export async function DELETE(request: NextRequest) {
  try {
    // Récupérer l'ID du rendez-vous à supprimer
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID du rendez-vous manquant' },
        { status: 400 }
      );
    }
    
    // Vérifier si le rendez-vous existe
    const existingRendezvous = await prisma.rendezvous.findUnique({
      where: { id }
    });
    
    if (!existingRendezvous) {
      return NextResponse.json(
        { error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }
    
    // Supprimer le rendez-vous
    await prisma.rendezvous.delete({
      where: { id }
    });
    
    // Renvoyer la confirmation
    return NextResponse.json({ success: true, message: 'Rendez-vous supprimé avec succès' });
  } catch (error: any) {
    console.error('Erreur lors de la suppression du rendez-vous:', error);
    return NextResponse.json(
      { error: `Erreur suppression: ${error.message}` },
      { status: 500 }
    );
  }
}
