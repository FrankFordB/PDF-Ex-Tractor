import AdBanner from './AdBanner'

export default function Sidebar({ results = [], onSelect, onViewChange, currentView = 'enProceso', selectedIndex, fields = [], onExportExcel, onReset, user }) {
	const finalizadas = results.map((r, i) => ({ ...r, i })).filter(r => r.status === 'Finalizada')
	const enProceso = results.map((r, i) => ({ ...r, i })).filter(r => r.status !== 'Finalizada')

	// Función para truncar desde el inicio mostrando los últimos caracteres
	const getTruncatedFileName = (fileName, maxLength = 35) => {
		if (!fileName) return ''
		if (fileName.length <= maxLength) return fileName
		return '...' + fileName.slice(-(maxLength - 3))
	}

	return (
		<aside className="w-full md:w-72 bg-white shadow md:h-screen p-3 md:p-4 overflow-auto md:overflow-y-auto">
			<div className="mb-4">
				<h2 className="text-lg md:text-xl font-bold">PDF Ex-Tractor</h2>
				<p className="text-xs md:text-sm text-gray-500">Dashboard</p>
			</div>

			<div className="mb-4 flex gap-2">
				<button onClick={() => onViewChange && onViewChange('enProceso')} className={`flex-1 px-2 py-1 rounded text-xs md:text-sm font-medium transition-all ${currentView === 'enProceso' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
					En proceso ({enProceso.length})
				</button>
				<button onClick={() => onViewChange && onViewChange('finalizadas')} className={`flex-1 px-2 py-1 rounded text-xs md:text-sm font-medium transition-all ${currentView === 'finalizadas' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
					Finalizadas ({finalizadas.length})
				</button>
			</div>

			<div className="mb-4">
				<div className="text-xs md:text-sm font-semibold mb-2">Listado</div>
				<div className="space-y-1 max-h-40 overflow-y-auto">
					{currentView === 'finalizadas' && (finalizadas.length === 0 ? <div className="text-xs text-gray-400">Ninguna</div> : finalizadas.map(item => (
						<button 
							key={item.i} 
							onClick={() => { onViewChange && onViewChange('finalizadas'); onSelect && onSelect(item.i) }} 
							className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 text-xs md:text-sm transition-colors overflow-hidden ${
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
							className={`w-full text-left px-2 py-1 rounded hover:bg-gray-100 text-xs md:text-sm transition-colors overflow-hidden ${
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
					className={`w-full text-white p-2 rounded transition-colors flex items-center justify-center gap-2 text-sm ${
						!user 
							? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' 
							: 'bg-green-600 hover:bg-green-700'
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
					className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors text-sm flex items-center justify-center gap-2"
				>
					<i className="fa-solid fa-rotate-left"></i>
					Reiniciar App
				</button>

				{/* Banners publicitarios - Solo para usuarios free y guests */}
				{(!user || user.accountType === 'free') && (
					<>
						<div className="mt-4 border-t border-gray-200 pt-4">
							<AdBanner 
								slot="9578186043" 
								format="auto"
								style={{ minHeight: '90px' }}
							/>
						</div>
						
						<div className="mt-4">
							<AdBanner 
								slot="6109714326" 
								format="auto"
								style={{ minHeight: '90px' }}
							/>
						</div>
						
						<div className="mt-4">
							<AdBanner 
								slot="6768189872" 
								format="auto"
								style={{ minHeight: '90px' }}
							/>
						</div>
					</>
				)}
			</div>
		</aside>
	)
}