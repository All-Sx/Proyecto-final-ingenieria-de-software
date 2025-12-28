import React from "react";
import { motion } from "framer-motion";

export default function VistaPerfil({ user, darkMode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-6 rounded-2xl shadow-md transition-colors ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
      <h2 className="text-2xl font-bold mb-4">Perfil del Usuario</h2>
      <p><strong>Nombre:</strong> {user.nombre}</p>
      <p><strong>Correo:</strong> {user.correo}</p>
    </motion.div>
  );
}
