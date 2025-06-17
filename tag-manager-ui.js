// Tag Manager UI for QUANTUM TOOLS
// This file provides a user interface for managing and monitoring tags

class TagManagerUI {
    constructor() {
        this.isOverlayVisible = false;
        this.init();
    }
    
    init() {
        // Initialize when DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        this.injectStyles();
        this.createToggleButton();
        this.createOverlay();
        this.bindEvents();
        this.scanSite();
    }
    
    injectStyles() {
        // Check if the styles are already loaded
        if (!document.querySelector('link[href*="tag-manager-styles.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = '/tag-manager-styles.css';
            document.head.appendChild(link);
        }
    }
    
    createToggleButton() {
        const button = document.createElement('button');
        button.className = 'tag-toggle-btn';
        button.innerHTML = '🏷️';
        button.setAttribute('title', 'Toggle Tag Manager');
        
        // Add badge for untagged pages
        const badge = document.createElement('span');
        badge.className = 'tag-status-badge';
        badge.style.display = 'none';
        badge.textContent = '!';
        button.appendChild(badge);
        
        document.body.appendChild(button);
        this.toggleButton = button;
        this.badge = badge;
    }
    
    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'tag-status-overlay';
        
        overlay.innerHTML = `
            <h4 class="tag-status-title">Tag Manager</h4>
            <div class="tag-status-info">
                Current page: <strong>${window.location.pathname || '/'}</strong>
            </div>
            <div class="tag-status-info" id="current-page-status">
                Status: <span class="status status-checking">Checking...</span>
            </div>
            <h4>Recent Pages:</h4>
            <ul class="tag-status-list" id="tag-status-list">
                <li>Loading page statuses...</li>
            </ul>
            <div class="tag-status-actions">
                <button class="refresh-btn">Refresh Tags</button>
                <button class="scan-btn">Scan Site</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        this.overlay = overlay;
    }
    
    bindEvents() {
        // Toggle visibility when button is clicked
        this.toggleButton.addEventListener('click', () => {
            this.toggleOverlay();
        });
        
        // Refresh button action
        const refreshBtn = this.overlay.querySelector('.refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshTags();
            });
        }
        
        // Scan site button action
        const scanBtn = this.overlay.querySelector('.scan-btn');
        if (scanBtn) {
            scanBtn.addEventListener('click', () => {
                this.scanSite();
            });
        }
    }
    
    toggleOverlay() {
        this.isOverlayVisible = !this.isOverlayVisible;
        
        if (this.isOverlayVisible) {
            this.overlay.classList.add('show');
            this.updateTagStatus();
        } else {
            this.overlay.classList.remove('show');
        }
    }
    
    updateTagStatus() {
        // Update current page status
        const currentPageStatus = this.overlay.querySelector('#current-page-status');
        const currentUrl = window.location.href;
        
        if (currentPageStatus) {
            let tagStatus = 'not_tagged';
            
            // Check if window.quantumTagManager exists
            if (window.quantumTagManager) {
                const status = window.quantumTagManager.getTagStatus(currentUrl);
                tagStatus = status.tagStatus || 'not_tagged';
            }
            
            const statusClass = tagStatus === 'tagged' ? 'status-tagged' : 'status-not-tagged';
            const statusText = tagStatus === 'tagged' ? 'Tagged' : 'Not Tagged';
            
            currentPageStatus.innerHTML = `Status: <span class="status ${statusClass}">${statusText}</span>`;
        }
        
        // Update recent pages list
        this.updateRecentPagesList();
    }
    
    updateRecentPagesList() {
        const list = this.overlay.querySelector('#tag-status-list');
        
        if (!list) return;
        
        // Clear the list
        list.innerHTML = '';
        
        // Get all tagged pages if quantumTagManager exists
        if (window.quantumTagManager) {
            const taggedPages = window.quantumTagManager.getAllTaggedPages();
            
            if (Object.keys(taggedPages).length === 0) {
                list.innerHTML = '<li>No recently tagged pages found.</li>';
                return;
            }
            
            // Create list items for each page
            for (const url in taggedPages) {
                const page = taggedPages[url];
                const statusClass = page.tagStatus === 'tagged' ? 'status-tagged' : 'status-not-tagged';
                const statusText = page.tagStatus === 'tagged' ? 'Tagged' : 'Not Tagged';
                
                const displayUrl = new URL(url).pathname;
                
                const li = document.createElement('li');
                li.innerHTML = `
                    <span title="${url}">${displayUrl || '/'}</span>
                    <span class="status ${statusClass}">${statusText}</span>
                `;
                
                list.appendChild(li);
            }
        } else {
            list.innerHTML = '<li>Tag Manager not initialized.</li>';
        }
    }
    
    refreshTags() {
        // Refresh tag data for current page
        if (window.quantumTagManager) {
            window.quantumTagManager.refreshTag();
            this.updateTagStatus();
        }
    }
    
    scanSite() {
        // Count untagged pages
        let untaggedCount = 0;
        
        if (window.quantumTagManager) {
            const taggedPages = window.quantumTagManager.getAllTaggedPages();
            
            for (const url in taggedPages) {
                if (taggedPages[url].tagStatus !== 'tagged') {
                    untaggedCount++;
                }
            }
        }
        
        // Update badge
        if (untaggedCount > 0) {
            this.badge.style.display = 'flex';
            this.badge.textContent = untaggedCount > 9 ? '9+' : untaggedCount;
        } else {
            this.badge.style.display = 'none';
        }
    }
}

// Auto-initialize Tag Manager UI
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for the tag manager to initialize
    setTimeout(() => {
        new TagManagerUI();
    }, 1000);
});
