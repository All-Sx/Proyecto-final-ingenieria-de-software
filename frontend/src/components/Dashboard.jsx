import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  LogOut,
  User,
  FileText,
  Settings,
  GraduationCap,
  Bookmark,
} from "lucide-react";
import ModoOscuro from "./ModoOscuro";
import { useTheme } from "../context/ThemeContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { darkMode } = useTheme();

  // Recuperar usuario de localStorage o del state
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const user =
    storedUser ||
    state?.user || {
      nombre: "Estudiante Demo",
      correo: "estudiante@universidad.cl",
      tipo: "Estudiante",
      rol: "estudiante",
      foto: "https://i.pravatar.cc/150?img=5",
    };

  const handleOpenElectivo = () => {
    navigate("/profesor/electivos", { state: { user } });
  };

  const handleGestionElectivos = () => {
    navigate("/jefe/gestion-electivos", { state: { user } });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // --- Estado que controla la vista actual ---
  const [vistaActual, setVistaActual] = useState(
    user.rol === "estudiante" ? "electivos" : "inicio"
  );

  // --- Electivos simulados ---
  let electivos = [
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
  ];

  if (user.rol === "jefe") {
    electivos = [
      {
        id: "admin-001",
        nombre: "Gestión de Electivos",
        descripcion:
          "Panel administrativo para revisar y aprobar electivos propuestos.",
        progreso: 0.8,
        estado: "Revisar",
        pendiente: false,
      },
      {
        id: "admin-002",
        nombre: "Estadísticas y Reportes",
        descripcion: "Análisis de inscripciones y rendimiento de electivos.",
        progreso: 1.0,
        estado: "Completado",
        pendiente: false,
      },
      {
        id: "admin-003",
        nombre: "Planificación Académica",
        descripcion: "Planificación de electivos para próximos semestres.",
        progreso: 0.3,
        estado: "En progreso",
        pendiente: true,
      },
    ];
  }

  return (
    <div
      className={`${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
        } min-h-screen flex`}
    >
      {/* === SIDEBAR === */}
      <motion.aside
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`w-64 p-6 flex flex-col justify-between shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"
          }`}
      >
        <div>
          <div className="flex flex-col items-center mb-8">
            {user.foto ? (
              <img
                src={user.foto}
                alt="Foto de perfil"
                className="w-20 h-20 rounded-full border-4 border-blue-500 mb-3 object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-semibold text-blue-700 border-4 border-blue-500 mb-3">
                {user.nombre
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
            )}

            <h2 className="text-lg font-semibold">{user.nombre}</h2>
            <p className="text-sm text-gray-500">{user.correo}</p>
            <span
              className={`mt-2 text-xs font-semibold px-3 py-1 rounded-full ${user.rol === "jefe"
                  ? "bg-purple-100 text-purple-700"
                  : user.tipo === "Profesor" || user.rol === "profesor"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
            >
              {user.rol === "jefe" ? "Jefe de Carrera" : user.tipo}
            </span>
          </div>

          {/* === NAV === */}
          <nav className="space-y-2">
            <button
              onClick={() => setVistaActual("perfil")}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-100 transition"
            >
              <User size={18} />
              <span>Perfil</span>
            </button>

            {user.rol === "jefe" ? (
              <button
                onClick={() => setVistaActual("inicio")}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-100 transition"
              >
                <GraduationCap size={18} />
                <span>Gestión</span>
              </button>
            ) : user.tipo === "Profesor" ? (
              <>
                <button
                  onClick={() => setVistaActual("inicio")}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-100 transition"
                >
                  <FileText size={18} />
                  <span>Mis Electivos</span>
                </button>
                <button
                  onClick={handleOpenElectivo}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-100 transition"
                >
                  <BookOpen size={18} />
                  <span>Registrar Electivo</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setVistaActual("electivos")}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-100 transition"
              >
                <Bookmark size={18} />
                <span>Electivos</span>
              </button>
            )}

            <button
              onClick={() => setVistaActual("configuracion")}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-100 transition"
            >
              <Settings size={18} />
              <span>Configuración</span>
            </button>
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </motion.aside>

      {/* === MAIN === */}
      <main className="flex-1 p-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-6"
        >
          Bienvenido, {user?.nombre} 👋
        </motion.h1>

        {/* ======== INICIO ======== */}
        {vistaActual === "inicio" && (
          <>
            {user.rol === "jefe" ? (
              <>
                <h2 className="text-2xl font-bold mb-4">Panel de Administración</h2>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {electivos.map((e) => (
                    <motion.div
                      key={e.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6"
                    >
                      <h3 className="text-lg font-semibold mb-2 text-purple-600">
                        {e.nombre}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {e.descripcion}
                      </p>
                      <p className="text-sm mb-1">
                        Estado:{" "}
                        <span
                          className={`font-semibold ${e.estado === "Completado"
                              ? "text-green-600"
                              : e.estado === "Revisar"
                                ? "text-yellow-600"
                                : "text-blue-600"
                            }`}
                        >
                          {e.estado}
                        </span>
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${e.progreso * 100}%` }}
                        ></div>
                      </div>
                      <button
                        onClick={() => {
                          if (e.id === "admin-001") handleGestionElectivos();
                        }}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl font-medium transition"
                      >
                        {e.id === "admin-001"
                          ? "Abrir panel"
                          : e.pendiente
                            ? "Revisar"
                            : "Ver detalles"}
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              </>
            ) : user.tipo === "Profesor" ? (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
                >
                  <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
                    <div className="flex items-center gap-4">
                      <BookOpen className="text-blue-600" size={26} />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Electivos registrados
                        </p>
                        <h3 className="text-xl font-bold">5</h3>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
                    <div className="flex items-center gap-4">
                      <GraduationCap className="text-green-600" size={26} />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Estudiantes inscritos
                        </p>
                        <h3 className="text-xl font-bold">123</h3>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
                    <div className="flex items-center gap-4">
                      <Settings className="text-purple-600" size={26} />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Periodo actual
                        </p>
                        <h3 className="text-xl font-bold">2025-1</h3>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="text-center"
                >
                  <button
                    onClick={handleOpenElectivo}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 rounded-2xl font-semibold shadow-lg transition"
                  >
                    🚀 Crear nuevo electivo
                  </button>
                </motion.div>
              </>
            ) : (
              <p className="text-gray-600 dark:text-gray-300">
                Selecciona “Electivos” en el menú para ver el catálogo disponible.
              </p>
            )}
          </>
        )}

        {/* ELECTIVOS */}
        {vistaActual === "electivos" && user.rol === "estudiante" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {electivos.map((e) => (
              <motion.div
                key={e.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6"
              >
                <h3 className="text-lg font-semibold mb-2 text-blue-600">
                  {e.nombre}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {e.descripcion}
                </p>

                <div className="text-sm text-gray-500 space-y-1 mb-3">
                  <p>👨‍🏫 <strong>Profesor:</strong> {e.profesor}</p>
                  <p>🏛️ <strong>Carrera:</strong> {e.carrera}</p>
                  <p>📆 <strong>Semestre:</strong> {e.semestre}</p>
                  <p>🎓 <strong>Créditos:</strong> {e.creditos}</p>
                  <p>🪑 <strong>Cupos disponibles:</strong> {e.cuposDisponibles}</p>
                  {e.requisitos && (
                    <div>
                      <p className="font-semibold text-gray-700 dark:text-gray-200 mt-2">📋 Requisitos:</p>
                      <ul className="list-disc list-inside ml-2 text-gray-600 dark:text-gray-300">
                        {e.requisitos.split(",").map((req, idx) => (
                          <li key={idx}>{req.trim()}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition">
                  Inscribirse
                </button>
              </motion.div>
            ))}

          </motion.div>
        )}

        {/* ======== PERFIL ======== */}
        {vistaActual === "perfil" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md"
          >
            <h2 className="text-2xl font-bold mb-4">Perfil del Usuario</h2>
            <p><strong>Nombre:</strong> {user.nombre}</p>
            <p><strong>Correo:</strong> {user.correo}</p>
            <p><strong>Rol:</strong> {user.tipo}</p>
          </motion.div>
        )}

        {/* ======== CONFIGURACIÓN ======== */}
        {vistaActual === "configuracion" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md space-y-4"
          >
            <h2 className="text-2xl font-bold mb-4">Configuración</h2>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-medium transition"
            >
              Cerrar sesión
            </button>
            <button
              onClick={() => alert("Editar perfil próximamente")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition"
            >
              Editar Perfil
            </button>
            <button
              onClick={() => setVistaActual("inicio")}
              className="w-full bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-black dark:text-white py-2 rounded-xl font-medium transition"
            >
              Volver al Inicio
            </button>
          </motion.div>
        )}
      </main>

      {/* Botón flotante de modo oscuro */}
      <ModoOscuro />
    </div>
  );
}
