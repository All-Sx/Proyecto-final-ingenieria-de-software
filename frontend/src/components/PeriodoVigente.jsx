export default function PeriodoVigente({ periodo, darkMode, onGestionar }) {
  const hoy = new Date();

  const diasRestantes = Math.ceil(
    (periodo.fechaFin - hoy) / (1000 * 60 * 60 * 24)
  );

  const getEstadoColor = (estado) => {
    switch(estado) {
      case "INSCRIPCION":
        return "text-green-500";
      case "PLANIFICACION":
        return "text-yellow-500";
      case "CERRADO":
        return "text-gray-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className={`border rounded-2xl p-8 ${darkMode ? "bg-gray-900 text-white border-gray-700" : "bg-gray-100 border-gray-300"}`}>
      <h2 className="text-xl font-semibold mb-4">
        Período Actual
      </h2>

      <div className="mb-4">
        <p className={`text-sm mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Nombre del período
        </p>
        <h3 className="text-2xl font-bold mb-3">
          {periodo.nombre}
        </h3>
      </div>

      <div className="mb-4">
        <p className={`text-sm mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Estado
        </p>
        <h3 className={`text-xl font-semibold ${getEstadoColor(periodo.estado)}`}>
          {periodo.estado.toLowerCase()}
        </h3>
      </div>

      <div className="mb-2">
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Inicio: <span className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
            {periodo.fechaInicio.toLocaleDateString()}
          </span>
        </p>
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Término: <span className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
            {periodo.fechaFin.toLocaleDateString()}
          </span>
        </p>
      </div>

      <div className={`mt-4 p-3 rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Tiempo restante
        </p>
        <p className="text-2xl font-bold text-purple-500">
          {diasRestantes > 0 ? `${diasRestantes} días` : 'Finalizado'}
        </p>
      </div>

      <button
        onClick={onGestionar}
        className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-medium transition"
      >
        Gestionar período
      </button>
    </div>
  );
}
