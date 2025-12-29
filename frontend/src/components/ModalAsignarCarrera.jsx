import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCarreras } from "../services/carreras.service";
import { asignarCarrera } from "../services/usuarios.service";
import { useModal } from "../context/ModalContext";


export default function ModalAsignarCarrera({ alumno, darkMode, onClose, onSuccess }) {
  const [carreras, setCarreras] = useState([]);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { showModal } = useModal();

  useEffect(() => {
    cargarCarreras();
  }, []);

  const cargarCarreras = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCarreras();
      setCarreras(data);

      if (alumno.alumno?.carrera) {
        setCarreraSeleccionada(alumno.alumno.carrera.codigo);
      }
    } catch (err) {
      console.error("Error al cargar carreras:", err);
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error al cargar carreras.";

      showModal("error", backendMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!carreraSeleccionada) {
      showModal("error", "Debes seleccionar una carrera");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const resultado = await asignarCarrera(alumno.id, carreraSeleccionada);

      if (onSuccess) {
        onSuccess(resultado);
      }

      onClose();
    } catch (err) {
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error al asignar carrera.";

      showModal("error", backendMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`w-full max-w-md rounded-2xl shadow-xl p-6 ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
            }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Asignar Carrera</h2>
            <button
              onClick={onClose}
              className={`text-2xl ${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900"}`}
            >
              ×
            </button>
          </div>

          <div className={`mb-4 p-4 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
            <h3 className="font-semibold text-lg mb-1">{alumno.nombre_completo}</h3>
            <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              RUT: {alumno.rut}
            </p>
            <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Email: {alumno.email}
            </p>
            {alumno.alumno?.carrera && (
              <p className={`text-sm mt-2 font-medium ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                Carrera actual: {alumno.alumno.carrera.nombre}
              </p>
            )}
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p>Cargando carreras...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-semibold mb-2">
                  Selecciona una carrera
                </label>

                <select
                  value={carreraSeleccionada}
                  onChange={(e) => setCarreraSeleccionada(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300 text-gray-900"
                    }`}
                  required
                >
                  <option value="">-- Selecciona una carrera --</option>
                  {carreras.map((carrera) => (
                    <option key={carrera.codigo} value={carrera.codigo}>
                      {carrera.nombre} ({carrera.codigo})
                    </option>
                  ))}
                </select>
              </div>

              <div className={`mb-4 p-3 rounded-lg ${darkMode ? "bg-blue-900/30 border border-blue-700" : "bg-blue-50 border border-blue-300"}`}>
                <p className={`text-sm ${darkMode ? "text-blue-300" : "text-blue-800"}`}>
                  {alumno.alumno?.carrera ?
                    "Cambiar la carrera actualizará la información del alumno." :
                    "Esta será la primera asignación de carrera para este alumno."}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className={`flex-1 py-3 rounded-lg font-medium transition ${darkMode
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
                  disabled={submitting || !carreraSeleccionada}
                >
                  {submitting ? "Asignando..." : "Asignar Carrera"}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
