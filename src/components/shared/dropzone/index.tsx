import { useCallback } from 'react'
import { useDropzone, type FileRejection, type Accept } from 'react-dropzone'
import { Upload } from 'lucide-react'
import { dropzoneStyle } from './dropzone.css'

interface DropzoneProps {
  multiple?: boolean
  accept?: Accept
  maxFiles?: number
  maxSize?: number
  onDrop?: (acceptedFiles: File[]) => void
  onReject?: (fileRejections: FileRejection[]) => void
  disabled?: boolean
  children?: React.ReactNode
  className?: string
}

export default function Dropzone({
  multiple = false,
  accept,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  onDrop,
  onReject,
  disabled = false,
  children,
  className,
}: DropzoneProps) {
  const onDropCallback = useCallback(
    (acceptedFiles: File[]) => {
      onDrop?.(acceptedFiles)
    },
    [onDrop]
  )

  const onRejectCallback = useCallback(
    (fileRejections: FileRejection[]) => {
      onReject?.(fileRejections)
    },
    [onReject]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: onDropCallback,
    onDropRejected: onRejectCallback,
    multiple,
    accept,
    maxFiles,
    maxSize,
    disabled,
  })

  const currentState = isDragReject ? 'reject' : isDragActive ? 'active' : 'default'

  return (
    <div
      {...getRootProps()}
      className={`${dropzoneStyle[currentState]} ${className ?? ''}`}
      role="button"
      tabIndex={0}
      aria-label="Dropzone para subir archivos"
    >
      <input {...getInputProps()} />
      {children ?? (
        <>
          <Upload size={40} strokeWidth={1.5} className="text-muted" />
          <div>
            <p className="mb-1 fw-medium">
              {isDragActive
                ? isDragReject
                  ? 'Archivo no permitido'
                  : 'Suelta los archivos aquí'
                : 'Arrastra archivos aquí o haz clic para seleccionar'}
            </p>
            <p className="text-muted small mb-0">
              {multiple ? `Máximo ${maxFiles} archivos` : 'Un solo archivo'} • Max {Math.round(maxSize / 1024 / 1024)}MB
            </p>
          </div>
        </>
      )}
    </div>
  )
}
