# EzHome Image Upload Guide

## How to Add Product Images

### Method 1: Using the File Upload Interface

1. **Access Product Management**: Log in as admin and go to the Product Management page
2. **Add/Edit Product**: Click "Add New Product" or edit an existing product
3. **Upload Image**: 
   - Click the "Browse" button in the Product Image section
   - Select your image file (JPG, PNG, GIF, or WebP)
   - Maximum file size: 5MB
   - The image will be previewed automatically
4. **Complete the Process**:
   - Fill in other product details
   - Click "Save" to add/update the product
   - **Important**: Follow the instruction that appears to copy your image file to the correct location

### Method 2: Manual Image Path Entry

1. Copy your image file to the `WebClient/images/` folder
2. In the product form, enter the path manually: `images/your-image-name.jpg`

### Method 3: Using the Upload Helper Script

For easier file management, use the provided upload script:

```bash
# From the WebClient directory
./upload-image.sh ~/Downloads/my-product-photo.jpg smart-thermostat.jpg
```

This will:
- Copy your image to the correct location
- Sanitize the filename
- Show you the correct path to use in the product form

## File Requirements

- **Supported formats**: JPG, PNG, GIF, WebP
- **Maximum size**: 5MB
- **Recommended dimensions**: 800x600 pixels or higher
- **Naming convention**: Use lowercase letters, numbers, and dashes only

## Image Folder Structure

```
WebClient/
├── images/
│   ├── smart-bulb.jpg
│   ├── smart-thermostat.png
│   ├── security-camera.jpg
│   └── ...
└── ...
```

## Best Practices

1. **Optimize images** before uploading (compress for web use)
2. **Use descriptive names** (e.g., `smart-led-bulb-set.jpg`)
3. **Maintain consistent aspect ratio** for better product display
4. **Test image display** after adding products

## Troubleshooting

### Image not displaying?
- Check that the file exists in `WebClient/images/`
- Verify the path in the product data matches the actual file name
- Ensure the image file has correct permissions

### Upload helper not working?
- Make sure the script is executable: `chmod +x upload-image.sh`
- Check that you're running it from the WebClient directory
- Verify the source file path is correct

### File size too large?
- Compress the image using tools like:
  - Online: TinyPNG, Squoosh
  - Desktop: GIMP, Photoshop, Preview (Mac)
  - Command line: `convert input.jpg -quality 85 output.jpg`

## Example Workflow

1. Take/find product photo
2. Resize to reasonable dimensions (e.g., 800x600)
3. Compress if needed
4. Use upload interface or helper script
5. Add/edit product with correct image path
6. Verify image displays correctly on the website

## Technical Notes

- Images are stored locally in the `WebClient/images/` folder
- The system generates sanitized filenames automatically
- Both `image` and `image_url` properties are maintained for compatibility
- The preview feature uses base64 encoding for immediate display
