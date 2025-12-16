import { useState, useEffect, useRef } from 'react'
import Sidebar from './components/Sidebar'
import DropzoneArea from './components/DropzoneArea'
import ResultCard from './components/ResultCard'
import Header from './components/Header'
import WelcomeModal from './components/WelcomeModal'
import LoginModal from './components/LoginModal'
import RegisterModal from './components/RegisterModal'
import UpgradeModal from './components/UpgradeModal'
import GuestLimitModal from './components/GuestLimitModal'
import UserSettingsModal from './components/UserSettingsModal'
import AdminDashboard from './components/AdminDashboard'
import ConfirmModal from './components/ConfirmModal'
import UsagePanel from './components/UsagePanel'
import AdBanner from './components/AdBanner'
import { useAuth } from './contexts/AuthContext'
import useLocalStorage from './hooks/useLocalStorage'
import { extractTextFromFile } from './utils/pdfReader'
import * as XLSX from 'xlsx'

/* -------------------------------------------------
   DEFAULT_FIELDS
   ------------------------------------------------- */
const DEFAULT_FIELDS = [
    {
    name: 'Beneficiario',
    regex: /Beneficiario[:\s]*([A-ZÁÉÍÓÚÑ\s]+)/i
  },
  {
    name: 'DNI',
    regex: /DNI[:\s]*([0-9]{7,8})/i
  },
  {
    name: 'CAE N°',
    regex: /\b(?:CAE|C\.?A\.?E)\b[^0-9]{0,6}([0-9]{6,20})/i
  },
  {
    name: 'Fecha de Emisión',
    regex: /Fecha(?:\s+de)?\s+Em[ií]sion[:\s\-]*([0-3]\d[\/\-\.][0-1]\d[\/\-\.][0-9]{2,4})/i
  },
  {
    name: 'Fecha de Vto. de CAE',
    regex: /Fecha(?:\s+de)?\s+Vt[oó]\.?\s*(?:de)?\s*(?:CAE)?[:\s\-]*([0-3]\d[\/\-\.][0-1]\d[\/\-\.][0-9]{2,4})/i
  },
  
  {
    name: 'Comp. Nro',
    regex: /Comp\.?\s*Nro\.?[:\s\-]*([0-9]{1,6})[\s\-]*([0-9]{4,20})/i
  },
  {
    name: 'CUIL',
    regex: /CUIL[:\s\-]*([0-9]{2}-?[0-9]{6,8}-?[0-9])/i
  },
  {
    name: 'Importe Total',
    regex: /Importe(?:\s+de)?\s+Total[:\s\-]*\$?\s*([0-9]{1,3}(?:[\.,][0-9]{3})*(?:[\.,][0-9]{2})?)/i
  },
]

export default function App() {
  const { 
    user, 
    userData, 
    userInvoices,
    canUploadPdf, 
    incrementPdfCount,
    saveInvoice,
    updateInvoiceStatus,
    deleteInvoice,
    clearAllInvoices
  } = useAuth()
  
  const [fields, setFields] = useLocalStorage('fields', DEFAULT_FIELDS)
  // Para usuarios invitados, usamos localStorage. Para usuarios logueados, usamos userInvoices de Firestore
  const [guestResults, setGuestResults] = useLocalStorage('guestResults', [])
  // Estado local temporal para mostrar resultados inmediatamente (antes de guardar en Firestore)
  const [localResults, setLocalResults] = useState([])
  const [processing, setProcessing] = useState(false)
  const [newFieldName, setNewFieldName] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [viewMode, setViewMode] = useState('enProceso')
  const [showResetModal, setShowResetModal] = useState(false)
  const [showWelcome, setShowWelcome] = useLocalStorage('welcomeShown', false)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [showGuestLimit, setShowGuestLimit] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [alertModal, setAlertModal] = useState({ isOpen: false, title: '', message: '', type: 'error' })
  const [guestUploadCount, setGuestUploadCount] = useLocalStorage('guestUploads', 0)

  // Referencia para contador de PDFs que se actualiza inmediatamente
  const pdfCountRef = useRef(userData?.pdfUploaded || 0)
  
  // Sincronizar la referencia cuando userData cambie (al cargar desde Firestore)
  useEffect(() => {
    if (userData?.pdfUploaded !== undefined) {
      pdfCountRef.current = userData.pdfUploaded
      console.log(`🔄 Contador sincronizado desde Firestore: ${userData.pdfUploaded}`)
    }
  }, [userData?.pdfUploaded])

  // Usar resultados según si hay usuario o no
  // Si hay usuario: combinar resultados locales (recién subidos) con los de Firestore
  const results = user ? [...localResults, ...userInvoices] : guestResults
  const setResults = user ? null : setGuestResults // Solo para invitados

  /* -------------------------
     1. NORMALIZADOR GENERAL (Para Fechas, Importe, CAE)
     Fusiona "F e c h a" -> "Fecha" para que las regex funcionen.
     ------------------------- */
  const normalizeGeneral = (raw) => {
    if (!raw) return ''
    let t = raw
    t = t.replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ')
    // FUSIONAR LETRAS: Clave para arreglar Fechas e Importes
    t = t.replace(/([A-Za-zÁÉÍÓÚÑáéíóúñ])\s(?=[A-Za-zÁÉÍÓÚÑáéíóúñ])/g, '$1')
    t = t.replace(/\r/g, '\n')
    t = t.replace(/\n[ \t]+/g, '\n')
    t = t.replace(/[^\x00-\x7FñÑáéíóúÁÉÍÓÚ]/g, '')
    t = t.replace(/\s+/g, ' ')
    return t.trim()
  }

  /* -------------------------
     2. NORMALIZADOR PARA NOMBRES (Solo Razón Social)
     NO fusiona letras para leer "MARGIOTTA REBECA" correctamente.
     ------------------------- */
  const normalizeForNames = (raw) => {
    if (!raw) return ''
    let t = raw
    t = t.replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ')
    // AQUÍ NO FUSIONAMOS LETRAS
    t = t.replace(/\r/g, '\n')
    t = t.replace(/\n[ \t]+/g, '\n')
    t = t.replace(/[^\x00-\x7FñÑáéíóúÁÉÍÓÚ]/g, '')
    // Si hay doble espacio, lo bajamos a uno, pero respetamos el espacio simple
    t = t.replace(/\s+/g, ' ')
    return t.trim()
  }

  /* ---------------------------------------
     Estrategias de extracción (Usan normalizeGeneral)
     --------------------------------------- */
  const extractCompNro = (text, fieldRegex) => {
    const m = text.match(fieldRegex)
    if (m) {
      if (m[2]) return m[2].trim()
      if (m[1]) return m[1].trim()
    }
    const labelPos = text.search(/Comp\.?\s*Nro\.?/i)
    if (labelPos >= 0) {
      const snippet = text.slice(labelPos, labelPos + 120)
      const nums = [...(snippet.matchAll(/(\d+)/g))].map(r => r[1])
      if (nums.length >= 2) return nums[1]
      if (nums.length === 1) return nums[0]
    }
    return 'No encontrado'
  }

  const extractCAE = (text, fieldRegex) => {
    // 1) Buscar "CAE N°:" seguido del número
    const m = text.match(/CAEN[°º]?[:\s]*([0-9]{14,20})/i)
    if (m && m[1]) return m[1].trim()
    
    // 2) Buscar "CAE" sin "N°"
    const m2 = text.match(/CAE[:\s]+([0-9]{14,20})/i)
    if (m2 && m[1]) return m2[1].trim()
    
    // 3) Buscar números largos cerca de la palabra "CAE"
    const caePos = text.search(/CAE/i)
    if (caePos >= 0) {
      const after = text.slice(caePos, caePos + 100)
      const num = after.match(/([0-9]{14,20})/)
      if (num) return num[1].trim()
    }
    
    // 4) Fallback: buscar cualquier número de 14 dígitos en el documento
    const anyLong = text.match(/\b([0-9]{14})\b/)
    if (anyLong) return anyLong[1]
    
    return 'No encontrado'
  }

  const extractFechaGeneric = (text, regex) => {
    const m = text.match(regex)
    if (m && m[1]) return m[1].trim()
    return 'No encontrado'
  }

  const extractFechaEmision = (text) => {
    // La Fecha de Emisión es SIEMPRE 10 días ANTES de la Fecha de Vto. de CAE
    const fechaVto = extractFechaVtoCAE(text)
    if (fechaVto && fechaVto !== 'No encontrado') {
      try {
        // Parsear fecha (formato DD/MM/YYYY o DD-MM-YYYY)
        const parts = fechaVto.split(/[\/\-\.]/)
        if (parts.length === 3) {
          const day = parseInt(parts[0])
          const month = parseInt(parts[1]) - 1 // JS months are 0-indexed
          const year = parseInt(parts[2])
          
          const vtoDate = new Date(year, month, day)
          // Restar 10 días
          vtoDate.setDate(vtoDate.getDate() - 10)
          
          const emisionDay = String(vtoDate.getDate()).padStart(2, '0')
          const emisionMonth = String(vtoDate.getMonth() + 1).padStart(2, '0')
          const emisionYear = vtoDate.getFullYear()
          
          return `${emisionDay}/${emisionMonth}/${emisionYear}`
        }
      } catch (e) {
        console.error('Error calculando fecha de emisión:', e)
      }
    }
    
    return 'No encontrado'
  }

  const extractFechaVtoCAE = (text) => {
    // 1) Buscar "Fecha de Vto. de CAE" o variantes
    const m = text.match(/Fecha\s*de?\s*Vto\.?\s*de?\s*CAE[:\s]*([0-3]\d[\/\-\.][0-1]\d[\/\-\.][0-9]{2,4})/i)
    if (m) return m[1].trim()
    
    // 2) Buscar "FechadeVto.deCAE" (fusionado)
    const m2 = text.match(/FechadeVto\.?deCAE[:\s]*([0-3]\d[\/\-\.][0-1]\d[\/\-\.][0-9]{2,4})/i)
    if (m2) return m2[1].trim()
    
    // 3) Buscar cerca de "CAE" al final del documento
    const caePos = text.lastIndexOf('CAE')
    if (caePos >= 0) {
      const after = text.slice(caePos, caePos + 150)
      const dates = [...after.matchAll(/([0-3]\d[\/\-\.][0-1]\d[\/\-\.][0-9]{2,4})/g)]
      // Tomar la ÚLTIMA fecha que aparece (suele ser Vto. de CAE)
      if (dates.length > 0) {
        return dates[dates.length - 1][1].trim()
      }
    }
    
    return 'No encontrado'
  }

  const extractCUIL = (text) => {
    // 1) Buscar "CUIT:" o "CUIL:" seguido de 11 dígitos (del cliente, no del emisor)
    // En el PDF el CUIT del cliente viene después de "Apellido y Nombre"
    const afterNombre = text.search(/ApellidoyNombre|Apellido\s*y\s*Nombre/i)
    if (afterNombre >= 0) {
      const section = text.slice(afterNombre, afterNombre + 500)
      const m = section.match(/(?:CUIT|CUIL)[:\s]*([0-9]{11})/i)
      if (m && m[1]) return m[1].trim()
    }
    
    // 2) Buscar el SEGUNDO CUIT/CUIL en el documento (primero es emisor, segundo es cliente)
    const allCuits = [...text.matchAll(/(?:CUIT|CUIL)[:\s]*([0-9]{11})/gi)]
    if (allCuits.length >= 2) {
      return allCuits[1][1].trim()
    }
    if (allCuits.length === 1) {
      return allCuits[0][1].trim()
    }
    
    // 3) Fallback: buscar números de 11 dígitos con formato de CUIT (empiezan con 20, 23, 24, 27, 30, 33, 34)
    const matches = [...text.matchAll(/\b(20|23|24|27|30|33|34)(\d{9})\b/g)]
    if (matches.length >= 2) {
      // Tomar el segundo (cliente)
      return matches[1][0]
    }
    if (matches.length === 1) {
      return matches[0][0]
    }
    
    return 'No encontrado'
  }

  const normalizeAmount = (raw) => {
    if (!raw) return raw
    let s = String(raw).trim()
    s = s.replace(/[^0-9,\.]/g, '')
    const hasDot = s.indexOf('.') !== -1
    const hasComma = s.indexOf(',') !== -1
    const lastDot = s.lastIndexOf('.')
    const lastComma = s.lastIndexOf(',')

    if (hasDot && hasComma) {
      if (lastComma > lastDot) s = s.replace(/\./g, '').replace(/,/g, '.')
      else s = s.replace(/,/g, '')
    } else if (hasComma && !hasDot) {
      s = s.replace(/,/g, '.')
    } else if (hasDot && !hasComma) {
      const parts = s.split('.')
      if (parts[parts.length - 1].length === 2) s = parts.slice(0, -1).join('') + '.' + parts[parts.length - 1]
      else s = s.replace(/\./g, '')
    }
    if (!s.includes('.')) s = s + '.00'
    else {
      const [integer, decimal] = s.split('.')
      if (decimal.length === 1) s = integer + '.' + decimal + '0'
      else if (decimal.length > 2) s = integer + '.' + decimal.substring(0, 2)
    }
    s = s.replace(/^0+(?=[1-9])/, '')
    return s
  }

  const extractImporte = (text) => {
    // Estrategia: Buscar el monto MÁS GRANDE del documento
    // Puede tener separadores de miles o no: 891000,00 o 891.000,00
    
    // 1) Buscar todos los montos (con o sin separadores de miles)
    const allAmounts = [...text.matchAll(/([0-9]{1,}(?:[\.,][0-9]{3})*[\.,][0-9]{2})/g)]
    
    if (allAmounts.length > 0) {
      let maxVal = 0
      let maxStr = 'No encontrado'
      
      for (const match of allAmounts) {
        const norm = normalizeAmount(match[1])
        const val = parseFloat(norm)
        
        // Tomar montos razonables (entre 100 y 99 millones)
        if (val >= 100 && val < 99999999 && val > maxVal) {
          maxVal = val
          maxStr = norm
        }
      }
      
      if (maxVal > 0) return maxStr
    }
    
    return 'No encontrado'
  }

  const extractBeneficiario = (text) => {
    // Buscar la etiqueta "Beneficiario:" o "Afiliado:" y capturar el nombre después
    const m = text.match(/(Beneficiario|Afiliado)[:\s]*([A-ZÁÉÍÓÚÑ\s]{3,})/i)
    if (m && m[2]) {
      // Limpiar: tomar hasta el primer salto de línea o palabra clave
      let nombre = m[2].trim()
      const stopAt = nombre.search(/\n|DNI|CUIL|Domicilio|Condici[oó]n/i)
      if (stopAt > 0) {
        nombre = nombre.substring(0, stopAt).trim()
      }
      if (nombre.length > 2) return nombre
    }
    return 'No encontrado'
  }

  const extractDNI = (text) => {
    // Buscar "DNI:" seguido de 7-8 dígitos
    const m = text.match(/DNI[:\s]*([0-9]{7,8})/i)
    if (m && m[1]) return m[1].trim()
    
    // Fallback: buscar números de 7-8 dígitos que puedan ser DNI
    const dni = text.match(/\b([0-9]{7,8})\b/)
    if (dni) return dni[1]
    
    return 'No encontrado'
  }

  /* ---------------------------------------
     RAZÓN SOCIAL (Usa normalizeForNames - sin fusionar)
     --------------------------------------- */
  const extractRazonSocial = (text) => {
    if (!text) return 'No encontrado'

    // Estrategia: CUIT + Espacios + Nombre
    const matches = [...text.matchAll(/(\d{11})\s+([A-ZÁÉÍÓÚÑ\s]{3,})/g)]
    
    for (const m of matches) {
        let nombre = m[2].trim()
        if (/\d/.test(nombre)) continue 

        // Cortar en palabras clave
        const corte = nombre.search(/(\bAlberdi\b|\bAv\b|\bCalle\b|\bDpto\b|\bDomicilio\b|\bCondici\b|SanRafael|Mendoza)/i)
        if (corte > 0) nombre = nombre.slice(0, corte).trim()

        // Quitar "A" suelta
        if (nombre.endsWith(' A')) nombre = nombre.slice(0, -2).trim()
        if (nombre.startsWith('A ')) nombre = nombre.slice(2).trim()
        
        if (nombre.length > 3) return nombre
    }

    // Fallback
    const idxLabel = text.search(/ApellidoyNombre|Apellido\s+y\s+Nombre|Raz[oó]n\s+Social/i)
    if (idxLabel > 0) {
      const ventanaAtras = text.slice(Math.max(0, idxLabel - 400), idxLabel)
      const cuits = [...ventanaAtras.matchAll(/(\d{11})/g)]
      if (cuits.length > 0) {
        const ultimoCuit = cuits[cuits.length - 1]
        let candidato = ventanaAtras.slice(ultimoCuit.index + 11).trim()
        
        const corte = candidato.search(/(\bAlberdi\b|\bAv\b|\bCalle\b|\bDpto\b|\bDomicilio\b|\bCondici\b|[0-9]{3,})/)
        if (corte > 0) candidato = candidato.slice(0, corte)
        
        candidato = candidato.replace(/^[^A-ZÁÉÍÓÚÑa-z]+/, '').trim()
        if (candidato.endsWith(' A')) candidato = candidato.slice(0, -2).trim()
        
        if (candidato.length > 3) return candidato
      }
    }

    return 'No encontrado'
  }

  /* ---------------------------------------
     Process text result
     --------------------------------------- */
  const processTextResult = async (res, fileName, file) => {
    if (!res) return
    if (res.error) {
      const errorData = { fileName, extracted: { error: res.error }, finalText: `ERROR: ${res.error}`, status: 'Error' }
      if (user) {
        // Mostrar error inmediatamente
        setLocalResults((prev) => [errorData, ...prev])
        // Guardar en Firestore en segundo plano
        console.log('Guardando error en Firestore para:', fileName)
        saveInvoice(errorData).then(result => {
          if (result.success) {
            console.log('Error guardado en Firestore, removiendo de localResults')
            setLocalResults(prev => prev.filter(item => item.fileName !== fileName))
          } else {
            console.error('No se pudo guardar el error en Firestore:', result.error)
          }
        }).catch(err => console.error('Excepción guardando error en Firestore:', err))
      } else {
        setGuestResults((prev) => [errorData, ...prev])
      }
      return
    }

    const rawText = res.text || ''
    
    // 1. Texto General (Fusionado): Para Fechas, Importes, CAE
    const textGeneral = normalizeGeneral(rawText)
    
    // 2. Texto Nombres (Sin Fusionar): Solo para Razón Social
    const textNames = normalizeForNames(rawText)

    const extracted = {}

    for (const f of fields) {
      try {
        let value = 'No encontrado'

        if (f.name === 'Apellido y Nombre / Razón Social') {
          // USA EL TEXTO ESPECIAL PARA NOMBRES
          value = extractRazonSocial(textNames)
        } else if (f.name === 'Beneficiario') {
          // USA EL TEXTO ESPECIAL PARA NOMBRES (sin fusionar letras)
          value = extractBeneficiario(textNames)
        } else {
          // USA EL TEXTO GENERAL (ARREGLADO) PARA EL RESTO
          if (f.name === 'Comp. Nro') value = extractCompNro(textGeneral, f.regex)
          else if (f.name === 'CAE N°') value = extractCAE(textGeneral, f.regex)
          else if (f.name === 'Fecha de Vto. de CAE') value = extractFechaVtoCAE(textGeneral)
          else if (f.name === 'Fecha de Emisión') value = extractFechaEmision(textGeneral)
          else if (f.name === 'CUIL') value = extractCUIL(textGeneral)
          else if (f.name === 'Importe Total') value = extractImporte(textGeneral)
          else if (f.name === 'DNI') value = extractDNI(textGeneral)
          else {
             const m = textGeneral.match(f.regex)
             value = m ? m[1].trim() : 'No encontrado'
          }
        }

        if (typeof value === 'string') value = value.replace(/\s+/g, ' ').trim()
        extracted[f.name] = value || 'No encontrado'
      } catch (e) {
        extracted[f.name] = 'No encontrado'
      }
    }

    // Usamos textGeneral para el display raw, o rawText
    const finalText = Object.entries(extracted).map(([k, v]) => `${k}: ${v}`).join('\n')
    let fileUrl = null
    try { if (file instanceof File) fileUrl = URL.createObjectURL(file) } catch (e) {}

    const invoiceData = { 
      fileName, 
      extracted, 
      finalText, 
      rawText: textGeneral, 
      status: 'En proceso', 
      fileUrl // Incluir fileUrl para preview (funcionará en sesión actual)
    }

    // Si hay usuario logueado
    if (user) {
      // 1. Primero mostrar localmente (inmediato)
      setLocalResults((prev) => [invoiceData, ...prev])
      
      // 2. Luego guardar en Firestore en segundo plano
      console.log('Intentando guardar en Firestore:', fileName)
      saveInvoice(invoiceData).then(result => {
        console.log('Resultado de saveInvoice:', result)
        if (result.success) {
          console.log('✅ Factura guardada exitosamente en Firestore:', fileName)
          // Una vez guardado, remover del estado local (ya está en userInvoices)
          setLocalResults(prev => prev.filter(item => item.fileName !== fileName))
        } else {
          console.error('❌ Error guardando en Firestore:', result.error)
          setAlertModal({
            isOpen: true,
            title: '⚠️ Error al Guardar',
            message: `Error guardando ${fileName}: ${result.error}\n\n⚠️ IMPORTANTE: Debes publicar las reglas de Firestore en Firebase Console para que los datos se guarden permanentemente.\n\nVe a Firebase Console → Firestore Database → Reglas y publica las reglas de seguridad.`,
            type: 'error'
          })
        }
      }).catch(err => {
        console.error('❌ Excepción guardando en Firestore:', err)
        setAlertModal({
          isOpen: true,
          title: '⚠️ Error al Guardar',
          message: `Error guardando ${fileName}: ${err.message}\n\n⚠️ IMPORTANTE: Debes publicar las reglas de Firestore en Firebase Console.`,
          type: 'error'
        })
      })
    } else {
      // Usuario invitado: guardar en localStorage
      setGuestResults((prev) => [invoiceData, ...prev])
    }
  }

  const handleFiles = async (files) => {
    // Verificar límites antes de procesar
    const filesToProcess = files.length
    
    // Usuario no logueado: límite de 3 PDFs
    if (!user) {
      const totalAfterUpload = guestUploadCount + filesToProcess
      if (totalAfterUpload > 3) {
        setShowGuestLimit(true)
        return
      }
    }
    
    // Usuario autenticado: verificar si puede subir (si es free y superó el límite)
    if (user) {
      const isSuperAdmin = user?.email === 'franco_burgoa1@hotmail.com'
      const isAdmin = userData?.role === 'admin'
      const isReina = userData?.role === 'reina'
      const isPremium = userData?.accountType === 'premium'
      
      // Solo verificar límite si es usuario free
      if (!isSuperAdmin && !isAdmin && !isReina && !isPremium) {
        const limit = userData?.maxPdfLimit || 5
        const currentCount = pdfCountRef.current
        const remaining = limit - currentCount
        
        console.log(`📊 Estado actual: ${currentCount}/${limit} PDFs usados. Intentando subir ${filesToProcess} archivos. Quedan ${remaining} disponibles.`)
        
        if (filesToProcess > remaining) {
          console.log(`⛔ LÍMITE EXCEDIDO - Solo quedan ${remaining} PDFs disponibles pero intentas subir ${filesToProcess}`)
          setShowUpgrade(true)
          return
        }
      }
    }
    
    setProcessing(true)
    
    // Contador temporal solo para mostrar progreso durante esta sesión de carga
    let processedInThisSession = 0
    
    for (const file of files) {
      try {
        const res = await extractTextFromFile(file, {
          promptForPassword: async (fileName, { attempt }) => prompt(`Contraseña para ${fileName}:`),
          maxPasswordAttempts: 3,
          useOCR: true,
          ocrLang: 'spa'
        })
        await processTextResult(res, file.name, file)
        
        // Incrementar contador DESPUÉS de procesar exitosamente
        if (!user) {
          setGuestUploadCount(prev => prev + 1)
        } else {
          // Incrementar PRIMERO el contador de referencia localmente
          pdfCountRef.current += 1
          processedInThisSession++
          
          const limit = userData?.maxPdfLimit || 5
          console.log(`✅ PDF ${processedInThisSession}/${filesToProcess} procesado exitosamente. Total acumulado: ${pdfCountRef.current}/${limit}`)
          
          // Luego actualizar en Firestore pasando el valor actual del contador
          await incrementPdfCount(pdfCountRef.current - 1)
        }
        
      } catch (err) {
        console.error('Error procesando archivo:', err)
        const errorData = { fileName: file.name, extracted: { error: 'Error' }, finalText: 'Error', status: 'En proceso' }
        if (user) {
          await saveInvoice(errorData)
        } else {
          setGuestResults((prev) => [errorData, ...prev])
        }
      }
    }
    
    console.log(`✅ Procesamiento completo: ${processedInThisSession}/${filesToProcess} archivos procesados`)
    setProcessing(false)
  }

  const handleToggleStatus = async (idx) => {
    const invoice = results[idx]
    if (!invoice) return
    
    const newStatus = invoice.status === 'Finalizada' ? 'En proceso' : 'Finalizada'
    
    if (user) {
      // Usuario logueado
      if (invoice.id) {
        // Factura ya guardada en Firestore
        await updateInvoiceStatus(invoice.id, newStatus)
      } else {
        // Factura todavía en localResults (esperando guardarse)
        setLocalResults(prev => {
          const c = [...prev]
          if(c[idx]) c[idx] = { ...c[idx], status: newStatus }
          return c
        })
      }
    } else {
      // Usuario invitado: actualizar localStorage
      setGuestResults(prev => {
        const c = [...prev]
        if(c[idx]) c[idx] = { ...c[idx], status: newStatus }
        return c
      })
    }
  }
  const handleSelect = (index) => {
    setSelectedIndex(index)
    setTimeout(() => document.getElementById(`result-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100)
  }
  const handleDelete = async (index) => {
    const invoice = results[index]
    if (!invoice) return
    
    if (user) {
      // Usuario logueado
      if (invoice.id) {
        // Factura ya guardada en Firestore
        await deleteInvoice(invoice.id)
      } else {
        // Factura todavía en localResults (esperando guardarse)
        setLocalResults(prev => prev.filter((_, i) => i !== index))
      }
    } else {
      // Usuario invitado: eliminar de localStorage
      setGuestResults(prev => prev.filter((_, i) => i !== index))
    }
  }
  const handleReset = () => { 
    setShowResetModal(true)
  }

  const confirmReset = async () => {
    if (user) {
      // Usuario logueado: limpiar facturas de Firestore y localResults
      setLocalResults([])
      await clearAllInvoices()
    } else {
      // Usuario invitado: limpiar localStorage
      setGuestResults([])
    }
    setShowResetModal(false)
  }
  
  const exportAllToExcel = () => {
    if (!user) {
      setShowLogin(true)
      return
    }
    if (!results.length) return
    const rows = results.map(r => ({ fileName: r.fileName, ...r.extracted }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Datos')
    XLSX.writeFile(wb, 'extraccion.xlsx')
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Welcome Modal */}
      {!showWelcome && <WelcomeModal onClose={() => setShowWelcome(true)} />}
      
      {/* Auth Modals */}
      {showLogin && (
        <LoginModal 
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => {
            setShowLogin(false)
            setShowRegister(true)
          }}
        />
      )}
      
      {showRegister && (
        <RegisterModal 
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => {
            setShowRegister(false)
            setShowLogin(true)
          }}
        />
      )}
      
      {/* Upgrade Modal */}
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
      
      {/* Guest Limit Modal */}
      {showGuestLimit && (
        <GuestLimitModal 
          uploadCount={guestUploadCount}
          onClose={() => setShowGuestLimit(false)}
          onShowRegister={() => {
            setShowGuestLimit(false)
            setShowRegister(true)
          }}
        />
      )}
      
      <Sidebar 
        results={results} 
        onSelect={setSelectedIndex} 
        onViewChange={setViewMode} 
        currentView={viewMode} 
        selectedIndex={selectedIndex}
        fields={fields}
        onExportExcel={exportAllToExcel}
        onReset={handleReset}
        user={user}
      />
      <main className="flex-1 p-4">
        <Header 
          onShowLogin={() => setShowLogin(true)}
          onShowRegister={() => setShowRegister(true)}
          onShowUpgrade={() => setShowUpgrade(true)}
          onShowSettings={() => setShowSettings(true)}
          onShowAdmin={() => setShowAdmin(true)}
        />
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <DropzoneArea 
              onFiles={handleFiles} 
              disabled={user && userData?.accountType === 'free' && (userData?.pdfUploaded || 0) >= 5}
              onDisabledClick={() => setShowUpgrade(true)}
            />
            
            {/* Info de límites para usuarios no premium */}
            {!user && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <i className="fa-solid fa-info-circle mr-2"></i>
                  Sin registro: {Math.max(0, 3 - guestUploadCount)} PDFs restantes de 3.{' '}
                  <button 
                    onClick={() => setShowRegister(true)}
                    className="underline font-medium hover:text-blue-900"
                  >
                    Regístrate gratis para 5 PDFs por semana
                  </button>
                </p>
              </div>
            )}
            
            {/* Mensaje para usuarios FREE */}
            {user && userData?.accountType === 'free' && (
              <>
                {(userData?.pdfUploaded || 0) >= 5 ? (
                  <div 
                    onClick={() => setShowUpgrade(true)}
                    className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg cursor-pointer hover:from-yellow-100 hover:to-orange-100 transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <i className="fa-solid fa-crown text-2xl text-yellow-500 mt-1"></i>
                      <div>
                        <p className="text-sm font-bold text-gray-800">
                          ¡Alcanzaste el máximo de cuentas gratuitas!
                        </p>
                        <p className="text-xs text-gray-700 mt-1">
                          Pásate a Premium y ahorra hasta 10 minutos por factura con extracción ilimitada
                        </p>
                        <p className="text-xs text-blue-600 font-semibold mt-2">
                          Haz click aquí para actualizar →
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <i className="fa-solid fa-exclamation-triangle mr-2"></i>
                      Cuenta gratuita: {Math.max(0, 5 - (userData?.pdfUploaded || 0))} PDFs restantes de 5.{' '}
                      <button 
                        onClick={() => setShowUpgrade(true)}
                        className="underline font-medium hover:text-yellow-900"
                      >
                        Actualiza a Premium para cargas ilimitadas
                      </button>
                    </p>
                  </div>
                )}
              </>
            )}
            
            {user && userData?.accountType === 'premium' && (
              <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300 rounded-lg">
                <p className="text-sm text-gray-800">
                  <i className="fa-solid fa-crown text-yellow-500 mr-2"></i>
                  <strong>Cuenta Premium</strong> - Cargas ilimitadas disponibles
                </p>
              </div>
            )}
            
            {user && userData?.role === 'reina' && (
              <div className="mt-4 p-3 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-300 rounded-lg">
                <p className="text-sm text-gray-800">
                  <i className="fa-solid fa-crown text-pink-500 mr-2"></i>
                  <strong className="text-pink-700">👑 Reina</strong> - Privilegios especiales permanentes
                </p>
              </div>
            )}
            
            <div className="mt-6">
                {processing && <p className="text-blue-600">Procesando...</p>}
                {results.filter(r => viewMode==='finalizadas'?r.status==='Finalizada':r.status!=='Finalizada').map((r, i) => (
                    <div key={i} id={`result-${i}`}><ResultCard item={r} index={i} onDelete={handleDelete} onToggleStatus={() => handleToggleStatus(i)} highlighted={selectedIndex===i} isGuest={!user} onShowLogin={() => setShowLogin(true)}/></div>
                ))}
            </div>
          </div>
          <aside className="bg-white p-4 rounded shadow h-fit space-y-4">
            {/* Panel de uso para usuarios free y guests */}
            <UsagePanel 
              onUpgrade={() => setShowUpgrade(true)} 
              onShowRegister={() => setShowRegister(true)}
            />
            
            {/* Anuncio sidebar - Solo para usuarios free y guests - Debajo del panel premium */}
            {(!user || userData?.accountType === 'free') && (
              <div className="border-t border-gray-200 pt-4">
                <AdBanner 
                  slot="0987654321" 
                  format="vertical"
                  style={{ minHeight: '250px' }}
                />
              </div>
            )}
          </aside>
        </div>
      </main>

      {/* Modal de confirmación de reinicio */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              ¿Reiniciar la aplicación?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Esta acción eliminará todas las facturas cargadas y no se puede deshacer. ¿Estás seguro de que deseas continuar?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded font-medium transition-colors"
              >
                No, cancelar
              </button>
              <button
                onClick={confirmReset}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors"
              >
                Sí, reiniciar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de configuración de usuario */}
      {showSettings && (
        <UserSettingsModal onClose={() => setShowSettings(false)} />
      )}

      {/* Dashboard de Administración */}
      {showAdmin && (
        <AdminDashboard onClose={() => setShowAdmin(false)} />
      )}

      {/* Modal de Alerta */}
      <ConfirmModal
        isOpen={alertModal.isOpen}
        title={alertModal.title}
        message={alertModal.message}
        type={alertModal.type}
        onConfirm={() => setAlertModal({ ...alertModal, isOpen: false })}
        onCancel={() => setAlertModal({ ...alertModal, isOpen: false })}
        showCancel={false}
        confirmText="Entendido"
      />
    </div>
  )
}