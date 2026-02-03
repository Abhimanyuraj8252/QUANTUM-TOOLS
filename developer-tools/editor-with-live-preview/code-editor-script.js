// Code Editor Script - Live Preview Functionality

class CodeEditor {
    constructor() {
        this.htmlEditor = document.getElementById('htmlEditor');
        this.cssEditor = document.getElementById('cssEditor');
        this.jsEditor = document.getElementById('jsEditor');
        this.preview = document.getElementById('preview');
        this.runBtn = document.getElementById('runBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.externalBtn = document.getElementById('externalBtn');
        
        this.isFullscreen = false;
        this.updateTimeout = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupTabs();
        this.setupKeyboardShortcuts();
        this.updatePreview(); // Initial render
        
        // Save initial code to localStorage
        this.saveToLocalStorage();
        this.loadFromLocalStorage();
    }
    
    setupEventListeners() {
        // Live preview on input
        [this.htmlEditor, this.cssEditor, this.jsEditor].forEach(editor => {
            editor.addEventListener('input', () => {
                this.debouncedUpdate();
                this.saveToLocalStorage();
            });
            
            // Auto-resize textarea
            editor.addEventListener('input', this.autoResize.bind(this));
        });
        
        // Control buttons
        this.runBtn.addEventListener('click', () => this.updatePreview());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        this.refreshBtn.addEventListener('click', () => this.updatePreview());
        this.externalBtn.addEventListener('click', () => this.openInNewTab());
        
        // Copy buttons
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const editorType = e.target.closest('.copy-btn').dataset.editor;
                this.copyCode(editorType);
            });
        });
        
        // Escape key for fullscreen
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isFullscreen) {
                this.toggleFullscreen();
            }
        });
    }
    
    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const editorWrappers = document.querySelectorAll('.editor-wrapper');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                
                // Update active tab
                tabBtns.forEach(tab => tab.classList.remove('active'));
                btn.classList.add('active');
                
                // Update active editor
                editorWrappers.forEach(wrapper => {
                    wrapper.classList.remove('active');
                    if (wrapper.dataset.editor === tabName) {
                        wrapper.classList.add('active');
                    }
                });
            });
        });
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Enter to run code
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.updatePreview();
                this.showNotification('Code executed!', 'success');
            }
            
            // Ctrl+S to save (prevent default)
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveToLocalStorage();
                this.showNotification('Code saved locally!', 'success');
            }
            
            // Tab switching shortcuts
            if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '3') {
                e.preventDefault();
                const tabIndex = parseInt(e.key) - 1;
                const tabs = ['html', 'css', 'js'];
                const tabBtn = document.querySelector(`[data-tab="${tabs[tabIndex]}"]`);
                if (tabBtn) tabBtn.click();
            }
        });
        
        // Tab key handling in textareas
        [this.htmlEditor, this.cssEditor, this.jsEditor].forEach(editor => {
            editor.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    const start = editor.selectionStart;
                    const end = editor.selectionEnd;
                    
                    // Insert tab
                    editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
                    editor.selectionStart = editor.selectionEnd = start + 2;
                }
            });
        });
    }
    
    debouncedUpdate() {
        clearTimeout(this.updateTimeout);
        this.updateTimeout = setTimeout(() => {
            this.updatePreview();
        }, 300);
    }
    
    updatePreview() {
        const html = this.htmlEditor.value;
        const css = this.cssEditor.value;
        const js = this.jsEditor.value;
        
        // Create complete HTML document
        const fullHTML = this.createFullHTML(html, css, js);
        
        // Write to iframe
        try {
            const previewDoc = this.preview.contentDocument || this.preview.contentWindow.document;
            previewDoc.open();
            previewDoc.write(fullHTML);
            previewDoc.close();
            
            // Add error handling for JavaScript
            this.preview.contentWindow.addEventListener('error', (e) => {
                console.error('Preview Error:', e.error);
                this.showNotification(`JavaScript Error: ${e.error.message}`, 'error');
            });
            
        } catch (error) {
            console.error('Preview update failed:', error);
            this.showNotification('Failed to update preview', 'error');
        }
    }
    
    createFullHTML(html, css, js) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Preview</title>
    <style>
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
        ${css}
    </style>
</head>
<body>
    ${html}
    <script>
        try {
            ${js}
        } catch (error) {
            console.error('JavaScript Error:', error);
            document.body.innerHTML += '<div style="background: #f44336; color: white; padding: 10px; margin: 10px; border-radius: 5px; font-family: monospace;">JavaScript Error: ' + error.message + '</div>';
        }
    </script>
</body>
</html>`;
    }
    
    clearAll() {
        if (confirm('Are you sure you want to clear all code? This action cannot be undone.')) {
            this.htmlEditor.value = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Preview</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>Start coding to see live preview</p>
</body>
</html>`;
            
            this.cssEditor.value = `body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background: #f0f0f0;
}

h1 {
    color: #333;
    text-align: center;
}

p {
    color: #666;
    text-align: center;
}`;
            
            this.jsEditor.value = `// Write your JavaScript here
console.log('Hello from the code editor!');

// Example: Add some interactivity
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded successfully!');
});`;
            
            this.updatePreview();
            this.saveToLocalStorage();
            this.showNotification('All code cleared!', 'success');
        }
    }
    
    toggleFullscreen() {
        const editorContainer = document.querySelector('.editor-container');
        const icon = this.fullscreenBtn.querySelector('i');
        
        if (!this.isFullscreen) {
            editorContainer.classList.add('fullscreen');
            icon.className = 'fas fa-compress';
            this.isFullscreen = true;
            this.showNotification('Entered fullscreen mode', 'info');
        } else {
            editorContainer.classList.remove('fullscreen');
            icon.className = 'fas fa-expand';
            this.isFullscreen = false;
            this.showNotification('Exited fullscreen mode', 'info');
        }
    }
    
    copyCode(editorType) {
        let code = '';
        let editor = null;
        
        switch (editorType) {
            case 'html':
                code = this.htmlEditor.value;
                editor = 'HTML';
                break;
            case 'css':
                code = this.cssEditor.value;
                editor = 'CSS';
                break;
            case 'js':
                code = this.jsEditor.value;
                editor = 'JavaScript';
                break;
        }
        
        if (code) {
            navigator.clipboard.writeText(code).then(() => {
                this.showNotification(`${editor} code copied to clipboard!`, 'success');
                
                // Visual feedback
                const copyBtn = document.querySelector(`[data-editor="${editorType}"]`);
                copyBtn.classList.add('copy-success');
                setTimeout(() => {
                    copyBtn.classList.remove('copy-success');
                }, 300);
            }).catch(() => {
                this.showNotification('Failed to copy code', 'error');
            });
        }
    }
    
    openInNewTab() {
        const html = this.htmlEditor.value;
        const css = this.cssEditor.value;
        const js = this.jsEditor.value;
        
        const fullHTML = this.createFullHTML(html, css, js);
        const blob = new Blob([fullHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        window.open(url, '_blank');
        
        // Clean up the URL after a delay
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
        
        this.showNotification('Opened in new tab!', 'success');
    }
    
    autoResize(event) {
        const textarea = event.target;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 400) + 'px';
    }
    
    saveToLocalStorage() {
        const codeData = {
            html: this.htmlEditor.value,
            css: this.cssEditor.value,
            js: this.jsEditor.value,
            timestamp: new Date().toISOString()
        };
        
        try {
            localStorage.setItem('quantumtools-code-editor', JSON.stringify(codeData));
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
        }
    }
    
    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('quantumtools-code-editor');
            if (saved) {
                const codeData = JSON.parse(saved);
                
                // Only load if it's not the default content
                if (codeData.html && codeData.html !== this.htmlEditor.value) {
                    if (confirm('Found previously saved code. Would you like to load it?')) {
                        this.htmlEditor.value = codeData.html || '';
                        this.cssEditor.value = codeData.css || '';
                        this.jsEditor.value = codeData.js || '';
                        this.updatePreview();
                        this.showNotification('Previous code loaded!', 'success');
                    }
                }
            }
        } catch (error) {
            console.warn('Failed to load from localStorage:', error);
        }
    }
    
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        // Styles for notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: this.getNotificationColor(type),
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            zIndex: '10000',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: '0.9rem',
            fontWeight: '500'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
    
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-triangle',
            info: 'info-circle',
            warning: 'exclamation-triangle'
        };
        return icons[type] || 'info-circle';
    }
    
    getNotificationColor(type) {
        const colors = {
            success: 'linear-gradient(135deg, #4CAF50, #45a049)',
            error: 'linear-gradient(135deg, #f44336, #da190b)',
            info: 'linear-gradient(135deg, #2196F3, #0b7dda)',
            warning: 'linear-gradient(135deg, #ff9800, #e68900)'
        };
        return colors[type] || colors.info;
    }
}

// Additional utility functions
function formatCode(code, type) {
    // Basic code formatting (could be enhanced with a proper formatter)
    try {
        if (type === 'json') {
            return JSON.stringify(JSON.parse(code), null, 2);
        }
    } catch (error) {
        console.warn('Code formatting failed:', error);
    }
    return code;
}

function downloadCode() {
    const editor = window.codeEditor;
    if (!editor) return;
    
    const html = editor.htmlEditor.value;
    const css = editor.cssEditor.value;
    const js = editor.jsEditor.value;
    
    const fullHTML = editor.createFullHTML(html, css, js);
    
    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code-preview.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
    editor.showNotification('Code downloaded as HTML file!', 'success');
}

// Theme-aware preview updates
function updatePreviewTheme() {
    const isLightTheme = document.body.classList.contains('light-theme');
    const preview = document.getElementById('preview');
    
    if (preview && preview.contentDocument) {
        const previewBody = preview.contentDocument.body;
        if (previewBody) {
            previewBody.style.colorScheme = isLightTheme ? 'light' : 'dark';
        }
    }
}

// Initialize the code editor when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.codeEditor = new CodeEditor();
    
    // Add download button to controls (optional enhancement)
    const controls = document.querySelector('.editor-controls');
    if (controls) {
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'control-btn download-btn';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i><span>Download</span>';
        downloadBtn.title = 'Download as HTML file';
        downloadBtn.addEventListener('click', downloadCode);
        controls.appendChild(downloadBtn);
    }
    
    // Listen for theme changes
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            setTimeout(updatePreviewTheme, 100);
        });
    }
    
    // Add help tooltip
    const helpInfo = document.createElement('div');
    helpInfo.className = 'help-info';
    helpInfo.innerHTML = `
        <div style="position: fixed; bottom: 20px; left: 20px; background: var(--glass-bg); padding: 15px; border-radius: 10px; border: 1px solid var(--card-border); backdrop-filter: blur(10px); max-width: 300px; z-index: 1000; font-size: 0.8rem; color: var(--text-secondary);">
            <strong style="color: var(--text-primary);">Keyboard Shortcuts:</strong><br>
            <span style="color: var(--accent-color-1);">Ctrl+Enter:</span> Run Code<br>
            <span style="color: var(--accent-color-1);">Ctrl+S:</span> Save Code<br>
            <span style="color: var(--accent-color-1);">Ctrl+1-3:</span> Switch Tabs<br>
            <span style="color: var(--accent-color-1);">Esc:</span> Exit Fullscreen
        </div>
    `;
    
    // Show help for 5 seconds
    document.body.appendChild(helpInfo);
    setTimeout(() => {
        helpInfo.style.opacity = '0';
        helpInfo.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            if (helpInfo.parentNode) {
                helpInfo.remove();
            }
        }, 500);
    }, 5000);
});

// Handle page visibility changes to save code
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden' && window.codeEditor) {
        window.codeEditor.saveToLocalStorage();
    }
});

// Handle beforeunload to save code
window.addEventListener('beforeunload', function() {
    if (window.codeEditor) {
        window.codeEditor.saveToLocalStorage();
    }
});
