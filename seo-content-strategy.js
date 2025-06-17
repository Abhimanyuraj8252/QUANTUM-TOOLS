// SEO Content Strategy for QUANTUM TOOLS
// This file implements advanced content strategies to capture long-tail keywords
// and improve organic search visibility

class SEOContentStrategy {
    constructor() {
        this.init();
    }

    init() {
        this.setupToolSpecificContent();
        this.createRelatedToolsSection();
        this.implementFAQSchemas();
        this.setupHowToGuides();
        this.createBreadcrumbNavigation();
        this.setupKeywordRichURLs();
    }

    // Implement tool-specific content to capture long-tail keywords
    setupToolSpecificContent() {
        // Get current page type
        const currentPath = window.location.pathname;
        
        // Only run on tool pages
        if (this.isToolPage(currentPath)) {
            const toolType = this.getToolType(currentPath);
            
            // Add relevant content blocks
            this.addToolDescription(toolType);
            this.addUseCases(toolType);
            this.addAlternativeOptions(toolType);
            this.addTutorialSection(toolType);
        }
    }
    
    isToolPage(path) {
        // Check if path contains tool directories
        const toolDirectories = [
            'PDF tools',
            'Image tools',
            'text based tools',
            'utility tools',
            'Developer tools'
        ];
        
        return toolDirectories.some(dir => path.includes(dir));
    }
    
    getToolType(path) {
        // Extract tool type from path
        const pathParts = path.split('/');
        return pathParts[pathParts.length - 1].replace('.html', '');
    }
    
    addToolDescription(toolType) {
        // Content mapping for different tool types
        const toolContent = {
            'pdf-toolkit': {
                title: 'Free Online PDF Toolkit: Edit, Convert, and Manage PDF Files',
                description: 'QUANTUM TOOLS offers a comprehensive set of free online PDF tools. Merge, split, compress, convert PDFs without installing software. 100% secure and client-side processing.',
                keywords: ['pdf editor online', 'free pdf tools', 'merge pdf files', 'compress pdf online', 'convert pdf']
            },
            'bg-remover': {
                title: 'Free Online Background Remover: Remove Image Backgrounds Instantly',
                description: 'Remove backgrounds from images instantly with QUANTUM TOOLS advanced AI-powered background remover. No signup required, completely free and processed on your device.',
                keywords: ['remove background from image', 'transparent background maker', 'free background remover', 'online background eraser', 'AI background removal']
            },
            // Add more tools as needed
        };
        
        // Get content for current tool or use generic content
        const content = toolContent[toolType] || {
            title: 'Free Online ' + this.formatToolName(toolType) + ' | QUANTUM TOOLS',
            description: 'Use our free online ' + this.formatToolName(toolType) + ' to efficiently process your files. No registration required, 100% free with client-side processing for maximum security.',
            keywords: [toolType + ' online', 'free ' + toolType, 'online ' + toolType, 'best ' + toolType]
        };
        
        // Create and insert description section
        const descriptionSection = document.createElement('section');
        descriptionSection.className = 'tool-description seo-content';
        descriptionSection.innerHTML = `
            <h1>${content.title}</h1>
            <p>${content.description}</p>
            <div class="keyword-tags">
                ${content.keywords.map(keyword => `<span class="keyword-tag">${keyword}</span>`).join('')}
            </div>
        `;
        
        // Insert at the beginning of the main content
        const mainContent = document.querySelector('main') || document.querySelector('.content');
        if (mainContent && !document.querySelector('.tool-description')) {
            mainContent.insertBefore(descriptionSection, mainContent.firstChild);
        }
    }
    
    formatToolName(toolType) {
        return toolType
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    
    addUseCases(toolType) {
        const useCaseContainer = document.createElement('section');
        useCaseContainer.className = 'use-cases seo-content';
        useCaseContainer.innerHTML = `
            <h2>Popular Use Cases for ${this.formatToolName(toolType)}</h2>
            <div class="use-cases-grid">
                <!-- Use cases will be dynamically inserted here -->
            </div>
        `;
        
        // Insert after tool description
        const toolDescription = document.querySelector('.tool-description');
        if (toolDescription) {
            toolDescription.after(useCaseContainer);
            
            // Generate use cases based on tool type
            this.generateUseCases(toolType);
        }
    }
    
    generateUseCases(toolType) {
        // This would be implemented based on the specific tool
        // For demonstration, we'll just log a message
        console.log(`Generating use cases for ${toolType}`);
        
        // In a real implementation, this would populate the .use-cases-grid element
        // with relevant use cases for the specific tool
    }
    
    addAlternativeOptions(toolType) {
        // This would add a section comparing this tool to alternatives
        // Helps capture comparative search queries like "X vs Y" or "alternatives to X"
        console.log(`Adding alternative options for ${toolType}`);
    }
    
    addTutorialSection(toolType) {
        // This would add a how-to tutorial section for the tool
        // Great for capturing "how to" search queries
        console.log(`Adding tutorial section for ${toolType}`);
    }

    // Create related tools section for cross-linking
    createRelatedToolsSection() {
        const currentPath = window.location.pathname;
        
        if (this.isToolPage(currentPath)) {
            const toolType = this.getToolType(currentPath);
            const category = this.getToolCategory(currentPath);
            
            // Create related tools container
            const relatedToolsSection = document.createElement('section');
            relatedToolsSection.className = 'related-tools';
            relatedToolsSection.innerHTML = `
                <h2>Related Tools You Might Find Useful</h2>
                <div class="related-tools-grid">
                    <!-- Related tools will be dynamically inserted here -->
                </div>
            `;
            
            // Insert at the end of main content
            const mainContent = document.querySelector('main') || document.querySelector('.content');
            if (mainContent) {
                mainContent.appendChild(relatedToolsSection);
                
                // Populate related tools based on current tool category
                this.populateRelatedTools(category, toolType);
            }
        }
    }
    
    getToolCategory(path) {
        const categories = [
            'PDF tools',
            'Image tools',
            'text based tools',
            'utility tools',
            'Developer tools'
        ];
        
        for (const category of categories) {
            if (path.includes(category)) {
                return category;
            }
        }
        
        return 'Other';
    }
    
    populateRelatedTools(category, excludeToolType) {
        // This would fetch related tools from the same category
        // and display them in the related-tools-grid
        console.log(`Populating related tools for ${category}, excluding ${excludeToolType}`);
    }

    // Implement FAQ schema for better search results
    implementFAQSchemas() {
        const currentPath = window.location.pathname;
        
        if (this.isToolPage(currentPath)) {
            const toolType = this.getToolType(currentPath);
            
            // Get FAQs for this tool type
            const faqs = this.getFAQsForTool(toolType);
            
            if (faqs && faqs.length > 0) {
                // Create FAQ section
                const faqSection = document.createElement('section');
                faqSection.className = 'faq-section';
                faqSection.innerHTML = `
                    <h2>Frequently Asked Questions</h2>
                    <div class="faq-container">
                        ${faqs.map(faq => `
                            <div class="faq-item">
                                <h3 class="faq-question">${faq.question}</h3>
                                <div class="faq-answer">${faq.answer}</div>
                            </div>
                        `).join('')}
                    </div>
                `;
                
                // Add to page
                const mainContent = document.querySelector('main') || document.querySelector('.content');
                if (mainContent) {
                    mainContent.appendChild(faqSection);
                }
                
                // Add FAQ schema
                this.addFAQSchema(faqs);
            }
        }
    }
    
    getFAQsForTool(toolType) {
        // This would return FAQ data for specific tools
        // For demonstration, return sample data
        const genericFAQs = [
            {
                question: 'Is this tool completely free to use?',
                answer: 'Yes, all tools on QUANTUM TOOLS are completely free to use with no hidden fees or subscriptions required.'
            },
            {
                question: 'Do I need to create an account to use this tool?',
                answer: 'No, you don\'t need to create an account or register. All our tools are accessible without any login requirements.'
            },
            {
                question: 'Is my data secure when using this tool?',
                answer: 'Yes, all processing happens directly in your browser. Your files never leave your device, ensuring complete privacy and security.'
            },
            {
                question: 'Can I use this tool on mobile devices?',
                answer: 'Yes, QUANTUM TOOLS is fully responsive and works on all modern mobile devices and tablets.'
            }
        ];
        
        return genericFAQs;
    }
    
    addFAQSchema(faqs) {
        // Create FAQ schema
        const faqSchema = {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': faqs.map(faq => ({
                '@type': 'Question',
                'name': faq.question,
                'acceptedAnswer': {
                    '@type': 'Answer',
                    'text': faq.answer
                }
            }))
        };
        
        // Add schema to page
        const schemaScript = document.createElement('script');
        schemaScript.type = 'application/ld+json';
        schemaScript.textContent = JSON.stringify(faqSchema);
        document.head.appendChild(schemaScript);
    }

    // Setup How-To guides for better search visibility
    setupHowToGuides() {
        // This would implement How-To schema markup
        console.log('Setting up How-To guides');
    }

    // Create SEO-friendly breadcrumb navigation
    createBreadcrumbNavigation() {
        const currentPath = window.location.pathname;
        const pathParts = currentPath.split('/').filter(part => part !== '');
        
        if (pathParts.length > 0) {
            // Create breadcrumb container
            const breadcrumbNav = document.createElement('nav');
            breadcrumbNav.setAttribute('aria-label', 'Breadcrumb');
            breadcrumbNav.className = 'breadcrumb-navigation';
            
            const breadcrumbList = document.createElement('ol');
            
            // Always add home
            breadcrumbList.innerHTML = '<li><a href="/">Home</a></li>';
            
            // Build breadcrumb path
            let currentPath = '';
            for (let i = 0; i < pathParts.length; i++) {
                const part = pathParts[i];
                currentPath += '/' + part;
                
                const partName = part.replace(/\.html$/, '').replace(/-/g, ' ');
                const formattedName = partName
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                
                const isLast = i === pathParts.length - 1;
                
                if (isLast) {
                    breadcrumbList.innerHTML += `<li aria-current="page">${formattedName}</li>`;
                } else {
                    breadcrumbList.innerHTML += `<li><a href="${currentPath}">${formattedName}</a></li>`;
                }
            }
            
            breadcrumbNav.appendChild(breadcrumbList);
            
            // Add to page at the top of main content
            const mainContent = document.querySelector('main') || document.querySelector('.content');
            if (mainContent) {
                mainContent.insertBefore(breadcrumbNav, mainContent.firstChild);
            }
            
            // Add breadcrumb schema
            this.addBreadcrumbSchema(pathParts);
        }
    }
    
    addBreadcrumbSchema(pathParts) {
        // Create breadcrumb schema
        const breadcrumbItems = [];
        
        // Always add home
        breadcrumbItems.push({
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://quantumtools.example.com/'
        });
        
        // Add path parts
        let currentPath = '';
        for (let i = 0; i < pathParts.length; i++) {
            const part = pathParts[i];
            currentPath += '/' + part;
            
            const partName = part.replace(/\.html$/, '').replace(/-/g, ' ');
            const formattedName = partName
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            
            breadcrumbItems.push({
                '@type': 'ListItem',
                'position': i + 2,
                'name': formattedName,
                'item': 'https://quantumtools.example.com' + currentPath
            });
        }
        
        const breadcrumbSchema = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': breadcrumbItems
        };
        
        // Add schema to page
        const schemaScript = document.createElement('script');
        schemaScript.type = 'application/ld+json';
        schemaScript.textContent = JSON.stringify(breadcrumbSchema);
        document.head.appendChild(schemaScript);
    }

    // Setup keyword-rich URLs for new content
    setupKeywordRichURLs() {
        // This would implement a strategy for creating keyword-rich URLs
        console.log('Setting up keyword-rich URLs strategy');
    }
}

// Initialize content strategy
document.addEventListener('DOMContentLoaded', () => {
    const contentStrategy = new SEOContentStrategy();
});
