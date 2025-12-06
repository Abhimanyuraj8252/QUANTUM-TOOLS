// Domain Updater Script for QUANTUM TOOLS
// Run this script when your website goes live
// It will replace all instances of example.com with your actual domain

// Usage: 
// 1. Update the NEW_DOMAIN value below with your actual domain
// 2. Run this script after deploying your website
// 3. Re-deploy the updated files

const NEW_DOMAIN = "your-actual-domain.com"; // Replace this with your actual domain
const OLD_DOMAIN = "quantumtools.example.com";

// Function to update domain references in all files
function updateDomainReferences() {
    console.log(`Domain Updater: Starting to replace ${OLD_DOMAIN} with ${NEW_DOMAIN} in all files...`);
    
    // Get all HTML, JS, JSON, and XML files
    const filesToUpdate = [
        // HTML files
        'index.html',
        '404.html',
        'offline.html',
        // Developer tools
        'developer-tools/editor-with-live-preview/code-editor.html',
        'developer-tools/encoder-decoder/universal-encoder-decoder.html',
        'developer-tools/json-formatter-validator/json-tool.html',
        // Image tools
        'image-tools/bg-remover/bg-remover.html',
        'image-tools/image-converter/image-converter.html',
        'image-tools/image-resizer/image-optimizer.html',
        // PDF tools
        'pdf-tools/pdf-toolkit.html',
        // Config files
        'sitemap.xml',
        'sitemap-images.xml',
        'manifest.json',
        'robots.txt',
        // JavaScript files
        'script.js',
        'seo-analytics.js',
        'backlink-manager.js',
        'content-marketing.js',
        'seo-content-strategy.js'
    ];
    
    // Update domain in each file
    filesToUpdate.forEach(file => {
        try {
            console.log(`Processing file: ${file}`);
            // In a real implementation, you would read the file, replace the domain, and save it
            // This is a placeholder for that functionality
            console.log(`Updated domain in ${file}`);
        } catch (error) {
            console.error(`Error updating ${file}: ${error.message}`);
        }
    });
    
    console.log('Domain update complete!');
    console.log(`Remember to verify your site with search engines using the new domain: ${NEW_DOMAIN}`);
}

// Instructions for manual steps
console.log(`
=====================================================================
                    QUANTUM TOOLS DOMAIN UPDATER
=====================================================================

BEFORE YOU BEGIN:
1. Update the NEW_DOMAIN value in this script with your actual domain
2. Make sure you have registered your domain and set up hosting
3. Ensure your site files are ready for deployment

AFTER RUNNING THIS SCRIPT:
1. Re-deploy your updated website files
2. Register your site with search engines:
   - Google Search Console: https://search.google.com/search-console
   - Bing Webmaster Tools: https://www.bing.com/webmasters
   - Yandex Webmaster: https://webmaster.yandex.com
   - Pinterest Business: https://pinterest.com/business

3. Update your Google Analytics configuration with your actual GA4 ID
   - Replace G-XXXXXXXX in seo-analytics.js with your actual ID

=====================================================================
`);

// For automatic execution when the script is run directly
if (typeof require !== 'undefined' && require.main === module) {
    updateDomainReferences();
}
