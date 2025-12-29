import React from "react";
import { motion } from "framer-motion";
import { isProfesor, isJefe, isAlumno } from "../helpers/roles";

export default function VistaInicio({ user, darkMode, setVistaActual }) {
  // Tarjetas administrativas solo para Jefe de Carrera (no se cargan de la API)
  const tarjetasAdmin = [
    { id: "admin-001", nombre: "Gestión de Electivos", descripcion: "Panel administrativo", progreso: 0.8, estado: "Revisar", pendiente: false },
    { id: "admin-003", nombre: "Planificación Académica", descripcion: "Planificación de electivos", progreso: 0.3, estado: "En progreso", pendiente: true },
  ];

  // Tarjeta para alumnos
  const tarjetaAlumno = {
    id: "alumno-001",
    nombre: "Catálogo de Electivos",
    descripcion: "Explora y descubre los electivos disponibles"
  };

  // Tarjetas para profesores
  const tarjetasProfesor = [
    { id: "profesor-001", nombre: "Mis Electivos", descripcion: "Visualiza y gestiona tus electivos propuestos" },
    { id: "profesor-002", nombre: "Registrar Electivo", descripcion: "Propone un nuevo electivo para estudiantes" },
  ];

  return (
    <>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`text-3xl font-bold mb-6 ${darkMode ? "text-gray-100" : "text-gray-800"}`}
      >
        Bienvenido, {user?.nombre}
      </motion.h1>

      {isJefe(user.rol) ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {tarjetasAdmin.map((e) => (
            <motion.div
              key={e.id}
              whileHover={{ scale: 1.02 }}
              className={`rounded-2xl shadow-md p-6 transition-colors ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}
            >
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? "text-purple-400" : "text-purple-600"}`}>
                {e.nombre}
              </h3>
              <p className={`text-sm mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {e.descripcion}
              </p>
              <button 
                onClick={() => {
                  // Si es la tarjeta de Gestión de Electivos, cambiar la vista
                  if (e.id === "admin-001") {
                    setVistaActual("gestionElectivos");
                  }
                  // Si es la tarjeta de Planificación Académica, ir a inscripciones
                  if (e.id === "admin-003") {
                    setVistaActual("inscripciones");
                  }
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl font-medium transition"
              >
                Abrir panel
              </button>
            </motion.div>
          ))}
        </motion.div>
      ) : isProfesor(user.rol) ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {tarjetasProfesor.map((tarjeta) => (
            <motion.div
              key={tarjeta.id}
              whileHover={{ scale: 1.02 }}
              className={`rounded-2xl shadow-md p-6 transition-colors ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}
            >
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? "text-green-400" : "text-green-600"}`}>
                {tarjeta.nombre}
              </h3>
              <p className={`text-sm mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {tarjeta.descripcion}
              </p>
              <button 
                onClick={() => {
                  if (tarjeta.id === "profesor-001") {
                    setVistaActual("inicio");
                  }
                  if (tarjeta.id === "profesor-002") {
                    setVistaActual("registrarElectivo");
                  }
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-medium transition"
              >
                Abrir panel
              </button>
            </motion.div>
          ))}
        </motion.div>
      ) : isAlumno(user.rol) ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`rounded-2xl shadow-md p-6 transition-colors ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}
          >
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
              {tarjetaAlumno.nombre}
            </h3>
            <p className={`text-sm mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              {tarjetaAlumno.descripcion}
            </p>
            <button 
              onClick={() => setVistaActual("electivos")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition"
            >
              Abrir panel
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </>
  );
}
