import React from 'react'

/**
 * Modal de confirmación reutilizable
 * @param {boolean} isOpen - Si el modal está abierto
 * @param {string} title - Título del modal
 * @param {string} message - Mensaje principal
 * @param {string} type - Tipo: 'info', 'warning', 'error', 'success'
 * @param {function} onConfirm - Callback al confirmar
 * @param {function} onCancel - Callback al cancelar
 * @param {string} confirmText - Texto del botón de confirmar (default: "Confirmar")
 * @param {string} cancelText - Texto del botón de cancelar (default: "Cancelar")
 * @param {boolean} showCancel - Mostrar botón cancelar (default: true para confirm, false para alert)
 */
export default function ConfirmModal({
  isOpen,
  title,
  message,
  type = 'info',
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  showCancel = true
}) {
  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <i className="fa-solid fa-triangle-exclamation text-yellow-500 text-5xl"></i>
      case 'error':
        return <i className="fa-solid fa-circle-xmark text-red-500 text-5xl"></i>
      case 'success':
        return <i className="fa-solid fa-circle-check text-green-500 text-5xl"></i>
      case 'info':
      default:
        return <i className="fa-solid fa-circle-info text-blue-500 text-5xl"></i>
    }
  }

  const getColors = () => {
    switch (type) {
      case 'warning':
        return {
          border: 'border-yellow-500',
          confirmBg: 'bg-yellow-500 hover:bg-yellow-600',
          titleColor: 'text-yellow-700'
        }
      case 'error':
        return {
          border: 'border-red-500',
          confirmBg: 'bg-red-500 hover:bg-red-600',
          titleColor: 'text-red-700'
        }
      case 'success':
        return {
          border: 'border-green-500',
          confirmBg: 'bg-green-500 hover:bg-green-600',
          titleColor: 'text-green-700'
        }
      case 'info':
      default:
        return {
          border: 'border-blue-500',
          confirmBg: 'bg-blue-500 hover:bg-blue-600',
          titleColor: 'text-blue-700'
        }
    }
  }

  const colors = getColors()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] animate-fadeIn">
      <div 
        className={`bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 border-t-4 ${colors.border}`}
        style={{
          animation: 'modalSlideIn 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div className="p-6 text-center border-b border-gray-200">
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>
          <h3 className={`text-2xl font-bold ${colors.titleColor}`}>
            {title}
          </h3>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700 text-center whitespace-pre-line leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className={`p-6 bg-gray-50 rounded-b-lg flex gap-3 ${showCancel ? 'justify-between' : 'justify-center'}`}>
          {showCancel && (
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white font-medium rounded-lg transition-all"
            >
              <i className="fa-solid fa-times mr-2"></i>
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            className={`flex-1 px-6 py-3 ${colors.confirmBg} text-white font-medium rounded-lg transition-colors shadow-md`}
          >
            <i className="fa-solid fa-check mr-2"></i>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
