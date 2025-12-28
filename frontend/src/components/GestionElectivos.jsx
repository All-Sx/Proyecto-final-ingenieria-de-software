// === IMPORTACIONES ===
import React, { useState } from "react"; 
import { useNavigate } from "react-router-dom"; // para navegación entre rutas
import { motion } from "framer-motion"; // Librería para animaciones suaves
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
} from "lucide-react"; // Iconos modernos 
import { useTheme } from "../context/ThemeContext"; // Context para el modo oscuro
import ModoOscuro from "./ModoOscuro"; // Componente del botón flotante de modo oscuro


// Este componente es el PANEL DE GESTIÓN para el JEFE DE CARRERA
// Permite revisar, aprobar y rechazar electivos propuestos por profesores
export default function GestionElectivos() {
  // Hook para navegación programática
  const navigate = useNavigate();
  
  // Obtenemos el estado del tema (modo oscuro/claro) desde el contexto
  const { darkMode } = useTheme();

  
  // Estos estados controlan los filtros de búsqueda y filtrado de electivos
  const [filtroCarrera, setFiltroCarrera] = useState("todas"); // Filtro por carrera
  const [filtroEstado, setFiltroEstado] = useState("todos"); // Filtro por estado (pendiente/aprobado/rechazado)
  const [filtroSemestre, setFiltroSemestre] = useState("todos"); // Filtro por semestre
  const [busqueda, setBusqueda] = useState(""); // Búsqueda por texto (nombre o profesor)
  const [electroSeleccionado, setElectroSeleccionado] = useState(null); // Electivo seleccionado para ver detalles

 
  // son datos estáticos
  // Cuando conectemos con el backend, esto vendrá de una llamada API
  const [electivos, setElectivos] = useState([
    // Cada objeto representa un electivo propuesto por un profesor desde el formulario
    {
      id: 1, 
      nombre: "Inteligencia Artificial Aplicada", 
      profesor: "Dr. Carlos Mendoza",
      carrera: "Ingeniería Civil Informática", 
      semestre: "2025-1", 
      creditos: 3, 
      cuposDisponibles: 30, 
      estado: "pendiente", 
      descripcion: "Curso enfocado en técnicas modernas de IA, incluyendo machine learning y redes neuronales.",
      requisitos: "Inteligencia Artificial, Análisis y Diseño de Algoritmos", 
    },
    {
      id: 2,
      nombre: "Desarrollo de Videojuegos",
      profesor: "Mg. Ana Torres",
      carrera: "Ingeniería Civil Informática",
      semestre: "2025-1",
      creditos: 2,
      cuposDisponibles: 25,
      estado: "pendiente",
      descripcion: "Diseño y desarrollo de videojuegos usando Unity y C#.",
      requisitos: "Programación orientada a objetos, Estructuras de datos, Modelamiento de Procesos e Información",
    },
    {
      id: 3,
      nombre: "Blockchain y Criptomonedas",
      profesor: "Dr. Roberto Silva",
      carrera: "Ingeniería Civil Informática",
      semestre: "2025-2",
      creditos: 3,
      cuposDisponibles: 20,
      estado: "aprobado",
      descripcion: "Fundamentos de blockchain, contratos inteligentes y aplicaciones descentralizadas.",
      requisitos: "Estructuras de datos",
    },
    {
      id: 4,
      nombre: "Computación Cuántica",
      profesor: "Dra. Patricia López",
      carrera: "Ingeniería Civil Informática",
      semestre: "2025-1",
      creditos: 3,
      cuposDisponibles: 15,
      estado: "rechazado",
      descripcion: "Introducción a los principios de la computación cuántica.",
      requisitos: "Ninguno",
    },
  ]);


  // Se usa para el filtro desplegable de carreras
  const carreras = [
    "Ingeniería Civil Informática",
    "Ingeniería de Ejecución en Computación e Informática",
  ];


  // Estas funciones cambian el estado de un electivo específico
  const aprobarElectivo = (id) => {
    // Busca el electivo por ID y cambia su estado a "aprobado"
    setElectivos(electivos.map((e) => (e.id === id ? { ...e, estado: "aprobado" } : e)));
    setElectroSeleccionado(null); // Cierra el modal de detalles
  };

  const rechazarElectivo = (id) => {
    // Busca el electivo por ID y cambia su estado a "rechazado"
    setElectivos(electivos.map((e) => (e.id === id ? { ...e, estado: "rechazado" } : e)));
    setElectroSeleccionado(null); // Cierra el modal de detalles
  };

 
  // Filtra los electivos según los criterios seleccionados por el jefe de carrera
  const electivosFiltrados = electivos.filter((e) => {
    const matchCarrera = filtroCarrera === "todas" || e.carrera === filtroCarrera;
    const matchEstado = filtroEstado === "todos" || e.estado === filtroEstado;
    const matchSemestre = filtroSemestre === "todos" || e.semestre === filtroSemestre;
    const matchBusqueda =
      e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.profesor.toLowerCase().includes(busqueda.toLowerCase());
    return matchCarrera && matchEstado && matchSemestre && matchBusqueda;
  });


  // Calcula contadores para mostrar en las tarjetas superiores
  const stats = {
    total: electivos.length, // Total de electivos
    pendientes: electivos.filter((e) => e.estado === "pendiente").length, // Electivos pendientes de revisar
    aprobados: electivos.filter((e) => e.estado === "aprobado").length, // Electivos ya aprobados
    rechazados: electivos.filter((e) => e.estado === "rechazado").length, // Electivos rechazados
  };

  // === RENDERIZADO DEL COMPONENTE ===
  return (
    <div
      // Contenedor principal - cambia colores según el modo oscuro
      className={`min-h-screen p-8 transition-colors ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
  
      <div className="mb-6">
        {/* Botón para volver al dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          className={`flex items-center gap-2 mb-4 transition ${
            darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <ArrowLeft size={20} />
          Volver al Dashboard
        </button>
        <div>
          <h1 className="text-3xl font-bold">Gestión de Electivos</h1>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} mt-2`}>
            Revisa, valida y aprueba las propuestas de electivos
          </p>
        </div>
      </div>

      {/* === TARJETAS DE ESTADÍSTICAS === */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Mapeamos un array de objetos con la info de cada estadística */}
        {[
          { icon: BookOpen, color: "text-blue-600", label: "Total Electivos", value: stats.total },
          { icon: Clock, color: "text-yellow-500", label: "Pendientes", value: stats.pendientes },
          { icon: CheckCircle, color: "text-green-600", label: "Aprobados", value: stats.aprobados },
          { icon: XCircle, color: "text-red-600", label: "Rechazados", value: stats.rechazados },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            // Animación de entrada con delay escalonado
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-2xl shadow-md ${
              darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
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

      {/* Panel con filtros múltiples para refinar la búsqueda de electivos */}
      <div
        className={`p-6 rounded-2xl shadow-md mb-6 ${
          darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className={darkMode ? "text-gray-300" : "text-gray-600"} />
          <h2 className="text-lg font-semibold">Filtros</h2>
        </div>

        {/* Grid de 4 columnas para los filtros */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 1. BARRA DE BÚSQUEDA POR TEXTO */}
          <div className="relative">
            <Search
              className={`absolute left-3 top-3 ${
                darkMode ? "text-gray-400" : "text-gray-400"
              }`}
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar por nombre o profesor..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)} // Actualiza el estado en cada tecla
              className={`w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          {/* 2, 3, 4. SELECTORES DESPLEGABLES (Carrera, Estado, Semestre) */}
          {/* Usamos un array y map para evitar repetir código */}
          {[filtroCarrera, filtroEstado, filtroSemestre].map((filtro, i) => (
            <select
              key={i}
              value={
                i === 0 ? filtroCarrera : i === 1 ? filtroEstado : filtroSemestre
              }
              onChange={(e) =>
                i === 0
                  ? setFiltroCarrera(e.target.value) // Actualiza filtro de carrera
                  : i === 1
                  ? setFiltroEstado(e.target.value) // Actualiza filtro de estado
                  : setFiltroSemestre(e.target.value) // Actualiza filtro de semestre
              }
              className={`border rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              {/* Opciones del primer select (Carreras) */}
              {i === 0 && (
                <>
                  <option value="todas">Todas las carreras</option>
                  {carreras.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </>
              )}
              {/* Opciones del segundo select (Estados) */}
              {i === 1 && (
                <>
                  <option value="todos">Todos los estados</option>
                  <option value="pendiente">Pendientes</option>
                  <option value="aprobado">Aprobados</option>
                  <option value="rechazado">Rechazados</option>
                </>
              )}
              {/* Opciones del tercer select (Semestres) */}
              {i === 2 && (
                <>
                  <option value="todos">Todos los semestres</option>
                  <option value="2025-1">2025-1</option>
                  <option value="2025-2">2025-2</option>
                </>
              )}
            </select>
          ))}
        </div>
      </div>

      {/* === LISTA DE ELECTIVOS (TARJETAS) === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Iteramos sobre los electivos FILTRADOS (no todos) */}
        {electivosFiltrados.map((e) => (
          <motion.div
            key={e.id}
            // Animación de fade-in
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`rounded-2xl shadow-md p-6 hover:shadow-lg transition ${
              darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
            }`}
          >
            {/* ENCABEZADO DE LA TARJETA */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-purple-500 mb-1">
                  {e.nombre}
                </h3>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  {e.profesor}
                </p>
              </div>
              {/* Badge de estado (pendiente/aprobado/rechazado) */}
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  e.estado === "pendiente"
                    ? "bg-yellow-200 text-yellow-900"
                    : e.estado === "aprobado"
                    ? "bg-green-200 text-green-900"
                    : "bg-red-200 text-red-900"
                }`}
              >
                {e.estado === "pendiente"
                  ? "⏳ Pendiente"
                  : e.estado === "aprobado"
                  ? "✓ Aprobado"
                  : "✗ Rechazado"}
              </span>
            </div>

            {/* INFORMACIÓN DEL ELECTIVO */}
            <div className={`space-y-2 mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              <p><GraduationCap size={16} className="inline mr-2" />{e.carrera}</p>
              <p><Calendar size={16} className="inline mr-2" />Semestre {e.semestre}</p>
              <p><BookOpen size={16} className="inline mr-2" />{e.creditos} créditos</p>
              <p><Users size={16} className="inline mr-2" />{e.cuposDisponibles} cupos</p>
            </div>

            {/* BOTONES DE ACCIÓN */}
            <div className="flex gap-2">
              {/* Botón para ver detalles completos */}
              <button
                onClick={() => setElectroSeleccionado(e)}
                className="flex-1 flex items-center justify-center gap-2 bg-purple-100 text-purple-700 py-2 rounded-xl font-medium hover:bg-purple-200 transition"
              >
                <Eye size={18} /> Ver detalles
              </button>
              {/* Botones de aprobar/rechazar SOLO si está pendiente */}
              {e.estado === "pendiente" && (
                <>
                  <button
                    onClick={() => aprobarElectivo(e.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button
                    onClick={() => rechazarElectivo(e.id)}
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
            className={`max-w-2xl w-full rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto ${
              darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
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
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  electroSeleccionado.estado === "pendiente"
                    ? "bg-yellow-200 text-yellow-900"
                    : electroSeleccionado.estado === "aprobado"
                    ? "bg-green-200 text-green-900"
                    : "bg-red-200 text-red-900"
                }`}
              >
                {electroSeleccionado.estado === "pendiente"
                  ? "Pendiente"
                  : electroSeleccionado.estado === "aprobado"
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
              {electroSeleccionado.estado === "pendiente" && (
                <>
                  <button
                    onClick={() => aprobarElectivo(electroSeleccionado.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={20} />
                    Aprobar
                  </button>
                  <button
                    onClick={() => rechazarElectivo(electroSeleccionado.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
                  >
                    <XCircle size={20} />
                    Rechazar
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

      {/*  BOTÓN FLOTANTE DE MODO OSCURO */}
      <ModoOscuro/>
    </div>
  );
}

