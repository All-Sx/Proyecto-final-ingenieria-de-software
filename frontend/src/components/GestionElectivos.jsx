import React, { useState } from "react";
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
import ModoOscuro from "./ModoOscuro";

export default function GestionElectivos() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [filtroCarrera, setFiltroCarrera] = useState("todas");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroSemestre, setFiltroSemestre] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [electroSeleccionado, setElectroSeleccionado] = useState(null);

  const [electivos, setElectivos] = useState([
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

  const carreras = [
    "Ingeniería Civil Informática",
    "Ingeniería de Ejecución en Computación e Informática",
  ];

  const aprobarElectivo = (id) => {
    setElectivos(electivos.map((e) => (e.id === id ? { ...e, estado: "aprobado" } : e)));
    setElectroSeleccionado(null);
  };

  const rechazarElectivo = (id) => {
    setElectivos(electivos.map((e) => (e.id === id ? { ...e, estado: "rechazado" } : e)));
    setElectroSeleccionado(null);
  };

  const electivosFiltrados = electivos.filter((e) => {
    const matchCarrera = filtroCarrera === "todas" || e.carrera === filtroCarrera;
    const matchEstado = filtroEstado === "todos" || e.estado === filtroEstado;
    const matchSemestre = filtroSemestre === "todos" || e.semestre === filtroSemestre;
    const matchBusqueda =
      e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      e.profesor.toLowerCase().includes(busqueda.toLowerCase());
    return matchCarrera && matchEstado && matchSemestre && matchBusqueda;
  });

  const stats = {
    total: electivos.length,
    pendientes: electivos.filter((e) => e.estado === "pendiente").length,
    aprobados: electivos.filter((e) => e.estado === "aprobado").length,
    rechazados: electivos.filter((e) => e.estado === "rechazado").length,
  };

  return (
    <div
      className={`min-h-screen p-8 transition-colors ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Encabezado */}
      <div className="mb-6">
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

      {/* Estadísticas */}
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

      {/* Filtros */}
      <div
        className={`p-6 rounded-2xl shadow-md mb-6 ${
          darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className={darkMode ? "text-gray-300" : "text-gray-600"} />
          <h2 className="text-lg font-semibold">Filtros</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              onChange={(e) => setBusqueda(e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          {[filtroCarrera, filtroEstado, filtroSemestre].map((filtro, i) => (
            <select
              key={i}
              value={
                i === 0 ? filtroCarrera : i === 1 ? filtroEstado : filtroSemestre
              }
              onChange={(e) =>
                i === 0
                  ? setFiltroCarrera(e.target.value)
                  : i === 1
                  ? setFiltroEstado(e.target.value)
                  : setFiltroSemestre(e.target.value)
              }
              className={`border rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
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
              {i === 1 && (
                <>
                  <option value="todos">Todos los estados</option>
                  <option value="pendiente">Pendientes</option>
                  <option value="aprobado">Aprobados</option>
                  <option value="rechazado">Rechazados</option>
                </>
              )}
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

      {/* Lista de electivos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {electivosFiltrados.map((e) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`rounded-2xl shadow-md p-6 hover:shadow-lg transition ${
              darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-purple-500 mb-1">
                  {e.nombre}
                </h3>
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                  👨‍🏫 {e.profesor}
                </p>
              </div>
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

            <div className={`space-y-2 mb-4 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              <p><GraduationCap size={16} className="inline mr-2" />{e.carrera}</p>
              <p><Calendar size={16} className="inline mr-2" />Semestre {e.semestre}</p>
              <p><BookOpen size={16} className="inline mr-2" />{e.creditos} créditos</p>
              <p><Users size={16} className="inline mr-2" />{e.cuposDisponibles} cupos</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setElectroSeleccionado(e)}
                className="flex-1 flex items-center justify-center gap-2 bg-purple-100 text-purple-700 py-2 rounded-xl font-medium hover:bg-purple-200 transition"
              >
                <Eye size={18} /> Ver detalles
              </button>
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

      {/* Botón flotante modo oscuro */}
      <ModoOscuro/>
    </div>
  );
}

