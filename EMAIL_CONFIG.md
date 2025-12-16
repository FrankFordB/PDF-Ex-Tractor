# 📧 Configuración de Email para Cancelación de Suscripciones

## Resumen
Este documento explica cómo configurar el envío automático de emails cuando un usuario cancela su suscripción Premium.

## ⚙️ Configuración de Firebase Functions

### 1. Instalar Dependencias

En la carpeta `functions/`, ejecuta:

```bash
cd functions
npm install
```

Esto instalará `@sendgrid/mail` que necesitas para enviar emails.

### 2. Configurar Variables de Entorno en Firebase

Necesitas configurar las credenciales de email en Firebase. Hay dos opciones:

#### Opción A: Usar SendGrid (Recomendado - Gratis hasta 100 emails/día)

1. **Crear cuenta en SendGrid:**
   - Ve a https://signup.sendgrid.com/
   - Crea una cuenta gratuita (100 emails/día gratis)
   - Verifica tu email

2. **Obtener API Key:**
   - Ve a Settings → API Keys
   - Click en "Create API Key"
   - Nombre: `PDF Extractor Functions`
   - Tipo: `Full Access` o `Restricted Access` (solo Mail Send)
   - Copia la API Key (solo se muestra una vez)

3. **Verificar dominio del remitente:**
   - Ve a Settings → Sender Authentication
   - Click en "Verify a Single Sender"
   - Ingresa tu email (ej: noreply@tudominio.com o tu email personal)
   - Verifica el email que te envía SendGrid

4. **Configurar en Firebase:**

```bash
firebase functions:config:set sendgrid.apikey="SG.tu-api-key-aqui"
firebase functions:config:set sendgrid.fromemail="tu-email-verificado@ejemplo.com"
```

#### Opción B: Usar Gmail (Solo para desarrollo/testing)

1. **Habilitar "Contraseñas de aplicación" en Gmail:**
   - Ve a https://myaccount.google.com/security
   - Activa verificación en 2 pasos
   - Ve a "Contraseñas de aplicaciones"
   - Genera una contraseña para "Correo"
   - Copia la contraseña de 16 caracteres

⚠️ **Nota:** Gmail tiene límites muy estrictos (500 emails/día) y puede bloquear tu cuenta.
### 3. Configurar la URL de tu aplicación

```bash
firebase functions:config:set app.url="https://tu-dominio.com"
```

### 4. Ver configuración actual

```bash
firebase functions:config:get
```

### 5. Desplegar las Functions

```bash
firebase deploy --only functions
```

## 🧪 Probar localmente

Para probar en el emulador local:

1. Exporta las variables:
```bash
cd functions
firebase functions:config:get > .runtimeconfig.json
```

2. Ejecuta el emulador:
```bash
firebase emulators:start --only functions
```

## 📨 Email de Cancelación

### Contenido del Email

El email incluye:
- ❌ Título: "Suscripción Premium Cancelada"
- 📋 Lista de beneficios perdidos:
  - PDFs ilimitados (vuelve a 5/semana)
  - Almacenamiento en la nube permanente
  - Soporte prioritario 24/7
  - Exportación avanzada
  - Procesamiento por lotes
  - Sin anuncios
- 🔒 Confirmación de que **no habrá más cobros automáticos**
- ✅ Beneficios que aún tiene (plan gratuito)
- 🔗 Botón para volver a la app

### Personalización

Puedes personalizar el template del email editando el HTML en:
```
functions/index.js -> exports.sendCancellationEmail
```

## 🔧 Solución de Problemas

### Error: "Unauthorized" o "API key invalid"
- Verifica que copiaste correctamente la API Key de SendGrid
- Asegúrate de que la API Key tenga permisos de "Mail Send"
- Regenera una nueva API Key si es necesario

### Error: "The from address does not match a verified Sender Identity"
- Ve a SendGrid → Settings → Sender Authentication
- Verifica que el email en `sendgrid.fromemail` esté verificado
- Completa el proceso de verificación del email

### Error: "Invalid login credentials" (Gmail)
- Verifica que uses una "contraseña de aplicación" de Gmail, no tu contraseña normal
- Asegúrate de tener verificación en 2 pasos activada

### Error: "functions.config() is not a function"
- Verifica que hayas desplegado las functions con `firebase deploy --only functions`
- En desarrollo, asegúrate de tener `.runtimeconfig.json`

### El email no llega
- Revisa la carpeta de spam
- Verifica los logs: `firebase functions:log`
- Comprueba que el email del usuario sea correcto

### Error: "Missing required module"
- Ejecuta `npm install` en la carpeta `functions/`
- Vuelve a desplegar: `firebase deploy --only functions`

## 🚀 Producción

Para producción con SendGrid:

1. **Actualizar plan de SendGrid** si necesitas más de 100 emails/día
2. **Verificar dominio completo** (no solo single sender):
   - Ve a Sender Authentication → Domain Authentication
   - Añade registros DNS de tu dominio
   - Esto mejora la deliverability y evita spam
3. **Configurar SPF, DKIM y DMARC** (SendGrid lo hace automático con domain authentication)
4. **Monitorear entregas** con el dashboard de SendGrid
5. **Configurar rate limiting** en Firebase Functions para evitar abusos
6. **Usar plantillas de SendGrid** para emails más profesionales (opcional)

## 📊 Monitoreo

Ver logs de emails enviados:
```bash
firebase functions:log --only sendCancellationEmail
```

Ver métricas en Firebase Console:
- Ve a Functions
- Selecciona `sendCancellationEmail`
- Ve las invocaciones, errores y latencia

## 🔐 Seguridad

- ❌ **NUNCA** subas contraseñas al repositorio
- ✅ Usa variables de entorno de Firebase
- ✅ En producción, usa servicios profesionales con API keys
- ✅ Implementa rate limiting para prevenir spam

## 💡 Tips

1. **Personaliza el diseño**: Edita el HTML del email para que coincida con tu marca
2. **Traduce el contenido**: Cambia los textos según tu audiencia
3. **Añade más información**: Puedes incluir estadísticas de uso, encuestas, etc.
4. **Prueba antes de producción**: Envía emails de prueba a ti mismo

## 📝 Notas

- La función `sendCancellationEmail` es llamable desde el cliente (httpsCallable)
- Si el envío de email falla, la cancelación de suscripción **NO** falla
- El email se envía de forma asíncrona para no bloquear la operación
- Los errores de email solo se logean, no se muestran al usuario

---

**Última actualización**: 2024
**Mantenido por**: Tu Equipo
