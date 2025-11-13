import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    BookOpen,
    LogOut,
    Sun,
    Moon,
    User,
    FileText,
    Settings,
    GraduationCap,
    Bookmark,
} from "lucide-react";

export default function Dashboard() {
    const navigate = useNavigate();
    const { state } = useLocation();
    
    /**
     * OBTENER USUARIO DE LOCALSTORAGE O DEL STATE
     * Primero intenta recuperar el usuario de localStorage (persistencia)
     * Si no existe, usa el state de React Router
     * Si ninguno existe, usa valores por defecto
     */
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const user = storedUser || state?.user || {
        nombre: "Estudiante Demo",
        correo: "estudiante@universidad.cl",
        tipo: "Estudiante",
        rol: "estudiante",
        foto: "https://i.pravatar.cc/150?img=5",
    };

    const [darkMode, setDarkMode] = useState(false);

    const handleOpenElectivo = () => {
        navigate("/profesor/electivos", { state: { user } });
    };

    /**
     * NUEVA FUNCIÓN: Navegación a Gestión de Electivos
     * Permite al Jefe de Carrera acceder al panel de gestión
     * donde puede revisar, aprobar o rechazar propuestas de electivos
     */
    const handleGestionElectivos = () => {
        navigate("/jefe/gestion-electivos", { state: { user } });
    };

    const handleLogout = () => {
        // LIMPIAR localStorage al cerrar sesión para eliminar datos del usuario
        localStorage.removeItem("user");
        navigate("/");
    };

    // Ejemplo de electivos (simulados)
    let electivos = [
        {
            id: 1,
            nombre: "Deep Learning",
            descripcion: "Introducción al aprendizaje automático y redes neuronales.",
            profesor: "Dra. Ana Morales",
            creditos: 3,
            cupos: 25,
        },
        {
            id: 2,
            nombre: "Diseño de Interfaces",
            descripcion: "Principios de diseño UX/UI aplicados a software interactivo.",
            profesor: "Mg. Carlos Ruiz",
            creditos: 2,
            cupos: 30,
        },
        {
            id: 3,
            nombre: "Ciberseguridad Avanzada",
            descripcion: "Análisis de vulnerabilidades, criptografía y pentesting.",
            profesor: "Dr. Ricardo Soto",
            creditos: 3,
            cupos: 20,
        },
    ];

    /**
     * CURSOS ESPECÍFICOS PARA EL JEFE DE CARRERA
     * Si el usuario es "jefe", se reemplazan los electivos normales
     * por un conjunto de herramientas administrativas
     */
    if (user.rol === "jefe") {
        electivos = [
            {
                id: "admin-001",
                nombre: "Gestión de Electivos",
                descripcion: "Panel administrativo para revisar y aprobar electivos propuestos.",
                profesor: "Sistema",
                creditos: 0,
                cupos: 0,
                progreso: 0.8,        // Barra de progreso (80%)
                estado: "Revisar",     // Estado actual de la tarea
                pendiente: false,      // Si requiere atención inmediata
            },
            {
                id: "admin-002",
                nombre: "Estadísticas y Reportes",
                descripcion: "Análisis de inscripciones y rendimiento de electivos.",
                profesor: "Sistema",
                creditos: 0,
                cupos: 0,
                progreso: 1.0,         // Completado al 100%
                estado: "Completado",
                pendiente: false,
            },
            {
                id: "admin-003",
                nombre: "Planificación Académica",
                descripcion: "Planificación de electivos para próximos semestres.",
                profesor: "Sistema",
                creditos: 0,
                cupos: 0,
                progreso: 0.3,         // 30% completado
                estado: "En progreso",
                pendiente: true,       // Requiere atención
            },
        ];
    }

    return (
        <div
            className={`${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
                } min-h-screen flex`}
        >
            {/* Sidebar */}
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
                        {/* 
                          BADGE DINÁMICO SEGÚN EL ROL
                          - Jefe: Púrpura
                          - Profesor: Verde
                          - Estudiante: Azul
                        */}
                        <span className={`mt-2 text-xs font-semibold px-3 py-1 rounded-full ${
                            user.rol === "jefe" ? "bg-purple-100 text-purple-700" :
                            user.tipo === "Profesor" || user.rol === "profesor" ? "bg-green-100 text-green-700" :
                            "bg-blue-100 text-blue-700"
                        }`}>
                            {user.rol === "jefe" ? "Jefe de Carrera" : user.tipo}
                        </span>
                    </div>

                    <nav className="space-y-2">
                        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-100 transition">
                            <User size={18} />
                            <span>Perfil</span>
                        </button>
                        {/* MENÚ ESPECÍFICO PARA JEFE DE CARRERA */}
                        {/* Menú simplificado - Las opciones principales están en el panel central */}
                        {user.rol === "jefe" ? (
                            <>
                                {/* Gestión de Profesores */}
                                <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-100 transition">
                                    <GraduationCap size={18} />
                                    <span>Profesores</span>
                                </button>
                            </>
                        ) : user.tipo === "Profesor" ? (
                            <>
                                <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-100 transition">
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
                            <>
                                <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-100 transition">
                                    <Bookmark size={18} />
                                    <span>Electivos</span>
                                </button>
                            </>
                        )}
                        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-100 transition">
                            <Settings size={18} />
                            <span>Configuración</span>
                        </button>
                    </nav>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
                    >
                        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        {darkMode ? "Modo claro" : "Modo oscuro"}
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition"
                    >
                        <LogOut size={18} />
                        Cerrar sesión
                    </button>
                </div>
            </motion.aside>

            {/* Contenido principal */}
            <main className="flex-1 p-8">
                {/* 
                  SALUDO PERSONALIZADO
                  Usa el nombre completo guardado en localStorage 
                  El operador ?. previene errores si user es null/undefined
                */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold mb-6"
                >
                    Bienvenido, {user?.nombre} 👋
                </motion.h1>

                {/* ===== PANEL ESPECÍFICO PARA JEFE DE CARRERA ===== */}
                {user.rol === "jefe" ? (
                    <>
                        {/* Tarjetas de estadísticas administrativas */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
                        >
                            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
                                <div className="flex items-center gap-4">
                                    <BookOpen className="text-purple-600" size={26} />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Electivos pendientes
                                        </p>
                                        <h3 className="text-xl font-bold">8</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
                                <div className="flex items-center gap-4">
                                    <GraduationCap className="text-green-600" size={26} />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Electivos aprobados
                                        </p>
                                        <h3 className="text-xl font-bold">42</h3>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
                                <div className="flex items-center gap-4">
                                    <Settings className="text-blue-600" size={26} />
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Total de profesores
                                        </p>
                                        <h3 className="text-xl font-bold">15</h3>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <h2 className="text-2xl font-bold mb-4">Panel de Administración</h2>
                        {/* 
                          TARJETAS ADMINISTRATIVAS CON PROGRESO
                          Cada tarjeta muestra el estado y progreso de tareas administrativas
                        */}
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
                                    <div className="mb-3">
                                        {/* Estado con color dinámico según el estado */}
                                        <p className="text-sm text-gray-500 mb-1">
                                            Estado: <span className={`font-semibold ${
                                                e.estado === "Completado" ? "text-green-600" :
                                                e.estado === "Revisar" ? "text-yellow-600" :
                                                "text-blue-600"
                                            }`}>{e.estado}</span>
                                        </p>
                                        {/* Barra de progreso visual */}
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-purple-600 h-2 rounded-full"
                                                style={{ width: `${e.progreso * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    {/* 
                                      BOTÓN DINÁMICO CON NAVEGACIÓN
                                      - Si es la tarjeta "Gestión de Electivos" (id: admin-001),
                                        redirige a la página específica de gestión
                                      - Para otras tarjetas, muestra texto según si está pendiente o no
                                    */}
                                    <button 
                                        onClick={() => {
                                            if (e.id === "admin-001") {
                                                handleGestionElectivos();
                                            }
                                        }}
                                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl font-medium transition"
                                    >
                                        {e.id === "admin-001" ? "Abrir panel" : e.pendiente ? "Revisar" : "Ver detalles"}
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
                    /* ESTUDIANTE */
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
                                <p className="text-sm text-gray-500">
                                    👨‍🏫 {e.profesor}
                                </p>
                                <p className="text-sm text-gray-500">
                                    🎓 Créditos: {e.creditos}
                                </p>
                                <p className="text-sm text-gray-500 mb-3">
                                    🪑 Cupos: {e.cupos}
                                </p>
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition">
                                    Inscribirse
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </main>
        </div>
    );
}
