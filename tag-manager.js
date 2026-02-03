// Tag Manager System for QUANTUM TOOLS
// This file implements a comprehensive tag management system that works with Google Tag Manager
// and tracks page tags, meta information, and SEO status

class TagManager {
    constructor() {
        this.init();
    }

    init() {
        // Initialize when DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupTagManager());
        } else {
            this.setupTagManager();
        }
    }

    setupTagManager() {
        // Ensure Google Tag Manager is properly initialized
        this.checkGTMInitialization();
        
        // Tag current page
        this.tagCurrentPage();
        
        // Setup page tracking for analytics
        this.setupPageTracking();
        
        // Add tag status API endpoint
        this.setupTagStatusAPI();
        
        // Check and update canonical URLs
        this.checkCanonicalURLs();
    }

    checkGTMInitialization() {
        if (!window.dataLayer) {
            console.warn('GTM not initialized properly. Creating dataLayer.');
            window.dataLayer = window.dataLayer || [];
        }
        
        // Push a tag manager ready event
        window.dataLayer.push({
            'event': 'tagManagerReady',
            'tagManagerVersion': '1.0'
        });
    }
    
    tagCurrentPage() {
        // Get current page information
        const currentURL = window.location.href;
        const pageName = document.title || 'Unknown Page';
        const pageType = this.determinePageType();
        
        // Get meta tags information
        const metaDescription = document.querySelector('meta[name="description"]')?.content || '';
        const metaKeywords = document.querySelector('meta[name="keywords"]')?.content || '';
        
        // Create tag data structure
        const tagData = {
            url: currentURL,
            pageName: pageName,
            pageType: pageType,
            metaDescription: metaDescription,
            metaKeywords: metaKeywords,
            hasSchemaMarkup: this.checkSchemaMarkup(),
            hasSocialTags: this.checkSocialTags(),
            hasCanonical: this.checkCanonicalURL(),
            tagStatus: 'tagged'
        };
        
        // Push tag info to dataLayer
        window.dataLayer.push({
            'event': 'pageTagged',
            'tagInfo': tagData
        });
        
        // Store tag status in localStorage for 24 hours
        this.storeTagStatus(currentURL, tagData);
        
        // Update tag status in console
        console.log('✅ Page tagged:', pageName);
    }
    
    determinePageType() {
        const path = window.location.pathname;
        
        if (path === '/' || path.includes('index.html')) {
            return 'homepage';
        } else if (path.includes('pdf') || path.includes('PDF')) {
            return 'pdf-tool';
        } else if (path.includes('image') || path.includes('Image')) {
            return 'image-tool';
        } else if (path.includes('dev') || path.includes('Dev')) {
            return 'developer-tool';
        } else if (path.includes('text') || path.includes('Text')) {
            return 'text-tool';
        } else if (path.includes('utility') || path.includes('Utility')) {
            return 'utility-tool';
        } else {
            return 'other';
        }
    }
    
    checkSchemaMarkup() {
        return document.querySelectorAll('script[type="application/ld+json"]').length > 0;
    }
    
    checkSocialTags() {
        const ogTags = document.querySelectorAll('meta[property^="og:"]').length > 0;
        const twitterTags = document.querySelectorAll('meta[name^="twitter:"]').length > 0;
        return ogTags || twitterTags;
    }
    
    checkCanonicalURL() {
        return document.querySelector('link[rel="canonical"]') !== null;
    }
    
    storeTagStatus(url, tagData) {
        // Simple storage mechanism for tag status
        const key = 'quantum_tag_status';
        
        // Get existing tag data
        let storedTagData = {};
        try {
            const stored = localStorage.getItem(key);
            if (stored) {
                storedTagData = JSON.parse(stored);
            }
        } catch (e) {
            console.error('Error parsing stored tag data', e);
        }
        
        // Add current URL tag data
        storedTagData[url] = {
            ...tagData,
            timestamp: new Date().toISOString()
        };
        
        // Clean up old entries (older than 24 hours)
        const oneDayAgo = new Date();
        oneDayAgo.setHours(oneDayAgo.getHours() - 24);
        
        for (const storedUrl in storedTagData) {
            const timestamp = new Date(storedTagData[storedUrl].timestamp);
            if (timestamp < oneDayAgo) {
                delete storedTagData[storedUrl];
            }
        }
        
        // Store updated tag data
        localStorage.setItem(key, JSON.stringify(storedTagData));
    }
    
    setupPageTracking() {
        // Track page views with detailed information
        if (typeof gtag === 'function') {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                page_path: window.location.pathname,
                tag_status: 'tagged'
            });
        }
        
        // Listen for history changes (SPA navigation)
        let lastUrl = window.location.href;
        
        // Create a new MutationObserver to watch for URL changes
        const observer = new MutationObserver(() => {
            if (window.location.href !== lastUrl) {
                lastUrl = window.location.href;
                this.tagCurrentPage();
            }
        });
        
        // Start observing the document for changes
        observer.observe(document, { subtree: true, childList: true });
    }
    
    setupTagStatusAPI() {
        // Create a global API for checking tag status
        window.quantumTagManager = {
            getTagStatus: (url = window.location.href) => {
                const key = 'quantum_tag_status';
                try {
                    const stored = localStorage.getItem(key);
                    if (stored) {
                        const tagData = JSON.parse(stored);
                        return tagData[url] || { tagStatus: 'not_tagged' };
                    }
                } catch (e) {
                    console.error('Error retrieving tag status', e);
                }
                return { tagStatus: 'unknown' };
            },
            refreshTag: () => {
                this.tagCurrentPage();
                return true;
            },
            getAllTaggedPages: () => {
                const key = 'quantum_tag_status';
                try {
                    const stored = localStorage.getItem(key);
                    if (stored) {
                        return JSON.parse(stored);
                    }
                } catch (e) {
                    console.error('Error retrieving all tag statuses', e);
                }
                return {};
            }
        };
    }
    
    checkCanonicalURLs() {
        const canonical = document.querySelector('link[rel="canonical"]');
        const currentUrl = window.location.href.split('#')[0].split('?')[0];
        
        if (!canonical) {
            // Create canonical tag if missing
            const link = document.createElement('link');
            link.rel = 'canonical';
            link.href = currentUrl;
            document.head.appendChild(link);
            
            console.log('✅ Added missing canonical URL');
        } else if (!canonical.href.includes(window.location.host)) {
            // Fix canonical URL if pointing to a different domain
            canonical.href = currentUrl;
            console.log('✅ Fixed incorrect canonical URL');
        }
    }
}

// Auto-initialize Tag Manager
document.addEventListener('DOMContentLoaded', () => {
    new TagManager();
});

// Create global instance for access from console
window.QUANTUM_TAG_MANAGER = new TagManager();
