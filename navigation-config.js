// Navigation Update Script for QUANTUM TOOLS
// This script provides navigation templates for different directory levels

const navigationTemplates = {
    // For files in root directory (index.html)
    root: {
        cssLinks: [
            'Home page/preloader.css',
            'Home page/animations.css', 
            'Home page/enhancements.css',
            'Home page/universal-nav.css',
            'Home page/scroll-navigation.css',
            'dropdown-styles.css',
            'style.css'
        ],
        logoLink: 'index.html',
        navLinks: {
            developerTools: 'Developer tools/',
            imageTools: 'Image tools/',
            pdfTools: 'PDF tools/',
            textTools: 'text based tools/',
            utilityTools: 'utility tools/'
        }
    },
      // For files one level deep (Developer tools/, Image tools/, etc.)
    level1: {
        cssLinks: [
            '../Home page/preloader.css',
            '../Home page/animations.css',
            '../Home page/enhancements.css', 
            '../Home page/universal-nav.css',
            '../Home page/scroll-navigation.css',
            '../dropdown-styles.css',
            '../style.css'
        ],
        logoLink: '../index.html',
        navLinks: {
            developerTools: '../Developer tools/',
            imageTools: '../Image tools/',
            pdfTools: '../PDF tools/',
            textTools: '../text based tools/',
            utilityTools: '../utility tools/'
        }
    },
      // For files two levels deep (most tool files)
    level2: {
        cssLinks: [
            '../../Home page/preloader.css',
            '../../Home page/animations.css',
            '../../Home page/enhancements.css',
            '../../Home page/universal-nav.css',
            '../../Home page/scroll-navigation.css',
            '../../dropdown-styles.css',
            '../../style.css'
        ],
        logoLink: '../../index.html',
        navLinks: {
            developerTools: '../../Developer tools/',
            imageTools: '../../Image tools/',
            pdfTools: '../../PDF tools/',
            textTools: '../../text based tools/',
            utilityTools: '../../utility tools/'
        }
    },
      // For files three levels deep (PDF conversion tools, etc.)
    level3: {
        cssLinks: [
            '../../../Home page/preloader.css',
            '../../../Home page/animations.css',
            '../../../Home page/enhancements.css',
            '../../../Home page/universal-nav.css',
            '../../../Home page/scroll-navigation.css',
            '../../../dropdown-styles.css', 
            '../../../style.css'
        ],
        logoLink: '../../../index.html',
        navLinks: {
            developerTools: '../../../Developer tools/',
            imageTools: '../../../Image tools/',
            pdfTools: '../../../PDF tools/',
            textTools: '../../../text based tools/',
            utilityTools: '../../../utility tools/'
        }
    }
};

// Standard navigation HTML template
const getNavigationHTML = (level) => {
    const config = navigationTemplates[level];
    return `
    <header>
        <div class="container">
            <div class="logo">
                <a href="${config.logoLink}">
                    <h1>QUANTUM TOOLS</h1>
                </a>
            </div>
            <nav>
                <div class="search-container">
                    <form class="search-bar" id="search-form">
                        <input type="text" placeholder="Search tools..." id="search-input" aria-label="Search">
                        <button type="submit" class="search-button" aria-label="Submit search">
                            <i class="fas fa-search"></i>
                        </button>
                    </form>
                    <div class="search-results" id="search-results"></div>
                </div>
                <div class="hamburger" aria-label="Toggle navigation menu" role="button" tabindex="0" aria-expanded="false">
                    <div class="line"></div>
                    <div class="line"></div>
                    <div class="line"></div>
                </div>
                <ul class="nav-links">
                    <li><a href="${config.logoLink}">Home</a></li>
                    <li class="dropdown">
                        <a href="#">Developer Tools <i class="fas fa-chevron-down"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="${config.navLinks.developerTools}Editor with Live Preview/code-editor.html">Live Code Editor</a></li>
                            <li><a href="${config.navLinks.developerTools}Encoder Decoder/universal-encoder-decoder.html">Encoder/Decoder</a></li>
                            <li><a href="${config.navLinks.developerTools}JSON formatter validator/json-tool.html">JSON Formatter</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="#">Image Tools <i class="fas fa-chevron-down"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="${config.navLinks.imageTools}bg remover/bg-remover.html">Background Remover</a></li>
                            <li><a href="${config.navLinks.imageTools}image converter/image-converter.html">Image Converter</a></li>
                            <li><a href="${config.navLinks.imageTools}Image resizer/image-optimizer.html">Image Resizer</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="#">PDF Tools <i class="fas fa-chevron-down"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="${config.navLinks.pdfTools}pdf-toolkit.html">PDF Toolkit</a></li>
                            <li class="dropdown-submenu">
                                <a href="#">File Conversion <i class="fas fa-chevron-right"></i></a>
                                <ul class="dropdown-submenu-content">
                                    <li><a href="${config.navLinks.pdfTools}File Conversion/Image to PDF/image-to-pdf.html">Image to PDF</a></li>
                                    <li><a href="${config.navLinks.pdfTools}File Conversion/PDF to Image/pdf-to-image.html">PDF to Image</a></li>
                                    <li><a href="${config.navLinks.pdfTools}File Conversion/PDF to Text/pdf-to-text.html">PDF to Text</a></li>
                                    <li><a href="${config.navLinks.pdfTools}File Conversion/Text to PDF/text-to-pdf.html">Text to PDF</a></li>
                                </ul>
                            </li>
                            <li class="dropdown-submenu">
                                <a href="#">PDF Manipulation <i class="fas fa-chevron-right"></i></a>
                                <ul class="dropdown-submenu-content">
                                    <li><a href="${config.navLinks.pdfTools}PDF Manipulation/PDF Merger/pdf-merger.html">PDF Merger</a></li>
                                    <li><a href="${config.navLinks.pdfTools}PDF Manipulation/PDF Splitter/pdf-splitter.html">PDF Splitter</a></li>
                                    <li><a href="${config.navLinks.pdfTools}PDF Manipulation/PDF Compressor/pdf-compressor.html">PDF Compressor</a></li>
                                    <li><a href="${config.navLinks.pdfTools}PDF Manipulation/Page Manager/page-manager.html">Page Manager</a></li>
                                </ul>
                            </li>
                            <li class="dropdown-submenu">
                                <a href="#">Security & Enhancement <i class="fas fa-chevron-right"></i></a>
                                <ul class="dropdown-submenu-content">
                                    <li><a href="${config.navLinks.pdfTools}Security & Enhancement/Password Protection/password-protection.html">Password Protection</a></li>
                                    <li><a href="${config.navLinks.pdfTools}Security & Enhancement/Remove  Password/remove-password.html">Remove Password</a></li>
                                    <li><a href="${config.navLinks.pdfTools}Security & Enhancement/Add Watermark/add-watermark.html">Add Watermark</a></li>
                                    <li><a href="${config.navLinks.pdfTools}Security & Enhancement/PDF Info/pdf-info.html">PDF Info</a></li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="#">Text Tools <i class="fas fa-chevron-down"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="${config.navLinks.textTools}case converter/case-converter.html">Case Converter</a></li>
                            <li><a href="${config.navLinks.textTools}Random Data Generator/data-generator.html">Data Generator</a></li>
                            <li><a href="${config.navLinks.textTools}word-counter/word-counter.html">Word Counter</a></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="#">Utility Tools <i class="fas fa-chevron-down"></i></a>
                        <ul class="dropdown-menu">
                            <li><a href="${config.navLinks.utilityTools}age calculator/age-calculator.html">Age Calculator</a></li>
                            <li><a href="${config.navLinks.utilityTools}barcode generator/barcode-generator.html">Barcode Generator</a></li>
                            <li><a href="${config.navLinks.utilityTools}QR code generator/qr-generator.html">QR Code Generator</a></li>
                            <li><a href="${config.navLinks.utilityTools}unit converter/unit-converter.html">Unit Converter</a></li>
                        </ul>
                    </li>
                </ul>
                <div class="theme-toggle" aria-label="Toggle light/dark theme" role="button" tabindex="0">
                    <i class="fas fa-moon"></i>
                    <i class="fas fa-sun"></i>
                    <span class="theme-toggle-track"></span>
                </div>
            </nav>
        </div>
    </header>`;
};

module.exports = { navigationTemplates, getNavigationHTML };
