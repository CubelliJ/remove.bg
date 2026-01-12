# Cutout Tool (Crop Feature)

## Overview

The **Cutout Tool** is a simple rectangular crop/selection tool that allows users to cut out a specific area of their processed image.

## Features

### ✂️ Rectangle Selection
- **Click and drag** to create a rectangular selection
- Visual feedback with:
  - Darkened area outside selection (50% black overlay)
  - Blue dashed border (`#2563eb`)
  - Corner handles for visual reference
  - Real-time selection dimensions

### 🎯 Quick Actions
- **Select All**: Instantly select the entire image
- **Clear Selection**: Remove current selection and start over

### 📊 Selection Info
Real-time display of:
- Width (in pixels)
- Height (in pixels)
- Position (x, y coordinates)

## How to Use

1. **Enter Cutout Mode**
   - Click the "Cutout" button in the toolbar
   - The crop tool interface appears

2. **Make a Selection**
   - Click and drag on the image to select an area
   - Or click "Select All" to select everything
   - Selection shows as a blue dashed rectangle
   - Area outside selection is darkened

3. **Review Selection**
   - Check dimensions in the left sidebar
   - Clear and re-select if needed

4. **Apply or Cancel**
   - Click "Apply Crop" to cut the selected area
   - Click "Cancel" to discard and return to preview

## UI Layout

```
┌─────────────────────────────────────────────────────────┐
│  Left Sidebar    │      Canvas Area      │ Right Sidebar │
│                  │                       │               │
│  • Crop Tool     │   [Image with         │  • Hint Text  │
│  • Select All    │    Selection          │  • Cancel     │
│  • Clear         │    Overlay]           │  • Apply Crop │
│  • Selection     │                       │               │
│    Info          │                       │               │
└─────────────────────────────────────────────────────────┘
```

## Technical Details

### Selection Overlay
```javascript
// Darkened outside area
ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'

// Blue dashed border
ctx.strokeStyle = '#2563eb'
ctx.lineWidth = 2
ctx.setLineDash([5, 5])

// Corner handles (8x8px blue squares)
ctx.fillStyle = '#2563eb'
ctx.fillRect(x, y, 8, 8)
```

### Crop Operation
1. Creates a new canvas with selected dimensions
2. Draws the selected portion from the original canvas
3. Converts to PNG blob
4. Returns as URL to parent component

### Mouse Interaction
- **Mouse Down**: Start selection at cursor position
- **Mouse Move**: Update selection dimensions (if selecting)
- **Mouse Up**: Finalize selection
- **Mouse Leave**: Cancel current selection drag

## Keyboard Shortcuts (Future)

Planned shortcuts:
- `A` - Select All
- `Esc` - Clear Selection
- `Enter` - Apply Crop
- `Arrow Keys` - Nudge selection
- `Shift + Drag` - Constrain to square

## Use Cases

### Common Scenarios
1. **Remove Borders**: Crop out unwanted edges after background removal
2. **Focus on Subject**: Cut to just the important part of the image
3. **Resize Canvas**: Reduce image dimensions to specific area
4. **Remove Artifacts**: Cut out problematic areas at edges

### Example Workflow
```
1. Upload image of person
2. AI removes background
3. Click "Cutout"
4. Select just the person (excluding extra space)
5. Click "Apply Crop"
6. Download cropped result
```

## Responsive Design

### Desktop (> 1024px)
- 3-column layout: Sidebar | Canvas | Sidebar
- Full controls visible
- Large canvas area

### Tablet (768px - 1024px)
- Stacked layout: Controls → Canvas → Actions
- Horizontal control layout
- Medium canvas area

### Mobile (< 768px)
- Vertical stacking
- Full-width controls
- Compact canvas area
- Touch-friendly buttons

## Differences from Retouch Tool

| Feature | Cutout Tool | Retouch Tool |
|---------|-------------|--------------|
| **Purpose** | Crop to rectangle | Brush-based editing |
| **Interaction** | Click & drag selection | Paint with brush |
| **Selection** | Rectangle only | Freeform brush strokes |
| **Output** | Cropped rectangle | Modified alpha channel |
| **Use Case** | Trim/resize | Add/remove details |

## Future Enhancements

### Planned Features
- [ ] Aspect ratio constraints (1:1, 16:9, 4:3, etc.)
- [ ] Numeric input for exact dimensions
- [ ] Drag to move selection
- [ ] Drag handles to resize selection
- [ ] Grid overlay for alignment
- [ ] Preset crop sizes (Instagram, Facebook, etc.)
- [ ] Rotate before crop
- [ ] Multiple selection shapes (circle, polygon)

### Advanced Features
- [ ] Smart crop suggestions (AI-powered)
- [ ] Rule of thirds overlay
- [ ] Golden ratio overlay
- [ ] Crop history/undo
- [ ] Save crop presets

## Browser Compatibility

Works in all modern browsers:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

Requires:
- HTML5 Canvas support
- Mouse/touch events
- ES6+ JavaScript

## Performance

- ✅ Lightweight (no heavy processing)
- ✅ Real-time selection rendering
- ✅ Efficient canvas operations
- ✅ Works with high-resolution images
- ✅ No memory leaks (proper cleanup)

---

**Simple, fast, and effective cropping for your background-removed images!** ✂️
