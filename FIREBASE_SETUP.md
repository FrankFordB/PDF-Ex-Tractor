# PDF Ex-Tractor - Configuración de Firebase

## Configuración Inicial

### 1. Crear proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. **IMPORTANTE:** Habilita la facturación (requerido para Firestore)
   - Ve a [Billing Console](https://console.developers.google.com/billing/enable?project=pdf-ex--tractor)
   - O desde Firebase Console: Configuración del proyecto (⚙️) > Uso y facturación > Detalles y configuración
   - Selecciona o crea una cuenta de facturación
   - **No te preocupes:** El plan gratuito (Spark) incluye cuotas generosas sin costo
   - Firestore gratis incluye: 1GB almacenamiento, 50K lecturas/día, 20K escrituras/día
4. Habilita **Authentication** (Email/Password)
5. Habilita **Firestore Database**

### 2. Configurar Authentication

1. Ve a Authentication > Sign-in method
2. Habilita "Email/Password"
3. Habilita "Google"
   - Click en "Google" en la lista de proveedores
   - Activa el toggle "Habilitar"
   - Selecciona un email de soporte del proyecto
   - Guarda los cambios
4. Guarda todos los cambios

### 3. Configurar Firestore

1. Ve a Firestore Database
2. Crea una nueva base de datos en modo de producción
3. **IMPORTANTE:** Configura las reglas de seguridad correctamente:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para la colección de usuarios
    match /users/{userId} {
      // Permitir lectura solo al usuario autenticado
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Permitir creación cuando el usuario se registra
      allow create: if request.auth != null 
        && request.auth.uid == userId
        && request.resource.data.email == request.auth.token.email;
      
      // Permitir actualización solo al propietario
      allow update: if request.auth != null 
        && request.auth.uid == userId;
      
      // No permitir eliminar
      allow delete: if false;
    }
    
    // Reglas para la colección de facturas (privadas por usuario)
    match /invoices/{invoiceId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

**⚠️ IMPORTANTE:** Debes copiar y pegar estas reglas exactamente en Firebase Console > Firestore Database > Reglas, luego hacer click en "Publicar".

### 4. Variables de Entorno

1. Copia `.env.example` a `.env`
2. Completa las credenciales de Firebase en `.env`
3. **NUNCA** subas el archivo `.env` a Git

### 5. Estructura de Usuarios en Firestore

Cada documento de usuario tiene la siguiente estructura:

```javascript
{
  email: "usuario@email.com",
  firstName: "Juan",
  lastName: "Pérez",
  country: "Argentina",
  state: "Buenos Aires",
  city: "La Plata",
  phone: "+54 11 1234-5678",
  accountType: "free", // 'free' o 'premium'
  pdfUploaded: 0,
  maxPdfLimit: 5, // 5 para free (por semana), -1 para premium (ilimitado)
  weekStartDate: "2025-12-13T...", // Fecha de inicio de la semana actual
  createdAt: "2025-12-13T...",
  updatedAt: "2025-12-13T..."
}
```

**Nota:** Los usuarios que se registran con Google pueden tener algunos campos vacíos (country, state, city) ya que Google no proporciona esta información. Estos campos se pueden completar posteriormente si se implementa un perfil de usuario editable.

## Niveles de Usuarios

### Sin Registro (Guest)
- **Límite:** 3 PDFs
- **Almacenamiento:** LocalStorage
- **Persistencia:** Solo en el navegador

### Gratuito (Free)
- **Límite:** 5 PDFs por semana
- **Almacenamiento:** Firestore
- **Características:** Guardado en la nube, acceso desde cualquier dispositivo, reseteo automático semanal

### Premium
- **Límite:** Ilimitado
- **Precio:** $8.99 USD/mes
- **Características:** 
  - Cargas ilimitadas
  - Procesamiento prioritario
  - Soporte premium 24/7
  - Sin publicidad

## Seguridad

- Las credenciales están en variables de entorno
- El archivo `.env` está en `.gitignore`
- Las contraseñas se hashean automáticamente con Firebase Auth
- Autenticación con Google usando OAuth 2.0 (sin almacenar contraseñas)
- Las reglas de Firestore protegen los datos de usuario

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Notas Importantes

- **Facturación requerida:** Firestore necesita facturación habilitada, pero el plan gratuito es muy generoso
  - 1 GB de almacenamiento
  - 50,000 lecturas por día
  - 20,000 escrituras por día
  - 20,000 eliminaciones por día
  - **Suficiente para desarrollo y proyectos pequeños SIN COSTO**
- El sistema de pagos actual es DEMO. Para producción, integra Stripe, PayPal o MercadoPago
- Configura las reglas de Firestore según tus necesidades de seguridad
- Implementa rate limiting en producción
- Considera agregar verificación de email

## 🐛 Problemas Comunes

### Error: "This API method requires billing to be enabled"
**Solución:**
1. Ve a [Billing Console](https://console.cloud.google.com/billing)
2. Selecciona tu proyecto "pdf-ex--tractor"
3. Vincula una cuenta de facturación (puedes crear una nueva)
4. Espera 5 minutos para que se propague
5. Vuelve a intentar crear Firestore

### Error: "Missing or insufficient permissions"
**Solución:**
1. Ve a Firebase Console > Firestore Database > Reglas
2. Copia y pega las reglas correctas (ver sección 3 arriba)
3. Haz click en "Publicar" para aplicar las reglas
4. Espera 1-2 minutos para que se propaguen
5. Intenta registrarte nuevamente

**Reglas correctas (copia esto):**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;
    }
  }
}
```

### Error: "Email already in use" / "auth/email-already-in-use"
**Solución:**
- Este email ya está registrado en el sistema
- Opciones:
  1. Usa el botón "Iniciar Sesión" en lugar de "Registrarse"
  2. Recupera tu contraseña si la olvidaste
  3. Usa un email diferente para crear una nueva cuenta

### Error: Authentication no funciona
**Solución:**
1. Verifica que Email/Password esté habilitado en Firebase Console > Authentication > Sign-in method
2. Revisa que las credenciales en `.env` sean correctas
3. Asegúrate de que el proyecto de Firebase esté activo

### Error: "Invalid email" / "auth/invalid-email"
**Solución:**
- Verifica que el formato del email sea correcto (ejemplo@dominio.com)
- No uses espacios antes o después del email

### Error: "Weak password" / "auth/weak-password"
**Solución:**
- La contraseña debe tener al menos 6 caracteres
- Usa una combinación de letras, números y símbolos

### Error: Google Sign-In no funciona / "popup-blocked"
**Solución:**
1. Verifica que Google esté habilitado en Firebase Console > Authentication > Sign-in method
2. Permite las ventanas emergentes en tu navegador:
   - Chrome: Click en el ícono de candado/información en la barra de direcciones > Configuración del sitio > Ventanas emergentes y redirecciones > Permitir
   - Firefox: Click en el ícono de escudo > Desactivar el bloqueo de ventanas emergentes para este sitio
3. Si usas bloqueadores de anuncios (AdBlock, uBlock), desactívalos temporalmente
4. Intenta en modo incógnito/privado
5. Verifica que la URL de tu aplicación esté autorizada en Firebase Console:
   - Authentication > Settings > Authorized domains
   - Agrega `localhost` para desarrollo

### Error: "cancelled-popup-request" / "popup-closed-by-user"
**Solución:**
- El usuario cerró la ventana de Google antes de completar el inicio de sesión
- Simplemente intenta de nuevo y completa el proceso de autenticación

### Error: No se puede leer/escribir en Firestore
**Solución:**
1. Verifica que las reglas de Firestore estén configuradas (ver arriba)
2. Revisa la consola del navegador para ver errores específicos
3. Asegúrate de estar autenticado antes de hacer operaciones
4. Verifica que la facturación esté habilitada
