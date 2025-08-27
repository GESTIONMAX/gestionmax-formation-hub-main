"use client";

import { ReactNode, useEffect } from 'react';

export function BodyAttributes({ children }: { children: ReactNode }) {
  // Tous les effets liés aux attributs du body sont gérés ici,
  // côté client uniquement, pour éviter les problèmes d'hydratation

  // Le useEffect garantit que le code ne s'exécute qu'une fois le DOM monté,
  // évitant ainsi les problèmes d'hydration liés aux différences serveur/client
  useEffect(() => {
    // Si nécessaire, ajoutez ici des attributs ou classes au body
    // Exemple : document.body.classList.add('custom-class');
    
    return () => {
      // Nettoyage si nécessaire
    };
  }, []);

  return <>{children}</>;
}
