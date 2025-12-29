import axios from "../config/axios";

/**
 * Obtener solicitudes con filtros opcionales
 * @param {Object} filtros - { estado: 'PENDIENTE' | 'ACEPTADO' | 'RECHAZADO' | 'LISTA_ESPERA', electivo_id: number }
 */
export const getSolicitudes = async (filtros = {}) => {
  const params = new URLSearchParams();
  
  if (filtros.estado) {
    params.append('estado', filtros.estado);
  }
  
  if (filtros.electivo_id) {
    params.append('electivo_id', filtros.electivo_id);
  }
  
  const queryString = params.toString();
  const url = queryString ? `/jefe-carrera/solicitudes/pendientes?${queryString}` : '/jefe-carrera/solicitudes/pendientes';
  
  return await axios.get(url);
};

/**
 * Aprobar una solicitud
 * @param {number} solicitudId - ID de la solicitud
 */
export const aprobarSolicitud = async (solicitudId) => {
  return await axios.patch(`/jefe-carrera/solicitudes/${solicitudId}/estado`, {
    estado: 'ACEPTADO'
  });
};

/**
 * Rechazar una solicitud
 * @param {number} solicitudId - ID de la solicitud
 */
export const rechazarSolicitud = async (solicitudId) => {
  return await axios.patch(`/jefe-carrera/solicitudes/${solicitudId}/estado`, {
    estado: 'RECHAZADO'
  });
};

/**
 * Mover una solicitud de lista de espera a pendiente
 * @param {number} solicitudId - ID de la solicitud
 */
export const moverARevision = async (solicitudId) => {
  return await axios.patch(`/jefe-carrera/solicitudes/${solicitudId}/mover-a-pendiente`);
};
