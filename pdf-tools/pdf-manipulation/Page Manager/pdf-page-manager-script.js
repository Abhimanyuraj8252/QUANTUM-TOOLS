// PDF Page Manager Script
class PDFPageManager {
    constructor() {
        this.pdfDoc = null;
        this.pages = [];
        this.selectedPages = new Set();
        this.undoStack = [];
        this.redoStack = [];
        this.draggedElement = null;
        this.currentPreviewPage = 0;        this.originalFile = null;
        this.thumbnailSize = 'medium';
        this.viewMode = 'grid';
        this.currentZoom = 1.0;
        
        this.initializeElements();
        this.bindEvents();
        this.setupPDFJS();
    }    initializeElements() {
        // Upload elements
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.browseButton = document.getElementById('browseButton');
        
        // Section elements
        this.toolbarSection = document.getElementById('toolbarSection');
        this.pageManagerSection = document.getElementById('pageManagerSection');
        this.processingSection = document.getElementById('processingSection');
        this.resultsSection = document.getElementById('resultsSection');
        this.errorSection = document.getElementById('errorSection');
        
        // Toolbar elements
        this.fileName = document.getElementById('fileName');
        this.pageCount = document.getElementById('pageCount');
        this.thumbnailSizeSelect = document.getElementById('thumbnailSize');
        this.viewModeSelect = document.getElementById('viewMode');
        
        // Action buttons
        this.selectAllButton = document.getElementById('selectAllButton');
        this.deselectAllButton = document.getElementById('deselectAllButton');
        this.deleteSelectedButton = document.getElementById('deleteSelectedButton');
        this.rotateSelectedButton = document.getElementById('rotateSelectedButton');
        this.addPagesButton = document.getElementById('addPagesButton');
        this.duplicatePageButton = document.getElementById('duplicatePageButton');
        this.undoButton = document.getElementById('undoButton');
        this.redoButton = document.getElementById('redoButton');
        this.previewButton = document.getElementById('previewButton');
        this.saveButton = document.getElementById('saveButton');
        
        // Manager elements
        this.pageGrid = document.getElementById('pageGrid');
        this.selectionInfo = document.getElementById('selectionInfo');
        this.totalPagesInfo = document.getElementById('totalPagesInfo');
        
        // New selection control buttons
        this.selectAllPagesButton = document.getElementById('selectAllPagesButton');
        this.deselectAllPagesButton = document.getElementById('deselectAllPagesButton');
        this.invertSelectionButton = document.getElementById('invertSelectionButton');
        
        // Context menu
        this.contextMenu = document.getElementById('contextMenu');
        
        // Preview modal
        this.previewModal = document.getElementById('previewModal');
        this.modalOverlay = document.getElementById('modalOverlay');
        this.closeModalButton = document.getElementById('closeModalButton');
        this.previewCanvas = document.getElementById('previewCanvas');
        this.previewTitle = document.getElementById('previewTitle');
        this.previewInfo = document.getElementById('previewInfo');
        this.prevPreviewButton = document.getElementById('prevPreviewButton');
        this.nextPreviewButton = document.getElementById('nextPreviewButton');
        this.rotatePreviewLeftButton = document.getElementById('rotatePreviewLeftButton');
        this.rotatePreviewRightButton = document.getElementById('rotatePreviewRightButton');
        this.deletePreviewPageButton = document.getElementById('deletePreviewPageButton');
        
        // New preview modal elements
        this.previewPageCheckbox = document.getElementById('previewPageCheckbox');
        this.zoomInButton = document.getElementById('zoomInButton');
        this.zoomOutButton = document.getElementById('zoomOutButton');
        this.fitToScreenButton = document.getElementById('fitToScreenButton');
        this.zoomLevel = document.getElementById('zoomLevel');
        this.duplicatePreviewPageButton = document.getElementById('duplicatePreviewPageButton');
        
        // Results elements
        this.finalPageCount = document.getElementById('finalPageCount');
        this.pagesModified = document.getElementById('pagesModified');
        this.finalFileSize = document.getElementById('finalFileSize');
        this.downloadButton = document.getElementById('downloadButton');
        this.previewFinalButton = document.getElementById('previewFinalButton');
        this.editAnotherButton = document.getElementById('editAnotherButton');
        
        // Processing elements
        this.processingTitle = document.getElementById('processingTitle');
        this.processingDescription = document.getElementById('processingDescription');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        
        // Error elements
        this.errorMessage = document.getElementById('errorMessage');
        this.retryButton = document.getElementById('retryButton');
        this.backToStartButton = document.getElementById('backToStartButton');
        
        // Check for missing critical elements
        const criticalElements = [
            'uploadArea', 'fileInput', 'pageGrid', 'processingSection', 'errorSection'
        ];
        
        for (const elementName of criticalElements) {
            if (!this[elementName]) {
                console.error(`Critical element missing: ${elementName}`);
                throw new Error(`Required element '${elementName}' not found in the DOM`);
            }
        }
    }setupPDFJS() {
        if (typeof pdfjsLib !== 'undefined') {
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        } else {
            console.warn('PDF.js library not loaded');
        }
    }    bindEvents() {
        try {
            // File upload events
            if (this.uploadArea && this.fileInput && this.browseButton) {
                this.uploadArea.addEventListener('click', (e) => {
                    if (e.target !== this.browseButton) {
                        this.fileInput.click();
                    }
                });
                
                this.browseButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.fileInput.click();
                });
                
                this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
                
                // Drag and drop events
                this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
                this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
            }
            
            // Toolbar events
            if (this.thumbnailSizeSelect) {
                this.thumbnailSizeSelect.addEventListener('change', (e) => this.changeThumbnailSize(e.target.value));
            }
            if (this.viewModeSelect) {
                this.viewModeSelect.addEventListener('change', (e) => this.changeViewMode(e.target.value));
            }
            
            // Action button events
            const actionButtons = [
                { element: this.selectAllButton, handler: () => this.selectAllPages() },
                { element: this.deselectAllButton, handler: () => this.deselectAllPages() },
                { element: this.deleteSelectedButton, handler: () => this.deleteSelectedPages() },
                { element: this.rotateSelectedButton, handler: () => this.rotateSelectedPages() },
                { element: this.addPagesButton, handler: () => this.addPages() },
                { element: this.duplicatePageButton, handler: () => this.duplicateSelectedPages() },
                { element: this.undoButton, handler: () => this.undo() },
                { element: this.redoButton, handler: () => this.redo() },
                { element: this.previewButton, handler: () => this.openPreview() },
                { element: this.saveButton, handler: () => this.savePDF() }
            ];
            
            actionButtons.forEach(({ element, handler }) => {
                if (element) {
                    element.addEventListener('click', handler);
                }
            });
            
            // New selection control events
            if (this.selectAllPagesButton) {
                this.selectAllPagesButton.addEventListener('click', () => this.selectAllPagesInManager());
            }
            if (this.deselectAllPagesButton) {
                this.deselectAllPagesButton.addEventListener('click', () => this.deselectAllPagesInManager());
            }
            if (this.invertSelectionButton) {
                this.invertSelectionButton.addEventListener('click', () => this.invertPageSelection());
            }
            
            // Context menu events
            if (this.contextMenu) {
                this.contextMenu.addEventListener('click', (e) => this.handleContextMenuClick(e));
                document.addEventListener('click', () => this.hideContextMenu());
            }
            
            // Preview modal events
            if (this.previewModal) {
                const previewEvents = [
                    { element: this.closeModalButton, handler: () => this.closePreview() },
                    { element: this.modalOverlay, handler: () => this.closePreview() },
                    { element: this.prevPreviewButton, handler: () => this.previousPreviewPage() },
                    { element: this.nextPreviewButton, handler: () => this.nextPreviewPage() },
                    { element: this.rotatePreviewLeftButton, handler: () => this.rotatePreviewPage(-90) },
                    { element: this.rotatePreviewRightButton, handler: () => this.rotatePreviewPage(90) },
                    { element: this.deletePreviewPageButton, handler: () => this.deletePreviewPage() },
                    { element: this.zoomInButton, handler: () => this.zoomIn() },
                    { element: this.zoomOutButton, handler: () => this.zoomOut() },
                    { element: this.fitToScreenButton, handler: () => this.fitToScreen() },
                    { element: this.duplicatePreviewPageButton, handler: () => this.duplicateCurrentPreviewPage() }
                ];
                
                previewEvents.forEach(({ element, handler }) => {
                    if (element) {
                        element.addEventListener('click', handler);
                    }
                });
                
                if (this.previewPageCheckbox) {
                    this.previewPageCheckbox.addEventListener('change', (e) => this.togglePreviewPageSelection(e));
                }
            }
            
            // Results events
            const resultEvents = [
                { element: this.downloadButton, handler: () => this.downloadFinalPDF() },
                { element: this.previewFinalButton, handler: () => this.previewFinalPDF() },
                { element: this.editAnotherButton, handler: () => this.resetToStart() }
            ];
            
            resultEvents.forEach(({ element, handler }) => {
                if (element) {
                    element.addEventListener('click', handler);
                }
            });
            
            // Error events
            if (this.retryButton) {
                this.retryButton.addEventListener('click', () => this.retryOperation());
            }
            if (this.backToStartButton) {
                this.backToStartButton.addEventListener('click', () => this.resetToStart());
            }
            
            // Keyboard events
            document.addEventListener('keydown', (e) => this.handleKeyDown(e));
            
        } catch (error) {
            console.error('Error binding events:', error);
            this.showError('Failed to initialize the application properly. Please refresh the page.');
        }
    }handleFileSelect(e) {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            this.loadPDF(file);
        } else {
            this.showNotification('Please select a valid PDF file.', 'error');
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('drag-over');
    }    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type === 'application/pdf') {
            this.loadPDF(files[0]);
        } else {
            this.showNotification('Please drop a valid PDF file.', 'error');
        }
    }async loadPDF(file) {
        try {
            this.showProcessing('Loading PDF...', 'Please wait while we analyze your document');
            this.originalFile = file;
            
            // Validate file size (100MB limit)
            if (file.size > 100 * 1024 * 1024) {
                throw new Error('File size exceeds 100MB limit. Please use a smaller file.');
            }
            
            const arrayBuffer = await file.arrayBuffer();
            
            // Test if PDF is valid
            try {
                this.pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
            } catch (pdfError) {
                throw new Error('Invalid or corrupted PDF file. Please select a valid PDF document.');
            }
            
            this.fileName.textContent = file.name;
            this.updateProgress(30, 'PDF loaded successfully. Generating thumbnails...');
            
            await this.generatePageThumbnails();
            this.updateProgress(100, 'Complete!');
              setTimeout(() => {
                this.hideProcessing();
                this.showPageManager();
                this.updatePageInfo();
                this.saveState();
                this.showNotification(`Successfully loaded ${this.pages.length} pages from ${file.name}`, 'success');
            }, 500);
            
        } catch (error) {
            console.error('Error loading PDF:', error);
            this.showError(error.message || 'Failed to load PDF. Please ensure the file is not corrupted.');
        }
    }    async generatePageThumbnails() {
        const arrayBuffer = await this.originalFile.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument(arrayBuffer);
        const pdf = await loadingTask.promise;
        
        // Store the PDF.js document for preview functionality
        this.pdfJsDoc = pdf;
        
        this.pages = [];
        this.pageGrid.innerHTML = '';
        
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            this.updateProgress((pageNum / pdf.numPages) * 90, `Generating thumbnail ${pageNum}/${pdf.numPages}...`);
            
            const page = await pdf.getPage(pageNum);
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            // Use higher scale for better quality thumbnails
            const scale = 1.5;
            const viewport = page.getViewport({ scale: scale });
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            
            // Render page to canvas with white background
            context.fillStyle = 'white';
            context.fillRect(0, 0, canvas.width, canvas.height);
            
            await page.render({ 
                canvasContext: context, 
                viewport: viewport,
                background: 'white'
            }).promise;
              const pageData = {
                id: this.generatePageId(),
                originalIndex: pageNum - 1,
                currentIndex: pageNum - 1,
                originalPageNum: pageNum,
                canvas: canvas,
                rotation: 0,
                deleted: false
            };

            this.pages.push(pageData);
            this.createPageThumbnail(pageData);
        }
        
        this.setupDragAndDrop();
    }

    generatePageId() {
        return 'page_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }    createPageThumbnail(pageData) {
        const pageElement = document.createElement('div');
        pageElement.className = `page-item ${this.viewMode}`;
        pageElement.dataset.pageId = pageData.id;
        pageElement.draggable = true;
        
        // Page selection checkbox
        const pageCheckbox = document.createElement('input');
        pageCheckbox.type = 'checkbox';
        pageCheckbox.className = 'page-checkbox';
        pageCheckbox.id = `checkbox_${pageData.id}`;
        
        const checkboxCustom = document.createElement('div');
        checkboxCustom.className = 'page-checkbox-custom';
        
        // Page number badge
        const pageNumber = document.createElement('div');
        pageNumber.className = 'page-number';
        pageNumber.textContent = pageData.currentIndex + 1;
        
        // Thumbnail container
        const thumbnailContainer = document.createElement('div');
        thumbnailContainer.className = 'page-thumbnail';
        
        // Create display canvas with proper sizing
        const displayCanvas = document.createElement('canvas');
        displayCanvas.className = 'page-canvas';
        
        // Scale down the original canvas for thumbnail display
        const thumbnailScale = 0.4;
        const originalCanvas = pageData.canvas;
        displayCanvas.width = originalCanvas.width * thumbnailScale;
        displayCanvas.height = originalCanvas.height * thumbnailScale;
        
        const displayContext = displayCanvas.getContext('2d');
        displayContext.fillStyle = 'white';
        displayContext.fillRect(0, 0, displayCanvas.width, displayCanvas.height);
        
        displayContext.scale(thumbnailScale, thumbnailScale);
        displayContext.drawImage(originalCanvas, 0, 0);
        
        thumbnailContainer.appendChild(displayCanvas);
        
        // Page actions
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'page-actions';
        
        const rotateBtn = document.createElement('button');
        rotateBtn.className = 'page-action-btn rotate';
        rotateBtn.innerHTML = '↻';
        rotateBtn.title = 'Rotate 90°';
        rotateBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.rotatePage(pageData.id, 90);
        });
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'page-action-btn delete';
        deleteBtn.innerHTML = '🗑';
        deleteBtn.title = 'Delete Page';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deletePage(pageData.id);
        });
        
        actionsDiv.appendChild(rotateBtn);
        actionsDiv.appendChild(deleteBtn);
        
        pageElement.appendChild(pageCheckbox);
        pageElement.appendChild(checkboxCustom);
        pageElement.appendChild(pageNumber);
        pageElement.appendChild(thumbnailContainer);
        pageElement.appendChild(actionsDiv);
        
        // Event listeners
        pageCheckbox.addEventListener('change', (e) => {
            e.stopPropagation();
            if (e.target.checked) {
                this.selectedPages.add(pageData.id);
                pageElement.classList.add('selected');
            } else {
                this.selectedPages.delete(pageData.id);
                pageElement.classList.remove('selected');
            }
            this.updateSelectionInfo();
        });
        
        pageElement.addEventListener('click', (e) => {
            if (!e.target.classList.contains('page-action-btn') && e.target !== pageCheckbox) {
                pageCheckbox.checked = !pageCheckbox.checked;
                pageCheckbox.dispatchEvent(new Event('change'));
            }
        });
        
        pageElement.addEventListener('dblclick', () => this.openPagePreview(pageData.id));
        pageElement.addEventListener('contextmenu', (e) => this.showContextMenu(e, pageData.id));
        
        this.pageGrid.appendChild(pageElement);
    }    setupDragAndDrop() {
        this.pageGrid.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('page-item') || e.target.closest('.page-item')) {
                const pageItem = e.target.classList.contains('page-item') ? e.target : e.target.closest('.page-item');
                this.draggedElement = pageItem;
                pageItem.style.opacity = '0.5';
                pageItem.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', pageItem.outerHTML);
            }
        });
        
        this.pageGrid.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('page-item') || e.target.closest('.page-item')) {
                const pageItem = e.target.classList.contains('page-item') ? e.target : e.target.closest('.page-item');
                pageItem.style.opacity = '1';
                pageItem.classList.remove('dragging');
                this.draggedElement = null;
            }
        });
        
        this.pageGrid.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            if (this.draggedElement) {
                const afterElement = this.getDragAfterElement(this.pageGrid, e.clientY);
                if (afterElement == null) {
                    this.pageGrid.appendChild(this.draggedElement);
                } else {
                    this.pageGrid.insertBefore(this.draggedElement, afterElement);
                }
            }
        });
        
        this.pageGrid.addEventListener('drop', (e) => {
            e.preventDefault();
            if (this.draggedElement) {
                this.reorderPages();
                this.saveState();
                this.showNotification('Pages reordered successfully', 'success');
            }
        });
    }    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.page-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }    reorderPages() {
        const pageItems = [...this.pageGrid.querySelectorAll('.page-item')];
        const newOrder = [];
        
        pageItems.forEach((pageItem, index) => {
            const pageId = pageItem.dataset.pageId;
            const pageData = this.pages.find(p => p.id === pageId);
            if (pageData) {
                pageData.currentIndex = index;
                newOrder.push(pageData);
            }
        });
        
        this.pages = newOrder;
        this.updatePageNumbers();
        this.updatePageInfo();
    }

    updatePageNumbers() {
        this.pages.forEach((pageData, index) => {
            const thumbnail = this.pageGrid.querySelector(`[data-page-id="${pageData.id}"]`);
            if (thumbnail) {
                const pageNumber = thumbnail.querySelector('.page-number');
                pageNumber.textContent = index + 1;
            }
        });
    }

    togglePageSelection(pageId, forceState = null) {
        const thumbnail = this.pageGrid.querySelector(`[data-page-id="${pageId}"]`);
        const checkbox = thumbnail.querySelector('.page-checkbox');
        
        if (forceState !== null) {
            checkbox.checked = forceState;
        } else {
            checkbox.checked = !checkbox.checked;
        }
        
        if (checkbox.checked) {
            this.selectedPages.add(pageId);
            thumbnail.classList.add('selected');
        } else {
            this.selectedPages.delete(pageId);
            thumbnail.classList.remove('selected');
        }
        
        this.updateSelectionInfo();
    }

    selectAllPages() {
        this.pages.forEach(pageData => {
            if (!pageData.deleted) {
                this.togglePageSelection(pageData.id, true);
            }
        });
    }    deselectAllPages() {
        this.selectedPages.clear();
        document.querySelectorAll('.page-item').forEach(pageElement => {
            const checkbox = pageElement.querySelector('.page-checkbox');
            if (checkbox) checkbox.checked = false;
            pageElement.classList.remove('selected');
        });
        this.updateSelectionInfo();        this.showNotification('Deselected all pages', 'success');
    }

    deleteSelectedPages() {
        if (this.selectedPages.size === 0) {
            this.showNotification('Please select pages to delete.', 'warning');
            return;
        }
        
        const selectedCount = this.selectedPages.size;
        const activePages = this.pages.filter(p => !p.deleted);
        
        if (selectedCount >= activePages.length) {
            this.showNotification('Cannot delete all pages. At least one page must remain.', 'error');
            return;
        }
        
        // Confirm deletion if deleting multiple pages
        if (selectedCount > 1) {
            const confirmMessage = `Are you sure you want to delete ${selectedCount} selected pages?`;
            if (!confirm(confirmMessage)) {
                return;
            }
        }
        
        this.saveState();
        
        // Store selected page IDs before clearing
        const pagesToDelete = Array.from(this.selectedPages);
          pagesToDelete.forEach(pageId => {
            this.deletePage(pageId, false);
        });
        
        this.selectedPages.clear();
        this.updateSelectionInfo();
        this.showNotification(`Successfully deleted ${selectedCount} page(s)`, 'success');
    }

    deletePage(pageId, saveState = true) {
        if (saveState) this.saveState();
        
        const thumbnail = this.pageGrid.querySelector(`[data-page-id="${pageId}"]`);
        if (thumbnail) {
            thumbnail.remove();
        }
        
        const pageIndex = this.pages.findIndex(p => p.id === pageId);
        if (pageIndex !== -1) {
            this.pages.splice(pageIndex, 1);
        }
        
        this.selectedPages.delete(pageId);
        this.reorderPages();
        this.updatePageInfo();
        this.updateSelectionInfo();
    }    rotatePage(pageId, degrees) {
        this.saveState();
        
        const pageData = this.pages.find(p => p.id === pageId);
        if (pageData) {
            pageData.rotation = (pageData.rotation + degrees) % 360;
            
            // Update the thumbnail display
            const pageElement = this.pageGrid.querySelector(`[data-page-id="${pageId}"]`);
            const canvas = pageElement.querySelector('.page-canvas');
            
            // Apply CSS transform for immediate visual feedback
            canvas.style.transform = `rotate(${pageData.rotation}deg)`;
            
            // Regenerate the thumbnail with proper rotation
            this.updatePageThumbnail(pageData);
        }
    }

    updatePageThumbnail(pageData) {
        const pageElement = this.pageGrid.querySelector(`[data-page-id="${pageData.id}"]`);
        if (!pageElement) return;
        
        const thumbnailContainer = pageElement.querySelector('.page-thumbnail');
        const existingCanvas = thumbnailContainer.querySelector('.page-canvas');
        
        // Create new display canvas with rotation applied
        const displayCanvas = document.createElement('canvas');
        displayCanvas.className = 'page-canvas';
        
        const thumbnailScale = 0.4;
        const originalCanvas = pageData.canvas;
        
        if (pageData.rotation % 180 === 0) {
            displayCanvas.width = originalCanvas.width * thumbnailScale;
            displayCanvas.height = originalCanvas.height * thumbnailScale;
        } else {
            // Swap dimensions for 90/270 degree rotations
            displayCanvas.width = originalCanvas.height * thumbnailScale;
            displayCanvas.height = originalCanvas.width * thumbnailScale;
        }
        
        const displayContext = displayCanvas.getContext('2d');
        displayContext.fillStyle = 'white';
        displayContext.fillRect(0, 0, displayCanvas.width, displayCanvas.height);
        
        // Apply rotation
        displayContext.save();
        displayContext.translate(displayCanvas.width / 2, displayCanvas.height / 2);
        displayContext.rotate((pageData.rotation * Math.PI) / 180);
        displayContext.scale(thumbnailScale, thumbnailScale);
        displayContext.translate(-originalCanvas.width / 2, -originalCanvas.height / 2);
        displayContext.drawImage(originalCanvas, 0, 0);
        displayContext.restore();
        
        // Replace the canvas
        thumbnailContainer.replaceChild(displayCanvas, existingCanvas);
    }    rotateSelectedPages() {
        if (this.selectedPages.size === 0) {
            this.showNotification('Please select pages to rotate.', 'warning');
            return;
        }
        
        this.saveState();
        this.selectedPages.forEach(pageId => {
            this.rotatePage(pageId, 90);
        });
        this.showNotification(`Successfully rotated ${this.selectedPages.size} page(s).`, 'success');
    }

    duplicateSelectedPages() {
        if (this.selectedPages.size === 0) {
            this.showError('Please select pages to duplicate.');
            return;
        }
        
        this.saveState();
        
        const pagesToDuplicate = [];
        this.selectedPages.forEach(pageId => {
            const pageData = this.pages.find(p => p.id === pageId);
            if (pageData) {
                pagesToDuplicate.push(pageData);
            }
        });
        
        pagesToDuplicate.forEach(originalPage => {
            const duplicatedPage = {
                id: this.generatePageId(),
                originalIndex: originalPage.originalIndex,
                currentIndex: this.pages.length,
                canvas: originalPage.canvas.cloneNode(true),
                rotation: originalPage.rotation,
                deleted: false
            };
            
            this.pages.push(duplicatedPage);
            this.createPageThumbnail(duplicatedPage);
        });
        
        this.updatePageInfo();
        this.setupDragAndDrop();
    }

    addPages() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf';
        input.multiple = false;
        
        input.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file && file.type === 'application/pdf') {
                try {
                    this.showProcessing('Adding Pages...', 'Loading pages from the selected PDF');
                    
                    const arrayBuffer = await file.arrayBuffer();
                    const loadingTask = pdfjsLib.getDocument(arrayBuffer);
                    const pdf = await loadingTask.promise;
                    
                    this.saveState();
                    
                    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                        const page = await pdf.getPage(pageNum);
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');
                        
                        const viewport = page.getViewport({ scale: 0.5 });
                        canvas.width = viewport.width;
                        canvas.height = viewport.height;
                        
                        await page.render({ canvasContext: context, viewport: viewport }).promise;
                        
                        const pageData = {
                            id: this.generatePageId(),
                            originalIndex: -1, // Mark as added page
                            currentIndex: this.pages.length,
                            canvas: canvas,
                            rotation: 0,
                            deleted: false,
                            addedFrom: file.name
                        };
                        
                        this.pages.push(pageData);
                        this.createPageThumbnail(pageData);
                    }
                    
                    this.hideProcessing();
                    this.updatePageInfo();
                    this.setupDragAndDrop();
                      } catch (error) {
                    console.error('Error adding pages:', error);
                    this.hideProcessing();
                    this.showNotification('Failed to add pages from the selected PDF.', 'error');
                }
            }
        });
        
        input.click();
    }

    showContextMenu(e, pageId) {
        e.preventDefault();
        this.contextMenu.dataset.pageId = pageId;
        this.contextMenu.style.display = 'block';
        this.contextMenu.style.left = e.pageX + 'px';
        this.contextMenu.style.top = e.pageY + 'px';
    }

    hideContextMenu() {
        this.contextMenu.style.display = 'none';
    }

    handleContextMenuClick(e) {
        const action = e.target.dataset.action;
        const pageId = this.contextMenu.dataset.pageId;
        
        if (!action || !pageId) return;
        
        switch (action) {
            case 'select':
                this.togglePageSelection(pageId, true);
                break;
            case 'deselect':
                this.togglePageSelection(pageId, false);
                break;
            case 'rotate-left':
                this.rotatePage(pageId, -90);
                break;
            case 'rotate-right':
                this.rotatePage(pageId, 90);
                break;
            case 'duplicate':
                this.duplicatePage(pageId);
                break;
            case 'delete':
                this.deletePage(pageId);
                break;
            case 'move-to-start':
                this.movePageToPosition(pageId, 0);
                break;
            case 'move-to-end':
                this.movePageToPosition(pageId, this.pages.length - 1);
                break;
        }
        
        this.hideContextMenu();
    }

    duplicatePage(pageId) {
        this.saveState();
        
        const pageData = this.pages.find(p => p.id === pageId);
        if (pageData) {
            const duplicatedPage = {
                id: this.generatePageId(),
                originalIndex: pageData.originalIndex,
                currentIndex: pageData.currentIndex + 1,
                canvas: pageData.canvas.cloneNode(true),
                rotation: pageData.rotation,
                deleted: false
            };
            
            this.pages.splice(pageData.currentIndex + 1, 0, duplicatedPage);
            this.createPageThumbnail(duplicatedPage);
            
            // Insert after the original page
            const originalThumbnail = this.pageGrid.querySelector(`[data-page-id="${pageId}"]`);
            const duplicatedThumbnail = this.pageGrid.querySelector(`[data-page-id="${duplicatedPage.id}"]`);
            originalThumbnail.parentNode.insertBefore(duplicatedThumbnail, originalThumbnail.nextSibling);
            
            this.reorderPages();
            this.updatePageInfo();
            this.setupDragAndDrop();
        }
    }

    movePageToPosition(pageId, newPosition) {
        this.saveState();
        
        const pageIndex = this.pages.findIndex(p => p.id === pageId);
        if (pageIndex !== -1) {
            const pageData = this.pages.splice(pageIndex, 1)[0];
            this.pages.splice(newPosition, 0, pageData);
            
            const thumbnail = this.pageGrid.querySelector(`[data-page-id="${pageId}"]`);
            thumbnail.remove();
            
            if (newPosition === 0) {
                this.pageGrid.insertBefore(thumbnail, this.pageGrid.firstChild);
            } else {
                this.pageGrid.appendChild(thumbnail);
            }
            
            this.reorderPages();
            this.updatePageInfo();
        }
    }

    openPagePreview(pageId) {
        const pageIndex = this.pages.findIndex(p => p.id === pageId);
        if (pageIndex !== -1) {
            this.currentPreviewPage = pageIndex;
            this.showPreviewModal();
            this.updatePreviewContent();
        }
    }

    showPreviewModal() {
        this.previewModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closePreview() {
        this.previewModal.style.display = 'none';
        document.body.style.overflow = '';
    }    updatePreviewContent() {
        const pageData = this.pages[this.currentPreviewPage];
        if (!pageData) return;
        
        this.previewTitle.textContent = `Page ${this.currentPreviewPage + 1}`;
        this.previewInfo.textContent = `Page ${this.currentPreviewPage + 1} of ${this.pages.length}`;
        
        // Clear and update canvas with higher quality
        const canvas = this.previewCanvas;
        const ctx = canvas.getContext('2d');
        
        // Use original canvas size for preview
        const sourceCanvas = pageData.canvas;
        canvas.width = sourceCanvas.width;
        canvas.height = sourceCanvas.height;
        
        // Clear with white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Apply rotation if needed
        if (pageData.rotation !== 0) {
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((pageData.rotation * Math.PI) / 180);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
        }
        
        // Draw the page content
        ctx.drawImage(sourceCanvas, 0, 0);
        
        if (pageData.rotation !== 0) {
            ctx.restore();
        }
        
        // Update navigation buttons
        this.prevPreviewButton.disabled = this.currentPreviewPage === 0;
        this.nextPreviewButton.disabled = this.currentPreviewPage === this.pages.length - 1;
    }

    previousPreviewPage() {
        if (this.currentPreviewPage > 0) {
            this.currentPreviewPage--;
            this.updatePreviewContent();
        }
    }

    nextPreviewPage() {
        if (this.currentPreviewPage < this.pages.length - 1) {
            this.currentPreviewPage++;
            this.updatePreviewContent();
        }
    }

    rotatePreviewPage(degrees) {
        const pageData = this.pages[this.currentPreviewPage];
        if (pageData) {
            this.saveState();
            this.rotatePage(pageData.id, degrees);
            this.updatePreviewContent();
        }
    }

    deletePreviewPage() {
        const pageData = this.pages[this.currentPreviewPage];
        if (pageData) {
            this.deletePage(pageData.id);
            
            if (this.pages.length === 0) {
                this.closePreview();
                this.resetToStart();
                return;
            }
            
            if (this.currentPreviewPage >= this.pages.length) {
                this.currentPreviewPage = this.pages.length - 1;
            }
            
            this.updatePreviewContent();
        }
    }

    changeThumbnailSize(size) {
        this.thumbnailSize = size;
        this.pageGrid.querySelectorAll('.page-thumbnail').forEach(thumbnail => {
            thumbnail.className = `page-thumbnail ${size}`;
        });
    }

    changeViewMode(mode) {
        this.viewMode = mode;
        this.pageGrid.className = `page-grid ${mode}`;
    }    openPreview() {
        if (this.pages.length === 0) {
            this.showNotification('No pages to preview', 'warning');
            return;
        }
        
        this.currentPreviewPage = 0;
        this.currentZoom = 1.0;
        this.updateZoomDisplay();
        this.renderPreviewPage();
        this.updatePreviewControls();
        this.previewModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closePreview() {
        this.previewModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    previousPreviewPage() {
        if (this.currentPreviewPage > 0) {
            this.currentPreviewPage--;
            this.renderPreviewPage();
            this.updatePreviewControls();
        }
    }

    nextPreviewPage() {
        if (this.currentPreviewPage < this.pages.length - 1) {
            this.currentPreviewPage++;
            this.renderPreviewPage();
            this.updatePreviewControls();
        }
    }

    rotatePreviewPage(degrees) {
        const pageData = this.pages[this.currentPreviewPage];
        if (!pageData) return;
        
        pageData.rotation = (pageData.rotation + degrees) % 360;
        if (pageData.rotation < 0) pageData.rotation += 360;
        
        this.renderPreviewPage();
        this.updatePageThumbnail(pageData);
        this.showNotification(`Page rotated ${degrees > 0 ? 'right' : 'left'}`, 'success');
    }

    deletePreviewPage() {
        if (this.pages.length <= 1) {
            this.showNotification('Cannot delete the last remaining page', 'error');
            return;
        }
        
        const pageData = this.pages[this.currentPreviewPage];
        this.pages.splice(this.currentPreviewPage, 1);
        this.selectedPages.delete(pageData.id);
        
        // Remove from DOM
        const pageElement = document.querySelector(`[data-page-id="${pageData.id}"]`);
        if (pageElement) {
            pageElement.remove();
        }
        
        // Adjust current preview page
        if (this.currentPreviewPage >= this.pages.length) {
            this.currentPreviewPage = this.pages.length - 1;
        }
        
        if (this.pages.length === 0) {
            this.closePreview();
        } else {
            this.renderPreviewPage();
            this.updatePreviewControls();
        }
        
        this.updateSelectionInfo();
        this.updatePageInfo();
        this.showNotification('Page deleted successfully', 'success');
    }

    async savePDF() {
        try {
            this.showProcessing('Saving PDF...', 'Creating your modified PDF document');
            
            const pdfDoc = await PDFLib.PDFDocument.create();
            const originalArrayBuffer = await this.originalFile.arrayBuffer();
            const originalPdf = await PDFLib.PDFDocument.load(originalArrayBuffer);
            
            let modifiedPages = 0;
            
            for (let i = 0; i < this.pages.length; i++) {
                const pageData = this.pages[i];
                this.updateProgress(((i + 1) / this.pages.length) * 80);
                
                if (pageData.originalIndex >= 0) {
                    // Original page
                    const [copiedPage] = await pdfDoc.copyPages(originalPdf, [pageData.originalIndex]);
                    
                    if (pageData.rotation !== 0) {
                        copiedPage.setRotation(PDFLib.degrees(pageData.rotation));
                        modifiedPages++;
                    }
                    
                    pdfDoc.addPage(copiedPage);
                } else {
                    // Added page (this would need additional logic for external pages)
                    modifiedPages++;
                }
            }
            
            this.updateProgress(90);
            
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            
            this.finalPdfBlob = blob;
            this.finalPageCount.textContent = this.pages.length;
            this.pagesModified.textContent = modifiedPages;
            this.finalFileSize.textContent = this.formatFileSize(blob.size);
              this.updateProgress(100);
            this.hideProcessing();
            this.showResults();
            this.showNotification('PDF saved successfully!', 'success');
            
        } catch (error) {
            console.error('Error saving PDF:', error);
            this.hideProcessing();
            this.showNotification('Failed to save PDF. Please try again.', 'error');
        }
    }

    downloadFinalPDF() {
        if (this.finalPdfBlob) {
            const url = URL.createObjectURL(this.finalPdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = this.generateFileName();
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }

    generateFileName() {
        const originalName = this.originalFile.name.replace('.pdf', '');
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        return `${originalName}_managed_${timestamp}.pdf`;
    }

    previewFinalPDF() {
        if (this.finalPdfBlob) {
            const url = URL.createObjectURL(this.finalPdfBlob);
            window.open(url, '_blank');
        }
    }

    saveState() {
        const state = {
            pages: this.pages.map(page => ({...page})),
            selectedPages: new Set(this.selectedPages)
        };
        
        this.undoStack.push(state);
        this.redoStack = []; // Clear redo stack
        
        // Limit undo stack size
        if (this.undoStack.length > 20) {
            this.undoStack.shift();
        }
        
        this.updateUndoRedoButtons();
    }

    undo() {
        if (this.undoStack.length > 0) {
            const currentState = {
                pages: this.pages.map(page => ({...page})),
                selectedPages: new Set(this.selectedPages)
            };
            
            this.redoStack.push(currentState);
            const previousState = this.undoStack.pop();
            
            this.restoreState(previousState);
            this.updateUndoRedoButtons();
        }
    }

    redo() {
        if (this.redoStack.length > 0) {
            const currentState = {
                pages: this.pages.map(page => ({...page})),
                selectedPages: new Set(this.selectedPages)
            };
            
            this.undoStack.push(currentState);
            const nextState = this.redoStack.pop();
            
            this.restoreState(nextState);
            this.updateUndoRedoButtons();
        }
    }

    restoreState(state) {
        this.pages = state.pages.map(page => ({...page}));
        this.selectedPages = new Set(state.selectedPages);
        
        this.pageGrid.innerHTML = '';
        this.pages.forEach(pageData => {
            this.createPageThumbnail(pageData);
        });
        
        this.updatePageInfo();
        this.updateSelectionInfo();
        this.setupDragAndDrop();
        
        // Restore selections
        this.selectedPages.forEach(pageId => {
            const thumbnail = this.pageGrid.querySelector(`[data-page-id="${pageId}"]`);
            if (thumbnail) {
                thumbnail.classList.add('selected');
                thumbnail.querySelector('.page-checkbox').checked = true;
            }
        });
    }

    updateUndoRedoButtons() {
        this.undoButton.disabled = this.undoStack.length === 0;
        this.redoButton.disabled = this.redoStack.length === 0;
    }

    updatePageInfo() {
        const activePages = this.pages.filter(p => !p.deleted).length;
        this.pageCount.textContent = `${activePages} pages`;
        this.totalPagesInfo.textContent = `Total: ${activePages} pages`;
    }

    updateSelectionInfo() {
        this.selectionInfo.textContent = `${this.selectedPages.size} pages selected`;
    }

    handleKeyDown(e) {
        if (e.ctrlKey) {
            switch (e.key.toLowerCase()) {
                case 'z':
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.redo();
                    } else {
                        this.undo();
                    }
                    break;
                case 'a':
                    e.preventDefault();
                    this.selectAllPages();
                    break;
                case 's':
                    e.preventDefault();
                    this.savePDF();
                    break;
            }
        } else if (e.key === 'Delete' && this.selectedPages.size > 0) {
            this.deleteSelectedPages();
        } else if (e.key === 'Escape') {
            this.closePreview();
            this.hideContextMenu();
        }
    }

    showPageManager() {
        this.toolbarSection.style.display = 'block';
        this.pageManagerSection.style.display = 'block';
        
        // Smooth scroll to page manager section
        setTimeout(() => {
            this.pageManagerSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    }

    showProcessing(title, description) {
        this.processingTitle.textContent = title;
        this.processingDescription.textContent = description;
        this.processingSection.style.display = 'flex';
        this.updateProgress(0);
    }

    hideProcessing() {
        this.processingSection.style.display = 'none';
    }

    updateProgress(percent) {
        this.progressFill.style.width = percent + '%';
        this.progressText.textContent = Math.round(percent) + '%';
    }

    showResults() {
        this.resultsSection.style.display = 'flex';
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorSection.style.display = 'flex';
        this.hideProcessing();
    }

    retryOperation() {
        this.errorSection.style.display = 'none';
        // Retry the last operation or return to manager
        if (this.pages.length > 0) {
            this.showPageManager();
        } else {
            this.resetToStart();
        }
    }

    resetToStart() {
        // Reset all state
        this.pdfDoc = null;
        this.pages = [];
        this.selectedPages.clear();
        this.undoStack = [];
        this.redoStack = [];
        this.originalFile = null;
        this.finalPdfBlob = null;
        
        // Hide all sections except upload
        this.toolbarSection.style.display = 'none';
        this.pageManagerSection.style.display = 'none';
        this.processingSection.style.display = 'none';
        this.resultsSection.style.display = 'none';
        this.errorSection.style.display = 'none';
        
        // Clear content
        this.pageGrid.innerHTML = '';
        this.fileInput.value = '';
        
        // Reset form states
        this.updateUndoRedoButtons();
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // New selection control methods
    selectAllPagesInManager() {
        this.pages.forEach(page => {
            this.selectedPages.add(page.id);
            const pageElement = document.querySelector(`[data-page-id="${page.id}"]`);
            if (pageElement) {
                const checkbox = pageElement.querySelector('.page-checkbox');
                if (checkbox) checkbox.checked = true;
                pageElement.classList.add('selected');
            }
        });
        this.updateSelectionInfo();
        this.showNotification(`Selected all ${this.pages.length} pages`, 'success');
    }

    deselectAllPagesInManager() {
        this.selectedPages.clear();
        document.querySelectorAll('.page-item').forEach(pageElement => {
            const checkbox = pageElement.querySelector('.page-checkbox');
            if (checkbox) checkbox.checked = false;
            pageElement.classList.remove('selected');
        });
        this.updateSelectionInfo();
        this.showNotification('Deselected all pages', 'success');
    }

    invertPageSelection() {
        const newSelection = new Set();
        this.pages.forEach(page => {
            const pageElement = document.querySelector(`[data-page-id="${page.id}"]`);
            if (pageElement) {
                const checkbox = pageElement.querySelector('.page-checkbox');
                if (this.selectedPages.has(page.id)) {
                    this.selectedPages.delete(page.id);
                    checkbox.checked = false;
                    pageElement.classList.remove('selected');
                } else {
                    newSelection.add(page.id);
                    checkbox.checked = true;
                    pageElement.classList.add('selected');
                }
            }
        });
        newSelection.forEach(id => this.selectedPages.add(id));
        this.updateSelectionInfo();
        this.showNotification(`Inverted selection - ${this.selectedPages.size} pages selected`, 'success');
    }

    // Enhanced preview modal methods
    togglePreviewPageSelection(e) {
        const pageData = this.pages[this.currentPreviewPage];
        if (!pageData) return;
        
        if (e.target.checked) {
            this.selectedPages.add(pageData.id);
        } else {
            this.selectedPages.delete(pageData.id);
        }
        
        // Update the main page thumbnail selection
        const pageElement = document.querySelector(`[data-page-id="${pageData.id}"]`);
        if (pageElement) {
            const checkbox = pageElement.querySelector('.page-checkbox');
            if (checkbox) checkbox.checked = e.target.checked;
            if (e.target.checked) {
                pageElement.classList.add('selected');
            } else {
                pageElement.classList.remove('selected');
            }
        }
        
        this.updateSelectionInfo();
    }

    // Zoom methods
    zoomIn() {
        this.currentZoom = Math.min(this.currentZoom * 1.25, 5.0);
        this.updateZoomDisplay();
        this.renderPreviewPage();
    }

    zoomOut() {
        this.currentZoom = Math.max(this.currentZoom / 1.25, 0.25);
        this.updateZoomDisplay();
        this.renderPreviewPage();
    }    fitToScreen() {
        if (!this.previewCanvas || !this.pages[this.currentPreviewPage]) return;
        
        const container = document.getElementById('previewContainer');
        const containerRect = container.getBoundingClientRect();
        const maxWidth = containerRect.width - 40;
        const maxHeight = containerRect.height - 40;
        
        const pageData = this.pages[this.currentPreviewPage];
        
        // Calculate optimal zoom
        if (this.pdfJsDoc && pageData.originalPageNum) {
            this.pdfJsDoc.getPage(pageData.originalPageNum).then(page => {
                const viewport = page.getViewport({ scale: 1.0, rotation: pageData.rotation });
                const scaleX = maxWidth / viewport.width;
                const scaleY = maxHeight / viewport.height;
                this.currentZoom = Math.min(scaleX, scaleY, 2.0);
                this.updateZoomDisplay();
                this.renderPreviewPage();
            }).catch(() => {
                // Fallback calculation
                const canvas = pageData.canvas;
                const scaleX = maxWidth / canvas.width;
                const scaleY = maxHeight / canvas.height;
                this.currentZoom = Math.min(scaleX, scaleY, 2.0);
                this.updateZoomDisplay();
                this.renderPreviewPage();
            });
        } else {
            // Fallback calculation
            const canvas = pageData.canvas;
            const scaleX = maxWidth / canvas.width;
            const scaleY = maxHeight / canvas.height;
            this.currentZoom = Math.min(scaleX, scaleY, 2.0);
            this.updateZoomDisplay();
            this.renderPreviewPage();
        }
    }

    updateZoomDisplay() {
        if (this.zoomLevel) {
            this.zoomLevel.textContent = `${Math.round(this.currentZoom * 100)}%`;
        }
    }    async renderPreviewPage() {
        if (!this.pages[this.currentPreviewPage]) return;
        
        const pageData = this.pages[this.currentPreviewPage];
        
        if (this.pdfJsDoc && pageData.originalPageNum) {
            try {
                const page = await this.pdfJsDoc.getPage(pageData.originalPageNum);
                const baseViewport = page.getViewport({ scale: 1.0, rotation: pageData.rotation });
                const scale = this.currentZoom;
                const viewport = page.getViewport({ scale, rotation: pageData.rotation });
                
                this.previewCanvas.width = viewport.width;
                this.previewCanvas.height = viewport.height;
                
                const context = this.previewCanvas.getContext('2d');
                context.fillStyle = 'white';
                context.fillRect(0, 0, viewport.width, viewport.height);
                
                const renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                
                await page.render(renderContext).promise;
                return;
            } catch (error) {
                console.warn('Could not render with PDF.js, falling back to canvas:', error);
            }
        }
        
        // Fallback: use the stored canvas
        const sourceCanvas = pageData.canvas;
        if (!sourceCanvas) return;
        
        const scale = this.currentZoom;
        
        if (pageData.rotation % 180 === 0) {
            this.previewCanvas.width = sourceCanvas.width * scale;
            this.previewCanvas.height = sourceCanvas.height * scale;
        } else {
            this.previewCanvas.width = sourceCanvas.height * scale;
            this.previewCanvas.height = sourceCanvas.width * scale;
        }
        
        const context = this.previewCanvas.getContext('2d');
        context.fillStyle = 'white';
        context.fillRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
        
        context.save();
        context.scale(scale, scale);
        
        if (pageData.rotation !== 0) {
            context.translate(sourceCanvas.width / 2, sourceCanvas.height / 2);
            context.rotate((pageData.rotation * Math.PI) / 180);
            context.translate(-sourceCanvas.width / 2, -sourceCanvas.height / 2);
        }
        
        context.drawImage(sourceCanvas, 0, 0);
        context.restore();
    }

    updatePreviewControls() {
        const pageData = this.pages[this.currentPreviewPage];
        
        this.previewTitle.textContent = `Page ${this.currentPreviewPage + 1}`;
        this.previewInfo.textContent = `Page ${this.currentPreviewPage + 1} of ${this.pages.length}`;
        
        this.prevPreviewButton.disabled = this.currentPreviewPage === 0;
        this.nextPreviewButton.disabled = this.currentPreviewPage === this.pages.length - 1;
        
        // Update checkbox state
        if (this.previewPageCheckbox) {
            this.previewPageCheckbox.checked = this.selectedPages.has(pageData.id);
        }
    }

    duplicateCurrentPreviewPage() {
        const pageData = this.pages[this.currentPreviewPage];
        if (!pageData) return;
        
        const duplicatedPage = {
            id: this.generatePageId(),
            originalIndex: pageData.originalIndex,
            currentIndex: pageData.currentIndex,
            canvas: pageData.canvas.cloneNode(true),
            rotation: pageData.rotation,
            deleted: false,
            originalPageNum: pageData.originalPageNum
        };
        
        // Insert after current page
        this.pages.splice(this.currentPreviewPage + 1, 0, duplicatedPage);
        
        // Update current indices
        for (let i = this.currentPreviewPage + 1; i < this.pages.length; i++) {
            this.pages[i].currentIndex = i;
        }
        
        // Re-render the grid
        this.renderPagesGrid();
        this.updatePageInfo();
        this.updateSelectionInfo();
        this.showNotification('Page duplicated successfully', 'success');
    }

    renderPagesGrid() {
        this.pageGrid.innerHTML = '';
        this.pages.forEach(pageData => {
            this.createPageThumbnail(pageData);
        });
        this.setupDragAndDrop();
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.pdf-manager-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `pdf-manager-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            background: this.getNotificationColor(type),
            color: 'white',
            borderRadius: '12px',
            zIndex: '10001',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
            fontSize: '14px',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            minWidth: '300px',
            maxWidth: '400px'
        });
        
        // Style notification content
        const content = notification.querySelector('.notification-content');
        Object.assign(content.style, {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flex: '1'
        });
        
        // Style close button
        const closeBtn = notification.querySelector('.notification-close');
        Object.assign(closeBtn.style, {
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'inherit',
            fontSize: '12px'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        };
        return icons[type] || 'fa-info-circle';
    }
    
    getNotificationColor(type) {
        const colors = {
            success: 'linear-gradient(135deg, #4CAF50, #45a049)',
            error: 'linear-gradient(135deg, #f44336, #da190b)',
            info: 'linear-gradient(135deg, #2196F3, #0b7dda)',
            warning: 'linear-gradient(135deg, #ff9800, #e68900)'
        };
        return colors[type] || colors.info;
    }
}

// Initialize the PDF Page Manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PDFPageManager();
});
