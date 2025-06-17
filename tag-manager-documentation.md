# Tag Manager System Documentation

## Overview
The Tag Manager system for QUANTUM TOOLS ensures that all pages are properly tagged for analytics tracking and SEO purposes. It integrates with Google Tag Manager and provides a visual interface to monitor tag status.

## Features
- Automatic page tagging
- Tag status monitoring
- Real-time tag inspection
- Integration with Google Tag Manager
- Tracking tag-related events
- SEO metadata validation

## Files
- `tag-manager.js` - Core tag management functionality
- `tag-manager-ui.js` - User interface for tag monitoring
- `tag-manager-styles.css` - Styles for the tag manager interface
- `tag-auto-manager.js` - Utility to automatically add tag manager to all pages

## How to Use

### Adding to a New Page
When creating a new page, add the following code before the closing `</body>` tag:

```html
<!-- Tag Manager -->
<script src="[relative-path-to-root]tag-manager.js" defer></script>
<script src="[relative-path-to-root]tag-manager-ui.js" defer></script>
<link rel="stylesheet" href="[relative-path-to-root]tag-manager-styles.css">
```

Replace `[relative-path-to-root]` with the relative path to reach the root directory from your HTML file. For example:
- For a page in the root directory: use `./`
- For a page one level down: use `../`
- For a page two levels down: use `../../`

### Automatic Tag Addition
To automatically add the tag manager to all pages:

1. Make sure you have Node.js installed
2. Install the required packages: `npm install glob`
3. Run the auto-manager: `node tag-auto-manager.js`

To continuously watch for new HTML files: `node tag-auto-manager.js --watch`

### Using the Tag Manager Interface
The tag manager adds a small tag icon (🏷️) in the bottom-right corner of each page. Click this icon to:

- See the tag status of the current page
- View recently tagged pages
- Refresh tags for the current page
- Scan the site for untagged pages

If a page is not tagged, a small notification badge will appear on the tag icon.

## Tag Information Collected
For each page, the tag manager collects and stores:

- URL
- Page title
- Page type (homepage, tool page, etc.)
- Meta description
- Meta keywords
- Schema markup status
- Social tags status
- Canonical URL status

## Google Tag Manager Integration
The tag manager automatically pushes the following events to the dataLayer:

- `tagManagerReady` - When the tag manager initializes
- `pageTagged` - When a page is successfully tagged
- `tagRefresh` - When tags are manually refreshed

## Troubleshooting

### Common Issues
1. **Tags Not Showing:** Check if all three tag manager files are properly referenced
2. **Incorrect Path:** Verify the relative path is correct for your file structure
3. **UI Not Visible:** Ensure tag-manager-styles.css is properly loaded
4. **Console Errors:** Check the browser console for any JavaScript errors

### Manual Verification
To check if a page is properly tagged:

1. Open browser developer tools (F12)
2. Check the console for "✅ Page tagged:" message
3. Or run `window.quantumTagManager.getTagStatus()` in the console

## Best Practices
- Add tag manager to all new pages
- Run a site scan weekly to ensure all pages are tagged
- Verify tag status after major site updates
- Use the auto-manager to bulk-apply tags

---

Last Updated: June 14, 2025
