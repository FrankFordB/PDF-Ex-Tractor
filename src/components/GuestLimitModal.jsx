export default function GuestLimitModal({ uploadCount, onClose, onShowRegister }) {
  const remaining = Math.max(0, 3 - uploadCount)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-3">
              <i className="fa-solid fa-exclamation-triangle text-3xl"></i>
            </div>
            <h2 className="text-2xl font-bold mb-2">
              Límite Alcanzado
            </h2>
            <p className="text-orange-100">
              Has alcanzado el límite de 3 PDFs sin registro
            </p>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-8">
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <i className="fa-solid fa-gift text-blue-500"></i>
            Regístrate gratis y obtén:
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <i className="fa-solid fa-check text-green-500 mt-0.5"></i>
              <span><strong>5 PDFs por semana</strong> (se reinicia automáticamente)</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="fa-solid fa-check text-green-500 mt-0.5"></i>
              <span>Guarda tus extracciones en la nube</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="fa-solid fa-check text-green-500 mt-0.5"></i>
              <span>Acceso desde cualquier dispositivo</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="fa-solid fa-check text-green-500 mt-0.5"></i>
              <span>Tu progreso nunca se pierde</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <i className="fa-solid fa-crown text-yellow-500"></i>
            O actualiza a Premium
          </h3>
          <p className="text-sm text-gray-700 mb-2">
            <strong>$8.99 USD/mes</strong> - Cargas ilimitadas y mucho más
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              onClose()
              onShowRegister()
            }}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all transform hover:scale-105"
          >
            <i className="fa-solid fa-user-plus mr-2"></i>
            Crear Cuenta Gratis
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-medium rounded-lg transition-all"
          >
            Volver
          </button>
        </div>
        </div>
      </div>
    </div>
  )
}
