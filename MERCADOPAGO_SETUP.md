# 🚀 Configuración de MercadoPago - Guía Paso a Paso

## ✅ Estado Actual
- ✅ SDK de MercadoPago instalado
- ✅ Componente de pago creado (MercadoPagoCheckout)
- ✅ Interfaz de usuario lista
- ⏳ **Necesitas**: Obtener credenciales de MercadoPago

---

## 📋 Paso 1: Crear Cuenta en MercadoPago

1. Ve a: https://www.mercadopago.com.ar/developers
2. Haz clic en **"Crear cuenta"** o **"Ingresar"**
3. Completa el registro con tus datos
4. Verifica tu email

---

## 📋 Paso 2: Crear una Aplicación

1. Inicia sesión en el panel de desarrolladores
2. Ve a **"Tus aplicaciones"** o **"Your applications"**
3. Haz clic en **"Crear aplicación"**
4. Completa:
   - **Nombre**: PDF Ex-Tractor
   - **Descripción**: Extractor de datos de facturas PDF
   - **Modelo de integración**: Checkout Pro
5. Guarda la aplicación

---

## 📋 Paso 3: Obtener Credenciales TEST

1. En tu aplicación, ve a **"Credenciales"**
2. Selecciona **"Credenciales de prueba"** (TEST)
3. Copia:
   - **Public Key** (TEST-XXXXXXXX...)
   - **Access Token** (TEST-XXXXXXXX...)

4. Pégalas en el archivo `.env.local`:
   ```env
   VITE_MERCADOPAGO_PUBLIC_KEY=TEST-tu-public-key-aqui
   VITE_MERCADOPAGO_ACCESS_TOKEN=TEST-tu-access-token-aqui
   ```

---

## 📋 Paso 4: Crear Cuenta de Prueba

Para probar pagos SIN gastar dinero real:

1. En el panel de MercadoPago, ve a **"Cuentas de prueba"**
2. Crea un **vendedor de prueba** (ya lo tienes con tu cuenta)
3. Crea un **comprador de prueba**
4. Guarda las credenciales del comprador (email y contraseña)

### Tarjetas de Prueba:

| Tarjeta | Número | CVV | Vencimiento | Resultado |
|---------|--------|-----|-------------|-----------|
| Visa | 4509 9535 6623 3704 | 123 | 11/25 | ✅ Aprobada |
| Mastercard | 5031 7557 3453 0604 | 123 | 11/25 | ✅ Aprobada |
| Amex | 3711 803032 57522 | 1234 | 11/25 | ✅ Aprobada |

**Documentación completa**: https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/test-cards

---

## 📋 Paso 5: Probar el Pago

1. **Reinicia tu servidor de desarrollo**:
   ```bash
   npm run dev
   ```

2. **Abre tu app** en http://localhost:5173

3. **Flujo de prueba**:
   - Inicia sesión en tu app
   - Haz clic en **"Actualizar a Premium"**
   - Elige moneda (USD o ARS)
   - Por ahora verás una **simulación** (upgrade automático)
   
4. **Ver en consola**:
   - Abre DevTools (F12)
   - Revisa la consola para ver los logs de la preferencia creada

---

## 💰 ¿Cuándo Recibirás el Dinero?

- **Primer pago**: Liberado después de 14 días
- **Siguientes pagos**: Disponible inmediatamente
- **Retiro**: Desde MercadoPago a tu cuenta bancaria (CBU/CVU)

---

## ✅ Checklist de Implementación

- [ ] Crear cuenta en MercadoPago Developers
- [ ] Crear aplicación
- [ ] Obtener credenciales de TEST
- [ ] Agregar credenciales a `.env.local`
- [ ] Reiniciar servidor de desarrollo
- [ ] Probar flujo de pago en modo TEST
- [ ] Verificar identidad en MercadoPago (para producción)
- [ ] Obtener credenciales de PRODUCCIÓN
- [ ] ¡Empezar a recibir pagos! 💰

---

**Recursos**:
- Panel de desarrollador: https://www.mercadopago.com.ar/developers/panel
- Documentación: https://www.mercadopago.com.ar/developers/es/docs
