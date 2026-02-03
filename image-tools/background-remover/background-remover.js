/**
 * AI Background Remover with MediaPipe (Primary) + Transformers.js (Advanced Mode)
 * High-accuracy edge detection with refinement
 */

class BackgroundRemover {
    constructor() {
        this.selfieSegmentation = null;
        this.originalImage = null;
        this.originalCanvas = document.getElementById('originalCanvas');
        this.resultCanvas = document.getElementById('resultCanvas');
        this.originalCtx = this.originalCanvas.getContext('2d');
        this.resultCtx = this.resultCanvas.getContext('2d');
        
        // Settings
        this.bgType = 'transparent';
        this.bgColor = '#ffffff';
        this.bgGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        this.smoothness = 5;
        this.threshold = 0.5;
        this.edgeRefinement = 3;
        
        // State
        this.isProcessing = false;
        this.isModelLoaded = false;
        this.currentEngine = 'mediapipe'; // Default to MediaPipe (reliable)
        
        // Advanced model
        this.transformers = null;
        this.advancedModel = null;
        this.advancedModelLoading = false;
        
        this.init();
    }
    
    async init() {
        console.log('🚀 Initializing AI Background Remover...');
        this.setupEventListeners();
        this.setupFAQ();
        await this.loadPrimaryModel();
    }
    
    /**
     * Load MediaPipe as primary (reliable)
     */
    async loadPrimaryModel() {
        try {
            console.log('📦 Loading MediaPipe Selfie Segmentation...');
            this.showNotification('Loading AI model...', 'info');
            
            // Ensure MediaPipe scripts are loaded
            await this.loadMediaPipeScripts();
            
            // Initialize
            this.selfieSegmentation = new SelfieSegmentation({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
                }
            });
            
            this.selfieSegmentation.setOptions({
                modelSelection: 1, // 1 = landscape model (better quality)
                selfieMode: false
            });
            
            this.selfieSegmentation.onResults(this.onSegmentationResults.bind(this));
            
            // Test initialization
            const testCanvas = document.createElement('canvas');
            testCanvas.width = 1;
            testCanvas.height = 1;
            await this.selfieSegmentation.send({ image: testCanvas });
            
            this.currentEngine = 'mediapipe';
            this.isModelLoaded = true;
            
            console.log('✅ MediaPipe loaded successfully!');
            this.showNotification('AI model ready! Upload an image to start.', 'success');
            
            // Try loading advanced model in background
            this.loadAdvancedModelInBackground();
            
        } catch (error) {
            console.error('❌ Failed to load MediaPipe:', error);
            this.showNotification('Error loading AI model. Please refresh.', 'error');
        }
    }
    
    /**
     * Load MediaPipe scripts
     */
    loadMediaPipeScripts() {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (window.SelfieSegmentation) {
                resolve();
                return;
            }
            
            const scripts = [
                'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
                'https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js',
                'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js',
                'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js'
            ];
            
            let loadedCount = 0;
            const totalScripts = scripts.length;
            
            const checkComplete = () => {
                loadedCount++;
                if (loadedCount >= totalScripts) {
                    setTimeout(() => {
                        if (window.SelfieSegmentation) {
                            resolve();
                        } else {
                            reject(new Error('SelfieSegmentation not available after loading scripts'));
                        }
                    }, 500); // Give time for scripts to initialize
                }
            };
            
            const loadScript = (src) => {
                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                script.crossOrigin = 'anonymous';
                script.onload = checkComplete;
                script.onerror = () => {
                    console.warn(`Failed to load: ${src}`);
                    checkComplete(); // Continue anyway
                };
                document.head.appendChild(script);
            };
            
            // Set timeout
            const timeout = setTimeout(() => {
                if (window.SelfieSegmentation) {
                    resolve();
                } else {
                    reject(new Error('Timeout loading MediaPipe scripts'));
                }
            }, 20000);
            
            // Load all scripts
            scripts.forEach(loadScript);
            
            // Override resolve to clear timeout
            const originalResolve = resolve;
            resolve = () => {
                clearTimeout(timeout);
                originalResolve();
            };
        });
    }
    
    /**
     * Try loading advanced Transformers.js model in background
     */
    async loadAdvancedModelInBackground() {
        if (this.advancedModelLoading) return;
        this.advancedModelLoading = true;
        
        try {
            console.log('📦 Loading advanced Transformers.js model in background...');
            
            await this.loadTransformersScript();
            
            const { pipeline } = this.transformers;
            
            this.advancedModel = await pipeline('background-removal', 'briaai/RMBG-1-4', {
                revision: 'main',
                quantized: true
            });
            
            console.log('✅ Advanced model loaded!');
            this.addAdvancedModeOption();
            
        } catch (error) {
            console.warn('⚠️ Advanced model failed to load:', error);
        }
    }
    
    /**
     * Load Transformers.js script
     */
    loadTransformersScript() {
        return new Promise((resolve, reject) => {
            if (window.transformers) {
                this.transformers = window.transformers;
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js';
            script.async = true;
            
            script.onload = () => {
                this.transformers = window.transformers;
                resolve();
            };
            
            script.onerror = () => {
                reject(new Error('Failed to load Transformers.js'));
            };
            
            setTimeout(() => reject(new Error('Transformers.js load timeout')), 30000);
            document.head.appendChild(script);
        });
    }
    
    /**
     * Add advanced mode UI option
     */
    addAdvancedModeOption() {
        const engineSelector = document.querySelector('.bg-type-selector');
        if (!engineSelector || document.getElementById('advancedModeLabel')) return;
        
        const advancedLabel = document.createElement('label');
        advancedLabel.id = 'advancedModeLabel';
        advancedLabel.className = 'radio-label';
        advancedLabel.innerHTML = `
            <input type="checkbox" id="advancedMode">
            <span class="radio-custom"></span>
            <span class="radio-text">
                <i class="fas fa-rocket"></i> Advanced AI Mode
            </span>
        `;
        
        const controlPanel = document.querySelector('.controls-panel');
        const controlGroup = controlPanel.querySelector('.control-group');
        controlGroup.insertBefore(advancedLabel, controlGroup.firstChild);
        
        document.getElementById('advancedMode').addEventListener('change', (e) => {
            this.currentEngine = e.target.checked && this.advancedModel ? 'transformers' : 'mediapipe';
            if (this.originalImage) {
                this.processImage();
            }
        });
    }
    
    /**
     * Process with Transformers.js (advanced)
     */
    async processWithAdvancedModel() {
        if (!this.advancedModel) {
            throw new Error('Advanced model not loaded');
        }
        
        const imageData = this.originalCtx.getImageData(0, 0, this.originalCanvas.width, this.originalCanvas.height);
        const result = await this.advancedModel(imageData);
        
        this.applyAdvancedMask(imageData.data, result.data, this.originalCanvas.width, this.originalCanvas.height);
        
        this.resultCanvas.width = this.originalCanvas.width;
        this.resultCanvas.height = this.originalCanvas.height;
        this.resultCtx.putImageData(imageData, 0, 0);
    }
    
    /**
     * Apply mask from advanced model
     */
    applyAdvancedMask(data, maskData, width, height) {
        const alpha = new Float32Array(width * height);
        
        for (let i = 0; i < maskData.length; i++) {
            alpha[i] = maskData[i];
        }
        
        // Apply refinement
        if (this.smoothness > 0) {
            this.smoothEdges(alpha, width, height, this.smoothness);
        }
        this.featherEdges(alpha, width, height);
        
        // Apply to image
        switch (this.bgType) {
            case 'transparent':
                this.applyTransparent(data, alpha, width, height);
                break;
            case 'color':
                this.applyColor(data, alpha, width, height);
                break;
            case 'gradient':
                this.applyGradient(data, alpha, width, height);
                break;
        }
    }
    
    /**
     * Handle MediaPipe results
     */
    async onSegmentationResults(results) {
        if (!this.originalImage || !results.segmentationMask) return;
        
        const width = this.originalCanvas.width;
        const height = this.originalCanvas.height;
        
        const imageData = this.originalCtx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        // Get mask from MediaPipe
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = width;
        maskCanvas.height = height;
        const maskCtx = maskCanvas.getContext('2d');
        maskCtx.drawImage(results.segmentationMask, 0, 0, width, height);
        const maskData = maskCtx.getImageData(0, 0, width, height).data;
        
        // Convert to alpha array
        const alpha = new Float32Array(width * height);
        for (let i = 0; i < maskData.length; i += 4) {
            alpha[i / 4] = maskData[i] / 255;
        }
        
        // Apply edge refinement
        if (this.smoothness > 0) {
            this.smoothEdges(alpha, width, height, this.smoothness);
        }
        this.featherEdges(alpha, width, height);
        this.applyEdgeSharpening(alpha, width, height);
        
        // Apply to image
        switch (this.bgType) {
            case 'transparent':
                this.applyTransparent(data, alpha, width, height);
                break;
            case 'color':
                this.applyColor(data, alpha, width, height);
                break;
            case 'gradient':
                this.applyGradient(data, alpha, width, height);
                break;
        }
        
        this.resultCanvas.width = width;
        this.resultCanvas.height = height;
        this.resultCtx.putImageData(imageData, 0, 0);
        
        document.getElementById('downloadSection').style.display = 'block';
        this.hideLoading();
        this.isProcessing = false;
        this.showNotification('Background removed successfully!', 'success');
    }
    
    /**
     * Smooth edges using Gaussian blur
     */
    smoothEdges(alpha, width, height, radius) {
        const temp = new Float32Array(alpha);
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let sum = 0;
                let weight = 0;
                
                for (let dy = -radius; dy <= radius; dy++) {
                    for (let dx = -radius; dx <= radius; dx++) {
                        const ny = y + dy;
                        const nx = x + dx;
                        
                        if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                            const idx = ny * width + nx;
                            const dist = Math.sqrt(dx * dx + dy * dy);
                            const w = Math.exp(-(dist * dist) / (2 * radius * radius));
                            sum += temp[idx] * w;
                            weight += w;
                        }
                    }
                }
                
                alpha[y * width + x] = weight > 0 ? sum / weight : temp[y * width + x];
            }
        }
    }
    
    /**
     * Feather edges for natural look
     */
    featherEdges(alpha, width, height) {
        const featherRadius = 3;
        
        for (let y = featherRadius; y < height - featherRadius; y++) {
            for (let x = featherRadius; x < width - featherRadius; x++) {
                const idx = y * width + x;
                const currentAlpha = alpha[idx];
                
                // Skip fully opaque or fully transparent
                if (currentAlpha <= 0.01 || currentAlpha >= 0.99) continue;
                
                // Check if edge pixel
                let edgeScore = 0;
                for (let dy = -featherRadius; dy <= featherRadius; dy++) {
                    for (let dx = -featherRadius; dx <= featherRadius; dx++) {
                        if (dx === 0 && dy === 0) continue;
                        const nidx = (y + dy) * width + (x + dx);
                        edgeScore += Math.abs(currentAlpha - alpha[nidx]);
                    }
                }
                
                // Apply feathering based on edge score
                if (edgeScore > 0.5) {
                    // Gamma correction for smoother transition
                    alpha[idx] = Math.pow(currentAlpha, 0.75);
                }
            }
        }
    }
    
    /**
     * Sharpen edges for crisp look
     */
    applyEdgeSharpening(alpha, width, height) {
        const sharpenRadius = 1;
        const temp = new Float32Array(alpha);
        
        for (let y = sharpenRadius; y < height - sharpenRadius; y++) {
            for (let x = sharpenRadius; x < width - sharpenRadius; x++) {
                const idx = y * width + x;
                
                // Only sharpen mid-range values
                if (temp[idx] > 0.1 && temp[idx] < 0.9) {
                    let edgeStrength = 0;
                    
                    // Check neighbors
                    for (let dy = -sharpenRadius; dy <= sharpenRadius; dy++) {
                        for (let dx = -sharpenRadius; dx <= sharpenRadius; dx++) {
                            if (dx === 0 && dy === 0) continue;
                            const nidx = (y + dy) * width + (x + dx);
                            edgeStrength += Math.abs(temp[idx] - temp[nidx]);
                        }
                    }
                    
                    // Sharpen if strong edge detected
                    if (edgeStrength > 1.0) {
                        if (temp[idx] > 0.5) {
                            alpha[idx] = Math.min(1, temp[idx] * 1.2);
                        } else {
                            alpha[idx] = temp[idx] * 0.8;
                        }
                    }
                }
            }
        }
    }
    
    /**
     * Apply transparent background
     */
    applyTransparent(data, alpha, width, height) {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const a = alpha[y * width + x];
                data[i + 3] = Math.floor(a * 255);
            }
        }
    }
    
    /**
     * Apply solid color background
     */
    applyColor(data, alpha, width, height) {
        const bgColor = this.hexToRgb(this.bgColor);
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const a = alpha[y * width + x];
                const invA = 1 - a;
                
                data[i] = Math.floor(data[i] * a + bgColor.r * invA);
                data[i + 1] = Math.floor(data[i + 1] * a + bgColor.g * invA);
                data[i + 2] = Math.floor(data[i + 2] * a + bgColor.b * invA);
                data[i + 3] = 255;
            }
        }
    }
    
    /**
     * Apply gradient background
     */
    applyGradient(data, alpha, width, height) {
        const gradientCanvas = document.createElement('canvas');
        gradientCanvas.width = width;
        gradientCanvas.height = height;
        const gradientCtx = gradientCanvas.getContext('2d');
        
        const gradient = gradientCtx.createLinearGradient(0, 0, width, height);
        
        switch (this.bgGradient) {
            case 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)':
                gradient.addColorStop(0, '#667eea');
                gradient.addColorStop(1, '#764ba2');
                break;
            case 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)':
                gradient.addColorStop(0, '#f093fb');
                gradient.addColorStop(1, '#f5576c');
                break;
            case 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)':
                gradient.addColorStop(0, '#4facfe');
                gradient.addColorStop(1, '#00f2fe');
                break;
            case 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)':
                gradient.addColorStop(0, '#43e97b');
                gradient.addColorStop(1, '#38f9d7');
                break;
            case 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)':
                gradient.addColorStop(0, '#fa709a');
                gradient.addColorStop(1, '#fee140');
                break;
            case 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)':
                gradient.addColorStop(0, '#30cfd0');
                gradient.addColorStop(1, '#330867');
                break;
            default:
                gradient.addColorStop(0, '#667eea');
                gradient.addColorStop(1, '#764ba2');
        }
        
        gradientCtx.fillStyle = gradient;
        gradientCtx.fillRect(0, 0, width, height);
        
        const bgData = gradientCtx.getImageData(0, 0, width, height).data;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const a = alpha[y * width + x];
                const invA = 1 - a;
                
                data[i] = Math.floor(data[i] * a + bgData[i] * invA);
                data[i + 1] = Math.floor(data[i + 1] * a + bgData[i + 1] * invA);
                data[i + 2] = Math.floor(data[i + 2] * a + bgData[i + 2] * invA);
                data[i + 3] = 255;
            }
        }
    }
    
    /**
     * Hex to RGB
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 255, b: 255 };
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');
        
        uploadZone.addEventListener('click', () => fileInput.click());
        
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });
        
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });
        
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
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
        
        // Background type
        document.querySelectorAll('input[name="bgType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.bgType = e.target.value;
                this.updateBackgroundOptions();
                if (this.originalImage && !this.isProcessing) {
                    this.processImage();
                }
            });
        });
        
        // Color selection
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const color = e.currentTarget.dataset.color;
                if (color) {
                    this.bgColor = color;
                    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
                    e.currentTarget.classList.add('active');
                    if (this.originalImage && this.bgType === 'color' && !this.isProcessing) {
                        this.processImage();
                    }
                }
            });
        });
        
        // Custom color
        const customColorBtn = document.getElementById('customColorBtn');
        const customColorPicker = document.getElementById('customColorPicker');
        
        if (customColorBtn && customColorPicker) {
            customColorBtn.addEventListener('click', () => customColorPicker.click());
            customColorPicker.addEventListener('change', (e) => {
                this.bgColor = e.target.value;
                customColorBtn.style.background = e.target.value;
                customColorBtn.style.borderColor = e.target.value;
                document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
                customColorBtn.classList.add('active');
                if (this.originalImage && this.bgType === 'color' && !this.isProcessing) {
                    this.processImage();
                }
            });
        }
        
        // Gradient selection
        document.querySelectorAll('.gradient-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.bgGradient = e.currentTarget.dataset.gradient;
                document.querySelectorAll('.gradient-btn').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');
                if (this.originalImage && this.bgType === 'gradient' && !this.isProcessing) {
                    this.processImage();
                }
            });
        });
        
        // Sliders
        const smoothnessSlider = document.getElementById('smoothnessSlider');
        const thresholdSlider = document.getElementById('thresholdSlider');
        
        smoothnessSlider.addEventListener('input', (e) => {
            this.smoothness = parseInt(e.target.value);
            document.getElementById('smoothnessValue').textContent = this.smoothness;
        });
        
        thresholdSlider.addEventListener('input', (e) => {
            this.threshold = parseInt(e.target.value) / 100;
            document.getElementById('thresholdValue').textContent = e.target.value + '%';
        });
        
        smoothnessSlider.addEventListener('change', () => {
            if (this.originalImage && !this.isProcessing) this.processImage();
        });
        
        thresholdSlider.addEventListener('change', () => {
            if (this.originalImage && !this.isProcessing) this.processImage();
        });
        
        // Buttons
        document.getElementById('processBtn').addEventListener('click', () => {
            this.processImage();
        });
        
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.reset();
        });
        
        document.querySelectorAll('.btn-download').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = e.currentTarget.dataset.format;
                this.downloadImage(format);
            });
        });
    }
    
    /**
     * Update background options visibility
     */
    updateBackgroundOptions() {
        const colorSection = document.getElementById('colorSection');
        const gradientSection = document.getElementById('gradientSection');
        
        if (colorSection) colorSection.style.display = this.bgType === 'color' ? 'block' : 'none';
        if (gradientSection) gradientSection.style.display = this.bgType === 'gradient' ? 'block' : 'none';
    }
    
    /**
     * Handle file upload
     */
    async handleFile(file) {
        if (!file.type.startsWith('image/')) {
            this.showNotification('Please upload a valid image file.', 'error');
            return;
        }
        
        // Wait for model if not loaded
        if (!this.isModelLoaded) {
            this.showNotification('Loading AI model... Please wait', 'info');
            let attempts = 0;
            while (!this.isModelLoaded && attempts < 30) {
                await new Promise(r => setTimeout(r, 1000));
                attempts++;
            }
            if (!this.isModelLoaded) {
                this.showNotification('Model loading failed. Please refresh.', 'error');
                return;
            }
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.originalImage = new Image();
            this.originalImage.onload = () => {
                this.displayOriginalImage();
                document.getElementById('uploadZone').style.display = 'none';
                document.getElementById('editorSection').style.display = 'block';
                this.processImage();
            };
            this.originalImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    
    /**
     * Display original image
     */
    displayOriginalImage() {
        const maxWidth = 1024;
        const maxHeight = 1024;
        let width = this.originalImage.width;
        let height = this.originalImage.height;
        
        if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
        }
        
        this.originalCanvas.width = width;
        this.originalCanvas.height = height;
        this.originalCtx.drawImage(this.originalImage, 0, 0, width, height);
    }
    
    /**
     * Process image
     */
    async processImage() {
        if (!this.originalImage || this.isProcessing) return;
        
        if (!this.isModelLoaded) {
            this.showNotification('AI model is loading... Please wait', 'warning');
            return;
        }
        
        this.isProcessing = true;
        this.showLoading();
        
        try {
            if (this.currentEngine === 'transformers' && this.advancedModel) {
                await this.processWithAdvancedModel();
                document.getElementById('downloadSection').style.display = 'block';
                this.hideLoading();
                this.isProcessing = false;
                this.showNotification('Background removed with Advanced AI!', 'success');
            } else if (this.currentEngine === 'mediapipe' && this.selfieSegmentation) {
                await this.selfieSegmentation.send({ image: this.originalCanvas });
            } else {
                throw new Error('No AI engine available');
            }
        } catch (error) {
            console.error('Processing error:', error);
            this.hideLoading();
            this.isProcessing = false;
            this.showNotification('Error: ' + error.message, 'error');
        }
    }
    
    /**
     * Show loading
     */
    showLoading() {
        const overlay = document.getElementById('loadingOverlay');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        overlay.style.display = 'flex';
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress > 95) progress = 95;
            progressFill.style.width = progress + '%';
            progressText.textContent = Math.floor(progress) + '%';
        }, 150);
        
        this.progressInterval = interval;
    }
    
    /**
     * Hide loading
     */
    hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
        
        progressFill.style.width = '100%';
        progressText.textContent = '100%';
        
        setTimeout(() => {
            overlay.style.display = 'none';
            progressFill.style.width = '0%';
        }, 500);
    }
    
    /**
     * Download image
     */
    downloadImage(format) {
        if (!this.resultCanvas) return;
        
        const link = document.createElement('a');
        const filename = `background-removed-${Date.now()}`;
        
        if (format === 'png') {
            link.download = `${filename}.png`;
            link.href = this.resultCanvas.toDataURL('image/png');
        } else if (format === 'jpg') {
            const canvas = document.createElement('canvas');
            canvas.width = this.resultCanvas.width;
            canvas.height = this.resultCanvas.height;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(this.resultCanvas, 0, 0);
            link.download = `${filename}.jpg`;
            link.href = canvas.toDataURL('image/jpeg', 0.95);
        } else if (format === 'webp') {
            link.download = `${filename}.webp`;
            link.href = this.resultCanvas.toDataURL('image/webp', 0.95);
        }
        
        link.click();
        this.showNotification(`Image downloaded as ${format.toUpperCase()}`, 'success');
    }
    
    /**
     * Reset
     */
    reset() {
        this.originalImage = null;
        this.originalCtx.clearRect(0, 0, this.originalCanvas.width, this.originalCanvas.height);
        this.resultCtx.clearRect(0, 0, this.resultCanvas.width, this.resultCanvas.height);
        
        document.getElementById('uploadZone').style.display = 'block';
        document.getElementById('editorSection').style.display = 'none';
        document.getElementById('downloadSection').style.display = 'none';
        document.getElementById('fileInput').value = '';
    }
    
    /**
     * Setup FAQ
     */
    setupFAQ() {
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const item = question.parentElement;
                const isActive = item.classList.contains('active');
                document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
                if (!isActive) item.classList.add('active');
            });
        });
    }
    
    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '100px',
            right: '20px',
            padding: '15px 25px',
            borderRadius: '10px',
            color: 'white',
            fontWeight: '600',
            zIndex: '10000',
            transform: 'translateX(120%)',
            transition: 'transform 0.3s ease',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
        });
        
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #00ff88, #00cc66)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #ff3366, #cc0044)';
                break;
            case 'warning':
                notification.style.background = 'linear-gradient(135deg, #ffaa00, #ff8800)';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, #00f0ff, #0080ff)';
        }
        
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        setTimeout(() => {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.backgroundRemover = new BackgroundRemover();
});
