# Development Guide

## Prerequisites

- Chrome browser (for testing)
- [just](https://github.com/casey/just) command runner
- jq (for JSON processing)
- Git

## Quick Start

1. Clone the repository
2. Run `just dev` to validate and package the extension
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode"
5. Click "Load unpacked" and select the project directory

## Development Workflow

### Making Changes

1. Edit the source files directly in the project directory
2. After making changes, click the refresh icon next to the extension in `chrome://extensions/`
3. Test your changes on Reddit pages

### Common Commands

```bash
# Package for development testing
just package

# Validate manifest and check file sizes
just check

# Clean build artifacts
just clean

# Bump version (patch/minor/major)
just bump-version patch

# Show current version
just version

# Full development cycle
just dev
```

### File Structure

- `manifest.json` - Extension manifest (Chrome APIs, permissions, metadata)
- `script.js` - Main content script (injected into Reddit pages)
- `jquery.min.js` - jQuery dependency
- `icon.png` - Extension icon
- `justfile` - Development automation
- `.github/workflows/` - CI/CD automation

### Testing

Since this is a content script extension, testing involves:

1. **Manual Testing**
   - Load the extension in Chrome
   - Navigate to Reddit pages
   - Test responsive behavior by resizing the browser window
   - Verify sidebar toggle and lock functionality
   - Check state persistence across page reloads

2. **Automated Validation**
   - `just check` runs manifest validation and file size checks
   - GitHub Actions validate PRs and releases automatically

### Extension Architecture

The extension works by injecting a content script (`script.js`) into Reddit pages that:

1. **Adds Toggle Controls**: Injects show/hide and lock/unlock links into Reddit's header
2. **Manages State**: Uses Chrome's storage API to persist user preferences
3. **Responsive Behavior**: Automatically hides sidebar when window < 768px (if unlocked)
4. **Multi-reddit Management**: Collapses the multi-reddit chooser when not on front page

### Chrome Storage

The extension uses two storage keys:
- `sidebarStatus`: 'hide' or 'show' - current visibility state
- `lockStatus`: 'locked' or 'unlocked' - whether sidebar responds to window resize

### DOM Manipulation

The extension targets specific Reddit CSS selectors:
- `div.side` - The main sidebar container
- `div#header-bottom-right` - Where toggle controls are injected
- `body.listing-chooser-collapsed` - Controls multi-reddit chooser

## Release Process

### Version Management

1. **Development**: Work on main branch, automatic dev builds are created
2. **Version Bump**: Use `just bump-version [major|minor|patch]`
3. **Release**: Create and push a git tag to trigger release build

### Automated Releases

The project has three types of releases:

1. **PR Validation**: Every PR runs validation and creates test artifacts
2. **Development Releases**: Every push to main creates a dev release
3. **Production Releases**: Git tags trigger full releases with Chrome Web Store packages

### Manual Release Steps

While GitHub Actions automate most of the process, Chrome Web Store publishing requires manual steps:

1. **Create Release**:
   ```bash
   just bump-version patch
   git add manifest.json
   git commit -m "Bump version to $(just version)"
   git tag "v$(just version)"
   git push origin main --tags
   ```

2. **Chrome Web Store Publishing**:
   - Download the release .zip from GitHub releases
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Select the extension
   - Upload the new package
   - Review store listing details
   - Submit for review (typically 1-3 business days)

3. **Post-Release**:
   - Update README.md if needed
   - Monitor extension for issues
   - Respond to user feedback in the Chrome Web Store

## Chrome Web Store Requirements

### File Size Limits
- Individual files: 25MB maximum
- Total extension size: 100MB maximum
- Our extension is well under these limits

### Manifest Requirements
- Valid JSON format
- Required fields: name, version, manifest_version
- Proper permissions declarations
- Valid content script matches

### Store Listing
- Clear description of functionality
- Screenshots showing the extension in action
- Appropriate category and tags
- Privacy policy (if collecting data)

## Security Considerations

- Extension only runs on Reddit domains
- No external network requests
- Only uses Chrome storage API for persistence
- No sensitive data collection or transmission
- Content script injection is limited to Reddit pages

## Browser Compatibility

- Chrome: Full support (primary target)
- Chromium-based browsers: Should work (Edge, Brave, etc.)
- Firefox: Not supported (different extension API)
- Safari: Not supported (different extension system)

## Troubleshooting

### Extension Not Loading
1. Check `chrome://extensions/` for error messages
2. Verify manifest.json is valid JSON
3. Check file permissions in the extension directory

### Functionality Issues
1. Open Chrome DevTools on a Reddit page
2. Check the Console tab for JavaScript errors
3. Verify the extension is injecting properly in the Elements tab

### Storage Issues
1. Open Chrome DevTools
2. Go to Application tab > Storage > Extension Storage
3. Check if storage keys are being set correctly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on Reddit pages
5. Run `just check` to validate
6. Submit a pull request

The automated CI will validate your changes and create test artifacts for review.