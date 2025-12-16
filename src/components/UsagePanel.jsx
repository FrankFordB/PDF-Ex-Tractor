import { useAuth } from '../contexts/AuthContext'

export default function UsagePanel({ onUpgrade, onShowRegister }) {
  const { user, userData, getRemainingUploads } = useAuth()

  const isSuperAdmin = user?.email === 'franco_burgoa1@hotmail.com'
  const isAdmin = userData?.role === 'admin'
  const isReina = userData?.role === 'reina'
  const isPremium = userData?.accountType === 'premium'
  
  // No mostrar para premium/admin
  if (user && (isSuperAdmin || isAdmin || isReina || isPremium)) return null
  
  // Panel para usuarios GUEST (sin login)
  if (!user) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border-2 border-green-200 p-6 shadow-lg">
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mb-3">
            <i className="fa-solid fa-user-plus text-white text-2xl"></i>
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            ¡Crea tu cuenta gratis!
          </h3>
          <p className="text-sm text-gray-600 mt-1">Desbloquea todas las ventajas</p>
        </div>

        {/* Beneficios de registrarse */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-green-100">
          <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <i className="fa-solid fa-gift text-green-500"></i>
            Beneficios al Registrarte
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <i className="fa-solid fa-check text-green-500 mt-0.5"></i>
              <span><strong>5 PDFs gratis</strong> al mes</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="fa-solid fa-check text-green-500 mt-0.5"></i>
              <span><strong>Guarda tus facturas</strong> en la nube</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="fa-solid fa-check text-green-500 mt-0.5"></i>
              <span><strong>Acceso desde cualquier dispositivo</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <i className="fa-solid fa-check text-green-500 mt-0.5"></i>
              <span><strong>Historial de procesamiento</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <i className="fa-solid fa-check text-green-500 mt-0.5"></i>
              <span><strong>Exporta a Excel</strong> tus datos</span>
            </li>
            <li className="flex items-start gap-2">
              <i className="fa-solid fa-check text-green-500 mt-0.5"></i>
              <span><strong>100% gratis</strong> sin tarjeta de crédito</span>
            </li>
          </ul>
        </div>

        {/* Botón de registro */}
        <button
          onClick={onShowRegister}
          className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-user-plus"></i>
          Registrarse Gratis
        </button>
        
        <p className="text-center text-xs text-gray-500 mt-3">
          Sin compromisos • Registro en 30 segundos
        </p>
      </div>
    )
  }
  
  // Panel para usuarios FREE (con login)
  const uploaded = userData?.pdfUploaded || 0
  const limit = userData?.maxPdfLimit || 5
  const remaining = getRemainingUploads() || 0
  const percentage = (uploaded / limit) * 100

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 p-6 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <i className="fa-solid fa-chart-pie text-blue-600"></i>
            Estado de tu cuenta
          </h3>
          <p className="text-sm text-gray-600 mt-1">Plan Gratuito</p>
        </div>
        <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
          <p className="text-xs text-gray-500">PDFs procesados</p>
          <p className="text-2xl font-bold text-blue-600">{uploaded}/{limit}</p>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-700 font-medium">Uso actual</span>
          <span className="text-gray-600">{remaining} restantes</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentage >= 100
                ? 'bg-red-500'
                : percentage >= 80
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
        {percentage >= 80 && (
          <p className="text-xs text-orange-600 mt-2 flex items-center gap-1">
            <i className="fa-solid fa-exclamation-triangle"></i>
            {percentage >= 100 ? 'Límite alcanzado' : 'Cerca del límite'}
          </p>
        )}
      </div>

      {/* Beneficios Premium */}
      <div className="bg-white rounded-lg p-4 mb-4 border border-blue-100">
        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <i className="fa-solid fa-crown text-yellow-500"></i>
          Beneficios Premium
        </h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <i className="fa-solid fa-check text-green-500 mt-0.5"></i>
            <span><strong>PDFs ilimitados</strong> sin restricciones</span>
          </li>
          <li className="flex items-start gap-2">
            <i className="fa-solid fa-check text-green-500 mt-0.5"></i>
            <span><strong>Procesamiento prioritario</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <i className="fa-solid fa-check text-green-500 mt-0.5"></i>
            <span><strong>Exportar a Excel</strong> todas tus facturas</span>
          </li>
          <li className="flex items-start gap-2">
            <i className="fa-solid fa-check text-green-500 mt-0.5"></i>
            <span><strong>Almacenamiento permanente</strong> en la nube</span>
          </li>
          <li className="flex items-start gap-2">
            <i className="fa-solid fa-check text-green-500 mt-0.5"></i>
            <span><strong>Soporte prioritario</strong> 24/7</span>
          </li>
        </ul>
      </div>

      {/* Botón de upgrade */}
      <button
        onClick={onUpgrade}
        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
      >
        <i className="fa-solid fa-rocket"></i>
        Actualizar a Premium
      </button>
      
      <p className="text-center text-xs text-gray-500 mt-3">
        Cancela cuando quieras • Sin compromisos
      </p>
    </div>
  )
}
