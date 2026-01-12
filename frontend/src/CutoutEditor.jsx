import { useRef, useEffect, useState } from 'react'
import './CutoutEditor.css'

function CutoutEditor({ originalImage, processedImage, onSave, onCancel }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const [selection, setSelection] = useState(null) // { x, y, width, height }
  const [canvasContext, setCanvasContext] = useState(null)
  const [image, setImage] = useState(null)
  const [canvasScale, setCanvasScale] = useState(1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    setCanvasContext(ctx)

    // Load the processed image
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      setImage(img)
      
      // Set canvas size to match image
      canvas.width = img.width
      canvas.height = img.height
      
      // Calculate scale for display - use 100% of container
      const container = containerRef.current
      if (container) {
        const maxWidth = container.clientWidth
        const maxHeight = container.clientHeight
        const scaleX = maxWidth / img.width
        const scaleY = maxHeight / img.height
        const scale = Math.min(scaleX, scaleY)
        setCanvasScale(scale)
      }
      
      // Draw initial image
      renderCanvas(ctx, img, null)
    }
    img.src = processedImage
  }, [processedImage])

  const renderCanvas = (ctx, img, sel) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    
    // Draw the image
    ctx.drawImage(img, 0, 0)
    
    // Draw selection overlay
    if (sel) {
      // Darken area outside selection
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
      
      // Top
      ctx.fillRect(0, 0, ctx.canvas.width, sel.y)
      // Bottom
      ctx.fillRect(0, sel.y + sel.height, ctx.canvas.width, ctx.canvas.height - (sel.y + sel.height))
      // Left
      ctx.fillRect(0, sel.y, sel.x, sel.height)
      // Right
      ctx.fillRect(sel.x + sel.width, sel.y, ctx.canvas.width - (sel.x + sel.width), sel.height)
      
      // Draw selection border
      ctx.strokeStyle = '#2563eb'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.strokeRect(sel.x, sel.y, sel.width, sel.height)
      ctx.setLineDash([])
      
      // Draw corner handles
      const handleSize = 8
      ctx.fillStyle = '#2563eb'
      // Top-left
      ctx.fillRect(sel.x - handleSize/2, sel.y - handleSize/2, handleSize, handleSize)
      // Top-right
      ctx.fillRect(sel.x + sel.width - handleSize/2, sel.y - handleSize/2, handleSize, handleSize)
      // Bottom-left
      ctx.fillRect(sel.x - handleSize/2, sel.y + sel.height - handleSize/2, handleSize, handleSize)
      // Bottom-right
      ctx.fillRect(sel.x + sel.width - handleSize/2, sel.y + sel.height - handleSize/2, handleSize, handleSize)
    }
  }

  const getMousePos = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    return {
      x: Math.max(0, Math.min((e.clientX - rect.left) * scaleX, canvas.width)),
      y: Math.max(0, Math.min((e.clientY - rect.top) * scaleY, canvas.height))
    }
  }

  const handleMouseDown = (e) => {
    const pos = getMousePos(e)
    setIsSelecting(true)
    setSelection({
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
      startX: pos.x,
      startY: pos.y
    })
  }

  const handleMouseMove = (e) => {
    if (!isSelecting || !selection) return
    
    const pos = getMousePos(e)
    const newSelection = {
      x: Math.min(selection.startX, pos.x),
      y: Math.min(selection.startY, pos.y),
      width: Math.abs(pos.x - selection.startX),
      height: Math.abs(pos.y - selection.startY),
      startX: selection.startX,
      startY: selection.startY
    }
    
    setSelection(newSelection)
    
    if (canvasContext && image) {
      renderCanvas(canvasContext, image, newSelection)
    }
  }

  const handleMouseUp = () => {
    setIsSelecting(false)
  }

  const handleSelectAll = () => {
    if (!image) return
    
    const newSelection = {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height
    }
    
    setSelection(newSelection)
    
    if (canvasContext && image) {
      renderCanvas(canvasContext, image, newSelection)
    }
  }

  const handleClearSelection = () => {
    setSelection(null)
    if (canvasContext && image) {
      renderCanvas(canvasContext, image, null)
    }
  }

  const handleApplyCrop = () => {
    if (!selection || !image || !canvasContext) return
    
    // Create a new canvas for the cropped image
    const croppedCanvas = document.createElement('canvas')
    croppedCanvas.width = selection.width
    croppedCanvas.height = selection.height
    const croppedCtx = croppedCanvas.getContext('2d')
    
    // Draw the cropped portion
    croppedCtx.drawImage(
      canvasRef.current,
      selection.x, selection.y, selection.width, selection.height,
      0, 0, selection.width, selection.height
    )
    
    // Convert to blob and save
    croppedCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      onSave(url)
    }, 'image/png')
  }

  return (
    <div className="cutout-editor-inline">
      {/* Left Sidebar - Tools */}
      <div className="cutout-controls">
        <div className="cutout-tools">
          <h3 className="cutout-title">Crop Tool</h3>
          <p className="cutout-description">
            Click and drag to select the area you want to keep
          </p>
          
          <div className="cutout-actions-left">
            <button 
              className="cutout-btn"
              onClick={handleSelectAll}
              disabled={!image}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2}/>
              </svg>
              Select All
            </button>
            
            <button 
              className="cutout-btn"
              onClick={handleClearSelection}
              disabled={!selection}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Selection
            </button>
          </div>
          
          {selection && (
            <div className="selection-info">
              <h4>Selection</h4>
              <div className="info-row">
                <span>Width:</span>
                <span>{Math.round(selection.width)}px</span>
              </div>
              <div className="info-row">
                <span>Height:</span>
                <span>{Math.round(selection.height)}px</span>
              </div>
              <div className="info-row">
                <span>Position:</span>
                <span>({Math.round(selection.x)}, {Math.round(selection.y)})</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center - Canvas */}
      <div className="cutout-canvas-wrapper" ref={containerRef}>
        <canvas
          ref={canvasRef}
          className="cutout-canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            cursor: isSelecting ? 'crosshair' : 'crosshair',
            transform: `scale(${canvasScale})`,
            transformOrigin: 'center center'
          }}
        />
      </div>

      {/* Right Sidebar - Actions */}
      <div className="cutout-actions">
        <div className="cutout-hint">
          {selection 
            ? '✂️ Click "Apply Crop" to cut the selected area'
            : '🖱️ Click and drag to select an area to crop'}
        </div>
        <div className="cutout-buttons">
          <button className="btn-cutout-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button 
            className="btn-cutout-apply" 
            onClick={handleApplyCrop}
            disabled={!selection || selection.width === 0 || selection.height === 0}
          >
            Apply Crop
          </button>
        </div>
      </div>
    </div>
  )
}

export default CutoutEditor
