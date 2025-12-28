import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, GraduationCap } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import ModoOscuro from "../components/ModoOscuro";

const carrerasDisponibles = [
  { id: 1, nombre: "Ingeniería Civil Informática" },
  { id: 2, nombre: "Ingeniería Ejecución en Computación e Informática" },
];

export default function CrearElectivo() {
  const { darkMode } = useTheme();

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    cupos: "",
    creditos: "",
  });

  const [electivos, setElectivos] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [carreras, setCarreras] = useState(
    carrerasDisponibles.map((c) => ({
      ...c,
      seleccionada: false,
      cupos: "",
    }))
  );

  const toggleCarrera = (id) => {
    setCarreras(carreras.map(c => c.id === id ? { ...c, seleccionada: !c.seleccionada } : c));
  };

  const handleCuposCarrera = (id, value) => {
    setCarreras(carreras.map(c => c.id === id ? { ...c, cupos: value } : c));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.descripcion || !formData.cuposTotales || !formData.creditos) {
      setError("Por favor completa todos los campos obligatorios.");
      setSuccess("");
      return;
    }

    const carrerasSeleccionadas = carreras
      .filter(c => c.seleccionada)
      .map(c => ({ id: c.id, nombre: c.nombre, cupos: Number(c.cupos) }));

    if (carrerasSeleccionadas.length === 0) {
      setError("Debes seleccionar al menos una carrera.");
      setSuccess("");
      return;
    }

    //suma cupos distribuidos en cada carrera
    const sumaCupos = carrerasSeleccionadas.reduce((acc, c) => acc + (c.cupos || 0), 0);

    if (sumaCupos > Number(formData.cuposTotales)) {
      setError(`La suma de los cupos por carrera (${sumaCupos}) supera los cupos totales (${formData.cuposTotales}).`);
      setSuccess("");
      return;
    }

    const nuevoElectivo = {
      ...formData,
      id: Date.now(),
      carreras: carrerasSeleccionadas,
    };

    setElectivos([...electivos, nuevoElectivo]);

    //reiniciar formulario
    setFormData({ nombre: "", descripcion: "", creditos: "", cuposTotales: "" });
    setCarreras(carrerasDisponibles.map(c => ({ ...c, seleccionada: false, cupos: "" })));

    setError("");
    setSuccess("Electivo registrado correctamente.");
  };

  return (
    <div className={`min-h-screen py-10 transition-colors duration-500 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
      <div className={`max-w-3xl mx-auto p-8 rounded-2xl shadow-lg transition-colors ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h2 className={`text-2xl font-semibold mb-6 text-center flex items-center justify-center gap-2 ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
          <BookOpen className="text-blue-500" /> Registro de Electivos
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
              Nombre del electivo
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full border rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" : "bg-white border-gray-300 text-gray-900"}`}
              placeholder="Ej: Inteligencia Artificial"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              className={`w-full border rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" : "bg-white border-gray-300 text-gray-900"}`}
              placeholder="Describe brevemente el contenido del curso..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
                Cupos Totales
              </label>
              <div className="relative">
                <Users
                  className={`absolute left-3 top-3 ${darkMode ? "text-gray-400" : "text-gray-400"}`}
                  size={18}
                />
                <input
                  type="number"
                  name="cuposTotales"
                  value={formData.cuposTotales}
                  onChange={(e) =>
                    setFormData({ ...formData, cuposTotales: e.target.value })
                  }
                  className={`w-full border rounded-xl py-2 pl-10 pr-3 focus:ring-2 focus:ring-blue-500 ${darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100"
                      : "bg-white border-gray-300 text-gray-900"
                    }`}
                  placeholder="Ej: 50"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>Créditos</label>
              <div className="relative">
                <GraduationCap className={`absolute left-3 top-3 ${darkMode ? "text-gray-400" : "text-gray-400"}`} size={18} />
                <input
                  type="number"
                  name="creditos"
                  value={formData.creditos}
                  onChange={handleChange}
                  className={`w-full pl-10 border rounded-xl py-2 px-3 focus:ring-2 focus:ring-blue-500 ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400" : "bg-white border-gray-300 text-gray-900"}`}
                  placeholder="Ej: 5"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
              Selecciona las carreras donde se impartirá el electivo
            </label>

            <div className="space-y-2">
              {carreras.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={c.seleccionada}
                    onChange={() => toggleCarrera(c.id)}
                    className="w-4 h-4"
                  />
                  <span className={`${darkMode ? "text-gray-200" : "text-gray-800"}`}>{c.nombre}</span>
                  <input
                    type="number"
                    value={c.cupos}
                    onChange={(e) => handleCuposCarrera(c.id, e.target.value)}
                    placeholder="Cupos"
                    disabled={!c.seleccionada}
                    className={`ml-auto w-20 border rounded-xl py-1 px-2 focus:ring-2 focus:ring-blue-500 ${darkMode
                        ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900"}
                      ${c.seleccionada} "cursor-not-allowed"`}
                      
                  />
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center">{success}</p>}

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition-colors">
            Registrar Electivo
          </button>
        </form>

        {electivos.length > 0 && (
          <div className="mt-8">
            <h3 className={`text-lg font-semibold mb-3 ${darkMode ? "text-gray-100" : "text-gray-800"}`}>Electivos registrados</h3>
            <div className="space-y-3">
              {electivos.map((el) => (
                <motion.div
                  key={el.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`border rounded-xl p-4 shadow-sm transition-colors ${darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-gray-50 border-gray-200 text-gray-800"}`}
                >
                  <h4 className="font-medium">{el.nombre}</h4>
                  <p className="text-sm">{el.descripcion}</p>
                  <p className="text-sm mt-1">
                    <strong>Cupos:</strong> {el.cupos} | <strong>Créditos:</strong> {el.creditos}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ModoOscuro />
    </div>
  );
}
