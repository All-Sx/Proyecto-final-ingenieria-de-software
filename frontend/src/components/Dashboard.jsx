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
    const user = state?.user || {
        nombre: "Estudiante Demo",
        correo: "estudiante@universidad.cl",
        tipo: "Estudiante",
        foto: "https://i.pravatar.cc/150?img=5",
    };

    const [darkMode, setDarkMode] = useState(false);

    const handleOpenElectivo = () => {
        navigate("/profesor/electivos", { state: { user } });
    };

    const handleLogout = () => {
        navigate("/");
    };

    // Ejemplo de electivos (simulados)
    const electivos = [
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
                        <span className="mt-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                            {user.tipo}
                        </span>
                    </div>

                    <nav className="space-y-2">
                        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-100 transition">
                            <User size={18} />
                            Perfil
                        </button>
                        {user.tipo === "Profesor" ? (
                            <>
                                <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-100 transition">
                                    <FileText size={18} />
                                    Mis Electivos
                                </button>
                                <button
                                    onClick={handleOpenElectivo}
                                    className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-100 transition"
                                >
                                    <BookOpen size={18} />
                                    Registrar Electivo
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-100 transition">
                                    <Bookmark size={18} />
                                    Catálogo de Electivos
                                </button>
                            </>
                        )}
                        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-blue-100 transition">
                            <Settings size={18} />
                            Configuración
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
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold mb-6"
                >
                    Bienvenido, {user.nombre.split(" ")[0]} 👋
                </motion.h1>

                {/* PROFESOR */}
                {user.tipo === "Profesor" ? (
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
