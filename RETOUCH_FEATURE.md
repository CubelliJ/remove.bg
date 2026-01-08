# 🖌️ Retouch Feature Documentation

The retouch feature allows users to manually refine the background removal results by restoring or erasing parts of the image.

## Features

### ✨ Dual Brush Modes

1. **Restore Mode** (Green)
   - Add back parts of the original image
   - Useful when the AI removed too much
   - Example: Restore hair details, accessories, or fine edges

2. **Erase Mode** (Red)
   - Remove unwanted parts
   - Useful when the AI didn't remove enough
   - Example: Remove background artifacts or unwanted objects

### 🎨 Brush Controls

- **Adjustable Brush Size**: 5px to 100px
  - Small brushes for fine details
  - Large brushes for broad areas
  
- **Visual Cursor**: 
  - Green circle for restore mode
  - Red circle for erase mode
  - Size matches brush size for precision

### 👁️ Overlay Toggle

- **Show Original (50%)**: 
  - Overlays the original image at 50% opacity
  - Helps see what you're restoring or erasing
  - Toggle on/off as needed

## How to Use

### Step 1: Upload and Process
1. Upload an image (PNG, JPEG, JPG, WebP)
2. Wait for automatic background removal
3. Review the result

### Step 2: Enter Retouch Mode
1. Click the **"Retouch"** button in the toolbar
2. The retouch editor opens in fullscreen

### Step 3: Make Adjustments

**To Restore Parts:**
1. Click **"Restore"** button (or it's default)
2. Adjust brush size if needed
3. Click and drag over areas to restore
4. The original image pixels will be added back

**To Erase Parts:**
1. Click **"Erase"** button
2. Adjust brush size if needed
3. Click and drag over areas to remove
4. Those areas will become transparent

### Step 4: Save or Cancel
- **Apply Changes**: Saves your retouched image
- **Cancel**: Discards changes and returns to main view

## Tips & Best Practices

### 🎯 For Best Results

1. **Start with larger brush sizes** for broad areas
2. **Use smaller brushes** for fine details and edges
3. **Toggle the original overlay** to see what you're working with
4. **Zoom in** (browser zoom) for precision work on small details
5. **Work in passes**: Do rough work first, then refine

### 💡 Common Use Cases

**Restoring Hair:**
- Use small to medium brush (15-30px)
- Enable original overlay
- Carefully trace along hair strands

**Removing Background Artifacts:**
- Use erase mode
- Medium to large brush (30-60px)
- Remove any remaining background pieces

**Fixing Edges:**
- Small brush (5-15px)
- Zoom in for precision
- Carefully trace the edge

**Adding Back Accessories:**
- Restore mode
- Brush size matching the detail level
- Paint over removed jewelry, glasses, etc.

## Technical Details

### Canvas-Based Editing
- Uses HTML5 Canvas for real-time editing
- Non-destructive until you apply changes
- Full resolution editing (no quality loss)

### Mask System
- Works with alpha channel masks
- Restore mode: Adds to mask (makes visible)
- Erase mode: Removes from mask (makes transparent)

### Performance
- Optimized for smooth drawing
- Works with high-resolution images
- Real-time preview updates

## Keyboard Shortcuts (Future Enhancement)

Planned shortcuts:
- `R` - Switch to Restore mode
- `E` - Switch to Erase mode
- `[` - Decrease brush size
- `]` - Increase brush size
- `Space` - Toggle original overlay
- `Ctrl+Z` - Undo (planned)
- `Ctrl+Y` - Redo (planned)

## Browser Compatibility

Works in all modern browsers:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

Requires:
- HTML5 Canvas support
- ES6+ JavaScript support

## Limitations

- No undo/redo (yet - coming soon!)
- Cannot adjust after applying changes
- Works in browser only (no mobile app yet)

## Future Enhancements

Planned features:
- [ ] Undo/Redo functionality
- [ ] Brush hardness control
- [ ] Opacity control
- [ ] Magic wand tool
- [ ] Edge detection assist
- [ ] Keyboard shortcuts
- [ ] Touch/stylus support for tablets
- [ ] Before/after slider
- [ ] Multiple layers support

## Troubleshooting

**Brush not drawing:**
- Ensure you're in the retouch editor
- Check that you've selected a mode (Restore/Erase)
- Try refreshing the page

**Changes not visible:**
- Toggle the original overlay off to see pure result
- Ensure brush size is appropriate
- Check you're in the correct mode

**Performance issues:**
- Try reducing image size before upload
- Close other browser tabs
- Use a smaller brush size

**Canvas appears blank:**
- Wait for images to fully load
- Check browser console for errors
- Try re-entering retouch mode

## Support

For issues or feature requests, please open an issue on GitHub.

---

Made with ❤️ for precise background removal
