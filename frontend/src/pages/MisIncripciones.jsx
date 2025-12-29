import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { deleteSolicitud, getMisSolicitudes } from "../services/inscripcion.service";
import { isAlumno } from "../helpers/roles";
import PeriodoCerrado from "../components/PeriodoCerrado";
import { obtenerPeriodoActual } from "../services/periodos.service";
import { normalizarPeriodo } from "../helpers/fechas";
import { XCircle } from "lucide-react";
import CardInscripcion from "../components/CardInscripcion";

export default function MisSolicitudes({ user, darkMode }) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [periodo, setPeriodo] = useState(null);
    const [solicitudes, setSolicitudes] = useState([]);
    const [mensaje, setMensaje] = useState(null);
    const [electroSeleccionado, setElectroSeleccionado] = useState(null)

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            if (isAlumno(user.rol)) {
                try {
                    const resPeriodo = await obtenerPeriodoActual();
                    setPeriodo(normalizarPeriodo(resPeriodo.data.data));
                } catch (err) {
                    console.log("No hay periodo vigente o error:", err);
                    setPeriodo(null);
                }
            }
            if (isAlumno(user.rol)) {
                try {
                    const solicitudes = await getMisSolicitudes();
                    setSolicitudes(solicitudes);
                } catch (err) {
                    console.log("No se pudieron cargar solicitudes:", err);
                    setSolicitudes([]);
                }
            }
        } catch (err) {
            console.error("Error al cargar electivos:", err);
            setError("Hubo un problema al cargar el catálogo.");
        } finally {
            setLoading(false);
        }
    };


    if (loading) return <div className="p-8 text-center">Cargando electivos...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    const handleEliminacion = async (id) => {
        try {
            await deleteSolicitud(id);
            setMensaje({ tipo: "success", texto: "Solicitud eliminada correctamente" });
            setElectroSeleccionado(null);
            await cargarDatos();
        } catch (error) {
            setMensaje({ tipo: "error", texto: "Error al eliminar" });
        }
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
                    Electivos Inscritos
                </h2>

                {isAlumno(user.rol) && solicitudes.length > 0 && (
                    <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        <span className="font-medium">{solicitudes.length}</span> {solicitudes.length === 1 ? "inscripción" : "inscripciones"}
                    </div>
                )}
            </div>

            {/* MENSAJES DE ALERTA */}
            {mensaje && (
                <div className={`mb-6 p-4 rounded-lg ${mensaje.tipo === "success"
                    ? "bg-green-100 border border-green-400 text-green-800"
                    : "bg-red-100 border border-red-400 text-red-800"
                    }`}>
                    {mensaje.texto}
                </div>
            )}

            {/* GRID DE TARJETAS */}
            {solicitudes.length === 0 ? (
                <div className={`text-center py-10 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    <p>No hay electivos inscritos.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {solicitudes.map((solicitud) => (
                        <CardInscripcion
                            key={solicitud.id}
                            electivo={solicitud.electivo}
                            darkMode={darkMode}
                            rolUsuario={user.rol}
                            estado={solicitud.estado}
                            onClick={() => setElectroSeleccionado(solicitud)} // Al hacer click abrimos el modal detalle
                            onEliminar={() => handleEliminacion(solicitud.id)}
                            periodoActivo={periodo && periodo.estado === "INSCRIPCION"}
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
                                <h2 className="text-2xl font-bold text-purple-500 mb-2">{electroSeleccionado.electivo.nombre}</h2>
                                <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                                    Profesor: {electroSeleccionado.electivo.nombre_profesor || "Por asignar"}
                                </p>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${electroSeleccionado.estado?.toUpperCase() === "PENDIENTE"
                                    ? "bg-yellow-200 text-yellow-900"
                                    : electroSeleccionado.estado?.toUpperCase() === "ACEPTADO"
                                        ? "bg-green-200 text-green-900"
                                        : "bg-red-200 text-red-900"
                                    }`}
                            >
                                {electroSeleccionado.estado?.toUpperCase() === "PENDIENTE"
                                    ? "Pendiente"
                                    : electroSeleccionado.estado?.toUpperCase() === "ACEPTADO"
                                        ? "Aceptado"
                                        : "Rechazado"}
                            </span>
                        </div>


                        {/* Detalles */}
                        <div className="space-y-4 mb-6">
                            <div>
                                <h3 className="font-semibold text-lg mb-2">Descripción:</h3>
                                <p className={darkMode ? "text-gray-300" : "text-gray-700"}>{electroSeleccionado.electivo.descripcion || "Sin descripción"}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <p><strong>Cupos:</strong> {electroSeleccionado.electivo.cupos}</p>
                                <p><strong>Créditos:</strong> {electroSeleccionado.electivo.creditos}</p>
                            </div>
                        </div>

                        {/* Botones Modal */}
                        <div className="flex gap-3">

                            <button
                                onClick={() => setElectroSeleccionado(null)}
                                className={`${periodo && periodo.estado === "INSCRIPCION" ? "flex-1" : "w-full"} bg-gray-300 dark:bg-gray-700 text-black dark:text-white py-3 rounded-xl font-medium`}
                            >
                                Cerrar
                            </button>
                            {periodo && periodo.estado === "INSCRIPCION" && (
                                <button
                                    onClick={() => handleEliminacion(electroSeleccionado.id)}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
                                >
                                    <XCircle size={20} />
                                    Eliminar inscripcion
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}