import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
  Users,
  GraduationCap,
  Calendar,
  Eye,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import ModoOscuro from "../components/ModoOscuro";
import { getCarreras } from "../services/carreras.service";
import {
  getElectivos,
  updateElectivo,
  aprobarElectivo as aprobarElectivoAPI,
  rechazarElectivo as rechazarElectivoAPI
} from "../services/electivo.service";
import { useModal } from "../context/ModalContext";

// Panel de gestión de electivos para Jefe de Carrera
export default function GestionElectivos() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { showModal } = useModal();

  // Estados de filtros
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [electroSeleccionado, setElectroSeleccionado] = useState(null);

  // Estados de datos
  const [electivos, setElectivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carreras, setCarreras] = useState([]);

  // Estados de edición
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formData, setFormData] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // Cargar datos al montar
  useEffect(() => {
    cargarElectivos();
    cargarCarreras();
  }, []);

  const cargarElectivos = async () => {
    try {
      setLoading(true);
      const data = await getElectivos();
      console.log("Electivos cargados desde la API:", data);
      setElectivos(data);
    } catch (error) {
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error al cargar electivos";

      showModal("error", backendMessage);
    } finally {
      setLoading(false);
    }
  };

  const cargarCarreras = async () => {
    try {
      const data = await getCarreras();
      console.log("Carreras cargadas desde la API:", data);
      setCarreras(data);
    } catch (error) {
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error al cargar carreras:";

      showModal("error", backendMessage);
    }
  };

  const activarEdicion = () => {
    setFormData({
      nombre: electroSeleccionado.nombre,
      descripcion: electroSeleccionado.descripcion,
      creditos: electroSeleccionado.creditos,
      cupos: electroSeleccionado.cupos,
      nombre_profesor: electroSeleccionado.nombre_profesor,
      distribucion_cupos: [...electroSeleccionado.distribucion_cupos] || []
    });
    setModoEdicion(true);
  };

  const cancelarEdicion = () => {
    setModoEdicion(false);
    setFormData(null);
  };

  const guardarCambios = async () => {
    try {
      setGuardando(true);

      // Convertir todas las cantidades a números antes de validar y enviar
      const distribucionNormalizada = formData.distribucion_cupos.map(item => ({
        ...item,
        cantidad: parseInt(item.cantidad) || 0
      }));

      // Validar que la suma de cupos coincida
      const sumaCupos = distribucionNormalizada.reduce((sum, item) => sum + item.cantidad, 0);
      if (sumaCupos !== parseInt(formData.cupos)) {
        showModal(
          "error",
          `La suma de la distribución (${sumaCupos}) no coincide con los cupos totales (${formData.cupos}).`
        );
        setGuardando(false);
        return;
      }

      // Enviar datos con distribución normalizada
      const datosAEnviar = {
        ...formData,
        distribucion_cupos: distribucionNormalizada
      };

      await updateElectivo(electroSeleccionado.id, datosAEnviar);

      // Recargar electivos
      await cargarElectivos();

      // Cerrar modal y resetear estados
      setElectroSeleccionado(null);
      setModoEdicion(false);
      setFormData(null);
    } catch (error) {
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error al guardar los cambios";

      showModal("error", backendMessage);
      console.error("Error al guardar cambios:", err);
    } finally {
      setGuardando(false);
    }
  };

  const aprobar = async (id) => {
    try {
      await aprobarElectivoAPI(id);
      await cargarElectivos();
      setElectroSeleccionado(null);

    } catch (err) {
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error al aprobar el electivo";

      showModal("error", backendMessage);
      console.error(err);
    }
  };

  const rechazar = async (id) => {
    try {
      await rechazarElectivoAPI(id);
      await cargarElectivos();
      setElectroSeleccionado(null);
    } catch (error) {
      console.error("Error al rechazar electivo:", error);
      alert("Error al rechazar el electivo");
    }
  };

  const agregarCarrera = () => {
    if (!formData.distribucion_cupos) {
      setFormData({ ...formData, distribucion_cupos: [] });
    }

    // Buscar una carrera que no esté en la distribución
    const carrerasUsadas = formData.distribucion_cupos.map(d => d.carrera_id);
    const carreraDisponible = carreras.find(c => !carrerasUsadas.includes(c.id));

    if (carreraDisponible) {
      setFormData({
        ...formData,
        distribucion_cupos: [
          ...formData.distribucion_cupos,
          { carrera_id: carreraDisponible.id, carrera_nombre: carreraDisponible.nombre, cantidad: "" }
        ]
      });
    } else {
      showModal("error", "No hay más carreras disponibles para asignar cupos.");
    }
  };

  const eliminarCarrera = (index) => {
    const nuevaDistribucion = formData.distribucion_cupos.filter((_, i) => i !== index);
    setFormData({ ...formData, distribucion_cupos: nuevaDistribucion });
  };

  const actualizarCantidadCarrera = (index, cantidad) => {
    const nuevaDistribucion = [...formData.distribucion_cupos];
    const valor = cantidad === "" ? "" : parseInt(cantidad);
    nuevaDistribucion[index] = { ...nuevaDistribucion[index], cantidad: valor };
    setFormData({ ...formData, distribucion_cupos: nuevaDistribucion });
  };

  const cambiarCarrera = (index, carreraId) => {
    const carrera = carreras.find(c => c.id === parseInt(carreraId));
    if (carrera) {
      const nuevaDistribucion = [...formData.distribucion_cupos];
      nuevaDistribucion[index] = {
        ...nuevaDistribucion[index],
        carrera_id: carrera.id,
        carrera_nombre: carrera.nombre
      };
      setFormData({ ...formData, distribucion_cupos: nuevaDistribucion });
    }
  };

  // Filtrado de electivos
  const electivosFiltrados = electivos.filter((e) => {
    const matchEstado = filtroEstado === "todos" || e.estado?.toUpperCase() === filtroEstado.toUpperCase();
    const matchBusqueda =
      e.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.nombre_profesor?.toLowerCase().includes(busqueda.toLowerCase());
    return matchEstado && matchBusqueda;
  });

  // Estadísticas
  const stats = {
    total: electivos.length,
    pendientes: electivos.filter((e) => e.estado?.toUpperCase() === "PENDIENTE").length,
    aprobados: electivos.filter((e) => e.estado?.toUpperCase() === "APROBADO").length,
    rechazados: electivos.filter((e) => e.estado?.toUpperCase() === "RECHAZADO").length,
  };

  return (
    <div
      className={`min-h-screen p-8 transition-colors ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
        }`}
    >

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Gestión de Electivos</h1>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { icon: BookOpen, color: "text-blue-600", label: "Total Electivos", value: stats.total },
          { icon: Clock, color: "text-yellow-500", label: "Pendientes", value: stats.pendientes },
          { icon: CheckCircle, color: "text-green-600", label: "Aprobados", value: stats.aprobados },
          { icon: XCircle, color: "text-red-600", label: "Rechazados", value: stats.rechazados },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-2xl shadow-md ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
              }`}
          >
            <div className="flex items-center gap-3">
              <stat.icon className={stat.color} size={24} />
              <div>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-sm`}>
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Panel con filtros multiples para refinar la busqueda de electivos */}
      <div
        className={`p-6 rounded-2xl shadow-md mb-6 ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
          }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className={darkMode ? "text-gray-300" : "text-gray-600"} />
          <h2 className="text-lg font-semibold">Filtros</h2>
        </div>

        {/* Grid de 2 columnas para los filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. BARRA DE BÚSQUEDA POR TEXTO */}
          <div className="relative">
            <Search
              className={`absolute left-3 top-3 ${darkMode ? "text-gray-400" : "text-gray-400"
                }`}
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar por nombre o profesor..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)} // Actualiza el estado en cada tecla
              className={`w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode
                ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900"
                }`}
            />
          </div>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className={`border rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode
              ? "bg-gray-700 border-gray-600 text-gray-100"
              : "bg-white border-gray-300 text-gray-900"
              }`}
          >
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="aprobado">Aprobados</option>
            <option value="rechazado">Rechazados</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {electivosFiltrados.map((e) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`rounded-2xl shadow-md p-6 hover:shadow-lg transition ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
              }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-purple-500 mb-1">
                  {e.nombre}
                </h3>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  {e.nombre_profesor}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${e.estado?.toUpperCase() === "PENDIENTE"
                  ? "bg-yellow-200 text-yellow-900"
                  : e.estado?.toUpperCase() === "APROBADO"
                    ? "bg-green-200 text-green-900"
                    : "bg-red-200 text-red-900"
                  }`}
              >
                {e.estado?.toUpperCase() === "PENDIENTE"
                  ? "Pendiente"
                  : e.estado?.toUpperCase() === "APROBADO"
                    ? "Aprobado"
                    : "Rechazado"}
              </span>
            </div>

            <div className={`space-y-2 mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              <p><BookOpen size={16} className="inline mr-2" />{e.creditos} créditos</p>
              <p><Users size={16} className="inline mr-2" />{e.cupos} cupos</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setElectroSeleccionado(e)}
                className="flex-1 flex items-center justify-center gap-2 bg-purple-100 text-purple-700 py-2 rounded-xl font-medium hover:bg-purple-200 transition"
              >
                <Eye size={18} /> Ver detalles
              </button>
              {e.estado?.toUpperCase() === "PENDIENTE" && (
                <>
                  <button
                    onClick={() => aprobar(e.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button
                    onClick={() => rechazar(e.id)}
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

      {electroSeleccionado && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setElectroSeleccionado(null);
            setModoEdicion(false);
            setFormData(null);
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className={`max-w-3xl w-full rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
              }`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                {modoEdicion ? (
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className={`text-2xl font-bold text-purple-500 mb-2 w-full border-b-2 border-purple-500 bg-transparent focus:outline-none ${darkMode ? "text-purple-400" : "text-purple-500"
                      }`}
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-purple-500 mb-2">
                    {electroSeleccionado.nombre}
                  </h2>
                )}

                {modoEdicion ? (
                  <input
                    type="text"
                    value={formData.nombre_profesor}
                    onChange={(e) => setFormData({ ...formData, nombre_profesor: e.target.value })}
                    className={`text-lg w-full border-b bg-transparent focus:outline-none ${darkMode ? "text-gray-400 border-gray-600" : "text-gray-600 border-gray-300"
                      }`}
                    placeholder="Nombre del profesor"
                  />
                ) : (
                  <p className={`text-lg ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Profesor: {electroSeleccionado.nombre_profesor}
                  </p>
                )}
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ml-4 ${electroSeleccionado.estado?.toUpperCase() === "PENDIENTE"
                  ? "bg-yellow-200 text-yellow-900"
                  : electroSeleccionado.estado?.toUpperCase() === "APROBADO"
                    ? "bg-green-200 text-green-900"
                    : "bg-red-200 text-red-900"
                  }`}
              >
                {electroSeleccionado.estado?.toUpperCase() === "PENDIENTE"
                  ? "Pendiente"
                  : electroSeleccionado.estado?.toUpperCase() === "APROBADO"
                    ? "Aprobado"
                    : "Rechazado"}
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Descripción:</h3>
                {modoEdicion ? (
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    rows={3}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                      }`}
                    placeholder="Descripción del electivo"
                  />
                ) : (
                  <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                    {electroSeleccionado.descripcion}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-1">Créditos:</h3>
                  {modoEdicion ? (
                    <input
                      type="number"
                      value={formData.creditos}
                      onChange={(e) => setFormData({ ...formData, creditos: parseInt(e.target.value) || "" })}
                      className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                        }`}
                      min="1"
                      max="10"
                    />
                  ) : (
                    <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                      {electroSeleccionado.creditos}
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Cupos totales:</h3>
                  {modoEdicion ? (
                    <input
                      type="number"
                      value={formData.cupos}
                      onChange={(e) => setFormData({ ...formData, cupos: parseInt(e.target.value) || "" })}
                      className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-gray-50 border-gray-300 text-gray-900"
                        }`}
                      min="1"
                    />
                  ) : (
                    <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                      {electroSeleccionado.cupos}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Distribución de cupos por carrera:</h3>

                {modoEdicion ? (
                  <div className="space-y-3">
                    {formData.distribucion_cupos?.map((cupo, index) => (
                      <div
                        key={index}
                        className={`flex gap-2 items-center p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"
                          }`}
                      >
                        <select
                          value={cupo.carrera_id}
                          onChange={(e) => cambiarCarrera(index, e.target.value)}
                          className={`flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode
                            ? "bg-gray-600 border-gray-500 text-gray-100"
                            : "bg-white border-gray-300 text-gray-900"
                            }`}
                        >
                          {carreras.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nombre}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          value={cupo.cantidad}
                          onChange={(e) => actualizarCantidadCarrera(index, e.target.value)}
                          className={`w-32 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode
                            ? "bg-gray-600 border-gray-500 text-gray-100"
                            : "bg-white border-gray-300 text-gray-900"
                            }`}
                          min="0"
                          placeholder="Cupos"
                        />
                      </div>
                    ))}
                    {formData.distribucion_cupos && formData.distribucion_cupos.length > 0 && (
                      <div className={`p-3 rounded-lg font-semibold ${darkMode ? "bg-purple-900 text-purple-200" : "bg-purple-100 text-purple-800"
                        }`}>
                        Suma total: {formData.distribucion_cupos.reduce((sum, c) => sum + parseInt(c.cantidad || 0), 0)} cupos
                        {formData.distribucion_cupos.reduce((sum, c) => sum + parseInt(c.cantidad || 0), 0) !== parseInt(formData.cupos) && (
                          <span className="ml-2 text-red-500">No coincide con cupos totales</span>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  electroSeleccionado.distribucion_cupos && electroSeleccionado.distribucion_cupos.length > 0 ? (
                    <div className="space-y-2">
                      {electroSeleccionado.distribucion_cupos.map((cupo, index) => (
                        <div
                          key={index}
                          className={`flex justify-between items-center p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"
                            }`}
                        >
                          <span className={darkMode ? "text-gray-300" : "text-gray-700"}>
                            {cupo.carrera_nombre}
                          </span>
                          <span className="font-semibold text-purple-500">
                            {cupo.cantidad} cupos
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      No hay distribución configurada
                    </p>
                  )
                )}
              </div>
            </div>

            <div className="flex gap-3">
              {modoEdicion ? (
                <>
                  <button
                    onClick={guardarCambios}
                    disabled={guardando}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {guardando ? "Guardando..." : "Guardar cambios"}
                  </button>
                  <button
                    onClick={cancelarEdicion}
                    disabled={guardando}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-medium transition disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  {electroSeleccionado.estado?.toUpperCase() === "PENDIENTE" && (
                    <>
                      <button
                        onClick={() => aprobar(electroSeleccionado.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={20} />
                        Aprobar
                      </button>
                      <button
                        onClick={() => rechazar(electroSeleccionado.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
                      >
                        <XCircle size={20} />
                        Rechazar
                      </button>
                    </>
                  )}
                  <button
                    onClick={activarEdicion}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => {
                      setElectroSeleccionado(null);
                      setModoEdicion(false);
                      setFormData(null);
                    }}
                    className={`flex-1 py-3 rounded-xl font-medium transition ${darkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-300 hover:bg-gray-400 text-black"
                      }`}
                  >
                    Cerrar
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}

      <ModoOscuro />
    </div>
  );
}

