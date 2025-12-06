// Enhanced Global Scripts for QUANTUM TOOLS
// Provides universal functionality across all pages

document.addEventListener('DOMContentLoaded', () => {
    // Preloader handling
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1000);
    }

    // Theme Toggle Functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    // Check for saved theme preference or default to 'dark'
    const currentTheme = localStorage.getItem('theme') || 'dark';
    body.classList.add(currentTheme + '-theme');

    if (themeToggle) {
        // Update toggle state based on current theme
        if (currentTheme === 'light') {
            themeToggle.classList.add('light');
        }

        themeToggle.addEventListener('click', () => {
            if (body.classList.contains('dark-theme')) {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                themeToggle.classList.add('light');
                localStorage.setItem('theme', 'light');
            } else {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
                themeToggle.classList.remove('light');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // Mobile Navigation - defer to mobile-navigation.js
    // We don't need mobile menu toggle on home page as per the requirement
    // The functionality is now handled in mobile-navigation.js

    // ...existing code...

    // Header scroll effects
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Smooth scrolling for anchor links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const yOffset = -80; // Account for header height
                const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;

                window.scrollTo({
                    top: y,
                    behavior: 'smooth'
                });
            }
        });
    });    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.reveal');
    const revealStaggerElements = document.querySelectorAll('.reveal-stagger');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const windowScrollTop = window.pageYOffset;

        // Regular reveal elements
        revealElements.forEach(element => {
            const elementTop = element.offsetTop;
            const elementHeight = element.offsetHeight;

            if (windowScrollTop + windowHeight > elementTop + elementHeight / 4) {
                element.classList.add('active');
            }
        });

        // Staggered reveal elements
        revealStaggerElements.forEach(container => {
            const containerTop = container.offsetTop;
            const containerHeight = container.offsetHeight;

            if (windowScrollTop + windowHeight > containerTop + containerHeight / 4) {
                container.classList.add('active');
            }
        });
    };

    // Initial check for elements already in view
    revealOnScroll();

    // Throttle scroll events for better performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                revealOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initialize particles.js if available
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#00f0ff'
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#00f0ff',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 6,
                    direction: 'none',
                    random: false,
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
                        enable: true,
                        mode: 'repulse'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 400,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    }

    // Set current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Error handling for broken images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', () => {
            img.style.display = 'none';
            console.warn('Failed to load image:', img.src);
        });
    });

    // Performance optimization: lazy load images
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Skip to content accessibility feature
    const skipLink = document.querySelector('.skip-to-content');
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector('#main-content');
            if (target) {
                target.focus();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        // Escape key closes mobile menu
        if (e.key === 'Escape') {
            if (hamburger && navLinks && navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // Enhanced parallax effect for hero elements
    const heroShapes = document.querySelectorAll('.floating-shape');
    if (heroShapes.length > 0) {
        window.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;

            heroShapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.5;
                const x = (mouseX - 0.5) * speed * 20;
                const y = (mouseY - 0.5) * speed * 20;

                shape.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    // Enhanced scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');

                // Add stagger effect for tool cards
                if (entry.target.classList.contains('tools-grid')) {
                    const cards = entry.target.querySelectorAll('.tool-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('revealed');
                        }, index * 200);
                    });
                }

                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.reveal, .tools-grid, .newsletter-content');
    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });

    // Enhanced typing effect for hero text
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid var(--accent-color-1)';

        let index = 0;
        const typeText = () => {
            if (index < text.length) {
                heroTitle.textContent += text.charAt(index);
                index++;
                setTimeout(typeText, 100);
            } else {
                setTimeout(() => {
                    heroTitle.style.borderRight = 'none';
                }, 1000);
            }
        };

        setTimeout(typeText, 1500);
    }

    // Enhanced performance monitoring
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);

        // Performance-heavy features are initialized separately at the bottom of this file
    });
});

// Utility functions
window.QUANTUM_TOOLS = {
    // Show notification
    showNotification: (message, type = 'info', duration = 3000) => {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: var(--glass-bg);
            border: 1px solid var(--card-border);
            border-radius: 8px;
            color: var(--text-primary);
            z-index: 10000;
            backdrop-filter: blur(10px);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    },

    // Format file size
    formatFileSize: (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Generate unique ID
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
};

// Advanced animation initialization
function initAdvancedAnimations() {
    // Particle cursor effect
    const cursor = document.createElement('div');
    cursor.className = 'cursor-trail';
    cursor.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background: var(--accent-color-1);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    document.body.appendChild(cursor);

    let trail = [];
    const maxTrail = 10;

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 3 + 'px';
        cursor.style.top = e.clientY - 3 + 'px';
        cursor.style.opacity = '0.8';

        // Create trail effect
        trail.push({ x: e.clientX, y: e.clientY });
        if (trail.length > maxTrail) {
            trail.shift();
        }

        // Update trail particles
        trail.forEach((point, index) => {
            let particle = document.querySelector(`.trail-${index}`);
            if (!particle) {
                particle = document.createElement('div');
                particle.className = `trail-${index}`;
                particle.style.cssText = `
                    position: fixed;
                    width: 4px;
                    height: 4px;
                    background: var(--accent-color-2);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 9998;
                    transition: all 0.3s ease;
                `;
                document.body.appendChild(particle);
            }

            const opacity = (index / maxTrail) * 0.5;
            particle.style.left = point.x - 2 + 'px';
            particle.style.top = point.y - 2 + 'px';
            particle.style.opacity = opacity;
        });
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });

    // Enhanced tool card interactions
    const toolCards = document.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: radial-gradient(circle, var(--accent-color-1) 0%, transparent 70%);
                transform: translate(-50%, -50%);
                pointer-events: none;
                animation: ripple-expand 0.6s ease-out;
            `;

            const style = document.createElement('style');
            style.textContent = `
                @keyframes ripple-expand {
                    to {
                        width: 200px;
                        height: 200px;
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);

            card.appendChild(ripple);

            setTimeout(() => {
                card.removeChild(ripple);
                document.head.removeChild(style);
            }, 600);
        });
    });

    // Background floating elements
    createFloatingElements();

    // Enhanced animations for featured tools section
    const featuredToolsSection = document.querySelector('.featured-tools-section');
    if (featuredToolsSection) {
        // Create a local animation observer for featured tools
        const featuredAnimationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    featuredAnimationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe featured tools for animations
        featuredAnimationObserver.observe(featuredToolsSection);

        // Add parallax effect to preview gradients
        const previewGradients = document.querySelectorAll('.preview-gradient');
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            previewGradients.forEach(gradient => {
                gradient.style.transform = `translateY(${rate}px)`;
            });
        });

        // Enhanced hover effects for featured tool cards
        const featuredCards = document.querySelectorAll('.featured-tool-card');
        featuredCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Create floating particles effect
                createCardParticles(card);
            });
        });
    }

    // Function to create floating particles on card hover
    function createCardParticles(card) {
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--accent-color-1);
                border-radius: 50%;
                pointer-events: none;
                z-index: 10;
                opacity: 0.8;
                animation: cardParticleFloat 2s ease-out forwards;
            `;

            const rect = card.getBoundingClientRect();
            particle.style.left = Math.random() * rect.width + 'px';
            particle.style.top = Math.random() * rect.height + 'px';

            card.style.position = 'relative';
            card.appendChild(particle);

            // Remove particle after animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 2000);
        }

        // Add keyframes for particle animation
        if (!document.querySelector('#cardParticleAnimation')) {
            const style = document.createElement('style');
            style.id = 'cardParticleAnimation';
            style.textContent = `
                @keyframes cardParticleFloat {
                    0% {
                        transform: translateY(0px) scale(1);
                        opacity: 0.8;
                    }
                    100% {
                        transform: translateY(-50px) scale(0);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Create floating background elements
function createFloatingElements() {
    const container = document.createElement('div');
    container.className = 'floating-elements-container';
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;

    document.body.appendChild(container);

    // Create multiple floating elements with different sizes and speeds
    for (let i = 0; i < 15; i++) {
        const element = document.createElement('div');
        const size = Math.random() * 30 + 10;
        const speed = Math.random() * 5 + 2;
        const initialX = Math.random() * 100;
        const initialY = Math.random() * 100;
        const rotation = Math.random() * 360;
        const opacity = Math.random() * 0.3 + 0.1;

        element.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '5px'};
            background: var(--accent-color-${Math.random() > 0.5 ? '1' : '2'});
            top: ${initialY}%;
            left: ${initialX}%;
            transform: rotate(${rotation}deg);
            opacity: ${opacity};
            animation: float-${i} ${speed + 10}s infinite linear;
        `;

        container.appendChild(element);

        // Create unique animation for each element
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float-${i} {
                0% { transform: translate(0, 0) rotate(${rotation}deg); }
                25% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(${rotation + 90}deg); }
                50% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(${rotation + 180}deg); }
                75% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(${rotation + 270}deg); }
                100% { transform: translate(0, 0) rotate(${rotation + 360}deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Small delay to ensure DOM is fully processed
        setTimeout(initAdvancedAnimations, 500);
    });
} else {
    // If DOM is already loaded, add a small delay before initialization
    setTimeout(initAdvancedAnimations, 500);
}

// Newsletter form functionality
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            if (!emailInput.value) {
                QUANTUM_TOOLS.showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate successful subscription
            QUANTUM_TOOLS.showNotification('Thank you for subscribing!', 'success');
        });
    }
}

// Initialize newsletter form when DOM is ready
document.addEventListener('DOMContentLoaded', initNewsletterForm);

// Advanced Search Functionality
document.addEventListener('DOMContentLoaded', function () {
    // Search data for all tools
    const searchData = [
        // Developer Tools
        {
            title: 'Code Editor',
            description: 'Advanced code editor with live preview and syntax highlighting',
            url: 'developer-tools/editor-with-live-preview/code-editor.html',
            keywords: 'code, editor, html, css, javascript, live preview, syntax highlighting, development, programming',
            icon: 'fas fa-code'
        },
        {
            title: 'Encoder Decoder',
            description: 'Universal encoder and decoder for various formats',
            url: 'developer-tools/encoder-decoder/universal-encoder-decoder.html',
            keywords: 'encode, decode, base64, url, html, unicode, hex, binary, conversion',
            icon: 'fas fa-lock'
        }, {
            title: 'JSON Formatter',
            description: 'Format, validate and minify JSON data with syntax highlighting',
            url: 'developer-tools/json-formatter-validator/json-tool.html',
            keywords: 'json, format, validate, minify, prettify, syntax, parse, data structure',
            icon: 'fas fa-file-code'
        },        // DevTools Suite
        {
            title: 'CSS Box Shadow Generator',
            description: 'Create beautiful box shadows with real-time preview',
            url: 'devtools-suite/index.html#box-shadow-tool',
            keywords: 'css, box shadow, generator, design, shadow effects, styling',
            icon: 'fas fa-cube'
        },
        {
            title: 'CSS Gradient Generator',
            description: 'Generate linear and radial gradients with live preview',
            url: 'devtools-suite/index.html#gradient-tool',
            keywords: 'css, gradient, linear, radial, color, background, design',
            icon: 'fas fa-palette'
        },
        {
            title: 'Flexbox Playground',
            description: 'Visual flexbox layout designer with code generation',
            url: 'devtools-suite/index.html#flexbox-tool',
            keywords: 'flexbox, css, layout, playground, responsive, design, flex',
            icon: 'fas fa-th-large'
        },
        {
            title: 'CSS Clip Path Generator',
            description: 'Create complex CSS clip-path shapes visually',
            url: 'devtools-suite/index.html#clip-path-tool',
            keywords: 'css, clip path, shapes, polygon, design, masking',
            icon: 'fas fa-cut'
        },
        {
            title: 'RegEx Tester',
            description: 'Test and debug regular expressions with real-time feedback',
            url: 'devtools-suite/index.html#regex-tool',
            keywords: 'regex, regular expression, pattern, test, match, validation',
            icon: 'fas fa-search'
        },
        {
            title: 'Color Contrast Checker',
            description: 'Check color accessibility and WCAG compliance',
            url: 'devtools-suite/index.html#contrast-tool',
            keywords: 'color, contrast, accessibility, wcag, compliance, a11y',
            icon: 'fas fa-eye'
        },        // DevKit Utilities
        {
            title: 'Time Zone Converter',
            description: 'Convert time between different time zones instantly',
            url: 'devkit-utilities/index.html#timezone-converter',
            keywords: 'time zone, converter, world time, clock, timezone, utc',
            icon: 'fas fa-clock'
        },
        {
            title: 'Date Calculator',
            description: 'Calculate date differences and add/subtract dates',
            url: 'devkit-utilities/index.html#date-calculator',
            keywords: 'date, calculator, difference, add, subtract, calendar',
            icon: 'fas fa-calendar-alt'
        },
        {
            title: 'Stopwatch',
            description: 'Professional stopwatch with lap timing',
            url: 'devkit-utilities/index.html#stopwatch',
            keywords: 'stopwatch, timer, lap, timing, sport, measurement',
            icon: 'fas fa-stopwatch'
        },
        {
            title: 'Countdown Timer',
            description: 'Set countdown timers for events and deadlines',
            url: 'devkit-utilities/index.html#countdown-timer',
            keywords: 'countdown, timer, alarm, deadline, event, reminder',
            icon: 'fas fa-hourglass-half'
        },
        {
            title: 'Random Number Generator',
            description: 'Generate random numbers with customizable ranges',
            url: 'devkit-utilities/index.html#random-number',
            keywords: 'random, number, generator, range, lottery, dice, probability',
            icon: 'fas fa-random'
        },
        {
            title: 'Hash Generator',
            description: 'Generate secure hashes from text or files',
            url: 'devkit-utilities/index.html#hash-generator',
            keywords: 'hash, md5, sha1, sha256, checksum, security, encryption',
            icon: 'fas fa-lock'
        },
        {
            title: 'Color Palette Generator',
            description: 'Generate beautiful color palettes for your projects',
            url: 'devkit-utilities/index.html#color-palette',
            keywords: 'color, palette, harmony, design, scheme, complementary',
            icon: 'fas fa-palette'
        },
        {
            title: 'Color Converter',
            description: 'Convert colors between different formats',
            url: 'devkit-utilities/index.html#color-converter',
            keywords: 'color, convert, hex, rgb, hsl, cmyk, format',
            icon: 'fas fa-fill-drip'
        },
        {
            title: 'CSV to JSON Converter',
            description: 'Convert CSV data to JSON format',
            url: 'devkit-utilities/index.html#csv-to-json',
            keywords: 'csv, json, convert, data, format, transformation',
            icon: 'fas fa-file-csv'
        },
        {
            title: 'JSON to CSV Converter',
            description: 'Convert JSON array to CSV format',
            url: 'devkit-utilities/index.html#json-to-csv',
            keywords: 'json, csv, convert, data, format, transformation',
            icon: 'fas fa-file-code'
        },
        {
            title: 'QR Code Reader',
            description: 'Scan and decode QR codes from images',
            url: 'devkit-utilities/index.html#qr-reader',
            keywords: 'qr code, scanner, reader, decode, barcode, mobile',
            icon: 'fas fa-qrcode'
        },// Image Tools
        {
            title: 'Background Remover',
            description: 'Remove backgrounds from images using AI technology',
            url: 'image-tools/bg-remover/bg-remover.html',
            keywords: 'background, remove, ai, image, transparent, cutout, photo editing, png',
            icon: 'fas fa-magic'
        },
        {
            title: 'Image Converter',
            description: 'Convert images between different formats with high quality',
            url: 'image-tools/image-converter/image-converter.html',
            keywords: 'image, convert, format, jpg, png, webp, gif, transformation, compression',
            icon: 'fas fa-exchange-alt'
        },
        {
            title: 'Image Optimizer',
            description: 'Resize and compress images for optimal web performance',
            url: 'image-tools/image-resizer/image-optimizer.html',
            keywords: 'image, resize, compress, optimize, format, convert, quality, resolution, dimensions, crop, filter',
            icon: 'fas fa-image'
        },        // Media Toolkit
        {
            title: 'Image Compressor',
            description: 'Compress images with adjustable quality settings',
            url: 'media-toolkit/index.html#compressor',
            keywords: 'image, compress, quality, size, optimization, file size',
            icon: 'fas fa-compress'
        },
        {
            title: 'Image Cropper',
            description: 'Crop and resize images with precision',
            url: 'media-toolkit/index.html#cropper',
            keywords: 'image, crop, resize, cut, trim, dimensions, aspect ratio',
            icon: 'fas fa-crop'
        },
        {
            title: 'Base64 Image Encoder',
            description: 'Convert images to Base64 and vice versa',
            url: 'media-toolkit/index.html#base64',
            keywords: 'base64, encode, decode, image, data url, conversion',
            icon: 'fas fa-code'
        },
        {
            title: 'Favicon Generator',
            description: 'Create favicons in multiple sizes from images',
            url: 'media-toolkit/index.html#favicon',
            keywords: 'favicon, icon, generator, website, browser, ico, png',
            icon: 'fas fa-star'
        },
        {
            title: 'Image Filters',
            description: 'Apply various filters and effects to images',
            url: 'media-toolkit/index.html#filters',
            keywords: 'image, filters, effects, photo editing, brightness, contrast',
            icon: 'fas fa-filter'
        },
        {
            title: 'Color Picker',
            description: 'Pick colors from images and get color codes',
            url: 'media-toolkit/index.html',
            keywords: 'color, picker, eyedropper, hex, rgb, color codes',
            icon: 'fas fa-eyedropper'
        },
        {
            title: 'Media Player',
            description: 'Advanced audio and video player with controls',
            url: 'media-toolkit/index.html',
            keywords: 'media, player, audio, video, mp3, mp4, controls',
            icon: 'fas fa-play'
        },

        // PDF Tools
        {
            title: 'PDF Toolkit',
            description: 'Comprehensive PDF manipulation and editing toolkit',
            url: 'pdf-tools/pdf-toolkit.html',
            keywords: 'pdf, edit, merge, split, compress, watermark, password, toolkit',
            icon: 'fas fa-file-pdf'
        },
        {
            title: 'PDF Power Suite',
            description: 'Advanced PDF tools suite with watermark, protection and metadata',
            url: 'pdf-tools/pdf-power-suite/index.html',
            keywords: 'pdf, power suite, watermark, protection, password, metadata, advanced',
            icon: 'fas fa-tools'
        },
        {
            title: 'Image to PDF',
            description: 'Convert images to PDF documents with custom settings',
            url: 'pdf-tools/file-conversion/image-to-pdf/image-to-pdf.html',
            keywords: 'image, pdf, convert, jpg, png, document, file conversion',
            icon: 'fas fa-file-export'
        },
        {
            title: 'PDF to Image',
            description: 'Extract images from PDF documents in various formats',
            url: 'pdf-tools/file-conversion/pdf-to-image/pdf-to-image.html',
            keywords: 'pdf, image, extract, convert, jpg, png, pages, export',
            icon: 'fas fa-file-import'
        },
        {
            title: 'PDF to Text',
            description: 'Extract text content from PDF documents',
            url: 'pdf-tools/file-conversion/PDF to Text/pdf-to-text.html',
            keywords: 'pdf, text, extract, convert, content, ocr, document',
            icon: 'fas fa-file-alt'
        },
        {
            title: 'Text to PDF',
            description: 'Create PDF documents from text with formatting options',
            url: 'pdf-tools/file-conversion/Text to PDF/text-to-pdf.html',
            keywords: 'text, pdf, create, convert, document, formatting, generate',
            icon: 'fas fa-file-plus'
        },
        {
            title: 'PDF Merger',
            description: 'Combine multiple PDF files into a single document',
            url: 'pdf-tools/pdf-manipulation/PDF Merger/pdf-merger.html',
            keywords: 'pdf, merge, combine, join, multiple, files, documents',
            icon: 'fas fa-object-group'
        },
        {
            title: 'PDF Splitter',
            description: 'Split PDF documents into separate pages or sections',
            url: 'pdf-tools/pdf-manipulation/PDF Splitter/pdf-splitter.html',
            keywords: 'pdf, split, separate, divide, pages, extract, sections',
            icon: 'fas fa-object-ungroup'
        },
        {
            title: 'PDF Compressor',
            description: 'Reduce PDF file size while maintaining quality',
            url: 'pdf-tools/pdf-manipulation/PDF Compressor/pdf-compressor.html',
            keywords: 'pdf, compress, reduce, size, optimize, quality, file',
            icon: 'fas fa-compress-alt'
        },
        {
            title: 'Page Manager',
            description: 'Reorder, rotate and manage PDF pages efficiently',
            url: 'pdf-tools/pdf-manipulation/Page Manager/pdf-page-manager.html',
            keywords: 'pdf, pages, manage, reorder, rotate, organize, arrange',
            icon: 'fas fa-layer-group'
        },
        {
            title: 'Protect PDF',
            description: 'Encrypt PDF files with password protection',
            url: 'pdf-tools/security-and-enhancement/password-protection/protect-pdf.html',
            keywords: 'pdf, protect, encrypt, password, security, lock',
            icon: 'fas fa-lock'
        },
        {
            title: 'Unlock PDF',
            description: 'Remove password protection from PDF files',
            url: 'pdf-tools/security-and-enhancement/remove-password/unlock-pdf.html',
            keywords: 'pdf, unlock, decrypt, remove password, security',
            icon: 'fas fa-unlock'
        },        // Text Tools
        {
            title: 'Case Converter',
            description: 'Convert text between different cases and formats',
            url: 'text-based-tools/case-converter/case-converter.html',
            keywords: 'text, case, convert, uppercase, lowercase, title, camel, snake, transform',
            icon: 'fas fa-text-height'
        },
        {
            title: 'Random Data Generator',
            description: 'Generate random data for testing and development',
            url: 'text-based-tools/random-data-generator/data-generator.html',
            keywords: 'random, data, generate, test, mock, fake, development, names, numbers',
            icon: 'fas fa-random'
        },
        {
            title: 'Word Counter',
            description: 'Count words, characters, and analyze text in real-time',
            url: 'text-based-tools/word-counter/index.html',
            keywords: 'word, count, text, character, sentence, paragraph, reading time, keyword density, analysis',
            icon: 'fas fa-font'
        },        // Text-Toolbox-Pro
        {
            title: 'Advanced Line Sorter',
            description: 'Sort text content by lines or paragraphs in various ways',
            url: 'text-toolbox-pro/index.html#sorter',
            keywords: 'sort, lines, paragraphs, alphabetical, numerical, reverse, text',
            icon: 'fas fa-sort-alpha-down'
        },
        {
            title: 'Find & Replace Tool',
            description: 'Search and replace text with various options',
            url: 'text-toolbox-pro/index.html#find-replace',
            keywords: 'find, replace, search, text, regex, case sensitive, bulk edit',
            icon: 'fas fa-search'
        },
        {
            title: 'Duplicate Remover',
            description: 'Remove duplicate lines from your text',
            url: 'text-toolbox-pro/index.html#duplicate-remover',
            keywords: 'duplicate, remove, lines, unique, clean, text processing',
            icon: 'fas fa-clone'
        },
        {
            title: 'Whitespace Remover',
            description: 'Clean up excess whitespace in your text',
            url: 'text-toolbox-pro/index.html#whitespace-remover',
            keywords: 'whitespace, remove, clean, trim, spaces, tabs, formatting',
            icon: 'fas fa-eraser'
        },
        {
            title: 'Text Reverser',
            description: 'Reverse text in different ways',
            url: 'text-toolbox-pro/index.html#text-reverser',
            keywords: 'reverse, text, backwards, flip, mirror, transform',
            icon: 'fas fa-exchange-alt'
        },
        {
            title: 'Lorem Ipsum Generator',
            description: 'Generate placeholder text for design mockups',
            url: 'text-toolbox-pro/index.html#lorem-ipsum',
            keywords: 'lorem ipsum, placeholder, text, filler, mockup, design',
            icon: 'fas fa-align-left'
        },
        {
            title: 'UUID Generator',
            description: 'Generate random UUIDs for development use',
            url: 'text-toolbox-pro/index.html#uuid-generator',
            keywords: 'uuid, guid, random, unique, identifier, development',
            icon: 'fas fa-fingerprint'
        },
        {
            title: 'Text Base64 Encoder',
            description: 'Encode and decode Base64 text',
            url: 'text-toolbox-pro/index.html#base64',
            keywords: 'base64, encode, decode, text, conversion, encoding',
            icon: 'fas fa-code'
        },
        {
            title: 'URL Encoder/Decoder',
            description: 'Encode and decode URLs and query parameters',
            url: 'text-toolbox-pro/index.html#url-encoder',
            keywords: 'url, encode, decode, percent, encoding, query parameters',
            icon: 'fas fa-link'
        },
        {
            title: 'Code Minifier',
            description: 'Minify CSS, JavaScript, and HTML code',
            url: 'text-toolbox-pro/index.html#minifier',
            keywords: 'minify, compress, css, javascript, html, code, optimization',
            icon: 'fas fa-compress-alt'
        },
        {
            title: 'Diff Checker',
            description: 'Compare two texts and highlight differences',
            url: 'text-toolbox-pro/index.html#diff-checker',
            keywords: 'diff, compare, text, differences, changes, version control',
            icon: 'fas fa-code-branch'
        },
        {
            title: 'Markdown Converter',
            description: 'Convert Markdown to HTML and vice versa',
            url: 'text-toolbox-pro/index.html#markdown',
            keywords: 'markdown, html, convert, parser, documentation, format',
            icon: 'fab fa-markdown'
        },

        // Utility Tools
        {
            title: 'Age Calculator',
            description: 'Calculate age, dates and time differences accurately',
            url: 'utility-tools/age-calculator/age-calculator.html',
            keywords: 'age, calculate, date, time, difference, years, months, days, birthday',
            icon: 'fas fa-calendar-alt'
        },
        {
            title: 'Barcode Generator',
            description: 'Generate various types of barcodes for different purposes',
            url: 'utility-tools/barcode-generator/barcode-generator.html',
            keywords: 'barcode, generate, code128, qr, upc, ean, inventory, product',
            icon: 'fas fa-barcode'
        },
        {
            title: 'QR Code Generator',
            description: 'Create customizable QR codes with logos and colors',
            url: 'utility-tools/qr-code-generator/qr-generator.html',
            keywords: 'qr, code, generate, custom, logo, color, scan, mobile, link',
            icon: 'fas fa-qrcode'
        },
        {
            title: 'Unit Converter',
            description: 'Convert between different units with quantum efficiency',
            url: 'utility-tools/unit-converter/unit-converter.html',
            keywords: 'convert, units, measurement, length, weight, temperature, time, area, volume, speed, data, energy, pressure',
            icon: 'fas fa-exchange-alt'
        },
        // Home
        {
            title: 'Home',
            description: 'Advanced web utilities for everyday tasks',
            url: 'index.html',
            keywords: 'home, tools, utilities, quantum, web tools',
            icon: 'fas fa-home'
        }
    ];

    // Fix relative URLs based on current page location using DOM detection
    function fixRelativeUrls() {
        // Find the relative path to root by examining the style.css link
        // which is present on all pages
        const styleLink = document.querySelector('link[href$="style.css"]');
        let rootPrefix = '';

        if (styleLink) {
            const href = styleLink.getAttribute('href');
            // If href is "style.css", we are at root (prefix "")
            // If href is "../style.css", prefix is "../"
            // If href is "../../style.css", prefix is "../../"
            const match = href.match(/^(.*)style\.css$/);
            if (match && match[1]) {
                rootPrefix = match[1];
            }
        } else {
            // Fallback if style.css not found (should not happen)
            const currentPath = window.location.pathname;
            const isHomePage = currentPath.endsWith('index.html') || currentPath.endsWith('/');
            if (!isHomePage) {
                // Determine depth some other way or default to one level up
                rootPrefix = '../';
            }
        }

        return searchData.map(item => {
            const newItem = { ...item };
            // Prepend the calculated root prefix to the tool's relative path from root
            newItem.url = rootPrefix + item.url;
            return newItem;
        });
    }

    const fixedSearchData = fixRelativeUrls();
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    // Function to perform search
    function performSearch(query) {
        if (!query || query.trim() === '') {
            searchResults.innerHTML = '';
            searchResults.style.display = 'none';
            return;
        }

        query = query.toLowerCase().trim();
        const results = fixedSearchData.filter(item => {
            return (
                item.title.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.keywords.toLowerCase().includes(query)
            );
        });

        displayResults(results, query);
    }

    // Function to display search results
    function displayResults(results, query) {
        if (results.length === 0) {
            searchResults.innerHTML = `<div class="no-results">No results found for "${query}"</div>`;
            searchResults.style.display = 'block';
            return;
        }

        let html = '';
        results.forEach(result => {
            html += `
                <a href="${result.url}" class="search-result-item">
                    <div class="search-result-icon">
                        <i class="${result.icon}"></i>
                    </div>
                    <div class="search-result-content">
                        <h3>${result.title}</h3>
                        <p>${result.description}</p>
                    </div>
                </a>
            `;
        });

        searchResults.innerHTML = html;
        searchResults.style.display = 'block';
    }

    // Event listener for search input
    searchInput.addEventListener('input', function () {
        performSearch(this.value);
    });

    // Event listener for search form submission
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query !== '') {
            // Get the base URL for search results page
            let searchResultsUrl;
            const currentPath = window.location.pathname;
            const isHomePage = currentPath.includes('index.html') || currentPath.endsWith('/') || currentPath.endsWith('QUANTUM-TOOLS/');

            if (isHomePage) {
                searchResultsUrl = 'Home page/search-results.html';
            } else {
                searchResultsUrl = '../../Home page/search-results.html';
            }

            // Redirect to search results page with query parameter
            window.location.href = `${searchResultsUrl}?q=${encodeURIComponent(query)}`;
        }
    });

    // Close search results when clicking outside
    document.addEventListener('click', function (e) {
        if (!searchForm.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });

    // Handle search results page functionality
    const isSearchResultsPage = window.location.pathname.includes('search-results.html');
    if (isSearchResultsPage) {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');

        if (query) {
            // Display the query in the search input and the query display
            searchInput.value = query;
            const searchQueryDisplay = document.getElementById('search-query');
            if (searchQueryDisplay) {
                searchQueryDisplay.textContent = query;
            }

            // Perform the search for the results page
            const searchResultsContainer = document.getElementById('search-results-container');
            const noResultsMessage = document.getElementById('no-results-message');

            if (searchResultsContainer) {
                // Filter results based on the query
                const results = fixedSearchData.filter(item => {
                    return (
                        item.title.toLowerCase().includes(query.toLowerCase()) ||
                        item.description.toLowerCase().includes(query.toLowerCase()) ||
                        item.keywords.toLowerCase().includes(query.toLowerCase())
                    );
                });

                // Display results or no results message
                if (results.length > 0) {
                    let html = '';
                    results.forEach(result => {
                        html += `
                            <a href="${result.url}" class="search-result-card">
                                <div class="search-result-icon">
                                    <i class="${result.icon}"></i>
                                </div>
                                <div class="search-result-content">
                                    <h3>${result.title}</h3>
                                    <p>${result.description}</p>
                                    <div class="search-result-keywords">
                                        <small>Keywords: ${result.keywords}</small>
                                    </div>
                                </div>
                            </a>
                        `;
                    });

                    searchResultsContainer.innerHTML = html;
                    if (noResultsMessage) {
                        noResultsMessage.style.display = 'none';
                    }
                } else {
                    searchResultsContainer.innerHTML = '';
                    if (noResultsMessage) {
                        noResultsMessage.style.display = 'flex';
                    }
                }
            }
        }
    }
});
