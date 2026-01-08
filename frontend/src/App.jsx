import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [originalImage, setOriginalImage] = useState(null)
  const [processedImage, setProcessedImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const API_URL = 'http://localhost:8000'

  const handleFileSelect = (file) => {
    if (!file) return

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (PNG, JPEG, JPG)')
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
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🎨 Background Remover</h1>
        <p>Remove backgrounds from images using AI</p>
      </header>

      <main className="main">
        {!originalImage ? (
          <div
            className={`upload-area ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="upload-content">
              <svg
                className="upload-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <h2>Drop your image here</h2>
              <p>or</p>
              <label htmlFor="file-upload" className="file-label">
                <span className="btn btn-primary">Choose File</span>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </label>
              <p className="file-info">PNG, JPEG, JPG (max 10MB)</p>
            </div>
          </div>
        ) : (
          <div className="image-container">
            <div className="image-comparison">
              <div className="image-box">
                <h3>Original</h3>
                <div className="image-wrapper">
                  <img src={originalImage} alt="Original" />
                </div>
              </div>

              <div className="image-box">
                <h3>Processed</h3>
                <div className="image-wrapper checkered">
                  {processedImage ? (
                    <img src={processedImage} alt="Processed" />
                  ) : (
                    <div className="placeholder">
                      <p>Click "Remove Background" to process</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="actions">
              {!processedImage ? (
                <button
                  className="btn btn-primary btn-large"
                  onClick={removeBackground}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner"></span>
                      Processing...
                    </>
                  ) : (
                    '✨ Remove Background'
                  )}
                </button>
              ) : (
                <>
                  <button
                    className="btn btn-success btn-large"
                    onClick={downloadImage}
                  >
                    ⬇️ Download PNG
                  </button>
                  <button className="btn btn-secondary" onClick={reset}>
                    🔄 New Image
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="error">
            <strong>Error:</strong> {error}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Powered by U2-Net AI Model</p>
      </footer>
    </div>
  )
}

export default App
