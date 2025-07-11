# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a Chrome extension that provides responsive sidebar functionality for Reddit. It automatically hides Reddit's right sidebar when the browser window is less than 768px wide, and provides manual controls to show/hide and lock/unlock the sidebar state.

## Architecture
- **Content Script Extension**: Uses Chrome's manifest v3 with content scripts injected into Reddit pages
- **jQuery-based**: Leverages jQuery for DOM manipulation and event handling
- **Chrome Storage API**: Persists sidebar state (show/hide, locked/unlocked) using `chrome.storage.local`
- **Responsive Design**: Uses a 768px breakpoint to automatically hide/show sidebar based on window width

## Key Components
- `manifest.json`: Chrome extension manifest defining permissions, content scripts, and target URLs
- `script.js`: Main functionality including:
  - Sidebar toggle logic (`hideSidebar()`, `showSidebar()`)
  - Lock/unlock functionality (`lockSidebar()`, `unlockSidebar()`)
  - Responsive behavior (`respond()` function)
  - State persistence using Chrome storage
  - Multi-reddit chooser management
- `jquery.min.js`: jQuery library dependency

## State Management
The extension maintains two key states in Chrome's local storage:
- `sidebarStatus`: 'hide' or 'show' - tracks current sidebar visibility
- `lockStatus`: 'locked' or 'unlocked' - determines if sidebar responds to window resize

## Development Workflow

### Commands
- `just dev` - Full development cycle: validate, package, and show installation instructions
- `just check` - Validate manifest.json and check file sizes
- `just package` - Create development .zip package
- `just package-release` - Create versioned release package
- `just bump-version [major|minor|patch]` - Update version in manifest.json
- `just clean` - Remove build artifacts

### Testing
Since this is a Chrome extension, testing requires:
1. Loading the extension in Chrome's developer mode (`chrome://extensions/`)
2. Navigating to Reddit pages to test functionality
3. Resizing browser window to test responsive behavior
4. Verifying state persistence across page loads

### Release Process
1. **Development**: Work on main branch, automatic dev builds created on push
2. **Version Bump**: Use `just bump-version patch` to update version
3. **Release**: Create git tag (`git tag v0.7`) to trigger production release
4. **Chrome Web Store**: Manual upload of release .zip to Chrome Web Store Developer Dashboard

### CI/CD
- `.github/workflows/validate.yml` - PR validation and artifact creation
- `.github/workflows/dev-release.yml` - Development releases from main branch
- `.github/workflows/release.yml` - Production releases from git tags

## Development Notes
- The extension only targets Reddit URLs (reddit.com, np.reddit.com)
- DOM manipulation targets Reddit's specific CSS classes (`div.side`, `div#header-bottom-right`)
- Uses event delegation for dynamically added toggle links
- Includes logic to collapse multi-reddit chooser when not on front page
- Chrome Web Store publishing requires manual steps after automated release creation