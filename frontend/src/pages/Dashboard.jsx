import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/Sidebar";
import VistaInicio from "../components/VistaInicio";
import VistaElectivos from "./Electivos";
import VistaPerfil from "./Perfil";
import VistaConfiguracion from "./Configuracion";
import VistaEditarPerfil from "./EditarPerfil";
import ModoOscuro from "../components/ModoOscuro";
import VistaCrearElectivo from "./CrearElectivo";
import InscripcionesPage from "../pages/Inscripciones";
import { updateClave, updateMyProfile } from "../services/perfil.service";
import GestionElectivos from "./GestionElectivos";
import GestionAlumnos from "./GestionAlumnos";
import VistaMisInscripciones from "./MisIncripciones";


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
    password: "",
    newPassword: "",
    passwordVerification: "",
  });

  const [mensajeEdicion, setMensajeEdicion] = useState({ tipo: "", texto: "" });
  const [mensajeClave, setMensajeClave] = useState({ tipo: "", texto: "" });

  const handleChangeEdicion = (e) =>
    setDatosEdicion({ ...datosEdicion, [e.target.name]: e.target.value });

  const handleGuardarPerfil = async () => {
    try {
      const { nombre, correo } = datosEdicion;
      const data = { nombre_completo: nombre, email: correo };

      const res = await updateMyProfile(data);

      localStorage.setItem("user", JSON.stringify({ ...res.data, nombre: res.data.nombre_completo, correo: res.data.email }));;
      setMensajeEdicion({ tipo: "success", texto: "Perfil actualizado correctamente" });
    } catch (error) {
      setMensajeEdicion({ tipo: "error", texto: "Error al actualizar el perfil" });
    }
  };

  const handleSavePassword = async (e) => {

    if (datosEdicion.newPassword !== datosEdicion.passwordVerification)
      return setMensajeClave({ tipo: "error", texto: "Las nuevas contraseñas no coinciden" });

    try {
      const data = {
        password: datosEdicion.password,
        newPassword: datosEdicion.newPassword,
        passwordVerification: datosEdicion.passwordVerification
      }
      await updateClave(data);
      setMensajeClave({ tipo: "success", texto: "Contraseña cambiada con éxito" });
      setDatosEdicion({ ...datosEdicion, password: "", newPassword: "", passwordVerification: "" });
    } catch (error) {
      setMensajeClave({ tipo: "error", texto: "La contraseña actual es incorrecta" });
    }
  }

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
        {vistaActual === "inicio" && <VistaInicio user={user} darkMode={darkMode} setVistaActual={setVistaActual} />}
        {vistaActual === "electivos" && <VistaElectivos user={user} darkMode={darkMode} />}
        {vistaActual === "registrarElectivo" && <VistaCrearElectivo darkMode={darkMode} />}
        {vistaActual === "inscripciones" && <InscripcionesPage user={user} darkMode={darkMode} />}
        {vistaActual === "misInscripciones" && <VistaMisInscripciones user={user} darkMode={darkMode} />}
        {vistaActual === "gestionAlumnos" && <GestionAlumnos user={user} darkMode={darkMode} />}
        {vistaActual === "perfil" && <VistaPerfil user={user} darkMode={darkMode} />}
        {vistaActual === "gestionElectivos" && <GestionElectivos user={user} darkMode={darkMode} />}
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
            handleSavePassword={handleSavePassword}
            mensajeClave={mensajeClave}
            setVistaActual={setVistaActual}
            darkMode={darkMode}
          />
        )}
      </main>

      <ModoOscuro />
    </div>
  );
}
