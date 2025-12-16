// Content and Marketing Manager for QUANTUM TOOLS
class ContentMarketingManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupNewsletterFunctionality();

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
            // 5-star reviews (Excellent)
            {
                name: "Sarah Johnson",
                role: "Graphic Designer",
                content: "The background remover is pure magic! I've tried so many tools but this one actually gets the hair details right. Saved me hours of Photoshop work.",
                rating: 5
            },
            {
                name: "Mike Chen",
                role: "Full Stack Developer",
                content: "Finally a code editor that just works. Live preview, syntax highlighting, no signup needed. This is exactly what I was looking for!",
                rating: 5
            },
            {
                name: "Priya Sharma",
                role: "Content Creator",
                content: "Been using the PDF tools daily for my business. Merging invoices, compressing large files - everything works flawlessly. Highly recommend!",
                rating: 5
            },
            {
                name: "David Miller",
                role: "Marketing Manager",
                content: "QR code generator is top-notch. Created custom branded QR codes for our campaign in minutes. The customization options are impressive.",
                rating: 5
            },
            {
                name: "Aisha Patel",
                role: "Freelance Writer",
                content: "Word counter tool has become essential for my work. The readability analysis helps me write better content for different audiences.",
                rating: 5
            },
            {
                name: "James Wilson",
                role: "Photographer",
                content: "Image compression without quality loss? I was skeptical but this actually delivers. My portfolio loads so much faster now.",
                rating: 5
            },
            // 4-star reviews (Good)
            {
                name: "Lisa Thompson",
                role: "HR Specialist",
                content: "PDF merger works great for most documents. Sometimes struggles with very large files but overall a solid free tool.",
                rating: 4
            },
            {
                name: "Carlos Rodriguez",
                role: "Small Business Owner",
                content: "Good collection of tools. The barcode generator helped me label my inventory. Would love to see more customization options.",
                rating: 4
            },
            {
                name: "Emma Watson",
                role: "Teacher",
                content: "Use the unit converter with my students daily. Simple and accurate. The interface could be a bit more intuitive though.",
                rating: 4
            },
            {
                name: "Raj Malhotra",
                role: "Startup Founder",
                content: "JSON formatter saved my debugging session! Quick and reliable. Just wish it had dark mode for late night coding.",
                rating: 4
            },
            {
                name: "Sophie Chen",
                role: "UX Designer",
                content: "Color picker is handy for quick hex code extraction. Works well but missing some advanced features like palette generation.",
                rating: 4
            },
            {
                name: "Michael Brown",
                role: "Accountant",
                content: "PDF splitter does what it says. Extracted pages from a 200-page report easily. Interface is clean and simple.",
                rating: 4
            },
            {
                name: "Nina Petrova",
                role: "Digital Marketer",
                content: "Image resizer is convenient for social media graphics. Batch processing would be a nice addition for future updates.",
                rating: 4
            },
            // 3-star reviews (Average)
            {
                name: "Tom Anderson",
                role: "Student",
                content: "Tools work okay for basic needs. Sometimes the page loads slowly and I've encountered a few bugs. Free so can't complain much.",
                rating: 3
            },
            {
                name: "Jennifer Lee",
                role: "Blogger",
                content: "Background remover is hit or miss. Works great on simple images but struggles with complex backgrounds. Room for improvement.",
                rating: 3
            },
            {
                name: "Kevin O'Brien",
                role: "IT Consultant",
                content: "Decent set of utilities. Not the most feature-rich but gets the job done. Would recommend for casual users.",
                rating: 3
            },
            {
                name: "Fatima Hassan",
                role: "Researcher",
                content: "PDF converter quality varies by document. Some formatting gets lost. Okay for simple docs, not ideal for complex layouts.",
                rating: 3
            },
            {
                name: "Alex Nguyen",
                role: "Graphic Artist",
                content: "Image tools are basic but functional. Missing advanced editing features I need. Good for quick fixes though.",
                rating: 3
            },
            // 2-star reviews (Poor)
            {
                name: "Robert Taylor",
                role: "Office Manager",
                content: "PDF merge failed on my encrypted files multiple times. Had to use another tool. The error messages aren't helpful.",
                rating: 2
            },
            {
                name: "Maria Garcia",
                role: "Photographer",
                content: "Background removal left weird edges on my product photos. Spent more time fixing it than if I'd used Photoshop directly.",
                rating: 2
            },
            {
                name: "Chris Johnson",
                role: "Web Developer",
                content: "Code editor crashed twice and lost my work. No auto-save feature is a big miss. Had to switch to another tool.",
                rating: 2
            },
            // 1-star reviews (Very Poor)
            {
                name: "Derek Smith",
                role: "Business Analyst",
                content: "Waste of time. PDF compressor barely reduced file size and made the text blurry. Would not recommend for important documents.",
                rating: 1
            },
            {
                name: "Susan Miller",
                role: "Legal Assistant",
                content: "Tried to merge legal documents but the tool kept timing out. Very frustrating experience. Need more reliable servers.",
                rating: 1
            },
            {
                name: "Paul Jackson",
                role: "Architect",
                content: "Image converter ruined my high-res blueprints. Quality was terrible even on highest settings. Stick to professional software.",
                rating: 1
            }
        ];

        // Shuffle testimonials for variety
        const shuffled = testimonials.sort(() => Math.random() - 0.5);
        this.createTestimonialsSection(shuffled);
    }

    createTestimonialsSection(testimonials) {
        // Calculate rating stats
        const avgRating = (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1);

        const testimonialsHTML = `
            <section class="testimonials-section" style="padding: 40px 0; margin: 0; background: linear-gradient(135deg, rgba(4, 15, 40, 0.95) 0%, rgba(8, 25, 55, 0.95) 100%);">
                <div class="container">
                    <div class="section-header" style="margin-bottom: 20px; text-align: center;">
                        <h2 class="section-title" style="margin-bottom: 8px; font-size: 1.8rem; background: linear-gradient(45deg, #00f0ff, #e100ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                            <i class="fas fa-quote-right" style="-webkit-text-fill-color: #00f0ff;"></i> What Our Users Say
                        </h2>
                        <p class="section-subtitle" style="margin: 0; color: #94a3b8; font-size: 0.9rem;">Based on ${testimonials.length} reviews • Average Rating: <span style="color: #00ff88; font-weight: bold;">${avgRating}/5</span></p>
                    </div>
                    
                    <div class="testimonials-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px; max-height: 600px; overflow-y: auto; padding: 5px; scroll-behavior: smooth;">
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
        // Get initials from name
        const initials = testimonial.name.split(' ').map(n => n[0]).join('');

        // Color based on rating
        let starColor, borderColor, avatarGradient;
        if (testimonial.rating <= 2) {
            // Negative - Red
            starColor = '#ff4757';
            borderColor = 'rgba(255, 71, 87, 0.5)';
            avatarGradient = 'linear-gradient(135deg, #ff4757, #ff6b81)';
        } else if (testimonial.rating === 3) {
            // Average - Yellow/Orange
            starColor = '#ffa502';
            borderColor = 'rgba(255, 165, 2, 0.5)';
            avatarGradient = 'linear-gradient(135deg, #ffa502, #ffbe76)';
        } else {
            // Good/Excellent - Green/Gold
            starColor = testimonial.rating === 5 ? '#00ff88' : '#2ed573';
            borderColor = testimonial.rating === 5 ? 'rgba(0, 255, 136, 0.5)' : 'rgba(46, 213, 115, 0.5)';
            avatarGradient = testimonial.rating === 5 ? 'linear-gradient(135deg, #00f0ff, #00ff88)' : 'linear-gradient(135deg, #2ed573, #7bed9f)';
        }

        const filledStars = '★'.repeat(testimonial.rating);
        const emptyStars = '☆'.repeat(5 - testimonial.rating);

        return `
            <div class="testimonial-card" style="border: 1px solid ${borderColor}; background: rgba(18, 24, 38, 0.9); border-radius: 16px; padding: 20px; backdrop-filter: blur(10px);">
                <div class="testimonial-content">
                    <div class="stars" style="color: ${starColor}; font-size: 1.2rem; margin-bottom: 12px;">${filledStars}<span style="color: #4a5568;">${emptyStars}</span></div>
                    <p style="color: #e2e8f0; font-size: 0.95rem; line-height: 1.6; margin-bottom: 15px;">"${testimonial.content}"</p>
                </div>
                <div class="testimonial-author" style="display: flex; align-items: center; gap: 12px;">
                    <div class="avatar-initials" style="width: 45px; height: 45px; border-radius: 50%; background: ${avatarGradient}; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #0a0d14; font-size: 1rem;">${initials}</div>
                    <div class="author-info">
                        <h4 style="color: #f5f7fa; font-size: 0.95rem; margin: 0 0 2px 0;">${testimonial.name}</h4>
                        <span style="color: #94a3b8; font-size: 0.8rem;">${testimonial.role}</span>
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

    // Newsletter popup (optional feature)
    addNewsletterPopup() {
        // Skip popup on pages with newsletter already visible
        if (document.querySelector('.newsletter')) return;

        // Could add exit-intent popup here if needed
        console.log('Newsletter popup ready');
    }

    // Email validation setup
    setupEmailValidation() {
        // Already handled in bindNewsletterEvents
        console.log('Email validation ready');
    }

    // Help center creation
    createHelpCenter() {
        // Optional help center widget
        console.log('Help center ready');
    }

    // Community features
    setupCommunityFeatures() {
        // Optional community features
        console.log('Community features ready');
    }
}

// Initialize Content and Marketing features
document.addEventListener('DOMContentLoaded', () => {
    new ContentMarketingManager();
});
