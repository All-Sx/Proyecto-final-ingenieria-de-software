import { AppDataSource } from "../config/configdb.js";
import { Alumno } from "../entities/alumno.entity.js";
import { Usuario } from "../entities/usuarios.entity.js";
import { Carrera } from "../entities/academico.entity.js"; // Ojo: importa Carrera de donde la tengas

export async function asignarCarreraService(usuarioId, carreraCodigo) {
  try {
    const usuarioRepository = AppDataSource.getRepository(Usuario);
    const alumnoRepository = AppDataSource.getRepository(Alumno);
    const carreraRepository = AppDataSource.getRepository(Carrera);

    // 1. Validar que el Usuario exista
    const usuario = await usuarioRepository.findOne({ 
        where: { id: usuarioId },
        relations: ["rol"]
    });

    if (!usuario) {
      return { error: "Usuario no encontrado." };
    }
    
    // Opcional: Validar que el usuario tenga rol 'Alumno'
    if (usuario.rol.nombre !== "Alumno") {
        return { error: "El usuario no tiene el rol de Alumno." };
    }

    // 2. Validar que la Carrera exista
    const carrera = await carreraRepository.findOneBy({ codigo: carreraCodigo });
    if (!carrera) {
      return { error: "Carrera no encontrada." };
    }

    // 3. Buscar si este usuario ya tiene un registro en la tabla 'alumnos'
    // Como la PK de alumno es usuario_id, buscamos por ese ID
    let alumnoData = await alumnoRepository.findOneBy({ usuario_id: usuarioId });

    if (alumnoData) {
      // CASO A: Ya existe en la tabla alumnos -> Actualizamos la carrera
      alumnoData.carrera = carrera;
    } else {
      // CASO B: No existe en la tabla alumnos -> Lo creamos desde cero
      alumnoData = alumnoRepository.create({
        usuario_id: usuarioId, // Vinculamos con el usuario
        carrera: carrera,      // Asignamos la carrera
        anio_ingreso: new Date().getFullYear(), // Default: año actual
        creditos_acumulados: 0
      });
    }

    // 4. Guardar cambios en la tabla 'alumnos'
    const alumnoGuardado = await alumnoRepository.save(alumnoData);

    return { data: alumnoGuardado };

  } catch (error) {
    console.error("Error al asignar carrera:", error);
    return { error: "Error interno al asignar la carrera." };
  }
}