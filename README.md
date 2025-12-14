# PDF Extractor - PDF Ex-Tractor 📄

Herramienta profesional para extraer información de facturas PDF de forma automática con sistema de autenticación y gestión de usuarios.

## 🚀 Características

- ✨ Extracción automática de campos de facturas
- 🔐 Sistema de autenticación con Firebase
- 👥 Tres niveles de usuario (Guest, Gratis, Premium)
- 📊 Exporta resultados a Excel
- 🔒 Datos seguros en Firestore
- 🌐 Funciona en la nube con sincronización
- 📱 Diseño responsive (móvil, tablet, desktop)
- 🤖 OCR fallback para PDFs escaneados
- 🔐 Soporte para PDFs encriptados (con contraseña)

## 👥 Niveles de Usuario

### Sin Registro (Guest)
- ✅ 3 cargas de PDF gratis
- ⚠️ Datos solo en navegador (localStorage)

### Gratuito (Free Account)
- ✅ 4 cargas de PDF
- ✅ Guardado en la nube
- ✅ Acceso desde cualquier dispositivo
- ✅ Historial de facturas

### Premium ($8.99 USD/mes)
- ✅ **Cargas ilimitadas** de PDFs
- ✅ Procesamiento prioritario
- ✅ Soporte premium 24/7
- ✅ Exportación avanzada
- ✅ Sin publicidad

## 📋 Campos Extraídos

- Beneficiario / Afiliado
- DNI
- CAE N°
- Fecha de Vto. de CAE
- Fecha de Emisión (calculada automáticamente)
- Comp. Nro
- CUIL
- Apellido y Nombre / Razón Social
- Importe Total

## 🔧 Configuración

### 1. Instalación

```bash
# Clonar o descargar el proyecto
cd pdf-extractor

# Instalar dependencias
npm install
```

### 2. Configurar Firebase

1. Lee [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) para instrucciones detalladas
2. Copia `.env.example` a `.env`
3. Completa tus credenciales de Firebase en `.env`

```bash
cp .env.example .env
# Edita .env con tus credenciales
```

### 3. Desarrollo

```bash
npm run dev
```

### 4. Producción

```bash
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

