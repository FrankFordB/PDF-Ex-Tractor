import { Link } from 'react-router-dom'
import UserProfile from './UserProfile'
import { useAuth } from '../contexts/AuthContext'

export default function Header({ onAddField, fields, onShowLogin, onShowRegister, onShowUpgrade, onShowSettings, onShowAdmin, currentView, onBackToWork }) {
  const { user, isAdmin } = useAuth()

return (
<>
<header className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 backdrop-blur-xl shadow-2xl border-b-2 border-purple-500/30 relative z-[200]">
<div className="container mx-auto px-4 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
<div className="w-full sm:w-auto">
  <Link to="/" className="group">
    <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl group-hover:scale-105 transition-transform">
      📄 PDF Ex-Tractor
    </h1>
  </Link>
  <p className="text-xs sm:text-sm text-purple-200/90">Subí tus facturas y extrae campos automáticamente</p>
  <p className="text-xs text-pink-300/80">by Franco Burgoa</p>
</div>


<div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-stretch sm:items-center">
{/* Botón de volver a zona de trabajo cuando está en admin o settings */}
{user && (currentView === 'admin' || currentView === 'settings') && (
  <button 
    onClick={onBackToWork}
    className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl text-sm font-bold hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-xl"
  >
    <i className="fa-solid fa-file-pdf"></i>
    Zona de Trabajo
  </button>
)}
{/* Botón Admin - Visible cuando está en settings o cuando NO está en admin */}
{isAdmin() && user && currentView !== 'admin' && (
  <button 
    onClick={onShowAdmin}
    className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl text-sm font-bold hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-xl"
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
      className="w-full sm:w-auto px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-xl text-sm font-bold hover:scale-105 transition-all flex items-center justify-center gap-2 border border-white/30"
    >
      <i className="fa-solid fa-sign-in-alt"></i>
      Iniciar Sesión
    </button>
    <button 
      onClick={onShowRegister}
      className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-xl text-sm font-bold hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-xl"
    >
      <i className="fa-solid fa-user-plus"></i>
      Registrarse
    </button>
  </>
)}
</div>
</div>
</header>
</>
)
}