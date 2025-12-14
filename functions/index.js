const functions = require('firebase-functions')
const admin = require('firebase-admin')
const mercadopago = require('mercadopago')
const cors = require('cors')({ origin: true })

admin.initializeApp()

// Configurar MercadoPago con tu Access Token
mercadopago.configure({
  access_token: functions.config().mercadopago.access_token
})

/**
 * Crear preferencia de pago en MercadoPago
 * @param {Object} req - Request con { preference, userId }
 * @param {Object} res - Response con { init_point: string }
 */
exports.createMercadoPagoPreference = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    // Solo permitir POST
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Método no permitido' })
    }

    const { preference, userId } = req.body

    if (!preference || !userId) {
      return res.status(400).json({ error: 'Datos inválidos' })
    }

    try {
      // Crear preferencia en MercadoPago
      const response = await mercadopago.preferences.create(preference)

      return res.status(200).json({
        init_point: response.body.init_point,
        preference_id: response.body.id
      })
    } catch (error) {
      console.error('Error creando preferencia:', error)
      return res.status(500).json({ error: 'Error al crear preferencia de pago' })
    }
  })
})

/**
 * Webhook para recibir notificaciones de MercadoPago
 * @param {Object} req - Request
 * @param {Object} res - Response
 */
exports.mercadopagoWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Método no permitido')
  }

  const { type, data } = req.body

  // MercadoPago envía diferentes tipos de notificaciones
  if (type === 'payment') {
    const paymentId = data.id

    try {
      // Obtener información del pago
      const payment = await mercadopago.payment.get(paymentId)
      const paymentData = payment.body

      console.log('Pago recibido:', paymentData)

      // Si el pago fue aprobado
      if (paymentData.status === 'approved') {
        const userId = paymentData.metadata.user_id
        const plan = paymentData.metadata.plan

        // Actualizar usuario a Premium en Firestore
        if (userId && plan === 'premium') {
          await admin.firestore().collection('users').doc(userId).update({
            accountType: 'premium',
            subscriptionId: paymentId,
            subscriptionDate: admin.firestore.FieldValue.serverTimestamp(),
            subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          })

          console.log(`Usuario ${userId} actualizado a Premium`)
        }
      }

      res.status(200).send('OK')
    } catch (error) {
      console.error('Error procesando webhook:', error)
      res.status(500).send('Error')
    }
  } else {
    res.status(200).send('OK')
  }
})

/**
 * Verificar y actualizar suscripciones expiradas (ejecutar diariamente)
 */
exports.checkExpiredSubscriptions = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const now = new Date()
  
  try {
    // Buscar usuarios premium con suscripción expirada
    const snapshot = await admin.firestore()
      .collection('users')
      .where('accountType', '==', 'premium')
      .where('subscriptionEndDate', '<=', now)
      .get()

    const batch = admin.firestore().batch()

    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, {
        accountType: 'free',
        subscriptionId: null,
        subscriptionEndDate: null,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      })
    })

    await batch.commit()

    console.log(`${snapshot.size} suscripciones expiradas actualizadas`)
    return null
  } catch (error) {
    console.error('Error verificando suscripciones:', error)
    return null
  }
})
