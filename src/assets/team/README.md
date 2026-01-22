# Team Photos

Place your team member photos in this directory. The images will be automatically loaded and displayed in the Team section.

## Image Requirements

- **Format**: JPG, JPEG, PNG, or WebP
- **Size**: At least 600×600 pixels (square aspect ratio recommended)
- **Quality**: High quality, professional headshots
- **Style**: Professional, well-lit, clear background

## File Naming Convention

Use the exact filenames specified in `src/data/team.js`:

- `sam-kalaliya.jpg`
- `marcus-neural.jpg`
- `elena-fusion.jpg`
- `alex-velocity.jpg`

## How It Works

The TeamGrid component uses Vite's `import.meta.glob` to automatically load all images from this directory at build time. If an image is missing, a fallback with initials will be displayed.

## Tips for Best Results

1. **Square Crop**: Images are displayed in a square format, so crop your photos accordingly
2. **Consistent Style**: Use similar lighting and background for a cohesive look
3. **Professional Quality**: High-resolution images will look crisp on all devices
4. **File Size**: Optimize images for web (under 500KB each for fast loading)
