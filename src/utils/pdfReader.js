import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { createWorker } from 'tesseract.js'

// Configurar el worker de PDF.js con el archivo local
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

// Helper: renderizar página a canvas y devolver canvas
async function renderPageToCanvas(page, scale = 2) {
  const viewport = page.getViewport({ scale })
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  canvas.width = Math.ceil(viewport.width)
  canvas.height = Math.ceil(viewport.height)
  await page.render({ canvasContext: context, viewport }).promise
  return canvas
}

// función que extrae texto de un PDF File/Blob
export async function extractTextFromFile(file, options = {}) {
  const { promptForPassword, maxPasswordAttempts = 3, useOCR = false, ocrLang = 'eng' } = options
  const arrayBuffer = await file.arrayBuffer()
  let isEncrypted = false
  let wasDecrypted = false
  let pdf = null

  // Intentar abrir el PDF
  try {
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
    pdf = await loadingTask.promise
  } catch (err) {
    // Solo pedir contraseña si el error indica que está encriptado
    const isPasswordError = err.name === 'PasswordException' || 
                           err.message?.includes('password') || 
                           err.message?.includes('encrypted')
    
    if (isPasswordError) {
      isEncrypted = true
      if (promptForPassword && typeof promptForPassword === 'function') {
        let attempt = 0
        let lastErr = err
        while (attempt < maxPasswordAttempts) {
          attempt++
          const pw = await promptForPassword(file.name, { attempt })
          if (!pw) break
          try {
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer, password: pw })
            pdf = await loadingTask.promise
            wasDecrypted = true
            isEncrypted = false
            break
          } catch (e2) {
            lastErr = e2
          }
        }
        if (!pdf) {
          return { text: '', pages: [], isEncrypted: true, wasDecrypted: false, error: lastErr?.message || 'PDF encriptado' }
        }
      } else {
        return { text: '', pages: [], isEncrypted: true, wasDecrypted: false, error: err?.message || 'PDF encriptado' }
      }
    } else {
      // Si no es un error de contraseña, retornar el error directamente
      return { text: '', pages: [], isEncrypted: false, wasDecrypted: false, error: err?.message || 'Error al abrir PDF' }
    }
  }

  const pages = []
  let fullText = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    try {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const pageText = content.items.map((it) => it.str).join(' ')
      pages.push({ page: i, text: pageText })
      fullText += pageText + '\n'
    } catch (pageError) {
      pages.push({ page: i, text: '', error: pageError.message })
    }
  }

  // Si no se obtuvo texto y se indicó usar OCR, renderizar y hacer OCR
  const textEmpty = !fullText || fullText.trim().length < 5
  if (textEmpty && useOCR) {
    try {
      const worker = await createWorker({ logger: () => {} })
      await worker.load()
      await worker.loadLanguage(ocrLang)
      await worker.initialize(ocrLang)

      let ocrFull = ''
      // Limitar OCR a las primeras N páginas para rendimiento (por ejemplo 5)
      const maxOCRPages = Math.min(pdf.numPages, 5)
      for (let i = 1; i <= maxOCRPages; i++) {
        try {
          const page = await pdf.getPage(i)
          const canvas = await renderPageToCanvas(page, 2)
          const { data: { text } } = await worker.recognize(canvas)
          pages[i - 1] = pages[i - 1] || { page: i }
          pages[i - 1].ocr = text
          ocrFull += text + '\n'
        } catch (ocrPageErr) {
          console.error('OCR error page', i, ocrPageErr)
        }
      }

      await worker.terminate()
      if (ocrFull.trim().length > 0) {
        fullText = ocrFull
      }
    } catch (ocrErr) {
      console.error('OCR fallback failed', ocrErr)
    }
  }

  return { text: fullText, pages, isEncrypted, wasDecrypted, error: null }
}