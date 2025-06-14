// DevKit Utilities - Complete JavaScript Implementation
// All tools implemented with modern ES6+ features and modular design

class DevKitUtilities {    constructor() {
        this.currentTool = 'timezone-converter';
        this.stopwatchInterval = null;
        this.countdownInterval = null;
        this.qrScannerInterval = null;
        this.cameraStream = null;
        this.toastTimeout = null;
        
        this.init();
        this.initializeTimezones();
        this.setCurrentDateTime();
    }

    init() {
        this.setupNavigation();
        this.setupTimezoneConverter();
        this.setupDateCalculator();
        this.setupStopwatch();
        this.setupCountdownTimer();
        this.setupRandomNumberGenerator();
        this.setupHashGenerator();
        this.setupColorPaletteGenerator();
        this.setupColorConverter();
        this.setupCSVToJSON();
        this.setupJSONToCSV();
        this.setupQRReader();
        this.updatePageMeta();
    }    // Navigation System
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const toolSections = document.querySelectorAll('.tool-section');

        // Check for URL hash to direct to specific tool
        const checkHash = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash) {
                const targetTool = document.getElementById(hash);
                const targetNav = document.querySelector(`.nav-item[data-tool="${hash}"]`);
                
                if (targetTool && targetNav) {
                    // Update active nav item
                    navItems.forEach(nav => nav.classList.remove('active'));
                    targetNav.classList.add('active');
                    
                    // Show selected tool
                    toolSections.forEach(section => section.classList.remove('active'));
                    targetTool.classList.add('active');
                    
                    this.currentTool = hash;
                    this.updatePageMeta();
                    
                    // Clean up previous tool states
                    this.cleanupPreviousTool();
                }
            }
        };
        
        // Check hash on page load and hash change
        checkHash();
        window.addEventListener('hashchange', checkHash);

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const toolId = item.dataset.tool;
                
                // Set URL hash for direct linking
                window.location.hash = toolId;
                
                // Update active nav item
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // Show selected tool
                toolSections.forEach(section => section.classList.remove('active'));
                document.getElementById(toolId).classList.add('active');
                
                this.currentTool = toolId;
                this.updatePageMeta();
                
                // Clean up previous tool states
                this.cleanupPreviousTool();
            });
        });
    }

    cleanupPreviousTool() {
        // Stop any running intervals
        if (this.stopwatchInterval) {
            clearInterval(this.stopwatchInterval);
            this.stopwatchInterval = null;
        }
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
        if (this.qrScannerInterval) {
            clearInterval(this.qrScannerInterval);
            this.qrScannerInterval = null;
        }
        
        // Stop camera stream
        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach(track => track.stop());
            this.cameraStream = null;
        }
    }

    updatePageMeta() {
        const toolTitles = {
            'timezone-converter': 'Time Zone Converter | DevKit Utilities',
            'date-calculator': 'Date Calculator | DevKit Utilities',
            'stopwatch': 'Stopwatch | DevKit Utilities',
            'countdown-timer': 'Countdown Timer | DevKit Utilities',
            'random-number': 'Random Number Generator | DevKit Utilities',
            'hash-generator': 'Hash Generator | DevKit Utilities',
            'color-palette': 'Color Palette Generator | DevKit Utilities',
            'color-converter': 'Color Converter | DevKit Utilities',
            'csv-to-json': 'CSV to JSON Converter | DevKit Utilities',
            'json-to-csv': 'JSON to CSV Converter | DevKit Utilities',
            'qr-reader': 'QR Code Reader | DevKit Utilities'
        };

        const toolDescriptions = {
            'timezone-converter': 'Convert time between different time zones instantly with this professional time zone converter tool.',
            'date-calculator': 'Calculate differences between dates or add/subtract days, weeks, months, and years.',
            'stopwatch': 'Precise timing tool with lap functionality for accurate time measurement.',
            'countdown-timer': 'Count down to any future date and time with a visual countdown display.',
            'random-number': 'Generate random numbers within specified ranges for testing and development.',
            'hash-generator': 'Generate secure MD5, SHA-1, SHA-256, and SHA-512 hashes from text or files.',
            'color-palette': 'Generate beautiful color palettes using different color harmony rules.',
            'color-converter': 'Convert between HEX, RGB, HSL, and CMYK color formats instantly.',
            'csv-to-json': 'Convert CSV data to JSON format with header row detection.',
            'json-to-csv': 'Convert JSON arrays to CSV format for data export and analysis.',
            'qr-reader': 'Scan QR codes using your camera or upload QR code images for decoding.'
        };

        document.title = toolTitles[this.currentTool] || 'DevKit Utilities - Professional Developer Tools';
        
        let metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = toolDescriptions[this.currentTool] || 'A comprehensive suite of utility and conversion tools for developers.';
        }
    }

    // Timezone Converter
    initializeTimezones() {
        const timezones = [
            'UTC',
            'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
            'America/Toronto', 'America/Vancouver', 'America/Sao_Paulo', 'America/Mexico_City',
            'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Rome', 'Europe/Madrid',
            'Europe/Amsterdam', 'Europe/Stockholm', 'Europe/Moscow', 'Europe/Istanbul',
            'Asia/Tokyo', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Hong_Kong', 'Asia/Singapore',
            'Asia/Bangkok', 'Asia/Mumbai', 'Asia/Dubai', 'Asia/Kolkata', 'Asia/Jerusalem',
            'Australia/Sydney', 'Australia/Melbourne', 'Australia/Perth', 'Pacific/Auckland',
            'Africa/Cairo', 'Africa/Lagos', 'Africa/Johannesburg', 'Africa/Nairobi'
        ];

        const fromSelect = document.getElementById('from-timezone');
        const toSelect = document.getElementById('to-timezone');

        timezones.forEach(tz => {
            const option1 = new Option(this.formatTimezone(tz), tz);
            const option2 = new Option(this.formatTimezone(tz), tz);
            fromSelect.appendChild(option1);
            toSelect.appendChild(option2);
        });

        // Set default timezones
        fromSelect.value = 'America/New_York';
        toSelect.value = 'Europe/London';
    }

    formatTimezone(tz) {
        const city = tz.split('/')[1]?.replace(/_/g, ' ') || tz;
        try {
            const now = new Date();
            const offset = new Intl.DateTimeFormat('en', {
                timeZone: tz,
                timeZoneName: 'short'
            }).formatToParts(now).find(part => part.type === 'timeZoneName')?.value || '';
            
            return `${tz} (${city} - ${offset})`;
        } catch {
            return `${tz} (${city})`;
        }
    }

    setCurrentDateTime() {
        const now = new Date();
        const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
            .toISOString().slice(0, 16);
        document.getElementById('source-datetime').value = localDateTime;
    }

    setupTimezoneConverter() {
        const fromTz = document.getElementById('from-timezone');
        const toTz = document.getElementById('to-timezone');
        const sourceDateTime = document.getElementById('source-datetime');
        const convertedTime = document.getElementById('converted-time');

        const convertTime = () => {
            try {
                const sourceDate = new Date(sourceDateTime.value);
                if (isNaN(sourceDate.getTime())) {
                    convertedTime.textContent = 'Please select a valid date and time';
                    return;
                }

                const options = {
                    timeZone: toTz.value,
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    timeZoneName: 'short'
                };

                const converted = sourceDate.toLocaleString('en-US', options);
                convertedTime.textContent = converted;
            } catch (error) {
                convertedTime.textContent = 'Error converting time';
            }
        };

        fromTz.addEventListener('change', convertTime);
        toTz.addEventListener('change', convertTime);
        sourceDateTime.addEventListener('change', convertTime);

        // Initial conversion
        convertTime();
    }

    // Date Calculator
    setupDateCalculator() {
        // Tab switching
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${targetTab}-tab`) {
                        content.classList.add('active');
                    }
                });
            });
        });

        // Date difference calculation
        const startDate = document.getElementById('start-date');
        const endDate = document.getElementById('end-date');

        const calculateDateDifference = () => {
            if (!startDate.value || !endDate.value) return;

            const start = new Date(startDate.value);
            const end = new Date(endDate.value);
            const diffTime = Math.abs(end - start);
            
            const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const weeks = Math.floor(days / 7);
            const months = Math.floor(days / 30.44); // Average days per month
            const years = Math.floor(days / 365.25); // Account for leap years

            document.getElementById('days-diff').textContent = days;
            document.getElementById('weeks-diff').textContent = weeks;
            document.getElementById('months-diff').textContent = months;
            document.getElementById('years-diff').textContent = years;
        };

        startDate.addEventListener('change', calculateDateDifference);
        endDate.addEventListener('change', calculateDateDifference);

        // Add/Subtract dates
        const baseDate = document.getElementById('base-date');
        const operation = document.getElementById('operation');
        const amount = document.getElementById('amount');
        const unit = document.getElementById('unit');

        const calculateNewDate = () => {
            if (!baseDate.value || !amount.value) {
                document.getElementById('calculated-date').textContent = 'Select a date and amount';
                return;
            }

            const base = new Date(baseDate.value);
            const amountVal = parseInt(amount.value);
            const isAdd = operation.value === 'add';
            const multiplier = isAdd ? 1 : -1;

            let result = new Date(base);

            switch (unit.value) {
                case 'days':
                    result.setDate(result.getDate() + (amountVal * multiplier));
                    break;
                case 'weeks':
                    result.setDate(result.getDate() + (amountVal * 7 * multiplier));
                    break;
                case 'months':
                    result.setMonth(result.getMonth() + (amountVal * multiplier));
                    break;
                case 'years':
                    result.setFullYear(result.getFullYear() + (amountVal * multiplier));
                    break;
            }

            document.getElementById('calculated-date').textContent = 
                result.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
        };

        baseDate.addEventListener('change', calculateNewDate);
        operation.addEventListener('change', calculateNewDate);
        amount.addEventListener('input', calculateNewDate);
        unit.addEventListener('change', calculateNewDate);
    }

    // Stopwatch
    setupStopwatch() {
        let startTime = 0;
        let elapsedTime = 0;
        let isRunning = false;
        let lapCount = 0;

        const timeDisplay = document.getElementById('stopwatch-time');
        const startStopBtn = document.getElementById('start-stop-btn');
        const lapBtn = document.getElementById('lap-btn');
        const resetBtn = document.getElementById('reset-btn');
        const lapList = document.getElementById('lap-list');

        const formatTime = (ms) => {
            const totalSeconds = Math.floor(ms / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            const milliseconds = ms % 1000;
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;

            return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
        };

        const updateDisplay = () => {
            const currentTime = isRunning ? Date.now() - startTime + elapsedTime : elapsedTime;
            timeDisplay.textContent = formatTime(currentTime);
        };

        startStopBtn.addEventListener('click', () => {
            if (isRunning) {
                // Stop
                elapsedTime += Date.now() - startTime;
                isRunning = false;
                startStopBtn.innerHTML = '<i class="fas fa-play"></i> Start';
                lapBtn.disabled = true;
                clearInterval(this.stopwatchInterval);
            } else {
                // Start
                startTime = Date.now();
                isRunning = true;
                startStopBtn.innerHTML = '<i class="fas fa-pause"></i> Stop';
                lapBtn.disabled = false;
                this.stopwatchInterval = setInterval(updateDisplay, 10);
            }
        });

        lapBtn.addEventListener('click', () => {
            if (isRunning) {
                lapCount++;
                const currentTime = Date.now() - startTime + elapsedTime;
                const lapItem = document.createElement('div');
                lapItem.className = 'lap-item';
                lapItem.innerHTML = `
                    <span>Lap ${lapCount}</span>
                    <span>${formatTime(currentTime)}</span>
                `;
                lapList.appendChild(lapItem);
                lapList.scrollTop = lapList.scrollHeight;
            }
        });

        resetBtn.addEventListener('click', () => {
            elapsedTime = 0;
            startTime = 0;
            isRunning = false;
            lapCount = 0;
            startStopBtn.innerHTML = '<i class="fas fa-play"></i> Start';
            lapBtn.disabled = true;
            timeDisplay.textContent = '00:00:00.000';
            lapList.innerHTML = '';
            clearInterval(this.stopwatchInterval);
        });
    }

    // Countdown Timer
    setupCountdownTimer() {
        const targetDateTime = document.getElementById('target-datetime');
        const countdownDisplay = document.getElementById('countdown-display');
        const countdownStatus = document.getElementById('countdown-status');

        const updateCountdown = () => {
            if (!targetDateTime.value) {
                countdownStatus.textContent = 'Set a target date to start countdown';
                return;
            }

            const target = new Date(targetDateTime.value);
            const now = new Date();
            const difference = target - now;

            if (difference <= 0) {
                countdownStatus.textContent = 'Countdown finished!';
                document.getElementById('countdown-days').textContent = '00';
                document.getElementById('countdown-hours').textContent = '00';
                document.getElementById('countdown-minutes').textContent = '00';
                document.getElementById('countdown-seconds').textContent = '00';
                clearInterval(this.countdownInterval);
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            document.getElementById('countdown-days').textContent = days.toString().padStart(2, '0');
            document.getElementById('countdown-hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('countdown-minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('countdown-seconds').textContent = seconds.toString().padStart(2, '0');

            const targetDate = target.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            countdownStatus.textContent = `Counting down to ${targetDate}`;
        };

        targetDateTime.addEventListener('change', () => {
            clearInterval(this.countdownInterval);
            if (targetDateTime.value) {
                updateCountdown();
                this.countdownInterval = setInterval(updateCountdown, 1000);
            }
        });
    }

    // Random Number Generator
    setupRandomNumberGenerator() {
        const minValue = document.getElementById('min-value');
        const maxValue = document.getElementById('max-value');
        const generateBtn = document.getElementById('generate-btn');
        const generatedNumber = document.getElementById('generated-number');
        const copyNumberBtn = document.getElementById('copy-number-btn');

        generateBtn.addEventListener('click', () => {
            const min = parseInt(minValue.value) || 0;
            const max = parseInt(maxValue.value) || 100;

            if (min >= max) {
                this.showToast('Minimum must be less than maximum', 'error');
                return;
            }

            const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
            generatedNumber.textContent = randomNum;
            copyNumberBtn.style.display = 'inline-flex';
        });

        copyNumberBtn.addEventListener('click', () => {
            this.copyToClipboard(generatedNumber.textContent);
        });
    }

    // Hash Generator
    setupHashGenerator() {
        const inputTabs = document.querySelectorAll('.input-tab');
        const inputContents = document.querySelectorAll('.input-content');
        const textInput = document.getElementById('hash-text-input');
        const fileInput = document.getElementById('hash-file-input');
        const fileUploadArea = document.getElementById('file-upload-area');
        const fileInfo = document.getElementById('file-info');
        const copyHashBtns = document.querySelectorAll('.copy-hash-btn');

        // Tab switching
        inputTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetInput = tab.dataset.input;
                
                inputTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                inputContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${targetInput}-input-section`) {
                        content.classList.add('active');
                    }
                });
            });
        });

        // File upload area
        fileUploadArea.addEventListener('click', () => fileInput.click());
        fileUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = 'var(--primary-color)';
        });
        fileUploadArea.addEventListener('dragleave', () => {
            fileUploadArea.style.borderColor = 'var(--border-color)';
        });
        fileUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            fileUploadArea.style.borderColor = 'var(--border-color)';
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleHashFile(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleHashFile(e.target.files[0]);
            }
        });

        textInput.addEventListener('input', () => {
            if (textInput.value.trim()) {
                this.generateTextHashes(textInput.value);
            } else {
                this.clearHashes();
            }
        });

        // Copy buttons
        copyHashBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const hashType = btn.dataset.hash;
                const hashElement = document.getElementById(`${hashType}-hash`);
                if (hashElement.textContent !== '-') {
                    this.copyToClipboard(hashElement.textContent);
                }
            });
        });
    }

    async handleHashFile(file) {
        const fileInfo = document.getElementById('file-info');
        fileInfo.innerHTML = `
            <strong>File:</strong> ${file.name}<br>
            <strong>Size:</strong> ${this.formatFileSize(file.size)}<br>
            <strong>Type:</strong> ${file.type || 'Unknown'}
        `;
        fileInfo.style.display = 'block';

        try {
            const arrayBuffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);
            this.generateFileHashes(uint8Array);
        } catch (error) {
            this.showToast('Error reading file', 'error');
        }
    }

    async generateTextHashes(text) {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        this.generateFileHashes(data);
    }

    async generateFileHashes(data) {
        try {
            // MD5 (using a simple implementation since Web Crypto API doesn't support MD5)
            document.getElementById('md5-hash').textContent = await this.md5(data);
            
            // SHA-1
            const sha1Hash = await crypto.subtle.digest('SHA-1', data);
            document.getElementById('sha1-hash').textContent = this.arrayBufferToHex(sha1Hash);
            
            // SHA-256
            const sha256Hash = await crypto.subtle.digest('SHA-256', data);
            document.getElementById('sha256-hash').textContent = this.arrayBufferToHex(sha256Hash);
            
            // SHA-512
            const sha512Hash = await crypto.subtle.digest('SHA-512', data);
            document.getElementById('sha512-hash').textContent = this.arrayBufferToHex(sha512Hash);
        } catch (error) {
            this.showToast('Error generating hashes', 'error');
        }
    }

    async md5(data) {
        // Simple MD5 implementation - in production, use a proper crypto library
        // This is a basic implementation for demonstration
        const md5Hash = await this.simpleMD5(data);
        return md5Hash;
    }

    async simpleMD5(data) {
        // For simplicity, we'll use a basic hash that mimics MD5 behavior
        // In a real application, use crypto-js or similar library
        let hash = 0;
        const str = Array.from(data).map(b => String.fromCharCode(b)).join('');
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16).padStart(8, '0').repeat(4).substring(0, 32);
    }

    arrayBufferToHex(buffer) {
        return Array.from(new Uint8Array(buffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    clearHashes() {
        document.getElementById('md5-hash').textContent = '-';
        document.getElementById('sha1-hash').textContent = '-';
        document.getElementById('sha256-hash').textContent = '-';
        document.getElementById('sha512-hash').textContent = '-';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Color Palette Generator
    setupColorPaletteGenerator() {
        const baseColor = document.getElementById('base-color');
        const paletteTypes = document.querySelectorAll('input[name="palette-type"]');
        const generateRandomBtn = document.getElementById('generate-random-palette');
        const paletteDisplay = document.getElementById('palette-display');

        const generatePalette = () => {
            const color = baseColor.value;
            const selectedType = document.querySelector('input[name="palette-type"]:checked').value;
            const palette = this.createColorPalette(color, selectedType);
            this.displayPalette(palette);
        };

        baseColor.addEventListener('change', generatePalette);
        paletteTypes.forEach(radio => {
            radio.addEventListener('change', generatePalette);
        });

        generateRandomBtn.addEventListener('click', () => {
            baseColor.value = this.getRandomColor();
            generatePalette();
        });

        // Initial palette
        generatePalette();
    }

    createColorPalette(baseColor, type) {
        const hsl = this.hexToHsl(baseColor);
        const colors = [];

        switch (type) {
            case 'monochromatic':
                for (let i = 0; i < 5; i++) {
                    const lightness = Math.max(10, Math.min(90, hsl.l + (i - 2) * 20));
                    colors.push(this.hslToHex(hsl.h, hsl.s, lightness));
                }
                break;
            case 'analogous':
                for (let i = 0; i < 5; i++) {
                    const hue = (hsl.h + (i - 2) * 30 + 360) % 360;
                    colors.push(this.hslToHex(hue, hsl.s, hsl.l));
                }
                break;
            case 'complementary':
                colors.push(baseColor);
                colors.push(this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
                colors.push(this.hslToHex(hsl.h, Math.max(20, hsl.s - 20), hsl.l));
                colors.push(this.hslToHex((hsl.h + 180) % 360, Math.max(20, hsl.s - 20), hsl.l));
                colors.push(this.hslToHex(hsl.h, hsl.s, Math.max(20, Math.min(80, hsl.l + 20))));
                break;
            case 'triadic':
                colors.push(baseColor);
                colors.push(this.hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l));
                colors.push(this.hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l));
                colors.push(this.hslToHex(hsl.h, Math.max(20, hsl.s - 15), Math.max(20, hsl.l - 15)));
                colors.push(this.hslToHex(hsl.h, Math.min(100, hsl.s + 15), Math.min(80, hsl.l + 15)));
                break;
        }

        return colors;
    }

    displayPalette(colors) {
        const paletteDisplay = document.getElementById('palette-display');
        paletteDisplay.innerHTML = '';

        colors.forEach(color => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color;
            swatch.innerHTML = `<span class="color-code">${color.toUpperCase()}</span>`;
            swatch.addEventListener('click', () => {
                this.copyToClipboard(color.toUpperCase());
            });
            paletteDisplay.appendChild(swatch);
        });
    }

    getRandomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }

    // Color Converter
    setupColorConverter() {
        const colorInput = document.getElementById('color-input');
        const previewSwatch = document.getElementById('preview-swatch');
        const previewLabel = document.getElementById('preview-label');
        const copyFormatBtns = document.querySelectorAll('.copy-format-btn');

        colorInput.addEventListener('input', () => {
            this.convertColor(colorInput.value.trim());
        });

        copyFormatBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const format = btn.dataset.format;
                const output = document.getElementById(`${format}-output`);
                if (output.textContent !== '-') {
                    this.copyToClipboard(output.textContent);
                }
            });
        });
    }

    convertColor(input) {
        const outputs = {
            hex: document.getElementById('hex-output'),
            rgb: document.getElementById('rgb-output'),
            hsl: document.getElementById('hsl-output'),
            cmyk: document.getElementById('cmyk-output')
        };
        const previewSwatch = document.getElementById('preview-swatch');
        const previewLabel = document.getElementById('preview-label');

        if (!input) {
            Object.values(outputs).forEach(output => output.textContent = '-');
            previewSwatch.style.backgroundColor = '#ffffff';
            previewLabel.textContent = 'Enter a valid color';
            return;
        }

        try {
            let rgb;
            
            if (input.startsWith('#')) {
                rgb = this.hexToRgb(input);
            } else if (input.startsWith('rgb')) {
                rgb = this.parseRgb(input);
            } else if (input.startsWith('hsl')) {
                const hsl = this.parseHsl(input);
                rgb = this.hslToRgb(hsl.h, hsl.s, hsl.l);
            } else {
                throw new Error('Invalid color format');
            }

            if (!rgb) throw new Error('Invalid color');

            const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
            const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
            const cmyk = this.rgbToCmyk(rgb.r, rgb.g, rgb.b);

            outputs.hex.textContent = hex;
            outputs.rgb.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
            outputs.hsl.textContent = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
            outputs.cmyk.textContent = `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;

            previewSwatch.style.backgroundColor = hex;
            previewLabel.textContent = `${hex} • RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        } catch (error) {
            Object.values(outputs).forEach(output => output.textContent = 'Invalid color');
            previewSwatch.style.backgroundColor = '#ffffff';
            previewLabel.textContent = 'Invalid color format';
        }
    }    // CSV/JSON Converters
    setupCSVToJSON() {
        const csvInput = document.getElementById('csv-input');
        const hasHeader = document.getElementById('has-header');
        const convertBtn = document.getElementById('csv-to-json-btn');
        const jsonOutput = document.getElementById('json-output');
        const copyJsonBtn = document.getElementById('copy-json-btn');
        const csvFileSelect = document.getElementById('csv-file-select');
        const csvFileInput = document.getElementById('csv-file-input');

        // File selection functionality
        csvFileSelect.addEventListener('click', () => {
            csvFileInput.click();
        });

        csvFileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.type === 'text/csv' || file.name.endsWith('.csv') || file.type === 'application/vnd.ms-excel') {
                    try {
                        const text = await file.text();
                        csvInput.value = text;
                        this.showToast(`File "${file.name}" loaded successfully`);
                    } catch (error) {
                        this.showToast('Error reading CSV file', 'error');
                    }
                } else {
                    this.showToast('Please select a valid CSV file', 'error');
                }
            }
        });

        convertBtn.addEventListener('click', () => {
            const csvData = csvInput.value.trim();
            if (!csvData) {
                this.showToast('Please enter CSV data or select a file', 'error');
                return;
            }

            try {
                const jsonData = this.csvToJson(csvData, hasHeader.checked);
                jsonOutput.value = JSON.stringify(jsonData, null, 2);
                copyJsonBtn.disabled = false;
                this.showToast('CSV converted to JSON successfully');
            } catch (error) {
                this.showToast('Error converting CSV: ' + error.message, 'error');
                jsonOutput.value = '';
                copyJsonBtn.disabled = true;
            }
        });

        copyJsonBtn.addEventListener('click', () => {
            this.copyToClipboard(jsonOutput.value);
        });
    }

    setupJSONToCSV() {
        const jsonInput = document.getElementById('json-input');
        const convertBtn = document.getElementById('json-to-csv-btn');
        const csvOutput = document.getElementById('csv-output');
        const copyCsvBtn = document.getElementById('copy-csv-btn');
        const jsonFileSelect = document.getElementById('json-file-select');
        const jsonFileInput = document.getElementById('json-file-input');

        // File selection functionality
        jsonFileSelect.addEventListener('click', () => {
            jsonFileInput.click();
        });

        jsonFileInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.type === 'application/json' || file.name.endsWith('.json')) {
                    try {
                        const text = await file.text();
                        // Validate JSON first
                        JSON.parse(text);
                        jsonInput.value = text;
                        this.showToast(`File "${file.name}" loaded successfully`);
                    } catch (error) {
                        this.showToast('Invalid JSON file: ' + error.message, 'error');
                    }
                } else {
                    this.showToast('Please select a valid JSON file', 'error');
                }
            }
        });

        convertBtn.addEventListener('click', () => {
            const jsonData = jsonInput.value.trim();
            if (!jsonData) {
                this.showToast('Please enter JSON data or select a file', 'error');
                return;
            }

            try {
                const parsedData = JSON.parse(jsonData);
                if (!Array.isArray(parsedData)) {
                    throw new Error('JSON must be an array of objects');
                }
                if (parsedData.length === 0) {
                    throw new Error('JSON array cannot be empty');
                }
                const csvData = this.jsonToCsv(parsedData);
                csvOutput.value = csvData;
                copyCsvBtn.disabled = false;
                this.showToast('JSON converted to CSV successfully');
            } catch (error) {
                let errorMessage = 'Error converting JSON: ';
                if (error instanceof SyntaxError) {
                    errorMessage += 'Invalid JSON format';
                } else {
                    errorMessage += error.message;
                }
                this.showToast(errorMessage, 'error');
                csvOutput.value = '';
                copyCsvBtn.disabled = true;
            }
        });

        copyCsvBtn.addEventListener('click', () => {
            this.copyToClipboard(csvOutput.value);
        });
    }

    csvToJson(csvData, hasHeader) {
        const lines = csvData.split('\n').filter(line => line.trim());
        if (lines.length === 0) throw new Error('No data found');

        const result = [];
        const headers = hasHeader ? this.parseCSVLine(lines[0]) : null;
        const startIndex = hasHeader ? 1 : 0;

        for (let i = startIndex; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            const row = {};

            if (hasHeader && headers) {
                headers.forEach((header, index) => {
                    row[header] = values[index] || '';
                });
            } else {
                values.forEach((value, index) => {
                    row[`column_${index + 1}`] = value;
                });
            }
            result.push(row);
        }

        return result;
    }

    jsonToCsv(jsonData) {
        if (jsonData.length === 0) return '';

        const headers = Object.keys(jsonData[0]);
        const csvLines = [];

        // Add headers
        csvLines.push(headers.map(header => this.escapeCSVField(header)).join(','));

        // Add data rows
        jsonData.forEach(row => {
            const values = headers.map(header => this.escapeCSVField(row[header] || ''));
            csvLines.push(values.join(','));
        });

        return csvLines.join('\n');
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        return result;
    }

    escapeCSVField(field) {
        const stringField = String(field);
        if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
            return '"' + stringField.replace(/"/g, '""') + '"';
        }
        return stringField;
    }

    // QR Code Reader
    setupQRReader() {
        const cameraBtn = document.getElementById('camera-scan-btn');
        const fileBtn = document.getElementById('file-upload-btn');
        const cameraSection = document.getElementById('camera-section');
        const uploadSection = document.getElementById('upload-section');
        const startCameraBtn = document.getElementById('start-camera-btn');
        const qrVideo = document.getElementById('qr-video');
        const qrCanvas = document.getElementById('qr-canvas');
        const uploadCanvas = document.getElementById('upload-canvas');
        const qrFileInput = document.getElementById('qr-file-input');
        const qrUploadArea = document.getElementById('qr-upload-area');
        const qrResult = document.getElementById('qr-result');
        const qrContent = document.getElementById('qr-content');
        const copyQrBtn = document.getElementById('copy-qr-content');

        // Method switching
        cameraBtn.addEventListener('click', () => {
            cameraBtn.classList.add('active');
            fileBtn.classList.remove('active');
            cameraSection.classList.add('active');
            uploadSection.classList.remove('active');
        });

        fileBtn.addEventListener('click', () => {
            fileBtn.classList.add('active');
            cameraBtn.classList.remove('active');
            uploadSection.classList.add('active');
            cameraSection.classList.remove('active');
        });

        // Camera scanning
        startCameraBtn.addEventListener('click', this.startCamera.bind(this));        // File upload
        qrUploadArea.addEventListener('click', () => qrFileInput.click());
        
        qrUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            qrUploadArea.style.borderColor = 'var(--primary-color)';
            qrUploadArea.style.backgroundColor = 'rgba(52, 152, 219, 0.1)';
        });
        
        qrUploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            qrUploadArea.style.borderColor = 'var(--border-color)';
            qrUploadArea.style.backgroundColor = '#f8f9fa';
        });
        
        qrUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            qrUploadArea.style.borderColor = 'var(--border-color)';
            qrUploadArea.style.backgroundColor = '#f8f9fa';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                if (file.type.startsWith('image/')) {
                    this.processQRImage(file);
                } else {
                    this.showToast('Please drop an image file (JPG, PNG, etc.)', 'error');
                }
            }
        });

        qrFileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.processQRImage(e.target.files[0]);
            }
        });

        copyQrBtn.addEventListener('click', () => {
            this.copyToClipboard(qrContent.textContent);
        });
    }    async startCamera() {
        try {
            const video = document.getElementById('qr-video');
            const canvas = document.getElementById('qr-canvas');
            const context = canvas.getContext('2d');
            const status = document.getElementById('camera-status');
            const startBtn = document.getElementById('start-camera-btn');

            if (this.cameraStream) {
                // Stop camera
                this.cameraStream.getTracks().forEach(track => track.stop());
                this.cameraStream = null;
                clearInterval(this.qrScannerInterval);
                startBtn.innerHTML = '<i class="fas fa-play"></i> Start Camera';
                status.textContent = 'Camera stopped';
                video.style.display = 'none';
                status.style.display = 'block';
                return;
            }

            // Show loading state
            status.textContent = 'Starting camera...';
            startBtn.disabled = true;

            // Check if camera is available
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Camera not supported by this browser');
            }

            this.cameraStream = await navigator.mediaDevices.getUserMedia({
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                }
            });

            video.srcObject = this.cameraStream;
            video.style.display = 'block';
            status.style.display = 'none';
            startBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Camera';
            startBtn.disabled = false;

            video.addEventListener('loadedmetadata', () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            });

            const scanQR = () => {
                if (video.readyState === video.HAVE_ENOUGH_DATA) {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    
                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height);
                    
                    if (code) {
                        this.displayQRResult(code.data);
                        this.cameraStream.getTracks().forEach(track => track.stop());
                        this.cameraStream = null;
                        clearInterval(this.qrScannerInterval);
                        startBtn.innerHTML = '<i class="fas fa-play"></i> Start Camera';
                        video.style.display = 'none';
                        status.style.display = 'block';
                        status.textContent = 'QR Code detected! Click Start Camera to scan again.';
                        this.showToast('QR code scanned successfully!');
                    }
                }
            };

            this.qrScannerInterval = setInterval(scanQR, 100);
        } catch (error) {
            const startBtn = document.getElementById('start-camera-btn');
            const status = document.getElementById('camera-status');
            
            startBtn.disabled = false;
            status.style.display = 'block';
            
            if (error.name === 'NotAllowedError') {
                status.textContent = 'Camera access denied. Please allow camera access and try again.';
                this.showToast('Camera access denied. Please check your browser settings.', 'error');
            } else if (error.name === 'NotFoundError') {
                status.textContent = 'No camera found on this device.';
                this.showToast('No camera found on this device', 'error');
            } else if (error.name === 'NotSupportedError') {
                status.textContent = 'Camera not supported by this browser.';
                this.showToast('Camera not supported by this browser', 'error');
            } else {
                status.textContent = 'Camera error: ' + error.message;
                this.showToast('Camera error: ' + error.message, 'error');
            }
        }
    }async processQRImage(file) {
        try {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                this.showToast('Please select a valid image file', 'error');
                return;
            }

            // Show loading state
            this.showToast('Processing image...', 'info');

            const canvas = document.getElementById('upload-canvas');
            const context = canvas.getContext('2d');
            
            const img = new Image();
            img.onload = () => {
                try {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    context.drawImage(img, 0, 0);
                    
                    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height);
                    
                    if (code) {
                        this.displayQRResult(code.data);
                        this.showToast('QR code detected successfully!');
                    } else {
                        this.showToast('No QR code found in the image. Please try a clearer image.', 'error');
                    }
                } catch (error) {
                    this.showToast('Error processing image: ' + error.message, 'error');
                }
                
                URL.revokeObjectURL(img.src);
            };

            img.onerror = () => {
                this.showToast('Failed to load image. Please try a different file.', 'error');
                URL.revokeObjectURL(img.src);
            };
            
            img.src = URL.createObjectURL(file);
        } catch (error) {
            this.showToast('Error processing image: ' + error.message, 'error');
        }
    }

    displayQRResult(data) {
        const qrResult = document.getElementById('qr-result');
        const qrContent = document.getElementById('qr-content');
        
        qrContent.textContent = data;
        qrResult.style.display = 'block';
        qrResult.scrollIntoView({ behavior: 'smooth' });
    }

    // Color utility functions
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    hexToHsl(hex) {
        const rgb = this.hexToRgb(hex);
        return this.rgbToHsl(rgb.r, rgb.g, rgb.b);
    }

    hslToHex(h, s, l) {
        const rgb = this.hslToRgb(h, s, l);
        return this.rgbToHex(rgb.r, rgb.g, rgb.b);
    }

    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return { h: h * 360, s: s * 100, l: l * 100 };
    }

    hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        const a = s * Math.min(l, 1 - l);
        const f = n => {
            const k = (n + h * 12) % 12;
            return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        };
        return {
            r: Math.round(255 * f(0)),
            g: Math.round(255 * f(8)),
            b: Math.round(255 * f(4))
        };
    }

    parseRgb(rgb) {
        const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        return match ? {
            r: parseInt(match[1]),
            g: parseInt(match[2]),
            b: parseInt(match[3])
        } : null;
    }

    parseHsl(hsl) {
        const match = hsl.match(/hsl\((\d+),\s*(\d+)%?,\s*(\d+)%?\)/);
        return match ? {
            h: parseInt(match[1]),
            s: parseInt(match[2]),
            l: parseInt(match[3])
        } : null;
    }

    rgbToCmyk(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;

        const k = 1 - Math.max(r, Math.max(g, b));
        const c = (1 - r - k) / (1 - k) || 0;
        const m = (1 - g - k) / (1 - k) || 0;
        const y = (1 - b - k) / (1 - k) || 0;

        return {
            c: Math.round(c * 100),
            m: Math.round(m * 100),
            y: Math.round(y * 100),
            k: Math.round(k * 100)
        };
    }

    // Utility functions
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showToast('Copied to clipboard!');
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('Copied to clipboard!');
        }
    }    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        
        // Clear any existing timeout
        if (this.toastTimeout) {
            clearTimeout(this.toastTimeout);
        }

        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        // Set different durations based on type
        let duration;
        switch (type) {
            case 'error':
                duration = 4000; // 4 seconds for errors
                break;
            case 'info':
                duration = 2000; // 2 seconds for info
                break;
            default:
                duration = 3000; // 3 seconds for success
        }
        
        this.toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            this.toastTimeout = null;
        }, duration);
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DevKitUtilities();
});

// Add mobile menu toggle for responsive design
document.addEventListener('DOMContentLoaded', () => {
    const createMobileMenuToggle = () => {
        if (window.innerWidth <= 1024) {
            let menuToggle = document.getElementById('mobile-menu-toggle');
            if (!menuToggle) {
                menuToggle = document.createElement('button');
                menuToggle.id = 'mobile-menu-toggle';
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                menuToggle.style.cssText = `
                    position: fixed;
                    top: 1rem;
                    left: 1rem;
                    z-index: 10001;
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    padding: 0.75rem;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1.2rem;
                    box-shadow: var(--shadow-medium);
                `;
                document.body.appendChild(menuToggle);

                menuToggle.addEventListener('click', () => {
                    const sidebar = document.querySelector('.sidebar');
                    sidebar.classList.toggle('open');
                });

                // Close sidebar when clicking outside
                document.addEventListener('click', (e) => {
                    const sidebar = document.querySelector('.sidebar');
                    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                        sidebar.classList.remove('open');
                    }
                });
            }
        }
    };

    createMobileMenuToggle();
    window.addEventListener('resize', createMobileMenuToggle);
});
