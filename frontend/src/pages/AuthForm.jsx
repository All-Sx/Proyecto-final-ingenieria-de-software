import { login, register } from "../services/auth.service";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, User, IdCard } from "lucide-react";
import backgroundImage from "../assets/ubiobio-background.jpg";
import ModoOscuro from "../components/ModoOscuro";
import { button } from "framer-motion/client";
import { useNavigate } from "react-router-dom";
import {
  validarNombresOApellidos,
  validarRut,
  validarPassword,
  validarCorreoEstudiante,
} from "../helpers/validators";
import { ROLES } from "../helpers/roles";

const initialFormData = {
  nombres: "",
  apellidos: "",
  rut: "",
  email: "",
  password: "",
};

export default function AuthForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);

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
  const emailDisabled = isRegister && emailBloqueado;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) {
        const errorNombres = validarNombresOApellidos(formData.nombres, "nombres");
        if (errorNombres) return setError(errorNombres);

        const errorApellidos = validarNombresOApellidos(formData.apellidos, "apellidos");
        if (errorApellidos) return setError(errorApellidos);

        const errorRut = validarRut(formData.rut);
        if (errorRut) return setError(errorRut);

        const errorPassword = validarPassword(formData.password);
        if (errorPassword) return setError(errorPassword);

        const errorEmail = validarCorreoEstudiante(
          formData.email,
          formData.nombres,
          formData.apellidos
        );

        if (!errorEmail.valid) return setError(errorEmail.error);

        await register({
          rut: formData.rut,
          nombre_completo: `${formData.nombres} ${formData.apellidos}`,
          email: formData.email,
          password: formData.password,
        });

        alert("Registro exitoso, ahora puedes iniciar sesión.");
        setIsRegister(false);
        setFormData(initialFormData);
        return;
      }

      if (!formData.email || !formData.password) {
        return setError("Ingresa tus credenciales.");
      }

      const { data } = await login({
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.user.id,
          nombre: data.user.nombre,
          correo: data.user.email,
          rol: data.user.rol,
        })
      );

      console.log("LOGIN DATA:", data);
      navigate("/dashboard");

    } catch (err) {
      console.error(err);

      if (err.response) {
        if (err.response.status === 401) {
          setError("Email o contraseña incorrectos.");
        } else if (err.response.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Ocurrió un error. Intenta nuevamente.");
        }
      } else {
        setError("No se pudo conectar con el servidor.");
      }
    }
  };

  const handleRutChange = (e) => {
    const value = e.target.value.toLowerCase();
    setFormData({ ...formData, rut: value });
    setError("");
  };

  const handleDemoLogin = (role) => {
    let user;

    if (role === "profesor") {
      user = {
        nombre: "Profesor Demo",
        correo: "profesor.demo@ubiobio.cl",
        rol: ROLES.PROFESOR,
        tipo: "Profesor"
      };
    }
    localStorage.setItem("user", JSON.stringify(user));

    navigate("/dashboard", { state: { user } });
  };

  return (
    <div 
      className="flex min-h-screen items-center justify-center bg-gray-100 relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay oscuro para mejorar legibilidad */}
      <div className="absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-70"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 relative z-10"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-6">
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
                  className="w-full border dark:border-gray-600 rounded-xl p-2 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />

                {/* Apellidos */}
                <input
                  name="apellidos"
                  placeholder="Apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  className="w-full border dark:border-gray-600 rounded-xl p-2 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />

                {/* RUT */}
                <input
                  name="rut"
                  placeholder="12.345.678-9"
                  value={formData.rut}
                  onChange={handleRutChange}
                  className="w-full border dark:border-gray-600 rounded-xl p-2 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* EMAIL */}
          <input
            name="email"
            placeholder={isRegister ? "nombre.apellido2201@alumnos.ubiobio.cl" : "usuario@ubiobio.cl"}
            value={formData.email}
            disabled={emailDisabled}
            onChange={handleChange}
            className={`w-full border dark:border-gray-600 rounded-xl p-2 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
              emailDisabled ? "bg-gray-100 dark:bg-gray-600 cursor-not-allowed" : ""
            }`}
          />

          {emailDisabled && (
            <p className="text-xs text-red-500 dark:text-red-400">
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
              className="w-full border dark:border-gray-600 rounded-xl p-2 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-gray-600 dark:text-gray-300"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {error && <p className="text-sm text-red-500 dark:text-red-400 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2 rounded-xl font-medium transition-colors"
          >
            {isRegister ? "Registrarme" : "Entrar"}
          </button>

          <p className="text-center text-sm dark:text-gray-300">
            {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
            <button
              type="button"
              className="text-blue-600 dark:text-blue-400 hover:underline"
              onClick={() => {
                setIsRegister(!isRegister);
                setFormData(initialFormData); 
                setError("");
              }}
            >
              {isRegister ? "Inicia sesión" : "Regístrate"}
            </button>
          </p>
        </form>

        {/* Botones temporales para acceso sin registro */}
        <div className="mt-6 border-t dark:border-gray-600 pt-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Modo demostración:</p>

          <div className="flex flex-col gap-3">
            {/* Botón para login demo como PROFESOR */}
            <button
              type="button"
              onClick={() => handleDemoLogin("profesor")}
              className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white py-2 rounded-xl font-medium transition-colors"
            >
              Entrar como Profesor (Demo)
            </button>
          </div>
        </div>
      </motion.div>
      
      <ModoOscuro />
    </div>
  );
}

