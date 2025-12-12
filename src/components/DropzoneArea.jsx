import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export default function DropzoneArea({ onFiles }) {
  const onDrop = useCallback((acceptedFiles) => {
    onFiles(acceptedFiles)
  }, [onFiles])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] }
  })

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed rounded p-6 sm:p-8 text-center cursor-pointer bg-white hover:bg-gray-50 transition-colors border-gray-300"
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