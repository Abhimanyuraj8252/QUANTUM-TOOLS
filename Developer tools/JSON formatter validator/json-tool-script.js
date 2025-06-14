// JSON Formatter & Validator - JavaScript Functionality

class JSONTool {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateStats();
    }

    bindEvents() {
        // Get DOM elements
        this.jsonInput = document.getElementById('jsonInput');
        this.jsonOutput = document.getElementById('jsonOutput');
        this.statusMessage = document.getElementById('statusMessage');
        this.charCount = document.getElementById('charCount');
        this.lineCount = document.getElementById('lineCount');
        this.sizeCount = document.getElementById('sizeCount');

        // Action buttons
        this.formatBtn = document.querySelector('.format-btn');
        this.validateBtn = document.querySelector('.validate-btn');
        this.minifyBtn = document.querySelector('.minify-btn');
        this.copyOutputBtn = document.querySelector('.copy-output-btn');
        this.clearBtn = document.querySelector('.clear-btn');
        this.pasteBtn = document.querySelector('.paste-btn');
        this.copyBtn = document.querySelector('.copy-btn');
        this.downloadBtn = document.querySelector('.download-btn');

        // Event listeners
        this.formatBtn.addEventListener('click', () => this.formatJSON());
        this.validateBtn.addEventListener('click', () => this.validateJSON());
        this.minifyBtn.addEventListener('click', () => this.minifyJSON());
        this.copyOutputBtn.addEventListener('click', () => this.copyOutput());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.pasteBtn.addEventListener('click', () => this.pasteFromClipboard());
        this.copyBtn.addEventListener('click', () => this.copyOutput());
        this.downloadBtn.addEventListener('click', () => this.downloadJSON());

        // Input change listener for stats
        this.jsonInput.addEventListener('input', () => this.updateStats());
        this.jsonInput.addEventListener('paste', () => {
            setTimeout(() => this.updateStats(), 10);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    // Core JSON Functions
    formatJSON() {
        const input = this.jsonInput.value.trim();
        
        if (!input) {
            this.showStatus('Please enter some JSON to format.', 'error');
            return;
        }

        try {
            this.addLoadingState(this.formatBtn);
            
            // Parse and format
            const parsed = JSON.parse(input);
            const formatted = JSON.stringify(parsed, null, 2);
            
            this.jsonOutput.value = formatted;
            this.showStatus('✅ JSON formatted successfully!', 'success');
            
        } catch (error) {
            this.showStatus(`❌ Invalid JSON: ${this.getErrorMessage(error)}`, 'error');
        } finally {
            this.removeLoadingState(this.formatBtn);
        }
    }

    validateJSON() {
        const input = this.jsonInput.value.trim();
        
        if (!input) {
            this.showStatus('Please enter some JSON to validate.', 'error');
            return;
        }

        try {
            this.addLoadingState(this.validateBtn);
            
            const parsed = JSON.parse(input);
            const type = this.getJSONType(parsed);
            const keys = this.getObjectKeys(parsed);
            
            this.showStatus(
                `✅ Valid JSON! Type: ${type}${keys ? `, Keys: ${keys}` : ''}`, 
                'success'
            );
            
        } catch (error) {
            this.showStatus(`❌ Invalid JSON: ${this.getErrorMessage(error)}`, 'error');
        } finally {
            this.removeLoadingState(this.validateBtn);
        }
    }

    minifyJSON() {
        const input = this.jsonInput.value.trim();
        
        if (!input) {
            this.showStatus('Please enter some JSON to minify.', 'error');
            return;
        }

        try {
            this.addLoadingState(this.minifyBtn);
            
            // Parse and minify
            const parsed = JSON.parse(input);
            const minified = JSON.stringify(parsed);
            
            this.jsonOutput.value = minified;
            
            const originalSize = input.length;
            const minifiedSize = minified.length;
            const savings = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
            
            this.showStatus(
                `✅ JSON minified! Reduced by ${savings}% (${originalSize} → ${minifiedSize} chars)`, 
                'success'
            );
            
        } catch (error) {
            this.showStatus(`❌ Invalid JSON: ${this.getErrorMessage(error)}`, 'error');
        } finally {
            this.removeLoadingState(this.minifyBtn);
        }
    }

    // Clipboard Operations
    async copyOutput() {
        const output = this.jsonOutput.value;
        
        if (!output) {
            this.showStatus('No output to copy.', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(output);
            this.showStatus('📋 Copied to clipboard!', 'success');
            this.showCopyFeedback();
        } catch (error) {
            // Fallback for older browsers
            this.fallbackCopyToClipboard(output);
        }
    }

    async pasteFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            this.jsonInput.value = text;
            this.updateStats();
            this.showStatus('📋 Pasted from clipboard!', 'info');
        } catch (error) {
            this.showStatus('Unable to access clipboard. Please paste manually.', 'error');
        }
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showStatus('📋 Copied to clipboard!', 'success');
            this.showCopyFeedback();
        } catch (error) {
            this.showStatus('Failed to copy to clipboard.', 'error');
        } finally {
            document.body.removeChild(textArea);
        }
    }

    // File Operations
    downloadJSON() {
        const output = this.jsonOutput.value;
        
        if (!output) {
            this.showStatus('No formatted JSON to download.', 'error');
            return;
        }

        try {
            const blob = new Blob([output], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `formatted-json-${new Date().getTime()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showStatus('📥 JSON file downloaded!', 'success');
        } catch (error) {
            this.showStatus('Failed to download file.', 'error');
        }
    }

    // Utility Functions
    clearAll() {
        this.jsonInput.value = '';
        this.jsonOutput.value = '';
        this.statusMessage.textContent = '';
        this.statusMessage.className = 'status-message';
        this.updateStats();
    }

    updateStats() {
        const input = this.jsonInput.value;
        const charCount = input.length;
        const lineCount = input.split('\n').length;
        const sizeInBytes = new Blob([input]).size;
        
        this.charCount.textContent = charCount.toLocaleString();
        this.lineCount.textContent = lineCount.toLocaleString();
        this.sizeCount.textContent = this.formatBytes(sizeInBytes);
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    getErrorMessage(error) {
        const message = error.message;
        
        // Try to extract line and column information
        const match = message.match(/at position (\d+)/);
        if (match) {
            const position = parseInt(match[1]);
            const lines = this.jsonInput.value.substring(0, position).split('\n');
            const line = lines.length;
            const column = lines[lines.length - 1].length + 1;
            return `${message} (Line ${line}, Column ${column})`;
        }
        
        return message;
    }

    getJSONType(obj) {
        if (Array.isArray(obj)) return 'Array';
        if (obj === null) return 'null';
        if (typeof obj === 'object') return 'Object';
        if (typeof obj === 'string') return 'String';
        if (typeof obj === 'number') return 'Number';
        if (typeof obj === 'boolean') return 'Boolean';
        return 'Unknown';
    }

    getObjectKeys(obj) {
        if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
            const keys = Object.keys(obj);
            return keys.length <= 5 ? keys.join(', ') : `${keys.slice(0, 5).join(', ')}... (+${keys.length - 5} more)`;
        }
        return null;
    }

    showStatus(message, type) {
        this.statusMessage.textContent = message;
        this.statusMessage.className = `status-message ${type}`;
        
        // Auto-clear after 5 seconds for success messages
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                if (this.statusMessage.textContent === message) {
                    this.statusMessage.textContent = '';
                    this.statusMessage.className = 'status-message';
                }
            }, 5000);
        }
    }

    showCopyFeedback() {
        const feedback = document.createElement('div');
        feedback.className = 'copy-feedback';
        feedback.textContent = '✅ Copied!';
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 2000);
    }

    addLoadingState(button) {
        button.classList.add('loading');
        button.disabled = true;
    }

    removeLoadingState(button) {
        button.classList.remove('loading');
        button.disabled = false;
    }

    handleKeyboard(e) {
        // Ctrl/Cmd + Enter: Format JSON
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            this.formatJSON();
        }
        
        // Ctrl/Cmd + Shift + V: Validate JSON
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'V') {
            e.preventDefault();
            this.validateJSON();
        }
        
        // Ctrl/Cmd + M: Minify JSON
        if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
            e.preventDefault();
            this.minifyJSON();
        }
        
        // Ctrl/Cmd + Shift + C: Copy output
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            this.copyOutput();
        }
        
        // Escape: Clear all
        if (e.key === 'Escape') {
            this.clearAll();
        }
    }
}

// Enhanced JSON Syntax Highlighting for Output
class JSONHighlighter {
    static highlight(json) {
        if (!json) return '';
        
        // Basic syntax highlighting patterns
        return json
            .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?)/g, (match, p1) => {
                if (p1.endsWith(':')) {
                    return `<span class="json-key">${match}</span>`;
                } else {
                    return `<span class="json-string">${match}</span>`;
                }
            })
            .replace(/\b(-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)\b/g, '<span class="json-number">$1</span>')
            .replace(/\b(true|false|null)\b/g, '<span class="json-literal">$1</span>');
    }
}

// Sample JSON Templates
class JSONTemplates {
    static getTemplates() {
        return {
            'Person Object': {
                "name": "John Doe",
                "age": 30,
                "email": "john.doe@example.com",
                "address": {
                    "street": "123 Main St",
                    "city": "New York",
                    "zipCode": "10001"
                },
                "hobbies": ["reading", "swimming", "coding"]
            },
            'API Response': {
                "status": "success",
                "data": {
                    "users": [
                        {
                            "id": 1,
                            "username": "user1",
                            "active": true
                        },
                        {
                            "id": 2,
                            "username": "user2",
                            "active": false
                        }
                    ]
                },
                "timestamp": "2025-06-08T10:30:00Z"
            },
            'Configuration': {
                "app": {
                    "name": "My Application",
                    "version": "1.0.0",
                    "environment": "production"
                },
                "database": {
                    "host": "localhost",
                    "port": 5432,
                    "name": "myapp_db"
                },
                "features": {
                    "authentication": true,
                    "logging": true,
                    "cache": false
                }
            }
        };
    }
}

// Auto-completion and suggestions
class JSONAssistant {
    constructor(textarea) {
        this.textarea = textarea;
        this.setupAutoComplete();
    }

    setupAutoComplete() {
        this.textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                this.handleTab();
            }
        });
    }

    handleTab() {
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        const value = this.textarea.value;
        
        // Insert 2 spaces for tab
        this.textarea.value = value.substring(0, start) + '  ' + value.substring(end);
        this.textarea.selectionStart = this.textarea.selectionEnd = start + 2;
    }
}

// Advanced Navigation Features
class AdvancedNavigation {
    constructor() {
        this.initNavigation();
        this.initThemeToggle();
        this.initFullscreen();
        this.initMobileMenu();
        this.initScrollEffects();
    }    initNavigation() {
        // Dropdown menu functionality
        const dropdowns = document.querySelectorAll('.nav-dropdown');
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            let timeoutId;
            
            // Desktop hover behavior
            if (window.innerWidth > 992) {
                dropdown.addEventListener('mouseenter', () => {
                    clearTimeout(timeoutId);
                    menu.style.opacity = '1';
                    menu.style.visibility = 'visible';
                    menu.style.transform = 'translateY(0)';
                });
                
                dropdown.addEventListener('mouseleave', () => {
                    timeoutId = setTimeout(() => {
                        menu.style.opacity = '0';
                        menu.style.visibility = 'hidden';
                        menu.style.transform = 'translateY(-10px)';
                    }, 300);
                });
            } else {
                // Mobile click behavior
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Close other dropdowns
                    dropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.classList.remove('open');
                        }
                    });
                    
                    // Toggle current dropdown
                    dropdown.classList.toggle('open');
                });
            }
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-dropdown')) {
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('open');
                });
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('open');
                const menu = dropdown.querySelector('.dropdown-menu');
                if (window.innerWidth > 992) {
                    menu.style.opacity = '';
                    menu.style.visibility = '';
                    menu.style.transform = '';
                }
            });
        });
    }

    initThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        const body = document.body;
        
        // Get saved theme or default to dark
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'light') {
            body.classList.add('light-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('light-theme');
            const isLight = body.classList.contains('light-theme');
            
            // Update icon
            themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            
            // Save theme preference
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            
            // Add animation effect
            themeToggle.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                themeToggle.style.transform = '';
            }, 300);
        });
    }

    initFullscreen() {
        const fullscreenBtn = document.querySelector('.fullscreen-btn');
        
        fullscreenBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().then(() => {
                    fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
                });
            } else {
                document.exitFullscreen().then(() => {
                    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
                });
            }
        });

        // Update icon when fullscreen changes
        document.addEventListener('fullscreenchange', () => {
            const isFullscreen = !!document.fullscreenElement;
            fullscreenBtn.innerHTML = isFullscreen ? 
                '<i class="fas fa-compress"></i>' : 
                '<i class="fas fa-expand"></i>';
        });
    }    initMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const body = document.body;
        
        // Create mobile overlay
        let mobileOverlay = document.querySelector('.mobile-overlay');
        if (!mobileOverlay) {
            mobileOverlay = document.createElement('div');
            mobileOverlay.className = 'mobile-overlay';
            body.appendChild(mobileOverlay);
        }
        
        if (mobileToggle && navMenu) {
            const toggleMobileMenu = () => {
                const isOpen = navMenu.classList.contains('mobile-open');
                
                if (isOpen) {
                    // Close menu
                    navMenu.classList.remove('mobile-open');
                    mobileToggle.classList.remove('active');
                    mobileOverlay.classList.remove('active');
                    body.style.overflow = '';
                } else {
                    // Open menu
                    navMenu.classList.add('mobile-open');
                    mobileToggle.classList.add('active');
                    mobileOverlay.classList.add('active');
                    body.style.overflow = 'hidden'; // Prevent background scrolling
                }
            };
            
            // Toggle button click
            mobileToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMobileMenu();
            });
            
            // Overlay click to close
            mobileOverlay.addEventListener('click', () => {
                if (navMenu.classList.contains('mobile-open')) {
                    toggleMobileMenu();
                }
            });
            
            // Close menu when clicking nav links
            const navLinks = navMenu.querySelectorAll('.nav-link:not(.dropdown-toggle)');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (navMenu.classList.contains('mobile-open')) {
                        setTimeout(() => toggleMobileMenu(), 150);
                    }
                });
            });
            
            // Close menu on window resize if desktop
            window.addEventListener('resize', () => {
                if (window.innerWidth > 992 && navMenu.classList.contains('mobile-open')) {
                    toggleMobileMenu();
                }
            });
            
            // Handle escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navMenu.classList.contains('mobile-open')) {
                    toggleMobileMenu();
                }
            });
        }
    }

    initScrollEffects() {
        const header = document.querySelector('.advanced-header');
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            // Add/remove scrolled class for styling
            if (currentScrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide/show header on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    }
}

// Enhanced JSON Tool with Advanced Features
class EnhancedJSONTool extends JSONTool {
    constructor() {
        super();
        this.initAdvancedFeatures();
        this.initKeyboardShortcuts();
        this.initContextMenu();
    }

    initAdvancedFeatures() {
        // Add real-time validation
        this.jsonInput.addEventListener('input', debounce(() => {
            this.realTimeValidation();
        }, 500));

        // Add line numbers
        this.addLineNumbers();
        
        // Add syntax highlighting for input
        this.initSyntaxHighlighting();
    }

    realTimeValidation() {
        const input = this.jsonInput.value.trim();
        if (!input) {
            this.clearValidationIndicators();
            return;
        }

        try {
            JSON.parse(input);
            this.showValidationIndicator('valid');
        } catch (error) {
            this.showValidationIndicator('invalid', error.message);
        }
    }

    showValidationIndicator(type, message = '') {
        let indicator = document.querySelector('.validation-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'validation-indicator';
            this.jsonInput.parentNode.appendChild(indicator);
        }

        indicator.className = `validation-indicator ${type}`;
        indicator.innerHTML = type === 'valid' ? 
            '<i class="fas fa-check-circle"></i> Valid JSON' :
            `<i class="fas fa-exclamation-circle"></i> ${message}`;
    }

    clearValidationIndicators() {
        const indicator = document.querySelector('.validation-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    addLineNumbers() {
        const createLineNumbers = (textarea) => {
            const lines = textarea.value.split('\n');
            const lineNumberDiv = textarea.parentNode.querySelector('.line-numbers');
            
            if (lineNumberDiv) {
                lineNumberDiv.innerHTML = lines.map((_, i) => 
                    `<div class="line-number">${i + 1}</div>`
                ).join('');
            }
        };

        // Add line number containers
        [this.jsonInput, this.jsonOutput].forEach(textarea => {
            const lineNumbers = document.createElement('div');
            lineNumbers.className = 'line-numbers';
            textarea.parentNode.insertBefore(lineNumbers, textarea);
            
            textarea.addEventListener('input', () => createLineNumbers(textarea));
            textarea.addEventListener('scroll', () => {
                lineNumbers.scrollTop = textarea.scrollTop;
            });
            
            createLineNumbers(textarea);
        });
    }

    initSyntaxHighlighting() {
        // Add syntax highlighting styles
        const style = document.createElement('style');
        style.textContent = `
            .json-key { color: #ff6b6b; }
            .json-string { color: #4ecdc4; }
            .json-number { color: #45b7d1; }
            .json-literal { color: #96ceb4; }
            .json-punctuation { color: #ffeaa7; }
        `;
        document.head.appendChild(style);
    }

    initContextMenu() {
        this.jsonInput.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(e.clientX, e.clientY);
        });
    }

    showContextMenu(x, y) {
        // Remove existing context menu
        const existing = document.querySelector('.context-menu');
        if (existing) existing.remove();

        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.style.cssText = `
            position: fixed;
            top: ${y}px;
            left: ${x}px;
            background: var(--secondary-bg);
            border: 1px solid var(--card-border);
            border-radius: 8px;
            padding: 0.5rem;
            z-index: 10000;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;

        const actions = [
            { label: 'Format JSON', action: () => this.formatJSON() },
            { label: 'Validate JSON', action: () => this.validateJSON() },
            { label: 'Minify JSON', action: () => this.minifyJSON() },
            { label: 'Clear All', action: () => this.clearAll() }
        ];

        actions.forEach(({ label, action }) => {
            const item = document.createElement('div');
            item.textContent = label;
            item.style.cssText = `
                padding: 0.5rem 1rem;
                cursor: pointer;
                border-radius: 4px;
                transition: background 0.2s;
            `;
            item.addEventListener('click', () => {
                action();
                menu.remove();
            });
            item.addEventListener('mouseenter', () => {
                item.style.background = 'var(--accent-color-1)';
            });
            item.addEventListener('mouseleave', () => {
                item.style.background = '';
            });
            menu.appendChild(item);
        });

        document.body.appendChild(menu);

        // Remove menu when clicking elsewhere
        setTimeout(() => {
            document.addEventListener('click', () => menu.remove(), { once: true });
        }, 0);
    }

    initKeyboardShortcuts() {
        const shortcuts = {
            'Ctrl+Enter': () => this.formatJSON(),
            'Ctrl+Shift+V': () => this.validateJSON(),
            'Ctrl+M': () => this.minifyJSON(),
            'Ctrl+Shift+C': () => this.copyOutput(),
            'Escape': () => this.clearAll(),
            'F11': () => document.querySelector('.fullscreen-btn').click()
        };

        document.addEventListener('keydown', (e) => {
            const key = [
                e.ctrlKey && 'Ctrl',
                e.shiftKey && 'Shift',
                e.altKey && 'Alt',
                e.key
            ].filter(Boolean).join('+');

            if (shortcuts[key]) {
                e.preventDefault();
                shortcuts[key]();
            }
        });
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize the JSON Tool when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize advanced navigation
    window.advancedNav = new AdvancedNavigation();
    
    // Initialize enhanced JSON tool
    window.jsonTool = new EnhancedJSONTool();
    
    // Initialize auto-completion for input textarea
    const jsonInput = document.getElementById('jsonInput');
    if (jsonInput) {
        window.jsonAssistant = new JSONAssistant(jsonInput);
    }
    
    // Add template insertion functionality
    const templateSelect = document.createElement('select');
    templateSelect.className = 'template-select';
    templateSelect.innerHTML = '<option value="">Insert Template...</option>';
    
    Object.keys(JSONTemplates.getTemplates()).forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        templateSelect.appendChild(option);
    });
    
    templateSelect.addEventListener('change', (e) => {
        if (e.target.value) {
            const template = JSONTemplates.getTemplates()[e.target.value];
            jsonInput.value = JSON.stringify(template, null, 2);
            window.jsonTool.updateStats();
            e.target.value = '';
        }
    });
    
    // Add template selector to input panel actions
    const inputPanelActions = document.querySelector('.input-panel .panel-actions');
    if (inputPanelActions) {
        templateSelect.style.marginLeft = '0.5rem';
        templateSelect.style.padding = '0.5rem';
        templateSelect.style.background = 'var(--secondary-bg)';
        templateSelect.style.color = 'var(--text-primary)';
        templateSelect.style.border = '1px solid var(--card-border)';
        templateSelect.style.borderRadius = '8px';
        templateSelect.style.fontSize = '0.8rem';
        inputPanelActions.appendChild(templateSelect);
    }
});
