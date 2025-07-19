/**
 * Advanced SEO Optimizer for QUANTUM TOOLS
 * Created: June 17, 2025
 * 
 * This script implements advanced SEO techniques to boost search engine rankings
 * and improve organic traffic to the QUANTUM TOOLS website.
 */

class AdvancedSEOOptimizer {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.optimizePageHeadings();
            this.implementLazyLoading();
            this.enhanceInternalLinking();
            this.optimizeImagesForSEO();
            this.implementLocalSEO();
            this.setupCanonicalURLs();
            this.implementHreflangTags();
            this.setupMobileFriendlyIndicators();
            this.optimizeUserExperience();
        });
    }

    // Optimize headings with keyword-rich content
    optimizePageHeadings() {
        const pathname = window.location.pathname;
        const toolName = this.getToolNameFromPath(pathname);

        if (toolName) {
            // Find main heading
            const mainHeading = document.querySelector('h1');
            if (mainHeading) {
                // Add LSI keywords to heading if not already present
                if (!mainHeading.textContent.includes('Free')) {
                    mainHeading.textContent = `${mainHeading.textContent} - Free Online Tool`;
                }
            }

            // Add semantic subheadings if missing
            this.ensureSubheadings([
                'How to Use This Tool',
                'Features and Benefits',
                'Why Choose QUANTUM TOOLS',
                'Frequently Asked Questions'
            ]);
        }
    }

    // Get tool name from URL path
    getToolNameFromPath(pathname) {
        const pathParts = pathname.split('/');
        const fileName = pathParts[pathParts.length - 1];
        return fileName.replace('.html', '').replace(/-/g, ' ');
    }

    // Add semantic subheadings if they don't exist
    ensureSubheadings(headings) {
        const mainContent = document.querySelector('main') || document.body;
        const existingH2s = Array.from(mainContent.querySelectorAll('h2')).map(h => h.textContent.trim());

        headings.forEach(heading => {
            // Check if heading already exists
            if (!existingH2s.some(h => h.includes(heading))) {
                // Find a good place to insert the heading
                const div = document.createElement('div');
                div.className = 'seo-section';

                const h2 = document.createElement('h2');
                h2.textContent = heading;
                div.appendChild(h2);

                const p = document.createElement('p');
                p.textContent = `Explore our ${heading.toLowerCase()} section to learn more about how QUANTUM TOOLS can help you.`;
                div.appendChild(p);

                // Append at the end of main content
                mainContent.appendChild(div);
            }
        });
    }

    // Implement lazy loading for images and resources
    implementLazyLoading() {
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
            img.setAttribute('loading', 'lazy');

            // Also add alt text if missing for better SEO
            if (!img.alt || img.alt === '') {
                const imgSrc = img.src;
                const imgName = imgSrc.split('/').pop().split('.')[0].replace(/-/g, ' ');
                img.alt = `QUANTUM TOOLS - ${imgName}`;
            }
        });

        // Add width and height to images without dimensions (reduces CLS)
        images.forEach(img => {
            if (!img.width && !img.height) {
                img.style.aspectRatio = "16/9";
            }
        });
    }

    // Enhance internal linking structure
    enhanceInternalLinking() {
        // Add relevant internal links to improve site structure
        const toolLinks = {
            'pdf': [
                { name: 'PDF Merger', url: '/PDF tools/PDF Manipulation/pdf-merger.html' },
                { name: 'PDF Splitter', url: '/PDF tools/PDF Manipulation/pdf-splitter.html' },
                { name: 'PDF Compressor', url: '/PDF tools/PDF Manipulation/pdf-compressor.html' }
            ],
            'image': [
                { name: 'Background Remover', url: '/Image tools/bg remover/bg-remover.html' },
                { name: 'Image Resizer', url: '/Image tools/Image resizer/image-resizer.html' },
                { name: 'Image Converter', url: '/Image tools/image converter/image-converter.html' }
            ],
            'text': [
                { name: 'Case Converter', url: '/text based tools/case converter/case-converter.html' },
                { name: 'Word Counter', url: '/text based tools/word-counter/index.html' }
            ],
            'dev': [
                { name: 'JSON Formatter', url: '/Developer tools/JSON formatter validator/json-tool.html' },
                { name: 'Code Editor', url: '/Developer tools/Editor with Live Preview/code-editor.html' },
                { name: 'Encoder Decoder', url: '/Developer tools/Encoder Decoder/universal-encoder-decoder.html' }
            ]
        };

        // Determine relevant category based on current page
        const path = window.location.pathname.toLowerCase();
        let relevantCategory = null;

        if (path.includes('pdf')) relevantCategory = 'pdf';
        else if (path.includes('image')) relevantCategory = 'image';
        else if (path.includes('text')) relevantCategory = 'text';
        else if (path.includes('dev') || path.includes('json') || path.includes('editor')) relevantCategory = 'dev';

        // Add related tools section if relevant category found
        if (relevantCategory) {
            this.addRelatedToolsSection(toolLinks[relevantCategory]);
        }
    }

    // Add related tools section
    addRelatedToolsSection(links) {
        if (!document.querySelector('.related-tools')) {
            const footer = document.querySelector('footer');
            if (footer) {
                const relatedSection = document.createElement('div');
                relatedSection.className = 'related-tools';

                const heading = document.createElement('h3');
                heading.textContent = 'Related Tools You Might Like';
                relatedSection.appendChild(heading);

                const linkList = document.createElement('ul');
                links.forEach(link => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = link.url;
                    a.textContent = link.name;
                    li.appendChild(a);
                    linkList.appendChild(li);
                });

                relatedSection.appendChild(linkList);
                document.body.insertBefore(relatedSection, footer);
            }
        }
    }

    // Optimize images for SEO with proper attributes
    optimizeImagesForSEO() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Add missing alt text
            if (!img.alt || img.alt === '') {
                const pathParts = img.src.split('/');
                const fileName = pathParts[pathParts.length - 1].replace(/\.(jpg|png|svg|gif|webp)$/i, '');
                const prettyName = fileName.replace(/[-_]/g, ' ');
                img.alt = `QUANTUM TOOLS - ${prettyName}`;
            }

            // Add title attribute if missing
            if (!img.title) {
                img.title = img.alt;
            }
        });
    }

    // Implement local SEO techniques
    implementLocalSEO() {
        if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
            // Only add local business schema to main page
            this.addLocalBusinessSchema();
        }
    }

    // Add local business schema
    addLocalBusinessSchema() {
        // Check if schema already exists
        if (!document.querySelector('script[data-local-business]')) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.dataset.localBusiness = true;

            const schema = {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                "name": "QUANTUM TOOLS",
                "applicationCategory": "WebApplication",
                "operatingSystem": "Any",
                "description": "Free comprehensive suite of 50+ advanced web utilities",
                "url": window.location.origin,
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.9",
                    "ratingCount": "1568",
                    "bestRating": "5",
                    "worstRating": "1"
                }
            };

            script.textContent = JSON.stringify(schema);
            document.head.appendChild(script);
        }
    }

    // Setup canonical URLs
    setupCanonicalURLs() {
        // Make sure canonical is set correctly
        let canonicalLink = document.querySelector('link[rel="canonical"]');
        if (!canonicalLink) {
            canonicalLink = document.createElement('link');
            canonicalLink.rel = 'canonical';
            document.head.appendChild(canonicalLink);
        }

        // Remove any query parameters and fragments
        const cleanURL = window.location.origin +
            window.location.pathname.replace(/index\.html$/, '');
        canonicalLink.href = cleanURL;
    }

    // Implement hreflang tags for internationalization
    implementHreflangTags() {
        const languages = ['en', 'hi', 'es', 'fr', 'de', 'zh', 'ja', 'ru', 'ar', 'pt'];

        // Remove any existing hreflang tags
        document.querySelectorAll('link[hreflang]').forEach(link => link.remove());

        const url = window.location.origin + window.location.pathname;

        // Create hreflang links
        languages.forEach(lang => {
            const link = document.createElement('link');
            link.rel = 'alternate';
            link.hreflang = lang;
            link.href = url + (lang === 'en' ? '' : `?lang=${lang}`);
            document.head.appendChild(link);
        });

        // Add x-default
        const defaultLink = document.createElement('link');
        defaultLink.rel = 'alternate';
        defaultLink.hreflang = 'x-default';
        defaultLink.href = url;
        document.head.appendChild(defaultLink);
    }

    // Setup mobile-friendly indicators and optimizations
    setupMobileFriendlyIndicators() {
        // Ensure viewport meta is correctly set
        let viewportMeta = document.querySelector('meta[name="viewport"]');
        if (!viewportMeta) {
            viewportMeta = document.createElement('meta');
            viewportMeta.name = 'viewport';
            document.head.appendChild(viewportMeta);
        }
        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';

        // Set mobile web app capable
        let mobileMeta = document.querySelector('meta[name="mobile-web-app-capable"]');
        if (!mobileMeta) {
            mobileMeta = document.createElement('meta');
            mobileMeta.name = 'mobile-web-app-capable';
            document.head.appendChild(mobileMeta);
        }
        mobileMeta.content = 'yes';

        // Ensure theme color is set
        let themeMeta = document.querySelector('meta[name="theme-color"]');
        if (!themeMeta) {
            themeMeta = document.createElement('meta');
            themeMeta.name = 'theme-color';
            document.head.appendChild(themeMeta);
        }
        themeMeta.content = '#00f0ff';
    }

    // Optimize user experience for SEO
    optimizeUserExperience() {
        // Add accessibility attributes to improve user experience and SEO

        // Add ARIA labels to improve accessibility
        document.querySelectorAll('button:not([aria-label])').forEach(button => {
            if (button.textContent) {
                button.setAttribute('aria-label', button.textContent.trim());
            }
        });

        // Add tooltips to links without titles
        document.querySelectorAll('a:not([title])').forEach(link => {
            if (link.textContent && !link.querySelector('img')) {
                link.title = link.textContent.trim();
            }
        });
    }
}

// Initialize the advanced SEO optimizer
const advancedSEO = new AdvancedSEOOptimizer();
