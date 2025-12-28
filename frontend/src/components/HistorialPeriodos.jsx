export default function HistorialPeriodos({ periodos, darkMode }) {
    if (!periodos || periodos.length === 0) {
        return (
            <div className={`border rounded-2xl p-8 text-center ${darkMode ? "bg-gray-900 text-gray-400" : "bg-gray-100 text-gray-600"}`}>
                <p>No hay periodos cerrados en el historial</p>
            </div>
        );
    }

    return (
        <div className={`border rounded-2xl p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100"}`}>
            <h2 className="text-xl font-semibold mb-4">Historial de Períodos</h2>
            
            <div className="space-y-3">
                {periodos.map((periodo) => (
                    <div
                        key={periodo.id}
                        className={`p-4 rounded-xl border ${
                            darkMode 
                                ? "bg-gray-800 border-gray-700" 
                                : "bg-white border-gray-300"
                        }`}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-lg mb-1">{periodo.nombre}</h3>
                                <div className="text-sm space-y-1">
                                    <p>
                                        <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                                            Inicio:
                                        </span>{" "}
                                        {new Date(periodo.fecha_inicio.split("-").reverse().join("-")).toLocaleDateString()}
                                    </p>
                                    <p>
                                        <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
                                            Término:
                                        </span>{" "}
                                        {new Date(periodo.fecha_fin.split("-").reverse().join("-")).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-500 text-white">
                                {periodo.estado}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
