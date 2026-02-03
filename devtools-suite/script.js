// DevTools Suite - Main JavaScript
(function () {
    'use strict';    // Global state management
    const state = {
        currentTool: 'box-shadow-tool',
        theme: localStorage.getItem('devtools-theme') || 'light',
        selectedFlexItem: null,
        clipPathPoints: [],
        clipPathMode: 'circle',
        clipPathBackgroundImage: null
    };

    // Utility functions
    const utils = {
        // Convert hex to RGB
        hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },

        // Convert RGB to hex
        rgbToHex(r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        },

        // Get relative luminance
        getLuminance(r, g, b) {
            const [rs, gs, bs] = [r, g, b].map(c => {
                c = c / 255;
                return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
            });
            return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
        },

        // Calculate contrast ratio
        getContrastRatio(color1, color2) {
            const rgb1 = this.hexToRgb(color1);
            const rgb2 = this.hexToRgb(color2);

            if (!rgb1 || !rgb2) return 1;

            const lum1 = this.getLuminance(rgb1.r, rgb1.g, rgb1.b);
            const lum2 = this.getLuminance(rgb2.r, rgb2.g, rgb2.b);

            const brightest = Math.max(lum1, lum2);
            const darkest = Math.min(lum1, lum2);

            return (brightest + 0.05) / (darkest + 0.05);
        },

        // Show toast notification
        showToast(message) {
            const toast = document.getElementById('toast');
            const span = toast.querySelector('span');
            span.textContent = message;
            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        },

        // Copy to clipboard
        async copyToClipboard(text) {
            try {
                await navigator.clipboard.writeText(text);
                this.showToast('Copied to clipboard!');
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                this.showToast('Copied to clipboard!');
            }
        },

        // Debounce function
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
    };

    // Theme management
    const themeManager = {
        init() {
            this.applyTheme(state.theme);
            this.setupThemeToggle();
        },

        applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            state.theme = theme;
            localStorage.setItem('devtools-theme', theme);
        },

        setupThemeToggle() {
            const themeToggle = document.getElementById('themeToggle');
            themeToggle.addEventListener('click', () => {
                const newTheme = state.theme === 'light' ? 'dark' : 'light';
                this.applyTheme(newTheme);
            });
        }
    };    // Navigation management
    const navigationManager = {
        init() {
            this.setupNavigation();
            this.setupMobileNav();

            // Check if there's a URL hash for direct tool access
            const hash = window.location.hash.replace('#', '');
            const validToolId = this.isValidToolId(hash) ? hash : state.currentTool;
            this.showTool(validToolId);

            // Add hash change listener for direct linking
            window.addEventListener('hashchange', () => {
                const hash = window.location.hash.replace('#', '');
                if (this.isValidToolId(hash)) {
                    this.showTool(hash);
                    this.setActiveNavByToolId(hash);
                }
            });
        },

        isValidToolId(toolId) {
            // Check if the tool ID exists in the page
            return !!document.getElementById(toolId);
        },

        setupNavigation() {
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const toolId = link.getAttribute('data-tool');

                    // Update URL hash without triggering page reload
                    window.location.hash = toolId;

                    this.showTool(toolId);
                    this.setActiveNav(link);
                });
            });
        },

        setupMobileNav() {
            const navToggle = document.getElementById('navToggle');
            const navMenu = document.getElementById('navMenu');

            if (navToggle && navMenu) {
                navToggle.addEventListener('click', () => {
                    navMenu.classList.toggle('active');
                });
            }
        },

        showTool(toolId) {
            // Hide all tools
            document.querySelectorAll('.tool').forEach(tool => {
                tool.classList.remove('active');
            });

            // Show selected tool
            const selectedTool = document.getElementById(toolId);
            if (selectedTool) {
                selectedTool.classList.add('active');
                state.currentTool = toolId;

                // Close mobile nav
                const navMenu = document.getElementById('navMenu');
                if (navMenu) {
                    navMenu.classList.remove('active');
                }

                // Update page title to reflect current tool
                const toolName = selectedTool.querySelector('.tool-header h2')?.textContent || toolId;
                document.title = `${toolName} | DevTools Suite`;
            }
        },

        setActiveNav(activeLink) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            activeLink.classList.add('active');
        },

        setActiveNavByToolId(toolId) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-tool') === toolId) {
                    link.classList.add('active');
                }
            });
        }
    };// Box Shadow Tool
    const boxShadowTool = {
        init() {
            this.setupControls();
            this.updatePreview();
        },

        setupControls() {
            const controls = {
                shadowX: document.getElementById('shadowX'),
                shadowY: document.getElementById('shadowY'),
                shadowBlur: document.getElementById('shadowBlur'),
                shadowSpread: document.getElementById('shadowSpread'),
                shadowColor: document.getElementById('shadowColor'),
                shadowOpacity: document.getElementById('shadowOpacity'),
                shadowInset: document.getElementById('shadowInset'),
                previewBg: document.getElementById('previewBg'),
                elementBg: document.getElementById('elementBg')
            };

            const manualInputs = {
                shadowXManual: document.getElementById('shadowXManual'),
                shadowYManual: document.getElementById('shadowYManual'),
                shadowBlurManual: document.getElementById('shadowBlurManual'),
                shadowSpreadManual: document.getElementById('shadowSpreadManual')
            };

            const unitSelects = {
                shadowXUnit: document.getElementById('shadowXUnit'),
                shadowYUnit: document.getElementById('shadowYUnit'),
                shadowBlurUnit: document.getElementById('shadowBlurUnit'),
                shadowSpreadUnit: document.getElementById('shadowSpreadUnit')
            };

            // Setup range controls
            Object.entries(controls).forEach(([key, element]) => {
                if (element) {
                    element.addEventListener('input', () => {
                        this.updateRangeValue(element);
                        this.syncManualInput(element);
                        this.updatePreview();
                    });
                }
            });

            // Setup manual inputs
            Object.entries(manualInputs).forEach(([key, element]) => {
                if (element) {
                    element.addEventListener('input', () => {
                        this.syncRangeInput(element);
                        this.updatePreview();
                    });
                }
            });

            // Setup unit selectors
            Object.entries(unitSelects).forEach(([key, element]) => {
                if (element) {
                    element.addEventListener('change', () => {
                        this.updatePreview();
                    });
                }
            });

            // Copy button
            const copyBtn = document.getElementById('shadowCopyBtn');
            if (copyBtn) {
                copyBtn.addEventListener('click', () => {
                    const code = document.getElementById('shadowCode').textContent;
                    utils.copyToClipboard(code);
                });
            }
        },

        syncManualInput(rangeElement) {
            const manualInput = document.getElementById(rangeElement.id + 'Manual');
            if (manualInput) {
                manualInput.value = rangeElement.value;
            }
        },

        syncRangeInput(manualElement) {
            const rangeId = manualElement.id.replace('Manual', '');
            const rangeInput = document.getElementById(rangeId);
            if (rangeInput) {
                const value = Math.max(
                    parseFloat(rangeInput.min) || 0,
                    Math.min(parseFloat(rangeInput.max) || 100, parseFloat(manualElement.value) || 0)
                );
                rangeInput.value = value;
                manualElement.value = value;
                this.updateRangeValue(rangeInput);
            }
        },

        updateRangeValue(element) {
            const valueSpan = document.getElementById(element.id + 'Value');
            if (valueSpan) {
                if (element.id === 'shadowOpacity') {
                    valueSpan.textContent = Math.round(element.value * 100) + '%';
                } else if (element.type === 'range') {
                    valueSpan.textContent = element.value + 'px';
                }
            }
        },

        updatePreview() {
            const values = this.getValues();
            const previewElement = document.getElementById('shadowPreviewElement');
            const previewContainer = document.getElementById('shadowPreviewContainer');
            const codeElement = document.getElementById('shadowCode');

            if (previewElement && previewContainer && codeElement) {
                // Update preview
                previewContainer.style.backgroundColor = values.previewBg;
                previewElement.style.backgroundColor = values.elementBg;
                previewElement.style.boxShadow = values.boxShadow;

                // Update code
                codeElement.textContent = `box-shadow: ${values.boxShadow};`;
            }
        },

        getValues() {
            const x = document.getElementById('shadowX')?.value || '10';
            const y = document.getElementById('shadowY')?.value || '10';
            const blur = document.getElementById('shadowBlur')?.value || '5';
            const spread = document.getElementById('shadowSpread')?.value || '0';

            const xUnit = document.getElementById('shadowXUnit')?.value || 'px';
            const yUnit = document.getElementById('shadowYUnit')?.value || 'px';
            const blurUnit = document.getElementById('shadowBlurUnit')?.value || 'px';
            const spreadUnit = document.getElementById('shadowSpreadUnit')?.value || 'px'; const color = document.getElementById('shadowColor')?.value || '#000000';
            const opacity = document.getElementById('shadowOpacity')?.value || '1';
            const inset = document.getElementById('shadowInset')?.checked || false;
            const previewBg = document.getElementById('previewBg')?.value || '#f0f0f0';
            const elementBg = document.getElementById('elementBg')?.value || '#ffffff';

            const rgb = utils.hexToRgb(color);
            const colorWithOpacity = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
            const boxShadow = `${inset ? 'inset ' : ''}${x}${xUnit} ${y}${yUnit} ${blur}${blurUnit} ${spread}${spreadUnit} ${colorWithOpacity}`;

            return {
                boxShadow,
                previewBg,
                elementBg
            };
        }
    };    // Gradient Tool
    const gradientTool = {
        init() {
            this.setupControls();
            this.updatePreview();
        },

        setupControls() {
            // Gradient type
            const typeRadios = document.querySelectorAll('input[name="gradientType"]');
            typeRadios.forEach(radio => {
                radio.addEventListener('change', () => {
                    this.toggleGradientControls(radio.value);
                    this.updatePreview();
                });
            });

            // Angle controls
            const angleSlider = document.getElementById('gradientAngle');
            const angleManual = document.getElementById('gradientAngleManual');

            if (angleSlider) {
                angleSlider.addEventListener('input', () => {
                    this.updateRangeValue(angleSlider);
                    this.syncManualInput(angleSlider);
                    this.updatePreview();
                });
            }

            if (angleManual) {
                angleManual.addEventListener('input', () => {
                    this.syncRangeInput(angleManual);
                    this.updatePreview();
                });
            }

            // Radial gradient controls
            const radialControls = ['radialShape', 'radialSize', 'radialPositionX', 'radialPositionY'];
            radialControls.forEach(controlId => {
                const control = document.getElementById(controlId);
                if (control) {
                    control.addEventListener('change', () => this.updatePreview());
                }
            });

            // Radial position manual inputs
            const radialPosXManual = document.getElementById('radialPositionXManual');
            const radialPosYManual = document.getElementById('radialPositionYManual');
            const radialPosXUnit = document.getElementById('radialPositionXUnit');
            const radialPosYUnit = document.getElementById('radialPositionYUnit');

            [radialPosXManual, radialPosYManual, radialPosXUnit, radialPosYUnit].forEach(element => {
                if (element) {
                    element.addEventListener('input', () => this.updatePreview());
                }
            });

            // Color stops
            this.setupColorStops();

            // Add stop button
            const addStopBtn = document.getElementById('addColorStop');
            if (addStopBtn) {
                addStopBtn.addEventListener('click', () => this.addColorStop());
            }

            // Copy button
            const copyBtn = document.getElementById('gradientCopyBtn');
            if (copyBtn) {
                copyBtn.addEventListener('click', () => {
                    const code = document.getElementById('gradientCode').textContent;
                    utils.copyToClipboard(code);
                });
            }
        },

        syncManualInput(rangeElement) {
            const manualInput = document.getElementById(rangeElement.id + 'Manual');
            if (manualInput) {
                manualInput.value = rangeElement.value;
            }
        },

        syncRangeInput(manualElement) {
            const rangeId = manualElement.id.replace('Manual', '');
            const rangeInput = document.getElementById(rangeId);
            if (rangeInput) {
                const value = Math.max(
                    parseFloat(rangeInput.min) || 0,
                    Math.min(parseFloat(rangeInput.max) || 360, parseFloat(manualElement.value) || 0)
                );
                rangeInput.value = value;
                manualElement.value = value;
                this.updateRangeValue(rangeInput);
            }
        },

        toggleGradientControls(type) {
            const linearControls = document.getElementById('linearControls');
            const radialControls = document.getElementById('radialControls');

            if (type === 'linear') {
                linearControls?.classList.remove('hidden');
                radialControls?.classList.add('hidden');
            } else {
                linearControls?.classList.add('hidden');
                radialControls?.classList.remove('hidden');
            }
        },

        setupColorStops() {
            const colorStops = document.querySelectorAll('.color-stop');
            colorStops.forEach(stop => this.setupColorStop(stop));
        },

        setupColorStop(stopElement) {
            const colorPicker = stopElement.querySelector('.color-picker');
            const rangeSlider = stopElement.querySelector('.range-slider');
            const manualInput = stopElement.querySelector('.manual-input');
            const unitSelect = stopElement.querySelector('.unit-select');
            const removeBtn = stopElement.querySelector('.remove-stop-btn'); if (colorPicker) {
                colorPicker.addEventListener('input', () => this.updatePreview());
            }

            if (rangeSlider) {
                rangeSlider.addEventListener('input', () => {
                    this.updateRangeValue(rangeSlider);
                    if (manualInput) {
                        manualInput.value = rangeSlider.value;
                    }
                    this.updatePreview();
                });
            }

            if (manualInput) {
                manualInput.addEventListener('input', () => {
                    if (rangeSlider) {
                        const value = Math.max(0, Math.min(100, parseFloat(manualInput.value) || 0));
                        rangeSlider.value = value;
                        manualInput.value = value;
                        this.updateRangeValue(rangeSlider);
                    }
                    this.updatePreview();
                });
            }

            if (unitSelect) {
                unitSelect.addEventListener('change', () => this.updatePreview());
            }

            if (removeBtn) {
                removeBtn.addEventListener('click', () => {
                    this.removeColorStop(stopElement);
                });
            }

            this.updateRemoveButtons();
        },

        addColorStop() {
            const colorStopsContainer = document.getElementById('colorStops');
            const stopCount = colorStopsContainer.children.length;

            const newStop = document.createElement('div');
            newStop.className = 'color-stop';
            newStop.innerHTML = `
                <input type="color" value="#00ff00" class="color-picker">
                <div class="range-container">
                    <input type="range" min="0" max="100" value="50" class="range-slider">
                    <div class="manual-input-group">
                        <input type="number" value="50" class="manual-input" step="0.1" min="0" max="100">
                        <select class="unit-select">
                            <option value="%">%</option>
                            <option value="px">px</option>
                            <option value="em">em</option>
                            <option value="rem">rem</option>
                            <option value="vw">vw</option>
                            <option value="vh">vh</option>
                        </select>
                    </div>
                </div>
                <button class="remove-stop-btn">
                    <i class="fas fa-trash"></i>
                </button>
            `;

            colorStopsContainer.appendChild(newStop);
            this.setupColorStop(newStop);
            this.updatePreview();
        },

        removeColorStop(stopElement) {
            stopElement.remove();
            this.updateRemoveButtons();
            this.updatePreview();
        },

        updateRemoveButtons() {
            const colorStops = document.querySelectorAll('.color-stop');
            const removeButtons = document.querySelectorAll('.remove-stop-btn');

            removeButtons.forEach(btn => {
                btn.disabled = colorStops.length <= 2;
            });
        },

        updateRangeValue(element) {
            const valueSpan = element.nextElementSibling;
            if (valueSpan && valueSpan.classList.contains('range-value')) {
                if (element.id === 'gradientAngle') {
                    valueSpan.textContent = element.value + '°';
                } else {
                    valueSpan.textContent = element.value + '%';
                }
            }
        },

        updatePreview() {
            const values = this.getValues();
            const previewElement = document.getElementById('gradientPreview');
            const codeElement = document.getElementById('gradientCode');

            if (previewElement && codeElement) {
                previewElement.style.background = values.gradient;
                codeElement.textContent = `background: ${values.gradient};`;
            }
        }, getValues() {
            const type = document.querySelector('input[name="gradientType"]:checked')?.value || 'linear';
            const angle = document.getElementById('gradientAngle')?.value || '45';
            const shape = document.getElementById('radialShape')?.value || 'circle';
            const size = document.getElementById('radialSize')?.value || 'farthest-corner';
            const positionX = document.getElementById('radialPositionXManual')?.value || '50';
            const positionXUnit = document.getElementById('radialPositionXUnit')?.value || '%';
            const positionY = document.getElementById('radialPositionYManual')?.value || '50';
            const positionYUnit = document.getElementById('radialPositionYUnit')?.value || '%';

            const colorStops = Array.from(document.querySelectorAll('.color-stop')).map(stop => {
                const color = stop.querySelector('.color-picker').value;
                const positionInput = stop.querySelector('.manual-input');
                const unitSelect = stop.querySelector('.unit-select');
                const position = positionInput?.value || stop.querySelector('.range-slider')?.value || '0';
                const unit = unitSelect?.value || '%';
                return `${color} ${position}${unit}`;
            }).join(', ');

            let gradient;
            if (type === 'linear') {
                gradient = `linear-gradient(${angle}deg, ${colorStops})`;
            } else {
                const position = `${positionX}${positionXUnit} ${positionY}${positionYUnit}`;
                if (shape === 'circle') {
                    gradient = `radial-gradient(circle ${size} at ${position}, ${colorStops})`;
                } else {
                    gradient = `radial-gradient(ellipse ${size} at ${position}, ${colorStops})`;
                }
            }

            return { gradient };
        }
    };

    // Flexbox Tool
    const flexboxTool = {
        init() {
            this.setupControls();
            this.setupFlexItems();
            this.updatePreview();
        }, setupControls() {
            const containerControls = [
                'flexDirection', 'justifyContent', 'alignItems',
                'flexWrap', 'alignContent', 'containerGap'
            ];

            containerControls.forEach(controlId => {
                const control = document.getElementById(controlId);
                if (control) {
                    control.addEventListener('change', () => this.updatePreview());
                    if (control.type === 'range') {
                        control.addEventListener('input', () => {
                            this.updateRangeValue(control);
                            this.syncManualInput(control);
                            this.updatePreview();
                        });
                    }
                }
            });

            // Setup manual inputs for container controls
            const containerGapManual = document.getElementById('containerGapManual');
            const containerGapUnit = document.getElementById('containerGapUnit');

            if (containerGapManual) {
                containerGapManual.addEventListener('input', () => {
                    this.syncRangeInput(containerGapManual);
                    this.updatePreview();
                });
            }

            if (containerGapUnit) {
                containerGapUnit.addEventListener('change', () => this.updatePreview());
            }

            const itemControls = ['flexGrow', 'flexShrink', 'flexBasis', 'alignSelf', 'itemWidth', 'itemHeight'];
            itemControls.forEach(controlId => {
                const control = document.getElementById(controlId);
                const manualInput = document.getElementById(controlId + 'Manual');
                const unitSelect = document.getElementById(controlId + 'Unit');

                if (control) {
                    control.addEventListener('input', () => {
                        this.updateRangeValue(control);
                        this.syncManualInput(control);
                        this.updateSelectedItemProperties();
                    });
                }

                if (manualInput) {
                    manualInput.addEventListener('input', () => {
                        this.syncRangeInput(manualInput);
                        this.updateSelectedItemProperties();
                    });
                }

                if (unitSelect) {
                    unitSelect.addEventListener('change', () => {
                        this.updateSelectedItemProperties();
                    });
                }
            });

            // Add/Remove item buttons
            const addBtn = document.getElementById('addFlexItem');
            const removeBtn = document.getElementById('removeFlexItem');

            if (addBtn) {
                addBtn.addEventListener('click', () => this.addFlexItem());
            }

            if (removeBtn) {
                removeBtn.addEventListener('click', () => this.removeFlexItem());
            }

            // Copy button
            const copyBtn = document.getElementById('flexboxCopyBtn');
            if (copyBtn) {
                copyBtn.addEventListener('click', () => {
                    const code = document.getElementById('flexboxCode').textContent;
                    utils.copyToClipboard(code);
                });
            }

            // Code tabs
            const codeTabs = document.querySelectorAll('.code-tab');
            codeTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    this.switchCodeTab(tab.getAttribute('data-tab'));
                });
            });
        },

        syncManualInput(rangeElement) {
            const manualInput = document.getElementById(rangeElement.id + 'Manual');
            if (manualInput) {
                manualInput.value = rangeElement.value;
            }
        },

        syncRangeInput(manualElement) {
            const rangeId = manualElement.id.replace('Manual', '');
            const rangeInput = document.getElementById(rangeId);
            if (rangeInput) {
                const value = Math.max(
                    parseFloat(rangeInput.min) || 0,
                    Math.min(parseFloat(rangeInput.max) || 500, parseFloat(manualElement.value) || 0)
                );
                rangeInput.value = value;
                manualElement.value = value;
                this.updateRangeValue(rangeInput);
            }
        },

        setupFlexItems() {
            const flexItems = document.querySelectorAll('.flex-item');
            flexItems.forEach(item => {
                item.addEventListener('click', () => this.selectFlexItem(item));
            });
        },

        selectFlexItem(item) {
            // Remove previous selection
            document.querySelectorAll('.flex-item').forEach(i => i.classList.remove('selected'));

            // Select new item
            item.classList.add('selected');
            state.selectedFlexItem = item;

            // Enable item controls
            this.enableItemControls();

            // Update info
            const itemInfo = document.getElementById('selectedItemInfo');
            if (itemInfo) {
                itemInfo.textContent = `Item ${item.getAttribute('data-item')} selected`;
            }

            // Load current values
            this.loadItemProperties(item);
        }, enableItemControls() {
            const controls = ['flexGrow', 'flexShrink', 'flexBasis', 'alignSelf', 'itemWidth', 'itemHeight'];
            controls.forEach(controlId => {
                const control = document.getElementById(controlId);
                const manualInput = document.getElementById(controlId + 'Manual');
                const unitSelect = document.getElementById(controlId + 'Unit');

                if (control) control.disabled = false;
                if (manualInput) manualInput.disabled = false;
                if (unitSelect) unitSelect.disabled = false;
            });
        },

        loadItemProperties(item) {
            const style = window.getComputedStyle(item);

            const controls = {
                flexGrow: { value: item.style.flexGrow || '0' },
                flexShrink: { value: item.style.flexShrink || '1' },
                flexBasis: { value: this.parseValue(item.style.flexBasis || 'auto').value, unit: this.parseValue(item.style.flexBasis || 'auto').unit },
                alignSelf: { value: item.style.alignSelf || 'auto' },
                itemWidth: { value: this.parseValue(item.style.width || 'auto').value, unit: this.parseValue(item.style.width || 'auto').unit },
                itemHeight: { value: this.parseValue(item.style.height || 'auto').value, unit: this.parseValue(item.style.height || 'auto').unit }
            };

            Object.entries(controls).forEach(([controlId, data]) => {
                const control = document.getElementById(controlId);
                const manualInput = document.getElementById(controlId + 'Manual');
                const unitSelect = document.getElementById(controlId + 'Unit');

                if (control && control.type === 'range') {
                    control.value = data.value;
                    this.updateRangeValue(control);
                } else if (control && control.type === 'select-one') {
                    control.value = data.value;
                }

                if (manualInput) {
                    manualInput.value = data.value;
                }

                if (unitSelect && data.unit) {
                    unitSelect.value = data.unit;
                }
            });
        },

        parseValue(cssValue) {
            if (!cssValue || cssValue === 'auto') {
                return { value: 0, unit: 'auto' };
            }

            const match = cssValue.match(/^(\d*\.?\d+)(.*)$/);
            if (match) {
                return { value: parseFloat(match[1]) || 0, unit: match[2] || 'px' };
            }

            return { value: 0, unit: 'auto' };
        },

        addFlexItem() {
            const container = document.getElementById('flexboxContainer');
            const itemCount = container.children.length + 1;

            const newItem = document.createElement('div');
            newItem.className = 'flex-item';
            newItem.setAttribute('data-item', itemCount.toString());
            newItem.textContent = itemCount.toString();

            newItem.addEventListener('click', () => this.selectFlexItem(newItem));
            container.appendChild(newItem);
        }, removeFlexItem() {
            const container = document.getElementById('flexboxContainer');
            if (container.children.length > 1) {
                const lastItem = container.lastElementChild;
                if (lastItem === state.selectedFlexItem) {
                    state.selectedFlexItem = null;
                    this.disableItemControls();
                }
                container.removeChild(lastItem);
            }
        },

        disableItemControls() {
            const controls = ['flexGrow', 'flexShrink', 'flexBasis', 'alignSelf', 'itemWidth', 'itemHeight'];
            controls.forEach(controlId => {
                const control = document.getElementById(controlId);
                const manualInput = document.getElementById(controlId + 'Manual');
                const unitSelect = document.getElementById(controlId + 'Unit');

                if (control) control.disabled = true;
                if (manualInput) manualInput.disabled = true;
                if (unitSelect) unitSelect.disabled = true;
            });

            const itemInfo = document.getElementById('selectedItemInfo');
            if (itemInfo) {
                itemInfo.textContent = 'Click an item to edit its properties';
            }
        },

        updateSelectedItemProperties() {
            if (!state.selectedFlexItem) return;

            const item = state.selectedFlexItem;
            const flexGrow = document.getElementById('flexGrow')?.value || '0';
            const flexShrink = document.getElementById('flexShrink')?.value || '1';
            const flexBasis = document.getElementById('flexBasis')?.value || '0';
            const flexBasisUnit = document.getElementById('flexBasisUnit')?.value || 'auto';
            const alignSelf = document.getElementById('alignSelf')?.value || 'auto';
            const itemWidth = document.getElementById('itemWidth')?.value || '0';
            const itemWidthUnit = document.getElementById('itemWidthUnit')?.value || 'auto';
            const itemHeight = document.getElementById('itemHeight')?.value || '0';
            const itemHeightUnit = document.getElementById('itemHeightUnit')?.value || 'auto';

            // Apply flex properties
            item.style.flexGrow = flexGrow;
            item.style.flexShrink = flexShrink;

            if (flexBasisUnit === 'auto' || flexBasis === '0') {
                item.style.flexBasis = 'auto';
            } else {
                item.style.flexBasis = `${flexBasis}${flexBasisUnit}`;
            }

            item.style.alignSelf = alignSelf;

            // Apply width and height
            if (itemWidthUnit === 'auto' || itemWidth === '0') {
                item.style.width = 'auto';
            } else {
                item.style.width = `${itemWidth}${itemWidthUnit}`;
            }

            if (itemHeightUnit === 'auto' || itemHeight === '0') {
                item.style.height = 'auto';
            } else {
                item.style.height = `${itemHeight}${itemHeightUnit}`;
            } this.updateCodeOutput();
        },

        updateRangeValue(element) {
            const valueSpan = document.getElementById(element.id + 'Value');
            if (valueSpan) {
                if (element.id.includes('flex') || element.id.includes('item')) {
                    if (element.id === 'flexBasis') {
                        valueSpan.textContent = element.value === '0' ? 'auto' : element.value + 'px';
                    } else if (['flexGrow', 'flexShrink'].includes(element.id)) {
                        valueSpan.textContent = element.value;
                    } else {
                        valueSpan.textContent = element.value + 'px';
                    }
                } else {
                    valueSpan.textContent = element.value;
                }
            }
        },

        switchCodeTab(tab) {
            document.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
            document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
            this.updateCodeOutput();
        },

        updatePreview() {
            const container = document.getElementById('flexboxContainer');
            if (!container) return;

            const values = this.getContainerValues();

            Object.entries(values).forEach(([property, value]) => {
                container.style[property] = value;
            });

            this.updateCodeOutput();
        },

        updateCodeOutput() {
            const activeTab = document.querySelector('.code-tab.active')?.getAttribute('data-tab') || 'container';
            const codeElement = document.getElementById('flexboxCode');

            if (activeTab === 'container') {
                const values = this.getContainerValues();
                const cssProperties = Object.entries(values)
                    .map(([prop, val]) => `  ${this.camelToKebab(prop)}: ${val};`)
                    .join('\n');

                codeElement.textContent = `.container {\n  display: flex;\n${cssProperties}\n}`;
            } else if (activeTab === 'item' && state.selectedFlexItem) {
                const itemNumber = state.selectedFlexItem.getAttribute('data-item');
                const itemProps = this.getSelectedItemValues();
                const cssProperties = Object.entries(itemProps)
                    .filter(([prop, val]) => val && val !== 'auto' && val !== '0')
                    .map(([prop, val]) => `  ${this.camelToKebab(prop)}: ${val};`)
                    .join('\n');

                if (cssProperties) {
                    codeElement.textContent = `.item-${itemNumber} {\n${cssProperties}\n}`;
                } else {
                    codeElement.textContent = `/* No custom properties for item ${itemNumber} */`;
                }
            }
        }, getContainerValues() {
            const gap = document.getElementById('containerGap')?.value || '0';
            const gapUnit = document.getElementById('containerGapUnit')?.value || 'px';

            const values = {
                flexDirection: document.getElementById('flexDirection')?.value || 'row',
                justifyContent: document.getElementById('justifyContent')?.value || 'flex-start',
                alignItems: document.getElementById('alignItems')?.value || 'stretch',
                flexWrap: document.getElementById('flexWrap')?.value || 'nowrap',
                alignContent: document.getElementById('alignContent')?.value || 'stretch'
            };

            if (gap !== '0') {
                values.gap = `${gap}${gapUnit}`;
            }

            return values;
        },

        getSelectedItemValues() {
            if (!state.selectedFlexItem) return {};

            const flexBasis = document.getElementById('flexBasis')?.value || '0';
            const flexBasisUnit = document.getElementById('flexBasisUnit')?.value || 'auto';
            const itemWidth = document.getElementById('itemWidth')?.value || '0';
            const itemWidthUnit = document.getElementById('itemWidthUnit')?.value || 'auto';
            const itemHeight = document.getElementById('itemHeight')?.value || '0';
            const itemHeightUnit = document.getElementById('itemHeightUnit')?.value || 'auto';

            const values = {
                flexGrow: document.getElementById('flexGrow')?.value || '0',
                flexShrink: document.getElementById('flexShrink')?.value || '1',
                alignSelf: document.getElementById('alignSelf')?.value || 'auto'
            };

            if (flexBasisUnit === 'auto' || flexBasis === '0') {
                values.flexBasis = 'auto';
            } else {
                values.flexBasis = `${flexBasis}${flexBasisUnit}`;
            }

            if (itemWidthUnit !== 'auto' && itemWidth !== '0') {
                values.width = `${itemWidth}${itemWidthUnit}`;
            }

            if (itemHeightUnit !== 'auto' && itemHeight !== '0') {
                values.height = `${itemHeight}${itemHeightUnit}`;
            }

            return values;
        },

        camelToKebab(str) {
            return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
        }
    };    // Clip Path Tool
    const clipPathTool = {
        init() {
            this.setupControls();
            this.setupPolygonInteraction();
            this.setupBackgroundControls();
            this.initDefaultPolygon();
            this.updatePreview();
        },

        setupControls() {
            // Shape presets
            const shapePresets = document.querySelectorAll('.shape-preset');
            shapePresets.forEach(preset => {
                preset.addEventListener('click', () => {
                    this.selectShape(preset);
                });
            });

            // Range controls
            const rangeControls = [
                'circleRadius', 'ellipseRx', 'ellipseRy', 'gradientAngle'
            ];

            rangeControls.forEach(controlId => {
                const control = document.getElementById(controlId);
                if (control) {
                    control.addEventListener('input', () => {
                        this.updateRangeValue(control);
                        this.updatePreview();
                    });
                }
            });            // Reset polygon button
            const resetBtn = document.getElementById('resetPolygon');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => this.resetPolygon());
            }

            // Clear polygon button
            const clearBtn = document.getElementById('clearPolygon');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => this.clearPolygon());
            }

            // Copy button
            const copyBtn = document.getElementById('clipPathCopyBtn');
            if (copyBtn) {
                copyBtn.addEventListener('click', () => {
                    const code = document.getElementById('clipPathCode').textContent;
                    utils.copyToClipboard(code);
                });
            }
        },

        setupBackgroundControls() {
            // Background type selector
            const backgroundTypes = document.querySelectorAll('input[name="backgroundType"]');
            backgroundTypes.forEach(radio => {
                radio.addEventListener('change', () => {
                    this.toggleBackgroundControls(radio.value);
                    this.updatePreview();
                });
            });

            // Color controls
            const colorControls = [
                'clipPathBgColor', 'clipPathGradColor1', 'clipPathGradColor2'
            ];

            colorControls.forEach(controlId => {
                const colorPicker = document.getElementById(controlId);
                const hexInput = document.getElementById(controlId + 'Hex');

                if (colorPicker && hexInput) {
                    colorPicker.addEventListener('input', () => {
                        hexInput.value = colorPicker.value;
                        this.updatePreview();
                    });

                    hexInput.addEventListener('input', () => {
                        if (this.isValidHexColor(hexInput.value)) {
                            colorPicker.value = hexInput.value;
                            this.updatePreview();
                        }
                    });
                }
            });

            // Image upload
            const imageInput = document.getElementById('clipPathBgImage');
            if (imageInput) {
                imageInput.addEventListener('change', () => this.handleImageUpload());
            }            // Image size selector
            const imageSizeSelect = document.getElementById('imageSize');
            if (imageSizeSelect) {
                imageSizeSelect.addEventListener('change', () => this.updatePreview());
            }

            // Color preset buttons
            const colorPresetBtns = document.querySelectorAll('.color-preset-btn');
            colorPresetBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const color = btn.getAttribute('data-color');
                    const colorPicker = document.getElementById('clipPathBgColor');
                    const hexInput = document.getElementById('clipPathBgColorHex');

                    if (colorPicker && hexInput) {
                        colorPicker.value = color;
                        hexInput.value = color;
                        this.updatePreview();
                    }
                });
            });
        },

        toggleBackgroundControls(type) {
            const controls = ['colorBackground', 'gradientBackground', 'imageBackground'];

            controls.forEach(controlId => {
                const element = document.getElementById(controlId);
                if (element) {
                    element.classList.add('hidden');
                }
            });

            const activeControl = document.getElementById(type + 'Background');
            if (activeControl) {
                activeControl.classList.remove('hidden');
            }
        },

        handleImageUpload() {
            const input = document.getElementById('clipPathBgImage');
            const file = input.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    state.clipPathBackgroundImage = e.target.result;
                    this.updatePreview();
                };
                reader.readAsDataURL(file);
            }
        },

        isValidHexColor(hex) {
            return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
        }, selectShape(preset) {
            document.querySelectorAll('.shape-preset').forEach(p => p.classList.remove('active'));
            preset.classList.add('active');

            const shape = preset.getAttribute('data-shape');
            state.clipPathMode = shape;

            this.toggleShapeControls(shape);
            this.updatePreview();

            // Initialize polygon points for custom polygon mode
            if (shape === 'polygon') {
                this.initDefaultPolygon();
            }

            // Clear polygon points for preset shapes (they use fixed coordinates)
            if (['hexagon', 'star', 'diamond', 'arrow', 'triangle'].includes(shape)) {
                state.clipPathPoints = [];
                this.renderPolygonPoints();
            }
        },

        toggleShapeControls(shape) {
            const circleControls = document.getElementById('circleControls');
            const ellipseControls = document.getElementById('ellipseControls');

            // Hide all controls first
            circleControls?.classList.add('hidden');
            ellipseControls?.classList.add('hidden');

            // Show relevant controls
            if (shape === 'circle') {
                circleControls?.classList.remove('hidden');
            } else if (shape === 'ellipse') {
                ellipseControls?.classList.remove('hidden');
            }
        },

        setupPolygonInteraction() {
            const preview = document.getElementById('clipPathPreview');
            if (!preview) return;

            preview.addEventListener('click', (e) => {
                if (state.clipPathMode === 'polygon') {
                    this.addPolygonPoint(e);
                }
            });
        }, addPolygonPoint(e) {
            const preview = document.getElementById('clipPathPreview');
            const rect = preview.getBoundingClientRect();

            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            state.clipPathPoints.push({ x, y });
            this.renderPolygonPoints();
            this.updatePointCount();
            this.updatePreview();
        },

        initDefaultPolygon() {
            state.clipPathPoints = [
                { x: 25, y: 25 },
                { x: 75, y: 25 },
                { x: 75, y: 75 },
                { x: 25, y: 75 }
            ];
            this.renderPolygonPoints();
            this.updatePointCount();
        }, resetPolygon() {
            state.clipPathPoints = [];
            this.renderPolygonPoints();
            this.updatePointCount();
            this.updatePreview();
        },

        clearPolygon() {
            state.clipPathPoints = [];
            this.renderPolygonPoints();
            this.updatePointCount();
            this.updatePreview();
        },

        updatePointCount() {
            const pointCountElement = document.getElementById('pointCount');
            if (pointCountElement) {
                pointCountElement.textContent = `Points: ${state.clipPathPoints.length}`;
            }
        },

        renderPolygonPoints() {
            const pointsContainer = document.getElementById('polygonPoints');
            if (!pointsContainer) return;

            pointsContainer.innerHTML = '';

            state.clipPathPoints.forEach((point, index) => {
                const pointElement = document.createElement('div');
                pointElement.className = 'polygon-point';
                pointElement.style.left = point.x + '%';
                pointElement.style.top = point.y + '%';
                pointElement.setAttribute('data-index', index);

                this.makePointDraggable(pointElement);
                pointsContainer.appendChild(pointElement);
            });
        }, makePointDraggable(pointElement) {
            let isDragging = false;

            pointElement.addEventListener('mousedown', (e) => {
                isDragging = true;
                e.preventDefault();
            });

            // Right-click to remove point
            pointElement.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const index = parseInt(pointElement.getAttribute('data-index'));
                this.removePolygonPoint(index);
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;

                const preview = document.getElementById('clipPathPreview');
                const rect = preview.getBoundingClientRect();
                const index = parseInt(pointElement.getAttribute('data-index'));

                const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

                state.clipPathPoints[index] = { x, y };
                pointElement.style.left = x + '%';
                pointElement.style.top = y + '%';

                this.updatePreview();
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });
        },

        removePolygonPoint(index) {
            if (state.clipPathPoints.length > 3) { // Keep minimum 3 points for a polygon
                state.clipPathPoints.splice(index, 1);
                this.renderPolygonPoints();
                this.updatePointCount();
                this.updatePreview();
            }
        },

        updateRangeValue(element) {
            const valueSpan = document.getElementById(element.id + 'Value');
            if (valueSpan) {
                valueSpan.textContent = element.value + '%';
            }
        }, updatePreview() {
            const clipPath = this.generateClipPath();
            const element = document.getElementById('clipPathElement');
            const codeElement = document.getElementById('clipPathCode');

            if (element && codeElement) {
                element.style.clipPath = clipPath;
                this.updateBackground(element);
                codeElement.textContent = `clip-path: ${clipPath};`;
            }
        },

        updateBackground(element) {
            const backgroundType = document.querySelector('input[name="backgroundType"]:checked')?.value || 'color';

            switch (backgroundType) {
                case 'color':
                    const bgColor = document.getElementById('clipPathBgColor')?.value || '#6366f1';
                    element.style.background = bgColor;
                    break;

                case 'gradient':
                    const color1 = document.getElementById('clipPathGradColor1')?.value || '#6366f1';
                    const color2 = document.getElementById('clipPathGradColor2')?.value || '#8b5cf6';
                    const angle = document.getElementById('gradientAngle')?.value || '45';
                    element.style.background = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
                    break;

                case 'image':
                    if (state.clipPathBackgroundImage) {
                        const imageSize = document.getElementById('imageSize')?.value || 'cover';
                        element.style.background = `url(${state.clipPathBackgroundImage})`;
                        element.style.backgroundSize = imageSize;
                        element.style.backgroundPosition = 'center';
                        element.style.backgroundRepeat = 'no-repeat';
                    } else {
                        // Fallback to default gradient if no image uploaded
                        element.style.background = 'linear-gradient(45deg, #6366f1, #8b5cf6)';
                    }
                    break;

                default:
                    element.style.background = 'linear-gradient(45deg, #6366f1, #8b5cf6)';
            }
        }, generateClipPath() {
            switch (state.clipPathMode) {
                case 'circle':
                    const radius = document.getElementById('circleRadius')?.value || '50';
                    return `circle(${radius}% at 50% 50%)`;

                case 'ellipse':
                    const rx = document.getElementById('ellipseRx')?.value || '50';
                    const ry = document.getElementById('ellipseRy')?.value || '30';
                    return `ellipse(${rx}% ${ry}% at 50% 50%)`;

                case 'triangle':
                    return 'polygon(50% 0%, 0% 100%, 100% 100%)';

                case 'hexagon':
                    return 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';

                case 'star':
                    return 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';

                case 'diamond':
                    return 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';

                case 'arrow':
                    return 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)';

                case 'polygon':
                    if (state.clipPathPoints.length < 3) {
                        return 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';
                    }
                    const points = state.clipPathPoints
                        .map(point => `${point.x.toFixed(1)}% ${point.y.toFixed(1)}%`)
                        .join(', ');
                    return `polygon(${points})`;

                default:
                    return 'none';
            }
        }
    };

    // RegEx Tool
    const regexTool = {
        init() {
            this.setupControls();
            this.testRegex();
        },

        setupControls() {
            const pattern = document.getElementById('regexPattern');
            const testString = document.getElementById('testString');
            const flags = document.querySelectorAll('input[type="checkbox"][id^="flag"]');

            [pattern, testString].forEach(element => {
                if (element) {
                    element.addEventListener('input', utils.debounce(() => this.testRegex(), 300));
                }
            });

            flags.forEach(flag => {
                flag.addEventListener('change', () => this.testRegex());
            });

            // Action buttons
            const testBtn = document.getElementById('testRegex');
            const clearBtn = document.getElementById('clearRegex');

            if (testBtn) {
                testBtn.addEventListener('click', () => this.testRegex());
            }

            if (clearBtn) {
                clearBtn.addEventListener('click', () => this.clearRegex());
            }
        },

        clearRegex() {
            document.getElementById('regexPattern').value = '';
            document.getElementById('testString').value = '';
            document.querySelectorAll('input[type="checkbox"][id^="flag"]').forEach(cb => cb.checked = false);
            this.testRegex();
        },

        testRegex() {
            const pattern = document.getElementById('regexPattern').value;
            const testString = document.getElementById('testString').value;
            const errorElement = document.getElementById('regexError');
            const highlightedElement = document.getElementById('highlightedText');
            const matchCountElement = document.getElementById('matchCount');
            const matchesContentElement = document.getElementById('matchesContent');

            // Clear previous error
            errorElement.textContent = '';

            if (!pattern) {
                highlightedElement.innerHTML = '<p>Enter a regex pattern to see matches highlighted here.</p>';
                matchCountElement.textContent = '0 matches found';
                matchesContentElement.innerHTML = '<p>No matches found</p>';
                return;
            }

            try {
                const flags = this.getFlags();
                const regex = new RegExp(pattern, flags);
                const matches = [...testString.matchAll(regex)];

                this.highlightMatches(testString, matches);
                this.displayMatches(matches);
                this.updateMatchCount(matches.length);

            } catch (error) {
                errorElement.textContent = `Error: ${error.message}`;
                highlightedElement.innerHTML = `<p style="color: var(--error-color);">Invalid regex pattern</p>`;
                matchCountElement.textContent = '0 matches found';
                matchesContentElement.innerHTML = '<p>No matches found</p>';
            }
        },

        getFlags() {
            let flags = '';
            if (document.getElementById('flagGlobal').checked) flags += 'g';
            if (document.getElementById('flagIgnoreCase').checked) flags += 'i';
            if (document.getElementById('flagMultiline').checked) flags += 'm';
            return flags;
        },

        highlightMatches(text, matches) {
            const highlightedElement = document.getElementById('highlightedText');

            if (matches.length === 0) {
                highlightedElement.textContent = text || 'No matches found';
                return;
            }

            let highlightedText = text;
            let offset = 0;

            // Sort matches by index to highlight from end to beginning
            const sortedMatches = [...matches].sort((a, b) => b.index - a.index);

            sortedMatches.forEach(match => {
                const start = match.index;
                const end = start + match[0].length;
                const before = highlightedText.substring(0, start);
                const matchText = highlightedText.substring(start, end);
                const after = highlightedText.substring(end);

                highlightedText = before + `<span class="match-highlight">${matchText}</span>` + after;
            });

            highlightedElement.innerHTML = highlightedText;
        },

        displayMatches(matches) {
            const matchesContentElement = document.getElementById('matchesContent');

            if (matches.length === 0) {
                matchesContentElement.innerHTML = '<p>No matches found</p>';
                return;
            }

            const matchesHtml = matches.map((match, index) => {
                let html = `<div class="match-item">`;
                html += `<div><strong>Match ${index + 1}:</strong> <span class="match-text">"${match[0]}"</span></div>`;
                html += `<div><strong>Position:</strong> ${match.index}-${match.index + match[0].length}</div>`;

                if (match.length > 1) {
                    html += '<div class="match-groups"><strong>Groups:</strong>';
                    for (let i = 1; i < match.length; i++) {
                        html += ` [${i}]: "${match[i] || ''}"`;
                    }
                    html += '</div>';
                }

                html += '</div>';
                return html;
            }).join('');

            matchesContentElement.innerHTML = matchesHtml;
        },

        updateMatchCount(count) {
            const matchCountElement = document.getElementById('matchCount');
            matchCountElement.textContent = `${count} match${count !== 1 ? 'es' : ''} found`;
        }
    };

    // Contrast Checker Tool
    const contrastTool = {
        init() {
            this.setupControls();
            this.updatePreview();
        },

        setupControls() {
            const textColor = document.getElementById('textColor');
            const backgroundColor = document.getElementById('backgroundColor');
            const textColorHex = document.getElementById('textColorHex');
            const backgroundColorHex = document.getElementById('backgroundColorHex');

            // Color picker changes
            if (textColor) {
                textColor.addEventListener('input', () => {
                    textColorHex.value = textColor.value;
                    this.updatePreview();
                });
            }

            if (backgroundColor) {
                backgroundColor.addEventListener('input', () => {
                    backgroundColorHex.value = backgroundColor.value;
                    this.updatePreview();
                });
            }

            // Hex input changes
            if (textColorHex) {
                textColorHex.addEventListener('input', () => {
                    if (this.isValidHex(textColorHex.value)) {
                        textColor.value = textColorHex.value;
                        this.updatePreview();
                    }
                });
            }

            if (backgroundColorHex) {
                backgroundColorHex.addEventListener('input', () => {
                    if (this.isValidHex(backgroundColorHex.value)) {
                        backgroundColor.value = backgroundColorHex.value;
                        this.updatePreview();
                    }
                });
            }

            // Swap colors button
            const swapBtn = document.getElementById('swapColors');
            if (swapBtn) {
                swapBtn.addEventListener('click', () => this.swapColors());
            }

            // Color presets
            const colorPresets = document.querySelectorAll('.color-preset');
            colorPresets.forEach(preset => {
                preset.addEventListener('click', () => {
                    const textColor = preset.getAttribute('data-text');
                    const bgColor = preset.getAttribute('data-bg');
                    this.setColors(textColor, bgColor);
                });
            });
        },

        isValidHex(hex) {
            return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
        },

        setColors(textColor, backgroundColor) {
            document.getElementById('textColor').value = textColor;
            document.getElementById('backgroundColor').value = backgroundColor;
            document.getElementById('textColorHex').value = textColor;
            document.getElementById('backgroundColorHex').value = backgroundColor;
            this.updatePreview();
        },

        swapColors() {
            const textColor = document.getElementById('textColor').value;
            const backgroundColor = document.getElementById('backgroundColor').value;
            this.setColors(backgroundColor, textColor);
        },

        updatePreview() {
            const textColor = document.getElementById('textColor').value;
            const backgroundColor = document.getElementById('backgroundColor').value;

            // Update preview
            const normalText = document.getElementById('normalText');
            const largeText = document.getElementById('largeText');
            const contrastPreview = document.getElementById('contrastPreview');

            if (normalText && largeText && contrastPreview) {
                contrastPreview.style.backgroundColor = backgroundColor;
                normalText.style.color = textColor;
                largeText.style.color = textColor;
                normalText.style.backgroundColor = backgroundColor;
                largeText.style.backgroundColor = backgroundColor;
            }

            // Calculate and display contrast ratio
            const ratio = utils.getContrastRatio(textColor, backgroundColor);
            this.displayContrastRatio(ratio);
            this.updateCompliance(ratio);
        },

        displayContrastRatio(ratio) {
            const ratioElement = document.getElementById('contrastRatio');
            if (ratioElement) {
                ratioElement.textContent = `${ratio.toFixed(2)}:1`;
            }
        },

        updateCompliance(ratio) {
            const levels = [
                { id: 'aaNormal', threshold: 4.5 },
                { id: 'aaLarge', threshold: 3 },
                { id: 'aaaNormal', threshold: 7 },
                { id: 'aaaLarge', threshold: 4.5 }
            ];

            levels.forEach(level => {
                const element = document.getElementById(level.id);
                if (element) {
                    const passes = ratio >= level.threshold;
                    element.className = `compliance-status ${passes ? 'pass' : 'fail'}`;

                    const icon = element.querySelector('i');
                    const text = element.querySelector('span');

                    if (icon && text) {
                        icon.className = passes ? 'fas fa-check' : 'fas fa-times';
                        text.textContent = passes ? 'PASS' : 'FAIL';
                    }
                }
            });
        }
    };

    // Initialize application
    function init() {
        // Initialize theme management
        themeManager.init();

        // Initialize navigation
        navigationManager.init();

        // Initialize tools
        boxShadowTool.init();
        gradientTool.init();
        flexboxTool.init();
        clipPathTool.init();
        regexTool.init();
        contrastTool.init();

        console.log('DevTools Suite initialized successfully!');
    }

    // Start the application when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
