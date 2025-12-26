import { AppDataSource } from "../config/configdb.js";
import { Electivo } from "../entities/oferta.entity.js"; // <--- Importamos desde oferta.entity.js
import { PeriodoAcademico } from "../entities/academico.entity.js";

export async function createElectivoService(data) {
  try {
    const electivoRepository = AppDataSource.getRepository(Electivo);
    const periodoRepository = AppDataSource.getRepository(PeriodoAcademico);

    // Validar que exista un periodo en estado INSCRIPCION
    const periodoActivo = await periodoRepository.findOne({
      where: { estado: "INSCRIPCION" }
    });

    if (!periodoActivo) {
      return { error: "No hay un periodo de inscripción activo. Debe crear o activar un periodo primero." };
    }

    // Validar que estamos dentro de las fechas del periodo
    const ahora = new Date();
    const fechaInicio = new Date(periodoActivo.fecha_inicio);
    const fechaFin = new Date(periodoActivo.fecha_fin);

    if (ahora < fechaInicio) {
      return { error: `El periodo de inscripción aún no ha iniciado. Comienza el ${fechaInicio.toLocaleDateString()}.` };
    }

    if (ahora > fechaFin) {
      return { error: `El periodo de inscripción ha finalizado. Terminó el ${fechaFin.toLocaleDateString()}.` };
    }

    //validar si el nombre ya existe
    const electivoExist = await electivoRepository.findOneBy({ nombre: data.nombre });
    if (electivoExist) {
        return { error: "Ya existe un electivo con ese nombre." };
    }

    //crear el electivo
    const nuevoElectivo = electivoRepository.create({
        nombre: data.nombre,
        descripcion: data.descripcion,
        creditos: data.creditos || 5, //usar 5 por defecto si no envia nada
        cupos: data.cupos
    });

    const electivoGuardado = await electivoRepository.save(nuevoElectivo);
    return { data: electivoGuardado };

  } catch (error) {
    console.error("Error en createElectivoService:", error);
    return { error: "Error interno al crear el electivo." };
  }
}