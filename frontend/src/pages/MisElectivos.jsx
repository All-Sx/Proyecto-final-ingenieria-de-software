import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getMisElectivos } from "../services/electivo.service";

export default function MisElectivos({ user, darkMode }) {
  const [electivos, setElectivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarElectivos();
  }, []);

  const cargarElectivos = async () => {
    try {
      setLoading(true);
      const data = await getMisElectivos();
      setElectivos(data);
    } catch (err) {
      console.error("Error al cargar electivos:", err);
      setError("Error al cargar tus electivos");
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      PENDIENTE: "bg-yellow-100 text-yellow-800 border-yellow-300",
      APROBADO: "bg-green-100 text-green-800 border-green-300",
      RECHAZADO: "bg-red-100 text-red-800 border-red-300"
    };
    
    return badges[estado] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const getEstadoTexto = (estado) => {
    const textos = {
      PENDIENTE: "Pendiente de Revisión",
      APROBADO: "Aprobado",
      RECHAZADO: "Rechazado"
    };
    
    return textos[estado] || estado;
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando tus electivos...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
          Mis Electivos
        </h2>
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Lista de electivos que has registrado en el sistema
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-blue-50"}`}>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Total
          </p>
          <p className={`text-3xl font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
            {electivos.length}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-yellow-50"}`}>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Pendientes
          </p>
          <p className={`text-3xl font-bold ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}>
            {electivos.filter(e => e.estado === "PENDIENTE").length}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-green-50"}`}>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Aprobados
          </p>
          <p className={`text-3xl font-bold ${darkMode ? "text-green-400" : "text-green-600"}`}>
            {electivos.filter(e => e.estado === "APROBADO").length}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-red-50"}`}>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Rechazados
          </p>
          <p className={`text-3xl font-bold ${darkMode ? "text-red-400" : "text-red-600"}`}>
            {electivos.filter(e => e.estado === "RECHAZADO").length}
          </p>
        </div>
      </div>

      {/* Lista de electivos */}
      {electivos.length === 0 ? (
        <div className={`text-center py-16 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          <p className="text-lg mb-2">No has registrado electivos aún</p>
          <p className="text-sm">Comienza creando tu primer electivo desde "Registrar Electivo"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {electivos.map((electivo) => (
            <motion.div
              key={electivo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl shadow-md p-6 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                  {electivo.nombre}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEstadoBadge(electivo.estado)}`}>
                  {getEstadoTexto(electivo.estado)}
                </span>
              </div>

              <p className={`text-sm mb-4 ${darkMode ? "text-gray-400" : "text-gray-600"} line-clamp-3`}>
                {electivo.descripcion}
              </p>

              <div className={`space-y-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                <div className="flex justify-between">
                  <span className="font-medium">Créditos:</span>
                  <span>{electivo.creditos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Cupos totales:</span>
                  <span>{electivo.cupos}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Profesor:</span>
                  <span className="text-xs">{electivo.nombre_profesor}</span>
                </div>
              </div>

              {electivo.estado === "RECHAZADO" && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-xs text-red-700 dark:text-red-400">
                    Este electivo fue rechazado por el jefe de carrera. Puedes crear uno nuevo con las correcciones necesarias.
                  </p>
                </div>
              )}

              {electivo.estado === "PENDIENTE" && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-xs text-yellow-700 dark:text-yellow-400">
                    Esperando revisión del jefe de carrera
                  </p>
                </div>
              )}

              {electivo.estado === "APROBADO" && (
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-xs text-green-700 dark:text-green-400">
                    ✓ Electivo disponible para inscripciones
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
