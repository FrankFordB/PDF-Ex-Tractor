import React from 'react'

export default function WelcomeModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4 p-8 border border-gray-200">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Bienvenido a PDF Extractor!
          </h2>
          <p className="text-sm text-gray-500">
            Versión 1.10 Beta
          </p>
          <a className="text-sm text-blue-500" href="https://ar.linkedin.com/in/franco-burgoa-4a338514b">Desarrollado por Franco Burgoa</a>
        </div>

        {/* Content */}
        <div className="space-y-4 mb-8 text-gray-700">
          <p className="text-center text-lg">
            Tu herramienta profesional para extraer información de facturas PDF de forma automática.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Características principales:
            </h3>
            <ul className="space-y-2 ml-7 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Extrae automáticamente CAE, CUIL, DNI, Beneficiario y más</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Calcula fechas de emisión automáticamente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Exporta todos los datos a Excel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Gestiona el estado de tus facturas (En proceso / Finalizada)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Todo se guarda en tu navegador de forma segura</span>
              </li>
            </ul>
          </div>

          <p className="text-center text-sm italic text-gray-600">
            Simplifica tu trabajo y ahorra tiempo con extracción inteligente de datos.
          </p>
        </div>

        {/* Button */}
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105"
        >
          Aceptar y comenzar
        </button>
      </div>
    </div>
  )
}
