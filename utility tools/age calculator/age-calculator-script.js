// Ultra-Advanced Life Analytics Calculator - Super Powered Features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles background
    initParticles();
    
    // DOM Elements
    const birthDateInput = document.getElementById('birthDate');
    const birthTimeInput = document.getElementById('birthTime');
    const calculateBtn = document.getElementById('calculateBtn');
    const loadingSection = document.getElementById('loadingSection');
    const outputSection = document.getElementById('outputSection');
    
    // Result elements
    const elements = {
        // Countdown
        daysUntilBirthday: document.getElementById('daysUntilBirthday'),
        hoursUntilBirthday: document.getElementById('hoursUntilBirthday'),
        minutesUntilBirthday: document.getElementById('minutesUntilBirthday'),
        secondsUntilBirthday: document.getElementById('secondsUntilBirthday'),
        nextBirthdayInfo: document.getElementById('nextBirthdayInfo'),
        
        // Progress
        lifeProgressBar: document.getElementById('lifeProgressBar'),
        lifeProgressText: document.getElementById('lifeProgressText'),
        yearProgressBar: document.getElementById('yearProgressBar'),
        yearProgressText: document.getElementById('yearProgressText'),
        lifeChart: document.getElementById('lifeChart'),
        
        // Main stats
        mainAge: document.getElementById('mainAge'),
        preciseAge: document.getElementById('preciseAge'),
        totalMonths: document.getElementById('totalMonths'),
        totalWeeks: document.getElementById('totalWeeks'),
        totalDays: document.getElementById('totalDays'),
        totalHours: document.getElementById('totalHours'),
        totalMinutes: document.getElementById('totalMinutes'),
        totalSeconds: document.getElementById('totalSeconds'),
        
        // Biological stats
        heartBeats: document.getElementById('heartBeats'),
        breathsTaken: document.getElementById('breathsTaken'),
        sleepTime: document.getElementById('sleepTime'),
        
        // Cosmic info
        zodiacSign: document.getElementById('zodiacSign'),
        zodiacElement: document.getElementById('zodiacElement'),
        chineseZodiac: document.getElementById('chineseZodiac'),
        chineseElement: document.getElementById('chineseElement'),
        birthstone: document.getElementById('birthstone'),
        birthstoneColor: document.getElementById('birthstoneColor'),
        birthDay: document.getElementById('birthDay'),
        birthDayInfo: document.getElementById('birthDayInfo'),
        
        // Containers
        planetsGrid: document.getElementById('planetsGrid'),
        lifeMilestones: document.getElementById('lifeMilestones'),
        funFacts: document.getElementById('funFacts'),
        generationInfo: document.getElementById('generationInfo'),
        futureMilestones: document.getElementById('futureMilestones')
    };

    // Data collections
    const DATA = {
        zodiacSigns: [
            { name: 'Capricorn', start: { month: 12, day: 22 }, end: { month: 1, day: 19 }, symbol: '♑', element: 'Earth' },
            { name: 'Aquarius', start: { month: 1, day: 20 }, end: { month: 2, day: 18 }, symbol: '♒', element: 'Air' },
            { name: 'Pisces', start: { month: 2, day: 19 }, end: { month: 3, day: 20 }, symbol: '♓', element: 'Water' },
            { name: 'Aries', start: { month: 3, day: 21 }, end: { month: 4, day: 19 }, symbol: '♈', element: 'Fire' },
            { name: 'Taurus', start: { month: 4, day: 20 }, end: { month: 5, day: 20 }, symbol: '♉', element: 'Earth' },
            { name: 'Gemini', start: { month: 5, day: 21 }, end: { month: 6, day: 20 }, symbol: '♊', element: 'Air' },
            { name: 'Cancer', start: { month: 6, day: 21 }, end: { month: 7, day: 22 }, symbol: '♋', element: 'Water' },
            { name: 'Leo', start: { month: 7, day: 23 }, end: { month: 8, day: 22 }, symbol: '♌', element: 'Fire' },
            { name: 'Virgo', start: { month: 8, day: 23 }, end: { month: 9, day: 22 }, symbol: '♍', element: 'Earth' },
            { name: 'Libra', start: { month: 9, day: 23 }, end: { month: 10, day: 22 }, symbol: '♎', element: 'Air' },
            { name: 'Scorpio', start: { month: 10, day: 23 }, end: { month: 11, day: 21 }, symbol: '♏', element: 'Water' },
            { name: 'Sagittarius', start: { month: 11, day: 22 }, end: { month: 12, day: 21 }, symbol: '♐', element: 'Fire' }
        ],
        
        chineseZodiac: [
            { name: 'Rat', years: [1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020], element: 'Water', traits: 'Intelligent, adaptable, quick-witted' },
            { name: 'Ox', years: [1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021], element: 'Earth', traits: 'Reliable, patient, honest' },
            { name: 'Tiger', years: [1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022], element: 'Wood', traits: 'Brave, confident, competitive' },
            { name: 'Rabbit', years: [1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023], element: 'Wood', traits: 'Gentle, quiet, elegant' },
            { name: 'Dragon', years: [1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024], element: 'Earth', traits: 'Confident, intelligent, enthusiastic' },
            { name: 'Snake', years: [1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025], element: 'Fire', traits: 'Enigmatic, intelligent, wise' },
            { name: 'Horse', years: [1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026], element: 'Fire', traits: 'Animated, active, energetic' },
            { name: 'Goat', years: [1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027], element: 'Earth', traits: 'Calm, gentle, sympathetic' },
            { name: 'Monkey', years: [1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028], element: 'Metal', traits: 'Sharp, smart, curiosity' },
            { name: 'Rooster', years: [1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029], element: 'Metal', traits: 'Observant, hardworking, courageous' },
            { name: 'Dog', years: [1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030], element: 'Earth', traits: 'Lovely, honest, responsible' },
            { name: 'Pig', years: [1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031], element: 'Water', traits: 'Compassionate, generous, honest' }
        ],
        
        birthstones: [
            { month: 1, name: 'Garnet', color: 'Deep Red', meaning: 'Protection, Strength' },
            { month: 2, name: 'Amethyst', color: 'Purple', meaning: 'Peace, Courage' },
            { month: 3, name: 'Aquamarine', color: 'Light Blue', meaning: 'Serenity, Clarity' },
            { month: 4, name: 'Diamond', color: 'Clear', meaning: 'Strength, Innocence' },
            { month: 5, name: 'Emerald', color: 'Green', meaning: 'Love, Rebirth' },
            { month: 6, name: 'Pearl', color: 'White', meaning: 'Purity, Wisdom' },
            { month: 7, name: 'Ruby', color: 'Red', meaning: 'Love, Passion' },
            { month: 8, name: 'Peridot', color: 'Light Green', meaning: 'Strength, Power' },
            { month: 9, name: 'Sapphire', color: 'Blue', meaning: 'Wisdom, Royalty' },
            { month: 10, name: 'Opal', color: 'Multi-color', meaning: 'Hope, Innocence' },
            { month: 11, name: 'Topaz', color: 'Yellow', meaning: 'Friendship, Strength' },
            { month: 12, name: 'Turquoise', color: 'Blue-Green', meaning: 'Success, Protection' }
        ],
        
        planets: [
            { name: 'Mercury', yearLength: 0.24, emoji: '☿️', color: '#8C7853' },
            { name: 'Venus', yearLength: 0.62, emoji: '♀️', color: '#FFC649' },
            { name: 'Mars', yearLength: 1.88, emoji: '♂️', color: '#CD5C5C' },
            { name: 'Jupiter', yearLength: 11.86, emoji: '♃', color: '#D8CA9D' },
            { name: 'Saturn', yearLength: 29.46, emoji: '♄', color: '#FAD5A5' },
            { name: 'Uranus', yearLength: 84.01, emoji: '♅', color: '#4FD0E7' },
            { name: 'Neptune', yearLength: 164.8, emoji: '♆', color: '#4B70DD' }
        ],
        
        generations: [
            { name: 'Silent Generation', start: 1928, end: 1945, description: 'Hardworking, financially cautious, and family-oriented' },
            { name: 'Baby Boomers', start: 1946, end: 1964, description: 'Optimistic, competitive, and workaholic tendencies' },
            { name: 'Generation X', start: 1965, end: 1980, description: 'Independent, resourceful, and technology adaptors' },
            { name: 'Millennials', start: 1981, end: 1996, description: 'Tech-savvy, diverse, and socially conscious' },
            { name: 'Generation Z', start: 1997, end: 2012, description: 'Digital natives, entrepreneurial, and pragmatic' },
            { name: 'Generation Alpha', start: 2013, end: 2025, description: 'AI natives, globally connected, and environmentally aware' }
        ],
        
        lifeMilestones: [
            { age: 1, title: 'First Steps', description: 'Walking and basic mobility' },
            { age: 5, title: 'School Starts', description: 'Beginning formal education' },
            { age: 13, title: 'Teenager', description: 'Adolescence begins' },
            { age: 16, title: 'Driving Age', description: 'Independence starts' },
            { age: 18, title: 'Legal Adult', description: 'Full legal rights' },
            { age: 21, title: 'Young Adult', description: 'Complete adult status' },
            { age: 25, title: 'Brain Maturity', description: 'Full brain development' },
            { age: 30, title: 'Career Prime', description: 'Professional establishment' },
            { age: 40, title: 'Life Reflection', description: 'Mid-life assessment' },
            { age: 50, title: 'Wisdom Phase', description: 'Experience accumulation' },
            { age: 65, title: 'Retirement', description: 'Traditional retirement age' },
            { age: 75, title: 'Elder Wisdom', description: 'Senior life phase' }
        ]
    };

    // Constants
    const AVERAGE_LIFESPAN = 75;
    const HEART_RATE_PER_MINUTE = 70;
    const BREATHS_PER_MINUTE = 16;
    const SLEEP_HOURS_PER_DAY = 8;
    
    let countdownInterval;
    let lifeChart;
    
    // Event Listeners
    calculateBtn.addEventListener('click', handleCalculation);
    birthDateInput.addEventListener('keypress', (e) => e.key === 'Enter' && handleCalculation());
    
    // Set max date to today
    birthDateInput.max = new Date().toISOString().split('T')[0];

    // Main calculation handler
    async function handleCalculation() {
        const birthDateValue = birthDateInput.value;
        
        if (!birthDateValue) {
            showNotification('Please enter your birth date', 'error');
            return;
        }

        const birthDate = new Date(birthDateValue);
        const currentDate = new Date();

        if (birthDate > currentDate) {
            showNotification('Birth date cannot be in the future', 'error');
            return;
        }

        // Add birth time if provided
        if (birthTimeInput.value) {
            const [hours, minutes] = birthTimeInput.value.split(':');
            birthDate.setHours(parseInt(hours), parseInt(minutes));
        }

        // Show loading with animation
        await showLoadingAnimation();
        
        // Calculate all data
        const ageData = calculateComprehensiveAge(birthDate, currentDate);
        
        // Display all results
        displayAllResults(ageData, birthDate);
        
        // Show results with animation
        showResults();
        
        // Start real-time countdown
        startCountdown(birthDate);
        
        // Create life chart
        createLifeChart(ageData);
    }

    // Enhanced loading animation
    async function showLoadingAnimation() {
        loadingSection.classList.remove('hidden');
        outputSection.classList.add('hidden');
        
        const loadingTexts = [
            'Calculating temporal coordinates...',
            'Analyzing cosmic alignments...',
            'Processing life milestones...',
            'Computing biological statistics...',
            'Generating future predictions...',
            'Finalizing life analytics...'
        ];
        
        const loadingTextElement = document.getElementById('loadingText');
        
        for (let i = 0; i < loadingTexts.length; i++) {
            loadingTextElement.textContent = loadingTexts[i];
            await new Promise(resolve => setTimeout(resolve, 800));
        }
        
        loadingSection.classList.add('hidden');
    }

    // Comprehensive age calculation
    function calculateComprehensiveAge(birthDate, currentDate) {
        const totalMs = currentDate.getTime() - birthDate.getTime();
        
        // Basic time units
        const totalSeconds = Math.floor(totalMs / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);
        const totalWeeks = Math.floor(totalDays / 7);
        const totalMonths = Math.floor(totalDays / 30.44); // Average month length
        
        // Precise age calculation
        let years = currentDate.getFullYear() - birthDate.getFullYear();
        let months = currentDate.getMonth() - birthDate.getMonth();
        let days = currentDate.getDate() - birthDate.getDate();
        let hours = currentDate.getHours() - birthDate.getHours();
        let minutes = currentDate.getMinutes() - birthDate.getMinutes();
        let seconds = currentDate.getSeconds() - birthDate.getSeconds();
        
        // Adjust for negative values
        if (seconds < 0) { minutes--; seconds += 60; }
        if (minutes < 0) { hours--; minutes += 60; }
        if (hours < 0) { days--; hours += 24; }
        if (days < 0) {
            months--;
            const daysInPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
            days += daysInPrevMonth;
        }
        if (months < 0) { years--; months += 12; }
        
        // Biological calculations
        const heartBeats = totalMinutes * HEART_RATE_PER_MINUTE;
        const breathsTaken = totalMinutes * BREATHS_PER_MINUTE;
        const sleepHours = totalDays * SLEEP_HOURS_PER_DAY;
        
        // Life progress calculations
        const lifeProgressPercent = Math.min((years / AVERAGE_LIFESPAN) * 100, 100);
        const yearProgressPercent = ((currentDate.getMonth() * 30.44 + currentDate.getDate()) / 365.25) * 100;
        
        // Next birthday calculation
        const nextBirthday = new Date(birthDate);
        nextBirthday.setFullYear(currentDate.getFullYear());
        if (nextBirthday < currentDate) {
            nextBirthday.setFullYear(currentDate.getFullYear() + 1);
        }
        
        const msUntilBirthday = nextBirthday.getTime() - currentDate.getTime();
        const daysUntilBirthday = Math.floor(msUntilBirthday / (1000 * 60 * 60 * 24));
        const hoursUntilBirthday = Math.floor((msUntilBirthday % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutesUntilBirthday = Math.floor((msUntilBirthday % (1000 * 60 * 60)) / (1000 * 60));
        const secondsUntilBirthday = Math.floor((msUntilBirthday % (1000 * 60)) / 1000);
        
        return {
            years, months, days, hours, minutes, seconds,
            totalSeconds, totalMinutes, totalHours, totalDays, totalWeeks, totalMonths,
            heartBeats, breathsTaken, sleepHours,
            lifeProgressPercent, yearProgressPercent,
            nextBirthday, daysUntilBirthday, hoursUntilBirthday, 
            minutesUntilBirthday, secondsUntilBirthday
        };
    }

    // Display all calculated results
    function displayAllResults(ageData, birthDate) {
        // Main age display
        elements.mainAge.textContent = `${ageData.years} Years, ${ageData.months} Months, ${ageData.days} Days`;
        elements.preciseAge.textContent = `${ageData.hours}h ${ageData.minutes}m ${ageData.seconds}s`;
        
        // Time units with formatting
        elements.totalMonths.textContent = formatNumber(ageData.totalMonths);
        elements.totalWeeks.textContent = formatNumber(ageData.totalWeeks);
        elements.totalDays.textContent = formatNumber(ageData.totalDays);
        elements.totalHours.textContent = formatNumber(ageData.totalHours);
        elements.totalMinutes.textContent = formatNumber(ageData.totalMinutes);
        elements.totalSeconds.textContent = formatNumber(ageData.totalSeconds);
        
        // Biological stats
        elements.heartBeats.textContent = formatNumber(ageData.heartBeats);
        elements.breathsTaken.textContent = formatNumber(ageData.breathsTaken);
        elements.sleepTime.textContent = `${formatNumber(ageData.sleepHours)} hours`;
        
        // Progress bars
        elements.lifeProgressBar.style.width = `${ageData.lifeProgressPercent}%`;
        elements.lifeProgressText.textContent = `${ageData.lifeProgressPercent.toFixed(1)}%`;
        elements.yearProgressBar.style.width = `${ageData.yearProgressPercent}%`;
        elements.yearProgressText.textContent = `${ageData.yearProgressPercent.toFixed(1)}%`;
        
        // Cosmic information
        displayCosmicInfo(birthDate);
        
        // Planetary ages
        displayPlanetaryAges(ageData.totalDays);
        
        // Life milestones
        displayLifeMilestones(ageData.years);
        
        // Fun facts
        displayFunFacts(ageData);
        
        // Generation info
        displayGenerationInfo(birthDate.getFullYear());
        
        // Future predictions
        displayFuturePredictions(birthDate, ageData.years);
        
        // Next birthday info
        const nextAge = ageData.years + 1;
        elements.nextBirthdayInfo.innerHTML = `
            <p>Your next birthday will be your <strong>${nextAge}${getOrdinalSuffix(nextAge)}</strong> birthday!</p>
            <p>You'll be born on a <strong>${getDayName(ageData.nextBirthday.getDay())}</strong></p>
        `;
    }

    // Display cosmic information
    function displayCosmicInfo(birthDate) {
        // Western Zodiac
        const zodiac = getZodiacSign(birthDate);
        elements.zodiacSign.textContent = `${zodiac.symbol} ${zodiac.name}`;
        elements.zodiacElement.textContent = `Element: ${zodiac.element}`;
        
        // Chinese Zodiac
        const chineseSign = getChineseZodiac(birthDate.getFullYear());
        elements.chineseZodiac.textContent = `🐉 ${chineseSign.name}`;
        elements.chineseElement.textContent = chineseSign.traits;
        
        // Birthstone
        const birthstone = DATA.birthstones[birthDate.getMonth()];
        elements.birthstone.textContent = `💎 ${birthstone.name}`;
        elements.birthstoneColor.textContent = `${birthstone.color} - ${birthstone.meaning}`;
        
        // Birth day
        const dayName = getDayName(birthDate.getDay());
        elements.birthDay.textContent = dayName;
        elements.birthDayInfo.textContent = getDayInfo(birthDate.getDay());
    }

    // Display planetary ages
    function displayPlanetaryAges(totalDays) {
        const earthYears = totalDays / 365.25;
        elements.planetsGrid.innerHTML = '';
        
        DATA.planets.forEach(planet => {
            const planetAge = (earthYears / planet.yearLength).toFixed(1);
            const planetCard = document.createElement('div');
            planetCard.className = 'planet-card';
            planetCard.innerHTML = `
                <div class="planet-icon" style="color: ${planet.color}">${planet.emoji}</div>
                <div class="planet-name">${planet.name}</div>
                <div class="planet-age">${planetAge}</div>
                <div class="planet-subtitle">years old</div>
            `;
            elements.planetsGrid.appendChild(planetCard);
        });
    }

    // Display life milestones
    function displayLifeMilestones(currentAge) {
        elements.lifeMilestones.innerHTML = '';
        
        DATA.lifeMilestones.forEach(milestone => {
            const achieved = currentAge >= milestone.age;
            const milestoneItem = document.createElement('div');
            milestoneItem.className = `milestone-item ${achieved ? 'achieved' : 'future'}`;
            milestoneItem.innerHTML = `
                <div class="milestone-icon">
                    <i class="fas ${achieved ? 'fa-check-circle' : 'fa-clock'}"></i>
                </div>
                <div class="milestone-content">
                    <h4>Age ${milestone.age}: ${milestone.title}</h4>
                    <p>${milestone.description}</p>
                </div>
            `;
            elements.lifeMilestones.appendChild(milestoneItem);
        });
    }

    // Display fun facts
    function displayFunFacts(ageData) {
        const facts = [
            {
                icon: '🌍',
                title: 'Earth Rotations',
                description: `You've experienced ${formatNumber(ageData.totalDays)} Earth rotations since birth!`
            },
            {
                icon: '☀️',
                title: 'Sunrises Witnessed',
                description: `You've seen approximately ${formatNumber(ageData.totalDays)} sunrises in your lifetime!`
            },
            {
                icon: '🍕',
                title: 'Meals Consumed',
                description: `You've probably eaten around ${formatNumber(ageData.totalDays * 3)} meals!`
            },
            {
                icon: '👥',
                title: 'People Met',
                description: `Estimated ${formatNumber(Math.min(ageData.years * 100, 10000))} people encountered in your lifetime!`
            },
            {
                icon: '📚',
                title: 'Learning Hours',
                description: `Approximately ${formatNumber(ageData.years * 365 * 2)} hours spent learning new things!`
            },
            {
                icon: '😊',
                title: 'Smiles & Laughs',
                description: `You've probably smiled over ${formatNumber(ageData.totalDays * 20)} times!`
            }
        ];
        
        elements.funFacts.innerHTML = '';
        facts.forEach(fact => {
            const factCard = document.createElement('div');
            factCard.className = 'fact-card';
            factCard.innerHTML = `
                <div class="fact-icon">${fact.icon}</div>
                <h4 class="fact-title">${fact.title}</h4>
                <p class="fact-description">${fact.description}</p>
            `;
            elements.funFacts.appendChild(factCard);
        });
    }

    // Display generation information
    function displayGenerationInfo(birthYear) {
        const generation = DATA.generations.find(gen => 
            birthYear >= gen.start && birthYear <= gen.end
        ) || { name: 'Unique Generation', start: birthYear, end: birthYear, description: 'You belong to a special generational cohort!' };
        
        elements.generationInfo.innerHTML = `
            <div class="generation-name">${generation.name}</div>
            <div class="generation-years">${generation.start} - ${generation.end}</div>
            <p class="generation-description">${generation.description}</p>
        `;
    }

    // Display future predictions
    function displayFuturePredictions(birthDate, currentAge) {
        const futureMilestones = [
            { age: 25, event: 'Quarter Century' },
            { age: 30, event: 'New Decade' },
            { age: 40, event: 'Life Begins' },
            { age: 50, event: 'Half Century' },
            { age: 65, event: 'Golden Age' },
            { age: 75, event: 'Diamond Years' },
            { age: 100, event: 'Century Mark' }
        ].filter(milestone => milestone.age > currentAge);
        
        elements.futureMilestones.innerHTML = '';
        futureMilestones.slice(0, 6).forEach(milestone => {
            const futureDate = new Date(birthDate);
            futureDate.setFullYear(birthDate.getFullYear() + milestone.age);
            
            const futureCard = document.createElement('div');
            futureCard.className = 'future-card';
            futureCard.innerHTML = `
                <div class="future-age">${milestone.age}</div>
                <div class="future-event">${milestone.event}</div>
                <div class="future-date">${futureDate.toLocaleDateString()}</div>
            `;
            elements.futureMilestones.appendChild(futureCard);
        });
    }

    // Start real-time countdown
    function startCountdown(birthDate) {
        if (countdownInterval) clearInterval(countdownInterval);
        
        countdownInterval = setInterval(() => {
            const now = new Date();
            const nextBirthday = new Date(birthDate);
            nextBirthday.setFullYear(now.getFullYear());
            if (nextBirthday < now) {
                nextBirthday.setFullYear(now.getFullYear() + 1);
            }
            
            const msUntil = nextBirthday.getTime() - now.getTime();
            const days = Math.floor(msUntil / (1000 * 60 * 60 * 24));
            const hours = Math.floor((msUntil % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((msUntil % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((msUntil % (1000 * 60)) / 1000);
            
            elements.daysUntilBirthday.textContent = days;
            elements.hoursUntilBirthday.textContent = hours;
            elements.minutesUntilBirthday.textContent = minutes;
            elements.secondsUntilBirthday.textContent = seconds;
        }, 1000);
    }

    // Create life visualization chart
    function createLifeChart(ageData) {
        const ctx = elements.lifeChart.getContext('2d');
        
        if (lifeChart) lifeChart.destroy();
        
        const years = Array.from({length: AVERAGE_LIFESPAN}, (_, i) => i + 1);
        const livedYears = years.slice(0, ageData.years).map(() => 100);
        const futureYears = years.slice(ageData.years).map(() => 0);
        
        lifeChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [{
                    label: 'Years Lived',
                    data: [...livedYears, ...futureYears],
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Age (Years)', color: '#ffffff' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        ticks: { color: '#ffffff' }
                    },
                    y: {
                        display: false
                    }
                }
            }
        });
    }

    // Utility functions
    function getZodiacSign(birthDate) {
        const month = birthDate.getMonth() + 1;
        const day = birthDate.getDate();
        
        return DATA.zodiacSigns.find(sign => {
            if (sign.start.month === sign.end.month) {
                return month === sign.start.month && day >= sign.start.day && day <= sign.end.day;
            } else {
                return (month === sign.start.month && day >= sign.start.day) ||
                       (month === sign.end.month && day <= sign.end.day);
            }
        }) || DATA.zodiacSigns[0];
    }

    function getChineseZodiac(year) {
        return DATA.chineseZodiac.find(animal => 
            animal.years.includes(year)
        ) || DATA.chineseZodiac[0];
    }

    function getDayName(dayIndex) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dayIndex];
    }

    function getDayInfo(dayIndex) {
        const info = [
            'A day for rest and reflection',
            'Start of the work week',
            'Full momentum day',
            'Midweek balance point',
            'Almost there!',
            'End of work week',
            'Weekend freedom!'
        ];
        return info[dayIndex];
    }

    function getOrdinalSuffix(num) {
        const j = num % 10;
        const k = num % 100;
        if (j === 1 && k !== 11) return 'st';
        if (j === 2 && k !== 12) return 'nd';
        if (j === 3 && k !== 13) return 'rd';
        return 'th';
    }

    function formatNumber(num) {
        return new Intl.NumberFormat().format(Math.round(num));
    }

    function showResults() {
        outputSection.classList.remove('hidden');
        outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'error' ? '#ff4757' : '#00d4ff'};
            color: white;
            border-radius: 8px;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Initialize particles background
    function initParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS('particles-js', {
                particles: {
                    number: { value: 50, density: { enable: true, value_area: 800 } },
                    color: { value: '#00d4ff' },
                    shape: { type: 'circle' },
                    opacity: { value: 0.3, random: true },
                    size: { value: 3, random: true },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#00d4ff',
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

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleCalculation();
        }
    });

    // Auto-focus birth date input
    setTimeout(() => birthDateInput.focus(), 500);
});

    // Event Listeners
    calculateBtn.addEventListener('click', calculateAge);
    birthDateInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            calculateAge();
        }
    });

    // Set max date to today
    birthDateInput.max = new Date().toISOString().split('T')[0];

    // Main calculation function
    function calculateAge() {
        hideError();
        
        const birthDateValue = birthDateInput.value;
        
        if (!birthDateValue) {
            showError('Please enter your birth date.');
            return;
        }

        const birthDate = new Date(birthDateValue);
        const currentDate = new Date();

        // Validate birth date
        if (birthDate > currentDate) {
            showError('Birth date cannot be in the future.');
            return;
        }

        if (birthDate.getTime() === currentDate.getTime()) {
            showError('Welcome to the world! Please enter a past date.');
            return;
        }

        // Calculate all age metrics
        const ageData = calculateDetailedAge(birthDate, currentDate);
        
        // Display results
        displayResults(ageData, birthDate);
        
        // Show output section with animation
        outputSection.classList.remove('hidden');
        outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Calculate detailed age information
    function calculateDetailedAge(birthDate, currentDate) {
        // Calculate exact age in years, months, days
        let years = currentDate.getFullYear() - birthDate.getFullYear();
        let months = currentDate.getMonth() - birthDate.getMonth();
        let days = currentDate.getDate() - birthDate.getDate();

        // Adjust for negative days
        if (days < 0) {
            months--;
            const daysInPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
            days += daysInPrevMonth;
        }

        // Adjust for negative months
        if (months < 0) {
            years--;
            months += 12;
        }

        // Calculate total time units
        const totalMilliseconds = currentDate.getTime() - birthDate.getTime();
        const totalDaysCalc = Math.floor(totalMilliseconds / (1000 * 60 * 60 * 24));
        const totalHoursCalc = Math.floor(totalMilliseconds / (1000 * 60 * 60));
        const totalMinutesCalc = Math.floor(totalMilliseconds / (1000 * 60));
        const totalWeeksCalc = Math.floor(totalDaysCalc / 7);
        const totalMonthsCalc = years * 12 + months;

        return {
            years,
            months,
            days,
            totalMonths: totalMonthsCalc,
            totalWeeks: totalWeeksCalc,
            totalDays: totalDaysCalc,
            totalHours: totalHoursCalc,
            totalMinutes: totalMinutesCalc
        };
    }

    // Get zodiac sign based on birth date
    function getZodiacSign(birthDate) {
        const month = birthDate.getMonth() + 1; // JavaScript months are 0-indexed
        const day = birthDate.getDate();

        for (const sign of zodiacSigns) {
            if (
                (month === sign.start.month && day >= sign.start.day) ||
                (month === sign.end.month && day <= sign.end.day) ||
                (sign.start.month > sign.end.month && (month === sign.start.month || month === sign.end.month))
            ) {
                return sign;
            }
        }

        // Fallback for Capricorn (spans across year boundary)
        return zodiacSigns[0]; // Capricorn
    }

    // Calculate approximate time left based on average lifespan
    function calculateTimeLeft(birthDate, currentAge) {
        const lifeEndDate = new Date(birthDate);
        lifeEndDate.setFullYear(birthDate.getFullYear() + AVERAGE_LIFESPAN);

        const currentDate = new Date();
        
        if (currentDate >= lifeEndDate) {
            return {
                years: 0,
                months: 0,
                days: 0,
                message: "You've exceeded the average lifespan! Keep living your amazing life! 🎉"
            };
        }

        const timeLeftMs = lifeEndDate.getTime() - currentDate.getTime();
        const daysLeft = Math.floor(timeLeftMs / (1000 * 60 * 60 * 24));
        const yearsLeft = Math.floor(daysLeft / 365);
        const monthsLeft = Math.floor((daysLeft % 365) / 30);
        const remainingDays = Math.floor((daysLeft % 365) % 30);

        return {
            years: yearsLeft,
            months: monthsLeft,
            days: remainingDays,
            message: null
        };
    }

    // Display all calculated results
    function displayResults(ageData, birthDate) {
        // Main age display
        mainAge.textContent = `${ageData.years} Years, ${ageData.months} Months, ${ageData.days} Days`;

        // Time units
        totalMonths.textContent = formatNumber(ageData.totalMonths);
        totalWeeks.textContent = formatNumber(ageData.totalWeeks);
        totalDays.textContent = formatNumber(ageData.totalDays);
        totalHours.textContent = formatNumber(ageData.totalHours);
        totalMinutes.textContent = formatNumber(ageData.totalMinutes);

        // Zodiac sign
        const zodiac = getZodiacSign(birthDate);
        zodiacSign.textContent = `${zodiac.symbol} ${zodiac.name} (${zodiac.element})`;

        // Day of birth
        const dayOfWeek = dayNames[birthDate.getDay()];
        birthDay.textContent = dayOfWeek;

        // Time left calculation
        const timeLeftData = calculateTimeLeft(birthDate, ageData);
        if (timeLeftData.message) {
            timeLeft.textContent = timeLeftData.message;
        } else {
            timeLeft.textContent = `${timeLeftData.years} Years, ${timeLeftData.months} Months, ${timeLeftData.days} Days`;
        }
    }

    // Format large numbers with commas
    function formatNumber(num) {
        return num.toLocaleString();
    }

    // Show error message
    function showError(message) {
        errorMessage.querySelector('span').textContent = message;
        errorMessage.classList.remove('hidden');
        outputSection.classList.add('hidden');
        
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            hideError();
        }, 5000);
    }

    // Hide error message
    function hideError() {
        errorMessage.classList.add('hidden');
    }

    // Add some interactive features
    function addInteractiveFeatures() {
        // Add click-to-copy functionality for numeric results
        const resultValues = document.querySelectorAll('.result-value');
        
        resultValues.forEach(element => {
            element.addEventListener('click', function() {
                const text = this.textContent.trim();
                if (text && !text.includes('♑') && !text.includes('♒') && !text.includes('♓') && 
                    !text.includes('♈') && !text.includes('♉') && !text.includes('♊') &&
                    !text.includes('♋') && !text.includes('♌') && !text.includes('♍') &&
                    !text.includes('♎') && !text.includes('♏') && !text.includes('♐')) {
                    
                    navigator.clipboard.writeText(text).then(() => {
                        // Show temporary feedback
                        const originalContent = this.textContent;
                        this.textContent = 'Copied!';
                        this.style.color = '#2ed573';
                        
                        setTimeout(() => {
                            this.textContent = originalContent;
                            this.style.color = '';
                        }, 1000);
                    }).catch(() => {
                        // Fallback for older browsers
                        console.log('Copy to clipboard not supported');
                    });
                }
            });
            
            // Add cursor pointer for clickable elements
            element.style.cursor = 'pointer';
            element.title = 'Click to copy';
        });
    }

    // Initialize interactive features after DOM is fully loaded
    setTimeout(addInteractiveFeatures, 100);

    // Add some fun facts based on age
    function getAgeFunFacts(ageData) {
        const facts = [];
        
        if (ageData.totalDays > 10000) {
            facts.push("🎉 You've lived over 10,000 days!");
        }
        
        if (ageData.years >= 18) {
            facts.push("🗳️ You're old enough to vote in most countries!");
        }
        
        if (ageData.years >= 21) {
            facts.push("🍾 You've reached the legal drinking age in the US!");
        }
        
        if (ageData.years >= 25) {
            facts.push("🧠 Your brain is fully developed!");
        }
        
        if (ageData.years >= 30) {
            facts.push("👔 You're in your prime working years!");
        }
        
        if (ageData.totalHours > 100000) {
            facts.push("⏰ You've lived over 100,000 hours!");
        }
        
        return facts;
    }

    // Enhanced validation for leap years
    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to calculate
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            calculateAge();
        }
        
        // Escape to clear results
        if (e.key === 'Escape') {
            outputSection.classList.add('hidden');
            birthDateInput.value = '';
            hideError();
        }
    });

// Add focus to birth date input on page load
setTimeout(() => {
    birthDateInput.focus();
}, 500);
