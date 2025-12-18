export default function Ayuda() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Ayuda y Tutorial</h1>
      
      {/* Cómo usar la app */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">📖 Cómo usar PDF Ex-Tractor</h2>
        <div className="space-y-4 text-gray-700">
          <p className="leading-relaxed">
            PDF Ex-Tractor es una herramienta profesional que automatiza la extracción de datos desde facturas PDF, 
            ahorrándote hasta 10 minutos por factura y eliminando errores de transcripción manual.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-800 mt-6">Guía paso a paso:</h3>
          <ol className="list-decimal list-inside space-y-3 ml-4">
            <li><strong>Regístrate o inicia sesión</strong> - Crea tu cuenta gratuita en segundos</li>
            <li><strong>Sube tu factura PDF</strong> - Arrastra y suelta o haz clic para seleccionar</li>
            <li><strong>Procesamiento automático</strong> - Nuestra IA extrae los datos clave</li>
            <li><strong>Verifica los resultados</strong> - Revisa los campos extraídos</li>
            <li><strong>Exporta a Excel</strong> - Descarga todos tus datos organizados</li>
          </ol>
        </div>
      </section>

      {/* Casos de uso */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">💼 Casos de Uso</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">🏢 Contadores</h3>
            <p className="text-gray-600">Procesa facturas de múltiples clientes de forma eficiente. Reduce el tiempo de contabilización de horas a minutos.</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">🏪 Pequeñas Empresas</h3>
            <p className="text-gray-600">Organiza tus compras y ventas automáticamente. Mantén tu contabilidad al día sin contratar personal extra.</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">📊 Analistas Financieros</h3>
            <p className="text-gray-600">Extrae datos para análisis de gastos, presupuestos y auditorías con precisión y velocidad.</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">🎓 Estudiantes de Contabilidad</h3>
            <p className="text-gray-600">Aprende mientras practicas con facturas reales. Ideal para proyectos académicos y prácticas profesionales.</p>
          </div>
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">❓ Preguntas Frecuentes</h2>
        <div className="space-y-4">
          <details className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <summary className="font-semibold text-gray-800 cursor-pointer">¿Qué tipos de facturas puedo procesar?</summary>
            <p className="mt-2 text-gray-600">Procesamos facturas electrónicas argentinas (AFIP), facturas comerciales, comprobantes fiscales y cualquier PDF con estructura de factura.</p>
          </details>
          
          <details className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <summary className="font-semibold text-gray-800 cursor-pointer">¿Cuántas facturas puedo procesar gratis?</summary>
            <p className="mt-2 text-gray-600">La cuenta gratuita permite 5 PDFs por mes. Para procesamiento ilimitado, actualiza a Premium por $9.99/mes.</p>
          </details>
          
          <details className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <summary className="font-semibold text-gray-800 cursor-pointer">¿Mis datos están seguros?</summary>
            <p className="mt-2 text-gray-600">Sí, utilizamos Firebase Authentication y encriptación SSL. Tus facturas se almacenan de forma segura y solo tú tienes acceso.</p>
          </details>
          
          <details className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <summary className="font-semibold text-gray-800 cursor-pointer">¿Puedo cancelar mi suscripción Premium?</summary>
            <p className="mt-2 text-gray-600">Por supuesto, puedes cancelar en cualquier momento sin penalizaciones. Tu plan premium seguirá activo hasta el final del período pagado.</p>
          </details>
          
          <details className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <summary className="font-semibold text-gray-800 cursor-pointer">¿Qué pasa si la extracción no es perfecta?</summary>
            <p className="mt-2 text-gray-600">Puedes editar manualmente cualquier campo antes de exportar. Nuestro sistema aprende constantemente para mejorar la precisión.</p>
          </details>
          
          <details className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
            <summary className="font-semibold text-gray-800 cursor-pointer">¿Funciona con facturas escaneadas?</summary>
            <p className="mt-2 text-gray-600">Sí, utilizamos OCR (reconocimiento óptico de caracteres) para procesar facturas escaneadas, aunque los PDFs nativos ofrecen mejor precisión.</p>
          </details>
        </div>
      </section>

      {/* Tips */}
      <section className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
        <h3 className="text-xl font-bold text-blue-900 mb-3">💡 Consejos para mejores resultados</h3>
        <ul className="space-y-2 text-blue-800">
          <li>✅ Usa PDFs originales en lugar de escaneos cuando sea posible</li>
          <li>✅ Asegúrate de que el PDF no esté protegido con contraseña</li>
          <li>✅ Verifica los campos extraídos antes de exportar</li>
          <li>✅ Usa nombres descriptivos para organizar tus facturas</li>
          <li>✅ Exporta regularmente a Excel para mantener respaldos</li>
        </ul>
      </section>
    </div>
  )
}
