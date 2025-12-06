class PDFMerger {
    constructor() {
        this.files = [];
        this.mergedPdfBytes = null;
        this.currentPreviewPage = 0;
        this.previewPages = [];
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        // Main sections
        this.uploadSection = document.getElementById('uploadSection');
        this.fileListSection = document.getElementById('fileListSection');
        this.optionsSection = document.getElementById('optionsSection');
        this.previewSection = document.getElementById('previewSection');
        this.processingSection = document.getElementById('processingSection');
        this.resultsSection = document.getElementById('resultsSection');
        this.errorSection = document.getElementById('errorSection');

        // Upload elements
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.browseButton = document.getElementById('browseButton');

        // File list elements
        this.fileList = document.getElementById('fileList');
        this.clearAllButton = document.getElementById('clearAllButton');
        this.addMoreButton = document.getElementById('addMoreButton');

        // Options elements
        this.mergeOrderSelect = document.getElementById('mergeOrder');
        this.mergeModeSelect = document.getElementById('mergeMode');
        this.previewButton = document.getElementById('previewButton');
        this.mergeButton = document.getElementById('mergeButton');

        // Preview elements
        this.previewCanvas = document.getElementById('previewCanvas');
        this.pageInfo = document.getElementById('pageInfo');
        this.prevPageButton = document.getElementById('prevPageButton');
        this.nextPageButton = document.getElementById('nextPageButton');
        this.closePreviewButton = document.getElementById('closePreviewButton');

        // Processing elements
        this.processingTitle = document.getElementById('processingTitle');
        this.processingDescription = document.getElementById('processingDescription');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');

        // Results elements
        this.mergedFileCount = document.getElementById('mergedFileCount');
        this.totalPages = document.getElementById('totalPages');
        this.finalFileSize = document.getElementById('finalFileSize');
        this.downloadButton = document.getElementById('downloadButton');
        this.previewMergedButton = document.getElementById('previewMergedButton');
        this.startOverButton = document.getElementById('startOverButton');

        // Error elements
        this.errorMessage = document.getElementById('errorMessage');
        this.retryButton = document.getElementById('retryButton');
        this.backToStartButton = document.getElementById('backToStartButton');
    }

    attachEventListeners() {
        // Upload area events
        this.uploadArea.addEventListener('click', (e) => {
            if (!e.target.closest('button')) {
                this.fileInput.click();
            }
        });

        this.browseButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.fileInput.click();
        });

        this.fileInput.addEventListener('change', (e) => {
            this.handleFileSelection(e.target.files);
        });

        // Drag and drop events
        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadArea.classList.add('dragover');
        });

        this.uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            this.uploadArea.classList.remove('dragover');
        });

        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadArea.classList.remove('dragover');
            const files = Array.from(e.dataTransfer.files).filter(file => file.type === 'application/pdf');
            this.handleFileSelection(files);
        });

        // File list controls
        this.clearAllButton.addEventListener('click', () => this.clearAllFiles());
        this.addMoreButton.addEventListener('click', () => this.fileInput.click());

        // Options controls
        this.mergeOrderSelect.addEventListener('change', () => this.reorderFiles());
        this.previewButton.addEventListener('click', () => this.showPreview());
        this.mergeButton.addEventListener('click', () => this.mergePDFs());

        // Preview controls
        this.prevPageButton.addEventListener('click', () => this.showPreviousPage());
        this.nextPageButton.addEventListener('click', () => this.showNextPage());
        this.closePreviewButton.addEventListener('click', () => this.closePreview());

        // Result controls
        this.downloadButton.addEventListener('click', () => this.downloadMergedPDF());
        this.previewMergedButton.addEventListener('click', () => this.previewMergedPDF());
        this.startOverButton.addEventListener('click', () => this.startOver());

        // Error controls
        this.retryButton.addEventListener('click', () => this.mergePDFs());
        this.backToStartButton.addEventListener('click', () => this.startOver());
    }

    handleFileSelection(files) {
        const pdfFiles = Array.from(files).filter(file => file.type === 'application/pdf');
        
        if (pdfFiles.length === 0) {
            this.showError('Please select valid PDF files.');
            return;
        }

        if (this.files.length + pdfFiles.length > 50) {
            this.showError('Maximum 50 files allowed. Please select fewer files.');
            return;
        }

        pdfFiles.forEach(file => {
            const fileData = {
                id: Date.now() + Math.random(),
                file: file,
                name: file.name,
                size: file.size,
                pages: null
            };
            this.files.push(fileData);
        });

        this.updateFileList();
        this.showSection('fileListSection');
        this.showSection('optionsSection');
    }    updateFileList() {
        this.fileList.innerHTML = '';
        
        this.files.forEach((fileData, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.draggable = true;
            fileItem.dataset.fileId = fileData.id;

            fileItem.innerHTML = `
                <div class="file-drag-handle">⋮⋮</div>
                <div class="file-icon">📄</div>
                <div class="file-details">
                    <div class="file-name">${fileData.name}</div>
                    <div class="file-meta">${this.formatFileSize(fileData.size)}</div>
                </div>
                <div class="file-actions">
                    <button type="button" class="file-remove" data-file-id="${fileData.id}">Remove</button>
                </div>
            `;

            // Add event listener for remove button
            const removeBtn = fileItem.querySelector('.file-remove');
            removeBtn.addEventListener('click', () => {
                this.removeFile(fileData.id);
            });

            // Add drag and drop functionality
            fileItem.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', fileData.id);
                fileItem.classList.add('dragging');
            });

            fileItem.addEventListener('dragend', () => {
                fileItem.classList.remove('dragging');
            });

            fileItem.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            fileItem.addEventListener('drop', (e) => {
                e.preventDefault();
                const draggedId = e.dataTransfer.getData('text/plain');
                this.reorderFilesByDrag(draggedId, fileData.id);
            });

            this.fileList.appendChild(fileItem);
        });
    }

    removeFile(fileId) {
        this.files = this.files.filter(file => file.id !== fileId);
        this.updateFileList();
        
        if (this.files.length === 0) {
            this.hideSection('fileListSection');
            this.hideSection('optionsSection');
        }
    }

    reorderFilesByDrag(draggedId, targetId) {
        const draggedIndex = this.files.findIndex(file => file.id === draggedId);
        const targetIndex = this.files.findIndex(file => file.id === targetId);
        
        if (draggedIndex !== -1 && targetIndex !== -1) {
            const draggedFile = this.files.splice(draggedIndex, 1)[0];
            this.files.splice(targetIndex, 0, draggedFile);
            this.updateFileList();
        }
    }

    reorderFiles() {
        const order = this.mergeOrderSelect.value;
        
        switch (order) {
            case 'alphabetical':
                this.files.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'reverse-alphabetical':
                this.files.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'size-asc':
                this.files.sort((a, b) => a.size - b.size);
                break;
            case 'size-desc':
                this.files.sort((a, b) => b.size - a.size);
                break;
            case 'custom':
            default:
                // Keep current order
                break;
        }
        
        this.updateFileList();
    }

    async showPreview() {
        this.showSection('processingSection');
        this.updateProgress(0, 'Generating preview...');

        try {
            this.previewPages = [];
            
            for (let i = 0; i < this.files.length; i++) {
                const fileData = this.files[i];
                this.updateProgress((i / this.files.length) * 100, `Processing ${fileData.name}...`);
                
                const arrayBuffer = await this.readFileAsArrayBuffer(fileData.file);
                const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
                const pageCount = pdf.getPageCount();
                
                fileData.pages = pageCount;
                
                // Add first page of each PDF to preview
                this.previewPages.push({
                    fileName: fileData.name,
                    pageIndex: 0,
                    totalPages: pageCount,
                    pdfBytes: arrayBuffer
                });
            }

            this.currentPreviewPage = 0;
            this.hideSection('processingSection');
            this.showSection('previewSection');
            this.renderPreviewPage();

        } catch (error) {
            this.hideSection('processingSection');
            this.showError('Failed to generate preview: ' + error.message);
        }
    }

    async renderPreviewPage() {
        if (this.previewPages.length === 0) return;

        const currentPage = this.previewPages[this.currentPreviewPage];
        this.pageInfo.textContent = `Page ${this.currentPreviewPage + 1} of ${this.previewPages.length} - ${currentPage.fileName}`;

        try {
            const pdf = await PDFLib.PDFDocument.load(currentPage.pdfBytes);
            const page = pdf.getPage(0);
            const { width, height } = page.getSize();

            // Convert PDF page to image for preview
            const canvas = this.previewCanvas;
            const context = canvas.getContext('2d');
            
            const scale = Math.min(600 / width, 400 / height);
            canvas.width = width * scale;
            canvas.height = height * scale;

            // Simple placeholder rendering
            context.fillStyle = '#f8f9fa';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.strokeStyle = '#dee2e6';
            context.strokeRect(0, 0, canvas.width, canvas.height);
            
            context.fillStyle = '#6c757d';
            context.font = '16px Arial';
            context.textAlign = 'center';
            context.fillText(currentPage.fileName, canvas.width / 2, canvas.height / 2 - 10);
            context.fillText(`Page 1 of ${currentPage.totalPages}`, canvas.width / 2, canvas.height / 2 + 10);

        } catch (error) {
            console.error('Failed to render preview:', error);
        }

        this.prevPageButton.disabled = this.currentPreviewPage === 0;
        this.nextPageButton.disabled = this.currentPreviewPage === this.previewPages.length - 1;
    }

    showPreviousPage() {
        if (this.currentPreviewPage > 0) {
            this.currentPreviewPage--;
            this.renderPreviewPage();
        }
    }

    showNextPage() {
        if (this.currentPreviewPage < this.previewPages.length - 1) {
            this.currentPreviewPage++;
            this.renderPreviewPage();
        }
    }

    closePreview() {
        this.hideSection('previewSection');
    }

    async mergePDFs() {
        if (this.files.length < 2) {
            this.showError('Please select at least 2 PDF files to merge.');
            return;
        }

        this.showSection('processingSection');
        this.updateProgress(0, 'Starting merge process...');

        try {
            const mergedPdf = await PDFLib.PDFDocument.create();
            let totalPages = 0;

            for (let i = 0; i < this.files.length; i++) {
                const fileData = this.files[i];
                this.updateProgress((i / this.files.length) * 80, `Merging ${fileData.name}...`);

                const arrayBuffer = await this.readFileAsArrayBuffer(fileData.file);
                const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
                const pageIndices = Array.from({ length: pdf.getPageCount() }, (_, i) => i);
                
                const pages = await mergedPdf.copyPages(pdf, pageIndices);
                pages.forEach(page => mergedPdf.addPage(page));
                
                totalPages += pdf.getPageCount();
                fileData.pages = pdf.getPageCount();
            }

            this.updateProgress(90, 'Finalizing merged PDF...');
            this.mergedPdfBytes = await mergedPdf.save();

            this.updateProgress(100, 'Merge completed!');
            
            setTimeout(() => {
                this.hideSection('processingSection');
                this.showResults(totalPages);
            }, 1000);

        } catch (error) {
            this.hideSection('processingSection');
            this.showError('Failed to merge PDFs: ' + error.message);
            console.error('Merge error:', error);
        }
    }

    showResults(totalPages) {
        this.mergedFileCount.textContent = this.files.length;
        this.totalPages.textContent = totalPages;
        this.finalFileSize.textContent = this.formatFileSize(this.mergedPdfBytes.length);
        
        this.showSection('resultsSection');
    }

    downloadMergedPDF() {
        if (!this.mergedPdfBytes) {
            this.showError('No merged PDF available for download.');
            return;
        }

        const blob = new Blob([this.mergedPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `merged-pdf-${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async previewMergedPDF() {
        if (!this.mergedPdfBytes) {
            this.showError('No merged PDF available for preview.');
            return;
        }

        const blob = new Blob([this.mergedPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }

    clearAllFiles() {
        this.files = [];
        this.updateFileList();
        this.hideSection('fileListSection');
        this.hideSection('optionsSection');
        this.hideSection('previewSection');
    }

    startOver() {
        this.clearAllFiles();
        this.mergedPdfBytes = null;
        this.previewPages = [];
        this.currentPreviewPage = 0;
        this.hideAllSections();
        this.fileInput.value = '';
    }

    readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(file);
        });
    }

    updateProgress(percentage, message = '') {
        this.progressFill.style.width = `${percentage}%`;
        this.progressText.textContent = `${Math.round(percentage)}%`;
        if (message) {
            this.processingDescription.textContent = message;
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

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

    hideAllSections() {
        ['fileListSection', 'optionsSection', 'previewSection', 'processingSection', 'resultsSection', 'errorSection'].forEach(id => {
            this.hideSection(id);
        });
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.hideAllSections();
        this.showSection('errorSection');
    }
}

// Initialize the PDF Merger when the page loads
let merger;
document.addEventListener('DOMContentLoaded', () => {
    merger = new PDFMerger();
    // Make merger globally accessible for inline event handlers
    window.merger = merger;
});
