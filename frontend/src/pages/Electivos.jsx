import React, { useState, useEffect } from "react";
import CardElectivo from "../components/CardElectivo";
import { getElectivos } from "../services/electivo.service";

export default function Electivos({ user, darkMode }) {
  const [electivos, setElectivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const data = await getElectivos();
        
        setElectivos(data);
      } catch (err) {
        console.error("Error al cargar electivos:", err);
        setError("Hubo un problema al cargar el catálogo.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []); 

  if (loading) return <div className="p-8 text-center">Cargando electivos...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-800"}`}>
        Catálogo de Electivos
      </h2>

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
              onClick={() => console.log("Ver detalles de:", electivo.nombre)}
            />
          ))}
        </div>
      )}
    </div>
  );
}