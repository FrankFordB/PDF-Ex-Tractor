# Configuración de Firestore

## ⚠️ IMPORTANTE: Publicar Reglas de Seguridad

Para que los datos se guarden correctamente POR USUARIO, debes publicar las reglas de seguridad en Firebase Console:

### Paso 1: Ir a Firebase Console
1. Ve a https://console.firebase.google.com
2. Selecciona tu proyecto
3. En el menú lateral, busca **Firestore Database**
4. Ve a la pestaña **Reglas** (Rules)

### Paso 2: Copiar y Pegar las Reglas
Copia el contenido del archivo `firestore.rules` y pégalo en el editor de reglas de Firebase Console.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Reglas para la colección de usuarios
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId;
      allow delete: if false;
    }
    
    // Reglas para la colección de facturas/invoices
    match /invoices/{invoiceId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update: if request.auth != null && request.auth.uid == resource.data.userId;
      allow delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Paso 3: Publicar
Haz clic en **Publicar** (Publish).

---

## 📊 Crear Índice Compuesto (Si es necesario)

Si ves un error en la consola del navegador que menciona "index" o "composite index", necesitas crear un índice:

### Opción 1: Desde el enlace automático
Firestore mostrará un enlace directo en el error de la consola. Haz clic en ese enlace para crear el índice automáticamente.

### Opción 2: Manual
1. Ve a **Firestore Database** → **Índices** (Indexes)
2. Haz clic en **Crear índice** (Create Index)
3. Configuración:
   - **Colección**: `invoices`
   - **Campos**:
     - Campo 1: `userId` - Orden: Ascendente
     - Campo 2: `createdAt` - Orden: Descendente
   - **Ámbito de consulta**: Colección
4. Haz clic en **Crear**
5. Espera unos minutos hasta que el índice esté listo (verás el estado "Creando" → "Habilitado")

---

## ✅ Verificar que todo funciona

Después de publicar las reglas y crear el índice:

1. Cierra sesión en tu app
2. Vuelve a iniciar sesión
3. Sube un PDF
4. Verifica que se guarde correctamente
5. Cierra sesión y vuelve a iniciar sesión
6. Verifica que solo veas TUS facturas (no las de otros usuarios)

---

## 🔧 Solución de Problemas

### "Los datos no se guardan por usuario"
- ✅ Asegúrate de haber publicado las reglas de seguridad
- ✅ Revisa la consola del navegador (F12) para ver errores
- ✅ Verifica que el `userId` se esté guardando correctamente (abre Firestore Console y mira los documentos)

### "No puedo eliminar ni finalizar las facturas"
- ✅ Asegúrate de haber publicado las reglas de seguridad
- ✅ Verifica que las facturas tengan el campo `userId` correcto

### "Error de índice"
- ✅ Sigue los pasos de "Crear Índice Compuesto" arriba
- ✅ Espera a que el índice esté completamente creado (puede tardar unos minutos)
