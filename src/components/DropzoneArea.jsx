import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export default function DropzoneArea({ onFiles, disabled = false, onDisabledClick }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (disabled) return
    onFiles(acceptedFiles)
  }, [onFiles, disabled])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    disabled: disabled
  })

  if (disabled) {
    return (
      <div
        onClick={onDisabledClick}
        className="border-2 border-dashed rounded p-6 sm:p-8 text-center transition-colors border-red-300 bg-red-50 cursor-pointer hover:bg-red-100"
      >
        <div>
          <div className="flex items-center justify-center mb-2">
            <i className="fa-solid fa-lock text-3xl sm:text-4xl text-red-400"></i>
          </div>
          <p className="text-red-700 text-sm sm:text-base font-bold">Límite alcanzado</p>
          <p className="text-xs sm:text-sm text-red-600 mt-2">Haz click aquí para actualizar a Premium</p>
        </div>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed rounded p-6 sm:p-8 text-center transition-colors border-gray-300 bg-white hover:bg-gray-50 cursor-pointer"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-blue-600 text-sm sm:text-base font-medium">Soltá los archivos aquí ...</p>
      ) : (
        <div>
          <div className="flex items-center justify-center mb-2">
            <i className="fa-solid fa-cloud-arrow-up text-3xl sm:text-4xl text-gray-400"></i>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">Haz clic o arrastra PDFs aquí</p>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">Soporta: PDF (múltiples archivos)</p>
        </div>
      )}
    </div>
  )
}