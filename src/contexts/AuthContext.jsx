import { createContext, useContext, useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, increment, collection, addDoc, getDocs, query, where, deleteDoc, orderBy, limit as firestoreLimit } from 'firebase/firestore'
import { auth, db } from '../config/firebase'
import { getFunctions, httpsCallable } from 'firebase/functions'

const functions = getFunctions()

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [userInvoices, setUserInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        // Cargar datos del usuario desde Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        
        if (userDoc.exists()) {
          setUserData(userDoc.data())
          // Cargar facturas del usuario
          await loadUserInvoices(firebaseUser.uid)
        } else {
          // Usuario eliminado: tiene cuenta de Auth pero no datos en Firestore
          console.warn('⚠️ Usuario eliminado detectado - cerrando sesión')
          console.log('🔒 El usuario tiene cuenta de Authentication pero no documento en Firestore')
          console.log('🚪 Cerrando sesión automáticamente...')
          
          // Cerrar sesión automáticamente
          await signOut(auth)
          setUserData(null)
          setUserInvoices([])
          
          // Opcional: Mostrar mensaje al usuario
          alert('Tu cuenta ha sido eliminada. No puedes acceder al sistema.')
        }
      } else {
        setUserData(null)
        setUserInvoices([])
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const loadUserInvoices = async (userId) => {
    try {
      // Consulta sin orderBy para no requerir índice compuesto
      const q = query(
        collection(db, 'invoices'),
        where('userId', '==', userId)
      )
      const querySnapshot = await getDocs(q)
      const invoices = []
      querySnapshot.forEach((doc) => {
        invoices.push({ id: doc.id, ...doc.data() })
      })
      
      // Ordenar en el cliente por createdAt descendente
      invoices.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0)
        const dateB = new Date(b.createdAt || 0)
        return dateB - dateA // Más reciente primero
      })
      
      setUserInvoices(invoices)
      console.log(`✅ Cargadas ${invoices.length} facturas para usuario ${userId}`)
      return invoices
    } catch (error) {
      console.error('Error cargando facturas:', error)
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      // Si el error es por índice faltante, Firestore mostrará un enlace para crearlo
      if (error.code === 'failed-precondition' || error.message?.includes('index')) {
        console.error('⚠️ Puede que necesites crear un índice compuesto en Firestore Console')
        console.error('El enlace para crearlo aparecerá en la consola del navegador')
      }
      return []
    }
  }

  const register = async (email, password, profileData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Crear documento de usuario en Firestore
      const now = new Date()
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        country: profileData.country,
        state: profileData.state,
        city: profileData.city,
        phone: profileData.phone || '',
        accountType: 'free', // 'free' o 'premium'
        pdfUploaded: 0,
        maxPdfLimit: 5, // Gratuito: 5 PDFs por semana
        weekStartDate: now.toISOString(), // Fecha de inicio de la semana actual
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      })

      return { success: true }
    } catch (error) {
      console.error('Error en registro:', error)
      return { success: false, error: error.message }
    }
  }

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user
      
      // Verificar si el usuario tiene documento en Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      
      if (!userDoc.exists()) {
        // Usuario eliminado: cerrar sesión inmediatamente
        await signOut(auth)
        console.warn('⚠️ Intento de login de usuario eliminado')
        return { 
          success: false, 
          error: 'Esta cuenta ha sido eliminada. Contacta al administrador si crees que es un error.' 
        }
      }
      
      return { success: true }
    } catch (error) {
      console.error('Error en login:', error)
      return { success: false, error: error.message }
    }
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: 'select_account'
      })
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Verificar si el usuario ya existe en Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      
      if (!userDoc.exists()) {
        // Verificar si es una cuenta eliminada intentando re-registrarse
        // En ese caso, permitir crear un nuevo documento
        
        // Crear documento de usuario en Firestore para nuevos usuarios de Google
        const nameParts = user.displayName ? user.displayName.split(' ') : ['', '']
        const now = new Date()
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          country: '',
          state: '',
          city: '',
          phone: user.phoneNumber || '',
          accountType: 'free',
          pdfUploaded: 0,
          maxPdfLimit: 5, // 5 PDFs por semana
          weekStartDate: now.toISOString(), // Fecha de inicio de la semana actual
          createdAt: now.toISOString(),
          updatedAt: now.toISOString()
        })
      }

      return { success: true }
    } catch (error) {
      console.error('Error en login con Google:', error)
      // Manejar errores específicos
      if (error.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'popup-closed' }
      }
      if (error.code === 'auth/cancelled-popup-request') {
        return { success: false, error: 'popup-cancelled' }
      }
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setUserData(null)
      return { success: true }
    } catch (error) {
      console.error('Error en logout:', error)
      return { success: false, error: error.message }
    }
  }

  const incrementPdfCount = async (currentCount = null) => {
    if (!user) return
    try {
      const now = new Date()
      const weekStartDate = userData?.weekStartDate ? new Date(userData.weekStartDate) : now
      const daysSinceWeekStart = (now - weekStartDate) / (1000 * 60 * 60 * 24)
      
      // Usar el contador proporcionado o el de userData
      const actualCurrentCount = currentCount !== null ? currentCount : (userData?.pdfUploaded || 0)
      
      // Si han pasado 7 días o más, resetear el contador
      if (daysSinceWeekStart >= 7) {
        await setDoc(doc(db, 'users', user.uid), {
          pdfUploaded: 1, // Resetear a 1 (el PDF actual)
          weekStartDate: now.toISOString(), // Nueva semana
          updatedAt: now.toISOString()
        }, { merge: true })
        // Actualizar estado local inmediatamente
        setUserData(prev => ({
          ...prev,
          pdfUploaded: 1,
          weekStartDate: now.toISOString(),
          updatedAt: now.toISOString()
        }))
        console.log('✅ Contador reseteado a 1 (nueva semana)')
        return 1
      } else {
        // Incrementar normalmente usando el contador actual proporcionado
        const newCount = actualCurrentCount + 1
        await setDoc(doc(db, 'users', user.uid), {
          pdfUploaded: newCount,
          updatedAt: now.toISOString()
        }, { merge: true })
        // Actualizar estado local inmediatamente
        setUserData(prev => ({
          ...prev,
          pdfUploaded: newCount,
          updatedAt: now.toISOString()
        }))
        console.log(`✅ Firestore actualizado a ${newCount}`)
        return newCount
      }
    } catch (error) {
      console.error('Error incrementando contador:', error)
      return null
    }
  }

  const upgradeToPremium = async () => {
    if (!user) return { success: false, error: 'No user logged in' }
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        accountType: 'premium',
        maxPdfLimit: -1, // -1 significa ilimitado
        upgradedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      // Actualizar estado local
      setUserData(prev => ({
        ...prev,
        accountType: 'premium',
        maxPdfLimit: -1
      }))
      return { success: true }
    } catch (error) {
      console.error('Error upgrading to premium:', error)
      return { success: false, error: error.message }
    }
  }

  const updateUserRole = async (userId, role) => {
    // Solo el super admin puede cambiar roles
    if (!isSuperAdmin()) return { success: false, error: 'Solo el super administrador puede cambiar roles' }
    
    try {
      const userRef = doc(db, 'users', userId)
      const targetUserDoc = await getDoc(userRef)
      const targetUserData = targetUserDoc.data()
      const previousRole = targetUserData?.role
      
      const updateData = {
        role: role,
        updatedAt: new Date().toISOString()
      }
      
      // Si el rol es reina o admin, automáticamente dar premium permanente
      if (role === 'reina' || role === 'admin') {
        updateData.accountType = 'premium'
        updateData.maxPdfLimit = -1
        updateData.premiumGrantedBy = 'admin'
        updateData.subscriptionEndDate = null // Sin fecha de expiración = permanente
      } else {
        // Si se cambia a usuario normal (no admin/reina), quitar todos los privilegios
        updateData.accountType = 'free'
        updateData.maxPdfLimit = 5
        updateData.premiumGrantedBy = null
        updateData.subscriptionEndDate = null
        updateData.subscriptionDate = null
      }
      
      await updateDoc(userRef, updateData)
      
      // Crear notificación si el rol cambió (solo cuando es el super admin quien lo hace, como autolog)
      if (previousRole !== role) {
        const now = new Date()
        const wasPrivileged = previousRole === 'admin' || previousRole === 'reina'
        const isPrivileged = role === 'admin' || role === 'reina'
        const notificationRef = collection(db, 'premiumNotifications')
        
        await addDoc(notificationRef, {
          type: 'role_changed',
          actionByUserId: user.uid,
          actionByEmail: user.email,
          actionByRole: 'super_admin',
          actionByName: `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || user.email,
          targetUserId: userId,
          targetUserEmail: targetUserData?.email || '',
          targetUserName: `${targetUserData?.firstName || ''} ${targetUserData?.lastName || ''}`.trim() || targetUserData?.email,
          previousRole: previousRole || 'user',
          newRole: role,
          privilegesRemoved: wasPrivileged && !isPrivileged,
          privilegesGranted: !wasPrivileged && isPrivileged,
          createdAt: now.toISOString(),
          read: false,
          active: true
        })
        console.log('📧 Notificación de cambio de rol enviada')
      }
      
      return { success: true, role }
    } catch (error) {
      console.error('Error updating role:', error)
      return { success: false, error: error.message }
    }
  }

  const setPremiumDays = async (userId, days) => {
    try {
      const userRef = doc(db, 'users', userId)
      const targetUserDoc = await getDoc(userRef)
      const targetUserData = targetUserDoc.data()
      
      const now = new Date()
      const endDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
      
      await updateDoc(userRef, {
        accountType: 'premium',
        maxPdfLimit: -1,
        premiumGrantedBy: userData?.role || 'admin', // Guardar quien otorgó: admin o reina
        premiumGrantedByUserId: user.uid,
        premiumGrantedByEmail: user.email,
        subscriptionDate: now.toISOString(),
        subscriptionEndDate: endDate.toISOString(),
        updatedAt: now.toISOString()
      })
      
      // Si quien otorga NO es el super admin, crear notificación
      if (!isSuperAdmin()) {
        const notificationRef = collection(db, 'premiumNotifications')
        await addDoc(notificationRef, {
          type: 'premium_granted',
          grantedByUserId: user.uid,
          grantedByEmail: user.email,
          grantedByRole: userData?.role || 'admin',
          grantedByName: `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || user.email,
          targetUserId: userId,
          targetUserEmail: targetUserData?.email || '',
          targetUserName: `${targetUserData?.firstName || ''} ${targetUserData?.lastName || ''}`.trim() || targetUserData?.email,
          days: days,
          startDate: now.toISOString(),
          endDate: endDate.toISOString(),
          createdAt: now.toISOString(),
          read: false,
          active: true
        })
        console.log('📧 Notificación enviada al super admin')
      }
      
      return { success: true }
    } catch (error) {
      console.error('Error setting premium days:', error)
      return { success: false, error: error.message }
    }
  }

  const cancelPremium = async (userId) => {
    if (!isAdmin() && user?.uid !== userId) return { success: false, error: 'No autorizado' }
    
    try {
      const userRef = doc(db, 'users', userId)
      const userDoc = await getDoc(userRef)
      const targetUserData = userDoc.data()

      await updateDoc(userRef, {
        accountType: 'free',
        maxPdfLimit: 5,
        premiumGrantedBy: null,
        subscriptionDate: null,
        subscriptionEndDate: null,
        cancelledAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      // Notificar al super admin si no es él quien lo hace
      if (!isSuperAdmin()) {
        const now = new Date()
        const notificationRef = collection(db, 'premiumNotifications')
        await addDoc(notificationRef, {
          type: 'premium_cancelled',
          actionByUserId: user.uid,
          actionByEmail: user.email,
          actionByRole: userData?.role || 'admin',
          actionByName: `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || user.email,
          targetUserId: userId,
          targetUserEmail: targetUserData?.email || '',
          targetUserName: `${targetUserData?.firstName || ''} ${targetUserData?.lastName || ''}`.trim() || targetUserData?.email,
          createdAt: now.toISOString(),
          read: false,
          active: true
        })
        console.log('📧 Notificación de cancelación enviada al super admin')
      }

      // Enviar email de cancelación
      try {
        const sendEmail = httpsCallable(functions, 'sendCancellationEmail')
        await sendEmail({
          userEmail: userData?.email || user?.email,
          userName: `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || 'Usuario'
        })
        console.log('✅ Email de cancelación enviado')
      } catch (emailError) {
        console.warn('⚠️ No se pudo enviar el email de cancelación:', emailError)
        // No falla la cancelación si el email falla
      }

      return { success: true }
    } catch (error) {
      console.error('Error cancelando premium:', error)
      return { success: false, error: error.message }
    }
  }

  const deleteUser = async (userId) => {
    if (!isAdmin()) return { success: false, error: 'No autorizado' }
    
    try {
      console.log(`🗑️ Iniciando eliminación completa del usuario: ${userId}`)
      
      // 1. Obtener datos del usuario antes de borrar
      const userDoc = await getDoc(doc(db, 'users', userId))
      const userData = userDoc.exists() ? userDoc.data() : {}
      const userEmail = userData?.email || 'Email desconocido'
      
      // 2. Borrar todas las facturas/PDFs del usuario
      console.log(`📄 Buscando facturas del usuario...`)
      const invoicesQuery = query(
        collection(db, 'invoices'),
        where('userId', '==', userId)
      )
      const invoicesSnapshot = await getDocs(invoicesQuery)
      
      console.log(`📊 Encontradas ${invoicesSnapshot.size} facturas`)
      
      const deletePromises = []
      invoicesSnapshot.forEach(invoiceDoc => {
        deletePromises.push(deleteDoc(invoiceDoc.ref))
      })
      
      if (deletePromises.length > 0) {
        await Promise.all(deletePromises)
        console.log(`✅ ${invoicesSnapshot.size} facturas eliminadas`)
      }
      
      // 3. Borrar documento del usuario en Firestore
      if (userDoc.exists()) {
        await deleteDoc(doc(db, 'users', userId))
        console.log(`✅ Documento de Firestore eliminado`)
      }
      
      // Nota: La cuenta de Firebase Authentication no se puede borrar desde el cliente
      // por seguridad. Solo se puede borrar con Admin SDK en el backend.
      // Sin embargo, sin el documento en Firestore, el usuario no podrá usar la app.
      
      console.log(`🎉 Usuario ${userEmail} (${userId}) eliminado de Firestore y facturas borradas`)
      console.log(`⚠️ NOTA: La cuenta de Authentication permanece pero no puede acceder sin datos en Firestore`)
      
      return { 
        success: true, 
        message: `Usuario ${userEmail} eliminado completamente`,
        deletedInvoices: invoicesSnapshot.size
      }
    } catch (error) {
      console.error('❌ Error eliminando usuario:', error)
      return { 
        success: false, 
        error: error.message || 'Error al eliminar usuario completamente' 
      }
    }
  }

  const deleteAccount = async () => {
    if (!user) return { success: false, error: 'No autenticado' }
    
    try {
      // 1. Eliminar datos de Firestore
      await deleteDoc(doc(db, 'users', user.uid))
      
      // 2. Eliminar cuenta de autenticación
      await user.delete()
      
      // 3. Cerrar sesión
      await signOut(auth)
      
      return { success: true }
    } catch (error) {
      console.error('Error eliminando cuenta:', error)
      
      // Si el error es de reautenticación requerida
      if (error.code === 'auth/requires-recent-login') {
        return { success: false, error: 'Por seguridad, debes iniciar sesión nuevamente antes de eliminar tu cuenta.' }
      }
      
      return { success: false, error: error.message }
    }
  }

  const updateUserProfileByAdmin = async (userId, profileData) => {
    if (!isAdmin()) return { success: false, error: 'No autorizado' }
    
    // Proteger al super admin de modificaciones por otros admins
    const targetUserRef = doc(db, 'users', userId)
    const targetUserDoc = await getDoc(targetUserRef)
    const targetUserData = targetUserDoc.data()
    
    if (targetUserData?.email === 'franco_burgoa1@hotmail.com' && !isSuperAdmin()) {
      return { success: false, error: '🚫 No puedes modificar al super administrador' }
    }
    
    try {
      // Si el rol es admin o reina, forzar premium permanente
      if (profileData.role === 'admin' || profileData.role === 'reina') {
        profileData.accountType = 'premium'
        profileData.maxPdfLimit = -1
        profileData.premiumGrantedBy = 'admin'
        profileData.subscriptionEndDate = null // Permanente
        profileData.subscriptionDate = null
      } else if (profileData.role === 'usuario' || profileData.role === 'user') {
        // Si se cambia a usuario normal, quitar privilegios si tenía admin/reina
        // Solo si NO especifica explícitamente mantener premium
        if (!profileData.accountType || profileData.accountType === 'premium') {
          profileData.accountType = 'free'
          profileData.maxPdfLimit = 5
          profileData.premiumGrantedBy = null
          profileData.subscriptionEndDate = null
          profileData.subscriptionDate = null
        }
      }
      
      await setDoc(doc(db, 'users', userId), {
        ...profileData,
        updatedAt: new Date().toISOString()
      }, { merge: true })
      
      // Notificar al super admin si no es él quien modifica
      if (!isSuperAdmin()) {
        const now = new Date()
        const notificationRef = collection(db, 'premiumNotifications')
        
        // Determinar qué cambió
        const changes = []
        if (profileData.role && profileData.role !== targetUserData?.role) {
          changes.push(`Rol: ${targetUserData?.role || 'user'} → ${profileData.role}`)
        }
        if (profileData.accountType && profileData.accountType !== targetUserData?.accountType) {
          changes.push(`Cuenta: ${targetUserData?.accountType || 'free'} → ${profileData.accountType}`)
        }
        if (profileData.firstName !== undefined || profileData.lastName !== undefined) {
          changes.push('Información personal')
        }
        
        if (changes.length > 0) {
          await addDoc(notificationRef, {
            type: 'profile_modified',
            actionByUserId: user.uid,
            actionByEmail: user.email,
            actionByRole: userData?.role || 'admin',
            actionByName: `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || user.email,
            targetUserId: userId,
            targetUserEmail: targetUserData?.email || '',
            targetUserName: `${targetUserData?.firstName || ''} ${targetUserData?.lastName || ''}`.trim() || targetUserData?.email,
            changes: changes,
            createdAt: now.toISOString(),
            read: false,
            active: true
          })
          console.log('📧 Notificación de modificación de perfil enviada al super admin')
        }
      }
      
      return { success: true }
    } catch (error) {
      console.error('Error actualizando perfil:', error)
      return { success: false, error: error.message }
    }
  }

  const createUserByAdmin = async (userData) => {
    if (!isAdmin()) return { success: false, error: 'No autorizado' }
    
    try {
      // Validar que se proporcione una contraseña
      if (!userData.password || userData.password.length < 6) {
        return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' }
      }

      // Guardar el usuario admin actual antes de crear el nuevo
      const currentUser = auth.currentUser
      const currentEmail = currentUser?.email
      
      console.log(`👤 Admin actual: ${currentEmail}`)
      console.log(`🆕 Creando nuevo usuario: ${userData.email}`)

      let newUserId = null
      let isRecreatingUser = false

      try {
        // 1. Intentar crear usuario en Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password)
        const newUser = userCredential.user
        newUserId = newUser.uid
        
        console.log(`✅ Usuario creado en Auth: ${newUserId}`)
      } catch (authError) {
        if (authError.code === 'auth/email-already-in-use') {
          // El email ya existe en Auth - podría ser una cuenta eliminada
          console.log(`⚠️ Email ya registrado en Auth, intentando recrear documento...`)
          
          // Intentar iniciar sesión con esas credenciales para obtener el UID
          try {
            const loginResult = await signInWithEmailAndPassword(auth, userData.email, userData.password)
            newUserId = loginResult.user.uid
            isRecreatingUser = true
            console.log(`✅ Cuenta encontrada, UID: ${newUserId}`)
            
            // Verificar si ya tiene documento en Firestore
            const existingDoc = await getDoc(doc(db, 'users', newUserId))
            if (existingDoc.exists()) {
              await signOut(auth)
              return { success: false, error: 'Este usuario ya existe y está activo' }
            }
            
            console.log(`✅ Recreando usuario eliminado...`)
          } catch (loginError) {
            // Las credenciales no coinciden
            await signOut(auth) // Asegurar logout
            return { 
              success: false, 
              error: 'El email ya está registrado con otra contraseña. Usa la contraseña original o elimina la cuenta primero.' 
            }
          }
        } else {
          throw authError // Re-lanzar otros errores
        }
      }
      
      // 2. Crear/Recrear documento en Firestore
      const now = new Date()
      const isPrivilegedRole = userData.role === 'reina' || userData.role === 'admin'
      
      await setDoc(doc(db, 'users', newUserId), {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        country: userData.country || '',
        state: userData.state || '',
        city: userData.city || '',
        phone: userData.phone || '',
        accountType: isPrivilegedRole ? 'premium' : (userData.accountType || 'free'),
        role: userData.role || 'user',
        pdfUploaded: 0,
        maxPdfLimit: isPrivilegedRole ? -1 : (userData.accountType === 'premium' ? -1 : 5),
        premiumGrantedBy: isPrivilegedRole ? 'admin' : (userData.accountType === 'premium' ? 'admin' : null),
        subscriptionEndDate: isPrivilegedRole ? null : (userData.subscriptionEndDate || null),
        weekStartDate: now.toISOString(),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      })
      
      console.log(`✅ Documento ${isRecreatingUser ? 'recreado' : 'creado'} en Firestore`)
      
      // 3. IMPORTANTE: Cerrar sesión del nuevo usuario
      await signOut(auth)
      console.log(`🚪 Sesión del nuevo usuario cerrada`)
      
      // 4. El admin tendrá que volver a loguearse manualmente
      console.log(`⚠️ El admin debe volver a iniciar sesión`)
      
      return { 
        success: true, 
        userId: newUserId,
        requiresRelogin: true,
        message: isRecreatingUser 
          ? 'Usuario recreado exitosamente. Por favor, vuelve a iniciar sesión con tu cuenta de administrador.'
          : 'Usuario creado exitosamente. Por favor, vuelve a iniciar sesión con tu cuenta de administrador.'
      }
    } catch (error) {
      console.error('Error creando usuario:', error)
      let errorMessage = error.message
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'El email ya está registrado'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es muy débil'
      }
      return { success: false, error: errorMessage }
    }
  }

  const canUploadPdf = () => {
    // Sin login: permite 3 PDFs (se maneja en localStorage)
    if (!user) return true // Se controla en App.jsx
    
    // Super admin (franco_burgoa1@hotmail.com): SIEMPRE premium ilimitado
    if (user?.email === 'franco_burgoa1@hotmail.com') return true
    
    // Rol "admin": SIEMPRE tiene premium ilimitado
    if (userData?.role === 'admin') return true
    
    // Rol "reina": SIEMPRE tiene premium ilimitado
    if (userData?.role === 'reina') return true
    
    // Premium: ilimitado
    if (userData?.accountType === 'premium') return true
    
    // Free: verificar límite
    const uploaded = userData?.pdfUploaded || 0
    const limit = userData?.maxPdfLimit || 5
    return uploaded < limit
  }

  const getRemainingUploads = () => {
    if (!user) return null // Se maneja en App.jsx
    if (user?.email === 'franco_burgoa1@hotmail.com') return -1 // Super admin: ilimitado siempre
    if (userData?.role === 'admin') return -1 // Rol admin: ilimitado siempre
    if (userData?.role === 'reina') return -1 // Rol reina: ilimitado siempre
    if (userData?.accountType === 'premium') return -1 // Ilimitado
    
    const uploaded = userData?.pdfUploaded || 0
    const limit = userData?.maxPdfLimit || 5
    return Math.max(0, limit - uploaded)
  }

  const saveInvoice = async (invoiceData) => {
    if (!user) return { success: false, error: 'Usuario no autenticado' }
    
    try {
      console.log('Guardando factura para usuario:', user.uid)
      const docRef = await addDoc(collection(db, 'invoices'), {
        userId: user.uid,
        fileName: invoiceData.fileName,
        extracted: invoiceData.extracted,
        finalText: invoiceData.finalText,
        rawText: invoiceData.rawText || '',
        status: invoiceData.status || 'En proceso',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      
      console.log('Factura guardada con ID:', docRef.id, 'para usuario:', user.uid)
      
      // Actualizar estado local - agregar la factura con el ID de Firestore
      const newInvoice = {
        id: docRef.id,
        userId: user.uid,
        fileName: invoiceData.fileName,
        extracted: invoiceData.extracted,
        finalText: invoiceData.finalText,
        rawText: invoiceData.rawText || '',
        status: invoiceData.status || 'En proceso',
        fileUrl: invoiceData.fileUrl || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setUserInvoices(prev => [newInvoice, ...prev])
      
      return { success: true, id: docRef.id, fileName: invoiceData.fileName }
    } catch (error) {
      console.error('Error guardando factura:', error)
      return { success: false, error: error.message }
    }
  }

  const updateInvoiceStatus = async (invoiceId, newStatus) => {
    if (!user) return { success: false, error: 'Usuario no autenticado' }
    
    try {
      await updateDoc(doc(db, 'invoices', invoiceId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      })
      
      // Actualizar estado local
      setUserInvoices(prev => 
        prev.map(inv => 
          inv.id === invoiceId 
            ? { ...inv, status: newStatus, updatedAt: new Date().toISOString() }
            : inv
        )
      )
      
      return { success: true }
    } catch (error) {
      console.error('Error actualizando estado:', error)
      return { success: false, error: error.message }
    }
  }

  const deleteInvoice = async (invoiceId) => {
    if (!user) return { success: false, error: 'Usuario no autenticado' }
    
    try {
      await deleteDoc(doc(db, 'invoices', invoiceId))
      
      // Actualizar estado local
      setUserInvoices(prev => prev.filter(inv => inv.id !== invoiceId))
      
      return { success: true }
    } catch (error) {
      console.error('Error eliminando factura:', error)
      return { success: false, error: error.message }
    }
  }

  const clearAllInvoices = async () => {
    if (!user) return { success: false, error: 'Usuario no autenticado' }
    
    try {
      const q = query(collection(db, 'invoices'), where('userId', '==', user.uid))
      const querySnapshot = await getDocs(q)
      
      const deletePromises = []
      querySnapshot.forEach((doc) => {
        deletePromises.push(deleteDoc(doc.ref))
      })
      
      await Promise.all(deletePromises)
      setUserInvoices([])
      
      return { success: true }
    } catch (error) {
      console.error('Error limpiando facturas:', error)
      return { success: false, error: error.message }
    }
  }

  const updateUserProfile = async (profileData) => {
    if (!user) return { success: false, error: 'Usuario no autenticado' }
    
    try {
      await setDoc(doc(db, 'users', user.uid), {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        country: profileData.country,
        state: profileData.state,
        city: profileData.city,
        updatedAt: new Date().toISOString()
      }, { merge: true })
      
      setUserData(prev => ({
        ...prev,
        ...profileData,
        updatedAt: new Date().toISOString()
      }))
      
      return { success: true }
    } catch (error) {
      console.error('Error actualizando perfil:', error)
      return { success: false, error: error.message }
    }
  }

  const isSuperAdmin = () => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
    return user?.email === adminEmail
  }

  const isAdmin = () => {
    // Super admin siempre tiene acceso
    if (isSuperAdmin()) return true
    
    // Usuarios con rol admin o reina también tienen acceso al dashboard
    return userData?.role === 'admin' || userData?.role === 'reina'
  }

  const getAllUsers = async () => {
    if (!isAdmin()) return { success: false, error: 'No autorizado' }
    
    try {
      const q = query(collection(db, 'users'))
      const querySnapshot = await getDocs(q)
      const users = []
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() })
      })
      return { success: true, users }
    } catch (error) {
      console.error('Error obteniendo usuarios:', error)
      return { success: false, error: error.message }
    }
  }

  const updateUserSubscription = async (userId, accountType) => {
    if (!isAdmin()) return { success: false, error: 'No autorizado' }
    
    try {
      const updateData = {
        accountType,
        updatedAt: new Date().toISOString()
      }
      
      // Si el admin otorga premium, marcar que fue regalo
      if (accountType === 'premium') {
        updateData.premiumGrantedBy = 'admin'
      } else {
        // Si cambia a free, remover la marca
        updateData.premiumGrantedBy = null
      }
      
      await updateDoc(doc(db, 'users', userId), updateData)
      return { success: true }
    } catch (error) {
      console.error('Error actualizando suscripción:', error)
      return { success: false, error: error.message }
    }
  }

  // Obtener notificaciones de premium otorgado
  const getPremiumNotifications = async () => {
    if (!isSuperAdmin()) return { success: false, error: 'No autorizado' }
    
    try {
      const q = query(
        collection(db, 'premiumNotifications'),
        orderBy('createdAt', 'desc'),
        firestoreLimit(100)
      )
      const querySnapshot = await getDocs(q)
      const notifications = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        // Filtrar activos en el cliente para evitar índice compuesto
        if (data.active !== false) {
          notifications.push({ id: doc.id, ...data })
        }
      })
      return { success: true, notifications }
    } catch (error) {
      console.error('Error obteniendo notificaciones:', error)
      return { success: false, error: error.message }
    }
  }

  // Marcar notificación como leída
  const markNotificationAsRead = async (notificationId) => {
    if (!isSuperAdmin()) return { success: false, error: 'No autorizado' }
    
    try {
      await updateDoc(doc(db, 'premiumNotifications', notificationId), {
        read: true,
        readAt: new Date().toISOString()
      })
      return { success: true }
    } catch (error) {
      console.error('Error marcando notificación:', error)
      return { success: false, error: error.message }
    }
  }

  // Remover premium otorgado por admin/reina (solo super admin)
  const removePremiumGrantedByAdmin = async (userId, notificationId) => {
    if (!isSuperAdmin()) return { success: false, error: 'Solo el super admin puede remover premium' }
    
    try {
      // Remover premium del usuario
      await updateDoc(doc(db, 'users', userId), {
        accountType: 'free',
        maxPdfLimit: 5,
        premiumGrantedBy: null,
        premiumGrantedByUserId: null,
        premiumGrantedByEmail: null,
        subscriptionDate: null,
        subscriptionEndDate: null,
        updatedAt: new Date().toISOString()
      })
      
      // Marcar la notificación como inactiva
      if (notificationId) {
        await updateDoc(doc(db, 'premiumNotifications', notificationId), {
          active: false,
          revokedAt: new Date().toISOString(),
          revokedBy: user.email
        })
      }
      
      return { success: true }
    } catch (error) {
      console.error('Error removiendo premium:', error)
      return { success: false, error: error.message }
    }
  }

  const value = {
    user,
    userData,
    userInvoices,
    loading,
    register,
    login,
    signInWithGoogle,
    logout,
    incrementPdfCount,
    upgradeToPremium,
    canUploadPdf,
    getRemainingUploads,
    saveInvoice,
    updateInvoiceStatus,
    deleteInvoice,
    clearAllInvoices,
    loadUserInvoices,
    updateUserProfile,
    isAdmin,
    isSuperAdmin,
    getAllUsers,
    updateUserSubscription,
    updateUserRole,
    setPremiumDays,
    cancelPremium,
    deleteUser,
    deleteAccount,
    updateUserProfileByAdmin,
    createUserByAdmin,
    getPremiumNotifications,
    markNotificationAsRead,
    removePremiumGrantedByAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
