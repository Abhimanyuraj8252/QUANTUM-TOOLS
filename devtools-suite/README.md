# DevTools Suite

A comprehensive collection of essential web development tools built with modern HTML5, CSS3, and vanilla JavaScript. This single-page application provides developers with powerful utilities for CSS generation, layout experimentation, regex testing, and accessibility checking.

## 🚀 Features

### 🎨 CSS Box Shadow Generator
- Interactive sliders for all shadow properties (offset, blur, spread)
- Real-time color picker with opacity control
- Inset shadow option
- Customizable preview background and element colors
- Copy-to-clipboard functionality
- Live preview with instant feedback

### 🌈 CSS Gradient Generator
- Support for linear and radial gradients
- Interactive color stops with position control
- Add/remove color stops dynamically
- Angle control for linear gradients
- Shape selection for radial gradients (circle/ellipse)
- Real-time preview
- One-click CSS code copying

### 📐 Flexbox Playground
- Complete Flexbox property controls for containers
- Individual item property editing
- Visual item selection and highlighting
- Add/remove flex items dynamically
- Separate code tabs for container and item properties
- Real-time CSS generation
- Educational tool for learning Flexbox

### ✂️ CSS Clip-Path Generator
- Multiple shape presets (circle, ellipse, triangle, polygon)
- Interactive polygon editing with drag-and-drop points
- Click-to-add polygon points
- Visual preview with sample images
- Responsive controls for different shapes
- Reset functionality for polygons

### 🔍 Regular Expression Tester
- Real-time regex testing with syntax highlighting
- Support for global, case-insensitive, and multiline flags
- Match highlighting in test string
- Detailed match information with capture groups
- Position information for each match
- Error handling for invalid patterns
- Debounced input for performance

### 👁️ Color Contrast Checker
- WCAG 2.1 compliance testing
- Support for AA and AAA levels
- Normal and large text testing
- Real-time contrast ratio calculation
- Color picker and hex input support
- Swap colors functionality
- Quick color presets
- Visual pass/fail indicators

## 🎯 Technical Features

### 🌙 Dark/Light Theme Support
- System preference detection
- Persistent theme selection
- Smooth transitions
- Accessible theme toggle button

### 📱 Mobile-First Responsive Design
- Optimized for all screen sizes
- Touch-friendly interactions
- Collapsible navigation on mobile
- Adaptive layouts

### ♿ Accessibility Features
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- High contrast mode support
- Screen reader optimizations
- Semantic HTML structure

### ⚡ Performance Optimizations
- Vanilla JavaScript (no external frameworks)
- Debounced input handlers
- Efficient DOM manipulation
- Lazy-loaded features
- Optimized CSS with custom properties

### 🎨 Modern UI/UX
- Clean, minimalist design
- Consistent color palette
- Smooth animations and transitions
- Professional typography
- Interactive feedback
- Toast notifications

## 🛠️ Technology Stack

- **HTML5**: Semantic markup with proper accessibility
- **CSS3**: Custom properties, Flexbox, Grid, modern features
- **JavaScript (ES6+)**: Vanilla JS with modern syntax
- **Font Awesome**: Icons for enhanced UI
- **Google Fonts**: Inter and JetBrains Mono typography

## 📁 Project Structure

```
DevTools Suite/
├── index.html          # Main HTML file with all tool sections
├── styles.css          # Comprehensive CSS with responsive design
├── script.js           # JavaScript functionality for all tools
└── README.md          # This documentation file
```

## 🚀 Getting Started

1. **Clone or download** the DevTools Suite folder
2. **Open `index.html`** in a modern web browser
3. **Start using the tools** immediately - no build process required!

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📖 Tool Usage Guide

### Box Shadow Generator
1. Use sliders to adjust shadow properties
2. Pick shadow color and adjust opacity
3. Toggle inset option if needed
4. Customize preview colors for better visualization
5. Copy the generated CSS code

### Gradient Generator
1. Choose between linear or radial gradient
2. Adjust angle (linear) or shape (radial)
3. Add/remove color stops as needed
4. Position each color stop with sliders
5. Copy the generated CSS background property

### Flexbox Playground
1. Adjust container properties using dropdowns
2. Add or remove flex items as needed
3. Click on items to edit individual properties
4. Switch between container and item code tabs
5. Copy the CSS for your specific needs

### Clip-Path Generator
1. Select a shape preset to start
2. For polygons: click to add points, drag to modify
3. Use sliders for circle/ellipse adjustments
4. Preview the effect on the sample image
5. Copy the clip-path CSS property

### RegEx Tester
1. Enter your regular expression pattern
2. Add test flags (global, case-insensitive, multiline)
3. Input your test string
4. View highlighted matches and detailed results
5. Check capture groups and match positions

### Contrast Checker
1. Select text and background colors
2. View real-time contrast ratio calculation
3. Check WCAG AA/AAA compliance for both text sizes
4. Use presets or swap colors for quick testing
5. Ensure accessibility standards are met

## 🎨 Customization

### Theme Customization
The application uses CSS custom properties for easy theming:

```css
:root {
  --primary-color: #6366f1;
  --bg-primary: #ffffff;
  --text-primary: #1e293b;
  /* ... more variables */
}
```

### Adding New Tools
1. Add a new navigation item in the HTML
2. Create a new tool section with appropriate controls
3. Implement the tool logic in JavaScript
4. Add styling for the new tool components

## 🔧 Development

### Code Organization
- **HTML**: Semantic structure with accessibility in mind
- **CSS**: Modular approach with CSS custom properties
- **JavaScript**: Module pattern with clear separation of concerns

### Key JavaScript Modules
- `themeManager`: Handles dark/light theme switching
- `navigationManager`: Manages tool navigation and mobile menu
- `boxShadowTool`: Box shadow generator functionality
- `gradientTool`: Gradient generator functionality
- `flexboxTool`: Flexbox playground functionality
- `clipPathTool`: Clip-path generator functionality
- `regexTool`: Regular expression tester functionality
- `contrastTool`: Color contrast checker functionality

### Performance Considerations
- Debounced input handlers for smooth interaction
- Efficient DOM queries with caching
- Minimal external dependencies
- Optimized CSS with hardware acceleration

## 🤝 Contributing

Contributions are welcome! Please consider:
- Following the existing code style
- Adding proper documentation
- Testing across different browsers
- Ensuring accessibility compliance
- Maintaining mobile responsiveness

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Font Awesome for the icon library
- Google Fonts for typography
- MDN Web Docs for CSS and JavaScript references
- WCAG guidelines for accessibility standards

## 📞 Support

If you encounter any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.

---

**Built with ❤️ for the developer community**
