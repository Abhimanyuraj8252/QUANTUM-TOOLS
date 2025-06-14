class AdvancedBackgroundRemover {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.originalCanvas = null;
        this.processedCanvas = null;
        this.currentImage = null;
        this.isProcessing = false;
          // API Configuration
        this.apiKey = "R72GQJhyPwhYdogSMKBiR5PP";
        this.apiEndpoint = "https://api.remove.bg/v1.0/removebg";
        this.alternativeApiEndpoint = "https://clipdrop-api.co/remove-background/v1";
        this.useAlternativeApi = false; // Flag to switch between APIs
        
        // Advanced AI Models
        this.bodyPixModel = null;
        this.mediaPipeSegmentation = null;
        this.openCVReady = false;
        this.imglyBackgroundRemoval = null;
          // Processing options
        this.processingMethods = {
            MEDIAPIPE: 'mediapipe',
            BODYPIX: 'bodypix', 
            IMGLY: 'imgly',
            OPENCV: 'opencv',
            HYBRID: 'hybrid',
            API: 'api',
            EDGE: 'edge'
        };
        
        this.currentMode = this.processingMethods.BODYPIX; // Default to BodyPix
        this.sensitivity = 0.5;
        this.smoothing = 3;
        
        this.init();
    }

    async init() {
        console.log('🚀 Initializing Advanced Background Remover...');
        this.setupCanvas();
        this.setupEventListeners();
        await this.loadAIModels();
        this.setupProgressTracking();
        this.createParticles();
        this.hideLoadingOverlay();
        console.log('✅ Advanced Background Remover initialized successfully!');
    }    async loadAIModels() {
        console.log('🧠 Loading advanced AI models...');
        const startTime = performance.now();
        
        try {
            // Load working models in parallel
            const modelPromises = [
                this.loadBodyPixModel(),
                this.loadOpenCVModel()
                // Temporarily disabled due to compatibility issues:
                // this.loadMediaPipeModel(),
                // this.loadImglyModel()
            ];
            
            await Promise.allSettled(modelPromises);
            
            const loadTime = performance.now() - startTime;
            console.log(`⚡ AI models loaded in ${loadTime.toFixed(2)}ms`);
            this.showNotification('🎯 Advanced AI models ready!', 'success');
            
        } catch (error) {
            console.error('❌ Error loading AI models:', error);
            this.showNotification('⚠️ Some AI models failed to load, using available methods', 'warning');
        }
    }

    async loadBodyPixModel() {
        try {
            console.log('📡 Loading BodyPix model...');
            if (typeof bodyPix !== 'undefined') {
                this.bodyPixModel = await bodyPix.load({
                    architecture: 'MobileNetV1',
                    outputStride: 16,
                    multiplier: 0.75,
                    quantBytes: 2
                });
                console.log('✅ BodyPix model loaded successfully');
                return true;
            }
        } catch (error) {
            console.warn('⚠️ BodyPix model loading failed:', error);
        }
        return false;
    }

    async loadMediaPipeModel() {
        try {
            console.log('📡 Loading MediaPipe Selfie Segmentation...');
            if (typeof SelfieSegmentation !== 'undefined') {
                this.mediaPipeSegmentation = new SelfieSegmentation({
                    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
                });
                
                this.mediaPipeSegmentation.setOptions({
                    modelSelection: 1, // 0 for general model, 1 for landscape model
                    selfieMode: false
                });
                
                console.log('✅ MediaPipe model loaded successfully');
                return true;
            }
        } catch (error) {
            console.warn('⚠️ MediaPipe model loading failed:', error);
        }
        return false;
    }

    async loadOpenCVModel() {
        try {
            console.log('📡 Loading OpenCV...');
            // Wait for OpenCV to be ready
            if (typeof cv !== 'undefined') {
                await new Promise((resolve) => {
                    if (cv.Mat) {
                        this.openCVReady = true;
                        resolve();
                    } else {
                        cv.onRuntimeInitialized = () => {
                            this.openCVReady = true;
                            resolve();
                        };
                    }
                });
                console.log('✅ OpenCV loaded successfully');
                return true;
            }
        } catch (error) {
            console.warn('⚠️ OpenCV loading failed:', error);
        }
        return false;
    }

    async loadImglyModel() {
        try {
            console.log('📡 Loading IMG.LY Background Removal...');
            if (typeof removeBackground !== 'undefined') {
                this.imglyBackgroundRemoval = removeBackground;
                console.log('✅ IMG.LY model loaded successfully');
                return true;
            }
        } catch (error) {
            console.warn('⚠️ IMG.LY model loading failed:', error);
        }
        return false;
    }

    setupCanvas() {
        this.originalCanvas = document.getElementById('originalCanvas');
        this.processedCanvas = document.getElementById('processedCanvas');
        
        if (this.originalCanvas) {
            this.originalCanvas.style.display = 'none';
        }
        if (this.processedCanvas) {
            this.processedCanvas.style.display = 'none';
        }
    }

    setupEventListeners() {
        // File upload
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        
        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        fileInput.addEventListener('change', this.handleFileSelect.bind(this));

        // Mode selection - Updated for new processing methods
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');                // Map UI modes to internal processing methods
                const uiMode = btn.dataset.mode;
                switch(uiMode) {
                    case 'ai':
                        this.currentMode = this.bodyPixModel ? this.processingMethods.BODYPIX : this.processingMethods.HYBRID;
                        this.hideApiStatus();
                        break;
                    case 'color':
                        this.currentMode = this.processingMethods.OPENCV;
                        this.hideApiStatus();
                        break;                    case 'edge':
                        this.currentMode = this.processingMethods.EDGE;
                        this.hideApiStatus();
                        break;
                    case 'api':
                        this.currentMode = this.processingMethods.API;
                        this.showApiStatus();
                        break;
                    default:
                        this.currentMode = this.processingMethods.HYBRID;
                        this.hideApiStatus();
                }
            });
        });

        // Sliders
        const sensitivitySlider = document.getElementById('sensitivitySlider');
        const smoothingSlider = document.getElementById('smoothingSlider');
        const sensitivityValue = document.getElementById('sensitivityValue');
        const smoothingValue = document.getElementById('smoothingValue');

        if (sensitivitySlider) {
            sensitivitySlider.addEventListener('input', (e) => {
                this.sensitivity = parseFloat(e.target.value);
                if (sensitivityValue) sensitivityValue.textContent = this.sensitivity.toFixed(1);
            });
        }

        if (smoothingSlider) {
            smoothingSlider.addEventListener('input', (e) => {
                this.smoothing = parseInt(e.target.value);
                if (smoothingValue) smoothingValue.textContent = this.smoothing;
            });
        }

        // Process button
        const processBtn = document.getElementById('processBtn');
        if (processBtn) {
            processBtn.addEventListener('click', this.processImage.bind(this));
        }

        // Download buttons
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = btn.dataset.format;
                this.downloadImage(format);
            });
        });

        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        }
    }

    setupProgressTracking() {
        // Initialize progress elements
        const progressSection = document.getElementById('progressSection');
        if (progressSection) {
            progressSection.style.display = 'none';
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.loadImage(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.loadImage(file);
        }
    }

    async loadImage(file) {
        if (!file.type.startsWith('image/')) {
            this.showNotification('Please select a valid image file.', 'error');
            return;
        }

        try {
            this.showNotification('Loading image...', 'info');
            this.currentImage = await this.loadImageOptimized(file);
            this.displayOriginalImage();
            this.enableProcessButton();
            this.showNotification('Image loaded successfully!', 'success');
        } catch (error) {
            this.showNotification('Error loading image. Please try again.', 'error');
            console.error('Image loading error:', error);
        }
    }

    loadImageOptimized(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                // Pre-scale large images for better performance
                const maxDimension = 2000;
                let { width, height } = img;
                
                if (width > maxDimension || height > maxDimension) {
                    const scale = maxDimension / Math.max(width, height);
                    width *= scale;
                    height *= scale;
                    
                    // Create scaled canvas
                    const scaledCanvas = document.createElement('canvas');
                    const scaledCtx = scaledCanvas.getContext('2d');
                    scaledCanvas.width = width;
                    scaledCanvas.height = height;
                    
                    scaledCtx.drawImage(img, 0, 0, width, height);
                    
                    // Create new image from scaled canvas
                    const scaledImg = new Image();
                    scaledImg.onload = () => resolve(scaledImg);
                    scaledImg.src = scaledCanvas.toDataURL();
                } else {
                    resolve(img);
                }
            };
            
            img.onerror = reject;
            
            // Read file as data URL
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    displayOriginalImage() {
        const canvas = this.originalCanvas;
        const ctx = canvas.getContext('2d');
        const placeholder = document.getElementById('originalPlaceholder');
        
        // Calculate display size
        const maxWidth = 400;
        const maxHeight = 400;
        let { width, height } = this.calculateDisplaySize(this.currentImage.width, this.currentImage.height, maxWidth, maxHeight);
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.drawImage(this.currentImage, 0, 0, width, height);
        
        // Use CSS classes for consistent display control
        canvas.classList.add('visible');
        canvas.style.display = 'block';
        if (placeholder) {
            placeholder.classList.add('hidden');
            placeholder.style.display = 'none';
        }
    }

    calculateDisplaySize(originalWidth, originalHeight, maxWidth, maxHeight) {
        let width = originalWidth;
        let height = originalHeight;
        
        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }
        
        if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
        }
        
        return { width: Math.round(width), height: Math.round(height) };
    }

    enableProcessButton() {
        const processBtn = document.getElementById('processBtn');
        if (processBtn) {
            processBtn.disabled = false;
            processBtn.classList.add('enabled');
        }
    }    async processImage() {
        console.log('🎯 processImage() called');
        
        if (!this.currentImage) {
            console.error('❌ No image loaded');
            this.showNotification('Please upload an image first!', 'error');
            return;
        }
        
        if (this.isProcessing) {
            console.warn('⚠️ Already processing');
            return;
        }
        
        this.isProcessing = true;
        this.showProgressSection();
        
        const startTime = performance.now();
        
        try {
            let processedImageData;
            
            console.log('🔧 Current mode:', this.currentMode);
            console.log('🧠 Available models:', {
                bodyPix: !!this.bodyPixModel,
                mediaPipe: !!this.mediaPipeSegmentation,
                imgly: !!this.imglyBackgroundRemoval,
                openCV: this.openCVReady
            });
            
            // Clear previous results
            this.cleanupPreviousResults();
            
            // Use the most advanced available method
            switch (this.currentMode) {
                case this.processingMethods.BODYPIX:
                    console.log('🔄 Using BodyPix processing...');
                    processedImageData = await this.processWithBodyPix();
                    break;
                case this.processingMethods.MEDIAPIPE:
                    console.log('🔄 Using MediaPipe processing...');
                    processedImageData = await this.processWithMediaPipe();
                    break;
                case this.processingMethods.IMGLY:
                    console.log('🔄 Using IMG.LY processing...');
                    processedImageData = await this.processWithImgly();
                    break;
                case this.processingMethods.OPENCV:
                    console.log('🔄 Using OpenCV processing...');
                    processedImageData = await this.processWithOpenCV();
                    break;
                case this.processingMethods.API:
                    console.log('🔄 Using API processing...');
                    processedImageData = await this.processWithAPI();
                    break;
                case this.processingMethods.HYBRID:
                default:
                    console.log('🔄 Using Hybrid processing...');
                    processedImageData = await this.processWithHybridMethod();
                    break;
            }
            
            const processingTime = ((performance.now() - startTime) / 1000).toFixed(2);
            
            console.log('🔄 Processing completed, calling displayProcessedImage...');
            this.displayProcessedImage(processedImageData);
            this.showDownloadSection();
            
            this.showNotification(`Background removed successfully in ${processingTime}s using ${this.currentMode}!`, 'success');
              } catch (error) {
            console.error('❌ Processing error:', error);
            console.error('📍 Error stack:', error.stack);
            
            // Try fallback processing if main method fails
            try {
                console.log('🔄 Attempting fallback processing...');
                const fallbackData = await this.processFallback();
                this.displayProcessedImage(fallbackData);
                this.showDownloadSection();
                this.showNotification('Background removed using fallback method!', 'warning');
            } catch (fallbackError) {
                console.error('❌ Fallback processing also failed:', fallbackError);
                this.showNotification(`Error: ${error.message}. Please try a different image or mode.`, 'error');
            }
        } finally {
            this.isProcessing = false;
            this.hideProgressSection();
        }
    }

    async processWithBodyPix() {
        if (!this.bodyPixModel) {
            throw new Error('BodyPix model not loaded');
        }

        this.updateProgress(10, 'Initializing BodyPix AI processing...');
        
        // Create canvas from image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.currentImage.width;
        canvas.height = this.currentImage.height;
        ctx.drawImage(this.currentImage, 0, 0);
        
        this.updateProgress(30, 'Running AI person segmentation...');
        
        // Perform person segmentation
        const segmentation = await this.bodyPixModel.segmentPerson(canvas, {
            flipHorizontal: false,
            internalResolution: 'medium',
            segmentationThreshold: this.sensitivity,
        });
        
        this.updateProgress(70, 'Processing segmentation results...');
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Apply mask based on segmentation
        for (let i = 0; i < segmentation.data.length; i++) {
            const shouldKeep = segmentation.data[i];
            if (!shouldKeep) {
                // Make background pixels transparent
                data[i * 4 + 3] = 0; // Set alpha to 0
            } else {
                // Apply edge smoothing for foreground
                const smoothedAlpha = this.applyEdgeSmoothing(segmentation.data, i, canvas.width, canvas.height);
                data[i * 4 + 3] = Math.min(255, data[i * 4 + 3] * smoothedAlpha);
            }
        }
        
        this.updateProgress(100, 'BodyPix processing complete!');
        return data;
    }

    async processWithMediaPipe() {
        if (!this.mediaPipeSegmentation) {
            throw new Error('MediaPipe model not loaded');
        }

        this.updateProgress(10, 'Initializing MediaPipe processing...');
        
        return new Promise((resolve, reject) => {
            // Create canvas from image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = this.currentImage.width;
            canvas.height = this.currentImage.height;
            ctx.drawImage(this.currentImage, 0, 0);
            
            this.updateProgress(30, 'Running MediaPipe segmentation...');
            
            this.mediaPipeSegmentation.onResults((results) => {
                try {
                    this.updateProgress(70, 'Processing MediaPipe results...');
                    
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;
                    
                    if (results.segmentationMask) {
                        const maskCanvas = document.createElement('canvas');
                        const maskCtx = maskCanvas.getContext('2d');
                        maskCanvas.width = canvas.width;
                        maskCanvas.height = canvas.height;
                        maskCtx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height);
                        
                        const maskData = maskCtx.getImageData(0, 0, canvas.width, canvas.height).data;
                        
                        // Apply mask
                        for (let i = 0; i < data.length; i += 4) {
                            const maskIndex = i;
                            const maskValue = maskData[maskIndex] / 255; // Normalize to 0-1
                            
                            if (maskValue < this.sensitivity) {
                                data[i + 3] = 0; // Make transparent
                            } else {
                                data[i + 3] = Math.min(255, data[i + 3] * maskValue);
                            }
                        }
                    }
                    
                    this.updateProgress(100, 'MediaPipe processing complete!');
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            });
            
            // Send image to MediaPipe
            this.mediaPipeSegmentation.send({ image: canvas });
        });
    }

    async processWithImgly() {
        if (!this.imglyBackgroundRemoval) {
            throw new Error('IMG.LY model not loaded');
        }

        this.updateProgress(10, 'Initializing IMG.LY processing...');
        
        // Create blob from image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.currentImage.width;
        canvas.height = this.currentImage.height;
        ctx.drawImage(this.currentImage, 0, 0);
        
        this.updateProgress(30, 'Running IMG.LY AI processing...');
        
        return new Promise((resolve, reject) => {
            canvas.toBlob(async (blob) => {
                try {
                    const resultBlob = await this.imglyBackgroundRemoval(blob);
                    
                    this.updateProgress(70, 'Converting IMG.LY results...');
                    
                    // Convert result back to image data
                    const resultImage = new Image();
                    resultImage.onload = () => {
                        const resultCanvas = document.createElement('canvas');
                        const resultCtx = resultCanvas.getContext('2d');
                        resultCanvas.width = this.currentImage.width;
                        resultCanvas.height = this.currentImage.height;
                        resultCtx.drawImage(resultImage, 0, 0);
                        
                        const imageData = resultCtx.getImageData(0, 0, resultCanvas.width, resultCanvas.height);
                        this.updateProgress(100, 'IMG.LY processing complete!');
                        resolve(imageData.data);
                    };
                    
                    resultImage.src = URL.createObjectURL(resultBlob);
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    async processWithOpenCV() {
        if (!this.openCVReady) {
            throw new Error('OpenCV not loaded');
        }

        this.updateProgress(10, 'Initializing OpenCV processing...');
        
        // Create canvas from image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.currentImage.width;
        canvas.height = this.currentImage.height;
        ctx.drawImage(this.currentImage, 0, 0);
        
        this.updateProgress(30, 'Running OpenCV algorithms...');
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Convert to OpenCV Mat
        const src = cv.matFromImageData(imageData);
        const dst = new cv.Mat();
        
        try {
            // Apply GrabCut algorithm
            const mask = new cv.Mat();
            const bgdModel = new cv.Mat();
            const fgdModel = new cv.Mat();
            
            // Create rectangle for GrabCut
            const rect = new cv.Rect(10, 10, canvas.width - 20, canvas.height - 20);
            
            this.updateProgress(50, 'Applying GrabCut segmentation...');
            
            cv.grabCut(src, mask, rect, bgdModel, fgdModel, 1, cv.GC_INIT_WITH_RECT);
            
            this.updateProgress(70, 'Refining segmentation...');
            
            // Refine with additional iterations
            cv.grabCut(src, mask, rect, bgdModel, fgdModel, 2, cv.GC_EVAL);
            
            // Create final mask
            const finalMask = new cv.Mat();
            cv.compare(mask, new cv.Scalar(1), finalMask, cv.CMP_EQ);
            cv.bitwise_or(finalMask, mask.clone(), finalMask);
            cv.compare(mask, new cv.Scalar(3), mask, cv.CMP_EQ);
            cv.bitwise_or(finalMask, mask, finalMask);
            
            // Apply mask to image
            const result = new cv.Mat();
            src.copyTo(result, finalMask);
            
            // Convert back to ImageData
            const resultImageData = new ImageData(new Uint8ClampedArray(result.data), canvas.width, canvas.height);
            
            this.updateProgress(100, 'OpenCV processing complete!');
            
            // Cleanup OpenCV objects
            src.delete();
            dst.delete();
            mask.delete();
            bgdModel.delete();
            fgdModel.delete();
            finalMask.delete();
            result.delete();
              return resultImageData.data;
            
        } catch (error) {
            // Cleanup on error
            src.delete();
            dst.delete();
            throw error;
        }
    }    async processWithAPI() {
        if (!this.apiKey) {
            throw new Error('API key not configured');
        }

        this.updateProgress(10, 'Initializing API processing...');
        
        // Try primary API first, then fallback to alternative
        try {
            return await this.makeApiRequest(this.apiEndpoint, false);
        } catch (primaryError) {
            console.warn('Primary API failed, trying alternative...', primaryError);
            this.updateProgress(20, 'Trying alternative API...');
            
            try {
                return await this.makeApiRequest(this.alternativeApiEndpoint, true);
            } catch (alternativeError) {
                console.error('Both APIs failed');
                throw new Error(`API processing failed: ${primaryError.message}`);
            }
        }
    }

    async makeApiRequest(endpoint, isAlternative = false) {
        try {
            // Convert image to blob
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = this.currentImage.width;
            canvas.height = this.currentImage.height;
            ctx.drawImage(this.currentImage, 0, 0);
            
            const progressOffset = isAlternative ? 20 : 0;
            this.updateProgress(20 + progressOffset, 'Preparing image for API...');
            
            // Create blob from canvas
            const blob = await new Promise((resolve) => {
                canvas.toBlob(resolve, 'image/png', 0.9);
            });
            
            console.log('🔍 Blob created:', blob.size, 'bytes');
            
            // Create FormData for API request
            const formData = new FormData();
            
            if (isAlternative) {
                // ClipDrop API format
                formData.append('image_file', blob, 'image.png');
            } else {
                // Remove.bg API format
                formData.append('image_file', blob, 'image.png');
                formData.append('size', 'auto');
            }
            
            this.updateProgress(40 + progressOffset, `Sending to ${isAlternative ? 'alternative' : 'primary'} API...`);
            console.log('🚀 Sending request to:', endpoint);
            
            // Make API request with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
            
            const headers = isAlternative ? 
                { 'x-api-key': this.apiKey } : 
                { 'X-Api-Key': this.apiKey };
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: headers,
                body: formData,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            console.log('📡 API Response status:', response.status, response.statusText);
            this.updateProgress(60 + progressOffset, 'Receiving API response...');
            
            if (!response.ok) {
                // Get error details
                let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
                try {
                    const errorText = await response.text();
                    console.error('API Error Response:', errorText);
                    if (errorText) {
                        errorMessage += ` - ${errorText}`;
                    }
                } catch (e) {
                    console.error('Could not read error response:', e);
                }
                throw new Error(errorMessage);
            }
            
            this.updateProgress(70 + progressOffset, 'Processing API response...');
            
            const resultBlob = await response.blob();
            console.log('✅ Result blob received:', resultBlob.size, 'bytes', resultBlob.type);
            
            if (resultBlob.size === 0) {
                throw new Error('API returned empty response');
            }
            
            this.updateProgress(80 + progressOffset, 'Converting result to image...');
            
            // Convert blob back to image data
            return new Promise((resolve, reject) => {
                const resultImage = new Image();
                resultImage.crossOrigin = 'anonymous';
                
                resultImage.onload = () => {
                    try {
                        const resultCanvas = document.createElement('canvas');
                        const resultCtx = resultCanvas.getContext('2d');
                        resultCanvas.width = this.currentImage.width;
                        resultCanvas.height = this.currentImage.height;
                        
                        // Draw the result image
                        resultCtx.drawImage(resultImage, 0, 0, resultCanvas.width, resultCanvas.height);
                        
                        const imageData = resultCtx.getImageData(0, 0, resultCanvas.width, resultCanvas.height);
                        
                        this.updateProgress(100, `${isAlternative ? 'Alternative' : 'Primary'} API processing complete!`);
                        console.log('✅ Image conversion successful');
                        
                        // Clean up
                        URL.revokeObjectURL(resultImage.src);
                        
                        resolve(imageData.data);
                    } catch (error) {
                        console.error('Error converting image:', error);
                        reject(new Error('Failed to process API result: ' + error.message));
                    }
                };
                
                resultImage.onerror = (error) => {
                    console.error('Error loading result image:', error);
                    URL.revokeObjectURL(resultImage.src);
                    reject(new Error('Failed to load processed image from API'));
                };
                
                resultImage.src = URL.createObjectURL(resultBlob);
            });
            
        } catch (error) {
            console.error('❌ API processing failed:', error);
            
            // Provide more specific error messages
            if (error.name === 'AbortError') {
                throw new Error('API request timeout - please try again');
            } else if (error.message.includes('401')) {
                throw new Error('Invalid API key - please check your credentials');
            } else if (error.message.includes('403')) {
                throw new Error('API access forbidden - check your account permissions');
            } else if (error.message.includes('429')) {
                throw new Error('API rate limit exceeded - please wait and try again');
            } else if (error.message.includes('network')) {
                throw new Error('Network error - please check your internet connection');
            } else {
                throw error;
            }
        }
    }

    async processWithHybridMethod() {
        this.updateProgress(10, 'Initializing hybrid AI processing...');        // Try methods in order of preference (only working libraries)
        const methods = [
            { name: 'BodyPix', method: () => this.processWithBodyPix(), available: !!this.bodyPixModel },
            { name: 'OpenCV', method: () => this.processWithOpenCV(), available: this.openCVReady },
            { name: 'API', method: () => this.processWithAPI(), available: !!this.apiKey }
            // Temporarily disabled:
            // { name: 'IMG.LY', method: () => this.processWithImgly(), available: !!this.imglyBackgroundRemoval },
            // { name: 'MediaPipe', method: () => this.processWithMediaPipe(), available: !!this.mediaPipeSegmentation },
        ];
        
        for (const methodInfo of methods) {
            if (methodInfo.available) {
                try {
                    this.updateProgress(20, `Using ${methodInfo.name} for processing...`);
                    return await methodInfo.method();
                } catch (error) {
                    console.warn(`${methodInfo.name} failed, trying next method:`, error);
                    continue;
                }
            }
        }
        
        // If all AI methods fail, use fallback
        this.updateProgress(30, 'Using fallback processing method...');
        return await this.processFallback();
    }

    async processFallback() {
        // Fallback to basic color-based removal
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.currentImage.width;
        canvas.height = this.currentImage.height;
        ctx.drawImage(this.currentImage, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Simple color-based background removal
        const backgroundColor = this.detectBackgroundColor(data, canvas.width, canvas.height);
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            const distance = Math.sqrt(
                Math.pow(r - backgroundColor[0], 2) +
                Math.pow(g - backgroundColor[1], 2) +
                Math.pow(b - backgroundColor[2], 2)
            );
            
            if (distance < this.sensitivity * 150) {
                data[i + 3] = 0; // Make transparent
            }
        }
        
        return data;
    }

    detectBackgroundColor(data, width, height) {
        // Sample edge pixels to determine background color
        const edgePixels = [];
        const sampleStep = Math.max(1, Math.floor(width / 50));
        
        // Sample top and bottom edges
        for (let x = 0; x < width; x += sampleStep) {
            const topIndex = x * 4;
            const bottomIndex = ((height - 1) * width + x) * 4;
            
            edgePixels.push([data[topIndex], data[topIndex + 1], data[topIndex + 2]]);
            edgePixels.push([data[bottomIndex], data[bottomIndex + 1], data[bottomIndex + 2]]);
        }
        
        // Sample left and right edges
        for (let y = 0; y < height; y += sampleStep) {
            const leftIndex = y * width * 4;
            const rightIndex = (y * width + width - 1) * 4;
            
            edgePixels.push([data[leftIndex], data[leftIndex + 1], data[leftIndex + 2]]);
            edgePixels.push([data[rightIndex], data[rightIndex + 1], data[rightIndex + 2]]);
        }
        
        // Find most common color
        return this.findMostCommonColor(edgePixels);
    }

    findMostCommonColor(colors) {
        const colorMap = new Map();
        
        colors.forEach(color => {
            const key = color.map(c => Math.floor(c / 16) * 16).join(',');
            colorMap.set(key, (colorMap.get(key) || 0) + 1);
        });
        
        let maxCount = 0;
        let mostCommon = [255, 255, 255];
        
        colorMap.forEach((count, colorKey) => {
            if (count > maxCount) {
                maxCount = count;
                mostCommon = colorKey.split(',').map(Number);
            }
        });
        
        return mostCommon;
    }

    applyEdgeSmoothing(mask, pixelIndex, width, height) {
        const x = pixelIndex % width;
        const y = Math.floor(pixelIndex / width);
        
        // Check surrounding pixels for edge smoothing
        let fgCount = 0;
        let totalCount = 0;
        
        for (let dy = -this.smoothing; dy <= this.smoothing; dy++) {
            for (let dx = -this.smoothing; dx <= this.smoothing; dx++) {
                const nx = x + dx;
                const ny = y + dy;
                
                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                    const nIndex = ny * width + nx;
                    if (mask[nIndex]) fgCount++;
                    totalCount++;
                }
            }
        }
        
        return totalCount > 0 ? fgCount / totalCount : 1;
    }

    cleanupPreviousResults() {
        const processedPlaceholder = document.getElementById('processedPlaceholder');
        const downloadSection = document.getElementById('downloadSection');
        
        if (this.processedCanvas) {
            this.processedCanvas.style.display = 'none';
        }
        
        if (processedPlaceholder) {
            processedPlaceholder.style.display = 'flex';
        }
        
        if (downloadSection) {
            downloadSection.style.display = 'none';
        }
        
        this.processedImage = null;
    }

    displayProcessedImage(imageData) {
        console.log('🖼️ Starting displayProcessedImage...');
        
        const canvas = this.processedCanvas;
        const ctx = canvas.getContext('2d');
        const placeholder = document.getElementById('processedPlaceholder');
        
        if (!canvas || !ctx) {
            console.error('❌ Canvas or context not found!');
            return;
        }
        
        if (!this.currentImage) {
            console.error('❌ Original image not found!');
            return;
        }
        
        // Calculate display size
        const maxWidth = 400;
        const maxHeight = 400;
        let { width, height } = this.calculateDisplaySize(this.currentImage.width, this.currentImage.height, maxWidth, maxHeight);
        
        canvas.width = width;
        canvas.height = height;
        
        // Create temporary canvas with processed data
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = this.currentImage.width;
        tempCanvas.height = this.currentImage.height;
        
        try {
            const processedImageData = tempCtx.createImageData(this.currentImage.width, this.currentImage.height);
            
            if (imageData && imageData.length > 0) {
                processedImageData.data.set(imageData);
            } else {
                console.error('❌ No valid image data to set!');
                return;
            }
            
            tempCtx.putImageData(processedImageData, 0, 0);
            
            // Draw scaled version
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(tempCanvas, 0, 0, width, height);
            
            // Store processed image data for download
            this.processedImage = tempCanvas;
            
            // Show canvas and hide placeholder
            canvas.classList.add('visible');
            canvas.style.display = 'block';
            if (placeholder) {
                placeholder.classList.add('hidden');
                placeholder.style.display = 'none';
            }
            
            console.log('✅ DisplayProcessedImage completed successfully');
            
        } catch (error) {
            console.error('❌ Error in displayProcessedImage:', error);
        }
    }

    showProgressSection() {
        const progressSection = document.getElementById('progressSection');
        if (progressSection) {
            progressSection.style.display = 'block';
            this.updateProgressSteps(1);
        }
    }

    hideProgressSection() {
        const progressSection = document.getElementById('progressSection');
        if (progressSection) {
            setTimeout(() => {
                progressSection.style.display = 'none';
            }, 1000);
        }
    }

    updateProgress(percentage, text) {
        const progressBar = document.getElementById('progressBar');
        const progressPercentage = document.getElementById('progressPercentage');
        
        if (progressBar) progressBar.style.width = `${percentage}%`;
        if (progressPercentage) progressPercentage.textContent = `${percentage}%`;
        
        // Update progress steps
        if (percentage <= 25) this.updateProgressSteps(1);
        else if (percentage <= 50) this.updateProgressSteps(2);
        else if (percentage <= 75) this.updateProgressSteps(3);
        else this.updateProgressSteps(4);
    }

    updateProgressSteps(activeStep) {
        document.querySelectorAll('.step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber < activeStep) {
                step.classList.add('completed');
            } else if (stepNumber === activeStep) {
                step.classList.add('active');
            }
        });
    }

    showDownloadSection() {
        const downloadSection = document.getElementById('downloadSection');
        if (downloadSection) {
            downloadSection.style.display = 'block';
        }
    }

    downloadImage(format) {
        if (!this.processedImage) return;
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = this.processedImage.width;
        canvas.height = this.processedImage.height;
        
        if (format === 'jpg') {
            // Add white background for JPG
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(this.processedImage, 0, 0);
        
        // Create download link
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `background-removed-${this.currentMode}.${format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showNotification(`Image downloaded as ${format.toUpperCase()} using ${this.currentMode}!`, 'success');
        }, `image/${format === 'jpg' ? 'jpeg' : format}`);
    }

    toggleTheme() {
        document.body.classList.toggle('light-theme');
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            const isLightTheme = document.body.classList.contains('light-theme');
            themeIcon.textContent = isLightTheme ? '☀️' : '🌙';
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 25px',
            borderRadius: '10px',
            color: 'white',
            fontWeight: '600',
            zIndex: '1001',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
        });
        
        // Set background based on type
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(45deg, #00ff88, #00f5ff)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(45deg, #ff3366, #ff00ff)';
                break;
            case 'warning':
                notification.style.background = 'linear-gradient(45deg, #ffaa00, #ff6600)';
                break;
            default:
                notification.style.background = 'linear-gradient(45deg, #00f5ff, #ff00ff)';
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    createParticles() {
        const container = document.getElementById('particlesContainer');
        if (!container) return;
        
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random positioning and animation
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const delay = Math.random() * 6;
            const duration = 4 + Math.random() * 4;
            
            Object.assign(particle.style, {
                left: `${x}%`,
                top: `${y}%`,
                animationDelay: `${delay}s`,
                animationDuration: `${duration}s`
            });
            
            // Random color
            const colors = ['#00f5ff', '#ff00ff', '#00ff88'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            container.appendChild(particle);
        }
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loadingOverlay');
        if (!overlay) return;
        
        // Check browser capabilities
        this.checkBrowserSupport();
        
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 500);
        }, 1500);
    }
    
    checkBrowserSupport() {
        const features = {
            canvas: !!document.createElement('canvas').getContext,
            webgl: !!document.createElement('canvas').getContext('webgl'),
            worker: typeof Worker !== 'undefined',
            imageData: typeof ImageData !== 'undefined',
            performance: typeof performance !== 'undefined',
            tensorflow: typeof tf !== 'undefined',
            bodyPix: typeof bodyPix !== 'undefined',
            opencv: typeof cv !== 'undefined'
        };
        
        let supportLevel = 'full';
        
        if (!features.canvas || !features.imageData) {
            supportLevel = 'none';
            this.showNotification('Your browser does not support required features.', 'error');
        } else if (!features.tensorflow && !features.opencv) {
            supportLevel = 'limited';
            this.showNotification('Advanced AI libraries not available. Using fallback methods.', 'warning');
        } else if (!features.webgl) {
            supportLevel = 'good';
            this.showNotification('WebGL not available. Some features may be slower.', 'warning');
        }
          console.log('Browser support level:', supportLevel, features);
        return supportLevel;
    }    showApiStatus() {
        const apiStatus = document.getElementById('apiStatus');
        if (apiStatus) {
            apiStatus.style.display = 'block';
            // Test API connectivity when shown
            this.testApiConnection();
        }
    }

    hideApiStatus() {
        const apiStatus = document.getElementById('apiStatus');
        if (apiStatus) {
            apiStatus.style.display = 'none';
        }
    }

    async testApiConnection() {
        const statusText = document.querySelector('.status-text');
        const statusDot = document.querySelector('.status-dot');
        
        if (!statusText || !statusDot) return;
        
        try {
            statusText.textContent = 'Testing API...';
            statusDot.style.background = '#ffaa00'; // Orange for testing
            
            // Create a simple test request (without actual image)
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'X-Api-Key': this.apiKey
                }
            });
            
            if (response.status === 400) {
                // Expected error for missing image, but API is working
                statusText.textContent = 'API Ready';
                statusDot.style.background = '#00ff88'; // Green
            } else if (response.status === 401) {
                statusText.textContent = 'Invalid API Key';
                statusDot.style.background = '#ff3366'; // Red
            } else if (response.status === 403) {
                statusText.textContent = 'API Access Denied';
                statusDot.style.background = '#ff3366'; // Red
            } else {
                statusText.textContent = 'API Ready';
                statusDot.style.background = '#00ff88'; // Green
            }
        } catch (error) {
            console.warn('API test failed:', error);
            statusText.textContent = 'API Offline';
            statusDot.style.background = '#ff3366'; // Red
        }
    }
}// Initialize the advanced application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new AdvancedBackgroundRemover();
    window.backgroundRemover = app; // Make it globally accessible for debugging    // Add debugging function
    window.testProcessing = () => {
        console.log('🧪 Testing processing function...');
        console.log('Current image:', !!app.currentImage);
        console.log('Is processing:', app.isProcessing);
        console.log('Available models:', {
            bodyPix: !!app.bodyPixModel,
            openCV: app.openCVReady,
            apiKey: !!app.apiKey
        });
        console.log('Current mode:', app.currentMode);
        console.log('API Endpoint:', app.apiEndpoint);
        console.log('API Key:', app.apiKey ? app.apiKey.substring(0, 8) + '...' : 'Not set');
    };

    // Add API test function
    window.testAPI = async () => {
        console.log('🧪 Testing API connection...');
        try {
            await app.testApiConnection();
            console.log('✅ API test completed - check status indicator');
        } catch (error) {
            console.error('❌ API test failed:', error);
        }
    };
    
    // Add library check function
    window.checkLibraries = () => {
        console.log('📚 Checking library availability...');
        console.log('TensorFlow.js:', typeof tf !== 'undefined');
        console.log('BodyPix:', typeof bodyPix !== 'undefined');
        console.log('OpenCV:', typeof cv !== 'undefined');
    };
    
    // Add model loading status indicator
    const statusIndicator = document.createElement('div');
    statusIndicator.id = 'modelStatus';
    statusIndicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-size: 12px;
        z-index: 1000;
        display: none;
    `;
    document.body.appendChild(statusIndicator);
      // Show available models after initialization
    setTimeout(() => {
        const availableModels = [];
        if (app.bodyPixModel) availableModels.push('BodyPix');
        if (app.openCVReady) availableModels.push('OpenCV');
        // Temporarily disabled:
        // if (app.mediaPipeSegmentation) availableModels.push('MediaPipe');
        // if (app.imglyBackgroundRemoval) availableModels.push('IMG.LY');
        
        if (availableModels.length > 0) {
            statusIndicator.textContent = `AI Models Ready: ${availableModels.join(', ')}`;
            statusIndicator.style.display = 'block';
            
            setTimeout(() => {
                statusIndicator.style.display = 'none';
            }, 5000);
        }
    }, 3000);
});
