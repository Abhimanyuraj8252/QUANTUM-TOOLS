/**
 * QUANTUM TOOLS - Advanced Performance & SEO Optimizer
 * Handles Core Web Vitals, Page Speed, and SEO optimizations
 * Updated: July 20, 2025
 */

(function () {
    'use strict';

    // Performance monitoring and optimization
    const PerformanceOptimizer = {
        // Critical Resource Preloader
        preloadCriticalResources: function () {
            const criticalResources = [
                { href: '/style.css', as: 'style' },
                { href: '/script.js', as: 'script' },
                { href: '/assets/images/quantum-tools-logo.svg', as: 'image' },
                { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', as: 'style', crossorigin: 'anonymous' }
            ];

            criticalResources.forEach(resource => {
                if (!document.querySelector(`link[href="${resource.href}"]`)) {
                    const link = document.createElement('link');
                    link.rel = 'preload';
                    link.href = resource.href;
                    link.as = resource.as;
                    if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
                    if (resource.as === 'style') {
                        link.onload = function () { this.rel = 'stylesheet'; };
                    }
                    document.head.appendChild(link);
                }
            });
        },

        // Lazy load images and videos
        lazyLoadMedia: function () {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            img.classList.add('loaded');
                        }
                        observer.unobserve(img);
                    }
                });
            }, { rootMargin: '50px 0px' });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        },

        // Optimize Third-party Scripts
        optimizeThirdPartyScripts: function () {
            // Defer non-critical scripts
            const deferScripts = [
                'https://www.googletagmanager.com/gtag/js',
                'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
            ];

            deferScripts.forEach(src => {
                const script = document.querySelector(`script[src*="${src}"]`);
                if (script && !script.defer) {
                    script.defer = true;
                }
            });
        },

        // Monitor Core Web Vitals
        monitorCoreWebVitals: function () {
            if ('web-vital' in window || typeof webVitals !== 'undefined') return;

            // LCP (Largest Contentful Paint)
            let lcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);

                // Track in analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'web_vital', {
                        name: 'LCP',
                        value: Math.round(lastEntry.startTime),
                        event_category: 'Web Vitals'
                    });
                }
            });

            try {
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.warn('LCP observation not supported');
            }

            // CLS (Cumulative Layout Shift)
            let clsValue = 0;
            let clsObserver = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                console.log('CLS:', clsValue);

                if (typeof gtag !== 'undefined') {
                    gtag('event', 'web_vital', {
                        name: 'CLS',
                        value: Math.round(clsValue * 1000),
                        event_category: 'Web Vitals'
                    });
                }
            });

            try {
                clsObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                console.warn('CLS observation not supported');
            }

            // FID (First Input Delay)
            let fidObserver = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    const fid = entry.processingStart - entry.startTime;
                    console.log('FID:', fid);

                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'web_vital', {
                            name: 'FID',
                            value: Math.round(fid),
                            event_category: 'Web Vitals'
                        });
                    }
                }
            });

            try {
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                console.warn('FID observation not supported');
            }
        },

        // Service Worker Registration for Caching
        registerServiceWorker: function () {
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js')
                        .then(registration => {
                            console.log('SW registered: ', registration);
                        })
                        .catch(registrationError => {
                            console.log('SW registration failed: ', registrationError);
                        });
                });
            }
        },

        // Optimize Font Loading
        optimizeFonts: function () {
            // Preload critical fonts
            const fontPreloads = [
                'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2'
            ];

            fontPreloads.forEach(href => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = href;
                link.as = 'font';
                link.type = 'font/woff2';
                link.crossOrigin = 'anonymous';
                document.head.appendChild(link);
            });

            // Font display swap for better performance
            const fontFaces = document.querySelectorAll('@font-face');
            fontFaces.forEach(fontFace => {
                if (!fontFace.style.fontDisplay) {
                    fontFace.style.fontDisplay = 'swap';
                }
            });
        },

        // Resource Hints for External Domains
        addResourceHints: function () {
            const resourceHints = [
                { rel: 'dns-prefetch', href: '//www.google-analytics.com' },
                { rel: 'dns-prefetch', href: '//www.googletagmanager.com' },
                { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
                { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
                { rel: 'preconnect', href: 'https://www.googletagmanager.com', crossorigin: true },
                { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossorigin: true }
            ];

            resourceHints.forEach(hint => {
                if (!document.querySelector(`link[href="${hint.href}"]`)) {
                    const link = document.createElement('link');
                    link.rel = hint.rel;
                    link.href = hint.href;
                    if (hint.crossorigin) link.crossOrigin = 'anonymous';
                    document.head.appendChild(link);
                }
            });
        }
    };

    // SEO Enhancements
    const SEOOptimizer = {
        // Dynamic Meta Tag Updates
        updateMetaTags: function () {
            const currentPath = window.location.pathname;
            const pageTitle = document.title;

            // Update canonical URL
            let canonical = document.querySelector('link[rel="canonical"]');
            if (canonical) {
                canonical.href = window.location.origin + currentPath;
            }

            // Update Open Graph URL
            let ogUrl = document.querySelector('meta[property="og:url"]');
            if (ogUrl) {
                ogUrl.content = window.location.href;
            }

            // Update Twitter URL
            let twitterUrl = document.querySelector('meta[name="twitter:url"]');
            if (twitterUrl) {
                twitterUrl.content = window.location.href;
            }
        },

        // Structured Data Validation
        validateStructuredData: function () {
            const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
            structuredData.forEach((script, index) => {
                try {
                    JSON.parse(script.textContent);
                    console.log(`Structured data ${index + 1} is valid`);
                } catch (e) {
                    console.error(`Structured data ${index + 1} is invalid:`, e);
                }
            });
        },

        // Social Sharing Optimization
        optimizeSocialSharing: function () {
            // Add social sharing buttons if not present
            if (!document.querySelector('.social-share-buttons')) {
                const shareContainer = document.createElement('div');
                shareContainer.className = 'social-share-buttons';
                shareContainer.innerHTML = `
                    <button onclick="shareOnFacebook()" aria-label="Share on Facebook">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                    </button>
                    <button onclick="shareOnTwitter()" aria-label="Share on Twitter">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                    </button>
                    <button onclick="shareOnLinkedIn()" aria-label="Share on LinkedIn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                    </button>
                `;

                // Add to page (you may want to customize this location)
                const targetContainer = document.querySelector('.hero-section') || document.body;
                if (targetContainer) {
                    targetContainer.appendChild(shareContainer);
                }
            }
        }
    };

    // Social Sharing Functions
    window.shareOnFacebook = function () {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${title}`, '_blank', 'width=600,height=400');
    };

    window.shareOnTwitter = function () {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank', 'width=600,height=400');
    };

    window.shareOnLinkedIn = function () {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        const description = encodeURIComponent(document.querySelector('meta[name="description"]')?.content || '');
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${description}`, '_blank', 'width=600,height=400');
    };

    // Accessibility Enhancements
    const AccessibilityOptimizer = {
        // Add skip navigation
        addSkipNavigation: function () {
            if (!document.querySelector('.skip-navigation')) {
                const skipNav = document.createElement('a');
                skipNav.href = '#main-content';
                skipNav.className = 'skip-navigation';
                skipNav.textContent = 'Skip to main content';
                skipNav.style.cssText = `
                    position: absolute;
                    top: -40px;
                    left: 6px;
                    z-index: 1000;
                    color: white;
                    background: #000;
                    padding: 8px 16px;
                    text-decoration: none;
                    border-radius: 4px;
                    transition: top 0.3s;
                `;

                skipNav.addEventListener('focus', () => {
                    skipNav.style.top = '6px';
                });

                skipNav.addEventListener('blur', () => {
                    skipNav.style.top = '-40px';
                });

                document.body.insertBefore(skipNav, document.body.firstChild);
            }
        },

        // Enhance keyboard navigation
        enhanceKeyboardNavigation: function () {
            // Add visible focus indicators
            const style = document.createElement('style');
            style.textContent = `
                .focus-visible {
                    outline: 2px solid #00f0ff !important;
                    outline-offset: 2px !important;
                }
                
                button:focus-visible,
                a:focus-visible,
                input:focus-visible,
                select:focus-visible,
                textarea:focus-visible {
                    outline: 2px solid #00f0ff !important;
                    outline-offset: 2px !important;
                }
            `;
            document.head.appendChild(style);
        }
    };

    // Initialize all optimizations
    function initializeOptimizations() {
        // Performance Optimizations
        PerformanceOptimizer.preloadCriticalResources();
        PerformanceOptimizer.addResourceHints();
        PerformanceOptimizer.optimizeFonts();
        PerformanceOptimizer.optimizeThirdPartyScripts();
        PerformanceOptimizer.registerServiceWorker();

        // SEO Optimizations
        SEOOptimizer.updateMetaTags();
        SEOOptimizer.validateStructuredData();
        SEOOptimizer.optimizeSocialSharing();

        // Accessibility Enhancements
        AccessibilityOptimizer.addSkipNavigation();
        AccessibilityOptimizer.enhanceKeyboardNavigation();

        // Initialize after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                PerformanceOptimizer.lazyLoadMedia();
                PerformanceOptimizer.monitorCoreWebVitals();
            });
        } else {
            PerformanceOptimizer.lazyLoadMedia();
            PerformanceOptimizer.monitorCoreWebVitals();
        }
    }

    // Start optimizations
    initializeOptimizations();

    // Expose global utilities
    window.QuantumToolsOptimizer = {
        Performance: PerformanceOptimizer,
        SEO: SEOOptimizer,
        Accessibility: AccessibilityOptimizer
    };

})();
