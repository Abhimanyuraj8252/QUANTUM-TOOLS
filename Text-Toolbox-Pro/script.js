/**
 * Text Toolbox Pro - A comprehensive suite of text manipulation utilities
 * Vanilla JavaScript implementation with modular approach
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the application
    const app = new TextToolboxPro();
    app.init();
});

/**
 * Main application class for Text Toolbox Pro
 */
class TextToolboxPro {    constructor() {
        // Initialize properties
        this.currentTool = 'sorter'; // Default active tool
        this.isDarkTheme = false; // Default theme is light
        
        // History storage for undo/redo functionality
        this.history = {};
        this.historyIndex = {};
        
        // Load saved theme preference from localStorage
        this.loadThemePreference();
    }    /**
     * Initialize the application
     */
    init() {
        this.initNavigation();
        this.initThemeToggle();
        this.initToolFunctionality();
        
        // Check for hash in URL for direct tool access
        const hash = window.location.hash.replace('#', '');
        if (hash && document.getElementById(hash)) {
            this.switchTool(hash, false);
        }
        
        // Add hash change listener
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.replace('#', '');
            if (hash && document.getElementById(hash)) {
                this.switchTool(hash, false);
            }
        });
        
        this.updatePageTitle();
    }

    /**
     * Initialize navigation and sidebar functionality
     */
    initNavigation() {
        // Tool navigation
        const toolItems = document.querySelectorAll('.tool-nav li');
        toolItems.forEach(item => {
            item.addEventListener('click', () => {
                const toolId = item.dataset.tool;
                // Update URL hash for direct linking
                window.location.hash = toolId;
                this.switchTool(toolId, true);
            });
        });

        // Mobile menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('menu-open');
        });
        
        // Close menu when a tool is selected on mobile
        if (window.innerWidth <= 768) {
            toolItems.forEach(item => {
                item.addEventListener('click', () => {
                    sidebar.classList.remove('menu-open');
                });
            });
        }
    }

    /**
     * Initialize theme toggle functionality
     */
    initThemeToggle() {
        const themeToggle = document.querySelector('.toggle-theme');
        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Apply the current theme
        this.applyTheme();
    }

    /**
     * Switch between tools
     */    switchTool(toolId, updateHash = true) {
        // Update navigation
        document.querySelectorAll('.tool-nav li').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.tool === toolId) {
                item.classList.add('active');
            }
        });

        // Hide all tool sections
        document.querySelectorAll('.tool-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show selected tool section
        const selectedTool = document.getElementById(toolId);
        if (selectedTool) {
            selectedTool.classList.add('active');
            
            // Update current tool and page title
            this.currentTool = toolId;
            this.updatePageTitle();
            
            // Update URL hash if needed
            if (updateHash && window.location.hash !== `#${toolId}`) {
                window.location.hash = toolId;
            }
        }
    }

    /**
     * Toggle between light and dark theme
     */
    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        this.applyTheme();
        
        // Save theme preference
        localStorage.setItem('textToolboxTheme', this.isDarkTheme ? 'dark' : 'light');
        
        // Update icon
        const themeIcon = document.querySelector('.toggle-theme i');
        themeIcon.className = this.isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';
    }

    /**
     * Apply current theme to the body
     */
    applyTheme() {
        const body = document.body;
        if (this.isDarkTheme) {
            body.setAttribute('data-theme', 'dark');
        } else {
            body.removeAttribute('data-theme');
        }
        
        // Update icon
        const themeIcon = document.querySelector('.toggle-theme i');
        themeIcon.className = this.isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';
    }

    /**
     * Load saved theme preference
     */
    loadThemePreference() {
        const savedTheme = localStorage.getItem('textToolboxTheme');
        if (savedTheme === 'dark') {
            this.isDarkTheme = true;
        }
    }

    /**
     * Update page title based on current tool
     */
    updatePageTitle() {
        const toolNames = {
            'sorter': 'Line Sorter',
            'find-replace': 'Find & Replace',
            'duplicate-remover': 'Duplicate Remover',
            'whitespace-remover': 'Whitespace Remover',            'text-reverser': 'Text Reverser',
            'lorem-ipsum': 'Lorem Ipsum Generator',
            'uuid-generator': 'UUID Generator',
            'base64': 'Base64 Encoder/Decoder',
            'url-encoder': 'URL Encoder/Decoder',
            'minifier': 'Code Minifier',
            'diff-checker': 'Diff Checker',
            'markdown': 'Markdown Converter'
        };
        
        document.title = `${toolNames[this.currentTool]} | Text Toolbox Pro`;
    }    /**
     * Initialize all tool functionality
     */
    initToolFunctionality() {
        this.initSorterTool();
        this.initFindReplaceTool();
        this.initDuplicateRemoverTool();
        this.initWhitespaceRemoverTool();        this.initTextReverserTool();
        this.initLoremIpsumGenerator();
        this.initUuidGenerator();
        this.initBase64Tool();
        this.initUrlEncoderTool();
        this.initMinifierTool();
        this.initDiffCheckerTool();
        this.initMarkdownTool();
        
        // Initialize global utility features
        this.initCopyButtons();
        this.initClearButtons();
        this.initUndoRedoFunctionality(); // Initialize undo/redo functionality
    }
    
    /**
     * Tool 1: Line Sorter
     */
    initSorterTool() {
        const section = document.getElementById('sorter');
        const textarea = section.querySelector('.input-text');
        
        // Sort A-Z (Alphabetical)
        section.querySelector('.sort-az').addEventListener('click', () => {
            this.sortLines(textarea, (a, b) => a.localeCompare(b));
        });
        
        // Sort Z-A (Reverse Alphabetical)
        section.querySelector('.sort-za').addEventListener('click', () => {
            this.sortLines(textarea, (a, b) => b.localeCompare(a));
        });
        
        // Sort 1-9 (Numerical)
        section.querySelector('.sort-19').addEventListener('click', () => {
            this.sortLines(textarea, (a, b) => {
                const numA = parseFloat(a) || 0;
                const numB = parseFloat(b) || 0;
                return numA - numB;
            });
        });
        
        // Sort 9-1 (Reverse Numerical)
        section.querySelector('.sort-91').addEventListener('click', () => {
            this.sortLines(textarea, (a, b) => {
                const numA = parseFloat(a) || 0;
                const numB = parseFloat(b) || 0;
                return numB - numA;
            });
        });
        
        // Reverse Order
        section.querySelector('.sort-reverse').addEventListener('click', () => {
            const lines = textarea.value.split('\n');
            textarea.value = lines.reverse().join('\n');
        });
    }
    
    /**
     * Helper function to sort lines in a textarea
     */
    sortLines(textarea, compareFn) {
        const lines = textarea.value.split('\n');
        textarea.value = lines.sort(compareFn).join('\n');
    }
      /**
     * Tool 2: Find & Replace
     */
    initFindReplaceTool() {
        const section = document.getElementById('find-replace');
        const textarea = section.querySelector('.input-text');
        const findInput = section.querySelector('#find-text');
        const replaceInput = section.querySelector('#replace-text');
        const caseSensitiveCheck = section.querySelector('#case-sensitive');
        const wholeWordsCheck = section.querySelector('#whole-words');
        
        // Highlight matches as user types in find box
        findInput.addEventListener('input', () => {
            this.highlightMatches(textarea, findInput.value, caseSensitiveCheck.checked, wholeWordsCheck.checked);
        });
        
        // Update highlights when options change
        caseSensitiveCheck.addEventListener('change', () => {
            this.highlightMatches(textarea, findInput.value, caseSensitiveCheck.checked, wholeWordsCheck.checked);
        });
        
        wholeWordsCheck.addEventListener('change', () => {
            this.highlightMatches(textarea, findInput.value, caseSensitiveCheck.checked, wholeWordsCheck.checked);
        });
        
        // Replace First
        section.querySelector('.replace-first').addEventListener('click', () => {
            if (!findInput.value) return;
            
            const text = textarea.value;
            const findText = findInput.value;
            const replaceText = replaceInput.value;
            const isCaseSensitive = caseSensitiveCheck.checked;
            const isWholeWord = wholeWordsCheck.checked;
            
            let flags = isCaseSensitive ? '' : 'i';
            let pattern = isWholeWord ? `\\b${this.escapeRegExp(findText)}\\b` : this.escapeRegExp(findText);
            
            const regex = new RegExp(pattern, flags);
            const result = text.replace(regex, replaceText);
            
            textarea.value = result;
            
            // Update highlights after replacement
            this.highlightMatches(textarea, findInput.value, isCaseSensitive, isWholeWord);
        });
        
        // Replace All
        section.querySelector('.replace-all').addEventListener('click', () => {
            if (!findInput.value) return;
            
            const text = textarea.value;
            const findText = findInput.value;
            const replaceText = replaceInput.value;
            const isCaseSensitive = caseSensitiveCheck.checked;
            const isWholeWord = wholeWordsCheck.checked;
            
            let flags = isCaseSensitive ? 'g' : 'gi';
            let pattern = isWholeWord ? `\\b${this.escapeRegExp(findText)}\\b` : this.escapeRegExp(findText);
            
            const regex = new RegExp(pattern, flags);
            const result = text.replace(regex, replaceText);
            
            textarea.value = result;
            
            // Update highlights after replacement
            this.highlightMatches(textarea, findInput.value, isCaseSensitive, isWholeWord);
        });
        
        // Add custom styling for the highlighted textarea
        const style = document.createElement('style');
        style.innerHTML = `
            .highlight-wrapper {
                position: relative;
                width: 100%;
                height: 100%;
            }
            .highlight-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                white-space: pre-wrap;
                overflow-wrap: break-word;
                overflow: hidden;
                background: transparent;
                color: transparent;
                z-index: 1;
            }
            .highlight-backdrop mark {
                color: transparent;
                background-color: rgba(255, 255, 0, 0.3);
                border-radius: 2px;
            }
            .highlight-textarea {
                position: relative;
                background: transparent !important;
                z-index: 2;
                width: 100%;
                height: 100%;
            }
        `;
        document.head.appendChild(style);
        
        // Create a wrapper for the textarea for highlighting
        this.setupHighlightingContainer(textarea);
    }
    
    /**
     * Set up the highlighting container for text highlighting
     */
    setupHighlightingContainer(textarea) {
        // First check if it's already been set up
        if (textarea.parentElement && textarea.parentElement.classList.contains('highlight-wrapper')) {
            return;
        }
        
        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'highlight-wrapper';
        
        // Create backdrop for highlights
        const backdrop = document.createElement('div');
        backdrop.className = 'highlight-backdrop';
        
        // Insert wrapper before textarea and move textarea inside
        textarea.parentNode.insertBefore(wrapper, textarea);
        wrapper.appendChild(backdrop);
        wrapper.appendChild(textarea);
        
        // Copy styling
        const styles = window.getComputedStyle(textarea);
        backdrop.style.fontFamily = styles.fontFamily;
        backdrop.style.fontSize = styles.fontSize;
        backdrop.style.fontWeight = styles.fontWeight;
        backdrop.style.lineHeight = styles.lineHeight;
        backdrop.style.padding = styles.padding;
        backdrop.style.border = styles.border;
        
        // Make sure the textarea has the right class
        textarea.classList.add('highlight-textarea');
        
        // Sync scroll positions
        textarea.addEventListener('scroll', () => {
            backdrop.scrollTop = textarea.scrollTop;
            backdrop.scrollLeft = textarea.scrollLeft;
        });
    }
    
    /**
     * Highlight matches in the textarea
     */
    highlightMatches(textarea, searchText, caseSensitive, wholeWord) {
        // First make sure the highlighting container is set up
        this.setupHighlightingContainer(textarea);
        
        const backdrop = textarea.parentElement.querySelector('.highlight-backdrop');
        if (!backdrop) return;
        
        // If search text is empty, clear highlights
        if (!searchText) {
            backdrop.innerHTML = textarea.value;
            return;
        }
        
        try {
            // Create regex for matching
            let flags = caseSensitive ? 'g' : 'gi';
            let pattern = wholeWord ? `\\b${this.escapeRegExp(searchText)}\\b` : this.escapeRegExp(searchText);
            const regex = new RegExp(pattern, flags);
            
            // Escape HTML and mark matches
            let html = textarea.value
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
                
            html = html.replace(regex, match => `<mark>${match}</mark>`);
            
            // Add line breaks
            html = html.replace(/\n/g, '<br>');
            
            // Update the backdrop HTML
            backdrop.innerHTML = html;
        } catch (e) {
            console.error('Error highlighting matches:', e);
        }
    }
    
    /**
     * Helper function to escape regex special characters
     */
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
    
    /**
     * Tool 3: Duplicate Line Remover
     */
    initDuplicateRemoverTool() {
        const section = document.getElementById('duplicate-remover');
        const textarea = section.querySelector('.input-text');
        
        section.querySelector('.remove-duplicates').addEventListener('click', () => {
            const lines = textarea.value.split('\n');
            const uniqueLines = [...new Set(lines)];
            textarea.value = uniqueLines.join('\n');
        });
    }
    
    /**
     * Tool 4: Whitespace Remover
     */
    initWhitespaceRemoverTool() {
        const section = document.getElementById('whitespace-remover');
        const textarea = section.querySelector('.input-text');
        
        // Remove Leading & Trailing Spaces
        section.querySelector('.remove-trim').addEventListener('click', () => {
            const lines = textarea.value.split('\n');
            textarea.value = lines.map(line => line.trim()).join('\n');
        });
        
        // Remove All Empty Lines
        section.querySelector('.remove-empty-lines').addEventListener('click', () => {
            const lines = textarea.value.split('\n');
            textarea.value = lines.filter(line => line.trim() !== '').join('\n');
        });
        
        // Condense All Whitespace
        section.querySelector('.condense-whitespace').addEventListener('click', () => {
            const text = textarea.value;
            textarea.value = text.replace(/\s+/g, ' ');
        });
    }
    
    /**
     * Tool 5: Text Reverser
     */
    initTextReverserTool() {
        const section = document.getElementById('text-reverser');
        const textarea = section.querySelector('.input-text');
        
        // Reverse Entire Text
        section.querySelector('.reverse-all').addEventListener('click', () => {
            const text = textarea.value;
            textarea.value = text.split('').reverse().join('');
        });
        
        // Reverse Words
        section.querySelector('.reverse-words').addEventListener('click', () => {
            const text = textarea.value;
            textarea.value = text.split(/\s+/).reverse().join(' ');
        });
        
        // Reverse Characters in Each Word
        section.querySelector('.reverse-chars').addEventListener('click', () => {
            const text = textarea.value;
            textarea.value = text.split(/\s+/).map(word => word.split('').reverse().join('')).join(' ');
        });
    }    /**
     * Tool 6: Lorem Ipsum Generator
     */
    initLoremIpsumGenerator() {
        const section = document.getElementById('lorem-ipsum');
        const quantityInput = section.querySelector('#lorem-quantity');
        const outputArea = section.querySelector('.output-text');
        
        section.querySelector('.generate-lorem').addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value) || 1;
            const type = document.querySelector('input[name="lorem-type"]:checked').value;
            
            outputArea.value = this.generateLoremIpsum(quantity, type);
        });
    }
    
    /**
     * Generate Lorem Ipsum text
     */
    generateLoremIpsum(quantity, type) {
        const loremWords = [
            'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
            'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'ut',
            'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris',
            'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor',
            'in', 'reprehenderit', 'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat',
            'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt',
            'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
        ];
        
        // Generate Lorem Ipsum based on type and quantity
        switch (type) {
            case 'words':
                return this.generateRandomWords(loremWords, quantity);
                
            case 'sentences':
                return this.generateRandomSentences(loremWords, quantity);
                
            case 'paragraphs':
            default:
                return this.generateRandomParagraphs(loremWords, quantity);
        }
    }
    
    /**
     * Helper function to generate random words
     */
    generateRandomWords(wordList, count) {
        const result = [];
        
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * wordList.length);
            result.push(wordList[randomIndex]);
        }
        
        // Capitalize first word
        if (result.length > 0) {
            result[0] = result[0].charAt(0).toUpperCase() + result[0].slice(1);
        }
        
        return result.join(' ');
    }
    
    /**
     * Helper function to generate random sentences
     */
    generateRandomSentences(wordList, count) {
        const result = [];
        
        for (let i = 0; i < count; i++) {
            const sentenceLength = Math.floor(Math.random() * 10) + 5; // 5-15 words per sentence
            const sentence = this.generateRandomWords(wordList, sentenceLength);
            result.push(sentence + '.');
        }
        
        return result.join(' ');
    }
    
    /**
     * Helper function to generate random paragraphs
     */
    generateRandomParagraphs(wordList, count) {
        const result = [];
        
        // Always start with "Lorem ipsum" for the first paragraph
        for (let i = 0; i < count; i++) {
            const sentenceCount = Math.floor(Math.random() * 3) + 3; // 3-6 sentences per paragraph
            let paragraph;
            
            if (i === 0) {
                const firstSentence = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
                const remainingSentences = this.generateRandomSentences(wordList, sentenceCount - 1);
                paragraph = firstSentence + ' ' + remainingSentences;
            } else {
                paragraph = this.generateRandomSentences(wordList, sentenceCount);
            }
            
            result.push(paragraph);
        }
        
        return result.join('\n\n');
    }
    
    /**
     * Tool 8: UUID/GUID Generator
     */
    initUuidGenerator() {
        const section = document.getElementById('uuid-generator');
        const quantityInput = section.querySelector('#uuid-quantity');
        const outputArea = section.querySelector('.output-text');
        
        section.querySelector('.generate-uuid').addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value) || 1;
            const maxLimit = 1000;
            
            // Limit quantity to prevent performance issues
            const actualQuantity = Math.min(quantity, maxLimit);
            if (actualQuantity !== quantity) {
                alert(`Maximum limit is ${maxLimit} UUIDs. Generating ${maxLimit} UUIDs.`);
            }
            
            let uuids = [];
            for (let i = 0; i < actualQuantity; i++) {
                uuids.push(this.generateUUID());
            }
            
            outputArea.value = uuids.join('\n');
        });
    }
    
    /**
     * Generate a random UUID
     */
    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    /**
     * Tool 9: Base64 Encoder/Decoder
     */
    initBase64Tool() {
        const section = document.getElementById('base64');
        const plainText = section.querySelector('.plain-text');
        const base64Text = section.querySelector('.base64-text');
        
        // Encode when plain text changes
        plainText.addEventListener('input', () => {
            if (plainText === document.activeElement) {
                const text = plainText.value;
                try {
                    base64Text.value = text ? btoa(text) : '';
                } catch (e) {
                    base64Text.value = 'Error: Cannot encode the input text to Base64.';
                }
            }
        });
        
        // Decode when base64 changes
        base64Text.addEventListener('input', () => {
            if (base64Text === document.activeElement) {
                const text = base64Text.value;
                try {
                    plainText.value = text ? atob(text) : '';
                } catch (e) {
                    plainText.value = 'Error: Invalid Base64 input.';
                }
            }
        });
        
        // Copy buttons
        section.querySelector('.copy-plain').addEventListener('click', () => {
            this.copyToClipboard(plainText.value);
            section.querySelector('.copy-plain').classList.add('copy-success');
            setTimeout(() => {
                section.querySelector('.copy-plain').classList.remove('copy-success');
            }, 1000);
        });
        
        section.querySelector('.copy-base64').addEventListener('click', () => {
            this.copyToClipboard(base64Text.value);
            section.querySelector('.copy-base64').classList.add('copy-success');
            setTimeout(() => {
                section.querySelector('.copy-base64').classList.remove('copy-success');
            }, 1000);
        });
    }
    
    /**
     * Tool 10: URL Encoder/Decoder
     */
    initUrlEncoderTool() {
        const section = document.getElementById('url-encoder');
        const rawUrl = section.querySelector('.raw-url');
        const encodedUrl = section.querySelector('.encoded-url');
        
        // Encode when raw URL changes
        rawUrl.addEventListener('input', () => {
            if (rawUrl === document.activeElement) {
                const text = rawUrl.value;
                try {
                    encodedUrl.value = text ? encodeURIComponent(text) : '';
                } catch (e) {
                    encodedUrl.value = 'Error: Cannot encode the input text.';
                }
            }
        });
        
        // Decode when encoded URL changes
        encodedUrl.addEventListener('input', () => {
            if (encodedUrl === document.activeElement) {
                const text = encodedUrl.value;
                try {
                    rawUrl.value = text ? decodeURIComponent(text) : '';
                } catch (e) {
                    rawUrl.value = 'Error: Invalid URL encoding.';
                }
            }
        });
        
        // Copy buttons
        section.querySelector('.copy-raw').addEventListener('click', () => {
            this.copyToClipboard(rawUrl.value);
            section.querySelector('.copy-raw').classList.add('copy-success');
            setTimeout(() => {
                section.querySelector('.copy-raw').classList.remove('copy-success');
            }, 1000);
        });
        
        section.querySelector('.copy-encoded').addEventListener('click', () => {
            this.copyToClipboard(encodedUrl.value);
            section.querySelector('.copy-encoded').classList.add('copy-success');
            setTimeout(() => {
                section.querySelector('.copy-encoded').classList.remove('copy-success');
            }, 1000);
        });
    }
    
    /**
     * Tool 11: HTML/CSS/JS Minifier
     */
    initMinifierTool() {
        const section = document.getElementById('minifier');
        const originalCode = section.querySelector('.original-code');
        const minifiedCode = section.querySelector('.minified-code');
        
        section.querySelector('.minify-button').addEventListener('click', () => {
            const code = originalCode.value;
            if (!code) return;
            
            minifiedCode.value = this.minifyCode(code);
        });
        
        section.querySelector('.copy-minified').addEventListener('click', () => {
            this.copyToClipboard(minifiedCode.value);
            section.querySelector('.copy-minified').classList.add('copy-success');
            setTimeout(() => {
                section.querySelector('.copy-minified').classList.remove('copy-success');
            }, 1000);
        });
    }
    
    /**
     * Simple code minifier
     */
    minifyCode(code) {
        // Basic minification rules
        let minified = code;
        
        // Remove HTML comments
        minified = minified.replace(/<!--[\s\S]*?-->/g, '');
        
        // Remove CSS/JS comments
        minified = minified.replace(/\/\*[\s\S]*?\*\//g, ''); // /* ... */
        minified = minified.replace(/\/\/[^\n]*/g, ''); // // ...
        
        // Remove extra whitespace
        minified = minified.replace(/\s+/g, ' ');
        
        // Remove whitespace next to brackets and punctuation
        minified = minified.replace(/\s*{\s*/g, '{');
        minified = minified.replace(/\s*}\s*/g, '}');
        minified = minified.replace(/\s*;\s*/g, ';');
        minified = minified.replace(/\s*:\s*/g, ':');
        minified = minified.replace(/\s*,\s*/g, ',');
        
        // Trim leading and trailing whitespace
        minified = minified.trim();
        
        return minified;
    }
    
    /**
     * Tool 12: Diff Checker
     */    initDiffCheckerTool() {
        const section = document.getElementById('diff-checker');
        const originalText = section.querySelector('.original-text');
        const changedText = section.querySelector('.changed-text');
        const diffResult = section.querySelector('.diff-result');
        
        // Function to dynamically load the diff library
        const loadDiffLibrary = () => {
            return new Promise((resolve, reject) => {
                // Check if the Diff object is already available
                if (typeof Diff !== 'undefined') {
                    resolve(Diff);
                    return;
                }
                
                console.log('Attempting to load diff library...');
                
                // Create a script element to load the library
                const script = document.createElement('script');
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/diff/5.1.0/diff.min.js';
                script.async = true;
                
                // Handle successful loading
                script.onload = () => {
                    console.log('Diff library loaded successfully');
                    if (typeof Diff !== 'undefined') {
                        resolve(Diff);
                    } else {
                        reject(new Error('Diff library loaded but Diff object not found'));
                    }
                };
                
                // Handle loading errors
                script.onerror = () => {
                    console.error('Failed to load diff library');
                    reject(new Error('Failed to load diff library'));
                };
                
                // Add the script to the document
                document.head.appendChild(script);
            });
        };
        
        // Create a simple diff visualization
        const createSimpleDiff = (original, changed) => {
            // Clear previous result
            diffResult.innerHTML = '';
            
            // Create sections for removed and added content
            const removedDiv = document.createElement('div');
            removedDiv.className = 'diff-removed';
            removedDiv.textContent = original;
            
            const addedDiv = document.createElement('div');
            addedDiv.className = 'diff-added';
            addedDiv.textContent = changed;
            
            // Add a separator
            const separator = document.createElement('hr');
            
            // Add elements to the result
            diffResult.appendChild(document.createTextNode('Original Text:'));
            diffResult.appendChild(removedDiv);
            diffResult.appendChild(separator);
            diffResult.appendChild(document.createTextNode('Changed Text:'));
            diffResult.appendChild(addedDiv);
        };
        
        section.querySelector('.compare-button').addEventListener('click', () => {
            const original = originalText.value;
            const changed = changedText.value;
            
            if (!original && !changed) return;
            
            // Show loading message
            diffResult.textContent = 'Comparing texts...';
            
            // Try to load the library and perform the diff
            loadDiffLibrary()
                .then(DiffLib => {
                    // Use the diff library to compare texts
                    const diff = DiffLib.diffLines(original, changed);
                    const fragment = document.createDocumentFragment();
                    
                    diff.forEach((part) => {
                        const color = part.added ? 'diff-added' : part.removed ? 'diff-removed' : 'diff-unchanged';
                        const span = document.createElement('span');
                        span.className = color;
                        span.textContent = part.value;
                        fragment.appendChild(span);
                    });
                    
                    // Clear previous content and show the result
                    diffResult.innerHTML = '';
                    diffResult.appendChild(fragment);
                })
                .catch(error => {
                    console.error('Error in diff operation:', error);
                    
                    // Fall back to simple diff visualization
                    createSimpleDiff(original, changed);
                });
        });
    }
    
    /**
     * Tool 13: Markdown to HTML Converter
     */
    initMarkdownTool() {
        const section = document.getElementById('markdown');
        const markdownInput = section.querySelector('.markdown-input');
        const htmlPreview = section.querySelector('.html-preview');
        
        // Convert markdown to HTML as user types
        markdownInput.addEventListener('input', () => {
            const markdown = markdownInput.value;
            
            // Use marked.js library if available
            if (typeof marked !== 'undefined') {
                htmlPreview.innerHTML = marked.parse(markdown);
            } else {
                // Simple fallback if library isn't available
                htmlPreview.innerHTML = `<pre>${markdown}</pre><p><em>Markdown parsing library not loaded.</em></p>`;
            }
        });
        
        // Trigger initial conversion if there's default content
        if (markdownInput.value) {
            const event = new Event('input');
            markdownInput.dispatchEvent(event);
        }
        
        // Copy buttons
        section.querySelector('.copy-markdown').addEventListener('click', () => {
            this.copyToClipboard(markdownInput.value);
            section.querySelector('.copy-markdown').classList.add('copy-success');
            setTimeout(() => {
                section.querySelector('.copy-markdown').classList.remove('copy-success');
            }, 1000);
        });
        
        section.querySelector('.copy-html').addEventListener('click', () => {
            this.copyToClipboard(htmlPreview.innerHTML);
            section.querySelector('.copy-html').classList.add('copy-success');
            setTimeout(() => {
                section.querySelector('.copy-html').classList.remove('copy-success');
            }, 1000);
        });
    }
    
    /**
     * Initialize all copy buttons
     */
    initCopyButtons() {
        document.querySelectorAll('.copy-button').forEach(button => {
            button.addEventListener('click', () => {
                // Find the textarea in the same tool container
                const container = button.closest('.tool-container');
                const textarea = container.querySelector('textarea');
                
                if (textarea) {
                    this.copyToClipboard(textarea.value);
                    button.classList.add('copy-success');
                    setTimeout(() => {
                        button.classList.remove('copy-success');
                    }, 1000);
                }
            });
        });
    }
    
    /**
     * Initialize all clear buttons
     */
    initClearButtons() {
        document.querySelectorAll('.clear-button').forEach(button => {
            button.addEventListener('click', () => {
                // Get the parent tool section
                const toolSection = button.closest('.tool-section');
                
                // Clear all textareas in the section
                toolSection.querySelectorAll('textarea').forEach(textarea => {
                    textarea.value = '';
                });
                
                // Clear any other output elements
                const asciiOutput = toolSection.querySelector('.ascii-output');
                if (asciiOutput) {
                    asciiOutput.textContent = '';
                }
                
                const diffResult = toolSection.querySelector('.diff-result');
                if (diffResult) {
                    diffResult.innerHTML = '';
                }
                
                const htmlPreview = toolSection.querySelector('.html-preview');
                if (htmlPreview) {
                    htmlPreview.innerHTML = '';
                }
                
                // Clear any input fields
                toolSection.querySelectorAll('input[type="text"]').forEach(input => {
                    input.value = '';
                });
            });
        });
    }
    
    /**
     * Initialize undo/redo functionality for all textareas
     */
    initUndoRedoFunctionality() {
        // Setup for all textareas
        document.querySelectorAll('textarea').forEach(textarea => {
            const toolId = textarea.closest('.tool-section').id;
            
            // Initialize history for this textarea if it doesn't exist
            if (!this.history[toolId]) {
                this.history[toolId] = [''];
                this.historyIndex[toolId] = 0;
            }
            
            // Store initial state
            textarea.addEventListener('focus', () => {
                if (!this.history[toolId] || this.history[toolId].length === 0) {
                    this.history[toolId] = [textarea.value];
                    this.historyIndex[toolId] = 0;
                }
            });
            
            // Listen for changes
            textarea.addEventListener('input', () => {
                // Don't record history if the change was made by undo/redo
                if (textarea.dataset.historyUpdate === 'true') {
                    textarea.dataset.historyUpdate = 'false';
                    return;
                }
                
                // Add new state to history
                const currentValue = textarea.value;
                
                // If we've gone back in history and now make a change,
                // truncate the forward history
                if (this.historyIndex[toolId] < this.history[toolId].length - 1) {
                    this.history[toolId] = this.history[toolId].slice(0, this.historyIndex[toolId] + 1);
                }
                
                // Only add to history if the value has changed
                if (currentValue !== this.history[toolId][this.historyIndex[toolId]]) {
                    this.history[toolId].push(currentValue);
                    this.historyIndex[toolId] = this.history[toolId].length - 1;
                }
            });
            
            // Add undo/redo keyboard shortcuts
            textarea.addEventListener('keydown', (e) => {
                // Ctrl+Z for undo
                if (e.ctrlKey && e.key === 'z') {
                    e.preventDefault();
                    this.performUndo(textarea);
                }
                
                // Ctrl+Y for redo
                if (e.ctrlKey && e.key === 'y') {
                    e.preventDefault();
                    this.performRedo(textarea);
                }
            });
        });
        
        // Add undo/redo buttons to each tool container with textareas
        document.querySelectorAll('.tool-container').forEach(container => {
            const textarea = container.querySelector('textarea');
            if (!textarea) return;
            
            const controlsDiv = container.querySelector('.controls');
            if (!controlsDiv) return;
            
            // Create undo/redo buttons
            const undoButton = document.createElement('button');
            undoButton.className = 'undo-button';
            undoButton.innerHTML = '<i class="fas fa-undo"></i> Undo';
            undoButton.addEventListener('click', () => {
                const activeTextarea = container.querySelector('textarea');
                if (activeTextarea) this.performUndo(activeTextarea);
            });
            
            const redoButton = document.createElement('button');
            redoButton.className = 'redo-button';
            redoButton.innerHTML = '<i class="fas fa-redo"></i> Redo';
            redoButton.addEventListener('click', () => {
                const activeTextarea = container.querySelector('textarea');
                if (activeTextarea) this.performRedo(activeTextarea);
            });
            
            // Insert at beginning of controls
            controlsDiv.prepend(redoButton);
            controlsDiv.prepend(undoButton);
        });
    }
    
    /**
     * Perform undo operation
     */
    performUndo(textarea) {
        const toolId = textarea.closest('.tool-section').id;
        
        if (!this.history[toolId] || this.historyIndex[toolId] <= 0) return;
        
        this.historyIndex[toolId]--;
        textarea.dataset.historyUpdate = 'true';
        textarea.value = this.history[toolId][this.historyIndex[toolId]];
        
        // Trigger any associated events
        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);
    }
    
    /**
     * Perform redo operation
     */
    performRedo(textarea) {
        const toolId = textarea.closest('.tool-section').id;
        
        if (!this.history[toolId] || this.historyIndex[toolId] >= this.history[toolId].length - 1) return;
        
        this.historyIndex[toolId]++;
        textarea.dataset.historyUpdate = 'true';
        textarea.value = this.history[toolId][this.historyIndex[toolId]];
        
        // Trigger any associated events
        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);
    }
}
