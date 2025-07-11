# Chrome Extension Development Tasks

# Package extension for development (creates unversioned .zip)
package:
    #!/usr/bin/env bash
    echo "Packaging extension for development..."
    zip -r "responsive-reddit-sidebar-dev.zip" . \
        -x "*.git*" \
        -x "*.DS_Store" \
        -x "justfile" \
        -x "DEVELOPMENT.md" \
        -x "*.zip" \
        -x ".github/*"
    echo "Created responsive-reddit-sidebar-dev.zip"

# Package extension for release (creates versioned .zip)
package-release:
    #!/usr/bin/env bash
    VERSION=$(jq -r '.version' manifest.json)
    echo "Packaging extension v${VERSION} for release..."
    zip -r "responsive-reddit-sidebar-v${VERSION}.zip" . \
        -x "*.git*" \
        -x "*.DS_Store" \
        -x "justfile" \
        -x "DEVELOPMENT.md" \
        -x "*.zip" \
        -x ".github/*"
    echo "Created responsive-reddit-sidebar-v${VERSION}.zip"

# Validate manifest.json
validate:
    #!/usr/bin/env bash
    echo "Validating manifest.json..."
    if ! jq . manifest.json > /dev/null 2>&1; then
        echo "❌ manifest.json is not valid JSON"
        exit 1
    fi
    
    # Check required fields
    if ! jq -e '.name' manifest.json > /dev/null; then
        echo "❌ Missing required field: name"
        exit 1
    fi
    if ! jq -e '.version' manifest.json > /dev/null; then
        echo "❌ Missing required field: version"
        exit 1
    fi
    if ! jq -e '.manifest_version' manifest.json > /dev/null; then
        echo "❌ Missing required field: manifest_version"
        exit 1
    fi
    
    echo "✅ manifest.json is valid"

# Check file sizes (Chrome Web Store has limits)
check-sizes:
    #!/usr/bin/env bash
    echo "Checking file sizes..."
    
    # Check individual files (max 25MB each)
    find . -type f -not -path "./.git/*" -not -name "*.zip" -exec ls -la {} \; | \
    awk '$5 > 26214400 {print "❌ File too large: " $9 " (" $5 " bytes, max 25MB)"}'
    
    # Check total uncompressed size (max 100MB)
    TOTAL_SIZE=$(find . -type f -not -path "./.git/*" -not -name "*.zip" -exec stat -f%z {} \; | awk '{sum += $1} END {print sum}')
    if [ $TOTAL_SIZE -gt 104857600 ]; then
        echo "❌ Total extension size too large: $TOTAL_SIZE bytes (max 100MB)"
        exit 1
    fi
    
    echo "✅ File sizes OK (total: $TOTAL_SIZE bytes)"

# Run all checks
check: validate check-sizes

# Clean build artifacts
clean:
    rm -f *.zip
    echo "Cleaned build artifacts"

# Bump version (patch by default)
bump-version level="patch":
    #!/usr/bin/env bash
    CURRENT_VERSION=$(jq -r '.version' manifest.json)
    echo "Current version: $CURRENT_VERSION"
    
    # Parse version components
    IFS='.' read -r major minor patch <<< "$CURRENT_VERSION"
    
    case "{{level}}" in
        "major")
            NEW_VERSION="$((major + 1)).0.0"
            ;;
        "minor")
            NEW_VERSION="$major.$((minor + 1)).0"
            ;;
        "patch")
            NEW_VERSION="$major.$minor.$((patch + 1))"
            ;;
        *)
            echo "❌ Invalid level: {{level}}. Use major, minor, or patch"
            exit 1
            ;;
    esac
    
    echo "New version: $NEW_VERSION"
    
    # Update manifest.json
    jq --arg version "$NEW_VERSION" '.version = $version' manifest.json > manifest.json.tmp
    mv manifest.json.tmp manifest.json
    
    echo "✅ Version bumped to $NEW_VERSION"

# Show current version
version:
    @jq -r '.version' manifest.json

# Development mode: package and show instructions
dev: check package
    @echo ""
    @echo "Development package created. To test:"
    @echo "1. Open Chrome and go to chrome://extensions/"
    @echo "2. Enable 'Developer mode' in the top right"
    @echo "3. Click 'Load unpacked' and select this directory"
    @echo "4. Or drag and drop the .zip file to install"
    @echo ""
    @echo "To test changes:"
    @echo "- Edit files and click the refresh icon in chrome://extensions/"
    @echo "- Or use 'just dev' again to repackage"