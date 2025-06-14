// Random Data Generator - JavaScript Functionality

// === DATA ARRAYS === //

// Name arrays
const maleNames = [
    'Alexander', 'Benjamin', 'Christopher', 'Daniel', 'Ethan', 'Felix', 'Gabriel', 'Harrison', 'Ian', 'Jackson',
    'Kevin', 'Liam', 'Michael', 'Noah', 'Oliver', 'Patrick', 'Quincy', 'Robert', 'Samuel', 'Thomas',
    'Ulysses', 'Vincent', 'William', 'Xavier', 'Zachary', 'Adrian', 'Blake', 'Caleb', 'Derek', 'Eric',
    'Finn', 'George', 'Henry', 'Isaac', 'James', 'Kenneth', 'Luke', 'Marcus', 'Nathan', 'Oscar',
    'Peter', 'Quentin', 'Ryan', 'Sebastian', 'Tyler', 'Victor', 'Wesley', 'Xander', 'Yosef', 'Zane',
    'Adam', 'Brett', 'Connor', 'David', 'Edward', 'Frank', 'Grant', 'Hunter', 'Ivan', 'Jordan',
    'Kyle', 'Logan', 'Matthew', 'Nicholas', 'Owen', 'Paul', 'Quinn', 'Richard', 'Steven', 'Timothy'
];

const femaleNames = [
    'Ava', 'Bella', 'Charlotte', 'Diana', 'Emma', 'Fiona', 'Grace', 'Hannah', 'Isabella', 'Julia',
    'Katherine', 'Lily', 'Madison', 'Natalie', 'Olivia', 'Penelope', 'Quinn', 'Rachel', 'Sophia', 'Taylor',
    'Uma', 'Victoria', 'Willow', 'Ximena', 'Yasmine', 'Zoe', 'Aria', 'Brooke', 'Chloe', 'Delilah',
    'Elena', 'Faith', 'Gabriella', 'Hazel', 'Iris', 'Jasmine', 'Kimberly', 'Layla', 'Mia', 'Nora',
    'Paige', 'Queenie', 'Ruby', 'Scarlett', 'Tessa', 'Valentina', 'Wanda', 'Xara', 'Yara', 'Zara',
    'Abigail', 'Brianna', 'Camila', 'Destiny', 'Evelyn', 'Francesca', 'Gianna', 'Harper', 'Ivy', 'Jenna',
    'Kendall', 'Luna', 'Maya', 'Nicole', 'Ophelia', 'Piper', 'Qiana', 'Reagan', 'Savannah', 'Teagan'
];

// Common email domains
const emailDomains = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com',
    'aol.com', 'protonmail.com', 'mail.com', 'yandex.com', 'tutanota.com',
    'zoho.com', 'fastmail.com', 'gmx.com', 'live.com', 'msn.com'
];

// Username prefixes for emails
const usernamePrefixes = [
    'user', 'admin', 'test', 'demo', 'sample', 'email', 'contact', 'info',
    'support', 'help', 'service', 'team', 'office', 'business', 'personal',
    'work', 'home', 'mail', 'account', 'profile', 'online', 'digital',
    'web', 'tech', 'data', 'code', 'dev', 'pro', 'expert', 'master'
];

// Password character sets
const passwordChars = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// === UTILITY FUNCTIONS === //

// Get random element from array
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Get random number between min and max
function getRandomNumber(min, max, decimal = false) {
    if (decimal) {
        return (Math.random() * (max - min) + min).toFixed(2);
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate random string
function generateRandomString(length, chars) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Show toast notification
function showToast(message = 'Copied to clipboard!') {
    const toast = document.getElementById('toast');
    toast.querySelector('span').textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Copy to clipboard function
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast();
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast();
    }
}

// === GENERATOR FUNCTIONS === //

// Generate random names
function generateNames() {
    const quantity = parseInt(document.getElementById('nameQuantity').value) || 5;
    const includeMale = document.getElementById('maleNames').checked;
    const includeFemale = document.getElementById('femaleNames').checked;
    
    if (!includeMale && !includeFemale) {
        document.getElementById('nameOutput').value = 'Please select at least one name type.';
        return;
    }
    
    const availableNames = [];
    if (includeMale) availableNames.push(...maleNames);
    if (includeFemale) availableNames.push(...femaleNames);
    
    const generatedNames = [];
    for (let i = 0; i < quantity; i++) {
        generatedNames.push(getRandomElement(availableNames));
    }
    
    document.getElementById('nameOutput').value = generatedNames.join('\n');
}

// Generate random emails
function generateEmails() {
    const quantity = parseInt(document.getElementById('emailQuantity').value) || 5;
    const useCommonDomains = document.getElementById('commonDomains').checked;
    const customDomain = document.getElementById('customDomain').value.trim();
    
    let domains = [];
    if (useCommonDomains) {
        domains.push(...emailDomains);
    }
    if (customDomain) {
        domains.push(customDomain);
    }
    
    if (domains.length === 0) {
        document.getElementById('emailOutput').value = 'Please select common domains or enter a custom domain.';
        return;
    }
    
    const generatedEmails = [];
    for (let i = 0; i < quantity; i++) {
        const username = getRandomElement(usernamePrefixes) + getRandomNumber(100, 9999);
        const domain = getRandomElement(domains);
        generatedEmails.push(`${username}@${domain}`);
    }
    
    document.getElementById('emailOutput').value = generatedEmails.join('\n');
}

// Generate random passwords
function generatePasswords() {
    const quantity = parseInt(document.getElementById('passwordQuantity').value) || 5;
    const length = parseInt(document.getElementById('passwordLength').value) || 12;
    const includeUppercase = document.getElementById('uppercase').checked;
    const includeLowercase = document.getElementById('lowercase').checked;
    const includeNumbers = document.getElementById('numbers').checked;
    const includeSymbols = document.getElementById('symbols').checked;
    
    let characterSet = '';
    if (includeUppercase) characterSet += passwordChars.uppercase;
    if (includeLowercase) characterSet += passwordChars.lowercase;
    if (includeNumbers) characterSet += passwordChars.numbers;
    if (includeSymbols) characterSet += passwordChars.symbols;
    
    if (characterSet === '') {
        document.getElementById('passwordOutput').value = 'Please select at least one character type.';
        return;
    }
    
    const generatedPasswords = [];
    for (let i = 0; i < quantity; i++) {
        generatedPasswords.push(generateRandomString(length, characterSet));
    }
    
    document.getElementById('passwordOutput').value = generatedPasswords.join('\n');
}

// Generate random numbers
function generateNumbers() {
    const quantity = parseInt(document.getElementById('numberQuantity').value) || 5;
    const minValue = parseFloat(document.getElementById('minValue').value) || 1;
    const maxValue = parseFloat(document.getElementById('maxValue').value) || 100;
    const useDecimals = document.getElementById('decimalNumbers').checked;
    
    if (minValue >= maxValue) {
        document.getElementById('numberOutput').value = 'Min value must be less than max value.';
        return;
    }
    
    const generatedNumbers = [];
    for (let i = 0; i < quantity; i++) {
        generatedNumbers.push(getRandomNumber(minValue, maxValue, useDecimals));
    }
    
    document.getElementById('numberOutput').value = generatedNumbers.join('\n');
}

// === EVENT LISTENERS === //

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Name Generator
    document.getElementById('generateNames').addEventListener('click', generateNames);
    document.getElementById('copyNames').addEventListener('click', () => {
        const text = document.getElementById('nameOutput').value;
        if (text.trim()) copyToClipboard(text);
    });
    
    // Email Generator
    document.getElementById('generateEmails').addEventListener('click', generateEmails);
    document.getElementById('copyEmails').addEventListener('click', () => {
        const text = document.getElementById('emailOutput').value;
        if (text.trim()) copyToClipboard(text);
    });
    
    // Password Generator
    document.getElementById('generatePasswords').addEventListener('click', generatePasswords);
    document.getElementById('copyPasswords').addEventListener('click', () => {
        const text = document.getElementById('passwordOutput').value;
        if (text.trim()) copyToClipboard(text);
    });
    
    // Number Generator
    document.getElementById('generateNumbers').addEventListener('click', generateNumbers);
    document.getElementById('copyNumbers').addEventListener('click', () => {
        const text = document.getElementById('numberOutput').value;
        if (text.trim()) copyToClipboard(text);
    });
    
    // Custom domain toggle
    document.getElementById('commonDomains').addEventListener('change', function() {
        const customDomainGroup = document.querySelector('.custom-domain-group');
        const customDomainInput = document.getElementById('customDomain');
        
        if (!this.checked && !customDomainInput.value.trim()) {
            customDomainInput.focus();
        }
    });
    
    // Input validation
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) this.value = 0;
            if (this.id === 'nameQuantity' || this.id === 'emailQuantity' || 
                this.id === 'passwordQuantity' || this.id === 'numberQuantity') {
                if (this.value > 100) this.value = 100;
            }
            if (this.id === 'passwordLength') {
                if (this.value > 32) this.value = 32;
                if (this.value < 8) this.value = 8;
            }
        });
    });
    
    // Enter key support for inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const card = this.closest('.generator-card');
                const generateBtn = card.querySelector('.generate-btn');
                generateBtn.click();
            }
        });
    });
    
    // Add button hover effects
    const buttons = document.querySelectorAll('.generate-btn, .copy-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Auto-generate sample data on page load
    setTimeout(() => {
        // Generate sample names
        document.getElementById('nameQuantity').value = 3;
        generateNames();
        
        // Generate sample emails
        document.getElementById('emailQuantity').value = 3;
        generateEmails();
        
        // Generate sample passwords
        document.getElementById('passwordQuantity').value = 3;
        document.getElementById('passwordLength').value = 10;
        generatePasswords();
        
        // Generate sample numbers
        document.getElementById('numberQuantity').value = 3;
        generateNumbers();
    }, 1000);
});

// === KEYBOARD SHORTCUTS === //
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to generate (focus on any generator)
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const activeElement = document.activeElement;
        const card = activeElement.closest('.generator-card');
        if (card) {
            const generateBtn = card.querySelector('.generate-btn');
            generateBtn.click();
            e.preventDefault();
        }
    }
    
    // Escape to clear outputs
    if (e.key === 'Escape') {
        const textareas = document.querySelectorAll('.output-textarea');
        textareas.forEach(textarea => textarea.value = '');
    }
});

// === ADDITIONAL FEATURES === //

// Add loading states to buttons
function addLoadingState(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
    }, 500);
}

// Enhanced generate functions with loading states
const originalGenerateFunctions = {
    generateNames,
    generateEmails,
    generatePasswords,
    generateNumbers
};

// Override generate functions to include loading states
function enhanceGenerateFunction(originalFunction, buttonId) {
    return function() {
        const button = document.getElementById(buttonId);
        addLoadingState(button);
        setTimeout(originalFunction, 100);
    };
}

// Apply enhanced functions
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('generateNames').addEventListener('click', 
        enhanceGenerateFunction(originalGenerateFunctions.generateNames, 'generateNames'));
    
    document.getElementById('generateEmails').addEventListener('click', 
        enhanceGenerateFunction(originalGenerateFunctions.generateEmails, 'generateEmails'));
    
    document.getElementById('generatePasswords').addEventListener('click', 
        enhanceGenerateFunction(originalGenerateFunctions.generatePasswords, 'generatePasswords'));
    
    document.getElementById('generateNumbers').addEventListener('click', 
        enhanceGenerateFunction(originalGenerateFunctions.generateNumbers, 'generateNumbers'));
});

// === EXPORT FUNCTIONALITY === //
function exportData(format = 'txt') {
    const data = {
        names: document.getElementById('nameOutput').value,
        emails: document.getElementById('emailOutput').value,
        passwords: document.getElementById('passwordOutput').value,
        numbers: document.getElementById('numberOutput').value
    };
    
    let content = '';
    let filename = '';
    
    if (format === 'txt') {
        content = `Generated Names:\n${data.names}\n\nGenerated Emails:\n${data.emails}\n\nGenerated Passwords:\n${data.passwords}\n\nGenerated Numbers:\n${data.numbers}`;
        filename = 'random-data.txt';
    } else if (format === 'json') {
        content = JSON.stringify(data, null, 2);
        filename = 'random-data.json';
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Console commands for advanced users
console.log('🎲 Random Data Generator loaded successfully!');
console.log('Available commands:');
console.log('- exportData("txt") - Export all data as text file');
console.log('- exportData("json") - Export all data as JSON file');
console.log('- generateNames() - Generate names programmatically');
console.log('- generateEmails() - Generate emails programmatically');
console.log('- generatePasswords() - Generate passwords programmatically');
console.log('- generateNumbers() - Generate numbers programmatically');
