// QUANTUM TOOLS Tag Auto Manager
// This script will help automatically add tag manager code to new pages

const fs = require('fs');
const path = require('path');
const glob = require('glob');

class TagAutoManager {
    constructor() {
        this.rootDir = __dirname;
        this.tagManagerPath = path.join(this.rootDir, 'tag-manager.js');
        this.tagManagerUIPath = path.join(this.rootDir, 'tag-manager-ui.js');
        this.tagManagerStylesPath = path.join(this.rootDir, 'tag-manager-styles.css');
        
        this.tagManagerCode = `
    <!-- Tag Manager -->
    <script src="{{path}}tag-manager.js" defer></script>
    <script src="{{path}}tag-manager-ui.js" defer></script>
    <link rel="stylesheet" href="{{path}}tag-manager-styles.css">`;
    }
    
    // Find all HTML files in the directory structure
    findAllHTMLFiles() {
        return new Promise((resolve, reject) => {
            glob('**/*.html', { cwd: this.rootDir }, (err, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(files);
                }
            });
        });
    }
    
    // Check if file already has tag manager code
    hasTagManager(content) {
        return content.includes('tag-manager.js') || 
               content.includes('tag-manager-ui.js') || 
               content.includes('tag-manager-styles.css');
    }
    
    // Calculate relative path from file to root
    calculateRelativePath(file) {
        const fileDir = path.dirname(file);
        let relativePath = '';
        
        if (fileDir !== '.') {
            const dirParts = fileDir.split(path.sep);
            relativePath = '../'.repeat(dirParts.length);
        }
        
        return relativePath;
    }
    
    // Add tag manager code to a file
    addTagManagerToFile(file) {
        const filePath = path.join(this.rootDir, file);
        
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, content) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                if (this.hasTagManager(content)) {
                    console.log(`✓ ${file} already has Tag Manager`);
                    resolve(false);
                    return;
                }
                
                // Calculate path to tag manager files
                const relativePath = this.calculateRelativePath(file);
                const tagCode = this.tagManagerCode.replace(/\{\{path\}\}/g, relativePath);
                
                // Find appropriate insertion point
                let modifiedContent;
                
                if (content.includes('</body>')) {
                    // Insert before closing body tag and after the last script
                    const lastScriptIndex = content.lastIndexOf('<script', content.lastIndexOf('</body>'));
                    const lastScriptEndIndex = content.indexOf('</script>', lastScriptIndex);
                    
                    if (lastScriptIndex !== -1 && lastScriptEndIndex !== -1) {
                        const insertPosition = lastScriptEndIndex + 9; // Length of </script>
                        modifiedContent = content.slice(0, insertPosition) + '\n    ' + tagCode + content.slice(insertPosition);
                    } else {
                        // No script found, insert before </body>
                        modifiedContent = content.replace('</body>', `${tagCode}\n</body>`);
                    }
                } else {
                    // If no closing body tag, add at the end
                    modifiedContent = content + '\n' + tagCode;
                }
                
                // Write the modified content back to the file
                fs.writeFile(filePath, modifiedContent, 'utf8', (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log(`✅ Added Tag Manager to ${file}`);
                        resolve(true);
                    }
                });
            });
        });
    }
    
    // Process all HTML files
    async processAllFiles() {
        try {
            const files = await this.findAllHTMLFiles();
            console.log(`Found ${files.length} HTML files to process`);
            
            let modifiedCount = 0;
            
            for (const file of files) {
                try {
                    const modified = await this.addTagManagerToFile(file);
                    if (modified) modifiedCount++;
                } catch (err) {
                    console.error(`Error processing ${file}:`, err.message);
                }
            }
            
            console.log(`\nTag Manager added to ${modifiedCount} files`);
            console.log(`${files.length - modifiedCount} files were already tagged`);
            
        } catch (err) {
            console.error('Error finding HTML files:', err.message);
        }
    }
    
    // Watch for new HTML files
    watchForNewFiles() {
        console.log('Watching for new HTML files...');
        
        fs.watch(this.rootDir, { recursive: true }, async (eventType, filename) => {
            if (!filename || !filename.endsWith('.html')) return;
            
            // Give some time for the file to be written completely
            setTimeout(async () => {
                try {
                    const filePath = path.join(this.rootDir, filename);
                    
                    if (fs.existsSync(filePath)) {
                        console.log(`New HTML file detected: ${filename}`);
                        await this.addTagManagerToFile(filename);
                    }
                } catch (err) {
                    console.error(`Error processing new file ${filename}:`, err.message);
                }
            }, 1000);
        });
    }
    
    // Run the auto manager
    run(watch = false) {
        console.log('QUANTUM TOOLS Tag Auto Manager');
        console.log('------------------------------');
        
        this.processAllFiles();
        
        if (watch) {
            this.watchForNewFiles();
        }
    }
}

// Create and run the auto manager
const tagAutoManager = new TagAutoManager();
tagAutoManager.run(process.argv.includes('--watch'));
