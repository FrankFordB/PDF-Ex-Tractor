import { useState, useEffect } from 'react'

export default function PremiumBenefits({ pdfCount = 0 }) {
  const [timeSaved, setTimeSaved] = useState({ hours: 0, minutes: 0 })
  
  useEffect(() => {
    // Cálculo matemático del tiempo ahorrado
    // Tiempo promedio procesando una factura manualmente: 4 minutos
    // Tiempo con PDF Ex-Tractor: 10 segundos
    // Ahorro por factura: 3.83 minutos (230 segundos)
    
    const MANUAL_TIME_PER_PDF = 240 // 4 minutos en segundos
    const AUTO_TIME_PER_PDF = 10 // 10 segundos
    const TIME_SAVED_PER_PDF = MANUAL_TIME_PER_PDF - AUTO_TIME_PER_PDF // 230 segundos por PDF
    
    const totalSecondsSaved = pdfCount * TIME_SAVED_PER_PDF
    const totalMinutesSaved = Math.floor(totalSecondsSaved / 60)
    const hours = Math.floor(totalMinutesSaved / 60)
    const minutes = totalMinutesSaved % 60
    
    setTimeSaved({ hours, minutes })
  }, [pdfCount])
  
  return (
    <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 border-2 border-yellow-300 rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <i className="fa-solid fa-crown text-3xl text-yellow-500"></i>
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            ¡Eres Usuario Premium! 🎉
          </h3>
          <p className="text-sm text-gray-600">
            Disfrutando de todos los beneficios exclusivos
          </p>
        </div>
      </div>
      
      {/* Tiempo ahorrado */}
      {pdfCount > 0 && (
        <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-300">
          <div className="flex items-center gap-3 mb-2">
            <i className="fa-solid fa-clock-rotate-left text-2xl text-green-600"></i>
            <div>
              <p className="text-lg font-bold text-gray-800">Tiempo Ahorrado</p>
              <p className="text-xs text-gray-600">Con {pdfCount} {pdfCount === 1 ? 'PDF procesado' : 'PDFs procesados'}</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="text-center">
              <div className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {timeSaved.hours > 0 ? `${timeSaved.hours}h` : ''} {timeSaved.minutes}min
              </div>
              <p className="text-xs text-gray-600 mt-1">
                vs. procesamiento manual
              </p>
            </div>
          </div>
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-700">
              <i className="fa-solid fa-calculator mr-1"></i>
              Cálculo: {pdfCount} PDF{pdfCount !== 1 ? 's' : ''} × 3.8 min/PDF
            </p>
          </div>
        </div>
      )}
      
      <div className="grid gap-3 mt-4">
        <div className="flex items-start gap-3 bg-white/70 p-3 rounded-lg">
          <i className="fa-solid fa-infinity text-green-500 mt-1"></i>
          <div>
            <p className="font-semibold text-gray-800">Cargas Ilimitadas</p>
            <p className="text-xs text-gray-600">Procesa todas las facturas que necesites</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 bg-white/70 p-3 rounded-lg">
          <i className="fa-solid fa-bolt text-yellow-500 mt-1"></i>
          <div>
            <p className="font-semibold text-gray-800">Procesamiento Prioritario</p>
            <p className="text-xs text-gray-600">Extracción más rápida con prioridad</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 bg-white/70 p-3 rounded-lg">
          <i className="fa-solid fa-shield-halved text-blue-500 mt-1"></i>
          <div>
            <p className="font-semibold text-gray-800">Almacenamiento Seguro</p>
            <p className="text-xs text-gray-600">Facturas respaldadas en la nube</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 bg-white/70 p-3 rounded-lg">
          <i className="fa-solid fa-file-excel text-green-600 mt-1"></i>
          <div>
            <p className="font-semibold text-gray-800">Exportación Avanzada</p>
            <p className="text-xs text-gray-600">Excel, CSV y más formatos</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 bg-white/70 p-3 rounded-lg">
          <i className="fa-solid fa-ad text-purple-500 mt-1 line-through"></i>
          <div>
            <p className="font-semibold text-gray-800">Sin Publicidad</p>
            <p className="text-xs text-gray-600">Experiencia limpia y sin distracciones</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3 bg-white/70 p-3 rounded-lg">
          <i className="fa-solid fa-headset text-indigo-500 mt-1"></i>
          <div>
            <p className="font-semibold text-gray-800">Soporte Premium 24/7</p>
            <p className="text-xs text-gray-600">Asistencia prioritaria</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-white/90 rounded-lg border border-yellow-400">
        <p className="text-xs text-gray-700 text-center">
          <i className="fa-solid fa-heart text-red-500 mr-1"></i>
          Gracias por confiar en PDF Ex-Tractor
        </p>
      </div>
    </div>
  )
}
