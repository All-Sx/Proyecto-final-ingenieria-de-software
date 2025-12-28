import React from "react";
import { motion } from "framer-motion";
import { isProfesor, isJefe } from "../helpers/roles";

export default function VistaInicio({ user, darkMode }) {
  // Datos de ejemplo
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
  ];

  if (isJefe(user.rol)) {
    electivos = [
      { id: "admin-001", nombre: "Gestión de Electivos", descripcion: "Panel administrativo", progreso: 0.8, estado: "Revisar", pendiente: false },
      { id: "admin-002", nombre: "Estadísticas y Reportes", descripcion: "Análisis de inscripciones", progreso: 1.0, estado: "Completado", pendiente: false },
      { id: "admin-003", nombre: "Planificación Académica", descripcion: "Planificación de electivos", progreso: 0.3, estado: "En progreso", pendiente: true },
    ];
  }

  return (
    <>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-3xl font-bold mb-6 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
      >
        Bienvenido, {user?.nombre} 👋
      </motion.h1>

      {isJefe(user.rol) || isProfesor(user.rol) ? (
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
              className={`rounded-2xl shadow-md p-6 transition-colors ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}
            >
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? "text-purple-400" : "text-purple-600"}`}>
                {e.nombre}
              </h3>
              <p className={`text-sm mb-3 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {e.descripcion}
              </p>
              <p className="text-sm mb-1">
                Estado: <span className={`font-semibold ${e.estado === "Completado" ? "text-green-500" : e.estado === "Revisar" ? "text-yellow-500" : "text-blue-500"}`}>
                  {e.estado}
                </span>
              </p>
              <div className={`w-full rounded-full h-2 mb-3 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${e.progreso ? e.progreso * 100 : 0}%` }} />
              </div>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl font-medium transition">
                {e.id === "admin-001" ? "Abrir panel" : e.pendiente ? "Revisar" : "Ver detalles"}
              </button>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          Selecciona “Electivos” en el menú para ver el catálogo disponible.
        </p>
      )}
    </>
  );
}
