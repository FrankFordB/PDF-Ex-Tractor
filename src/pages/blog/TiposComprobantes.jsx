export default function TiposComprobantes() {
  return (
    <article className="max-w-3xl mx-auto p-6 bg-white">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Guía Completa: Tipos de Comprobantes Fiscales</h1>
        <p className="text-gray-500">Por Franco Burgoa • 7 min de lectura</p>
      </header>

      <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
        <p className="text-xl text-gray-600 leading-relaxed">
          Entender los diferentes tipos de comprobantes fiscales es fundamental para cumplir con obligaciones tributarias 
          y evitar sanciones. Esta guía desglosa cada tipo con ejemplos prácticos.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Facturas Tipo A (Argentina)</h2>
        <div className="bg-blue-50 p-6 rounded-lg my-4">
          <p className="font-semibold text-blue-900 mb-2">🔵 Características principales:</p>
          <ul className="list-disc list-inside space-y-2 text-blue-800">
            <li>Discrimina IVA (muestra impuesto por separado)</li>
            <li>Se emite entre responsables inscriptos</li>
            <li>Permite deducir crédito fiscal de IVA</li>
            <li>Requiere CUIT del comprador</li>
          </ul>
        </div>
        <p>
          <strong>Cuándo usarla:</strong> Ventas entre empresas o profesionales inscriptos en IVA. Permite al comprador 
          descontar el IVA pagado de sus obligaciones tributarias.
        </p>
        <p>
          <strong>Ejemplo:</strong> Un distribuidor mayorista vende mercadería a una tienda retail. Ambos son responsables inscriptos, 
          por lo que emite Factura A mostrando el precio neto más 21% de IVA.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Facturas Tipo B</h2>
        <div className="bg-green-50 p-6 rounded-lg my-4">
          <p className="font-semibold text-green-900 mb-2">🟢 Características principales:</p>
          <ul className="list-disc list-inside space-y-2 text-green-800">
            <li>IVA incluido en el precio final</li>
            <li>Se emite a consumidores finales</li>
            <li>No permite deducir crédito fiscal</li>
            <li>Puede o no incluir datos del comprador</li>
          </ul>
        </div>
        <p>
          <strong>Cuándo usarla:</strong> Ventas al público general, consumidores finales o responsables inscriptos 
          para operaciones no relacionadas con su actividad comercial.
        </p>
        <p>
          <strong>Ejemplo:</strong> Una tienda de ropa vende una prenda a un cliente particular. El ticket muestra $12,100 
          (precio final con IVA incluido), no discriminado.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Facturas Tipo C</h2>
        <div className="bg-yellow-50 p-6 rounded-lg my-4">
          <p className="font-semibold text-yellow-900 mb-2">🟡 Características principales:</p>
          <ul className="list-disc list-inside space-y-2 text-yellow-800">
            <li>Emitida por monotributistas o exentos</li>
            <li>No discrimina IVA (operación exenta)</li>
            <li>Precio final sin descomposición tributaria</li>
            <li>Para cualquier tipo de comprador</li>
          </ul>
        </div>
        <p>
          <strong>Cuándo usarla:</strong> Cuando el vendedor está adherido al Monotributo o es un sujeto exento de IVA.
        </p>
        <p>
          <strong>Ejemplo:</strong> Un diseñador gráfico freelancer (monotributista) emite factura C por servicios prestados 
          a una empresa. El monto es único, sin discriminación de impuestos.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Facturas Electrónicas (MiPyME)</h2>
        <p>
          Desde 2019, la mayoría de contribuyentes están obligados a emitir comprobantes electrónicos a través del sistema 
          de AFIP. Ventajas clave:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-2">
          <li>Validación instantánea con CAE/CAI</li>
          <li>Imposibilidad de falsificación</li>
          <li>Reducción de costos de impresión</li>
          <li>Trazabilidad completa ante auditorías</li>
          <li>Envío automático por email al cliente</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Notas de Crédito y Débito</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Nota de Crédito</h3>
        <p>
          Documento que anula o reduce el monto de una factura previamente emitida. Casos comunes:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-2">
          <li>Devolución de mercadería</li>
          <li>Error en el monto facturado</li>
          <li>Descuentos o bonificaciones posteriores a la venta</li>
          <li>Anulación de factura por cancelación de operación</li>
        </ul>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Nota de Débito</h3>
        <p>
          Incrementa el monto de una factura original. Usos típicos:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-2">
          <li>Intereses por mora en el pago</li>
          <li>Gastos adicionales no incluidos en factura original</li>
          <li>Corrección de errores que beneficiaron al cliente</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Recibos y Recibos Oficiales</h2>
        <p>
          Los recibos documentan el pago de una factura, pero no reemplazan a esta. Elementos obligatorios:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-2">
          <li>Número de factura que se está pagando</li>
          <li>Monto recibido y forma de pago</li>
          <li>Fecha de recepción del pago</li>
          <li>Firma y sello del receptor</li>
        </ul>

        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg my-8">
          <h3 className="text-lg font-bold text-red-900 mb-2">⚠️ Errores comunes a evitar</h3>
          <ul className="text-red-800 space-y-2">
            <li>✗ Usar Factura A cuando corresponde B (o viceversa)</li>
            <li>✗ No solicitar factura electrónica cuando es obligatoria</li>
            <li>✗ Emitir facturas sin CAE/CAI (Código de Autorización Electrónica)</li>
            <li>✗ No conservar comprobantes por el período legal (10 años)</li>
            <li>✗ Aceptar facturas con datos erróneos o incompletos</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Comprobantes en Otros Países</h2>
        
        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">México: CFDI (Comprobante Fiscal Digital por Internet)</h3>
        <p>
          Desde 2014, todos los comprobantes deben ser digitales y timbrados por el SAT. Versión actual: CFDI 4.0.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Chile: Factura Electrónica SII</h3>
        <p>
          Sistema pionero en Latinoamérica (desde 2003). Incluye Factura Electrónica, Boleta Electrónica y Guía de Despacho Electrónica.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">España: Factura Electrónica (Ley 25/2013)</h3>
        <p>
          Obligatoria en contrataciones con sector público. Sistema FACe para envío centralizado.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Digitalización y Gestión Eficiente</h2>
        <p>
          Independientemente del tipo de comprobante, su correcta organización es crítica. Herramientas como PDF Ex-Tractor permiten:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-2">
          <li>Identificar automáticamente el tipo de comprobante</li>
          <li>Extraer datos fiscales clave (CUIT, CAE, montos, IVA)</li>
          <li>Clasificar por categoría fiscal</li>
          <li>Generar reportes diferenciados para declaraciones juradas</li>
          <li>Alertar sobre comprobantes próximos a vencer (plazos legales)</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Conclusión</h2>
        <p>
          Dominar los tipos de comprobantes fiscales no es solo una obligación legal, sino una ventaja competitiva. 
          Evita sanciones, optimiza deducciones tributarias y mantén una contabilidad impecable que inspire confianza 
          en auditorías, bancos e inversores.
        </p>
      </div>

      <footer className="mt-12 pt-6 border-t border-gray-200">
        <a href="/ayuda" className="text-blue-600 hover:underline">← Volver a Ayuda</a>
      </footer>
    </article>
  )
}
