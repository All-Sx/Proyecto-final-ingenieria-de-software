import React, { useState } from "react"; // Hook de estado
import { useLocation, useNavigate } from "react-router-dom"; // Hooks de React Router
import { motion } from "framer-motion"; // Animaciones
import {
  BookOpen,
  LogOut,
  User,
  FileText,
  Settings,
  GraduationCap,
  Bookmark,
} from "lucide-react"; // Iconos
import ModoOscuro from "./ModoOscuro"; // Componente de modo oscuro
import { useTheme } from "../context/ThemeContext"; // Context API para tema


// Este es el PANEL PRINCIPAL después del login
// Se adapta según el ROL del usuario: estudiante, profesor o jefe de carrera
export default function Dashboard() {
  const navigate = useNavigate(); // Para navegar programáticamente
  const { state } = useLocation(); // Recibe datos del login (usuario)
  const { darkMode } = useTheme(); // Estado global del tema


  // Prioridad: localStorage > state de navegación > usuario demo
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
    // Lleva al formulario de creación de electivos (solo profesores)
    navigate("/profesor/electivos", { state: { user } });
  };

  const handleGestionElectivos = () => {
    // Lleva al panel de gestión (solo jefe de carrera)
    navigate("/jefe/gestion-electivos", { state: { user } });
  };

  const handleLogout = () => {
    // Cierra sesión y limpia localStorage
    localStorage.removeItem("user");
    navigate("/");
  };


  // Controla qué contenido mostrar en el área principal
  // Opciones: "inicio", "electivos", "perfil", "configuracion", "editarPerfil"
  const [vistaActual, setVistaActual] = useState(
    user.rol === "estudiante" ? "electivos" : "inicio"
  );

  // === ESTADO PARA EDITAR PERFIL ===
  const [datosEdicion, setDatosEdicion] = useState({
    nombre: user.nombre || "",
    correo: user.correo || "",
    telefonoPersonal: user.telefonoPersonal || "",
    correoPersonal: user.correoPersonal || "",
    passwordActual: "",
    passwordNueva: "",
    passwordConfirmar: "",
  });

  const [mensajeEdicion, setMensajeEdicion] = useState({ tipo: "", texto: "" });

  // === FUNCIÓN PARA MANEJAR CAMBIOS EN EL FORMULARIO ===
  const handleChangeEdicion = (e) => {
    setDatosEdicion({
      ...datosEdicion,
      [e.target.name]: e.target.value,
    });
  };

  // === FUNCIÓN PARA GUARDAR CAMBIOS DEL PERFIL ===
  const handleGuardarPerfil = (e) => {
    e.preventDefault();

    // Validaciones
    if (datosEdicion.passwordNueva && datosEdicion.passwordNueva !== datosEdicion.passwordConfirmar) {
      setMensajeEdicion({ tipo: "error", texto: "Las contraseñas no coinciden" });
      return;
    }

    if (datosEdicion.passwordNueva && datosEdicion.passwordNueva.length < 6) {
      setMensajeEdicion({ tipo: "error", texto: "La contraseña debe tener al menos 6 caracteres" });
      return;
    }

    // AQUÍ IRÁ LA LLAMADA AL BACKEND
    // Por ahora, simulamos el guardado exitoso
    const usuarioActualizado = {
      ...user,
      nombre: datosEdicion.nombre,
      correo: datosEdicion.correo,
      telefonoPersonal: datosEdicion.telefonoPersonal,
      correoPersonal: datosEdicion.correoPersonal,
    };

    localStorage.setItem("user", JSON.stringify(usuarioActualizado));
    setMensajeEdicion({ tipo: "success", texto: "Perfil actualizado correctamente" });

    // Limpiar campos de contraseña
    setDatosEdicion({
      ...datosEdicion,
      passwordActual: "",
      passwordNueva: "",
      passwordConfirmar: "",
    });

    // Volver a configuración después de 2 segundos
    setTimeout(() => {
      setVistaActual("configuracion");
      setMensajeEdicion({ tipo: "", texto: "" });
    }, 2000);
  };

  //DATOS DE ELECTIVOS
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


  // Si el usuario es jefe, reemplazamos los electivos con tareas administrativas
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
      <motion.aside
        // Animación de entrada desde la izquierda
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`w-64 p-6 flex flex-col justify-between shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"
          }`}
      >
        <div>
          {/* === PERFIL DEL USUARIO === */}
          <div className="flex flex-col items-center mb-8">
            {/* Foto de perfil o iniciales */}
            {user.foto ? (
              <img
                src={user.foto}
                alt="Foto de perfil"
                className="w-20 h-20 rounded-full border-4 border-blue-500 mb-3 object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-semibold text-blue-700 border-4 border-blue-500 mb-3">
                {/* Genera iniciales a partir del nombre */}
                {user.nombre
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
            )}

            <h2 className="text-lg font-semibold">{user.nombre}</h2>
            <p className="text-sm text-gray-500">{user.correo}</p>
            {/* Badge del rol con color dinámico */}
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

          {/* === NAVEGACIÓN PRINCIPAL === */}
          {/* Los botones cambian según el ROL del usuario */}
          <nav className="space-y-2">
            {/* Botón de Perfil (común para todos) */}
            <button
              onClick={() => setVistaActual("perfil")}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-100 transition"
            >
              <User size={18} />
              <span>Perfil</span>
            </button>

            {/* === MENÚ ESPECÍFICO PARA JEFE DE CARRERA === */}
            {user.rol === "jefe" ? (
              <button
                onClick={() => setVistaActual("inicio")}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-100 transition"
              >
                <GraduationCap size={18} />
                <span>Gestión</span>
              </button>
            ) : user.tipo === "Profesor" ? (
              /* === MENÚ ESPECÍFICO PARA PROFESOR === */
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
              /* === MENÚ ESPECÍFICO PARA ESTUDIANTE === */
              <button
                onClick={() => setVistaActual("electivos")}
                className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-100 transition"
              >
                <Bookmark size={18} />
                <span>Electivos</span>
              </button>
            )}

            {/* Botón de Configuración (común para todos) */}
            <button
              onClick={() => setVistaActual("configuracion")}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-100 transition"
            >
              <Settings size={18} />
              <span>Configuración</span>
            </button>
          </nav>
        </div>

        {/* === BOTÓN DE CERRAR SESIÓN === */}
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
          className={`text-3xl font-bold mb-6 ${darkMode ? "text-gray-100" : "text-gray-800"
            }`}
        >
          Bienvenido, {user?.nombre} 👋
        </motion.h1>

        {/* ======== INICIO ======== */}
        {vistaActual === "inicio" && (
          <>
            {user.rol === "jefe" ? (
              <>
                <h2
                  className={`text-2xl font-bold mb-4 ${darkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                >
                  Panel de Administración
                </h2>
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
                      className={`rounded-2xl shadow-md p-6 transition-colors ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
                        }`}
                    >
                      <h3
                        className={`text-lg font-semibold mb-2 ${darkMode ? "text-purple-400" : "text-purple-600"
                          }`}
                      >
                        {e.nombre}
                      </h3>

                      <p
                        className={`text-sm mb-3 ${darkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                      >
                        {e.descripcion}
                      </p>

                      <p className="text-sm mb-1">
                        Estado:{" "}
                        <span
                          className={`font-semibold ${e.estado === "Completado"
                            ? "text-green-500"
                            : e.estado === "Revisar"
                              ? "text-yellow-500"
                              : "text-blue-500"
                            }`}
                        >
                          {e.estado}
                        </span>
                      </p>

                      {/* Barra de progreso */}
                      <div
                        className={`w-full rounded-full h-2 mb-3 ${darkMode ? "bg-gray-700" : "bg-gray-200"
                          }`}
                      >
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${e.progreso * 100}%` }}
                        />
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
                  <div
                    className={`p-6 rounded-2xl shadow-md transition-colors ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <BookOpen className="text-blue-600" size={26} />
                      <div>
                        <p
                          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                        >
                          Electivos registrados
                        </p>
                        <h3 className="text-xl font-bold">5</h3>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-6 rounded-2xl shadow-md transition-colors ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <GraduationCap className="text-green-600" size={26} />
                      <div>
                        <p
                          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                        >
                          Estudiantes inscritos
                        </p>
                        <h3 className="text-xl font-bold">123</h3>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-6 rounded-2xl shadow-md transition-colors ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <Settings className="text-purple-600" size={26} />
                      <div>
                        <p
                          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                        >
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
              <p
                className={`${darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
              >
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
                className={`rounded-2xl shadow-md p-6 transition-colors ${darkMode
                  ? "bg-gray-800 text-gray-100"
                  : "bg-white text-gray-900"
                  }`}
              >
                <h3
                  className={`text-lg font-semibold mb-2 ${darkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                >
                  {e.nombre}
                </h3>

                <p
                  className={`text-sm mb-3 ${darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                >
                  {e.descripcion}
                </p>

                <div
                  className={`text-sm space-y-1 mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                >
                  <p>👨‍🏫 <strong>Profesor:</strong> {e.profesor}</p>
                  <p>🏛️ <strong>Carrera:</strong> {e.carrera}</p>
                  <p>📆 <strong>Semestre:</strong> {e.semestre}</p>
                  <p>🎓 <strong>Créditos:</strong> {e.creditos}</p>
                  <p>🪑 <strong>Cupos disponibles:</strong> {e.cuposDisponibles}</p>

                  {e.requisitos && (
                    <div className="mt-2">
                      <p
                        className={`font-semibold ${darkMode ? "text-gray-200" : "text-gray-700"
                          }`}
                      >
                        📋 Requisitos:
                      </p>
                      <ul
                        className={`list-disc list-inside ml-2 ${darkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                      >
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
            className={`p-6 rounded-2xl shadow-md transition-colors ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
              }`}
          >
            <h2
              className={`text-2xl font-bold mb-4 ${darkMode ? "text-gray-100" : "text-gray-800"
                }`}
            >
              Perfil del Usuario
            </h2>

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
            className={`p-6 rounded-2xl shadow-md space-y-4 transition-colors ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
              }`}
          >
            <h2 className="text-2xl font-bold mb-4">Configuración</h2>

            <button
              onClick={() => setVistaActual("editarPerfil")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition-colors"
            >
              Editar Perfil y Seguridad
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-medium transition-colors"
            >
              Cerrar sesión
            </button>

            <button
              onClick={() => setVistaActual("inicio")}
              className={`w-full py-2 rounded-xl font-medium transition-colors ${darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-300 hover:bg-gray-400 text-black"
                }`}
            >
              Volver al Inicio
            </button>
          </motion.div>
        )}

        {/* = EDITAR PERFIL = */}
        {vistaActual === "editarPerfil" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-8 rounded-2xl shadow-md max-w-2xl transition-colors ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
              }`}
          >
            <h2 className="text-2xl font-bold mb-6">
              Editar Perfil y Seguridad
            </h2>

            <form onSubmit={handleGuardarPerfil} className="space-y-6">
              {/* INFORMACIÓN PERSONAL */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h3 className="text-lg font-semibold mb-4 text-purple-600">Información Personal</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre Completo</label>
                    <input
                      type="text"
                      name="nombre"
                      value={datosEdicion.nombre}
                      onChange={handleChangeEdicion}
                      className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-white border-gray-300 text-gray-900"
                        }`}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Correo Institucional</label>
                    <input
                      type="email"
                      name="correo"
                      value={datosEdicion.correo}
                      onChange={handleChangeEdicion}
                      className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-white border-gray-300 text-gray-900"
                        }`}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* INFORMACIÓN DE CONTACTO */}
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h3 className="text-lg font-semibold mb-4 text-purple-600">Información de Contacto</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Teléfono Personal</label>
                    <input
                      type="tel"
                      name="telefonoPersonal"
                      value={datosEdicion.telefonoPersonal}
                      onChange={handleChangeEdicion}
                      placeholder="+56 9 1234 5678"
                      className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-white border-gray-300 text-gray-900"
                        }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Correo Electrónico Personal</label>
                    <input
                      type="email"
                      name="correoPersonal"
                      value={datosEdicion.correoPersonal}
                      onChange={handleChangeEdicion}
                      placeholder="ejemplo@gmail.com"
                      className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-white border-gray-300 text-gray-900"
                        }`}
                    />
                  </div>
                </div>
              </div>

              {/* CAMBIO DE CONTRASEÑA */}
              <div className="pb-4">
                <h3 className="text-lg font-semibold mb-4 text-purple-600">Cambiar Contraseña</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Deja estos campos vacíos si no deseas cambiar tu contraseña
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Contraseña Actual</label>
                    <input
                      type="password"
                      name="passwordActual"
                      value={datosEdicion.passwordActual}
                      onChange={handleChangeEdicion}
                      className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-white border-gray-300 text-gray-900"
                        }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Nueva Contraseña</label>
                    <input
                      type="password"
                      name="passwordNueva"
                      value={datosEdicion.passwordNueva}
                      onChange={handleChangeEdicion}
                      placeholder="Mínimo 6 caracteres"
                      className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-white border-gray-300 text-gray-900"
                        }`}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Confirmar Nueva Contraseña</label>
                    <input
                      type="password"
                      name="passwordConfirmar"
                      value={datosEdicion.passwordConfirmar}
                      onChange={handleChangeEdicion}
                      placeholder="Repite la nueva contraseña"
                      className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100"
                        : "bg-white border-gray-300 text-gray-900"
                        }`}
                    />
                  </div>
                </div>
              </div>

              {/* MENSAJES DE ÉXITO/ERROR */}
              {mensajeEdicion.texto && (
                <div
                  className={`p-4 rounded-xl ${mensajeEdicion.tipo === "success"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    }`}
                >
                  {mensajeEdicion.texto}
                </div>
              )}

              {/* BOTONES */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium transition"
                >
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVistaActual("configuracion");
                    setMensajeEdicion({ tipo: "", texto: "" });
                  }}
                  className="flex-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-black dark:text-white py-3 rounded-xl font-medium transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </main>

      {/* Botón flotante de modo oscuro */}
      <ModoOscuro />
    </div >
  );
}
