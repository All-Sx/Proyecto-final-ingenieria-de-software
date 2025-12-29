import React from "react";
import { User, FileText, BookOpen, GraduationCap, Bookmark, Settings, LogOut, Users } from "lucide-react";
import { isAlumno, isProfesor, isJefe } from "../helpers/roles";
import { motion } from "framer-motion";

export default function Sidebar({ user, darkMode, vistaActual, setVistaActual, handleLogout }) {
    const getHoverUsuario = (rol, darkMode) => {
        if (isJefe(rol)) {
            return darkMode
                ? "hover:bg-purple-700"
                : "hover:bg-purple-200";
        }

        if (isProfesor(rol)) {
            return darkMode
                ? "hover:bg-green-700"
                : "hover:bg-green-200";
        }

        if (isAlumno(rol)) {
            return darkMode
                ? "hover:bg-blue-700"
                : "hover:bg-blue-200";
        }

        return darkMode
            ? "hover:bg-gray-700"
            : "hover:bg-gray-200";
    };

    const hoverUsuario = getHoverUsuario(user.rol, darkMode);

    return (
        <motion.aside
            //animacion de entrada desde la izquierda
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={`w-64 p-6 flex flex-col justify-between shadow-lg ${darkMode ? "bg-gray-800" : "bg-white"
                }`}
        >
            <div>
                {/* Perfil del usuario */}
                <div className="flex flex-col items-center mb-8">
                    {user.foto ? (
                        <img src={user.foto} alt="Foto de perfil" className="w-20 h-20 rounded-full border-4 border-blue-500 mb-3 object-cover" />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-semibold text-blue-700 border-4 border-blue-500 mb-3">
                            {user.nombre.split(" ").map((n) => n[0]).join("").toUpperCase()}
                        </div>
                    )}
                    <h2 className="text-lg font-semibold">{user.nombre}</h2>
                    <p className="text-sm text-gray-500">{user.correo}</p>
                    <span className={`mt-2 text-xs font-semibold px-3 py-1 rounded-full ${isJefe(user.rol) ? "bg-purple-100 text-purple-700" :
                        isProfesor(user.rol) ? "bg-green-100 text-green-700" :
                            "bg-blue-100 text-blue-700"
                        }`}>
                        {isJefe(user.rol) ? "Jefe de Carrera" : isProfesor(user.rol) ? "Profesor" : "Alumno"}
                    </span>
                </div>

                {/* Navegación principal */}
                <nav className="space-y-2">
                    {/* Botón de inicio/volver siempre visible para todos los roles */}
                    <button 
                        onClick={() => setVistaActual("inicio")} 
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition ${
                            vistaActual === "inicio" 
                                ? (isJefe(user.rol) ? "bg-purple-600 text-white" : 
                                   isProfesor(user.rol) ? "bg-green-600 text-white" : 
                                   "bg-blue-600 text-white")
                                : hoverUsuario
                        }`}
                    >
                        <FileText size={18} /> Inicio
                    </button>
                    
                    <button onClick={() => setVistaActual("perfil")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition ${hoverUsuario}`}>
                        <User size={18} /> Perfil
                    </button>

                    {isJefe(user.rol) && (
                        <>
                            <button onClick={() => setVistaActual("gestionElectivos")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition ${hoverUsuario}`}>
                                <Bookmark size={18} /> Electivos
                            </button>
                            <button onClick={() => setVistaActual("inscripciones")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition ${hoverUsuario}`}>
                                <GraduationCap size={18} /> Períodos
                            </button>
                        </>
                    )}

                    {isProfesor(user.rol) && (
                        <>
                            <button onClick={() => setVistaActual("misElectivos")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition ${hoverUsuario}`}>
                                <FileText size={18} /> Mis Electivos
                            </button>
                            <button
                                onClick={() => setVistaActual("registrarElectivo")}
                                className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition ${hoverUsuario}`}>
                                <BookOpen size={18} /> Registrar Electivo
                            </button>
                        </>
                    )}

                    {isAlumno(user.rol) && (
                        <>
                            <button onClick={() => setVistaActual("electivos")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition ${hoverUsuario}`}>
                                <Bookmark size={18} /> Electivos
                            </button>
                            <button onClick={() => setVistaActual("misInscripciones")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition ${hoverUsuario}`}>
                                <BookOpen size={18} /> Mis Inscripciones
                            </button>
                        </>
                    )}

                    <button onClick={() => setVistaActual("configuracion")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition ${hoverUsuario}`}>
                        <Settings size={18} /> Configuración
                    </button>

                    {/* SECCION GESTION DE USUARIOS (solo jefe) */}
                    {isJefe(user.rol) && (
                        <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-700">
                            <h4 className="text-xs font-semibold text-gray-500 mb-2">Gestión de Usuarios</h4>
                            <button onClick={() => setVistaActual("gestionAlumnos")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition ${hoverUsuario}`}>
                                <User size={16} /> Alumnos
                            </button>
                            <button onClick={() => setVistaActual("profesores")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition ${hoverUsuario}`}>
                                <User size={16} /> Profesores
                            </button>
                            <button onClick={() => setVistaActual("solicitudes")} className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition ${hoverUsuario}`}>
                                <FileText size={16} /> Solicitudes
                            </button>
                        </div>
                    )}
                </nav>
            </div>

            {/* Boton de cerrar sesion */}
            <div className="flex flex-col gap-3">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition">
                    <LogOut size={18} /> Cerrar sesión
                </button>
            </div>
        </motion.aside>
    );
}
