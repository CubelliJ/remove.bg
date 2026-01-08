# Background Remover - Frontend

A modern React + Vite frontend for removing backgrounds from images using AI.

## Features

- 🎨 Clean and intuitive UI
- 📤 Drag & drop or file upload
- 🖼️ Side-by-side comparison (original vs processed)
- 💾 Download processed images as PNG with alpha channel
- 📱 Responsive design
- ⚡ Fast and lightweight

## Quick Start

### Prerequisites

Make sure the backend API is running at `http://localhost:8000`

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Upload an image**: Drag & drop or click to select a PNG, JPEG, JPG, or WebP image (max 10MB)
2. **Remove background**: Click the "Remove Background" button
3. **Download**: Once processed, download your PNG with transparent background
4. **Process another**: Click "New Image" to start over

## Technology Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API requests
- **CSS3** - Modern styling with gradients and animations

## API Configuration

The API URL is configured in `src/App.jsx`. To change it:

```javascript
const API_URL = 'http://localhost:8000'
```

## Supported Image Formats

- PNG
- JPEG
- JPG
- WebP

**Output format**: PNG with alpha channel (transparent background)

## Browser Support

Modern browsers with ES6+ support:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
