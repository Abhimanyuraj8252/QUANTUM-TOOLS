// User Experience Enhancement Manager for QUANTUM TOOLS
class UXEnhancementManager {
    constructor() {
        this.userPreferences = this.loadUserPreferences();
        this.recentlyUsedTools = this.loadRecentlyUsedTools();
        this.favoriteTools = this.loadFavoriteTools();
        this.init();
    }

    init() {
        this.setupUserDashboard();
        this.setupToolRecommendations();
        this.setupRecentlyUsedSection();
        this.setupFavoriteTools();
        this.setupAccessibilityFeatures();
        this.setupAdvancedSearch();
        this.setupToolRating();
        this.setupKeyboardShortcuts();
    }

    // User Dashboard Setup
    setupUserDashboard() {
        this.createDashboardModal();
        this.addDashboardButton();
    }

    createDashboardModal() {
        const dashboardHTML = `
            <div id="user-dashboard-modal" class="dashboard-modal">
                <div class="dashboard-content">
                    <div class="dashboard-header">
                        <h2><i class="fas fa-tachometer-alt"></i> Your Dashboard</h2>
                        <button class="close-dashboard" aria-label="Close Dashboard">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="dashboard-tabs">
                        <button class="tab-btn active" data-tab="recent">Recently Used</button>
                        <button class="tab-btn" data-tab="favorites">Favorites</button>
                        <button class="tab-btn" data-tab="preferences">Preferences</button>
                        <button class="tab-btn" data-tab="stats">Usage Stats</button>
                    </div>

                    <div id="recent-tab" class="dashboard-tab active">
                        <h3>Recently Used Tools</h3>
                        <div id="recent-tools-list" class="tools-grid"></div>
                    </div>

                    <div id="favorites-tab" class="dashboard-tab">
                        <h3>Favorite Tools</h3>
                        <div id="favorite-tools-list" class="tools-grid"></div>
                    </div>

                    <div id="preferences-tab" class="dashboard-tab">
                        <h3>Your Preferences</h3>
                        <div class="preference-group">
                            <label>
                                <input type="checkbox" id="auto-save-settings"> 
                                Auto-save tool settings
                            </label>
                            <label>
                                <input type="checkbox" id="show-tooltips"> 
                                Show helpful tooltips
                            </label>
                            <label>
                                <input type="checkbox" id="enable-shortcuts"> 
                                Enable keyboard shortcuts
                            </label>
                            <label>
                                <input type="checkbox" id="compact-mode"> 
                                Compact interface mode
                            </label>
                        </div>
                    </div>

                    <div id="stats-tab" class="dashboard-tab">
                        <h3>Usage Statistics</h3>
                        <div id="usage-stats" class="stats-container"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', dashboardHTML);
        this.bindDashboardEvents();
    }

    addDashboardButton() {
        const targetContainer = document.querySelector('.top-right-elements');
        if (targetContainer) {
            const dashboardBtn = document.createElement('button');
            dashboardBtn.className = 'dashboard-btn theme-toggle'; // Reusing theme-toggle class for consistent sizing/style if applicable, or just dashboard-btn
            dashboardBtn.innerHTML = '<i class="fas fa-tachometer-alt"></i>';
            dashboardBtn.title = 'Open Dashboard';
            dashboardBtn.style.marginRight = '10px'; // Add some spacing
            dashboardBtn.style.width = '40px'; // Ensure consistent width
            dashboardBtn.style.justifyContent = 'center';

            dashboardBtn.addEventListener('click', () => this.openDashboard());

            // Insert before the theme toggle (last element usually)
            targetContainer.insertBefore(dashboardBtn, targetContainer.firstChild);
        }
    }

    bindDashboardEvents() {
        // Close dashboard
        document.querySelector('.close-dashboard').addEventListener('click', () => {
            this.closeDashboard();
        });

        // Tab switching
        document.querySelectorAll('.dashboard-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchDashboardTab(e.target.dataset.tab);
            });
        });

        // Preference toggles
        document.querySelectorAll('#preferences-tab input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = this.userPreferences[checkbox.id] || false;
            checkbox.addEventListener('change', (e) => {
                this.updatePreference(e.target.id, e.target.checked);
            });
        });

        // Close on outside click
        document.getElementById('user-dashboard-modal').addEventListener('click', (e) => {
            if (e.target.id === 'user-dashboard-modal') {
                this.closeDashboard();
            }
        });
    }

    // Recently Used Tools
    setupRecentlyUsedSection() {
        // Add to homepage
        this.addRecentlyUsedToHomepage();

        // Track tool usage
        this.trackToolUsage();
    }

    addRecentlyUsedToHomepage() {
        const toolsSection = document.querySelector('#tools');
        if (toolsSection && this.recentlyUsedTools.length > 0) {
            const recentSection = document.createElement('section');
            recentSection.className = 'recently-used-section';
            recentSection.innerHTML = `
                <div class="container">
                    <h2 class="section-title">
                        <i class="fas fa-clock"></i> Recently Used Tools
                    </h2>
                    <div class="recent-tools-grid">
                        ${this.renderRecentTools()}
                    </div>
                </div>
            `;
            toolsSection.parentNode.insertBefore(recentSection, toolsSection);
        }
    }

    renderRecentTools() {
        return this.recentlyUsedTools.slice(0, 6).map(tool => `
            <a href="${tool.url}" class="recent-tool-card">
                <div class="tool-icon">
                    <i class="${tool.icon}"></i>
                </div>
                <h3>${tool.name}</h3>
                <span class="last-used">Used ${this.formatTimeAgo(tool.lastUsed)}</span>
            </a>
        `).join('');
    }

    trackToolUsage() {
        document.addEventListener('click', (e) => {
            // Ensure target is an Element before calling closest()
            if (!e.target || typeof e.target.closest !== 'function') return;

            const toolCard = e.target.closest('.tool-card, a[href*=".html"]');
            if (toolCard && toolCard.href) {
                const toolData = {
                    name: toolCard.querySelector('h3')?.textContent || 'Unknown Tool',
                    url: toolCard.href,
                    icon: toolCard.querySelector('.tool-icon i')?.className || 'fas fa-tool',
                    lastUsed: Date.now()
                };
                this.addToRecentlyUsed(toolData);
            }
        });
    }

    addToRecentlyUsed(toolData) {
        // Remove if already exists
        this.recentlyUsedTools = this.recentlyUsedTools.filter(tool => tool.url !== toolData.url);

        // Add to beginning
        this.recentlyUsedTools.unshift(toolData);

        // Keep only last 20
        this.recentlyUsedTools = this.recentlyUsedTools.slice(0, 20);

        this.saveRecentlyUsedTools();
        this.updateDashboardContent();
    }

    // Favorite Tools
    setupFavoriteTools() {
        this.addFavoriteButtons();
    }

    addFavoriteButtons() {
        document.addEventListener('mouseover', (e) => {
            // Ensure target is an Element before calling closest()
            if (!e.target || typeof e.target.closest !== 'function') return;

            const toolCard = e.target.closest('.tool-card');
            if (toolCard && !toolCard.querySelector('.favorite-btn')) {
                this.addFavoriteButton(toolCard);
            }
        }, true);
    }

    addFavoriteButton(toolCard) {
        const toolUrl = toolCard.href;
        const isFavorite = this.favoriteTools.some(tool => tool.url === toolUrl);

        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = `favorite-btn ${isFavorite ? 'favorited' : ''}`;
        favoriteBtn.innerHTML = `<i class="fas fa-heart"></i>`;
        favoriteBtn.title = isFavorite ? 'Remove from favorites' : 'Add to favorites';

        favoriteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleFavorite(toolCard);
        });

        toolCard.style.position = 'relative';
        toolCard.appendChild(favoriteBtn);
    }

    toggleFavorite(toolCard) {
        const toolData = {
            name: toolCard.querySelector('h3')?.textContent || 'Unknown Tool',
            url: toolCard.href,
            icon: toolCard.querySelector('.tool-icon i')?.className || 'fas fa-tool',
            addedAt: Date.now()
        };

        const existingIndex = this.favoriteTools.findIndex(tool => tool.url === toolData.url);
        const favoriteBtn = toolCard.querySelector('.favorite-btn');

        if (existingIndex > -1) {
            // Remove from favorites
            this.favoriteTools.splice(existingIndex, 1);
            favoriteBtn.classList.remove('favorited');
            favoriteBtn.title = 'Add to favorites';
            this.showNotification('Removed from favorites', 'success');
        } else {
            // Add to favorites
            this.favoriteTools.push(toolData);
            favoriteBtn.classList.add('favorited');
            favoriteBtn.title = 'Remove from favorites';
            this.showNotification('Added to favorites', 'success');
        }

        this.saveFavoriteTools();
        this.updateDashboardContent();
    }

    // Tool Recommendations
    setupToolRecommendations() {
        this.addRecommendationsSection();
    }

    addRecommendationsSection() {
        const currentTool = this.getCurrentToolCategory();
        if (currentTool) {
            const recommendations = this.getToolRecommendations(currentTool);
            if (recommendations.length > 0) {
                this.createRecommendationsWidget(recommendations);
            }
        }
    }

    getToolRecommendations(category) {
        const recommendations = {
            'pdf': ['Image to PDF', 'PDF Merger', 'PDF Compressor'],
            'image': ['Background Remover', 'Image Converter', 'Image Compressor'],
            'text': ['Case Converter', 'Word Counter', 'Markdown Converter'],
            'developer': ['JSON Formatter', 'Code Editor', 'Encoder/Decoder']
        };
        return recommendations[category] || [];
    }

    // Advanced Search
    setupAdvancedSearch() {
        this.enhanceSearchFunctionality();
        this.addSearchFilters();
        this.setupSearchHistory();
    }

    enhanceSearchFunctionality() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            // Add search suggestions
            this.addSearchSuggestions(searchInput);

            // Add search filters
            this.addSearchFilters();
        }
    }

    // Accessibility Features
    setupAccessibilityFeatures() {
        this.addSkipLinks();
        this.enhanceKeyboardNavigation();
        this.addARIALabels();
        this.setupFocusManagement();
    }

    // Skip links for keyboard navigation
    addSkipLinks() {
        // Skip link already exists or add one
        if (!document.querySelector('.skip-link')) {
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.className = 'skip-link';
            skipLink.textContent = 'Skip to main content';
            document.body.insertBefore(skipLink, document.body.firstChild);
        }
    }

    // Enhance keyboard navigation
    enhanceKeyboardNavigation() {
        // Add focus styles and keyboard handlers
        document.querySelectorAll('.tool-card, .nav-link, button').forEach(el => {
            el.setAttribute('tabindex', '0');
        });
    }

    // Add ARIA labels
    addARIALabels() {
        // Add aria-labels to interactive elements without them
        document.querySelectorAll('button:not([aria-label])').forEach(btn => {
            const text = btn.textContent?.trim();
            if (text) {
                btn.setAttribute('aria-label', text);
            }
        });
    }

    // Setup focus management
    setupFocusManagement() {
        // Track focus for modals and dropdowns
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-user');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-user');
        });
    }

    // Keyboard Shortcuts
    setupKeyboardShortcuts() {
        if (this.userPreferences['enable-shortcuts']) {
            document.addEventListener('keydown', (e) => {
                // Ctrl/Cmd + K for search
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    document.getElementById('search-input')?.focus();
                }

                // Ctrl/Cmd + D for dashboard
                if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                    e.preventDefault();
                    this.openDashboard();
                }

                // Escape to close modals
                if (e.key === 'Escape') {
                    this.closeDashboard();
                }
            });
        }
    }

    // Tool Rating System
    setupToolRating() {
        this.addRatingToTools();
    }

    addRatingToTools() {
        document.querySelectorAll('.tool-card').forEach(toolCard => {
            const toolName = toolCard.querySelector('h3')?.textContent;
            if (toolName) {
                const rating = this.getToolRating(toolName);
                if (rating) {
                    this.addRatingDisplay(toolCard, rating);
                }
            }
        });
    }

    // Utility Methods
    openDashboard() {
        document.getElementById('user-dashboard-modal').style.display = 'flex';
        this.updateDashboardContent();
        document.body.style.overflow = 'hidden';
    }

    closeDashboard() {
        document.getElementById('user-dashboard-modal').style.display = 'none';
        document.body.style.overflow = '';
    }

    switchDashboardTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.dashboard-tabs .tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.dashboard-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    updateDashboardContent() {
        // Update recent tools
        const recentList = document.getElementById('recent-tools-list');
        if (recentList) {
            recentList.innerHTML = this.renderRecentTools();
        }

        // Update favorites
        const favoritesList = document.getElementById('favorite-tools-list');
        if (favoritesList) {
            favoritesList.innerHTML = this.renderFavoriteTools();
        }

        // Update stats
        this.updateUsageStats();
    }

    renderFavoriteTools() {
        if (this.favoriteTools.length === 0) {
            return '<p class="empty-state">No favorite tools yet. Click the heart icon on any tool to add it here!</p>';
        }

        return this.favoriteTools.map(tool => `
            <a href="${tool.url}" class="favorite-tool-card">
                <div class="tool-icon">
                    <i class="${tool.icon}"></i>
                </div>
                <h3>${tool.name}</h3>
                <button class="remove-favorite" data-url="${tool.url}">
                    <i class="fas fa-times"></i>
                </button>
            </a>
        `).join('');
    }

    updateUsageStats() {
        const statsContainer = document.getElementById('usage-stats');
        if (statsContainer) {
            const stats = {
                totalToolsUsed: this.recentlyUsedTools.length,
                favoriteCount: this.favoriteTools.length,
                mostUsedCategory: this.getMostUsedCategory(),
                sessionDuration: this.getSessionDuration()
            };

            statsContainer.innerHTML = `
                <div class="stat-item">
                    <h4>Tools Used</h4>
                    <span class="stat-value">${stats.totalToolsUsed}</span>
                </div>
                <div class="stat-item">
                    <h4>Favorites</h4>
                    <span class="stat-value">${stats.favoriteCount}</span>
                </div>
                <div class="stat-item">
                    <h4>Most Used Category</h4>
                    <span class="stat-value">${stats.mostUsedCategory}</span>
                </div>
                <div class="stat-item">
                    <h4>Session Time</h4>
                    <span class="stat-value">${stats.sessionDuration}</span>
                </div>
            `;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Storage Methods
    loadUserPreferences() {
        const saved = localStorage.getItem('qtools_user_preferences');
        return saved ? JSON.parse(saved) : {};
    }

    saveUserPreferences() {
        localStorage.setItem('qtools_user_preferences', JSON.stringify(this.userPreferences));
    }

    updatePreference(key, value) {
        this.userPreferences[key] = value;
        this.saveUserPreferences();

        // Apply preference immediately if needed
        if (key === 'enable-shortcuts') {
            this.setupKeyboardShortcuts();
        }
    }

    loadRecentlyUsedTools() {
        const saved = localStorage.getItem('qtools_recent_tools');
        return saved ? JSON.parse(saved) : [];
    }

    saveRecentlyUsedTools() {
        localStorage.setItem('qtools_recent_tools', JSON.stringify(this.recentlyUsedTools));
    }

    loadFavoriteTools() {
        const saved = localStorage.getItem('qtools_favorite_tools');
        return saved ? JSON.parse(saved) : [];
    }

    saveFavoriteTools() {
        localStorage.setItem('qtools_favorite_tools', JSON.stringify(this.favoriteTools));
    }

    // Helper Methods
    formatTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    }

    getCurrentToolCategory() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('pdf')) return 'pdf';
        if (path.includes('image')) return 'image';
        if (path.includes('text')) return 'text';
        if (path.includes('developer')) return 'developer';
        return null;
    }

    getMostUsedCategory() {
        // Analyze recent tools to find most used category
        const categories = {};
        this.recentlyUsedTools.forEach(tool => {
            const category = this.getCategoryFromUrl(tool.url);
            categories[category] = (categories[category] || 0) + 1;
        });

        const categoryKeys = Object.keys(categories);
        if (categoryKeys.length === 0) return 'N/A';

        return categoryKeys.reduce((a, b) =>
            categories[a] > categories[b] ? a : b
        );
    }

    getCategoryFromUrl(url) {
        const u = url.toLowerCase();
        if (u.includes('pdf')) return 'PDF Tools';
        if (u.includes('image')) return 'Image Tools';
        if (u.includes('text')) return 'Text Tools';
        if (u.includes('developer')) return 'Developer Tools';
        if (u.includes('media')) return 'Media Toolkit';
        return 'Utility Tools';
    }

    getSessionDuration() {
        const sessionStart = sessionStorage.getItem('qtools_session_start') || Date.now();
        const duration = Date.now() - parseInt(sessionStart);
        const minutes = Math.floor(duration / (1000 * 60));
        return `${minutes}m`;
    }

    getToolRating(toolName) {
        // Mock ratings - in real app, this would come from a database
        const ratings = {
            'PDF Toolkit': 4.8,
            'Background Remover': 4.9,
            'Image Converter': 4.7,
            'Code Editor': 4.6
        };
        return ratings[toolName];
    }

    addRatingDisplay(toolCard, rating) {
        const ratingHTML = `
            <div class="tool-rating">
                <span class="rating-stars">${'★'.repeat(Math.floor(rating))}</span>
                <span class="rating-value">${rating}</span>
            </div>
        `;
        toolCard.insertAdjacentHTML('beforeend', ratingHTML);
    }
}

// Initialize UX Enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Set session start time
    if (!sessionStorage.getItem('qtools_session_start')) {
        sessionStorage.setItem('qtools_session_start', Date.now().toString());
    }

    new UXEnhancementManager();
});
