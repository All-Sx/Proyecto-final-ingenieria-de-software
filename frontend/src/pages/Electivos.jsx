import React, { useState, useEffect } from "react";
import { getElectivos } from "../services/electivo.service";
import { motion } from "framer-motion"; // Librería para animaciones suaves
import {
  CheckCircle,
  XCircle,
  BookOpen,
  Users,
  GraduationCap,
  Calendar,
  Eye,
} from "lucide-react"; // Iconos modernos 
import { createSolicitud } from "../services/inscripcion.service";
export default function Electivos({ user, darkMode }) {
  const [electivos, setElectivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [electroSeleccionado, setElectroSeleccionado] = useState(null); // Electivo seleccionado para ver detalles
  const [mensajeInscripcion, setMensajeInscripcion] = useState({ tipo: "", texto: "" })
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const data = await getElectivos();
        console.log("ESTO ES LO QUE ENVÍA EL BACKEND:", data);
        setElectivos(data);
      } catch (err) {
        console.error("Error al cargar electivos:", err);
        setError("Hubo un problema al cargar el catálogo.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);


  //Aqui se llama para crear la solicitud de inscripcion
  const handleCrearSolicitud = async (e) => {
    try {
      const { id } = e;
      const res = createSolicitud({ electivo_id: id })
      setMensajeEdicion({ tipo: "success", texto: "Solicitud creada correctamente" });
    } catch (error) {
      setMensajeInscripcion({ tipo: "error", texto: "Error al inscribir" });
    }
  }

  if (loading) return <div className="p-8 text-center">Cargando electivos...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>
        Catálogo de Electivos
      </h2>

      {electivos.length === 0 ? (
        <div className={`text-center py-10 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          <p>No hay electivos disponibles para mostrar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {electivos.map((electivo) => (
            <motion.div
              key={electivo.id}
              // Animación de fade-in
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`rounded-2xl shadow-md p-6 hover:shadow-lg transition ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
                }`}
            >
              {/* ENCABEZADO DE LA TARJETA */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-purple-500 mb-1">
                    {electivo.nombre}
                  </h3>
                  <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                    {electivo.profesor}
                  </p>
                </div>
                {/* Badge de estado (pendiente/aprobado/rechazado) */}

              </div>

              {/* INFORMACIÓN DEL ELECTIVO */}
              <div className={`space-y-2 mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                <p><GraduationCap size={16} className="inline mr-2" />{electivo.carrera}</p>
                <p><Calendar size={16} className="inline mr-2" />Semestre {electivo.semestre}</p>
                <p><BookOpen size={16} className="inline mr-2" />{electivo.creditos} créditos</p>
                <p><Users size={16} className="inline mr-2" />{electivo.cuposDisponibles} cupos</p>
              </div>

              {/* BOTONES DE ACCIÓN */}
              <div className="flex gap-2">
                {/* Botón para ver detalles completos */}
                <button
                  onClick={() => setElectroSeleccionado(electivo)}
                  className="flex-1 flex items-center justify-center gap-2 bg-purple-100 text-purple-700 py-2 rounded-xl font-medium hover:bg-purple-200 transition"
                >
                  <Eye size={18} /> Ver detalles
                </button>
                {/* Botones de aprobar/rechazar SOLO si está pendiente */}
                {electivo.estado === "pendiente" && (
                  <>
                    <button
                      onClick={() => aprobarElectivo(electivo.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button
                      onClick={() => rechazarElectivo(electivo.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition"
                    >
                      <XCircle size={18} />
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/*DETALLES DEL ELECTIVO*/}
      {electroSeleccionado && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setElectroSeleccionado(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className={`max-w-2xl w-full rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
              }`}
          >
            {/* Encabezado del modal */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-purple-500 mb-2">
                  {electroSeleccionado.nombre}
                </h2>
                <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Profesor: {electroSeleccionado.profesor}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${electroSeleccionado.estado === "pendiente"
                  ? "bg-yellow-200 text-yellow-900"
                  : electroSeleccionado.estado === "aprobado"
                    ? "bg-green-200 text-green-900"
                    : "bg-red-200 text-red-900"
                  }`}
              >
                {electroSeleccionado.estado === "PENDIENTE"
                  ? "Pendiente"
                  : electroSeleccionado.estado === "APROBADO"
                    ? "Aprobado"
                    : "Rechazado"}
              </span>
            </div>

            {/* Información detallada */}
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Descripción:</h3>
                <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  {electroSeleccionado.descripcion}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-1">Carrera:</h3>
                  <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                    {electroSeleccionado.carrera}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Semestre:</h3>
                  <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                    {electroSeleccionado.semestre}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Créditos:</h3>
                  <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                    {electroSeleccionado.creditos}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Cupos disponibles:</h3>
                  <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                    {electroSeleccionado.cuposDisponibles}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Requisitos:</h3>
                <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                  {electroSeleccionado.requisitos}
                </p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3">
              {electroSeleccionado.estado === "APROBADO" && (
                <>
                  <button
                    onClick={() => {
                      handleCrearSolicitud(electroSeleccionado);
                      setElectroSeleccionado(null);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20} />
                    Inscribir
                  </button>

                </>
              )}
              <button
                onClick={() => setElectroSeleccionado(null)}
                className="flex-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-black dark:text-white py-3 rounded-xl font-medium transition"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}