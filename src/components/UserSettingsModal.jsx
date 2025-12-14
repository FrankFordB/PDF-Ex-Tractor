import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function UserSettingsModal({ onClose }) {
  const { user, userData, logout, updateUserProfile, getRemainingUploads } = useAuth()
  const [activeTab, setActiveTab] = useState('profile') // profile, billing, preferences
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || '',
    lastName: userData?.lastName || '',
    phone: userData?.phone || '',
    country: userData?.country || '',
    state: userData?.state || '',
    city: userData?.city || ''
  })
  const [message, setMessage] = useState({ type: '', text: '' })
  const [saving, setSaving] = useState(false)

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage({ type: 'info', text: 'Actualizando perfil...' })
    
    const result = await updateUserProfile(formData)
    
    if (result.success) {
      setMessage({ type: 'success', text: '✅ Perfil actualizado correctamente' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } else {
      setMessage({ type: 'error', text: `❌ Error: ${result.error}` })
    }
    
    setSaving(false)
  }

  const handleLogout = async () => {
    await logout()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Configuración de Cuenta</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-4 mt-4 border-b">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-2 px-1 font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="fa-solid fa-user mr-2"></i>
              Perfil
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`pb-2 px-1 font-medium transition-colors ${
                activeTab === 'billing'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="fa-solid fa-credit-card mr-2"></i>
              Suscripción
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`pb-2 px-1 font-medium transition-colors ${
                activeTab === 'preferences'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="fa-solid fa-cog mr-2"></i>
              Preferencias
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Tab: Perfil */}
          {activeTab === 'profile' && (
            <div>
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {userData?.firstName?.[0]}{userData?.lastName?.[0]}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{userData?.firstName} {userData?.lastName}</h3>
                    <p className="text-gray-600">{user?.email}</p>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      userData?.accountType === 'premium' 
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {userData?.accountType === 'premium' ? '⭐ Premium' : 'Free'}
                    </span>
                    {userData?.accountType === 'free' && userData?.role !== 'reina' && user?.email !== 'franco_burgoa1@hotmail.com' && (
                      <div className="mt-2 text-sm text-gray-600">
                        📄 PDFs restantes: <strong>{getRemainingUploads()}/5</strong> esta semana
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {message.text && (
                  <div className={`p-3 rounded ${
                    message.type === 'success' ? 'bg-green-50 text-green-800' :
                    message.type === 'error' ? 'bg-red-50 text-red-800' :
                    'bg-blue-50 text-blue-800'
                  }`}>
                    {message.text}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      Guardando...
                    </span>
                  ) : (
                    'Guardar Cambios'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Tab: Suscripción */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Plan Actual</h3>
                    <p className="text-3xl font-bold mt-2">
                      {userData?.accountType === 'premium' ? (
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600">
                          Premium
                        </span>
                      ) : (
                        <span className="text-gray-700">Free</span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-sm">Límite mensual</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {userData?.accountType === 'premium' ? '∞' : '5 PDFs/semana'}
                    </p>
                  </div>
                </div>

                {userData?.accountType === 'free' && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>PDFs usados esta semana:</strong> {userData?.pdfUploaded || 0} de 5
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${((userData?.pdfUploaded || 0) / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {userData?.accountType === 'free' && (
                <div className="border-2 border-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">⭐</span>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">Actualizar a Premium</h4>
                      <p className="text-gray-600">Desbloquea todo el potencial</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <p className="flex items-center text-gray-700">
                      <i className="fa-solid fa-check text-green-600 mr-2"></i>
                      PDFs ilimitados
                    </p>
                    <p className="flex items-center text-gray-700">
                      <i className="fa-solid fa-check text-green-600 mr-2"></i>
                      Almacenamiento en la nube permanente
                    </p>
                    <p className="flex items-center text-gray-700">
                      <i className="fa-solid fa-check text-green-600 mr-2"></i>
                      Soporte prioritario
                    </p>
                    <p className="flex items-center text-gray-700">
                      <i className="fa-solid fa-check text-green-600 mr-2"></i>
                      Exportación avanzada
                    </p>
                  </div>

                  <div className="text-center mb-6">
                    <p className="text-4xl font-bold text-gray-900">$8.99<span className="text-lg text-gray-600">/mes</span></p>
                  </div>

                  <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105">
                    Actualizar Ahora
                  </button>
                </div>
              )}

              {userData?.accountType === 'premium' && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Método de Pago</h4>
                  <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg">
                    <i className="fa-brands fa-cc-visa text-3xl text-blue-600"></i>
                    <div className="flex-1">
                      <p className="font-medium">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-600">Vence 12/2025</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Cambiar
                    </button>
                  </div>

                  <button className="mt-4 w-full text-red-600 hover:text-red-700 font-medium py-2">
                    Cancelar Suscripción
                  </button>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <i className="fa-solid fa-info-circle mr-2"></i>
                  <strong>Formas de pago disponibles:</strong> Stripe, PayPal, MercadoPago (Argentina)
                </p>
              </div>
            </div>
          )}

          {/* Tab: Preferencias */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Notificaciones</h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <span className="text-gray-700">Notificaciones por email</span>
                    <input type="checkbox" className="w-5 h-5 text-blue-600" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <span className="text-gray-700">Actualizaciones de producto</span>
                    <input type="checkbox" className="w-5 h-5 text-blue-600" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <span className="text-gray-700">Ofertas y promociones</span>
                    <input type="checkbox" className="w-5 h-5 text-blue-600" />
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Privacidad</h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <span className="text-gray-700">Guardar PDFs automáticamente</span>
                    <input type="checkbox" className="w-5 h-5 text-blue-600" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <span className="text-gray-700">Modo oscuro</span>
                    <input type="checkbox" className="w-5 h-5 text-blue-600" />
                  </label>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-semibold text-red-600 mb-3">Zona de Peligro</h4>
                <button className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-medium py-3 px-4 rounded-lg border border-red-200 transition-colors">
                  Eliminar Cuenta Permanentemente
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex gap-3">
          <button
            onClick={handleLogout}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            <i className="fa-solid fa-sign-out-alt mr-2"></i>
            Cerrar Sesión
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-300 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
