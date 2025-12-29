import { useState, useEffect } from "react";
import { getSolicitudes } from "../services/solicitudes.service";

export function useSolicitudesPendientes() {
  const [contador, setContador] = useState(0);
  const [loading, setLoading] = useState(true);

  const cargarContador = async () => {
    try {
      const response = await getSolicitudes({ estado: "PENDIENTE" });
      const solicitudes = response.data.data || [];
      setContador(solicitudes.length);
    } catch (error) {
      console.error("Error al cargar contador de solicitudes:", error);
      setContador(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarContador();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(cargarContador, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { contador, loading, refetch: cargarContador };
}
