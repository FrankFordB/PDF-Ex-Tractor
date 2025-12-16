# 🚀 Configuración Rápida de SendGrid

## Paso 1: Crear Cuenta SendGrid (GRATIS)

1. Ve a **https://signup.sendgrid.com/**
2. Regístrate con tu email
3. Verifica tu email
4. Plan: **Free** (100 emails/día gratis - perfecto para empezar)

---

## Paso 2: Obtener API Key

1. Inicia sesión en SendGrid
2. Ve a **Settings** → **API Keys**
3. Click en **"Create API Key"**
4. Configuración:
   - **Name**: `PDF Extractor Functions`
   - **API Key Permissions**: `Full Access` (o `Restricted Access` con solo `Mail Send` activado)
5. Click **"Create & View"**
6. **⚠️ IMPORTANTE**: Copia la API Key AHORA (solo se muestra una vez)
   ```
   SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

---

## Paso 3: Verificar Email Remitente

1. En SendGrid, ve a **Settings** → **Sender Authentication**
2. Click en **"Verify a Single Sender"**
3. Completa el formulario:
   - **From Name**: PDF Extractor
   - **From Email Address**: tu-email@gmail.com (o tu dominio)
   - **Reply To**: (mismo email)
   - Dirección, ciudad, país (info básica)
4. Click **"Create"**
5. **Revisa tu email** y click en el link de verificación de SendGrid
6. ✅ Una vez verificado, verás un check verde

---

## Paso 4: Configurar Firebase Functions

Abre tu terminal y ejecuta estos comandos:

```bash
# Configurar API Key de SendGrid
firebase functions:config:set sendgrid.apikey="SG.tu-api-key-aqui"

# Configurar email remitente (el que verificaste en paso 3)
firebase functions:config:set sendgrid.fromemail="tu-email@gmail.com"

# Configurar URL de tu app
firebase functions:config:set app.url="https://tu-dominio.com"

# Ver configuración (para verificar)
firebase functions:config:get
```

**Ejemplo real:**
```bash
firebase functions:config:set sendgrid.apikey="SG.abc123def456..."
firebase functions:config:set sendgrid.fromemail="noreply@pdfextractor.com"
firebase functions:config:set app.url="https://pdfextractor.com"
```

---

## Paso 5: Desplegar a Firebase

```bash
# Desplegar solo las functions
firebase deploy --only functions

# O desplegar todo (hosting + functions)
firebase deploy
```

Espera 1-2 minutos mientras se despliega...

✅ **¡Listo! Los emails ya funcionarán automáticamente.**

---

## 🧪 Probar que Funciona

1. En tu app, inicia sesión con un usuario premium
2. Ve a **Configuración** → **Suscripción**
3. Click en **"Cancelar Suscripción"**
4. Confirma la cancelación
5. **Revisa tu email** - deberías recibir el email de confirmación de SendGrid

---

## 📊 Verificar Envíos en SendGrid

1. Ve a **Activity** en el dashboard de SendGrid
2. Verás todos los emails enviados, entregados, abiertos, etc.
3. Si hay errores, aparecerán aquí con detalles

---

## ⚠️ Límites del Plan Gratuito

- **100 emails/día** gratis
- Ideal para desarrollo y proyectos pequeños
- Si necesitas más:
  - **Essentials**: 40,000 emails/mes por $15/mes
  - **Pro**: 100,000 emails/mes por $90/mes

---

## 🔧 Solución de Problemas Comunes

### ❌ Error: "Unauthorized" o "Invalid API Key"
- Verifica que copiaste correctamente la API Key
- Regenera una nueva API Key en SendGrid
- Vuelve a configurar: `firebase functions:config:set sendgrid.apikey="nueva-key"`

### ❌ Error: "The from address does not match a verified Sender"
- Verifica que el email en `sendgrid.fromemail` esté verificado en SendGrid
- Ve a Settings → Sender Authentication y verifica que tenga check verde

### ❌ El email no llega
1. Revisa la carpeta de **SPAM**
2. Ve al **Activity Feed** de SendGrid para ver si se envió
3. Verifica los logs de Firebase:
   ```bash
   firebase functions:log --only sendCancellationEmail
   ```

### ❌ Error al desplegar functions
```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

---

## 💡 Tips Pro

1. **Usa un dominio personalizado** para emails más profesionales:
   - En vez de `tuemail@gmail.com`
   - Usa `noreply@tudominio.com`

2. **Configura Domain Authentication** (para producción):
   - SendGrid → Sender Authentication → Domain Authentication
   - Mejora deliverability al 99%

3. **Monitorea estadísticas**:
   - SendGrid te muestra: enviados, entregados, abiertos, clicks, bounces

4. **Plantillas de SendGrid** (opcional):
   - Crea plantillas visuales en SendGrid
   - Úsalas en el código para emails más bonitos

---

## 📝 Checklist Final

- [ ] Cuenta SendGrid creada
- [ ] API Key obtenida y guardada
- [ ] Email remitente verificado (check verde en SendGrid)
- [ ] `firebase functions:config:set` ejecutados (3 comandos)
- [ ] `firebase deploy --only functions` exitoso
- [ ] Email de prueba recibido ✅

---

**¿Todo listo?** ¡Perfecto! Tus usuarios ahora recibirán emails automáticos cuando cancelen su suscripción 🎉
