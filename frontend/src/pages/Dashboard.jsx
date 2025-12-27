import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/Dashboard/Sidebar";
import VistaInicio from "../components/Dashboard/VistaInicio";
import VistaElectivos from "../components/Dashboard/VistaElectivos";
import VistaPerfil from "../components/Dashboard/VistaPerfil";
import VistaConfiguracion from "../components/Dashboard/VistaConfiguracion";
import VistaEditarPerfil from "../components/Dashboard/VistaEditarPerfil";
import ElectivoForm from "../components/Dashboard/ElectivoForm";
import ModoOscuro from "../components/ModoOscuro";

export default function Dashboard() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser) {
    navigate("/");
    return null;
  }

  const user = storedUser;
  const [vistaActual, setVistaActual] = useState(user.rol === "alumno" ? "electivos" : "inicio");

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
        {vistaActual === "registrarElectivo" && <ElectivoForm darkMode={darkMode}/>}
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
