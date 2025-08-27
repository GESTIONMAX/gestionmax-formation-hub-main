const fs = require('fs');
const path = require('path');

// Directory containing UI components
const uiComponentsDir = path.join(__dirname, '..', 'app', 'components', 'ui');

// Function to update imports in a file
function updateImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Replace import path
    content = content.replace(
      /import\s+\{\s*cn\s*\}\s+from\s+["']\.\.\/\.\.\/lib\/utils["']/g,
      'import { cn } from "../../_lib/lib/utils"'
    );
    
    // Only write if content changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated imports in: ${filePath}`);
      return true;
    }
    return false;
  } catch (err) {
    console.error(`Error updating ${filePath}: ${err.message}`);
    return false;
  }
}

// Process all tsx files in the UI components directory
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  let updatedCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Process subdirectories if needed
      updatedCount += processDirectory(filePath);
    } else if (file.endsWith('.tsx')) {
      if (updateImports(filePath)) {
        updatedCount++;
      }
    }
  });
  
  return updatedCount;
}

// Run the script
const updatedFiles = processDirectory(uiComponentsDir);
console.log(`Updated ${updatedFiles} files.`);
