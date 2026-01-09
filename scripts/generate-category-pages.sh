#!/bin/bash

# Generate category pages for any categories found in posts
# Run from the root of the Jekyll site: ./scripts/generate-category-pages.sh

POSTS_DIR="_posts"
PAGES_DIR="_pages"

# Extract all unique categories from posts
# Handles YAML arrays like: categories: [ reviews, first ride ]
categories=$(grep -h "^categories:" "$POSTS_DIR"/*.md 2>/dev/null | \
    sed 's/categories:[[:space:]]*\[//g' | \
    sed 's/\]//g' | \
    tr ',' '\n' | \
    sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | \
    grep -v '^$' | \
    sort -u)

echo "Found categories:"
echo "$categories"
echo ""

# Create category pages
while IFS= read -r category; do
    # Skip empty lines
    [ -z "$category" ] && continue

    # Convert to slug (lowercase, spaces to dashes)
    slug=$(echo "$category" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

    # Title case for display
    title=$(echo "$category" | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1')

    page_file="$PAGES_DIR/$slug.md"

    if [ -f "$page_file" ]; then
        echo "✓ $slug.md already exists"
    else
        cat > "$page_file" << EOF
---
layout: category
title: $title
category: $category
permalink: /$slug/
---
EOF
        git add "$page_file"
        echo "✚ Created and staged $slug.md"
    fi
done <<< "$categories"

echo ""
echo "Done!"
