import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainApp from './MainApp'
import Ayuda from './pages/Ayuda'
import AcercaDe from './pages/AcercaDe'
import OrganizarFacturas from './pages/blog/OrganizarFacturas'
import BeneficiosDigitalizacion from './pages/blog/BeneficiosDigitalizacion'
import TiposComprobantes from './pages/blog/TiposComprobantes'
import ConsejosContadores from './pages/blog/ConsejosContadores'
import Footer from './components/Footer'

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/ayuda" element={<><Ayuda /><Footer /></>} />
          <Route path="/acerca" element={<><AcercaDe /><Footer /></>} />
          <Route path="/blog/organizar-facturas" element={<><OrganizarFacturas /><Footer /></>} />
          <Route path="/blog/beneficios-digitalizacion" element={<><BeneficiosDigitalizacion /><Footer /></>} />
          <Route path="/blog/tipos-comprobantes" element={<><TiposComprobantes /><Footer /></>} />
          <Route path="/blog/consejos-contadores" element={<><ConsejosContadores /><Footer /></>} />
        </Routes>
      </div>
    </Router>
  )
}