import { useRef, useEffect, useState } from 'react'
import './RetouchEditor.css'

function RetouchEditor({ originalImage, processedImage, onSave, onCancel }) {
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushSize, setBrushSize] = useState(30)
  const [brushMode, setBrushMode] = useState('restore') // 'restore' or 'erase'
  const [showOriginal, setShowOriginal] = useState(true)
  const [canvasContext, setCanvasContext] = useState(null)
  const [maskCanvas, setMaskCanvas] = useState(null)
  const [originalImg, setOriginalImg] = useState(null)
  const [processedImg, setProcessedImg] = useState(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    setCanvasContext(ctx)

    // Create mask canvas
    const mask = document.createElement('canvas')
    setMaskCanvas(mask)

    // Load images
    const origImg = new Image()
    origImg.crossOrigin = 'anonymous'
    origImg.onload = () => {
      setOriginalImg(origImg)
      
      // Set canvas size to match image
      canvas.width = origImg.width
      canvas.height = origImg.height
      mask.width = origImg.width
      mask.height = origImg.height

      // Initialize mask with processed image alpha
      const procImg = new Image()
      procImg.crossOrigin = 'anonymous'
      procImg.onload = () => {
        setProcessedImg(procImg)
        
        // Initialize mask from processed image
        const maskCtx = mask.getContext('2d')
        maskCtx.drawImage(procImg, 0, 0)
        
        // Render initial state
        renderCanvas(ctx, origImg, procImg, mask, showOriginal)
      }
      procImg.src = processedImage
    }
    origImg.src = originalImage
  }, [originalImage, processedImage])

  useEffect(() => {
    if (canvasContext && originalImg && processedImg && maskCanvas) {
      renderCanvas(canvasContext, originalImg, processedImg, maskCanvas, showOriginal)
    }
  }, [showOriginal])

  const renderCanvas = (ctx, origImg, procImg, mask, showOrig) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    
    // Draw original image
    ctx.drawImage(origImg, 0, 0)
    
    // Draw processed image with mask
    ctx.globalCompositeOperation = 'destination-in'
    ctx.drawImage(mask, 0, 0)
    ctx.globalCompositeOperation = 'source-over'
    
    // If showing original for reference, overlay it with transparency
    if (showOrig) {
      ctx.globalAlpha = 0.5
      ctx.globalCompositeOperation = 'source-over'
      ctx.drawImage(origImg, 0, 0)
      ctx.globalAlpha = 1.0
    }
  }

  const getMousePos = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
      scale: scaleX // Return scale for cursor sizing
    }
  }

  const drawBrush = (x, y) => {
    if (!maskCanvas || !canvasContext || !originalImg || !processedImg) return

    const maskCtx = maskCanvas.getContext('2d')
    
    if (brushMode === 'restore') {
      // Restore mode: add to mask (make visible)
      maskCtx.globalCompositeOperation = 'source-over'
      maskCtx.fillStyle = 'rgba(255, 255, 255, 1)'
    } else {
      // Erase mode: remove from mask (make transparent)
      maskCtx.globalCompositeOperation = 'destination-out'
      maskCtx.fillStyle = 'rgba(255, 255, 255, 1)'
    }
    
    maskCtx.beginPath()
    maskCtx.arc(x, y, brushSize, 0, Math.PI * 2)
    maskCtx.fill()
    
    // Re-render canvas
    renderCanvas(canvasContext, originalImg, processedImg, maskCanvas, showOriginal)
  }

  const handleMouseDown = (e) => {
    setIsDrawing(true)
    const pos = getMousePos(e)
    drawBrush(pos.x, pos.y)
  }

  const handleMouseMove = (e) => {
    if (!isDrawing) return
    const pos = getMousePos(e)
    drawBrush(pos.x, pos.y)
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
  }

  const handleSave = () => {
    if (!canvasContext || !originalImg || !maskCanvas) return

    // Create final canvas
    const finalCanvas = document.createElement('canvas')
    finalCanvas.width = originalImg.width
    finalCanvas.height = originalImg.height
    const finalCtx = finalCanvas.getContext('2d')

    // Draw original image
    finalCtx.drawImage(originalImg, 0, 0)
    
    // Apply mask
    finalCtx.globalCompositeOperation = 'destination-in'
    finalCtx.drawImage(maskCanvas, 0, 0)
    
    // Convert to blob and pass to parent
    finalCanvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      onSave(url)
    }, 'image/png')
  }

  return (
    <div className="retouch-editor">
      <div className="retouch-toolbar">
        <div className="retouch-tools">
          <button
            className={`retouch-btn ${brushMode === 'restore' ? 'active' : ''}`}
            onClick={() => setBrushMode('restore')}
            title="Restore (add back parts of the image)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Restore
          </button>
          <button
            className={`retouch-btn ${brushMode === 'erase' ? 'active' : ''}`}
            onClick={() => setBrushMode('erase')}
            title="Erase (remove parts of the image)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
            Erase
          </button>
          
          <div className="brush-size-control">
            <label>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="8" />
              </svg>
              Brush Size: {brushSize}px
            </label>
            <input
              type="range"
              min="5"
              max="100"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="brush-slider"
            />
          </div>

          <label className="toggle-original">
            <input
              type="checkbox"
              checked={showOriginal}
              onChange={(e) => setShowOriginal(e.target.checked)}
            />
            Show Original (50%)
          </label>
        </div>

        <div className="retouch-actions">
          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSave}>
            Apply Changes
          </button>
        </div>
      </div>

      <div className="retouch-canvas-container">
        <canvas
          ref={canvasRef}
          className="retouch-canvas"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            cursor: (() => {
              const canvas = canvasRef.current
              if (!canvas) return 'crosshair'
              const rect = canvas.getBoundingClientRect()
              const scale = rect.width / canvas.width
              const displaySize = brushSize * scale
              const svgSize = displaySize * 2
              return `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${svgSize}" height="${svgSize}"><circle cx="${displaySize}" cy="${displaySize}" r="${displaySize}" fill="none" stroke="${brushMode === 'restore' ? '%23059669' : '%23dc2626'}" stroke-width="2"/></svg>') ${displaySize} ${displaySize}, crosshair`
            })()
          }}
        />
      </div>

      <div className="retouch-hint">
        <p>
          {brushMode === 'restore' 
            ? '🖌️ Click and drag to restore parts of the original image'
            : '✂️ Click and drag to remove unwanted parts'}
        </p>
      </div>
    </div>
  )
}

export default RetouchEditor
