// Content and Marketing Manager for QUANTUM TOOLS
class ContentMarketingManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupNewsletterFunctionality();
        this.addBlogSection();
        this.setupSocialSharing();
        this.addToolDescriptions();
        this.setupTutorials();
        this.addTestimonials();
        this.setupCommunityFeatures();
    }

    // Enhanced Newsletter Implementation
    setupNewsletterFunctionality() {
        this.enhanceNewsletterForm();
        this.addNewsletterPopup();
        this.setupEmailValidation();
    }

    enhanceNewsletterForm() {
        const newsletterSection = document.querySelector('.newsletter');
        if (newsletterSection) {
            const enhancedHTML = `
                <div class="newsletter-content">
                    <div class="newsletter-header">
                        <h2><i class="fas fa-envelope"></i> Stay Updated with QUANTUM TOOLS</h2>
                        <p>Get the latest tools, tips, and tutorials delivered to your inbox</p>
                    </div>
                    
                    <form class="enhanced-newsletter-form" id="newsletter-form">
                        <div class="form-group">
                            <input type="email" id="newsletter-email" placeholder="Enter your email" required>
                            <div class="email-validation-msg"></div>
                        </div>
                        
                        <div class="preferences-group">
                            <h4>What interests you?</h4>
                            <div class="checkbox-group">
                                <label><input type="checkbox" value="new-tools" checked> New Tools</label>
                                <label><input type="checkbox" value="tutorials"> Tutorials</label>
                                <label><input type="checkbox" value="tips"> Tips & Tricks</label>
                                <label><input type="checkbox" value="updates"> Product Updates</label>
                            </div>
                        </div>
                        
                        <button type="submit" class="newsletter-btn">
                            <span class="btn-text">Subscribe</span>
                            <span class="btn-loading">Subscribing...</span>
                            <i class="fas fa-paper-plane"></i>
                        </button>
                        
                        <p class="privacy-note">
                            <i class="fas fa-shield-alt"></i>
                            We respect your privacy. Unsubscribe at any time.
                        </p>
                    </form>
                    
                    <div class="newsletter-success" id="newsletter-success">
                        <i class="fas fa-check-circle"></i>
                        <h3>Welcome to QUANTUM TOOLS!</h3>
                        <p>Check your email to confirm your subscription</p>
                    </div>
                </div>
            `;
            
            newsletterSection.innerHTML = enhancedHTML;
            this.bindNewsletterEvents();
        }
    }

    bindNewsletterEvents() {
        const form = document.getElementById('newsletter-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubmission(e.target);
            });

            // Real-time email validation
            const emailInput = document.getElementById('newsletter-email');
            emailInput.addEventListener('blur', () => {
                this.validateEmail(emailInput);
            });
        }
    }

    async handleNewsletterSubmission(form) {
        const submitBtn = form.querySelector('.newsletter-btn');
        const email = form.querySelector('#newsletter-email').value;
        const preferences = Array.from(form.querySelectorAll('input[type="checkbox"]:checked'))
            .map(cb => cb.value);

        // Show loading state
        submitBtn.classList.add('loading');

        try {
            // Simulate API call (replace with actual newsletter service)
            await this.subscribeToNewsletter(email, preferences);
            
            // Show success message
            this.showNewsletterSuccess();
            
            // Track subscription
            if (typeof gtag !== 'undefined') {
                gtag('event', 'newsletter_signup', {
                    email: email,
                    preferences: preferences.join(',')
                });
            }
        } catch (error) {
            this.showNewsletterError(error.message);
        } finally {
            submitBtn.classList.remove('loading');
        }
    }

    // Blog Section Implementation
    addBlogSection() {
        const blogData = [
            {
                title: "10 Essential PDF Tools Every Professional Needs",
                excerpt: "Discover the most useful PDF manipulation tools that can save you hours of work...",
                category: "PDF Tools",
                readTime: "5 min read",
                date: "2025-06-10",
                image: "/assets/blog/pdf-tools-guide.jpg"
            },
            {
                title: "AI-Powered Background Removal: How It Works",
                excerpt: "Learn the technology behind our background removal tool and how to get the best results...",
                category: "Image Tools",
                readTime: "7 min read",
                date: "2025-06-08",
                image: "/assets/blog/ai-background-removal.jpg"
            },
            {
                title: "Developer Productivity: Essential Online Tools",
                excerpt: "Boost your coding efficiency with these must-have online development tools...",
                category: "Developer Tools",
                readTime: "6 min read",
                date: "2025-06-05",
                image: "/assets/blog/developer-productivity.jpg"
            }
        ];

        this.createBlogSection(blogData);
    }

    createBlogSection(posts) {
        const blogHTML = `
            <section class="blog-section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">
                            <i class="fas fa-blog"></i> Latest Articles & Tutorials
                        </h2>
                        <p class="section-subtitle">Learn tips, tricks, and best practices for using our tools</p>
                    </div>
                    
                    <div class="blog-grid">
                        ${posts.map(post => this.createBlogCard(post)).join('')}
                    </div>
                    
                    <div class="blog-cta">
                        <a href="/blog" class="btn-secondary">View All Articles</a>
                    </div>
                </div>
            </section>
        `;

        // Insert before footer
        const footer = document.querySelector('footer');
        if (footer) {
            footer.insertAdjacentHTML('beforebegin', blogHTML);
        }
    }

    createBlogCard(post) {
        return `
            <article class="blog-card">
                <div class="blog-image">
                    <img src="${post.image}" alt="${post.title}" loading="lazy">
                    <div class="blog-category">${post.category}</div>
                </div>
                <div class="blog-content">
                    <div class="blog-meta">
                        <span class="blog-date">
                            <i class="fas fa-calendar"></i>
                            ${new Date(post.date).toLocaleDateString()}
                        </span>
                        <span class="blog-read-time">
                            <i class="fas fa-clock"></i>
                            ${post.readTime}
                        </span>
                    </div>
                    <h3 class="blog-title">${post.title}</h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <a href="/blog/${this.slugify(post.title)}" class="blog-read-more">
                        Read More <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </article>
        `;
    }

    // Social Sharing Setup
    setupSocialSharing() {
        this.addSocialShareButtons();
        this.trackSocialShares();
    }

    addSocialShareButtons() {
        const toolPages = document.querySelectorAll('.tool-section, .main-content');
        toolPages.forEach(page => {
            if (!page.querySelector('.social-share')) {
                const shareHTML = `
                    <div class="social-share">
                        <h4>Share this tool:</h4>
                        <div class="share-buttons">
                            <button class="share-btn twitter" data-platform="twitter">
                                <i class="fab fa-twitter"></i>
                                Twitter
                            </button>
                            <button class="share-btn facebook" data-platform="facebook">
                                <i class="fab fa-facebook"></i>
                                Facebook
                            </button>
                            <button class="share-btn linkedin" data-platform="linkedin">
                                <i class="fab fa-linkedin"></i>
                                LinkedIn
                            </button>
                            <button class="share-btn copy-link" data-platform="copy">
                                <i class="fas fa-link"></i>
                                Copy Link
                            </button>
                        </div>
                    </div>
                `;
                page.insertAdjacentHTML('beforeend', shareHTML);
            }
        });

        this.bindSocialShareEvents();
    }

    bindSocialShareEvents() {
        document.addEventListener('click', (e) => {
            const shareBtn = e.target.closest('.share-btn');
            if (shareBtn) {
                const platform = shareBtn.dataset.platform;
                this.handleSocialShare(platform);
            }
        });
    }

    handleSocialShare(platform) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        const description = encodeURIComponent(
            document.querySelector('meta[name="description"]')?.content || 
            'Check out this amazing tool on QUANTUM TOOLS!'
        );

        const shareUrls = {
            twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
            copy: null
        };

        if (platform === 'copy') {
            this.copyToClipboard(window.location.href);
        } else {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }

        // Track social shares
        if (typeof gtag !== 'undefined') {
            gtag('event', 'share', {
                method: platform,
                content_type: 'tool',
                content_id: window.location.pathname
            });
        }
    }

    // Tool Descriptions Enhancement
    addToolDescriptions() {
        const toolDescriptions = {
            'PDF Toolkit': {
                benefits: ['Merge multiple PDFs instantly', 'Split large documents', 'Compress without quality loss'],
                useCases: ['Business presentations', 'Document management', 'File size optimization']
            },
            'Background Remover': {
                benefits: ['AI-powered accuracy', 'No manual editing needed', 'Professional results'],
                useCases: ['Product photography', 'Profile pictures', 'Marketing materials']
            },
            'Code Editor': {
                benefits: ['Live preview', 'Syntax highlighting', 'Multiple languages'],
                useCases: ['Quick prototyping', 'Code testing', 'Learning programming']
            }
        };

        this.enhanceToolCards(toolDescriptions);
    }

    enhanceToolCards(descriptions) {
        document.querySelectorAll('.tool-card').forEach(card => {
            const toolName = card.querySelector('h3')?.textContent;
            const description = descriptions[toolName];
            
            if (description) {
                // Add detailed description on hover/focus
                card.addEventListener('mouseenter', () => {
                    this.showToolTooltip(card, description);
                });
                
                card.addEventListener('mouseleave', () => {
                    this.hideToolTooltip();
                });
            }
        });
    }

    showToolTooltip(card, description) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tool-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <h4>Key Benefits:</h4>
                <ul>${description.benefits.map(benefit => `<li>${benefit}</li>`).join('')}</ul>
                <h4>Perfect For:</h4>
                <ul>${description.useCases.map(useCase => `<li>${useCase}</li>`).join('')}</ul>
            </div>
        `;
        
        document.body.appendChild(tooltip);
        
        // Position tooltip
        const rect = card.getBoundingClientRect();
        tooltip.style.top = `${rect.top + window.scrollY - 10}px`;
        tooltip.style.left = `${rect.right + 10}px`;
        
        setTimeout(() => tooltip.classList.add('show'), 10);
    }

    hideToolTooltip() {
        const tooltip = document.querySelector('.tool-tooltip');
        if (tooltip) {
            tooltip.classList.remove('show');
            setTimeout(() => tooltip.remove(), 300);
        }
    }

    // Tutorials Setup
    setupTutorials() {
        this.addTutorialLinks();
        this.createHelpCenter();
    }

    addTutorialLinks() {
        const tutorials = [
            { tool: 'PDF Toolkit', video: 'https://youtube.com/watch?v=example1' },
            { tool: 'Background Remover', video: 'https://youtube.com/watch?v=example2' },
            { tool: 'Code Editor', video: 'https://youtube.com/watch?v=example3' }
        ];

        tutorials.forEach(tutorial => {
            const toolCards = document.querySelectorAll('.tool-card');
            toolCards.forEach(card => {
                const toolName = card.querySelector('h3')?.textContent;
                if (toolName === tutorial.tool) {
                    const tutorialBtn = document.createElement('a');
                    tutorialBtn.className = 'tutorial-btn';
                    tutorialBtn.href = tutorial.video;
                    tutorialBtn.target = '_blank';
                    tutorialBtn.innerHTML = '<i class="fas fa-play"></i> Watch Tutorial';
                    card.appendChild(tutorialBtn);
                }
            });
        });
    }

    // Testimonials
    addTestimonials() {
        const testimonials = [
            {
                name: "Sarah Johnson",
                role: "Graphic Designer",
                content: "The background remover tool saved me hours of work. It's incredibly accurate!",
                rating: 5,
                avatar: "/assets/testimonials/sarah.jpg"
            },
            {
                name: "Mike Chen",
                role: "Developer",
                content: "Best online code editor I've used. The live preview feature is fantastic.",
                rating: 5,
                avatar: "/assets/testimonials/mike.jpg"
            },
            {
                name: "Emily Rodriguez",
                role: "Project Manager",
                content: "PDF toolkit is perfect for our document management needs. Highly recommend!",
                rating: 5,
                avatar: "/assets/testimonials/emily.jpg"
            }
        ];

        this.createTestimonialsSection(testimonials);
    }

    createTestimonialsSection(testimonials) {
        const testimonialsHTML = `
            <section class="testimonials-section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">
                            <i class="fas fa-quote-right"></i> What Our Users Say
                        </h2>
                        <p class="section-subtitle">Join thousands of satisfied users worldwide</p>
                    </div>
                    
                    <div class="testimonials-grid">
                        ${testimonials.map(testimonial => this.createTestimonialCard(testimonial)).join('')}
                    </div>
                </div>
            </section>
        `;

        // Insert before newsletter section
        const newsletter = document.querySelector('.newsletter');
        if (newsletter) {
            newsletter.insertAdjacentHTML('beforebegin', testimonialsHTML);
        }
    }

    createTestimonialCard(testimonial) {
        return `
            <div class="testimonial-card">
                <div class="testimonial-content">
                    <div class="stars">${'★'.repeat(testimonial.rating)}</div>
                    <p>"${testimonial.content}"</p>
                </div>
                <div class="testimonial-author">
                    <img src="${testimonial.avatar}" alt="${testimonial.name}" loading="lazy">
                    <div class="author-info">
                        <h4>${testimonial.name}</h4>
                        <span>${testimonial.role}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Utility Methods
    async subscribeToNewsletter(email, preferences) {
        // Simulate API call - replace with actual service
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this.isValidEmail(email)) {
                    // Store in localStorage for demo
                    const subscribers = JSON.parse(localStorage.getItem('qtools_subscribers') || '[]');
                    subscribers.push({ email, preferences, date: new Date().toISOString() });
                    localStorage.setItem('qtools_subscribers', JSON.stringify(subscribers));
                    resolve({ success: true });
                } else {
                    reject(new Error('Invalid email address'));
                }
            }, 1000);
        });
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    validateEmail(input) {
        const isValid = this.isValidEmail(input.value);
        const msgElement = input.parentNode.querySelector('.email-validation-msg');
        
        if (input.value && !isValid) {
            msgElement.textContent = 'Please enter a valid email address';
            msgElement.className = 'email-validation-msg error';
            input.classList.add('error');
        } else {
            msgElement.textContent = '';
            msgElement.className = 'email-validation-msg';
            input.classList.remove('error');
        }
    }

    showNewsletterSuccess() {
        const form = document.getElementById('newsletter-form');
        const success = document.getElementById('newsletter-success');
        
        form.style.display = 'none';
        success.style.display = 'block';
    }

    showNewsletterError(message) {
        // Create error notification
        const notification = document.createElement('div');
        notification.className = 'notification error';
        notification.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>Newsletter signup failed: ${message}</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            // Show success notification
            const notification = document.createElement('div');
            notification.className = 'notification success';
            notification.innerHTML = `
                <i class="fas fa-check"></i>
                <span>Link copied to clipboard!</span>
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => notification.classList.add('show'), 100);
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        });
    }

    slugify(text) {
        return text.toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    }

    trackSocialShares() {
        // Track social media engagement
        window.addEventListener('blur', () => {
            // User might have switched to social media
            setTimeout(() => {
                if (document.hasFocus()) {
                    // User came back, possible share action
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'potential_share_return');
                    }
                }
            }, 3000);
        });
    }
}

// Initialize Content and Marketing features
document.addEventListener('DOMContentLoaded', () => {
    new ContentMarketingManager();
});
