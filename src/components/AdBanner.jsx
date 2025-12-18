import { useEffect } from 'react'

/**
 * AdBanner - Component placeholder para PropellerAds
 * 
 * INSTRUCCIONES PARA CONFIGURAR PROPELLERADS:
 * 
 * 1. Regístrate en PropellerAds:
 *    - Ve a https://propellerads.com/advertisers/
 *    - Crea una cuenta (es gratis y aceptan apps/herramientas)
 * 
 * 2. Agrega tu sitio:
 *    - En el dashboard, agrega tu dominio: pdf-ex-tractor.vercel.app
 *    - Tipo de sitio: "Web Application" o "Tool/Utility"
 * 
 * 3. Crea 4 "Ad Zones" (unidades publicitarias):
 *    Sidebar izquierdo (debajo de "Reiniciar App"):
 *      - Zone 1: Multi-Tag (Responsive) - horizontal banner
 *      - Zone 2: Multi-Tag (Responsive) - horizontal banner
 *      - Zone 3: Multi-Tag (Responsive) - horizontal banner
 *    Sidebar derecho (debajo de UsagePanel):
 *      - Zone 4: Multi-Tag (Responsive) - vertical banner
 * 
 * 4. Obtén los Zone IDs:
 *    - PropellerAds te dará un código como:
 *      <script type="text/javascript">var propellerads_zone_id = "123456";</script>
 *      <script type="text/javascript" src="//example.propellerads.com/..."></script>
 *    - Copia los zone IDs (ej: "123456") y úsalos abajo
 * 
 * 5. Reemplaza este componente con el código real de PropellerAds
 */

export default function AdBanner({ zoneId, format = 'auto', style = {} }) {
  useEffect(() => {
    // Aquí irá el código de inicialización de PropellerAds
    // Por ahora solo mostramos placeholder
    console.log('AdBanner placeholder - Zone ID:', zoneId)
  }, [zoneId])

  // Mostrar placeholder en desarrollo
  if (process.env.NODE_ENV !== 'production') {
    return (
      <div style={{
        minHeight: format === 'vertical' ? '250px' : '90px',
        backgroundColor: '#f3f4f6',
        border: '2px dashed #9ca3af',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        ...style
      }}>
        <div className="text-center text-gray-600 text-sm">
          <i className="fa-solid fa-ad text-2xl mb-2"></i>
          <p className="font-semibold">PropellerAds Placeholder</p>
          <p className="text-xs mt-1">Zone ID: {zoneId}</p>
          <p className="text-xs text-gray-500">(Solo visible en producción)</p>
        </div>
      </div>
    )
  }

  // En producción, retornar el div donde PropellerAds inyectará el anuncio
  // IMPORTANTE: Deberás reemplazar esto con el código real de PropellerAds
  return (
    <div 
      id={`propeller-zone-${zoneId}`}
      style={{
        minHeight: format === 'vertical' ? '250px' : '90px',
        ...style
      }}
    >
      {/* PropellerAds inyectará el anuncio aquí */}
    </div>
  )
}
