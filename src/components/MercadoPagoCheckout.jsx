import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function MercadoPagoCheckout({ onSuccess, onClose }) {
  const { user, upgradeToPremium } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preferenceId, setPreferenceId] = useState(null)

  const PRICE_USD = 8.99
  const PRICE_ARS = 9200

  const createPreference = async (currency) => {
    setLoading(true)
    setError('')

    try {
      const price = currency === 'USD' ? PRICE_USD : PRICE_ARS
      const accessToken = import.meta.env.VITE_MERCADOPAGO_ACCESS_TOKEN
      
      if (!accessToken) {
        throw new Error('Credenciales de MercadoPago no configuradas')
      }

      // Crear preferencia directamente con la API de MercadoPago
      const preference = {
        items: [
          {
            title: 'PDF Ex-Tractor Premium - Suscripción Mensual',
            description: 'PDFs ilimitados + Almacenamiento en la nube',
            quantity: 1,
            unit_price: price,
            currency_id: currency
          }
        ],
        payer: {
          email: user?.email || '',
          name: user?.displayName || ''
        },
        back_urls: {
          success: 'https://www.google.com',
          failure: 'https://www.google.com',
          pending: 'https://www.google.com'
        },
        external_reference: user?.uid,
        statement_descriptor: 'PDF Ex-Tractor'
      }

      console.log('📝 Creando preferencia de pago...')

      // Llamar directamente a la API de MercadoPago
      const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(preference)
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error de MercadoPago:', errorData)
        throw new Error(errorData.message || 'Error al crear preferencia de pago')
      }

      const data = await response.json()
      
      console.log('✅ Preferencia creada:', data.id)
      
      // Redirigir a MercadoPago
      if (data.init_point) {
        console.log('🔗 Redireccionando a MercadoPago...')
        window.location.href = data.init_point
      } else {
        throw new Error('No se recibió URL de pago')
      }
      
    } catch (err) {
      console.error('❌ Error:', err)
      setError(err.message || 'Error al procesar el pago. Por favor intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
          <img 
            src="https://http2.mlstatic.com/storage/logos-api-admin/a5f047d0-9be0-11ec-aad4-c3381f368aaf-m.svg" 
            alt="MercadoPago"
            className="h-12"
          />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Actualizar a Premium
        </h3>
        <p className="text-gray-600">
          Elige tu moneda preferida para el pago
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">
            <i className="fa-solid fa-exclamation-triangle mr-2"></i>
            {error}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {/* Opción Dólares */}
        <button
          onClick={() => createPreference('USD')}
          disabled={loading}
          className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="text-3xl mb-2">💵</div>
          <div className="text-2xl font-bold text-gray-900">
            ${PRICE_USD}
          </div>
          <div className="text-sm text-gray-600 mt-1">USD / mes</div>
          <div className="text-xs text-gray-500 mt-2">Tarjeta internacional</div>
        </button>

        {/* Opción Pesos Argentinos */}
        <button
          onClick={() => createPreference('ARS')}
          disabled={loading}
          className="p-6 border-2 border-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="text-3xl mb-2">🇦🇷</div>
          <div className="text-2xl font-bold text-gray-900">
            ${PRICE_ARS.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 mt-1">ARS / mes</div>
          <div className="text-xs text-blue-700 mt-2 font-medium">
            ⭐ Recomendado
          </div>
        </button>
      </div>

      {loading && (
        <div className="text-center py-4">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-blue-600 mb-2"></i>
          <p className="text-gray-600">Procesando pago...</p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">
          <i className="fa-solid fa-shield-alt mr-2 text-blue-600"></i>
          Incluye:
        </h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-center">
            <i className="fa-solid fa-check text-green-600 mr-2"></i>
            PDFs ilimitados por mes
          </li>
          <li className="flex items-center">
            <i className="fa-solid fa-check text-green-600 mr-2"></i>
            Almacenamiento en la nube permanente
          </li>
          <li className="flex items-center">
            <i className="fa-solid fa-check text-green-600 mr-2"></i>
            Soporte prioritario
          </li>
          <li className="flex items-center">
            <i className="fa-solid fa-check text-green-600 mr-2"></i>
            Exportación avanzada a Excel
          </li>
          <li className="flex items-center">
            <i className="fa-solid fa-check text-green-600 mr-2"></i>
            Cancela cuando quieras
          </li>
        </ul>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
          Métodos de pago aceptados:
        </h4>
        <div className="flex gap-2 flex-wrap">
          <div className="px-3 py-1 bg-white border rounded text-xs">
            <i className="fa-brands fa-cc-visa text-blue-600"></i> Visa
          </div>
          <div className="px-3 py-1 bg-white border rounded text-xs">
            <i className="fa-brands fa-cc-mastercard text-orange-600"></i> Mastercard
          </div>
          <div className="px-3 py-1 bg-white border rounded text-xs">
            <i className="fa-brands fa-cc-amex text-blue-400"></i> Amex
          </div>
          <div className="px-3 py-1 bg-white border rounded text-xs">
            💳 Débito
          </div>
          <div className="px-3 py-1 bg-white border rounded text-xs">
            🏦 Transferencia
          </div>
          <div className="px-3 py-1 bg-white border rounded text-xs">
            🏪 Efectivo (Rapipago/PagoFácil)
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-900 text-sm"
        >
          Cancelar
        </button>
      </div>

      <div className="text-xs text-gray-500 text-center">
        Procesado de forma segura por MercadoPago. Puedes cancelar tu suscripción en cualquier momento.
      </div>
    </div>
  )
}
