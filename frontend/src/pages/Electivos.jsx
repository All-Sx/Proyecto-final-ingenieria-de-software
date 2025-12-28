import React, { useState, useEffect } from "react";
import CardElectivo from "../components/CardElectivo";
import ModalInscripcion from "../components/ModalInscripcion";
import { getElectivos } from "../services/electivo.service";
import { getMisSolicitudes } from "../services/inscripcion.service";
import { isAlumno } from "../helpers/roles";

export default function Electivos({ user, darkMode }) {
  const [electivos, setElectivos] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalInscripcion, setModalInscripcion] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []); 

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const data = await getElectivos();
      console.log("ESTO ES LO QUE ENVÍA EL BACKEND:", data);
      
      setElectivos(data);

      // Si es alumno, cargar sus solicitudes
      if (isAlumno(user.rol)) {
        try {
          const misSolicitudes = await getMisSolicitudes();
          setSolicitudes(misSolicitudes);
        } catch (err) {
          console.log("No se pudieron cargar solicitudes:", err);
          setSolicitudes([]);
        }
      }
    } catch (err) {
      console.error("Error al cargar electivos:", err);
      setError("Hubo un problema al cargar el catálogo.");
    } finally {
      setLoading(false);
    }
  };

  const handleInscribirClick = (electivo) => {
    setModalInscripcion(electivo);
  };

  const handleInscripcionExitosa = async (resultado) => {
    setMensaje({
      tipo: "success",
      texto: resultado.message || "Inscripción realizada exitosamente"
    });
    
    // Recargar las solicitudes
    await cargarDatos();
    
    // Limpiar mensaje después de 5 segundos
    setTimeout(() => setMensaje(null), 5000);
  };

  const estaInscrito = (electivoId) => {
    return solicitudes.some(s => s.electivo?.id === electivoId);
  }; 

  if (loading) return <div className="p-8 text-center">Cargando electivos...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-800"}`}>
          Catálogo de Electivos
        </h2>
        
        {isAlumno(user.rol) && solicitudes.length > 0 && (
          <div className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
            <span className="font-medium">{solicitudes.length}</span> {solicitudes.length === 1 ? "inscripción" : "inscripciones"}
          </div>
        )}
      </div>

      {mensaje && (
        <div className={`mb-6 p-4 rounded-lg ${
          mensaje.tipo === "success" 
            ? "bg-green-100 border border-green-400 text-green-800" 
            : "bg-red-100 border border-red-400 text-red-800"
        }`}>
          {mensaje.texto}
        </div>
      )}

      {electivos.length === 0 ? (
        <div className={`text-center py-10 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          <p>No hay electivos disponibles para mostrar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {electivos.map((electivo) => (
            <CardElectivo
              key={electivo.id}
              electivo={electivo}
              darkMode={darkMode}
              rolUsuario={user.rol}
              inscrito={estaInscrito(electivo.id)}
              onClick={() => console.log("Ver detalles de:", electivo.nombre)}
              onInscribir={() => handleInscribirClick(electivo)}
            />
          ))}
        </div>
      )}

      {modalInscripcion && (
        <ModalInscripcion
          electivo={modalInscripcion}
          darkMode={darkMode}
          onClose={() => setModalInscripcion(null)}
          onSuccess={handleInscripcionExitosa}
        />
      )}
    </div>
  );
}