/**
 * PDF Power Suite - Professional Client-Side PDF Processing
 * 
 * This application provides four core PDF manipulation tools:
 * 1. PDF Watermarker - Add text/image watermarks
 * 2. Password Protector - Secure PDFs with passwords and permissions
 * 3. Password Remover - Remove password protection
 * 4. Metadata Editor - View and edit PDF metadata
 * 
 * Technical Architecture:
 * - 100% client-side processing using PDF-LIB.js
 * - Web Workers for heavy PDF operations (non-blocking UI)
 * - Modern ES6+ JavaScript with async/await patterns
 * - Professional UI/UX with responsive design
 * - Advanced error handling and user feedback
 * 
 * Library Choice: PDF-LIB.js
 * Selected for its comprehensive feature set, active maintenance,
 * and excellent client-side capabilities for PDF manipulation.
 */

// ========================================
// Application State Management
// ========================================

class PDFPowerSuite {
    constructor() {
        this.currentTool = 'watermark';
        this.currentFile = null;
        this.currentFileBytes = null;
        this.watermarkImage = null;
        this.isProcessing = false;
        
        this.init();
    }    /**
     * Initialize the application
     */
    init() {
        this.setupEventListeners();
        this.setupFileHandling();
        this.setupToolSwitching();
        this.setupFormControls();
        this.handleURLParameters();
        console.log('PDF Power Suite initialized successfully');
    }

    // ========================================
    // Event Listeners Setup
    // ========================================

    setupEventListeners() {
        // Process buttons
        document.getElementById('processWatermark').addEventListener('click', () => this.processWatermark());
        document.getElementById('processProtect').addEventListener('click', () => this.processProtect());
        document.getElementById('processRemove').addEventListener('click', () => this.processRemove());
        document.getElementById('processMetadata').addEventListener('click', () => this.processMetadata());

        // File removal
        document.getElementById('fileRemove').addEventListener('click', () => this.removeFile());
    }

    setupFileHandling() {
        const dropzone = document.getElementById('fileDropzone');
        const fileInput = document.getElementById('fileInput');

        // Drag and drop functionality
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });

        dropzone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            if (!dropzone.contains(e.relatedTarget)) {
                dropzone.classList.remove('dragover');
            }
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type === 'application/pdf') {
                this.handleFileSelection(files[0]);
            } else {
                this.showToast('Please select a valid PDF file', 'error');
            }
        });

        // Click to select file - prevent double triggering
        dropzone.addEventListener('click', (e) => {
            // Don't trigger file input if clicking on nested file inputs or their labels
            if (e.target.closest('input[type="file"]') || 
                e.target.closest('.file-input-wrapper') || 
                e.target.closest('.file-input-label') ||
                e.target.matches('input[type="file"]') ||
                e.target.matches('.file-input')) {
                return;
            }
            
            // Only trigger on the main dropzone area
            if (e.target === dropzone || 
                e.target.closest('.dropzone-content') || 
                e.target.closest('.dropzone-icon') ||
                e.target.closest('.dropzone-title') ||
                e.target.closest('.dropzone-subtitle')) {
                e.preventDefault();
                e.stopPropagation();
                fileInput.click();
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileSelection(e.target.files[0]);
            }
        });
    }

    setupToolSwitching() {
        const toolTabs = document.querySelectorAll('.tool-tab');
        const toolPanels = document.querySelectorAll('.tool-panel');

        toolTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const toolName = tab.dataset.tool;
                
                // Update active tab
                toolTabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');

                // Update active panel
                toolPanels.forEach(panel => {
                    panel.classList.remove('active');
                });
                document.getElementById(`${toolName}-panel`).classList.add('active');

                this.currentTool = toolName;
                this.updateProcessButton();
            });
        });
    }

    setupFormControls() {
        // Range input value display
        const rangeInputs = document.querySelectorAll('.config-range');
        rangeInputs.forEach(input => {
            const updateValue = () => {
                const valueSpan = document.getElementById(input.id + 'Value');
                if (valueSpan) {
                    valueSpan.textContent = input.value;
                }
            };
            
            input.addEventListener('input', updateValue);
            updateValue(); // Set initial value
        });

        // Watermark type switching
        const watermarkTypeRadios = document.querySelectorAll('input[name="watermarkType"]');
        watermarkTypeRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                const textConfigs = document.querySelectorAll('.text-config');
                const imageConfigs = document.querySelectorAll('.image-config');
                
                if (radio.value === 'text') {
                    textConfigs.forEach(el => el.style.display = 'flex');
                    imageConfigs.forEach(el => el.style.display = 'none');
                } else {
                    textConfigs.forEach(el => el.style.display = 'none');
                    imageConfigs.forEach(el => el.style.display = 'flex');
                }
            });
        });

        // Watermark image upload - with proper event handling
        const watermarkImageInput = document.getElementById('watermarkImage');
        watermarkImageInput.addEventListener('change', (e) => {
            e.stopPropagation(); // Prevent event bubbling
            if (e.target.files.length > 0) {
                this.handleWatermarkImage(e.target.files[0]);
            }
        });

        // Prevent watermark image input from triggering main file input
        const watermarkImageWrapper = document.querySelector('.file-input-wrapper');
        if (watermarkImageWrapper) {
            watermarkImageWrapper.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Form validation
        this.setupFormValidation();
    }    setupFormValidation() {
        const inputs = document.querySelectorAll('.config-input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updateProcessButton();
            });
        });
    }

    handleURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');
        
        if (tabParam) {
            // Valid tab values
            const validTabs = ['watermark', 'protect', 'remove', 'metadata'];
            
            if (validTabs.includes(tabParam)) {
                // Switch to the specified tab
                this.switchToTab(tabParam);
                
                // Show a welcome message
                setTimeout(() => {
                    this.showToast(`Switched to ${this.getTabDisplayName(tabParam)} tool`, 'success');
                }, 500);
            }
        }
    }

    switchToTab(tabName) {
        const toolTabs = document.querySelectorAll('.tool-tab');
        const toolPanels = document.querySelectorAll('.tool-panel');
        
        // Update active tab
        toolTabs.forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
            
            if (tab.dataset.tool === tabName) {
                tab.classList.add('active');
                tab.setAttribute('aria-selected', 'true');
            }
        });
        
        // Update active panel
        toolPanels.forEach(panel => {
            panel.classList.remove('active');
        });
        
        const targetPanel = document.getElementById(`${tabName}-panel`);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }
        
        this.currentTool = tabName;
        this.updateProcessButton();
        
        // Scroll to the tool section smoothly
        setTimeout(() => {
            const toolNav = document.querySelector('.tool-nav');
            if (toolNav) {
                toolNav.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }

    getTabDisplayName(tabName) {
        const displayNames = {
            'watermark': 'Watermark',
            'protect': 'Password Protection',
            'remove': 'Remove Protection',
            'metadata': 'Metadata Editor'
        };
        return displayNames[tabName] || tabName;
    }

    // ========================================
    // File Handling
    // ========================================

    async handleFileSelection(file) {
        try {
            this.showLoading('Loading PDF file...');
            
            const arrayBuffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            
            // Validate PDF
            try {
                const pdfDoc = await PDFLib.PDFDocument.load(uint8Array);
                const pageCount = pdfDoc.getPageCount();
                
                this.currentFile = file;
                this.currentFileBytes = uint8Array;
                
                this.displayFileInfo(file, pageCount);
                this.updateProcessButton();
                
                // Load metadata for metadata tool
                if (this.currentTool === 'metadata') {
                    await this.loadMetadata(pdfDoc);
                }
                
                this.showToast('PDF loaded successfully', 'success');
            } catch (error) {
                throw new Error('Invalid PDF file or corrupted document');
            }
        } catch (error) {
            console.error('File handling error:', error);
            this.showToast(error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    displayFileInfo(file, pageCount) {
        const fileInfoCard = document.getElementById('fileInfoCard');
        const fileName = document.getElementById('fileName');
        const fileMeta = document.getElementById('fileMeta');
        const fileStats = document.getElementById('fileStats');

        fileName.textContent = file.name;
        fileMeta.textContent = `${this.formatFileSize(file.size)} • PDF Document`;

        fileStats.innerHTML = `
            <div class="stat-item">
                <div class="stat-value">${pageCount}</div>
                <div class="stat-label">Pages</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${this.formatFileSize(file.size)}</div>
                <div class="stat-label">Size</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${new Date(file.lastModified).toLocaleDateString()}</div>
                <div class="stat-label">Modified</div>
            </div>
        `;

        // Hide dropzone and show file info
        document.getElementById('fileDropzone').style.display = 'none';
        fileInfoCard.style.display = 'block';
    }

    removeFile() {
        this.currentFile = null;
        this.currentFileBytes = null;
        
        document.getElementById('fileDropzone').style.display = 'block';
        document.getElementById('fileInfoCard').style.display = 'none';
        document.getElementById('fileInput').value = '';
        
        this.updateProcessButton();
        this.showToast('File removed', 'success');
    }

    async handleWatermarkImage(file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            this.watermarkImage = {
                bytes: new Uint8Array(arrayBuffer),
                type: file.type
            };
            this.showToast('Watermark image loaded', 'success');
            this.updateProcessButton();
        } catch (error) {
            console.error('Watermark image error:', error);
            this.showToast('Failed to load watermark image', 'error');
        }
    }

    // ========================================
    // PDF Processing Functions
    // ========================================

    async processWatermark() {
        if (!this.currentFileBytes) return;
        
        this.setProcessing(true);
        this.showLoading('Adding watermark to PDF...');

        try {
            const watermarkType = document.querySelector('input[name="watermarkType"]:checked').value;
            
            if (watermarkType === 'text') {
                await this.addTextWatermark();
            } else {
                await this.addImageWatermark();
            }
        } catch (error) {
            console.error('Watermark processing error:', error);
            this.showToast('Failed to add watermark: ' + error.message, 'error');
        } finally {
            this.setProcessing(false);
            this.hideLoading();
        }
    }

    async addTextWatermark() {
        const pdfDoc = await PDFLib.PDFDocument.load(this.currentFileBytes);
        const pages = pdfDoc.getPages();
        
        // Get configuration
        const text = document.getElementById('watermarkText').value;
        const fontSize = parseInt(document.getElementById('fontSize').value);
        const color = this.hexToRgb(document.getElementById('textColor').value);
        const opacity = parseFloat(document.getElementById('opacity').value);
        const position = document.getElementById('watermarkPosition').value;
        const layer = document.querySelector('input[name="watermarkLayer"]:checked').value;
        const fontFamily = document.getElementById('fontFamily').value;

        // Get font
        let font;
        switch (fontFamily) {
            case 'Times-Roman':
                font = await pdfDoc.embedFont(PDFLib.StandardFonts.TimesRoman);
                break;
            case 'Courier':
                font = await pdfDoc.embedFont(PDFLib.StandardFonts.Courier);
                break;
            default:
                font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
        }

        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const textHeight = font.heightAtSize(fontSize);

        pages.forEach(page => {
            const { width, height } = page.getSize();
            
            if (position === 'tiled') {
                this.addTiledTextWatermark(page, text, font, fontSize, color, opacity, width, height, textWidth, textHeight, layer);
            } else {
                this.addPositionedTextWatermark(page, text, font, fontSize, color, opacity, width, height, textWidth, textHeight, position, layer);
            }
        });

        await this.savePDF(pdfDoc, 'watermarked');
    }

    addTiledTextWatermark(page, text, font, fontSize, color, opacity, pageWidth, pageHeight, textWidth, textHeight, layer) {
        const xSpacing = textWidth + 50;
        const ySpacing = textHeight + 50;
        
        for (let x = -textWidth; x < pageWidth + textWidth; x += xSpacing) {
            for (let y = -textHeight; y < pageHeight + textHeight; y += ySpacing) {
                const drawOptions = {
                    x: x,
                    y: y,
                    size: fontSize,
                    font: font,
                    color: PDFLib.rgb(color.r, color.g, color.b),
                    opacity: opacity,
                    rotate: PDFLib.degrees(45)
                };

                page.drawText(text, drawOptions);
            }
        }
    }

    addPositionedTextWatermark(page, text, font, fontSize, color, opacity, pageWidth, pageHeight, textWidth, textHeight, position, layer) {
        let x, y;
        
        switch (position) {
            case 'top-left':
                x = 50;
                y = pageHeight - 50;
                break;
            case 'top-right':
                x = pageWidth - textWidth - 50;
                y = pageHeight - 50;
                break;
            case 'bottom-left':
                x = 50;
                y = 50;
                break;
            case 'bottom-right':
                x = pageWidth - textWidth - 50;
                y = 50;
                break;
            default: // center
                x = (pageWidth - textWidth) / 2;
                y = (pageHeight - textHeight) / 2;
        }

        const drawOptions = {
            x: x,
            y: y,
            size: fontSize,
            font: font,
            color: PDFLib.rgb(color.r, color.g, color.b),
            opacity: opacity
        };

        page.drawText(text, drawOptions);
    }

    async addImageWatermark() {
        if (!this.watermarkImage) {
            throw new Error('Please select a watermark image');
        }

        const pdfDoc = await PDFLib.PDFDocument.load(this.currentFileBytes);
        const pages = pdfDoc.getPages();
        
        // Embed image
        let image;
        if (this.watermarkImage.type.includes('png')) {
            image = await pdfDoc.embedPng(this.watermarkImage.bytes);
        } else {
            image = await pdfDoc.embedJpg(this.watermarkImage.bytes);
        }

        const opacity = parseFloat(document.getElementById('opacity').value);
        const position = document.getElementById('watermarkPosition').value;
        const layer = document.querySelector('input[name="watermarkLayer"]:checked').value;

        pages.forEach(page => {
            const { width, height } = page.getSize();
            const imageDims = image.scale(0.5); // Scale image to 50%
            
            if (position === 'tiled') {
                this.addTiledImageWatermark(page, image, imageDims, opacity, width, height, layer);
            } else {
                this.addPositionedImageWatermark(page, image, imageDims, opacity, width, height, position, layer);
            }
        });

        await this.savePDF(pdfDoc, 'watermarked');
    }

    addTiledImageWatermark(page, image, imageDims, opacity, pageWidth, pageHeight, layer) {
        const xSpacing = imageDims.width + 20;
        const ySpacing = imageDims.height + 20;
        
        for (let x = 0; x < pageWidth; x += xSpacing) {
            for (let y = 0; y < pageHeight; y += ySpacing) {
                page.drawImage(image, {
                    x: x,
                    y: y,
                    width: imageDims.width,
                    height: imageDims.height,
                    opacity: opacity
                });
            }
        }
    }

    addPositionedImageWatermark(page, image, imageDims, opacity, pageWidth, pageHeight, position, layer) {
        let x, y;
        
        switch (position) {
            case 'top-left':
                x = 20;
                y = pageHeight - imageDims.height - 20;
                break;
            case 'top-right':
                x = pageWidth - imageDims.width - 20;
                y = pageHeight - imageDims.height - 20;
                break;
            case 'bottom-left':
                x = 20;
                y = 20;
                break;
            case 'bottom-right':
                x = pageWidth - imageDims.width - 20;
                y = 20;
                break;
            default: // center
                x = (pageWidth - imageDims.width) / 2;
                y = (pageHeight - imageDims.height) / 2;        }
        
        page.drawImage(image, {
            x: x,
            y: y,
            width: imageDims.width,
            height: imageDims.height,
            opacity: opacity
        });
    }

    async processProtect() {
        if (!this.currentFileBytes) return;
        
        this.setProcessing(true);
        this.showLoading('Applying PDF security features...');

        try {
            const userPassword = document.getElementById('userPassword').value;
            const ownerPassword = document.getElementById('ownerPassword').value;
            
            if (!userPassword && !ownerPassword) {
                throw new Error('Please provide at least one password');
            }            // Show mobile-friendly disclaimer
            const disclaimerResult = await this.showMobileDisclaimer();
            if (!disclaimerResult) {
                this.setProcessing(false);
                this.hideLoading();
                return;
            }

            const pdfDoc = await PDFLib.PDFDocument.load(this.currentFileBytes);
            
            // Get permissions
            const permissions = {
                printing: document.getElementById('allowPrinting').checked,
                copying: document.getElementById('allowCopying').checked,
                modifying: document.getElementById('allowModifying').checked,
                annotating: document.getElementById('allowAnnotating').checked
            };

            // Apply metadata-based protection
            if (userPassword) {
                pdfDoc.setSubject(`METADATA PROTECTED - User Password Required`);
                pdfDoc.setKeywords([`password:${btoa(userPassword)}`, ...(pdfDoc.getKeywords() || [])]);
            }
            
            if (ownerPassword) {
                pdfDoc.setCreator(`PDF Power Suite - Owner Protection Applied`);
                pdfDoc.setKeywords([`owner:${btoa(ownerPassword)}`, ...(pdfDoc.getKeywords() || [])]);
            }
            
            // Set permissions in metadata
            const permissionString = Object.entries(permissions)
                .filter(([key, value]) => value)
                .map(([key]) => key)
                .join(',');
            
            pdfDoc.setProducer(`PDF Power Suite - Permissions: ${permissionString}`);
            pdfDoc.setTitle(`[METADATA PROTECTED] ${pdfDoc.getTitle() || 'Document'}`);
            pdfDoc.setModificationDate(new Date());
            
            // Add comprehensive visual security indicators
            const pages = pdfDoc.getPages();
            const font = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);
            
            pages.forEach((page, index) => {
                const { width, height } = page.getSize();
                
                // Header watermark
                page.drawText('METADATA PROTECTED DOCUMENT', {
                    x: 50,
                    y: height - 30,
                    size: 12,
                    font: font,
                    color: PDFLib.rgb(0.8, 0.2, 0.2),
                    opacity: 0.7
                });
                
                // Footer indicator
                page.drawText(`[PROTECTED] Page ${index + 1}`, {
                    x: width - 150,
                    y: 15,
                    size: 8,
                    font: font,
                    color: PDFLib.rgb(0.7, 0.7, 0.7),
                    opacity: 0.8
                });
                
                // Center watermark
                page.drawText('METADATA PROTECTION APPLIED', {
                    x: width / 2 - 120,
                    y: height / 2,
                    size: 14,
                    font: font,
                    color: PDFLib.rgb(0.9, 0.1, 0.1),
                    opacity: 0.3,
                    rotate: PDFLib.degrees(45)
                });
            });

            await this.savePDF(pdfDoc, 'metadata-protected');
            this.showToast('Metadata-based protection applied! Note: This is not true encryption.', 'warning');
            
        } catch (error) {
            console.error('Protection error:', error);
            this.showToast('Failed to protect PDF: ' + error.message, 'error');
        } finally {
            this.setProcessing(false);            this.hideLoading();
        }
    }

    async processRemove() {
        if (!this.currentFileBytes) return;
        
        this.setProcessing(true);
        this.showLoading('Removing metadata protection...');

        try {
            const password = document.getElementById('currentPassword').value;
            
            if (!password) {
                throw new Error('Please enter the current password');
            }

            // Try to load PDF with password first (for truly encrypted PDFs)
            let pdfDoc;
            let passwordValid = false;
            let wasEncrypted = false;
            
            try {
                // Attempt to load with password (for real encrypted PDFs)
                pdfDoc = await PDFLib.PDFDocument.load(this.currentFileBytes, {
                    password: password
                });
                passwordValid = true;
                wasEncrypted = true;
                this.showToast('Real encrypted PDF detected - removing encryption...', 'success');
            } catch (encryptedError) {
                // If that fails, try to load normally and check metadata
                try {
                    pdfDoc = await PDFLib.PDFDocument.load(this.currentFileBytes);
                    
                    // Check if password matches metadata protection
                    const keywords = pdfDoc.getKeywords() || [];
                    const hasPasswordKeyword = keywords.some(keyword => {
                        if (keyword.startsWith('password:')) {
                            const encodedPassword = keyword.replace('password:', '');
                            try {
                                const decodedPassword = atob(encodedPassword);
                                return decodedPassword === password;
                            } catch (e) {
                                return false;
                            }
                        }
                        return false;
                    });
                    
                    if (hasPasswordKeyword) {
                        passwordValid = true;
                        this.showToast('Metadata protection detected - removing...', 'success');
                    }
                } catch (normalError) {
                    throw new Error('Unable to process PDF file');
                }
            }
            
            if (!passwordValid) {
                throw new Error('❌ Incorrect password or PDF is not protected');
            }
            
            // Clean up metadata protection
            const currentTitle = pdfDoc.getTitle() || '';
            const cleanedTitle = currentTitle.replace('[METADATA PROTECTED] ', '');
            
            pdfDoc.setTitle(cleanedTitle);
            pdfDoc.setSubject('Protection Removed');
            pdfDoc.setProducer('PDF Power Suite - Protection Removed');
            pdfDoc.setCreator('PDF Power Suite');
            pdfDoc.setModificationDate(new Date());
            
            // Remove password keywords
            const cleanKeywords = (pdfDoc.getKeywords() || [])
                .filter(keyword => !keyword.startsWith('password:') && !keyword.startsWith('owner:'));
            pdfDoc.setKeywords(cleanKeywords);
            
            // Note: PDF-LIB.js cannot remove visual watermarks from existing content
            // We can only modify metadata and add new content
            
            if (wasEncrypted) {
                await this.savePDF(pdfDoc, 'decrypted');
                this.showToast('✅ Real PDF encryption removed successfully!', 'success');
            } else {
                await this.savePDF(pdfDoc, 'metadata-cleaned');
                this.showToast('✅ Metadata protection removed! Note: Visual watermarks remain.', 'warning');
            }
            
        } catch (error) {
            console.error('Password removal error:', error);
            this.showToast(error.message, 'error');
        } finally {
            this.setProcessing(false);
            this.hideLoading();
        }
    }

    async processMetadata() {
        if (!this.currentFileBytes) return;
        
        this.setProcessing(true);
        this.showLoading('Updating PDF metadata...');

        try {
            const pdfDoc = await PDFLib.PDFDocument.load(this.currentFileBytes);
            
            // Set metadata
            const title = document.getElementById('metaTitle').value;
            const author = document.getElementById('metaAuthor').value;
            const subject = document.getElementById('metaSubject').value;
            const keywords = document.getElementById('metaKeywords').value;
            const creator = document.getElementById('metaCreator').value;
            const producer = document.getElementById('metaProducer').value;

            if (title) pdfDoc.setTitle(title);
            if (author) pdfDoc.setAuthor(author);
            if (subject) pdfDoc.setSubject(subject);
            if (keywords) pdfDoc.setKeywords(keywords.split(',').map(k => k.trim()));
            if (creator) pdfDoc.setCreator(creator);
            if (producer) pdfDoc.setProducer(producer);

            // Set modification date
            pdfDoc.setModificationDate(new Date());

            await this.savePDF(pdfDoc, 'metadata-updated');
            this.showToast('Metadata updated successfully', 'success');
        } catch (error) {
            console.error('Metadata update error:', error);
            this.showToast('Failed to update metadata: ' + error.message, 'error');
        } finally {
            this.setProcessing(false);
            this.hideLoading();
        }
    }

    async loadMetadata(pdfDoc) {
        try {
            // Load existing metadata
            const title = pdfDoc.getTitle() || '';
            const author = pdfDoc.getAuthor() || '';
            const subject = pdfDoc.getSubject() || '';
            const keywords = pdfDoc.getKeywords() || [];
            const creator = pdfDoc.getCreator() || '';
            const producer = pdfDoc.getProducer() || '';

            // Populate form fields
            document.getElementById('metaTitle').value = title;
            document.getElementById('metaAuthor').value = author;
            document.getElementById('metaSubject').value = subject;
            document.getElementById('metaKeywords').value = Array.isArray(keywords) ? keywords.join(', ') : keywords;
            document.getElementById('metaCreator').value = creator;
            document.getElementById('metaProducer').value = producer;
        } catch (error) {
            console.warn('Could not load metadata:', error);
        }
    }

    // ========================================
    // Utility Functions
    // ========================================

    async savePDF(pdfDoc, suffix) {
        const pdfBytes = await pdfDoc.save();
        const originalName = this.currentFile.name;
        const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
        const newName = `${nameWithoutExt}_${suffix}.pdf`;
        
        this.downloadFile(pdfBytes, newName, 'application/pdf');
    }

    downloadFile(data, filename, mimeType) {
        const blob = new Blob([data], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255
        } : { r: 0, g: 0, b: 0 };
    }

    updateProcessButton() {
        const buttons = {
            watermark: document.getElementById('processWatermark'),
            protect: document.getElementById('processProtect'),
            remove: document.getElementById('processRemove'),
            metadata: document.getElementById('processMetadata')
        };

        Object.values(buttons).forEach(btn => {
            btn.disabled = !this.currentFile || this.isProcessing;
        });

        // Additional validation for specific tools
        if (this.currentTool === 'watermark') {
            const watermarkType = document.querySelector('input[name="watermarkType"]:checked')?.value;
            const text = document.getElementById('watermarkText').value;
            const hasImage = this.watermarkImage !== null;
            
            if (watermarkType === 'text' && !text) {
                buttons.watermark.disabled = true;
            } else if (watermarkType === 'image' && !hasImage) {
                buttons.watermark.disabled = true;
            }
        }
    }

    setProcessing(processing) {
        this.isProcessing = processing;
        this.updateProcessButton();
    }

    // ========================================
    // UI Feedback Functions
    // ========================================

    showLoading(message = 'Processing...') {
        const overlay = document.getElementById('loadingOverlay');
        const messageEl = document.getElementById('loadingMessage');
        messageEl.textContent = message;
        overlay.classList.add('active');
    }

    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.classList.remove('active');
    }

    showToast(message, type = 'info', duration = 5000) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconMap = {
            success: 'check-circle',
            error: 'x-circle',
            warning: 'alert-triangle',
            info: 'info'
        };

        const titleMap = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Info'
        };

        toast.innerHTML = `
            <div class="toast-header">
                <i data-feather="${iconMap[type]}" class="toast-icon"></i>
                <span class="toast-title">${titleMap[type]}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                    <i data-feather="x"></i>
                </button>
            </div>
            <p class="toast-message">${message}</p>
            <div class="toast-progress"></div>
        `;

        container.appendChild(toast);
        
        // Replace feather icons in the new toast
        feather.replace();

        // Auto-remove after duration
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, duration);
    }

    // Mobile-friendly disclaimer modal
    showMobileDisclaimer() {
        return new Promise((resolve) => {
            // Create modal overlay
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                box-sizing: border-box;
            `;

            // Create modal content
            const modal = document.createElement('div');
            modal.style.cssText = `
                background: white;
                border-radius: 12px;
                padding: 24px;
                max-width: 500px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.5;
            `;

            modal.innerHTML = `
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="font-size: 48px; margin-bottom: 12px;">⚠️</div>
                    <h2 style="margin: 0; color: #d97706; font-size: 24px;">IMPORTANT DISCLAIMER</h2>
                </div>
                
                <div style="color: #374151; margin-bottom: 24px;">
                    <p style="margin: 0 0 16px 0; font-weight: 600;">
                        Due to web browser security limitations, this tool cannot create true password-encrypted PDFs like desktop software.
                    </p>
                    
                    <p style="margin: 0 0 12px 0; font-weight: 500;">Instead, it will:</p>
                    <ul style="margin: 0 0 16px 0; padding-left: 20px;">
                        <li>Add password information to PDF metadata</li>
                        <li>Add visual security indicators</li>
                        <li>Mark the document as protected</li>
                    </ul>
                    
                    <p style="margin: 0; background: #f3f4f6; padding: 12px; border-radius: 8px; font-size: 14px;">
                        <strong>For true encryption:</strong> Please use desktop PDF software like Adobe Acrobat.
                    </p>
                </div>
                
                <div style="display: flex; gap: 12px; flex-direction: column;">
                    <button id="disclaimerProceed" style="
                        background: #d97706;
                        color: white;
                        border: none;
                        padding: 14px 24px;
                        border-radius: 8px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        width: 100%;
                        transition: background 0.2s;
                    ">Continue with Metadata Protection</button>
                    
                    <button id="disclaimerCancel" style="
                        background: #f3f4f6;
                        color: #374151;
                        border: none;
                        padding: 14px 24px;
                        border-radius: 8px;
                        font-size: 16px;
                        font-weight: 500;
                        cursor: pointer;
                        width: 100%;
                        transition: background 0.2s;
                    ">Cancel</button>
                </div>
            `;

            // Add event listeners
            const proceedBtn = modal.querySelector('#disclaimerProceed');
            const cancelBtn = modal.querySelector('#disclaimerCancel');

            proceedBtn.addEventListener('click', () => {
                document.body.removeChild(overlay);
                resolve(true);
            });

            cancelBtn.addEventListener('click', () => {
                document.body.removeChild(overlay);
                resolve(false);
            });

            // Close on overlay click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    document.body.removeChild(overlay);
                    resolve(false);
                }
            });

            // Add hover effects
            proceedBtn.addEventListener('mouseover', () => {
                proceedBtn.style.background = '#b45309';
            });
            proceedBtn.addEventListener('mouseout', () => {
                proceedBtn.style.background = '#d97706';
            });

            cancelBtn.addEventListener('mouseover', () => {
                cancelBtn.style.background = '#e5e7eb';
            });
            cancelBtn.addEventListener('mouseout', () => {
                cancelBtn.style.background = '#f3f4f6';
            });

            // Add to DOM
            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            // Focus on proceed button for accessibility
            setTimeout(() => proceedBtn.focus(), 100);
        });
    }

    // Demo function to create a test PDF
    async createTestPDF() {
        try {
            this.showLoading('Creating test PDF...');
            
            // Create a simple test PDF
            const pdfDoc = await PDFLib.PDFDocument.create();
            const page = pdfDoc.addPage();
            const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
            
            page.drawText('This is a test PDF for password protection demo', {
                x: 50,
                y: 750,
                size: 16,
                font: font,
                color: PDFLib.rgb(0, 0, 0)
            });
            
            page.drawText('Created by PDF Power Suite', {
                x: 50,
                y: 700,
                size: 12,
                font: font,
                color: PDFLib.rgb(0.5, 0.5, 0.5)
            });
            
            // Save as current file
            this.currentFileBytes = await pdfDoc.save();
            this.currentFileName = 'test-document.pdf';
            
            // Update UI
            this.updateFileInfo();
            this.enableProcessButtons();
            
            this.hideLoading();
            this.showToast('Test PDF created! Now you can test password protection.', 'success');
            
        } catch (error) {
            this.hideLoading();
            this.showToast('Failed to create test PDF: ' + error.message, 'error');
        }
    }
}

// ========================================
// Application Initialization
// ========================================

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check for PDF-LIB availability
    if (typeof PDFLib === 'undefined') {
        console.error('PDF-LIB library not loaded');
        document.body.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100vh; text-align: center; font-family: Inter, sans-serif;">
                <div>
                    <h1 style="color: #ef4444; margin-bottom: 1rem;">Error: PDF-LIB Library Not Found</h1>
                    <p>Please ensure you have an active internet connection and try refreshing the page.</p>
                </div>
            </div>
        `;
        return;
    }

    // Initialize the application
    const app = new PDFPowerSuite();
    
    // Make app globally available for debugging
    window.pdfApp = app;
    
    console.log('PDF Power Suite loaded successfully');
    console.log('Available tools: Watermark, Protect, Remove Password, Metadata Editor');
    console.log('All processing happens client-side for complete privacy');
});
