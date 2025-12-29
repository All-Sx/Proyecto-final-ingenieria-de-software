import React from "react";

export default function Configuracion({ setVistaActual, handleLogout, darkMode }) {
  return (
    <div className={`p-6 rounded-2xl shadow-md space-y-4 transition-colors ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
      <h2 className="text-2xl font-bold mb-4">Configuración</h2>

      <button onClick={() => setVistaActual("editarPerfil")} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition-colors">
        Editar Perfil y Seguridad
      </button>

      <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-medium transition-colors">
        Cerrar sesión
      </button>

      <button onClick={() => setVistaActual("inicio")} className={`w-full py-2 rounded-xl font-medium transition-colors ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-300 hover:bg-gray-400 text-black"}`}>
        Volver al Inicio
      </button>
    </div>
  );
}
