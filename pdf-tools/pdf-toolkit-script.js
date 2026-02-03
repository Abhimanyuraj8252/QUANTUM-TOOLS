// All-in-One PDF Toolkit JavaScript

// Theme Management
class ThemeManager {
    constructor() {
        this.init();
    }
    
    init() {
        const themeToggle = document.getElementById('theme-toggle');
        const savedTheme = localStorage.getItem('pdf-toolkit-theme') || 'dark';
        
        document.body.classList.add(`${savedTheme}-theme`);
        this.updateThemeIcon(savedTheme);
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
    
    toggleTheme() {
        const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.body.classList.remove(`${currentTheme}-theme`);
        document.body.classList.add(`${newTheme}-theme`);
        
        localStorage.setItem('pdf-toolkit-theme', newTheme);
        this.updateThemeIcon(newTheme);
    }
    
    updateThemeIcon(theme) {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            }
        }
    }
}

// Tool Router
class ToolRouter {
    constructor() {
        this.init();
    }
    
    init() {
        this.bindToolCards();
    }
    
    bindToolCards() {
        const toolCards = document.querySelectorAll('.tool-card');
        toolCards.forEach(card => {
            card.addEventListener('click', () => {
                const tool = card.dataset.tool;
                this.navigateToTool(tool);
            });
            
            // Add keyboard navigation
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const tool = card.dataset.tool;
                    this.navigateToTool(tool);
                }
            });
            
            // Make cards focusable
            card.setAttribute('tabindex', '0');
        });
    }    navigateToTool(tool) {
        // Tool URL mapping
        const toolUrls = {
            'image-to-pdf': './File Conversion/Image to PDF/image-to-pdf.html',
            'text-to-pdf': './File Conversion/Text to PDF/text-to-pdf.html',
            'pdf-to-image': './File Conversion/PDF to Image/pdf-to-image.html',
            'pdf-to-text': './File Conversion/PDF to Text/pdf-to-text.html',
            'pdf-merger': './PDF Manipulation/PDF Merger/pdf-merger.html',
            'pdf-splitter': './PDF Manipulation/PDF Splitter/pdf-splitter.html',
            'page-manager': './PDF Manipulation/Page Manager/pdf-page-manager.html',
            'pdf-compressor': './PDF Manipulation/PDF Compressor/pdf-compressor.html',
            'watermark-tool': './PDF Power Suite/index.html?tab=watermark',
            'password-protection': './PDF Power Suite/index.html?tab=protect',
            'pdf-unlock': './PDF Power Suite/index.html?tab=remove',
            'pdf-info': './PDF Power Suite/index.html?tab=metadata'
        };
          const url = toolUrls[tool];
        console.log(`Navigating to tool: ${tool}, URL: ${url}`);
        
        if (url) {
            // Special handling for PDF Power Suite tools
            if (tool === 'watermark-tool' || tool === 'password-protection' || tool === 'pdf-unlock' || tool === 'pdf-info') {
                console.log(`Redirecting to PDF Power Suite with specific tab for: ${tool}`);
                
                // Add loading animation
                const card = document.querySelector(`[data-tool="${tool}"]`);
                if (card) {
                    card.style.opacity = '0.7';
                    card.style.transform = 'scale(0.95)';
                    card.style.transition = 'all 0.3s ease';
                    
                    // Add loading indicator
                    const loadingIndicator = document.createElement('div');
                    loadingIndicator.className = 'loading-indicator';
                    loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                    card.style.position = 'relative';
                    card.appendChild(loadingIndicator);
                }
                
                // Navigate to PDF Power Suite with tab parameter
                setTimeout(() => {
                    window.location.href = url;
                }, 300);
                
                return;
            }
            // Add loading animation
            const card = document.querySelector(`[data-tool="${tool}"]`);
            if (card) {
                card.style.opacity = '0.7';
                card.style.transform = 'scale(0.95)';
                card.style.transition = 'all 0.3s ease';
                
                // Add loading indicator
                const loadingIndicator = document.createElement('div');
                loadingIndicator.className = 'loading-indicator';
                loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                loadingIndicator.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 10px;
                    border-radius: 50%;
                    z-index: 1000;
                `;
                card.style.position = 'relative';
                card.appendChild(loadingIndicator);
            }
            
            // Navigate after short delay for UX
            setTimeout(() => {
                window.location.href = url;
            }, 200);
        } else {
            console.error(`No URL found for tool: ${tool}`);
            this.showNotification('Tool coming soon!', 'warning');
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            background: type === 'warning' ? 'var(--warning-color)' : 'var(--accent-color-1)',
            color: 'white',
            borderRadius: '8px',
            zIndex: '10000',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Test function to verify all tool links
    testAllLinks() {
        const toolUrls = {
            'image-to-pdf': './File Conversion/Image to PDF/image-to-pdf.html',
            'text-to-pdf': './File Conversion/Text to PDF/text-to-pdf.html',
            'pdf-to-image': './File Conversion/PDF to Image/pdf-to-image.html',
            'pdf-to-text': './File Conversion/PDF to Text/pdf-to-text.html',
            'pdf-merger': './PDF Manipulation/PDF Merger/pdf-merger.html',
            'pdf-splitter': './PDF Manipulation/PDF Splitter/pdf-splitter.html',
            'page-manager': './PDF Manipulation/Page Manager/pdf-page-manager.html',
            'pdf-compressor': './PDF Manipulation/PDF Compressor/pdf-compressor.html',
            'watermark-tool': './Security & Enhancement/Add Watermark/watermark-tool.html',
            'password-protection': './Security & Enhancement/Password Protection/password-protection.html',
            'pdf-unlock': './Security & Enhancement/Remove  Password/pdf-unlock.html',
            'pdf-info': './Security & Enhancement/PDF Info/pdf-info.html'
        };

        console.log('Testing all PDF tool links...');
        const results = {};
        
        Object.entries(toolUrls).forEach(([tool, url]) => {
            // Check if card exists
            const card = document.querySelector(`[data-tool="${tool}"]`);
            results[tool] = {
                url: url,
                cardExists: !!card,
                dataAttribute: card?.getAttribute('data-tool')
            };
        });
        
        console.table(results);
        return results;
    }
}

// Animation Controller
class AnimationController {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupLoadingAnimations();
    }
    
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe elements for scroll animations
        const animateElements = document.querySelectorAll('.tool-card, .feature-card, .hero-content');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    
    setupHoverEffects() {
        const cards = document.querySelectorAll('.tool-card, .feature-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.addGlowEffect(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.removeGlowEffect(card);
            });
        });
    }
    
    setupLoadingAnimations() {
        // Add stagger animation to tool cards
        const toolCards = document.querySelectorAll('.tool-card');
        toolCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    addGlowEffect(element) {
        element.style.boxShadow = '0 10px 30px rgba(0, 240, 255, 0.3), 0 0 20px rgba(0, 240, 255, 0.1)';
    }
    
    removeGlowEffect(element) {
        element.style.boxShadow = '';
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        this.measureLoadTime();
        this.setupErrorHandling();
    }
    
    measureLoadTime() {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`PDF Toolkit loaded in ${loadTime.toFixed(2)}ms`);
            
            // Optional: Send analytics if needed
            this.trackPerformance(loadTime);
        });
    }
    
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('PDF Toolkit Error:', event.error);
            this.handleError(event.error);
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled Promise Rejection:', event.reason);
            this.handleError(event.reason);
        });
    }
    
    trackPerformance(loadTime) {
        // Store performance metrics
        const performanceData = {
            loadTime,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
        
        localStorage.setItem('pdf-toolkit-performance', JSON.stringify(performanceData));
    }
    
    handleError(error) {
        // Log error for debugging
        const errorData = {
            message: error.message || error,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        console.error('Error logged:', errorData);
        
        // Optional: Show user-friendly error message
        if (error.message && error.message.includes('PDF')) {
            this.showErrorMessage('PDF processing error. Please try again.');
        }
    }
    
    showErrorMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
        `;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '12px 20px',
            background: 'var(--error-color)',
            color: 'white',
            borderRadius: '8px',
            zIndex: '10000',
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 100);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
}

// Mobile Navigation
class MobileNavigation {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupHamburgerMenu();
        this.setupTouchNavigation();
    }
    
    setupHamburgerMenu() {
        const hamburger = document.querySelector('.hamburger');
        if (hamburger) {
            hamburger.addEventListener('click', this.toggleMobileMenu.bind(this));
        }
    }
    
    setupTouchNavigation() {
        // Add touch-friendly interactions for mobile
        const toolCards = document.querySelectorAll('.tool-card');
        toolCards.forEach(card => {
            card.addEventListener('touchstart', this.handleTouchStart.bind(this));
            card.addEventListener('touchend', this.handleTouchEnd.bind(this));
        });
    }
    
    toggleMobileMenu() {
        // Implementation would depend on mobile menu structure
        console.log('Mobile menu toggled');
    }
    
    handleTouchStart(event) {
        const card = event.currentTarget;
        card.style.transform = 'scale(0.98)';
    }
    
    handleTouchEnd(event) {
        const card = event.currentTarget;
        card.style.transform = '';
    }
}

// Accessibility Manager
class AccessibilityManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupKeyboardNavigation();
        this.setupAriaLabels();
        this.setupFocusManagement();
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                this.highlightFocusedElement();
            }
        });
    }
    
    setupAriaLabels() {
        const toolCards = document.querySelectorAll('.tool-card');
        toolCards.forEach(card => {
            const title = card.querySelector('.tool-title').textContent;
            const description = card.querySelector('.tool-description').textContent;
            card.setAttribute('aria-label', `${title}: ${description}`);
            card.setAttribute('role', 'button');
        });
    }
    
    setupFocusManagement() {
        const focusableElements = document.querySelectorAll(
            'a, button, [tabindex]:not([tabindex="-1"]), .tool-card'
        );
        
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '2px solid var(--accent-color-1)';
                element.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', () => {
                element.style.outline = '';
                element.style.outlineOffset = '';
            });
        });
    }
    
    highlightFocusedElement() {
        const focused = document.activeElement;
        if (focused && focused !== document.body) {
            focused.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    const themeManager = new ThemeManager();
    const toolRouter = new ToolRouter();
    const animationController = new AnimationController();
    const performanceMonitor = new PerformanceMonitor();
    const mobileNavigation = new MobileNavigation();
    const accessibilityManager = new AccessibilityManager();
    
    // Make test function available globally for debugging
    window.testPDFLinks = () => toolRouter.testAllLinks();
    
    // Add loading complete class
    document.body.classList.add('loaded');
    
    // Log initialization with available tools
    console.log('PDF Toolkit initialized successfully');
    console.log('Available tools:', Object.keys({
        'image-to-pdf': 'Image to PDF',
        'text-to-pdf': 'Text to PDF', 
        'pdf-to-image': 'PDF to Image',
        'pdf-to-text': 'PDF to Text',
        'pdf-merger': 'PDF Merger',
        'pdf-splitter': 'PDF Splitter',
        'page-manager': 'Page Manager',
        'pdf-compressor': 'PDF Compressor',
        'watermark-tool': 'Add Watermark',
        'password-protection': 'Password Protection',
        'pdf-unlock': 'Remove Password',
        'pdf-info': 'PDF Info'
    }));
    console.log('Run testPDFLinks() in console to test all links');
});

// Export for potential use in other modules
window.PDFToolkit = {
    ThemeManager,
    ToolRouter,
    AnimationController,
    PerformanceMonitor,
    MobileNavigation,
    AccessibilityManager
};
