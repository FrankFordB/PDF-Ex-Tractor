import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function LoginModal({ onClose, onSwitchToRegister }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, signInWithGoogle } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      onClose()
    } else {
      // Traducir errores comunes de Firebase
      let errorMessage = result.error || 'Error al iniciar sesión'
      
      if (errorMessage.includes('auth/user-not-found') || errorMessage.includes('auth/invalid-credential')) {
        errorMessage = 'Email o contraseña incorrectos.'
      } else if (errorMessage.includes('auth/wrong-password')) {
        errorMessage = 'Contraseña incorrecta.'
      } else if (errorMessage.includes('auth/invalid-email')) {
        errorMessage = 'El formato del email no es válido.'
      } else if (errorMessage.includes('auth/too-many-requests')) {
        errorMessage = 'Demasiados intentos fallidos. Por favor, espera unos minutos e intenta de nuevo.'
      }
      
      setError(errorMessage)
    }
    
    setLoading(false)
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)

    const result = await signInWithGoogle()
    
    if (result.success) {
      onClose()
    } else {
      let errorMessage = result.error || 'Error al iniciar sesión con Google'
      
      if (errorMessage === 'popup-closed') {
        errorMessage = 'Ventana de inicio de sesión cerrada. Por favor, intenta de nuevo.'
      } else if (errorMessage === 'popup-cancelled') {
        errorMessage = 'Inicio de sesión cancelado.'
      } else if (errorMessage.includes('auth/popup-blocked')) {
        errorMessage = 'El navegador bloqueó la ventana emergente. Por favor, permite las ventanas emergentes e intenta de nuevo.'
      }
      
      setError(errorMessage)
    }
    
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <i className="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold rounded-lg transition-all"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
        <div className="mt-6 mb-6 flex items-center">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">o</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 border-2 border-gray-300 hover:border-gray-400 disabled:border-gray-200 disabled:opacity-50 text-gray-700 font-semibold rounded-lg transition-colors flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Iniciando...' : 'Continuar con Google'}
        </button>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
