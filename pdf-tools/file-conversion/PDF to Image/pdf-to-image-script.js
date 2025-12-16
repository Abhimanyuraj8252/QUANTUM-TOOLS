// PDF to Image Converter JavaScript
// Convert PDF pages to high-quality images

class PDFToImageConverter {
    constructor() {
        this.currentPDF = null;
        this.pdfDoc = null;
        this.images = [];
        this.currentPreviewPage = 1;
        this.settings = {
            format: 'png',
            resolution: 150,
            quality: 85,
            pageRange: 'all'
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateUI();
    }

    bindEvents() {
        // File input events
        const fileInput = document.getElementById('pdf-file-input');
        const dropZone = document.getElementById('drop-zone');
        const removeFileBtn = document.getElementById('remove-file');

        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }

        if (dropZone) {
            dropZone.addEventListener('click', () => fileInput?.click());
            dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
            dropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            dropZone.addEventListener('drop', (e) => this.handleDrop(e));
        }

        if (removeFileBtn) {
            removeFileBtn.addEventListener('click', () => this.removeFile());
        }

        // Settings events
        this.bindSettingEvents();        // Action buttons
        const convertBtn = document.getElementById('convert-btn');
        const downloadAllBtn = document.getElementById('download-all-btn');
        const startOverBtn = document.getElementById('start-over-btn');
        const previewBtn = document.getElementById('preview-btn');

        if (convertBtn) {
            convertBtn.addEventListener('click', () => this.convertToImages());
        }

        if (downloadAllBtn) {
            downloadAllBtn.addEventListener('click', () => this.downloadAllImages());
        }

        if (startOverBtn) {
            startOverBtn.addEventListener('click', () => this.reset());
        }

        if (previewBtn) {
            previewBtn.addEventListener('click', () => this.showPreview());
        }

        // Preview navigation
        const prevPageBtn = document.getElementById('prev-page');
        const nextPageBtn = document.getElementById('next-page');

        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => this.showPreviousPage());
        }

        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => this.showNextPage());
        }
    }

    bindSettingEvents() {
        // Output format
        document.querySelectorAll('input[name="output-format"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.settings.format = e.target.value;
                this.toggleJPEGQuality();
                this.updateEstimatedSize();
            });
        });

        // Resolution
        const resolutionSelect = document.getElementById('resolution');
        if (resolutionSelect) {
            resolutionSelect.addEventListener('change', (e) => {
                this.settings.resolution = parseInt(e.target.value);
                this.updateEstimatedSize();
            });
        }

        // JPEG Quality
        const jpegQuality = document.getElementById('jpeg-quality');
        if (jpegQuality) {
            jpegQuality.addEventListener('input', (e) => {
                this.settings.quality = parseInt(e.target.value);
                document.getElementById('jpeg-quality-value').textContent = `${e.target.value}%`;
                this.updateEstimatedSize();
            });
        }

        // Page range
        document.querySelectorAll('input[name="page-range"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.settings.pageRange = e.target.value;
                this.toggleCustomRange();
            });
        });
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            this.loadPDF(file);
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
                this.loadPDF(file);
            } else {
                this.showNotification('Please drop a valid PDF file', 'error');
            }
        }
    }

    async loadPDF(file) {
        try {
            this.showLoading('Loading PDF...');

            const arrayBuffer = await file.arrayBuffer();

            // Load PDF with PDF.js
            const loadingTask = pdfjsLib.getDocument(arrayBuffer);
            this.pdfDoc = await loadingTask.promise;

            this.currentPDF = file;

            // Update file info
            this.updateFileInfo(file, this.pdfDoc.numPages);

            // Show settings section
            const settingsSection = document.getElementById('settings-section');
            if (settingsSection) {
                settingsSection.style.display = 'block';
            }

            this.hideLoading();
            this.updateUI();
            this.showNotification('PDF loaded successfully!', 'success');

        } catch (error) {
            console.error('Error loading PDF:', error);
            this.hideLoading();
            this.showNotification('Error loading PDF file', 'error');
        }
    }

    updateFileInfo(file, pageCount) {
        const fileInfo = document.getElementById('file-info');
        const fileName = document.getElementById('file-name');
        const fileSize = document.getElementById('file-size');
        const pageCountElement = document.getElementById('page-count');

        if (fileInfo) fileInfo.style.display = 'block';
        if (fileName) fileName.textContent = file.name;
        if (fileSize) fileSize.textContent = this.formatFileSize(file.size);
        if (pageCountElement) pageCountElement.textContent = `${pageCount} pages`;
    }

    toggleJPEGQuality() {
        const jpegQualityGroup = document.getElementById('jpeg-quality-group');
        if (jpegQualityGroup) {
            jpegQualityGroup.style.display = this.settings.format === 'jpeg' ? 'block' : 'none';
        }
    }

    toggleCustomRange() {
        const customRangeGroup = document.getElementById('custom-range-group');
        if (customRangeGroup) {
            customRangeGroup.style.display = this.settings.pageRange === 'custom' ? 'block' : 'none';
        }
    }

    updateEstimatedSize() {
        if (!this.pdfDoc) return;

        // Simple estimation based on resolution and format
        const pagesCount = this.pdfDoc.numPages;
        const baseSize = this.settings.resolution === 72 ? 50 :
            this.settings.resolution === 150 ? 200 :
                this.settings.resolution === 300 ? 800 : 3200; // KB per page

        const formatMultiplier = this.settings.format === 'jpeg' ? 0.7 : 1;
        const qualityMultiplier = this.settings.format === 'jpeg' ? (this.settings.quality / 100) : 1;

        const estimatedTotalSize = pagesCount * baseSize * formatMultiplier * qualityMultiplier;

        const estimatedSizeElement = document.getElementById('estimated-size');
        if (estimatedSizeElement) {
            estimatedSizeElement.textContent = this.formatFileSize(estimatedTotalSize * 1024);
        }
    }

    async convertToImages() {
        if (!this.pdfDoc) {
            this.showNotification('Please select a PDF file first', 'warning');
            return;
        }

        try {
            this.showProcessing();
            this.images = [];

            const totalPages = this.pdfDoc.numPages;

            for (let i = 1; i <= totalPages; i++) {
                this.updateProgress((i - 1) / totalPages * 100, `Converting page ${i} of ${totalPages}...`);

                const page = await this.pdfDoc.getPage(i);
                const scale = this.settings.resolution / 72; // 72 is default DPI

                const viewport = page.getViewport({ scale });

                // Create canvas
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render page to canvas
                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;

                // Convert to blob
                const quality = this.settings.format === 'jpeg' ? this.settings.quality / 100 : undefined;
                const blob = await this.canvasToBlob(canvas, this.settings.format, quality);

                this.images.push({
                    blob,
                    filename: `page_${i}.${this.settings.format}`,
                    pageNumber: i
                });
            }

            this.updateProgress(100, 'Conversion complete!');
            this.showResults();

        } catch (error) {
            console.error('Error converting PDF:', error);
            this.hideProcessing();
            this.showNotification('Error converting PDF to images', 'error');
        }
    }

    canvasToBlob(canvas, format, quality) {
        return new Promise((resolve) => {
            const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
            canvas.toBlob(resolve, mimeType, quality);
        });
    }

    showProcessing() {
        const processingSection = document.getElementById('processing-section');
        if (processingSection) {
            processingSection.style.display = 'block';
        }

        // Hide other sections
        const settingsSection = document.getElementById('settings-section');
        if (settingsSection) {
            settingsSection.style.display = 'none';
        }
    }

    hideProcessing() {
        const processingSection = document.getElementById('processing-section');
        if (processingSection) {
            processingSection.style.display = 'none';
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
    } showResults() {
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
            resultsSection.style.display = 'none'; // Hide results section
        }

        this.hideProcessing();
        this.updateResultsDisplay();

        // Show download section
        this.showDownloadSection();

        // Show notification about conversion completion
        this.showNotification('PDF converted successfully! Files are ready for download.', 'success');
    }

    showDownloadSection() {
        // Create download section if it doesn't exist
        let downloadSection = document.getElementById('download-section');
        if (!downloadSection) {
            downloadSection = document.createElement('div');
            downloadSection.id = 'download-section';
            downloadSection.innerHTML = `
                <div class="download-container">
                    <div class="download-info">
                        <h3><i class="fas fa-check-circle"></i> Conversion Complete!</h3>
                        <p>Your PDF has been converted to <span id="download-count">${this.images.length}</span> images</p>
                        <p>Total size: <span id="download-total-size">${this.formatFileSize(this.images.reduce((sum, img) => sum + img.blob.size, 0))}</span></p>
                    </div>
                    <div class="download-actions">
                        <button id="download-all-images" class="btn primary">
                            <i class="fas fa-download"></i>
                            Download All Images
                        </button>
                        <button id="show-results-btn" class="btn secondary">
                            <i class="fas fa-eye"></i>
                            View Results
                        </button>
                    </div>
                </div>
            `;

            // Add styles
            downloadSection.style.cssText = `
                background: var(--card-bg);
                border-radius: 12px;
                padding: 20px;
                margin: 20px 0;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                border: 1px solid var(--border-color);
            `;

            // Insert after settings section
            const settingsSection = document.getElementById('settings-section');
            if (settingsSection) {
                settingsSection.parentNode.insertBefore(downloadSection, settingsSection.nextSibling);
            }
        }

        // Show the download section
        downloadSection.style.display = 'block';

        // Bind events
        const downloadAllBtn = document.getElementById('download-all-images');
        const showResultsBtn = document.getElementById('show-results-btn');

        if (downloadAllBtn) {
            downloadAllBtn.addEventListener('click', () => this.downloadAllImages());
        }

        if (showResultsBtn) {
            showResultsBtn.addEventListener('click', () => this.toggleResultsSection());
        }

        // Scroll to download section
        downloadSection.scrollIntoView({ behavior: 'smooth' });
    }

    toggleResultsSection() {
        const resultsSection = document.getElementById('results-section');
        const showResultsBtn = document.getElementById('show-results-btn');

        if (resultsSection) {
            const isHidden = resultsSection.style.display === 'none';
            resultsSection.style.display = isHidden ? 'block' : 'none';

            if (showResultsBtn) {
                showResultsBtn.innerHTML = isHidden ?
                    '<i class="fas fa-eye-slash"></i> Hide Results' :
                    '<i class="fas fa-eye"></i> View Results';
            }
        }
    }

    updateResultsDisplay() {
        const imageGrid = document.getElementById('image-grid');
        const totalImages = document.getElementById('total-images');
        const totalSize = document.getElementById('total-size');

        if (totalImages) {
            totalImages.textContent = this.images.length;
        }

        if (totalSize) {
            const totalSizeBytes = this.images.reduce((sum, img) => sum + img.blob.size, 0);
            totalSize.textContent = this.formatFileSize(totalSizeBytes);
        }
        if (imageGrid) {
            imageGrid.innerHTML = this.images.map(image => `
                <div class="image-result">
                    <div class="image-preview">
                        <img src="${URL.createObjectURL(image.blob)}" alt="Page ${image.pageNumber}" style="max-width: 200px; max-height: 250px; width: 100%; height: auto; object-fit: contain; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    </div>
                    <div class="image-info">
                        <h4>${image.filename}</h4>
                        <p>Size: ${this.formatFileSize(image.blob.size)}</p>
                        <button class="btn secondary download-single" data-page="${image.pageNumber}">
                            <i class="fas fa-download"></i>
                            Download
                        </button>
                    </div>
                </div>
            `).join('');

            // Add download event listeners
            imageGrid.querySelectorAll('.download-single').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const pageNumber = parseInt(e.target.closest('.download-single').dataset.page);
                    this.downloadSingleImage(pageNumber);
                });
            });
        }
    }

    downloadSingleImage(pageNumber) {
        const image = this.images.find(img => img.pageNumber === pageNumber);
        if (image) {
            const url = URL.createObjectURL(image.blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = image.filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }

    async downloadAllImages() {
        if (this.images.length === 0) return;

        try {
            // Create ZIP file using JSZip if available, otherwise download individually
            if (window.JSZip) {
                await this.downloadAsZip();
            } else {
                this.downloadIndividually();
            }
        } catch (error) {
            console.error('Error downloading images:', error);
            this.showNotification('Error downloading images', 'error');
        }
    }

    downloadIndividually() {
        this.images.forEach((image, index) => {
            setTimeout(() => {
                this.downloadSingleImage(image.pageNumber);
            }, index * 100); // Small delay between downloads
        });

        this.showNotification('Download started for all images!', 'success');
    }

    async downloadAsZip() {
        if (this.images.length === 0) {
            this.showNotification('No images to download', 'error');
            return;
        }

        try {
            const zip = new JSZip();

            // Add each image to the ZIP
            this.images.forEach((image) => {
                zip.file(image.filename, image.blob);
            });

            // Generate ZIP file
            const zipBlob = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: 6 }
            });

            // Create download link
            const pdfName = this.currentPDF.name.replace(/\.pdf$/i, '');
            const url = URL.createObjectURL(zipBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${pdfName}_images.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.showNotification('Images downloaded as ZIP successfully!', 'success');
        } catch (error) {
            console.error('Error creating ZIP:', error);
            this.showNotification('Error creating ZIP file', 'error');
        }
    }

    removeFile() {
        this.currentPDF = null;
        this.pdfDoc = null;
        this.images = [];
        this.currentPreviewPage = 1;

        // Reset file input
        const fileInput = document.getElementById('pdf-file-input');
        if (fileInput) fileInput.value = '';

        // Hide sections
        const fileInfo = document.getElementById('file-info');
        const settingsSection = document.getElementById('settings-section');
        const resultsSection = document.getElementById('results-section');
        const previewSection = document.getElementById('preview-section');
        const downloadSection = document.getElementById('download-section');

        if (fileInfo) fileInfo.style.display = 'none';
        if (settingsSection) settingsSection.style.display = 'none';
        if (resultsSection) resultsSection.style.display = 'none';
        if (previewSection) previewSection.style.display = 'none';
        if (downloadSection) downloadSection.style.display = 'none';

        this.updateUI();
    }

    reset() {
        this.removeFile();
        this.showNotification('Reset complete', 'info');
    }

    // Preview functionality
    async showPreview() {
        if (!this.pdfDoc) {
            this.showNotification('Please select a PDF file first', 'warning');
            return;
        }

        this.currentPreviewPage = 1;
        const previewSection = document.getElementById('preview-section');
        if (previewSection) {
            previewSection.style.display = 'block';
            previewSection.scrollIntoView({ behavior: 'smooth' });
        }

        await this.renderPreviewPage();
        this.updatePreviewControls();
    }

    async renderPreviewPage() {
        if (!this.pdfDoc || this.currentPreviewPage < 1 || this.currentPreviewPage > this.pdfDoc.numPages) {
            return;
        }

        try {
            const page = await this.pdfDoc.getPage(this.currentPreviewPage);
            const canvas = document.getElementById('preview-canvas');
            const context = canvas.getContext('2d');

            // Calculate scale to fit the container while maintaining aspect ratio
            const container = canvas.parentElement;
            const containerRect = container.getBoundingClientRect();
            const maxWidth = Math.min(containerRect.width - 40, 800);
            const maxHeight = Math.min(containerRect.height - 40, 600);

            const viewport = page.getViewport({ scale: 1.0 });
            const scaleX = maxWidth / viewport.width;
            const scaleY = maxHeight / viewport.height;
            const scale = Math.min(scaleX, scaleY);

            const scaledViewport = page.getViewport({ scale });

            canvas.width = scaledViewport.width;
            canvas.height = scaledViewport.height;

            // Clear canvas with white background
            context.fillStyle = 'white';
            context.fillRect(0, 0, canvas.width, canvas.height);

            // Render the page
            await page.render({
                canvasContext: context,
                viewport: scaledViewport
            }).promise;

        } catch (error) {
            console.error('Error rendering preview page:', error);
            this.showNotification('Error rendering page preview', 'error');
        }
    }

    updatePreviewControls() {
        const currentPageSpan = document.getElementById('current-page');
        const totalPagesSpan = document.getElementById('total-pages');
        const prevPageBtn = document.getElementById('prev-page');
        const nextPageBtn = document.getElementById('next-page');

        if (currentPageSpan) {
            currentPageSpan.textContent = this.currentPreviewPage;
        }

        if (totalPagesSpan) {
            totalPagesSpan.textContent = this.pdfDoc ? this.pdfDoc.numPages : 0;
        }

        if (prevPageBtn) {
            prevPageBtn.disabled = this.currentPreviewPage <= 1;
        }

        if (nextPageBtn) {
            nextPageBtn.disabled = !this.pdfDoc || this.currentPreviewPage >= this.pdfDoc.numPages;
        }
    }

    async showPreviousPage() {
        if (this.currentPreviewPage > 1) {
            this.currentPreviewPage--;
            await this.renderPreviewPage();
            this.updatePreviewControls();
        }
    } async showNextPage() {
        if (this.pdfDoc && this.currentPreviewPage < this.pdfDoc.numPages) {
            this.currentPreviewPage++;
            await this.renderPreviewPage();
            this.updatePreviewControls();
        }
    }

    updateUI() {
        const hasFile = !!this.currentPDF;
        const hasImages = this.images.length > 0;

        const convertBtn = document.getElementById('convert-btn');
        const downloadAllBtn = document.getElementById('download-all-btn');
        const previewBtn = document.getElementById('preview-btn');

        if (convertBtn) {
            convertBtn.disabled = !hasFile;
        }

        if (downloadAllBtn) {
            downloadAllBtn.disabled = !hasImages;
        }

        if (previewBtn) {
            previewBtn.disabled = !hasFile;
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
    new PDFToImageConverter();
});
