import { createContext, useContext, useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, increment, collection, addDoc, getDocs, query, where, deleteDoc, orderBy } from 'firebase/firestore'
import { auth, db } from '../config/firebase'

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
        }
        // Cargar facturas del usuario
        await loadUserInvoices(firebaseUser.uid)
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
      await signInWithEmailAndPassword(auth, email, password)
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

  const incrementPdfCount = async () => {
    if (!user) return
    try {
      const now = new Date()
      const weekStartDate = userData?.weekStartDate ? new Date(userData.weekStartDate) : now
      const daysSinceWeekStart = (now - weekStartDate) / (1000 * 60 * 60 * 24)
      
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
      } else {
        // Incrementar normalmente
        const newCount = (userData?.pdfUploaded || 0) + 1
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
        console.log(`✅ Contador incrementado a ${newCount}`)
      }
    } catch (error) {
      console.error('Error incrementando contador:', error)
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
    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        role: role,
        updatedAt: new Date().toISOString()
      })
      return { success: true }
    } catch (error) {
      console.error('Error updating role:', error)
      return { success: false, error: error.message }
    }
  }

  const setPremiumDays = async (userId, days) => {
    try {
      const userRef = doc(db, 'users', userId)
      const now = new Date()
      const endDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
      
      await updateDoc(userRef, {
        accountType: 'premium',
        maxPdfLimit: -1,
        premiumGrantedBy: 'admin', // Marcar como regalo del admin
        subscriptionDate: now.toISOString(),
        subscriptionEndDate: endDate.toISOString(),
        updatedAt: now.toISOString()
      })
      return { success: true }
    } catch (error) {
      console.error('Error setting premium days:', error)
      return { success: false, error: error.message }
    }
  }

  const cancelPremium = async (userId) => {
    if (!isAdmin()) return { success: false, error: 'No autorizado' }
    
    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        accountType: 'free',
        maxPdfLimit: 5,
        premiumGrantedBy: null,
        subscriptionDate: null,
        subscriptionEndDate: null,
        updatedAt: new Date().toISOString()
      })
      return { success: true }
    } catch (error) {
      console.error('Error cancelando premium:', error)
      return { success: false, error: error.message }
    }
  }

  const canUploadPdf = () => {
    // Sin login: permite 3 PDFs (se maneja en localStorage)
    if (!user) return true // Se controla en App.jsx
    
    // Super admin (franco_burgoa1@hotmail.com): SIEMPRE premium ilimitado
    if (user?.email === 'franco_burgoa1@hotmail.com') return true
    
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

  const isAdmin = () => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
    return user?.email === adminEmail
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
    getAllUsers,
    updateUserSubscription,
    updateUserRole,
    setPremiumDays,
    cancelPremium
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
