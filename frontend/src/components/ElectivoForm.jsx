import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, FileText, ClipboardList, GraduationCap } from "lucide-react";

export default function ElectivoForm() {
  // Simula que el usuario es profesor autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isPeriodActive, setIsPeriodActive] = useState(true);

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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-gray-700 text-center">
          <p className="text-xl font-semibold">Acceso restringido</p>
          <p>Debes iniciar sesión como profesor para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
          <BookOpen className="text-blue-600" /> Registro de Electivos
        </h2>

        {!isPeriodActive ? (
          <div className="text-center text-gray-600 bg-yellow-100 border border-yellow-300 rounded-xl p-4">
            <p>⚠️ El período de inscripción aún no está disponible.</p>
            <p>Podrás registrar electivos una vez que el jefe de carrera lo habilite.</p>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del electivo
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Inteligencia Artificial"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe brevemente el contenido del curso..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cupos disponibles
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      type="number"
                      name="cupos"
                      value={formData.cupos}
                      onChange={handleChange}
                      className="w-full pl-10 border border-gray-300 rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: 25"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Créditos
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      type="number"
                      name="creditos"
                      value={formData.creditos}
                      onChange={handleChange}
                      className="w-full pl-10 border border-gray-300 rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: 5"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requisitos previos (opcional)
                </label>
                <div className="relative">
                  <ClipboardList className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="requisitos"
                    value={formData.requisitos}
                    onChange={handleChange}
                    className="w-full pl-10 border border-gray-300 rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Base de Datos"
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              {success && <p className="text-green-600 text-sm text-center">{success}</p>}

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
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Electivos registrados
                </h3>
                <div className="space-y-3">
                  {electivos.map((el) => (
                    <motion.div
                      key={el.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-xl p-4 bg-gray-50 shadow-sm"
                    >
                      <h4 className="font-medium text-gray-800">{el.nombre}</h4>
                      <p className="text-sm text-gray-600">{el.descripcion}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        <strong>Cupos:</strong> {el.cupos} | <strong>Créditos:</strong>{" "}
                        {el.creditos}
                      </p>
                      {el.requisitos && (
                        <p className="text-sm text-gray-500">
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
    </div>
  );
}