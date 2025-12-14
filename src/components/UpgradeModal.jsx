import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import MercadoPagoCheckout from './MercadoPagoCheckout'

export default function UpgradeModal({ onClose }) {
  const [showCheckout, setShowCheckout] = useState(false)
  const [success, setSuccess] = useState(false)
  const { upgradeToPremium } = useAuth()

  const handleSuccess = () => {
    setSuccess(true)
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full mx-4 p-8 max-h-[90vh] overflow-y-auto">
        {success ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <i className="fa-solid fa-check text-green-600 text-4xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Bienvenido a Premium! 🎉
            </h2>
            <p className="text-gray-600">
              Tu cuenta ha sido actualizada exitosamente
            </p>
          </div>
        ) : showCheckout ? (
          <MercadoPagoCheckout 
            onSuccess={handleSuccess} 
            onClose={() => setShowCheckout(false)}
          />
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4">
                <i className="fa-solid fa-crown text-white text-3xl"></i>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Actualiza a Premium
              </h2>
              <p className="text-gray-600">
                Desbloquea todo el potencial de PDF Extractor
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
              <div className="text-center mb-4">
                <span className="text-4xl font-bold text-gray-900">$8.99</span>
                <span className="text-gray-600"> USD / mes</span>
                <div className="text-sm text-gray-600 mt-1">o $9,200 ARS / mes</div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-check text-green-500 mt-1"></i>
                  <span className="text-gray-700"><strong>Cargas ilimitadas</strong> de PDFs</span>
                </div>
                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-check text-green-500 mt-1"></i>
                  <span className="text-gray-700"><strong>Procesamiento prioritario</strong></span>
                </div>
                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-check text-green-500 mt-1"></i>
                  <span className="text-gray-700"><strong>Soporte premium</strong> 24/7</span>
                </div>
                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-check text-green-500 mt-1"></i>
                  <span className="text-gray-700"><strong>Exportación avanzada</strong> a múltiples formatos</span>
                </div>
                <div className="flex items-start gap-3">
                  <i className="fa-solid fa-check text-green-500 mt-1"></i>
                  <span className="text-gray-700"><strong>Sin publicidad</strong></span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg"
              >
                <span className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-crown"></i>
                  Continuar al Pago
                </span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancelar
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <p className="text-xs text-blue-800">
                <i className="fa-solid fa-shield-alt mr-2"></i>
                Pago seguro procesado por <strong>MercadoPago</strong>. Cancela cuando quieras.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
