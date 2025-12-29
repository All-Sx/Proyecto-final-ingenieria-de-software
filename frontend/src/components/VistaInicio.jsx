import React from "react";
import { motion } from "framer-motion";
import { isProfesor, isJefe } from "../helpers/roles";

export default function VistaInicio({ user, darkMode, setVistaActual }) {
  
  // Tarjetas administrativas solo para Jefe de Carrera (no se cargan de la API)
  const tarjetasAdmin = [
    { id: "admin-001", nombre: "Gestión de Electivos", descripcion: "Panel administrativo", progreso: 0.8, estado: "Revisar", pendiente: false },
    { id: "admin-003", nombre: "Planificación Académica", descripcion: "Planificación de electivos", progreso: 0.3, estado: "En progreso", pendiente: true },
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

      {isJefe(user.rol) || isProfesor(user.rol) ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Solo mostramos tarjetas si es Jefe de Carrera */}
          {isJefe(user.rol) && tarjetasAdmin.map((e) => (
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
          
          {/* Mensaje para profesores */}
          {isProfesor(user.rol) && (
            <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Aquí podrás ver tus electivos propuestos.
            </p>
          )}
        </motion.div>
      ) : (
        <p className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}>
          Selecciona “Electivos” en el menú para ver el catálogo disponible.
        </p>
      )}
    </>
  );
}
