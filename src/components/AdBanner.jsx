import { useEffect } from 'react'

/**
 * Componente de banner publicitario de Google AdSense
 * @param {string} slot - ID del slot publicitario de AdSense
 * @param {string} format - Formato del anuncio: 'auto', 'horizontal', 'vertical', 'rectangle'
 * @param {boolean} responsive - Si el anuncio es responsive
 */
export default function AdBanner({ 
  slot = '1234567890', 
  format = 'auto',
  responsive = true,
  style = {}
}) {
  useEffect(() => {
    try {
      // Intentar cargar el anuncio
      if (window.adsbygoogle && process.env.NODE_ENV === 'production') {
        window.adsbygoogle.push({})
      }
    } catch (error) {
      console.error('Error cargando AdSense:', error)
    }
  }, [])

  // No mostrar ads en desarrollo
  if (process.env.NODE_ENV !== 'production') {
    return (
      <div className="bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg p-4 text-center text-gray-500 text-sm" style={style}>
        <i className="fa-solid fa-ad text-2xl mb-2"></i>
        <p>Publicidad (solo en producción)</p>
        <p className="text-xs mt-1">Slot: {slot}</p>
      </div>
    )
  }

  return (
    <div className="ad-container" style={{ textAlign: 'center', ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-2275948678152815" // REEMPLAZAR con tu Publisher ID
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  )
}
