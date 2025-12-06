// Enhanced Barcode Generator Script

class BarcodeGenerator {    constructor() {
        this.canvas = document.getElementById('barcodeCanvas');
        this.placeholderText = document.getElementById('placeholderText');
        this.errorMessage = document.getElementById('errorMessage');
        this.errorText = document.getElementById('errorText');
        this.currentTheme = 'dark';
        this.currentBarcodeData = null; // Store current barcode data for downloads
        this.settings = {
            quality: 'high',
            defaultFormat: 'CODE128',
            autoGenerate: false,
            showText: true
        };
        
        this.initializeElements();
        this.initializeEventListeners();
        this.initializeParticles();
        this.initializeNavigation();
        this.loadSettings();        this.initializeAdvancedOptions();
        this.initializeColorSync();
        this.initializeResponsiveHandlers();
        
        // Initialize mobile optimizations
        this.initializeMobileOptimizations();
        
        // Generate initial barcode after a short delay to ensure all elements are loaded
        setTimeout(() => {
            this.generateInitialBarcode();
        }, 500);
    }initializeElements() {
        this.elements = {
            // Input elements
            barcodeData: document.getElementById('barcodeData'),
            barcodeType: document.getElementById('barcodeType'),
            barcodeWidth: document.getElementById('barcodeWidth'),
            barcodeHeight: document.getElementById('barcodeHeight'),
            widthRange: document.getElementById('widthRange'),
            heightRange: document.getElementById('heightRange'),            backgroundColor: document.getElementById('backgroundColor'),
            foregroundColor: document.getElementById('foregroundColor'),
            bgColorText: document.getElementById('bgColorText'),
            fgColorText: document.getElementById('fgColorText'),
            displayText: document.getElementById('displayText'),
            fontSize: document.getElementById('fontSize') || { value: '14' },
            textAlign: document.getElementById('textAlign') || { value: 'center' },
            textPosition: document.getElementById('textPosition') || { value: 'bottom' },
            textMargin: document.getElementById('textMargin') || { value: '10' },
            
            // Buttons
            generateBtn: document.getElementById('generateBtn'),
            downloadPngBtn: document.getElementById('downloadPngBtn'),
            downloadJpgBtn: document.getElementById('downloadJpgBtn'),
            downloadSvgBtn: document.getElementById('downloadSvgBtn'),
            downloadPdfBtn: document.getElementById('downloadPdfBtn'),            copyBtn: document.getElementById('copyBtn'),
            shareBtn: document.getElementById('shareBtn'),
            printBtn: document.getElementById('printBtn'),
            
            // Data action buttons
            pasteDataBtn: document.getElementById('pasteDataBtn'),
            clearDataBtn: document.getElementById('clearDataBtn'),
            randomDataBtn: document.getElementById('randomDataBtn'),
            
            // Navigation
            fullscreenBtn: document.getElementById('fullscreenBtn'),
            themeBtn: document.getElementById('themeBtn'),
            settingsBtn: document.getElementById('settingsBtn'),
            helpBtn: document.getElementById('helpBtn'),
            
            // Modals
            helpModal: document.getElementById('helpModal'),
            settingsModal: document.getElementById('settingsModal'),
            closeHelp: document.getElementById('closeHelp'),
            closeSettings: document.getElementById('closeSettings'),            
            // Advanced options
            advancedToggle: document.getElementById('advancedToggle'),
            advancedOptions: document.getElementById('advancedContent'),
            
            // Settings elements
            qualitySelect: document.getElementById('qualitySelect'),
            defaultFormatSelect: document.getElementById('defaultFormatSelect'),
            autoGenerateToggle: document.getElementById('autoGenerateToggle'),
            showTextToggle: document.getElementById('showTextToggle'),
            themeSelect: document.getElementById('themeSelect')
        };
    }

    initializeEventListeners() {
        // Generate barcode
        this.elements.generateBtn.addEventListener('click', () => this.generateBarcode());
        
        // Auto-generate on input change
        this.elements.barcodeData.addEventListener('input', () => {
            if (this.settings.autoGenerate) {
                this.debounce(() => this.generateBarcode(), 500)();
            }
        });
        
        // Download formats
        this.elements.downloadPngBtn.addEventListener('click', () => this.downloadBarcode('png'));
        this.elements.downloadJpgBtn.addEventListener('click', () => this.downloadBarcode('jpg'));
        this.elements.downloadSvgBtn.addEventListener('click', () => this.downloadBarcode('svg'));
        this.elements.downloadPdfBtn.addEventListener('click', () => this.downloadBarcode('pdf'));
          // Actions
        this.elements.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.elements.shareBtn.addEventListener('click', () => this.shareBarcode());
        this.elements.printBtn.addEventListener('click', () => this.printBarcode());
        
        // Data action buttons
        if (this.elements.pasteDataBtn) {
            this.elements.pasteDataBtn.addEventListener('click', () => this.pasteData());
        }
        if (this.elements.clearDataBtn) {
            this.elements.clearDataBtn.addEventListener('click', () => this.clearData());
        }
        if (this.elements.randomDataBtn) {
            this.elements.randomDataBtn.addEventListener('click', () => this.generateRandomData());
        }
        
        // Navigation actions
        this.elements.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        this.elements.themeBtn.addEventListener('click', () => this.toggleTheme());
        this.elements.settingsBtn.addEventListener('click', () => this.showSettings());
        this.elements.helpBtn.addEventListener('click', () => this.showHelp());
        
        // Modal close buttons
        this.elements.closeHelp.addEventListener('click', () => this.hideHelp());
        this.elements.closeSettings.addEventListener('click', () => this.hideSettings());
        
        // Modal click outside to close
        this.elements.helpModal.addEventListener('click', (e) => {
            if (e.target === this.elements.helpModal) this.hideHelp();
        });
        this.elements.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.elements.settingsModal) this.hideSettings();
        });
          // Range sliders
        if (this.elements.widthRange) {
            this.elements.widthRange.addEventListener('input', (e) => {
                this.elements.barcodeWidth.value = e.target.value;
            });
        }
        if (this.elements.heightRange) {
            this.elements.heightRange.addEventListener('input', (e) => {
                this.elements.barcodeHeight.value = e.target.value;
            });
        }
        this.elements.barcodeWidth.addEventListener('input', (e) => {
            if (this.elements.widthRange) this.elements.widthRange.value = e.target.value;
        });
        this.elements.barcodeHeight.addEventListener('input', (e) => {
            if (this.elements.heightRange) this.elements.heightRange.value = e.target.value;
        });
        
        // Advanced options toggle
        this.elements.advancedToggle.addEventListener('click', () => this.toggleAdvancedOptions());
          // Settings
        if (this.elements.qualitySelect) {
            this.elements.qualitySelect.addEventListener('change', (e) => {
                this.settings.quality = e.target.value;
                this.saveSettings();
            });
        }
        if (this.elements.defaultFormatSelect) {
            this.elements.defaultFormatSelect.addEventListener('change', (e) => {
                this.settings.defaultFormat = e.target.value;
                if (this.elements.barcodeType) {
                    this.elements.barcodeType.value = e.target.value;
                }
                this.saveSettings();
            });
        }
        if (this.elements.themeSelect) {
            this.elements.themeSelect.addEventListener('change', (e) => {
                this.switchTheme(e.target.value);
            });
        }
          // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Color picker synchronization
        if (this.elements.backgroundColor && this.elements.bgColorText) {
            this.elements.backgroundColor.addEventListener('input', (e) => {
                this.elements.bgColorText.value = e.target.value.toUpperCase();
            });
            this.elements.bgColorText.addEventListener('input', (e) => {
                if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                    this.elements.backgroundColor.value = e.target.value;
                }
            });
        }
        
        if (this.elements.foregroundColor && this.elements.fgColorText) {
            this.elements.foregroundColor.addEventListener('input', (e) => {
                this.elements.fgColorText.value = e.target.value.toUpperCase();
            });
            this.elements.fgColorText.addEventListener('input', (e) => {
                if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                    this.elements.foregroundColor.value = e.target.value;
                }
            });
        }
    }    generateBarcode() {
        const data = this.elements.barcodeData.value.trim();
        const type = this.elements.barcodeType.value;
        
        if (!data) {
            this.showError('Please enter data to generate barcode');
            return;
        }
        
        // Validate data format for specific barcode types
        const validationResult = this.validateBarcodeData(data, type);
        if (!validationResult.valid) {
            this.showError(validationResult.message);
            return;
        }
        
        this.hideError();
        this.updateStatus('Generating barcode...', 'processing');
        
        try {
            // Get responsive canvas dimensions
            const canvasDimensions = this.calculateResponsiveCanvasDimensions();
            
            const options = {
                format: type,
                width: canvasDimensions.barcodeWidth,
                height: canvasDimensions.barcodeHeight,
                displayValue: this.elements.displayText?.checked !== false,
                background: this.elements.backgroundColor?.value || '#ffffff',
                lineColor: this.elements.foregroundColor?.value || '#000000',
                fontSize: canvasDimensions.fontSize,
                textAlign: this.elements.textAlign?.value || 'center',
                textPosition: this.elements.textPosition?.value || 'bottom',
                textMargin: Math.max(5, canvasDimensions.barcodeHeight * 0.1),
                margin: canvasDimensions.margin
            };
            
            // Validate canvas exists
            if (!this.canvas) {
                throw new Error('Canvas element not found');
            }
            
            // Set up high DPI canvas
            this.setupHighDPICanvas(canvasDimensions);
            
            // Clear canvas
            const ctx = this.canvas.getContext('2d');
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Generate barcode with error handling
            JsBarcode(this.canvas, data, options);
            
            // Hide placeholder and show canvas
            if (this.placeholderText) {
                this.placeholderText.style.display = 'none';
            }
            this.canvas.style.display = 'block';
            
            // Store current barcode data for downloads
            this.currentBarcodeData = { data, options, canvasDimensions };
            
            // Enable download buttons
            this.enableDownloadButtons();
            
            this.updateStatus('Barcode generated successfully', 'success');
            
            // Update statistics
            this.updateStats();
            
        } catch (error) {
            console.error('Barcode generation error:', error);
            this.showError(`Error generating barcode: ${error.message}`);
            this.updateStatus('Generation failed', 'error');
            
            // Show placeholder if generation failed
            if (this.placeholderText) {
                this.placeholderText.style.display = 'flex';
            }
            this.canvas.style.display = 'none';
        }
    }    calculateResponsiveCanvasDimensions() {
        // Get container dimensions
        const container = this.canvas.parentElement;
        const containerRect = container.getBoundingClientRect();
        const maxWidth = Math.max(300, containerRect.width - 40); // Leave padding
        const maxHeight = Math.max(150, containerRect.height * 0.7);
        
        // Get user-specified dimensions
        const userWidth = parseInt(this.elements.barcodeWidth?.value) || 300;
        const userHeight = parseInt(this.elements.barcodeHeight?.value) || 100;
        
        let barcodeWidth = userWidth;
        let barcodeHeight = userHeight;
        
        // Apply mobile optimizations for smaller screens
        if (window.innerWidth <= 768) {
            const mobileOptimized = this.getMobileOptimizedDimensions(userWidth, userHeight);
            barcodeWidth = mobileOptimized.width;
            barcodeHeight = mobileOptimized.height;
        } else {
            // Desktop: ensure it fits in container
            barcodeWidth = Math.min(userWidth, maxWidth);
            barcodeHeight = Math.min(userHeight, maxHeight);
        }
        
        // Calculate margin and font size based on barcode size
        const margin = Math.max(10, Math.min(20, barcodeWidth * 0.05));
        const fontSize = Math.max(10, Math.min(16, barcodeHeight * 0.14));
        
        return {
            barcodeWidth,
            barcodeHeight,
            margin,
            fontSize,
            canvasWidth: barcodeWidth + (margin * 2),
            canvasHeight: barcodeHeight + (margin * 2)
        };
    }

    getMobileOptimizedDimensions(userWidth, userHeight) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const isLandscape = screenWidth > screenHeight;
        
        let maxCanvasWidth, maxCanvasHeight;
        
        if (screenWidth <= 480) {
            // Small mobile phones
            maxCanvasWidth = screenWidth * 0.9;
            maxCanvasHeight = isLandscape ? screenHeight * 0.4 : screenHeight * 0.25;
        } else if (screenWidth <= 768) {
            // Tablets and larger phones
            maxCanvasWidth = screenWidth * 0.85;
            maxCanvasHeight = isLandscape ? screenHeight * 0.5 : screenHeight * 0.3;
        } else {
            // Desktop fallback
            maxCanvasWidth = Math.min(800, screenWidth * 0.7);
            maxCanvasHeight = screenHeight * 0.4;
        }

        // Calculate scale factor to fit within mobile constraints
        const widthScale = maxCanvasWidth / userWidth;
        const heightScale = maxCanvasHeight / userHeight;
        const scale = Math.min(1, widthScale, heightScale);

        return {
            width: Math.floor(userWidth * scale),
            height: Math.floor(userHeight * scale),
            scale: scale
        };
    }

    initializeMobileOptimizations() {
        // Touch-friendly interactions for mobile devices
        if ('ontouchstart' in window) {
            // Add touch event handlers for better mobile experience
            if (this.canvas) {
                this.canvas.addEventListener('touchstart', (e) => {
                    e.preventDefault(); // Prevent zoom on double tap
                }, { passive: false });
            }

            // Improve range slider touch interactions
            const rangeInputs = [this.elements.widthRange, this.elements.heightRange];
            rangeInputs.forEach(input => {
                if (input) {
                    input.addEventListener('touchstart', () => {
                        input.style.transform = 'scale(1.1)';
                    });
                    input.addEventListener('touchend', () => {
                        input.style.transform = 'scale(1)';
                    });
                }
            });

            // Add mobile-specific CSS classes
            document.body.classList.add('mobile-device');
        }

        // Handle device pixel ratio changes (when moving between different displays)
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)');
            mediaQuery.addListener(() => {
                if (this.currentBarcodeData) {
                    setTimeout(() => this.regenerateResponsiveBarcode(), 100);
                }
            });
        }
    }

    setupHighDPICanvas(dimensions) {
        const devicePixelRatio = window.devicePixelRatio || 1;
        
        // Set actual canvas size in memory (scaled for high DPI)
        this.canvas.width = dimensions.canvasWidth * devicePixelRatio;
        this.canvas.height = dimensions.canvasHeight * devicePixelRatio;
        
        // Set display size (CSS pixels)
        this.canvas.style.width = dimensions.canvasWidth + 'px';
        this.canvas.style.height = dimensions.canvasHeight + 'px';
        
        // Scale the context to match device pixel ratio
        const ctx = this.canvas.getContext('2d');
        ctx.scale(devicePixelRatio, devicePixelRatio);
        
        // Improve image rendering quality
        ctx.imageSmoothingEnabled = false;
        if (ctx.imageSmoothingQuality) {
            ctx.imageSmoothingQuality = 'high';
        }
    }

    generateInitialBarcode() {
        // Set default data if input is empty
        if (!this.elements.barcodeData.value.trim()) {
            this.elements.barcodeData.value = '1234567890128';
        }
        
        // Generate the barcode
        this.generateBarcode();
    }    downloadBarcode(format = 'png') {
        if (!this.canvas || this.canvas.style.display === 'none' || !this.currentBarcodeData) {
            this.showError('Please generate a barcode first');
            return;
        }
        
        const fileName = `barcode_${Date.now()}`;
        
        switch (format.toLowerCase()) {
            case 'png':
                this.downloadCanvasAsPNG(fileName);
                break;
            case 'jpg':
            case 'jpeg':
                this.downloadCanvasAsJPG(fileName);
                break;
            case 'svg':
                this.downloadAsSVG(fileName);
                break;
            case 'pdf':
                this.downloadAsPDF(fileName);
                break;
            default:
                this.downloadCanvasAsPNG(fileName);
        }
        
        this.showSuccess(`Downloaded as ${format.toUpperCase()}`);
    }

    downloadCanvasAsPNG(fileName) {
        // Create a download-optimized canvas
        const downloadCanvas = this.createDownloadCanvas();
        const link = document.createElement('a');
        link.download = `${fileName}.png`;
        link.href = downloadCanvas.toDataURL('image/png', 1.0);
        link.click();
    }

    downloadCanvasAsJPG(fileName) {
        // Create a download-optimized canvas with white background
        const downloadCanvas = this.createDownloadCanvas(true);
        const link = document.createElement('a');
        link.download = `${fileName}.jpg`;
        link.href = downloadCanvas.toDataURL('image/jpeg', 0.95);
        link.click();
    }

    createDownloadCanvas(whiteBackground = false) {
        if (!this.currentBarcodeData) {
            throw new Error('No barcode data available for download');
        }
        
        const { data, options } = this.currentBarcodeData;
        
        // Create a new canvas with optimal dimensions for download
        const downloadCanvas = document.createElement('canvas');
        const downloadCtx = downloadCanvas.getContext('2d');
        
        // Calculate download dimensions (higher quality)
        const downloadScale = Math.max(1, window.devicePixelRatio || 1);
        const downloadWidth = (options.width + (options.margin * 2)) * downloadScale;
        const downloadHeight = (options.height + (options.margin * 2)) * downloadScale;
        
        downloadCanvas.width = downloadWidth;
        downloadCanvas.height = downloadHeight;
        
        // Set up high-quality rendering
        downloadCtx.imageSmoothingEnabled = false;
        downloadCtx.textRenderingOptimization = 'optimizeQuality';
        
        // Scale context for high quality
        downloadCtx.scale(downloadScale, downloadScale);
        
        // Add white background for JPG
        if (whiteBackground) {
            downloadCtx.fillStyle = '#FFFFFF';
            downloadCtx.fillRect(0, 0, options.width + (options.margin * 2), options.height + (options.margin * 2));
        }
        
        // Create download-optimized options
        const downloadOptions = {
            ...options,
            width: options.width,
            height: options.height,
            margin: options.margin
        };
        
        // Generate barcode on download canvas
        JsBarcode(downloadCanvas, data, downloadOptions);
        
        return downloadCanvas;
    }    downloadAsSVG(fileName) {
        if (!this.currentBarcodeData) {
            this.showError('No barcode data available for download');
            return;
        }
        
        const { data, options } = this.currentBarcodeData;
        
        // Create SVG element with proper dimensions
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        
        // Use original user-specified dimensions for SVG (vector format)
        const svgOptions = {
            ...options,
            width: parseInt(this.elements.barcodeWidth?.value) || 300,
            height: parseInt(this.elements.barcodeHeight?.value) || 100,
            margin: Math.max(10, options.margin)
        };
        
        // Generate SVG barcode
        JsBarcode(svg, data, svgOptions);
        
        // Serialize and download
        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.download = `${fileName}.svg`;
        link.href = url;
        link.click();
        
        URL.revokeObjectURL(url);
    }    downloadAsPDF(fileName) {
        if (!this.currentBarcodeData) {
            this.showError('No barcode data available for download');
            return;
        }
        
        // For PDF generation, create a high-quality canvas
        const downloadCanvas = this.createDownloadCanvas(true);
        const imgData = downloadCanvas.toDataURL('image/png', 1.0);
        
        // Create a temporary download (PNG for now, but with PDF naming for clarity)
        const link = document.createElement('a');
        link.download = `${fileName}.png`; // Fallback to PNG
        link.href = imgData;
        link.click();
        
        // Show enhanced message about PDF functionality
        this.showInfo('High-quality PNG downloaded. For true PDF format, consider using specialized PDF libraries like jsPDF.');
    }    copyToClipboard() {
        if (!this.canvas || this.canvas.style.display === 'none' || !this.currentBarcodeData) {
            this.showError('Please generate a barcode first');
            return;
        }
        
        // Create optimized canvas for clipboard
        const clipboardCanvas = this.createDownloadCanvas();
        
        clipboardCanvas.toBlob((blob) => {
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]).then(() => {
                this.showSuccess('Barcode copied to clipboard');
            }).catch(() => {
                this.showError('Failed to copy barcode to clipboard');
            });
        }, 'image/png', 1.0);
    }    shareBarcode() {
        if (!this.canvas || this.canvas.style.display === 'none' || !this.currentBarcodeData) {
            this.showError('Please generate a barcode first');
            return;
        }
        
        if (navigator.share) {
            // Create optimized canvas for sharing
            const shareCanvas = this.createDownloadCanvas();
            
            shareCanvas.toBlob((blob) => {
                const file = new File([blob], 'barcode.png', { type: 'image/png' });
                navigator.share({
                    title: 'Generated Barcode',
                    text: 'Check out this barcode I generated!',
                    files: [file]
                }).catch(() => {
                    this.copyShareLink();
                });
            }, 'image/png', 1.0);
        } else {
            this.copyShareLink();
        }
    }

    copyShareLink() {
        const shareUrl = window.location.href;
        navigator.clipboard.writeText(shareUrl).then(() => {
            this.showSuccess('Share link copied to clipboard');
        }).catch(() => {
            this.showError('Failed to copy share link');
        });
    }    printBarcode() {
        if (!this.canvas || this.canvas.style.display === 'none' || !this.currentBarcodeData) {
            this.showError('Please generate a barcode first');
            return;
        }
        
        // Create optimized canvas for printing
        const printCanvas = this.createDownloadCanvas(true);
        const imgData = printCanvas.toDataURL('image/png', 1.0);
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Barcode</title>
                    <style>
                        body { 
                            margin: 0; 
                            display: flex; 
                            justify-content: center; 
                            align-items: center; 
                            min-height: 100vh;
                            background: white;
                        }
                        img { 
                            max-width: 100%; 
                            height: auto;
                            border: none;
                            image-rendering: crisp-edges;
                        }
                        @media print {
                            body { margin: 0; }
                            img { max-width: none; height: auto; }
                        }
                    </style>
                </head>
                <body>
                    <img src="${imgData}" alt="Barcode">
                </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        // Wait for image to load before printing
        setTimeout(() => {
            printWindow.print();
        }, 250);
    }toggleAdvancedOptions() {
        if (!this.elements.advancedOptions || !this.elements.advancedToggle) return;
        
        const isExpanded = this.elements.advancedOptions.style.display === 'block';
        this.elements.advancedOptions.style.display = isExpanded ? 'none' : 'block';
        this.elements.advancedToggle.innerHTML = isExpanded ? 
            '<i class="fas fa-chevron-down"></i> Show Advanced Options' :
            '<i class="fas fa-chevron-up"></i> Hide Advanced Options';
    }    enableDownloadButtons() {
        const buttons = [
            this.elements.downloadPngBtn,
            this.elements.downloadJpgBtn,
            this.elements.downloadSvgBtn,
            this.elements.downloadPdfBtn,
            this.elements.copyBtn,
            this.elements.shareBtn,
            this.elements.printBtn
        ];
        
        buttons.forEach(btn => {
            if (btn) {
                btn.disabled = false;
                btn.classList.remove('disabled');
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            }
        });
        
        // Also show download section if it was hidden
        const downloadSection = document.querySelector('.download-section');
        if (downloadSection) {
            downloadSection.style.display = 'block';
            downloadSection.style.opacity = '1';
        }
    }showSettings() {
        this.elements.settingsModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Set current values
        if (this.elements.qualitySelect) {
            this.elements.qualitySelect.value = this.settings.quality;
        }
        if (this.elements.defaultFormatSelect) {
            this.elements.defaultFormatSelect.value = this.settings.defaultFormat;
        }
        if (this.elements.themeSelect) {
            this.elements.themeSelect.value = this.currentTheme;
        }
        
        // Set toggle states
        const autoGenerateToggle = document.getElementById('autoGenerateToggle');
        const autoGenerateInput = autoGenerateToggle?.querySelector('input');
        if (autoGenerateInput) {
            autoGenerateInput.checked = this.settings.autoGenerate;
            autoGenerateToggle.classList.toggle('active', this.settings.autoGenerate);
        }
        
        const showTextToggle = document.getElementById('showTextToggle');
        const showTextInput = showTextToggle?.querySelector('input');
        if (showTextInput) {
            showTextInput.checked = this.settings.showText;
            showTextToggle.classList.toggle('active', this.settings.showText);
        }
        
        // Update theme cards
        this.updateThemeCards();
    }
    
    updateThemeCards() {
        const themeCards = document.querySelectorAll('.theme-card');
        themeCards.forEach(card => {
            card.classList.toggle('active', card.dataset.theme === this.currentTheme);
        });
    }

    hideSettings() {
        this.elements.settingsModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    showHelp() {
        this.elements.helpModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    hideHelp() {
        this.elements.helpModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    switchTheme(theme) {
        const body = document.body;
        body.className = body.className.replace(/\w+-theme/g, '');
        
        if (theme !== 'dark') {
            body.classList.add(`${theme}-theme`);
        }
        
        this.currentTheme = theme;
        this.saveSettings();
        
        // Update theme button icon
        const themeIcons = {
            'dark': 'fas fa-moon',
            'light': 'fas fa-sun',
            'blue': 'fas fa-palette',
            'purple': 'fas fa-magic'
        };
        
        this.elements.themeBtn.innerHTML = `<i class="${themeIcons[theme]}"></i>`;
    }

    toggleTheme() {
        const themes = ['dark', 'light', 'blue', 'purple'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextTheme = themes[(currentIndex + 1) % themes.length];
        this.switchTheme(nextTheme);
    }

    handleKeyboardShortcuts(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'enter':
                    e.preventDefault();
                    this.generateBarcode();
                    break;
                case 's':
                    e.preventDefault();
                    this.downloadBarcode('png');
                    break;
                case 'c':
                    if (e.shiftKey) {
                        e.preventDefault();
                        this.copyToClipboard();
                    }
                    break;
                case 'p':
                    e.preventDefault();
                    this.printBarcode();
                    break;
                case ',':
                    e.preventDefault();
                    this.showSettings();
                    break;
                case '/':
                    e.preventDefault();
                    this.showHelp();
                    break;
            }
        }
        
        if (e.key === 'Escape') {
            this.hideHelp();
            this.hideSettings();
        }
    }

    saveSettings() {
        localStorage.setItem('barcodeGeneratorSettings', JSON.stringify({
            ...this.settings,
            theme: this.currentTheme
        }));
    }

    loadSettings() {
        try {
            const saved = localStorage.getItem('barcodeGeneratorSettings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.settings = { ...this.settings, ...settings };
                if (settings.theme) {
                    this.switchTheme(settings.theme);
                }
                
                // Apply default format
                if (this.elements.barcodeType) {
                    this.elements.barcodeType.value = this.settings.defaultFormat;
                }
                
                // Apply show text setting
                if (this.elements.displayText) {
                    this.elements.displayText.checked = this.settings.showText;
                }
            }
        } catch (error) {
            console.warn('Failed to load settings:', error);
        }
    }

    updateStatus(message, type = 'info') {
        const statusText = document.querySelector('.status-text');
        const statusIndicator = document.querySelector('.status-indicator');
        
        if (statusText) {
            statusText.textContent = message;
        }
        
        if (statusIndicator) {
            statusIndicator.className = `status-indicator ${type}`;
        }
        
        // Auto-reset status after 3 seconds for non-error states
        if (type !== 'error') {
            setTimeout(() => {
                if (statusText) statusText.textContent = 'Ready';
                if (statusIndicator) statusIndicator.className = 'status-indicator';
            }, 3000);
        }
    }

    updateStats() {
        const statsElements = {
            generated: document.querySelector('.stat-value[data-stat="generated"]'),
            formats: document.querySelector('.stat-value[data-stat="formats"]'),
            success: document.querySelector('.stat-value[data-stat="success"]')
        };
        
        let stats = JSON.parse(localStorage.getItem('barcodeStats') || '{"generated": 0, "formats": 9, "success": 100}');
        stats.generated++;
        
        if (statsElements.generated) {
            statsElements.generated.textContent = stats.generated.toLocaleString();
        }
        
        localStorage.setItem('barcodeStats', JSON.stringify(stats));
    }

    showError(message) {
        if (this.errorMessage) {
            this.errorText.textContent = message;
            this.errorMessage.style.display = 'block';
            setTimeout(() => this.hideError(), 5000);
        }
    }

    hideError() {
        if (this.errorMessage) {
            this.errorMessage.style.display = 'none';
        }
    }

    showSuccess(message) {
        // Create temporary success notification
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showInfo(message) {
        // Create temporary info notification
        const notification = document.createElement('div');
        notification.className = 'notification info';
        notification.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {
                this.showError('Fullscreen not supported');
            });
        } else {
            document.exitFullscreen();
        }
    }

    initializeParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 50, density: { enable: true, value_area: 800 } },
                    color: { value: '#00f0ff' },
                    shape: { type: 'circle' },
                    opacity: { value: 0.3, random: true },
                    size: { value: 3, random: true },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#00f0ff',
                        opacity: 0.2,
                        width: 1
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: 'none',
                        random: false,
                        straight: false,
                        out_mode: 'out',
                        bounce: false
                    }
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: { enable: true, mode: 'repulse' },
                        onclick: { enable: true, mode: 'push' },
                        resize: true
                    }
                },
                retina_detect: true
            });
        }
    }

    initializeNavigation() {
        // Initialize any navigation-specific functionality
        const logo = document.querySelector('.nav-logo');
        if (logo) {
            logo.addEventListener('click', () => {
                // Add logo click animation
                logo.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    logo.style.transform = 'scale(1)';
                }, 150);
            });
        }
        
        // Initialize modal tabs
        this.initializeModalTabs();
        
        // Initialize theme cards
        this.initializeThemeCards();
        
        // Initialize toggle switches
        this.initializeToggleSwitches();
    }
    
    initializeModalTabs() {
        const tabs = document.querySelectorAll('.modal-tab');
        const tabContents = document.querySelectorAll('.modal-tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    content.style.display = 'none';
                });
                
                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                const targetContent = document.getElementById(`${targetTab}-tab`);
                if (targetContent) {
                    targetContent.classList.add('active');
                    targetContent.style.display = 'block';
                }
            });
        });
    }
    
    initializeThemeCards() {
        const themeCards = document.querySelectorAll('.theme-card');
        
        themeCards.forEach(card => {
            card.addEventListener('click', () => {
                const theme = card.dataset.theme;
                
                // Remove active class from all cards
                themeCards.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked card
                card.classList.add('active');
                
                // Switch theme
                this.switchTheme(theme);
                
                // Update theme select
                if (this.elements.themeSelect) {
                    this.elements.themeSelect.value = theme;
                }
            });
        });
    }
      initializeToggleSwitches() {
        const toggleSwitches = document.querySelectorAll('.toggle-switch');
        
        toggleSwitches.forEach(toggle => {
            const input = toggle.querySelector('input[type="checkbox"]');
            
            // Set initial state based on input
            if (input) {
                toggle.classList.toggle('active', input.checked);
                
                // Handle click on toggle
                toggle.addEventListener('click', (e) => {
                    // Prevent double triggering if clicked on input
                    if (e.target.type === 'checkbox') return;
                    
                    input.checked = !input.checked;
                    toggle.classList.toggle('active', input.checked);
                    
                    // Trigger change event for settings handling
                    const changeEvent = new Event('change', { bubbles: true });
                    input.dispatchEvent(changeEvent);
                });
                
                // Handle direct input change
                input.addEventListener('change', (e) => {
                    toggle.classList.toggle('active', e.target.checked);
                });
            }
        });
          // Initialize settings-specific toggles
        this.initializeSettingsToggles();
    }
      initializeAdvancedOptions() {
        // Ensure advanced options are initially hidden
        if (this.elements.advancedOptions) {
            this.elements.advancedOptions.style.display = 'none';
        }
        
        // Set proper toggle text
        if (this.elements.advancedToggle) {
            this.elements.advancedToggle.innerHTML = '<i class="fas fa-chevron-down"></i> Show Advanced Options';
        }
        
        // Initialize download buttons as disabled
        this.disableDownloadButtons();
    }
    
    disableDownloadButtons() {
        const buttons = [
            this.elements.downloadPngBtn,
            this.elements.downloadJpgBtn,
            this.elements.downloadSvgBtn,
            this.elements.downloadPdfBtn,
            this.elements.copyBtn,
            this.elements.shareBtn,
            this.elements.printBtn
        ];
        
        buttons.forEach(btn => {
            if (btn) {
                btn.disabled = true;
                btn.classList.add('disabled');
                btn.style.opacity = '0.5';
                btn.style.pointerEvents = 'none';
            }
        });
    }
    
    initializeColorSync() {
        // Initialize color picker synchronization with proper values
        if (this.elements.backgroundColor && this.elements.bgColorText) {
            this.elements.bgColorText.value = this.elements.backgroundColor.value.toUpperCase();
        }
        
        if (this.elements.foregroundColor && this.elements.fgColorText) {
            this.elements.fgColorText.value = this.elements.foregroundColor.value.toUpperCase();
        }
    }
    
    initializeSettingsToggles() {
        // Auto Generate Toggle
        const autoGenerateToggle = document.getElementById('autoGenerateToggle');
        const autoGenerateInput = autoGenerateToggle?.querySelector('input');
        if (autoGenerateInput) {
            autoGenerateInput.addEventListener('change', (e) => {
                this.settings.autoGenerate = e.target.checked;
                this.saveSettings();
            });
        }
        
        // Show Text Toggle
        const showTextToggle = document.getElementById('showTextToggle');
        const showTextInput = showTextToggle?.querySelector('input');
        if (showTextInput) {
            showTextInput.addEventListener('change', (e) => {
                this.settings.showText = e.target.checked;
                if (this.elements.displayText) {
                    this.elements.displayText.checked = e.target.checked;
                }
                this.saveSettings();
            });
        }
    }

    // Data action methods
    async pasteData() {
        try {
            const text = await navigator.clipboard.readText();
            if (text) {
                this.elements.barcodeData.value = text.trim();
                this.showSuccess('Data pasted from clipboard');
                
                // Auto-generate if enabled
                if (this.settings.autoGenerate) {
                    setTimeout(() => this.generateBarcode(), 100);
                }
            }
        } catch (error) {
            this.showError('Failed to paste from clipboard. Please paste manually.');
        }
    }
    
    clearData() {
        this.elements.barcodeData.value = '';
        this.elements.barcodeData.focus();
        
        // Hide barcode and show placeholder
        if (this.canvas) {
            this.canvas.style.display = 'none';
        }
        if (this.placeholderText) {
            this.placeholderText.style.display = 'flex';
        }
        
        // Disable download buttons
        this.disableDownloadButtons();
        
        this.showSuccess('Data cleared');
    }
    
    generateRandomData() {
        const format = this.elements.barcodeType.value;
        let randomData = '';
        
        switch (format) {
            case 'EAN13':
                // Generate 12 digits (13th is checksum)
                randomData = this.generateRandomNumber(12);
                break;
            case 'EAN8':
                // Generate 7 digits (8th is checksum)
                randomData = this.generateRandomNumber(7);
                break;
            case 'UPC':
                // Generate 11 digits (12th is checksum)
                randomData = this.generateRandomNumber(11);
                break;
            case 'CODE39':
                // Generate alphanumeric string
                randomData = this.generateRandomAlphanumeric(8);
                break;
            case 'CODE128':
            default:
                // Generate mixed content
                randomData = `DEMO${this.generateRandomNumber(8)}`;
                break;
        }
        
        this.elements.barcodeData.value = randomData;
        this.showSuccess('Random data generated');
        
        // Auto-generate if enabled
        if (this.settings.autoGenerate) {
            setTimeout(() => this.generateBarcode(), 100);
        }
    }
    
    generateRandomNumber(length) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += Math.floor(Math.random() * 10);
        }
        return result;
    }
      generateRandomAlphanumeric(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    validateBarcodeData(data, format) {
        switch (format) {
            case 'EAN13':
                if (!/^\d{12,13}$/.test(data)) {
                    return { valid: false, message: 'EAN-13 requires exactly 12 or 13 digits' };
                }
                break;
            case 'EAN8':
                if (!/^\d{7,8}$/.test(data)) {
                    return { valid: false, message: 'EAN-8 requires exactly 7 or 8 digits' };
                }
                break;
            case 'UPC':
                if (!/^\d{11,12}$/.test(data)) {
                    return { valid: false, message: 'UPC-A requires exactly 11 or 12 digits' };
                }
                break;
            case 'CODE39':
                if (!/^[A-Z0-9\-\.\s\$\/\+%]*$/.test(data)) {
                    return { valid: false, message: 'Code 39 supports only uppercase letters, numbers, and symbols: - . $ / + %' };
                }
                break;
        }
        return { valid: true };
    }

    initializeResponsiveHandlers() {
        // Handle window resize for responsive canvas
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Regenerate barcode with new responsive dimensions if one exists
                if (this.canvas && this.canvas.style.display !== 'none' && this.currentBarcodeData) {
                    this.regenerateResponsiveBarcode();
                }
            }, 300); // Debounce resize events
        });

        // Handle orientation change on mobile devices
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                if (this.canvas && this.canvas.style.display !== 'none' && this.currentBarcodeData) {
                    this.regenerateResponsiveBarcode();
                }
            }, 500); // Wait for orientation change to complete
        });

        // Handle input changes for responsive updates
        if (this.elements.barcodeWidth) {
            this.elements.barcodeWidth.addEventListener('input', this.debounce(() => {
                if (this.currentBarcodeData && this.settings.autoGenerate) {
                    this.generateBarcode();
                }
            }, 300));
        }

        if (this.elements.barcodeHeight) {
            this.elements.barcodeHeight.addEventListener('input', this.debounce(() => {
                if (this.currentBarcodeData && this.settings.autoGenerate) {
                    this.generateBarcode();
                }
            }, 300));
        }
    }

    regenerateResponsiveBarcode() {
        if (!this.currentBarcodeData) return;
        
        try {
            // Get new responsive dimensions
            const canvasDimensions = this.calculateResponsiveCanvasDimensions();
            
            // Update the stored barcode data with new dimensions
            this.currentBarcodeData.options = {
                ...this.currentBarcodeData.options,
                width: canvasDimensions.barcodeWidth,
                height: canvasDimensions.barcodeHeight,
                fontSize: canvasDimensions.fontSize,
                textMargin: Math.max(5, canvasDimensions.barcodeHeight * 0.1),
                margin: canvasDimensions.margin
            };
            
            this.currentBarcodeData.canvasDimensions = canvasDimensions;
            
            // Setup canvas with new dimensions
            this.setupHighDPICanvas(canvasDimensions);
            
            // Clear and regenerate
            const ctx = this.canvas.getContext('2d');
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Regenerate barcode with updated options
            JsBarcode(this.canvas, this.currentBarcodeData.data, this.currentBarcodeData.options);
            
        } catch (error) {
            console.warn('Failed to regenerate responsive barcode:', error);
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new BarcodeGenerator();
});

// Add notification styles dynamically
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 20px;
        border-radius: var(--border-radius);
        color: white;
        font-weight: 500;
        transition: var(--transition);
        opacity: 1;
        transform: translateX(0);
        box-shadow: var(--shadow-lg);
    }
    
    .notification.success {
        background: linear-gradient(135deg, var(--accent-success), #45a049);
    }
    
    .notification.info {
        background: linear-gradient(135deg, var(--accent-color), #0080cc);
    }
    
    .notification i {
        font-size: 1.1rem;
    }
`;

// Add styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
