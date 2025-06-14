// Advanced Doc to PDF Converter
// Uses modern JavaScript libraries for document conversion

class DocToPDFConverter {
    constructor() {
        this.files = new Map();
        this.convertedFiles = new Map();
        this.currentConversionId = 0;
        this.supportedFormats = [
            '.doc', '.docx', '.txt', '.rtf', '.odt', 
            '.ppt', '.pptx', '.xls', '.xlsx', '.csv', 
            '.md', '.html', '.xml', '.json', '.pages', 
            '.numbers', '.key'
        ];
        
        this.initializeEventListeners();
        this.initializeLibraries();
    }

    initializeLibraries() {
        // Initialize jsPDF with advanced options
        this.pdfOptions = {
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
            putOnlyUsedFonts: true,
            floatPrecision: 16
        };
        
        // Initialize conversion settings
        this.conversionSettings = {
            pageSize: 'A4',
            orientation: 'portrait',
            margin: 'normal',
            quality: 'high',
            preserveFormatting: true,
            embedFonts: true,
            addMetadata: false,
            optimizeSize: true, // Default to optimize size
            useTextRendering: true, // For text-heavy documents, use text rendering instead of images where possible
            // Define image quality levels for different quality settings
            imageQuality: {
                high: { format: 'jpeg', quality: 0.9, scale: 2 },
                medium: { format: 'jpeg', quality: 0.7, scale: 1.5 },
                low: { format: 'jpeg', quality: 0.5, scale: 1 }
            }
        };
    }

    initializeEventListeners() {
        // File input and drag & drop
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');

        // Click to upload
        uploadArea.addEventListener('click', () => fileInput.click());
        
        // File input change
        fileInput.addEventListener('change', (e) => this.handleFileSelection(e.target.files));

        // Drag and drop events
        uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        uploadArea.addEventListener('drop', this.handleDrop.bind(this));

        // Conversion settings
        this.initializeSettingsListeners();

        // Action buttons
        document.getElementById('convertBtn').addEventListener('click', () => this.convertAllFiles());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearAllFiles());

        // Advanced options toggle
        document.getElementById('toggleAdvanced').addEventListener('click', this.toggleAdvancedOptions.bind(this));

        // Modal controls
        document.getElementById('helpBtn').addEventListener('click', () => this.showModal('helpModal'));
        document.getElementById('closeModal').addEventListener('click', () => this.hideModal('helpModal'));

        // Click outside modal to close
        document.getElementById('helpModal').addEventListener('click', (e) => {
            if (e.target.id === 'helpModal') this.hideModal('helpModal');
        });
    }

    initializeSettingsListeners() {
        const settings = ['pageSize', 'orientation', 'margin', 'quality'];
        settings.forEach(setting => {
            document.getElementById(setting).addEventListener('change', (e) => {
                this.conversionSettings[setting] = e.target.value;
                this.showToast('Settings updated', 'Configuration saved successfully', 'success');
            });
        });

        const checkboxes = ['preserveFormatting', 'embedFonts', 'addMetadata', 'optimizeSize'];
        checkboxes.forEach(checkbox => {
            document.getElementById(checkbox).addEventListener('change', (e) => {
                this.conversionSettings[checkbox] = e.target.checked;
            });
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('uploadArea').classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('uploadArea').classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('uploadArea').classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files);
        this.handleFileSelection(files);
    }

    handleFileSelection(files) {
        const validFiles = Array.from(files).filter(file => {
            const extension = '.' + file.name.split('.').pop().toLowerCase();
            return this.supportedFormats.includes(extension);
        });

        if (validFiles.length === 0) {
            this.showToast('Invalid Files', 'Please select supported document formats', 'error');
            return;
        }

        if (files.length > validFiles.length) {
            this.showToast('Some Files Skipped', `${files.length - validFiles.length} unsupported files were ignored`, 'warning');
        }

        validFiles.forEach(file => {
            const fileId = this.generateFileId();
            this.files.set(fileId, {
                id: fileId,
                file: file,
                name: file.name,
                size: file.size,
                type: file.type,
                status: 'ready'
            });
        });

        this.updateUI();
        this.showToast('Files Added', `${validFiles.length} file(s) ready for conversion`, 'success');
    }

    generateFileId() {
        return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    updateUI() {
        const hasFiles = this.files.size > 0;
        
        // Show/hide sections
        document.getElementById('fileList').style.display = hasFiles ? 'block' : 'none';
        document.getElementById('optionsSection').style.display = hasFiles ? 'block' : 'none';
        document.getElementById('actionsSection').style.display = hasFiles ? 'block' : 'none';

        // Update file list
        this.renderFileList();
    }

    renderFileList() {
        const container = document.getElementById('filesContainer');
        container.innerHTML = '';

        this.files.forEach(fileData => {
            const fileElement = this.createFileElement(fileData);
            container.appendChild(fileElement);
        });
    }

    createFileElement(fileData) {
        const fileDiv = document.createElement('div');
        fileDiv.className = 'file-item';
        fileDiv.innerHTML = `
            <div class="file-info">
                <div class="file-icon ${this.getFileIconClass(fileData.name)}">
                    <i class="fas fa-file-alt"></i>
                </div>
                <div class="file-details">
                    <h4>${fileData.name}</h4>
                    <p>${this.formatFileSize(fileData.size)} • ${this.getFileExtension(fileData.name).toUpperCase()}</p>
                </div>
            </div>
            <div class="file-actions">
                <button class="btn-icon" onclick="converter.removeFile('${fileData.id}')" title="Remove file">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        return fileDiv;
    }

    getFileIconClass(filename) {
        const extension = this.getFileExtension(filename);
        return extension;
    }

    getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    removeFile(fileId) {
        this.files.delete(fileId);
        this.updateUI();
        this.showToast('File Removed', 'File removed from conversion queue', 'success');
    }

    clearAllFiles() {
        this.files.clear();
        this.convertedFiles.clear();
        this.updateUI();
        document.getElementById('resultsSection').style.display = 'none';
        this.showToast('All Files Cleared', 'Conversion queue has been cleared', 'success');
    }

    async convertAllFiles() {
        if (this.files.size === 0) {
            this.showToast('No Files', 'Please select files to convert', 'warning');
            return;
        }

        this.showProgress();
        const totalFiles = this.files.size;
        let completedFiles = 0;

        try {
            for (const [fileId, fileData] of this.files) {
                this.updateProgress(`Converting ${fileData.name}...`, (completedFiles / totalFiles) * 100);
                
                try {
                    const pdfBlob = await this.convertFileToPDF(fileData);
                    this.convertedFiles.set(fileId, {
                        ...fileData,
                        pdfBlob: pdfBlob,
                        status: 'converted',
                        downloadName: this.generatePDFFileName(fileData.name)
                    });
                    
                    completedFiles++;
                    this.updateProgress(`Converted ${fileData.name}`, (completedFiles / totalFiles) * 100);
                } catch (error) {
                    console.error(`Error converting ${fileData.name}:`, error);
                    this.convertedFiles.set(fileId, {
                        ...fileData,
                        status: 'error',
                        error: error.message
                    });
                    completedFiles++;
                }
            }

            this.hideProgress();
            this.showResults();
            this.showToast('Conversion Complete', `${completedFiles} file(s) processed successfully`, 'success');

        } catch (error) {
            this.hideProgress();
            this.showToast('Conversion Failed', 'An error occurred during conversion', 'error');
            console.error('Conversion error:', error);
        }
    }    async convertFileToPDF(fileData) {
        const extension = this.getFileExtension(fileData.name);
        
        switch (extension) {
            case 'txt':
            case 'md':
                return await this.convertTextToPDF(fileData);
            case 'doc':
            case 'docx':
                return await this.convertWordToPDF(fileData);
            case 'rtf':
                return await this.convertRTFToPDF(fileData);
            case 'odt':
                return await this.convertODTToPDF(fileData);
            case 'html':
                return await this.convertHtmlToPDF(fileData);
            case 'ppt':
            case 'pptx':
                return await this.convertPresentationToPDF(fileData);
            case 'xls':
            case 'xlsx':
            case 'csv':
                return await this.convertSpreadsheetToPDF(fileData);
            case 'xml':
            case 'json':
                return await this.convertStructuredDataToPDF(fileData);
            case 'pages':
            case 'numbers':
            case 'key':
                return await this.convertAppleFormatToPDF(fileData);
            default:
                throw new Error(`Unsupported file format: ${extension}`);
        }
    }

    async convertTextToPDF(fileData) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target.result;
                    const pdf = this.createPDFDocument();
                    
                    // Configure text settings
                    const pageWidth = pdf.internal.pageSize.getWidth();
                    const pageHeight = pdf.internal.pageSize.getHeight();
                    const margins = this.getMargins();
                    const maxWidth = pageWidth - margins.left - margins.right;
                    
                    pdf.setFont('helvetica', 'normal');
                    pdf.setFontSize(12);
                    
                    // Split text into lines and pages
                    const lines = pdf.splitTextToSize(text, maxWidth);
                    const lineHeight = 6;
                    const linesPerPage = Math.floor((pageHeight - margins.top - margins.bottom) / lineHeight);
                    
                    let currentLine = 0;
                    let pageNumber = 1;
                    
                    while (currentLine < lines.length) {
                        if (pageNumber > 1) {
                            pdf.addPage();
                        }
                        
                        // Add page header if metadata is enabled
                        if (this.conversionSettings.addMetadata) {
                            pdf.setFontSize(10);
                            pdf.text(`${fileData.name} - Page ${pageNumber}`, margins.left, margins.top - 10);
                            pdf.setFontSize(12);
                        }
                        
                        // Add text lines
                        const endLine = Math.min(currentLine + linesPerPage, lines.length);
                        for (let i = currentLine; i < endLine; i++) {
                            const y = margins.top + (i - currentLine + 1) * lineHeight;
                            pdf.text(lines[i], margins.left, y);
                        }
                        
                        currentLine = endLine;
                        pageNumber++;
                    }
                    
                    // Add metadata if enabled
                    if (this.conversionSettings.addMetadata) {
                        pdf.setProperties({
                            title: fileData.name,
                            creator: 'OMNIFORMA Doc to PDF Converter',
                            creationDate: new Date()
                        });
                    }
                    
                    const pdfBlob = pdf.output('blob');
                    resolve(pdfBlob);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(fileData.file);
        });
    }

    async convertWordToPDF(fileData) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const arrayBuffer = e.target.result;
                    
                    // Use Mammoth.js to convert to HTML with images
                    const result = await mammoth.convertToHtml({ 
                        arrayBuffer,
                        // Enhanced image extraction for embedded images with better quality
                        convertImage: mammoth.images.imgElement((image) => {
                            return image.readAsDataURL().then((dataUri) => {
                                return {
                                    src: dataUri,
                                    class: 'doc-image' // Add a class for styling
                                };
                            });
                        })
                    });
                    
                    let htmlContent = result.value;
                    
                    // Apply additional styling for proper layout and image rendering
                    const styleTag = `
                        <style>
                            body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
                            p { margin-bottom: 1em; }
                            h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.75em; }
                            table { border-collapse: collapse; width: 100%; margin: 1em 0; }
                            td, th { border: 1px solid #ddd; padding: 8px; }
                            .doc-image { max-width: 100%; height: auto; margin: 10px 0; }
                            img { max-width: 100%; height: auto; } /* Handle all image types */
                            ul, ol { margin-left: 2em; margin-bottom: 1em; }
                            li { margin-bottom: 0.5em; }
                            .page-break { page-break-after: always; }
                            @media print { .page-break { height: 0; page-break-after: always; margin: 0; border-top: none; } }
                        </style>
                    `;
                    
                    // Wrap the HTML content in a proper document structure
                    htmlContent = `<!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8">
                            <title>${fileData.name}</title>
                            ${styleTag}
                        </head>
                        <body>
                            <div class="document-container">${htmlContent}</div>
                        </body>
                        </html>`;
                    
                    // Create a temporary container to render the HTML
                    const container = document.createElement('div');
                    container.style.position = 'absolute';
                    container.style.top = '-9999px';
                    container.style.left = '-9999px';
                    container.style.width = '800px'; // Width for rendering
                    container.style.background = 'white'; // Ensure background is filled
                    container.style.padding = '20px';
                    container.style.overflow = 'hidden'; // Prevent overflow issues
                    container.innerHTML = htmlContent;
                    
                    // Add container to DOM for rendering
                    document.body.appendChild(container);
                    
                    // Create PDF
                    const pdf = this.createPDFDocument();
                    
                    try {
                        // Add progress indication
                        this.updateProgress('Processing images in document...', 50);
                        
                        // Load all images before rendering to ensure they're properly displayed
                        const images = container.querySelectorAll('img');
                        const imagePromises = Array.from(images).map(img => {
                            return new Promise((resolve) => {
                                if (img.complete) {
                                    resolve();
                                } else {
                                    img.onload = () => resolve();
                                    img.onerror = () => resolve(); // Continue even if image fails
                                }
                            });
                        });
                        
                        // Wait for all images to load
                        await Promise.all(imagePromises);
                        
                        this.updateProgress('Rendering document to PDF...', 75);
                          // Get quality settings based on selected quality level
                        const qualitySettings = this.conversionSettings.imageQuality[this.conversionSettings.quality];
                        
                        // Use html2canvas with optimized settings based on quality level
                        const canvas = await html2canvas(container, {
                            scale: qualitySettings.scale, // Adjust scale based on quality setting
                            useCORS: true,
                            allowTaint: true, // Allow cross-origin images
                            logging: false,
                            backgroundColor: '#FFFFFF',
                            imageTimeout: 15000, // Longer timeout for images
                            onclone: (clonedDoc) => {
                                // Additional processing on the cloned document if needed
                                const docContainer = clonedDoc.querySelector('.document-container');
                                if (docContainer) {
                                    docContainer.style.width = '100%';
                                }
                            }
                        });
                        
                        const imgData = canvas.toDataURL(`image/${qualitySettings.format}`, qualitySettings.quality); // Use format and quality from settings
                        const pageWidth = pdf.internal.pageSize.getWidth();
                        const pageHeight = pdf.internal.pageSize.getHeight();
                        const margins = this.getMargins();
                        
                        // Calculate dimensions maintaining aspect ratio
                        const imgWidth = pageWidth - margins.left - margins.right;
                        const imgHeight = (canvas.height * imgWidth) / canvas.width;
                        
                        // Add the image to the PDF
                        let heightLeft = imgHeight;
                        let position = margins.top;
                        pdf.addImage(imgData, 'PNG', margins.left, position, imgWidth, imgHeight);
                        heightLeft -= (pageHeight - margins.top - margins.bottom);
                        
                        // Add new pages if necessary
                        while (heightLeft > 0) {
                            position = -(pageHeight - margins.top - margins.bottom - heightLeft);
                            pdf.addPage();
                            pdf.addImage(imgData, 'PNG', margins.left, position, imgWidth, imgHeight);
                            heightLeft -= (pageHeight - margins.top - margins.bottom);
                        }
                        
                    } finally {
                        // Clean up
                        document.body.removeChild(container);
                    }
                    
                    // Add metadata if enabled
                    if (this.conversionSettings.addMetadata) {
                        pdf.setProperties({
                            title: fileData.name,
                            creator: 'OMNIFORMA Doc to PDF Converter',
                            creationDate: new Date(),
                            subject: 'Converted Document',
                            author: 'OMNIFORMA Tools'
                        });
                    }
                    
                    const pdfBlob = pdf.output('blob');
                    resolve(pdfBlob);
                } catch (error) {
                    console.error("Word conversion error:", error);
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(fileData.file);
        });
    }

    async convertRTFToPDF(fileData) {
        // For RTF files, we'll treat them as text files for simplicity
        // In a production environment, you'd want to use a proper RTF parser
        return this.convertTextToPDF(fileData);
    }

    async convertODTToPDF(fileData) {
        // For ODT files, we'll extract as much text as possible
        // In a production environment, you'd want to use a proper ODT parser
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    // ODT files are ZIP archives, so we'll try to extract the content.xml
                    const arrayBuffer = e.target.result;
                    const zip = new JSZip();
                    
                    const contents = await zip.loadAsync(arrayBuffer);
                    const contentXml = await contents.file('content.xml').async('string');
                    
                    // Basic XML text extraction (remove tags)
                    const text = contentXml.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
                    
                    const pdf = this.createPDFDocument();
                    await this.addFormattedTextToPDF(pdf, text, fileData.name);
                    
                    const pdfBlob = pdf.output('blob');
                    resolve(pdfBlob);
                } catch (error) {
                    // Fallback to treating as text file
                    this.convertTextToPDF(fileData).then(resolve).catch(reject);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(fileData.file);
        });
    }

    createPDFDocument() {
        const { jsPDF } = window.jspdf;
        
        const options = {
            orientation: this.conversionSettings.orientation,
            unit: 'mm',
            format: this.conversionSettings.pageSize.toLowerCase(),
            putOnlyUsedFonts: this.conversionSettings.optimizeSize,
            floatPrecision: this.conversionSettings.quality === 'high' ? 16 : 8
        };
        
        return new jsPDF(options);
    }    async addFormattedTextToPDF(pdf, text, filename) {
        // Create an HTML representation for better formatting
        const htmlContainer = document.createElement('div');
        htmlContainer.style.fontFamily = 'Arial, sans-serif';
        htmlContainer.style.width = '800px';
        htmlContainer.style.padding = '20px';
        htmlContainer.style.backgroundColor = '#FFFFFF';
        
        // Add document title
        const titleElem = document.createElement('h2');
        titleElem.style.marginBottom = '20px';
        titleElem.style.color = '#333333';
        titleElem.style.borderBottom = '1px solid #dddddd';
        titleElem.style.paddingBottom = '10px';
        titleElem.textContent = filename;
        htmlContainer.appendChild(titleElem);
        
        // Process text with basic formatting preservation
        const paragraphs = text.split(/\n\s*\n/);
        
        // Create PDF from HTML container
        document.body.appendChild(htmlContainer);
        
        try {            // Get quality settings based on selected quality level
            const qualitySettings = this.conversionSettings.imageQuality[this.conversionSettings.quality];
            
            // Render HTML to PDF with optimized settings
            const canvas = await html2canvas(htmlContainer, {
                scale: qualitySettings.scale,
                useCORS: true,
                logging: false,
                backgroundColor: '#FFFFFF'
            });
            
            const imgData = canvas.toDataURL(`image/${qualitySettings.format}`, qualitySettings.quality);
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margins = this.getMargins();
            
            // Calculate dimensions maintaining aspect ratio
            const imgWidth = pageWidth - margins.left - margins.right;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // Add the image to the PDF
            let heightLeft = imgHeight;
            let position = margins.top;
            pdf.addImage(imgData, 'PNG', margins.left, position, imgWidth, imgHeight);
            heightLeft -= (pageHeight - margins.top - margins.bottom);
            
            // Add new pages if necessary
            while (heightLeft > 0) {
                position = -(pageHeight - margins.top - margins.bottom - heightLeft);
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', margins.left, position, imgWidth, imgHeight);
                heightLeft -= (pageHeight - margins.top - margins.bottom);
            }
        } finally {
            document.body.removeChild(htmlContainer);
        }
        
        // Add document metadata
        if (this.conversionSettings.addMetadata) {
            pdf.setProperties({
                title: filename,
                creator: 'OMNIFORMA Doc to PDF Converter',
                producer: 'Advanced PDF Conversion Engine',
                creationDate: new Date(),
                keywords: 'document conversion, PDF'
            });
        }
    }

    getMargins() {
        const marginSets = {
            narrow: { top: 12.7, right: 12.7, bottom: 12.7, left: 12.7 },
            normal: { top: 25.4, right: 25.4, bottom: 25.4, left: 25.4 },
            wide: { top: 38.1, right: 38.1, bottom: 38.1, left: 38.1 }
        };
        
        return marginSets[this.conversionSettings.margin] || marginSets.normal;
    }

    generatePDFFileName(originalName) {
        const baseName = originalName.replace(/\.[^/.]+$/, '');
        return `${baseName}_converted.pdf`;
    }

    showProgress() {
        document.getElementById('progressSection').style.display = 'block';
        document.getElementById('actionsSection').style.display = 'none';
    }

    updateProgress(text, percentage) {
        document.querySelector('.progress-text').textContent = text;
        document.querySelector('.progress-percentage').textContent = `${Math.round(percentage)}%`;
        document.getElementById('progressFill').style.width = `${percentage}%`;
    }

    hideProgress() {
        document.getElementById('progressSection').style.display = 'none';
        document.getElementById('actionsSection').style.display = 'block';
    }

    showResults() {
        const resultsSection = document.getElementById('resultsSection');
        const resultsList = document.getElementById('resultsList');
        
        resultsList.innerHTML = '';
        
        this.convertedFiles.forEach(fileData => {
            const resultElement = this.createResultElement(fileData);
            resultsList.appendChild(resultElement);
        });
        
        resultsSection.style.display = 'block';
    }

    createResultElement(fileData) {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'result-item';
        
        if (fileData.status === 'converted') {
            resultDiv.innerHTML = `
                <div class="result-info">
                    <div class="result-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="result-details">
                        <h4>${fileData.downloadName}</h4>
                        <p>Converted from ${fileData.name} • ${this.formatFileSize(fileData.pdfBlob.size)}</p>
                    </div>
                </div>
                <div class="result-actions">
                    <button class="btn-download" onclick="converter.downloadFile('${fileData.id}')">
                        <i class="fas fa-download"></i>
                        Download PDF
                    </button>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `
                <div class="result-info">
                    <div class="result-icon" style="color: #e74c3c;">
                        <i class="fas fa-exclamation-circle"></i>
                    </div>
                    <div class="result-details">
                        <h4>${fileData.name}</h4>
                        <p style="color: #e74c3c;">Conversion failed: ${fileData.error || 'Unknown error'}</p>
                    </div>
                </div>
            `;
            resultDiv.style.background = 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)';
        }
        
        return resultDiv;
    }

    downloadFile(fileId) {
        const fileData = this.convertedFiles.get(fileId);
        if (fileData && fileData.pdfBlob) {
            saveAs(fileData.pdfBlob, fileData.downloadName);
            this.showToast('Download Started', `${fileData.downloadName} is being downloaded`, 'success');
        }
    }

    toggleAdvancedOptions() {
        const toggle = document.getElementById('toggleAdvanced');
        const content = document.getElementById('advancedContent');
        const isVisible = content.style.display !== 'none';
        
        content.style.display = isVisible ? 'none' : 'block';
        toggle.classList.toggle('active');
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    showToast(title, message, type = 'success') {
        const toastContainer = document.getElementById('toastContainer');
        const toastId = `toast_${Date.now()}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.id = toastId;
        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${icons[type]}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" onclick="converter.hideToast('${toastId}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        toastContainer.appendChild(toast);
        
        // Auto-hide after 5 seconds
        setTimeout(() => this.hideToast(toastId), 5000);
    }    hideToast(toastId) {
        const toast = document.getElementById(toastId);
        if (toast) {
            toast.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }
    }

    async convertHtmlToPDF(fileData) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const htmlContent = e.target.result;
                    
                    // Create a temporary container to render the HTML
                    const container = document.createElement('div');
                    container.style.position = 'absolute';
                    container.style.top = '-9999px';
                    container.style.left = '-9999px';
                    container.style.width = '800px'; // Width for rendering
                    container.innerHTML = htmlContent;
                    document.body.appendChild(container);
                    
                    // Create PDF
                    const pdf = this.createPDFDocument();
                      // Use html2canvas to capture the HTML content
                    try {
                        // Get quality settings based on selected quality level
                        const qualitySettings = this.conversionSettings.imageQuality[this.conversionSettings.quality];
                        
                        const canvas = await html2canvas(container, {
                            scale: qualitySettings.scale,
                            useCORS: true,
                            logging: false
                        });
                        
                        const imgData = canvas.toDataURL(`image/${qualitySettings.format}`, qualitySettings.quality);
                        const pageWidth = pdf.internal.pageSize.getWidth();
                        const pageHeight = pdf.internal.pageSize.getHeight();
                        
                        // Calculate dimensions maintaining aspect ratio
                        const imgWidth = pageWidth - 20;
                        const imgHeight = (canvas.height * imgWidth) / canvas.width;
                        
                        // Add the image to the PDF
                        let heightLeft = imgHeight;
                        let position = 10;
                        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                        heightLeft -= (pageHeight - 20);
                        
                        // Add new pages if necessary
                        while (heightLeft > 0) {
                            position = -(pageHeight - 20 - heightLeft);
                            pdf.addPage();
                            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                            heightLeft -= (pageHeight - 20);
                        }
                        
                        // Add metadata if enabled
                        if (this.conversionSettings.addMetadata) {
                            pdf.setProperties({
                                title: fileData.name,
                                creator: 'OMNIFORMA Doc to PDF Converter',
                                creationDate: new Date()
                            });
                        }
                    } finally {
                        // Clean up
                        document.body.removeChild(container);
                    }
                    
                    const pdfBlob = pdf.output('blob');
                    resolve(pdfBlob);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(fileData.file);
        });
    }    async convertPresentationToPDF(fileData) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const arrayBuffer = e.target.result;
                    const extension = this.getFileExtension(fileData.name);
                    const pdf = this.createPDFDocument();
                    
                    if (extension === 'pptx') {
                        try {
                            // Update progress
                            this.updateProgress('Extracting presentation content...', 30);
                            
                            const zip = await JSZip.loadAsync(arrayBuffer);
                            
                            // Find all slide XML files
                            const slideFiles = Object.keys(zip.files).filter(name => 
                                name.startsWith('ppt/slides/slide') && name.endsWith('.xml')
                            ).sort((a, b) => {
                                // Ensure proper slide order
                                const numA = parseInt(a.match(/slide(\d+)\.xml/)[1]);
                                const numB = parseInt(b.match(/slide(\d+)\.xml/)[1]);
                                return numA - numB;
                            });
                            
                            if (slideFiles.length === 0) {
                                throw new Error('No slides found in the presentation.');
                            }
                            
                            this.updateProgress('Processing presentation media...', 40);
                            
                            // Get theme information for better styling
                            let themeData = {};
                            try {
                                if (zip.files['ppt/theme/theme1.xml']) {
                                    const themeXml = await zip.files['ppt/theme/theme1.xml'].async('text');
                                    // Extract background color if available
                                    const bgColorMatch = themeXml.match(/<a:srgbClr val="([A-Fa-f0-9]{6})"/);
                                    if (bgColorMatch) {
                                        themeData.bgColor = '#' + bgColorMatch[1];
                                    }
                                    
                                    // Extract fonts if available
                                    const fontMatch = themeXml.match(/<a:latin typeface="([^"]+)"/);
                                    if (fontMatch) {
                                        themeData.fontFamily = fontMatch[1];
                                    }
                                }
                            } catch (themeError) {
                                console.warn('Could not extract theme data:', themeError);
                            }
                            
                            // Get presentation-wide properties
                            let presentationProps = {};
                            try {
                                if (zip.files['ppt/presentation.xml']) {
                                    const presentationXml = await zip.files['ppt/presentation.xml'].async('text');
                                    // Extract slide size
                                    const sizeMatch = presentationXml.match(/<p:sldSz cx="(\d+)" cy="(\d+)"/);
                                    if (sizeMatch) {
                                        presentationProps.width = parseInt(sizeMatch[1]) / 9525; // Convert to pixels
                                        presentationProps.height = parseInt(sizeMatch[2]) / 9525;
                                    }
                                }
                            } catch (propError) {
                                console.warn('Could not extract presentation properties:', propError);
                            }
                            
                            // Get master slide data for backgrounds
                            let masterSlideData = null;
                            try {
                                if (zip.files['ppt/slideMasters/slideMaster1.xml']) {
                                    const masterXml = await zip.files['ppt/slideMasters/slideMaster1.xml'].async('text');
                                    // Extract background info
                                    const bgFillMatch = masterXml.match(/<p:bg>(.*?)<\/p:bg>/s);
                                    if (bgFillMatch) {
                                        masterSlideData = bgFillMatch[0];
                                    }
                                }
                            } catch (masterError) {
                                console.warn('Could not extract master slide data:', masterError);
                            }
                            
                            // Get media files (images) from the PPTX
                            const mediaFiles = Object.keys(zip.files).filter(name => 
                                name.startsWith('ppt/media/')
                            );
                            
                            this.updateProgress('Loading presentation media...', 50);
                            
                            // Load media files into an object map
                            const mediaMap = {};
                            for (const mediaFile of mediaFiles) {
                                try {
                                    const mediaBlob = await zip.file(mediaFile).async('blob');
                                    const mediaUrl = URL.createObjectURL(mediaBlob);
                                    mediaMap[mediaFile] = mediaUrl;
                                } catch (mediaError) {
                                    console.warn('Failed to load media:', mediaFile, mediaError);
                                }
                            }
                            
                            // Relationship files map image references
                            const relationshipFiles = {};
                            for (const slideFile of slideFiles) {
                                const slideRelsFile = slideFile.replace('slides/slide', 'slides/_rels/slide') + '.rels';
                                if (zip.files[slideRelsFile]) {
                                    const relsXml = await zip.file(slideRelsFile).async('text');
                                    relationshipFiles[slideFile] = relsXml;
                                }
                            }
                            
                            // Process slides with improved visual elements
                            let slideNumber = 1;
                            const margins = this.getMargins();
                            const totalSlides = slideFiles.length;
                            
                            this.updateProgress('Converting slides to PDF...', 60);
                            
                            for (const slideFile of slideFiles) {
                                if (slideNumber > 1) {
                                    pdf.addPage();
                                }
                                
                                this.updateProgress(`Converting slide ${slideNumber} of ${totalSlides}...`, 
                                    60 + (slideNumber / totalSlides) * 30);
                                
                                const slideXml = await zip.file(slideFile).async('text');
                                
                                // Get slide layout data for this specific slide
                                let slideLayoutData = null;
                                try {
                                    const slideLayoutRefs = slideXml.match(/layoutId="([^"]+)"/);
                                    if (slideLayoutRefs && slideLayoutRefs[1]) {
                                        // Could extract more specific layout data here
                                        slideLayoutData = slideLayoutRefs[1];
                                    }
                                } catch (layoutError) {
                                    console.warn('Could not extract slide layout:', layoutError);
                                }
                                
                                // Create a HTML representation of the slide
                                const slideHtml = document.createElement('div');
                                slideHtml.style.width = presentationProps.width ? `${presentationProps.width}px` : '960px';
                                slideHtml.style.height = presentationProps.height ? `${presentationProps.height}px` : '720px';
                                slideHtml.style.position = 'relative';
                                slideHtml.style.overflow = 'hidden';
                                
                                // Set slide background color from theme or default
                                slideHtml.style.backgroundColor = themeData.bgColor || '#FFFFFF';
                                
                                // Add slide background if available from master or theme
                                if (masterSlideData) {
                                    // Check for background fill in masterSlideData
                                    const bgFillMatch = masterSlideData.match(/<a:solidFill>.*?<a:srgbClr val="([A-Fa-f0-9]{6})"/);
                                    if (bgFillMatch) {
                                        slideHtml.style.backgroundColor = `#${bgFillMatch[1]}`;
                                    }
                                    
                                    // Check for background image in master
                                    const bgImgMatch = masterSlideData.match(/blip r:embed="([^"]+)"/);
                                    if (bgImgMatch && relationshipFiles[slideFile]) {
                                        const relsXml = relationshipFiles[slideFile];
                                        const bgImgRef = relsXml.match(new RegExp(`Id="${bgImgMatch[1]}".*?Target="([^"]+)"`));
                                        if (bgImgRef) {
                                            const mediaPath = 'ppt/' + bgImgRef[1].replace('../../', '');
                                            if (mediaMap[mediaPath]) {
                                                slideHtml.style.backgroundImage = `url(${mediaMap[mediaPath]})`;
                                                slideHtml.style.backgroundSize = 'cover';
                                                slideHtml.style.backgroundPosition = 'center';
                                            }
                                        }
                                    }
                                }
                                
                                // Add slide number
                                const slideNumberElem = document.createElement('div');
                                slideNumberElem.style.position = 'absolute';
                                slideNumberElem.style.bottom = '10px';
                                slideNumberElem.style.right = '10px';
                                slideNumberElem.style.fontSize = '12px';
                                slideNumberElem.style.color = '#666666';
                                slideNumberElem.style.padding = '2px 5px';
                                slideNumberElem.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
                                slideNumberElem.style.borderRadius = '3px';
                                slideNumberElem.textContent = `Slide ${slideNumber}`;
                                slideHtml.appendChild(slideNumberElem);
                                
                                // Find title in the slide XML
                                let title = '';
                                const titleMatch = slideXml.match(/<a:t>(.*?)<\/a:t>/);
                                if (titleMatch && titleMatch[1]) {
                                    title = titleMatch[1].trim();
                                }
                                
                                // Add title if found
                                if (title) {
                                    const titleElem = document.createElement('h1');
                                    titleElem.style.fontSize = '32px';
                                    titleElem.style.fontFamily = themeData.fontFamily || 'Arial, sans-serif';
                                    titleElem.style.color = '#333333';
                                    titleElem.style.marginBottom = '20px';
                                    titleElem.style.padding = '30px 20px 10px';
                                    titleElem.style.textAlign = 'center';
                                    titleElem.style.fontWeight = 'bold';
                                    titleElem.textContent = title;
                                    slideHtml.appendChild(titleElem);
                                }
                                
                                // Extract all text content
                                const textMatches = slideXml.match(/<a:t>(.*?)<\/a:t>/g);
                                if (textMatches) {
                                    const contentElem = document.createElement('div');
                                    contentElem.style.padding = '20px 40px';
                                    contentElem.style.fontSize = '22px';
                                    contentElem.style.fontFamily = themeData.fontFamily || 'Arial, sans-serif';
                                    contentElem.style.color = '#333333';
                                    
                                    for (let i = title ? 1 : 0; i < textMatches.length; i++) {
                                        const text = textMatches[i].replace(/<a:t>(.*?)<\/a:t>/, '$1').trim();
                                        if (text) {
                                            const p = document.createElement('p');
                                            p.style.margin = '15px 0';
                                            p.textContent = text;
                                            
                                            // Check if this is a bullet point (common in presentations)
                                            if (textMatches[i].indexOf('<a:buChar') > -1 || 
                                                slideXml.indexOf('<a:buAutoNum') > -1) {
                                                p.style.paddingLeft = '25px';
                                                p.style.position = 'relative';
                                                p.innerHTML = '• ' + p.textContent;
                                            }
                                            
                                            contentElem.appendChild(p);
                                        }
                                    }
                                    
                                    slideHtml.appendChild(contentElem);
                                }
                                
                                // Check for images in the relationships and add them
                                if (relationshipFiles[slideFile]) {
                                    const relsXml = relationshipFiles[slideFile];
                                    const imageRefs = relsXml.match(/Target="\.\.\/\.\.\/media\/(.*?)"/g);
                                    
                                    if (imageRefs) {
                                        const imageContainer = document.createElement('div');
                                        imageContainer.style.display = 'flex';
                                        imageContainer.style.flexWrap = 'wrap';
                                        imageContainer.style.justifyContent = 'center';
                                        imageContainer.style.alignItems = 'center';
                                        imageContainer.style.gap = '20px';
                                        imageContainer.style.padding = '20px';
                                        imageContainer.style.maxWidth = '100%';
                                        
                                        for (let i = 0; i < imageRefs.length; i++) {
                                            const imageRef = imageRefs[i].match(/Target="(.*?)"/)[1];
                                            const mediaPath = 'ppt/' + imageRef.replace('../../', '');
                                            
                                            if (mediaMap[mediaPath]) {
                                                // Find position info for this image if available
                                                let imgPosition = null;
                                                try {
                                                    // This is a simplified version - would need more complex parsing
                                                    // for exact positioning of every element
                                                    const imgId = Object.keys(mediaMap).findIndex(key => key === mediaPath) + 1;
                                                    const posMatch = slideXml.match(new RegExp(`<p:pic>.*?<a:off x="(\\d+)" y="(\\d+)"/>.*?<a:ext cx="(\\d+)" cy="(\\d+)"/>`, 's'));
                                                    
                                                    if (posMatch) {
                                                        imgPosition = {
                                                            x: parseInt(posMatch[1]) / 9525, // Convert EMU to px
                                                            y: parseInt(posMatch[2]) / 9525,
                                                            w: parseInt(posMatch[3]) / 9525,
                                                            h: parseInt(posMatch[4]) / 9525
                                                        };
                                                    }
                                                } catch (posError) {
                                                    console.warn('Could not extract image position:', posError);
                                                }
                                                
                                                const img = document.createElement('img');
                                                img.src = mediaMap[mediaPath];
                                                img.style.maxWidth = imgPosition ? `${imgPosition.w}px` : '80%';
                                                img.style.maxHeight = imgPosition ? `${imgPosition.h}px` : '50%';
                                                img.style.display = 'block';
                                                
                                                if (imgPosition) {
                                                    img.style.position = 'absolute';
                                                    img.style.left = `${imgPosition.x}px`;
                                                    img.style.top = `${imgPosition.y}px`;
                                                    img.style.width = `${imgPosition.w}px`;
                                                    img.style.height = 'auto';
                                                    slideHtml.appendChild(img);
                                                } else {
                                                    img.style.margin = '10px';
                                                    img.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                                                    imageContainer.appendChild(img);
                                                }
                                            }
                                        }
                                        
                                        if (imageContainer.children.length > 0) {
                                            slideHtml.appendChild(imageContainer);
                                        }
                                    }
                                }
                                
                                // Add the slide HTML to the DOM for rendering
                                document.body.appendChild(slideHtml);
                                
                                try {
                                    // Wait for images to load
                                    await Promise.all(Array.from(slideHtml.querySelectorAll('img')).map(img => {
                                        return new Promise((resolve) => {
                                            if (img.complete) {
                                                resolve();
                                            } else {
                                                img.onload = () => resolve();
                                                img.onerror = () => resolve(); // Continue even if image fails
                                            }
                                        });
                                    }));
                                      // Get quality settings based on selected quality level
                                    const qualitySettings = this.conversionSettings.imageQuality[this.conversionSettings.quality];
                                    
                                    // Render the slide to the PDF with optimized settings
                                    const canvas = await html2canvas(slideHtml, {
                                        scale: qualitySettings.scale,
                                        useCORS: true,
                                        allowTaint: true,
                                        logging: false,
                                        backgroundColor: null // Use null to respect slide's background
                                    });
                                    
                                    const imgData = canvas.toDataURL(`image/${qualitySettings.format}`, qualitySettings.quality);
                                    const pageWidth = pdf.internal.pageSize.getWidth();
                                    const pageHeight = pdf.internal.pageSize.getHeight();
                                    
                                    // Adjust dimensions to fit the page
                                    const imgWidth = pageWidth - margins.left - margins.right;
                                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                                    
                                    // Add the slide image to the PDF
                                    pdf.addImage(imgData, 'PNG', margins.left, margins.top, imgWidth, imgHeight);
                                    
                                } finally {
                                    // Clean up
                                    document.body.removeChild(slideHtml);
                                }
                                
                                slideNumber++;
                            }
                            
                            // Clean up all object URLs
                            for (const mediaPath in mediaMap) {
                                URL.revokeObjectURL(mediaMap[mediaPath]);
                            }
                            
                        } catch (zipError) {
                            console.error('Error parsing PPTX:', zipError);
                            // Fallback to basic handling
                            this.addBasicPresentationPage(pdf, fileData.name);
                        }
                    } else {
                        // For PPT, just add a basic placeholder page
                        this.addBasicPresentationPage(pdf, fileData.name);
                    }
                    
                    // Add metadata if enabled
                    if (this.conversionSettings.addMetadata) {
                        pdf.setProperties({
                            title: fileData.name,
                            creator: 'OMNIFORMA Doc to PDF Converter',
                            creationDate: new Date(),
                            subject: 'Converted Presentation',
                            author: 'OMNIFORMA Tools'
                        });
                    }
                    
                    const pdfBlob = pdf.output('blob');
                    resolve(pdfBlob);
                } catch (error) {
                    console.error("PowerPoint conversion error:", error);
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(fileData.file);
        });
    }
    
    addBasicPresentationPage(pdf, filename) {
        const margins = this.getMargins();
        
        // Add title
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Presentation: ${filename}`, margins.left, margins.top);
        
        // Add explanation
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        const text = "This presentation has been converted to a basic PDF. " +
            "For best results with slide formatting, consider saving your presentation " +
            "as PPTX format before converting.";
            
        const contentLines = pdf.splitTextToSize(text, 
            pdf.internal.pageSize.getWidth() - margins.left - margins.right);
            
        pdf.text(contentLines, margins.left, margins.top + 30);
    }
      async convertSpreadsheetToPDF(fileData) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const arrayBuffer = e.target.result;
                    const extension = this.getFileExtension(fileData.name);
                    const pdf = this.createPDFDocument();
                    const margins = this.getMargins();
                    
                    this.updateProgress('Processing spreadsheet data...', 40);
                    
                    if (extension === 'csv') {
                        // Process CSV file with improved visual formatting
                        const text = new TextDecoder().decode(arrayBuffer);
                        const lines = text.split(/\r?\n/);
                        
                        if (lines.length === 0) {
                            throw new Error('CSV file is empty.');
                        }
                        
                        this.updateProgress('Creating spreadsheet visualization...', 60);
                        
                        // Create HTML table for better rendering
                        const tableHtml = document.createElement('div');
                        tableHtml.style.fontFamily = 'Arial, sans-serif';
                        tableHtml.style.width = '1000px'; // Wider for better table display
                        tableHtml.style.padding = '20px';
                        tableHtml.style.backgroundColor = '#FFFFFF';
                        
                        // Add title with better styling
                        const titleElem = document.createElement('h2');
                        titleElem.textContent = fileData.name;
                        titleElem.style.marginBottom = '20px';
                        titleElem.style.color = '#333333';
                        titleElem.style.fontWeight = '600';
                        titleElem.style.borderBottom = '2px solid #4472C4';
                        titleElem.style.paddingBottom = '10px';
                        tableHtml.appendChild(titleElem);
                        
                        // Add spreadsheet details
                        const infoDiv = document.createElement('div');
                        infoDiv.style.fontSize = '12px';
                        infoDiv.style.color = '#666';
                        infoDiv.style.marginBottom = '15px';
                        infoDiv.textContent = `${lines.length - 1} rows • ${this.parseCSVLine(lines[0]).length} columns`;
                        tableHtml.appendChild(infoDiv);
                        
                        // Create table element with enhanced styling
                        const table = document.createElement('table');
                        table.style.width = '100%';
                        table.style.borderCollapse = 'collapse';
                        table.style.border = '1px solid #dddddd';
                        table.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                        
                        // Parse header row
                        const header = this.parseCSVLine(lines[0]);
                        
                        // Create table header with enhanced styling
                        const thead = document.createElement('thead');
                        const headerRow = document.createElement('tr');
                        headerRow.style.backgroundColor = '#4472C4';
                        headerRow.style.color = 'white';
                        
                        for (let i = 0; i < header.length; i++) {
                            const th = document.createElement('th');
                            th.textContent = header[i];
                            th.style.padding = '12px 8px';
                            th.style.border = '1px solid #dddddd';
                            th.style.textAlign = 'left';
                            th.style.fontWeight = '600';
                            th.style.position = 'relative';
                            headerRow.appendChild(th);
                        }
                        
                        thead.appendChild(headerRow);
                        table.appendChild(thead);
                        
                        // Create table body
                        const tbody = document.createElement('tbody');
                        
                        // Handle large datasets by limiting the number of rows displayed
                        const maxRows = Math.min(lines.length, 500); // Limit to 500 rows for performance
                        
                        for (let i = 1; i < maxRows; i++) {
                            if (lines[i].trim() === '') continue;
                            
                            const cells = this.parseCSVLine(lines[i]);
                            const row = document.createElement('tr');
                            
                            // Add alternating row background with lighter colors
                            if (i % 2 === 0) {
                                row.style.backgroundColor = '#f5f5f5';
                            }
                            
                            for (let j = 0; j < Math.min(cells.length, header.length); j++) {
                                const td = document.createElement('td');
                                const cellValue = cells[j].trim();
                                
                                // Special formatting for numeric values
                                if (/^-?\d+(\.\d+)?$/.test(cellValue)) {
                                    td.style.textAlign = 'right';
                                    // Format numbers if they look like currencies
                                    if (/^\$?\d+(\.\d{2})?$/.test(cellValue)) {
                                        td.textContent = cellValue.startsWith('$') ? cellValue : '$' + cellValue;
                                        td.style.color = '#2e7d32'; // Green for money values
                                    } else {
                                        td.textContent = cellValue;
                                    }
                                } else {
                                    td.textContent = cellValue;
                                    
                                    // Check if this cell contains a date
                                    const dateFormats = [
                                        /^\d{1,2}\/\d{1,2}\/\d{2,4}$/, // MM/DD/YYYY
                                        /^\d{4}-\d{1,2}-\d{1,2}$/      // YYYY-MM-DD
                                    ];
                                    
                                    if (dateFormats.some(format => format.test(cellValue))) {
                                        td.style.color = '#1565c0'; // Blue for dates
                                    }
                                }
                                
                                td.style.padding = '10px 8px';
                                td.style.border = '1px solid #dddddd';
                                row.appendChild(td);
                            }
                            
                            tbody.appendChild(row);
                        }
                        
                        // If we limited the rows, add an indicator
                        if (lines.length > maxRows) {
                            const limitRow = document.createElement('tr');
                            const limitCell = document.createElement('td');
                            limitCell.colSpan = header.length;
                            limitCell.style.padding = '10px';
                            limitCell.style.textAlign = 'center';
                            limitCell.style.backgroundColor = '#ffebee';
                            limitCell.textContent = `Showing ${maxRows - 1} of ${lines.length - 1} rows`;
                            limitRow.appendChild(limitCell);
                            tbody.appendChild(limitRow);
                        }
                        
                        table.appendChild(tbody);
                        tableHtml.appendChild(table);
                        
                        // Add legend for data types if needed
                        if (tbody.querySelectorAll('td[style*="color: #2e7d32"]').length > 0 || 
                            tbody.querySelectorAll('td[style*="color: #1565c0"]').length > 0) {
                            
                            const legend = document.createElement('div');
                            legend.style.marginTop = '15px';
                            legend.style.fontSize = '12px';
                            legend.style.display = 'flex';
                            legend.style.gap = '15px';
                            
                            if (tbody.querySelectorAll('td[style*="color: #2e7d32"]').length > 0) {
                                const moneyLegend = document.createElement('div');
                                moneyLegend.innerHTML = '<span style="color: #2e7d32;">■</span> Currency values';
                                legend.appendChild(moneyLegend);
                            }
                            
                            if (tbody.querySelectorAll('td[style*="color: #1565c0"]').length > 0) {
                                const dateLegend = document.createElement('div');
                                dateLegend.innerHTML = '<span style="color: #1565c0;">■</span> Date values';
                                legend.appendChild(dateLegend);
                            }
                            
                            tableHtml.appendChild(legend);
                        }
                        
                        this.updateProgress('Rendering spreadsheet to PDF...', 80);
                        
                        // Add to DOM for rendering
                        document.body.appendChild(tableHtml);
                        
                        try {                            // Get quality settings based on selected quality level
                            const qualitySettings = this.conversionSettings.imageQuality[this.conversionSettings.quality];
                            
                            // Render HTML table to PDF with optimized quality settings
                            const canvas = await html2canvas(tableHtml, {
                                scale: qualitySettings.scale,
                                useCORS: true,
                                logging: false,
                                backgroundColor: '#FFFFFF'
                            });
                            
                            const imgData = canvas.toDataURL(`image/${qualitySettings.format}`, qualitySettings.quality);
                            const pageWidth = pdf.internal.pageSize.getWidth();
                            const pageHeight = pdf.internal.pageSize.getHeight();
                            
                            // Calculate dimensions maintaining aspect ratio
                            const imgWidth = pageWidth - margins.left - margins.right;
                            const imgHeight = (canvas.height * imgWidth) / canvas.width;
                            
                            // Add the image to the PDF
                            let heightLeft = imgHeight;
                            let position = margins.top;
                            pdf.addImage(imgData, 'PNG', margins.left, position, imgWidth, imgHeight);
                            heightLeft -= (pageHeight - margins.top - margins.bottom);
                            
                            // Add new pages if necessary
                            while (heightLeft > 0) {
                                position = -(pageHeight - margins.top - margins.bottom - heightLeft);
                                pdf.addPage();
                                pdf.addImage(imgData, 'PNG', margins.left, position, imgWidth, imgHeight);
                                heightLeft -= (pageHeight - margins.top - margins.bottom);
                            }
                        } finally {
                            document.body.removeChild(tableHtml);
                        }
                    } else if (extension === 'xlsx' || extension === 'xls') {
                        // For Excel files, create a visual representation
                        try {
                            const zip = await JSZip.loadAsync(arrayBuffer);
                            
                            this.updateProgress('Extracting Excel data...', 50);
                            
                            // Check if this is an Excel file with expected structure
                            if (zip.files['xl/worksheets/sheet1.xml']) {
                                // Get styles if available (for cell formatting)
                                let styles = {};
                                try {
                                    if (zip.files['xl/styles.xml']) {
                                        const stylesXml = await zip.files['xl/styles.xml'].async('text');
                                        // Extract cell styles (simplified)
                                        const numFmtMatches = stylesXml.match(/<numFmt numFmtId="(\d+)" formatCode="([^"]+)"/g);
                                        if (numFmtMatches) {
                                            numFmtMatches.forEach(match => {
                                                const idMatch = match.match(/numFmtId="(\d+)"/);
                                                const formatMatch = match.match(/formatCode="([^"]+)"/);
                                                if (idMatch && formatMatch) {
                                                    styles[idMatch[1]] = formatMatch[1];
                                                }
                                            });
                                        }
                                    }
                                } catch (styleError) {
                                    console.warn('Could not parse Excel styles:', styleError);
                                }
                                
                                // Get shared strings if available (contains text content)
                                let sharedStrings = [];
                                if (zip.files['xl/sharedStrings.xml']) {
                                    const sharedStringsXml = await zip.files['xl/sharedStrings.xml'].async('text');
                                    const stringMatches = sharedStringsXml.match(/<si>.*?<\/si>/sg);
                                    if (stringMatches) {
                                        sharedStrings = stringMatches.map(str => {
                                            // Extract text from string items, handling both simple and rich text
                                            const textMatches = str.match(/<t[^>]*>(.*?)<\/t>/sg);
                                            return textMatches ? 
                                                textMatches.map(t => t.replace(/<[^>]+>/g, '')).join('') : '';
                                        });
                                    }
                                }
                                
                                this.updateProgress('Processing Excel worksheet...', 70);
                                
                                // Get worksheet data
                                const sheetXml = await zip.files['xl/worksheets/sheet1.xml'].async('text');
                                
                                // Extract information about images in the workbook
                                let drawingRels = {};
                                try {
                                    if (sheetXml.includes('drawing')) {
                                        const drawingMatch = sheetXml.match(/drawing r:id="([^"]+)"/);
                                        if (drawingMatch && drawingMatch[1]) {
                                            const drawingId = drawingMatch[1];
                                            const drawingRelsPath = 'xl/drawings/_rels/drawing1.xml.rels';
                                            
                                            if (zip.files[drawingRelsPath]) {
                                                const drawingRelsXml = await zip.files[drawingRelsPath].async('text');
                                                const imageMatches = drawingRelsXml.match(/Target="\.\.\/media\/image\d+\.\w+"/g);
                                                
                                                if (imageMatches) {
                                                    for (let i = 0; i < imageMatches.length; i++) {
                                                        const imageRef = imageMatches[i].match(/Target="([^"]+)"/)[1];
                                                        const mediaPath = 'xl/' + imageRef.replace('../../', '');
                                                        drawingRels['image' + (i+1)] = mediaPath;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } catch (drawingError) {
                                    console.warn('Could not extract Excel drawings:', drawingError);
                                }
                                
                                // Get media files (images) from the XLSX
                                const mediaFiles = Object.keys(zip.files).filter(name => 
                                    name.startsWith('xl/media/')
                                );
                                
                                // Load media files into an object map
                                const mediaMap = {};
                                for (const mediaFile of mediaFiles) {
                                    try {
                                        const mediaBlob = await zip.file(mediaFile).async('blob');
                                        const mediaUrl = URL.createObjectURL(mediaBlob);
                                        mediaMap[mediaFile] = mediaUrl;
                                    } catch (mediaError) {
                                        console.warn('Failed to load media:', mediaFile, mediaError);
                                    }
                                }
                                
                                // Create HTML table from Excel data
                                const excelHtml = document.createElement('div');
                                excelHtml.style.fontFamily = 'Arial, sans-serif';
                                excelHtml.style.width = '1000px'; // Wider for better Excel visualization
                                excelHtml.style.padding = '20px';
                                excelHtml.style.backgroundColor = '#FFFFFF';
                                
                                // Add title with Excel style header
                                const titleElem = document.createElement('h2');
                                titleElem.textContent = fileData.name;
                                titleElem.style.marginBottom = '20px';
                                titleElem.style.color = '#217346'; // Excel green
                                titleElem.style.borderBottom = '2px solid #217346';
                                titleElem.style.paddingBottom = '10px';
                                titleElem.style.fontWeight = '600';
                                excelHtml.appendChild(titleElem);
                                
                                // Create Excel visualization with enhanced styling
                                const table = document.createElement('table');
                                table.style.width = '100%';
                                table.style.borderCollapse = 'collapse';
                                table.style.border = '1px solid #dddddd';
                                table.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                
                                // Extract rows from the worksheet
                                const rowMatches = sheetXml.match(/<row.*?<\/row>/g);
                                
                                if (rowMatches && rowMatches.length > 0) {
                                    for (let i = 0; i < rowMatches.length; i++) {
                                        const rowXml = rowMatches[i];
                                        const row = document.createElement('tr');
                                        
                                        // Add alternating row background
                                        if (i % 2 === 1) {
                                            row.style.backgroundColor = '#f9f9f9';
                                        } else if (i === 0) {
                                            row.style.backgroundColor = '#f2f2f2';
                                            row.style.fontWeight = 'bold';
                                        }
                                        
                                        // Extract cells from row
                                        const cellMatches = rowXml.match(/<c.*?<\/c>|<c.*?\/>/g);
                                        
                                        if (cellMatches) {
                                            for (const cellXml of cellMatches) {
                                                const cell = document.createElement(i === 0 ? 'th' : 'td');
                                                cell.style.padding = i === 0 ? '10px' : '8px';
                                                cell.style.border = '1px solid #dddddd';
                                                cell.style.textAlign = 'left';
                                                
                                                // Extract cell value
                                                let cellValue = '';
                                                
                                                // Check if cell has a shared string reference
                                                const sharedStringMatch = cellXml.match(/t="s".*?<v>(\d+)<\/v>/);
                                                if (sharedStringMatch && sharedStrings.length > 0) {
                                                    const stringIndex = parseInt(sharedStringMatch[1]);
                                                    if (stringIndex >= 0 && stringIndex < sharedStrings.length) {
                                                        cellValue = sharedStrings[stringIndex];
                                                    }
                                                } else {
                                                    // Get direct value
                                                    const valueMatch = cellXml.match(/<v>(.*?)<\/v>/);
                                                    if (valueMatch) {
                                                        cellValue = valueMatch[1];
                                                    }
                                                }
                                                
                                                cell.textContent = cellValue;
                                                row.appendChild(cell);
                                            }
                                        }
                                        
                                        table.appendChild(row);
                                    }
                                } else {
                                    const noDataRow = document.createElement('tr');
                                    const noDataCell = document.createElement('td');
                                    noDataCell.textContent = 'No data found in Excel file';
                                    noDataCell.style.padding = '10px';
                                    noDataRow.appendChild(noDataCell);
                                    table.appendChild(noDataRow);
                                }
                                
                                excelHtml.appendChild(table);
                                
                                // Add to DOM for rendering
                                document.body.appendChild(excelHtml);
                                  try {
                                    // Get quality settings based on selected quality level
                                    const qualitySettings = this.conversionSettings.imageQuality[this.conversionSettings.quality];
                                    
                                    // Render Excel visualization to PDF with optimized settings
                                    const canvas = await html2canvas(excelHtml, {
                                        scale: qualitySettings.scale,
                                        logging: false,
                                        backgroundColor: '#FFFFFF'
                                    });
                                    
                                    const imgData = canvas.toDataURL(`image/${qualitySettings.format}`, qualitySettings.quality);
                                    const pageWidth = pdf.internal.pageSize.getWidth();
                                    const pageHeight = pdf.internal.pageSize.getHeight();
                                    
                                    // Calculate dimensions maintaining aspect ratio
                                    const imgWidth = pageWidth - margins.left - margins.right;
                                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                                    
                                    // Add the image to the PDF
                                    let heightLeft = imgHeight;
                                    let position = margins.top;
                                    pdf.addImage(imgData, 'PNG', margins.left, position, imgWidth, imgHeight);
                                    heightLeft -= (pageHeight - margins.top - margins.bottom);
                                    
                                    // Add new pages if necessary
                                    while (heightLeft > 0) {
                                        position = -(pageHeight - margins.top - margins.bottom - heightLeft);
                                        pdf.addPage();
                                        pdf.addImage(imgData, 'PNG', margins.left, position, imgWidth, imgHeight);
                                        heightLeft -= (pageHeight - margins.top - margins.bottom);
                                    }
                                } finally {
                                    document.body.removeChild(excelHtml);
                                }
                            } else {
                                // Fallback for Excel files that don't have the expected structure
                                throw new Error('Unsupported Excel format');
                            }
                        } catch (err) {
                            // Fallback to basic representation
                            pdf.setFontSize(24);
                            pdf.setFont('helvetica', 'bold');
                            pdf.text(`Excel Spreadsheet: ${fileData.name}`, margins.left, margins.top);
                            
                            pdf.setFontSize(12);
                            pdf.setFont('helvetica', 'normal');
                            const text = "This Excel file has been partially converted to PDF. " +
                                "For best results with data formatting, consider saving your spreadsheet " +
                                "as CSV format before converting.";
                                
                            const contentLines = pdf.splitTextToSize(text, 
                                pdf.internal.pageSize.getWidth() - margins.left - margins.right);
                                
                            pdf.text(contentLines, margins.left, margins.top + 30);
                        }
                    } else {
                        // For other spreadsheet formats
                        pdf.setFontSize(24);
                        pdf.setFont('helvetica', 'bold');
                        pdf.text(`Spreadsheet: ${fileData.name}`, margins.left, margins.top);
                        
                        pdf.setFontSize(12);
                        pdf.setFont('helvetica', 'normal');
                        const text = "This spreadsheet has been converted to PDF. " +
                            "For best results with data formatting, consider saving your spreadsheet " +
                            "as CSV or Excel format before converting.";
                            
                        const contentLines = pdf.splitTextToSize(text, 
                            pdf.internal.pageSize.getWidth() - margins.left - margins.right);
                            
                        pdf.text(contentLines, margins.left, margins.top + 30);
                    }
                    
                    // Add metadata if enabled
                    if (this.conversionSettings.addMetadata) {
                        pdf.setProperties({
                            title: fileData.name,
                            creator: 'OMNIFORMA Doc to PDF Converter',
                            creationDate: new Date()
                        });
                    }
                    
                    const pdfBlob = pdf.output('blob');
                    resolve(pdfBlob);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(fileData.file);
        });
    }
    
    parseCSVLine(line) {
        const result = [];
        let startPos = 0;
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            if (line[i] === '"') {
                inQuotes = !inQuotes;
            } else if (line[i] === ',' && !inQuotes) {
                result.push(line.substring(startPos, i).replace(/^"|"$/g, '').trim());
                startPos = i + 1;
            }
        }
        
        // Add the last field
        result.push(line.substring(startPos).replace(/^"|"$/g, '').trim());
        return result;
    }
    
    async convertStructuredDataToPDF(fileData) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const text = e.target.result;
                    const extension = this.getFileExtension(fileData.name);
                    const pdf = this.createPDFDocument();
                    const margins = this.getMargins();
                    
                    // Set monospace font for code
                    pdf.setFont('courier', 'normal');
                    pdf.setFontSize(9);
                    
                    let formattedText;
                    
                    // Format the content based on file type
                    if (extension === 'json') {
                        try {
                            const jsonData = JSON.parse(text);
                            formattedText = JSON.stringify(jsonData, null, 2);
                        } catch (jsonError) {
                            formattedText = text; // Use raw text if JSON parsing fails
                        }
                    } else if (extension === 'xml') {
                        // Simple XML formatting (for a proper solution, use a dedicated XML formatter)
                        formattedText = text
                            .replace(/></g, '>\n<')
                            .replace(/\\s+</g, '<')
                            .replace(/>\\s+/g, '>');
                    }
                    
                    // Split text into lines
                    const lines = formattedText.split('\n');
                    let y = margins.top;
                    const lineHeight = 5;
                    
                    for (let i = 0; i < lines.length; i++) {
                        if (y + lineHeight > pdf.internal.pageSize.getHeight() - margins.bottom) {
                            pdf.addPage();
                            y = margins.top;
                        }
                        
                        pdf.text(lines[i], margins.left, y);
                        y += lineHeight;
                    }
                    
                    // Add metadata if enabled
                    if (this.conversionSettings.addMetadata) {
                        pdf.setProperties({
                            title: fileData.name,
                            creator: 'OMNIFORMA Doc to PDF Converter',
                            creationDate: new Date()
                        });
                    }
                    
                    const pdfBlob = pdf.output('blob');
                    resolve(pdfBlob);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(fileData.file);
        });
    }
    
    async convertAppleFormatToPDF(fileData) {
        return new Promise((resolve, reject) => {
            try {
                const extension = this.getFileExtension(fileData.name);
                const pdf = this.createPDFDocument();
                const margins = this.getMargins();
                
                // Apple formats (.pages, .numbers, .key) can't be directly processed in the browser
                // So we'll add an information page
                
                // Add title
                pdf.setFontSize(24);
                pdf.setFont('helvetica', 'bold');
                
                let formatName;
                switch (extension) {
                    case 'pages': formatName = 'Pages'; break;
                    case 'numbers': formatName = 'Numbers'; break;
                    case 'key': formatName = 'Keynote'; break;
                    default: formatName = 'Apple Format';
                }
                
                pdf.text(`Apple ${formatName} Document`, margins.left, margins.top);
                
                // Add explanation
                pdf.setFontSize(12);
                pdf.setFont('helvetica', 'normal');
                const text = `This file is in Apple ${formatName} format which cannot be directly converted in a web browser. ` +
                    `For best results, please open this file in ${formatName} and export it to a compatible format like: \n\n` +
                    `• PDF (directly from ${formatName})\n` +
                    `• DOCX for Pages documents\n` +
                    `• XLSX or CSV for Numbers spreadsheets\n` +
                    `• PPTX for Keynote presentations`;
                    
                const contentLines = pdf.splitTextToSize(text, 
                    pdf.internal.pageSize.getWidth() - margins.left - margins.right);
                    
                pdf.text(contentLines, margins.left, margins.top + 30);
                
                // Add metadata if enabled
                if (this.conversionSettings.addMetadata) {
                    pdf.setProperties({
                        title: fileData.name,
                        creator: 'OMNIFORMA Doc to PDF Converter',
                        creationDate: new Date()
                    });
                }
                
                const pdfBlob = pdf.output('blob');
                resolve(pdfBlob);
            } catch (error) {
                reject(error);
            }
        });
    }
}

// CSS for slide out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// Initialize the converter when the DOM is loaded
let converter;
document.addEventListener('DOMContentLoaded', () => {
    converter = new DocToPDFConverter();
    console.log('Advanced Doc to PDF Converter initialized');
});

// Global functions for button clicks
window.converter = converter;
