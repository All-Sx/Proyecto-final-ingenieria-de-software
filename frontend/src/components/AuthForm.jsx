import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, User, IdCard } from "lucide-react";
import { button } from "framer-motion/client";
import { useNavigate } from "react-router-dom";

export default function AuthForm() {
  const [isRegister, setIsRegister] = useState(false);
  const [userType, setUserType] = useState(""); // estudiante o profesor
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    rut: "",
    email: "",
    password: "",
    carrera: "",
  });

  const carreras = [
    "Ingeniería Civil Informática",
    "Ingeniería de Ejecución en Computación e Informática"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isRegister) {
      if (!formData.name || !formData.rut || !formData.email || !formData.password || !userType) {
        setError("Por favor, completa todos los campos requeridos.");
        return;
      }
      if (userType === "estudiante" && !formData.carrera) {
        setError("Por favor, selecciona tu carrera.");
        return;
      }

      setError("");
      console.log("Registro:", { ...formData, userType });
      alert("Registro exitoso");
    } else {
      if (!formData.email || !formData.password) {
        setError("Ingresa tus credenciales para iniciar sesión.");
        return;
      }
      setError("");
      console.log("Login:", formData);
      alert("Inicio de sesión");
    }

    navigate("/dashboard", {
      state: {
        user: {
          nombre: "Profesor Demo",
          correo: formData.email,
          tipo: "Profesor",
          foto: "https://i.pravatar.cc/150?img=12",
        },
      },
    });
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
          {isRegister ? "Crear Cuenta" : "Iniciar Sesión"}
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
                {/* Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre y Apellido
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Juan Pérez"
                    />
                  </div>
                </div>

                {/* RUT */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RUT
                  </label>
                  <div className="relative">
                    <IdCard className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="rut"
                      value={formData.rut}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="12.345.678-9"
                    />
                  </div>
                </div>

                {/* Tipo de usuario */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de usuario
                  </label>
                  <select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona...</option>
                    <option value="estudiante">Estudiante</option>
                    <option value="profesor">Profesor</option>
                  </select>
                </div>

                {/* Carrera (solo si es estudiante) */}
                {userType === "estudiante" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Carrera universitaria
                    </label>
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
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Campos comunes (login y registro) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo institucional
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="usuario@ubiobio.cl"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition-colors"
          >
            {isRegister ? "Registrarme" : "Entrar"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
                setUserType("");
              }}
              className="text-blue-600 hover:underline font-medium"
            >
              {isRegister ? "Inicia sesión" : "Regístrate"}
            </button>
          </p>
        </form>

        {/* Botones temporales para acceso sin registro */}
        <div className="mt-6 border-t pt-4 text-center">
          <p className="text-sm text-gray-500 mb-3">Modo demostración:</p>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() =>
                navigate("/dashboard", {
                  state: {
                    user: {
                      nombre: "Profesor Demo",
                      correo: "profesor.demo@ubiobio.cl",
                      tipo: "Profesor",
                      foto: "",
                    },
                  },
                })
              }
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl font-medium transition-colors"
            >
              👨‍🏫 Entrar como Profesor (Demo)
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/dashboard", {
                  state: {
                    user: {
                      nombre: "Estudiante Demo",
                      correo: "estudiante.demo@alumnos.ubiobio.cl",
                      tipo: "Estudiante",
                      foto: "",
                    },
                  },
                })
              }
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl font-medium transition-colors"
            >
              🎓 Entrar como Estudiante (Demo)
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
}

