import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find all markdown files in directory
function findMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findMarkdownFiles(filePath, fileList);
    } else if (path.extname(file) === '.md') {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Fix boolean values in frontmatter
function fixBooleanValues(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Check if file has frontmatter
    if (content.startsWith('---')) {
      const frontmatterEndIndex = content.indexOf('---', 3);
      if (frontmatterEndIndex !== -1) {
        const frontmatter = content.substring(0, frontmatterEndIndex + 3);
        let newFrontmatter = frontmatter;

        // Fix quoted "true" values with global flag
        if (newFrontmatter.includes(': "true"')) {
          newFrontmatter = newFrontmatter.replace(/: "true"/g, ': true');
          modified = true;
        }
        
        // Fix quoted 'true' values with global flag
        if (newFrontmatter.includes(": 'true'")) {
          newFrontmatter = newFrontmatter.replace(/: 'true'/g, ': true');
          modified = true;
        }

        // Fix quoted "false" values with global flag
        if (newFrontmatter.includes(': "false"')) {
          newFrontmatter = newFrontmatter.replace(/: "false"/g, ': false');
          modified = true;
        }
        
        // Fix quoted 'false' values with global flag
        if (newFrontmatter.includes(": 'false'")) {
          newFrontmatter = newFrontmatter.replace(/: 'false'/g, ': false');
          modified = true;
        }

        // Add double quotes to updated values if they don't already have them
        const updatedRegex = /^(updated:)\s*([^"\n]+)$/gm;
        if (updatedRegex.test(newFrontmatter)) {
          newFrontmatter = newFrontmatter.replace(updatedRegex, (match, prefix, value) => {
            // Skip if value is already in quotes or is a boolean
            if (value.trim() === 'true' || value.trim() === 'false' || 
                value.trim().startsWith('"') || value.trim().endsWith('"')) {
              return match;
            }
            return `${prefix} "${value.trim()}"`;
          });
          modified = true;
        }

        // Add double quotes to date values if they don't already have them
        const dateRegex = /^(date:)\s*([^"\n]+)$/gm;
        if (dateRegex.test(newFrontmatter)) {
          newFrontmatter = newFrontmatter.replace(dateRegex, (match, prefix, value) => {
            // Skip if value is already in quotes or is a boolean
            if (value.trim() === 'true' || value.trim() === 'false' || 
                value.trim().startsWith('"') || value.trim().endsWith('"')) {
              return match;
            }
            return `${prefix} "${value.trim()}"`;
          });
          modified = true;
        }

        // Handle the case where there are duplicate fields like multiple updated fields
        // This regex finds all occurrences like "updated: value" and checks if there are duplicates
        const updatedMatches = newFrontmatter.match(/^updated:.*$/gm);
        if (updatedMatches && updatedMatches.length > 1) {
          console.log(`Found multiple updated fields in ${filePath}`);
          // Keep only the last updated field
          let foundFirst = false;
          const lines = newFrontmatter.split('\n');
          const filteredLines = lines.filter(line => {
            if (line.trim().startsWith('updated:')) {
              if (foundFirst) {
                return true; // Keep subsequent occurrences
              } else {
                foundFirst = true;
                return false; // Remove first occurrence
              }
            }
            return true;
          });
          newFrontmatter = filteredLines.join('\n');
          modified = true;
        }

        if (modified) {
          // Update file content
          content = content.replace(frontmatter, newFrontmatter);
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`Fixed: ${filePath}`);
        }
      }
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// Main function
function main() {
  // Process multiple directories
  const directories = [
    path.join(__dirname, 'content'),
    '/Users/wyq/Documents/ROOT'
  ];
  
  let totalFiles = 0;
  let totalFixed = 0;
  
  // Process each directory
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.error(`Directory not found: ${dir}`);
      return;
    }
    
    console.log(`Starting to process directory: ${dir}`);
    const markdownFiles = findMarkdownFiles(dir);
    console.log(`Found ${markdownFiles.length} Markdown files in ${dir}`);
    
    let fixedCount = 0;
    markdownFiles.forEach(file => {
      const beforeFix = fs.readFileSync(file, 'utf8');
      fixBooleanValues(file);
      const afterFix = fs.readFileSync(file, 'utf8');
      
      if (beforeFix !== afterFix) {
        fixedCount++;
      }
    });
    
    totalFiles += markdownFiles.length;
    totalFixed += fixedCount;
    
    console.log(`Fixed ${fixedCount} files in ${dir}`);
  });

  console.log(`Done! Fixed ${totalFixed} files out of ${totalFiles} total files`);
}

main(); 