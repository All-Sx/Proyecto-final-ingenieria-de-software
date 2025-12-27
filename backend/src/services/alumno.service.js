import { AppDataSource } from "../config/configdb.js";
import { Alumno } from "../entities/alumno.entity.js";
import { Usuario } from "../entities/usuarios.entity.js";
import { Carrera } from "../entities/academico.entity.js"; 

export async function asignarCarreraService(usuarioId, carreraCodigo) {
  try {
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const alumnoRepository = AppDataSource.getRepository(Alumno);
    const carreraRepository = AppDataSource.getRepository(Carrera);

    const usuario = await usuarioRepository.findOne({ 
        where: { id: usuarioId },
        relations: ["rol"]
    });

    if (!usuario) {
      return { error: "Usuario no encontrado." };
    }
    
    if (usuario.rol.nombre !== "Alumno") {
        return { error: "El usuario no tiene el rol de Alumno." };
    }

    const carrera = await carreraRepository.findOneBy({ codigo: carreraCodigo });
    if (!carrera) {
      return { error: "Carrera no encontrada." };
    }

    let alumnoData = await alumnoRepository.findOneBy({ usuario_id: usuarioId });

    if (alumnoData) {
      alumnoData.carrera = carrera;
    } else {
      alumnoData = alumnoRepository.create({
        usuario_id: usuarioId, 
        carrera: carrera,      
        anio_ingreso: new Date().getFullYear(), 
        creditos_acumulados: 0
      });
    }

    const alumnoGuardado = await alumnoRepository.save(alumnoData);

    return { data: alumnoGuardado };

  } catch (error) {
    console.error("Error al asignar carrera:", error);
    return { error: "Error interno al asignar la carrera." };
  }
}