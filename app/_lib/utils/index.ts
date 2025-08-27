// app/_lib/utils/index.ts
// Exportez tous les utilitaires pour un import simplifié

// Exportez les modules réellement présents
export * from './documentGenerator';
export * from './typeAdapters';
export * from './pdfGenerator';
export * from './csvExport';

// Fonction utilitaire pour combiner des classes conditionnelles (utilisée par shadcn/ui)
export function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
