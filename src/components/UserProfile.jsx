import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ConfirmModal from './ConfirmModal'

export default function UserProfile({ onShowUpgrade, onShowSettings, onNavigate }) {
  const [showMenu, setShowMenu] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const { user, userData, logout, getRemainingUploads } = useAuth()

  const handleLogoutClick = () => {
    setShowMenu(false)
    setShowLogoutConfirm(true)
  }

  const handleLogoutConfirm = async () => {
    await logout()
    setShowLogoutConfirm(false)
  }

  const remaining = getRemainingUploads()
  const isSuperAdmin = user?.email === 'franco_burgoa1@hotmail.com'
  const isAdmin = userData?.role === 'admin'
  const isPremium = isSuperAdmin || isAdmin || userData?.role === 'reina' || userData?.accountType === 'premium'
  const isReina = userData?.role === 'reina'
  const isPremiumGift = userData?.premiumGrantedBy === 'admin'

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-400/40 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
          {userData?.firstName?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-white">
            {userData?.firstName} {userData?.lastName}
          </div>
          <div className="text-xs text-purple-200">
            {isSuperAdmin ? (
              <span className="flex items-center gap-1 text-yellow-300 font-semibold">
                <i className="fa-solid fa-shield-halved"></i>
                <span>Super Admin</span>
              </span>
            ) : isAdmin ? (
              <span className="flex items-center gap-1 text-cyan-300 font-semibold">
                <i className="fa-solid fa-user-shield"></i>
                <span>Admin</span>
              </span>
            ) : isReina ? (
              <span className="flex items-center gap-1 text-pink-300 font-semibold">
                👑 Reina
              </span>
            ) : isPremium ? (
              <span className="flex items-center gap-1 text-yellow-300">
                {isPremiumGift ? (
                  <>
                    <i className="fa-solid fa-star text-yellow-300"></i>
                    <span>Premium (Regalo)</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-crown text-yellow-300"></i>
                    <span>Premium</span>
                  </>
                )}
              </span>
            ) : (
              <span className="text-purple-100">Cuenta Gratuita</span>
            )}
          </div>
        </div>
        <i className="fa-solid fa-chevron-down text-purple-200 text-xs"></i>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-[100]"
            onClick={() => setShowMenu(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-[110]">
            <div className="p-4 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">
                {userData?.email}
              </p>
              {!isSuperAdmin && !isAdmin && !isPremium && !isReina && (
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

            {!isSuperAdmin && !isAdmin && !isPremium && !isReina && (
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

            {/* Sección Blog */}
            <div className="border-b border-gray-200">
              <div className="px-4 py-2 bg-gray-50">
                <span className="text-xs font-semibold text-gray-500 uppercase">Navegación</span>
              </div>
              <button
                onClick={() => {
                  setShowMenu(false)
                  onNavigate && onNavigate('ayuda')
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
              >
                <i className="fa-solid fa-circle-question text-blue-600"></i>
                <span className="text-gray-700">Ayuda y Tutorial</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false)
                  onNavigate && onNavigate('blog')
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
              >
                <i className="fa-solid fa-blog text-gray-500"></i>
                <span className="text-gray-700">Artículos</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false)
                  onNavigate && onNavigate('tutoriales')
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
              >
                <i className="fa-solid fa-graduation-cap text-purple-600"></i>
                <span className="text-gray-700">Tutoriales</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false)
                  onNavigate && onNavigate('casos-exito')
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
              >
                <i className="fa-solid fa-trophy text-yellow-600"></i>
                <span className="text-gray-700">Casos de Éxito</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false)
                  onNavigate && onNavigate('recursos')
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
              >
                <i className="fa-solid fa-book text-orange-600"></i>
                <span className="text-gray-700">Recursos</span>
              </button>
              <button
                onClick={() => {
                  setShowMenu(false)
                  onNavigate && onNavigate('acerca')
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
              >
                <i className="fa-solid fa-circle-info text-blue-600"></i>
                <span className="text-gray-700">Acerca de</span>
              </button>
            </div>

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

            <div className="px-4 py-3 flex justify-center">
              <button
                onClick={handleLogoutClick}
                className="px-8 py-1.5 hover:bg-red-50 transition-colors flex items-center gap-2 text-red-600 text-sm rounded-lg border border-red-200 hover:border-red-300 min-w-[160px] justify-center"
              >
                <i className="fa-solid fa-sign-out-alt"></i>
                <span className="font-medium">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal de confirmación de cierre de sesión */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Cerrar Sesión"
        message={`¿Estás seguro que deseas cerrar sesión, ${userData?.firstName}?`}
        type="warning"
        confirmText="Sí, cerrar sesión"
        cancelText="Cancelar"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  )
}
