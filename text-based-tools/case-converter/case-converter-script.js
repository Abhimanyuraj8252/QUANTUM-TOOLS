// Advanced Case Converter Script

class AdvancedCaseConverter {
    constructor() {
        // DOM Elements
        this.inputTextarea = document.getElementById('inputText');
        this.outputTextarea = document.getElementById('outputText');
        this.conversionButtons = document.querySelectorAll('.conversion-btn');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.shareBtn = document.getElementById('shareBtn');
        this.clearInputBtn = document.getElementById('clearInputBtn');
        this.pasteBtn = document.getElementById('pasteBtn');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.fileInput = document.getElementById('fileInput');
        
        // Stats elements
        this.charCountElement = document.getElementById('charCount');
        this.wordCountElement = document.getElementById('wordCount');
        this.lineCountElement = document.getElementById('lineCount');
        this.outputCharCountElement = document.getElementById('outputCharCount');
        this.outputWordCountElement = document.getElementById('outputWordCount');
        this.conversionTypeElement = document.getElementById('conversionType');
        
        // UI elements
        this.toastContainer = document.getElementById('toastContainer');
        this.toast = document.getElementById('toast');
        this.progressBar = document.getElementById('progressBar');
        this.conversionSearch = document.getElementById('conversionSearch');
        
        // Options
        this.processingMode = document.getElementById('processingMode');
        this.preserveNumbers = document.getElementById('preserveNumbers');
        this.preserveSpecialChars = document.getElementById('preserveSpecialChars');
        
        // Modal elements
        this.helpModal = document.getElementById('helpModal');
        this.helpBtn = document.getElementById('helpBtn');
        this.closeHelpModal = document.getElementById('closeHelpModal');
        this.fullscreenBtn = document.getElementById('fullscreenBtn');
        this.themeBtn = document.getElementById('themeBtn');
        
        // History elements
        this.historyList = document.getElementById('historyList');
        this.exportHistoryBtn = document.getElementById('exportHistoryBtn');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        
        // State
        this.activeConversion = null;
        this.conversionHistory = JSON.parse(localStorage.getItem('caseConverterHistory') || '[]');
        this.themes = ['dark', 'blue', 'purple', 'green'];
        this.currentTheme = localStorage.getItem('caseConverterTheme') || 'dark';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateStats();
        this.loadHistory();
        this.applyTheme();
        this.setupSearch();
        
        // Show welcome message
        this.showToast('Advanced Case Converter loaded!', 'success', 'Welcome');
    }

    setupEventListeners() {
        // Text input events
        this.inputTextarea.addEventListener('input', () => {
            this.updateStats();
            this.updateProgress();
            if (this.activeConversion) {
                this.debounce(() => this.performConversion(this.activeConversion), 300)();
            }
        });

        // Conversion buttons
        this.conversionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const conversionType = button.getAttribute('data-type');
                this.setActiveButton(button);
                this.performConversion(conversionType);
            });
        });

        // Action buttons
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.downloadBtn.addEventListener('click', () => this.downloadText());
        this.shareBtn.addEventListener('click', () => this.shareText());
        this.clearInputBtn.addEventListener('click', () => this.clearInput());
        this.pasteBtn.addEventListener('click', () => this.pasteFromClipboard());
        this.uploadBtn.addEventListener('click', () => this.fileInput.click());
        
        // File upload
        this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        
        // Modal events
        this.helpBtn.addEventListener('click', () => this.toggleModal(this.helpModal, true));
        this.closeHelpModal.addEventListener('click', () => this.toggleModal(this.helpModal, false));
        this.helpModal.querySelector('.modal-overlay').addEventListener('click', () => this.toggleModal(this.helpModal, false));
        
        // Theme and fullscreen
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        this.themeBtn.addEventListener('click', () => this.cycleTheme());
        
        // History events
        this.exportHistoryBtn.addEventListener('click', () => this.exportHistory());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        
        // Options events
        this.processingMode.addEventListener('change', () => {
            if (this.activeConversion) {
                this.performConversion(this.activeConversion);
            }
        });
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        // Auto-save draft
        setInterval(() => this.saveDraft(), 30000);
    }

    setupSearch() {
        this.conversionSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            this.filterConversions(query);
        });
    }

    filterConversions(query) {
        this.conversionButtons.forEach(button => {
            const buttonText = button.textContent.toLowerCase();
            const shouldShow = buttonText.includes(query) || query === '';
            button.style.display = shouldShow ? 'flex' : 'none';
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to copy
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this.copyToClipboard();
            }
            
            // Ctrl/Cmd + Delete to clear
            if ((e.ctrlKey || e.metaKey) && e.key === 'Delete') {
                e.preventDefault();
                this.clearInput();
            }
            
            // Ctrl/Cmd + V to paste (when not in textarea)
            if ((e.ctrlKey || e.metaKey) && e.key === 'v' && e.target !== this.inputTextarea) {
                e.preventDefault();
                this.pasteFromClipboard();
            }
            
            // F11 for fullscreen
            if (e.key === 'F11') {
                e.preventDefault();
                this.toggleFullscreen();
            }
            
            // Escape to close modals or clear active conversion
            if (e.key === 'Escape') {
                if (this.helpModal.classList.contains('show')) {
                    this.toggleModal(this.helpModal, false);
                } else {
                    this.clearActiveConversion();
                }
            }
            
            // Number keys for quick conversion
            if (e.ctrlKey && e.key >= '1' && e.key <= '9') {
                e.preventDefault();
                const index = parseInt(e.key) - 1;
                const visibleButtons = Array.from(this.conversionButtons).filter(btn => btn.style.display !== 'none');
                if (visibleButtons[index]) {
                    visibleButtons[index].click();
                }
            }
        });
    }

    setActiveButton(activeButton) {
        this.conversionButtons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
        this.activeConversion = activeButton.getAttribute('data-type');
        
        // Update conversion type display
        this.conversionTypeElement.textContent = activeButton.querySelector('span').textContent;
    }

    clearActiveConversion() {
        this.conversionButtons.forEach(btn => btn.classList.remove('active'));
        this.activeConversion = null;
        this.conversionTypeElement.textContent = 'No conversion';
    }

    updateStats() {
        const text = this.inputTextarea.value;
        const charCount = text.length;
        const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        const lineCount = text.split('\n').length;
        
        this.charCountElement.textContent = `${charCount.toLocaleString()} characters`;
        this.wordCountElement.textContent = `${wordCount.toLocaleString()} words`;
        this.lineCountElement.textContent = `${lineCount.toLocaleString()} lines`;
        
        // Update output stats
        const outputText = this.outputTextarea.value;
        const outputCharCount = outputText.length;
        const outputWordCount = outputText.trim() === '' ? 0 : outputText.trim().split(/\s+/).length;
        
        this.outputCharCountElement.textContent = `${outputCharCount.toLocaleString()} characters`;
        this.outputWordCountElement.textContent = `${outputWordCount.toLocaleString()} words`;
    }

    updateProgress() {
        const maxChars = 10000;
        const currentChars = this.inputTextarea.value.length;
        const progress = Math.min((currentChars / maxChars) * 100, 100);
        this.progressBar.style.width = `${progress}%`;
    }

    async performConversion(type) {
        const inputText = this.inputTextarea.value;
        if (!inputText.trim()) {
            this.outputTextarea.value = '';
            this.updateStats();
            return;
        }

        let convertedText = '';
        const processingMode = this.processingMode.value;
        
        try {
            switch (processingMode) {
                case 'line-by-line':
                    convertedText = this.processLineByLine(inputText, type);
                    break;
                case 'word-by-word':
                    convertedText = this.processWordByWord(inputText, type);
                    break;
                default:
                    convertedText = this.convertText(inputText, type);
            }
            
            this.outputTextarea.value = convertedText;
            this.updateStats();
            this.addToHistory(type, inputText, convertedText);
            
        } catch (error) {
            this.showToast('Conversion failed: ' + error.message, 'error', 'Error');
        }
    }

    processLineByLine(text, type) {
        return text.split('\n').map(line => this.convertText(line, type)).join('\n');
    }

    processWordByWord(text, type) {
        return text.split(/(\s+)/).map(part => {
            if (part.trim()) {
                return this.convertText(part, type);
            }
            return part;
        }).join('');
    }

    convertText(text, type) {
        const preserveNumbers = this.preserveNumbers.checked;
        const preserveSpecialChars = this.preserveSpecialChars.checked;
        
        switch (type) {
            case 'uppercase':
                return this.toUppercase(text);
            case 'lowercase':
                return this.toLowercase(text);
            case 'titlecase':
                return this.toTitleCase(text);
            case 'sentencecase':
                return this.toSentenceCase(text);
            case 'kebabcase':
                return this.toKebabCase(text, preserveNumbers, preserveSpecialChars);
            case 'snakecase':
                return this.toSnakeCase(text, preserveNumbers, preserveSpecialChars);
            case 'camelcase':
                return this.toCamelCase(text, preserveNumbers, preserveSpecialChars);
            case 'pascalcase':
                return this.toPascalCase(text, preserveNumbers, preserveSpecialChars);
            case 'constantcase':
                return this.toConstantCase(text, preserveNumbers, preserveSpecialChars);
            case 'dotcase':
                return this.toDotCase(text, preserveNumbers, preserveSpecialChars);
            case 'inversecase':
                return this.toInverseCase(text);
            case 'randomcase':
                return this.toRandomCase(text);
            case 'alternatecase':
                return this.toAlternateCase(text);
            case 'studlycase':
                return this.toStudlyCase(text);
            case 'leetspeak':
                return this.toLeetSpeak(text);
            default:
                return text;
        }
    }

    // Enhanced Conversion Functions
    toUppercase(text) {
        return text.toUpperCase();
    }

    toLowercase(text) {
        return text.toLowerCase();
    }

    toTitleCase(text) {
        return text.replace(/\w\S*/g, (txt) => {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    toSentenceCase(text) {
        return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => {
            return c.toUpperCase();
        });
    }

    toKebabCase(text, preserveNumbers = true, preserveSpecialChars = false) {
        let result = text.trim().toLowerCase();
        if (!preserveNumbers) result = result.replace(/\d/g, '');
        if (!preserveSpecialChars) result = result.replace(/[^\w\s-]/g, '');
        return result
            .replace(/[\s_]+/g, '-')
            .replace(/--+/g, '-')
            .replace(/^-|-$/g, '');
    }

    toSnakeCase(text, preserveNumbers = true, preserveSpecialChars = false) {
        let result = text.trim().toLowerCase();
        if (!preserveNumbers) result = result.replace(/\d/g, '');
        if (!preserveSpecialChars) result = result.replace(/[^\w\s_]/g, '');
        return result
            .replace(/[\s-]+/g, '_')
            .replace(/__+/g, '_')
            .replace(/^_|_$/g, '');
    }

    toCamelCase(text, preserveNumbers = true, preserveSpecialChars = false) {
        let result = text.trim();
        if (!preserveNumbers) result = result.replace(/\d/g, '');
        if (!preserveSpecialChars) result = result.replace(/[^\w\s]/g, '');
        return result
            .toLowerCase()
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
                return index === 0 ? word.toLowerCase() : word.toUpperCase();
            })
            .replace(/\s+/g, '');
    }

    toPascalCase(text, preserveNumbers = true, preserveSpecialChars = false) {
        let result = text.trim();
        if (!preserveNumbers) result = result.replace(/\d/g, '');
        if (!preserveSpecialChars) result = result.replace(/[^\w\s]/g, '');
        return result
            .toLowerCase()
            .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => {
                return word.toUpperCase();
            })
            .replace(/\s+/g, '');
    }

    toConstantCase(text, preserveNumbers = true, preserveSpecialChars = false) {
        let result = text.trim().toUpperCase();
        if (!preserveNumbers) result = result.replace(/\d/g, '');
        if (!preserveSpecialChars) result = result.replace(/[^\w\s_]/g, '');
        return result
            .replace(/[\s-]+/g, '_')
            .replace(/__+/g, '_')
            .replace(/^_|_$/g, '');
    }

    toDotCase(text, preserveNumbers = true, preserveSpecialChars = false) {
        let result = text.trim().toLowerCase();
        if (!preserveNumbers) result = result.replace(/\d/g, '');
        if (!preserveSpecialChars) result = result.replace(/[^\w\s.]/g, '');
        return result
            .replace(/[\s_-]+/g, '.')
            .replace(/\.\.+/g, '.')
            .replace(/^\.|\.$/g, '');
    }

    toInverseCase(text) {
        return text
            .split('')
            .map(char => {
                if (char === char.toUpperCase()) {
                    return char.toLowerCase();
                } else {
                    return char.toUpperCase();
                }
            })
            .join('');
    }

    toRandomCase(text) {
        return text
            .split('')
            .map(char => {
                if (char.match(/[a-zA-Z]/)) {
                    return Math.random() > 0.5 ? char.toUpperCase() : char.toLowerCase();
                }
                return char;
            })
            .join('');
    }

    toAlternateCase(text) {
        let shouldBeUpper = false;
        return text
            .split('')
            .map(char => {
                if (char.match(/[a-zA-Z]/)) {
                    shouldBeUpper = !shouldBeUpper;
                    return shouldBeUpper ? char.toUpperCase() : char.toLowerCase();
                }
                return char;
            })
            .join('');
    }

    toStudlyCase(text) {
        return text
            .split('')
            .map((char, index) => {
                if (char.match(/[a-zA-Z]/)) {
                    return Math.sin(index) > 0 ? char.toUpperCase() : char.toLowerCase();
                }
                return char;
            })
            .join('');
    }

    toLeetSpeak(text) {
        const leetMap = {
            'a': '4', 'A': '4',
            'e': '3', 'E': '3',
            'i': '1', 'I': '1',
            'o': '0', 'O': '0',
            's': '5', 'S': '5',
            't': '7', 'T': '7',
            'l': '1', 'L': '1',
            'g': '9', 'G': '9'
        };
        
        return text
            .split('')
            .map(char => leetMap[char] || char)
            .join('');
    }

    // File Operations
    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > 1024 * 1024) { // 1MB limit
            this.showToast('File too large. Maximum size is 1MB.', 'error', 'Upload Error');
            return;
        }

        try {
            const text = await this.readFileAsText(file);
            this.inputTextarea.value = text;
            this.updateStats();
            this.showToast(`File "${file.name}" uploaded successfully!`, 'success', 'Upload Complete');
        } catch (error) {
            this.showToast('Failed to read file: ' + error.message, 'error', 'Upload Error');
        }
    }

    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    downloadText() {
        const text = this.outputTextarea.value;
        if (!text.trim()) {
            this.showToast('No text to download!', 'warning', 'Download');
            return;
        }

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted-text-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('Text downloaded successfully!', 'success', 'Download');
    }

    async shareText() {
        const text = this.outputTextarea.value;
        if (!text.trim()) {
            this.showToast('No text to share!', 'warning', 'Share');
            return;
        }

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Converted Text',
                    text: text
                });
                this.showToast('Text shared successfully!', 'success', 'Share');
            } catch (error) {
                if (error.name !== 'AbortError') {
                    this.fallbackShare(text);
                }
            }
        } else {
            this.fallbackShare(text);
        }
    }

    fallbackShare(text) {
        // Create a temporary URL with the text
        const encodedText = encodeURIComponent(text);
        const shareUrl = `data:text/plain;charset=utf-8,${encodedText}`;
        
        // Copy to clipboard as fallback
        this.copyToClipboard();
        this.showToast('Text copied to clipboard (share not supported)', 'info', 'Share');
    }

    async copyToClipboard() {
        const textToCopy = this.outputTextarea.value;
        
        if (!textToCopy.trim()) {
            this.showToast('No text to copy!', 'warning', 'Copy');
            return;
        }

        try {
            await navigator.clipboard.writeText(textToCopy);
            this.showToast('Text copied to clipboard!', 'success', 'Copy');
        } catch (err) {
            // Fallback for older browsers
            this.outputTextarea.select();
            document.execCommand('copy');
            this.showToast('Text copied to clipboard!', 'success', 'Copy');
        }
    }

    async pasteFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            this.inputTextarea.value = text;
            this.updateStats();
            if (this.activeConversion) {
                this.performConversion(this.activeConversion);
            }
            this.showToast('Text pasted from clipboard!', 'success', 'Paste');
        } catch (err) {
            this.showToast('Failed to paste from clipboard', 'error', 'Paste');
        }
    }

    clearInput() {
        this.inputTextarea.value = '';
        this.outputTextarea.value = '';
        this.updateStats();
        this.clearActiveConversion();
        this.inputTextarea.focus();
        this.showToast('All text cleared!', 'info', 'Clear');
    }

    // History Management
    addToHistory(type, input, output) {
        const historyItem = {
            id: Date.now(),
            type: type,
            input: input.substring(0, 100) + (input.length > 100 ? '...' : ''),
            output: output.substring(0, 100) + (output.length > 100 ? '...' : ''),
            fullInput: input,
            fullOutput: output,
            timestamp: new Date().toISOString()
        };
        
        this.conversionHistory.unshift(historyItem);
        this.conversionHistory = this.conversionHistory.slice(0, 50); // Keep only last 50
        
        localStorage.setItem('caseConverterHistory', JSON.stringify(this.conversionHistory));
        this.loadHistory();
    }

    loadHistory() {
        if (this.conversionHistory.length === 0) {
            this.historyList.innerHTML = `
                <div class="history-empty">
                    <i class="fas fa-history"></i>
                    <p>No conversions yet. Start converting text to see your history here.</p>
                </div>
            `;
            return;
        }

        this.historyList.innerHTML = this.conversionHistory.map(item => `
            <div class="history-item" data-id="${item.id}">
                <div class="history-header">
                    <span class="history-type">${item.type}</span>
                    <span class="history-time">${this.formatTime(item.timestamp)}</span>
                </div>
                <div class="history-text">${item.input}</div>
            </div>
        `).join('');

        // Add click listeners to history items
        this.historyList.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                const historyItem = this.conversionHistory.find(h => h.id === id);
                if (historyItem) {
                    this.inputTextarea.value = historyItem.fullInput;
                    this.outputTextarea.value = historyItem.fullOutput;
                    this.updateStats();
                    
                    // Set active conversion
                    const button = document.querySelector(`[data-type="${historyItem.type}"]`);
                    if (button) {
                        this.setActiveButton(button);
                    }
                }
            });
        });
    }

    exportHistory() {
        if (this.conversionHistory.length === 0) {
            this.showToast('No history to export!', 'warning', 'Export');
            return;
        }

        const data = JSON.stringify(this.conversionHistory, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `case-converter-history-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('History exported successfully!', 'success', 'Export');
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear all conversion history?')) {
            this.conversionHistory = [];
            localStorage.removeItem('caseConverterHistory');
            this.loadHistory();
            this.showToast('History cleared!', 'info', 'Clear History');
        }
    }

    // Theme Management
    cycleTheme() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.currentTheme = this.themes[nextIndex];
        this.applyTheme();
        localStorage.setItem('caseConverterTheme', this.currentTheme);
        this.showToast(`Theme changed to ${this.currentTheme}`, 'info', 'Theme');
    }

    applyTheme() {
        document.body.className = `theme-${this.currentTheme}`;
        
        // Update theme colors
        const root = document.documentElement;
        switch (this.currentTheme) {
            case 'blue':
                root.style.setProperty('--accent-color', '#0080ff');
                root.style.setProperty('--accent-secondary', '#4dabf7');
                break;
            case 'purple':
                root.style.setProperty('--accent-color', '#9c88ff');
                root.style.setProperty('--accent-secondary', '#d0bfff');
                break;
            case 'green':
                root.style.setProperty('--accent-color', '#51cf66');
                root.style.setProperty('--accent-secondary', '#8ce99a');
                break;
            default:
                root.style.setProperty('--accent-color', '#00f0ff');
                root.style.setProperty('--accent-secondary', '#ff6b6b');
        }
    }

    // UI Controls
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            this.fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
            this.showToast('Entered fullscreen mode', 'info', 'Fullscreen');
        } else {
            document.exitFullscreen();
            this.fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
            this.showToast('Exited fullscreen mode', 'info', 'Fullscreen');
        }
    }

    toggleModal(modal, show) {
        if (show) {
            modal.classList.add('show');
        } else {
            modal.classList.remove('show');
        }
    }

    // Enhanced Toast System
    showToast(message, type = 'success', title = '') {
        const toast = this.toast.cloneNode(true);
        toast.id = `toast-${Date.now()}`;
        
        const icon = toast.querySelector('.toast-icon i');
        const titleElement = toast.querySelector('.toast-title');
        const messageElement = toast.querySelector('.toast-message');
        const closeBtn = toast.querySelector('.toast-close');
        
        // Set content
        titleElement.textContent = title || this.getToastTitle(type);
        messageElement.textContent = message;
        
        // Set icon and color based on type
        this.setToastStyle(toast, icon, type);
        
        // Add close functionality
        closeBtn.addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        });
        
        // Add to container
        this.toastContainer.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Auto-hide after 4 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    }

    setToastStyle(toast, icon, type) {
        const iconElement = toast.querySelector('.toast-icon');
        
        switch (type) {
            case 'success':
                icon.className = 'fas fa-check-circle';
                iconElement.style.background = '#51cf66';
                break;
            case 'error':
                icon.className = 'fas fa-times-circle';
                iconElement.style.background = '#ff4757';
                break;
            case 'warning':
                icon.className = 'fas fa-exclamation-triangle';
                iconElement.style.background = '#ffa500';
                break;
            case 'info':
                icon.className = 'fas fa-info-circle';
                iconElement.style.background = '#4dabf7';
                break;
        }
    }

    getToastTitle(type) {
        switch (type) {
            case 'success': return 'Success!';
            case 'error': return 'Error!';
            case 'warning': return 'Warning!';
            case 'info': return 'Info';
            default: return 'Notification';
        }
    }

    // Utility Functions
    debounce(func, wait) {
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

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return `${Math.floor(diff / 86400000)}d ago`;
    }

    saveDraft() {
        const draft = {
            input: this.inputTextarea.value,
            output: this.outputTextarea.value,
            activeConversion: this.activeConversion,
            timestamp: Date.now()
        };
        localStorage.setItem('caseConverterDraft', JSON.stringify(draft));
    }

    loadDraft() {
        const draft = JSON.parse(localStorage.getItem('caseConverterDraft') || '{}');
        if (draft.input && Date.now() - draft.timestamp < 86400000) { // 24 hours
            this.inputTextarea.value = draft.input;
            this.outputTextarea.value = draft.output || '';
            if (draft.activeConversion) {
                const button = document.querySelector(`[data-type="${draft.activeConversion}"]`);
                if (button) {
                    this.setActiveButton(button);
                }
            }
            this.updateStats();
            this.showToast('Draft restored!', 'info', 'Auto-save');
        }
    }
}

// Initialize the Advanced Case Converter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const converter = new AdvancedCaseConverter();
    
    // Load draft after a short delay
    setTimeout(() => converter.loadDraft(), 1000);
});
