#!/usr/bin/env bash
# Updates the 'last_modified_at:' field in modified post files
# This field is recognized by jekyll-seo-tag for dateModified in schema.org

# Get today's date in YYYY-MM-DD format
TODAY=$(date +%Y-%m-%d)

# Get list of staged .md files in _posts/
STAGED_POSTS=$(git diff --cached --name-only --diff-filter=M | grep "^_posts/.*\.md$")

if [ -z "$STAGED_POSTS" ]; then
    exit 0
fi

for file in $STAGED_POSTS; do
    # Check if file exists
    if [ ! -f "$file" ]; then
        continue
    fi

    # Extract the original publish date from filename (YYYY-MM-DD prefix)
    FILENAME=$(basename "$file")
    PUBLISH_DATE=$(echo "$FILENAME" | grep -oE "^[0-9]{4}-[0-9]{2}-[0-9]{2}")

    # Skip if today matches the publish date (no need for last_modified_at field)
    if [ "$TODAY" = "$PUBLISH_DATE" ]; then
        continue
    fi

    # Check if file already has a 'last_modified_at:' field
    if grep -q "^last_modified_at:" "$file"; then
        # Update existing field
        sed -i '' "s/^last_modified_at:.*/last_modified_at: $TODAY/" "$file"
    else
        # Add last_modified_at field after the date: line
        if grep -q "^date:" "$file"; then
            sed -i '' "/^date:/a\\
last_modified_at: $TODAY
" "$file"
        fi
    fi

    # Re-stage the file with the updated date
    git add "$file"
    echo "Updated last_modified_at in $FILENAME"
done
