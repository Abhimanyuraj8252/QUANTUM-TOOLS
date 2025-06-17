// Advanced Word & Character Counter - QUANTUM TOOLS
// Real-time text analysis with comprehensive statistics

class AdvancedWordCounter {
    constructor() {
        this.textInput = document.getElementById('text-input');
        this.clearBtn = document.getElementById('clear-btn');
        this.themeToggle = document.getElementById('theme-toggle');
        this.fileInput = document.getElementById('file-input');
        this.importBtn = document.getElementById('import-btn');
        this.exportBtn = document.getElementById('export-btn');
        this.copyStatsBtn = document.getElementById('copy-stats-btn');
        this.fullscreenBtn = document.getElementById('fullscreen-btn');
        this.sampleTextBtn = document.getElementById('sample-text-btn');
        this.readingSpeedSlider = document.getElementById('reading-speed');
        this.readingSpeedValue = document.getElementById('reading-speed-value');
        this.analysisMode = document.getElementById('analysis-mode');
        
        // Text tools
        this.textToSpeechBtn = document.getElementById('text-to-speech-btn');
        this.findReplaceBtn = document.getElementById('find-replace-btn');
        this.wordCloudBtn = document.getElementById('word-cloud-btn');
        
        // Enhanced search elements
        this.enhancedSearchBtn = document.getElementById('enhanced-search-btn');
        this.enhancedSearchPanel = document.getElementById('enhanced-search-panel');
        this.searchInput = document.getElementById('search-input');
        this.searchBtn = document.getElementById('search-btn');
        this.clearSearchBtn = document.getElementById('clear-search-btn');
        this.caseSensitiveSearch = document.getElementById('case-sensitive-search');
        this.wholeWordSearch = document.getElementById('whole-word-search');
        this.regexSearch = document.getElementById('regex-search');
        this.currentMatchEl = document.getElementById('current-match');
        this.totalMatchesEl = document.getElementById('total-matches');
        this.prevMatchBtn = document.getElementById('prev-match-btn');
        this.nextMatchBtn = document.getElementById('next-match-btn');
        this.resultsSummary = document.getElementById('results-summary');
        this.searchHighlightsList = document.getElementById('search-highlights-list');
        
        // Enhanced features elements
        this.sentimentAnalysisBtn = document.getElementById('sentiment-analysis-btn');
        this.plagiarismCheckerBtn = document.getElementById('plagiarism-checker-btn');
        
        // Sentiment analysis elements
        this.sentimentValue = document.getElementById('sentiment-value');
        this.positiveBar = document.getElementById('positive-bar');
        this.neutralBar = document.getElementById('neutral-bar');
        this.negativeBar = document.getElementById('negative-bar');
        this.positivePercent = document.getElementById('positive-percent');
        this.neutralPercent = document.getElementById('neutral-percent');
        this.negativePercent = document.getElementById('negative-percent');
        
        // Language detection elements
        this.detectedLanguage = document.getElementById('detected-language');
        this.languageConfidence = document.getElementById('language-confidence');
        
        // Writing statistics elements
        this.writingPace = document.getElementById('writing-pace');
        this.estimatedWritingTime = document.getElementById('estimated-writing-time');
        this.textDensity = document.getElementById('text-density');
        
        // Quality metrics elements
        this.repetitionBar = document.getElementById('repetition-bar');
        this.clarityBar = document.getElementById('clarity-bar');
        this.engagementBar = document.getElementById('engagement-bar');
        this.repetitionScore = document.getElementById('repetition-score');
        this.clarityScore = document.getElementById('clarity-score');
        this.engagementScore = document.getElementById('engagement-score');
        
        // Tab system
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        // Modal elements
        this.findReplaceModal = document.getElementById('find-replace-modal');
        this.wordCloudModal = document.getElementById('word-cloud-modal');
        this.modalCloses = document.querySelectorAll('.modal-close');
        
        // Find & Replace elements
        this.findText = document.getElementById('find-text');
        this.replaceText = document.getElementById('replace-text');
        this.caseSensitive = document.getElementById('case-sensitive');
        this.wholeWords = document.getElementById('whole-words');
        this.findNextBtn = document.getElementById('find-next-btn');
        this.replaceBtn = document.getElementById('replace-btn');
        this.replaceAllBtn = document.getElementById('replace-all-btn');
        
        // Output elements - Basic
        this.wordCountEl = document.getElementById('word-count');
        this.charCountWithEl = document.getElementById('char-count-with');
        this.charCountWithoutEl = document.getElementById('char-count-without');
        this.paragraphCountEl = document.getElementById('paragraph-count');
        this.sentenceCountEl = document.getElementById('sentence-count');
        this.readingTimeEl = document.getElementById('reading-time');
        
        // Output elements - Advanced
        this.avgWordsPerSentenceEl = document.getElementById('avg-words-per-sentence');
        this.avgCharsPerWordEl = document.getElementById('avg-chars-per-word');
        this.longestWordEl = document.getElementById('longest-word');
        this.shortestWordEl = document.getElementById('shortest-word');
        this.uniqueWordsEl = document.getElementById('unique-words');
        this.vocabularyDiversityEl = document.getElementById('vocabulary-diversity');
        this.speakingTimeEl = document.getElementById('speaking-time');
        this.textComplexityEl = document.getElementById('text-complexity');
        
        // Output elements - Readability
        this.fleschEaseEl = document.getElementById('flesch-ease');
        this.fleschGradeEl = document.getElementById('flesch-grade');
        this.fleschKincaidEl = document.getElementById('flesch-kincaid');
        this.gunningFogEl = document.getElementById('gunning-fog');
        this.targetAudienceEl = document.getElementById('target-audience');
        this.readingDifficultyEl = document.getElementById('reading-difficulty');
        
        // Output elements - Keywords
        this.frequentWordsEl = document.getElementById('frequent-words');
        this.keywordDensityEl = document.getElementById('keyword-density');
        this.longtailKeywordsEl = document.getElementById('longtail-keywords');
        
        // Output elements - Structure
        this.avgParagraphLengthEl = document.getElementById('avg-paragraph-length');
        this.longestParagraphEl = document.getElementById('longest-paragraph');
        this.shortestParagraphEl = document.getElementById('shortest-paragraph');
        this.sentenceVarietyEl = document.getElementById('sentence-variety');
        this.structureMapEl = document.getElementById('structure-map');
        
        // Word Cloud
        this.wordCloudContainer = document.getElementById('word-cloud-container');
        
        // Initialize
        this.readingSpeed = 200; // WPM
        this.currentFindIndex = 0;
        this.findMatches = [];
        this.isFullscreen = false;
        this.speechSynthesis = window.speechSynthesis;
        
        // Enhanced search variables
        this.searchMatches = [];
        this.currentSearchIndex = 0;
        this.searchPanelVisible = false;
        this.highlightedElements = [];
        
        // Writing tracking
        this.startWritingTime = null;
        this.totalCharactersTyped = 0;
        this.writingStarted = false;
        
        // Auto-save functionality
        this.autoSaveInterval = null;
        this.lastSavedText = '';
        
        this.sampleTexts = {
            standard: "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet. It's commonly used to test typewriters and computer keyboards. Typography designers often use this phrase to showcase fonts and demonstrate how different letters look together.",
            academic: "The empirical evidence suggests that climate change is fundamentally altering global weather patterns. Research conducted by numerous scientific institutions demonstrates significant correlations between industrial emissions and atmospheric composition. These findings have profound implications for environmental policy and sustainable development strategies.",
            seo: "Digital marketing strategies have evolved significantly in recent years. Search engine optimization remains crucial for online visibility. Content marketing and social media engagement drive organic traffic to websites. Businesses must adapt to changing algorithms and consumer behavior patterns.",
            creative: "In the ethereal twilight, shadows danced across the moonlit meadow. The whispered secrets of ancient trees echoed through the silence. Time seemed suspended in this magical realm where dreams and reality intertwined like lovers' fingers.",
            searchDemo: "This is a demonstration text for the enhanced search feature. You can search for words like 'search', 'enhanced', 'feature', or 'demonstration'. The search function will highlight all matches and allow you to navigate between them. Try searching for 'the' to see multiple matches. You can also use regex patterns like 'search.*feature' to find advanced patterns. The case-sensitive option allows you to distinguish between 'Search' and 'search'. Whole word matching ensures exact word boundaries. This enhanced search feature makes finding specific content much easier and more efficient."
        };
        
        this.initializeEventListeners();
        this.initializeTheme();
        this.updateCounts();
        this.loadAutoSavedText();
        this.startAutoSave();
    }
    
    initializeEventListeners() {
        // Real-time counting
        this.textInput.addEventListener('input', () => {
            this.updateCounts();
            this.performSearch(); // Re-search when text changes
            this.trackWritingProgress();
        });
        this.textInput.addEventListener('paste', () => {
            setTimeout(() => {
                this.updateCounts();
                this.performSearch();
            }, 10);
        });
        
        // Controls
        this.clearBtn.addEventListener('click', () => this.clearText());
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.importBtn.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.importFile(e));
        this.exportBtn.addEventListener('click', () => this.exportReport());
        this.copyStatsBtn.addEventListener('click', () => this.copyStatsToClipboard());
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        this.sampleTextBtn.addEventListener('click', () => this.insertSampleText());
        
        // Reading speed slider
        this.readingSpeedSlider.addEventListener('input', (e) => {
            this.readingSpeed = parseInt(e.target.value);
            this.readingSpeedValue.textContent = this.readingSpeed;
            this.updateCounts();
        });
        
        // Analysis mode
        this.analysisMode.addEventListener('change', () => this.updateCounts());
        
        // Text tools
        this.textToSpeechBtn.addEventListener('click', () => this.textToSpeech());
        this.findReplaceBtn.addEventListener('click', () => this.openFindReplace());
        this.wordCloudBtn.addEventListener('click', () => this.openWordCloud());
        
        // Enhanced search functionality
        this.enhancedSearchBtn.addEventListener('click', () => this.toggleSearchPanel());
        this.searchInput.addEventListener('input', () => this.performSearch());
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch();
            }
        });
        this.searchBtn.addEventListener('click', () => this.performSearch());
        this.clearSearchBtn.addEventListener('click', () => this.clearSearch());
        this.caseSensitiveSearch.addEventListener('change', () => this.performSearch());
        this.wholeWordSearch.addEventListener('change', () => this.performSearch());
        this.regexSearch.addEventListener('change', () => this.performSearch());
        this.prevMatchBtn.addEventListener('click', () => this.navigateToMatch(-1));
        this.nextMatchBtn.addEventListener('click', () => this.navigateToMatch(1));
        
        // Enhanced features
        this.sentimentAnalysisBtn.addEventListener('click', () => this.analyzeSentiment());
        this.plagiarismCheckerBtn.addEventListener('click', () => this.checkPlagiarism());
        
        // Tab system
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
        
        // Modal close
        this.modalCloses.forEach(close => {
            close.addEventListener('click', () => this.closeModals());
        });
        
        // Find & Replace
        this.findNextBtn.addEventListener('click', () => this.findNext());
        this.replaceBtn.addEventListener('click', () => this.replace());
        this.replaceAllBtn.addEventListener('click', () => this.replaceAll());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Click outside modals to close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModals();
            }
        });
        
        // Auto-save on page unload
        window.addEventListener('beforeunload', () => {
            this.autoSaveText();
            if (this.autoSaveInterval) {
                clearInterval(this.autoSaveInterval);
            }
        });
        
        // Save on visibility change (when user switches tabs)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.autoSaveText();
            }
        });
    }
    
    initializeTheme() {
        const savedTheme = localStorage.getItem('word-counter-theme') || 'dark';
        document.body.className = `${savedTheme}-theme`;
        this.updateThemeIcon(savedTheme);
    }
    
    toggleTheme() {
        const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.body.className = `${newTheme}-theme`;
        localStorage.setItem('word-counter-theme', newTheme);
        this.updateThemeIcon(newTheme);
        
        this.themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.themeToggle.style.transform = '';
        }, 300);
    }
    
    updateThemeIcon(theme) {
        const icon = this.themeToggle.querySelector('i');
        if (theme === 'light') {
            icon.className = 'fas fa-moon';
        } else {
            icon.className = 'fas fa-sun';
        }
    }
    
    clearText() {
        this.textInput.value = '';
        this.textInput.focus();
        this.updateCounts();
        
        this.clearBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.clearBtn.style.transform = '';
        }, 150);
    }
    
    async importFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        try {
            const text = await file.text();
            this.textInput.value = text;
            this.updateCounts();
            this.showNotification('File imported successfully!', 'success');
        } catch (error) {
            this.showNotification('Error importing file', 'error');
        }
    }
    
    exportReport() {
        const stats = this.calculateAllStats(this.textInput.value);
        const report = this.generateReport(stats);
        
        const blob = new Blob([report], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `text-analysis-report-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Report exported successfully!', 'success');
    }
    
    async copyStatsToClipboard() {
        try {
            const stats = this.calculateAllStats(this.textInput.value);
            const summary = this.generateSummary(stats);
            await navigator.clipboard.writeText(summary);
            this.showNotification('Statistics copied to clipboard!', 'success');
        } catch (err) {
            this.showNotification('Failed to copy to clipboard', 'error');
        }
    }
    
    toggleFullscreen() {
        this.isFullscreen = !this.isFullscreen;
        const container = document.querySelector('.container');
        
        if (this.isFullscreen) {
            container.style.maxWidth = '100%';
            container.style.padding = '0 20px';
            this.fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i> Exit Fullscreen';
        } else {
            container.style.maxWidth = '';
            container.style.padding = '';
            this.fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i> Fullscreen';
        }
    }
    
    insertSampleText() {
        const mode = this.analysisMode.value;
        let sampleText = this.sampleTexts[mode] || this.sampleTexts.standard;
        
        // If enhanced search is open, use the search demo text
        if (this.searchPanelVisible) {
            sampleText = this.sampleTexts.searchDemo;
        }
        
        this.textInput.value = sampleText;
        this.updateCounts();
        this.performSearch(); // Re-search if search panel is open
        
        // Visual feedback
        this.sampleTextBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.sampleTextBtn.style.transform = '';
        }, 150);
        
        // If search panel is visible, suggest a search term
        if (this.searchPanelVisible && !this.searchInput.value) {
            setTimeout(() => {
                this.searchInput.placeholder = "Try searching for 'search' or 'enhanced'";
            }, 500);
        }
    }
    
    textToSpeech() {
        if (this.speechSynthesis.speaking) {
            this.speechSynthesis.cancel();
            this.textToSpeechBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            return;
        }
        
        const text = this.textInput.value.trim();
        if (!text) {
            this.showNotification('No text to speak', 'error');
            return;
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        
        utterance.onstart = () => {
            this.textToSpeechBtn.innerHTML = '<i class="fas fa-stop"></i>';
        };
        
        utterance.onend = () => {
            this.textToSpeechBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        };
        
        this.speechSynthesis.speak(utterance);
    }
    
    openFindReplace() {
        this.findReplaceModal.classList.add('active');
        this.findText.focus();
    }
    
    openWordCloud() {
        this.wordCloudModal.classList.add('active');
        this.generateWordCloud();
    }
    
    closeModals() {
        this.findReplaceModal.classList.remove('active');
        this.wordCloudModal.classList.remove('active');
    }
    
    // Enhanced Search and Highlight Functionality
    toggleSearchPanel() {
        this.searchPanelVisible = !this.searchPanelVisible;
        this.enhancedSearchPanel.style.display = this.searchPanelVisible ? 'block' : 'none';
        
        if (this.searchPanelVisible) {
            this.searchInput.focus();
            // Update button appearance
            this.enhancedSearchBtn.style.backgroundColor = 'var(--accent-color-1)';
            this.enhancedSearchBtn.style.color = 'var(--primary-bg)';
        } else {
            this.clearSearch();
            // Reset button appearance
            this.enhancedSearchBtn.style.backgroundColor = '';
            this.enhancedSearchBtn.style.color = '';
        }
    }

    performSearch() {
        const searchTerm = this.searchInput.value.trim();
        
        if (!searchTerm) {
            this.clearHighlights();
            this.updateSearchResults([]);
            return;
        }

        const text = this.textInput.value;
        let matches = [];
        
        try {
            if (this.regexSearch.checked) {
                // Regex search
                const flags = this.caseSensitiveSearch.checked ? 'g' : 'gi';
                const regex = new RegExp(searchTerm, flags);
                let match;
                while ((match = regex.exec(text)) !== null) {
                    matches.push({
                        start: match.index,
                        end: match.index + match[0].length,
                        text: match[0],
                        context: this.getContext(text, match.index, match[0].length)
                    });
                }
            } else {
                // Normal text search
                let searchPattern = searchTerm;
                let flags = 'g';
                
                if (!this.caseSensitiveSearch.checked) {
                    flags += 'i';
                }
                
                if (this.wholeWordSearch.checked) {
                    searchPattern = `\\b${this.escapeRegex(searchPattern)}\\b`;
                }
                
                const regex = new RegExp(searchPattern, flags);
                let match;
                while ((match = regex.exec(text)) !== null) {
                    matches.push({
                        start: match.index,
                        end: match.index + match[0].length,
                        text: match[0],
                        context: this.getContext(text, match.index, match[0].length)
                    });
                }
            }
        } catch (error) {
            // Invalid regex - show error
            this.resultsSummary.textContent = 'Invalid search pattern';
            this.resultsSummary.style.color = 'var(--error-color)';
            return;
        }

        this.searchMatches = matches;
        this.currentSearchIndex = matches.length > 0 ? 0 : -1;
        this.updateSearchResults(matches);
        this.highlightMatches(matches);
        
        if (matches.length > 0) {
            this.scrollToMatch(0);
        }
    }

    getContext(text, start, length) {
        const contextLength = 50;
        const beforeStart = Math.max(0, start - contextLength);
        const afterEnd = Math.min(text.length, start + length + contextLength);
        
        let before = text.substring(beforeStart, start);
        let match = text.substring(start, start + length);
        let after = text.substring(start + length, afterEnd);
        
        if (beforeStart > 0) before = '...' + before;
        if (afterEnd < text.length) after = after + '...';
        
        return { before, match, after };
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    updateSearchResults(matches) {
        this.totalMatchesEl.textContent = matches.length;
        this.currentMatchEl.textContent = matches.length > 0 ? this.currentSearchIndex + 1 : 0;
        
        // Update navigation buttons
        this.prevMatchBtn.disabled = matches.length === 0 || this.currentSearchIndex === 0;
        this.nextMatchBtn.disabled = matches.length === 0 || this.currentSearchIndex === matches.length - 1;
        
        // Update summary
        if (matches.length === 0) {
            this.resultsSummary.textContent = this.searchInput.value.trim() ? 'No matches found' : 'Start typing to search...';
            this.resultsSummary.style.color = 'var(--text-secondary)';
        } else {
            this.resultsSummary.textContent = `Found ${matches.length} match${matches.length === 1 ? '' : 'es'}`;
            this.resultsSummary.style.color = 'var(--success-color)';
        }

        // Update highlights list
        this.searchHighlightsList.innerHTML = '';
        matches.forEach((match, index) => {
            const item = document.createElement('div');
            item.className = `highlight-item ${index === this.currentSearchIndex ? 'active' : ''}`;
            item.innerHTML = `
                <div class="highlight-context">
                    ${match.context.before}<strong>${match.context.match}</strong>${match.context.after}
                </div>
                <div class="highlight-position">Position: ${match.start + 1}</div>
            `;
            item.addEventListener('click', () => this.jumpToMatch(index));
            this.searchHighlightsList.appendChild(item);
        });
    }

    highlightMatches(matches) {
        this.clearHighlights();
        
        if (matches.length === 0) return;

        // Create overlay div for highlights
        const textareaRect = this.textInput.getBoundingClientRect();
        const container = this.textInput.parentNode;
        
        if (!container.querySelector('.highlight-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'highlight-overlay';
            overlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                pointer-events: none;
                z-index: 1;
                overflow: hidden;
            `;
            container.style.position = 'relative';
            container.appendChild(overlay);
        }

        // For visual feedback, we'll change the textarea background temporarily
        matches.forEach((match, index) => {
            if (index === this.currentSearchIndex) {
                // Highlight current match by selecting text
                setTimeout(() => {
                    this.textInput.setSelectionRange(match.start, match.end);
                    this.textInput.focus();
                }, 100);
            }
        });
    }

    clearHighlights() {
        const overlay = this.textInput.parentNode.querySelector('.highlight-overlay');
        if (overlay) {
            overlay.remove();
        }
        
        // Clear text selection
        if (this.textInput.setSelectionRange) {
            this.textInput.setSelectionRange(0, 0);
        }
    }

    navigateToMatch(direction) {
        if (this.searchMatches.length === 0) return;

        this.currentSearchIndex += direction;
        
        if (this.currentSearchIndex < 0) {
            this.currentSearchIndex = this.searchMatches.length - 1;
        } else if (this.currentSearchIndex >= this.searchMatches.length) {
            this.currentSearchIndex = 0;
        }

        this.scrollToMatch(this.currentSearchIndex);
        this.updateSearchResults(this.searchMatches);
    }

    jumpToMatch(index) {
        if (index >= 0 && index < this.searchMatches.length) {
            this.currentSearchIndex = index;
            this.scrollToMatch(index);
            this.updateSearchResults(this.searchMatches);
        }
    }

    scrollToMatch(index) {
        if (index < 0 || index >= this.searchMatches.length) return;

        const match = this.searchMatches[index];
        this.textInput.focus();
        this.textInput.setSelectionRange(match.start, match.end);
        
        // Scroll to the match
        const textarea = this.textInput;
        const text = textarea.value;
        const beforeMatch = text.substring(0, match.start);
        const lines = beforeMatch.split('\n');
        const lineHeight = 20; // Approximate line height
        const scrollTop = (lines.length - 1) * lineHeight;
        
        textarea.scrollTop = Math.max(0, scrollTop - textarea.clientHeight / 2);
        
        // Add visual effect
        this.textInput.style.boxShadow = '0 0 20px var(--accent-color-1)';
        setTimeout(() => {
            this.textInput.style.boxShadow = '';
        }, 1000);
    }

    clearSearch() {
        this.searchInput.value = '';
        this.searchMatches = [];
        this.currentSearchIndex = 0;
        this.clearHighlights();
        this.updateSearchResults([]);
    }
    
    // Enhanced Text Analysis Features
    analyzeSentiment() {
        const text = this.textInput.value.trim();
        if (!text) {
            this.showMessage('Please enter some text to analyze sentiment.', 'warning');
            return;
        }

        // Simple sentiment analysis using word-based approach
        const sentimentResult = this.calculateSentiment(text);
        this.updateSentimentDisplay(sentimentResult);
        
        // Switch to enhanced tab
        this.switchTab('enhanced');
    }

    calculateSentiment(text) {
        // Basic sentiment word lists
        const positiveWords = [
            'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome', 'brilliant',
            'outstanding', 'perfect', 'beautiful', 'love', 'like', 'enjoy', 'happy', 'joy', 'pleased',
            'delighted', 'excited', 'thrilled', 'magnificent', 'superb', 'terrific', 'marvelous'
        ];
        
        const negativeWords = [
            'bad', 'terrible', 'awful', 'horrible', 'disgusting', 'hate', 'dislike', 'angry', 'sad',
            'depressed', 'disappointed', 'frustrated', 'annoyed', 'furious', 'disgusted', 'worried',
            'scared', 'fearful', 'anxious', 'stressed', 'upset', 'miserable', 'devastated'
        ];

        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        let positiveCount = 0;
        let negativeCount = 0;
        let totalWords = words.length;

        words.forEach(word => {
            if (positiveWords.includes(word)) {
                positiveCount++;
            } else if (negativeWords.includes(word)) {
                negativeCount++;
            }
        });

        const neutralCount = totalWords - positiveCount - negativeCount;
        
        const positivePercent = totalWords > 0 ? (positiveCount / totalWords) * 100 : 0;
        const negativePercent = totalWords > 0 ? (negativeCount / totalWords) * 100 : 0;
        const neutralPercent = totalWords > 0 ? (neutralCount / totalWords) * 100 : 0;

        let overallSentiment = 'Neutral';
        if (positivePercent > negativePercent && positivePercent > 5) {
            overallSentiment = 'Positive';
        } else if (negativePercent > positivePercent && negativePercent > 5) {
            overallSentiment = 'Negative';
        }

        return {
            overall: overallSentiment,
            positive: positivePercent,
            negative: negativePercent,
            neutral: neutralPercent,
            positiveWords: positiveCount,
            negativeWords: negativeCount
        };
    }
    
    // Missing essential functions for text analysis
    
    trackWritingProgress() {
        if (!this.writingStarted) {
            this.startWritingTime = Date.now();
            this.writingStarted = true;
        }
        
        const currentLength = this.textInput.value.length;
        if (currentLength > this.totalCharactersTyped) {
            this.totalCharactersTyped = currentLength;
        }
    }
    
    calculateWritingStats() {
        if (!this.writingStarted || !this.startWritingTime) {
            return { pace: 0, estimatedTime: 0, density: 0 };
        }
        
        const timeElapsed = (Date.now() - this.startWritingTime) / 60000; // minutes
        const wordsTyped = this.textInput.value.trim().split(/\s+/).length;
        const pace = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
        
        const estimatedTime = pace > 0 ? Math.round(1000 / pace) : 0;
        
        const sentences = this.countSentences(this.textInput.value);
        const density = sentences > 0 ? (wordsTyped / sentences).toFixed(1) : 0;
        
        return { pace, estimatedTime, density };
    }
    
    calculateQualityMetrics(text) {
        if (!text.trim()) {
            return { repetition: 0, clarity: 0, engagement: 0 };
        }
        
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const uniqueWords = new Set(words);
        const repetition = Math.round((uniqueWords.size / words.length) * 100);
        
        const sentences = this.countSentences(text);
        const avgSentenceLength = sentences > 0 ? words.length / sentences : 0;
        const clarity = avgSentenceLength <= 20 ? 100 : Math.max(20, 100 - (avgSentenceLength - 20) * 2);
        
        const positiveWords = ['amazing', 'excellent', 'wonderful', 'great', 'beautiful', 'fantastic'];
        const engagingWords = text.toLowerCase().split(' ').filter(word => positiveWords.includes(word));
        const engagement = Math.min(100, (engagingWords.length / words.length) * 1000);
        
        return {
            repetition: Math.round(repetition),
            clarity: Math.round(clarity),
            engagement: Math.round(engagement)
        };
    }
    
    detectLanguage(text) {
        // Simple language detection based on common words
        const englishWords = ['the', 'and', 'is', 'in', 'to', 'of', 'a', 'that', 'it', 'with'];
        const hindiWords = ['और', 'में', 'है', 'का', 'के', 'की', 'को', 'से', 'पर', 'यह'];
        const spanishWords = ['el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se'];
        const frenchWords = ['le', 'de', 'et', 'à', 'un', 'il', 'être', 'et', 'en', 'avoir'];
        const germanWords = ['der', 'die', 'und', 'in', 'den', 'von', 'zu', 'das', 'mit', 'sich'];
        
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const totalWords = words.length;
        
        if (totalWords === 0) {
            return { language: 'unknown', confidence: 0 };
        }
        
        const scores = {
            english: words.filter(word => englishWords.includes(word)).length,
            hindi: words.filter(word => hindiWords.includes(word)).length,
            spanish: words.filter(word => spanishWords.includes(word)).length,
            french: words.filter(word => frenchWords.includes(word)).length,
            german: words.filter(word => germanWords.includes(word)).length
        };
        
        const maxScore = Math.max(...Object.values(scores));
        const detectedLang = Object.keys(scores).find(lang => scores[lang] === maxScore);
        const confidence = (maxScore / totalWords) * 100;
        
        return {
            language: detectedLang || 'english',
            confidence: Math.min(100, confidence * 10) // Boost confidence for better UX
        };
    }
    
    updateSentimentDisplay(sentiment) {
        this.sentimentValue.textContent = sentiment.overall;
        this.sentimentValue.className = `sentiment-value ${sentiment.overall.toLowerCase()}`;
        
        // Update bars
        this.positiveBar.style.width = `${sentiment.positive}%`;
        this.neutralBar.style.width = `${sentiment.neutral}%`;
        this.negativeBar.style.width = `${sentiment.negative}%`;
        
        // Update percentages
        this.positivePercent.textContent = `${sentiment.positive}%`;
        this.neutralPercent.textContent = `${sentiment.neutral}%`;
        this.negativePercent.textContent = `${sentiment.negative}%`;
    }
    
    countSentences(text) {
        if (!text.trim()) return 0;
        const sentences = text.match(/[.!?]+/g);
        return sentences ? sentences.length : 1;
    }
    
    animateCountUpdate(element, value) {
        if (element) {
            element.textContent = value;
            element.style.transform = 'scale(1.1)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 200);
        }
    }
    
    switchTab(tabName) {
        // Remove active class from all tabs and contents
        this.tabBtns.forEach(btn => btn.classList.remove('active'));
        this.tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to selected tab and content
        const activeTabBtn = document.querySelector(`[data-tab="${tabName}"]`);
        const activeTabContent = document.getElementById(`${tabName}-tab`);
        
        if (activeTabBtn) activeTabBtn.classList.add('active');
        if (activeTabContent) activeTabContent.classList.add('active');
    }
    
    // Add missing functions for text analysis
    
    calculateAllStats(text) {
        return {
            basic: this.calculateBasicStats(text),
            advanced: this.calculateAdvancedStats(text),
            readability: this.calculateReadabilityStats(text),
            keywords: this.calculateKeywordStats(text),
            structure: this.calculateStructureStats(text)
        };
    }
    
    calculateBasicStats(text) {
        if (!text.trim()) {
            return {
                words: 0,
                charactersWithSpaces: 0,
                charactersWithoutSpaces: 0,
                paragraphs: 0,
                sentences: 0,
                readingTime: '0 min'
            };
        }
        
        const charactersWithSpaces = text.length;
        const charactersWithoutSpaces = text.replace(/\s/g, '').length;
        
        const wordMatches = text.trim().match(/\b\w+\b/g);
        const words = wordMatches ? wordMatches.length : 0;
        
        const paragraphMatches = text.trim().split(/\n\s*\n/);
        const paragraphs = text.trim() ? paragraphMatches.filter(p => p.trim()).length : 0;
        
        const sentences = this.countSentences(text);
        
        const readingTimeMinutes = Math.ceil(words / this.readingSpeed);
        const readingTime = readingTimeMinutes <= 1 ? 
            `${Math.max(1, readingTimeMinutes)} min` : 
            `${readingTimeMinutes} min`;
        
        return {
            words,
            charactersWithSpaces,
            charactersWithoutSpaces,
            paragraphs,
            sentences,
            readingTime
        };
    }
    
    calculateAdvancedStats(text) {
        if (!text.trim()) {
            return {
                avgWordsPerSentence: 0,
                avgCharsPerWord: 0,
                longestWord: '-',
                shortestWord: '-',
                uniqueWords: 0,
                vocabularyDiversity: '0%',
                speakingTime: '0 min',
                textComplexity: 'Simple'
            };
        }
        
        const wordMatches = text.trim().match(/\b\w+\b/g) || [];
        const words = wordMatches.length;
        const sentences = this.countSentences(text);
        const charactersWithoutSpaces = text.replace(/\s/g, '').length;
        
        const avgWordsPerSentence = sentences > 0 ? (words / sentences).toFixed(1) : 0;
        const avgCharsPerWord = words > 0 ? (charactersWithoutSpaces / words).toFixed(1) : 0;
        
        const longestWord = wordMatches.length > 0 ? 
            wordMatches.reduce((longest, current) => 
                current.length > longest.length ? current : longest
            ) : '-';
            
        const shortestWord = wordMatches.length > 0 ? 
            wordMatches.reduce((shortest, current) => 
                current.length < shortest.length ? current : shortest
            ) : '-';
        
        const uniqueWords = new Set(wordMatches.map(w => w.toLowerCase())).size;
        const vocabularyDiversity = words > 0 ? 
            ((uniqueWords / words) * 100).toFixed(1) + '%' : '0%';
        
        // Speaking time (average 150 WPM for speaking)
        const speakingTimeMinutes = Math.ceil(words / 150);
        const speakingTime = `${speakingTimeMinutes} min`;
        
        // Text complexity based on average word length
        const avgWordLength = words > 0 ? wordMatches.reduce((sum, word) => sum + word.length, 0) / words : 0;
        let textComplexity = 'Simple';
        if (avgWordLength > 6) textComplexity = 'Complex';
        else if (avgWordLength > 4.5) textComplexity = 'Moderate';
        
        return {
            avgWordsPerSentence,
            avgCharsPerWord,
            longestWord,
            shortestWord,
            uniqueWords,
            vocabularyDiversity,
            speakingTime,
            textComplexity
        };
    }
    
    calculateReadabilityStats(text) {
        if (!text.trim()) {
            return {
                fleschEase: 0,
                fleschGrade: '-',
                fleschKincaid: 0,
                gunningFog: 0,
                targetAudience: '-',
                readingDifficulty: '-'
            };
        }
        
        const words = text.match(/\b\w+\b/g) || [];
        const sentences = this.countSentences(text);
        const syllables = this.countSyllables(text);
        
        if (sentences === 0 || words.length === 0) {
            return {
                fleschEase: 0,
                fleschGrade: '-',
                fleschKincaid: 0,
                gunningFog: 0,
                targetAudience: '-',
                readingDifficulty: '-'
            };
        }
        
        // Flesch Reading Ease
        const fleschEase = 206.835 - (1.015 * (words.length / sentences)) - (84.6 * (syllables / words.length));
        
        // Flesch-Kincaid Grade Level
        const fleschKincaid = (0.39 * (words.length / sentences)) + (11.8 * (syllables / words.length)) - 15.59;
        
        // Gunning Fog Index
        const complexWords = words.filter(word => this.countWordSyllables(word) >= 3).length;
        const gunningFog = 0.4 * ((words.length / sentences) + (100 * (complexWords / words.length)));
        
        // Determine grade and audience
        let fleschGrade, targetAudience, readingDifficulty;
        
        if (fleschEase >= 90) {
            fleschGrade = '5th grade';
            targetAudience = 'Very Easy';
            readingDifficulty = 'Elementary';
        } else if (fleschEase >= 80) {
            fleschGrade = '6th grade';
            targetAudience = 'Easy';
            readingDifficulty = 'Middle School';
        } else if (fleschEase >= 70) {
            fleschGrade = '7th grade';
            targetAudience = 'Fairly Easy';
            readingDifficulty = 'High School';
        } else if (fleschEase >= 60) {
            fleschGrade = '8th-9th grade';
            targetAudience = 'Standard';
            readingDifficulty = 'College Level';
        } else if (fleschEase >= 50) {
            fleschGrade = '10th-12th grade';
            targetAudience = 'Fairly Difficult';
            readingDifficulty = 'Graduate Level';
        } else {
            fleschGrade = 'Graduate';
            targetAudience = 'Difficult';
            readingDifficulty = 'Professional';
        }
        
        return {
            fleschEase: Math.round(fleschEase),
            fleschGrade,
            fleschKincaid: Math.round(fleschKincaid * 10) / 10,
            gunningFog: Math.round(gunningFog * 10) / 10,
            targetAudience,
            readingDifficulty
        };
    }
    
    countSyllables(text) {
        const words = text.match(/\b\w+\b/g) || [];
        return words.reduce((total, word) => total + this.countWordSyllables(word), 0);
    }
    
    countWordSyllables(word) {
        word = word.toLowerCase();
        if (word.length <= 3) return 1;
        
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        word = word.replace(/^y/, '');
        
        const matches = word.match(/[aeiouy]{1,2}/g);
        return matches ? matches.length : 1;
    }
    
    calculateKeywordStats(text) {
        if (!text.trim()) {
            return {
                frequentWords: [],
                keywordDensity: [],
                longtailKeywords: []
            };
        }
        
        const words = text.toLowerCase().match(/\b\w+\b/g) || [];
        const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'this', 'that', 'these', 'those'];
        
        const filteredWords = words.filter(word => word.length > 2 && !stopWords.includes(word));
        
        // Word frequency
        const frequency = {};
        filteredWords.forEach(word => {
            frequency[word] = (frequency[word] || 0) + 1;
        });
        
        const frequentWords = Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
            
        // Keyword density
        const totalWords = words.length;
        const keywordDensity = frequentWords.map(([word, count]) => ({
            word,
            count,
            density: ((count / totalWords) * 100).toFixed(2)
        }));
        
        // Simple long-tail keywords (2-3 word phrases)
        const sentences = text.split(/[.!?]+/);
        const longtailKeywords = [];
        
        sentences.forEach(sentence => {
            const sentenceWords = sentence.toLowerCase().match(/\b\w+\b/g) || [];
            for (let i = 0; i < sentenceWords.length - 1; i++) {
                const phrase = sentenceWords.slice(i, i + 2).join(' ');
                if (phrase.length > 5 && !stopWords.includes(sentenceWords[i])) {
                    longtailKeywords.push(phrase);
                }
            }
        });
        
        return {
            frequentWords,
            keywordDensity,
            longtailKeywords: [...new Set(longtailKeywords)].slice(0, 10)
        };
    }
    
    calculateStructureStats(text) {
        if (!text.trim()) {
            return {
                avgParagraphLength: '0 words',
                longestParagraph: '0 words',
                shortestParagraph: '0 words',
                sentenceVariety: '-'
            };
        }
        
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
        const paragraphLengths = paragraphs.map(p => (p.match(/\b\w+\b/g) || []).length);
        
        const avgParagraphLength = paragraphLengths.length > 0 ? 
            Math.round(paragraphLengths.reduce((a, b) => a + b, 0) / paragraphLengths.length) : 0;
        const longestParagraph = Math.max(...paragraphLengths, 0);
        const shortestParagraph = Math.min(...paragraphLengths, 0);
        
        // Sentence variety
        const sentences = text.split(/[.!?]+/).filter(s => s.trim());
        const sentenceLengths = sentences.map(s => (s.match(/\b\w+\b/g) || []).length);
        const avgSentenceLength = sentenceLengths.length > 0 ? 
            sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length : 0;
        
        let sentenceVariety = 'Uniform';
        if (sentenceLengths.length > 1) {
            const variance = this.calculateVariance(sentenceLengths);
            if (variance > 25) sentenceVariety = 'High Variety';
            else if (variance > 10) sentenceVariety = 'Moderate Variety';
            else sentenceVariety = 'Low Variety';
        }
        
        return {
            avgParagraphLength: `${avgParagraphLength} words`,
            longestParagraph: `${longestParagraph} words`,
            shortestParagraph: `${shortestParagraph} words`,
            sentenceVariety
        };
    }
    
    calculateVariance(arr) {
        const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
        const variance = arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length;
        return variance;
    }
    
    updateKeywordAnalysis(keywords) {
        // Update frequent words
        this.frequentWordsEl.innerHTML = '';
        keywords.frequentWords.forEach(([word, count]) => {
            const wordEl = document.createElement('span');
            wordEl.className = 'keyword-item';
            wordEl.textContent = `${word} (${count})`;
            wordEl.style.cssText = `
                display: inline-block;
                margin: 2px;
                padding: 4px 8px;
                background: var(--accent-color-1);
                color: var(--primary-bg);
                border-radius: 12px;
                font-size: 12px;
                cursor: pointer;
            `;
            wordEl.addEventListener('click', () => {
                this.searchInput.value = word;
                this.performSearch();
                this.toggleSearchPanel();
            });
            this.frequentWordsEl.appendChild(wordEl);
        });
        
        // Update keyword density
        this.keywordDensityEl.innerHTML = '';
        keywords.keywordDensity.forEach(({ word, count, density }) => {
            const densityEl = document.createElement('div');
            densityEl.className = 'density-item';
            densityEl.innerHTML = `
                <span>${word}</span>
                <span>${count} times (${density}%)</span>
            `;
            densityEl.style.cssText = `
                display: flex;
                justify-content: space-between;
                padding: 4px 0;
                border-bottom: 1px solid var(--card-border);
            `;
            this.keywordDensityEl.appendChild(densityEl);
        });
        
        // Update long-tail keywords
        this.longtailKeywordsEl.innerHTML = '';
        keywords.longtailKeywords.forEach(phrase => {
            const phraseEl = document.createElement('span');
            phraseEl.className = 'longtail-item';
            phraseEl.textContent = phrase;
            phraseEl.style.cssText = `
                display: inline-block;
                margin: 2px;
                padding: 4px 8px;
                background: var(--accent-color-2);
                color: white;
                border-radius: 12px;
                font-size: 12px;
                cursor: pointer;
            `;
            phraseEl.addEventListener('click', () => {
                this.searchInput.value = phrase;
                this.performSearch();
                this.toggleSearchPanel();
            });
            this.longtailKeywordsEl.appendChild(phraseEl);
        });
    }
    
    updateStructureMap(structure) {
        if (!this.structureMapEl) return;
        
        const text = this.textInput.value;
        if (!text.trim()) {
            this.structureMapEl.innerHTML = '<p>No text to visualize</p>';
            return;
        }
        
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
        this.structureMapEl.innerHTML = '';
        
        paragraphs.forEach((paragraph, index) => {
            const words = (paragraph.match(/\b\w+\b/g) || []).length;
            const sentences = this.countSentences(paragraph);
            
            const paraEl = document.createElement('div');
            paraEl.className = 'structure-paragraph';
            paraEl.style.cssText = `
                width: ${Math.max(10, Math.min(100, (words / 50) * 100))}%;
                height: 20px;
                background: var(--accent-color-1);
                margin: 2px 0;
                border-radius: 4px;
                position: relative;
                cursor: pointer;
            `;
            paraEl.title = `Paragraph ${index + 1}: ${words} words, ${sentences} sentences`;
            
            this.structureMapEl.appendChild(paraEl);
        });
    }
    
    checkPlagiarism() {
        const text = this.textInput.value.trim();
        if (!text) {
            this.showMessage('Please enter some text to check for plagiarism.', 'warning');
            return;
        }
        
        // Simple plagiarism checker (demonstration only)
        const commonPhrases = [
            'lorem ipsum dolor sit amet',
            'the quick brown fox jumps',
            'to be or not to be',
            'it was the best of times'
        ];
        
        const lowerText = text.toLowerCase();
        const foundPhrases = commonPhrases.filter(phrase => lowerText.includes(phrase));
        
        if (foundPhrases.length > 0) {
            this.showMessage(`Potential plagiarism detected: Found ${foundPhrases.length} common phrase(s)`, 'error');
        } else {
            this.showMessage('No obvious plagiarism detected in the text', 'success');
        }
    }
    
    showMessage(message, type = 'info') {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--glass-bg);
            color: var(--text-primary);
            padding: var(--spacing-md);
            border-radius: 8px;
            border: 1px solid var(--card-border);
            backdrop-filter: blur(10px);
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;

        if (type === 'warning') {
            toast.style.borderColor = 'var(--warning-color)';
        } else if (type === 'error') {
            toast.style.borderColor = 'var(--error-color)';
        } else if (type === 'success') {
            toast.style.borderColor = 'var(--success-color)';
        }

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
    
    updateCounts() {
        const text = this.textInput.value;
        const stats = this.calculateAllStats(text);
        
        // Update character count in overlay
        document.getElementById('char-current').textContent = stats.basic.charactersWithSpaces;
        
        // Basic stats
        this.animateCountUpdate(this.wordCountEl, stats.basic.words);
        this.animateCountUpdate(this.charCountWithEl, stats.basic.charactersWithSpaces);
        this.animateCountUpdate(this.charCountWithoutEl, stats.basic.charactersWithoutSpaces);
        this.animateCountUpdate(this.paragraphCountEl, stats.basic.paragraphs);
        this.animateCountUpdate(this.sentenceCountEl, stats.basic.sentences);
        this.animateCountUpdate(this.readingTimeEl, stats.basic.readingTime);
        
        // Advanced stats
        this.animateCountUpdate(this.avgWordsPerSentenceEl, stats.advanced.avgWordsPerSentence);
        this.animateCountUpdate(this.avgCharsPerWordEl, stats.advanced.avgCharsPerWord);
        this.animateCountUpdate(this.longestWordEl, stats.advanced.longestWord);
        this.animateCountUpdate(this.shortestWordEl, stats.advanced.shortestWord);
        this.animateCountUpdate(this.uniqueWordsEl, stats.advanced.uniqueWords);
        this.animateCountUpdate(this.vocabularyDiversityEl, stats.advanced.vocabularyDiversity);
        this.animateCountUpdate(this.speakingTimeEl, stats.advanced.speakingTime);
        this.animateCountUpdate(this.textComplexityEl, stats.advanced.textComplexity);
        
        // Readability stats
        this.animateCountUpdate(this.fleschEaseEl, stats.readability.fleschEase);
        this.animateCountUpdate(this.fleschGradeEl, stats.readability.fleschGrade);
        this.animateCountUpdate(this.fleschKincaidEl, stats.readability.fleschKincaid);
        this.animateCountUpdate(this.gunningFogEl, stats.readability.gunningFog);
        this.animateCountUpdate(this.targetAudienceEl, stats.readability.targetAudience);
        this.animateCountUpdate(this.readingDifficultyEl, stats.readability.readingDifficulty);
        
        // Keywords
        this.updateKeywordAnalysis(stats.keywords);
        
        // Structure
        this.animateCountUpdate(this.avgParagraphLengthEl, stats.structure.avgParagraphLength);
        this.animateCountUpdate(this.longestParagraphEl, stats.structure.longestParagraph);
        this.animateCountUpdate(this.shortestParagraphEl, stats.structure.shortestParagraph);
        this.animateCountUpdate(this.sentenceVarietyEl, stats.structure.sentenceVariety);
        this.updateStructureMap(stats.structure);
        
        // Enhanced features
        this.updateEnhancedFeatures(text, stats);
    }
    
    updateEnhancedFeatures(text, stats) {
        // Language detection
        if (text.trim()) {
            const languageResult = this.detectLanguage(text);
            this.detectedLanguage.textContent = languageResult.language.charAt(0).toUpperCase() + languageResult.language.slice(1);
            this.languageConfidence.textContent = `(${languageResult.confidence.toFixed(1)}% confidence)`;
        } else {
            this.detectedLanguage.textContent = 'Not detected';
            this.languageConfidence.textContent = '(0% confidence)';
        }
        
        // Writing statistics
        const writingStats = this.calculateWritingStats();
        this.writingPace.textContent = writingStats.pace > 0 ? `${writingStats.pace} WPM` : '- WPM';
        this.estimatedWritingTime.textContent = writingStats.estimatedTime > 0 ? `${writingStats.estimatedTime} minutes` : '- minutes';
        this.textDensity.textContent = writingStats.density > 0 ? `${writingStats.density} words/sentence` : '- words/sentence';
        
        // Quality metrics
        const qualityMetrics = this.calculateQualityMetrics(text);
        this.updateQualityBar(this.repetitionBar, this.repetitionScore, qualityMetrics.repetition);
        this.updateQualityBar(this.clarityBar, this.clarityScore, qualityMetrics.clarity);
        this.updateQualityBar(this.engagementBar, this.engagementScore, qualityMetrics.engagement);
    }
    
    updateQualityBar(barElement, scoreElement, value) {
        if (barElement && scoreElement) {
            barElement.style.width = `${value}%`;
            scoreElement.textContent = `${value}%`;
            
            // Color coding based on score
            if (value >= 80) {
                barElement.style.background = 'var(--success-color)';
            } else if (value >= 60) {
                barElement.style.background = 'var(--warning-color)';
            } else {
                barElement.style.background = 'var(--error-color)';
            }
        }
    }
    
    // Keywords
    updateKeywordAnalysis(keywords) {
        // Update frequent words
        this.frequentWordsEl.innerHTML = '';
        keywords.frequentWords.forEach(([word, count]) => {
            const wordEl = document.createElement('span');
            wordEl.className = 'keyword-item';
            wordEl.textContent = `${word} (${count})`;
            wordEl.style.cssText = `
                display: inline-block;
                margin: 2px;
                padding: 4px 8px;
                background: var(--accent-color-1);
                color: var(--primary-bg);
                border-radius: 12px;
                font-size: 12px;
                cursor: pointer;
            `;
            wordEl.addEventListener('click', () => {
                this.searchInput.value = word;
                this.performSearch();
                this.toggleSearchPanel();
            });
            this.frequentWordsEl.appendChild(wordEl);
        });
        
        // Update keyword density
        this.keywordDensityEl.innerHTML = '';
        keywords.keywordDensity.forEach(({ word, count, density }) => {
            const densityEl = document.createElement('div');
            densityEl.className = 'density-item';
            densityEl.innerHTML = `
                <span>${word}</span>
                <span>${count} times (${density}%)</span>
            `;
            densityEl.style.cssText = `
                display: flex;
                justify-content: space-between;
                padding: 4px 0;
                border-bottom: 1px solid var(--card-border);
            `;
            this.keywordDensityEl.appendChild(densityEl);
        });
        
        // Update long-tail keywords
        this.longtailKeywordsEl.innerHTML = '';
        keywords.longtailKeywords.forEach(phrase => {
            const phraseEl = document.createElement('span');
            phraseEl.className = 'longtail-item';
            phraseEl.textContent = phrase;
            phraseEl.style.cssText = `
                display: inline-block;
                margin: 2px;
                padding: 4px 8px;
                background: var(--accent-color-2);
                color: white;
                border-radius: 12px;
                font-size: 12px;
                cursor: pointer;
            `;
            phraseEl.addEventListener('click', () => {
                this.searchInput.value = phrase;
                this.performSearch();
                this.toggleSearchPanel();
            });
            this.longtailKeywordsEl.appendChild(phraseEl);
        });
    }
    
    updateStructureMap(structure) {
        if (!this.structureMapEl) return;
        
        const text = this.textInput.value;
        if (!text.trim()) {
            this.structureMapEl.innerHTML = '<p>No text to visualize</p>';
            return;
        }
        
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
        this.structureMapEl.innerHTML = '';
        
        paragraphs.forEach((paragraph, index) => {
            const words = (paragraph.match(/\b\w+\b/g) || []).length;
            const sentences = this.countSentences(paragraph);
            
            const paraEl = document.createElement('div');
            paraEl.className = 'structure-paragraph';
            paraEl.style.cssText = `
                width: ${Math.max(10, Math.min(100, (words / 50) * 100))}%;
                height: 20px;
                background: var(--accent-color-1);
                margin: 2px 0;
                border-radius: 4px;
                position: relative;
                cursor: pointer;
            `;
            paraEl.title = `Paragraph ${index + 1}: ${words} words, ${sentences} sentences`;
            
            this.structureMapEl.appendChild(paraEl);
        });
    }
    
    checkPlagiarism() {
        const text = this.textInput.value.trim();
        if (!text) {
            this.showMessage('Please enter some text to check for plagiarism.', 'warning');
            return;
        }
        
        // Simple plagiarism checker (demonstration only)
        const commonPhrases = [
            'lorem ipsum dolor sit amet',
            'the quick brown fox jumps',
            'to be or not to be',
            'it was the best of times'
        ];
        
        const lowerText = text.toLowerCase();
        const foundPhrases = commonPhrases.filter(phrase => lowerText.includes(phrase));
        
        if (foundPhrases.length > 0) {
            this.showMessage(`Potential plagiarism detected: Found ${foundPhrases.length} common phrase(s)`, 'error');
        } else {
            this.showMessage('No obvious plagiarism detected in the text', 'success');
        }
    }
    
    showMessage(message, type = 'info') {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--glass-bg);
            color: var(--text-primary);
            padding: var(--spacing-md);
            border-radius: 8px;
            border: 1px solid var(--card-border);
            backdrop-filter: blur(10px);
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;

        if (type === 'warning') {
            toast.style.borderColor = 'var(--warning-color)';
        } else if (type === 'error') {
            toast.style.borderColor = 'var(--error-color)';
        } else if (type === 'success') {
            toast.style.borderColor = 'var(--success-color)';
        }

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
    
    updateCounts() {
        const text = this.textInput.value;
        const stats = this.calculateAllStats(text);
        
        // Update character count in overlay
        document.getElementById('char-current').textContent = stats.basic.charactersWithSpaces;
        
        // Basic stats
        this.animateCountUpdate(this.wordCountEl, stats.basic.words);
        this.animateCountUpdate(this.charCountWithEl, stats.basic.charactersWithSpaces);
        this.animateCountUpdate(this.charCountWithoutEl, stats.basic.charactersWithoutSpaces);
        this.animateCountUpdate(this.paragraphCountEl, stats.basic.paragraphs);
        this.animateCountUpdate(this.sentenceCountEl, stats.basic.sentences);
        this.animateCountUpdate(this.readingTimeEl, stats.basic.readingTime);
        
        // Advanced stats
        this.animateCountUpdate(this.avgWordsPerSentenceEl, stats.advanced.avgWordsPerSentence);
        this.animateCountUpdate(this.avgCharsPerWordEl, stats.advanced.avgCharsPerWord);
        this.animateCountUpdate(this.longestWordEl, stats.advanced.longestWord);
        this.animateCountUpdate(this.shortestWordEl, stats.advanced.shortestWord);
        this.animateCountUpdate(this.uniqueWordsEl, stats.advanced.uniqueWords);
        this.animateCountUpdate(this.vocabularyDiversityEl, stats.advanced.vocabularyDiversity);
        this.animateCountUpdate(this.speakingTimeEl, stats.advanced.speakingTime);
        this.animateCountUpdate(this.textComplexityEl, stats.advanced.textComplexity);
        
        // Readability stats
        this.animateCountUpdate(this.fleschEaseEl, stats.readability.fleschEase);
        this.animateCountUpdate(this.fleschGradeEl, stats.readability.fleschGrade);
        this.animateCountUpdate(this.fleschKincaidEl, stats.readability.fleschKincaid);
        this.animateCountUpdate(this.gunningFogEl, stats.readability.gunningFog);
        this.animateCountUpdate(this.targetAudienceEl, stats.readability.targetAudience);
        this.animateCountUpdate(this.readingDifficultyEl, stats.readability.readingDifficulty);
        
        // Keywords
        this.updateKeywordAnalysis(stats.keywords);
        
        // Structure
        this.animateCountUpdate(this.avgParagraphLengthEl, stats.structure.avgParagraphLength);
        this.animateCountUpdate(this.longestParagraphEl, stats.structure.longestParagraph);
        this.animateCountUpdate(this.shortestParagraphEl, stats.structure.shortestParagraph);
        this.animateCountUpdate(this.sentenceVarietyEl, stats.structure.sentenceVariety);
        this.updateStructureMap(stats.structure);
        
        // Enhanced features
        this.updateEnhancedFeatures(text, stats);
    }
    
    updateEnhancedFeatures(text, stats) {
        // Language detection
        if (text.trim()) {
            const languageResult = this.detectLanguage(text);
            this.detectedLanguage.textContent = languageResult.language.charAt(0).toUpperCase() + languageResult.language.slice(1);
            this.languageConfidence.textContent = `(${languageResult.confidence.toFixed(1)}% confidence)`;
        } else {
            this.detectedLanguage.textContent = 'Not detected';
            this.languageConfidence.textContent = '(0% confidence)';
        }
        
        // Writing statistics
        const writingStats = this.calculateWritingStats();
        this.writingPace.textContent = writingStats.pace > 0 ? `${writingStats.pace} WPM` : '- WPM';
        this.estimatedWritingTime.textContent = writingStats.estimatedTime > 0 ? `${writingStats.estimatedTime} minutes` : '- minutes';
        this.textDensity.textContent = writingStats.density > 0 ? `${writingStats.density} words/sentence` : '- words/sentence';
        
        // Quality metrics
        const qualityMetrics = this.calculateQualityMetrics(text);
        this.updateQualityBar(this.repetitionBar, this.repetitionScore, qualityMetrics.repetition);
        this.updateQualityBar(this.clarityBar, this.clarityScore, qualityMetrics.clarity);
        this.updateQualityBar(this.engagementBar, this.engagementScore, qualityMetrics.engagement);
    }
    
    updateQualityBar(barElement, scoreElement, value) {
        if (barElement && scoreElement) {
            barElement.style.width = `${value}%`;
            scoreElement.textContent = `${value}%`;
            
            // Color coding based on score
            if (value >= 80) {
                barElement.style.background = 'var(--success-color)';
            } else if (value >= 60) {
                barElement.style.background = 'var(--warning-color)';
            } else {
                barElement.style.background = 'var(--error-color)';
            }
        }
    }
    
    // Keywords
    updateKeywordAnalysis(keywords) {
        // Update frequent words
        this.frequentWordsEl.innerHTML = '';
        keywords.frequentWords.forEach(([word, count]) => {
            const wordEl = document.createElement('span');
            wordEl.className = 'keyword-item';
            wordEl.textContent = `${word} (${count})`;
            wordEl.style.cssText = `
                display: inline-block;
                margin: 2px;
                padding: 4px 8px;
                background: var(--accent-color-1);
                color: var(--primary-bg);
                border-radius: 12px;
                font-size: 12px;
                cursor: pointer;
            `;
            wordEl.addEventListener('click', () => {
                this.searchInput.value = word;
                this.performSearch();
                this.toggleSearchPanel();
            });
            this.frequentWordsEl.appendChild(wordEl);
        });
        
        // Update keyword density
        this.keywordDensityEl.innerHTML = '';
        keywords.keywordDensity.forEach(({ word, count, density }) => {
            const densityEl = document.createElement('div');
            densityEl.className = 'density-item';
            densityEl.innerHTML = `
                <span>${word}</span>
                <span>${count} times (${density}%)</span>
            `;
            densityEl.style.cssText = `
                display: flex;
                justify-content: space-between;
                padding: 4px 0;
                border-bottom: 1px solid var(--card-border);
            `;
            this.keywordDensityEl.appendChild(densityEl);
        });
        
        // Update long-tail keywords
        this.longtailKeywordsEl.innerHTML = '';
        keywords.longtailKeywords.forEach(phrase => {
            const phraseEl = document.createElement('span');
            phraseEl.className = 'longtail-item';
            phraseEl.textContent = phrase;
            phraseEl.style.cssText = `
                display: inline-block;
                margin: 2px;
                padding: 4px 8px;
                background: var(--accent-color-2);
                color: white;
                border-radius: 12px;
                font-size: 12px;
                cursor: pointer;
            `;
            phraseEl.addEventListener('click', () => {
                this.searchInput.value = phrase;
                this.performSearch();
                this.toggleSearchPanel();
            });
            this.longtailKeywordsEl.appendChild(phraseEl);
        });
    }
    
    updateStructureMap(structure) {
        if (!this.structureMapEl) return;
        
        const text = this.textInput.value;
        if (!text.trim()) {
            this.structureMapEl.innerHTML = '<p>No text to visualize</p>';
            return;
        }
        
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
        this.structureMapEl.innerHTML = '';
        
        paragraphs.forEach((paragraph, index) => {
            const words = (paragraph.match(/\b\w+\b/g) || []).length;
            const sentences = this.countSentences(paragraph);
            
            const paraEl = document.createElement('div');
            paraEl.className = 'structure-paragraph';
            paraEl.style.cssText = `
                width: ${Math.max(10, Math.min(100, (words / 50) * 100))}%;
                height: 20px;
                background: var(--accent-color-1);
                margin: 2px 0;
                border-radius: 4px;
                position: relative;
                cursor: pointer;
            `;
            paraEl.title = `Paragraph ${index + 1}: ${words} words, ${sentences} sentences`;
            
            this.structureMapEl.appendChild(paraEl);
        });
    }
    
    checkPlagiarism() {
        const text = this.textInput.value.trim();
        if (!text) {
            this.showMessage('Please enter some text to check for plagiarism.', 'warning');
            return;
        }
        
        // Simple plagiarism checker (demonstration only)
        const commonPhrases = [
            'lorem ipsum dolor sit amet',
            'the quick brown fox jumps',
            'to be or not to be',
            'it was the best of times'
        ];
        
        const lowerText = text.toLowerCase();
        const foundPhrases = commonPhrases.filter(phrase => lowerText.includes(phrase));
        
        if (foundPhrases.length > 0) {
            this.showMessage(`Potential plagiarism detected: Found ${foundPhrases.length} common phrase(s)`, 'error');
        } else {
            this.showMessage('No obvious plagiarism detected in the text', 'success');
        }
    }
}

// Initialize the Advanced Word Counter when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Fix for text direction issues
    const textInput = document.getElementById('text-input');
    if (textInput) {
        textInput.style.direction = 'ltr';
        textInput.style.textAlign = 'left';
        textInput.style.unicodeBidi = 'normal';
        textInput.setAttribute('dir', 'ltr');
        textInput.setAttribute('lang', 'en');
        
        // Force LTR input mode
        textInput.addEventListener('input', function() {
            this.style.direction = 'ltr';
            this.style.textAlign = 'left';
        });
    }
    
    new AdvancedWordCounter();
});