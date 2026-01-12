import { useState, useEffect } from 'react'
import axios from 'axios'
import CutoutEditor from './CutoutEditor'
import RetouchEditor from './RetouchEditor'
import './App.css'

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [originalImage, setOriginalImage] = useState(null)
  const [processedImage, setProcessedImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [activeMode, setActiveMode] = useState('preview') // 'preview', 'cutout', 'retouch'

  const API_URL = 'http://localhost:8000'

  // Auto-process when file is selected
  useEffect(() => {
    if (selectedFile && !processedImage && !loading) {
      removeBackground()
    }
  }, [selectedFile])

  const handleFileSelect = (file) => {
    if (!file) return

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (PNG, JPEG, JPG, WebP)')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    setSelectedFile(file)
    setError(null)
    setProcessedImage(null)

    // Preview original image
    const reader = new FileReader()
    reader.onloadend = () => {
      setOriginalImage(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    handleFileSelect(file)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const removeBackground = async () => {
    if (!selectedFile) {
      setError('Please select an image first')
      return
    }

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await axios.post(
        `${API_URL}/remove-background`,
        formData,
        {
          responseType: 'blob',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      // Create URL for the processed image
      const imageUrl = URL.createObjectURL(response.data)
      setProcessedImage(imageUrl)
    } catch (err) {
      console.error('Error removing background:', err)
      setError(
        err.response?.data?.detail || 
        'Failed to remove background. Please make sure the API is running.'
      )
    } finally {
      setLoading(false)
    }
  }

  const downloadImage = () => {
    if (!processedImage) return

    const link = document.createElement('a')
    link.href = processedImage
    link.download = `no_bg_${selectedFile.name.split('.')[0]}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const reset = () => {
    setSelectedFile(null)
    setOriginalImage(null)
    setProcessedImage(null)
    setError(null)
    setActiveMode('preview')
  }

  const handleEditorSave = (editedImageUrl) => {
    setProcessedImage(editedImageUrl)
    setActiveMode('preview')
  }

  const handleEditorCancel = () => {
    setActiveMode('preview')
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#6366f1"/>
              <path d="M16 8L24 16L16 24L8 16L16 8Z" fill="white"/>
            </svg>
            <span>remove.bg</span>
          </div>
          <div className="nav-links">
            <a href="#">Upload</a>
            <a href="#">Tools</a>
            <a href="#">Pricing</a>
          </div>
        </div>
      </nav>

      <main className="main">
        <div className="editor-container">
          {/* Toolbar */}
          <div className="toolbar">
            <div className="toolbar-left">
              <button 
                className={`tool-btn ${activeMode === 'cutout' ? 'active' : ''}`}
                onClick={() => setActiveMode('cutout')}
                disabled={!processedImage}
                title="Cutout - Manually refine edges"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                </svg>
                Cutout
              </button>
              <button 
                className={`tool-btn ${activeMode === 'retouch' ? 'active' : ''}`}
                onClick={() => setActiveMode('retouch')}
                disabled={!processedImage}
                title="Retouch - Add or remove details"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Retouch
              </button>
              <button className="tool-btn" disabled>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2}/>
                </svg>
                Background
              </button>
            </div>
            <button className="btn-download" onClick={downloadImage} disabled={!processedImage}>
              Download
            </button>
          </div>

          {/* Canvas Area */}
          <div 
            className={`canvas-area ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {loading && (
              <div className="loading-overlay">
                <div className="spinner-large"></div>
                <p>Processing your image...</p>
              </div>
            )}

            {!originalImage ? (
              <div className="upload-prompt">
                <svg
                  className="upload-icon-large"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <h2>Upload an image to remove the background</h2>
                <p className="upload-hint">or drop a file</p>
                <label htmlFor="file-upload" className="upload-button">
                  Upload Image
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </label>
                <p className="file-formats">PNG, JPEG, JPG, WebP - up to 10MB</p>
              </div>
            ) : activeMode === 'cutout' ? (
              <CutoutEditor
                originalImage={originalImage}
                processedImage={processedImage}
                onSave={handleEditorSave}
                onCancel={handleEditorCancel}
              />
            ) : activeMode === 'retouch' ? (
              <RetouchEditor
                originalImage={originalImage}
                processedImage={processedImage}
                onSave={handleEditorSave}
                onCancel={handleEditorCancel}
                mode="retouch"
              />
            ) : (
              <div className="image-display">
                <img 
                  src={processedImage || originalImage} 
                  alt="Preview" 
                  className="preview-image"
                />
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {originalImage && (
            <div className="thumbnail-strip">
              <label htmlFor="file-upload-thumb" className="add-image-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="12" y1="5" x2="12" y2="19" strokeWidth={2} strokeLinecap="round"/>
                  <line x1="5" y1="12" x2="19" y2="12" strokeWidth={2} strokeLinecap="round"/>
                </svg>
                <input
                  id="file-upload-thumb"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
              <div className="thumbnail active">
                <img src={originalImage} alt="Thumbnail" />
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="error-toast">
            {error}
          </div>
        )}
      </main>


    </div>
  )
}

export default App
