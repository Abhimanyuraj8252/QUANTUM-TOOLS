// Multi-Format Image Converter JavaScript
class ImageConverter {    constructor() {
        this.originalImage = null;
        this.convertedDataURL = null;
        this.originalFileSize = 0;
        this.convertedFileSize = 0;
        this.processingStartTime = 0;
        this.actualFileExtension = null; // Store the actual extension used after conversion
        this.supportedFormats = ['jpeg', 'png', 'webp', 'bmp', 'tiff', 'ico', 'avif', 'gif'];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.hideLoadingOverlay();
        console.log('🚀 Image Converter initialized successfully!');
    }

    setupEventListeners() {
        // File input and upload area
        const imageInput = document.getElementById('imageInput');
        const uploadArea = document.getElementById('uploadArea');
        const uploadBtn = document.getElementById('uploadBtn');

        // File input change
        imageInput.addEventListener('change', (e) => this.handleFileSelect(e));        // Upload button click - prevent event bubbling to avoid double trigger
        uploadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            imageInput.click();
        });

        // Drag and drop functionality
        uploadArea.addEventListener('click', () => imageInput.click());
        uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        uploadArea.addEventListener('drop', (e) => this.handleDrop(e));

        // Format selection
        const formatSelect = document.getElementById('formatSelect');
        formatSelect.addEventListener('change', (e) => this.handleFormatChange(e));

        // Quality slider
        const qualitySlider = document.getElementById('qualitySlider');
        const qualityValue = document.getElementById('qualityValue');
        qualitySlider.addEventListener('input', (e) => {
            qualityValue.textContent = e.target.value;
        });

        // Convert button
        const convertBtn = document.getElementById('convertBtn');
        convertBtn.addEventListener('click', () => this.convertImage());

        // Download button
        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn.addEventListener('click', () => this.downloadImage());

        // Initialize quality group visibility
        this.handleFormatChange({ target: formatSelect });
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        const uploadArea = document.getElementById('uploadArea');
        uploadArea.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        const uploadArea = document.getElementById('uploadArea');
        uploadArea.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        const uploadArea = document.getElementById('uploadArea');
        uploadArea.classList.remove('dragover');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    processFile(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            this.showStatus('❌ Please select a valid image file', 'error');
            return;
        }

        // Check file size (limit to 10MB)
        if (file.size > 10 * 1024 * 1024) {
            this.showStatus('❌ File size too large. Please select an image under 10MB', 'error');
            return;
        }

        this.originalFileSize = file.size;
        this.loadImage(file);
    }

    loadImage(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            
            img.onload = () => {
                this.originalImage = img;
                this.displayFileInfo(file, img);
                this.showSettingsSection();
                this.showStatus('✅ Image loaded successfully!', 'success');
            };
            
            img.onerror = () => {
                this.showStatus('❌ Error loading image', 'error');
            };
            
            img.src = e.target.result;
        };
        
        reader.onerror = () => {
            this.showStatus('❌ Error reading file', 'error');
        };
        
        reader.readAsDataURL(file);
    }

    displayFileInfo(file, img) {
        const fileInfo = document.getElementById('fileInfo');
        const fileName = document.getElementById('fileName');
        const fileSize = document.getElementById('fileSize');
        const fileDimensions = document.getElementById('fileDimensions');

        fileName.textContent = file.name;
        fileSize.textContent = this.formatFileSize(file.size);
        fileDimensions.textContent = `${img.width} × ${img.height}`;

        fileInfo.style.display = 'block';
        fileInfo.classList.add('fade-in');
    }

    showSettingsSection() {
        const settingsSection = document.getElementById('settingsSection');
        settingsSection.style.display = 'block';
        settingsSection.classList.add('slide-up');
    }    handleFormatChange(e) {
        const format = e.target.value;
        const qualityGroup = document.getElementById('qualityGroup');
        
        // Show quality slider only for lossy formats
        if (format === 'jpeg' || format === 'webp' || format === 'avif') {
            qualityGroup.classList.remove('hidden');
        } else {
            qualityGroup.classList.add('hidden');
        }
    }

    async convertImage() {
        if (!this.originalImage) {
            this.showStatus('❌ No image loaded', 'error');
            return;
        }

        this.processingStartTime = performance.now();
        this.showProgressSection();
        
        try {
            // Get conversion settings
            const format = document.getElementById('formatSelect').value;
            const quality = parseInt(document.getElementById('qualitySlider').value) / 100;

            this.updateProgress(20, 'Preparing canvas...');

            // Create canvas for conversion
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas dimensions to match image
            canvas.width = this.originalImage.width;
            canvas.height = this.originalImage.height;

            this.updateProgress(40, 'Drawing image...');

            // Draw image on canvas
            ctx.drawImage(this.originalImage, 0, 0);

            this.updateProgress(60, `Converting to ${format.toUpperCase()}...`);

            // Handle GIF format limitation
            if (this.originalImage.src.toLowerCase().includes('.gif')) {
                this.showStatus('⚠️ GIF conversion will only process the first frame', 'warning');
            }            // Convert to desired format
            let mimeType;
            let convertedDataURL;
            let fileExtension = format;

            switch (format) {
                case 'jpeg':
                    mimeType = 'image/jpeg';
                    convertedDataURL = canvas.toDataURL(mimeType, quality);
                    break;
                case 'png':
                    mimeType = 'image/png';
                    convertedDataURL = canvas.toDataURL(mimeType);
                    break;
                case 'webp':
                    mimeType = 'image/webp';
                    // Check WebP support
                    if (!this.isWebPSupported()) {
                        throw new Error('WebP format is not supported in this browser');
                    }
                    convertedDataURL = canvas.toDataURL(mimeType, quality);
                    break;
                case 'avif':
                    mimeType = 'image/avif';
                    // Check AVIF support
                    if (!this.isAVIFSupported()) {
                        // Fallback to WebP if AVIF not supported
                        mimeType = 'image/webp';
                        fileExtension = 'webp';
                        this.showStatus('⚠️ AVIF not supported, converting to WebP instead', 'warning');
                    }
                    convertedDataURL = canvas.toDataURL(mimeType, quality);
                    break;
                case 'tiff':
                    // Canvas doesn't natively support TIFF, fallback to PNG
                    mimeType = 'image/png';
                    fileExtension = 'png';
                    convertedDataURL = canvas.toDataURL(mimeType);
                    this.showStatus('⚠️ TIFF conversion fallback to PNG format', 'warning');
                    break;
                case 'ico':
                    // Canvas doesn't natively support ICO, fallback to PNG
                    mimeType = 'image/png';
                    fileExtension = 'png';
                    convertedDataURL = canvas.toDataURL(mimeType);
                    this.showStatus('⚠️ ICO conversion fallback to PNG format', 'warning');
                    break;
                case 'gif':
                    // Canvas doesn't natively support GIF, fallback to PNG
                    mimeType = 'image/png';
                    fileExtension = 'png';
                    convertedDataURL = canvas.toDataURL(mimeType);
                    this.showStatus('⚠️ GIF conversion fallback to PNG format', 'warning');
                    break;
                case 'bmp':
                    // Canvas doesn't natively support BMP, fallback to PNG
                    mimeType = 'image/png';
                    fileExtension = 'png';
                    convertedDataURL = canvas.toDataURL(mimeType);
                    this.showStatus('⚠️ BMP conversion fallback to PNG format', 'warning');
                    break;
                default:
                    throw new Error('Unsupported format');
            }

            this.updateProgress(80, 'Finalizing conversion...');            // Store converted data
            this.convertedDataURL = convertedDataURL;
            this.actualFileExtension = fileExtension; // Store actual extension used
            this.convertedFileSize = this.estimateFileSize(convertedDataURL);

            this.updateProgress(100, '✅ Conversion complete!');

            // Show results
            setTimeout(() => {
                this.hideProgressSection();
                this.showOutputSection();
            }, 1000);

        } catch (error) {
            console.error('Conversion error:', error);
            this.showStatus(`❌ Conversion failed: ${error.message}`, 'error');
            this.hideProgressSection();
        }
    }

    showOutputSection() {
        const outputSection = document.getElementById('outputSection');
        const originalPreview = document.getElementById('originalPreview');
        const convertedPreview = document.getElementById('convertedPreview');
        const originalFormat = document.getElementById('originalFormat');
        const originalSize = document.getElementById('originalSize');
        const convertedFormat = document.getElementById('convertedFormat');
        const convertedSize = document.getElementById('convertedSize');
        const sizeReduction = document.getElementById('sizeReduction');
        const processingTime = document.getElementById('processingTime');

        // Set image previews
        originalPreview.src = this.originalImage.src;
        convertedPreview.src = this.convertedDataURL;

        // Set format info
        const selectedFormat = document.getElementById('formatSelect').value.toUpperCase();
        originalFormat.textContent = this.getImageFormat(this.originalImage.src);
        convertedFormat.textContent = selectedFormat;

        // Set size info
        originalSize.textContent = this.formatFileSize(this.originalFileSize);
        convertedSize.textContent = this.formatFileSize(this.convertedFileSize);

        // Calculate size reduction
        const reduction = ((this.originalFileSize - this.convertedFileSize) / this.originalFileSize * 100);
        sizeReduction.textContent = reduction > 0 ? 
            `-${reduction.toFixed(1)}%` : 
            `+${Math.abs(reduction).toFixed(1)}%`;
        sizeReduction.style.color = reduction > 0 ? '#00ff88' : '#ff9500';

        // Show processing time
        const processingTimeMs = performance.now() - this.processingStartTime;
        processingTime.textContent = `${processingTimeMs.toFixed(0)}ms`;

        // Show section
        outputSection.style.display = 'block';
        outputSection.classList.add('fade-in');

        this.showStatus('🎉 Image conversion completed successfully!', 'success');
    }    downloadImage() {
        if (!this.convertedDataURL) {
            this.showStatus('❌ No converted image to download', 'error');
            return;
        }

        // Use actual file extension from conversion (handles fallbacks)
        const fileExtension = this.actualFileExtension || document.getElementById('formatSelect').value;
        const link = document.createElement('a');
        link.download = `converted-image.${fileExtension}`;
        link.href = this.convertedDataURL;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showStatus('📥 Image downloaded successfully!', 'success');
    }

    // Progress and UI Methods
    showProgressSection() {
        const progressSection = document.getElementById('progressSection');
        progressSection.style.display = 'block';
        progressSection.classList.add('fade-in');
    }

    hideProgressSection() {
        const progressSection = document.getElementById('progressSection');
        progressSection.style.display = 'none';
    }

    updateProgress(percentage, text) {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = text;
    }

    showStatus(message, type = 'info') {
        const statusContainer = document.getElementById('statusContainer');
        
        const statusMessage = document.createElement('div');
        statusMessage.className = `status-message ${type}`;
        
        // Add icon based on type
        let icon;
        switch (type) {
            case 'success':
                icon = '<i class="fas fa-check-circle"></i>';
                break;
            case 'error':
                icon = '<i class="fas fa-exclamation-circle"></i>';
                break;
            case 'warning':
                icon = '<i class="fas fa-exclamation-triangle"></i>';
                break;
            default:
                icon = '<i class="fas fa-info-circle"></i>';
        }
        
        statusMessage.innerHTML = `${icon} ${message}`;
        statusContainer.appendChild(statusMessage);
        
        // Show the message
        setTimeout(() => {
            statusMessage.classList.add('show');
        }, 100);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            statusMessage.classList.remove('show');
            setTimeout(() => {
                if (statusContainer.contains(statusMessage)) {
                    statusContainer.removeChild(statusMessage);
                }
            }, 300);
        }, 5000);
    }

    hideLoadingOverlay() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            setTimeout(() => {
                loadingOverlay.style.opacity = '0';
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                }, 500);
            }, 1000);
        }
    }

    // Utility Methods
    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    getImageFormat(src) {
        if (src.includes('data:image/')) {
            const format = src.split('data:image/')[1].split(';')[0];
            return format.toUpperCase();
        }
        
        const extension = src.split('.').pop().toLowerCase();
        switch (extension) {
            case 'jpg':
            case 'jpeg':
                return 'JPEG';
            case 'png':
                return 'PNG';
            case 'webp':
                return 'WEBP';
            case 'gif':
                return 'GIF';
            case 'bmp':
                return 'BMP';
            default:
                return 'UNKNOWN';
        }
    }

    estimateFileSize(dataURL) {
        // Estimate file size based on base64 data
        const base64 = dataURL.split(',')[1];
        return Math.round((base64.length * 3) / 4);
    }    isWebPSupported() {
        // Check if browser supports WebP
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
        // Check if browser supports AVIF
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

// Initialize the converter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.imageConverter = new ImageConverter();
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageConverter;
}

/* 
IMPORTANT LIMITATIONS REGARDING GIF CONVERSION:

1. **Animated GIF Limitation**: The HTML5 Canvas API used for image conversion 
   only processes the first frame of animated GIFs. When converting a GIF to 
   other formats (JPG, PNG, WebP, BMP), only the first frame will be preserved.

2. **Static GIF Conversion**: Static (non-animated) GIFs will convert normally 
   to other formats without issues.

3. **GIF as Output Format**: Creating animated GIFs as output is not supported 
   through the Canvas API. The BMP format also has limited browser support and 
   falls back to PNG format.

4. **Browser Compatibility**: WebP format support varies by browser. The script 
   includes detection for WebP support and will show an error if not supported.

5. **Alternative Solutions**: For full GIF animation preservation or creation, 
   server-side processing or specialized libraries (like gif.js) would be required,
   which are beyond the scope of this client-side Canvas API implementation.

This tool is optimized for common image format conversions while maintaining 
high quality and performance through client-side processing.
*/
