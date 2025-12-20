import React from 'react'

export default function WelcomeModal({ onClose, userName }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-3">
              <i className="fa-solid fa-hand-wave text-4xl"></i>
            </div>
            <h2 className="text-3xl font-bold mb-2">
              ¡Hola, {userName}! 👋
            </h2>
            <p className="text-blue-100">
              Bienvenido de nuevo a PDF Extractor
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
        <div className="space-y-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <i className="fa-solid fa-sparkles text-blue-600"></i>
              ¿Qué puedes hacer hoy?
            </h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-3">
                <i className="fa-solid fa-check text-green-500 mt-0.5"></i>
                <span>Extrae datos automáticamente de tus facturas PDF</span>
              </li>
              <li className="flex items-start gap-3">
                <i className="fa-solid fa-check text-green-500 mt-0.5"></i>
                <span>Exporta toda tu información a Excel con un clic</span>
              </li>
              <li className="flex items-start gap-3">
                <i className="fa-solid fa-check text-green-500 mt-0.5"></i>
                <span>Gestiona el estado de tus comprobantes fácilmente</span>
              </li>
              <li className="flex items-start gap-3">
                <i className="fa-solid fa-check text-green-500 mt-0.5"></i>
                <span>Accede a tus facturas desde cualquier dispositivo</span>
              </li>
            </ul>
          </div>

          <p className="text-center text-sm text-gray-500 italic">
            Todas tus facturas están sincronizadas y listas para usar ✨
          </p>
        </div>

        {/* Button */}
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105"
        >
          ¡Empezar a trabajar!
        </button>
        </div>
      </div>
    </div>
  )
}
