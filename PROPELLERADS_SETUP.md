# Guía de Integración: PropellerAds

## ¿Por qué PropellerAds en lugar de AdSense?

**Google AdSense rechazó el sitio** con el mensaje: *"Anuncios servidos por Google en pantallas sin contenido del editor"*

### Motivos del rechazo:
1. **AdSense requiere contenido editorial**: Blogs, artículos, noticias, tutoriales
2. **No acepta apps/herramientas puras**: Aunque la app procesa PDFs, AdSense la considera "sin contenido"
3. **Políticas estrictas**: Necesita ser un sitio de contenido, no una aplicación web interactiva

### Solución: PropellerAds
PropellerAds es una red publicitaria alternativa que:
- ✅ **Acepta apps y herramientas web**
- ✅ **No requiere contenido editorial extenso** (aunque lo agregamos para SEO)
- ✅ **Aprobación más rápida** (24-48 horas)
- ✅ **CPM competitivo** para apps SaaS

---

## Pasos para Configurar PropellerAds

### 1. Registro en PropellerAds

1. Ve a: https://propellerads.com/publishers/
2. Crea una cuenta (Publisher/Webmaster)
3. Verifica tu email

### 2. Agregar tu Sitio

1. En el dashboard, haz clic en **"Add Website"**
2. URL del sitio: `https://pdf-ex-tractor.vercel.app`
3. Tipo de sitio:
   - Categoría: **Software & Applications**
   - Subcategoría: **Business Tools**
4. Tráfico mensual estimado: **1,000 - 10,000** visitantes
5. Submit y espera aprobación (usualmente 24-48 horas)

### 3. Crear Zonas Publicitarias (Ad Zones)

Una vez aprobado tu sitio, crea 4 "Ad Zones":

#### **Zone 1: Sidebar Izquierdo - Banner 1**
- **Nombre**: Sidebar Left Banner 1
- **Ad Format**: Multi-Tag (Responsive)
- **Placement**: Below "Reiniciar App" button
- **Size**: 320x100 (responsive)

#### **Zone 2: Sidebar Izquierdo - Banner 2**
- **Nombre**: Sidebar Left Banner 2
- **Ad Format**: Multi-Tag (Responsive)
- **Placement**: Below Zone 1
- **Size**: 320x100 (responsive)

#### **Zone 3: Sidebar Izquierdo - Banner 3**
- **Nombre**: Sidebar Left Banner 3
- **Ad Format**: Multi-Tag (Responsive)
- **Placement**: Below Zone 2
- **Size**: 320x100 (responsive)

#### **Zone 4: Sidebar Derecho - Banner Vertical**
- **Nombre**: Sidebar Right Vertical Banner
- **Ad Format**: Multi-Tag (Responsive)
- **Placement**: Below UsagePanel
- **Size**: 300x250 (responsive)

### 4. Obtener Zone IDs y Script

Para cada zona, PropellerAds te dará un código similar a:

```html
<script type="text/javascript">
	var propeller_zone_id = "123456";
</script>
<script type="text/javascript" src="//example.propellerads.com/propeller.js"></script>
```

**Guarda los Zone IDs** (ej: 123456, 234567, 345678, 456789)

### 5. Integrar en el Proyecto

#### A. Agregar Script Global

**Archivo**: `index.html`

Reemplaza el comentario de PropellerAds con el script base de PropellerAds:

```html
<!-- PropellerAds Global Script -->
<script type="text/javascript">
  // Este script se carga una vez
  (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//example.propellerads.com/propeller.js"; // REEMPLAZAR con tu URL
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'propeller-sdk'));
</script>
```

#### B. Actualizar AdBanner Component

**Archivo**: `src/components/AdBanner.jsx`

Reemplaza el código del componente con:

```javascript
import { useEffect } from 'react'

export default function AdBanner({ zoneId, format = 'auto', style = {} }) {
  useEffect(() => {
    // Cargar anuncio de PropellerAds
    if (typeof window.propeller !== 'undefined' && process.env.NODE_ENV === 'production') {
      try {
        window.propeller.zone_id = zoneId
        window.propeller.push({})
      } catch (err) {
        console.error('Error cargando PropellerAds:', err)
      }
    }
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
        </div>
      </div>
    )
  }

  return (
    <div 
      id={`propeller-zone-${zoneId}`}
      style={{
        minHeight: format === 'vertical' ? '250px' : '90px',
        textAlign: 'center',
        ...style
      }}
    >
      <script type="text/javascript">
        {`var propeller_zone_id = ${zoneId};`}
      </script>
    </div>
  )
}
```

#### C. Actualizar Zone IDs en los Componentes

**Archivo**: `src/components/Sidebar.jsx`

Reemplaza `ZONE_1_ID`, `ZONE_2_ID`, `ZONE_3_ID` con tus Zone IDs reales:

```javascript
<AdBanner zoneId="123456" format="auto" style={{ minHeight: '90px' }} />
<AdBanner zoneId="234567" format="auto" style={{ minHeight: '90px' }} />
<AdBanner zoneId="345678" format="auto" style={{ minHeight: '90px' }} />
```

**Archivo**: `src/MainApp.jsx`

Reemplaza `ZONE_4_ID`:

```javascript
<AdBanner zoneId="456789" format="vertical" style={{ minHeight: '250px' }} />
```

### 6. Testing Local

```bash
npm run dev
```

Verás placeholders en desarrollo. Los anuncios reales solo se muestran en producción.

### 7. Deploy a Producción

```bash
npm run build
vercel --prod
```

### 8. Verificar en PropellerAds Dashboard

- Espera 24-48 horas para ver impresiones
- Revisa estadísticas en: Dashboard → Statistics
- Pagos mínimos: $5 USD (PayPal, Payoneer, Wire Transfer)

---

## Ingresos Estimados

Con **1,000 visitantes/mes**:
- CPM promedio: $0.50 - $2.00
- 4 anuncios = 4,000 impresiones/mes
- **Ingreso estimado**: $2 - $8 USD/mes

Con **10,000 visitantes/mes**:
- **Ingreso estimado**: $20 - $80 USD/mes

---

## Comparación: Publicidad vs Premium

| Método | Esfuerzo | Ingreso Mensual (1k visitas) | Ingreso Mensual (10k visitas) |
|--------|----------|------------------------------|-------------------------------|
| PropellerAds | Bajo | $2-8 USD | $20-80 USD |
| Premium ($9.99/mes) | Medio | $99 USD (10 usuarios) | $999 USD (100 usuarios) |

**Recomendación**: Usar **ambos**:
1. **PropellerAds** para usuarios gratuitos → ingresos pasivos
2. **Premium** como fuente principal de ingresos

---

## Soporte

**PropellerAds Support**:
- Email: publishers@propellerads.com
- FAQ: https://propellerads.com/faq/
- Live Chat: Dashboard → Support

**Documentación Técnica**:
- https://docs.propellerads.com/display/PROPUB/Publisher+API
