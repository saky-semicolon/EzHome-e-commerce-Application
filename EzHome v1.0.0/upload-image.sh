#!/bin/bash
# EzHome Image Upload Helper
# This script helps copy uploaded images to the correct location

echo "=================================="
echo "EzHome Image Upload Helper"
echo "=================================="
echo ""

# Check if source file is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <source_image_file> [destination_name]"
    echo ""
    echo "Examples:"
    echo "  $0 ~/Downloads/product-photo.jpg smart-bulb.jpg"
    echo "  $0 ./my-image.png"
    echo ""
    exit 1
fi

SOURCE_FILE="$1"
DEST_NAME="$2"

# Check if source file exists
if [ ! -f "$SOURCE_FILE" ]; then
    echo "Error: Source file '$SOURCE_FILE' not found!"
    exit 1
fi

# Get the script directory and set the images folder
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGES_DIR="$SCRIPT_DIR/images"

# Create images directory if it doesn't exist
mkdir -p "$IMAGES_DIR"

# If no destination name provided, use the original filename (sanitized)
if [ -z "$DEST_NAME" ]; then
    ORIGINAL_NAME=$(basename "$SOURCE_FILE")
    # Sanitize filename: lowercase and replace spaces/special chars with dashes
    DEST_NAME=$(echo "$ORIGINAL_NAME" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9.]/-/g' | sed 's/--*/-/g')
fi

DEST_PATH="$IMAGES_DIR/$DEST_NAME"

# Copy the file
if cp "$SOURCE_FILE" "$DEST_PATH"; then
    echo "✓ Successfully copied image!"
    echo "  From: $SOURCE_FILE"
    echo "  To:   $DEST_PATH"
    echo "  URL:  images/$DEST_NAME"
    echo ""
    echo "You can now use 'images/$DEST_NAME' as the image path in your product."
else
    echo "✗ Error copying file!"
    exit 1
fi

echo ""
echo "Done!"
