import React, { useState, useEffect } from "react";
import { getElectivos } from "../services/electivo.service";
import { createSolicitud, getMisSolicitudes } from "../services/inscripcion.service";
import { obtenerPeriodoActual } from "../services/periodos.service";
import { normalizarPeriodo } from "../helpers/fechas";
import { isAlumno } from "../helpers/roles";
import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { useModal } from "../context/ModalContext";

import CardElectivo from "../components/CardElectivo";
import ModalInscripcion from "../components/ModalInscripcion";
import PeriodoCerrado from "../components/PeriodoCerrado";

export default function Electivos({ user, darkMode }) {
  const { showModal } = useModal();
  const [electivos, setElectivos] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [periodo, setPeriodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [electroSeleccionado, setElectroSeleccionado] = useState(null);

  const [modalInscripcion, setModalInscripcion] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      //si es alumno, verificamos periodo vigente
      if (isAlumno(user.rol)) {
        try {
          const resPeriodo = await obtenerPeriodoActual();
          setPeriodo(normalizarPeriodo(resPeriodo.data.data));
        } catch (err) {
          const backendMessage =
            err.response?.data?.message ||
            err.response?.data?.error ||
            "No hay periodo vigente.";

          showModal("error", backendMessage);
          setPeriodo(null);
        }
      }

      //cargamos electivos
      const data = await getElectivos();
      setElectivos(data);

      //si es alumno, cargamos sus solicitudes previas
      if (isAlumno(user.rol)) {
        try {
          const misSolicitudes = await getMisSolicitudes();
          setSolicitudes(misSolicitudes);
        } catch (err) {
          const backendMessage =
            err.response?.data?.message ||
            err.response?.data?.error ||
            "No se pudieron cargar solicitudes.";

          showModal("error", backendMessage);
          setSolicitudes([]);
        }
      }
    } catch (err) {
      console.error("Error general:", err);
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Hubo un problema al cargar el catálogo.";

      showModal("error", backendMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCrearSolicitud = async (electivo) => {
    try {
      await createSolicitud({ electivo_id: electivo.id });
      showModal("success", "Solicitud creada correctamente");
      setElectroSeleccionado(null);
      await cargarDatos();
    } catch (error) {
      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Error al inscribir";

      showModal("error", backendMessage);
    }
  };

  const handleInscribirClick = (electivo) => {
    setModalInscripcion(electivo);
  };

  const handleInscripcionExitosa = async (resultado) => {
    showModal(
      "success",
      resultado.message || "Inscripción realizada exitosamente"
    );
    setModalInscripcion(null);
    await cargarDatos();
  };

  const estaInscrito = (electivoId) => {
    return solicitudes.some((s) => s.electivo?.id === electivoId);
  };

  if (loading) return <div className="p-8 text-center">Cargando electivos...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  //bloqueo por periodo cerrado
  if (isAlumno(user.rol) && (!periodo || periodo.estado === "CERRADO")) {
    return (
      <div className="p-6">
        <h2 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>
          Catálogo de Electivos
        </h2>
        <PeriodoCerrado darkMode={darkMode} />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
          Catálogo de Electivos
        </h2>

        {isAlumno(user.rol) && solicitudes.length > 0 && (
          <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            <span className="font-medium">{solicitudes.length}</span> {solicitudes.length === 1 ? "inscripción" : "inscripciones"}
          </div>
        )}
      </div>

      {/* GRID DE TARJETAS */}
      {electivos.length === 0 ? (
        <div className={`text-center py-10 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          <p>No hay electivos disponibles para mostrar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {electivos.map((electivo) => (
            <CardElectivo
              key={electivo.id}
              electivo={electivo}
              darkMode={darkMode}
              rolUsuario={user.rol}
              inscrito={estaInscrito(electivo.id)}
              onClick={() => setElectroSeleccionado(electivo)} // Al hacer click abrimos el modal detalle
              onInscribir={() => handleInscribirClick(electivo)}
            />
          ))}
        </div>
      )}

      {/* MODAL DETALLES */}
      {electroSeleccionado && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setElectroSeleccionado(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className={`max-w-2xl w-full rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}
          >
            {/* Título y Estado */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-purple-500 mb-2">{electroSeleccionado.nombre}</h2>
                <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Profesor: {electroSeleccionado.nombre_profesor || "Por asignar"}
                </p>
              </div>
            </div>

            {/* Detalles */}
            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Descripción:</h3>
                <p className={darkMode ? "text-gray-300" : "text-gray-700"}>{electroSeleccionado.descripcion || "Sin descripción"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <p><strong>Cupos:</strong> {electroSeleccionado.cupos}</p>
                <p><strong>Créditos:</strong> {electroSeleccionado.creditos}</p>
              </div>
            </div>

            {/* Botones Modal */}
            <div className="flex gap-3">
              {/* Si es alumno y está aprobado, mostramos botón inscribir dentro del modal tambien */}
              {isAlumno(user.rol) && electroSeleccionado.estado === "APROBADO" && !estaInscrito(electroSeleccionado.id) && (
                <button
                  onClick={() => handleCrearSolicitud(electroSeleccionado)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} /> Inscribir
                </button>
              )}

              <button
                onClick={() => setElectroSeleccionado(null)}
                className="flex-1 bg-gray-300 dark:bg-gray-700 text-black dark:text-white py-3 rounded-xl font-medium"
              >
                Cerrar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* MODAL INSCRIPCION CONFIRMACION */}
      {modalInscripcion && (
        <ModalInscripcion
          electivo={modalInscripcion}
          darkMode={darkMode}
          onClose={() => setModalInscripcion(null)}
          onSuccess={handleInscripcionExitosa}
        />
      )}
    </div>
  );
}