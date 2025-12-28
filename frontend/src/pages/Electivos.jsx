import React from "react";
import CardElectivo from "../components/CardElectivo";
import { isAlumno, isProfesor, isJefe } from "../helpers/roles";

const electivosEjemplo = [
  {
    id: 1,
    nombre: "Inteligencia Artificial Aplicada",
    profesor: "Dr. Carlos Mendoza",
    carrera: "Ingeniería Civil Informática",
    semestre: "2025-1",
    creditos: 3,
    cuposDisponibles: 30,
    estado: "pendiente",
    descripcion: "Curso enfocado en técnicas modernas de IA, incluyendo machine learning y redes neuronales.",
  },
  {
    id: 2,
    nombre: "Desarrollo de Videojuegos",
    profesor: "Mg. Ana Torres",
    carrera: "Ingeniería Civil Informática",
    semestre: "2025-1",
    creditos: 2,
    cuposDisponibles: 25,
    estado: "aprobado",
    descripcion: "Diseño y desarrollo de videojuegos usando Unity y C#.",
  },
  {
    id: 3,
    nombre: "Blockchain y Criptomonedas",
    profesor: "Dr. Roberto Silva",
    carrera: "Ingeniería Civil Informática",
    semestre: "2025-2",
    creditos: 3,
    cuposDisponibles: 20,
    estado: "aprobado",
    descripcion: "Fundamentos de blockchain, contratos inteligentes y aplicaciones descentralizadas.",
  },
  {
    id: 4,
    nombre: "Computación Cuántica",
    profesor: "Dra. Patricia López",
    carrera: "Ingeniería Civil Informática",
    semestre: "2025-1",
    creditos: 3,
    cuposDisponibles: 15,
    estado: "rechazado",
    descripcion: "Introducción a los principios de la computación cuántica.",
  },
  {
    id: 5,
    nombre: "Big Data y Analítica",
    profesor: "Dr. Carlos Mendoza",
    carrera: "Ingeniería Civil Informática",
    semestre: "2025-2",
    creditos: 3,
    cuposDisponibles: 40,
    estado: "aprobado",
    descripcion: "Procesamiento y análisis de grandes volúmenes de datos.",
  },
];


export default function Electivos({ user, darkMode }) {
  // Filtrar electivos según rol
  let electivos = electivosEjemplo;

  if (isAlumno(user.rol)) {
    electivos = electivos.filter((e) => e.estado === "aprobado");
  } else if (isProfesor(user.rol)) {
    electivos = electivos.filter((e) => e.profesor === user.nombre);
  } // El jefe ve todos los electivos

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {electivos.map((e) => (
        <CardElectivo key={e.id} electivo={e} darkMode={darkMode} onClick={() => console.log("Ver detalles", e.nombre)} />
      ))}
    </div>
  );
}

