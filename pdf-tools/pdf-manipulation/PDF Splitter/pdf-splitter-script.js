class PDFSplitter {    constructor() {
        console.log('PDFSplitter constructor started');
        this.pdfFile = null;
        this.pdfDocument = null;
        this.pdfBytes = null;
        this.pdfJsDocument = null; // Add PDF.js document reference
        this.currentPage = 1;
        this.totalPages = 0;
        this.zoomLevel = 1;
        this.splitFiles = [];
        
        this.initializeElements();
        this.attachEventListeners();
        this.initializePDFJS();
        console.log('PDFSplitter constructor completed');
    }

    initializeElements() {
        // Main sections
        this.uploadSection = document.querySelector('.upload-section');
        this.fileInfoSection = document.getElementById('fileInfoSection');
        this.splitOptionsSection = document.getElementById('splitOptionsSection');
        this.pagePreviewSection = document.getElementById('pagePreviewSection');
        this.processingSection = document.getElementById('processingSection');
        this.resultsSection = document.getElementById('resultsSection');
        this.errorSection = document.getElementById('errorSection');

        // Upload elements
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.browseButton = document.getElementById('browseButton');

        // File info elements
        this.fileName = document.getElementById('fileName');
        this.fileSize = document.getElementById('fileSize');
        this.totalPagesElement = document.getElementById('totalPages');
        this.changeFileButton = document.getElementById('changeFileButton');
        this.previewPagesButton = document.getElementById('previewPagesButton');

        // Split options elements
        this.splitModeRadios = document.querySelectorAll('input[name="splitMode"]');
        this.rangeOptions = document.getElementById('rangeOptions');
        this.intervalOptions = document.getElementById('intervalOptions');
        this.rangeInputs = document.getElementById('rangeInputs');
        this.addRangeButton = document.getElementById('addRangeButton');
        this.pagesPerFileInput = document.getElementById('pagesPerFile');
        this.fileNamePrefixInput = document.getElementById('fileNamePrefix');
        this.includePageNumbersCheckbox = document.getElementById('includePageNumbers');
        this.downloadAsZipCheckbox = document.getElementById('downloadAsZip');
        this.validateRangesButton = document.getElementById('validateRangesButton');
        this.splitButton = document.getElementById('splitButton');        // Preview elements
        this.previewCanvas = document.getElementById('previewCanvas');
        this.pageInfo = document.getElementById('pageInfo');
        this.firstPageButton = document.getElementById('firstPageButton');
        this.prevPageButton = document.getElementById('prevPageButton');
        this.nextPageButton = document.getElementById('nextPageButton');
        this.lastPageButton = document.getElementById('lastPageButton');
        this.zoomInfo = document.getElementById('zoomInfo');
        this.zoomOutButton = document.getElementById('zoomOutButton');
        this.zoomInButton = document.getElementById('zoomInButton');
        this.fullscreenButton = document.getElementById('fullscreenButton');
        this.closePreviewButton = document.getElementById('closePreviewButton');

        // Processing elements
        this.processingTitle = document.getElementById('processingTitle');
        this.processingDescription = document.getElementById('processingDescription');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');

        // Results elements
        this.filesCreated = document.getElementById('filesCreated');
        this.totalPagesProcessed = document.getElementById('totalPagesProcessed');
        this.totalSizeElement = document.getElementById('totalSize');
        this.downloadAllButton = document.getElementById('downloadAllButton');
        this.downloadIndividualButton = document.getElementById('downloadIndividualButton');
        this.fileListContainer = document.getElementById('fileListContainer');
        this.splitFileList = document.getElementById('splitFileList');
        this.splitAnotherButton = document.getElementById('splitAnotherButton');        // Error elements
        this.errorMessage = document.getElementById('errorMessage');
        this.retryButton = document.getElementById('retryButton');
        this.backToStartButton = document.getElementById('backToStartButton');
        
        // Validate critical elements exist
        const criticalElements = [
            { name: 'fileInput', element: this.fileInput },
            { name: 'previewCanvas', element: this.previewCanvas },
            { name: 'downloadAllButton', element: this.downloadAllButton }
        ];
        
        criticalElements.forEach(({ name, element }) => {
            if (!element) {
                console.warn(`Critical element missing: ${name}`);
            }
        });
    }    initializePDFJS() {
        if (typeof pdfjsLib !== 'undefined') {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            console.log('PDF.js initialized successfully');
        } else {
            console.warn('PDF.js library not found - preview functionality will not work');
        }
    }attachEventListeners() {
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
            this.handleFileSelection(e.target.files[0]);
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
            const file = e.dataTransfer.files[0];
            if (file && file.type === 'application/pdf') {
                this.handleFileSelection(file);
            }
        });

        // File info controls
        this.changeFileButton.addEventListener('click', () => this.changeFile());
        this.previewPagesButton.addEventListener('click', () => this.showPagePreview());

        // Split mode controls
        this.splitModeRadios.forEach(radio => {
            radio.addEventListener('change', () => this.handleSplitModeChange());
        });

        this.addRangeButton.addEventListener('click', () => this.addRangeInput());
        this.validateRangesButton.addEventListener('click', () => this.validateRanges());
        this.splitButton.addEventListener('click', () => this.splitPDF());        // Preview controls
        if (this.firstPageButton) {
            this.firstPageButton.addEventListener('click', () => {
                console.log('First page button clicked');
                this.goToPage(1);
            });
        }
        if (this.prevPageButton) {
            this.prevPageButton.addEventListener('click', () => {
                console.log('Previous page button clicked');
                this.goToPage(this.currentPage - 1);
            });
        }
        if (this.nextPageButton) {
            this.nextPageButton.addEventListener('click', () => {
                console.log('Next page button clicked');
                this.goToPage(this.currentPage + 1);
            });
        }
        if (this.lastPageButton) {
            this.lastPageButton.addEventListener('click', () => {
                console.log('Last page button clicked');
                this.goToPage(this.totalPages);
            });
        }        if (this.zoomOutButton) {
            this.zoomOutButton.addEventListener('click', () => {
                console.log('Zoom out button clicked');
                this.changeZoom(-0.2);
            });
        }
        if (this.zoomInButton) {
            this.zoomInButton.addEventListener('click', () => {
                console.log('Zoom in button clicked');
                this.changeZoom(0.2);
            });
        }
        if (this.fullscreenButton) {
            this.fullscreenButton.addEventListener('click', () => this.toggleFullscreen());
        }
        if (this.closePreviewButton) {
            this.closePreviewButton.addEventListener('click', () => this.closePagePreview());
        }        // Results controls
        this.downloadAllButton.addEventListener('click', () => this.downloadAllFiles());
        this.downloadIndividualButton.addEventListener('click', () => this.toggleIndividualDownloads());
        this.splitAnotherButton.addEventListener('click', () => this.startOver());// Error controls
        this.retryButton.addEventListener('click', () => this.splitPDF());
        this.backToStartButton.addEventListener('click', () => this.startOver());

        // Fullscreen change event
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('msfullscreenchange', () => this.handleFullscreenChange());
    }    async handleFileSelection(file) {
        if (!file || file.type !== 'application/pdf') {
            this.showError('Please select a valid PDF file.');
            return;
        }

        if (file.size > 100 * 1024 * 1024) { // 100MB limit
            this.showError('File size too large. Please select a PDF file smaller than 100MB.');
            return;
        }

        this.pdfFile = file;
        this.showSection('processingSection');
        this.updateProgress(0, 'Loading PDF...');

        try {
            this.pdfBytes = await this.readFileAsArrayBuffer(file);
            this.pdfDocument = await PDFLib.PDFDocument.load(this.pdfBytes);
            this.totalPages = this.pdfDocument.getPageCount();

            // Also load PDF.js document for preview
            if (typeof pdfjsLib !== 'undefined') {
                console.log('Loading PDF.js document for preview...');
                const loadingTask = pdfjsLib.getDocument({ data: this.pdfBytes });
                this.pdfJsDocument = await loadingTask.promise;
                console.log('PDF.js document loaded successfully');
            }

            // Update file info
            this.fileName.textContent = file.name;
            this.fileSize.textContent = this.formatFileSize(file.size);
            this.totalPagesElement.textContent = this.totalPages;

            this.hideSection('processingSection');
            this.showSection('fileInfoSection');
            this.showSection('splitOptionsSection');

            // Set default values
            this.pagesPerFileInput.value = Math.min(5, this.totalPages);
            this.pagesPerFileInput.max = this.totalPages;

        } catch (error) {
            this.hideSection('processingSection');
            this.showError('Failed to load PDF: ' + error.message);
            console.error('PDF loading error:', error);
        }
    }

    handleSplitModeChange() {
        const selectedMode = document.querySelector('input[name="splitMode"]:checked').value;
        
        this.hideSection('rangeOptions');
        this.hideSection('intervalOptions');

        if (selectedMode === 'ranges') {
            this.showSection('rangeOptions');
        } else if (selectedMode === 'intervals') {
            this.showSection('intervalOptions');
        }
    }

    addRangeInput() {
        const rangeCount = this.rangeInputs.children.length;
        if (rangeCount >= 10) {
            this.showError('Maximum 10 ranges allowed.');
            return;
        }

        const rangeInputGroup = document.createElement('div');
        rangeInputGroup.className = 'range-input-group';
        rangeInputGroup.innerHTML = `
            <label>Range ${rangeCount + 1}:</label>
            <input type="text" placeholder="e.g., 1-5" class="range-input">
            <button type="button" class="remove-range" onclick="this.parentElement.remove()">×</button>
        `;

        this.rangeInputs.appendChild(rangeInputGroup);
    }

    validateRanges() {
        const selectedMode = document.querySelector('input[name="splitMode"]:checked').value;
        
        if (selectedMode === 'ranges') {
            const ranges = this.parseRanges();
            if (ranges.length === 0) {
                this.showError('Please specify at least one valid range.');
                return;
            }

            let isValid = true;
            let errorMessage = '';

            for (const range of ranges) {
                if (range.start < 1 || range.end > this.totalPages || range.start > range.end) {
                    isValid = false;
                    errorMessage = `Invalid range: ${range.start}-${range.end}. Page numbers must be between 1 and ${this.totalPages}.`;
                    break;
                }
            }

            if (isValid) {
                alert(`✅ All ranges are valid! Total pages to extract: ${ranges.reduce((sum, range) => sum + (range.end - range.start + 1), 0)}`);
            } else {
                this.showError(errorMessage);
            }
        } else {
            alert('✅ Split configuration is valid!');
        }
    }

    parseRanges() {
        const ranges = [];
        const rangeInputs = this.rangeInputs.querySelectorAll('.range-input');

        rangeInputs.forEach(input => {
            const value = input.value.trim();
            if (!value) return;

            if (value.includes('-')) {
                const [start, end] = value.split('-').map(s => s.trim());
                const startPage = parseInt(start) || 1;
                const endPage = end === '' ? this.totalPages : (parseInt(end) || this.totalPages);
                ranges.push({ start: startPage, end: endPage });
            } else {
                const page = parseInt(value);
                if (page && page >= 1 && page <= this.totalPages) {
                    ranges.push({ start: page, end: page });
                }
            }
        });

        return ranges;
    }    async showPagePreview() {
        console.log('Initializing page preview...', {
            hasPdfDocument: !!this.pdfDocument,
            hasPdfJsDocument: !!this.pdfJsDocument,
            totalPages: this.totalPages
        });
        
        if (!this.pdfDocument) {
            this.showError('No PDF loaded for preview.');
            return;
        }

        if (!this.pdfJsDocument) {
            this.showError('PDF preview not available. Please reload the file.');
            return;
        }

        if (this.totalPages === 0) {
            this.showError('PDF has no pages to preview.');
            return;
        }

        // Reset to first page
        this.currentPage = 1;
        this.zoomLevel = 1;
        
        console.log('Showing preview section...');
        this.showSection('pagePreviewSection');
        
        // Wait a bit for the section to be visible before rendering
        setTimeout(async () => {
            console.log('Starting page render...');
            await this.renderPreviewPage();
        }, 100);
    }    async renderPreviewPage() {
        console.log('Rendering preview page...', {
            currentPage: this.currentPage,
            zoomLevel: this.zoomLevel,
            hasPdfDocument: !!this.pdfDocument,
            hasPdfJsDocument: !!this.pdfJsDocument,
            hasPdfjsLib: typeof pdfjsLib !== 'undefined',
            hasCanvas: !!this.previewCanvas
        });
        
        if (!this.previewCanvas) {
            console.error('Preview canvas not found');
            return;
        }
        
        if (!this.pdfJsDocument) {
            console.error('No PDF.js document available for preview rendering');
            this.showPreviewError('PDF preview not available. Please reload the file.');
            return;
        }

        try {
            if (this.currentPage < 1 || this.currentPage > this.pdfJsDocument.numPages) {
                console.error('Invalid page number:', this.currentPage);
                this.showPreviewError(`Invalid page number: ${this.currentPage}`);
                return;
            }
            
            console.log(`Getting page ${this.currentPage} from PDF.js document...`);
            const page = await this.pdfJsDocument.getPage(this.currentPage);
            
            const viewport = page.getViewport({ scale: this.zoomLevel });
            const canvas = this.previewCanvas;
            const context = canvas.getContext('2d');

            // Set canvas dimensions
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            // Clear canvas with white background
            context.fillStyle = 'white';
            context.fillRect(0, 0, canvas.width, canvas.height);

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            console.log('Starting page render...');
            await page.render(renderContext).promise;
            console.log('Page rendered successfully');

            this.updatePreviewControls();

        } catch (error) {
            console.error('Failed to render preview page:', error);
            this.showPreviewError(`Error loading page: ${error.message}`);
        }
    }

    showPreviewError(message) {
        const canvas = this.previewCanvas;
        const context = canvas.getContext('2d');
        canvas.width = 500;
        canvas.height = 300;
        
        // Clear canvas
        context.fillStyle = '#f8f9fa';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw border
        context.strokeStyle = '#dee2e6';
        context.lineWidth = 2;
        context.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
        
        // Draw error message
        context.fillStyle = '#dc3545';
        context.font = '16px Arial';
        context.textAlign = 'center';
        context.fillText(message, canvas.width / 2, canvas.height / 2 - 10);
        
        // Draw instruction
        context.fillStyle = '#6c757d';
        context.font = '14px Arial';
        context.fillText('Try reloading the file or selecting a different PDF', canvas.width / 2, canvas.height / 2 + 15);
        
        this.updatePreviewControls();
    }updatePreviewControls() {
        console.log('Updating preview controls...', {
            currentPage: this.currentPage,
            totalPages: this.totalPages,
            zoomLevel: this.zoomLevel
        });
        
        if (this.pageInfo) {
            this.pageInfo.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
        }
        if (this.zoomInfo) {
            this.zoomInfo.textContent = `${Math.round(this.zoomLevel * 100)}%`;
        }

        // Update navigation button states
        if (this.firstPageButton) {
            this.firstPageButton.disabled = this.currentPage === 1;
        }
        if (this.prevPageButton) {
            this.prevPageButton.disabled = this.currentPage === 1;
        }
        if (this.nextPageButton) {
            this.nextPageButton.disabled = this.currentPage === this.totalPages;
        }
        if (this.lastPageButton) {
            this.lastPageButton.disabled = this.currentPage === this.totalPages;
        }

        // Update zoom button states
        if (this.zoomOutButton) {
            this.zoomOutButton.disabled = this.zoomLevel <= 0.5;
        }
        if (this.zoomInButton) {
            this.zoomInButton.disabled = this.zoomLevel >= 3;
        }
        
        console.log('Preview controls updated successfully');
    }goToPage(pageNumber) {
        console.log(`Navigating to page ${pageNumber}, current page: ${this.currentPage}, total pages: ${this.totalPages}`);
        
        if (!this.totalPages || this.totalPages === 0) {
            console.warn('No pages available for navigation');
            return;
        }
        
        // Ensure page number is within valid range
        if (pageNumber >= 1 && pageNumber <= this.totalPages && pageNumber !== this.currentPage) {
            this.currentPage = pageNumber;
            console.log(`Page changed to: ${this.currentPage}`);
            this.renderPreviewPage();
        } else {
            console.warn(`Invalid page number: ${pageNumber}. Valid range: 1-${this.totalPages}`);
        }
    }    changeZoom(delta) {
        const newZoom = Math.max(0.5, Math.min(3, this.zoomLevel + delta));
        console.log(`Changing zoom from ${this.zoomLevel} to ${newZoom} (delta: ${delta})`);
        
        if (newZoom !== this.zoomLevel) {
            this.zoomLevel = newZoom;
            console.log(`Zoom level changed to: ${this.zoomLevel}`);
            this.renderPreviewPage();
        } else {
            console.log('Zoom level unchanged (at limit)');
        }
    }closePagePreview() {
        this.hideSection('pagePreviewSection');
    }

    toggleFullscreen() {
        const previewSection = document.getElementById('pagePreviewSection');
        
        if (!document.fullscreenElement) {
            // Enter fullscreen
            if (previewSection.requestFullscreen) {
                previewSection.requestFullscreen();
            } else if (previewSection.webkitRequestFullscreen) {
                previewSection.webkitRequestFullscreen();
            } else if (previewSection.msRequestFullscreen) {
                previewSection.msRequestFullscreen();
            }
            this.fullscreenButton.innerHTML = '⛶ Exit Fullscreen';
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }            this.fullscreenButton.innerHTML = '⛶ Fullscreen';
        }
    }

    handleFullscreenChange() {
        if (!document.fullscreenElement) {
            this.fullscreenButton.innerHTML = '⛶ Fullscreen';
        } else {
            this.fullscreenButton.innerHTML = '⛶ Exit Fullscreen';
        }
    }

    async splitPDF() {
        if (!this.pdfDocument) {
            this.showError('No PDF loaded for splitting.');
            return;
        }

        const selectedMode = document.querySelector('input[name="splitMode"]:checked').value;
        
        this.showSection('processingSection');
        this.updateProgress(0, 'Preparing to split PDF...');

        try {
            this.splitFiles = [];
            
            if (selectedMode === 'individual') {
                await this.splitIntoIndividualPages();
            } else if (selectedMode === 'ranges') {
                await this.splitIntoRanges();
            } else if (selectedMode === 'intervals') {
                await this.splitIntoIntervals();
            }

            this.hideSection('processingSection');
            this.showResults();

        } catch (error) {
            this.hideSection('processingSection');
            this.showError('Failed to split PDF: ' + error.message);
            console.error('Split error:', error);
        }
    }

    async splitIntoIndividualPages() {
        const prefix = this.fileNamePrefixInput.value || 'page';
        const includePageNumbers = this.includePageNumbersCheckbox.checked;

        for (let i = 1; i <= this.totalPages; i++) {
            this.updateProgress((i / this.totalPages) * 100, `Creating page ${i} of ${this.totalPages}...`);

            const newPdf = await PDFLib.PDFDocument.create();
            const [copiedPage] = await newPdf.copyPages(this.pdfDocument, [i - 1]);
            newPdf.addPage(copiedPage);

            const pdfBytes = await newPdf.save();
            const fileName = includePageNumbers ? `${prefix}_${i}.pdf` : `${prefix}_${Date.now()}_${i}.pdf`;

            this.splitFiles.push({
                name: fileName,
                bytes: pdfBytes,
                pages: `Page ${i}`,
                size: pdfBytes.length
            });
        }
    }

    async splitIntoRanges() {
        const ranges = this.parseRanges();
        if (ranges.length === 0) {
            throw new Error('No valid ranges specified.');
        }

        const prefix = this.fileNamePrefixInput.value || 'pages';
        const includePageNumbers = this.includePageNumbersCheckbox.checked;

        for (let i = 0; i < ranges.length; i++) {
            const range = ranges[i];
            this.updateProgress((i / ranges.length) * 100, `Creating range ${i + 1} of ${ranges.length}...`);

            const newPdf = await PDFLib.PDFDocument.create();
            const pageIndices = [];
            for (let page = range.start; page <= range.end; page++) {
                pageIndices.push(page - 1);
            }

            const copiedPages = await newPdf.copyPages(this.pdfDocument, pageIndices);
            copiedPages.forEach(page => newPdf.addPage(page));

            const pdfBytes = await newPdf.save();
            const rangeText = range.start === range.end ? `${range.start}` : `${range.start}-${range.end}`;
            const fileName = includePageNumbers ? 
                `${prefix}_${rangeText}.pdf` : 
                `${prefix}_range_${i + 1}.pdf`;

            this.splitFiles.push({
                name: fileName,
                bytes: pdfBytes,
                pages: `Pages ${rangeText}`,
                size: pdfBytes.length
            });
        }
    }

    async splitIntoIntervals() {
        const pagesPerFile = parseInt(this.pagesPerFileInput.value) || 5;
        const prefix = this.fileNamePrefixInput.value || 'chunk';
        const includePageNumbers = this.includePageNumbersCheckbox.checked;

        const totalChunks = Math.ceil(this.totalPages / pagesPerFile);

        for (let chunk = 0; chunk < totalChunks; chunk++) {
            this.updateProgress((chunk / totalChunks) * 100, `Creating chunk ${chunk + 1} of ${totalChunks}...`);

            const startPage = chunk * pagesPerFile + 1;
            const endPage = Math.min(startPage + pagesPerFile - 1, this.totalPages);

            const newPdf = await PDFLib.PDFDocument.create();
            const pageIndices = [];
            for (let page = startPage; page <= endPage; page++) {
                pageIndices.push(page - 1);
            }

            const copiedPages = await newPdf.copyPages(this.pdfDocument, pageIndices);
            copiedPages.forEach(page => newPdf.addPage(page));

            const pdfBytes = await newPdf.save();
            const rangeText = startPage === endPage ? `${startPage}` : `${startPage}-${endPage}`;
            const fileName = includePageNumbers ? 
                `${prefix}_${rangeText}.pdf` : 
                `${prefix}_${chunk + 1}.pdf`;

            this.splitFiles.push({
                name: fileName,
                bytes: pdfBytes,
                pages: `Pages ${rangeText}`,
                size: pdfBytes.length
            });
        }
    }

    showResults() {
        const totalPages = this.splitFiles.reduce((sum, file) => sum + (file.pages.includes('-') ? 
            parseInt(file.pages.split('-')[1]) - parseInt(file.pages.split('-')[0]) + 1 : 1), 0);
        const totalSize = this.splitFiles.reduce((sum, file) => sum + file.size, 0);

        this.filesCreated.textContent = this.splitFiles.length;
        this.totalPagesProcessed.textContent = totalPages;
        this.totalSizeElement.textContent = this.formatFileSize(totalSize);

        this.updateSplitFileList();
        this.showSection('resultsSection');
    }    updateSplitFileList() {
        this.splitFileList.innerHTML = '';

        // Add a "Download All Individual" button at the top
        const downloadAllIndividualBtn = document.createElement('button');
        downloadAllIndividualBtn.type = 'button';
        downloadAllIndividualBtn.className = 'btn btn-primary download-all-individual-btn';
        downloadAllIndividualBtn.innerHTML = '📂 Download All Individual Files';
        downloadAllIndividualBtn.addEventListener('click', () => this.downloadAllIndividualFiles());
        this.splitFileList.appendChild(downloadAllIndividualBtn);

        // Add individual file items
        this.splitFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'split-file-item';
            fileItem.innerHTML = `
                <div class="file-item-info">
                    <div class="file-item-name">${file.name}</div>
                    <div class="file-item-details">${file.pages} • ${this.formatFileSize(file.size)}</div>
                </div>
                <button type="button" class="file-download-btn" onclick="splitter.downloadIndividualFile(${index})">
                    Download
                </button>
            `;
            this.splitFileList.appendChild(fileItem);
        });
    }

    downloadIndividualFile(index) {
        if (index >= 0 && index < this.splitFiles.length) {
            const file = this.splitFiles[index];
            this.downloadBlob(file.bytes, file.name);
        }
    }    async downloadAllFiles() {
        // Always download as ZIP when this button is clicked
        await this.downloadAsZip();
    }

    async downloadAllIndividualFiles() {
        // Download files individually with a delay to prevent browser blocking
        for (let i = 0; i < this.splitFiles.length; i++) {
            setTimeout(() => {
                this.downloadBlob(this.splitFiles[i].bytes, this.splitFiles[i].name);
            }, i * 200); // 200ms delay between downloads
        }
    }    async downloadAsZip() {
        try {
            console.log('Starting ZIP download process...', { fileCount: this.splitFiles.length });
            
            if (this.splitFiles.length === 0) {
                throw new Error('No split files available for download');
            }

            if (typeof JSZip === 'undefined') {
                throw new Error('JSZip library not loaded');
            }

            this.showSection('processingSection');
            this.updateProgress(0, 'Creating ZIP archive...');
            
            const zip = new JSZip();
            
            // Add each split file to the ZIP
            this.splitFiles.forEach((file, index) => {
                console.log(`Adding file ${index + 1}/${this.splitFiles.length}: ${file.name}`);
                zip.file(file.name, file.bytes);
                this.updateProgress(((index + 1) / this.splitFiles.length) * 80, `Adding ${file.name} to ZIP...`);
            });
            
            this.updateProgress(90, 'Generating ZIP file...');
            
            // Generate the ZIP file
            const zipBlob = await zip.generateAsync({ 
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: {
                    level: 6
                }
            });
            
            this.updateProgress(100, 'ZIP file ready!');
            
            // Download the ZIP
            const originalFileName = this.pdfFile.name.replace(/\.pdf$/i, '');
            const zipFileName = `${originalFileName}_split.zip`;
            
            console.log(`Downloading ZIP file: ${zipFileName}, size: ${zipBlob.size} bytes`);
            this.downloadBlob(zipBlob, zipFileName);
            
            // Show success message
            setTimeout(() => {
                this.hideSection('processingSection');
                this.updateProgress(0, '');
            }, 1000);
            
        } catch (error) {
            console.error('Error creating ZIP:', error);
            this.hideSection('processingSection');
            this.showError('Failed to create ZIP file: ' + error.message);
        }
    }toggleIndividualDownloads() {
        const isVisible = this.fileListContainer.style.display !== 'none';
        this.fileListContainer.style.display = isVisible ? 'none' : 'block';
        this.downloadIndividualButton.textContent = isVisible ? 
            'Download Individual Files' : 'Hide Individual Files';
    }downloadBlob(data, fileName) {
        let blob;
        if (data instanceof Blob) {
            blob = data;
        } else {
            blob = new Blob([data], { type: 'application/pdf' });
        }
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    changeFile() {
        this.fileInput.click();
    }    startOver() {
        this.pdfFile = null;
        this.pdfDocument = null;
        this.pdfBytes = null;
        this.pdfJsDocument = null; // Reset PDF.js document
        this.splitFiles = [];
        this.currentPage = 1;
        this.zoomLevel = 1;
        
        this.hideAllSections();
        this.fileInput.value = '';
        
        // Reset form values
        document.querySelector('input[name="splitMode"][value="individual"]').checked = true;
        this.rangeInputs.innerHTML = `
            <div class="range-input-group">
                <label>Range 1:</label>
                <input type="text" placeholder="e.g., 1-5" class="range-input">
                <button type="button" class="remove-range">×</button>
            </div>
        `;
        this.pagesPerFileInput.value = 5;
        this.fileNamePrefixInput.value = 'page';
        this.includePageNumbersCheckbox.checked = true;
        this.downloadAsZipCheckbox.checked = false;
        
        this.handleSplitModeChange();
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
        ['fileInfoSection', 'splitOptionsSection', 'pagePreviewSection', 'processingSection', 'resultsSection', 'errorSection'].forEach(id => {
            this.hideSection(id);
        });
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.hideAllSections();
        this.showSection('errorSection');
    }
}

// Initialize the PDF Splitter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing PDF Splitter...');
    
    // Check if required libraries are loaded
    const requiredLibraries = [
        { name: 'PDFLib', check: () => typeof PDFLib !== 'undefined' },
        { name: 'pdfjsLib', check: () => typeof pdfjsLib !== 'undefined' },
        { name: 'JSZip', check: () => typeof JSZip !== 'undefined' }
    ];
    
    const missingLibraries = requiredLibraries.filter(lib => !lib.check());
    
    if (missingLibraries.length > 0) {
        console.error('Missing required libraries:', missingLibraries.map(lib => lib.name));
        const errorMessage = `Missing required libraries: ${missingLibraries.map(lib => lib.name).join(', ')}. Please refresh the page.`;
        
        // Show error in the UI
        setTimeout(() => {
            const container = document.querySelector('.container');
            if (container) {
                const errorDiv = document.createElement('div');
                errorDiv.style.cssText = `
                    background: #f8d7da;
                    color: #721c24;
                    padding: 15px;
                    margin: 20px;
                    border: 1px solid #f5c6cb;
                    border-radius: 8px;
                    text-align: center;
                    font-weight: bold;
                `;
                errorDiv.innerHTML = `⚠️ ${errorMessage}`;
                container.insertBefore(errorDiv, container.firstChild);
            }
        }, 1000);
    }
    
    try {
        const splitter = new PDFSplitter();
        // Make splitter globally accessible for inline event handlers
        window.splitter = splitter;
        console.log('PDF Splitter initialized successfully');
          // Add global debug function
        window.debugSplitter = () => {
            console.log('PDF Splitter Debug Info:', {
                hasPdfDocument: !!splitter.pdfDocument,
                hasPdfJsDocument: !!splitter.pdfJsDocument,
                currentPage: splitter.currentPage,
                totalPages: splitter.totalPages,
                zoomLevel: splitter.zoomLevel,
                splitFilesCount: splitter.splitFiles.length,
                previewSectionVisible: splitter.pagePreviewSection ? splitter.pagePreviewSection.style.display : 'unknown',
                librariesLoaded: {
                    PDFLib: typeof PDFLib !== 'undefined',
                    pdfjsLib: typeof pdfjsLib !== 'undefined',
                    JSZip: typeof JSZip !== 'undefined'
                }
            });
        };
        
        // Add test function to reload preview
        window.testPreview = () => {
            if (splitter.pdfJsDocument && splitter.currentPage) {
                console.log('Testing preview reload...');
                splitter.renderPreviewPage();
            } else {
                console.log('No PDF loaded for preview test');
            }
        };
        
    } catch (error) {
        console.error('Failed to initialize PDF Splitter:', error);
    }
});
