import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { crearSolicitudInscripcion, getMisSolicitudes } from "../services/inscripcion.service";
import { getElectivos } from "../services/electivo.service";

export default function ModalInscripcion({ electivo, darkMode, onClose, onSuccess }) {
  const [prioridad, setPrioridad] = useState(1);
  const [prioridadesUsadas, setPrioridadesUsadas] = useState([]);
  const [maxPrioridad, setMaxPrioridad] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      const solicitudes = await getMisSolicitudes();
      
      const prioridadesEnUso = solicitudes.map(s => s.prioridad);
      setPrioridadesUsadas(prioridadesEnUso);

      const electivos = await getElectivos();
      const electivosAprobados = electivos.filter(e => e.estado === "APROBADO");
      setMaxPrioridad(electivosAprobados.length);

      let prioridadInicial = 1;
      while (prioridadesEnUso.includes(prioridadInicial) && prioridadInicial <= electivosAprobados.length) {
        prioridadInicial++;
      }
      setPrioridad(prioridadInicial);

    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError("Error al cargar información de prioridades");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (prioridadesUsadas.includes(prioridad)) {
      setError(`Ya tienes un electivo inscrito con prioridad ${prioridad}. Elige otra prioridad.`);
      return;
    }

    if (prioridad > maxPrioridad) {
      setError(`La prioridad no puede ser mayor a ${maxPrioridad} (número de electivos disponibles).`);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const resultado = await crearSolicitudInscripcion(electivo.id, prioridad);
      
      if (onSuccess) {
        onSuccess(resultado);
      }
      
      onClose();
    } catch (err) {
      const mensajeError = err.response?.data?.message || "Error al crear solicitud de inscripción";
      setError(mensajeError);
    } finally {
      setSubmitting(false);
    }
  };

  const getPrioridadesDisponibles = () => {
    const prioridades = [];
    for (let i = 1; i <= maxPrioridad; i++) {
      prioridades.push({
        valor: i,
        disponible: !prioridadesUsadas.includes(i),
        texto: i === 1 ? `${i} - Máxima prioridad` : i === maxPrioridad ? `${i} - Mínima prioridad` : `${i}`
      });
    }
    return prioridades;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`w-full max-w-md rounded-2xl shadow-xl p-6 ${
            darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Inscribir Electivo</h2>
            <button
              onClick={onClose}
              className={`text-2xl ${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900"}`}
            >
              
            </button>
          </div>

          <div className={`mb-4 p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
            <h3 className="font-semibold text-lg mb-2">{electivo.nombre}</h3>
            <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              {electivo.descripcion}
            </p>
            <div className={`text-sm mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              <p><strong>Profesor:</strong> {electivo.nombre_profesor}</p>
              <p><strong>Créditos:</strong> {electivo.creditos}</p>
              <p><strong>Cupos:</strong> {electivo.cupos}</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p>Cargando información de prioridades...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-semibold mb-2">
                  Selecciona la prioridad
                </label>
                
                <select
                  value={prioridad}
                  onChange={(e) => setPrioridad(parseInt(e.target.value))}
                  className={`w-full p-3 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  required
                >
                  {getPrioridadesDisponibles().map((p) => (
                    <option key={p.valor} value={p.valor} disabled={!p.disponible}>
                      {p.texto} {!p.disponible && "(Ya usada)"}
                    </option>
                  ))}
                </select>

                {prioridadesUsadas.length > 0 && (
                  <p className={`text-xs mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Prioridades ya usadas: {prioridadesUsadas.sort((a, b) => a - b).join(", ")}
                  </p>
                )}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className={`flex-1 py-3 rounded-lg font-medium transition ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                  }`}
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitting || !prioridad}
                >
                  {submitting ? "Inscribiendo..." : "Inscribir"}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
