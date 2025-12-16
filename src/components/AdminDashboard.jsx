import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import ConfirmModal from './ConfirmModal'

export default function AdminDashboard({ onClose }) {
  const { getAllUsers, updateUserSubscription, updateUserRole, setPremiumDays, cancelPremium, deleteUser, updateUserProfileByAdmin, createUserByAdmin, isAdmin, isSuperAdmin, getPremiumNotifications, markNotificationAsRead, removePremiumGrantedByAdmin } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, free, premium
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })
  const [editingUser, setEditingUser] = useState(null)
  const [premiumDaysInput, setPremiumDaysInput] = useState(30)
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [editingProfile, setEditingProfile] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [activeTab, setActiveTab] = useState('users') // users o notifications
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, type: 'warning' })

  useEffect(() => {
    loadUsers()
    if (isSuperAdmin()) {
      loadNotifications()
    }
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    const result = await getAllUsers()
    if (result.success) {
      setUsers(result.users)
    } else {
      setMessage({ type: 'error', text: result.error })
    }
    setLoading(false)
  }

  const loadNotifications = async () => {
    console.log('🔔 Cargando notificaciones...')
    const result = await getPremiumNotifications()
    console.log('📬 Resultado notificaciones:', result)
    if (result.success) {
      setNotifications(result.notifications)
      console.log(`✅ ${result.notifications.length} notificaciones cargadas`)
    } else {
      console.error('❌ Error cargando notificaciones:', result.error)
      setMessage({ type: 'error', text: `Error cargando notificaciones: ${result.error}` })
    }
  }

  const handleUpdateSubscription = async (userId, newType) => {
    // Si se está actualizando a premium, abrir modal para configurar días
    if (newType === 'premium') {
      const userToEdit = users.find(u => u.id === userId)
      setEditingUser(userToEdit)
      return
    }
    
    const result = await updateUserSubscription(userId, newType)
    if (result.success) {
      setMessage({ type: 'success', text: '✅ Suscripción actualizada' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      loadUsers()
    } else {
      setMessage({ type: 'error', text: `❌ Error: ${result.error}` })
    }
  }

  const handleUpdateRole = async (userId, newRole) => {
    const result = await updateUserRole(userId, newRole)
    if (result.success) {
      let successMessage = '✅ Rol actualizado'
      
      if (newRole === 'admin') {
        successMessage = '✅ Usuario promovido a ADMIN con Premium de por vida 🛡️'
      } else if (newRole === 'reina') {
        successMessage = '✅ Usuario promovido a REINA con Premium de por vida 👑'
      } else if (newRole === 'usuario' || newRole === 'user') {
        successMessage = '⚠️ Usuario cambiado a ROL NORMAL - Premium y privilegios removidos'
      }
      
      setMessage({ type: 'success', text: successMessage })
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
      loadUsers()
    } else {
      setMessage({ type: 'error', text: `❌ Error: ${result.error}` })
    }
  }

  const handleSetPremiumDays = async (userId, days) => {
    const result = await setPremiumDays(userId, days)
    if (result.success) {
      setMessage({ type: 'success', text: `✅ Premium asignado por ${days} días` })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      setEditingUser(null)
      loadUsers()
    } else {
      setMessage({ type: 'error', text: `❌ Error: ${result.error}` })
    }
  }

  const handleCancelPremium = async (userId) => {
    setConfirmModal({
      isOpen: true,
      title: '¿Cancelar Premium?',
      message: '¿Estás seguro de que deseas cancelar el premium de este usuario?\n\nEl usuario volverá al plan gratuito inmediatamente.',
      type: 'warning',
      onConfirm: () => {
        setConfirmModal({ ...confirmModal, isOpen: false })
        executeCancelPremium(userId)
      }
    })
  }

  const executeCancelPremium = async (userId) => {
    
    const result = await cancelPremium(userId)
    if (result.success) {
      setMessage({ type: 'success', text: '✅ Premium cancelado' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      loadUsers()
    } else {
      setMessage({ type: 'error', text: `❌ Error: ${result.error}` })
    }
  }

  const handleDeleteUser = async (userId) => {
    setConfirmModal({
      isOpen: true,
      title: '⚠️ Eliminar Usuario',
      message: '¿Estás SEGURO de eliminar este usuario?\n\n⚠️ ADVERTENCIA: Esta acción NO se puede deshacer.\n\nSe eliminarán todos sus datos permanentemente.',
      type: 'error',
      onConfirm: () => {
        setConfirmModal({ ...confirmModal, isOpen: false })
        executeDeleteUser(userId)
      }
    })
  }

  const executeDeleteUser = async (userId) => {
    
    const result = await deleteUser(userId)
    if (result.success) {
      setMessage({ type: 'success', text: '✅ Usuario eliminado' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      loadUsers()
    } else {
      setMessage({ type: 'error', text: `❌ Error: ${result.error}` })
    }
  }

  const handleUpdateProfile = async (userId, profileData) => {
    const result = await updateUserProfileByAdmin(userId, profileData)
    if (result.success) {
      setMessage({ type: 'success', text: '✅ Perfil actualizado' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      setEditingProfile(null)
      loadUsers()
    } else {
      setMessage({ type: 'error', text: `❌ Error: ${result.error}` })
    }
  }

  const handleCreateUser = async (userData) => {
    const result = await createUserByAdmin(userData)
    if (result.success) {
      setMessage({ type: 'success', text: '✅ Usuario creado exitosamente' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      setShowCreateUser(false)
      loadUsers()
    } else {
      setMessage({ type: 'error', text: `❌ Error: ${result.error}` })
    }
  }

  const handleRemovePremium = async (userId, notificationId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Remover Premium',
      message: '¿Deseas remover el premium otorgado por admin/reina a este usuario?\n\nEl usuario perderá inmediatamente sus beneficios premium.',
      type: 'warning',
      onConfirm: () => {
        setConfirmModal({ ...confirmModal, isOpen: false })
        executeRemovePremium(userId, notificationId)
      }
    })
  }

  const executeRemovePremium = async (userId, notificationId) => {
    
    const result = await removePremiumGrantedByAdmin(userId, notificationId)
    if (result.success) {
      setMessage({ type: 'success', text: '✅ Premium removido exitosamente' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      loadUsers()
      loadNotifications()
    } else {
      setMessage({ type: 'error', text: `❌ Error: ${result.error}` })
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    await markNotificationAsRead(notificationId)
    loadNotifications()
  }

  const handleDeleteNotification = async (notificationId) => {
    setConfirmModal({
      isOpen: true,
      title: 'Eliminar Notificación',
      message: '¿Estás seguro de eliminar esta notificación?\n\nEsta acción no se puede deshacer.',
      type: 'warning',
      onConfirm: () => {
        setConfirmModal({ ...confirmModal, isOpen: false })
        executeDeleteNotification(notificationId)
      }
    })
  }

  const executeDeleteNotification = async (notificationId) => {
    
    try {
      // Importar deleteDoc desde firebase/firestore si no está ya
      const { deleteDoc, doc } = await import('firebase/firestore')
      const { db } = await import('../config/firebase')
      
      await deleteDoc(doc(db, 'premiumNotifications', notificationId))
      setMessage({ type: 'success', text: '✅ Notificación eliminada' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      loadNotifications()
    } catch (error) {
      console.error('Error eliminando notificación:', error)
      setMessage({ type: 'error', text: `❌ Error: ${error.message}` })
    }
  }

  const getRemainingDays = (endDate) => {
    if (!endDate) return null
    const end = new Date(endDate)
    const now = new Date()
    const diff = end - now
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }

  const filteredUsers = (users || []).filter(u => {
    const matchesFilter = filter === 'all' || u.accountType === filter
    const matchesSearch = 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: (users || []).length,
    free: (users || []).filter(u => u.accountType === 'free').length,
    premium: (users || []).filter(u => u.accountType === 'premium').length,
    revenue: (users || []).filter(u => u.accountType === 'premium').length * 9200 // ARS por mes
  }

  if (!isAdmin()) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-8 max-w-md">
          <div className="text-center">
            <i className="fa-solid fa-ban text-red-600 text-6xl mb-4"></i>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
            <p className="text-gray-600 mb-6">No tienes permisos de administrador.</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full my-8">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                <i className="fa-solid fa-shield-halved mr-3"></i>
                Panel de Administración
              </h2>
              <p className="text-blue-100">Gestión de usuarios y suscripciones</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 w-10 h-10 rounded-full transition-colors"
            >
              <i className="fa-solid fa-times text-2xl"></i>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="p-6 bg-gray-50 border-b">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Usuarios</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-users text-blue-600 text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Usuarios Free</p>
                  <p className="text-3xl font-bold text-gray-700">{stats.free}</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-user text-gray-600 text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Usuarios Premium</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.premium}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-crown text-yellow-600 text-xl"></i>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Ingresos/Mes</p>
                  <p className="text-2xl font-bold text-green-600">${stats.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">ARS</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-dollar-sign text-green-600 text-xl"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 bg-white border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setShowCreateUser(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors whitespace-nowrap font-medium"
                >
                  <i className="fa-solid fa-plus mr-2"></i>
                  Nuevo Usuario
                </button>
                
                {/* Botones de Pestañas - Solo para Super Admin */}
                {isSuperAdmin() && (
                  <>
                    <button
                      onClick={() => setActiveTab('users')}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        activeTab === 'users'
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <i className="fa-solid fa-users mr-2"></i>
                      Control de Usuarios
                    </button>
                    <button
                      onClick={() => setActiveTab('notifications')}
                      className={`relative px-4 py-2 rounded-lg font-medium transition-all ${
                        activeTab === 'notifications'
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <i className="fa-solid fa-bell mr-2"></i>
                      Notificaciones
                      {notifications.filter(n => !n.read).length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                          {notifications.filter(n => !n.read).length}
                        </span>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Todos ({stats.total})
              </button>
              <button
                onClick={() => setFilter('free')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'free'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Free ({stats.free})
              </button>
              <button
                onClick={() => setFilter('premium')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'premium'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Premium ({stats.premium})
              </button>
            </div>
          </div>

          {message.text && (
            <div className={`mt-4 p-3 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message.text}
            </div>
          )}
        </div>

        {/* Contenido Central - Cambia según la pestaña activa */}
        {activeTab === 'users' ? (
          <div className="p-6 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="text-center py-12">
              <i className="fa-solid fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
              <p className="text-gray-600">Cargando usuarios...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <i className="fa-solid fa-inbox text-gray-400 text-6xl mb-4"></i>
              <p className="text-gray-600">No se encontraron usuarios</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Usuario</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ubicación</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Plan</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">PDFs</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Registro</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            {user.role && (
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                user.role === 'reina' ? 'bg-pink-100 text-pink-700' :
                                'bg-gray-100 text-gray-600'
                              }`}>
                                {user.role === 'reina' ? '👑 Reina' : user.role === 'admin' ? '🛡️ Admin' : user.role}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-700">{user.city}, {user.state}</p>
                        <p className="text-xs text-gray-500">{user.country}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            user.accountType === 'premium'
                              ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                              : 'bg-gray-200 text-gray-700'
                          }`}>
                            {user.accountType === 'premium' ? (
                              <>
                                <i className="fa-solid fa-crown mr-1"></i>
                                Premium
                              </>
                            ) : (
                              'Free'
                            )}
                          </span>
                          {user.accountType === 'premium' && user.subscriptionEndDate && (
                            <p className="text-xs text-gray-600">
                              {getRemainingDays(user.subscriptionEndDate)} días restantes
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-700">{user.pdfUploaded || 0} / {user.maxPdfLimit}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString('es-AR')}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-2">
                          {/* Gestión de Plan */}
                          <div className="flex gap-1">
                            {user.accountType === 'free' ? (
                              <button
                                onClick={() => handleUpdateSubscription(user.id, 'premium')}
                                className="px-2 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-xs rounded transition-colors"
                                title="Actualizar a Premium"
                              >
                                <i className="fa-solid fa-arrow-up mr-1"></i>
                                Premium
                              </button>
                            ) : (
                              <button
                                onClick={() => handleCancelPremium(user.id)}
                                className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors"
                                title="Cancelar Premium y quitar días"
                              >
                                <i className="fa-solid fa-times mr-1"></i>
                                Cancelar
                              </button>
                            )}
                            <button
                              onClick={() => setEditingUser(user)}
                              className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors"
                              title="Configurar días de premium"
                            >
                              <i className="fa-solid fa-calendar mr-1"></i>
                              Días
                            </button>
                            <button
                              onClick={() => setEditingProfile(user)}
                              className="px-2 py-1 bg-purple-500 hover:bg-purple-600 text-white text-xs rounded transition-colors"
                              title="Editar perfil completo"
                            >
                              <i className="fa-solid fa-edit mr-1"></i>
                              Editar
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="px-2 py-1 bg-gray-700 hover:bg-gray-800 text-white text-xs rounded transition-colors"
                              title="Eliminar usuario"
                            >
                              <i className="fa-solid fa-trash mr-1"></i>
                            </button>
                          </div>
                          
                          {/* Gestión de Roles - Solo Super Admin */}
                          <select
                            value={user.role || 'user'}
                            onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                            disabled={!isSuperAdmin()}
                            className={`text-xs px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 ${!isSuperAdmin() ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
                            title={!isSuperAdmin() ? 'Solo el Super Admin puede cambiar roles' : 'Cambiar rol del usuario'}
                          >
                            <option value="user">👤 Usuario</option>
                            <option value="admin">🛡️ Admin</option>
                            <option value="reina">👑 Reina</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        ) : (
          <div className="p-6 max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <i className="fa-solid fa-inbox text-6xl text-gray-300 mb-4"></i>
                <p className="text-xl text-gray-500 font-medium">No hay notificaciones</p>
                <p className="text-gray-400 mt-2">Aquí aparecerán cuando Admin o Reina otorguen premium</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notif) => {
                  // Función helper para obtener el icono y color según el tipo
                  const getNotificationStyle = () => {
                    switch(notif.type) {
                      case 'premium_granted':
                        return {
                          icon: '✨',
                          borderColor: 'border-green-500',
                          bgColor: 'bg-green-50',
                          title: 'Premium Otorgado'
                        }
                      case 'premium_cancelled':
                        return {
                          icon: '❌',
                          borderColor: 'border-red-500',
                          bgColor: 'bg-red-50',
                          title: 'Premium Cancelado'
                        }
                      case 'role_changed':
                        return {
                          icon: '🔄',
                          borderColor: 'border-blue-500',
                          bgColor: 'bg-blue-50',
                          title: 'Rol Modificado'
                        }
                      case 'profile_modified':
                        return {
                          icon: '✏️',
                          borderColor: 'border-yellow-500',
                          bgColor: 'bg-yellow-50',
                          title: 'Perfil Modificado'
                        }
                      default:
                        return {
                          icon: '📋',
                          borderColor: 'border-gray-500',
                          bgColor: 'bg-gray-50',
                          title: 'Notificación'
                        }
                    }
                  }

                  const style = getNotificationStyle()
                  const actionBy = notif.actionByRole || notif.grantedByRole

                  return (
                    <div
                      key={notif.id}
                      className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${
                        notif.read 
                          ? 'border-gray-300' 
                          : style.borderColor + ' shadow-md'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-3xl">{style.icon}</span>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-lg text-gray-900">
                                  {style.title}
                                </span>
                                {!notif.read && (
                                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-bold animate-pulse">
                                    NUEVO
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-gray-500">
                                {actionBy === 'reina' ? '👑' : actionBy === 'super_admin' ? '⭐' : '🛡️'} 
                                {' '}{notif.actionByName || notif.grantedByName} - {notif.actionByEmail || notif.grantedByEmail}
                              </span>
                            </div>
                          </div>
                          
                          <div className={`${style.bgColor} rounded-lg p-4 space-y-2`}>
                            {/* Información del usuario afectado */}
                            <p className="flex items-center gap-2">
                              <i className="fa-solid fa-user text-purple-500"></i>
                              <span className="text-gray-600">Usuario afectado:</span>
                              <strong className="text-gray-900">{notif.targetUserName}</strong>
                            </p>
                            <p className="flex items-center gap-2 ml-6">
                              <i className="fa-solid fa-envelope text-blue-500"></i>
                              <span className="text-sm text-gray-600">{notif.targetUserEmail}</span>
                            </p>

                            {/* Contenido específico según el tipo */}
                            {notif.type === 'premium_granted' && (
                              <>
                                <p className="flex items-center gap-2">
                                  <i className="fa-solid fa-calendar text-green-500"></i>
                                  <span className="text-gray-600">Duración:</span>
                                  <strong className="text-green-700">{notif.days} días</strong>
                                </p>
                                <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-200">
                                  <p className="text-sm text-gray-500">
                                    <i className="fa-solid fa-clock mr-1"></i>
                                    Inicio: {new Date(notif.startDate).toLocaleString('es-ES')}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    <i className="fa-solid fa-hourglass-end mr-1"></i>
                                    Vence: {new Date(notif.endDate).toLocaleDateString('es-ES')}
                                  </p>
                                </div>
                              </>
                            )}

                            {notif.type === 'premium_cancelled' && (
                              <p className="flex items-center gap-2">
                                <i className="fa-solid fa-ban text-red-500"></i>
                                <span className="text-gray-600">Premium cancelado</span>
                                <span className="text-sm text-gray-500 ml-auto">
                                  {new Date(notif.createdAt).toLocaleString('es-ES')}
                                </span>
                              </p>
                            )}

                            {notif.type === 'role_changed' && (
                              <>
                                <p className="flex items-center gap-2">
                                  <i className="fa-solid fa-exchange-alt text-blue-500"></i>
                                  <span className="text-gray-600">Rol:</span>
                                  <span className="font-medium text-gray-700">{notif.previousRole}</span>
                                  <span className="text-gray-400">→</span>
                                  <strong className="text-blue-700">{notif.newRole}</strong>
                                </p>
                                {notif.privilegesRemoved && (
                                  <p className="flex items-center gap-2 text-red-600 font-medium">
                                    <i className="fa-solid fa-arrow-down"></i>
                                    Se removieron privilegios de administrador
                                  </p>
                                )}
                                {notif.privilegesGranted && (
                                  <p className="flex items-center gap-2 text-green-600 font-medium">
                                    <i className="fa-solid fa-arrow-up"></i>
                                    Se otorgaron privilegios de administrador
                                  </p>
                                )}
                              </>
                            )}

                            {notif.type === 'profile_modified' && notif.changes && (
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-700">
                                  <i className="fa-solid fa-list text-yellow-500 mr-2"></i>
                                  Cambios realizados:
                                </p>
                                {notif.changes.map((change, idx) => (
                                  <p key={idx} className="text-sm text-gray-600 ml-6">
                                    • {change}
                                  </p>
                                ))}
                              </div>
                            )}

                            {/* Timestamp */}
                            <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-200">
                              <i className="fa-solid fa-clock mr-1"></i>
                              {new Date(notif.createdAt).toLocaleString('es-ES', {
                                dateStyle: 'full',
                                timeStyle: 'short'
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          {!notif.read && (
                            <button
                              onClick={() => handleMarkAsRead(notif.id)}
                              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                              title="Marcar como leída"
                            >
                              <i className="fa-solid fa-check mr-2"></i>
                              Leída
                            </button>
                          )}
                          {notif.type === 'premium_granted' && (
                            <button
                              onClick={() => handleRemovePremium(notif.targetUserId, notif.id)}
                              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                              title="Remover premium"
                            >
                              <i className="fa-solid fa-ban mr-2"></i>
                              Remover
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteNotification(notif.id)}
                            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
                            title="Eliminar notificación"
                          >
                            <i className="fa-solid fa-trash mr-2"></i>
                            Borrar
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Modal para configurar días de premium */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                <i className="fa-solid fa-calendar-days mr-2 text-blue-600"></i>
                Configurar Premium
              </h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Usuario:</p>
                <p className="font-medium text-gray-900">{editingUser.firstName} {editingUser.lastName}</p>
                <p className="text-sm text-gray-600">{editingUser.email}</p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Días de Premium
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={premiumDaysInput}
                  onChange={(e) => setPremiumDaysInput(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="30"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setPremiumDaysInput(7)}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                  >
                    7 días
                  </button>
                  <button
                    onClick={() => setPremiumDaysInput(30)}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                  >
                    30 días
                  </button>
                  <button
                    onClick={() => setPremiumDaysInput(90)}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                  >
                    90 días
                  </button>
                  <button
                    onClick={() => setPremiumDaysInput(365)}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
                  >
                    1 año
                  </button>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleSetPremiumDays(editingUser.id, premiumDaysInput)}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <i className="fa-solid fa-check mr-2"></i>
                  Asignar Premium
                </button>
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para editar perfil completo */}
        {editingProfile && (
          <EditProfileModal
            user={editingProfile}
            onSave={handleUpdateProfile}
            onClose={() => setEditingProfile(null)}
          />
        )}

        {/* Modal para crear nuevo usuario */}
        {showCreateUser && (
          <CreateUserModal
            onSave={handleCreateUser}
            onClose={() => setShowCreateUser(false)}
            isSuperAdmin={isSuperAdmin()}
          />
        )}

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t p-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Mostrando {filteredUsers.length} de {users.length} usuarios
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmación */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        showCancel={true}
      />
    </div>
  )
}

// Modal para editar perfil completo
function EditProfileModal({ user, onSave, onClose }) {
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
    country: user.country || '',
    state: user.state || '',
    city: user.city || '',
    role: user.role || 'usuario', // Importante: mantener el role
    accountType: user.accountType || 'free' // Mantener el accountType
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(user.id, formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          <i className="fa-solid fa-user-edit mr-2 text-purple-600"></i>
          Editar Perfil Completo
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Provincia/Estado</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <i className="fa-solid fa-save mr-2"></i>
              Guardar Cambios
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Modal para crear nuevo usuario
function CreateUserModal({ onSave, onClose, isSuperAdmin }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    state: '',
    city: '',
    accountType: 'free',
    role: 'user'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          <i className="fa-solid fa-user-plus mr-2 text-green-600"></i>
          Crear Nuevo Usuario
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellido <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Provincia/Estado</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Cuenta <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.accountType}
                onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                disabled={!isSuperAdmin}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${!isSuperAdmin ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
                required
                title={!isSuperAdmin ? 'Solo el Super Admin puede asignar roles Admin/Reina' : ''}
              >
                <option value="user">👤 Usuario</option>
                {isSuperAdmin && <option value="admin">🛡️ Admin</option>}
                {isSuperAdmin && <option value="reina">👑 Reina (Premium Auto)</option>}
              </select>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-blue-800">
              <i className="fa-solid fa-info-circle mr-2"></i>
              <strong>Nota:</strong> Si seleccionas el rol "Reina", el usuario automáticamente tendrá Premium de por vida.
            </p>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <i className="fa-solid fa-check mr-2"></i>
              Crear Usuario
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
