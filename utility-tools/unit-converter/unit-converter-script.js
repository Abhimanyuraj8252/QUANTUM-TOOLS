// QUANTUM TOOLS - Advanced Unit Converter
// Complete JavaScript Implementation

// Wait for DOM and all resources to load
window.addEventListener('load', () => {
    // Initialize after everything is loaded
    setTimeout(initConverter, 500);
});

document.addEventListener('DOMContentLoaded', initConverter);

function initConverter() {
    // DOM Elements with safety checks
    const preloader = document.querySelector('.preloader');
    const categorySelect = document.getElementById('category-select');
    const fromValueInput = document.getElementById('from-value');
    const fromUnitSelect = document.getElementById('from-unit');
    const toUnitSelect = document.getElementById('to-unit');
    const resultElement = document.getElementById('result');
    const formulaText = document.getElementById('formula-text');
    const swapButton = document.querySelector('.swap-button');
    const micButton = document.getElementById('mic-button');
    const copyButton = document.querySelector('.copy-button');
    const quickConversionsContainer = document.getElementById('quick-conversions');
    const historyList = document.getElementById('history-list');
    const clearHistoryButton = document.getElementById('clear-history');
    const conversionChart = document.getElementById('conversion-chart');
    
    // Early return if essential elements are missing
    if (!categorySelect || !fromValueInput || !fromUnitSelect || !toUnitSelect || !resultElement) {
        console.error('Essential DOM elements not found');
        return;
    }
    
    // State variables
    let conversionHistory = JSON.parse(localStorage.getItem('conversionHistory')) || [];
    let chart = null;
    let recognition = null;
    
    // Unit definitions with conversion factors to base units
    const unitCategories = {
        length: {
            name: 'Length',
            baseUnit: 'meter',
            units: {
                meter: { factor: 1, symbol: 'm', name: 'Meter' },
                kilometer: { factor: 1000, symbol: 'km', name: 'Kilometer' },
                centimeter: { factor: 0.01, symbol: 'cm', name: 'Centimeter' },
                millimeter: { factor: 0.001, symbol: 'mm', name: 'Millimeter' },
                inch: { factor: 0.0254, symbol: 'in', name: 'Inch' },
                foot: { factor: 0.3048, symbol: 'ft', name: 'Foot' },
                yard: { factor: 0.9144, symbol: 'yd', name: 'Yard' },
                mile: { factor: 1609.34, symbol: 'mi', name: 'Mile' },
                nautical_mile: { factor: 1852, symbol: 'nmi', name: 'Nautical Mile' },
                micrometer: { factor: 0.000001, symbol: 'μm', name: 'Micrometer' },
                nanometer: { factor: 0.000000001, symbol: 'nm', name: 'Nanometer' }
            }
        },
        weight: {
            name: 'Weight / Mass',
            baseUnit: 'kilogram',
            units: {
                kilogram: { factor: 1, symbol: 'kg', name: 'Kilogram' },
                gram: { factor: 0.001, symbol: 'g', name: 'Gram' },
                pound: { factor: 0.453592, symbol: 'lb', name: 'Pound' },
                ounce: { factor: 0.0283495, symbol: 'oz', name: 'Ounce' },
                ton: { factor: 1000, symbol: 't', name: 'Metric Ton' },
                stone: { factor: 6.35029, symbol: 'st', name: 'Stone' },
                milligram: { factor: 0.000001, symbol: 'mg', name: 'Milligram' },
                microgram: { factor: 0.000000001, symbol: 'μg', name: 'Microgram' }
            }
        },
        temperature: {
            name: 'Temperature',
            baseUnit: 'celsius',
            units: {
                celsius: { symbol: '°C', name: 'Celsius' },
                fahrenheit: { symbol: '°F', name: 'Fahrenheit' },
                kelvin: { symbol: 'K', name: 'Kelvin' },
                rankine: { symbol: '°R', name: 'Rankine' }
            }
        },
        time: {
            name: 'Time',
            baseUnit: 'second',
            units: {
                second: { factor: 1, symbol: 's', name: 'Second' },
                minute: { factor: 60, symbol: 'min', name: 'Minute' },
                hour: { factor: 3600, symbol: 'h', name: 'Hour' },
                day: { factor: 86400, symbol: 'd', name: 'Day' },
                week: { factor: 604800, symbol: 'wk', name: 'Week' },
                month: { factor: 2629746, symbol: 'mo', name: 'Month' },
                year: { factor: 31556952, symbol: 'yr', name: 'Year' },
                millisecond: { factor: 0.001, symbol: 'ms', name: 'Millisecond' },
                microsecond: { factor: 0.000001, symbol: 'μs', name: 'Microsecond' }
            }
        },
        area: {
            name: 'Area',
            baseUnit: 'square_meter',
            units: {
                square_meter: { factor: 1, symbol: 'm²', name: 'Square Meter' },
                square_kilometer: { factor: 1000000, symbol: 'km²', name: 'Square Kilometer' },
                square_centimeter: { factor: 0.0001, symbol: 'cm²', name: 'Square Centimeter' },
                square_inch: { factor: 0.00064516, symbol: 'in²', name: 'Square Inch' },
                square_foot: { factor: 0.092903, symbol: 'ft²', name: 'Square Foot' },
                square_yard: { factor: 0.836127, symbol: 'yd²', name: 'Square Yard' },
                acre: { factor: 4046.86, symbol: 'ac', name: 'Acre' },
                hectare: { factor: 10000, symbol: 'ha', name: 'Hectare' }
            }
        },
        volume: {
            name: 'Volume',
            baseUnit: 'liter',
            units: {
                liter: { factor: 1, symbol: 'L', name: 'Liter' },
                milliliter: { factor: 0.001, symbol: 'mL', name: 'Milliliter' },
                cubic_meter: { factor: 1000, symbol: 'm³', name: 'Cubic Meter' },
                cubic_centimeter: { factor: 0.001, symbol: 'cm³', name: 'Cubic Centimeter' },
                gallon_us: { factor: 3.78541, symbol: 'gal (US)', name: 'US Gallon' },
                gallon_uk: { factor: 4.54609, symbol: 'gal (UK)', name: 'UK Gallon' },
                quart: { factor: 0.946353, symbol: 'qt', name: 'Quart' },
                pint: { factor: 0.473176, symbol: 'pt', name: 'Pint' },
                cup: { factor: 0.236588, symbol: 'cup', name: 'Cup' },
                fluid_ounce: { factor: 0.0295735, symbol: 'fl oz', name: 'Fluid Ounce' }
            }
        },
        speed: {
            name: 'Speed',
            baseUnit: 'meter_per_second',
            units: {
                meter_per_second: { factor: 1, symbol: 'm/s', name: 'Meter per Second' },
                kilometer_per_hour: { factor: 0.277778, symbol: 'km/h', name: 'Kilometer per Hour' },
                mile_per_hour: { factor: 0.44704, symbol: 'mph', name: 'Mile per Hour' },
                foot_per_second: { factor: 0.3048, symbol: 'ft/s', name: 'Foot per Second' },
                knot: { factor: 0.514444, symbol: 'kn', name: 'Knot' },
                mach: { factor: 343, symbol: 'M', name: 'Mach' }
            }
        },
        data: {
            name: 'Data Storage',
            baseUnit: 'byte',
            units: {
                bit: { factor: 0.125, symbol: 'bit', name: 'Bit' },
                byte: { factor: 1, symbol: 'B', name: 'Byte' },
                kilobyte: { factor: 1024, symbol: 'KB', name: 'Kilobyte' },
                megabyte: { factor: 1048576, symbol: 'MB', name: 'Megabyte' },
                gigabyte: { factor: 1073741824, symbol: 'GB', name: 'Gigabyte' },
                terabyte: { factor: 1099511627776, symbol: 'TB', name: 'Terabyte' },
                petabyte: { factor: 1125899906842624, symbol: 'PB', name: 'Petabyte' }
            }
        },
        energy: {
            name: 'Energy',
            baseUnit: 'joule',
            units: {
                joule: { factor: 1, symbol: 'J', name: 'Joule' },
                kilojoule: { factor: 1000, symbol: 'kJ', name: 'Kilojoule' },
                calorie: { factor: 4.184, symbol: 'cal', name: 'Calorie' },
                kilocalorie: { factor: 4184, symbol: 'kcal', name: 'Kilocalorie' },
                watt_hour: { factor: 3600, symbol: 'Wh', name: 'Watt Hour' },
                kilowatt_hour: { factor: 3600000, symbol: 'kWh', name: 'Kilowatt Hour' },
                btu: { factor: 1055.06, symbol: 'BTU', name: 'British Thermal Unit' }
            }
        },
        pressure: {
            name: 'Pressure',
            baseUnit: 'pascal',
            units: {
                pascal: { factor: 1, symbol: 'Pa', name: 'Pascal' },
                kilopascal: { factor: 1000, symbol: 'kPa', name: 'Kilopascal' },
                bar: { factor: 100000, symbol: 'bar', name: 'Bar' },
                atmosphere: { factor: 101325, symbol: 'atm', name: 'Atmosphere' },
                psi: { factor: 6894.76, symbol: 'psi', name: 'Pounds per Square Inch' },
                torr: { factor: 133.322, symbol: 'Torr', name: 'Torr' },
                mmhg: { factor: 133.322, symbol: 'mmHg', name: 'Millimeter of Mercury' }
            }
        }
    };

    // Quick conversion presets for each category
    const quickConversions = {
        length: [
            { from: 'meter', to: 'foot', label: 'm → ft' },
            { from: 'kilometer', to: 'mile', label: 'km → mi' },
            { from: 'inch', to: 'centimeter', label: 'in → cm' },
            { from: 'foot', to: 'meter', label: 'ft → m' }
        ],
        weight: [
            { from: 'kilogram', to: 'pound', label: 'kg → lb' },
            { from: 'pound', to: 'kilogram', label: 'lb → kg' },
            { from: 'gram', to: 'ounce', label: 'g → oz' },
            { from: 'ounce', to: 'gram', label: 'oz → g' }
        ],
        temperature: [
            { from: 'celsius', to: 'fahrenheit', label: '°C → °F' },
            { from: 'fahrenheit', to: 'celsius', label: '°F → °C' },
            { from: 'kelvin', to: 'celsius', label: 'K → °C' },
            { from: 'celsius', to: 'kelvin', label: '°C → K' }
        ],
        time: [
            { from: 'hour', to: 'minute', label: 'h → min' },
            { from: 'day', to: 'hour', label: 'd → h' },
            { from: 'year', to: 'day', label: 'yr → d' },
            { from: 'second', to: 'millisecond', label: 's → ms' }
        ],
        area: [
            { from: 'square_meter', to: 'square_foot', label: 'm² → ft²' },
            { from: 'acre', to: 'hectare', label: 'ac → ha' },
            { from: 'square_kilometer', to: 'square_mile', label: 'km² → mi²' }
        ],
        volume: [
            { from: 'liter', to: 'gallon_us', label: 'L → gal' },
            { from: 'gallon_us', to: 'liter', label: 'gal → L' },
            { from: 'cup', to: 'milliliter', label: 'cup → mL' }
        ],
        speed: [
            { from: 'kilometer_per_hour', to: 'mile_per_hour', label: 'km/h → mph' },
            { from: 'mile_per_hour', to: 'kilometer_per_hour', label: 'mph → km/h' },
            { from: 'meter_per_second', to: 'kilometer_per_hour', label: 'm/s → km/h' }
        ],
        data: [
            { from: 'megabyte', to: 'gigabyte', label: 'MB → GB' },
            { from: 'gigabyte', to: 'terabyte', label: 'GB → TB' },
            { from: 'byte', to: 'kilobyte', label: 'B → KB' }
        ],
        energy: [
            { from: 'joule', to: 'calorie', label: 'J → cal' },
            { from: 'kilocalorie', to: 'kilojoule', label: 'kcal → kJ' },
            { from: 'kilowatt_hour', to: 'joule', label: 'kWh → J' }
        ],
        pressure: [
            { from: 'pascal', to: 'bar', label: 'Pa → bar' },
            { from: 'atmosphere', to: 'psi', label: 'atm → psi' },
            { from: 'bar', to: 'psi', label: 'bar → psi' }
        ]
    };    // Initialize the converter
    function init() {
        try {
            // Handle preloader
            if (preloader) {
                setTimeout(() => {
                    preloader.classList.add('fade-out');
                    setTimeout(() => {
                        preloader.style.display = 'none';
                    }, 500);
                }, 1000);
            }

            // Initialize voice recognition if available
            initVoiceRecognition();

            // Populate initial units
            populateUnits();

            // Setup event listeners
            setupEventListeners();

            // Load conversion history
            displayHistory();

            // Setup keyboard shortcuts
            setupKeyboardShortcuts();

            // Initialize chart
            initChart();

            // Update quick conversions
            updateQuickConversions();

            // Set default value for testing
            if (fromValueInput) {
                fromValueInput.value = '1';
                convert();
            }

            console.log('Unit converter initialized successfully');
        } catch (error) {
            console.error('Error initializing unit converter:', error);
        }
    }

    // Initialize voice recognition
    function initVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                const number = parseFloat(transcript.replace(/[^\d.-]/g, ''));
                if (!isNaN(number)) {
                    fromValueInput.value = number;
                    convert();
                }
                micButton.classList.remove('recording');
            };

            recognition.onerror = () => {
                micButton.classList.remove('recording');
            };

            recognition.onend = () => {
                micButton.classList.remove('recording');
            };
        } else {
            micButton.style.display = 'none';
        }
    }    // Setup event listeners
    function setupEventListeners() {
        try {
            if (categorySelect) {
                categorySelect.addEventListener('change', () => {
                    populateUnits();
                    updateQuickConversions();
                    convert();
                });
            }

            if (fromValueInput) {
                fromValueInput.addEventListener('input', convert);
            }
            
            if (fromUnitSelect) {
                fromUnitSelect.addEventListener('change', convert);
            }
            
            if (toUnitSelect) {
                toUnitSelect.addEventListener('change', convert);
            }

            if (swapButton) {
                swapButton.addEventListener('click', swapUnits);
            }
            
            if (copyButton) {
                copyButton.addEventListener('click', copyResult);
            }
            
            if (clearHistoryButton) {
                clearHistoryButton.addEventListener('click', clearHistory);
            }

            if (micButton && recognition) {
                micButton.addEventListener('click', startVoiceInput);
            }
        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }

    // Populate unit dropdowns
    function populateUnits() {
        const category = categorySelect.value;
        const units = unitCategories[category].units;

        // Clear existing options
        fromUnitSelect.innerHTML = '';
        toUnitSelect.innerHTML = '';

        // Populate options
        Object.keys(units).forEach(unitKey => {
            const unit = units[unitKey];
            const option = document.createElement('option');
            option.value = unitKey;
            option.textContent = `${unit.name} (${unit.symbol})`;
            
            fromUnitSelect.appendChild(option.cloneNode(true));
            toUnitSelect.appendChild(option.cloneNode(true));
        });

        // Set default selections
        const unitKeys = Object.keys(units);
        if (unitKeys.length > 1) {
            toUnitSelect.selectedIndex = 1;
        }
    }

    // Update quick conversion buttons
    function updateQuickConversions() {
        const category = categorySelect.value;
        const conversions = quickConversions[category] || [];
        
        quickConversionsContainer.innerHTML = '';
        
        conversions.forEach(conversion => {
            const button = document.createElement('button');
            button.className = 'quick-conversion-btn';
            button.textContent = conversion.label;
            button.addEventListener('click', () => {
                fromUnitSelect.value = conversion.from;
                toUnitSelect.value = conversion.to;
                convert();
            });
            quickConversionsContainer.appendChild(button);
        });
    }

    // Main conversion function
    function convert() {
        const value = parseFloat(fromValueInput.value);
        if (isNaN(value) || value === '') {
            resultElement.textContent = '0';
            formulaText.textContent = '-';
            updateChart(0);
            return;
        }

        const category = categorySelect.value;
        const fromUnit = fromUnitSelect.value;
        const toUnit = toUnitSelect.value;
        const result = performConversion(value, fromUnit, toUnit, category);

        // Display result
        resultElement.textContent = formatNumber(result);
        
        // Update formula
        const fromUnitData = unitCategories[category].units[fromUnit];
        const toUnitData = unitCategories[category].units[toUnit];
        formulaText.textContent = `${value} ${fromUnitData.symbol} = ${formatNumber(result)} ${toUnitData.symbol}`;

        // Add to history
        addToHistory(value, fromUnit, toUnit, result, category);

        // Update chart
        updateChart(result);
    }

    // Perform the actual conversion
    function performConversion(value, fromUnit, toUnit, category) {
        if (category === 'temperature') {
            return convertTemperature(value, fromUnit, toUnit);
        }

        const units = unitCategories[category].units;
        const fromFactor = units[fromUnit].factor;
        const toFactor = units[toUnit].factor;

        // Convert to base unit, then to target unit
        const baseValue = value * fromFactor;
        return baseValue / toFactor;
    }

    // Temperature conversion (special case)
    function convertTemperature(value, fromUnit, toUnit) {
        // Convert to Celsius first
        let celsius;
        switch (fromUnit) {
            case 'celsius':
                celsius = value;
                break;
            case 'fahrenheit':
                celsius = (value - 32) * 5/9;
                break;
            case 'kelvin':
                celsius = value - 273.15;
                break;
            case 'rankine':
                celsius = (value - 491.67) * 5/9;
                break;
        }

        // Convert from Celsius to target
        switch (toUnit) {
            case 'celsius':
                return celsius;
            case 'fahrenheit':
                return celsius * 9/5 + 32;
            case 'kelvin':
                return celsius + 273.15;
            case 'rankine':
                return celsius * 9/5 + 491.67;
        }
    }

    // Format number for display
    function formatNumber(num) {
        if (num === 0) return '0';
        
        const absNum = Math.abs(num);
        
        if (absNum >= 1e12) {
            return (num / 1e12).toFixed(3) + 'T';
        } else if (absNum >= 1e9) {
            return (num / 1e9).toFixed(3) + 'B';
        } else if (absNum >= 1e6) {
            return (num / 1e6).toFixed(3) + 'M';
        } else if (absNum >= 1e3) {
            return (num / 1e3).toFixed(3) + 'K';
        } else if (absNum >= 1) {
            return num.toFixed(6).replace(/\.?0+$/, '');
        } else if (absNum >= 1e-3) {
            return num.toFixed(6).replace(/\.?0+$/, '');
        } else {
            return num.toExponential(3);
        }
    }

    // Swap units
    function swapUnits() {
        const temp = fromUnitSelect.value;
        fromUnitSelect.value = toUnitSelect.value;
        toUnitSelect.value = temp;
        convert();
    }

    // Copy result to clipboard
    function copyResult() {
        const resultText = resultElement.textContent;
        const toUnitData = unitCategories[categorySelect.value].units[toUnitSelect.value];
        const fullResult = `${resultText} ${toUnitData.symbol}`;
        
        navigator.clipboard.writeText(fullResult).then(() => {
            copyButton.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                copyButton.innerHTML = '<i class="fas fa-copy"></i>';
            }, 2000);
        });
    }

    // Start voice input
    function startVoiceInput() {
        if (recognition) {
            micButton.classList.add('recording');
            recognition.start();
        }
    }

    // Add conversion to history
    function addToHistory(value, fromUnit, toUnit, result, category) {
        const fromUnitData = unitCategories[category].units[fromUnit];
        const toUnitData = unitCategories[category].units[toUnit];
        
        const historyItem = {
            timestamp: Date.now(),
            value: value,
            fromUnit: fromUnit,
            toUnit: toUnit,
            result: result,
            category: category,
            fromSymbol: fromUnitData.symbol,
            toSymbol: toUnitData.symbol
        };

        conversionHistory.unshift(historyItem);
        
        // Keep only last 20 conversions
        if (conversionHistory.length > 20) {
            conversionHistory = conversionHistory.slice(0, 20);
        }

        localStorage.setItem('conversionHistory', JSON.stringify(conversionHistory));
        displayHistory();
    }

    // Display conversion history
    function displayHistory() {
        historyList.innerHTML = '';
        
        conversionHistory.forEach(item => {
            const li = document.createElement('li');
            li.className = 'history-item';
            li.innerHTML = `
                <div class="history-conversion">
                    <span class="history-input">${formatNumber(item.value)} ${item.fromSymbol}</span>
                    <i class="fas fa-arrow-right"></i>
                    <span class="history-result">${formatNumber(item.result)} ${item.toSymbol}</span>
                </div>
                <div class="history-meta">
                    <span class="history-category">${unitCategories[item.category].name}</span>
                    <span class="history-time">${timeAgo(item.timestamp)}</span>
                </div>
            `;
            
            li.addEventListener('click', () => {
                categorySelect.value = item.category;
                populateUnits();
                fromUnitSelect.value = item.fromUnit;
                toUnitSelect.value = item.toUnit;
                fromValueInput.value = item.value;
                updateQuickConversions();
                convert();
            });
            
            historyList.appendChild(li);
        });
    }

    // Clear conversion history
    function clearHistory() {
        conversionHistory = [];
        localStorage.removeItem('conversionHistory');
        displayHistory();
    }

    // Time ago helper
    function timeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    }

    // Initialize comparison chart
    function initChart() {
        if (!conversionChart) return;

        const ctx = conversionChart.getContext('2d');
        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Unit Comparison',
                    data: [],
                    backgroundColor: 'rgba(0, 240, 255, 0.6)',
                    borderColor: 'rgba(0, 240, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                }
            }
        });
    }

    // Update chart with current conversion
    function updateChart(result) {
        if (!chart || !fromValueInput.value) return;

        const category = categorySelect.value;
        const units = unitCategories[category].units;
        const inputValue = parseFloat(fromValueInput.value);
        const fromUnit = fromUnitSelect.value;

        const chartData = [];
        const chartLabels = [];

        // Get top 5 common units for the category
        const commonUnits = Object.keys(units).slice(0, 5);
        
        commonUnits.forEach(unitKey => {
            const convertedValue = performConversion(inputValue, fromUnit, unitKey, category);
            chartData.push(convertedValue);
            chartLabels.push(units[unitKey].symbol);
        });

        chart.data.labels = chartLabels;
        chart.data.datasets[0].data = chartData;
        chart.update();
    }

    // Setup keyboard shortcuts
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.altKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        swapUnits();
                        break;
                    case 'c':
                        e.preventDefault();
                        copyResult();
                        break;
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                    case '8':
                    case '9':
                        e.preventDefault();
                        const categoryIndex = parseInt(e.key) - 1;
                        const categories = Object.keys(unitCategories);
                        if (categoryIndex < categories.length) {
                            categorySelect.value = categories[categoryIndex];
                            populateUnits();
                            updateQuickConversions();
                            convert();
                        }
                        break;
                }
            }
        });
    }

    // Initialize the application
    init();
}
