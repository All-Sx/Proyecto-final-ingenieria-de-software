import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  ClipboardList,
  GraduationCap,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import ModoOscuro from "./ModoOscuro";

export default function ElectivoForm() {
  // Simula que el usuario es profesor autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isPeriodActive, setIsPeriodActive] = useState(true);

  const { darkMode } = useTheme();

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    cupos: "",
    creditos: "",
    requisitos: "",
  });

  const [electivos, setElectivos] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.descripcion || !formData.cupos || !formData.creditos) {
      setError("Por favor completa todos los campos obligatorios.");
      setSuccess("");
      return;
    }

    const nuevoElectivo = { ...formData, id: Date.now() };
    setElectivos([...electivos, nuevoElectivo]);
    setFormData({
      nombre: "",
      descripcion: "",
      cupos: "",
      creditos: "",
      requisitos: "",
    });
    setError("");
    setSuccess("Electivo registrado correctamente.");
  };

  if (!isAuthenticated) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-700"
        }`}
      >
        <div className="text-center">
          <p className="text-xl font-semibold">Acceso restringido</p>
          <p>Debes iniciar sesión como profesor para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen py-10 transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div
        className={`max-w-3xl mx-auto p-8 rounded-2xl shadow-lg transition-colors ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h2
          className={`text-2xl font-semibold mb-6 text-center flex items-center justify-center gap-2 ${
            darkMode ? "text-gray-100" : "text-gray-800"
          }`}
        >
          <BookOpen className="text-blue-500" /> Registro de Electivos
        </h2>

        {!isPeriodActive ? (
          <div
            className={`text-center rounded-xl p-4 border ${
              darkMode
                ? "bg-yellow-900/30 border-yellow-700 text-yellow-200"
                : "bg-yellow-100 border-yellow-300 text-gray-700"
            }`}
          >
            <p>⚠️ El período de inscripción aún no está disponible.</p>
            <p>Podrás registrar electivos una vez que el jefe de carrera lo habilite.</p>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nombre */}
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Nombre del electivo
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`w-full border rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  placeholder="Ej: Inteligencia Artificial"
                />
              </div>

              {/* Descripción */}
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full border rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  placeholder="Describe brevemente el contenido del curso..."
                />
              </div>

              {/* Cupos y Créditos */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Cupos disponibles
                  </label>
                  <div className="relative">
                    <Users
                      className={`absolute left-3 top-3 ${
                        darkMode ? "text-gray-400" : "text-gray-400"
                      }`}
                      size={18}
                    />
                    <input
                      type="number"
                      name="cupos"
                      value={formData.cupos}
                      onChange={handleChange}
                      className={`w-full pl-10 border rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder="Ej: 25"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Créditos
                  </label>
                  <div className="relative">
                    <GraduationCap
                      className={`absolute left-3 top-3 ${
                        darkMode ? "text-gray-400" : "text-gray-400"
                      }`}
                      size={18}
                    />
                    <input
                      type="number"
                      name="creditos"
                      value={formData.creditos}
                      onChange={handleChange}
                      className={`w-full pl-10 border rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                      placeholder="Ej: 5"
                    />
                  </div>
                </div>
              </div>

              {/* Requisitos */}
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  Requisitos previos (opcional)
                </label>
                <div className="relative">
                  <ClipboardList
                    className={`absolute left-3 top-3 ${
                      darkMode ? "text-gray-400" : "text-gray-400"
                    }`}
                    size={18}
                  />
                  <input
                    type="text"
                    name="requisitos"
                    value={formData.requisitos}
                    onChange={handleChange}
                    className={`w-full pl-10 border rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder="Ej: Base de Datos"
                  />
                </div>
              </div>

              {/* Mensajes */}
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              {success && (
                <p className="text-green-500 text-sm text-center">{success}</p>
              )}

              {/* Botón principal */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition-colors"
              >
                Registrar Electivo
              </button>
            </form>

            {/* Lista de electivos registrados */}
            {electivos.length > 0 && (
              <div className="mt-8">
                <h3
                  className={`text-lg font-semibold mb-3 ${
                    darkMode ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  Electivos registrados
                </h3>
                <div className="space-y-3">
                  {electivos.map((el) => (
                    <motion.div
                      key={el.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`border rounded-xl p-4 shadow-sm transition-colors ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-gray-100"
                          : "bg-gray-50 border-gray-200 text-gray-800"
                      }`}
                    >
                      <h4 className="font-medium">{el.nombre}</h4>
                      <p className="text-sm">{el.descripcion}</p>
                      <p className="text-sm mt-1">
                        <strong>Cupos:</strong> {el.cupos} |{" "}
                        <strong>Créditos:</strong> {el.creditos}
                      </p>
                      {el.requisitos && (
                        <p className="text-sm">
                          <strong>Requisitos:</strong> {el.requisitos}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Botón flotante persistente */}
      <ModoOscuro />
    </div>
  );
}
