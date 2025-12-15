import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function UserProfile({ onShowUpgrade, onShowSettings }) {
  const [showMenu, setShowMenu] = useState(false)
  const { user, userData, logout, getRemainingUploads } = useAuth()

  const handleLogout = async () => {
    await logout()
    setShowMenu(false)
  }

  const remaining = getRemainingUploads()
  const isSuperAdmin = user?.email === 'franco_burgoa1@hotmail.com'
  const isPremium = isSuperAdmin || userData?.accountType === 'premium'
  const isReina = userData?.role === 'reina'
  const isPremiumGift = userData?.premiumGrantedBy === 'admin'

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
          {userData?.firstName?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-gray-900">
            {userData?.firstName} {userData?.lastName}
          </div>
          <div className="text-xs text-gray-500">
            {isSuperAdmin ? (
              <span className="flex items-center gap-1 text-purple-600 font-semibold">
                <i className="fa-solid fa-shield-halved"></i>
                <span>Super Admin</span>
              </span>
            ) : isReina ? (
              <span className="flex items-center gap-1 text-pink-600 font-semibold">
                👑 Reina
              </span>
            ) : isPremium ? (
              <span className="flex items-center gap-1">
                {isPremiumGift ? (
                  <>
                    <i className="fa-solid fa-star text-red-500"></i>
                    <span>Premium (Regalo)</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-crown text-yellow-500"></i>
                    <span>Premium</span>
                  </>
                )}
              </span>
            ) : (
              <span>Cuenta Gratuita</span>
            )}
          </div>
        </div>
        <i className="fa-solid fa-chevron-down text-gray-400 text-xs"></i>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-4 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">
                {userData?.email}
              </p>
              {!isSuperAdmin && !isPremium && !isReina && (
                <div className="mt-2 text-xs text-gray-600">
                  <i className="fa-solid fa-file-pdf mr-1"></i>
                  {remaining !== null && remaining >= 0 ? (
                    <span>{remaining} PDFs restantes</span>
                  ) : (
                    <span>4 PDFs disponibles</span>
                  )}
                </div>
              )}
            </div>

            {!isSuperAdmin && !isPremium && !isReina && (
              <button
                onClick={() => {
                  setShowMenu(false)
                  onShowUpgrade()
                }}
                className="w-full px-4 py-3 text-left hover:bg-yellow-50 transition-colors flex items-center gap-2 border-b border-gray-200"
              >
                <i className="fa-solid fa-crown text-yellow-500"></i>
                <span className="font-medium text-gray-900">
                  Actualizar a Premium
                </span>
              </button>
            )}

            <button
              onClick={() => {
                setShowMenu(false)
                onShowSettings()
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 border-b border-gray-200"
            >
              <i className="fa-solid fa-cog text-gray-600"></i>
              <span className="font-medium text-gray-900">Configuración</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-red-600"
            >
              <i className="fa-solid fa-sign-out-alt"></i>
              <span className="font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
