# 🎯 CONFIGURACIÓN COMPLETA - Listo para Usar

## ✅ Todo Implementado:

### 1. **Panel de Administración** ⭐
- Dashboard completo con estadísticas
- Gestión de usuarios
- Cambiar suscripciones
- Super Admin: `franco_burgoa1@hotmail.com`

### 2. **MercadoPago con Redirección Real**
- Integración completa
- Suscripción de 1 mes
- Soporte USD y ARS
- Backend con Firebase Functions

### 3. **Panel de Usuario Arreglado**
- Actualización de perfil funcional
- Gestión de suscripción
- Preferencias

---

## 🚀 INICIO RÁPIDO (3 pasos)

### Paso 1: Registrar Super Admin

1. Abre tu app
2. Clic en **"Registrarse"**
3. Email: `franco_burgoa1@hotmail.com`
4. Contraseña: `Luciano_11`
5. Completa datos y registra
6. ¡Verás el botón "Admin" en el header!

### Paso 2: Desplegar Backend (5 minutos)

```bash
# 1. Inicializar Functions
cd "c:/Users/FrankFord/Desktop/pdf-extractor/Extractor pdf/pdf-extractor"
firebase init functions

# 2. Configurar MercadoPago
firebase functions:config:set mercadopago.access_token="APP_USR-3466057669134621-121314-ef2a5735591c60030d1ad4af30bc9345-3063227304"

# 3. Desplegar
cd functions
npm install
cd ..
firebase deploy --only functions
```

### Paso 3: Configurar Webhook

1. Ve a: https://www.mercadopago.com.ar/developers/panel/app
2. Tu aplicación → **Webhooks**
3. Agrega: `https://us-central1-pdf-ex--tractor.cloudfunctions.net/mercadopagoWebhook`
4. Eventos: **Pagos**

---

## 🎮 Probar Todo

### Panel de Admin
1. Login: `franco_burgoa1@hotmail.com` / `Luciano_11`
2. Clic botón **"Admin"** (morado/rosa)
3. Ver todos los usuarios
4. Cambiar suscripciones

### Panel de Usuario
1. Login con cualquier cuenta
2. Avatar → **"Configuración"**
3. Editar perfil → Guardar
4. Ver suscripción

### MercadoPago

**Modo Simulación (actual)**:
- Clic "Actualizar a Premium" → Upgrade inmediato

**Modo Real (después de deploy)**:
- Clic "Actualizar a Premium"
- Redirección a MercadoPago
- Tarjeta TEST: `4509 9535 6623 3704` / CVV: `123` / Venc: `11/25`
- Pagar y regresar

---

## 📁 Archivos Creados

- ✅ `functions/index.js` - Backend Functions
- ✅ `functions/package.json` - Dependencias
- ✅ `src/components/AdminDashboard.jsx` - Panel admin
- ✅ `src/components/MercadoPagoCheckout.jsx` - Checkout actualizado
- ✅ `src/contexts/AuthContext.jsx` - Funciones admin agregadas
- ✅ `.env.local` - Variables configuradas

---

## 💡 Características

✅ Super admin (solo tu email)  
✅ Dashboard con estadísticas  
✅ Gestión de usuarios  
✅ Cambiar suscripciones  
✅ Actualización de perfil  
✅ MercadoPago real  
✅ Suscripción 1 mes  
✅ Webhook automático  
✅ Expiración automática  

---

## 🐛 Solución Rápida

**No veo botón Admin**: Login con el email correcto  
**No redirecciona**: Despliega Functions primero  
**Error al guardar perfil**: Reinicia la app

---

¡Todo listo! Reinicia tu app y empieza a usar el sistema completo 🚀
