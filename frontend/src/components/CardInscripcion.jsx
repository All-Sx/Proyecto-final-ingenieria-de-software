import React from "react";
import { motion } from "framer-motion";
import { isAlumno } from "../helpers/roles";
import { XCircle } from "lucide-react";

export default function CardInscripcion({ electivo, estado, darkMode, onClick, rolUsuario, onEliminar, periodoActivo = true }) {

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`rounded-2xl shadow-md p-6 transition-colors ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-semibold text-purple-500 mb-1">
                        {electivo.nombre}
                    </h3>
                    <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                        {electivo.nombre_profesor}
                    </p>
                </div>
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${estado?.toUpperCase() === "PENDIENTE"
                        ? "bg-yellow-200 text-yellow-900"
                        : estado?.toUpperCase() === "ACEPTADO"
                            ? "bg-green-200 text-green-900"
                            : "bg-red-200 text-red-900"
                        }`}
                >
                    {estado?.toUpperCase() === "PENDIENTE"
                        ? "Pendiente"
                        : estado?.toUpperCase() === "ACEPTADO"
                            ? "Aceptado"
                            : "Rechazado"}
                </span>
            </div>
            <p className={`text-sm mb-3 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                {electivo.descripcion}
            </p>

            <div className={`text-sm space-y-1 mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                <p> <strong>Profesor:</strong> {electivo.nombre_profesor || "Por asignar"}</p>
                {/*backend no manda semestre en esta consulta*/}
                <p> <strong>Semestre:</strong> {electivo.semestre || "2025-1"}</p>
                <p> <strong>Créditos:</strong> {electivo.creditos}</p>
                <p> <strong>Cupos totales:</strong> {electivo.cupos}</p>
                {!isAlumno(rolUsuario) && (
                    <p>
                        Estado:{" "}
                        <span className={`font-semibold ${electivo.estado === "Aceptado" ? "text-green-500" : electivo.estado === "PENDIENTE" ? "text-yellow-500" : "text-red-500"}`}>
                            {electivo.estado}
                        </span>
                    </p>
                )}
            </div>


            <div className="flex gap-3">

                <button
                    onClick={onClick}
                    className={`${periodoActivo ? "flex-1" : "w-full"} bg-blue-600 dark:bg-blue-700 text-white dark:text-white py-3 rounded-xl font-medium`}
                >
                    Ver detalles
                </button>
                {periodoActivo && (
                    <button
                        onClick={onEliminar}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
                    >
                        <XCircle size={20} />
                        Eliminar inscripcion
                    </button>
                )}
            </div>
        </motion.div>
    );
}