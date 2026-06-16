import { useState, useEffect } from 'react'
import { File, X, Image, FileText, FileSpreadsheet, CheckCircle } from 'lucide-react'
import { ProgressBar } from 'react-bootstrap'
import { fileItem, thumbnail, thumbnailImage, thumbnailRemove, progressContainer } from './dropzone.css'

interface FilePreviewProps {
  file: File
  onRemove?: (file: File) => void
  showProgress?: boolean
  variant?: 'list' | 'grid'
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`
}

function getFileIcon(file: File) {
  if (file.type.startsWith('image/')) return <Image size={20} />
  if (file.type.includes('spreadsheet') || file.type.includes('excel')) return <FileSpreadsheet size={20} />
  if (file.type.includes('pdf') || file.type.includes('document') || file.type.includes('word')) return <FileText size={20} />
  return <File size={20} />
}

function getPreviewUrl(file: File): string | null {
  if (file.type.startsWith('image/')) {
    return URL.createObjectURL(file)
  }
  return null
}

export default function FilePreview({ file, onRemove, showProgress = false, variant = 'list' }: FilePreviewProps) {
  const [progress, setProgress] = useState(showProgress ? 0 : 100)
  const [complete, setComplete] = useState(!showProgress)
  const previewUrl = getPreviewUrl(file)

  useEffect(() => {
    if (!showProgress) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setComplete(true)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 200)

    return () => clearInterval(interval)
  }, [showProgress])

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  if (variant === 'grid' && previewUrl) {
    return (
      <div className={thumbnail}>
        <img src={previewUrl} alt={file.name} className={thumbnailImage} />
        <button
          type="button"
          className={thumbnailRemove}
          onClick={() => onRemove?.(file)}
          aria-label={`Eliminar ${file.name}`}
        >
          <X size={14} />
        </button>
      </div>
    )
  }

  return (
    <div className={fileItem}>
      <span className="text-muted">{getFileIcon(file)}</span>
      <div className="flex-grow-1 text-start">
        <div className="d-flex align-items-center gap-2">
          <span className="small text-truncate" style={{ maxWidth: 200 }}>
            {file.name}
          </span>
          {complete && showProgress && <CheckCircle size={14} className="text-success" />}
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted" style={{ fontSize: '0.75rem' }}>
            {formatFileSize(file.size)}
          </span>
          {showProgress && !complete && (
            <div className={progressContainer}>
              <ProgressBar
                now={Math.min(progress, 100)}
                striped
                animated={!complete}
                style={{ height: 4 }}
              />
            </div>
          )}
        </div>
      </div>
      {onRemove && (
        <button
          type="button"
          className="btn btn-link p-0 text-muted"
          onClick={() => onRemove(file)}
          aria-label={`Eliminar ${file.name}`}
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
