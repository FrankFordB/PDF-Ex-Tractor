import React, { useState } from 'react'
import ConfirmModal from './ConfirmModal'

export default function ResultCard({ item, onCopy, onDelete, onToggleStatus, index, highlighted, isGuest = false, onShowLogin }) {
  const [copiedField, setCopiedField] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'info' })

  const handleCopyField = (fieldName, fieldValue) => {
    if (isGuest) {
      onShowLogin && onShowLogin()
      return
    }
    navigator.clipboard.writeText(fieldValue)
    if (onCopy) onCopy(fieldValue)
    setCopiedField(fieldName)
    // No usar setTimeout - mantener el estado hasta que copie otro campo
  }

  const handleCopyAll = () => {
    if (isGuest) {
      onShowLogin && onShowLogin()
      return
    }
    navigator.clipboard.writeText(item.finalText)
    if (onCopy) onCopy(item.finalText)
    setCopiedField('all')
    // No usar setTimeout - mantener el estado hasta que copie otro campo
  }

  const handleValueClick = () => {
    if (isGuest && onShowLogin) {
      onShowLogin()
    }
  }

  return (
    <div className="bg-white/60 backdrop-blur-xl p-3 sm:p-4 rounded-2xl shadow-2xl mb-4 border border-white/30 relative hover:bg-white/70 transition-all">
      {/* Banner superior clickeable para usuarios invitados */}
      {isGuest && (
        <div className="mb-4 -mt-3 -mx-3 sm:-mx-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-t cursor-pointer hover:from-blue-700 hover:to-purple-700 transition-all" onClick={onShowLogin}>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-lock text-lg"></i>
              <span className="text-sm font-semibold">Regístrate gratis para copiar y exportar</span>
            </div>
            <i className="fa-solid fa-arrow-right"></i>
          </div>
        </div>
      )}
      {/* Header con nombre de archivo y botón eliminar */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-4">
        <div className="w-full sm:w-auto">
          <div className="text-xs sm:text-sm text-gray-500 truncate">{item.fileName}</div>
          {item.extracted['error'] ? (
            <div className="text-red-600 font-semibold text-xs sm:text-sm mt-1">{item.extracted['error']}</div>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mt-2">
              <div className="font-semibold text-gray-800 text-sm sm:text-base truncate">
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
              if (item.fileUrl) {
                window.open(item.fileUrl, '_blank', 'noopener,noreferrer')
              } else {
                setAlertModal({
                  isOpen: true,
                  title: '⚠️ Archivo No Disponible',
                  message: 'No hay archivo disponible para previsualizar en otra pestaña.\n\nEl archivo PDF original no está asociado a esta extracción.',
                  type: 'warning'
                })
              }
            }}
            title="Previsualizar PDF real"
            className="flex-1 sm:flex-none px-2 sm:px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded text-xs sm:text-sm flex items-center justify-center gap-1 sm:gap-2 transition-all">
            <i className="fa-solid fa-magnifying-glass-plus" aria-hidden></i>
            <span className="hidden sm:inline">Ver</span>
          </button>
          <button
            onClick={() => {
              if (isGuest) {
                onShowLogin && onShowLogin()
                return
              }
              onToggleStatus && onToggleStatus(item.fileName)
            }}
            className={`flex-1 sm:flex-none px-2 sm:px-3 py-1 rounded text-white text-xs sm:text-sm font-medium transition-all ${
              isGuest 
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 cursor-pointer' 
                : item.status === 'Finalizada' 
                  ? 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700' 
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
            }`}>
            {isGuest ? (
              <>
                <i className="fa-solid fa-lock mr-1"></i>
                Final.
              </>
            ) : (
              item.status === 'Finalizada' ? 'En Proc.' : 'Final.'
            )}
          </button>
          
          <button
            onClick={() => onDelete(index)}
            className="flex-1 sm:flex-none px-2 sm:px-3 py-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded text-xs sm:text-sm font-medium transition-all"
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
              onClick={handleValueClick}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-50 p-2 sm:p-3 rounded border border-gray-200 hover:bg-gray-100 transition-colors gap-2 sm:gap-3 ${isGuest ? 'select-none cursor-pointer hover:border-blue-300' : ''}`}
            >
              <div className="flex-1 min-w-0 w-full">
                <div className="text-xs font-semibold text-gray-500 uppercase">
                  {fieldName}
                </div>
                <div className={`text-xs sm:text-sm text-gray-800 font-mono mt-1 break-all line-clamp-2 ${isGuest ? 'select-none' : ''}`}>
                  {fieldValue}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopyField(fieldName, fieldValue)
                }}
                className={`w-full sm:w-auto px-3 py-1 sm:py-2 rounded text-white text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0 min-w-[70px] transition-all ${
                  isGuest 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 cursor-pointer'
                    : copiedField === fieldName
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                }`}
              >
                {isGuest ? <><i className="fa-solid fa-lock mr-1"></i>Copiar</> : copiedField === fieldName ? '✓' : 'Copiar'}
              </button>
            </div>
          )
        ))}
      </div>

      {/* Botón copiar todo */}
      <button
        onClick={handleCopyAll}
        className={`w-full px-4 py-2 rounded text-white font-medium text-xs sm:text-sm transition-all ${
          isGuest
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 cursor-pointer'
            : copiedField === 'all' 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' 
            : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
        } ${highlighted ? 'ring-2 ring-blue-400' : ''}`}
      >
        {copiedField === 'all' ? '✓ Copiado todo' : 'Copiar Todo'}
      </button>
      {/* Preview modal */}
      {showPreview && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4 p-6 overflow-auto max-h-[80vh]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-sm text-gray-500">Previsualización</div>
                <div className="font-semibold">{item.fileName}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { navigator.clipboard.writeText(item.finalText || '') }} className="px-3 py-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded transition-all">Copiar todo</button>
                <button onClick={() => setShowPreview(false)} className="px-3 py-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded transition-all">Cerrar</button>
              </div>
            </div>

            <div className="mb-4 space-y-3">
              {Object.entries(item.extracted || {}).map(([k, v]) => (
                v !== 'error' && (
                  <div key={k} className="p-3 bg-gray-50 rounded">
                    <div className="text-xs text-gray-500 uppercase">{k}</div>
                    <div className="text-sm font-mono mt-1 break-words">{v}</div>
                  </div>
                )
              ))}
            </div>

            <div className="mt-2">
              <div className="text-xs text-gray-500 mb-2">Texto extraído (raw):</div>
              <pre className="text-sm whitespace-pre-wrap bg-gray-100 p-3 rounded max-h-56 overflow-auto font-mono">{item.rawText || item.finalText}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Alerta */}
      <ConfirmModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        onConfirm={() => setAlertModal({ ...alertModal, isOpen: false })}
        onCancel={() => setAlertModal({ ...alertModal, isOpen: false })}
        showCancel={false}
        confirmText="Entendido"
      />
    </div>
  )
}