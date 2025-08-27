const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Extensions à traiter
const extensions = ['.tsx', '.ts', '.jsx', '.js'];

// Motifs de remplacement
const replacements = [
  {
    // Remplacer @/hooks/ par les imports relatifs vers _lib/hooks/
    pattern: /(["'])@\/hooks\/([^"']+)(["'])/g,
    getPath: (filePath, match, matchPath) => {
      const basePath = path.dirname(filePath);
      const targetPath = path.join(process.cwd(), 'app', '_lib', 'hooks');
      const relativePath = path.relative(basePath, targetPath);
      return `${match[1]}${relativePath.startsWith('.') ? relativePath : './' + relativePath}/${matchPath}${match[3]}`;
    }
  },
  {
    // Remplacer @/components/ui/ par les imports relatifs vers /components/ui/
    pattern: /(["'])@\/components\/ui\/([^"']+)(["'])/g,
    getPath: (filePath, match, matchPath) => {
      const basePath = path.dirname(filePath);
      const targetPath = path.join(process.cwd(), 'app', 'components', 'ui');
      const relativePath = path.relative(basePath, targetPath);
      return `${match[1]}${relativePath.startsWith('.') ? relativePath : './' + relativePath}/${matchPath}${match[3]}`;
    }
  },
  {
    // Remplacer @/components/ par les imports relatifs vers /components/
    pattern: /(["'])@\/components\/([^"']+)(["'])/g,
    getPath: (filePath, match, matchPath) => {
      const basePath = path.dirname(filePath);
      const targetPath = path.join(process.cwd(), 'app', 'components');
      const relativePath = path.relative(basePath, targetPath);
      return `${match[1]}${relativePath.startsWith('.') ? relativePath : './' + relativePath}/${matchPath}${match[3]}`;
    }
  },
  {
    // Remplacer @/lib/ par les imports relatifs vers _lib/lib/
    pattern: /(["'])@\/lib\/([^"']+)(["'])/g,
    getPath: (filePath, match, matchPath) => {
      const basePath = path.dirname(filePath);
      const targetPath = path.join(process.cwd(), 'app', '_lib', 'lib');
      const relativePath = path.relative(basePath, targetPath);
      return `${match[1]}${relativePath.startsWith('.') ? relativePath : './' + relativePath}/${matchPath}${match[3]}`;
    }
  }
];

// Fonction récursive pour parcourir les répertoires
async function processDirectory(directory) {
  const items = await readdir(directory);
  
  for (const item of items) {
    if (item === 'node_modules' || item === '.next') {
      continue;
    }

    const fullPath = path.join(directory, item);
    const stats = await stat(fullPath);

    if (stats.isDirectory()) {
      await processDirectory(fullPath);
    } else if (stats.isFile() && extensions.includes(path.extname(fullPath))) {
      await processFile(fullPath);
    }
  }
}

// Fonction pour traiter un fichier
async function processFile(filePath) {
  try {
    let content = await readFile(filePath, 'utf8');
    let changed = false;
    
    // Appliquer les remplacements
    for (const { pattern, getPath } of replacements) {
      let match;
      let newContent = content;
      pattern.lastIndex = 0; // Réinitialiser le regex

      // On utilise une approche qui nous permet de traiter chaque occurrence individuellement
      const matches = [];
      while ((match = pattern.exec(content)) !== null) {
        matches.push({
          fullMatch: match[0],
          quote: match[1],
          path: match[2],
          endQuote: match[3],
          index: match.index
        });
      }

      // Traiter les matches en commençant par la fin pour ne pas perturber les index
      for (let i = matches.length - 1; i >= 0; i--) {
        const m = matches[i];
        const replacement = getPath(filePath, [m.fullMatch, m.quote, m.path, m.endQuote], m.path);
        newContent = newContent.substring(0, m.index) + replacement + newContent.substring(m.index + m.fullMatch.length);
      }
      
      if (newContent !== content) {
        content = newContent;
        changed = true;
      }
    }

    // Écrire le fichier modifié
    if (changed) {
      await writeFile(filePath, content, 'utf8');
      console.log(`Fixed imports in ${path.relative(process.cwd(), filePath)}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

async function main() {
  const appDir = path.join(process.cwd(), 'app');
  console.log(`Starting to fix imports in ${appDir}...`);
  await processDirectory(appDir);
  console.log('Import paths have been fixed!');
}

main().catch(console.error);
