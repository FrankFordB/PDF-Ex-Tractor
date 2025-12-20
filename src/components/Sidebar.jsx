import { useState } from 'react'
import AdBanner from './AdBanner'

export default function Sidebar({ results = [], onSelect, onViewChange, currentView = 'enProceso', selectedIndex, fields = [], onExportExcel, onReset, user, onNavigate, activeSection = 'trabajo' }) {
	const [isCollapsed, setIsCollapsed] = useState(false)
	const finalizadas = results.map((r, i) => ({ ...r, i })).filter(r => r.status === 'Finalizada')
	const enProceso = results.map((r, i) => ({ ...r, i })).filter(r => r.status !== 'Finalizada')

	// Función para truncar desde el inicio mostrando los últimos caracteres
	const getTruncatedFileName = (fileName, maxLength = 35) => {
		if (!fileName) return ''
		if (fileName.length <= maxLength) return fileName
		return '...' + fileName.slice(-(maxLength - 3))
	}

	return (
		<aside className={`relative bg-white/70 backdrop-blur-xl shadow-2xl border-r border-white/20 overflow-auto md:overflow-y-auto transition-all duration-300 ${
			isCollapsed ? 'w-0 md:w-12 p-0' : 'w-full md:w-72 p-3 md:p-4'
		}`}>
			{/* Botón de colapsar/expandir */}
			<button
				onClick={() => setIsCollapsed(!isCollapsed)}
				className="absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full shadow-lg transition-all"
				title={isCollapsed ? 'Expandir sidebar' : 'Contraer sidebar'}
			>
				<i className={`fa-solid ${isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
			</button>

			{!isCollapsed && (
				<>
					<div className="mb-4">
						<h2 className="text-lg md:text-xl font-bold">PDF Ex-Tractor</h2>
						<p className="text-xs md:text-sm text-gray-500">Dashboard</p>
					</div>

			<div className="mb-4 flex gap-2">
				<button onClick={() => onViewChange && onViewChange('enProceso')} className={`flex-1 px-2 py-1 rounded text-xs md:text-sm font-medium transition-all ${currentView === 'enProceso' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' : 'bg-gray-100'}`}>
					En proceso ({enProceso.length})
				</button>
				<button onClick={() => onViewChange && onViewChange('finalizadas')} className={`flex-1 px-2 py-1 rounded text-xs md:text-sm font-medium transition-all ${currentView === 'finalizadas' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' : 'bg-gray-100'}`}>
					Finalizadas ({finalizadas.length})
				</button>
			</div>

			<div className="mb-4">
				<div className="text-xs md:text-sm font-semibold mb-2">Listado</div>
				<div className="space-y-1 max-h-40 overflow-y-auto transition-all duration-300">
					{currentView === 'finalizadas' && (finalizadas.length === 0 ? <div className="text-xs text-gray-400">Ninguna</div> : finalizadas.map(item => (
						<button 
							key={item.i} 
							onClick={() => { onViewChange && onViewChange('finalizadas'); onSelect && onSelect(item.i) }} 
							className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 text-xs md:text-sm transition-all duration-200 overflow-hidden ${
								selectedIndex === item.i ? 'bg-blue-100 border-l-2 border-blue-600' : ''
							}`}
							title={item.fileName}
						>
							<span className="block overflow-hidden whitespace-nowrap">
								{getTruncatedFileName(item.fileName)}
							</span>
						</button>
					)))}

					{currentView === 'enProceso' && (enProceso.length === 0 ? <div className="text-xs text-gray-400">Ninguna</div> : enProceso.map(item => (
						<button 
							key={item.i} 
							onClick={() => { onViewChange && onViewChange('enProceso'); onSelect && onSelect(item.i) }} 
							className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 text-xs md:text-sm transition-all duration-200 overflow-hidden ${
								selectedIndex === item.i ? 'bg-blue-100 border-l-2 border-blue-600' : ''
							}`}
							title={item.fileName}
						>
							<span className="block overflow-hidden whitespace-nowrap">
								{getTruncatedFileName(item.fileName)}
							</span>
						</button>
					)))}
				</div>
			</div>

			{/* Campos y Botones - Justo debajo del listado */}
			<div className="pt-4 border-t border-gray-200">
				<h4 className="font-bold mb-2 text-sm">Campos</h4>
				<ul className="text-xs mb-3 space-y-0.5">
					{fields.map((f, i) => <li key={i} className="text-gray-700">• {f.name}</li>)}
				</ul>
				<button 
					onClick={onExportExcel} 
					className={`w-full text-white p-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${
						!user 
							? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700' 
							: 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700'
					}`}
				>
					{!user ? (
						<>
							<i className="fa-solid fa-lock"></i>
							Exportar Excel
						</>
					) : (
						<>
							<i className="fa-solid fa-file-excel"></i>
							Exportar Excel
						</>
					)}
				</button>
				<button 
					onClick={onReset} 
					className="mt-3 w-full bg-gradient-to-r from-rose-600 via-red-600 to-orange-600 hover:from-rose-700 hover:via-red-700 hover:to-orange-700 text-white p-3 rounded-xl transition-all text-sm font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
				>
					<i className="fa-solid fa-rotate-left"></i>
					Reiniciar App
				</button>

				{/* Banners publicitarios - Solo para usuarios free y guests */}
				{(!user || user.accountType === 'free') && (
					<>
						<div className="mt-4 border-t border-gray-200 pt-4">
							<AdBanner 
								zoneId="ZONE_1_ID" 
								format="auto"
								style={{ minHeight: '90px' }}
							/>
						</div>
						
						<div className="mt-4">
							<AdBanner 
								zoneId="ZONE_2_ID" 
								format="auto"
								style={{ minHeight: '90px' }}
							/>
						</div>
						
						<div className="mt-4">
							<AdBanner 
								zoneId="ZONE_3_ID" 
								format="auto"
								style={{ minHeight: '90px' }}
							/>
						</div>
					</>
				)}
			</div>
				{/* Navegación Rápida */}
				<div className="mt-4 pt-4 border-t border-gray-200">
					<h4 className="font-bold mb-2 text-sm">Navegación Rápida</h4>
					<div className="space-y-1">
						<button
							onClick={() => onNavigate && onNavigate('trabajo')}
							className={`w-full text-left px-3 py-2 rounded text-sm transition-all flex items-center gap-2 ${
								activeSection === 'trabajo' 
									? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
									: 'hover:bg-gray-100 text-gray-700'
							}`}
						>
							<i className="fa-solid fa-file-pdf"></i>
							Zona de Trabajo
						</button>
						<button
							onClick={() => onNavigate && onNavigate('ayuda')}
							className={`w-full text-left px-3 py-2 rounded text-sm transition-all flex items-center gap-2 ${
								activeSection === 'ayuda' 
									? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
									: 'hover:bg-gray-100 text-gray-700'
							}`}
						>
							<i className="fa-solid fa-circle-question"></i>
							Ayuda y Tutorial
						</button>
						<button
							onClick={() => onNavigate && onNavigate('blog')}
							className={`w-full text-left px-3 py-2 rounded text-sm transition-all flex items-center gap-2 ${
								activeSection === 'blog' 
									? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
									: 'hover:bg-gray-100 text-gray-700'
							}`}
						>
							<i className="fa-solid fa-blog"></i>
							Artículos
						</button>
						<button
							onClick={() => onNavigate && onNavigate('tutoriales')}
							className={`w-full text-left px-3 py-2 rounded text-sm transition-all flex items-center gap-2 ${
								activeSection === 'tutoriales' 
									? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
									: 'hover:bg-gray-100 text-gray-700'
							}`}
						>
							<i className="fa-solid fa-graduation-cap"></i>
							Tutoriales
						</button>
						<button
							onClick={() => onNavigate && onNavigate('casos-exito')}
							className={`w-full text-left px-3 py-2 rounded text-sm transition-all flex items-center gap-2 ${
								activeSection === 'casos-exito' 
									? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
									: 'hover:bg-gray-100 text-gray-700'
							}`}
						>
							<i className="fa-solid fa-trophy"></i>
							Casos de Éxito
						</button>
						<button
							onClick={() => onNavigate && onNavigate('recursos')}
							className={`w-full text-left px-3 py-2 rounded text-sm transition-all flex items-center gap-2 ${
								activeSection === 'recursos' 
									? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
									: 'hover:bg-gray-100 text-gray-700'
							}`}
						>
							<i className="fa-solid fa-book"></i>
							Recursos
						</button>
						<button
							onClick={() => onNavigate && onNavigate('acerca')}
							className={`w-full text-left px-3 py-2 rounded text-sm transition-all flex items-center gap-2 ${
								activeSection === 'acerca' 
									? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
									: 'hover:bg-gray-100 text-gray-700'
							}`}
						>
							<i className="fa-solid fa-info-circle"></i>
							Acerca De
						</button>
					</div>
				</div>
				</>
			)}
		</aside>
	)
}