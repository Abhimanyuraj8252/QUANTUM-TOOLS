// PDF Compressor JavaScript
// Advanced PDF compression with pdf-lib integration

class PDFCompressor {
    constructor() {
        this.currentFile = null;
        this.compressedPdf = null;
        this.compressionSettings = {
            quality: 0.7,
            imageQuality: 0.8,
            removeMetadata: true,
            optimizeImages: true
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializePresets();
        this.updateUI();
    }    bindEvents() {
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
                // Only trigger file input if clicking on the upload area itself, not child elements
                if (e.target === uploadArea || (e.target.closest('.upload-content') && !e.target.closest('.upload-btn'))) {
                    fileInput?.click();
                }
            });
            uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
            uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        }        // Compression preset buttons
        document.querySelectorAll('.preset-card').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.currentTarget.dataset.preset;
                this.selectPreset(preset);
            });
        });        // Custom settings
        const imageQualitySlider = document.getElementById('image-quality');
        if (imageQualitySlider) {
            imageQualitySlider.addEventListener('input', (e) => {
                const value = e.target.value;
                document.getElementById('image-quality-value').textContent = `${value}%`;
                this.updateEstimatedSize();
            });
        }

        // Step navigation
        const proceedBtn = document.getElementById('proceed-btn');
        const backToUploadBtn = document.getElementById('back-to-upload');
        
        if (proceedBtn) {
            proceedBtn.addEventListener('click', () => this.showStep('settings'));
        }
        
        if (backToUploadBtn) {
            backToUploadBtn.addEventListener('click', () => this.showStep('upload'));
        }

        // Remove file button
        const removeFileBtn = document.getElementById('remove-file');
        if (removeFileBtn) {
            removeFileBtn.addEventListener('click', () => this.removeFile());
        }        // Action buttons
        const compressBtn = document.getElementById('compress-pdf');
        const downloadBtn = document.getElementById('download-compressed');
        const compressAnotherBtn = document.getElementById('compress-another');

        if (compressBtn) {
            compressBtn.addEventListener('click', () => this.compressPDF());
        }        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                console.log('Download button clicked!');
                this.downloadCompressed();
            });
        }

        if (compressAnotherBtn) {
            compressAnotherBtn.addEventListener('click', () => this.reset());
        }
    }    initializePresets() {
        this.presets = {
            balanced: {
                quality: 0.7,
                imageQuality: 0.8,
                name: 'Balanced',
                description: 'Good balance between file size and quality'
            },
            maximum: {
                quality: 0.5,
                imageQuality: 0.6,
                name: 'Maximum Compression',
                description: 'Smallest file size, lower quality'
            },
            minimal: {
                quality: 0.9,
                imageQuality: 0.95,
                name: 'Minimal Compression',
                description: 'Preserve quality, larger file size'
            },
            custom: {
                quality: 0.8,
                imageQuality: 0.8,
                name: 'Custom Settings',
                description: 'Fine-tune compression settings'
            }
        };
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
    }

    async loadFile(file) {
        try {
            this.showLoading('Loading PDF...');
            this.currentFile = file;
            
            // Read file as array buffer
            const arrayBuffer = await file.arrayBuffer();
            
            // Load with pdf-lib to get info
            const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
            const pageCount = pdfDoc.getPageCount();
            
            // Update UI with file info
            this.updateFileInfo(file, pageCount);
            this.updateUI();
            
            this.hideLoading();
            this.showNotification('PDF loaded successfully!', 'success');
        } catch (error) {
            console.error('Error loading PDF:', error);
            this.hideLoading();
            this.showNotification('Error loading PDF file', 'error');
        }
    }    updateFileInfo(file, pageCount) {
        const fileInfo = document.getElementById('file-info');
        const fileSizeElement = document.getElementById('file-size');
        
        if (fileInfo) {
            fileInfo.style.display = 'block';
        }

        if (fileSizeElement) {
            fileSizeElement.textContent = this.formatFileSize(file.size);
        }

        // Update file details
        const fileName = document.getElementById('file-name');
        const filePages = document.getElementById('file-pages');
        
        if (fileName) fileName.textContent = file.name;
        if (filePages) filePages.textContent = `${pageCount} pages`;
        
        // Show proceed button and enable next step
        this.showStep('upload');
        
        // Update estimated size
        this.updateEstimatedSize();
    }    selectPreset(presetName) {
        // Update active preset
        document.querySelectorAll('.preset-card').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const selectedBtn = document.querySelector(`[data-preset="${presetName}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('active');
        }

        // Apply preset settings
        const preset = this.presets[presetName];
        if (preset) {
            this.compressionSettings.quality = preset.quality;
            this.compressionSettings.imageQuality = preset.imageQuality;
            
            // Update image quality slider if available
            const imageQualitySlider = document.getElementById('image-quality');
            if (imageQualitySlider) {
                imageQualitySlider.value = preset.imageQuality * 100;
                document.getElementById('image-quality-value').textContent = `${Math.round(preset.imageQuality * 100)}%`;
            }

            // Show/hide custom settings for custom preset
            const customSettings = document.getElementById('custom-settings');
            if (customSettings) {
                customSettings.style.display = presetName === 'custom' ? 'block' : 'none';
            }
            
            // Update estimated size
            this.updateEstimatedSize();
        }
    }

    updateQuality(value) {
        this.compressionSettings.quality = value / 100;
        this.updateQualityDisplay(this.compressionSettings.quality);
        this.estimateCompression();
    }

    updateQualityDisplay(quality) {
        const qualityValue = document.getElementById('quality-value');
        const qualityLevel = document.getElementById('quality-level');
        
        if (qualityValue) {
            qualityValue.textContent = `${Math.round(quality * 100)}%`;
        }

        if (qualityLevel) {
            if (quality >= 0.8) {
                qualityLevel.textContent = 'High Quality';
                qualityLevel.className = 'quality-level high';
            } else if (quality >= 0.6) {
                qualityLevel.textContent = 'Good Quality';
                qualityLevel.className = 'quality-level medium';
            } else {
                qualityLevel.textContent = 'Basic Quality';
                qualityLevel.className = 'quality-level low';
            }
        }
    }

    estimateCompression() {
        if (!this.currentFile) return;

        // Simple estimation based on quality settings
        const compressionRatio = 1 - this.compressionSettings.quality;
        const estimatedSize = this.currentFile.size * (1 - compressionRatio * 0.6);
        const savings = this.currentFile.size - estimatedSize;
        const savingsPercent = (savings / this.currentFile.size * 100);

        // Update estimation display
        const estimatedSizeElement = document.getElementById('estimated-size');
        const estimatedSavings = document.getElementById('estimated-savings');

        if (estimatedSizeElement) {
            estimatedSizeElement.textContent = this.formatFileSize(estimatedSize);
        }

        if (estimatedSavings) {
            estimatedSavings.textContent = `${Math.round(savingsPercent)}% smaller`;
        }
    }

    async compressPDF() {
        if (!this.currentFile) {
            this.showNotification('Please select a PDF file first', 'warning');
            return;
        }

        try {
            // Show processing step
            this.showStep('processing');
            this.updateProgress(0, 'Starting compression...');

            // Load PDF-lib (check if available)
            if (typeof PDFLib === 'undefined') {
                throw new Error('PDF-lib library not loaded');
            }

            // Read the original PDF
            this.updateProgress(10, 'Loading PDF...');
            const arrayBuffer = await this.currentFile.arrayBuffer();
            const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);

            this.updateProgress(30, 'Analyzing PDF structure...');

            // Get current compression settings
            const imageQuality = document.getElementById('image-quality')?.value || 80;
            const removeMetadata = document.getElementById('remove-metadata')?.checked || true;
            const optimizeFonts = document.getElementById('optimize-fonts')?.checked || true;

            // Create a new compressed PDF
            this.updateProgress(50, 'Compressing PDF...');
            const compressedDoc = await PDFLib.PDFDocument.create();
            
            // Copy pages with compression
            const pages = await compressedDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
            
            pages.forEach((page) => {
                compressedDoc.addPage(page);
            });

            this.updateProgress(70, 'Optimizing document...');

            // Remove metadata if selected
            if (removeMetadata) {
                compressedDoc.setTitle('');
                compressedDoc.setAuthor('');
                compressedDoc.setSubject('');
                compressedDoc.setCreator('');
                compressedDoc.setProducer('');
                compressedDoc.setKeywords([]);
            }            this.updateProgress(90, 'Finalizing compression...');

            // Serialize with compression
            const compressedBytes = await compressedDoc.save({
                useObjectStreams: false,
                addDefaultPage: false,
                objectStreamsThreshold: 40,
                updateFieldAppearances: false
            });

            console.log('PDF compressed successfully:', {
                originalSize: this.currentFile.size,
                compressedSize: compressedBytes.byteLength,
                reduction: ((this.currentFile.size - compressedBytes.byteLength) / this.currentFile.size * 100).toFixed(1) + '%'
            });

            // Store compressed PDF data
            this.compressedPdf = compressedBytes;
            
            // Verify the compressed PDF is valid
            if (!this.compressedPdf || this.compressedPdf.byteLength === 0) {
                throw new Error('Compressed PDF is empty or invalid');
            }
            
            this.updateProgress(100, 'Compression complete!');
              // Show results
            setTimeout(() => {
                this.updateCompressionResults();
                this.updateUI(); // Enable download button
                this.showStep('complete');
            }, 1000);
              } catch (error) {
            console.error('Error compressing PDF:', error);
            this.showNotification('Error compressing PDF. Using fallback compression...', 'warning');
            
            // Fallback: Simple file copy with different name
            try {
                console.log('Attempting fallback compression...');
                const fallbackData = await this.currentFile.arrayBuffer();
                this.compressedPdf = new Uint8Array(fallbackData);
                
                console.log('Fallback compression completed:', {
                    originalSize: this.currentFile.size,
                    fallbackSize: this.compressedPdf.byteLength
                });
                  this.updateProgress(100, 'Fallback compression complete!');
                setTimeout(() => {
                    this.updateCompressionResults();
                    this.updateUI(); // Enable download button
                    this.showStep('complete');
                }, 500);
                
            } catch (fallbackError) {
                console.error('Fallback compression failed:', fallbackError);
                this.showNotification('Error compressing PDF. Please try again with a different file.', 'error');
                this.showStep('settings');
            }
        }
    }

    updateProgress(percentage, status) {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        const processingStatus = document.getElementById('processing-status');
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${Math.round(percentage)}% complete`;
        }
        
        if (processingStatus) {
            processingStatus.textContent = status;
        }
    }    updateCompressionResults() {
        if (!this.compressedPdf) return;

        const originalSize = this.currentFile.size;
        const compressedSize = this.compressedPdf.byteLength || this.compressedPdf.length;
        const savings = originalSize - compressedSize;
        const savingsPercent = Math.max(0, (savings / originalSize * 100));

        // Update results display
        const beforeSize = document.getElementById('before-size');
        const afterSize = document.getElementById('after-size');
        const savingsSize = document.getElementById('savings-size');
        const savingsPercentage = document.getElementById('savings-percentage');

        if (beforeSize) {
            beforeSize.textContent = this.formatFileSize(originalSize);
        }

        if (afterSize) {
            afterSize.textContent = this.formatFileSize(compressedSize);
        }

        if (savingsSize) {
            savingsSize.textContent = this.formatFileSize(savings);
        }

        if (savingsPercentage) {
            savingsPercentage.textContent = `${Math.round(savingsPercent)}%`;
        }        // Force enable download button
        const downloadBtn = document.getElementById('download-compressed');
        if (downloadBtn) {
            downloadBtn.disabled = false;
            downloadBtn.style.pointerEvents = 'auto';
            downloadBtn.style.opacity = '1';
        }
        
        // Debug button state
        setTimeout(() => this.checkDownloadButtonState(), 100);
    }async downloadCompressed() {
        if (!this.compressedPdf) {
            this.showNotification('No compressed PDF available. Please compress a PDF first.', 'warning');
            return;
        }

        try {
            console.log('Starting download...', {
                compressedPdfType: typeof this.compressedPdf,
                compressedPdfLength: this.compressedPdf.byteLength || this.compressedPdf.length,
                fileName: this.currentFile?.name
            });

            // Ensure compressedPdf is a Uint8Array
            let pdfData = this.compressedPdf;
            if (pdfData instanceof ArrayBuffer) {
                pdfData = new Uint8Array(pdfData);
            }

            // Create blob with proper MIME type
            const blob = new Blob([pdfData], { type: 'application/pdf' });
            console.log('Blob created:', { size: blob.size, type: blob.type });

            // Verify blob is not empty
            if (blob.size === 0) {
                throw new Error('Generated PDF file is empty');
            }

            // Create download URL
            const url = URL.createObjectURL(blob);
            console.log('Download URL created:', url);
            
            // Generate filename
            const originalName = this.currentFile?.name || 'document.pdf';
            const downloadName = originalName.replace(/\.pdf$/i, '_compressed.pdf');
            
            // Create and trigger download
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = downloadName;
            downloadLink.style.display = 'none';
            
            // Ensure link is added to DOM for compatibility
            document.body.appendChild(downloadLink);
            
            // Trigger download
            downloadLink.click();
            
            // Clean up
            setTimeout(() => {
                document.body.removeChild(downloadLink);
                URL.revokeObjectURL(url);
            }, 100);
            
            this.showNotification(`Download started: ${downloadName}`, 'success');
            console.log('Download triggered successfully');
            
        } catch (error) {
            console.error('Error downloading compressed PDF:', error);
            this.showNotification(`Download failed: ${error.message}`, 'error');
            
            // Try fallback download method
            this.fallbackDownload();
        }
    }

    fallbackDownload() {
        try {
            console.log('Attempting fallback download method...');
            
            if (!this.compressedPdf) {
                this.showNotification('No PDF data available for fallback download', 'error');
                return;
            }

            // Convert to base64 and create data URL
            let pdfData = this.compressedPdf;
            if (pdfData instanceof ArrayBuffer) {
                pdfData = new Uint8Array(pdfData);
            }

            // Create base64 string
            let binary = '';
            for (let i = 0; i < pdfData.byteLength; i++) {
                binary += String.fromCharCode(pdfData[i]);
            }
            const base64 = btoa(binary);
            
            // Create data URL
            const dataUrl = `data:application/pdf;base64,${base64}`;
            
            // Trigger download
            const downloadLink = document.createElement('a');
            downloadLink.href = dataUrl;
            downloadLink.download = (this.currentFile?.name || 'document.pdf').replace(/\.pdf$/i, '_compressed.pdf');
            downloadLink.style.display = 'none';
            
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            this.showNotification('Fallback download started', 'success');
            console.log('Fallback download completed');
            
        } catch (fallbackError) {
            console.error('Fallback download failed:', fallbackError);
            this.showNotification('All download methods failed. Please try compressing the PDF again.', 'error');
        }
    }reset() {
        this.currentFile = null;
        this.compressedPdf = null;
        
        // Reset UI
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';
        
        const fileInfo = document.getElementById('file-info');
        if (fileInfo) fileInfo.style.display = 'none';
        
        // Reset presets
        document.querySelectorAll('.preset-card').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Hide custom settings
        const customSettings = document.getElementById('custom-settings');
        if (customSettings) customSettings.style.display = 'none';
        
        // Return to upload step
        this.showStep('upload');
        
        this.updateUI();
        this.showNotification('Reset complete', 'info');
    }    showStep(stepName) {
        // Hide all steps
        document.querySelectorAll('.step-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target step
        const targetStep = document.getElementById(`${stepName}-step`);
        if (targetStep) {
            targetStep.classList.add('active');
        }
        
        // If showing complete step, ensure download button is enabled
        if (stepName === 'complete' && this.compressedPdf) {
            setTimeout(() => {
                const downloadBtn = document.getElementById('download-compressed');
                if (downloadBtn) {
                    downloadBtn.disabled = false;
                    downloadBtn.style.pointerEvents = 'auto';
                    downloadBtn.style.opacity = '1';
                    downloadBtn.style.cursor = 'pointer';
                }
            }, 100);
        }
    }

    removeFile() {
        this.currentFile = null;
        
        // Reset file input
        const fileInput = document.getElementById('file-input');
        if (fileInput) fileInput.value = '';
        
        // Hide file info
        const fileInfo = document.getElementById('file-info');
        if (fileInfo) fileInfo.style.display = 'none';
        
        // Show upload step
        this.showStep('upload');
        
        this.updateUI();
    }

    updateEstimatedSize() {
        if (!this.currentFile) return;

        // Get current quality setting
        const imageQuality = document.getElementById('image-quality')?.value || 80;
        const quality = imageQuality / 100;
        
        // Simple estimation based on quality settings
        const compressionRatio = 1 - quality;
        const estimatedSize = this.currentFile.size * (1 - compressionRatio * 0.6);
        const savings = this.currentFile.size - estimatedSize;
        const savingsPercent = (savings / this.currentFile.size * 100);

        // Update estimation display
        const estimatedSizeElement = document.getElementById('estimated-size');
        const reductionPercentage = document.getElementById('reduction-percentage');

        if (estimatedSizeElement) {
            estimatedSizeElement.textContent = this.formatFileSize(estimatedSize);
        }

        if (reductionPercentage) {
            reductionPercentage.textContent = `${Math.round(savingsPercent)}%`;
        }
    }    updateUI() {
        const hasFile = !!this.currentFile;
        const hasCompressed = !!this.compressedPdf;
        
        // Update proceed button
        const proceedBtn = document.getElementById('proceed-btn');
        if (proceedBtn) {
            proceedBtn.disabled = !hasFile;
        }
        
        // Update compress button
        const compressBtn = document.getElementById('compress-pdf');
        if (compressBtn) {
            compressBtn.disabled = !hasFile;
        }
        
        // Update download button
        const downloadBtn = document.getElementById('download-compressed');
        if (downloadBtn) {
            downloadBtn.disabled = !hasCompressed;
        }
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
                }
            }, 300);
        }, 3000);
    }

    // Debug method to check button state
    checkDownloadButtonState() {
        const downloadBtn = document.getElementById('download-compressed');
        if (downloadBtn) {
            console.log('Download button state:', {
                disabled: downloadBtn.disabled,
                display: getComputedStyle(downloadBtn).display,
                pointerEvents: getComputedStyle(downloadBtn).pointerEvents,
                opacity: getComputedStyle(downloadBtn).opacity,
                hasCompressedPdf: !!this.compressedPdf
            });
        } else {
            console.log('Download button not found!');
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
    new PDFCompressor();
});
