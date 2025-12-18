import { useState } from 'react'

export default function Footer() {
  const [blogOpen, setBlogOpen] = useState(false)

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Columna 1: Logo y descripción */}
          <div>
            <h3 className="text-white text-xl font-bold mb-3">PDF Ex-Tractor</h3>
            <p className="text-sm text-gray-400">
              Automatiza la extracción de datos de facturas con IA. 
              Ahorra tiempo y elimina errores.
            </p>
            <div className="mt-4 text-sm text-gray-500">
              © 2024 Franco Burgoa
            </div>
          </div>

          {/* Columna 2: Recursos */}
          <div>
            <h4 className="text-white font-semibold mb-3">Recursos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/ayuda" className="hover:text-blue-400 transition-colors">
                  📖 Ayuda y Tutorial
                </a>
              </li>
              <li>
                <div className="relative">
                  <button 
                    onClick={() => setBlogOpen(!blogOpen)}
                    className="hover:text-blue-400 transition-colors flex items-center gap-1"
                  >
                    📝 Blog {blogOpen ? '▼' : '▶'}
                  </button>
                  {blogOpen && (
                    <ul className="ml-4 mt-2 space-y-1">
                      <li>
                        <a href="/blog/organizar-facturas" className="hover:text-blue-400 text-gray-400">
                          • Organizar Facturas
                        </a>
                      </li>
                      <li>
                        <a href="/blog/beneficios-digitalizacion" className="hover:text-blue-400 text-gray-400">
                          • Beneficios de Digitalizar
                        </a>
                      </li>
                      <li>
                        <a href="/blog/tipos-comprobantes" className="hover:text-blue-400 text-gray-400">
                          • Tipos de Comprobantes
                        </a>
                      </li>
                      <li>
                        <a href="/blog/consejos-contadores" className="hover:text-blue-400 text-gray-400">
                          • Consejos para Contadores
                        </a>
                      </li>
                    </ul>
                  )}
                </div>
              </li>
              <li>
                <a href="/acerca" className="hover:text-blue-400 transition-colors">
                  ℹ️ Acerca de
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Legal */}
          <div>
            <h4 className="text-white font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/terminos" className="hover:text-blue-400 transition-colors">
                  📜 Términos de Servicio
                </a>
              </li>
              <li>
                <a href="/privacidad" className="hover:text-blue-400 transition-colors">
                  🔒 Política de Privacidad
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <h4 className="text-white font-semibold mb-3">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span>📧</span>
                <a href="mailto:soporte@pdfextractor.com" className="hover:text-blue-400 transition-colors">
                  soporte@pdfextractor.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>🔗</span>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  LinkedIn
                </a>
              </li>
            </ul>
            
            <div className="mt-6">
              <h5 className="text-white text-sm font-semibold mb-2">Planes</h5>
              <p className="text-xs text-gray-400 mb-1">
                Gratuito: 5 PDFs/mes
              </p>
              <p className="text-xs text-gray-400">
                Premium: $9.99/mes - Ilimitado
              </p>
            </div>
          </div>

        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          <p>Hecho con ❤️ para contadores y empresas • Powered by React & Firebase</p>
        </div>
      </div>
    </footer>
  )
}
