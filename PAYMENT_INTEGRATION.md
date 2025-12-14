# Guía de Implementación de Pagos Premium

## 💳 Formas de Pago Recomendadas

Para monetizar tu aplicación PDF Ex-Tractor y recibir pagos del plan Premium, tienes varias opciones:

---

## 1. 🌎 MercadoPago (Recomendado para Argentina)

**Ideal si vives en Argentina, Brasil, México, Chile, Colombia, Perú o Uruguay.**

### Ventajas:
- ✅ Procesa pagos locales (tarjetas argentinas, transferencias, Rapipago, PagoFácil)
- ✅ Bajas comisiones en Argentina (4-5% + $3 ARS fijo)
- ✅ Soporta suscripciones recurrentes
- ✅ Depósito en cuenta bancaria argentina
- ✅ SDK oficial para JavaScript/React

### Cómo Configurar:

1. **Crear Cuenta**
   - Ve a https://www.mercadopago.com.ar/developers
   - Crea una cuenta de desarrollador
   - Verifica tu identidad (CBU/CVU para recibir pagos)

2. **Obtener Credenciales**
   - En el panel de desarrollador, crea una aplicación
   - Obtén tus `Access Token` y `Public Key`
   - Usa modo TEST primero, luego pasa a PRODUCTION

3. **Instalar SDK**
   ```bash
   npm install @mercadopago/sdk-react
   ```

4. **Código de Ejemplo** (suscripción mensual):
   ```javascript
   import { initMercadoPago, Payment } from '@mercadopago/sdk-react'
   
   // Inicializar con tu Public Key
   initMercadoPago('TU_PUBLIC_KEY')
   
   // En tu componente de pago:
   const createPreference = async () => {
     const response = await fetch('/api/create-subscription', {
       method: 'POST',
       body: JSON.stringify({
         title: 'PDF Ex-Tractor Premium',
         quantity: 1,
         unit_price: 8.99,
         currency_id: 'USD' // o 'ARS' para pesos
       })
     })
     return response.json()
   }
   ```

5. **Backend (opcional, puedes usar Firebase Functions)**
   ```javascript
   // Webhook para verificar pagos
   mercadopago.payment.findById(payment_id).then(payment => {
     if (payment.status === 'approved') {
       // Actualizar usuario a Premium en Firestore
       updateDoc(doc(db, 'users', userId), {
         accountType: 'premium',
         subscriptionId: payment.id
       })
     }
   })
   ```

**Documentación**: https://www.mercadopago.com.ar/developers/es/docs

---

## 2. 💵 Stripe (Internacional)

**Mejor opción si quieres aceptar tarjetas internacionales.**

### Ventajas:
- ✅ Acepta tarjetas de todo el mundo
- ✅ Excelente para suscripciones
- ✅ Comisiones: 2.9% + $0.30 USD por transacción
- ✅ Documentación excelente
- ✅ Requiere cuenta bancaria en USA/Europa para transferencias

### Cómo Configurar:

1. **Crear Cuenta**
   - Ve a https://stripe.com
   - Crea una cuenta (necesitarás verificar identidad)
   - **Nota**: Para recibir fondos necesitas cuenta bancaria en país soportado

2. **Instalar SDK**
   ```bash
   npm install @stripe/stripe-js @stripe/react-stripe-js
   ```

3. **Código de Ejemplo**:
   ```javascript
   import { loadStripe } from '@stripe/stripe-js'
   import { Elements, CardElement } from '@stripe/react-stripe-js'
   
   const stripePromise = loadStripe('TU_PUBLISHABLE_KEY')
   
   // Crear suscripción
   const handleSubscribe = async () => {
     const { data } = await fetch('/api/create-subscription', {
       method: 'POST',
       body: JSON.stringify({ priceId: 'price_XXXXX' })
     }).then(r => r.json())
     
     const stripe = await stripePromise
     const { error } = await stripe.redirectToCheckout({
       sessionId: data.sessionId
     })
   }
   ```

**Documentación**: https://stripe.com/docs

---

## 3. 🔵 PayPal (Alternativa Internacional)

### Ventajas:
- ✅ Muy conocido y confiable
- ✅ Acepta pagos sin necesidad de tarjeta
- ✅ Soporta Argentina
- ✅ Puedes retirar a cuenta bancaria argentina

### Cómo Configurar:

1. **Crear Cuenta Business**
   - Ve a https://www.paypal.com/ar/business
   - Crea una cuenta empresarial
   - Verifica tu cuenta

2. **Instalar SDK**
   ```bash
   npm install @paypal/react-paypal-js
   ```

3. **Código de Ejemplo**:
   ```javascript
   import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
   
   <PayPalScriptProvider options={{ "client-id": "TU_CLIENT_ID" }}>
     <PayPalButtons
       createSubscription={(data, actions) => {
         return actions.subscription.create({
           plan_id: 'P-XXXXX' // ID de tu plan de suscripción
         })
       }}
       onApprove={async (data) => {
         // Actualizar usuario a Premium
         await updateDoc(doc(db, 'users', userId), {
           accountType: 'premium',
           subscriptionId: data.subscriptionID
         })
       }}
     />
   </PayPalScriptProvider>
   ```

**Documentación**: https://developer.paypal.com/docs/subscriptions/

---

## 📊 Comparación Rápida

| Plataforma | Comisión | Retiro a Argentina | Mejor Para |
|-----------|----------|-------------------|------------|
| **MercadoPago** | 4-5% + $3 ARS | ✅ Sí (directo) | Clientes argentinos |
| **Stripe** | 2.9% + $0.30 USD | ⚠️ Requiere Payoneer/Wise | Clientes internacionales |
| **PayPal** | 5.4% + comisión fija | ✅ Sí (comisión alta) | Alternativa internacional |

---

## 🚀 Implementación Recomendada (Híbrida)

**Para maximizar conversiones, ofrece múltiples opciones:**

```javascript
// En UpgradeModal.jsx
const PaymentOptions = () => (
  <div className="space-y-4">
    <h3>Elige tu método de pago:</h3>
    
    {/* MercadoPago para clientes argentinos */}
    <button className="w-full bg-blue-500 text-white p-3 rounded">
      <img src="/mercadopago-logo.svg" alt="MercadoPago" />
      Pagar con MercadoPago (Argentina)
    </button>
    
    {/* Stripe para internacionales */}
    <button className="w-full bg-purple-600 text-white p-3 rounded">
      <img src="/stripe-logo.svg" alt="Stripe" />
      Pagar con Tarjeta (Internacional)
    </button>
    
    {/* PayPal como alternativa */}
    <button className="w-full bg-blue-600 text-white p-3 rounded">
      <img src="/paypal-logo.svg" alt="PayPal" />
      Pagar con PayPal
    </button>
  </div>
)
```

---

## 🔐 Seguridad y Mejores Prácticas

1. **NUNCA** guardes números de tarjeta en tu base de datos
2. Usa tokens de los procesadores de pago
3. Verifica pagos en el servidor (Firebase Functions)
4. Implementa webhooks para actualizar suscripciones automáticamente
5. Guarda solo el `subscriptionId` en Firestore

---

## 💰 ¿Cuánto Vas a Recibir?

**Ejemplo: $8.99 USD/mes con MercadoPago**

| Concepto | Monto |
|----------|-------|
| Precio del plan | $8.99 USD (~$9,200 ARS) |
| Comisión MercadoPago (5%) | -$460 ARS |
| Comisión fija | -$3 ARS |
| **Tu ganancia** | **~$8,737 ARS** |

Con 10 suscriptores = $87,370 ARS/mes  
Con 50 suscriptores = $436,850 ARS/mes  
Con 100 suscriptores = $873,700 ARS/mes

---

## 📝 Próximos Pasos

1. **Corto Plazo**: Implementa MercadoPago para el mercado argentino
2. **Mediano Plazo**: Agrega Stripe para clientes internacionales
3. **Opcional**: Agrega PayPal como alternativa

¿Necesitas ayuda implementando alguno de estos? ¡Avísame y te ayudo con el código!
