# PDF Extractor - FacturasRobadas 📄

Herramienta para extraer información de facturas PDF de forma automática. Extrae CAE, fechas, números de comprobante, CUIL y montos totales.

## 🚀 Características

- ✨ Extracción automática de campos de facturas
- 🔐 Soporte para PDFs encriptados (con contraseña)
- 🤖 OCR fallback para PDFs escaneados
- 📱 Diseño responsive (móvil, tablet, desktop)
- 🌙 Modo oscuro/claro
- 📊 Exporta resultados a Excel
- 🌐 Funciona 100% en el navegador (sin servidor)

## 📋 Campos Extraídos

- CAE N°
- Fecha de Vto. de CAE
- Fecha de Emisión
- Comp. Nro
- CUIL
- Razón Social
- Importe Total

## 🛠️ Instalación Local

```bash
# Clonar o descargar el proyecto
cd pdf-extractor

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build
```

## 🌐 Desplegar en Vercel (3 Opciones)

### ✅ Opción 1: CLI de Vercel (Más rápido - 2 minutos)

1. **Instalar Vercel CLI** (si no lo tienes):
   ```bash
   npm install -g vercel
   ```

2. **Desplegar desde el directorio del proyecto**:
   ```bash
   cd "c:\Users\FrankFord\Desktop\pdf-extractor\Extractor pdf\pdf-extractor"
   vercel
   ```

3. **Seguir las preguntas interactivas**:
   - ¿Crear cuenta? → Elige la opción que corresponda
   - Nombre del proyecto → presiona Enter para aceptar "pdf-extractor"
   - ¿Desplegar? → Presiona Enter o escribe "y"

4. **¡Listo!** Te mostrará la URL pública en segundos ⚡

### 🔗 Opción 2: Desde GitHub (Recomendado - Actualizaciones automáticas)

1. **Subir a GitHub** (primera vez):
   ```bash
   cd "c:\Users\FrankFord\Desktop\pdf-extractor\Extractor pdf\pdf-extractor"
   git init
   git add .
   git commit -m "PDF Extractor - FacturasRobadas"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/pdf-extractor.git
   git push -u origin main
   ```

2. **Ir a Vercel**:
   - Visita https://vercel.com
   - Haz clic en "Add New..." → "Project"
   - Conecta tu repositorio de GitHub
   - Selecciona `pdf-extractor`
   - Framework: Vite (se detecta automáticamente)
   - Haz clic en "Deploy"

3. **Cada vez que hagas `git push`, se despliega automáticamente** 🎉

### 📤 Opción 3: Drag & Drop (Más fácil)

1. Ve a https://vercel.com/new
2. Haz clic en "Continue with GitHub" (u otra opción de login)
3. Haz clic en el botón de "Deploy"
4. Arrastra la carpeta `pdf-extractor` al área
5. Vercel lo procesará automáticamente

## 📱 Uso

1. Haz clic o arrastra un PDF a la zona de carga
2. La app extraerá los campos automáticamente
3. Copia los valores individuales o todos de una vez
4. Marca como "Finalizada" cuando termines
5. Exporta todo a Excel

## 🔧 Tecnologías

- **Frontend**: React 18 + Vite
- **Estilos**: Tailwind CSS
- **PDF**: pdfjs-dist
- **OCR**: tesseract.js
- **Excel**: xlsx
- **Iconos**: Font Awesome

## 📝 Notas de Privacidad

- ✅ Los datos se guardan **localmente en tu navegador**
- ✅ No se envía información a ningún servidor
- ✅ Los PDFs no dejan rastro en la nube
- ✅ Compatible con navegadores modernos

## ⚙️ Requisitos Vercel

- Node.js 16+ (Vercel lo tiene por defecto)
- npm o yarn
- 0 configuración necesaria (funciona automáticamente)

## 🐛 Si algo falla en Vercel

```bash
# Verifica que construye localmente
npm run build

# Si hay error, mira los logs:
vercel logs
```

## 🎨 Personalización

Para cambiar el nombre, logo, o colores, edita:
- `src/components/Header.jsx` - Nombre y descripción
- `tailwind.config.js` - Colores
- `src/index.css` - Estilos globales

---

**Creado por Franco Burgoa** 💚

