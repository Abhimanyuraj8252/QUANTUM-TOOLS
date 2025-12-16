/**
 * QUANTUM TOOLS Website - Enhanced Interactive Features
 * Modular JavaScript for improved maintainability and performance
 */

// Modular JavaScript for improved maintainability and performance

class QuantumToolsWebsite {
    constructor() {
        // Centralized DOM element selectors for better performance and maintainability
        this.elements = {
            hamburger: document.querySelector('.hamburger'),
            navLinks: document.querySelector('.nav-links'),
            navLinksArray: document.querySelectorAll('.nav-link'),
            header: document.querySelector('header'),
            ctaButton: document.querySelector('.cta-button'),
            heroText: document.querySelector('.glowing-text'),
            hero: document.querySelector('.hero'),
            heroContent: document.querySelector('.hero-content'),
            shapes: document.querySelectorAll('.floating-shape'),
            toolCards: document.querySelectorAll('.tool-card'),
            toolsSection: document.querySelector('.tools'),
            particlesContainer: document.getElementById('particles-js')
        };

        // Configuration object for easy customization
        this.config = {
            scrollThreshold: 50,
            headerOpacity: {
                scrolled: 0.95,
                default: 0.8
            },
            parallax: {
                intensity: 0.008,
                scrollFactor: 0.05,
                scaleFactor: 0.0005
            },
            animation: {
                glowOpacity: 0.3
            }
        };

        // State management
        this.state = {
            isScrolling: false,
            lastScrollY: 0
        };

        // Initialize the website functionality
        this.init();
    }

    /**
     * Initialize all website features
     */
    init() {
        this.setupGlowingText();
        this.setupMobileNavigation();
        this.setupSmoothScrolling();
        this.setupScrollEffects();
        this.setupParticleEffects();
        this.setupParallaxEffects();
        this.setupToolCardEffects();
        this.setupBrowserCompatibility();
    }

    /**
     * Utility function to get dynamic header height
     * @returns {number} Header height in pixels
     */
    getHeaderHeight() {
        return this.elements.header ? this.elements.header.offsetHeight : 80;
    }

    /**
     * Utility function to manage body overflow for mobile menu
     * @param {boolean} lock - Whether to lock or unlock body scroll
     */
    toggleBodyScroll(lock) {
        document.body.style.overflow = lock ? 'hidden' : '';
    }

    /**
     * Utility function for smooth scrolling to element
     * @param {HTMLElement} targetElement - Element to scroll to
     */
    smoothScrollToElement(targetElement) {
        if (!targetElement) return;

        const yOffset = -this.getHeaderHeight(); // Dynamic header offset
        const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({
            top: y,
            behavior: 'smooth'
        });
    }

    /**
     * Setup glowing text effect with data attribute
     */
    setupGlowingText() {
        if (this.elements.heroText) {
            this.elements.heroText.setAttribute('data-text', this.elements.heroText.textContent);
        }
    }

    /**
     * Setup mobile navigation with improved event handling
     */
    setupMobileNavigation() {
        if (!this.elements.hamburger || !this.elements.navLinks) return;

        // Main hamburger menu toggle
        this.elements.hamburger.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close menu when clicking outside navigation area
        document.addEventListener('click', (e) => {
            if (this.elements.navLinks.classList.contains('active') &&
                !this.elements.navLinks.contains(e.target) &&
                !this.elements.hamburger.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close mobile menu when clicking navigation links
        this.elements.navLinksArray.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });
    }

    /**
     * Toggle mobile menu state
     */
    toggleMobileMenu() {
        const isActive = this.elements.navLinks.classList.contains('active');

        this.elements.hamburger.classList.toggle('active');
        this.elements.navLinks.classList.toggle('active');

        // Use centralized body scroll management
        this.toggleBodyScroll(!isActive);
    }

    /**
     * Close mobile menu and restore body scroll
     */
    closeMobileMenu() {
        this.elements.hamburger.classList.remove('active');
        this.elements.navLinks.classList.remove('active');
        this.toggleBodyScroll(false);
    }

    /**
     * Setup smooth scrolling for navigation links and CTA button
     */
    setupSmoothScrolling() {
        // Navigation links smooth scrolling
        this.elements.navLinksArray.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                this.smoothScrollToElement(targetElement);
            });
        });

        // CTA Button scroll to tools section
        if (this.elements.ctaButton && this.elements.toolsSection) {
            this.elements.ctaButton.addEventListener('click', () => {
                this.smoothScrollToElement(this.elements.toolsSection);
            });
        }
    }

    /**
     * Setup scroll-based effects with performance optimization
     */
    setupScrollEffects() {
        if (!this.elements.header) return;

        // Throttled scroll handler for better performance
        const handleScroll = () => {
            if (!this.state.isScrolling) {
                requestAnimationFrame(() => {
                    this.updateHeaderOnScroll();
                    this.updateHeroParallaxOnScroll();
                    this.state.isScrolling = false;
                });
                this.state.isScrolling = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    /**
     * Update header appearance based on scroll position
     */
    updateHeaderOnScroll() {
        const { scrollThreshold, headerOpacity } = this.config;
        const scrollY = window.scrollY;

        if (scrollY > scrollThreshold) {
            this.elements.header.style.background = `rgba(26, 26, 46, ${headerOpacity.scrolled})`;
            this.elements.header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            this.elements.header.style.background = `rgba(26, 26, 46, ${headerOpacity.default})`;
            this.elements.header.style.boxShadow = 'none';
        }
    }

    /**
     * Update hero section parallax effect on scroll
     */
    updateHeroParallaxOnScroll() {
        const { heroContent } = this.elements;
        const { parallax } = this.config;
        const scrollPosition = window.scrollY;

        if (heroContent && scrollPosition < window.innerHeight) {
            const tiltAmount = scrollPosition * parallax.scrollFactor;
            const scaleAmount = 1 - scrollPosition * parallax.scaleFactor;
            heroContent.style.transform = `translateY(${tiltAmount}px) scale(${scaleAmount})`;
        }
    }

    /**
     * Initialize particles.js background animation with error handling
     */
    setupParticleEffects() {
        // Skip on mobile devices to prevent stack overflow and save performance
        if (window.innerWidth < 768) {
            console.info('Particles.js skipped on mobile for performance');
            return;
        }

        // Check if particles.js library is loaded and container exists
        if (typeof particlesJS === 'undefined' || !this.elements.particlesContainer) {
            console.warn('Particles.js not loaded or container not found');
            return;
        }

        try {
            particlesJS('particles-js', this.getParticleConfig());
        } catch (error) {
            console.error('Failed to initialize particles.js:', error);
            // Hide particles container on error
            if (this.elements.particlesContainer) {
                this.elements.particlesContainer.style.display = 'none';
            }
        }
    }

    /**
     * Get particles.js configuration object
     * @returns {Object} Particles configuration
     */
    getParticleConfig() {
        return {
            particles: {
                number: {
                    value: 30,
                    density: {
                        enable: true,
                        value_area: 1200
                    }
                },
                color: {
                    value: ['#FF2E63', '#66FCF1', '#45A29E']
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.4,
                    random: true,
                    anim: {
                        enable: false
                    }
                },
                size: {
                    value: 4,
                    random: true,
                    anim: {
                        enable: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#66FCF1',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: false
                    },
                    onclick: {
                        enable: false
                    },
                    resize: true
                }
            },
            retina_detect: false
        };
    }

    /**
     * Setup enhanced parallax effects for hero section
     */
    setupParallaxEffects() {
        const { hero, heroContent, shapes } = this.elements;
        const { parallax } = this.config;

        if (!hero || !heroContent) return;

        // Mouse move parallax effect
        document.addEventListener('mousemove', (e) => {
            // Calculate movement based on mouse position relative to viewport center
            const moveX = (e.clientX - window.innerWidth / 2) * parallax.intensity;
            const moveY = (e.clientY - window.innerHeight / 2) * parallax.intensity;

            // Apply subtle movement to hero content
            heroContent.style.transform = `translate(${moveX}px, ${moveY}px)`;

            // Apply layered movement to floating shapes for depth effect
            shapes.forEach((shape, index) => {
                const depthMultiplier = (index + 2);
                shape.style.transform = `translate(${moveX * depthMultiplier}px, ${moveY * depthMultiplier}px)`;
            });
        });
    }

    /**
     * Setup interactive effects for tool cards
     */
    setupToolCardEffects() {
        this.elements.toolCards.forEach(card => {
            // Enhanced glow effect on hover
            card.addEventListener('mouseenter', () => {
                card.style.boxShadow = `0 10px 30px rgba(9, 251, 211, ${this.config.animation.glowOpacity})`;
                card.style.transform = 'translateY(-5px)';
                card.style.transition = 'all 0.3s ease';
            });

            card.addEventListener('mouseleave', () => {
                card.style.boxShadow = 'none';
                card.style.transform = 'translateY(0)';
            });
        });
    }

    /**
     * Setup browser compatibility fallbacks
     */
    setupBrowserCompatibility() {
        // Check for backdrop-filter support and provide fallbacks
        if (!CSS.supports('backdrop-filter', 'blur(10px)')) {
            console.info('Backdrop-filter not supported, applying opacity fallbacks');

            // Apply higher opacity backgrounds for better readability
            if (this.elements.header) {
                this.elements.header.style.background = 'rgba(26, 26, 46, 0.95)';
            }

            if (this.elements.navLinks) {
                this.elements.navLinks.style.background = 'rgba(22, 33, 62, 0.95)';
            }

            this.elements.toolCards.forEach(card => {
                card.style.background = 'rgba(15, 52, 96, 0.8)';
            });
        }
    }

    /**
     * Public method to refresh element references (useful if DOM changes)
     */
    refreshElements() {
        // Re-query DOM elements in case they've changed
        Object.keys(this.elements).forEach(key => {
            const selector = this.getElementSelector(key);
            if (selector) {
                this.elements[key] = document.querySelector(selector) || document.querySelectorAll(selector);
            }
        });
    }

    /**
     * Get CSS selector for element key
     * @param {string} key - Element key
     * @returns {string|null} CSS selector
     */
    getElementSelector(key) {
        const selectors = {
            hamburger: '.hamburger',
            navLinks: '.nav-links',
            navLinksArray: '.nav-link',
            header: 'header',
            ctaButton: '.cta-button',
            heroText: '.glowing-text',
            hero: '.hero',
            heroContent: '.hero-content',
            shapes: '.floating-shape',
            toolCards: '.tool-card',
            toolsSection: '.tools',
            particlesContainer: '#particles-js'
        };

        return selectors[key] || null;
    }
}

// Initialize the website when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.quantumToolsWebsite = new QuantumToolsWebsite(); console.info('QUANTUM TOOLS website initialized successfully');
    } catch (error) {
        console.error('Failed to initialize QUANTUM TOOLS website:', error);
    }
});

// Expose utility functions globally if needed
window.QuantumToolsUtils = {
    smoothScrollTo: (selector) => {
        if (window.quantumToolsWebsite) {
            const element = document.querySelector(selector);
            window.quantumToolsWebsite.smoothScrollToElement(element);
        }
    },
    toggleMobileMenu: () => {
        if (window.quantumToolsWebsite) {
            window.quantumToolsWebsite.toggleMobileMenu();
        }
    }
};

// Handle notifications properly
document.addEventListener('DOMContentLoaded', function () {
    // Check for any notifications that need to be displayed
    const showNotification = (message, action = 'OK') => {
        // Remove any existing notifications
        const existingNotification = document.querySelector('.notification-bar');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create the notification
        const notification = document.createElement('div');
        notification.className = 'notification-bar';
        notification.innerHTML = `
            ${message}
            <button class="notification-dismiss">${action}</button>
        `;

        // Add to body
        document.body.appendChild(notification);

        // Add dismiss functionality
        const dismissBtn = notification.querySelector('.notification-dismiss');
        if (dismissBtn) {
            dismissBtn.addEventListener('click', function () {
                notification.style.opacity = '0';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            });
        }

        // Auto hide after 10 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.opacity = '0';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 10000);
    };

    // Example: Display notification if needed
    // Uncomment this to show the notification
    // showNotification('Please reopen the preview to see latest changes.');

    // Add to window object for access elsewhere
    window.showNotification = showNotification;
});
