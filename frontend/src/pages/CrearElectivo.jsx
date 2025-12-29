import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useModal } from "../context/ModalContext";
import { BookOpen, Users, GraduationCap } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import ModoOscuro from "../components/ModoOscuro";
import { createElectivo } from "../services/electivo.service";
import { getCarreras } from "../services/carreras.service";
import { obtenerPeriodoActual } from "../services/periodos.service";

export default function CrearElectivo() {
  const { darkMode } = useTheme();
  const { showModal } = useModal();

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    cupos: "",
    creditos: "",
  });

  const [electivos, setElectivos] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [periodoActual, setPeriodoActual] = useState(null);
  const [loadingPeriodo, setLoadingPeriodo] = useState(true);

  useEffect(() => {
    const fetchPeriodoActual = async () => {
      try {
        const res = await obtenerPeriodoActual();
        setPeriodoActual(res.data.data); // null si no hay período
      } catch (error) {
        showModal(
          "error",
          error.response?.data?.message ||
          "Error al verificar el período de inscripción"
        );
      } finally {
        setLoadingPeriodo(false);
      }
    };

    fetchPeriodoActual();
  }, []);

  useEffect(() => {
    const fetchCarreras = async () => {
      try {
        const data = await getCarreras();

        const carrerasFormateadas = data.map((c) => ({
          id: c.id,
          nombre: c.nombre,
          seleccionada: false,
          cupos: "",
        }));

        setCarreras(carrerasFormateadas);
      } catch (error) {
        const backendMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Error al cargar las carreras.";
        showModal("error", backendMessage);
      }
    };

    fetchCarreras();
  }, [])

  const toggleCarrera = (id) => {
    setCarreras((prevCarreras) => {
      const nuevasCarreras = prevCarreras.map(c => {
        if (c.id !== id) return c;

        const nuevaSeleccion = !c.seleccionada;

        return {
          ...c,
          seleccionada: nuevaSeleccion,
          cupos: nuevaSeleccion ? c.cupos : ""
        };
      });

      const seleccionadas = nuevasCarreras.filter(c => c.seleccionada);

      if (seleccionadas.length === 1) {
        return nuevasCarreras.map(c =>
          c.seleccionada
            ? { ...c, cupos: formData.cuposTotales }
            : c
        );
      }

      return nuevasCarreras;
    });
  };


  const handleCuposCarrera = (id, value) => {
    setCarreras(carreras.map(c => c.id === id ? { ...c, cupos: value } : c));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.descripcion || !formData.cuposTotales || !formData.creditos) {
      showModal("error", "Por favor completa todos los campos obligatorios.");
      return;
    }

    const carrerasSeleccionadas = carreras
      .filter(c => c.seleccionada)
      .map(c => ({
        carrera_id: c.id,
        cantidad: Number(c.cupos)
      }));

    const carrerasConCuposInvalidos = carrerasSeleccionadas.some(
      c => !c.cantidad || c.cantidad <= 0
    );

    if (carrerasSeleccionadas.length > 1 && carrerasConCuposInvalidos) {
      showModal("error", "Si seleccionas más de una carrera, todas deben tener cupos asignados.");
      return;
    }

    if (carrerasSeleccionadas.length === 0) {
      showModal("error", "Debes seleccionar al menos una carrera.");
      return;
    }

    const sumaCupos = carrerasSeleccionadas.reduce(
      (acc, c) => acc + (c.cantidad || 0),
      0
    );

    if (sumaCupos !== Number(formData.cuposTotales)) {
      showModal("error",
        `La suma de los cupos por carrera (${sumaCupos}) debe coincidir con los cupos totales (${formData.cuposTotales}).`
      );
      return;
    }

    try {
      await createElectivo({
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        creditos: Number(formData.creditos),
        cupos: Number(formData.cuposTotales),
        distribucion_cupos: carrerasSeleccionadas
      });

      showModal("success", "Electivo registrado correctamente.");

      setFormData({ nombre: "", descripcion: "", creditos: "", cuposTotales: "" });

      setCarreras(carreras.map(c => ({
        ...c,
        seleccionada: false,
        cupos: ""
      })));

    } catch (err) {
      showModal(
        "error",
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Error al registrar el electivo"
      );
    }
  };

  if (loadingPeriodo) {
    return (
      <div
        className={`py-20 text-center ${darkMode ? "text-gray-300" : "text-gray-700"
          }`}
      >
        Verificando período de inscripción...
      </div>
    );
  }

  return (
    <div className={`py-10 transition-colors duration-500 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"}`}>
      <div className={`max-w-3xl mx-auto p-8 rounded-2xl shadow-lg transition-colors ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <h2 className={`text-2xl font-semibold mb-6 text-center flex items-center justify-center gap-2 ${darkMode ? "text-gray-100" : "text-gray-800"}`}>
          <BookOpen className="text-green-500" /> Registro de Electivos
        </h2>

        {!periodoActual ? (
          <div
            className={`p-10 rounded-2xl text-center ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"
              }`}
          >
            <h3 className="text-xl font-semibold mb-3">
              No hay período de inscripción activo
            </h3>
            <p className="text-sm opacity-80">
              No es posible registrar electivos mientras no exista un período de
              inscripción vigente.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm mb-4 opacity-70 text-center">
              Período activo: <strong>{periodoActual.nombre}</strong>
            </p>

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

              <button type="submit" className="w-full bg-green-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition-colors">
                Registrar Electivo
              </button>
            </form>
          </>
        )}
      </div>

      <ModoOscuro />
    </div>
  );
}
