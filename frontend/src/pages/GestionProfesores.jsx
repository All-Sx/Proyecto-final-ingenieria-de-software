import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getProfesores, createUser } from "../services/usuarios.service";
import { isJefe } from "../helpers/roles";

export default function GestionProfesores({ user, darkMode }) {
  const [profesores, setProfesores] = useState([]);
  const [filteredProfesores, setFilteredProfesores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalCrear, setModalCrear] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const [nuevoProfesor, setNuevoProfesor] = useState({
    rut: "",
    nombre_completo: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isJefe(user.rol)) {
      cargarProfesores();
    }
  }, [user]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProfesores(profesores);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = profesores.filter(profesor =>
        profesor.nombre_completo.toLowerCase().includes(term) ||
        profesor.rut.toLowerCase().includes(term) ||
        profesor.email.toLowerCase().includes(term)
      );
      setFilteredProfesores(filtered);
    }
  }, [searchTerm, profesores]);

  const cargarProfesores = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProfesores();
      setProfesores(data);
      setFilteredProfesores(data);
    } catch (err) {
      console.error("Error al cargar profesores:", err);
      setError("Error al cargar la lista de profesores");
    } finally {
      setLoading(false);
    }
  };

  const handleCrearProfesor = async (e) => {
    e.preventDefault();
    
    try {
      await createUser({
        ...nuevoProfesor,
        rol: "Profesor"
      });

      setMensaje({
        tipo: "success",
        texto: "Profesor creado exitosamente"
      });

      setModalCrear(false);
      setNuevoProfesor({
        rut: "",
        nombre_completo: "",
        email: "",
        password: ""
      });

      await cargarProfesores();
      setTimeout(() => setMensaje(null), 5000);
    } catch (err) {
      console.error("Error al crear profesor:", err);
      setMensaje({
        tipo: "error",
        texto: err.response?.data?.message || "Error al crear el profesor"
      });
      setTimeout(() => setMensaje(null), 5000);
    }
  };

  const handleChange = (e) => {
    setNuevoProfesor({
      ...nuevoProfesor,
      [e.target.name]: e.target.value
    });
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
    return <div className="p-8 text-center">Cargando profesores...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-800"}`}>
            Gestión de Profesores
          </h2>
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            Administra los profesores registrados en el sistema
          </p>
        </div>
        <button
          onClick={() => setModalCrear(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition"
        >
          + Crear Profesor
        </button>
      </div>

      <div>
        {mensaje && (
          <div className={`mb-6 p-4 rounded-lg ${
            mensaje.tipo === "success" 
              ? "bg-green-100 border border-green-400 text-green-800" 
              : "bg-red-100 border border-red-400 text-red-800"
          }`}>
            {mensaje.texto}
          </div>
        )}

        {/* Barra de búsqueda */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre, RUT o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full p-3 rounded-lg border ${
              darkMode
                ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
            }`}
          />
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-blue-50"}`}>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Total de Profesores
            </p>
            <p className={`text-3xl font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
              {profesores.length}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? "bg-gray-800" : "bg-green-50"}`}>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Profesores Activos
            </p>
            <p className={`text-3xl font-bold ${darkMode ? "text-green-400" : "text-green-600"}`}>
              {profesores.filter(p => p.activo).length}
            </p>
          </div>
        </div>

        {/* Tabla de profesores */}
        {filteredProfesores.length === 0 ? (
          <div className={`text-center py-10 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            <p>
              {searchTerm ? "No se encontraron profesores con ese criterio de búsqueda." : "No hay profesores registrados."}
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
                  <th className="p-3 text-left">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfesores.map((profesor) => (
                  <motion.tr
                    key={profesor.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`border-b ${darkMode ? "border-gray-700 hover:bg-gray-800" : "border-gray-200 hover:bg-gray-50"} transition`}
                  >
                    <td className="p-3">{profesor.rut}</td>
                    <td className="p-3 font-medium">{profesor.nombre_completo}</td>
                    <td className="p-3">{profesor.email}</td>
                    <td className="p-3">
                      {profesor.activo ? (
                        <span className="text-green-500">● Activo</span>
                      ) : (
                        <span className="text-red-500">● Inactivo</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Crear Profesor */}
      {modalCrear && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className={`p-8 rounded-2xl w-full max-w-lg ${darkMode ? "bg-gray-900" : "bg-white"}`}>
            <h2 className="text-xl font-bold mb-6">Crear Nuevo Profesor</h2>
            
            <form onSubmit={handleCrearProfesor} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">RUT</label>
                <input
                  type="text"
                  name="rut"
                  value={nuevoProfesor.rut}
                  onChange={handleChange}
                  required
                  placeholder="12.345.678-9"
                  className={`w-full rounded-xl border px-3 py-2 ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nombre Completo</label>
                <input
                  type="text"
                  name="nombre_completo"
                  value={nuevoProfesor.nombre_completo}
                  onChange={handleChange}
                  required
                  placeholder="Juan Pérez González"
                  className={`w-full rounded-xl border px-3 py-2 ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={nuevoProfesor.email}
                  onChange={handleChange}
                  required
                  placeholder="profesor@ubiobio.cl"
                  className={`w-full rounded-xl border px-3 py-2 ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={nuevoProfesor.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className={`w-full rounded-xl border px-3 py-2 ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setModalCrear(false)}
                  className="px-4 py-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition"
                >
                  Crear Profesor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
