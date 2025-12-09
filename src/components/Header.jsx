export default function Header({ onAddField, fields, onExportAll }) {
return (
<header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded shadow">
<div className="w-full sm:w-auto">
<h1 className="text-xl sm:text-2xl font-bold">PDF Ex-Tractor</h1>
<p className="text-xs sm:text-sm text-gray-500">Subí tus facturas y extrae campos</p>
<p className="text-xs sm:text-sm text-gray-600">by Franco Burgoa</p>
</div>


<div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
<button onClick={onExportAll} className="w-full sm:w-auto px-3 py-2 bg-green-600 text-white rounded text-xs sm:text-sm font-medium hover:bg-green-700 transition-all">Exportar (.xlsx)</button>
</div>
</header>
)
}