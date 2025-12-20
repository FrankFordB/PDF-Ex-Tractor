import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function UserSettingsModal({ onClose }) {
  const { user, userData, logout, updateUserProfile, getRemainingUploads, cancelPremium, deleteAccount } = useAuth()
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
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

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

  const handleCancelSubscription = async () => {
    setSaving(true)
    const result = await cancelPremium(user.uid)
    
    if (result.success) {
      setMessage({ type: 'success', text: '✅ Suscripción cancelada. Se ha enviado un email de confirmación.' })
      setShowCancelModal(false)
      setTimeout(() => {
        window.location.reload() // Recargar para actualizar el estado
      }, 2000)
    } else {
      setMessage({ type: 'error', text: `❌ Error: ${result.error}` })
    }
    setSaving(false)
  }

  const handleDeleteAccount = async () => {
    setSaving(true)
    const result = await deleteAccount()
    
    if (result.success) {
      // La cuenta fue eliminada, no necesitamos hacer nada más
      // El usuario ya fue deslogueado automáticamente
    } else {
      setMessage({ type: 'error', text: `❌ Error: ${result.error}` })
      setShowDeleteModal(false)
    }
    setSaving(false)
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-xl w-full my-4">
        <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b-2 border-purple-500/30 p-6 rounded-t-lg">
          <div>
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              <i className="fa-solid fa-user-gear mr-3 text-purple-400"></i>
              Configuración de Cuenta
            </h2>
            <p className="text-purple-200/90">Gestiona tu perfil y preferencias</p>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-4 mt-4 border-b border-purple-500/30">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-2 px-1 font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'border-b-2 border-purple-400 text-purple-300'
                  : 'text-purple-200/60 hover:text-purple-200'
              }`}
            >
              <i className="fa-solid fa-user mr-2"></i>
              Perfil
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`pb-2 px-1 font-medium transition-colors ${
                activeTab === 'billing'
                  ? 'border-b-2 border-purple-400 text-purple-300'
                  : 'text-purple-200/60 hover:text-purple-200'
              }`}
            >
              <i className="fa-solid fa-credit-card mr-2"></i>
              Suscripción
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`pb-2 px-1 font-medium transition-colors ${
                activeTab === 'preferences'
                  ? 'border-b-2 border-purple-400 text-purple-300'
                  : 'text-purple-200/60 hover:text-purple-200'
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
                         PDFs restantes: <strong>{getRemainingUploads()}/5</strong> esta semana
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <form onSubmit={handleUpdate} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nombre</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Apellido</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">País</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Provincia</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Ciudad</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Espacio reservado para mensajes (altura fija) */}
                <div className="h-16">
                  {message.text && (
                    <div className={`p-3 rounded ${
                      message.type === 'success' ? 'bg-green-50 text-green-800' :
                      message.type === 'error' ? 'bg-red-50 text-red-800' :
                      'bg-blue-50 text-blue-800'
                    }`}>
                      {message.text}
                    </div>
                  )}
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-10 text-base rounded-lg transition-colors min-w-[200px]"
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
                </div>
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
                    {userData?.accountType === 'premium' && userData?.subscriptionEndDate && (
                      <p className="text-sm text-gray-600 mt-2">
                        <i className="fa-solid fa-calendar-days mr-1"></i>
                        {(() => {
                          const end = new Date(userData.subscriptionEndDate)
                          const now = new Date()
                          const diff = end - now
                          const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24))
                          return daysLeft > 0 ? `${daysLeft} días restantes` : 'Expirado'
                        })()}
                      </p>
                    )}
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

                    onClick={() => setShowCancelModal(true)}
                    className="mt-4 w-full text-red-600 hover:text-red-700 font-medium py-2"
                  
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
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-medium py-3 px-4 rounded-lg border border-red-200 transition-colors"
                >
                  Eliminar Cuenta Permanentemente
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-center gap-3">
          <button
            onClick={handleLogout}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-10 text-base rounded-lg transition-colors min-w-[200px]"
          >
            <i className="fa-solid fa-sign-out-alt mr-2"></i>
            Cerrar Sesión
          </button>
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-10 text-base rounded-lg transition-colors min-w-[200px]"
          >
            Cerrar
          </button>
        </div>

        {/* Modal de Confirmación de Cancelación */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                <i className="fa-solid fa-exclamation-triangle text-yellow-500 mr-2"></i>
                ¿Cancelar Suscripción Premium?
              </h3>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-4">Si cancelas tu suscripción, perderás acceso a:</p>
                <div className="space-y-2 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="flex items-center text-red-700">
                    <i className="fa-solid fa-times-circle mr-2"></i>
                    <strong>PDFs ilimitados</strong> (vuelves a 5 PDFs/semana)
                  </p>
                  <p className="flex items-center text-red-700">
                    <i className="fa-solid fa-times-circle mr-2"></i>
                    <strong>Almacenamiento en la nube permanente</strong>
                  </p>
                  <p className="flex items-center text-red-700">
                    <i className="fa-solid fa-times-circle mr-2"></i>
                    <strong>Soporte prioritario</strong>
                  </p>
                  <p className="flex items-center text-red-700">
                    <i className="fa-solid fa-times-circle mr-2"></i>
                    <strong>Exportación avanzada</strong>
                  </p>
                </div>
                
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <i className="fa-solid fa-info-circle mr-2"></i>
                    Se enviará un email de confirmación con todos los detalles. 
                    <strong> No se realizarán más cobros automáticos.</strong>
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
                >
                  Mantener Premium
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      Cancelando...
                    </span>
                  ) : (
                    'Sí, Cancelar'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmación de Eliminación de Cuenta */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-red-600 mb-4">
                <i className="fa-solid fa-exclamation-triangle mr-2"></i>
                ¡ADVERTENCIA! Eliminar Cuenta
              </h3>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-4 font-semibold">Esta acción es PERMANENTE e IRREVERSIBLE.</p>
                <div className="space-y-2 bg-red-50 border-2 border-red-300 rounded-lg p-4">
                  <p className="flex items-center text-red-700">
                    <i className="fa-solid fa-times-circle mr-2"></i>
                    Todos tus datos serán eliminados
                  </p>
                  <p className="flex items-center text-red-700">
                    <i className="fa-solid fa-times-circle mr-2"></i>
                    Todos tus PDFs se perderán
                  </p>
                  <p className="flex items-center text-red-700">
                    <i className="fa-solid fa-times-circle mr-2"></i>
                    No podrás recuperar tu cuenta
                  </p>
                  <p className="flex items-center text-red-700">
                    <i className="fa-solid fa-times-circle mr-2"></i>
                    Se cancelará tu suscripción inmediatamente
                  </p>
                </div>
                
                <div className="mt-4 bg-yellow-50 border border-yellow-300 rounded-lg p-3">
                  <p className="text-sm text-yellow-800 font-medium">
                    <i className="fa-solid fa-triangle-exclamation mr-2"></i>
                    ¿Estás completamente seguro de que deseas continuar?
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
                >
                  No, Volver
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-bold"
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="fa-solid fa-spinner fa-spin"></i>
                      Eliminando...
                    </span>
                  ) : (
                    'Sí, Eliminar Todo'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
