/**
 * Advanced Word Counter - Professional Text Analysis Tool
 * 
 * Features:
 * - Real-time word, character, sentence, and paragraph counting
 * - Reading time estimation
 * - Copy to clipboard functionality
 * - Text file download
 * - Dark/Light theme toggle
 * - Responsive design with accessibility features
 * 
 * Author: Quantum Tools
 * Version: 1.0.0
 */

class WordCounter {
    constructor() {
        // DOM Elements
        this.textInput = document.getElementById('textInput');
        this.wordCount = document.getElementById('wordCount');
        this.charCount = document.getElementById('charCount');
        this.charNoSpacesCount = document.getElementById('charNoSpacesCount');
        this.sentenceCount = document.getElementById('sentenceCount');
        this.paragraphCount = document.getElementById('paragraphCount');
        this.readingTime = document.getElementById('readingTime');
        this.avgWordLength = document.getElementById('avgWordLength');
        this.longestWord = document.getElementById('longestWord');
        this.keywordDensity = document.getElementById('keywordDensity');
        this.readabilityScore = document.getElementById('readabilityScore');
        this.speakingTime = document.getElementById('speakingTime');
        this.uniqueWords = document.getElementById('uniqueWords');
        this.commonWord = document.getElementById('commonWord');
        this.avgSentenceLength = document.getElementById('avgSentenceLength');
        this.textComplexity = document.getElementById('textComplexity');
        this.languageDetected = document.getElementById('languageDetected');
        this.inputOverlay = document.getElementById('inputOverlay');
        this.copyBtn = document.getElementById('copyBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.speakBtn = document.getElementById('speakBtn');
        this.fileInput = document.getElementById('fileInput');
        this.themeToggle = document.getElementById('themeToggle');
        this.toast = document.getElementById('toast');
        this.toastMessage = document.getElementById('toastMessage');

        // Option checkboxes
        this.includeSpaces = document.getElementById('includeSpaces');
        this.countEmptyLines = document.getElementById('countEmptyLines');
        this.ignoreNumbers = document.getElementById('ignoreNumbers');
        this.advancedSentences = document.getElementById('advancedSentences');

        // Configuration
        this.wordsPerMinute = 250; // Average reading speed
        this.wordsPerMinuteSpeaking = 160; // Average speaking speed
        this.debounceDelay = 100; // Milliseconds

        // State
        this.debounceTimer = null;
        this.currentText = '';
        this.textAnalysis = {};
        this.speechSynthesis = window.speechSynthesis;
        this.currentUtterance = null;
        this.isSpeaking = false;

        // Initialize the application
        this.init();
    }

    /**
     * Initialize the Word Counter application
     */
    init() {
        this.setupEventListeners();
        this.loadThemePreference();
        this.updateStats();
        this.setupAccessibility();

        // Add initial focus to textarea for better UX
        if (this.textInput) {
            this.textInput.focus();
        }
    }

    /**
     * Set up all event listeners
     */
    setupEventListeners() {
        // Text input events
        if (this.textInput) {
            this.textInput.addEventListener('input', this.handleTextInput.bind(this));
            this.textInput.addEventListener('paste', this.handlePaste.bind(this));
            this.textInput.addEventListener('focus', this.handleInputFocus.bind(this));
            this.textInput.addEventListener('blur', this.handleInputBlur.bind(this));
        }

        // Button events
        if (this.copyBtn) {
            this.copyBtn.addEventListener('click', this.copyToClipboard.bind(this));
        }

        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', this.downloadText.bind(this));
        }

        if (this.uploadBtn) {
            this.uploadBtn.addEventListener('click', this.triggerFileUpload.bind(this));
        }

        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', this.clearText.bind(this));
        }

        if (this.speakBtn) {
            this.speakBtn.addEventListener('click', this.toggleTextToSpeech.bind(this));
        }

        if (this.fileInput) {
            this.fileInput.addEventListener('change', this.handleFileUpload.bind(this));
        }

        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        }

        // Option change events
        const options = [this.includeSpaces, this.countEmptyLines, this.ignoreNumbers, this.advancedSentences];
        options.forEach(option => {
            if (option) {
                option.addEventListener('change', this.handleOptionChange.bind(this));
            }
        });

        // Drag and drop events
        if (this.textInput) {
            this.textInput.addEventListener('dragover', this.handleDragOver.bind(this));
            this.textInput.addEventListener('drop', this.handleFileDrop.bind(this));
        }        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboardShortcuts.bind(this));

        // Performance optimization: Update stats on window resize
        window.addEventListener('resize', this.debounce(this.updateLayout.bind(this), 250));
    }

    /**
     * Handle text input with debouncing for performance
     */
    handleTextInput(event) {
        this.currentText = event.target.value;

        // Clear existing timer
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        // Set new timer for debounced update
        this.debounceTimer = setTimeout(() => {
            this.updateStats();
            this.updateOverlay();
        }, this.debounceDelay);

        // Immediate overlay update for better UX
        this.updateOverlay();
    }

    /**
     * Handle paste event with slight delay for processing
     */
    handlePaste() {
        setTimeout(() => {
            this.currentText = this.textInput.value;
            this.updateStats();
            this.updateOverlay();
        }, 10);
    }

    /**
     * Handle input focus
     */
    handleInputFocus() {
        this.updateOverlay();
    }

    /**
     * Handle input blur
     */
    handleInputBlur() {
        // Optional: Add any cleanup or validation here
    }

    /**
     * Update all text statistics
     */
    updateStats() {
        const text = this.currentText;

        try {
            // Calculate all metrics
            const words = this.countWords(text);
            const characters = this.countCharacters(text);
            const charactersNoSpaces = this.countCharactersNoSpaces(text);
            const sentences = this.countSentences(text);
            const paragraphs = this.countParagraphs(text);
            const readingTimeMinutes = this.calculateReadingTime(words);
            const speakingTimeMinutes = this.calculateSpeakingTime(words);
            const avgWordLength = this.calculateAvgWordLength(text);
            const longestWord = this.findLongestWord(text);
            const uniqueWordsCount = this.countUniqueWords(text);
            const mostCommonWord = this.findMostCommonWord(text);
            const avgSentenceLength = this.calculateAvgSentenceLength(text);
            const keywordDensity = this.calculateKeywordDensity(text);
            const readabilityScore = this.calculateReadabilityScore(text, words, sentences);
            const textComplexity = this.determineTextComplexity(avgWordLength, avgSentenceLength);
            const detectedLanguage = this.detectLanguage(text);

            // Store analysis for later use
            this.textAnalysis = {
                words, characters, charactersNoSpaces, sentences, paragraphs,
                readingTimeMinutes, speakingTimeMinutes, avgWordLength, longestWord,
                uniqueWordsCount, mostCommonWord, avgSentenceLength, keywordDensity,
                readabilityScore, textComplexity, detectedLanguage
            };

            // Update DOM elements with animation
            this.animateCounterUpdate(this.wordCount, words);
            this.animateCounterUpdate(this.charCount, characters);
            this.animateCounterUpdate(this.charNoSpacesCount, charactersNoSpaces);
            this.animateCounterUpdate(this.sentenceCount, sentences);
            this.animateCounterUpdate(this.paragraphCount, paragraphs);
            this.animateCounterUpdate(this.avgWordLength, avgWordLength ? avgWordLength.toFixed(1) : 0);
            this.animateCounterUpdate(this.uniqueWords, uniqueWordsCount);

            // Update reading time with proper formatting
            if (this.readingTime) {
                this.readingTime.textContent = this.formatReadingTime(readingTimeMinutes);
            }

            // Update speaking time
            if (this.speakingTime) {
                this.speakingTime.textContent = this.formatReadingTime(speakingTimeMinutes);
            }

            // Update text-based stats
            if (this.longestWord) {
                this.longestWord.textContent = longestWord || '-';
            }

            if (this.commonWord) {
                this.commonWord.textContent = mostCommonWord || '-';
            }

            if (this.avgSentenceLength) {
                this.avgSentenceLength.textContent = avgSentenceLength ? `${avgSentenceLength.toFixed(1)} words` : '0 words';
            }

            if (this.keywordDensity) {
                this.keywordDensity.textContent = `${keywordDensity}%`;
            }

            if (this.readabilityScore) {
                this.readabilityScore.textContent = readabilityScore;
            }

            if (this.textComplexity) {
                this.textComplexity.textContent = textComplexity;
            }

            if (this.languageDetected) {
                this.languageDetected.textContent = detectedLanguage;
            }

        } catch (error) {
            console.error('Error updating stats:', error);
            this.showToast('Error calculating statistics', 'error');
        }
    }    /**
     * Count words in text
     * @param {string} text - Input text
     * @returns {number} Word count
     */
    countWords(text) {
        if (!text || text.trim().length === 0) return 0;

        // Remove extra whitespace and split by whitespace
        const words = text.trim().split(/\s+/);

        // Filter out empty strings
        return words.filter(word => word.length > 0).length;
    }

    /**
     * Count characters including spaces
     * @param {string} text - Input text
     * @returns {number} Character count
     */
    countCharacters(text) {
        return text ? text.length : 0;
    }

    /**
     * Count characters excluding spaces
     * @param {string} text - Input text
     * @returns {number} Character count without spaces
     */
    countCharactersNoSpaces(text) {
        if (!text) return 0;
        return text.replace(/\s/g, '').length;
    }

    /**
     * Count sentences in text
     * @param {string} text - Input text
     * @returns {number} Sentence count
     */
    countSentences(text) {
        if (!text || text.trim().length === 0) return 0;

        // Split by sentence-ending punctuation
        const sentences = text.split(/[.!?]+/).filter(sentence => {
            return sentence.trim().length > 0;
        });

        return sentences.length;
    }

    /**
     * Count paragraphs in text
     * @param {string} text - Input text
     * @returns {number} Paragraph count
     */
    countParagraphs(text) {
        if (!text || text.trim().length === 0) return 0;

        // Split by double line breaks and filter empty paragraphs
        const paragraphs = text.split(/\n\s*\n/).filter(paragraph => {
            return paragraph.trim().length > 0;
        });

        return Math.max(paragraphs.length, 1);
    }

    /**
     * Calculate estimated reading time
     * @param {number} wordCount - Number of words
     * @returns {number} Reading time in minutes
     */
    calculateReadingTime(wordCount) {
        if (wordCount === 0) return 0;
        return Math.ceil(wordCount / this.wordsPerMinute);
    }

    /**
     * Calculate estimated speaking time
     * @param {number} wordCount - Number of words
     * @returns {number} Speaking time in minutes
     */
    calculateSpeakingTime(wordCount) {
        if (wordCount === 0) return 0;
        return Math.ceil(wordCount / this.wordsPerMinuteSpeaking);
    }

    /**
     * Calculate average word length
     * @param {string} text - Input text
     * @returns {number} Average word length
     */
    calculateAvgWordLength(text) {
        if (!text || text.trim().length === 0) return 0;

        const words = this.getWordsArray(text);
        if (words.length === 0) return 0;

        const totalLength = words.reduce((sum, word) => sum + word.length, 0);
        return totalLength / words.length;
    }

    /**
     * Find the longest word in text
     * @param {string} text - Input text
     * @returns {string} Longest word
     */
    findLongestWord(text) {
        if (!text || text.trim().length === 0) return null;

        const words = this.getWordsArray(text);
        if (words.length === 0) return null;

        return words.reduce((longest, current) => {
            return current.length > longest.length ? current : longest;
        }, '');
    }

    /**
     * Count unique words
     * @param {string} text - Input text
     * @returns {number} Number of unique words
     */
    countUniqueWords(text) {
        if (!text || text.trim().length === 0) return 0;

        const words = this.getWordsArray(text);
        const uniqueWords = new Set(words.map(word => word.toLowerCase()));
        return uniqueWords.size;
    }

    /**
     * Find the most common word
     * @param {string} text - Input text
     * @returns {string} Most common word
     */
    findMostCommonWord(text) {
        if (!text || text.trim().length === 0) return null;

        const words = this.getWordsArray(text);
        if (words.length === 0) return null;

        const wordFreq = {};
        const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'];

        words.forEach(word => {
            const lowerWord = word.toLowerCase();
            if (!commonWords.includes(lowerWord) && lowerWord.length > 2) {
                wordFreq[lowerWord] = (wordFreq[lowerWord] || 0) + 1;
            }
        });

        let mostCommon = null;
        let maxCount = 0;

        for (const [word, count] of Object.entries(wordFreq)) {
            if (count > maxCount) {
                maxCount = count;
                mostCommon = word;
            }
        }

        return mostCommon;
    }

    /**
     * Calculate average sentence length
     * @param {string} text - Input text
     * @returns {number} Average sentence length in words
     */
    calculateAvgSentenceLength(text) {
        if (!text || text.trim().length === 0) return 0;

        const sentences = this.countSentences(text);
        const words = this.countWords(text);

        if (sentences === 0) return 0;
        return words / sentences;
    }

    /**
     * Calculate keyword density for most common word
     * @param {string} text - Input text
     * @returns {number} Keyword density percentage
     */
    calculateKeywordDensity(text) {
        if (!text || text.trim().length === 0) return 0;

        const mostCommon = this.findMostCommonWord(text);
        if (!mostCommon) return 0;

        const words = this.getWordsArray(text);
        const occurrences = words.filter(word =>
            word.toLowerCase() === mostCommon.toLowerCase()
        ).length;

        return Math.round((occurrences / words.length) * 100);
    }

    /**
     * Calculate readability score (simplified Flesch Reading Ease)
     * @param {string} text - Input text
     * @param {number} words - Word count
     * @param {number} sentences - Sentence count
     * @returns {string} Readability score
     */
    calculateReadabilityScore(text, words, sentences) {
        if (!text || words === 0 || sentences === 0) return '-';

        const syllables = this.countSyllables(text);
        const avgSentenceLength = words / sentences;
        const avgSyllablesPerWord = syllables / words;

        const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);

        if (score >= 90) return 'Very Easy';
        if (score >= 80) return 'Easy';
        if (score >= 70) return 'Fairly Easy';
        if (score >= 60) return 'Standard';
        if (score >= 50) return 'Fairly Hard';
        if (score >= 30) return 'Hard';
        return 'Very Hard';
    }

    /**
     * Count syllables in text (approximate)
     * @param {string} text - Input text
     * @returns {number} Syllable count
     */
    countSyllables(text) {
        const words = this.getWordsArray(text);
        return words.reduce((total, word) => {
            return total + this.countSyllablesInWord(word);
        }, 0);
    }

    /**
     * Count syllables in a single word
     * @param {string} word - Input word
     * @returns {number} Syllable count
     */
    countSyllablesInWord(word) {
        if (!word || word.length === 0) return 0;

        word = word.toLowerCase();
        if (word.length <= 3) return 1;

        const vowels = 'aeiouy';
        let syllables = 0;
        let previousWasVowel = false;

        for (let i = 0; i < word.length; i++) {
            const isVowel = vowels.includes(word[i]);
            if (isVowel && !previousWasVowel) {
                syllables++;
            }
            previousWasVowel = isVowel;
        }

        // Handle silent 'e'
        if (word.endsWith('e')) {
            syllables--;
        }

        return Math.max(1, syllables);
    }

    /**
     * Determine text complexity
     * @param {number} avgWordLength - Average word length
     * @param {number} avgSentenceLength - Average sentence length
     * @returns {string} Complexity level
     */
    determineTextComplexity(avgWordLength, avgSentenceLength) {
        if (!avgWordLength || !avgSentenceLength) return 'Unknown';

        const complexityScore = (avgWordLength * 0.6) + (avgSentenceLength * 0.4);

        if (complexityScore < 8) return 'Simple';
        if (complexityScore < 12) return 'Moderate';
        if (complexityScore < 16) return 'Complex';
        return 'Very Complex';
    }

    /**
     * Detect language (basic detection)
     * @param {string} text - Input text
     * @returns {string} Detected language
     */
    detectLanguage(text) {
        if (!text || text.trim().length === 0) return 'Unknown';

        // Simple language detection based on common words
        const englishWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
        const spanishWords = ['el', 'la', 'y', 'o', 'pero', 'en', 'con', 'de', 'para', 'por'];
        const frenchWords = ['le', 'la', 'et', 'ou', 'mais', 'dans', 'sur', 'à', 'pour', 'de', 'avec', 'par'];

        const words = text.toLowerCase().split(/\s+/).slice(0, 100); // Check first 100 words

        let englishCount = 0;
        let spanishCount = 0;
        let frenchCount = 0;

        words.forEach(word => {
            if (englishWords.includes(word)) englishCount++;
            if (spanishWords.includes(word)) spanishCount++;
            if (frenchWords.includes(word)) frenchCount++;
        });

        if (englishCount > spanishCount && englishCount > frenchCount) return 'English';
        if (spanishCount > englishCount && spanishCount > frenchCount) return 'Spanish';
        if (frenchCount > englishCount && frenchCount > spanishCount) return 'French';

        return 'English'; // Default to English
    }

    /**
     * Get words array with proper filtering
     * @param {string} text - Input text
     * @returns {Array} Array of words
     */
    getWordsArray(text) {
        if (!text || text.trim().length === 0) return [];

        let words = text.trim().split(/\s+/).filter(word => word.length > 0);

        // Apply option filters
        if (this.ignoreNumbers && this.ignoreNumbers.checked) {
            words = words.filter(word => !/^\d+$/.test(word));
        }

        // Remove punctuation
        words = words.map(word => word.replace(/[^\w\s]|_/g, "").trim()).filter(word => word.length > 0);

        return words;
    }    /**
     * Format reading time for display
     * @param {number} minutes - Reading time in minutes
     * @returns {string} Formatted reading time
     */
    formatReadingTime(minutes) {
        if (minutes === 0) return '0 min';
        if (minutes === 1) return '1 min';
        if (minutes < 60) return `${minutes} min`;

        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours === 1 && remainingMinutes === 0) return '1 hour';
        if (hours === 1) return `1h ${remainingMinutes}m`;
        if (remainingMinutes === 0) return `${hours} hours`;

        return `${hours}h ${remainingMinutes}m`;
    }

    /**
     * Animate counter updates for better UX
     * @param {HTMLElement} element - Counter element
     * @param {number} newValue - New value to display
     */
    animateCounterUpdate(element, newValue) {
        if (!element) return;

        const currentValue = parseInt(element.textContent) || 0;

        if (currentValue === newValue) return;

        // Add animation class
        element.style.transform = 'scale(1.05)';
        element.style.transition = 'transform 0.15s ease-out';

        // Update value
        element.textContent = newValue.toLocaleString();

        // Remove animation
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 150);
    }

    /**
     * Update input overlay visibility
     */
    updateOverlay() {
        if (!this.inputOverlay) return;

        const hasText = this.currentText && this.currentText.trim().length > 0;
        const isFocused = document.activeElement === this.textInput;

        if (hasText || isFocused) {
            this.inputOverlay.classList.add('hidden');
        } else {
            this.inputOverlay.classList.remove('hidden');
        }
    }

    /**
     * Trigger file upload dialog
     */
    triggerFileUpload() {
        if (this.fileInput) {
            this.fileInput.click();
        }
    }

    /**
     * Handle file upload
     * @param {Event} event - File input change event
     */
    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showToast('File size too large. Maximum 5MB allowed.', 'error');
            return;
        }

        // Check file type
        const allowedTypes = ['text/plain', 'text/markdown', 'application/rtf'];
        const fileName = file.name.toLowerCase();
        const isTextFile = allowedTypes.includes(file.type) ||
            fileName.endsWith('.txt') ||
            fileName.endsWith('.md') ||
            fileName.endsWith('.rtf');

        if (!isTextFile) {
            this.showToast('Please select a text file (.txt, .md, .rtf)', 'error');
            return;
        }

        try {
            const text = await this.readFileAsText(file);
            this.textInput.value = text;
            this.currentText = text;
            this.updateStats();
            this.updateOverlay();
            this.showToast(`File "${file.name}" loaded successfully!`, 'success');

            // Reset file input
            event.target.value = '';

        } catch (error) {
            console.error('Error reading file:', error);
            this.showToast('Error reading file', 'error');
        }
    }

    /**
     * Read file as text
     * @param {File} file - File to read
     * @returns {Promise<string>} File content
     */
    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    }

    /**
     * Handle drag over event
     * @param {DragEvent} event - Drag event
     */
    handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = 'copy';

        this.textInput.classList.add('drag-over');
    }

    /**
     * Handle file drop event
     * @param {DragEvent} event - Drop event
     */
    handleFileDrop(event) {
        event.preventDefault();
        event.stopPropagation();

        this.textInput.classList.remove('drag-over');

        const files = event.dataTransfer.files;
        if (files.length > 0) {
            // Simulate file input change
            const fakeEvent = { target: { files: [files[0]] } };
            this.handleFileUpload(fakeEvent);
        }
    }

    /**
     * Clear all text
     */
    clearText() {
        // Stop any ongoing speech
        if (this.isSpeaking) {
            this.stopSpeaking();
        }

        // Clear the textarea
        if (this.textInput) {
            this.textInput.value = '';
        }

        // Reset all state variables
        this.currentText = '';
        this.textAnalysis = {};

        // Update UI
        this.updateStats();
        this.updateOverlay();

        // Focus back to textarea
        if (this.textInput) {
            this.textInput.focus();
        }

        this.showToast('Text cleared', 'success');
    }

    /**
     * Toggle text-to-speech functionality
     */
    toggleTextToSpeech() {
        if (this.isSpeaking) {
            this.stopSpeaking();
        } else {
            this.startSpeaking();
        }
    }

    /**
     * Start text-to-speech
     */
    startSpeaking() {
        if (!this.currentText || this.currentText.trim().length === 0) {
            this.showToast('No text to speak', 'warning');
            return;
        }

        if (!this.speechSynthesis) {
            this.showToast('Text-to-speech not supported in this browser', 'error');
            return;
        }

        try {
            // Stop any ongoing speech
            this.speechSynthesis.cancel();

            // Create new utterance
            this.currentUtterance = new SpeechSynthesisUtterance(this.currentText);

            // Configure speech settings
            this.currentUtterance.rate = 1.0;
            this.currentUtterance.pitch = 1.0;
            this.currentUtterance.volume = 1.0;

            // Set up event listeners
            this.currentUtterance.onstart = () => {
                this.isSpeaking = true;
                this.updateSpeakButton(true);
                this.showToast('Text-to-speech started', 'info');
            };

            this.currentUtterance.onend = () => {
                this.isSpeaking = false;
                this.updateSpeakButton(false);
                this.showToast('Text-to-speech completed', 'success');
            };

            this.currentUtterance.onerror = (event) => {
                console.error('Speech synthesis error:', event);
                this.isSpeaking = false;
                this.updateSpeakButton(false);
                this.showToast('Text-to-speech error occurred', 'error');
            };

            this.currentUtterance.onpause = () => {
                this.isSpeaking = false;
                this.updateSpeakButton(false);
            };

            // Start speaking
            this.speechSynthesis.speak(this.currentUtterance);

        } catch (error) {
            console.error('Error starting text-to-speech:', error);
            this.showToast('Failed to start text-to-speech', 'error');
        }
    }

    /**
     * Stop text-to-speech
     */
    stopSpeaking() {
        if (this.speechSynthesis) {
            this.speechSynthesis.cancel();
        }

        this.isSpeaking = false;
        this.updateSpeakButton(false);
        this.showToast('Text-to-speech stopped', 'info');
    }

    /**
     * Update speak button appearance
     * @param {boolean} speaking - Whether currently speaking
     */
    updateSpeakButton(speaking) {
        if (!this.speakBtn) return;

        const speakText = this.speakBtn.querySelector('.speak-text');

        if (speaking) {
            this.speakBtn.classList.add('speaking');
            if (speakText) speakText.textContent = 'Stop';
            this.speakBtn.setAttribute('aria-label', 'Stop text-to-speech');
        } else {
            this.speakBtn.classList.remove('speaking');
            if (speakText) speakText.textContent = 'Speak';
            this.speakBtn.setAttribute('aria-label', 'Text to speech');
        }
    }

    /**
     * Handle option changes
     */
    handleOptionChange() {
        // Recalculate stats when options change
        this.updateStats();
    }

    /**
     * Copy text to clipboard
     */
    async copyToClipboard() {
        if (!this.currentText || this.currentText.trim().length === 0) {
            this.showToast('No text to copy', 'warning');
            return;
        }

        try {
            await navigator.clipboard.writeText(this.currentText);
            this.showToast('Text copied to clipboard!', 'success');

            // Add visual feedback to button
            this.addButtonFeedback(this.copyBtn);

        } catch (error) {
            console.error('Failed to copy text:', error);

            // Fallback method
            this.fallbackCopyToClipboard(this.currentText);
        }
    }

    /**
     * Fallback copy method for older browsers
     * @param {string} text - Text to copy
     */
    fallbackCopyToClipboard(text) {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            this.showToast('Text copied to clipboard!', 'success');
            this.addButtonFeedback(this.copyBtn);

        } catch (error) {
            console.error('Fallback copy failed:', error);
            this.showToast('Failed to copy text', 'error');
        }
    }

    /**
     * Download text as file
     */
    downloadText() {
        if (!this.currentText || this.currentText.trim().length === 0) {
            this.showToast('No text to download', 'warning');
            return;
        }

        try {
            const blob = new Blob([this.currentText], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = this.generateFileName();

            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up
            window.URL.revokeObjectURL(url);

            this.showToast('Text file downloaded!', 'success');
            this.addButtonFeedback(this.downloadBtn);

        } catch (error) {
            console.error('Failed to download text:', error);
            this.showToast('Failed to download file', 'error');
        }
    }

    /**
     * Generate filename for download
     * @returns {string} Generated filename
     */
    generateFileName() {
        const date = new Date();
        const dateString = date.toISOString().split('T')[0];
        const timeString = date.toTimeString().split(' ')[0].replace(/:/g, '-');

        return `text-analysis-${dateString}-${timeString}.txt`;
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);

        // Save preference
        localStorage.setItem('wordCounterTheme', newTheme);

        // Add visual feedback
        this.addButtonFeedback(this.themeToggle);

        // Announce to screen readers
        this.announceToScreenReader(`Switched to ${newTheme} theme`);
    }

    /**
     * Load saved theme preference
     */
    loadThemePreference() {
        const savedTheme = localStorage.getItem('wordCounterTheme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const theme = savedTheme || (prefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);
    }

    /**
     * Handle keyboard shortcuts
     * @param {KeyboardEvent} event - Keyboard event
     */
    handleKeyboardShortcuts(event) {
        // Ctrl/Cmd + S: Download text
        if ((event.ctrlKey || event.metaKey) && event.key === 's') {
            event.preventDefault();
            this.downloadText();
        }

        // Ctrl/Cmd + C: Copy text (when textarea is focused)
        if ((event.ctrlKey || event.metaKey) && event.key === 'c' &&
            document.activeElement === this.textInput && this.currentText) {
            // Let default copy behavior work, but show toast
            setTimeout(() => {
                this.showToast('Text copied to clipboard!', 'success');
            }, 100);
        }

        // Ctrl/Cmd + D: Toggle theme
        if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
            event.preventDefault();
            this.toggleTheme();
        }

        // Ctrl/Cmd + R: Toggle text-to-speech
        if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
            event.preventDefault();
            this.toggleTextToSpeech();
        }

        // Space: Toggle text-to-speech (when not focused on textarea)
        if (event.key === ' ' && document.activeElement !== this.textInput) {
            event.preventDefault();
            this.toggleTextToSpeech();
        }

        // Escape: Stop speech or clear text
        if (event.key === 'Escape') {
            if (this.isSpeaking) {
                event.preventDefault();
                this.stopSpeaking();
            } else if (this.currentText.length > 100) {
                if (confirm('Clear all text? This action cannot be undone.')) {
                    this.clearText();
                }
            }
        }
    }

    /**
     * Show toast notification
     * @param {string} message - Message to display
     * @param {string} type - Type of notification (success, error, warning, info)
     */
    showToast(message, type = 'success') {
        if (!this.toast || !this.toastMessage) return;

        // Update message
        this.toastMessage.textContent = message;

        // Update toast style based on type
        this.toast.className = `toast ${type}`;

        // Show toast
        this.toast.classList.add('show');

        // Hide after 3 seconds
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }

    /**
     * Add visual feedback to button
     * @param {HTMLElement} button - Button element
     */
    addButtonFeedback(button) {
        if (!button) return;

        button.style.transform = 'scale(0.95)';

        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }

    /**
     * Announce message to screen readers
     * @param {string} message - Message to announce
     */
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;

        document.body.appendChild(announcement);

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    /**
     * Update layout on resize (performance optimization)
     */
    updateLayout() {
        // Add any layout-specific updates here
        // Currently used for future enhancements
    }

    /**
     * Setup accessibility features
     */
    setupAccessibility() {
        // Add ARIA labels and descriptions
        if (this.textInput) {
            this.textInput.setAttribute('aria-describedby', 'text-input-description');

            // Add hidden description
            const description = document.createElement('div');
            description.id = 'text-input-description';
            description.className = 'sr-only';
            description.textContent = 'Enter or paste text to analyze. Statistics will update in real-time as you type.';
            document.body.appendChild(description);
        }

        // Ensure buttons have proper labels
        const buttons = [this.copyBtn, this.downloadBtn, this.themeToggle];
        buttons.forEach(button => {
            if (button && !button.getAttribute('aria-label')) {
                const text = button.textContent || button.querySelector('svg + span')?.textContent;
                if (text) {
                    button.setAttribute('aria-label', text.trim());
                }
            }
        });

        // Add keyboard navigation hints
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    /**
     * Debounce utility function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
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
}

// Utility function to add screen reader only class
function addScreenReaderOnlyStyles() {
    if (!document.querySelector('#sr-only-styles')) {
        const style = document.createElement('style');
        style.id = 'sr-only-styles';
        style.textContent = `
      .sr-only {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }
      
      .keyboard-navigation *:focus {
        outline: 3px solid var(--accent-primary) !important;
        outline-offset: 2px !important;
      }
    `;
        document.head.appendChild(style);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add screen reader styles
    addScreenReaderOnlyStyles();

    // Initialize Word Counter
    const wordCounter = new WordCounter();

    // Make it globally available for debugging (development only)
    if (typeof window !== 'undefined') {
        window.wordCounter = wordCounter;
    }
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Re-focus textarea if it was focused before
        const textInput = document.getElementById('textInput');
        if (textInput && textInput.value.length === 0) {
            textInput.focus();
        }
    }
});

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WordCounter;
}
