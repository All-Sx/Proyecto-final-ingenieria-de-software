import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/Sidebar";
import VistaInicio from "../components/VistaInicio";
import VistaElectivos from "../pages/VistaElectivos";
import VistaPerfil from "../pages/VistaPerfil";
import VistaConfiguracion from "../pages/VistaConfiguracion";
import VistaEditarPerfil from "../pages/VistaEditarPerfil";
import ModoOscuro from "../components/ModoOscuro";
import VistaCrearElectivo from "../pages/VistaCrearElectivo";
import InscripcionesPage from "../pages/Inscripciones";

export default function Dashboard() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser) {
    navigate("/");
    return null;
  }

  const user = storedUser;
  const [vistaActual, setVistaActual] = useState("inicio");

  const [datosEdicion, setDatosEdicion] = useState({
    nombre: user.nombre,
    correo: user.correo,
    telefonoPersonal: user.telefonoPersonal || "",
    correoPersonal: user.correoPersonal || "",
    passwordActual: "",
    passwordNueva: "",
    passwordConfirmar: "",
  });

  const [mensajeEdicion, setMensajeEdicion] = useState({ tipo: "", texto: "" });

  const handleChangeEdicion = (e) =>
    setDatosEdicion({ ...datosEdicion, [e.target.name]: e.target.value });

  const handleGuardarPerfil = (datosActualizados) => {
    localStorage.setItem("user", JSON.stringify(datosActualizados));
    setMensajeEdicion({ tipo: "success", texto: "Perfil actualizado correctamente" });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className={`${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"} min-h-screen flex`}>
      <Sidebar
        user={user}
        darkMode={darkMode}
        vistaActual={vistaActual}
        setVistaActual={setVistaActual}
        handleLogout={handleLogout}
      />

      <main className="flex-1 p-8">
        {vistaActual === "inicio" && <VistaInicio user={user} darkMode={darkMode} />}
        {vistaActual === "electivos" && <VistaElectivos user={user} darkMode={darkMode} />}
        {vistaActual === "registrarElectivo" && <VistaCrearElectivo darkMode={darkMode} />}
        {vistaActual === "inscripciones" && <InscripcionesPage user={user} darkMode={darkMode} />}
        {vistaActual === "perfil" && <VistaPerfil user={user} darkMode={darkMode} />}
        {vistaActual === "configuracion" && (
          <VistaConfiguracion
            setVistaActual={setVistaActual}
            handleLogout={handleLogout}
            darkMode={darkMode}
          />
        )}
        {vistaActual === "editarPerfil" && (
          <VistaEditarPerfil
            datosEdicion={datosEdicion}
            handleChangeEdicion={handleChangeEdicion}
            handleGuardarPerfil={handleGuardarPerfil}
            mensajeEdicion={mensajeEdicion}
            setVistaActual={setVistaActual}
            darkMode={darkMode}
          />
        )}
      </main>

      <ModoOscuro />
    </div>
  );
}
