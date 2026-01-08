# Changelog

All notable changes to the Background Remover App.

## [1.1.0] - 2024-01-08

### Added
- ✨ WebP image format support
  - Backend API now accepts WebP images
  - Frontend upload accepts WebP files
  - Updated validation for WebP MIME type (`image/webp`)

### Changed
- Updated file type validation in both frontend and backend
- Updated documentation to reflect WebP support
- Updated UI text to mention WebP format

### Supported Formats
- PNG
- JPEG
- JPG
- WebP

**Output format remains**: PNG with alpha channel (transparent background)

## [1.0.0] - Initial Release

### Features
- 🤖 AI-powered background removal using U2-Net model
- 🚀 FastAPI backend with RESTful API
- 🎨 React + Vite frontend with modern UI
- 📤 Drag & drop file upload
- 🖼️ Side-by-side image comparison
- 💾 Download processed images as PNG
- 🐳 Docker support for easy deployment
- 📱 Responsive design
- ⚡ Fast processing

### Supported Formats (Initial)
- PNG
- JPEG
- JPG
