export default function PeriodoVigente({ periodo, darkMode }) {
  const hoy = new Date();

  const diasRestantes = Math.ceil(
    (periodo.fechaFin - hoy) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className={`border rounded-2xl p-8 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100"
      }`}>
      <h2 className="text-xl font-semibold mb-3">
        Período de inscripción vigente
      </h2>

      <p>Inicio: {periodo.fechaInicio.toLocaleDateString()}</p>
      <p>Término: {periodo.fechaFin.toLocaleDateString()}</p>

      <p className="mt-2 font-semibold">
        Quedan {diasRestantes} días para el cierre
      </p>

      <button className="mt-6 bg-purple-600 text-white px-5 py-2 rounded-xl">
        Gestionar período
      </button>
    </div>
  );
}
