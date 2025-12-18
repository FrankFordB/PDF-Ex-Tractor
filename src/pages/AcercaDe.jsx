export default function AcercaDe() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Acerca de PDF Ex-Tractor</h1>
      
      {/* Qué es la herramienta */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">🚀 ¿Qué es PDF Ex-Tractor?</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          PDF Ex-Tractor es una plataforma SaaS (Software as a Service) de vanguardia que utiliza inteligencia artificial 
          y tecnología OCR para automatizar la extracción de datos desde facturas y comprobantes fiscales en formato PDF.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          Desarrollada con tecnologías modernas como React, Firebase y algoritmos de aprendizaje automático, nuestra 
          herramienta permite a profesionales contables, empresas y freelancers digitalizar y organizar su documentación 
          fiscal en segundos, eliminando horas de trabajo manual tedioso y propenso a errores.
        </p>
        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">✨ Características principales:</h3>
          <ul className="grid md:grid-cols-2 gap-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              Extracción automática de datos clave
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              Tecnología OCR de última generación
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              Exportación masiva a Excel
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              Almacenamiento seguro en la nube
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              Interfaz intuitiva y responsive
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">✓</span>
              Procesamiento ilimitado (plan Premium)
            </li>
          </ul>
        </div>
      </section>

      {/* Para quién es útil */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">👥 ¿Para quién es útil?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="border-2 border-green-200 rounded-lg p-5 hover:shadow-xl transition-all">
            <div className="text-3xl mb-3">🏢</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Estudios Contables</h3>
            <p className="text-gray-600 text-sm">
              Procesa cientos de facturas de múltiples clientes en minutos. Aumenta tu capacidad operativa sin contratar personal adicional.
            </p>
            <p className="text-green-700 font-semibold text-sm mt-3">Ahorro: 20-30 horas/mes</p>
          </div>

          <div className="border-2 border-blue-200 rounded-lg p-5 hover:shadow-xl transition-all">
            <div className="text-3xl mb-3">🏪</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Pequeñas y Medianas Empresas</h3>
            <p className="text-gray-600 text-sm">
              Mantén tu contabilidad al día sin departamento contable completo. Ideal para gerentes que necesitan visibilidad financiera rápida.
            </p>
            <p className="text-green-700 font-semibold text-sm mt-3">ROI: Recuperado en 2 meses</p>
          </div>

          <div className="border-2 border-purple-200 rounded-lg p-5 hover:shadow-xl transition-all">
            <div className="text-3xl mb-3">💼</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Freelancers y Autónomos</h3>
            <p className="text-gray-600 text-sm">
              Organiza tus ingresos y gastos sin complicaciones. Genera reportes para impuestos en segundos.
            </p>
            <p className="text-green-700 font-semibold text-sm mt-3">Precio: Desde gratis</p>
          </div>

          <div className="border-2 border-orange-200 rounded-lg p-5 hover:shadow-xl transition-all">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Analistas Financieros</h3>
            <p className="text-gray-600 text-sm">
              Extrae datos para análisis de gastos, presupuestos y auditorías con precisión milimétrica.
            </p>
            <p className="text-green-700 font-semibold text-sm mt-3">Precisión: {'>'}95%</p>
          </div>

          <div className="border-2 border-pink-200 rounded-lg p-5 hover:shadow-xl transition-all">
            <div className="text-3xl mb-3">🏗️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Empresas de Construcción</h3>
            <p className="text-gray-600 text-sm">
              Gestiona facturas de múltiples obras simultáneas. Controla costos por proyecto eficientemente.
            </p>
            <p className="text-green-700 font-semibold text-sm mt-3">Control: Multi-proyecto</p>
          </div>

          <div className="border-2 border-indigo-200 rounded-lg p-5 hover:shadow-xl transition-all">
            <div className="text-3xl mb-3">🎓</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Estudiantes de Contabilidad</h3>
            <p className="text-gray-600 text-sm">
              Practica con facturas reales. Aprende mientras automatizas. Ideal para proyectos académicos.
            </p>
            <p className="text-green-700 font-semibold text-sm mt-3">Plan: 5 PDFs gratis/mes</p>
          </div>

        </div>
      </section>

      {/* Casos de éxito */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">🏆 Casos de Éxito</h2>
        
        <div className="space-y-6">
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-6 rounded-r-lg">
            <div className="flex items-start gap-4">
              <div className="text-4xl">👨‍💼</div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Estudio Contable González - Buenos Aires</h3>
                <p className="text-gray-600 mt-2">
                  "Antes procesábamos 50 facturas diarias en 8 horas de trabajo. Con PDF Ex-Tractor, ahora procesamos 
                  200 facturas en el mismo tiempo. Duplicamos nuestros clientes sin aumentar costos."
                </p>
                <p className="text-green-700 font-semibold mt-3">📈 Resultados: +120% en facturación, mismo equipo</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <div className="flex items-start gap-4">
              <div className="text-4xl">🏪</div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Distribuidora MegaSur - Córdoba</h3>
                <p className="text-gray-600 mt-2">
                  "Manejamos 300+ facturas mensuales de proveedores. La extracción manual nos tomaba 2 semanas completas. 
                  Ahora lo hacemos en 1 día. Reducimos errores de carga del 4% al 0.2%."
                </p>
                <p className="text-blue-700 font-semibold mt-3">💰 Ahorro anual: $18,000 USD en costos administrativos</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-violet-50 border-l-4 border-purple-500 p-6 rounded-r-lg">
            <div className="flex items-start gap-4">
              <div className="text-4xl">💻</div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">María López - Diseñadora Freelance</h3>
                <p className="text-gray-600 mt-2">
                  "Como freelancer, odio la parte administrativa. PDF Ex-Tractor me ahorra 5 horas semanales que ahora 
                  dedico a clientes. El plan gratuito es perfecto para mi volumen."
                </p>
                <p className="text-purple-700 font-semibold mt-3">⏱️ 20 horas/mes recuperadas para trabajo facturable</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Creador */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-blue-600 mb-4">👨‍💻 El Creador</h2>
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-5xl font-bold">
                FB
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Franco Burgoa</h3>
              <p className="text-blue-600 font-semibold mb-4">Desarrollador Full-Stack & Emprendedor</p>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                Franco es un ingeniero de software apasionado por resolver problemas reales mediante tecnología. 
                Con más de 5 años de experiencia en desarrollo web y automatización de procesos, identificó una 
                necesidad crítica en el mercado contable: la pérdida masiva de tiempo en tareas manuales repetitivas.
              </p>
              
              <p className="text-gray-700 leading-relaxed mb-4">
                PDF Ex-Tractor nació de conversaciones con contadores amigos que dedicaban horas a transcribir facturas. 
                "Si podemos automatizar esto, liberamos a profesionales para hacer lo que realmente importa: asesorar 
                a sus clientes", reflexiona Franco.
              </p>

              <div className="bg-white p-4 rounded-lg mt-6">
                <p className="text-gray-700 mb-3"><strong>Stack tecnológico:</strong></p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">React</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Firebase</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Node.js</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">AI/ML</span>
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">OCR</span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">Cloud Computing</span>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <a href="mailto:franco.burgoa@pdfextractor.com" className="text-blue-600 hover:underline flex items-center gap-2">
                  📧 Contacto
                </a>
                <a href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                  🔗 LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compromiso */}
      <section className="bg-blue-600 text-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Nuestro Compromiso</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="text-3xl mb-2">🔒</div>
            <h3 className="font-semibold mb-2">Seguridad</h3>
            <p className="text-blue-100 text-sm">
              Tus datos están protegidos con encriptación SSL y almacenamiento seguro en Firebase. 
              Cumplimos con GDPR y regulaciones de privacidad.
            </p>
          </div>
          <div>
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold mb-2">Innovación Continua</h3>
            <p className="text-blue-100 text-sm">
              Actualizamos constantemente nuestros algoritmos de IA para mejorar precisión. 
              Nuevas funcionalidades cada trimestre.
            </p>
          </div>
          <div>
            <div className="text-3xl mb-2">💬</div>
            <h3 className="font-semibold mb-2">Soporte Dedicado</h3>
            <p className="text-blue-100 text-sm">
              Respondemos consultas en menos de 24 horas. Usuarios Premium tienen prioridad y soporte técnico especializado.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <div className="mt-10 text-center bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-3">¿Listo para transformar tu gestión contable?</h3>
        <p className="text-gray-600 mb-6">Únete a cientos de profesionales que ya ahorraron miles de horas</p>
        <div className="flex gap-4 justify-center">
          <a href="/" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Comenzar Gratis
          </a>
          <a href="/ayuda" className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Ver Tutorial
          </a>
        </div>
      </div>
    </div>
  )
}
