import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ModalAsignarCarrera from "../components/ModalAsignarCarrera";
import { getAlumnos } from "../services/usuarios.service";
import { isJefe } from "../helpers/roles";
import { useModal } from "../context/ModalContext";

export default function GestionAlumnos({ user, darkMode }) {
  const [alumnos, setAlumnos] = useState([]);
  const [filteredAlumnos, setFilteredAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalAsignar, setModalAsignar] = useState(null);
  const { showModal } = useModal();

  useEffect(() => {
    if (isJefe(user.rol)) {
      cargarAlumnos();
    }
  }, [user]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredAlumnos(alumnos);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = alumnos.filter(alumno =>
        alumno.nombre_completo.toLowerCase().includes(term) ||
        alumno.rut.toLowerCase().includes(term) ||
        alumno.email.toLowerCase().includes(term) ||
        alumno.alumno?.carrera?.nombre.toLowerCase().includes(term)
      );
      setFilteredAlumnos(filtered);
    }
  }, [searchTerm, alumnos]);

  const cargarAlumnos = async () => {
    try {
      setLoading(true);
      const data = await getAlumnos();
      setAlumnos(data);
      setFilteredAlumnos(data);
    } catch (err) {
      console.error(err);
      showModal("error", "Error al cargar la lista de alumnos.");
    } finally {
      setLoading(false);
    }
  };

  const handleAsignarCarreraClick = (alumno) => {
    setModalAsignar(alumno);
  };

  const handleAsignacionExitosa = async (resultado) => {
    showModal(
      "success",
      resultado?.message || "Carrera asignada exitosamente."
    );
    await cargarAlumnos();
  };

  if (!isJefe(user.rol)) {
    return (
      <div className="p-8 text-center">
        <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
          Acceso restringido. Solo Jefes de Carrera pueden acceder a esta sección.
        </p>
      </div>
    );
  }

  if (loading) {
    return <div className="p-8 text-center">Cargando alumnos...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
          Gestión de Alumnos
        </h2>
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          Asigna carreras a los alumnos registrados en el sistema
        </p>
      </div>

      <div>
        {/* Lista de alumnos */}
        <div>
          {/* NO BORRAR */}
          {/* Barra de búsqueda */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Buscar por nombre, RUT, email o carrera..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full p-3 rounded-lg border ${darkMode
                  ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                }`}
            />
          </div>
          {/* NO BORRAR */}
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-blue-50"}`}>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Total de Alumnos
              </p>
              <p className={`text-3xl font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                {alumnos.length}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-green-50"}`}>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Con Carrera Asignada
              </p>
              <p className={`text-3xl font-bold ${darkMode ? "text-green-400" : "text-green-600"}`}>
                {alumnos.filter(a => a.alumno?.carrera).length}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-yellow-50"}`}>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Sin Carrera
              </p>
              <p className={`text-3xl font-bold ${darkMode ? "text-yellow-400" : "text-yellow-600"}`}>
                {alumnos.filter(a => !a.alumno?.carrera).length}
              </p>
            </div>
          </div>
          {/* NO BORRAR */}
          {/* Tabla de alumnos */}
          {filteredAlumnos.length === 0 ? (
            <div className={`text-center py-10 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              <p>
                {searchTerm ? "No se encontraron alumnos con ese criterio de búsqueda." : "No hay alumnos registrados."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className={`w-full ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
                <thead className={darkMode ? "bg-gray-800" : "bg-gray-100"}>
                  <tr>
                    <th className="p-3 text-left">RUT</th>
                    <th className="p-3 text-left">Nombre Completo</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Carrera</th>
                    <th className="p-3 text-left">Estado</th>
                    <th className="p-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAlumnos.map((alumno) => (
                    <motion.tr
                      key={alumno.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`border-b ${darkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"} transition`}
                    >
                      <td className="p-3">{alumno.rut}</td>
                      <td className="p-3 font-medium">{alumno.nombre_completo}</td>
                      <td className="p-3">{alumno.email}</td>
                      <td className="p-3">
                        {alumno.alumno?.carrera ? (
                          <span className={`px-2 py-1 rounded text-sm ${darkMode ? "bg-blue-900 text-blue-300" : "bg-blue-100 text-blue-800"}`}>
                            {alumno.alumno.carrera.nombre}
                          </span>
                        ) : (
                          <span className={`px-2 py-1 rounded text-sm ${darkMode ? "bg-yellow-900 text-yellow-300" : "bg-yellow-100 text-yellow-800"}`}>
                            Sin asignar
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        {alumno.activo ? (
                          <span className="text-green-500">●</span>
                        ) : (
                          <span className="text-red-500">●</span>
                        )}
                        {" "}
                        {alumno.activo ? "Activo" : "Inactivo"}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => handleAsignarCarreraClick(alumno)}
                          className={`px-4 py-2 rounded-lg font-medium transition ${alumno.alumno?.carrera
                              ? darkMode
                                ? "bg-blue-700 hover:bg-blue-600 text-blue-100"
                                : "bg-blue-100 hover:bg-blue-200 text-blue-800"
                              : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                        >
                          {alumno.alumno?.carrera ? "Cambiar" : "Asignar"}
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {modalAsignar && (
        <ModalAsignarCarrera
          alumno={modalAsignar}
          darkMode={darkMode}
          onClose={() => setModalAsignar(null)}
          onSuccess={handleAsignacionExitosa}
        />
      )}
    </div>
  );
}
