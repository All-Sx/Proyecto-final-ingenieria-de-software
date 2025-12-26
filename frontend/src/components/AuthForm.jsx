import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, User, IdCard } from "lucide-react";
import { button } from "framer-motion/client";
import { useNavigate } from "react-router-dom";

const normalizarTexto = (texto) =>
  texto.trim().toLowerCase().split(/\s+/);

const quitarTildes = (texto) =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const validarNombresOApellidos = (valor, tipo) => {
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

const validarRut = (rut) => {
  if (!rut.trim()) {
    return "Debes ingresar tu RUT.";
  }

  const regex = /^\d{1,2}\.\d{3}\.\d{3}-[\dk]$/;

  if (!regex.test(rut)) {
    return "El RUT debe tener el formato XX.XXX.XXX-X";
  }

  return null;
};

const validarCorreoEstudiante = (email, nombres, apellidos) => {
  const regex =
    /^([a-z]+)\.([a-z]+)(\d{2})0([12])@alumnos\.ubiobio\.cl$/;

  const match = email.match(regex);

  if (!match) {
    return {
      valid: false,
      error:
        "Formato inválido",
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

const validarPassword = (password) => {
  if (!password) {
    return "Debes ingresar una contraseña.";
  }

  if (password.length < 8) {
    return "La contraseña debe tener al menos 8 caracteres.";
  }

  const tieneLetra = /[a-zA-Z]/.test(password);
  const tieneNumero = /\d/.test(password);

  if (!tieneLetra || !tieneNumero) {
    return "La contraseña debe contener letras y números.";
  }

  return null;
};

const initialFormData = {
  nombres: "",
  apellidos: "",
  rut: "",
  email: "",
  password: "",
  carrera: "",
};

export default function AuthForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);

  const carreras = [
    "Ingeniería Civil Informática",
    "Ingeniería de Ejecución en Computación e Informática"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const errorNombres = validarNombresOApellidos(
    formData.nombres,
    "nombres"
  );
  const errorApellidos = validarNombresOApellidos(
    formData.apellidos,
    "apellidos"
  );

  const emailBloqueado = !!errorNombres || !!errorApellidos;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isRegister) {
      if (errorNombres) return setError(errorNombres);
      if (errorApellidos) return setError(errorApellidos);

      if (!formData.rut || !formData.password || !formData.carrera) {
        setError("Por favor, completa todos los campos requeridos.");
        return;
      }

      const errorRut = validarRut(formData.rut);
      if (errorRut) {
        setError(errorRut);
        return;
      }

      const errorPassword = validarPassword(formData.password);
      if (errorPassword) return setError(errorPassword);

      const errorEmail = validarCorreoEstudiante(
        formData.email,
        formData.nombres,
        formData.apellidos
      );

      if (!errorEmail.valid) {
        setError(errorEmail.error);
        return;
      }
      console.log("Registro estudiante:", formData);
      alert("Registro exitoso");
    } else {
      if (!formData.email || !formData.password) {
        setError("Ingresa tus credenciales.");
        return;
      }
    }

    navigate("/dashboard");
  };

  const handleRutChange = (e) => {
    const value = e.target.value.toLowerCase();
    setFormData({ ...formData, rut: value });
    setError("");
  };

  const handleDemoLogin = (role) => {
    let user;

    // Verificar el rol y crear el objeto de usuario correspondiente
    if (role === "profesor") {
      user = {
        nombre: "Profesor Demo",
        correo: "profesor.demo@ubiobio.cl",
        rol: "profesor",
        tipo: "Profesor"
      };
    } else if (role === "estudiante") {
      user = {
        nombre: "Estudiante Demo",
        correo: "estudiante.demo@alumnos.ubiobio.cl",
        rol: "estudiante",
        tipo: "Estudiante"
      };
    } else if (role === "jefe") {
      // Caso específico para el Jefe de Carrera
      user = {
        nombre: "Jefe de Carrera",
        correo: "jefe.carrera@ubiobio.cl",
        rol: "jefe",  // Identificador único para el jefe
        tipo: "Jefe de Carrera"
      };
    }

    // GUARDAR usuario en localStorage para persistencia entre páginas
    // Convertimos el objeto a string JSON para almacenarlo
    localStorage.setItem("user", JSON.stringify(user));

    // Navegar al dashboard y pasar el usuario también por state (método alternativo)
    navigate("/dashboard", { state: { user } });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {isRegister ? "Registro de Estudiantes" : "Iniciar Sesión"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campos de registro */}
          <AnimatePresence mode="wait">
            {isRegister && (
              <motion.div
                key="register-fields"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                {/* Nombres */}
                <input
                  name="nombres"
                  placeholder="Nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-2"
                />

                {/* Apellidos */}
                <input
                  name="apellidos"
                  placeholder="Apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  className="w-full border rounded-xl p-2"
                />

                {/* RUT */}
                <input
                  name="rut"
                  placeholder="12.345.678-9"
                  value={formData.rut}
                  onChange={handleRutChange}
                  className="w-full border rounded-xl p-2"
                />

                {/* Carrera */}
                <div>
                  <select
                    name="carrera"
                    value={formData.carrera}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona tu carrera...</option>
                    {carreras.map((carrera) => (
                      <option key={carrera} value={carrera}>
                        {carrera}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* EMAIL */}
          <input
            name="email"
            placeholder={isRegister ? "nombre.apellido2201@alumnos.ubiobio.cl" : "usuario@ubiobio.cl"}
            value={formData.email}
            disabled={isRegister && emailBloqueado}
            onChange={handleChange}
            className={`w-full border rounded-xl p-2 ${emailBloqueado && "bg-gray-100 cursor-not-allowed"
              }`}
          />

          {isRegister && emailBloqueado && (
            <p className="text-xs text-red-500">
              Ingresa primero todos tus nombres y apellidos correctamente antes de poder ingresar tu correo institucional.
            </p>
          )}

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded-xl p-2"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition-colors"
          >
            {isRegister ? "Registrarme" : "Entrar"}
          </button>

          <p className="text-center text-sm">
            {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
            <button
              type="button"
              className="text-blue-600"
              onClick={() => {
                setIsRegister(!isRegister);
                setFormData(initialFormData); // 👈 RESET
                setError("");
              }}
            >
              {isRegister ? "Inicia sesión" : "Regístrate"}
            </button>
          </p>
        </form>

        {/* Botones temporales para acceso sin registro */}
        <div className="mt-6 border-t pt-4 text-center">
          <p className="text-sm text-gray-500 mb-3">Modo demostración:</p>

          <div className="flex flex-col gap-3">
            {/* Botón para login demo como PROFESOR */}
            <button
              type="button"
              onClick={() => handleDemoLogin("profesor")}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-medium transition-colors"
            >
              Entrar como Profesor (Demo)
            </button>

            {/* Botón para login demo como ESTUDIANTE */}
            <button
              type="button"
              onClick={() => handleDemoLogin("estudiante")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition-colors"
            >
              Entrar como Estudiante (Demo)
            </button>

            {/* Botón para login demo como JEFE DE CARRERA */}
            {/* Este botón usa color púrpura para diferenciarlo de los otros roles */}
            <button
              type="button"
              onClick={() => handleDemoLogin("jefe")}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl font-medium transition-colors"
            >
              Entrar como Jefe de Carrera (Demo)
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}

