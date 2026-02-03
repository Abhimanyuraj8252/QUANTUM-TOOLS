// PDF to Text Converter JavaScript
// Advanced text extraction with PDF.js integration

class PDFToTextConverter {
    constructor() {
        this.currentFile = null;
        this.extractedText = '';
        this.pdfDocument = null;
        this.extractionOptions = {
            format: 'plain',
            pages: 'all',
            startPage: 1,
            endPage: null,
            preserveLayout: true,
            includeHeaders: false,
            extractMetadata: false
        };
        this.init();
    }

    init() {
        // Configure PDF.js worker
        if (typeof pdfjsLib !== 'undefined') {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
        
        this.bindEvents();
        this.updateUI();
    }

    bindEvents() {
        // File input events
        const fileInput = document.getElementById('file-input');
        const browseBtn = document.getElementById('browse-btn');
        const uploadArea = document.getElementById('upload-area');

        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }

        if (browseBtn) {
            browseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                fileInput?.click();
            });
        }

        if (uploadArea) {
            uploadArea.addEventListener('click', (e) => {
                if (!e.target.closest('.upload-btn')) {
                    fileInput?.click();
                }
            });
            uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
            uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        }

        // Remove file button
        const removeFileBtn = document.getElementById('remove-file');
        if (removeFileBtn) {
            removeFileBtn.addEventListener('click', () => this.removeFile());
        }

        // Format options
        document.querySelectorAll('input[name="format"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.extractionOptions.format = e.target.value;
            });
        });

        // Page range options
        document.querySelectorAll('input[name="pages"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.extractionOptions.pages = e.target.value;
                const rangeInputs = document.getElementById('range-inputs');
                if (rangeInputs) {
                    rangeInputs.style.display = e.target.value === 'range' ? 'flex' : 'none';
                }
            });
        });

        // Page range inputs
        const startPageInput = document.getElementById('start-page');
        const endPageInput = document.getElementById('end-page');
        
        if (startPageInput) {
            startPageInput.addEventListener('change', (e) => {
                this.extractionOptions.startPage = parseInt(e.target.value) || 1;
            });
        }
        
        if (endPageInput) {
            endPageInput.addEventListener('change', (e) => {
                this.extractionOptions.endPage = parseInt(e.target.value) || null;
            });
        }

        // Advanced options
        const preserveLayoutCheckbox = document.getElementById('preserve-layout');
        const includeHeadersCheckbox = document.getElementById('include-headers');
        const extractMetadataCheckbox = document.getElementById('extract-metadata');

        if (preserveLayoutCheckbox) {
            preserveLayoutCheckbox.addEventListener('change', (e) => {
                this.extractionOptions.preserveLayout = e.target.checked;
            });
        }

        if (includeHeadersCheckbox) {
            includeHeadersCheckbox.addEventListener('change', (e) => {
                this.extractionOptions.includeHeaders = e.target.checked;
            });
        }

        if (extractMetadataCheckbox) {
            extractMetadataCheckbox.addEventListener('change', (e) => {
                this.extractionOptions.extractMetadata = e.target.checked;
            });
        }        // Action buttons
        const extractBtn = document.getElementById('extract-text');
        const downloadTxtBtn = document.getElementById('download-txt');
        const copyTextBtn = document.getElementById('copy-text');
        const convertAnotherBtn = document.getElementById('convert-another');

        if (extractBtn) {
            extractBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Extract button clicked');
                this.extractText();
            });
        } else {
            console.error('Extract button not found!');
        }

        if (downloadTxtBtn) {
            downloadTxtBtn.addEventListener('click', () => this.downloadText('txt'));
        }

        if (copyTextBtn) {
            copyTextBtn.addEventListener('click', () => this.copyToClipboard());
        }

        if (convertAnotherBtn) {
            convertAnotherBtn.addEventListener('click', () => this.reset());
        }
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            this.loadFile(file);
        } else {
            this.showNotification('Please select a valid PDF file', 'error');
        }
    }

    handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.add('drag-over');
    }

    handleDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.remove('drag-over');
    }

    handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.remove('drag-over');

        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'application/pdf') {
                this.loadFile(file);
            } else {
                this.showNotification('Please drop a valid PDF file', 'error');
            }
        }
    }    async loadFile(file) {
        try {
            this.currentFile = file;
            
            // Load PDF document
            const arrayBuffer = await file.arrayBuffer();
            this.pdfDocument = await pdfjsLib.getDocument(arrayBuffer).promise;
            
            const pageCount = this.pdfDocument.numPages;
            
            // Update UI with file info
            this.updateFileInfo(file, pageCount);
            this.showSection('options-section');
            
            // Enable the extract button
            this.updateUI();
            
            this.showNotification('PDF loaded successfully!', 'success');
        } catch (error) {
            console.error('Error loading PDF:', error);
            this.showNotification('Error loading PDF file', 'error');
        }
    }

    updateFileInfo(file, pageCount) {
        const fileInfo = document.getElementById('file-info');
        const fileName = document.getElementById('file-name');
        const fileSize = document.getElementById('file-size');
        const filePages = document.getElementById('file-pages');
        
        if (fileInfo) fileInfo.style.display = 'block';
        if (fileName) fileName.textContent = file.name;
        if (fileSize) fileSize.textContent = this.formatFileSize(file.size);
        if (filePages) filePages.textContent = `${pageCount} pages`;
        
        // Update page range inputs max values
        const startPageInput = document.getElementById('start-page');
        const endPageInput = document.getElementById('end-page');
        
        if (startPageInput) {
            startPageInput.max = pageCount;
            startPageInput.value = 1;
        }
        
        if (endPageInput) {
            endPageInput.max = pageCount;
            endPageInput.value = pageCount;
        }
        
        this.extractionOptions.endPage = pageCount;
    }

    async extractText() {
        if (!this.pdfDocument) {
            this.showNotification('Please load a PDF file first', 'warning');
            return;
        }

        try {
            this.showSection('processing-section');
            this.updateProgress(0, 'Starting text extraction...');

            const startPage = this.extractionOptions.pages === 'all' ? 1 : this.extractionOptions.startPage;
            const endPage = this.extractionOptions.pages === 'all' ? this.pdfDocument.numPages : this.extractionOptions.endPage;
            
            let extractedText = '';
            let metadata = {};

            // Extract metadata if requested
            if (this.extractionOptions.extractMetadata) {
                try {
                    const pdfMetadata = await this.pdfDocument.getMetadata();
                    metadata = {
                        title: pdfMetadata.info.Title || 'N/A',
                        author: pdfMetadata.info.Author || 'N/A',
                        subject: pdfMetadata.info.Subject || 'N/A',
                        creator: pdfMetadata.info.Creator || 'N/A',
                        producer: pdfMetadata.info.Producer || 'N/A',
                        creationDate: pdfMetadata.info.CreationDate || 'N/A',
                        modificationDate: pdfMetadata.info.ModDate || 'N/A'
                    };
                } catch (metaError) {
                    console.warn('Could not extract metadata:', metaError);
                }
            }

            // Extract text from pages
            for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
                this.updateProgress(
                    ((pageNum - startPage) / (endPage - startPage + 1)) * 80 + 10,
                    `Extracting text from page ${pageNum}...`
                );

                try {
                    const page = await this.pdfDocument.getPage(pageNum);
                    const textContent = await page.getTextContent();
                    
                    let pageText = '';
                    
                    if (this.extractionOptions.preserveLayout) {
                        // Preserve layout by using text item positions
                        pageText = this.extractTextWithLayout(textContent);
                    } else {
                        // Simple text extraction
                        pageText = textContent.items.map(item => item.str).join(' ');
                    }
                    
                    // Add page separator
                    if (pageText.trim()) {
                        extractedText += `--- Page ${pageNum} ---\n${pageText}\n\n`;
                    }
                } catch (pageError) {
                    console.warn(`Error extracting text from page ${pageNum}:`, pageError);
                    extractedText += `--- Page ${pageNum} (extraction failed) ---\n\n`;
                }
            }

            this.updateProgress(90, 'Formatting text...');

            // Add metadata if requested
            if (this.extractionOptions.extractMetadata && Object.keys(metadata).length > 0) {
                let metadataText = '--- DOCUMENT METADATA ---\n';
                Object.entries(metadata).forEach(([key, value]) => {
                    metadataText += `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}\n`;
                });
                metadataText += '\n--- DOCUMENT CONTENT ---\n\n';
                extractedText = metadataText + extractedText;
            }

            // Format text based on selected format
            if (this.extractionOptions.format === 'markdown') {
                extractedText = this.formatAsMarkdown(extractedText);
            } else if (this.extractionOptions.format === 'formatted') {
                extractedText = this.formatAsRichText(extractedText);
            }

            this.extractedText = extractedText;
            this.updateProgress(100, 'Text extraction complete!');

            setTimeout(() => {
                this.displayResults();
            }, 1000);

        } catch (error) {
            console.error('Error extracting text:', error);
            this.showNotification('Error extracting text from PDF', 'error');
            this.showSection('options-section');
        }
    }

    extractTextWithLayout(textContent) {
        const items = textContent.items;
        const lines = [];
        let currentLine = { y: null, items: [] };

        // Group text items by line
        items.forEach(item => {
            const y = Math.round(item.transform[5]);
            
            if (currentLine.y === null || Math.abs(currentLine.y - y) < 5) {
                currentLine.y = y;
                currentLine.items.push(item);
            } else {
                if (currentLine.items.length > 0) {
                    lines.push([...currentLine.items]);
                }
                currentLine = { y: y, items: [item] };
            }
        });

        if (currentLine.items.length > 0) {
            lines.push(currentLine.items);
        }

        // Sort lines by y position (top to bottom)
        lines.sort((a, b) => (b[0]?.transform[5] || 0) - (a[0]?.transform[5] || 0));

        // Convert lines to text
        return lines.map(lineItems => {
            // Sort items in line by x position (left to right)
            lineItems.sort((a, b) => (a.transform[4] || 0) - (b.transform[4] || 0));
            return lineItems.map(item => item.str).join(' ').trim();
        }).filter(line => line.length > 0).join('\n');
    }

    formatAsMarkdown(text) {
        // Basic markdown formatting
        return text
            .replace(/^--- Page (\d+) ---$/gm, '## Page $1\n')
            .replace(/^--- DOCUMENT METADATA ---$/gm, '# Document Metadata\n')
            .replace(/^--- DOCUMENT CONTENT ---$/gm, '# Document Content\n');
    }

    formatAsRichText(text) {
        // Add basic formatting for rich text
        return text
            .replace(/^--- Page (\d+) ---$/gm, '═══ PAGE $1 ═══')
            .replace(/^--- DOCUMENT METADATA ---$/gm, '═══ DOCUMENT METADATA ═══')
            .replace(/^--- DOCUMENT CONTENT ---$/gm, '═══ DOCUMENT CONTENT ═══');
    }

    displayResults() {
        this.showSection('results-section');
        
        const textContent = document.getElementById('text-content');
        if (textContent) {
            textContent.textContent = this.extractedText;
        }

        // Update statistics
        this.updateTextStats();
    }

    updateTextStats() {
        const charCount = document.getElementById('char-count');
        const wordCount = document.getElementById('word-count');
        const lineCount = document.getElementById('line-count');

        const chars = this.extractedText.length;
        const words = this.extractedText.trim().split(/\s+/).filter(word => word.length > 0).length;
        const lines = this.extractedText.split('\n').length;

        if (charCount) charCount.textContent = `${chars.toLocaleString()} characters`;
        if (wordCount) wordCount.textContent = `${words.toLocaleString()} words`;
        if (lineCount) lineCount.textContent = `${lines.toLocaleString()} lines`;
    }

    downloadText(format) {
        if (!this.extractedText) {
            this.showNotification('No text available to download', 'warning');
            return;
        }

        try {
            const blob = new Blob([this.extractedText], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            
            const originalName = this.currentFile?.name || 'document.pdf';
            const baseName = originalName.replace(/\.pdf$/i, '');
            const downloadName = `${baseName}_extracted.${format}`;
            
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = downloadName;
            downloadLink.style.display = 'none';
            
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            URL.revokeObjectURL(url);
            
            this.showNotification(`Download started: ${downloadName}`, 'success');
        } catch (error) {
            console.error('Error downloading text:', error);
            this.showNotification('Error downloading text file', 'error');
        }
    }

    async copyToClipboard() {
        if (!this.extractedText) {
            this.showNotification('No text available to copy', 'warning');
            return;
        }

        try {
            await navigator.clipboard.writeText(this.extractedText);
            this.showNotification('Text copied to clipboard!', 'success');
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            this.showNotification('Error copying text to clipboard', 'error');
        }
    }

    removeFile() {
        this.currentFile = null;
        this.pdfDocument = null;
        this.extractedText = '';
        
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';
        
        const fileInfo = document.getElementById('file-info');
        if (fileInfo) fileInfo.style.display = 'none';
        
        this.hideAllSections();
        this.updateUI();
    }

    reset() {
        this.removeFile();
        
        // Reset options to defaults
        document.querySelector('input[name="format"][value="plain"]').checked = true;
        document.querySelector('input[name="pages"][value="all"]').checked = true;
        
        const rangeInputs = document.getElementById('range-inputs');
        if (rangeInputs) rangeInputs.style.display = 'none';
        
        this.extractionOptions = {
            format: 'plain',
            pages: 'all',
            startPage: 1,
            endPage: null,
            preserveLayout: true,
            includeHeaders: false,
            extractMetadata: false
        };
        
        this.showNotification('Reset complete', 'info');
    }

    showSection(sectionId) {
        this.hideAllSections();
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'block';
        }
    }

    hideAllSections() {
        const sections = ['options-section', 'processing-section', 'results-section'];
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = 'none';
            }
        });
    }

    updateProgress(percentage, status) {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        const processingStatus = document.getElementById('processing-status');
        
        if (progressFill) {
            progressFill.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${Math.round(percentage)}% complete`;
        }
        
        if (processingStatus) {
            processingStatus.textContent = status;
        }
    }

    updateUI() {
        const hasFile = !!this.currentFile;
        
        const extractBtn = document.getElementById('extract-text');
        if (extractBtn) {
            extractBtn.disabled = !hasFile;
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            background: `var(--${type === 'error' ? 'error' : type === 'warning' ? 'warning' : type === 'success' ? 'success' : 'info'}-color)`,
            color: 'white',
            borderRadius: '8px',
            zIndex: '10000',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }            }, 300);
        }, 3000);
    }

    // Utility methods for the converter
    showSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'block';
        }
    }

    hideSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'none';
        }
    }

    updateFileInfo(file, pageCount) {
        const fileNameElement = document.getElementById('file-name');
        const fileSizeElement = document.getElementById('file-size');
        const filePagesElement = document.getElementById('file-pages');
        const fileInfoSection = document.getElementById('file-info');
        
        if (fileNameElement) fileNameElement.textContent = file.name;
        if (fileSizeElement) fileSizeElement.textContent = this.formatFileSize(file.size);
        if (filePagesElement) filePagesElement.textContent = pageCount;
        
        if (fileInfoSection) {
            fileInfoSection.style.display = 'block';
        }
        
        // Update range input limits
        const endPageInput = document.getElementById('end-page');
        if (endPageInput) {
            endPageInput.max = pageCount;
            this.extractionOptions.endPage = pageCount;
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    updateProgress(percentage, message = '') {
        const progressBar = document.querySelector('.progress-bar');
        const progressText = document.querySelector('.progress-text');
        const processingDescription = document.getElementById('processing-description');
        
        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }
        if (progressText) {
            progressText.textContent = Math.round(percentage) + '%';
        }        if (message && processingDescription) {
            processingDescription.textContent = message;
        }
    }

    removeFile() {
        this.currentFile = null;
        this.pdfDocument = null;
        this.extractedText = '';
        
        // Reset file input
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.value = '';
        }
        
        // Hide file info and options sections
        this.hideSection('file-info');
        this.hideSection('options-section');
        this.hideSection('results-section');
        
        this.showNotification('File removed', 'info');
    }

    reset() {
        this.removeFile();
        
        // Reset all options to default
        document.querySelector('input[name="format"][value="plain"]').checked = true;
        document.querySelector('input[name="pages"][value="all"]').checked = true;
        document.getElementById('preserve-layout').checked = true;
        document.getElementById('include-headers').checked = false;
        document.getElementById('extract-metadata').checked = false;
        
        // Hide range inputs
        const rangeInputs = document.getElementById('range-inputs');
        if (rangeInputs) {
            rangeInputs.style.display = 'none';
        }
        
        // Reset extraction options
        this.extractionOptions = {
            format: 'plain',
            pages: 'all',
            startPage: 1,
            endPage: null,
            preserveLayout: true,
            includeHeaders: false,
            extractMetadata: false
        };
    }

    extractTextWithLayout(textContent) {
        // Group text items by their y-coordinate (line)
        const lines = {};
        
        textContent.items.forEach(item => {
            const y = Math.round(item.transform[5]);
            if (!lines[y]) {
                lines[y] = [];
            }
            lines[y].push({
                text: item.str,
                x: item.transform[4],
                width: item.width || 0
            });
        });
        
        // Sort lines by y-coordinate (top to bottom)
        const sortedYCoords = Object.keys(lines).map(Number).sort((a, b) => b - a);
        
        let formattedText = '';
        sortedYCoords.forEach(y => {
            // Sort items in line by x-coordinate (left to right)
            const lineItems = lines[y].sort((a, b) => a.x - b.x);
            
            let lineText = '';
            let lastX = 0;
            
            lineItems.forEach((item, index) => {
                // Add spacing based on x-coordinate difference
                if (index > 0) {
                    const gap = item.x - lastX;
                    if (gap > 20) { // Significant gap, add spaces
                        lineText += '  ';
                    } else if (gap > 5) {
                        lineText += ' ';
                    }
                }
                
                lineText += item.text;
                lastX = item.x + item.width;
            });
            
            if (lineText.trim()) {
                formattedText += lineText.trim() + '\n';
            }
        });
        
        return formattedText;
    }

    async downloadText(format) {
        if (!this.extractedText) {
            this.showNotification('No text to download', 'warning');
            return;
        }
        
        let content = this.extractedText;
        let mimeType = 'text/plain';
        let extension = 'txt';
        
        if (format === 'markdown') {
            extension = 'md';
            mimeType = 'text/markdown';
        } else if (format === 'formatted') {
            extension = 'txt';
            // Keep the formatted text as is
        }
        
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentFile.name.replace('.pdf', '')}_extracted.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Text downloaded successfully!', 'success');
    }

    async copyToClipboard() {
        if (!this.extractedText) {
            this.showNotification('No text to copy', 'warning');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(this.extractedText);
            this.showNotification('Text copied to clipboard!', 'success');
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            
            // Fallback method
            const textArea = document.createElement('textarea');
            textArea.value = this.extractedText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            this.showNotification('Text copied to clipboard!', 'success');
        }
    }
}

// Theme Management
class ThemeManager {
    constructor() {
        this.init();
    }
    
    init() {
        const themeToggle = document.getElementById('theme-toggle');
        const savedTheme = localStorage.getItem('pdf-toolkit-theme') || 'dark';
        
        document.body.classList.add(`${savedTheme}-theme`);
        this.updateThemeIcon(savedTheme);
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
    
    toggleTheme() {
        const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.body.classList.remove(`${currentTheme}-theme`);
        document.body.classList.add(`${newTheme}-theme`);
        
        localStorage.setItem('pdf-toolkit-theme', newTheme);        this.updateThemeIcon(newTheme);
    }
    
    updateThemeIcon(theme) {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            }
        }
    }

    // Utility methods for PDF converter
    showSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'block';
        }
    }

    hideSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'none';
        }
    }

    updateProgress(percentage, message = '') {
        const progressBar = document.querySelector('.progress-bar');
        const progressText = document.querySelector('.progress-text');
        const processingDescription = document.getElementById('processing-description');
        
        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }
        if (progressText) {
            progressText.textContent = Math.round(percentage) + '%';
        }
        if (message && processingDescription) {
            processingDescription.textContent = message;
        }
    }

    showNotification(message, type = 'info') {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'error' ? '#ff4757' : type === 'success' ? '#2ed573' : '#3742fa'};
            color: white;
            border-radius: 5px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new PDFToTextConverter();
});
