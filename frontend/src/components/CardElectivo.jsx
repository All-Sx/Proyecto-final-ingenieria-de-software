import React from "react";
import { motion } from "framer-motion";
import { isAlumno } from "../helpers/roles";

export default function CardElectivo({ electivo, darkMode, onClick, onInscribir, rolUsuario, inscrito }) {
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`rounded-2xl shadow-md p-6 transition-colors ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}
    >
      <h3 className={`text-lg font-semibold mb-2 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
        {electivo.nombre}
      </h3>

      <p className={`text-sm mb-3 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
        {electivo.descripcion}
      </p>

      <div className={`text-sm space-y-1 mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        <p> <strong>Profesor:</strong> {electivo.nombre_profesor || "Por asignar"}</p>
        {/*backend no manda semestre en esta consulta*/}
        <p> <strong>Semestre:</strong> {electivo.semestre || "2025-1"}</p>
        <p> <strong>Créditos:</strong> {electivo.creditos}</p>
        <p> <strong>Cupos disponibles:</strong> {electivo.cupos}</p>
        
        {!isAlumno(rolUsuario) && (
          <p>
            Estado:{" "}
            <span className={`font-semibold ${electivo.estado === "APROBADO" ? "text-green-500" : electivo.estado === "PENDIENTE" ? "text-yellow-500" : "text-red-500"}`}>
              {electivo.estado}
            </span>
          </p>
        )}
      </div>

      {isAlumno(rolUsuario) && electivo.estado === "APROBADO" ? (
        inscrito ? (
          <button
            disabled
            className="w-full bg-gray-400 text-white py-2 rounded-xl font-medium cursor-not-allowed"
          >
            Ya inscrito
          </button>
        ) : (
          <button
            onClick={onInscribir}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-medium transition"
          >
            Inscribir Electivo
          </button>
        )
      ) : (
        <button
          onClick={onClick}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition"
        >
          Ver detalles
        </button>
      )}
    </motion.div>
  );
}