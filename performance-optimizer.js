// Performance Optimization for QUANTUM TOOLS
// Image lazy loading, CSS/JS minification, and caching

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.setupImageLazyLoading();
        this.setupResourcePreloading();
        this.setupCaching();
        this.setupCriticalCSS();
        this.optimizeAnimations();
        this.setupResponsiveImageSrcset();
        this.implementAdaptiveLoading();
        this.optimizeWebFonts();
        this.monitorCoreWebVitals();
    }

    // Image Lazy Loading with Intersection Observer
    setupImageLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        images.forEach(img => imageObserver.observe(img));    }
    
    // Preload critical resources
    setupResourcePreloading() {
        const criticalResources = [
            'style.css',
            'script.js',
            'Home page/universal-nav.css'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }

    // Setup caching strategies
    setupCaching() {
        // Register service worker for caching
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered:', registration);
                })
                .catch(error => {
                    console.log('SW registration failed:', error);
                });
        }

        // Cache API responses
        this.setupLocalStorageCache();
    }

    setupLocalStorageCache() {
        const cache = {
            set: (key, data, expiry = 3600000) => { // 1 hour default
                const item = {
                    data: data,
                    timestamp: Date.now(),
                    expiry: expiry
                };
                localStorage.setItem(`qtools_${key}`, JSON.stringify(item));
            },
            
            get: (key) => {
                const item = localStorage.getItem(`qtools_${key}`);
                if (!item) return null;
                
                const parsed = JSON.parse(item);
                if (Date.now() - parsed.timestamp > parsed.expiry) {
                    localStorage.removeItem(`qtools_${key}`);
                    return null;
                }
                return parsed.data;
            }
        };

        window.QToolsCache = cache;
    }

    // Setup critical CSS
    setupCriticalCSS() {
        // Inline critical CSS for above-the-fold content
        const criticalCSS = `
            header, .hero, .nav-links, .hamburger {
                display: flex;
                position: relative;
            }
            body { margin: 0; font-family: 'Inter', sans-serif; }
            .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        `;

        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);
    }

    // Optimize animations for performance
    optimizeAnimations() {
        // Use CSS containment for better performance
        const animatedElements = document.querySelectorAll('.tool-card, .reveal, .floating-shape');
        animatedElements.forEach(element => {
            element.style.contain = 'layout style paint';
        });

        // Throttle scroll events
        let ticking = false;
        const scrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Scroll-based animations here
                    this.updateScrollAnimations();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', scrollHandler, { passive: true });
    }

    updateScrollAnimations() {
        const scrollY = window.scrollY;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    // Resource compression helper
    compressImage(file, quality = 0.8) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                canvas.toBlob(resolve, 'image/jpeg', quality);
            };

            img.src = URL.createObjectURL(file);
        });
    }

    // Enhanced responsive images with srcset
    setupResponsiveImageSrcset() {
        const responsiveImages = document.querySelectorAll('img[data-srcset]');
        responsiveImages.forEach(img => {
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
        });
    }

    // Adaptive loading based on network conditions and device capabilities
    implementAdaptiveLoading() {
        // Check for network information API
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            // Handle slow connections
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                this.loadLightweightAssets();
            }
            
            // Save-Data header detection
            if (connection.saveData) {
                this.enableDataSavingMode();
            }
        }
    }
    
    loadLightweightAssets() {
        // Replace high-quality images with lower quality ones
        document.querySelectorAll('img[data-low-src]').forEach(img => {
            img.src = img.dataset.lowSrc;
        });
        
        // Disable non-essential animations
        document.documentElement.classList.add('reduced-motion');
    }
    
    enableDataSavingMode() {
        // Disable auto-playing videos
        document.querySelectorAll('video[autoplay]').forEach(video => {
            video.removeAttribute('autoplay');
            video.setAttribute('preload', 'none');
        });
        
        // Disable heavy scripts
        document.querySelectorAll('script[data-nonessential]').forEach(script => {
            script.setAttribute('type', 'text/plain');
        });
    }

    // Optimize web fonts loading
    optimizeWebFonts() {
        // Add font-display: swap to all font face rules
        if ('fonts' in document) {
            document.fonts.ready.then(() => {
                // Mark fonts as loaded in the DOM
                document.documentElement.classList.add('fonts-loaded');
            });
        }
        
        // Preload key web fonts
        const fontFiles = ['fonts/main-regular.woff2', 'fonts/main-bold.woff2'];
        fontFiles.forEach(font => {
            const preloadLink = document.createElement('link');
            preloadLink.href = font;
            preloadLink.rel = 'preload';
            preloadLink.as = 'font';
            preloadLink.type = 'font/woff2';
            preloadLink.crossOrigin = 'anonymous';
            document.head.appendChild(preloadLink);
        });
    }

    // Core Web Vitals monitoring
    monitorCoreWebVitals() {
        if ('PerformanceObserver' in window) {
            // LCP - Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
                // Send to analytics
                if (window.gtag) {
                    gtag('event', 'core_web_vitals', {
                        'metric_name': 'LCP',
                        'metric_value': lastEntry.startTime
                    });
                }
            });
            lcpObserver.observe({type: 'largest-contentful-paint', buffered: true});
            
            // FID - First Input Delay
            const fidObserver = new PerformanceObserver((entryList) => {
                const entries = entryList.getEntries();
                entries.forEach(entry => {
                    console.log('FID:', entry.processingStart - entry.startTime);
                    // Send to analytics
                    if (window.gtag) {
                        gtag('event', 'core_web_vitals', {
                            'metric_name': 'FID',
                            'metric_value': entry.processingStart - entry.startTime
                        });
                    }
                });
            });
            fidObserver.observe({type: 'first-input', buffered: true});
            
            // CLS - Cumulative Layout Shift
            const clsObserver = new PerformanceObserver((entryList) => {
                let clsValue = 0;
                entryList.getEntries().forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                console.log('CLS:', clsValue);
                // Send to analytics
                if (window.gtag) {
                    gtag('event', 'core_web_vitals', {
                        'metric_name': 'CLS',
                        'metric_value': clsValue
                    });
                }
            });
            clsObserver.observe({type: 'layout-shift', buffered: true});
        }
    }
}

// Initialize performance optimizer when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PerformanceOptimizer();
});
