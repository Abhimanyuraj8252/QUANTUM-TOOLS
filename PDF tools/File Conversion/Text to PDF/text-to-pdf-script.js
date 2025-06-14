// Text to PDF JavaScript
// Convert text files and direct input to PDF with formatting options

class TextToPDF {
    constructor() {
        this.currentText = '';
        this.settings = {
            pageSize: 'a4',
            orientation: 'portrait',
            fontFamily: 'helvetica',
            fontSize: 12,
            lineHeight: 1.5,
            marginTop: 20,
            marginSides: 20,
            addPageNumbers: false,
            preserveFormatting: false,
            title: '',
            author: ''
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateUI();
        this.initializeSliders();
        
        // Add a global function for debugging
        window.enablePDFButtons = () => {
            const generateBtn = document.getElementById('generate-btn');
            const previewBtn = document.getElementById('preview-btn');
            if (generateBtn) {
                generateBtn.disabled = false;
                generateBtn.removeAttribute('disabled');
                generateBtn.classList.remove('disabled');
                console.log('Generate button force enabled');
            }
            if (previewBtn) {
                previewBtn.disabled = false;
                previewBtn.removeAttribute('disabled');
                previewBtn.classList.remove('disabled');
                console.log('Preview button force enabled');
            }
        };
        
        // Add global function to check current state
        window.checkPDFState = () => {
            console.log('Current state:', {
                currentText: this.currentText,
                textLength: this.currentText.length,
                hasText: this.currentText.trim().length > 0,
                generateBtn: document.getElementById('generate-btn'),
                previewBtn: document.getElementById('preview-btn')
            });
        };
        
        // Add comprehensive test function
        window.testPDFTool = () => {
            console.log('=== PDF Tool Test ===');
            
            // Check elements
            const textContent = document.getElementById('text-content');
            const generateBtn = document.getElementById('generate-btn');
            const previewBtn = document.getElementById('preview-btn');
            
            console.log('Elements found:', {
                textContent: !!textContent,
                generateBtn: !!generateBtn,
                previewBtn: !!previewBtn
            });
            
            if (textContent) {
                // Test with sample text
                textContent.value = 'This is a test text for PDF generation.';
                this.handleTextInput();
                
                console.log('After adding text:', {
                    textValue: textContent.value,
                    currentText: this.currentText,
                    generateBtnDisabled: generateBtn?.disabled,
                    previewBtnDisabled: previewBtn?.disabled
                });
            }
            
            // Test jsPDF availability
            console.log('jsPDF available:', typeof window.jspdf !== 'undefined');
            
            return 'Test completed - check console output above';
        };
        
        // Add jsPDF debugging function
        window.debugJsPDF = () => {
            if (typeof window.jspdf !== 'undefined') {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                console.log('jsPDF methods available:', {
                    setTitle: typeof doc.setTitle,
                    setAuthor: typeof doc.setAuthor,
                    setCreator: typeof doc.setCreator,
                    setSubject: typeof doc.setSubject,
                    setKeywords: typeof doc.setKeywords,
                    save: typeof doc.save,
                    splitTextToSize: typeof doc.splitTextToSize
                });
                return 'jsPDF debug info logged to console';
            } else {
                console.error('jsPDF not loaded');
                return 'jsPDF not available';
            }
        };
        
        // Add file upload test function
        window.testFileUpload = () => {
            console.log('=== File Upload Test ===');
            
            const textContent = document.getElementById('text-content');
            const generateBtn = document.getElementById('generate-btn');
            const previewBtn = document.getElementById('preview-btn');
            
            console.log('Current state before file simulation:', {
                textContentValue: textContent?.value,
                currentText: this.currentText,
                textLength: this.currentText.length,
                hasText: this.currentText.trim().length > 0,
                generateBtnDisabled: generateBtn?.disabled,
                previewBtnDisabled: previewBtn?.disabled
            });
            
            // Simulate file content
            const simulatedFileContent = 'This is simulated file content for testing PDF generation.';
            this.currentText = simulatedFileContent;
            
            if (textContent) {
                textContent.value = simulatedFileContent;
            }
            
            this.updateTextStats();
            this.updateUI();
            
            console.log('State after file simulation:', {
                textContentValue: textContent?.value,
                currentText: this.currentText,
                textLength: this.currentText.length,
                hasText: this.currentText.trim().length > 0,
                generateBtnDisabled: generateBtn?.disabled,
                previewBtnDisabled: previewBtn?.disabled
            });
            
            return 'File upload test completed - check console output above';
        };
    }

    bindEvents() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Text input events
        const textContent = document.getElementById('text-content');
        if (textContent) {
            // Multiple event types to ensure we catch all input changes
            textContent.addEventListener('input', () => this.handleTextInput());
            textContent.addEventListener('keyup', () => this.handleTextInput());
            textContent.addEventListener('change', () => this.handleTextInput());
            textContent.addEventListener('paste', () => {
                setTimeout(() => this.handleTextInput(), 100);
            });
            
            // Initial call to set correct button state
            setTimeout(() => this.handleTextInput(), 100);
        } else {
            console.error('Text content element not found during initialization');
        }

        // File upload events
        const fileInput = document.getElementById('text-file-input');
        const dropZone = document.getElementById('drop-zone');
        const removeFileBtn = document.getElementById('remove-file');

        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }

        if (dropZone) {
            dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
            dropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            dropZone.addEventListener('drop', (e) => this.handleDrop(e));
            dropZone.addEventListener('click', () => fileInput?.click());
        }

        if (removeFileBtn) {
            removeFileBtn.addEventListener('click', () => this.removeFile());
        }

        // Settings events
        this.bindSettingEvents();

        // Action buttons
        const previewBtn = document.getElementById('preview-btn');
        const generateBtn = document.getElementById('generate-btn');
        const resetBtn = document.getElementById('reset-btn');

        if (previewBtn) {
            previewBtn.addEventListener('click', () => this.showPreview());
        }

        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generatePDF());
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.reset());
        }
    }

    bindSettingEvents() {
        // Page settings
        const pageSize = document.getElementById('page-size');
        const orientation = document.getElementById('orientation');
        const fontFamily = document.getElementById('font-family');

        if (pageSize) {
            pageSize.addEventListener('change', (e) => {
                this.settings.pageSize = e.target.value;
                this.updatePreview();
            });
        }

        if (orientation) {
            orientation.addEventListener('change', (e) => {
                this.settings.orientation = e.target.value;
                this.updatePreview();
            });
        }

        if (fontFamily) {
            fontFamily.addEventListener('change', (e) => {
                this.settings.fontFamily = e.target.value;
                this.updatePreview();
            });
        }

        // Sliders
        const fontSize = document.getElementById('font-size');
        const lineHeight = document.getElementById('line-height');
        const marginTop = document.getElementById('margin-top');
        const marginSides = document.getElementById('margin-sides');

        if (fontSize) {
            fontSize.addEventListener('input', (e) => {
                this.settings.fontSize = parseInt(e.target.value);
                this.updateSliderValue('font-size-value', e.target.value + 'pt');
                this.updatePreview();
            });
        }

        if (lineHeight) {
            lineHeight.addEventListener('input', (e) => {
                this.settings.lineHeight = parseFloat(e.target.value);
                this.updateSliderValue('line-height-value', e.target.value);
                this.updatePreview();
            });
        }

        if (marginTop) {
            marginTop.addEventListener('input', (e) => {
                this.settings.marginTop = parseInt(e.target.value);
                this.updateSliderValue('margin-top-value', e.target.value + 'mm');
                this.updatePreview();
            });
        }

        if (marginSides) {
            marginSides.addEventListener('input', (e) => {
                this.settings.marginSides = parseInt(e.target.value);
                this.updateSliderValue('margin-sides-value', e.target.value + 'mm');
                this.updatePreview();
            });
        }

        // Checkboxes
        const addPageNumbers = document.getElementById('add-page-numbers');
        const preserveFormatting = document.getElementById('preserve-formatting');

        if (addPageNumbers) {
            addPageNumbers.addEventListener('change', (e) => {
                this.settings.addPageNumbers = e.target.checked;
                this.updatePreview();
            });
        }

        if (preserveFormatting) {
            preserveFormatting.addEventListener('change', (e) => {
                this.settings.preserveFormatting = e.target.checked;
                this.updatePreview();
            });
        }

        // Document info
        const docTitle = document.getElementById('doc-title');
        const docAuthor = document.getElementById('doc-author');

        if (docTitle) {
            docTitle.addEventListener('input', (e) => {
                this.settings.title = e.target.value;
            });
        }

        if (docAuthor) {
            docAuthor.addEventListener('input', (e) => {
                this.settings.author = e.target.value;
            });
        }
    }

    initializeSliders() {
        this.updateSliderValue('font-size-value', this.settings.fontSize + 'pt');
        this.updateSliderValue('line-height-value', this.settings.lineHeight);
        this.updateSliderValue('margin-top-value', this.settings.marginTop + 'mm');
        this.updateSliderValue('margin-sides-value', this.settings.marginSides + 'mm');
    }

    updateSliderValue(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
    }

    handleTextInput() {
        const textContent = document.getElementById('text-content');
        if (!textContent) {
            console.error('Text content element not found');
            return;
        }

        this.currentText = textContent.value;
        console.log('Text input changed:', { textLength: this.currentText.length, text: this.currentText.substring(0, 50) + '...' });
        
        this.updateTextStats();
        this.updateUI();
        this.updatePreview();
    }

    updateTextStats() {
        const text = this.currentText;
        const charCount = text.length;
        const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
        const lineCount = text.split('\n').length;

        const charCountEl = document.getElementById('char-count');
        const wordCountEl = document.getElementById('word-count');
        const lineCountEl = document.getElementById('line-count');

        if (charCountEl) charCountEl.textContent = `${charCount.toLocaleString()} characters`;
        if (wordCountEl) wordCountEl.textContent = `${wordCount.toLocaleString()} words`;
        if (lineCountEl) lineCountEl.textContent = `${lineCount.toLocaleString()} lines`;
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.loadTextFile(file);
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
            this.loadTextFile(files[0]);
        }
    }

    async loadTextFile(file) {
        try {
            // Check file size (limit to 10MB)
            if (file.size > 10 * 1024 * 1024) {
                this.showNotification('File too large. Please select a file smaller than 10MB.', 'error');
                return;
            }

            // Check file type
            const allowedTypes = ['text/plain', 'text/markdown', 'text/csv', '.txt', '.md', '.csv'];
            const isValidType = allowedTypes.some(type => 
                file.type === type || file.name.toLowerCase().endsWith(type)
            );

            if (!isValidType) {
                this.showNotification('Please select a valid text file (.txt, .md, .csv)', 'error');
                return;
            }            this.showLoading('Loading text file...');

            const text = await file.text();
            this.currentText = text;

            // Update the text content field if it exists
            const textContent = document.getElementById('text-content');
            if (textContent) {
                textContent.value = text;
            }

            // Update file info
            this.updateFileInfo(file);

            // Switch to file upload tab if not already active
            this.switchTab('file-upload');            // Update text statistics
            this.updateTextStats();

            this.hideLoading();
            this.updateUI();
            this.updatePreview();
            
            // Force UI update with slight delay to ensure DOM is ready
            setTimeout(() => {
                this.updateUI();
                console.log('Force UI update after file load completed');
            }, 100);
            
            this.showNotification('Text file loaded successfully!', 'success');

            // Force button state update with debug logging
            console.log('File loaded, forcing UI update:', {
                textLength: this.currentText.length,
                hasText: this.currentText.trim().length > 0
            });

        } catch (error) {
            console.error('Error loading file:', error);
            this.hideLoading();
            this.showNotification('Error loading text file', 'error');
        }
    }

    updateFileInfo(file) {
        const fileInfo = document.getElementById('file-info');
        const fileName = document.getElementById('file-name');
        const fileSize = document.getElementById('file-size');

        if (fileInfo) fileInfo.style.display = 'block';
        if (fileName) fileName.textContent = file.name;
        if (fileSize) fileSize.textContent = this.formatFileSize(file.size);
    }    removeFile() {
        const fileInput = document.getElementById('text-file-input');
        const fileInfo = document.getElementById('file-info');
        const textContent = document.getElementById('text-content');

        if (fileInput) fileInput.value = '';
        if (fileInfo) fileInfo.style.display = 'none';
        if (textContent) textContent.value = '';

        this.currentText = '';
        this.updateTextStats();
        this.updateUI();
        this.hidePreview();
        this.showNotification('File removed', 'info');
    }

    showPreview() {
        if (!this.currentText.trim()) {
            this.showNotification('Please enter some text first', 'warning');
            return;
        }

        const previewSection = document.getElementById('preview-section');
        if (previewSection) {
            previewSection.style.display = 'block';
            this.updatePreview();
            previewSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    hidePreview() {
        const previewSection = document.getElementById('preview-section');
        if (previewSection) {
            previewSection.style.display = 'none';
        }
    }

    updatePreview() {
        if (!this.currentText.trim()) return;

        const previewContent = document.getElementById('preview-content');
        const previewPages = document.getElementById('preview-pages');
        const previewSize = document.getElementById('preview-size');

        if (!previewContent) return;

        // Format text for preview
        let formattedText = this.currentText;
        if (!this.settings.preserveFormatting) {
            formattedText = formattedText.replace(/\n\s*\n/g, '\n\n');
        }

        // Apply basic styling for preview
        previewContent.innerHTML = `
            <div style="
                font-family: ${this.getFontFamily()};
                font-size: ${Math.max(6, this.settings.fontSize * 0.5)}px;
                line-height: ${this.settings.lineHeight};
                white-space: ${this.settings.preserveFormatting ? 'pre-wrap' : 'pre-line'};
            ">
                ${this.escapeHtml(formattedText.substring(0, 500))}${formattedText.length > 500 ? '...' : ''}
            </div>
        `;

        // Estimate pages
        const estimatedPages = Math.ceil(this.currentText.length / 2000); // Rough estimate
        if (previewPages) {
            previewPages.textContent = `${estimatedPages} page(s)`;
        }

        if (previewSize) {
            const sizeText = this.settings.pageSize.toUpperCase() + ' ' + 
                           this.settings.orientation.charAt(0).toUpperCase() + 
                           this.settings.orientation.slice(1);
            previewSize.textContent = sizeText;
        }
    }

    async generatePDF() {
        if (!this.currentText.trim()) {
            this.showNotification('Please enter some text first', 'warning');
            return;
        }

        try {
            this.showLoading('Generating PDF...');

            // Check if jsPDF is available with retry mechanism
            let retryCount = 0;
            const maxRetries = 3;
            
            while (typeof window.jspdf === 'undefined' && retryCount < maxRetries) {
                console.log(`Waiting for jsPDF library... attempt ${retryCount + 1}`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                retryCount++;
            }

            if (typeof window.jspdf === 'undefined') {
                throw new Error('jsPDF library not loaded. Please refresh the page and try again.');
            }

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: this.settings.orientation,
                unit: 'mm',
                format: this.settings.pageSize
            });            // Set document properties with error handling
            try {
                if (this.settings.title) doc.setTitle(this.settings.title);
                if (this.settings.author) doc.setAuthor(this.settings.author);
                // Try setCreator if available
                if (typeof doc.setCreator === 'function') {
                    doc.setCreator('OMNIFORMA PDF Tools - Text to PDF');
                }
            } catch (error) {
                console.warn('Some PDF metadata features not supported:', error.message);
            }

            // Calculate page dimensions in mm (since unit is set to 'mm')
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = this.settings.marginSides; // Use mm directly
            const topMargin = this.settings.marginTop; // Use mm directly
            const contentWidth = pageWidth - (2 * margin);
            const contentHeight = pageHeight - (2 * topMargin);

            // Set font and size
            const fontFamily = this.getFontFamily();
            doc.setFont(fontFamily);
            doc.setFontSize(this.settings.fontSize);

            // Calculate line height in mm (convert from points)
            const lineHeightMm = (this.settings.fontSize * this.settings.lineHeight) * 0.352778; // pt to mm conversion

            // Process text based on formatting preference
            let text = this.currentText;
            if (!this.settings.preserveFormatting) {
                // Clean up extra whitespace while preserving intentional line breaks
                text = text.replace(/\n\s*\n/g, '\n\n').trim();
            }

            // Split text into lines that fit the page width
            const lines = doc.splitTextToSize(text, contentWidth);
            
            let currentY = topMargin;
            let pageNumber = 1;

            // Process each line
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                
                // Check if we need a new page
                if (currentY + lineHeightMm > pageHeight - topMargin - 15) { // Leave space for page numbers
                    // Add page number if enabled
                    if (this.settings.addPageNumbers) {
                        doc.setFontSize(10);
                        doc.text(
                            `Page ${pageNumber}`, 
                            pageWidth / 2, 
                            pageHeight - 10, 
                            { align: 'center' }
                        );
                        doc.setFontSize(this.settings.fontSize);
                    }

                    // Add new page and reset Y position
                    doc.addPage();
                    currentY = topMargin;
                    pageNumber++;
                }

                // Add the text line
                doc.text(line, margin, currentY);
                currentY += lineHeightMm;
            }

            // Add final page number
            if (this.settings.addPageNumbers) {
                doc.setFontSize(10);
                doc.text(
                    `Page ${pageNumber}`, 
                    pageWidth / 2, 
                    pageHeight - 10, 
                    { align: 'center' }
                );
                doc.setFontSize(this.settings.fontSize);
            }

            // Generate filename
            const filename = this.settings.title || 'text-document';
            const sanitizedFilename = filename.replace(/[^a-z0-9\-_.]/gi, '_').toLowerCase();

            // Save the PDF
            doc.save(`${sanitizedFilename}.pdf`);

            this.hideLoading();
            this.showNotification('PDF generated successfully!', 'success');

        } catch (error) {
            console.error('Error generating PDF:', error);
            this.hideLoading();
              // More specific error messages
            let errorMessage = 'Error generating PDF';
            if (error.message.includes('jsPDF library not loaded')) {
                errorMessage = 'PDF library not loaded. Please refresh the page and try again.';
            } else if (error.message.includes('splitTextToSize')) {
                errorMessage = 'Error processing text. Please check your text content.';
            } else if (error.message.includes('save')) {
                errorMessage = 'Error saving PDF file. Please try again.';
            } else if (error.message.includes('setCreator') || error.message.includes('not a function')) {
                errorMessage = 'PDF library compatibility issue. PDF generated without some metadata.';
                // Try to continue without the problematic feature
                console.warn('jsPDF compatibility issue, retrying without advanced features...');
                return this.generateBasicPDF();
            } else {
                errorMessage = `Error generating PDF: ${error.message}`;
            }
            
            this.showNotification(errorMessage, 'error');
        }
    }

    async generateBasicPDF() {
        if (!this.currentText.trim()) {
            this.showNotification('Please enter some text first', 'warning');
            return;
        }

        try {
            this.showLoading('Generating PDF (basic mode)...');

            if (typeof window.jspdf === 'undefined') {
                throw new Error('jsPDF library not loaded. Please refresh the page and try again.');
            }

            const { jsPDF } = window.jspdf;
            
            // Create PDF with minimal configuration
            const doc = new jsPDF({
                orientation: this.settings.orientation,
                unit: 'mm',
                format: this.settings.pageSize
            });

            // Basic document setup without advanced features
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = this.settings.marginSides;
            const topMargin = this.settings.marginTop;
            const contentWidth = pageWidth - (2 * margin);

            // Set basic font
            doc.setFont('helvetica');
            doc.setFontSize(this.settings.fontSize);

            // Calculate basic line height
            const lineHeightMm = (this.settings.fontSize * this.settings.lineHeight) * 0.352778;

            // Process text
            let text = this.currentText;
            if (!this.settings.preserveFormatting) {
                text = text.replace(/\n\s*\n/g, '\n\n').trim();
            }

            // Split text into lines
            const lines = doc.splitTextToSize(text, contentWidth);
            
            let currentY = topMargin;
            let pageNumber = 1;

            // Add text line by line
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                
                // Check if we need a new page
                if (currentY + lineHeightMm > pageHeight - topMargin - 15) {
                    // Add simple page number if enabled
                    if (this.settings.addPageNumbers) {
                        doc.setFontSize(10);
                        doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
                        doc.setFontSize(this.settings.fontSize);
                    }

                    doc.addPage();
                    currentY = topMargin;
                    pageNumber++;
                }

                doc.text(line, margin, currentY);
                currentY += lineHeightMm;
            }

            // Add final page number
            if (this.settings.addPageNumbers) {
                doc.setFontSize(10);
                doc.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
            }

            // Generate filename
            const filename = this.settings.title || 'text-document';
            const sanitizedFilename = filename.replace(/[^a-z0-9\-_.]/gi, '_').toLowerCase();

            // Save the PDF
            doc.save(`${sanitizedFilename}.pdf`);

            this.hideLoading();
            this.showNotification('PDF generated successfully (basic mode)!', 'success');

        } catch (error) {
            console.error('Error in basic PDF generation:', error);
            this.hideLoading();
            this.showNotification('Error generating PDF even in basic mode. Please refresh the page and try again.', 'error');
        }
    }

    getFontFamily() {
        const fontMap = {
            'helvetica': 'helvetica',
            'times': 'times',
            'courier': 'courier'
        };
        return fontMap[this.settings.fontFamily] || 'helvetica';
    }

    mmToPt(mm) {
        return mm * 2.834645669; // 1mm = 2.834645669 points
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    reset() {
        // Clear text content
        this.currentText = '';
        const textContent = document.getElementById('text-content');
        if (textContent) textContent.value = '';

        // Remove file
        this.removeFile();

        // Reset settings to defaults
        this.settings = {
            pageSize: 'a4',
            orientation: 'portrait',
            fontFamily: 'helvetica',
            fontSize: 12,
            lineHeight: 1.5,
            marginTop: 20,
            marginSides: 20,
            addPageNumbers: false,
            preserveFormatting: false,
            title: '',
            author: ''
        };

        // Reset form controls
        const controls = [
            { id: 'page-size', value: 'a4' },
            { id: 'orientation', value: 'portrait' },
            { id: 'font-family', value: 'helvetica' },
            { id: 'font-size', value: 12 },
            { id: 'line-height', value: 1.5 },
            { id: 'margin-top', value: 20 },
            { id: 'margin-sides', value: 20 },
            { id: 'doc-title', value: '' },
            { id: 'doc-author', value: '' }
        ];

        controls.forEach(control => {
            const element = document.getElementById(control.id);
            if (element) element.value = control.value;
        });

        const checkboxes = [
            { id: 'add-page-numbers', checked: false },
            { id: 'preserve-formatting', checked: false }
        ];

        checkboxes.forEach(checkbox => {
            const element = document.getElementById(checkbox.id);
            if (element) element.checked = checkbox.checked;
        });

        // Reset slider displays
        this.initializeSliders();

        // Reset stats
        this.updateTextStats();

        // Hide preview
        this.hidePreview();

        // Switch to text input tab
        this.switchTab('text-input');

        this.updateUI();
        this.showNotification('Reset complete', 'info');
    }

    updateUI() {
        const hasText = this.currentText.trim().length > 0;
        
        const previewBtn = document.getElementById('preview-btn');
        const generateBtn = document.getElementById('generate-btn');

        // Debug logging
        console.log('UpdateUI called:', { hasText, previewBtn: !!previewBtn, generateBtn: !!generateBtn, textLength: this.currentText.length });

        // Actually update button states
        if (previewBtn) {
            previewBtn.disabled = !hasText;
            if (hasText) {
                previewBtn.classList.remove('disabled');
            } else {
                previewBtn.classList.add('disabled');
            }
        }

        if (generateBtn) {
            generateBtn.disabled = !hasText;
            if (hasText) {
                generateBtn.classList.remove('disabled');
            } else {
                generateBtn.classList.add('disabled');
            }
        }

        console.log('Buttons updated:', { 
            previewDisabled: previewBtn?.disabled, 
            generateDisabled: generateBtn?.disabled 
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    showLoading(message) {
        const loader = document.getElementById('loading-overlay');
        const loadingMessage = document.getElementById('loading-message');
        
        if (loadingMessage) loadingMessage.textContent = message;
        if (loader) loader.style.display = 'flex';
    }

    hideLoading() {
        const loader = document.getElementById('loading-overlay');
        if (loader) loader.style.display = 'none';
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
            zIndex: '10001',
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
                }
            }, 300);
        }, 3000);
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
        
        localStorage.setItem('pdf-toolkit-theme', newTheme);
        this.updateThemeIcon(newTheme);
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new TextToPDF();
});
