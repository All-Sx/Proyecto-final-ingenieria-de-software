import React from "react";
import { motion } from "framer-motion";

export default function EditarPerfil({ datosEdicion, handleChangeEdicion, handleGuardarPerfil, mensajeEdicion, setVistaActual, darkMode }) {
  const onSubmit = (e) => {
    e.preventDefault();
    handleGuardarPerfil({ ...datosEdicion });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-8 rounded-2xl shadow-md max-w-2xl transition-colors ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
      <h2 className="text-2xl font-bold mb-6">Editar Perfil y Seguridad</h2>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nombre Completo</label>
            <input type="text" name="nombre" value={datosEdicion.nombre} onChange={handleChangeEdicion} required className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Correo Institucional</label>
            <input type="email" name="correo" value={datosEdicion.correo} onChange={handleChangeEdicion} required className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`} />
          </div>
        </div>

        <div className="pb-4">
          <h3 className="text-lg font-semibold mb-4 text-purple-600">Cambiar Contraseña</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Contraseña Actual</label>
              <input type="password" name="passwordActual" value={datosEdicion.passwordActual} onChange={handleChangeEdicion} className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nueva Contraseña</label>
              <input type="password" name="passwordNueva" value={datosEdicion.passwordNueva} onChange={handleChangeEdicion} placeholder="Mínimo 6 caracteres" className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Confirmar Nueva Contraseña</label>
              <input type="password" name="passwordConfirmar" value={datosEdicion.passwordConfirmar} onChange={handleChangeEdicion} placeholder="Repite la nueva contraseña" className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"}`} />
            </div>
          </div>
        </div>

        {mensajeEdicion.texto && (
          <div className={`p-4 rounded-xl ${mensajeEdicion.tipo === "success" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}`}>
            {mensajeEdicion.texto}
          </div>
        )}

        <div className="flex gap-4">
          <button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium transition">Guardar Cambios</button>
          <button type="button" onClick={() => setVistaActual("configuracion")} className="flex-1 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-black dark:text-white py-3 rounded-xl font-medium transition">Cancelar</button>
        </div>
      </form>
    </motion.div>
  );
}
