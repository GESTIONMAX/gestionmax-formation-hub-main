"use client";

import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '../../../components/ui/alert';
import { Check, AlertCircle, RefreshCw } from 'lucide-react';

export default function AddCategoriesPage() {
  const [loading, setLoading] = useState(false);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [result, setResult] = useState<{ success: string[] | null; errors: string[] | null }>({
    success: null,
    errors: null
  });

  // Charger les catégories existantes au chargement de la page
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories-programme');
        const data = await response.json();
        const existingCodes = data.map((cat: any) => cat.code);
        const existingTitles = data.map((cat: any) => cat.titre);
        setExistingCategories([...existingCodes, ...existingTitles]);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);

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

  // Vérifier si une catégorie existe déjà (par code ou titre)
  const categoryExists = (category: { titre: string, code: string }) => {
    return existingCategories.includes(category.code) || 
           existingCategories.includes(category.titre);
  };

  const handleAddCategories = async () => {
    setLoading(true);
    const success: string[] = [];
    const errors: string[] = [];

    try {
      // Filtrer les catégories qui n'existent pas encore
      const categoriesToCreate = categoriesToAdd.filter(cat => !categoryExists(cat));
      
      // Si toutes les catégories existent déjà
      if (categoriesToCreate.length === 0) {
        setResult({
          success: null,
          errors: ['Toutes les catégories existent déjà dans la base de données.']
        });
        setLoading(false);
        return;
      }
      
      for (const categorie of categoriesToCreate) {
        try {
          const response = await fetch('/api/categories-programme', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(categorie),
          });

          const data = await response.json();

          if (response.ok) {
            success.push(`Catégorie "${categorie.titre}" ajoutée avec succès.`);
            // Ajouter aux catégories existantes pour éviter les doublons pendant cette session
            setExistingCategories(prev => [...prev, categorie.code, categorie.titre]);
          } else {
            errors.push(`Erreur lors de l'ajout de "${categorie.titre}": ${data.error || 'Erreur inconnue'}`);
          }
        } catch (error) {
          console.error(`Erreur pour ${categorie.titre}:`, error);
          errors.push(`Erreur technique pour "${categorie.titre}": ${(error as Error).message}`);
        }
      }
      
      // Signaler les catégories qui existaient déjà
      const existingOnes = categoriesToAdd.filter(cat => categoryExists(cat));
      if (existingOnes.length > 0) {
        errors.push(`${existingOnes.length} catégorie(s) existai(en)t déjà et n'ont pas été créée(s): ${existingOnes.map(c => c.titre).join(', ')}`);
      }

      setResult({
        success: success.length > 0 ? success : null,
        errors: errors.length > 0 ? errors : null
      });
    } catch (error) {
      console.error('Erreur globale:', error);
      setResult({
        success: null,
        errors: ['Erreur technique lors de l\'exécution: ' + (error as Error).message]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Ajouter les catégories manquantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Cette page va ajouter les catégories suivantes à votre système :</p>
          
          <ul className="list-disc pl-5 space-y-2">
            {categoriesToAdd.map((cat, index) => (
              <li key={index}>
                <strong>{cat.titre}</strong> (Code: {cat.code}) - {cat.description}
              </li>
            ))}
          </ul>

          <Button 
            onClick={handleAddCategories} 
            disabled={loading || loadingCategories}
            className="mt-4"
          >
            {loadingCategories ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin mr-2" /> 
                Chargement des catégories...
              </>
            ) : loading ? (
              'Ajout en cours...'
            ) : (
              'Ajouter ces catégories'
            )}
          </Button>

          {result.success && (
            <Alert variant="default" className="bg-green-50 border-green-200 mt-4">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle>Succès</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 mt-2">
                  {result.success.map((msg, index) => (
                    <li key={index}>{msg}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {result.errors && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erreurs</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 mt-2">
                  {result.errors.map((msg, index) => (
                    <li key={index}>{msg}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
