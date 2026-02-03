// Advanced QR Code Generator with Multiple Formats
// Enhanced with batch downloads, multiple formats, and improved UI

class AdvancedQRCodeGenerator {
    constructor() {
        this.qrCodeInstance = null;
        this.downloadFormats = ['png', 'jpeg', 'svg', 'pdf', 'webp'];
        this.initializeElements();
        this.bindEvents();
        this.initializeTheme();
        this.setupRangeInputs();
        this.initializeAdvancedFeatures();
    }

    initializeElements() {
        // Input elements
        this.qrTypeSelect = document.getElementById('qr-type');
        this.qrTextArea = document.getElementById('qr-text');
        this.generateBtn = document.getElementById('generate-btn');
        
        // Dynamic input fields
        this.textInputGroup = document.getElementById('text-input-group');
        this.emailFields = document.getElementById('email-fields');
        this.phoneFields = document.getElementById('phone-fields');
        this.smsFields = document.getElementById('sms-fields');
        this.wifiFields = document.getElementById('wifi-fields');
        this.vcardFields = document.getElementById('vcard-fields');
        this.locationFields = document.getElementById('location-fields');
        this.eventFields = document.getElementById('event-fields');
        this.cryptoFields = document.getElementById('crypto-fields');
        
        // All dynamic field groups
        this.dynamicFields = [
            this.emailFields, this.phoneFields, this.smsFields, this.wifiFields,
            this.vcardFields, this.locationFields, this.eventFields, this.cryptoFields
        ];
        
        // Input field elements
        this.initializeInputFields();
        
        // Customization options
        this.qrSize = document.getElementById('qr-size');
        this.errorLevel = document.getElementById('error-level');
        this.qrStyle = document.getElementById('qr-style');
        this.cornerStyle = document.getElementById('corner-style');
        this.cornerDotStyle = document.getElementById('corner-dot-style');
        this.margin = document.getElementById('margin');
        this.marginValue = document.getElementById('margin-value');
        this.gradientType = document.getElementById('gradient-type');
        this.fgColor = document.getElementById('fg-color');
        this.bgColor = document.getElementById('bg-color');
        this.gradientColor2 = document.getElementById('gradient-color2');
        this.transparentBg = document.getElementById('transparent-bg');
        this.gradientColors = document.getElementById('gradient-colors');
        
        // Download elements
        this.downloadSection = document.getElementById('download-section');
        this.downloadSize = document.getElementById('download-size');
        this.imageQuality = document.getElementById('image-quality');
        this.qualityValue = document.getElementById('quality-value');
        
        // Download buttons
        this.downloadPngBtn = document.getElementById('download-png-btn');
        this.downloadJpgBtn = document.getElementById('download-jpg-btn');
        this.downloadSvgBtn = document.getElementById('download-svg-btn');
        this.downloadPdfBtn = document.getElementById('download-pdf-btn');
        this.downloadWebpBtn = document.getElementById('download-webp-btn');
        this.downloadBatchBtn = document.getElementById('download-batch-btn');
        
        // Display elements
        this.qrPlaceholder = document.getElementById('qr-placeholder');
        this.qrCodeDiv = document.getElementById('qrcode');
        this.qrInfoText = document.getElementById('qr-info-text');
        
        // Navigation and modal
        this.themeToggle = document.querySelector('.modern-toggle');
        this.infoBtn = document.getElementById('info-btn');
        this.infoModal = document.getElementById('info-modal');
        this.closeModal = document.getElementById('close-modal');
        this.modalBackdrop = document.querySelector('.modal-backdrop');
    }

    initializeInputFields() {
        // Email fields
        this.emailRecipient = document.getElementById('email-recipient');
        this.emailSubject = document.getElementById('email-subject');
        this.emailBody = document.getElementById('email-body');
        
        // Phone field
        this.phoneNumber = document.getElementById('phone-number');
        
        // SMS fields
        this.smsNumber = document.getElementById('sms-number');
        this.smsMessage = document.getElementById('sms-message');
        
        // WiFi fields
        this.wifiSsid = document.getElementById('wifi-ssid');
        this.wifiSecurity = document.getElementById('wifi-security');
        this.wifiPassword = document.getElementById('wifi-password');
        this.wifiHidden = document.getElementById('wifi-hidden');
        
        // vCard fields
        this.vcardFirstname = document.getElementById('vcard-firstname');
        this.vcardLastname = document.getElementById('vcard-lastname');
        this.vcardPhone = document.getElementById('vcard-phone');
        this.vcardEmail = document.getElementById('vcard-email');
        this.vcardOrganization = document.getElementById('vcard-organization');
        this.vcardTitle = document.getElementById('vcard-title');
        this.vcardUrl = document.getElementById('vcard-url');
        
        // Location fields
        this.locationLatitude = document.getElementById('location-latitude');
        this.locationLongitude = document.getElementById('location-longitude');
        this.locationName = document.getElementById('location-name');
        
        // Event fields
        this.eventTitle = document.getElementById('event-title');
        this.eventLocation = document.getElementById('event-location');
        this.eventStart = document.getElementById('event-start');
        this.eventEnd = document.getElementById('event-end');
        this.eventDescription = document.getElementById('event-description');
        
        // Crypto fields
        this.cryptoType = document.getElementById('crypto-type');
        this.cryptoAddress = document.getElementById('crypto-address');
        this.cryptoAmount = document.getElementById('crypto-amount');
        this.cryptoLabel = document.getElementById('crypto-label');
    }

    bindEvents() {
        // QR type change event
        this.qrTypeSelect.addEventListener('change', () => this.handleTypeChange());
        
        // Generate button click
        this.generateBtn.addEventListener('click', () => this.generateQRCode());
        
        // Download button clicks
        if (this.downloadPngBtn) this.downloadPngBtn.addEventListener('click', () => this.downloadQRCode('png'));
        if (this.downloadJpgBtn) this.downloadJpgBtn.addEventListener('click', () => this.downloadQRCode('jpeg'));
        if (this.downloadSvgBtn) this.downloadSvgBtn.addEventListener('click', () => this.downloadQRCode('svg'));
        if (this.downloadPdfBtn) this.downloadPdfBtn.addEventListener('click', () => this.downloadQRCode('pdf'));
        if (this.downloadWebpBtn) this.downloadWebpBtn.addEventListener('click', () => this.downloadQRCode('webp'));
        if (this.downloadBatchBtn) this.downloadBatchBtn.addEventListener('click', () => this.downloadBatch());
        
        // Theme toggle
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Modal events
        if (this.infoBtn) {
            this.infoBtn.addEventListener('click', () => this.showModal());
        }
        if (this.closeModal) {
            this.closeModal.addEventListener('click', () => this.hideModal());
        }
        if (this.modalBackdrop) {
            this.modalBackdrop.addEventListener('click', () => this.hideModal());
        }
          // Transparent background toggle
        this.transparentBg.addEventListener('change', () => this.handleTransparentBgChange());
        
        // Gradient type change
        this.gradientType.addEventListener('change', () => this.handleGradientTypeChange());
        
        // Real-time validation
        this.bindValidationEvents();
        
        // Keyboard shortcuts
        this.bindKeyboardShortcuts();
    }

    setupRangeInputs() {
        // Margin range
        if (this.margin) {
            this.margin.addEventListener('input', (e) => {
                if (this.marginValue) {
                    this.marginValue.textContent = `${e.target.value}px`;
                }
            });
        }
        
        // Quality range
        if (this.imageQuality) {
            this.imageQuality.addEventListener('input', (e) => {
                if (this.qualityValue) {
                    this.qualityValue.textContent = `${e.target.value}%`;
                }
            });
        }
    }

    bindValidationEvents() {
        const allInputs = [
            this.qrTextArea, this.emailRecipient, this.emailSubject, this.emailBody,
            this.phoneNumber, this.smsNumber, this.smsMessage, this.wifiSsid,
            this.vcardFirstname, this.vcardLastname, this.locationLatitude,
            this.eventTitle, this.cryptoAddress
        ];
        
        allInputs.forEach(input => {
            if (input) {
                input.addEventListener('input', () => this.validateInputs());
            }
        });
    }

    bindKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter to generate QR code
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                if (!this.generateBtn.disabled) {
                    this.generateBtn.click();
                }
            }
            
            // Ctrl/Cmd + S to download PNG
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                if (!this.downloadSection.classList.contains('hidden')) {
                    this.downloadQRCode('png');
                }
            }
            
            // Escape to close modal
            if (e.key === 'Escape') {
                this.hideModal();
            }
        });
    }

    handleTypeChange() {
        const selectedType = this.qrTypeSelect.value;
        
        // Hide all dynamic fields
        this.hideAllDynamicFields();
        
        // Show relevant fields based on type
        switch (selectedType) {
            case 'text':
            case 'url':
                this.textInputGroup.classList.remove('hidden');
                this.updatePlaceholder(selectedType);
                break;
            case 'email':
                if (this.emailFields) this.emailFields.classList.remove('hidden');
                this.textInputGroup.classList.add('hidden');
                break;
            case 'phone':
                if (this.phoneFields) this.phoneFields.classList.remove('hidden');
                this.textInputGroup.classList.add('hidden');
                break;
            case 'sms':
                if (this.smsFields) this.smsFields.classList.remove('hidden');
                this.textInputGroup.classList.add('hidden');
                break;
            case 'wifi':
                if (this.wifiFields) this.wifiFields.classList.remove('hidden');
                this.textInputGroup.classList.add('hidden');
                break;
            case 'vcard':
                if (this.vcardFields) this.vcardFields.classList.remove('hidden');
                this.textInputGroup.classList.add('hidden');
                break;
            case 'location':
                if (this.locationFields) this.locationFields.classList.remove('hidden');
                this.textInputGroup.classList.add('hidden');
                break;
            case 'event':
                if (this.eventFields) this.eventFields.classList.remove('hidden');
                this.textInputGroup.classList.add('hidden');
                break;
            case 'crypto':
                if (this.cryptoFields) this.cryptoFields.classList.remove('hidden');
                this.textInputGroup.classList.add('hidden');
                break;
        }
        
        this.validateInputs();
    }

    hideAllDynamicFields() {
        this.dynamicFields.forEach(field => {
            if (field) field.classList.add('hidden');
        });
    }

    updatePlaceholder(type) {
        const placeholders = {
            text: 'Enter your text here...',
            url: 'https://example.com'
        };
        
        if (this.qrTextArea) {
            this.qrTextArea.placeholder = placeholders[type] || 'Enter your content here...';
        }
    }

    validateInputs() {
        const selectedType = this.qrTypeSelect.value;
        let isValid = false;
        
        switch (selectedType) {
            case 'text':
            case 'url':
                isValid = this.qrTextArea && this.qrTextArea.value.trim().length > 0;
                break;
            case 'email':
                isValid = this.emailRecipient && this.emailRecipient.value.trim().length > 0;
                break;
            case 'phone':
                isValid = this.phoneNumber && this.phoneNumber.value.trim().length > 0;
                break;
            case 'sms':
                isValid = this.smsNumber && this.smsNumber.value.trim().length > 0;
                break;
            case 'wifi':
                isValid = this.wifiSsid && this.wifiSsid.value.trim().length > 0;
                break;
            case 'vcard':
                isValid = (this.vcardFirstname && this.vcardFirstname.value.trim().length > 0) || 
                         (this.vcardLastname && this.vcardLastname.value.trim().length > 0);
                break;
            case 'location':
                isValid = (this.locationLatitude && this.locationLatitude.value.trim().length > 0) && 
                         (this.locationLongitude && this.locationLongitude.value.trim().length > 0);
                break;
            case 'event':
                isValid = this.eventTitle && this.eventTitle.value.trim().length > 0;
                break;
            case 'crypto':
                isValid = this.cryptoAddress && this.cryptoAddress.value.trim().length > 0;
                break;
        }
          if (this.generateBtn) {
            this.generateBtn.disabled = !isValid;
            this.generateBtn.style.opacity = isValid ? '1' : '0.6';
            this.generateBtn.style.cursor = isValid ? 'pointer' : 'not-allowed';
        }
    }

    handleGradientTypeChange() {
        const gradientType = this.gradientType.value;
        
        if (gradientType === 'none') {
            if (this.gradientColors) this.gradientColors.classList.add('hidden');
        } else {
            if (this.gradientColors) this.gradientColors.classList.remove('hidden');
        }
    }

    handleTransparentBgChange() {
        this.updateCanvasBackground();
        // Regenerate QR code if it exists
        if (this.qrCodeInstance) {
            this.generateQRCode();
        }
    }

    generateQRCode() {
        const qrData = this.getQRData();
        
        if (!qrData) {
            this.showError('Please fill in all required fields');
            return;
        }
        
        // Show loading state
        this.setLoadingState(true);
        
        // Clear previous QR code
        this.qrCodeDiv.innerHTML = '';
        
        // Hide placeholder, show QR code area
        this.qrPlaceholder.style.display = 'none';
        this.qrCodeDiv.style.display = 'block';
        
        // Get customization options
        const options = this.getAdvancedQROptions(qrData);
        
        try {
            // Generate QR code using QRCodeStyling library
            this.qrCodeInstance = new QRCodeStyling(options);
            
            this.qrCodeInstance.append(this.qrCodeDiv);
            
            // Add generated animation
            setTimeout(() => {
                this.qrCodeDiv.classList.add('generated');
                this.showDownloadSection();
                this.updateQRInfo(qrData);
                this.setLoadingState(false);
            }, 300);
              } catch (error) {
            console.error('QR Code generation error:', error);
            this.showError('Failed to generate QR code. Please try again.');
            this.setLoadingState(false);
        }
    }

    getAdvancedQROptions(data) {
        const size = parseInt(this.qrSize.value);
        const errorLevel = this.errorLevel.value;
        const qrStyle = this.qrStyle.value;
        const cornerStyle = this.cornerStyle.value;
        const cornerDotStyle = this.cornerDotStyle.value;
        const margin = this.margin ? parseInt(this.margin.value) : 10;
        const gradientType = this.gradientType.value;
        const foregroundColor = this.fgColor.value;
        const backgroundColor = this.transparentBg.checked ? 'transparent' : this.bgColor.value;
        const gradientColor2 = this.gradientColor2.value;
        
        // Update canvas background based on transparent setting
        this.updateCanvasBackground();
        
        let dotsOptions = {
            color: foregroundColor,
            type: qrStyle
        };
        
        // Apply gradient if selected
        if (gradientType !== 'none') {
            dotsOptions.gradient = {
                type: gradientType,
                rotation: gradientType === 'linear' ? 45 : 0,
                colorStops: [
                    { offset: 0, color: foregroundColor },
                    { offset: 1, color: gradientColor2 }
                ]
            };
        }
        
        const options = {
            width: size,
            height: size,
            type: "svg",
            data: data,
            margin: margin,
            dotsOptions: dotsOptions,
            cornersSquareOptions: {
                color: foregroundColor,
                type: cornerStyle,
            },
            cornersDotOptions: {
                color: foregroundColor,
                type: cornerDotStyle,
            },
            backgroundOptions: {
                color: backgroundColor,
            },
            qrOptions: {
                errorCorrectionLevel: errorLevel
            }
        };
        
        return options;
    }

    updateCanvasBackground() {
        const qrCanvas = document.querySelector('.modern-qr-canvas');
        if (qrCanvas) {
            if (this.transparentBg && this.transparentBg.checked) {
                qrCanvas.classList.add('transparent-bg');
                qrCanvas.style.setProperty('--canvas-bg', 'transparent');
            } else {
                qrCanvas.classList.remove('transparent-bg');
                const bgColor = this.bgColor ? this.bgColor.value : '#ffffff';
                qrCanvas.style.setProperty('--canvas-bg', bgColor);
            }
        }
    }

    getQRData() {
        const selectedType = this.qrTypeSelect.value;
        
        switch (selectedType) {
            case 'text':
            case 'url':
                return this.qrTextArea ? this.qrTextArea.value.trim() : null;
                
            case 'email':
                return this.generateEmailData();
                
            case 'phone':
                const phone = this.phoneNumber ? this.phoneNumber.value.trim() : '';
                return phone ? `tel:${phone}` : null;
                
            case 'sms':
                return this.generateSMSData();
                
            case 'wifi':
                return this.generateWiFiData();
                
            case 'vcard':
                return this.generateVCardData();
                
            case 'location':
                return this.generateLocationData();
                
            case 'event':
                return this.generateEventData();
                
            case 'crypto':
                return this.generateCryptoData();
                
            default:
                return null;
        }
    }

    generateEmailData() {
        if (!this.emailRecipient) return null;
        
        const recipient = this.emailRecipient.value.trim();
        const subject = this.emailSubject ? this.emailSubject.value.trim() : '';
        const body = this.emailBody ? this.emailBody.value.trim() : '';
        
        if (!recipient) return null;
        
        let emailData = `mailto:${recipient}`;
        const params = [];
        
        if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
        if (body) params.push(`body=${encodeURIComponent(body)}`);
        
        if (params.length > 0) {
            emailData += `?${params.join('&')}`;
        }
        
        return emailData;
    }

    generateSMSData() {
        if (!this.smsNumber) return null;
        
        const smsNum = this.smsNumber.value.trim();
        const smsMsg = this.smsMessage ? this.smsMessage.value.trim() : '';
        
        if (!smsNum) return null;
        
        let smsData = `sms:${smsNum}`;
        if (smsMsg) {
            smsData += `?body=${encodeURIComponent(smsMsg)}`;
        }
        
        return smsData;
    }

    generateWiFiData() {
        if (!this.wifiSsid) return null;
        
        const ssid = this.wifiSsid.value.trim();
        const security = this.wifiSecurity ? this.wifiSecurity.value : 'WPA';
        const password = this.wifiPassword ? this.wifiPassword.value.trim() : '';
        const hidden = this.wifiHidden ? this.wifiHidden.checked : false;
        
        if (!ssid) return null;
        
        let wifiData = `WIFI:T:${security};S:${ssid};`;
        
        if (password && security !== 'nopass') {
            wifiData += `P:${password};`;
        }
        
        if (hidden) {
            wifiData += `H:true;`;
        }
        
        wifiData += ';';
        
        return wifiData;
    }

    generateVCardData() {
        const firstName = this.vcardFirstname ? this.vcardFirstname.value.trim() : '';
        const lastName = this.vcardLastname ? this.vcardLastname.value.trim() : '';
        const phone = this.vcardPhone ? this.vcardPhone.value.trim() : '';
        const email = this.vcardEmail ? this.vcardEmail.value.trim() : '';
        const organization = this.vcardOrganization ? this.vcardOrganization.value.trim() : '';
        const title = this.vcardTitle ? this.vcardTitle.value.trim() : '';
        const url = this.vcardUrl ? this.vcardUrl.value.trim() : '';
        
        if (!firstName && !lastName) return null;
        
        let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
        
        if (firstName || lastName) {
            vcard += `FN:${firstName} ${lastName}\n`;
            vcard += `N:${lastName};${firstName};;;\n`;
        }
        
        if (phone) vcard += `TEL:${phone}\n`;
        if (email) vcard += `EMAIL:${email}\n`;
        if (organization) vcard += `ORG:${organization}\n`;
        if (title) vcard += `TITLE:${title}\n`;
        if (url) vcard += `URL:${url}\n`;
        
        vcard += 'END:VCARD';
        
        return vcard;
    }

    generateLocationData() {
        if (!this.locationLatitude || !this.locationLongitude) return null;
        
        const lat = this.locationLatitude.value.trim();
        const lng = this.locationLongitude.value.trim();
        const name = this.locationName ? this.locationName.value.trim() : '';
        
        if (!lat || !lng) return null;
        
        let locationData = `geo:${lat},${lng}`;
        
        if (name) {
            locationData += `?q=${lat},${lng}(${encodeURIComponent(name)})`;
        }
        
        return locationData;
    }

    generateEventData() {
        if (!this.eventTitle) return null;
        
        const title = this.eventTitle.value.trim();
        const location = this.eventLocation ? this.eventLocation.value.trim() : '';
        const start = this.eventStart ? this.eventStart.value : '';
        const end = this.eventEnd ? this.eventEnd.value : '';
        const description = this.eventDescription ? this.eventDescription.value.trim() : '';
        
        if (!title) return null;
        
        const formatDate = (dateStr) => {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        
        let event = 'BEGIN:VEVENT\n';
        event += `SUMMARY:${title}\n`;
        
        if (location) event += `LOCATION:${location}\n`;
        if (start) event += `DTSTART:${formatDate(start)}\n`;
        if (end) event += `DTEND:${formatDate(end)}\n`;
        if (description) event += `DESCRIPTION:${description}\n`;
        
        event += 'END:VEVENT';
        
        return event;
    }

    generateCryptoData() {
        if (!this.cryptoAddress) return null;
        
        const type = this.cryptoType ? this.cryptoType.value : 'bitcoin';
        const address = this.cryptoAddress.value.trim();
        const amount = this.cryptoAmount ? this.cryptoAmount.value.trim() : '';
        const label = this.cryptoLabel ? this.cryptoLabel.value.trim() : '';
        
        if (!address) return null;
        
        const cryptoPrefixes = {
            bitcoin: 'bitcoin:',
            ethereum: 'ethereum:',
            litecoin: 'litecoin:',
            dogecoin: 'dogecoin:',
            other: ''
        };
        
        let cryptoData = `${cryptoPrefixes[type]}${address}`;
        
        const params = [];
        if (amount) params.push(`amount=${amount}`);
        if (label) params.push(`label=${encodeURIComponent(label)}`);
        
        if (params.length > 0) {
            cryptoData += `?${params.join('&')}`;
        }
        
        return cryptoData;
    }    async downloadQRCode(format) {
        if (!this.qrCodeInstance) {
            this.showError('No QR code to download');
            return;
        }
        
        const button = document.querySelector(`[data-format="${format}"]`);
        this.setButtonLoading(button, true);
        
        try {
            const size = this.downloadSize ? parseInt(this.downloadSize.value) : 500;
            const quality = this.imageQuality ? parseInt(this.imageQuality.value) / 100 : 0.9;
            const timestamp = new Date().toISOString().slice(0, 19).replace(/[:]/g, '-');
            const fileName = `qr-code-${timestamp}`;
            
            // Update button text during download
            const originalText = button.querySelector('.btn-title').textContent;
            button.querySelector('.btn-title').textContent = 'Downloading...';
            
            if (format === 'pdf') {
                await this.downloadAsPDF(fileName, size);
            } else if (format === 'webp') {
                await this.downloadAsWebP(fileName, size, quality);
            } else if (format === 'ico') {
                await this.downloadAsICO(fileName, size);
            } else if (format === 'batch') {
                await this.downloadBatch();
                return; // Early return for batch download
            } else {
                // Use QRCodeStyling built-in download
                this.qrCodeInstance.download({
                    name: fileName,
                    extension: format,
                    width: size,
                    height: size
                });
            }
            
            // Restore button text
            setTimeout(() => {
                button.querySelector('.btn-title').textContent = originalText;
            }, 1000);
            
            this.showSuccess(`QR code downloaded as ${format.toUpperCase()} successfully!`);
            
        } catch (error) {
            console.error('Download error:', error);
            this.showError(`Failed to download QR code as ${format.toUpperCase()}`);
            
            // Restore button text on error
            const originalText = button.getAttribute('data-original-text') || 
                               this.getFormatDisplayName(format);
            button.querySelector('.btn-title').textContent = originalText;
        } finally {
            this.setButtonLoading(button, false);
        }
    }

    getFormatDisplayName(format) {
        const formatNames = {
            'png': 'PNG',
            'jpeg': 'JPEG', 
            'svg': 'SVG',
            'pdf': 'PDF',
            'webp': 'WebP',
            'ico': 'ICO',
            'batch': 'All Formats'
        };
        return formatNames[format] || format.toUpperCase();
    }

    async downloadAsPDF(fileName, size) {
        const canvas = await this.getQRCanvas(size);
        const imgData = canvas.toDataURL('image/png');
        
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        
        const imgWidth = 150;
        const imgHeight = 150;
        const x = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
        const y = 30;
        
        pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
        pdf.text('QR Code', x, y - 10);
        pdf.save(`${fileName}.pdf`);
    }

    async downloadAsWebP(fileName, size, quality) {
        const canvas = await this.getQRCanvas(size);
        
        canvas.toBlob((blob) => {
            if (window.saveAs) {
                saveAs(blob, `${fileName}.webp`);
            } else {
                // Fallback download method
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${fileName}.webp`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        }, 'image/webp', quality);
    }

    async downloadAsICO(fileName, size) {
        // ICO format is typically used for favicons
        const canvas = await this.getQRCanvas(Math.min(size, 256)); // ICO max size
        
        canvas.toBlob((blob) => {
            if (window.saveAs) {
                saveAs(blob, `${fileName}.png`); // Save as PNG since ICO support is limited
            } else {
                // Fallback download method
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${fileName}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
        }, 'image/png', 1.0);
    }

    async getQRCanvas(size) {
        return new Promise((resolve) => {
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            document.body.appendChild(tempContainer);
            
            const tempOptions = { ...this.getAdvancedQROptions(this.getQRData()) };
            tempOptions.width = size;
            tempOptions.height = size;
            tempOptions.type = 'canvas';
            
            const tempQR = new QRCodeStyling(tempOptions);
            tempQR.append(tempContainer);
            
            setTimeout(() => {
                const canvas = tempContainer.querySelector('canvas');
                document.body.removeChild(tempContainer);
                resolve(canvas);
            }, 100);
        });
    }

    async downloadBatch() {
        if (!this.qrCodeInstance) {
            this.showError('No QR code to download');
            return;
        }
        
        const button = this.downloadBatchBtn;
        this.setButtonLoading(button, true);
        
        try {
            const size = this.downloadSize ? parseInt(this.downloadSize.value) : 500;
            const quality = this.imageQuality ? parseInt(this.imageQuality.value) / 100 : 0.9;
            const timestamp = new Date().toISOString().slice(0, 19).replace(/[:]/g, '-');
            const baseName = `qr-code-${timestamp}`;
            
            // Create ZIP file
            const zip = new JSZip();
            
            // Update button text
            const originalText = button.querySelector('.btn-title').textContent;
            button.querySelector('.btn-title').textContent = 'Creating ZIP...';
            
            // Add different formats to ZIP
            const formats = [
                { ext: 'png', type: 'image/png', quality: 1.0 },
                { ext: 'jpg', type: 'image/jpeg', quality: quality },
                { ext: 'webp', type: 'image/webp', quality: quality }
            ];
            
            // Generate canvas for raster formats
            for (const format of formats) {
                const canvas = await this.getQRCanvas(size);
                const blob = await new Promise(resolve => {
                    canvas.toBlob(resolve, format.type, format.quality);
                });
                zip.file(`${baseName}.${format.ext}`, blob);
            }
            
            // Add SVG format
            const svgOptions = this.getAdvancedQROptions(this.getQRData());
            svgOptions.type = "svg";
            svgOptions.width = size;
            svgOptions.height = size;
            
            const tempContainer = document.createElement('div');
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            document.body.appendChild(tempContainer);
            
            const tempQR = new QRCodeStyling(svgOptions);
            tempQR.append(tempContainer);
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const svgElement = tempContainer.querySelector('svg');
            if (svgElement) {
                const svgData = new XMLSerializer().serializeToString(svgElement);
                zip.file(`${baseName}.svg`, svgData);
            }
            
            document.body.removeChild(tempContainer);
            
            // Add PDF
            const pdfCanvas = await this.getQRCanvas(size);
            const imgData = pdfCanvas.toDataURL('image/png');
            
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF();
            const imgWidth = 150;
            const imgHeight = 150;
            const x = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;
            const y = 30;
            
            pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
            pdf.text('QR Code', x, y - 10);
            
            const pdfBlob = pdf.output('blob');
            zip.file(`${baseName}.pdf`, pdfBlob);
            
            // Generate and download ZIP
            button.querySelector('.btn-title').textContent = 'Generating ZIP...';
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            
            if (window.saveAs) {
                saveAs(zipBlob, `${baseName}-all-formats.zip`);
            } else {
                // Fallback download method
                const url = URL.createObjectURL(zipBlob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${baseName}-all-formats.zip`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }
            
            // Restore button text
            setTimeout(() => {
                button.querySelector('.btn-title').textContent = originalText;
            }, 1000);
            
            this.showSuccess('All formats downloaded as ZIP successfully!');
            
        } catch (error) {
            console.error('Batch download error:', error);
            this.showError('Failed to create batch download');
            
            // Restore button text on error
            const originalText = button.getAttribute('data-original-text') || 'All Formats';
            button.querySelector('.btn-title').textContent = originalText;
        } finally {
            this.setButtonLoading(button, false);
        }
    }

    setButtonLoading(button, isLoading) {
        if (!button) return;
        
        const btnContent = button.querySelector('.btn-content');
        if (!btnContent) return;
        
        if (isLoading) {
            button.classList.add('btn-loading');
            button.disabled = true;
            
            // Add loading spinner
            if (!btnContent.querySelector('.loading-spinner')) {
                const spinner = document.createElement('div');
                spinner.className = 'loading-spinner';
                spinner.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                btnContent.appendChild(spinner);
            }
        } else {
            button.classList.remove('btn-loading');
            button.disabled = false;
            
            // Remove loading spinner
            const spinner = btnContent.querySelector('.loading-spinner');
            if (spinner) {
                spinner.remove();
            }
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Add close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
    }

    // Enhanced initialization method
    initializeAdvancedFeatures() {
        // Add format descriptions to download buttons
        this.addFormatDescriptions();
        
        // Initialize quality range input
        this.initializeQualityRange();
        
        // Add keyboard shortcuts
        this.addKeyboardShortcuts();
        
        // Initialize background color change listener
        this.initializeBackgroundListener();
    }

    addFormatDescriptions() {
        const formatDescriptions = {
            'png': { title: 'PNG', subtitle: 'High Quality', icon: 'fas fa-image' },
            'jpeg': { title: 'JPEG', subtitle: 'Compressed', icon: 'fas fa-file-image' },
            'svg': { title: 'SVG', subtitle: 'Vector Graphics', icon: 'fas fa-vector-square' },
            'pdf': { title: 'PDF', subtitle: 'Document', icon: 'fas fa-file-pdf' },
            'webp': { title: 'WebP', subtitle: 'Modern Format', icon: 'fas fa-file-code' },
            'ico': { title: 'ICO', subtitle: 'Favicon', icon: 'fas fa-star' },
            'batch': { title: 'All Formats', subtitle: 'ZIP Archive', icon: 'fas fa-download' }
        };

        Object.keys(formatDescriptions).forEach(format => {
            const button = document.querySelector(`[data-format="${format}"]`);
            if (button) {
                const desc = formatDescriptions[format];
                button.setAttribute('data-original-text', desc.title);
                
                // Update button content if not already formatted
                const titleElement = button.querySelector('.btn-title');
                const subtitleElement = button.querySelector('.btn-subtitle');
                const iconElement = button.querySelector('i');
                
                if (titleElement) titleElement.textContent = desc.title;
                if (subtitleElement) subtitleElement.textContent = desc.subtitle;
                if (iconElement && desc.icon) {
                    iconElement.className = desc.icon;
                }
            }
        });
    }

    initializeQualityRange() {
        const qualityInput = this.imageQuality;
        const qualityValue = document.getElementById('quality-value');
        
        if (qualityInput && qualityValue) {
            qualityInput.addEventListener('input', () => {
                qualityValue.textContent = `${qualityInput.value}%`;
            });
        }
    }

    addKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Enter to generate QR code
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                if (this.generateBtn && !this.generateBtn.disabled) {
                    this.generateQRCode();
                }
            }
            
            // Ctrl+S to download as PNG
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                if (this.qrCodeInstance) {
                    this.downloadQRCode('png');
                }
            }
            
            // Ctrl+Shift+S to download all formats
            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                if (this.qrCodeInstance) {
                    this.downloadBatch();
                }
            }
        });
    }

    initializeBackgroundListener() {
        if (this.transparentBg) {
            this.transparentBg.addEventListener('change', () => {
                this.updateCanvasBackground();
                // Regenerate QR code if it exists
                if (this.qrCodeInstance) {
                    this.generateQRCode();
                }
            });
        }
        
        if (this.bgColor) {
            this.bgColor.addEventListener('change', () => {
                this.updateCanvasBackground();
                // Regenerate QR code if it exists
                if (this.qrCodeInstance) {
                    this.generateQRCode();
                }
            });
        }
    }

    // Modal functions
    showModal() {
        if (this.infoModal) {
            this.infoModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    hideModal() {
        if (this.infoModal) {
            this.infoModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    // Theme management
    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.className = `${savedTheme}-theme`;
        this.updateThemeToggle(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.body.className = `${newTheme}-theme`;
        localStorage.setItem('theme', newTheme);
        this.updateThemeToggle(newTheme);
    }

    updateThemeToggle(theme) {
        if (!this.themeToggle) return;
        
        const moonIcon = this.themeToggle.querySelector('.fa-moon');
        const sunIcon = this.themeToggle.querySelector('.fa-sun');
        
        if (theme === 'light') {
            if (moonIcon) moonIcon.style.opacity = '0';
            if (sunIcon) sunIcon.style.opacity = '1';
        } else {
            if (moonIcon) moonIcon.style.opacity = '1';
            if (sunIcon) sunIcon.style.opacity = '0';
        }
    }

    // Notification system
    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 25px',
            borderRadius: '12px',
            color: 'white',
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: '600',
            fontSize: '0.9rem',
            zIndex: '10001',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            backgroundColor: type === 'error' ? '#ff4757' : '#2ed573',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${type === 'error' ? '#ff6b7a' : '#4ee674'}`
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    setLoadingState(isLoading) {
        const button = this.generateBtn;
        const buttonContent = button.querySelector('.btn-content');
        const buttonSpan = buttonContent.querySelector('span');
        
        if (isLoading) {
            button.disabled = true;
            button.classList.add('loading');
            buttonSpan.textContent = 'Generating...';
        } else {
            button.disabled = false;
            button.classList.remove('loading');
            buttonSpan.textContent = 'Generate QR Code';
        }
    }

    showDownloadSection() {
        if (this.downloadSection) {
            this.downloadSection.classList.remove('hidden');
            this.downloadSection.style.display = 'block';
        }
    }

    updateQRInfo(data) {
        if (this.qrInfoText) {
            const dataLength = data.length;
            const qrType = this.qrTypeSelect.value;
            this.qrInfoText.textContent = `Generated ${qrType.toUpperCase()} QR Code (${dataLength} characters)`;
        }
    }
}

// Initialize the QR Code Generator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedQRCodeGenerator();
});

// Additional utility functions
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Copied to clipboard:', text);
    }).catch(err => {
        console.error('Failed to copy:', err);
    });
}

// Handle page visibility for performance optimization
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause any animations if needed
        console.log('Page hidden - pausing animations');
    } else {
        // Page is visible, resume animations
        console.log('Page visible - resuming animations');
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to generate QR code
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        const generateBtn = document.getElementById('generate-btn');
        if (generateBtn && !generateBtn.disabled) {
            generateBtn.click();
        }
    }
    
    // Ctrl/Cmd + S to download QR code
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const downloadBtn = document.getElementById('download-btn');
        if (downloadBtn && !downloadBtn.parentElement.classList.contains('hidden')) {
            downloadBtn.click();
        }
    }
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedQRCodeGenerator;
}
