document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const settingsArea = document.getElementById('settings-area');
    const downloadArea = document.getElementById('download-area');
    const originalPreview = document.getElementById('original-preview');
    const optimizedPreview = document.getElementById('optimized-preview');
    const originalInfo = document.getElementById('original-info');
    const optimizedInfo = document.getElementById('optimized-info');
    const optimizeBtn = document.getElementById('optimize-btn');
    const downloadBtn = document.getElementById('download-btn');
    const formatButtons = document.getElementById('format-buttons');
    const startOverBtn = document.getElementById('start-over-btn');
    const finalOriginalSize = document.getElementById('final-original-size');
    const finalOptimizedSize = document.getElementById('final-optimized-size');
    const sizeReduction = document.getElementById('size-reduction');

    // Resize Options
    const widthInput = document.getElementById('width-input');
    const heightInput = document.getElementById('height-input');
    const maintainAspectCheckbox = document.getElementById('maintain-aspect-checkbox');

    // Compress Options
    const qualitySlider = document.getElementById('quality-slider');
    const qualityValueSpan = document.getElementById('quality-value');
    const removeMetadataCheckbox = document.getElementById('remove-metadata-checkbox');
    const targetSizeToggle = document.getElementById('target-size-toggle');
    const targetSizeControls = document.getElementById('target-size-controls');
    const targetSizeValue = document.getElementById('target-size-value');
    const targetSizeUnit = document.getElementById('target-size-unit');

    // Advanced Features
    const brightnessSlider = document.getElementById('brightness-slider');
    const brightnessValueSpan = document.getElementById('brightness-value');
    const contrastSlider = document.getElementById('contrast-slider');
    const contrastValueSpan = document.getElementById('contrast-value');
    const saturationSlider = document.getElementById('saturation-slider');
    const saturationValueSpan = document.getElementById('saturation-value');
    const blurSlider = document.getElementById('blur-slider');
    const blurValueSpan = document.getElementById('blur-value');

    const rotateLeftBtn = document.getElementById('rotate-left-btn');
    const rotateRightBtn = document.getElementById('rotate-right-btn');
    const flipHBtn = document.getElementById('flip-h-btn');
    const flipVBtn = document.getElementById('flip-v-btn');    const addWatermarkCheckbox = document.getElementById('add-watermark-checkbox');
    const watermarkOptions = document.querySelector('.watermark-options');
    const watermarkText = document.getElementById('watermark-text');
    const watermarkOpacity = document.getElementById('watermark-opacity');
    const opacityValueSpan = document.getElementById('opacity-value');
    const watermarkPosition = document.getElementById('watermark-position');

    let originalImage = null;
    let originalFileName = '';
    let originalFileType = '';
    let originalFileSize = 0;
    let optimizedImageBlob = null;
    let currentRotation = 0; // 0, 90, 180, 270
    let currentFlipH = false;
    let currentFlipV = false;

    // Helper to format file size
    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };    // Helper to convert target file size to bytes
    const updateTargetFileSizeBytes = () => {
        const value = parseFloat(targetSizeValue.value);
        // Handle invalid input
        if (isNaN(value) || value <= 0) {
            console.warn('Invalid target size value:', targetSizeValue.value);
            return 0;
        }
        
        const unit = targetSizeUnit.value.toLowerCase();
        let bytes = 0;
        switch (unit) {
            case 'bytes':
                bytes = value;
                break;
            case 'kb':
                bytes = value * 1024;
                break;
            case 'mb':
                bytes = value * 1024 * 1024;
                break;
            default:
                console.warn('Unknown unit:', unit);
                bytes = value; // Fallback to bytes
        }
        
        console.log(`Target size: ${value} ${unit} = ${bytes} bytes`);
        return bytes;
    };

    // Handle file upload (drag & drop or click)
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    const handleFile = (file) => {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (JPG, PNG, WebP).');
            return;
        }

        originalFileName = file.name;
        originalFileType = file.type;
        originalFileSize = file.size;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                originalImage = img;
                originalPreview.src = e.target.result;
                originalInfo.textContent = `Dimensions: ${originalImage.width}x${originalImage.height}, Size: ${formatBytes(originalFileSize)}`;

                // Set initial resize inputs to original dimensions
                widthInput.value = originalImage.width;
                heightInput.value = originalImage.height;

                uploadArea.style.display = 'none';
                settingsArea.style.display = 'block';
                downloadArea.style.display = 'none';

                updateOptimizedPreview();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    // Update quality value display
    qualitySlider.addEventListener('input', () => {
        qualityValueSpan.textContent = `${qualitySlider.value}%`;
        updateOptimizedPreview();
    });

    // Maintain aspect ratio logic
    let aspectRatio = 1;
    widthInput.addEventListener('input', () => {
        if (originalImage && maintainAspectCheckbox.checked) {
            const newWidth = parseInt(widthInput.value);
            if (!isNaN(newWidth) && newWidth > 0) {
                heightInput.value = Math.round(newWidth / aspectRatio);
            }
        }
        updateOptimizedPreview();
    });
    heightInput.addEventListener('input', () => {
        if (originalImage && maintainAspectCheckbox.checked) {
            const newHeight = parseInt(heightInput.value);
            if (!isNaN(newHeight) && newHeight > 0) {
                widthInput.value = Math.round(newHeight * aspectRatio);
            }
        }
        updateOptimizedPreview();
    });
    maintainAspectCheckbox.addEventListener('change', () => {
        if (originalImage) {
            aspectRatio = originalImage.width / originalImage.height;
            if (maintainAspectCheckbox.checked) {
                // Adjust height based on current width to maintain aspect ratio
                const newWidth = parseInt(widthInput.value);
                if (!isNaN(newWidth) && newWidth > 0) {
                    heightInput.value = Math.round(newWidth / aspectRatio);
                }
            }
        }
        updateOptimizedPreview();
    });    // Target File Size Toggle
    targetSizeToggle.addEventListener('change', () => {
        targetSizeControls.style.display = targetSizeToggle.checked ? 'flex' : 'none';
        targetSizeControls.classList.toggle('active', targetSizeToggle.checked);
        // Make sure to apply the active class immediately when checked
        if (targetSizeToggle.checked) {
            targetSizeControls.style.opacity = '1';
            targetSizeControls.style.pointerEvents = 'auto';
        } else {
            targetSizeControls.style.opacity = '0.6';
            targetSizeControls.style.pointerEvents = 'none';
        }
        updateOptimizedPreview();
    });
    targetSizeValue.addEventListener('input', updateOptimizedPreview);
    targetSizeUnit.addEventListener('change', updateOptimizedPreview);// Advanced Features Event Listeners
    brightnessSlider.addEventListener('input', () => {
        brightnessValueSpan.textContent = `${brightnessSlider.value}%`;
        updateOptimizedPreview();
    });
    contrastSlider.addEventListener('input', () => {
        contrastValueSpan.textContent = `${contrastSlider.value}%`;
        updateOptimizedPreview();
    });
    saturationSlider.addEventListener('input', () => {
        saturationValueSpan.textContent = `${saturationSlider.value}%`;
        updateOptimizedPreview();
    });
    blurSlider.addEventListener('input', () => {
        blurValueSpan.textContent = `${blurSlider.value}px`;
        updateOptimizedPreview();
    });

    // Watermark Event Listeners
    addWatermarkCheckbox.addEventListener('change', () => {
        if (watermarkOptions) {
            watermarkOptions.style.display = addWatermarkCheckbox.checked ? 'block' : 'none';
        }
        updateOptimizedPreview();
    });
    
    if (watermarkText) {
        watermarkText.addEventListener('input', updateOptimizedPreview);
    }
    
    if (watermarkOpacity) {
        watermarkOpacity.addEventListener('input', () => {
            if (opacityValueSpan) {
                opacityValueSpan.textContent = `${watermarkOpacity.value}%`;
            }
            updateOptimizedPreview();
        });
    }
      if (watermarkPosition) {
        watermarkPosition.addEventListener('change', updateOptimizedPreview);
    }

    // Rotation and Flip Event Listeners
    if (rotateLeftBtn) {
        rotateLeftBtn.addEventListener('click', () => {
            currentRotation = (currentRotation - 90 + 360) % 360;
            updateOptimizedPreview();
        });
    }
    
    if (rotateRightBtn) {
        rotateRightBtn.addEventListener('click', () => {
            currentRotation = (currentRotation + 90) % 360;
            updateOptimizedPreview();
        });
    }
    
    if (flipHBtn) {
        flipHBtn.addEventListener('click', () => {
            currentFlipH = !currentFlipH;
            updateOptimizedPreview();
        });
    }
      if (flipVBtn) {
        flipVBtn.addEventListener('click', () => {
            currentFlipV = !currentFlipV;
            updateOptimizedPreview();
        });
    }    // Main optimization function
    optimizeBtn.addEventListener('click', async () => {
        if (!originalImage) {
            alert('Please upload an image first.');
            return;
        }
        
        // Additional validation for target file size
        if (targetSizeToggle.checked) {
            const targetBytes = updateTargetFileSizeBytes();
            if (targetBytes <= 0) {
                alert('Please enter a valid target file size.');
                return;
            }
            
            // Check if target size is unreasonably small compared to original
            if (targetBytes < originalFileSize * 0.01) {
                // Target is less than 1% of original size - warn the user
                if (!confirm('The target size is less than 1% of the original size. This may result in very low quality. Continue?')) {
                    return;
                }
            }
        }
        
        optimizeBtn.textContent = 'Optimizing...';
        optimizeBtn.disabled = true;
        
        try {
            // Ensure we have a valid optimized image blob
            await renderOptimizedPreview(true); // Render final preview for download
            
            // Only proceed if we have a valid optimized image blob
            if (optimizedImageBlob) {
                downloadArea.style.display = 'block';
                settingsArea.style.display = 'none';
    
                finalOriginalSize.textContent = formatBytes(originalFileSize);
                finalOptimizedSize.textContent = formatBytes(optimizedImageBlob.size);
                const reduction = ((originalFileSize - optimizedImageBlob.size) / originalFileSize * 100).toFixed(2);
                sizeReduction.textContent = `${reduction}%`;

            // Clear previous format buttons
            formatButtons.innerHTML = '';            // Add download button for original optimized format with enhanced styling
            const originalFormatBtn = document.createElement('button');
            originalFormatBtn.className = 'format-btn';
            
            // Get format type for display
            const formatType = originalFileType.split('/')[1].toUpperCase();
            
            // Create format icon based on file type
            const formatIcon = document.createElement('i');
            if (formatType === 'JPEG' || formatType === 'JPG') {
                formatIcon.className = 'fas fa-file-image';
            } else if (formatType === 'PNG') {
                formatIcon.className = 'fas fa-file-image';
            } else if (formatType === 'WEBP') {
                formatIcon.className = 'fas fa-image';
            } else {
                formatIcon.className = 'fas fa-file';
            }
            
            // Create format name text
            const formatText = document.createElement('div');
            formatText.textContent = formatType;
            
            // Create format description
            const formatDesc = document.createElement('span');
            formatDesc.textContent = 'Original Format';
            
            originalFormatBtn.appendChild(formatIcon);
            originalFormatBtn.appendChild(formatText);
            originalFormatBtn.appendChild(formatDesc);
            
            originalFormatBtn.onclick = () => downloadImage(optimizedImageBlob, originalFileName);
            formatButtons.appendChild(originalFormatBtn);

            // Add conversion options if applicable
            if (originalFileType !== 'image/png') {
                const pngBlob = await convertImageFormat(optimizedImageBlob, 'image/png');
                if (pngBlob) {                const pngBtn = document.createElement('button');
                    pngBtn.className = 'format-btn';
                    
                    // Create format icon for PNG
                    const pngIcon = document.createElement('i');
                    pngIcon.className = 'fas fa-file-image';
                    
                    // Create format name text
                    const pngText = document.createElement('div');
                    pngText.textContent = 'PNG';
                    
                    // Create format description
                    const pngDesc = document.createElement('span');
                    pngDesc.textContent = 'Lossless Quality';
                    
                    pngBtn.appendChild(pngIcon);
                    pngBtn.appendChild(pngText);
                    pngBtn.appendChild(pngDesc);
                    
                    pngBtn.onclick = () => downloadImage(pngBlob, originalFileName.replace(/\.[^/.]+$/, ".png"));
                    formatButtons.appendChild(pngBtn);
                }
            }
            if (originalFileType !== 'image/jpeg') {
                const jpgBlob = await convertImageFormat(optimizedImageBlob, 'image/jpeg');
                if (jpgBlob) {
                    const jpgBtn = document.createElement('button');
                    jpgBtn.className = 'secondary-button';
                    jpgBtn.textContent = 'Download as JPG';
                    jpgBtn.onclick = () => downloadImage(jpgBlob, originalFileName.replace(/\.[^/.]+$/, ".jpg"));
                    formatButtons.appendChild(jpgBtn);
                }
            }
            // WebP conversion (requires browser support)
            if (originalFileType !== 'image/webp' && typeof ImageBitmap !== 'undefined') {
                try {
                    const webpBlob = await convertImageFormat(optimizedImageBlob, 'image/webp');
                    if (webpBlob) {
                        const webpBtn = document.createElement('button');
                        webpBtn.className = 'secondary-button';
                        webpBtn.textContent = 'Download as WebP';
                        webpBtn.onclick = () => downloadImage(webpBlob, originalFileName.replace(/\.[^/.]+$/, ".webp"));
                        formatButtons.appendChild(webpBtn);
                    }
                } catch (e) {
                    console.warn('WebP conversion not supported or failed:', e);
                }
            }        } else {
            alert('Failed to optimize image.');
        }
        } catch (error) {
            console.error("Error during optimization:", error);
            alert('An error occurred during optimization. Please try again.');
        } finally {
            optimizeBtn.textContent = 'Optimize Image';
            optimizeBtn.disabled = false;
        }
    });    async function updateOptimizedPreview() {
        if (!originalImage) return;

        // Debounce for rapid input changes
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            renderOptimizedPreview(false); // Render preview, not for final download
        }, 100);
        
        // Update visual cues for target size if enabled
        if (targetSizeToggle && targetSizeToggle.checked && optimizedInfo) {
            const targetBytes = updateTargetFileSizeBytes();
            if (targetBytes > 0) {
                const originalSizeMsg = formatBytes(originalFileSize);
                const targetSizeMsg = formatBytes(targetBytes);
                optimizedInfo.textContent = `Target size: ${targetSizeMsg} (Original: ${originalSizeMsg})`;
            }
        }
    }
    
    async function renderOptimizedPreview(forDownload = false) {
        if (!originalImage) return new Promise(resolve => resolve());

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        let targetWidth = parseInt(widthInput.value) || originalImage.width;
        let targetHeight = parseInt(heightInput.value) || originalImage.height;
        const quality = parseInt(qualitySlider.value) / 100;

        // Set canvas dimensions
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Save context for transformations
        ctx.save();

        // Apply transformations (rotation and flip)
        ctx.translate(canvas.width / 2, canvas.height / 2);
        
        if (currentRotation !== 0) {
            ctx.rotate((currentRotation * Math.PI) / 180);
        }
        
        if (currentFlipH) ctx.scale(-1, 1);
        if (currentFlipV) ctx.scale(1, -1);

        // Draw the image centered
        const drawWidth = currentRotation === 90 || currentRotation === 270 ? targetHeight : targetWidth;
        const drawHeight = currentRotation === 90 || currentRotation === 270 ? targetWidth : targetHeight;
        
        ctx.drawImage(originalImage, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);

        // Restore context
        ctx.restore();

        // Apply filters (brightness, contrast, saturation)
        const brightness = parseInt(brightnessSlider.value);
        const contrast = parseInt(contrastSlider.value);
        const saturation = parseInt(saturationSlider.value);
        const blur = parseFloat(blurSlider.value);

        if (brightness !== 100 || contrast !== 100 || saturation !== 100) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                let r = data[i];
                let g = data[i + 1];
                let b = data[i + 2];

                // Brightness
                r = r * (brightness / 100);
                g = g * (brightness / 100);
                b = b * (brightness / 100);

                // Contrast
                r = ((r - 128) * (contrast / 100)) + 128;
                g = ((g - 128) * (contrast / 100)) + 128;
                b = ((b - 128) * (contrast / 100)) + 128;

                // Saturation
                const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                r = gray * (1 - (saturation / 100)) + r * (saturation / 100);
                g = gray * (1 - (saturation / 100)) + g * (saturation / 100);
                b = gray * (1 - (saturation / 100)) + b * (saturation / 100);

                data[i] = Math.min(255, Math.max(0, r));
                data[i + 1] = Math.min(255, Math.max(0, g));
                data[i + 2] = Math.min(255, Math.max(0, b));
            }
            ctx.putImageData(imageData, 0, 0);
        }

        // Add Watermark
        if (addWatermarkCheckbox && addWatermarkCheckbox.checked && watermarkText && watermarkText.value.trim() !== '') {
            ctx.globalAlpha = parseInt(watermarkOpacity.value) / 100;
            ctx.font = `${canvas.width * 0.04}px Arial`;
            ctx.fillStyle = 'white';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';

            const text = watermarkText.value.trim();
            const metrics = ctx.measureText(text);
            const textWidth = metrics.width;
            const textHeight = parseInt(ctx.font) * 1.2;

            let x, y;
            const padding = canvas.width * 0.02;

            switch (watermarkPosition ? watermarkPosition.value : 'bottom-right') {
                case 'top-left':
                    x = padding;
                    y = padding;
                    break;
                case 'top-right':
                    x = canvas.width - textWidth - padding;
                    y = padding;
                    break;
                case 'bottom-left':
                    x = padding;
                    y = canvas.height - textHeight - padding;
                    break;
                case 'bottom-right':
                    x = canvas.width - textWidth - padding;
                    y = canvas.height - textHeight - padding;
                    break;
                case 'center':
                    x = (canvas.width - textWidth) / 2;
                    y = (canvas.height - textHeight) / 2;
                    break;
            }
            ctx.fillText(text, x, y);
            ctx.globalAlpha = 1;
        }
        
        // Convert to blob and update preview - wrapped in a Promise
        return new Promise(async (resolve) => {
            let finalQuality = quality;
            
            // If target file size is enabled, apply it (for both preview and download)
            if (targetSizeToggle.checked) {
                const targetBytes = updateTargetFileSizeBytes();
                if (targetBytes > 0) {
                    // Update UI for download process
                    if (forDownload && optimizeBtn) {
                        optimizeBtn.textContent = 'Optimizing for target size...';
                    }
                    
                    // Show UI feedback about target size
                    const originalSizeMsg = formatBytes(originalFileSize);
                    const targetSizeMsg = formatBytes(targetBytes);
                    if (optimizedInfo) {
                        optimizedInfo.textContent = `Targeting: ${targetSizeMsg} (from ${originalSizeMsg})`;
                    }
                    
                    // Start with current quality and adjust iteratively
                    let currentQuality = quality;
                    let attempts = 0;
                    const maxAttempts = 10;
                    let achieved = false;
                    
                    // Initial test to see if we already meet the target
                    await new Promise(innerResolve => {
                        canvas.toBlob((testBlob) => {
                            if (testBlob && testBlob.size <= targetBytes) {
                                // We already meet the target with current quality
                                finalQuality = currentQuality;
                                achieved = true;
                            }
                            innerResolve();
                        }, originalFileType, currentQuality);
                    });
                    
                    // Only iterate if we haven't achieved the target yet
                    if (!achieved) {
                        while (attempts < maxAttempts) {
                            attempts++;
                            
                            await new Promise(innerResolve => {
                                canvas.toBlob((testBlob) => {
                                    if (testBlob) {
                                        if (testBlob.size <= targetBytes) {
                                            // Target achieved
                                            finalQuality = currentQuality;
                                            achieved = true;
                                            innerResolve();
                                        } else if (currentQuality <= 0.1) {
                                            // Reached minimum quality, can't compress further
                                            finalQuality = 0.1;
                                            innerResolve();
                                        } else {
                                            // File too large, calculate better quality estimate
                                            const ratio = targetBytes / testBlob.size;
                                            // More aggressive adjustment for larger files
                                            const adjustmentFactor = testBlob.size > targetBytes * 2 ? 0.8 : 0.9;
                                            currentQuality = Math.max(0.1, currentQuality * ratio * adjustmentFactor);
                                            innerResolve();
                                        }
                                    } else {
                                        innerResolve();
                                    }
                                }, originalFileType, currentQuality);
                            });
                            
                            if (achieved) break;
                        }
                        
                        console.log(`Target size optimization complete after ${attempts} attempts. Final quality: ${finalQuality}`);
                    }
                }
            }
            
            canvas.toBlob((blob) => {
                if (blob) {
                    if (forDownload) {
                        optimizedImageBlob = blob;
                        resolve(blob); // Resolve with the blob
                    } else {
                // Clean up previous URL if it exists
                        if (optimizedPreview.src && optimizedPreview.src.startsWith('blob:')) {
                            URL.revokeObjectURL(optimizedPreview.src);
                        }
                        
                        const url = URL.createObjectURL(blob);
                        optimizedPreview.src = url;
                        
                        // Update info display with dimensions and size
                        if (targetSizeToggle && targetSizeToggle.checked) {
                            const targetBytes = updateTargetFileSizeBytes();
                            optimizedInfo.textContent = `Dimensions: ${canvas.width}x${canvas.height}, Size: ${formatBytes(blob.size)}`;
                            if (targetBytes > 0) {
                                // Add target size info
                                optimizedInfo.textContent += ` (Target: ${formatBytes(targetBytes)})`;
                                
                                // Add visual indicator if target size is achieved
                                if (blob.size <= targetBytes) {
                                    optimizedInfo.innerHTML += ' <span style="color:var(--success-color)"><i class="fas fa-check"></i> Target size achieved</span>';
                                } else {
                                    optimizedInfo.innerHTML += ' <span style="color:var(--warning-color)"><i class="fas fa-exclamation-triangle"></i> Trying to meet target</span>';
                                }
                            }
                        } else {
                            optimizedInfo.textContent = `Dimensions: ${canvas.width}x${canvas.height}, Size: ${formatBytes(blob.size)}`;
                        }
                        
                        // Apply blur filter to preview if needed (not to actual canvas)
                        if (blur > 0) {
                            optimizedPreview.style.filter = `blur(${blur}px)`;
                        } else {
                            optimizedPreview.style.filter = 'none';
                        }
                        resolve(blob); // Resolve with the blob for non-download preview too
                    }
                } else {
                    resolve(null); // Resolve with null if blob creation failed
                }
            }, originalFileType, finalQuality);
        });
    }

    async function convertImageFormat(blob, newMimeType) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                canvas.toBlob(resolve, newMimeType);
            };
            img.src = URL.createObjectURL(blob);
        });
    }

    const downloadImage = (blob, fileName) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    // Set up the main download button to use the original format
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            if (optimizedImageBlob) {
                downloadImage(optimizedImageBlob, originalFileName);
            }
        });
    }

    startOverBtn.addEventListener('click', () => {
        resetTool();
    });

    function resetTool() {
        originalImage = null;
        originalFileName = '';
        originalFileType = '';
        originalFileSize = 0;
        optimizedImageBlob = null;
        currentRotation = 0;
        currentFlipH = false;
        currentFlipV = false;

        // Reset UI elements
        uploadArea.style.display = 'flex';
        settingsArea.style.display = 'none';
        downloadArea.style.display = 'none';

        originalPreview.src = '#';
        optimizedPreview.src = '#';
        originalInfo.textContent = '';
        optimizedInfo.textContent = '';

        widthInput.value = '';
        heightInput.value = '';
        maintainAspectCheckbox.checked = true;

        qualitySlider.value = 80;
        qualityValueSpan.textContent = '80%';
        removeMetadataCheckbox.checked = true;

        targetSizeToggle.checked = false;
        targetSizeControls.style.display = 'none';
        targetSizeValue.value = 100;
        targetSizeUnit.value = 'kb';

        brightnessSlider.value = 100;
        brightnessValueSpan.textContent = '100%';
        contrastSlider.value = 100;
        contrastValueSpan.textContent = '100%';
        saturationSlider.value = 100;
        saturationValueSpan.textContent = '100%';
        blurSlider.value = 0;
        blurValueSpan.textContent = '0px';
        optimizedPreview.style.filter = 'none'; // Clear CSS filter

        addWatermarkCheckbox.checked = false;
        watermarkOptions.style.display = 'none';
        watermarkText.value = '';
        watermarkOpacity.value = 50;
        opacityValueSpan.textContent = '50%';
        watermarkPosition.value = 'bottom-right';

        optimizeBtn.textContent = 'Optimize Image';
        optimizeBtn.disabled = false;

        // Revoke any lingering object URLs
        if (optimizedPreview.dataset.previousUrl) {
            URL.revokeObjectURL(optimizedPreview.dataset.previousUrl);
            delete optimizedPreview.dataset.previousUrl;
        }
    }

    // Initial call to reset tool state
    resetTool();
});

document.addEventListener('DOMContentLoaded', () => {
    // Function to enhance the format buttons
    function enhanceWebPButton() {
        const webpBtns = document.querySelectorAll('.format-buttons .secondary-button');
        
        webpBtns.forEach(btn => {
            if (btn.textContent.includes('WebP')) {
                btn.className = 'format-btn';
                
                // Get the onclick handler
                const onClickHandler = btn.onclick;
                
                // Clear the button contents
                btn.textContent = '';
                
                // Create format icon for WebP
                const webpIcon = document.createElement('i');
                webpIcon.className = 'fas fa-compress';
                
                // Create format name text
                const webpText = document.createElement('div');
                webpText.textContent = 'WebP';
                
                // Create format description
                const webpDesc = document.createElement('span');
                webpDesc.textContent = 'Modern Format';
                
                btn.appendChild(webpIcon);
                btn.appendChild(webpText);
                btn.appendChild(webpDesc);
                
                // Restore onclick handler
                btn.onclick = onClickHandler;
            }
            else if (btn.textContent.includes('JPG')) {
                btn.className = 'format-btn';
                
                // Get the onclick handler
                const onClickHandler = btn.onclick;
                
                // Clear the button contents
                btn.textContent = '';
                
                // Create format icon for JPG
                const jpgIcon = document.createElement('i');
                jpgIcon.className = 'fas fa-file-image';
                
                // Create format name text
                const jpgText = document.createElement('div');
                jpgText.textContent = 'JPG';
                
                // Create format description
                const jpgDesc = document.createElement('span');
                jpgDesc.textContent = 'Common Format';
                
                btn.appendChild(jpgIcon);
                btn.appendChild(jpgText);
                btn.appendChild(jpgDesc);
                
                // Restore onclick handler
                btn.onclick = onClickHandler;
            }
        });
    }
    
    // Observe the format buttons container for changes
    const formatButtonsContainer = document.getElementById('format-buttons');
    if (formatButtonsContainer) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    enhanceWebPButton();
                }
            });
        });
        
        observer.observe(formatButtonsContainer, { childList: true });
    }
});

// Theme toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        // Check for saved theme preference or use system preference
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else if (savedTheme === 'dark') {
            document.body.classList.remove('light-theme');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            // Use system preference if no saved preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
                document.body.classList.add('light-theme');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                document.body.classList.remove('light-theme');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        }
        
        // Toggle theme on click
        themeToggle.addEventListener('click', () => {
            if (document.body.classList.contains('light-theme')) {
                // Switch to dark theme
                document.body.classList.remove('light-theme');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                localStorage.setItem('theme', 'dark');
            } else {
                // Switch to light theme
                document.body.classList.add('light-theme');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem('theme', 'light');
            }
        });
    }
});
// Add Font Awesome icons dynamically
