// update-titles.js - Add proper title tags to all HTML files
// Created on June 14, 2025

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Site name
const SITE_NAME = 'OMNIFORMA';

// Title mapping for different pages
const pageTitles = {
  'index.html': `${SITE_NAME} - Advanced Free Online Web Utilities & Tools Suite 2025`,
  'offline.html': `Offline - ${SITE_NAME}`,
  '404.html': `404 - Page Not Found | ${SITE_NAME}`,
  // Add more specific mappings here as needed
};

// Function to generate a title based on folder and filename
function generateTitle(filePath) {
  const folderName = path.dirname(filePath).split(path.sep).pop();
  const baseName = path.basename(filePath, '.html');
  
  // If we have a specific mapping, use it
  if (pageTitles[path.basename(filePath)]) {
    return pageTitles[path.basename(filePath)];
  }
  
  // If it's in the root and not specifically mapped
  if (folderName === 'OMNIFORMA') {
    return `${baseName.charAt(0).toUpperCase() + baseName.slice(1).replace(/-/g, ' ')} | ${SITE_NAME}`;
  }
  
  // For tools and other pages
  return `${baseName.charAt(0).toUpperCase() + baseName.slice(1).replace(/-/g, ' ')} - ${folderName} | ${SITE_NAME}`;
}

// Get all HTML files recursively
async function getAllHtmlFiles(dir) {
  const files = await readdir(dir);
  const htmlFiles = [];
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const fileStat = await stat(filePath);
    
    if (fileStat.isDirectory()) {
      // Skip node_modules or other irrelevant directories
      if (file !== 'node_modules' && !file.startsWith('.')) {
        const subDirFiles = await getAllHtmlFiles(filePath);
        htmlFiles.push(...subDirFiles);
      }
    } else if (path.extname(file) === '.html') {
      htmlFiles.push(filePath);
    }
  }
  
  return htmlFiles;
}

// Update title tag in HTML file
async function updateTitleTag(filePath) {
  try {
    let content = await readFile(filePath, 'utf8');
    const hasTitle = /<title>.*?<\/title>/i.test(content);
    
    if (!hasTitle) {
      // Add title tag if it doesn't exist
      const title = generateTitle(filePath);
      content = content.replace(/<head>(\s*)/i, `<head>$1\n    <title>${title}</title>`);
      await writeFile(filePath, content, 'utf8');
      console.log(`✅ Added title tag to: ${filePath}`);
    } else {
      // Update title if it looks like a filename or default
      const titleMatch = content.match(/<title>(.*?)<\/title>/i);
      const currentTitle = titleMatch ? titleMatch[1] : '';
      
      // Check if the title needs updating (contains .html, index, or default values)
      const needsUpdate = 
        currentTitle.includes('.html') || 
        currentTitle === 'Document' || 
        currentTitle === 'Untitled Document' ||
        currentTitle === path.basename(filePath) ||
        currentTitle === path.basename(filePath, '.html');
      
      if (needsUpdate) {
        const newTitle = generateTitle(filePath);
        content = content.replace(/<title>.*?<\/title>/i, `<title>${newTitle}</title>`);
        await writeFile(filePath, content, 'utf8');
        console.log(`✅ Updated title tag in: ${filePath}`);
      } else {
        console.log(`✓ Title already exists in: ${filePath}`);
      }
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Main function
async function main() {
  const rootDir = path.resolve(__dirname);
  console.log(`Starting title tag update in: ${rootDir}`);
  
  try {
    const htmlFiles = await getAllHtmlFiles(rootDir);
    console.log(`Found ${htmlFiles.length} HTML files to process`);
    
    for (const filePath of htmlFiles) {
      await updateTitleTag(filePath);
    }
    
    console.log('Title tag update completed successfully!');
  } catch (error) {
    console.error('Error updating title tags:', error.message);
  }
}

// Run the script
main();
