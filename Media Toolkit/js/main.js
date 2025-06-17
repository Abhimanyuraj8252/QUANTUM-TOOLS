/**
 * Media Toolkit - Advanced Client-Side Image & Media Tools
 * A comprehensive suite of tools for image and media manipulation
 * Built with vanilla JavaScript ES6+ for optimal performance
 */

'use strict';

// ===================================
// UTILITY FUNCTIONS & HELPERS
// ===================================

const Utils = {
    /**
     * Format file size to human readable format
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    /**
     * Convert size to bytes based on unit
     */
    convertToBytes(size, unit) {
        const multipliers = {
            'bytes': 1,
            'kb': 1024,
            'mb': 1024 * 1024
        };
        return size * (multipliers[unit] || 1);
    },

    /**
     * Create a download link for a blob/canvas
     */
    downloadFile(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    },

    /**
     * Show loading spinner
     */
    showLoading() {
        document.getElementById('loading-spinner').classList.add('show');
    },

    /**
     * Hide loading spinner
     */
    hideLoading() {
        document.getElementById('loading-spinner').classList.remove('show');
    },

    /**
     * Copy text to clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('Copied to clipboard!', 'success');
        } catch (err) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showNotification('Copied to clipboard!', 'success');
        }
    },

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-weight: 500;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    },

    /**
     * Format time for media player
     */
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
};

// ===================================
// TAB NAVIGATION SYSTEM
// ===================================

class TabManager {
    constructor() {
        this.activeTab = 'compressor';
        this.init();
    }

    init() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const toolSections = document.querySelectorAll('.tool-section');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                this.switchTab(tabId);
            });
        });
    }

    switchTab(tabId) {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Update active section
        document.querySelectorAll('.tool-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');

        this.activeTab = tabId;
    }
}

// ===================================
// IMAGE COMPRESSOR TOOL
// ===================================

class ImageCompressor {
    constructor() {
        this.originalFile = null;
        this.originalImage = null;
        this.init();
    }

    init() {
        this.setupUploadArea();
        this.setupControls();
    }

    setupUploadArea() {
        const uploadArea = document.getElementById('compressor-upload');
        const fileInput = document.getElementById('compressor-file');

        // Drag and drop functionality
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFile(e.target.files[0]);
            }
        });
    }    setupControls() {
        const qualitySlider = document.getElementById('quality-slider');
        const qualityValue = document.getElementById('quality-value');
        const downloadBtn = document.getElementById('download-compressed');
        const targetSizeInput = document.getElementById('target-size');
        const sizeUnit = document.getElementById('size-unit');

        qualitySlider.addEventListener('input', (e) => {
            qualityValue.textContent = e.target.value;
            // Clear target size when manually adjusting quality
            targetSizeInput.value = '';
            this.updateCompression();
        });

        // Add real-time validation for target size input
        targetSizeInput.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            const unit = sizeUnit.value;
            
            if (value && value > 0) {
                const targetBytes = Utils.convertToBytes(value, unit);
                const originalBytes = this.originalFile ? this.originalFile.size : 0;
                
                // Show helpful hints
                if (targetBytes > originalBytes) {
                    e.target.style.borderColor = '#f59e0b';
                    Utils.showNotification('Target size is larger than original', 'warning');
                } else if (targetBytes < originalBytes * 0.01) {
                    e.target.style.borderColor = '#ef4444';
                    Utils.showNotification('Target size may result in very poor quality', 'warning');
                } else {
                    e.target.style.borderColor = '#10b981';
                }
            } else {
                e.target.style.borderColor = '';
            }
            
            this.updateCompression();
        });

        sizeUnit.addEventListener('change', () => {
            this.updateCompression();
        });

        downloadBtn.addEventListener('click', () => {
            this.downloadCompressed();
        });

        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's' && this.compressedDataUrl) {
                e.preventDefault();
                this.downloadCompressed();
            }
        });
    }    async handleFile(file) {
        if (!file.type.match(/image\//)) {
            Utils.showNotification('Please select an image file', 'error');
            return;
        }

        // Show warnings for different formats but allow proceeding
        const formatWarnings = this.getFormatWarnings(file.type);
        if (formatWarnings.length > 0) {
            const shouldProceed = confirm(
                `${formatWarnings.join('\n\n')}\n\nDo you want to proceed with compression?`
            );
            if (!shouldProceed) {
                return;
            }
        }

        Utils.showLoading();
        this.originalFile = file;

        try {
            // Load and display original image
            const originalImg = document.getElementById('compressor-original');
            const originalSize = document.getElementById('original-size');
            
            originalImg.src = URL.createObjectURL(file);
            originalSize.textContent = `Size: ${Utils.formatFileSize(file.size)}`;

            // Wait for image to load
            await new Promise((resolve) => {
                originalImg.onload = resolve;
            });

            this.originalImage = originalImg;
            
            // Show controls and perform initial compression
            document.getElementById('compressor-controls').style.display = 'block';
            this.updateCompression();
            
        } catch (error) {
            Utils.showNotification('Error loading image', 'error');
            console.error(error);
        } finally {
            Utils.hideLoading();
        }
    }    async updateCompression() {
        if (!this.originalImage) return;

        const quality = parseInt(document.getElementById('quality-slider').value) / 100;
        const targetSizeInput = document.getElementById('target-size');
        const sizeUnit = document.getElementById('size-unit').value;
        
        try {
            // Create canvas for compression
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = this.originalImage.naturalWidth;
            canvas.height = this.originalImage.naturalHeight;
              // Draw image to canvas
            ctx.drawImage(this.originalImage, 0, 0);
            
            // Determine output format and quality based on input format
            let outputFormat = this.determineOutputFormat(this.originalFile.type);
            
            let finalQuality = quality;
            let isTargetSizeMode = false;
            
            // Compress based on target size if specified
            if (targetSizeInput.value && parseFloat(targetSizeInput.value) > 0) {
                const targetBytes = Utils.convertToBytes(parseFloat(targetSizeInput.value), sizeUnit);
                
                // Enhanced validation
                if (targetBytes > 0) {
                    if (targetBytes >= this.originalFile.size) {
                        Utils.showNotification('Target size is larger than original. Using original quality.', 'info');
                    } else if (targetBytes < this.originalFile.size * 0.005) {
                        // Less than 0.5% of original - very aggressive compression
                        const confirmed = confirm(
                            `Target size is very small (${Utils.formatFileSize(targetBytes)} vs ${Utils.formatFileSize(this.originalFile.size)} original). ` +
                            'This may result in very poor quality. Continue?'
                        );
                        if (!confirmed) {
                            targetSizeInput.value = '';
                            return;
                        }
                    }
                    
                    if (targetBytes < this.originalFile.size) {
                        Utils.showNotification('Finding optimal quality for target size...', 'info');
                        finalQuality = await this.findOptimalQuality(canvas, outputFormat, targetBytes);
                        isTargetSizeMode = true;
                        
                        // Update quality slider to show the found optimal quality
                        const qualityPercent = Math.round(finalQuality * 100);
                        document.getElementById('quality-slider').value = qualityPercent;
                        document.getElementById('quality-value').textContent = qualityPercent;
                    }
                } else {
                    Utils.showNotification('Please enter a valid target size', 'error');
                    return;
                }
            }
            
            // Generate compressed image
            const compressedDataUrl = canvas.toDataURL(outputFormat, finalQuality);
            
            // Display compressed image
            const compressedImg = document.getElementById('compressor-compressed');
            const compressedSize = document.getElementById('compressed-size');
            
            compressedImg.src = compressedDataUrl;
            
            // Calculate compressed size more accurately
            const compressedSizeBytes = this.calculateDataUrlSize(compressedDataUrl);
            compressedSize.innerHTML = `Size: ${Utils.formatFileSize(compressedSizeBytes)}`;
            
            // Enhanced compression statistics
            const compressionRatio = ((this.originalFile.size - compressedSizeBytes) / this.originalFile.size * 100).toFixed(1);
            const compressionFactor = (this.originalFile.size / compressedSizeBytes).toFixed(1);
            
            let statsHTML = `<br><small>Reduced by ${compressionRatio}% (${compressionFactor}x smaller)</small>`;
            
            if (isTargetSizeMode) {
                const targetBytes = Utils.convertToBytes(parseFloat(targetSizeInput.value), sizeUnit);
                const accuracy = ((1 - Math.abs(targetBytes - compressedSizeBytes) / targetBytes) * 100).toFixed(1);
                statsHTML += `<br><small style="color: #10b981;">Target accuracy: ${accuracy}%</small>`;
                
                if (compressedSizeBytes <= targetBytes) {
                    statsHTML += ` <span style="color: #10b981;">✓ Target achieved</span>`;
                } else {
                    const overage = ((compressedSizeBytes - targetBytes) / targetBytes * 100).toFixed(1);
                    statsHTML += ` <span style="color: #f59e0b;">⚠ ${overage}% over target</span>`;
                }
            }
            
            compressedSize.innerHTML += statsHTML;
            
            // Store for download
            this.compressedDataUrl = compressedDataUrl;
            
        } catch (error) {
            Utils.showNotification('Error compressing image', 'error');
            console.error(error);
        }
    }async findOptimalQuality(canvas, format, targetBytes) {
        let low = 0.1;
        let high = 0.95;
        let bestQuality = 0.8;
        let closestSize = Infinity;
        let iterations = 0;
        const maxIterations = 25; // Increased for better precision
        
        // For PNG, quality doesn't affect size much, so handle differently
        if (format === 'image/png') {
            const testDataUrl = canvas.toDataURL(format);
            const testSize = this.calculateDataUrlSize(testDataUrl);
            
            if (testSize <= targetBytes) {
                Utils.showNotification('PNG already meets target size', 'success');
                return 1.0; // Use highest quality if already under target
            } else {
                Utils.showNotification('PNG format has limited compression. Consider converting to JPEG.', 'warning');
                return 0.8;
            }
        }
        
        // Initial bounds check
        const initialTest = canvas.toDataURL(format, 0.1);
        const minSize = this.calculateDataUrlSize(initialTest);
        
        if (minSize > targetBytes) {
            Utils.showNotification(`Target size too small. Minimum possible: ${Utils.formatFileSize(minSize)}`, 'warning');
            return 0.1;
        }
        
        // Enhanced binary search with adaptive tolerance
        while (iterations < maxIterations && (high - low) > 0.001) {
            iterations++;
            const midQuality = (low + high) / 2;
            const dataUrl = canvas.toDataURL(format, midQuality);
            const size = this.calculateDataUrlSize(dataUrl);
            
            // Calculate tolerance based on target size (smaller targets need higher precision)
            const tolerance = Math.max(0.01, Math.min(0.05, targetBytes / 50000));
            
            // Show progress for long operations
            if (iterations % 5 === 0) {
                const progress = Math.round((iterations / maxIterations) * 100);
                Utils.showNotification(`Optimizing... ${progress}% (Quality: ${Math.round(midQuality * 100)}%)`, 'info');
            }
            
            // Check if we're close enough to target
            if (Math.abs(size - targetBytes) / targetBytes < tolerance) {
                Utils.showNotification(`Target achieved in ${iterations} iterations!`, 'success');
                return midQuality;
            }
            
            // Track the closest result
            if (Math.abs(size - targetBytes) < Math.abs(closestSize - targetBytes)) {
                closestSize = size;
                bestQuality = midQuality;
            }
            
            // Adjust search bounds
            if (size <= targetBytes) {
                low = midQuality;
            } else {
                high = midQuality;
            }
        }
        
        // Final result notification
        const finalSize = closestSize;
        const accuracy = ((targetBytes - Math.abs(targetBytes - finalSize)) / targetBytes * 100).toFixed(1);
        Utils.showNotification(`Optimization complete! ${accuracy}% accuracy achieved`, 'success');
        
        return bestQuality;
    }

    calculateDataUrlSize(dataUrl) {
        // More accurate calculation for data URL size
        const base64String = dataUrl.split(',')[1];
        // Account for padding characters
        const padding = (base64String.match(/=/g) || []).length;
        return Math.floor((base64String.length * 3) / 4) - padding;
    }

    downloadCompressed() {
        if (!this.compressedDataUrl) {
            Utils.showNotification('No compressed image available', 'error');
            return;
        }

        // Convert data URL to blob
        const byteString = atob(this.compressedDataUrl.split(',')[1]);
        const mimeString = this.compressedDataUrl.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        
        const blob = new Blob([ab], { type: mimeString });
        const extension = mimeString.split('/')[1];
        const filename = `compressed_image.${extension}`;
          Utils.downloadFile(blob, filename);
        Utils.showNotification('Image downloaded successfully!', 'success');
    }

    getFormatWarnings(mimeType) {
        const warnings = [];
        
        switch (mimeType) {
            case 'image/gif':
                warnings.push(
                    '⚠️ GIF Format Warning:\n' +
                    '• Only the first frame will be compressed (animations will be lost)\n' +
                    '• GIF compression may have limited effectiveness\n' +
                    '• Consider converting to PNG or WebP for better results'
                );
                break;
                
            case 'image/bmp':
                warnings.push(
                    '⚠️ BMP Format Warning:\n' +
                    '• BMP files are uncompressed and may not compress effectively\n' +
                    '• Consider converting to JPEG or PNG for better results\n' +
                    '• Quality settings may have limited impact'
                );
                break;
                
            case 'image/tiff':
            case 'image/tif':
                warnings.push(
                    '⚠️ TIFF Format Warning:\n' +
                    '• TIFF compression may not work as expected in browsers\n' +
                    '• Image may be converted to PNG format during compression\n' +
                    '• Consider using PNG or JPEG for web compatibility'
                );
                break;
                
            case 'image/svg+xml':
                warnings.push(
                    '⚠️ SVG Format Warning:\n' +
                    '• SVG is a vector format and may not compress as expected\n' +
                    '• The image will be rasterized during compression\n' +
                    '• Original vector properties will be lost'
                );
                break;
                
            case 'image/avif':
                warnings.push(
                    '⚠️ AVIF Format Notice:\n' +
                    '• AVIF is a modern format with excellent compression\n' +
                    '• Browser support may be limited\n' +
                    '• May fallback to other formats if unsupported'
                );
                break;
                
            case 'image/heic':
            case 'image/heif':
                warnings.push(
                    '⚠️ HEIC/HEIF Format Warning:\n' +
                    '• Limited browser support for HEIC/HEIF formats\n' +
                    '• Image may be converted to JPEG during compression\n' +
                    '• Consider converting to JPEG or PNG beforehand'
                );
                break;
                
            case 'image/ico':
            case 'image/x-icon':
                warnings.push(
                    '⚠️ ICO Format Warning:\n' +
                    '• ICO format is designed for icons and may not compress well\n' +
                    '• May be converted to PNG during compression\n' +
                    '• Best used for small icon files'
                );
                break;
        }
        
        // Additional warning for unusual formats
        if (!mimeType.match(/image\/(jpeg|jpg|png|webp|gif|bmp|tiff|tif|svg\+xml|avif|heic|heif|ico|x-icon)/)) {
            warnings.push(
                '⚠️ Unusual Format Detected:\n' +
                '• This image format may not be fully supported\n' +
                '• Compression results may be unpredictable\n' +
                '• Consider converting to a standard format (JPEG, PNG, WebP) first'
            );
        }
          return warnings;
    }

    determineOutputFormat(inputMimeType) {
        // Handle different image formats and determine best output format for compression
        switch (inputMimeType) {
            case 'image/jpeg':
            case 'image/jpg':
                return 'image/jpeg';
                
            case 'image/png':
                return 'image/png';
                
            case 'image/webp':
                // Check WebP support
                if (this.isWebPSupported()) {
                    return 'image/webp';
                } else {
                    Utils.showNotification('WebP not supported, converting to JPEG', 'warning');
                    return 'image/jpeg';
                }
                
            case 'image/avif':
                // Check AVIF support
                if (this.isAVIFSupported()) {
                    return 'image/avif';
                } else {
                    Utils.showNotification('AVIF not supported, converting to JPEG', 'warning');
                    return 'image/jpeg';
                }
                
            case 'image/gif':
                // GIF with transparency should go to PNG, otherwise JPEG
                Utils.showNotification('GIF converted to PNG to preserve quality', 'info');
                return 'image/png';
                
            case 'image/bmp':
            case 'image/tiff':
            case 'image/tif':
            case 'image/ico':
            case 'image/x-icon':
                // Convert less common formats to PNG for better compatibility
                Utils.showNotification(`${inputMimeType.split('/')[1].toUpperCase()} converted to PNG format`, 'info');
                return 'image/png';
                
            case 'image/svg+xml':
                // SVG needs to be rasterized, convert to PNG
                Utils.showNotification('SVG rasterized to PNG format', 'info');
                return 'image/png';
                
            case 'image/heic':
            case 'image/heif':
                // HEIC/HEIF not supported in browsers, convert to JPEG
                Utils.showNotification('HEIC/HEIF converted to JPEG format', 'info');
                return 'image/jpeg';
                
            default:
                // For unknown formats, default to JPEG
                Utils.showNotification(`Unknown format converted to JPEG`, 'warning');
                return 'image/jpeg';
        }
    }

    isWebPSupported() {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        } catch (error) {
            return false;
        }
    }

    isAVIFSupported() {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
        } catch (error) {
            return false;
        }
    }
}

// ===================================
// IMAGE CROPPER TOOL
// ===================================

class ImageCropper {
    constructor() {
        this.image = null;
        this.cropSelection = {
            x: 0,
            y: 0,
            width: 100,
            height: 100
        };
        this.isDragging = false;
        this.isResizing = false;
        this.dragStart = { x: 0, y: 0 };
        this.resizeHandle = null;
        this.init();
    }

    init() {
        this.setupUploadArea();
        this.setupControls();
    }

    setupUploadArea() {
        const uploadArea = document.getElementById('cropper-upload');
        const fileInput = document.getElementById('cropper-file');

        // Drag and drop functionality
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFile(e.target.files[0]);
            }
        });
    }

    setupControls() {
        const previewBtn = document.getElementById('crop-preview');
        const downloadBtn = document.getElementById('download-cropped');

        previewBtn.addEventListener('click', () => {
            this.previewCrop();
        });

        downloadBtn.addEventListener('click', () => {
            this.downloadCropped();
        });
    }    async handleFile(file) {
        if (!file.type.match(/image\//)) {
            Utils.showNotification('Please select an image file', 'error');
            return;
        }

        Utils.showLoading();
        
        try {
            const img = document.getElementById('cropper-image');
            img.src = URL.createObjectURL(file);
            
            await new Promise((resolve) => {
                img.onload = resolve;
            });

            this.image = img;
            this.originalFile = file;
            
            // Fit image to container
            this.fitImageToContainer();
            
            // Initialize crop selection
            this.initializeCropSelection();
            
            // Show controls
            document.getElementById('cropper-controls').style.display = 'block';
            
        } catch (error) {
            Utils.showNotification('Error loading image', 'error');
            console.error(error);
        } finally {
            Utils.hideLoading();
        }
    }

    fitImageToContainer() {
        const cropArea = document.getElementById('crop-area');
        const img = this.image;
        
        // Set maximum container size
        const maxWidth = Math.min(800, window.innerWidth - 100);
        const maxHeight = Math.min(600, window.innerHeight - 300);
        
        // Calculate scaling to fit image in container
        const scaleX = maxWidth / img.naturalWidth;
        const scaleY = maxHeight / img.naturalHeight;
        const scale = Math.min(scaleX, scaleY, 1); // Don't upscale
        
        // Set image display size
        const displayWidth = img.naturalWidth * scale;
        const displayHeight = img.naturalHeight * scale;
        
        img.style.width = displayWidth + 'px';
        img.style.height = displayHeight + 'px';
        img.style.display = 'block';
        
        // Set container size
        cropArea.style.width = displayWidth + 'px';
        cropArea.style.height = displayHeight + 'px';
        cropArea.style.position = 'relative';
        cropArea.style.margin = '0 auto';
        
        // Store scale for calculations
        this.imageScale = scale;
        this.imageDisplayWidth = displayWidth;
        this.imageDisplayHeight = displayHeight;
    }    initializeCropSelection() {
        const img = this.image;
        const overlay = document.getElementById('crop-overlay');
        const selection = document.getElementById('crop-selection');
        
        // Set initial crop selection (smaller, centered)
        const selectionSize = Math.min(this.imageDisplayWidth, this.imageDisplayHeight) * 0.3;
        
        this.cropSelection = {
            x: (this.imageDisplayWidth - selectionSize) / 2,
            y: (this.imageDisplayHeight - selectionSize) / 2,
            width: selectionSize,
            height: selectionSize
        };
        
        // Set overlay size to match image
        overlay.style.width = this.imageDisplayWidth + 'px';
        overlay.style.height = this.imageDisplayHeight + 'px';
        overlay.style.position = 'absolute';
        overlay.style.top = '0';
        overlay.style.left = '0';
        
        this.updateCropSelection();
        this.setupCropInteraction();
    }    setupCropInteraction() {
        const overlay = document.getElementById('crop-overlay');
        const selection = document.getElementById('crop-selection');
        const handles = selection.querySelectorAll('.crop-handle');

        // Remove any existing event listeners
        overlay.removeEventListener('mousedown', this.overlayMouseDown);
        
        // Create new crop selection by clicking on overlay
        this.overlayMouseDown = (e) => {
            if (e.target === overlay || e.target === selection) {
                // Check if clicking on handles
                if (e.target.classList.contains('crop-handle')) return;
                
                // If clicking on selection, start dragging
                if (e.target === selection) {
                    this.isDragging = true;
                    this.dragStart = {
                        x: e.offsetX - this.cropSelection.x,
                        y: e.offsetY - this.cropSelection.y
                    };
                    e.preventDefault();
                    return;
                }
                
                // If clicking on overlay, create new selection from that point
                const rect = overlay.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickY = e.clientY - rect.top;
                
                // Start new selection
                this.isCreatingSelection = true;
                this.cropSelection = {
                    x: clickX,
                    y: clickY,
                    width: 0,
                    height: 0
                };
                
                this.dragStart = { x: clickX, y: clickY };
                this.updateCropSelection();
                e.preventDefault();
            }
        };
        
        overlay.addEventListener('mousedown', this.overlayMouseDown);

        // Selection dragging
        selection.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('crop-handle')) return;
            
            this.isDragging = true;
            const rect = overlay.getBoundingClientRect();
            this.dragStart = {
                x: e.clientX - rect.left - this.cropSelection.x,
                y: e.clientY - rect.top - this.cropSelection.y
            };
            e.preventDefault();
        });

        // Handle resizing
        handles.forEach(handle => {
            handle.addEventListener('mousedown', (e) => {
                this.isResizing = true;
                this.resizeHandle = handle.className.split(' ')[1];
                const rect = overlay.getBoundingClientRect();
                this.dragStart = { 
                    x: e.clientX - rect.left, 
                    y: e.clientY - rect.top 
                };
                e.preventDefault();
                e.stopPropagation();
            });
        });

        // Mouse move and up events
        document.addEventListener('mousemove', (e) => {
            if (this.isCreatingSelection) {
                this.createSelection(e);
            } else if (this.isDragging) {
                this.dragCropSelection(e);
            } else if (this.isResizing) {
                this.resizeCropSelection(e);
            }
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.isResizing = false;
            this.isCreatingSelection = false;
            this.resizeHandle = null;
        });
    }

    createSelection(e) {
        const overlay = document.getElementById('crop-overlay');
        const rect = overlay.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        const startX = this.dragStart.x;
        const startY = this.dragStart.y;
        
        // Calculate selection rectangle
        const x = Math.min(startX, currentX);
        const y = Math.min(startY, currentY);
        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);
        
        // Keep within image bounds
        this.cropSelection = {
            x: Math.max(0, Math.min(x, this.imageDisplayWidth)),
            y: Math.max(0, Math.min(y, this.imageDisplayHeight)),
            width: Math.min(width, this.imageDisplayWidth - x),
            height: Math.min(height, this.imageDisplayHeight - y)
        };
        
        this.updateCropSelection();
    }    dragCropSelection(e) {
        const overlay = document.getElementById('crop-overlay');
        const rect = overlay.getBoundingClientRect();
        let newX = e.clientX - rect.left - this.dragStart.x;
        let newY = e.clientY - rect.top - this.dragStart.y;
        
        // Keep selection within image bounds
        newX = Math.max(0, Math.min(newX, this.imageDisplayWidth - this.cropSelection.width));
        newY = Math.max(0, Math.min(newY, this.imageDisplayHeight - this.cropSelection.height));
        
        this.cropSelection.x = newX;
        this.cropSelection.y = newY;
        
        this.updateCropSelection();
    }

    resizeCropSelection(e) {
        const overlay = document.getElementById('crop-overlay');
        const rect = overlay.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        const deltaX = currentX - this.dragStart.x;
        const deltaY = currentY - this.dragStart.y;
        
        let { x, y, width, height } = this.cropSelection;
        
        switch (this.resizeHandle) {
            case 'tl':
                x += deltaX;
                y += deltaY;
                width -= deltaX;
                height -= deltaY;
                break;
            case 'tr':
                y += deltaY;
                width += deltaX;
                height -= deltaY;
                break;
            case 'bl':
                x += deltaX;
                width -= deltaX;
                height += deltaY;
                break;
            case 'br':
                width += deltaX;
                height += deltaY;
                break;
        }
        
        // Ensure minimum size and bounds
        width = Math.max(20, width);
        height = Math.max(20, height);
        x = Math.max(0, Math.min(x, this.imageDisplayWidth - width));
        y = Math.max(0, Math.min(y, this.imageDisplayHeight - height));
        
        // Keep within image bounds
        if (x + width > this.imageDisplayWidth) {
            width = this.imageDisplayWidth - x;
        }
        if (y + height > this.imageDisplayHeight) {
            height = this.imageDisplayHeight - y;
        }
        
        this.cropSelection = { x, y, width, height };
        this.dragStart = { x: currentX, y: currentY };
        
        this.updateCropSelection();
    }    updateCropSelection() {
        const selection = document.getElementById('crop-selection');
        const dimensions = document.getElementById('crop-dimensions');
        
        selection.style.cssText = `
            left: ${this.cropSelection.x}px;
            top: ${this.cropSelection.y}px;
            width: ${this.cropSelection.width}px;
            height: ${this.cropSelection.height}px;
            position: absolute;
            border: 2px solid var(--primary-color);
            background: transparent;
            cursor: move;
        `;
        
        // Update dimensions display
        const scaleX = this.image.naturalWidth / this.imageDisplayWidth;
        const scaleY = this.image.naturalHeight / this.imageDisplayHeight;
        const realWidth = Math.round(this.cropSelection.width * scaleX);
        const realHeight = Math.round(this.cropSelection.height * scaleY);
        
        dimensions.textContent = `${realWidth} × ${realHeight}`;
    }    previewCrop() {
        if (!this.image) return;
        
        const canvas = document.getElementById('cropped-canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate crop coordinates in original image scale
        const scaleX = this.image.naturalWidth / this.imageDisplayWidth;
        const scaleY = this.image.naturalHeight / this.imageDisplayHeight;
        
        const cropX = this.cropSelection.x * scaleX;
        const cropY = this.cropSelection.y * scaleY;
        const cropWidth = this.cropSelection.width * scaleX;
        const cropHeight = this.cropSelection.height * scaleY;
        
        // Set canvas size
        canvas.width = cropWidth;
        canvas.height = cropHeight;
        
        // Draw cropped image
        ctx.drawImage(
            this.image,
            cropX, cropY, cropWidth, cropHeight,
            0, 0, cropWidth, cropHeight
        );
        
        // Show preview
        document.getElementById('crop-result').style.display = 'block';
        Utils.showNotification('Crop preview generated!', 'success');
    }

    downloadCropped() {
        if (!this.image) {
            Utils.showNotification('No image to crop', 'error');
            return;
        }
        
        // Generate the cropped image
        this.previewCrop();
        
        // Convert canvas to blob and download
        const canvas = document.getElementById('cropped-canvas');
        canvas.toBlob((blob) => {
            const filename = `cropped_${this.originalFile.name}`;
            Utils.downloadFile(blob, filename);
            Utils.showNotification('Cropped image downloaded!', 'success');
        });
    }
}

// ===================================
// BASE64 CONVERTER TOOL
// ===================================

class Base64Converter {
    constructor() {
        this.init();
    }

    init() {
        this.setupUploadArea();
        this.setupControls();
    }

    setupUploadArea() {
        const uploadArea = document.getElementById('base64-upload');
        const fileInput = document.getElementById('base64-file');

        // Drag and drop functionality
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFile(e.target.files[0]);
            }
        });
    }

    setupControls() {
        const copyBtn = document.getElementById('copy-base64');
        
        copyBtn.addEventListener('click', () => {
            const output = document.getElementById('base64-output');
            Utils.copyToClipboard(output.value);
        });
    }

    async handleFile(file) {
        if (!file.type.match(/image\//)) {
            Utils.showNotification('Please select an image file', 'error');
            return;
        }

        Utils.showLoading();
        
        try {
            // Read file as data URL
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const dataUrl = e.target.result;
                
                // Display preview
                const preview = document.getElementById('base64-preview');
                preview.src = dataUrl;
                
                // Display Base64 string
                const output = document.getElementById('base64-output');
                output.value = dataUrl;
                
                // Show controls
                document.getElementById('base64-controls').style.display = 'block';
                
                Utils.hideLoading();
                Utils.showNotification('Base64 conversion complete!', 'success');
            };
            
            reader.onerror = () => {
                Utils.showNotification('Error reading file', 'error');
                Utils.hideLoading();
            };
            
            reader.readAsDataURL(file);
            
        } catch (error) {
            Utils.showNotification('Error converting image', 'error');
            console.error(error);
            Utils.hideLoading();
        }
    }
}

// ===================================
// FAVICON GENERATOR TOOL
// ===================================

class FaviconGenerator {
    constructor() {
        this.sizes = [
            { size: 16, name: 'favicon-16x16.png' },
            { size: 32, name: 'favicon-32x32.png' },
            { size: 48, name: 'favicon-48x48.png' },
            { size: 96, name: 'favicon-96x96.png' },
            { size: 180, name: 'apple-touch-icon.png' }
        ];
        this.generatedFavicons = [];
        this.init();
    }

    init() {
        this.setupUploadArea();
        this.setupControls();
    }

    setupUploadArea() {
        const uploadArea = document.getElementById('favicon-upload');
        const fileInput = document.getElementById('favicon-file');

        // Drag and drop functionality
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFile(e.target.files[0]);
            }
        });
    }    setupControls() {
        const downloadAllBtn = document.getElementById('download-all-favicons');
        const downloadZipBtn = document.getElementById('download-zip-favicons');
        
        downloadAllBtn.addEventListener('click', () => {
            this.downloadAllFavicons();
        });

        downloadZipBtn.addEventListener('click', () => {
            this.downloadFaviconsAsZip();
        });
    }

    async handleFile(file) {
        if (!file.type.match(/image\//)) {
            Utils.showNotification('Please select an image file', 'error');
            return;
        }

        Utils.showLoading();
        
        try {
            // Load image
            const img = new Image();
            img.src = URL.createObjectURL(file);
            
            await new Promise((resolve) => {
                img.onload = resolve;
            });

            // Display source image
            const preview = document.getElementById('favicon-preview');
            preview.src = img.src;
            
            // Generate favicons
            await this.generateFavicons(img);
            
            // Show controls
            document.getElementById('favicon-controls').style.display = 'block';
            
            Utils.showNotification('Favicons generated successfully!', 'success');
            
        } catch (error) {
            Utils.showNotification('Error generating favicons', 'error');
            console.error(error);
        } finally {
            Utils.hideLoading();
        }
    }

    async generateFavicons(sourceImage) {
        const grid = document.getElementById('favicon-grid');
        grid.innerHTML = '';
        this.generatedFavicons = [];
        
        for (const { size, name } of this.sizes) {
            // Create canvas for this size
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = size;
            canvas.height = size;
            
            // Enable image smoothing for better quality
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            // Draw resized image
            ctx.drawImage(sourceImage, 0, 0, size, size);
            
            // Convert to blob
            const blob = await new Promise(resolve => {
                canvas.toBlob(resolve, 'image/png');
            });
            
            // Store for download
            this.generatedFavicons.push({ blob, name, size });
            
            // Create grid item
            const gridItem = document.createElement('div');
            gridItem.className = 'favicon-item';
            gridItem.innerHTML = `
                <img src="${canvas.toDataURL()}" alt="${size}x${size} favicon" width="${Math.min(size, 64)}" height="${Math.min(size, 64)}">
                <h5>${size}×${size}px</h5>
                <button class="btn btn-secondary" onclick="mediaToolkit.faviconGenerator.downloadSingle(${this.generatedFavicons.length - 1})">
                    📥 Download
                </button>
            `;
            
            grid.appendChild(gridItem);
        }
    }

    downloadSingle(index) {
        const favicon = this.generatedFavicons[index];
        if (favicon) {
            Utils.downloadFile(favicon.blob, favicon.name);
            Utils.showNotification(`${favicon.name} downloaded!`, 'success');
        }
    }    async downloadAllFavicons() {
        if (this.generatedFavicons.length === 0) {
            Utils.showNotification('No favicons to download', 'error');
            return;
        }

        Utils.showLoading();
        
        try {
            // Create a zip-like structure by downloading each file
            for (const favicon of this.generatedFavicons) {
                Utils.downloadFile(favicon.blob, favicon.name);
                // Small delay between downloads
                await new Promise(resolve => setTimeout(resolve, 200));
            }
            
            Utils.showNotification('All favicons downloaded!', 'success');
            
        } catch (error) {
            Utils.showNotification('Error downloading favicons', 'error');
            console.error(error);
        } finally {
            Utils.hideLoading();
        }
    }

    async downloadFaviconsAsZip() {
        if (this.generatedFavicons.length === 0) {
            Utils.showNotification('No favicons to download', 'error');
            return;
        }

        if (typeof JSZip === 'undefined') {
            Utils.showNotification('ZIP functionality not available', 'error');
            return;
        }

        Utils.showLoading();
        
        try {
            const zip = new JSZip();
            
            // Add each favicon to the zip
            for (const favicon of this.generatedFavicons) {
                zip.file(favicon.name, favicon.blob);
            }
            
            // Generate README file
            const readmeContent = `Favicon Package
================

This package contains favicons in multiple sizes for your website.

Files included:
${this.generatedFavicons.map(f => `- ${f.name} (${f.size}×${f.size}px)`).join('\n')}

Usage:
1. Upload these files to your website's root directory
2. Add the following HTML to your <head> section:

<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

Generated by QUANTUM TOOLS Media Toolkit
https://quantumtools.me
`;
            
            zip.file('README.txt', readmeContent);
            
            // Generate zip file
            const zipBlob = await zip.generateAsync({ 
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: 6 }
            });
            
            // Download zip file
            const timestamp = new Date().toISOString().slice(0, 10);
            Utils.downloadFile(zipBlob, `favicons-${timestamp}.zip`);
            Utils.showNotification('Favicon ZIP downloaded successfully!', 'success');
            
        } catch (error) {
            Utils.showNotification('Error creating ZIP file', 'error');
            console.error(error);
        } finally {
            Utils.hideLoading();
        }
    }
}

// ===================================
// IMAGE FILTERS TOOL
// ===================================

class ImageFilters {
    constructor() {
        this.originalImage = null;
        this.filteredCanvas = null;
        this.ctx = null;
        this.currentFilters = {
            brightness: 100,
            contrast: 100,
            saturation: 100,
            blur: 0,
            filter: 'none'
        };
        this.init();
    }

    init() {
        this.setupUploadArea();
        this.setupControls();
    }

    setupUploadArea() {
        const uploadArea = document.getElementById('filters-upload');
        const fileInput = document.getElementById('filters-file');

        // Drag and drop functionality
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFile(e.target.files[0]);
            }
        });
    }

    setupControls() {
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilters.filter = btn.dataset.filter;
                this.applyFilters();
            });
        });

        // Sliders
        const sliders = ['brightness', 'contrast', 'saturation', 'blur'];
        sliders.forEach(slider => {
            const element = document.getElementById(`${slider}-slider`);
            const valueDisplay = document.getElementById(`${slider}-value`);
            
            element.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                valueDisplay.textContent = slider === 'blur' ? value : value;
                this.currentFilters[slider] = value;
                this.applyFilters();
            });
        });

        // Control buttons
        document.getElementById('reset-filters').addEventListener('click', () => {
            this.resetFilters();
        });

        document.getElementById('download-filtered').addEventListener('click', () => {
            this.downloadFiltered();
        });
    }

    async handleFile(file) {
        if (!file.type.match(/image\//)) {
            Utils.showNotification('Please select an image file', 'error');
            return;
        }

        Utils.showLoading();
        
        try {
            // Load image
            const img = new Image();
            img.src = URL.createObjectURL(file);
            
            await new Promise((resolve) => {
                img.onload = resolve;
            });

            this.originalImage = img;
            this.originalFile = file;
            
            // Create canvas for filtering
            this.filteredCanvas = document.createElement('canvas');
            this.ctx = this.filteredCanvas.getContext('2d');
            
            this.filteredCanvas.width = img.naturalWidth;
            this.filteredCanvas.height = img.naturalHeight;
            
            // Display image
            const preview = document.getElementById('filters-preview');
            preview.src = img.src;
            
            // Show controls
            document.getElementById('filters-controls').style.display = 'block';
            
            // Apply initial filters
            this.applyFilters();
            
        } catch (error) {
            Utils.showNotification('Error loading image', 'error');
            console.error(error);
        } finally {
            Utils.hideLoading();
        }
    }

    applyFilters() {
        if (!this.originalImage || !this.filteredCanvas) return;

        const preview = document.getElementById('filters-preview');
        
        // Build CSS filter string
        let filterString = '';
        
        if (this.currentFilters.filter !== 'none') {
            switch (this.currentFilters.filter) {
                case 'grayscale':
                    filterString += 'grayscale(100%) ';
                    break;
                case 'sepia':
                    filterString += 'sepia(100%) ';
                    break;
                case 'invert':
                    filterString += 'invert(100%) ';
                    break;
            }
        }
        
        filterString += `brightness(${this.currentFilters.brightness}%) `;
        filterString += `contrast(${this.currentFilters.contrast}%) `;
        filterString += `saturate(${this.currentFilters.saturation}%) `;
        filterString += `blur(${this.currentFilters.blur}px)`;
        
        // Apply filters to preview
        preview.style.filter = filterString;
        
        // Store filter string for download
        this.currentFilterString = filterString;
    }

    resetFilters() {
        // Reset filter values
        this.currentFilters = {
            brightness: 100,
            contrast: 100,
            saturation: 100,
            blur: 0,
            filter: 'none'
        };
        
        // Reset UI controls
        document.getElementById('brightness-slider').value = 100;
        document.getElementById('brightness-value').textContent = '100';
        document.getElementById('contrast-slider').value = 100;
        document.getElementById('contrast-value').textContent = '100';
        document.getElementById('saturation-slider').value = 100;
        document.getElementById('saturation-value').textContent = '100';
        document.getElementById('blur-slider').value = 0;
        document.getElementById('blur-value').textContent = '0';
        
        // Reset filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('[data-filter="none"]').classList.add('active');
        
        // Apply reset filters
        this.applyFilters();
        
        Utils.showNotification('Filters reset!', 'success');
    }

    async downloadFiltered() {
        if (!this.originalImage) {
            Utils.showNotification('No image to download', 'error');
            return;
        }

        Utils.showLoading();
        
        try {
            // Create a temporary canvas with filters applied
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = this.originalImage.naturalWidth;
            canvas.height = this.originalImage.naturalHeight;
            
            // Apply filters to canvas context
            ctx.filter = this.currentFilterString;
            ctx.drawImage(this.originalImage, 0, 0);
            
            // Convert to blob and download
            canvas.toBlob((blob) => {
                const filename = `filtered_${this.originalFile.name}`;
                Utils.downloadFile(blob, filename);
                Utils.showNotification('Filtered image downloaded!', 'success');
                Utils.hideLoading();
            });
            
        } catch (error) {
            Utils.showNotification('Error downloading filtered image', 'error');
            console.error(error);
            Utils.hideLoading();
        }
    }
}

// ===================================
// COLOR PICKER TOOL
// ===================================

class ColorPicker {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.magnifierCanvas = null;
        this.magnifierCtx = null;
        this.colorHistory = [];
        this.maxHistorySize = 20;
        this.init();
    }

    init() {
        this.setupUploadArea();
        this.setupCanvas();
        this.setupControls();
    }

    setupUploadArea() {
        const uploadArea = document.getElementById('colorpicker-upload');
        const fileInput = document.getElementById('colorpicker-file');

        // Drag and drop functionality
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFile(e.target.files[0]);
            }
        });
    }

    setupCanvas() {
        this.canvas = document.getElementById('colorpicker-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.magnifierCanvas = document.getElementById('magnifier-canvas');
        this.magnifierCtx = this.magnifierCanvas.getContext('2d');
        
        const magnifier = document.getElementById('color-magnifier');
        
        // Canvas event listeners
        this.canvas.addEventListener('mousemove', (e) => {
            this.updateMagnifier(e);
        });
        
        this.canvas.addEventListener('click', (e) => {
            this.pickColor(e);
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            magnifier.style.display = 'none';
        });
    }

    setupControls() {
        // Copy buttons
        const copyButtons = document.querySelectorAll('.copy-btn');
        copyButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.target;
                const targetInput = document.getElementById(targetId);
                Utils.copyToClipboard(targetInput.value);
            });
        });
    }

    async handleFile(file) {
        if (!file.type.match(/image\//)) {
            Utils.showNotification('Please select an image file', 'error');
            return;
        }

        Utils.showLoading();
        
        try {
            // Load image
            const img = new Image();
            img.src = URL.createObjectURL(file);
            
            await new Promise((resolve) => {
                img.onload = resolve;
            });

            // Set canvas size to image size (with max width constraint)
            const maxWidth = 800;
            const scale = Math.min(1, maxWidth / img.naturalWidth);
            
            this.canvas.width = img.naturalWidth * scale;
            this.canvas.height = img.naturalHeight * scale;
            
            // Draw image to canvas
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
            
            // Show controls
            document.getElementById('colorpicker-controls').style.display = 'block';
            
            Utils.showNotification('Image loaded! Click anywhere to pick colors', 'success');
            
        } catch (error) {
            Utils.showNotification('Error loading image', 'error');
            console.error(error);
        } finally {
            Utils.hideLoading();
        }
    }

    updateMagnifier(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const magnifier = document.getElementById('color-magnifier');
        
        // Position magnifier
        magnifier.style.left = (e.clientX + 10) + 'px';
        magnifier.style.top = (e.clientY + 10) + 'px';
        magnifier.style.display = 'block';
        
        // Draw magnified area
        const magnifierSize = 100;
        const sourceSize = 20;
        
        this.magnifierCtx.imageSmoothingEnabled = false;
        this.magnifierCtx.clearRect(0, 0, magnifierSize, magnifierSize);
        
        // Draw magnified region
        this.magnifierCtx.drawImage(
            this.canvas,
            Math.max(0, x - sourceSize / 2),
            Math.max(0, y - sourceSize / 2),
            sourceSize,
            sourceSize,
            0,
            0,
            magnifierSize,
            magnifierSize
        );
    }

    pickColor(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);
        
        // Get pixel data
        const imageData = this.ctx.getImageData(x, y, 1, 1);
        const [r, g, b, a] = imageData.data;
        
        // Convert to different formats
        const hex = this.rgbToHex(r, g, b);
        const rgb = `rgb(${r}, ${g}, ${b})`;
        const hsl = this.rgbToHsl(r, g, b);
        
        // Update color display
        this.displayColor(hex, rgb, hsl);
        
        // Add to history
        this.addToHistory(hex);
        
        Utils.showNotification(`Color picked: ${hex}`, 'success');
    }

    displayColor(hex, rgb, hsl) {
        // Update color preview
        const preview = document.getElementById('color-preview');
        preview.style.backgroundColor = hex;
        
        // Update color values
        document.getElementById('hex-value').value = hex;
        document.getElementById('rgb-value').value = rgb;
        document.getElementById('hsl-value').value = hsl;
    }

    addToHistory(hex) {
        // Avoid duplicates
        if (!this.colorHistory.includes(hex)) {
            this.colorHistory.unshift(hex);
            
            // Limit history size
            if (this.colorHistory.length > this.maxHistorySize) {
                this.colorHistory = this.colorHistory.slice(0, this.maxHistorySize);
            }
            
            this.updateHistoryDisplay();
        }
    }

    updateHistoryDisplay() {
        const historyContainer = document.querySelector('.history-colors');
        historyContainer.innerHTML = '';
        
        this.colorHistory.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'history-color';
            colorDiv.style.backgroundColor = color;
            colorDiv.title = color;
            colorDiv.addEventListener('click', () => {
                this.displayColor(color, this.hexToRgb(color), this.hexToHsl(color));
                Utils.copyToClipboard(color);
            });
            
            historyContainer.appendChild(colorDiv);
        });
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            const r = parseInt(result[1], 16);
            const g = parseInt(result[2], 16);
            const b = parseInt(result[3], 16);
            return `rgb(${r}, ${g}, ${b})`;
        }
        return null;
    }

    hexToHsl(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            const r = parseInt(result[1], 16) / 255;
            const g = parseInt(result[2], 16) / 255;
            const b = parseInt(result[3], 16) / 255;
            return this.rgbToHsl(r * 255, g * 255, b * 255);
        }
        return null;
    }

    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        
        return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    }
}

// ===================================
// MEDIA PLAYER TOOL
// ===================================

class MediaPlayer {
    constructor() {
        this.mediaElement = null;
        this.isPlaying = false;
        this.isDragging = false;
        this.init();
    }

    init() {
        this.setupUploadArea();
        this.setupControls();
    }

    setupUploadArea() {
        const uploadArea = document.getElementById('mediaplayer-upload');
        const fileInput = document.getElementById('mediaplayer-file');

        // Drag and drop functionality
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFile(e.target.files[0]);
            }
        });
    }

    setupControls() {
        // Control button events will be set up after media is loaded
    }

    async handleFile(file) {
        const isVideo = file.type.startsWith('video/');
        const isAudio = file.type.startsWith('audio/');
        
        if (!isVideo && !isAudio) {
            Utils.showNotification('Please select an audio or video file', 'error');
            return;
        }

        try {
            // Create media element
            const mediaContainer = document.getElementById('media-element');
            mediaContainer.innerHTML = '';
            
            this.mediaElement = document.createElement(isVideo ? 'video' : 'audio');
            this.mediaElement.src = URL.createObjectURL(file);
            this.mediaElement.controls = false; // We'll use custom controls
            
            if (isVideo) {
                this.mediaElement.style.width = '100%';
                this.mediaElement.style.height = 'auto';
            }
            
            mediaContainer.appendChild(this.mediaElement);
            
            // Set up media events
            this.setupMediaEvents();
            
            // Show controls
            document.getElementById('mediaplayer-controls').style.display = 'block';
            
            // Show fullscreen button for video
            const fullscreenBtn = document.getElementById('fullscreen-btn');
            fullscreenBtn.style.display = isVideo ? 'block' : 'none';
            
            Utils.showNotification(`${isVideo ? 'Video' : 'Audio'} loaded successfully!`, 'success');
            
        } catch (error) {
            Utils.showNotification('Error loading media file', 'error');
            console.error(error);
        }
    }

    setupMediaEvents() {
        const playPauseBtn = document.getElementById('play-pause-btn');
        const progressBar = document.getElementById('progress-bar');
        const progressFill = document.getElementById('progress-fill');
        const progressHandle = document.getElementById('progress-handle');
        const currentTimeDisplay = document.getElementById('current-time');
        const totalTimeDisplay = document.getElementById('total-time');
        const muteBtn = document.getElementById('mute-btn');
        const volumeSlider = document.getElementById('volume-slider');
        const fullscreenBtn = document.getElementById('fullscreen-btn');

        // Play/Pause
        playPauseBtn.addEventListener('click', () => {
            this.togglePlayPause();
        });

        // Progress bar interaction
        progressBar.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.updateProgress(e);
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.updateProgress(e);
            }
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        // Volume control
        volumeSlider.addEventListener('input', (e) => {
            this.mediaElement.volume = e.target.value / 100;
        });

        // Mute toggle
        muteBtn.addEventListener('click', () => {
            this.toggleMute();
        });

        // Fullscreen (for video)
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }

        // Media element events
        this.mediaElement.addEventListener('loadedmetadata', () => {
            totalTimeDisplay.textContent = Utils.formatTime(this.mediaElement.duration);
            volumeSlider.value = this.mediaElement.volume * 100;
        });

        this.mediaElement.addEventListener('timeupdate', () => {
            if (!this.isDragging) {
                this.updateProgressDisplay();
            }
        });

        this.mediaElement.addEventListener('ended', () => {
            this.isPlaying = false;
            this.updatePlayPauseButton();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (document.getElementById('mediaplayer').classList.contains('active')) {
                switch (e.code) {
                    case 'Space':
                        e.preventDefault();
                        this.togglePlayPause();
                        break;
                    case 'KeyM':
                        this.toggleMute();
                        break;
                    case 'KeyF':
                        if (this.mediaElement.tagName === 'VIDEO') {
                            this.toggleFullscreen();
                        }
                        break;
                }
            }
        });
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.mediaElement.pause();
        } else {
            this.mediaElement.play();
        }
        this.isPlaying = !this.isPlaying;
        this.updatePlayPauseButton();
    }

    updatePlayPauseButton() {
        const playIcon = document.querySelector('.play-icon');
        const pauseIcon = document.querySelector('.pause-icon');
        
        if (this.isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline';
        } else {
            playIcon.style.display = 'inline';
            pauseIcon.style.display = 'none';
        }
    }

    updateProgress(e) {
        const progressBar = document.getElementById('progress-bar');
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const time = percent * this.mediaElement.duration;
        
        this.mediaElement.currentTime = Math.max(0, Math.min(time, this.mediaElement.duration));
        this.updateProgressDisplay();
    }

    updateProgressDisplay() {
        const progressFill = document.getElementById('progress-fill');
        const progressHandle = document.getElementById('progress-handle');
        const currentTimeDisplay = document.getElementById('current-time');
        
        const percent = (this.mediaElement.currentTime / this.mediaElement.duration) * 100;
        
        progressFill.style.width = percent + '%';
        progressHandle.style.left = percent + '%';
        currentTimeDisplay.textContent = Utils.formatTime(this.mediaElement.currentTime);
    }

    toggleMute() {
        this.mediaElement.muted = !this.mediaElement.muted;
        
        const volumeIcon = document.querySelector('.volume-icon');
        const muteIcon = document.querySelector('.mute-icon');
        
        if (this.mediaElement.muted) {
            volumeIcon.style.display = 'none';
            muteIcon.style.display = 'inline';
        } else {
            volumeIcon.style.display = 'inline';
            muteIcon.style.display = 'none';
        }
    }

    toggleFullscreen() {
        if (this.mediaElement.tagName !== 'VIDEO') return;
        
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            this.mediaElement.requestFullscreen();
        }
    }
}

// ===================================
// MAIN APPLICATION INITIALIZATION
// ===================================

class MediaToolkit {
    constructor() {
        this.tabManager = new TabManager();
        this.imageCompressor = new ImageCompressor();
        this.imageCropper = new ImageCropper();
        this.base64Converter = new Base64Converter();
        this.faviconGenerator = new FaviconGenerator();
        this.imageFilters = new ImageFilters();
        this.colorPicker = new ColorPicker();
        this.mediaPlayer = new MediaPlayer();
        
        this.init();
    }

    init() {
        // Initialize global event listeners
        this.setupGlobalEvents();
        
        // Add loading states
        this.setupLoadingStates();
        
        console.log('Media Toolkit initialized successfully!');
    }

    setupGlobalEvents() {
        // Prevent default drag behaviors on the whole document
        document.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        document.addEventListener('drop', (e) => {
            e.preventDefault();
        });

        // Service worker registration for PWA capabilities (optional)
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').catch(() => {
                // Service worker not available, continue without it
            });
        }
    }

    setupLoadingStates() {
        // Add CSS for loading states if not already present
        if (!document.querySelector('#loading-styles')) {
            const style = document.createElement('style');
            style.id = 'loading-styles';
            style.textContent = `
                .processing {
                    opacity: 0.7;
                    pointer-events: none;
                }
                
                .processing::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 20px;
                    height: 20px;
                    margin: -10px 0 0 -10px;
                    border: 2px solid #6366f1;
                    border-top: 2px solid transparent;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// ===================================
// APPLICATION STARTUP
// ===================================

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    window.mediaToolkit = new MediaToolkit();
});

// Export for global access (useful for debugging and external integrations)
window.MediaToolkit = MediaToolkit;
window.Utils = Utils;
