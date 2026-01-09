#!/usr/bin/env bash
# Updates the 'updated:' field in modified post files

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

    # Skip if today matches the publish date (no need for updated field)
    if [ "$TODAY" = "$PUBLISH_DATE" ]; then
        continue
    fi

    # Check if file already has an 'updated:' field
    if grep -q "^updated:" "$file"; then
        # Update existing field
        sed -i '' "s/^updated:.*/updated: $TODAY/" "$file"
    else
        # Add updated field after the date: line, or after summary: if no date:
        if grep -q "^date:" "$file"; then
            sed -i '' "/^date:/a\\
updated: $TODAY
" "$file"
        elif grep -q "^summary:" "$file"; then
            sed -i '' "/^summary:/a\\
updated: $TODAY
" "$file"
        fi
    fi

    # Re-stage the file with the updated date
    git add "$file"
    echo "✎ Updated date in $FILENAME"
done
