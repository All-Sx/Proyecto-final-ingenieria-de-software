import { normalizarTexto, quitarTildes } from "./textUtils";

export const validarNombresOApellidos = (valor, tipo) => {
  if (!valor.trim()) {
    return `Debes ingresar tus ${tipo}.`;
  }

  const palabras = normalizarTexto(valor);

  if (palabras.length < 2) {
    return `Ingresa todos tus ${tipo}.`;
  }

  const regex = /^[a-záéíóúñ]+$/;

  for (const palabra of palabras) {
    if (!regex.test(palabra)) {
      return `Los ${tipo} no pueden contener números ni caracteres especiales.`;
    }
  }

  return null;
};

export const validarRut = (rut) => {
  if (!rut.trim()) {
    return "Debes ingresar tu RUT.";
  }

  const regex = /^\d{1,2}\.\d{3}\.\d{3}-[\dk]$/;
  return regex.test(rut)
    ? null
    : "El RUT debe tener el formato XX.XXX.XXX-X";
};

export const validarPassword = (password) => {
  if (!password) return "Debes ingresar una contraseña.";
  if (password.length < 8)
    return "La contraseña debe tener al menos 8 caracteres.";

  const tieneLetra = /[a-zA-Z]/.test(password);
  const tieneNumero = /\d/.test(password);

  return tieneLetra && tieneNumero
    ? null
    : "La contraseña debe contener letras y números.";
};

export const validarCorreoEstudiante = (email, nombres, apellidos) => {
  const regex =
    /^([a-z]+)\.([a-z]+)(\d{2})0([12])@alumnos\.ubiobio\.cl$/;

  const match = email.match(regex);

  if (!match) {
    return {
      valid: false,
      error: "Formato inválido",
    };
  }

  const nombreEmail = match[1];
  const apellidoEmail = match[2];
  const anioIngreso = parseInt(match[3], 10);
  const semestre = match[4];
  const anioActual = new Date().getFullYear() % 100;

  if (anioIngreso > anioActual) {
    return {
      valid: false,
      error: "El año de ingreso no puede ser mayor al año actual.",
    };
  }

  if (semestre !== "1" && semestre !== "2") {
    return {
      valid: false,
      error: "El semestre debe ser 1 o 2.",
    };
  }

  const nombresArray = normalizarTexto(nombres);
  const apellidosArray = normalizarTexto(apellidos);

  if (
    quitarTildes(nombreEmail) !==
    quitarTildes(nombresArray[0])
  ) {
    return {
      valid: false,
      error:
        "El nombre del correo no coincide con tu primer nombre.",
    };
  }

  if (
    quitarTildes(apellidoEmail) !==
    quitarTildes(apellidosArray[0])
  ) {
    return {
      valid: false,
      error:
        "El apellido del correo no coincide con tu primer apellido.",
    };
  }

  return { valid: true };
};