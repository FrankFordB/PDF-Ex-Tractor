# Instrucciones de Inicio Rápido

## 🚀 Configuración Rápida en 5 Pasos

### 1️⃣ Instalar dependencias
```bash
npm install
```

### 2️⃣ Configurar Firebase
1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. Crear nuevo proyecto
3. **⚠️ IMPORTANTE:** Habilitar facturación (requerido para Firestore)
   - No te preocupes, el plan gratuito es muy generoso y NO tiene costo
   - Ve a: Configuración (⚙️) > Uso y facturación > Habilitar facturación
   - Cuota gratuita: 1GB + 50K lecturas/día + 20K escrituras/día
4. Habilitar Authentication:
   - Email/Password
   - Google (para login con cuenta de Google)
5. Habilitar Firestore Database

### 3️⃣ Configurar variables de entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env y agregar tus credenciales de Firebase
```

### 4️⃣ Configurar reglas de Firestore

En Firebase Console > Firestore Database > Rules:

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

**⚠️ IMPORTANTE:** Haz click en "Publicar" después de copiar las reglas.

### 5️⃣ Iniciar aplicación
```bash
npm run dev
```

## ✅ Verificación

Después de iniciar, deberías poder:
- ✅ Ver la pantalla de bienvenida
- ✅ Registrarte con email y contraseña o Google
- ✅ Iniciar sesión
- ✅ Subir PDFs (3 sin registro, 5 por semana con cuenta gratuita)
- ✅ Ver los límites de carga en pantalla y reseteo automático semanal

## 🐛 Problemas Comunes

### Error: "Missing or insufficient permissions"
- ✅ Ve a Firebase Console > Firestore Database > Reglas
- ✅ Copia las reglas correctas (ver paso 4️⃣ arriba)
- ✅ Haz click en "Publicar"
- ✅ Espera 1-2 minutos y vuelve a intentar

### Error: "This API method requires billing to be enabled"
- ✅ Habilita la facturación en Firebase Console (⚙️ > Uso y facturación)
- ✅ El plan gratuito NO tiene costo y es suficiente para desarrollo
- ✅ Espera 5 minutos después de habilitar la facturación

### Error: "Email already in use"
- ✅ El email ya está registrado
- ✅ Usa "Iniciar Sesión" en lugar de "Registrarse"
- ✅ O usa un email diferente

### Error: Google Sign-In bloqueado
- ✅ Permite ventanas emergentes en tu navegador
- ✅ Verifica que Google esté habilitado en Firebase Console > Authentication
- ✅ Desactiva temporalmente bloqueadores de anuncios
- ✅ Asegúrate que `localhost` esté en Authorized domains (Firebase Console)

### Error: "Firebase not configured"
- ✅ Verifica que el archivo `.env` exista
- ✅ Verifica que todas las variables VITE_FIREBASE_* estén configuradas

### Error de autenticación
- ✅ Verifica que Email/Password esté habilitado en Firebase Console
- ✅ Revisa las reglas de Firestore

### Error al subir PDFs
- ✅ Verifica que Firestore esté habilitado
- ✅ Revisa la consola del navegador para errores

## 📚 Documentación Adicional

- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Configuración detallada de Firebase
- [README.md](./README.md) - Documentación completa del proyecto

## 🆘 Soporte

Desarrollado por Franco Burgoa
LinkedIn: https://ar.linkedin.com/in/franco-burgoa-4a338514b
