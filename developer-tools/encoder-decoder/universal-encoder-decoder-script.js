/**
 * Universal Encoder & Decoder JavaScript - Advanced Futuristic Implementation
 * Pure client-side implementation with comprehensive encoding/decoding support
 * Enhanced with modern UI interactions, analytics, and advanced features
 */

// Application State Management
class EncoderDecoderApp {
    constructor() {
        this.currentMode = 'encode';
        this.currentFormat = 'url';
        this.isProcessing = false;
        this.stats = {
            operationsCount: 0,
            totalProcessingTime: 0,
            totalDataProcessed: 0
        };
        this.settings = {
            autoDetect: false,
            autoCopy: false,
            showPreview: false,
            preserveFormatting: false,
            processingSpeed: 2
        };
        
        this.init();
    }

    init() {
        this.initializeElements();
        this.setupEventListeners();
        this.setupAdvancedFeatures();
        this.loadSettings();
        this.hideLoadingOverlay();
        this.updateUI();
    }

    initializeElements() {
        // Mode controls
        this.encodeBtn = document.getElementById('encode-mode');
        this.decodeBtn = document.getElementById('decode-mode');
        this.modeSlider = document.querySelector('.mode-slider');
        
        // Format controls
        this.formatSelect = document.getElementById('format-select');
        this.formatInfo = document.getElementById('format-info');
        
        // Editor elements
        this.inputText = document.getElementById('input-text');
        this.outputText = document.getElementById('output-text');
        this.inputCounter = document.getElementById('input-counter');
        this.outputCounter = document.getElementById('output-counter');
        
        // Action buttons
        this.performBtn = document.getElementById('perform-operation');
        this.swapBtn = document.getElementById('swap-content');
        this.copyBtn = document.getElementById('copy-output');
        this.clearBtn = document.getElementById('clear-all');
        this.pasteBtn = document.getElementById('paste-btn');
        this.clearInputBtn = document.getElementById('clear-input');
        this.downloadBtn = document.getElementById('download-output');
        
        // Advanced features
        this.autoDetectBtn = document.getElementById('auto-detect');
        this.batchProcessBtn = document.getElementById('batch-process');
        this.optionsToggle = document.getElementById('options-toggle');
        this.optionsContent = document.querySelector('.options-content');
        
        // Status and progress
        this.statusIndicator = document.getElementById('status-indicator');
        this.statusMessage = document.getElementById('status-message');
        this.progressContainer = document.getElementById('progress-container');
        this.progressFill = document.getElementById('progress-fill');
        this.progressText = document.getElementById('progress-text');
        this.processingTime = document.getElementById('processing-time');
        
        // Stats
        this.operationsCountEl = document.getElementById('operations-count');
        this.avgTimeEl = document.getElementById('avg-time');
        this.dataProcessedEl = document.getElementById('data-processed');
        
        // Modal and FAB
        this.helpFab = document.getElementById('help-fab');
        this.helpModal = document.getElementById('help-modal');
        this.modalClose = document.getElementById('modal-close');
        
        // Theme and fullscreen
        this.themeToggle = document.getElementById('theme-toggle');
        this.fullscreenToggle = document.getElementById('fullscreen-toggle');
        
        // Loading overlay
        this.loadingOverlay = document.getElementById('loading-overlay');
    }

    setupEventListeners() {
        // Mode toggle
        this.encodeBtn?.addEventListener('click', () => this.setMode('encode'));
        this.decodeBtn?.addEventListener('click', () => this.setMode('decode'));
        
        // Format change
        this.formatSelect?.addEventListener('change', (e) => this.handleFormatChange(e.target.value));
        
        // Main actions
        this.performBtn?.addEventListener('click', () => this.performOperation());
        this.swapBtn?.addEventListener('click', () => this.swapInputOutput());
        this.copyBtn?.addEventListener('click', () => this.copyOutput());
        this.clearBtn?.addEventListener('click', () => this.clearAll());
        
        // Editor actions
        this.pasteBtn?.addEventListener('click', () => this.pasteFromClipboard());
        this.clearInputBtn?.addEventListener('click', () => this.clearInput());
        this.downloadBtn?.addEventListener('click', () => this.downloadOutput());
        
        // Advanced features
        this.autoDetectBtn?.addEventListener('click', () => this.autoDetectFormat());
        this.batchProcessBtn?.addEventListener('click', () => this.openBatchProcess());
        this.optionsToggle?.addEventListener('click', () => this.toggleAdvancedOptions());
        
        // Input monitoring
        this.inputText?.addEventListener('input', () => this.handleInputChange());
        this.inputText?.addEventListener('paste', () => setTimeout(() => this.handleInputChange(), 10));
        
        // Modal controls
        this.helpFab?.addEventListener('click', () => this.showHelpModal());
        this.modalClose?.addEventListener('click', () => this.hideHelpModal());
        this.helpModal?.addEventListener('click', (e) => {
            if (e.target === this.helpModal) this.hideHelpModal();
        });
        
        // Theme and fullscreen
        this.themeToggle?.addEventListener('click', () => this.toggleTheme());
        this.fullscreenToggle?.addEventListener('click', () => this.toggleFullscreen());
        
        // Settings
        this.setupSettingsListeners();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    setupAdvancedFeatures() {
        // Auto-save settings
        this.setupAutoSave();
        
        // Real-time preview
        this.setupRealTimePreview();
        
        // Performance monitoring
        this.setupPerformanceMonitoring();
        
        // Error tracking
        this.setupErrorTracking();
    }

    hideLoadingOverlay() {
        setTimeout(() => {
            this.loadingOverlay?.classList.add('hidden');
        }, 1500);
    }

    setMode(mode) {
        this.currentMode = mode;
        this.updateModeUI();
        this.clearStatus();
        this.updateFormatInfo();
    }

    updateModeUI() {
        // Update button states
        this.encodeBtn?.classList.toggle('active', this.currentMode === 'encode');
        this.decodeBtn?.classList.toggle('active', this.currentMode === 'decode');
        
        // Update perform button
        if (this.performBtn) {
            const icon = this.currentMode === 'encode' ? 'fas fa-lock' : 'fas fa-unlock';
            const text = this.currentMode === 'encode' ? 'Encode' : 'Decode';
            this.performBtn.innerHTML = `
                <div class="btn-content">
                    <i class="${icon}"></i>
                    <span class="btn-text">${text}</span>
                </div>
                <div class="btn-glow"></div>
                <div class="btn-particles"></div>
            `;
        }
    }

    handleFormatChange(format) {
        this.currentFormat = format;
        this.updateFormatInfo();
        this.clearStatus();
    }

    updateFormatInfo() {
        if (!this.formatInfo) return;
        
        const formatDescriptions = {
            url: 'Standard URL encoding for web addresses and form data',
            base64: 'Binary-to-text encoding scheme for data transmission',
            hex: 'Hexadecimal representation of binary data',
            binary: 'Binary representation using 0s and 1s',
            html: 'HTML entity encoding for special characters',
            uri: 'Strict URI component encoding for URLs'
        };
        
        const description = formatDescriptions[this.currentFormat] || 'Select a format to see details';
        this.formatInfo.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>${description}</span>
        `;
    }

    async performOperation() {
        if (this.isProcessing) return;
        
        const input = this.inputText?.value?.trim();
        if (!input) {
            this.showStatus('Please enter some input data.', 'error');
            return;
        }
        
        this.startProcessing();
        const startTime = performance.now();
        
        try {
            let result;
            const processingDelay = this.getProcessingDelay();
            
            // Simulate processing time based on settings
            await this.sleep(processingDelay);
            
            if (this.currentMode === 'encode') {
                result = this.performEncoding(input, this.currentFormat);
            } else {
                result = this.performDecoding(input, this.currentFormat);
            }
            
            const endTime = performance.now();
            const processingTime = endTime - startTime;
            
            this.outputText.value = result;
            this.updateStats(processingTime, input.length);
            this.showStatus(`${this.currentMode === 'encode' ? 'Encoding' : 'Decoding'} completed successfully!`, 'success');
            
            if (this.settings.autoCopy) {
                await this.copyOutput(false);
            }
            
        } catch (error) {
            this.outputText.value = '';
            this.showStatus(`Error: ${error.message}`, 'error');
        } finally {
            this.stopProcessing();
            this.updateCounters();
        }
    }

    startProcessing() {
        this.isProcessing = true;
        this.setStatusIndicator('processing', 'Processing...');
        this.showProgress();
        this.performBtn?.classList.add('processing');
        
        // Animate progress bar
        this.animateProgress();
    }

    stopProcessing() {
        this.isProcessing = false;
        this.setStatusIndicator('ready', 'Ready');
        this.hideProgress();
        this.performBtn?.classList.remove('processing');
    }

    animateProgress() {
        if (!this.progressFill) return;
        
        let progress = 0;
        const interval = setInterval(() => {
            if (!this.isProcessing) {
                clearInterval(interval);
                return;
            }
            
            progress += Math.random() * 15;
            if (progress > 90) progress = 90;
            
            this.progressFill.style.width = `${progress}%`;
            
            if (progress >= 90) {
                clearInterval(interval);
            }
        }, 100);
    }

    showProgress() {
        this.progressContainer?.classList.add('active');
        if (this.progressFill) this.progressFill.style.width = '0%';
    }

    hideProgress() {
        setTimeout(() => {
            if (this.progressFill) this.progressFill.style.width = '100%';
            setTimeout(() => {
                this.progressContainer?.classList.remove('active');
            }, 300);
        }, 200);
    }

    setStatusIndicator(status, text) {
        if (!this.statusIndicator) return;
        
        const dot = this.statusIndicator.querySelector('.indicator-dot');
        const textEl = this.statusIndicator.querySelector('.indicator-text');
        
        if (dot) {
            dot.className = 'indicator-dot';
            dot.classList.add(status);
        }
        
        if (textEl) {
            textEl.textContent = text;
        }
    }

    getProcessingDelay() {
        const speeds = { 1: 1000, 2: 500, 3: 100 };
        return speeds[this.settings.processingSpeed] || 500;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateStats(processingTime, dataSize) {
        this.stats.operationsCount++;
        this.stats.totalProcessingTime += processingTime;
        this.stats.totalDataProcessed += dataSize;
        
        this.updateStatsDisplay();
        this.updateProcessingTime(processingTime);
    }

    updateStatsDisplay() {
        if (this.operationsCountEl) {
            this.operationsCountEl.textContent = this.stats.operationsCount.toLocaleString();
        }
        
        if (this.avgTimeEl) {
            const avgTime = this.stats.operationsCount > 0 
                ? this.stats.totalProcessingTime / this.stats.operationsCount 
                : 0;
            this.avgTimeEl.textContent = `${Math.round(avgTime)}ms`;
        }
        
        if (this.dataProcessedEl) {
            this.dataProcessedEl.textContent = this.formatBytes(this.stats.totalDataProcessed);
        }
    }

    updateProcessingTime(time) {
        if (this.processingTime) {
            const timeEl = this.processingTime.querySelector('span');
            if (timeEl) timeEl.textContent = `${Math.round(time)}ms`;
        }
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + sizes[i];
    }

    handleInputChange() {
        this.updateCounters();
        if (this.settings.showPreview) {
            this.debounce(() => this.showPreview(), 300)();
        }
        this.clearStatus();
    }

    updateCounters() {
        if (this.inputCounter) {
            this.inputCounter.textContent = (this.inputText?.value?.length || 0).toLocaleString();
        }
        if (this.outputCounter) {
            this.outputCounter.textContent = (this.outputText?.value?.length || 0).toLocaleString();
        }
    }

    async showPreview() {
        if (!this.settings.showPreview || !this.inputText?.value) return;
        
        try {
            const preview = this.currentMode === 'encode' 
                ? this.performEncoding(this.inputText.value.substring(0, 100), this.currentFormat)
                : this.performDecoding(this.inputText.value.substring(0, 100), this.currentFormat);
            
            // Show preview in a subtle way
            this.showStatus(`Preview: ${preview.substring(0, 50)}...`, 'info');
        } catch (error) {
            // Silent fail for preview
        }
    }

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

    // Encoding/Decoding Functions (Enhanced versions)
    performEncoding(text, format) {
        const encoders = {
            url: () => this.urlEncode(text),
            base64: () => this.base64Encode(text),
            hex: () => this.hexEncode(text),
            binary: () => this.binaryEncode(text),
            html: () => this.htmlEntityEncode(text),
            uri: () => this.uriComponentEncodeStrict(text)
        };
        
        const encoder = encoders[format];
        if (!encoder) throw new Error('Unknown encoding format');
        
        return encoder();
    }

    performDecoding(text, format) {
        const decoders = {
            url: () => this.urlDecode(text),
            base64: () => this.base64Decode(text),
            hex: () => this.hexDecode(text),
            binary: () => this.binaryDecode(text),
            html: () => this.htmlEntityDecode(text),
            uri: () => this.uriComponentDecodeStrict(text)
        };
        
        const decoder = decoders[format];
        if (!decoder) throw new Error('Unknown decoding format');
        
        return decoder();
    }

    // Enhanced encoding functions with better error handling
    urlEncode(text) {
        try {
            return encodeURIComponent(text);
        } catch (error) {
            throw new Error('Failed to URL encode: Invalid characters');
        }
    }

    urlDecode(text) {
        try {
            return decodeURIComponent(text);
        } catch (error) {
            throw new Error('Malformed URI sequence');
        }
    }

    base64Encode(text) {
        try {
            const utf8Bytes = new TextEncoder().encode(text);
            let binary = '';
            for (let i = 0; i < utf8Bytes.length; i++) {
                binary += String.fromCharCode(utf8Bytes[i]);
            }
            return btoa(binary);
        } catch (error) {
            throw new Error('Failed to encode as Base64');
        }
    }

    base64Decode(text) {
        try {
            const cleanText = text.replace(/\s/g, '');
            if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanText)) {
                throw new Error('Invalid Base64 format');
            }
            
            const binary = atob(cleanText);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            return new TextDecoder().decode(bytes);
        } catch (error) {
            throw new Error('Invalid Base64 string');
        }
    }

    hexEncode(text) {
        try {
            const utf8Bytes = new TextEncoder().encode(text);
            let hex = '';
            for (let i = 0; i < utf8Bytes.length; i++) {
                hex += utf8Bytes[i].toString(16).padStart(2, '0').toUpperCase();
            }
            return hex;
        } catch (error) {
            throw new Error('Failed to encode as hexadecimal');
        }
    }

    hexDecode(text) {
        try {
            const cleanText = text.replace(/\s/g, '');
            if (!/^[0-9A-Fa-f]*$/.test(cleanText) || cleanText.length % 2 !== 0) {
                throw new Error('Invalid hexadecimal format');
            }
            
            const bytes = new Uint8Array(cleanText.length / 2);
            for (let i = 0; i < cleanText.length; i += 2) {
                bytes[i / 2] = parseInt(cleanText.substr(i, 2), 16);
            }
            return new TextDecoder().decode(bytes);
        } catch (error) {
            throw new Error('Invalid hexadecimal string');
        }
    }

    binaryEncode(text) {
        try {
            const utf8Bytes = new TextEncoder().encode(text);
            let binary = '';
            for (let i = 0; i < utf8Bytes.length; i++) {
                binary += utf8Bytes[i].toString(2).padStart(8, '0') + ' ';
            }
            return binary.trim();
        } catch (error) {
            throw new Error('Failed to encode as binary');
        }
    }

    binaryDecode(text) {
        try {
            const binaryGroups = text.trim().split(/\s+/);
            const bytes = new Uint8Array(binaryGroups.length);
            
            for (let i = 0; i < binaryGroups.length; i++) {
                const group = binaryGroups[i];
                if (!/^[01]{1,8}$/.test(group)) {
                    throw new Error('Invalid binary format');
                }
                bytes[i] = parseInt(group, 2);
            }
            
            return new TextDecoder().decode(bytes);
        } catch (error) {
            throw new Error('Invalid binary string');
        }
    }

    htmlEntityEncode(text) {
        try {
            const entityMap = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '/': '&#x2F;',
                '`': '&#x60;',
                '=': '&#x3D;'
            };
            
            return text.replace(/[&<>"'`=\/]/g, char => entityMap[char]);
        } catch (error) {
            throw new Error('Failed to encode HTML entities');
        }
    }

    htmlEntityDecode(text) {
        try {
            const entityMap = {
                '&amp;': '&',
                '&lt;': '<',
                '&gt;': '>',
                '&quot;': '"',
                '&#39;': "'",
                '&#x2F;': '/',
                '&#x60;': '`',
                '&#x3D;': '='
            };
            
            return text.replace(/&[a-zA-Z0-9#x]+;/g, entity => {
                if (entityMap[entity]) {
                    return entityMap[entity];
                }
                
                if (entity.startsWith('&#x')) {
                    const hex = entity.slice(3, -1);
                    const code = parseInt(hex, 16);
                    return isNaN(code) ? entity : String.fromCharCode(code);
                } else if (entity.startsWith('&#')) {
                    const num = entity.slice(2, -1);
                    const code = parseInt(num, 10);
                    return isNaN(code) ? entity : String.fromCharCode(code);
                }
                
                return entity;
            });
        } catch (error) {
            throw new Error('Failed to decode HTML entities');
        }
    }

    uriComponentEncodeStrict(text) {
        try {
            return encodeURIComponent(text)
                .replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
        } catch (error) {
            throw new Error('Failed to encode URI component');
        }
    }

    uriComponentDecodeStrict(text) {
        try {
            return decodeURIComponent(text);
        } catch (error) {
            throw new Error('Malformed URI component');
        }
    }

    // Advanced Features
    async autoDetectFormat() {
        const input = this.inputText?.value?.trim();
        if (!input) {
            this.showStatus('No input to analyze.', 'error');
            return;
        }
        
        this.showStatus('Analyzing input format...', 'info');
        
        // Simple format detection logic
        let detectedFormat = 'url';
        
        if (/^[A-Za-z0-9+/]*={0,2}$/.test(input) && input.length % 4 === 0) {
            detectedFormat = 'base64';
        } else if (/^[0-9A-Fa-f\s]*$/.test(input) && input.replace(/\s/g, '').length % 2 === 0) {
            detectedFormat = 'hex';
        } else if (/^[01\s]*$/.test(input)) {
            detectedFormat = 'binary';
        } else if (input.includes('&') && (input.includes('lt;') || input.includes('gt;') || input.includes('amp;'))) {
            detectedFormat = 'html';
        } else if (input.includes('%') && /(%[0-9A-Fa-f]{2})+/.test(input)) {
            detectedFormat = 'url';
        }
        
        this.formatSelect.value = detectedFormat;
        this.currentFormat = detectedFormat;
        this.updateFormatInfo();
        this.showStatus(`Detected format: ${detectedFormat.toUpperCase()}`, 'success');
    }

    openBatchProcess() {
        this.showStatus('Batch processing feature coming soon!', 'info');
    }

    toggleAdvancedOptions() {
        const isActive = this.optionsContent?.classList.contains('active');
        this.optionsContent?.classList.toggle('active');
        this.optionsToggle?.classList.toggle('active', !isActive);
    }

    setupSettingsListeners() {
        // Checkbox settings
        ['preserve-formatting', 'auto-copy', 'show-preview'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', (e) => {
                    const setting = id.replace('-', '');
                    this.settings[setting] = e.target.checked;
                    this.saveSettings();
                });
            }
        });
        
        // Speed slider
        const speedSlider = document.getElementById('speed-slider');
        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                this.settings.processingSpeed = parseInt(e.target.value);
                this.saveSettings();
            });
        }
    }

    saveSettings() {
        try {
            localStorage.setItem('encoderDecoderSettings', JSON.stringify(this.settings));
        } catch (error) {
            console.warn('Failed to save settings:', error);
        }
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('encoderDecoderSettings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
                this.applySettings();
            }
        } catch (error) {
            console.warn('Failed to load settings:', error);
        }
    }

    applySettings() {
        // Apply checkbox settings
        Object.keys(this.settings).forEach(key => {
            if (typeof this.settings[key] === 'boolean') {
                const element = document.getElementById(key.replace(/([A-Z])/g, '-$1').toLowerCase());
                if (element) element.checked = this.settings[key];
            }
        });
        
        // Apply speed setting
        const speedSlider = document.getElementById('speed-slider');
        if (speedSlider) speedSlider.value = this.settings.processingSpeed;
    }

    // Utility Functions
    async swapInputOutput() {
        const inputValue = this.inputText?.value || '';
        const outputValue = this.outputText?.value || '';
        
        this.inputText.value = outputValue;
        this.outputText.value = inputValue;
        
        this.updateCounters();
        this.showStatus('Input and output swapped successfully!', 'info');
    }

    async copyOutput(showMessage = true) {
        const output = this.outputText?.value;
        
        if (!output) {
            if (showMessage) this.showStatus('No output to copy.', 'error');
            return;
        }
        
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(output);
                if (showMessage) this.showStatus('Output copied to clipboard!', 'success');
            } else {
                this.outputText.select();
                document.execCommand('copy');
                if (showMessage) this.showStatus('Output copied to clipboard!', 'success');
            }
        } catch (error) {
            if (showMessage) this.showStatus('Failed to copy to clipboard.', 'error');
        }
    }

    async pasteFromClipboard() {
        try {
            if (navigator.clipboard && navigator.clipboard.readText) {
                const text = await navigator.clipboard.readText();
                this.inputText.value = text;
                this.handleInputChange();
                this.showStatus('Content pasted from clipboard!', 'success');
            } else {
                this.showStatus('Clipboard access not available. Use Ctrl+V instead.', 'info');
                this.inputText.focus();
            }
        } catch (error) {
            this.showStatus('Failed to access clipboard.', 'error');
        }
    }

    clearInput() {
        this.inputText.value = '';
        this.updateCounters();
        this.clearStatus();
        this.inputText.focus();
    }

    clearAll() {
        this.inputText.value = '';
        this.outputText.value = '';
        this.updateCounters();
        this.clearStatus();
        this.showStatus('All fields cleared.', 'info');
        this.inputText.focus();
    }

    downloadOutput() {
        const output = this.outputText?.value;
        if (!output) {
            this.showStatus('No output to download.', 'error');
            return;
        }
        
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentMode}-${this.currentFormat}-${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showStatus('Output downloaded successfully!', 'success');
    }

    toggleTheme() {
        document.body.classList.toggle('theme-light');
        const isLight = document.body.classList.contains('theme-light');
        
        try {
            localStorage.setItem('encoderDecoderTheme', isLight ? 'light' : 'dark');
        } catch (error) {
            console.warn('Failed to save theme preference:', error);
        }
        
        this.showStatus(`Switched to ${isLight ? 'light' : 'dark'} theme`, 'info');
    }

    toggleFullscreen() {
        const workspace = document.querySelector('.editor-workspace');
        if (!workspace) return;
        
        if (!document.fullscreenElement) {
            workspace.requestFullscreen().catch(error => {
                this.showStatus('Failed to enter fullscreen mode.', 'error');
            });
        } else {
            document.exitFullscreen();
        }
    }

    showHelpModal() {
        this.helpModal?.classList.add('active');
    }

    hideHelpModal() {
        this.helpModal?.classList.remove('active');
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Ctrl/Cmd + Enter to process
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                event.preventDefault();
                this.performOperation();
            }
            
            // Ctrl/Cmd + Shift + S to swap
            if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'S') {
                event.preventDefault();
                this.swapInputOutput();
            }
            
            // Ctrl/Cmd + Shift + C to copy
            if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
                event.preventDefault();
                this.copyOutput();
            }
            
            // Ctrl/Cmd + Shift + D to clear
            if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'D') {
                event.preventDefault();
                this.clearAll();
            }
            
            // F11 for fullscreen
            if (event.key === 'F11') {
                event.preventDefault();
                this.toggleFullscreen();
            }
            
            // Ctrl/Cmd + V to paste and process (when input is focused)
            if ((event.ctrlKey || event.metaKey) && event.key === 'v' && event.target === this.inputText) {
                setTimeout(() => {
                    this.handleInputChange();
                    if (this.settings.autoDetect) {
                        setTimeout(() => this.autoDetectFormat(), 100);
                    }
                }, 10);
            }
        });
    }

    setupAutoSave() {
        // Auto-save input content
        let autoSaveTimer;
        this.inputText?.addEventListener('input', () => {
            clearTimeout(autoSaveTimer);
            autoSaveTimer = setTimeout(() => {
                try {
                    localStorage.setItem('encoderDecoderAutoSave', this.inputText.value);
                } catch (error) {
                    console.warn('Failed to auto-save:', error);
                }
            }, 1000);
        });
        
        // Restore auto-saved content
        try {
            const autoSaved = localStorage.getItem('encoderDecoderAutoSave');
            if (autoSaved && this.inputText) {
                this.inputText.value = autoSaved;
                this.handleInputChange();
            }
        } catch (error) {
            console.warn('Failed to restore auto-saved content:', error);
        }
    }

    setupRealTimePreview() {
        // Already implemented in handleInputChange
    }

    setupPerformanceMonitoring() {
        // Monitor performance and show warnings for large inputs
        this.inputText?.addEventListener('input', () => {
            const length = this.inputText.value.length;
            if (length > 100000) {
                this.showStatus('Large input detected. Processing may take longer.', 'info');
            }
        });
    }

    setupErrorTracking() {
        // Global error handler for the application
        window.addEventListener('error', (event) => {
            console.error('Application error:', event.error);
            this.showStatus('An unexpected error occurred. Please try again.', 'error');
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.showStatus('An unexpected error occurred. Please try again.', 'error');
        });
    }

    showStatus(message, type = 'info') {
        if (!this.statusMessage) return;
        
        this.statusMessage.textContent = message;
        this.statusMessage.className = `status-message ${type} active`;
        
        // Auto-clear status after 5 seconds for success/info messages
        if (type !== 'error') {
            setTimeout(() => this.clearStatus(), 5000);
        }
    }

    clearStatus() {
        if (this.statusMessage) {
            this.statusMessage.className = 'status-message';
            this.statusMessage.textContent = '';
        }
    }

    updateUI() {
        this.updateModeUI();
        this.updateFormatInfo();
        this.updateCounters();
        this.updateStatsDisplay();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EncoderDecoderApp();
});

// Add helpful tooltips
document.addEventListener('DOMContentLoaded', () => {
    const tooltips = {
        'perform-operation': 'Process data (Ctrl+Enter)',
        'swap-content': 'Swap input and output (Ctrl+Shift+S)',
        'copy-output': 'Copy result to clipboard (Ctrl+Shift+C)',
        'clear-all': 'Clear all data (Ctrl+Shift+D)',
        'fullscreen-toggle': 'Toggle fullscreen (F11)',
        'theme-toggle': 'Switch theme',
        'paste-btn': 'Paste from clipboard',
        'download-output': 'Download result as file',
        'auto-detect': 'Auto-detect input format',
        'help-fab': 'View keyboard shortcuts and help'
    };
    
    Object.entries(tooltips).forEach(([id, title]) => {
        const element = document.getElementById(id);
        if (element && !element.title) {
            element.title = title;
        }
    });
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment if you want PWA functionality
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

/**
 * Main operation function - performs encoding or decoding
 */
function performOperation() {
    const input = inputText.value.trim();
    const format = formatSelect.value;
    
    if (!input) {
        showStatus('Please enter some input data.', 'error');
        return;
    }
    
    try {
        let result;
        
        if (currentMode === 'encode') {
            result = performEncoding(input, format);
        } else {
            result = performDecoding(input, format);
        }
        
        outputText.value = result;
        showStatus(`${currentMode === 'encode' ? 'Encoding' : 'Decoding'} successful!`, 'success');
        
    } catch (error) {
        outputText.value = '';
        showStatus(`Error: ${error.message}`, 'error');
    }
}

/**
 * Perform encoding based on selected format
 */
function performEncoding(text, format) {
    switch (format) {
        case 'url':
            return urlEncode(text);
        case 'base64':
            return base64Encode(text);
        case 'hex':
            return hexEncode(text);
        case 'binary':
            return binaryEncode(text);
        case 'html':
            return htmlEntityEncode(text);
        case 'uri':
            return uriComponentEncodeStrict(text);
        default:
            throw new Error('Unknown encoding format');
    }
}

/**
 * Perform decoding based on selected format
 */
function performDecoding(text, format) {
    switch (format) {
        case 'url':
            return urlDecode(text);
        case 'base64':
            return base64Decode(text);
        case 'hex':
            return hexDecode(text);
        case 'binary':
            return binaryDecode(text);
        case 'html':
            return htmlEntityDecode(text);
        case 'uri':
            return uriComponentDecodeStrict(text);
        default:
            throw new Error('Unknown decoding format');
    }
}

// ============================================================================
// ENCODING FUNCTIONS (Pure JavaScript implementations)
// ============================================================================

/**
 * URL Encode using standard encodeURIComponent
 * Encodes special characters for URL usage
 */
function urlEncode(text) {
    return encodeURIComponent(text);
}

/**
 * URL Decode using standard decodeURIComponent
 * Handles malformed URI sequences gracefully
 */
function urlDecode(text) {
    try {
        return decodeURIComponent(text);
    } catch (error) {
        throw new Error('Malformed URI sequence');
    }
}

/**
 * Base64 Encode with Unicode support
 * Uses TextEncoder for proper UTF-8 handling before base64 encoding
 */
function base64Encode(text) {
    try {
        // Handle Unicode characters properly by converting to UTF-8 bytes first
        const utf8Bytes = new TextEncoder().encode(text);
        let binary = '';
        for (let i = 0; i < utf8Bytes.length; i++) {
            binary += String.fromCharCode(utf8Bytes[i]);
        }
        return btoa(binary);
    } catch (error) {
        throw new Error('Failed to encode as Base64');
    }
}

/**
 * Base64 Decode with Unicode support
 * Uses TextDecoder for proper UTF-8 handling after base64 decoding
 */
function base64Decode(text) {
    try {
        // Remove whitespace and validate base64 format
        const cleanText = text.replace(/\s/g, '');
        if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleanText)) {
            throw new Error('Invalid Base64 format');
        }
        
        const binary = atob(cleanText);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return new TextDecoder().decode(bytes);
    } catch (error) {
        throw new Error('Invalid Base64 string');
    }
}

/**
 * Hex Encode - converts text to hexadecimal representation
 * Each byte is represented as two hex digits
 */
function hexEncode(text) {
    const utf8Bytes = new TextEncoder().encode(text);
    let hex = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
        hex += utf8Bytes[i].toString(16).padStart(2, '0').toUpperCase();
    }
    return hex;
}

/**
 * Hex Decode - converts hexadecimal back to text
 * Validates hex format and handles UTF-8 decoding
 */
function hexDecode(text) {
    try {
        // Remove whitespace and validate hex format
        const cleanText = text.replace(/\s/g, '');
        if (!/^[0-9A-Fa-f]*$/.test(cleanText) || cleanText.length % 2 !== 0) {
            throw new Error('Invalid hexadecimal format');
        }
        
        const bytes = new Uint8Array(cleanText.length / 2);
        for (let i = 0; i < cleanText.length; i += 2) {
            bytes[i / 2] = parseInt(cleanText.substr(i, 2), 16);
        }
        return new TextDecoder().decode(bytes);
    } catch (error) {
        throw new Error('Invalid hexadecimal string');
    }
}

/**
 * Binary Encode - converts text to binary representation
 * Each byte is represented as 8 binary digits
 */
function binaryEncode(text) {
    const utf8Bytes = new TextEncoder().encode(text);
    let binary = '';
    for (let i = 0; i < utf8Bytes.length; i++) {
        binary += utf8Bytes[i].toString(2).padStart(8, '0') + ' ';
    }
    return binary.trim();
}

/**
 * Binary Decode - converts binary back to text
 * Validates binary format and handles UTF-8 decoding
 */
function binaryDecode(text) {
    try {
        // Split by spaces and validate binary format
        const binaryGroups = text.trim().split(/\s+/);
        const bytes = new Uint8Array(binaryGroups.length);
        
        for (let i = 0; i < binaryGroups.length; i++) {
            const group = binaryGroups[i];
            if (!/^[01]{1,8}$/.test(group)) {
                throw new Error('Invalid binary format');
            }
            bytes[i] = parseInt(group, 2);
        }
        
        return new TextDecoder().decode(bytes);
    } catch (error) {
        throw new Error('Invalid binary string');
    }
}

/**
 * HTML Entity Encode - converts special characters to HTML entities
 * Handles common HTML characters that need escaping
 */
function htmlEntityEncode(text) {
    const entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };
    
    return text.replace(/[&<>"'`=\/]/g, function(char) {
        return entityMap[char];
    });
}

/**
 * HTML Entity Decode - converts HTML entities back to characters
 * Handles both named and numeric entities
 */
function htmlEntityDecode(text) {
    const entityMap = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&#x2F;': '/',
        '&#x60;': '`',
        '&#x3D;': '='
    };
    
    // Handle named entities
    let decoded = text.replace(/&[a-zA-Z0-9#x]+;/g, function(entity) {
        if (entityMap[entity]) {
            return entityMap[entity];
        }
        
        // Handle numeric entities (&#123; or &#x7B;)
        if (entity.startsWith('&#x')) {
            const hex = entity.slice(3, -1);
            const code = parseInt(hex, 16);
            return isNaN(code) ? entity : String.fromCharCode(code);
        } else if (entity.startsWith('&#')) {
            const num = entity.slice(2, -1);
            const code = parseInt(num, 10);
            return isNaN(code) ? entity : String.fromCharCode(code);
        }
        
        return entity;
    });
    
    return decoded;
}

/**
 * URI Component Encode (Strict) - more comprehensive than standard encodeURIComponent
 * Encodes additional characters for strict URI compliance
 */
function uriComponentEncodeStrict(text) {
    return encodeURIComponent(text)
        .replace(/[!'()*]/g, function(c) {
            return '%' + c.charCodeAt(0).toString(16).toUpperCase();
        });
}

/**
 * URI Component Decode (Strict) - handles strict URI decoding
 * Same as standard decodeURIComponent but with better error handling
 */
function uriComponentDecodeStrict(text) {
    try {
        return decodeURIComponent(text);
    } catch (error) {
        throw new Error('Malformed URI component');
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Swap content between input and output textareas
 */
function swapInputOutput() {
    const inputValue = inputText.value;
    const outputValue = outputText.value;
    
    inputText.value = outputValue;
    outputText.value = inputValue;
    
    showStatus('Input and output swapped successfully!', 'info');
}

/**
 * Copy output content to clipboard
 * Uses modern Clipboard API with fallback for older browsers
 */
async function copyOutput() {
    const output = outputText.value;
    
    if (!output) {
        showStatus('No output to copy.', 'error');
        return;
    }
    
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(output);
            showStatus('Output copied to clipboard!', 'success');
        } else {
            // Fallback for older browsers
            outputText.select();
            document.execCommand('copy');
            showStatus('Output copied to clipboard!', 'success');
        }
    } catch (error) {
        showStatus('Failed to copy to clipboard.', 'error');
    }
}

/**
 * Clear all input, output, and status
 */
function clearAll() {
    inputText.value = '';
    outputText.value = '';
    clearStatus();
    showStatus('All fields cleared.', 'info');
    
    // Focus back to input for better UX
    inputText.focus();
}

/**
 * Show status message with appropriate styling
 */
function showStatus(message, type = 'info') {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    
    // Auto-clear status after 5 seconds for success/info messages
    if (type !== 'error') {
        setTimeout(clearStatus, 5000);
    }
}

/**
 * Clear status message
 */
function clearStatus() {
    statusMessage.textContent = '';
    statusMessage.className = 'status-message';
}

// ============================================================================
// KEYBOARD SHORTCUTS AND ACCESSIBILITY
// ============================================================================

// Add keyboard shortcuts for better accessibility
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + Enter to perform operation
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        performOperation();
    }
    
    // Ctrl/Cmd + Shift + S to swap input/output
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'S') {
        event.preventDefault();
        swapInputOutput();
    }
    
    // Ctrl/Cmd + Shift + C to copy output
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
        event.preventDefault();
        copyOutput();
    }
    
    // Ctrl/Cmd + Shift + D to clear all
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        clearAll();
    }
});

// Add helpful tooltips or hints
performBtn.title = 'Keyboard shortcut: Ctrl+Enter';
swapBtn.title = 'Keyboard shortcut: Ctrl+Shift+S';
copyBtn.title = 'Keyboard shortcut: Ctrl+Shift+C';
clearBtn.title = 'Keyboard shortcut: Ctrl+Shift+D';
