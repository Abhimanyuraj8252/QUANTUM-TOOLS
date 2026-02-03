// Image to PDF Converter JavaScript

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

// Image to PDF Converter
class ImageToPDFConverter {
    constructor() {
        this.images = [];
        this.currentStep = 1;
        this.pdfBlob = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeRangeSliders();
        this.showStep(1);
    }

    bindEvents() {
        // File input events
        const fileInput = document.getElementById('file-input');
        const browseBtn = document.getElementById('browse-btn');
        const uploadArea = document.getElementById('upload-area');        if (fileInput) {
            fileInput.addEventListener('change', async (e) => await this.handleFileSelect(e.target.files));
        }        if (browseBtn) {
            browseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const tempInput = document.createElement('input');
                tempInput.type = 'file';
                tempInput.multiple = true;
                tempInput.accept = 'image/*';
                tempInput.addEventListener('change', async (e) => await this.handleFileSelect(e.target.files));
                tempInput.click();
            });
        }if (uploadArea) {
            uploadArea.addEventListener('click', async (e) => {
                // Only trigger file input if clicking on the upload area itself, not child elements
                if (e.target === uploadArea || (e.target.closest('.upload-content') && !e.target.closest('button'))) {
                    const tempInput = document.createElement('input');
                    tempInput.type = 'file';
                    tempInput.multiple = true;
                    tempInput.accept = 'image/*';
                    tempInput.addEventListener('change', async (e) => await this.handleFileSelect(e.target.files));
                    tempInput.click();
                }
            });
            uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
            uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
            uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        }

        // Step navigation
        const addMoreBtn = document.getElementById('add-more-btn');
        const proceedBtn = document.getElementById('proceed-btn');
        const backToUploadBtn = document.getElementById('back-to-upload');
        const generatePdfBtn = document.getElementById('generate-pdf');
        const downloadPdfBtn = document.getElementById('download-pdf');
        const startOverBtn = document.getElementById('start-over');        if (addMoreBtn) {
            addMoreBtn.addEventListener('click', () => {
                // Create a temporary file input for adding more files
                const tempInput = document.createElement('input');
                tempInput.type = 'file';
                tempInput.multiple = true;
                tempInput.accept = 'image/*';
                tempInput.addEventListener('change', async (e) => await this.handleFileSelect(e.target.files));
                tempInput.click();
            });
        }

        if (proceedBtn) {
            proceedBtn.addEventListener('click', () => this.proceedToSettings());
        }

        if (backToUploadBtn) {
            backToUploadBtn.addEventListener('click', () => this.showStep(1));
        }

        if (generatePdfBtn) {
            generatePdfBtn.addEventListener('click', () => this.generatePDF());
        }

        if (downloadPdfBtn) {
            downloadPdfBtn.addEventListener('click', () => this.downloadPDF());
        }

        if (startOverBtn) {
            startOverBtn.addEventListener('click', () => this.startOver());
        }
    }

    initializeRangeSliders() {
        const marginSlider = document.getElementById('margin');
        const compressionSlider = document.getElementById('compression');

        if (marginSlider) {
            marginSlider.addEventListener('input', (e) => {
                document.getElementById('margin-value').textContent = `${e.target.value}mm`;
            });
        }

        if (compressionSlider) {
            compressionSlider.addEventListener('input', (e) => {
                document.getElementById('compression-value').textContent = `${Math.round(e.target.value * 100)}%`;
            });
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('upload-area').classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('upload-area').classList.remove('dragover');
    }    async handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('upload-area').classList.remove('dragover');

        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        await this.handleFileSelect(files);
    }async handleFileSelect(files) {
        if (!files || files.length === 0) return;

        const validFiles = Array.from(files).filter(file => this.validateFile(file));
        
        if (validFiles.length === 0) return;

        // Process all files and wait for completion
        const promises = validFiles.map(file => this.addImage(file));
        await Promise.all(promises);

        this.updateImageDisplay();
    }

    validateFile(file) {
        // Check file type
        if (!file.type.startsWith('image/')) {
            this.showNotification('Please select image files only.', 'error');
            return false;
        }

        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            this.showNotification('File size must be less than 10MB.', 'error');
            return false;
        }

        // Check if already added
        if (this.images.find(img => img.file.name === file.name && img.file.size === file.size)) {
            this.showNotification('This image is already added.', 'warning');
            return false;
        }

        return true;
    }

    async addImage(file) {
        const imageData = {
            file,
            id: Date.now() + Math.random(),
            name: file.name,
            size: this.formatFileSize(file.size),
            dataUrl: await this.fileToDataUrl(file)
        };

        this.images.push(imageData);
    }

    fileToDataUrl(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.readAsDataURL(file);
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    updateImageDisplay() {
        const uploadedImagesDiv = document.getElementById('uploaded-images');
        const imageList = document.getElementById('image-list');
        const imageCount = document.getElementById('image-count');

        if (this.images.length > 0) {
            uploadedImagesDiv.style.display = 'block';
            imageCount.textContent = this.images.length;

            imageList.innerHTML = this.images.map(image => `
                <div class="image-item" data-id="${image.id}">
                    <button class="remove-image" onclick="converter.removeImage('${image.id}')">
                        <i class="fas fa-times"></i>
                    </button>
                    <img src="${image.dataUrl}" alt="${image.name}" class="image-preview" />
                    <div class="image-name">${image.name}</div>
                    <div class="image-size">${image.size}</div>
                </div>
            `).join('');
        } else {
            uploadedImagesDiv.style.display = 'none';
        }
    }

    removeImage(imageId) {
        // Convert imageId to the same type for proper comparison
        const id = typeof imageId === 'string' ? parseFloat(imageId) : imageId;
        this.images = this.images.filter(img => img.id !== id);
        this.updateImageDisplay();
    }

    proceedToSettings() {
        if (this.images.length === 0) {
            this.showNotification('Please add at least one image.', 'warning');
            return;
        }

        this.showStep(2);
    }

    showStep(stepNumber) {
        // Hide all steps
        document.querySelectorAll('.step-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show current step
        const stepMap = {
            1: 'upload-step',
            2: 'settings-step',
            3: 'processing-step',
            4: 'complete-step'
        };

        const stepElement = document.getElementById(stepMap[stepNumber]);
        if (stepElement) {
            stepElement.classList.add('active');
        }

        this.currentStep = stepNumber;
    }

    async generatePDF() {
        this.showStep(3);

        try {
            const settings = this.getSettings();
            await this.createPDF(settings);
        } catch (error) {
            console.error('PDF generation error:', error);
            this.showNotification('Error generating PDF. Please try again.', 'error');
            this.showStep(2);
        }
    }

    getSettings() {
        return {
            pageSize: document.getElementById('page-size')?.value || 'a4',
            orientation: document.getElementById('orientation')?.value || 'portrait',
            layout: document.getElementById('layout')?.value || 'fit-to-page',
            quality: document.getElementById('quality')?.value || 'medium',
            margin: parseInt(document.getElementById('margin')?.value || '10'),
            compression: parseFloat(document.getElementById('compression')?.value || '0.8')
        };
    }

    async createPDF(settings) {
        const { jsPDF } = window.jspdf;

        // Update progress
        this.updateProgress(0, 'Initializing PDF...');

        // Determine page size
        let pageWidth, pageHeight;
        switch (settings.pageSize) {
            case 'a4':
                pageWidth = 210;
                pageHeight = 297;
                break;
            case 'letter':
                pageWidth = 216;
                pageHeight = 279;
                break;
            case 'legal':
                pageWidth = 216;
                pageHeight = 356;
                break;
            case 'a3':
                pageWidth = 297;
                pageHeight = 420;
                break;
            default:
                pageWidth = 210;
                pageHeight = 297;
        }

        // Create PDF
        const pdf = new jsPDF({
            orientation: settings.orientation === 'landscape' ? 'landscape' : 'portrait',
            unit: 'mm',
            format: [pageWidth, pageHeight]
        });

        const margin = settings.margin;
        const availableWidth = pageWidth - (2 * margin);
        const availableHeight = pageHeight - (2 * margin);

        for (let i = 0; i < this.images.length; i++) {
            const image = this.images[i];

            this.updateProgress(
                (i / this.images.length) * 90,
                `Processing image ${i + 1} of ${this.images.length}...`
            );

            // Add new page for each image (except first)
            if (i > 0) {
                pdf.addPage();
            }

            // Load and process image
            const img = new Image();
            await new Promise((resolve) => {
                img.onload = resolve;
                img.src = image.dataUrl;
            });

            // Calculate dimensions based on layout
            let imgWidth, imgHeight, x, y;

            const imgAspectRatio = img.width / img.height;
            const pageAspectRatio = availableWidth / availableHeight;

            switch (settings.layout) {
                case 'fit-to-page':
                    if (imgAspectRatio > pageAspectRatio) {
                        imgWidth = availableWidth;
                        imgHeight = availableWidth / imgAspectRatio;
                    } else {
                        imgHeight = availableHeight;
                        imgWidth = availableHeight * imgAspectRatio;
                    }
                    x = margin + (availableWidth - imgWidth) / 2;
                    y = margin + (availableHeight - imgHeight) / 2;
                    break;

                case 'original-size':
                    // Convert pixels to mm (assuming 96 DPI)
                    imgWidth = (img.width * 25.4) / 96;
                    imgHeight = (img.height * 25.4) / 96;

                    // Scale down if larger than available space
                    if (imgWidth > availableWidth || imgHeight > availableHeight) {
                        const scale = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);
                        imgWidth *= scale;
                        imgHeight *= scale;
                    }

                    x = margin + (availableWidth - imgWidth) / 2;
                    y = margin + (availableHeight - imgHeight) / 2;
                    break;

                default: // one-per-page
                    if (imgAspectRatio > pageAspectRatio) {
                        imgWidth = availableWidth;
                        imgHeight = availableWidth / imgAspectRatio;
                    } else {
                        imgHeight = availableHeight;
                        imgWidth = availableHeight * imgAspectRatio;
                    }
                    x = margin + (availableWidth - imgWidth) / 2;
                    y = margin + (availableHeight - imgHeight) / 2;
            }

            // Add image to PDF
            pdf.addImage(
                image.dataUrl,
                'JPEG',
                x,
                y,
                imgWidth,
                imgHeight,
                undefined,
                'MEDIUM'
            );
        }

        this.updateProgress(95, 'Finalizing PDF...');

        // Generate PDF blob
        this.pdfBlob = pdf.output('blob');

        this.updateProgress(100, 'PDF generated successfully!');

        // Show completion step
        setTimeout(() => {
            this.showPDFInfo();
            this.showStep(4);
        }, 1000);
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
    }

    showPDFInfo() {
        const pdfPages = document.getElementById('pdf-pages');
        const pdfSize = document.getElementById('pdf-size');
        const pdfImages = document.getElementById('pdf-images');

        if (pdfPages) {
            pdfPages.textContent = this.images.length;
        }

        if (pdfSize) {
            pdfSize.textContent = this.formatFileSize(this.pdfBlob.size);
        }

        if (pdfImages) {
            pdfImages.textContent = this.images.length;
        }
    }

    downloadPDF() {
        if (!this.pdfBlob) return;

        const url = URL.createObjectURL(this.pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted-images-${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('PDF downloaded successfully!', 'success');
    }

    startOver() {
        this.images = [];
        this.pdfBlob = null;
        this.updateImageDisplay();
        this.showStep(1);

        // Reset file input
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.value = '';
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            background: type === 'success' ? 'var(--success-color)' :
                type === 'error' ? 'var(--error-color)' :
                    type === 'warning' ? 'var(--warning-color)' : 'var(--accent-color-1)',
            color: 'white',
            borderRadius: '8px',
            zIndex: '10000',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
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
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    window.converter = new ImageToPDFConverter();

    console.log('Image to PDF Converter initialized');
});
