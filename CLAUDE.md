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

## Testing
Since this is a Chrome extension, testing requires:
1. Loading the extension in Chrome's developer mode
2. Navigating to Reddit pages to test functionality
3. Resizing browser window to test responsive behavior
4. Verifying state persistence across page loads

## Development Notes
- The extension only targets Reddit URLs (reddit.com, np.reddit.com)
- DOM manipulation targets Reddit's specific CSS classes (`div.side`, `div#header-bottom-right`)
- Uses event delegation for dynamically added toggle links
- Includes logic to collapse multi-reddit chooser when not on front page