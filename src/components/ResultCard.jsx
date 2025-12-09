import React, { useState } from 'react'

export default function ResultCard({ item, onCopy, onDelete, onToggleStatus, index, highlighted }) {
  const [copiedField, setCopiedField] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  const handleCopyField = (fieldName, fieldValue) => {
    navigator.clipboard.writeText(fieldValue)
    if (onCopy) onCopy(fieldValue)
    setCopiedField(fieldName)
    // No usar setTimeout - mantener el estado hasta que copie otro campo
  }

  const handleCopyAll = () => {
    navigator.clipboard.writeText(item.finalText)
    if (onCopy) onCopy(item.finalText)
    setCopiedField('all')
    // No usar setTimeout - mantener el estado hasta que copie otro campo
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded shadow mb-4 border border-gray-200 dark:border-gray-700">
      {/* Header con nombre de archivo y botón eliminar */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-4">
        <div className="w-full sm:w-auto">
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">{item.fileName}</div>
          {item.extracted['error'] ? (
            <div className="text-red-600 font-semibold text-xs sm:text-sm mt-1">{item.extracted['error']}</div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-2">
              <div className="font-semibold text-gray-800 dark:text-white text-sm sm:text-base truncate">
                {item.extracted['Comp. Nro'] || item.extracted['CAE N°'] || 'Documento'}
              </div>
              <div className={`text-xs px-2 py-0.5 rounded-full w-fit ${item.status === 'Finalizada' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {item.status || 'En proceso'}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              if (item.fileUrl) window.open(item.fileUrl, '_blank', 'noopener,noreferrer')
              else alert('No hay archivo disponible para previsualizar en otra pestaña.')
            }}
            title="Previsualizar PDF real"
            className="flex-1 sm:flex-none px-2 sm:px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2">
            <i className="fa-solid fa-magnifying-glass-plus" aria-hidden></i>
            <span className="hidden sm:inline">Ver</span>
          </button>
          <button
            onClick={() => onToggleStatus && onToggleStatus(item.fileName)}
            className={`flex-1 sm:flex-none px-2 sm:px-3 py-1 rounded text-white text-xs sm:text-sm font-medium transition-all ${item.status === 'Finalizada' ? 'bg-green-500 hover:bg-gray-600' : 'bg-green-600 hover:bg-green-700'}`}>
            {item.status === 'Finalizada' ? 'En Proc.' : 'Final.'}
          </button>
          
          <button
            onClick={() => onDelete(index)}
            className="flex-1 sm:flex-none px-2 sm:px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs sm:text-sm font-medium transition-all"
          >
            Eliminar
          </button>
        </div>
      </div>

      {/* Campos individuales con botones de copiar */}
      <div className="space-y-2 mb-4">
        {Object.entries(item.extracted).map(([fieldName, fieldValue]) => (
          fieldValue !== 'error' && (
            <div
              key={fieldName}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 sm:p-3 rounded border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors gap-2 sm:gap-3"
            >
              <div className="flex-1 min-w-0 w-full">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  {fieldName}
                </div>
                <div className="text-xs sm:text-sm text-gray-800 dark:text-gray-100 font-mono mt-1 break-all line-clamp-2">
                  {fieldValue}
                </div>
              </div>
              <button
                onClick={() => handleCopyField(fieldName, fieldValue)}
                className={`w-full sm:w-auto px-3 py-1 sm:py-2 rounded text-white text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0 min-w-[70px] ${
                  copiedField === fieldName
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {copiedField === fieldName ? '✓' : 'Copiar'}
              </button>
            </div>
          )
        ))}
      </div>

      {/* Botón copiar todo */}
      <button
        onClick={handleCopyAll}
        className={`w-full px-4 py-2 rounded text-white font-medium text-xs sm:text-sm ${copiedField === 'all' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-600 hover:bg-blue-700'} ${highlighted ? 'ring-2 ring-blue-400' : ''}`}
      >
        {copiedField === 'all' ? '✓ Copiado todo' : 'Copiar Todo'}
      </button>
      {/* Preview modal */}
      {showPreview && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-3xl w-full mx-4 p-6 overflow-auto max-h-[80vh]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Previsualización</div>
                <div className="font-semibold">{item.fileName}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { navigator.clipboard.writeText(item.finalText || '') }} className="px-3 py-1 bg-blue-600 text-white rounded">Copiar todo</button>
                <button onClick={() => setShowPreview(false)} className="px-3 py-1 bg-gray-300 hover:bg-gray-200 rounded">Cerrar</button>
              </div>
            </div>

            <div className="mb-4 space-y-3">
              {Object.entries(item.extracted || {}).map(([k, v]) => (
                v !== 'error' && (
                  <div key={k} className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <div className="text-xs text-gray-500 uppercase">{k}</div>
                    <div className="text-sm font-mono mt-1 break-words">{v}</div>
                  </div>
                )
              ))}
            </div>

            <div className="mt-2">
              <div className="text-xs text-gray-500 mb-2">Texto extraído (raw):</div>
              <pre className="text-sm whitespace-pre-wrap bg-gray-100 dark:bg-gray-700 p-3 rounded max-h-56 overflow-auto font-mono">{item.rawText || item.finalText}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}