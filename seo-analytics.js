// SEO and Analytics Manager for QUANTUM TOOLS
class SEOAnalyticsManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupGoogleTagManager(); // Add GTM initialization first
        this.setupGoogleAnalytics();
        this.setupStructuredData();
        this.setupSEOOptimizations();
        this.trackUserEngagement();
        this.setupPageSpeedTracking();
        this.enhanceKeywordRelevance();
    }

    // Google Tag Manager Setup
    setupGoogleTagManager() {
        // Create and inject the GTM script
        const gtmScript = document.createElement('script');
        gtmScript.innerHTML = `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-T5WCC5DD');
        `;
        document.head.insertBefore(gtmScript, document.head.firstChild);
        // Add GTM noscript element to body for iframe fallback
        // Create a DOM element to hold the HTML
        const container = document.createElement('div');
        container.innerHTML = `
        <!-- Google Tag Manager (noscript) -->
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T5WCC5DD"
        height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        <!-- End Google Tag Manager (noscript) -->
        `;

        // Insert the noscript element at the beginning of the body
        document.addEventListener('DOMContentLoaded', () => {
            const noscriptElement = container.querySelector('noscript');
            document.body.insertBefore(noscriptElement, document.body.firstChild);
        });
    }    // Google Analytics 4 Setup
    setupGoogleAnalytics() {
        // Skip creating duplicate GA tags if they already exist in the document
        if (document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) {
            console.log('Google Analytics script already exists, using existing implementation');
            return;
        }

        // Create Google Analytics script
        const gtagScript = document.createElement('script');
        gtagScript.async = true;
        gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-0E17RL1H32'; // Production GA4 ID
        document.head.appendChild(gtagScript);

        // Initialize gtag
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', 'G-0E17RL1H32'); // Production GA4 ID

        // Enable enhanced measurement features
        gtag('set', {
            'cookie_flags': 'SameSite=None;Secure'
        });

        // Track tool usage
        this.trackToolUsage();

        // Track search queries
        this.trackSearchQueries();

        // Track downloads/exports
        this.trackDownloads();
    }

    // Structured Data for better SEO
    setupStructuredData() {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "QUANTUM TOOLS",
            "description": "Advanced free online web utilities & tools suite including PDF tools, image converters, developer tools, text processors, and more.",
            "url": "https://quantumtools.example.com",
            "applicationCategory": "WebApplication",
            "operatingSystem": "Any",
            "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "1250"
            },
            "author": {
                "@type": "Organization",
                "name": "QUANTUM TOOLS"
            },
            "datePublished": "2025-01-01",
            "dateModified": "2025-06-12",
            "keywords": "free online tools, web utilities, PDF tools, image converter, developer tools, text tools",
            "mainEntity": [
                {
                    "@type": "SoftwareApplication",
                    "name": "PDF Toolkit",
                    "applicationCategory": "BusinessApplication",
                    "description": "Comprehensive PDF manipulation and conversion tools"
                },
                {
                    "@type": "SoftwareApplication",
                    "name": "Image Tools",
                    "applicationCategory": "MultimediaApplication",
                    "description": "Background remover, image converter, and optimization tools"
                },
                {
                    "@type": "SoftwareApplication",
                    "name": "Developer Tools",
                    "applicationCategory": "DeveloperApplication",
                    "description": "Code editor, JSON formatter, and development utilities"
                }
            ]
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    // SEO Optimizations
    setupSEOOptimizations() {
        // Dynamic meta descriptions based on current page
        this.updateMetaDescription();

        // Add breadcrumb schema
        this.setupBreadcrumbs();

        // Setup canonical URLs
        this.setupCanonicalUrls();

        // Add social media meta tags
        this.setupSocialMetaTags();

        // Track page performance metrics
        this.trackCoreWebVitals();
    }

    updateMetaDescription() {
        const currentPage = window.location.pathname;
        const descriptions = {
            '/': 'Free comprehensive suite of 50+ advanced web utilities including PDF tools, image converters, developer tools, text processors, and more.',
            '/pdf-tools/': 'Professional PDF tools for merging, splitting, converting, and manipulating PDF files online for free.',
            '/image-tools/': 'AI-powered image tools including background remover, format converter, and optimization utilities.',
            '/developer-tools/': 'Essential developer tools including live code editor, JSON formatter, and encoding utilities.',
            '/text-based-tools/': 'Advanced text processing tools for case conversion, word counting, and content analysis.',
            '/utility-tools/': 'Handy utility tools including QR generator, barcode creator, and unit converter.'
        };

        const description = descriptions[currentPage] || descriptions['/'];
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute('content', description);
        }
    }

    setupBreadcrumbs() {
        const breadcrumbData = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": this.generateBreadcrumbItems()
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(breadcrumbData);
        document.head.appendChild(script);
    }

    generateBreadcrumbItems() {
        const path = window.location.pathname;
        const items = [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://quantumtools.example.com/"
            }
        ];

        if (path.includes('PDF')) {
            items.push({
                "@type": "ListItem",
                "position": 2,
                "name": "PDF Tools",
                "item": "https://quantumtools.example.com/PDF-tools/"
            });
        }
        // Add more breadcrumb logic as needed

        return items;
    }

    // Track tool usage for analytics
    trackToolUsage() {
        document.addEventListener('click', (e) => {
            const toolCard = e.target.closest('.tool-card');
            if (toolCard) {
                const toolName = toolCard.querySelector('h3')?.textContent || 'Unknown Tool';
                gtag('event', 'tool_click', {
                    'tool_name': toolName,
                    'tool_category': this.getToolCategory(toolCard)
                });
            }
        });
    }

    trackSearchQueries() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', debounce((e) => {
                const query = e.target.value;
                if (query.length > 2) {
                    gtag('event', 'search', {
                        'search_term': query
                    });
                }
            }, 1000));
        }
    }

    trackDownloads() {
        document.addEventListener('click', (e) => {
            if (e.target.textContent.toLowerCase().includes('download') ||
                e.target.textContent.toLowerCase().includes('export')) {
                gtag('event', 'file_download', {
                    'file_type': this.getFileType(e.target),
                    'tool_used': this.getCurrentTool()
                });
            }
        });
    }

    // Core Web Vitals tracking
    trackCoreWebVitals() {
        // Track Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                gtag('event', 'LCP', {
                    value: Math.round(entry.startTime),
                    custom_parameter: 'core_web_vitals'
                });
            }
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // Track First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                gtag('event', 'FID', {
                    value: Math.round(entry.processingStart - entry.startTime),
                    custom_parameter: 'core_web_vitals'
                });
            }
        }).observe({ entryTypes: ['first-input'] });

        // Track Cumulative Layout Shift (CLS)
        let cumulativeLayoutShift = 0;
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (!entry.hadRecentInput) {
                    cumulativeLayoutShift += entry.value;
                }
            }
            gtag('event', 'CLS', {
                value: Math.round(cumulativeLayoutShift * 1000),
                custom_parameter: 'core_web_vitals'
            });
        }).observe({ entryTypes: ['layout-shift'] });
    }

    // Track user engagement
    trackUserEngagement() {
        let startTime = Date.now();
        let engaged = false;

        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', debounce(() => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (scrollPercent >= 25 && scrollPercent < 50) {
                    gtag('event', 'scroll_depth_25');
                } else if (scrollPercent >= 50 && scrollPercent < 75) {
                    gtag('event', 'scroll_depth_50');
                } else if (scrollPercent >= 75) {
                    gtag('event', 'scroll_depth_75');
                }
            }
        }, 250));

        // Track engaged sessions
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, () => {
                if (!engaged) {
                    engaged = true;
                    gtag('event', 'engagement_start');
                }
            }, { once: true, passive: true });
        });

        // Track session duration on page unload
        window.addEventListener('beforeunload', () => {
            const sessionDuration = Date.now() - startTime;
            gtag('event', 'session_duration', {
                value: Math.round(sessionDuration / 1000),
                custom_parameter: 'engagement'
            });
        });
    }

    setupPageSpeedTracking() {
        window.addEventListener('load', () => {
            // Track page load time
            const navigationTiming = performance.getEntriesByType('navigation')[0];
            if (navigationTiming) {
                gtag('event', 'page_load_time', {
                    value: Math.round(navigationTiming.loadEventStart),
                    custom_parameter: 'performance'
                });

                gtag('event', 'dom_content_loaded', {
                    value: Math.round(navigationTiming.domContentLoadedEventStart),
                    custom_parameter: 'performance'
                });
            }
        });
    }

    // Enhanced keyword optimization to improve search visibility
    enhanceKeywordRelevance() {
        // Add structured data specifically for the quantum tools brand
        const brandStructuredData = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "QUANTUM TOOLS",
            "alternateName": "QuantumTools",
            "url": "https://quantumtools.me/",
            "potentialAction": {
                "@type": "SearchAction",
                "target": "https://quantumtools.me/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
            },
            "keywords": [
                "quantum tools",
                "online tools",
                "web utilities",
                "free tools",
                "developer tools",
                "PDF tools",
                "image tools"
            ]
        };

        // Inject the JSON-LD structured data
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.innerHTML = JSON.stringify(brandStructuredData);
        document.head.appendChild(script);

        // Add additional meta tags if they don't exist
        if (!document.querySelector('meta[name="brand"]')) {
            const brandMeta = document.createElement('meta');
            brandMeta.name = 'brand';
            brandMeta.content = 'QUANTUM TOOLS';
            document.head.appendChild(brandMeta);
        }
    }

    // Helper methods
    getToolCategory(toolCard) {
        const categorySection = toolCard.closest('.category-section');
        return categorySection?.querySelector('.category-title')?.textContent || 'Unknown';
    }

    getFileType(element) {
        const text = element.textContent.toLowerCase();
        if (text.includes('pdf')) return 'pdf';
        if (text.includes('image')) return 'image';
        if (text.includes('json')) return 'json';
        return 'unknown';
    }

    getCurrentTool() {
        return document.title.split('-')[0].trim();
    }

    setupCanonicalUrls() {
        const canonical = document.createElement('link');
        canonical.rel = 'canonical';
        canonical.href = window.location.href.split('?')[0];
        document.head.appendChild(canonical);
    }

    setupSocialMetaTags() {
        const socialMetas = [
            { property: 'og:url', content: window.location.href },
            { property: 'og:type', content: 'website' },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:url', content: window.location.href }
        ];

        socialMetas.forEach(meta => {
            const element = document.createElement('meta');
            if (meta.property) element.setAttribute('property', meta.property);
            if (meta.name) element.setAttribute('name', meta.name);
            element.setAttribute('content', meta.content);
            document.head.appendChild(element);
        });
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize SEO and Analytics
document.addEventListener('DOMContentLoaded', () => {
    new SEOAnalyticsManager();
});
