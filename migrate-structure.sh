#!/bin/bash

# Script de migration vers la structure domain-driven
# Usage: ./migrate-structure.sh

echo "🚀 Début de la migration vers la structure standardisée..."

# Fonction pour créer les barrels d'un domaine
create_domain_barrels() {
  local domain=$1
  
  echo "📦 Création des barrels pour le domaine $domain..."
  
  # Barrel principal du domaine
  cat > "app/$domain/index.ts" << EOF
// Export principal du domaine $domain
export * from './components';
export * from './hooks';
export * from './types';
export * from './utils';
EOF

  # Barrel des composants
  cat > "app/$domain/components/index.ts" << EOF
// Export des composants du domaine $domain
// Ajoutez vos exports ici
EOF

  # Barrel des hooks
  cat > "app/$domain/hooks/index.ts" << EOF
// Export des hooks du domaine $domain
// Ajoutez vos exports ici
EOF

  # Barrel des types
  cat > "app/$domain/types/index.ts" << EOF
// Export des types du domaine $domain
// Ajoutez vos exports ici
EOF

  # Barrel des utils
  cat > "app/$domain/utils/index.ts" << EOF
// Export des utilitaires du domaine $domain
// Ajoutez vos exports ici
EOF
}

# Fonction pour migrer un composant vers un domaine
migrate_component() {
  local component=$1
  local domain=$2
  local destination="app/$domain/components"
  
  echo "➡️  Migration de $component vers $domain..."
  
  # Créer le dossier de destination si nécessaire
  mkdir -p "$destination"
  
  # Déplacer le composant
  if [ -d "app/components/$component" ]; then
    mv "app/components/$component" "$destination/"
  elif [ -f "app/components/$component.tsx" ]; then
    mv "app/components/$component.tsx" "$destination/"
  else
    echo "⚠️  $component non trouvé dans app/components/"
  fi
  
  # Ajouter l'export au barrel des composants
  local component_name=$(basename "$component" .tsx)
  component_name=${component_name##*/}  # Extrait juste le nom du fichier, pas le chemin
  echo "export { default as $component_name } from './$component_name';" >> "$destination/index.ts"
}

# Fonction pour migrer un hook vers un domaine
migrate_hook() {
  local hook=$1
  local domain=$2
  local destination="app/$domain/hooks"
  
  echo "➡️  Migration du hook $hook vers $domain..."
  
  # Créer le dossier de destination si nécessaire
  mkdir -p "$destination"
  
  # Déplacer le hook
  if [ -f "app/_lib/hooks/$hook.ts" ]; then
    mv "app/_lib/hooks/$hook.ts" "$destination/"
  else
    echo "⚠️  $hook non trouvé dans app/_lib/hooks/"
  fi
  
  # Ajouter l'export au barrel des hooks
  local hook_name=$(basename "$hook" .ts)
  echo "export { default as $hook_name } from './$hook_name';" >> "$destination/index.ts"
}

# Fonction pour mettre à jour les imports
update_imports() {
  local domain=$1
  local old_path=$2
  local new_path=$3
  
  echo "🔄 Mise à jour des imports pour $domain..."
  
  # Mettre à jour les imports dans tous les fichiers TS/TSX
  find app -name "*.ts" -o -name "*.tsx" | xargs grep -l "$old_path" | xargs sed -i \
    -e "s|from '$old_path|from '$new_path|g" \
    -e "s|from \"$old_path|from \"$new_path|g" 2>/dev/null || true
}

# Créer la structure pour les domaines existants
domains=("formations" "rendez-vous")
for domain in "${domains[@]}"; do
  mkdir -p "app/$domain/components"
  mkdir -p "app/$domain/hooks"
  mkdir -p "app/$domain/types"
  mkdir -p "app/$domain/utils"
  create_domain_barrels "$domain"
done

# Migrer les composants de formations
migrate_component "formations/FormationsList" "formations"
migrate_component "formations/FormationForm_new" "formations"
migrate_component "formations/ProgrammeFormEnhanced" "formations"
migrate_component "formations/ProgrammeListEnhanced" "formations"
migrate_component "formations/ProgrammeForm" "formations"

# Migrer les composants de rendez-vous
migrate_component "rendez-vous/RendezVousListUnified" "rendez-vous"
migrate_component "rendez-vous/CompteRenduAvanceForm" "rendez-vous"
migrate_component "rendez-vous/RendezvousFormUnified" "rendez-vous"
migrate_component "rendez-vous/ProgrammePersonnaliseForm" "rendez-vous"

# Mettre à jour les imports
update_imports "formations" "app/components/formations" "app/formations/components"
update_imports "rendez-vous" "app/components/rendez-vous" "app/rendez-vous/components"

# Mettre à jour les imports des barrels
update_imports "formations-barrel" "@/components/formations" "@/formations"
update_imports "rendez-vous-barrel" "@/components/rendez-vous" "@/rendez-vous"

echo "✅ Migration terminée!"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Vérifier manuellement les imports mis à jour"
echo "2. Exécuter les tests pour s'assurer qu'il n'y a pas de régressions"
echo "3. Ajouter les hooks, types et utils spécifiques à chaque domaine"
echo "4. Mettre à jour la documentation de la nouvelle structure"
