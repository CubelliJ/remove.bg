# Editor Modes Documentation

## Overview

The remove.bg clone now has three distinct modes for working with images:

### 1. **Preview Mode** (Default)
- **Purpose**: View the processed image after background removal
- **Functionality**: 
  - Shows the result from the AI background removal
  - No editing capabilities
  - Simple image display
- **When active**: After uploading and processing an image, before entering any editing mode
- **UI**: Clean image preview with checkered background showing transparency

---

### 2. **Cutout Mode** 
- **Purpose**: Crop/cut the image to a specific rectangular area
- **Functionality**:
  - Click and drag to select a rectangular region
  - Crop the image to the selected area
  - Select All button to select entire image
  - Clear Selection to start over
- **Use Cases**:
  - Crop the image to focus on a specific area
  - Remove unwanted edges or borders
  - Cut out a specific portion of the image
  - Resize the canvas to a specific area
- **Tools**:
  - Click and drag selection
  - Visual selection overlay with darkened outside area
  - Blue dashed border with corner handles
  - Real-time selection dimensions display
- **UI**:
  - Left sidebar: Crop tools and selection info
  - Center: Canvas with selection overlay
  - Right sidebar: Hints and action buttons

---

### 3. **Retouch Mode**
- **Purpose**: Add or remove details from the final image
- **Functionality**:
  - **Restore** (Primary): Add back parts of the original image
  - **Erase** (Secondary): Remove unwanted parts
- **Use Cases**:
  - Restore hair details that were removed
  - Add back accessories (glasses, jewelry)
  - Remove small unwanted objects
  - Fix fine details and edges
- **Default Tool**: Restore (since you're adding details back)
- **UI**: Same layout as Cutout mode but with different default tool

---

## Mode Switching

Users can switch between modes using the toolbar buttons:
- **Cutout** button - Activates cutout refinement mode
- **Retouch** button - Activates detail retouching mode
- Clicking either button when already in that mode does nothing
- Switching modes preserves the current processed image state

---

## Common Features (Both Editing Modes)

### Brush Controls
- **Size**: 5px - 100px (adjustable slider)
- **Hardness**: 0% - 100% (adjustable slider)
  - 0% = Very soft, feathered edges
  - 100% = Hard, crisp edges
- **Show Original**: Toggle to overlay original image at 50% opacity

### Actions
- **Cancel**: Discard changes and return to preview mode
- **Apply Changes**: Save edits and return to preview mode

### Visual Feedback
- **Custom cursor**: Shows brush size and hardness
  - Green for Restore mode
  - Red for Erase mode
  - Outer circle = full brush size
  - Inner circle = hard edge area

---

## Technical Implementation

### State Management
```javascript
const [activeMode, setActiveMode] = useState('preview')
// Possible values: 'preview', 'cutout', 'retouch'
```

### Mode-Specific Components
- **Cutout mode**: Uses `CutoutEditor` component (crop/selection tool)
- **Retouch mode**: Uses `RetouchEditor` component (brush-based editing)
- Each mode has its own dedicated component and functionality

### Canvas System

**CutoutEditor (Crop Tool)**:
- Uses HTML5 Canvas for selection overlay
- Rectangle selection with mouse drag
- Visual feedback with darkened outside area
- Blue dashed border with corner handles
- Real-time dimension display

**RetouchEditor (Brush Tool)**:
- Uses HTML5 Canvas with alpha channel masking
- Radial gradient brushes for smooth edges
- Real-time rendering with composite operations
- Non-destructive editing until "Apply Changes"

---

## User Workflow

### Typical Cutout Workflow
1. Upload image → AI removes background
2. Click "Cutout" button
3. Click and drag to select the area to keep
4. Use **Select All** or **Clear Selection** as needed
5. Review selection dimensions in sidebar
6. Click "Apply Crop" to cut the selected area

### Typical Retouch Workflow
1. After cutout, click "Retouch" button
2. Use **Restore** to add back hair/details
3. Switch to **Erase** to remove unwanted parts
4. Adjust brush size/hardness for fine details
5. Click "Apply Changes"

---

## Future Enhancements

### Planned Features
- [ ] Undo/Redo functionality
- [ ] Keyboard shortcuts (R for restore, E for erase, etc.)
- [ ] Zoom controls for precision work
- [ ] Magic wand tool for automatic selection
- [ ] Edge detection assist
- [ ] Before/after comparison slider
- [ ] Multiple layers support
- [ ] Brush opacity control
- [ ] Touch/stylus pressure sensitivity

### Potential Additional Modes
- [ ] **Background Mode**: Add solid colors or images as background
- [ ] **Effects Mode**: Apply filters, shadows, etc.
- [ ] **Transform Mode**: Resize, rotate, crop

---

## Design Philosophy

The three-mode system provides:
1. **Simplicity**: Default preview mode is non-intimidating
2. **Power**: Advanced editing when needed
3. **Clarity**: Each mode has a clear, focused purpose
4. **Flexibility**: Switch between modes freely
5. **Professional**: Similar to tools like Photoshop, Figma

The sidebar layout ensures:
- No UI elements blocking the image
- All controls easily accessible
- Professional, organized appearance
- Responsive design for smaller screens
