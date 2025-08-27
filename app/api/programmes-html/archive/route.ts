import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * @route POST /api/programmes-html/archive
 * @description Archive un template HTML en le copiant dans un répertoire d'archives Sur-mesure
 * @access Public
 * @param {Object} request - Objet de requête contenant le chemin source du template et les métadonnées du programme
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sourcePath, programmeId, programmeTitle } = body;

    if (!sourcePath || !programmeId) {
      return NextResponse.json(
        { error: 'Le chemin source et l\'ID du programme sont requis' },
        { status: 400 }
      );
    }

    // Construire les chemins source et destination
    const sourceFullPath = path.join(process.cwd(), 'public', sourcePath);
    
    // Créer le répertoire d'archives s'il n'existe pas
    const archiveDir = path.join(process.cwd(), 'public', 'programmes', 'archives-sur-mesure');
    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true });
    }

    // Générer un nom de fichier unique pour l'archive basé sur l'ID du programme et un timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${programmeId}-${timestamp}.html`;
    const destPath = path.join(archiveDir, fileName);
    
    // Vérifier si le fichier source existe
    if (!fs.existsSync(sourceFullPath)) {
      console.error(`Template source introuvable: ${sourceFullPath}`);
      return NextResponse.json(
        { error: 'Template source introuvable' },
        { status: 404 }
      );
    }

    // Copier le fichier
    fs.copyFileSync(sourceFullPath, destPath);
    
    // Chemin relatif pour stocker dans la base de données
    const relativePath = `/programmes/archives-sur-mesure/${fileName}`;
    
    console.log(`Template archivé avec succès: ${relativePath}`);
    
    return NextResponse.json({
      success: true,
      archivedPath: relativePath,
      message: 'Template HTML archivé avec succès'
    });
    
  } catch (error) {
    console.error('Erreur lors de l\'archivage du template HTML:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'archivage du template HTML' },
      { status: 500 }
    );
  }
}
