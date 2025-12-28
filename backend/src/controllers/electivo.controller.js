import { createElectivoService, getElectivosService, getElectivosByProfesorService, updateElectivoService, getElectivosAprobadosService } from "../services/electivo.service.js";
import { handleErrorClient } from "../handlers/response.handlers.js";

export const createElectivo = async (req, res) => {
  try {
    const { nombre, descripcion, creditos, cupos, distribucion_cupos, estado } = req.body;

    const nombreProfesor = req.user?.nombre_completo;
    
    if (!nombreProfesor) {
      return handleErrorClient(res, 401, "Usuario no autenticado o sin nombre.");
    }

    if (!nombre || !cupos) {
      return handleErrorClient(res, 400, "Nombre y cupos del electivo son obligatorios.");
    }

    if (!distribucion_cupos || !Array.isArray(distribucion_cupos) || distribucion_cupos.length === 0) {
      return handleErrorClient(res, 400, "Debe especificar la distribución de cupos por carrera.");
    }

    const estadoNormalizado = estado ? estado.toUpperCase() : undefined;

    if (estadoNormalizado && estadoNormalizado !== "PENDIENTE") {
      return handleErrorClient(res, 400, "Solo puedes crear electivos en estado PENDIENTE. Los estados APROBADO y RECHAZADO solo pueden ser asignados por el Jefe de Carrera.");
    }

    const result = await createElectivoService({ 
      nombre, 
      descripcion, 
      creditos, 
      cupos, 
      distribucion_cupos 
    }, nombreProfesor);

    if (result.error) {
      const status = result.error.includes("Ya existe") ? 409 : 500;
      return handleErrorClient(res, status, result.error);
    }

    return res.status(201).json({
      message: "Electivo creado exitosamente",
      data: result.data
    });

  } catch (error) {
    return handleErrorClient(res, 500, "Error en el servidor", error.message);
  }
};

export const getElectivos = async (req, res) => {
  try {
    //obtenemos el Rol 
    const { rol } = req.user; 
    let { estado } = req.query; 

    //filtro por estado si es alumno
    if (rol === "Alumno") {
        estado = "APROBADO";
    }

    const result = await getElectivosService(estado);

    if (result.error) {
      return handleErrorClient(res, 500, result.error);
    }

    return res.status(200).json({
      message: "Lista de electivos",
      data: result.data
    });

  } catch (error) {
    return handleErrorClient(res, 500, "Error interno del servidor", error.message);
  }
};


export const getMisElectivos = async (req, res) => {
  try {
 
    const nombreProfesor = req.user?.nombre_completo;
    
    if (!nombreProfesor) {
      return handleErrorClient(res, 401, "Usuario no autenticado.");
    }


    const result = await getElectivosByProfesorService(nombreProfesor);

    if (result.error) {
      return handleErrorClient(res, 500, result.error);
    }

   
    return res.status(200).json({
      message: "Lista de tus electivos",
      data: result.data
    });

  } catch (error) {
    return handleErrorClient(res, 500, "Error interno del servidor", error.message);
  }
};

export const updateElectivo = async (req, res) => {
  try {
    const { id } = req.params; 
    const datosActualizar = req.body; 

    const result = await updateElectivoService(Number(id), datosActualizar);

    if (result.error) {

        const status = result.error === "Electivo no encontrado" ? 404 : 500;
        return handleErrorClient(res, status, result.error);
    }

    return res.status(200).json({
      message: "Electivo actualizado correctamente",
      data: result.data
    });

  } catch (error) {
    return handleErrorClient(res, 500, "Error en el servidor", error.message);
  }
};

export const getElectivosAprobados = async (req, res) => {
  try {
    const result = await getElectivosAprobadosService();

    if (result.error) {
      const status = result.error.includes("cerrado") ? 403 : 404;
      return handleErrorClient(res, status, result.error);
    }

    return res.status(200).json({
      message: "Lista de electivos aprobados",
      data: result.data
    });

  } catch (error) {
    return handleErrorClient(res, 500, "Error interno del servidor", error.message);
  }
}
