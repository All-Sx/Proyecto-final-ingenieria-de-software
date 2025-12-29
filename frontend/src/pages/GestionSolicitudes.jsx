import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  Search,
  Filter,
  ArrowUpCircle,
  AlertCircle
} from "lucide-react";
import { isJefe } from "../helpers/roles";
import { 
  getSolicitudes, 
  aprobarSolicitud, 
  rechazarSolicitud,
  moverARevision 
} from "../services/solicitudes.service";
import { ToastContainer } from "../components/Toast";
import { useToast } from "../hooks/useToast";

export default function GestionSolicitudes({ user, darkMode }) {
  if (!isJefe(user.rol)) {
    return (
      <div className="text-center mt-10">
        <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
          Acceso restringido. Solo Jefes de Carrera pueden acceder a esta sección.
        </p>
      </div>
    );
  }

  const [solicitudes, setSolicitudes] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState("PENDIENTE");
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarListaEspera, setMostrarListaEspera] = useState(false);
  const [solicitudesListaEspera, setSolicitudesListaEspera] = useState([]);
  const [electivoSeleccionado, setElectivoSeleccionado] = useState(null);
  const { toasts, removeToast, success, error, warning, info } = useToast();

  useEffect(() => {
    cargarSolicitudes();
  }, [filtroEstado]);

  const cargarSolicitudes = async () => {
    try {
      setLoading(true);
      const filtros = {};
      
      if (filtroEstado !== "TODOS") {
        filtros.estado = filtroEstado;
      }
      
      const response = await getSolicitudes(filtros);
      setSolicitudes(response.data.data || []);
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
      setSolicitudes([]);
    } finally {
      setLoading(false);
    }
  };

  const cargarListaEspera = async (electivoNombre) => {
    try {
      const response = await getSolicitudes({ estado: "LISTA_ESPERA" });
      const listaEspera = (response.data.data || []).filter(
        sol => sol.peticion.electivo === electivoNombre
      );
      setSolicitudesListaEspera(listaEspera);
      setElectivoSeleccionado(electivoNombre);
      setMostrarListaEspera(true);
    } catch (error) {
      console.error("Error al cargar lista de espera:", error);
      setSolicitudesListaEspera([]);
    }
  };

  const handleAprobar = async (solicitud) => {
    if (!window.confirm(`¿Confirmas aprobar la solicitud de ${solicitud.alumno.nombre}?`)) {
      return;
    }

    try {
      await aprobarSolicitud(solicitud.id);
      success(`✓ Solicitud aprobada para ${solicitud.alumno.nombre}`);
      cargarSolicitudes();
    } catch (err) {
      const mensaje = err.response?.data?.message || "Error al aprobar solicitud";
      error(mensaje);
      console.error("Error al aprobar:", err);
    }
  };

  const handleRechazar = async (solicitud) => {
    if (!window.confirm(`¿Confirmas rechazar la solicitud de ${solicitud.alumno.nombre}?`)) {
      return;
    }

    try {
      await rechazarSolicitud(solicitud.id);
      warning(`Solicitud rechazada para ${solicitud.alumno.nombre}`);
      
      // Preguntar si desea ver la lista de espera
      if (window.confirm("¿Deseas revisar la lista de espera para este electivo?")) {
        cargarListaEspera(solicitud.peticion.electivo);
      }
      
      cargarSolicitudes();
    } catch (err) {
      const mensaje = err.response?.data?.message || "Error al rechazar solicitud";
      error(mensaje);
      console.error("Error al rechazar:", err);
    }
  };

  const handleMoverARevision = async (solicitud) => {
    if (!window.confirm(`¿Confirmas mover a revisión la solicitud de ${solicitud.alumno.nombre}?`)) {
      return;
    }

    try {
      await moverARevision(solicitud.id);
      info(`${solicitud.alumno.nombre} movido a revisión exitosamente`);
      cargarListaEspera(electivoSeleccionado);
      cargarSolicitudes();
    } catch (err) {
      const mensaje = err.response?.data?.message || "Error al mover solicitud";
      error(mensaje);
      console.error("Error al mover:", err);
    }
  };

  const solicitudesFiltradas = solicitudes.filter(sol => {
    const termino = busqueda.toLowerCase();
    return (
      sol.alumno.nombre.toLowerCase().includes(termino) ||
      sol.alumno.rut.toLowerCase().includes(termino) ||
      sol.alumno.email.toLowerCase().includes(termino) ||
      sol.peticion.electivo.toLowerCase().includes(termino)
    );
  });

  const getEstadoBadge = (estado) => {
    const estilos = {
      PENDIENTE: "bg-yellow-100 text-yellow-800 border-yellow-300",
      ACEPTADO: "bg-green-100 text-green-800 border-green-300",
      RECHAZADO: "bg-red-100 text-red-800 border-red-300",
      LISTA_ESPERA: "bg-blue-100 text-blue-800 border-blue-300"
    };

    const iconos = {
      PENDIENTE: <Clock size={14} />,
      ACEPTADO: <CheckCircle size={14} />,
      RECHAZADO: <XCircle size={14} />,
      LISTA_ESPERA: <Users size={14} />
    };

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${estilos[estado] || "bg-gray-100 text-gray-800"}`}>
        {iconos[estado]}
        {estado.replace("_", " ")}
      </span>
    );
  };

  const estadisticas = {
    total: solicitudes.length,
    pendientes: solicitudes.filter(s => s.estado === "PENDIENTE").length,
    aceptadas: solicitudes.filter(s => s.estado === "ACEPTADO").length,
    rechazadas: solicitudes.filter(s => s.estado === "RECHAZADO").length,
    listaEspera: solicitudes.filter(s => s.estado === "LISTA_ESPERA").length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
            Gestión de Solicitudes
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Administra las solicitudes de inscripción a electivos
          </p>
        </div>
      </motion.div>

      {/* Estadísticas */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
          <p className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            TOTAL
          </p>
          <p className={`text-2xl font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
            {estadisticas.total}
          </p>
        </div>

        <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
          <p className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            PENDIENTES
          </p>
          <p className={`text-2xl font-bold ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}>
            {estadisticas.pendientes}
          </p>
        </div>

        <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
          <p className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            ACEPTADAS
          </p>
          <p className={`text-2xl font-bold ${darkMode ? "text-green-400" : "text-green-600"}`}>
            {estadisticas.aceptadas}
          </p>
        </div>

        <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
          <p className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            RECHAZADAS
          </p>
          <p className={`text-2xl font-bold ${darkMode ? "text-red-400" : "text-red-600"}`}>
            {estadisticas.rechazadas}
          </p>
        </div>

        <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
          <p className={`text-xs font-semibold ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            LISTA ESPERA
          </p>
          <p className={`text-2xl font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
            {estadisticas.listaEspera}
          </p>
        </div>
      </motion.div>

      {/* Filtros y Búsqueda */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search 
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? "text-gray-400" : "text-gray-500"}`} 
              size={18} 
            />
            <input
              type="text"
              placeholder="Buscar por alumno, RUT, email o electivo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                darkMode 
                  ? "bg-gray-700 border-gray-600 text-gray-100" 
                  : "bg-gray-50 border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            />
          </div>

          {/* Filtro de Estado */}
          <div className="flex items-center gap-2">
            <Filter size={18} className={darkMode ? "text-gray-400" : "text-gray-600"} />
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className={`px-4 py-2 rounded-lg border ${
                darkMode 
                  ? "bg-gray-700 border-gray-600 text-gray-100" 
                  : "bg-gray-50 border-gray-300 text-gray-900"
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
            >
              <option value="TODOS">Todos los estados</option>
              <option value="PENDIENTE">Pendientes</option>
              <option value="LISTA_ESPERA">Lista de Espera</option>
              <option value="ACEPTADO">Aceptadas</option>
              <option value="RECHAZADO">Rechazadas</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Lista de Solicitudes - Cards */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className={`mt-4 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Cargando solicitudes...
          </p>
        </div>
      ) : solicitudesFiltradas.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center py-12 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}
        >
          <AlertCircle size={48} className={`mx-auto mb-4 ${darkMode ? "text-gray-600" : "text-gray-400"}`} />
          <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            No se encontraron solicitudes
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {solicitudesFiltradas.map((solicitud, index) => (
            <motion.div
              key={solicitud.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className={`p-5 rounded-xl shadow-md border-2 ${
                darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              {/* Header de la Card */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className={`font-bold text-lg ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                    {solicitud.alumno.nombre}
                  </h3>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {solicitud.alumno.rut}
                  </p>
                </div>
                {getEstadoBadge(solicitud.estado)}
              </div>

              {/* Información */}
              <div className="space-y-2 mb-4">
                <div>
                  <p className={`text-xs font-semibold ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                    Carrera
                  </p>
                  <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {solicitud.alumno.carrera}
                  </p>
                </div>

                <div>
                  <p className={`text-xs font-semibold ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                    Electivo Solicitado
                  </p>
                  <p className={`text-sm font-medium ${darkMode ? "text-purple-400" : "text-purple-600"}`}>
                    {solicitud.peticion.electivo}
                  </p>
                  <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    {solicitud.peticion.creditos} créditos • {solicitud.peticion.cupos_totales} cupos
                  </p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-300 dark:border-gray-600">
                  <div>
                    <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                      Prioridad
                    </p>
                    <p className={`text-sm font-bold ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      #{solicitud.prioridad}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                      Fecha
                    </p>
                    <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                      {new Date(solicitud.fecha_solicitud).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              {solicitud.estado === "PENDIENTE" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAprobar(solicitud)}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg font-medium transition text-sm"
                  >
                    <CheckCircle size={16} />
                    Aprobar
                  </button>
                  <button
                    onClick={() => handleRechazar(solicitud)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg font-medium transition text-sm"
                  >
                    <XCircle size={16} />
                    Rechazar
                  </button>
                </div>
              )}

              {solicitud.estado === "LISTA_ESPERA" && (
                <button
                  onClick={() => handleMoverARevision(solicitud)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg font-medium transition text-sm"
                >
                  <ArrowUpCircle size={16} />
                  Mover a Revisión
                </button>
              )}

              {(solicitud.estado === "ACEPTADO" || solicitud.estado === "RECHAZADO") && (
                <div className={`text-center py-2 rounded-lg ${
                  solicitud.estado === "ACEPTADO" 
                    ? "bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300" 
                    : "bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300"
                }`}>
                  <p className="text-sm font-medium">
                    {solicitud.estado === "ACEPTADO" ? "✓ Solicitud Aprobada" : "✗ Solicitud Rechazada"}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modal Lista de Espera */}
      <AnimatePresence>
        {mostrarListaEspera && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setMostrarListaEspera(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`max-w-3xl w-full max-h-[80vh] overflow-y-auto rounded-2xl ${
                darkMode ? "bg-gray-800" : "bg-white"
              } p-6 shadow-2xl`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className={`text-2xl font-bold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                  Lista de Espera - {electivoSeleccionado}
                </h2>
                <button
                  onClick={() => setMostrarListaEspera(false)}
                  className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition`}
                >
                  <XCircle size={24} />
                </button>
              </div>

              {solicitudesListaEspera.length === 0 ? (
                <div className="text-center py-8">
                  <Users size={48} className={`mx-auto mb-4 ${darkMode ? "text-gray-600" : "text-gray-400"}`} />
                  <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    No hay alumnos en lista de espera para este electivo
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {solicitudesListaEspera.map((sol) => (
                    <div
                      key={sol.id}
                      className={`p-4 rounded-lg border ${
                        darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className={`font-semibold ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                            {sol.alumno.nombre}
                          </p>
                          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                            {sol.alumno.rut} • {sol.alumno.carrera}
                          </p>
                          <p className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
                            Prioridad: #{sol.prioridad} • {new Date(sol.fecha_solicitud).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <button
                          onClick={() => handleMoverARevision(sol)}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition text-sm whitespace-nowrap"
                        >
                          <ArrowUpCircle size={16} />
                          Mover a Revisión
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
