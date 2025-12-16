const functions = require('firebase-functions')
const admin = require('firebase-admin')
const mercadopago = require('mercadopago')
const cors = require('cors')({ origin: true })
const sgMail = require('@sendgrid/mail')

admin.initializeApp()

// Configurar MercadoPago con tu Access Token
mercadopago.configure({
  access_token: functions.config().mercadopago.access_token
})

// Configurar SendGrid para enviar emails
const SENDGRID_API_KEY = functions.config().sendgrid?.apikey || ''
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY)
}

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
/**
 * Enviar email de cancelación de suscripción
 * @param {Object} data - { userEmail, userName }
 * @param {Object} context - Context de la función
 */
exports.sendCancellationEmail = functions.https.onCall(async (data, context) => {
  const { userEmail, userName } = data

  if (!userEmail) {
    throw new functions.https.HttpsError('invalid-argument', 'Email es requerido')
  }

  const msg = {
    to: userEmail,
    from: {
      email: functions.config().sendgrid?.fromemail || 'noreply@pdfextractor.com',
      name: 'PDF Extractor'
    },
    subject: '❌ Suscripción Premium Cancelada - PDF Extractor',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .benefits-lost { background: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .benefit-item { padding: 8px 0; display: flex; align-items: center; }
          .benefit-item::before { content: "✖"; color: #dc2626; font-weight: bold; margin-right: 10px; }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📄 PDF Extractor</h1>
            <h2>Suscripción Cancelada</h2>
          </div>
          
          <div class="content">
            <p>Hola <strong>${userName || 'Usuario'}</strong>,</p>
            
            <p>Confirmamos que tu suscripción Premium ha sido cancelada exitosamente.</p>
            
            <div class="benefits-lost">
              <h3 style="margin-top: 0; color: #dc2626;">🚫 Beneficios que ya no tendrás acceso:</h3>
              <div class="benefit-item">PDFs ilimitados (vuelves a 5 PDFs por semana)</div>
              <div class="benefit-item">Almacenamiento en la nube permanente</div>
              <div class="benefit-item">Soporte prioritario 24/7</div>
              <div class="benefit-item">Exportación avanzada con formatos múltiples</div>
              <div class="benefit-item">Procesamiento por lotes</div>
              <div class="benefit-item">Sin anuncios</div>
            </div>
            
            <p><strong>🔒 No se realizarán más cobros automáticos.</strong> Tu cuenta volverá al plan gratuito inmediatamente.</p>
            
            <p>Aún puedes acceder a:</p>
            <ul>
              <li>✅ 5 PDFs gratuitos por semana</li>
              <li>✅ Funcionalidades básicas de extracción</li>
              <li>✅ Tus datos y configuración</li>
            </ul>
            
            <p>Si cambias de opinión, siempre puedes volver a suscribirte desde tu panel de usuario.</p>
            
            <a href="${functions.config().app?.url || 'https://pdfextractor.com'}" class="button">Volver a PDF Extractor</a>
            
            <p style="margin-top: 30px;">¿Nos extrañarás? 💔 Cuéntanos qué podemos mejorar.</p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} PDF Extractor. Todos los derechos reservados.</p>
            <p>Este es un email automático, por favor no respondas a este mensaje.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  try {
    await sgMail.send(msg)
    console.log(`✅ Email de cancelación enviado a ${userEmail}`)
    return { success: true, message: 'Email enviado correctamente' }
  } catch (error) {
    console.error('Error enviando email con SendGrid:', error)
    if (error.response) {
      console.error('SendGrid error details:', error.response.body)
    }
    throw new functions.https.HttpsError('internal', 'Error al enviar email de cancelación')
  }
})
