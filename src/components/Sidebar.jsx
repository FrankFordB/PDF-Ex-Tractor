export default function Sidebar({ theme, setTheme, results = [], onSelect, onViewChange, currentView = 'enProceso' }) {
	const finalizadas = results.map((r, i) => ({ ...r, i })).filter(r => r.status === 'Finalizada')
	const enProceso = results.map((r, i) => ({ ...r, i })).filter(r => r.status !== 'Finalizada')

	return (
		<aside className="w-full md:w-72 bg-white dark:bg-slate-900 shadow md:h-screen p-3 md:p-4 overflow-auto md:overflow-y-auto">
			<div className="mb-4">
				<h2 className="text-lg md:text-xl font-bold">PDF Robado</h2>
				<p className="text-xs md:text-sm text-gray-500">Dashboard</p>
			</div>

			<div className="mb-4 flex gap-2">
				<button onClick={() => onViewChange && onViewChange('enProceso')} className={`flex-1 px-2 py-1 rounded text-xs md:text-sm font-medium transition-all ${currentView === 'enProceso' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-700'}`}>
					En proceso ({enProceso.length})
				</button>
				<button onClick={() => onViewChange && onViewChange('finalizadas')} className={`flex-1 px-2 py-1 rounded text-xs md:text-sm font-medium transition-all ${currentView === 'finalizadas' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-700'}`}>
					Finalizadas ({finalizadas.length})
				</button>
			</div>

			<div className="mb-4">
				<div className="text-xs md:text-sm font-semibold mb-2">Listado</div>
				<div className="space-y-1 max-h-32 md:max-h-40 overflow-auto">
					{currentView === 'finalizadas' && (finalizadas.length === 0 ? <div className="text-xs text-gray-400">Ninguna</div> : finalizadas.map(item => (
						<button key={item.i} onClick={() => { onViewChange && onViewChange('finalizadas'); onSelect && onSelect(item.i) }} className="w-full text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700 text-xs md:text-sm truncate">
							{item.fileName}
						</button>
					)))}

					{currentView === 'enProceso' && (enProceso.length === 0 ? <div className="text-xs text-gray-400">Ninguna</div> : enProceso.map(item => (
						<button key={item.i} onClick={() => { onViewChange && onViewChange('enProceso'); onSelect && onSelect(item.i) }} className="w-full text-left px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700 text-xs md:text-sm truncate">
							{item.fileName}
						</button>
					)))}
				</div>
			</div>

			<div className="mt-6">
				<div className="text-xs md:text-sm text-gray-500 font-semibold">Tema</div>
				<div className="flex gap-2 mt-2">
					<button onClick={() => setTheme('light')} className={`flex-1 px-2 md:px-3 py-1 rounded text-xs md:text-sm transition-all ${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-700'}`}>Claro</button>
					<button onClick={() => setTheme('dark')} className={`flex-1 px-2 md:px-3 py-1 rounded text-xs md:text-sm transition-all ${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-slate-700'}`}>Oscuro</button>
				</div>
			</div>
		</aside>
	)
}