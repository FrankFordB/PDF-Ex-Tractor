import UserProfile from './UserProfile'
import { useAuth } from '../contexts/AuthContext'

export default function Header({ onAddField, fields, onShowLogin, onShowRegister, onShowUpgrade, onShowSettings, onShowAdmin }) {
  const { user, isAdmin } = useAuth()

return (
<header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded shadow">
<div className="w-full sm:w-auto">
<h1 className="text-xl sm:text-2xl font-bold">PDF Ex-Tractor</h1>
<p className="text-xs sm:text-sm text-gray-500">Subí tus facturas y extrae campos</p>
<p className="text-xs sm:text-sm text-gray-600">by Franco Burgoa</p>
</div>


<div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-stretch sm:items-center">
{isAdmin() && user && (
  <button 
    onClick={onShowAdmin}
    className="w-full sm:w-auto px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded text-xs sm:text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
  >
    <i className="fa-solid fa-shield-halved"></i>
    Admin
  </button>
)}
{user ? (
  <UserProfile onShowUpgrade={onShowUpgrade} onShowSettings={onShowSettings} />
) : (
  <>
    <button 
      onClick={onShowLogin}
      className="w-full sm:w-auto px-3 py-2 bg-blue-600 text-white rounded text-xs sm:text-sm font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
    >
      <i className="fa-solid fa-sign-in-alt"></i>
      Iniciar Sesión
    </button>
    <button 
      onClick={onShowRegister}
      className="w-full sm:w-auto px-3 py-2 bg-purple-600 text-white rounded text-xs sm:text-sm font-medium hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
    >
      <i className="fa-solid fa-user-plus"></i>
      Registrarse
    </button>
  </>
)}
</div>
</header>
)
}