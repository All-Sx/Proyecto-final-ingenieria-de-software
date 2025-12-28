export const ROLES = {
  JEFE: "Jefe de Carrera",
  PROFESOR: "Profesor",
  ALUMNO: "Alumno",
};

export const isJefe = (rol) => rol === ROLES.JEFE;
export const isProfesor = (rol) => rol === ROLES.PROFESOR;
export const isAlumno = (rol) => rol === ROLES.ALUMNO;