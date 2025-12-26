import { EntitySchema } from "typeorm";
//crea las tablas Carrera y periodo academico en la base de datos

export const Carrera = new EntitySchema({
  name: "Carrera",
  tableName: "carreras",
  columns: {
    id: { 
        primary: true, 
        type: "int", 
        generated: "increment" 
    },
    codigo: { 
        type: "varchar", 
        length: 20, 
        unique: true 
    },
    nombre: { 
        type: "varchar", 
        length: 100 
    },
  },
});

export const PeriodoAcademico = new EntitySchema({
  name: "PeriodoAcademico",
  tableName: "periodos_academicos",
  columns: {
    id: { 
        primary: true, 
        type: "int", 
        generated: "increment" 
    },
    nombre: { 
        type: "varchar", 
        length: 20 
    }, // Ej: "2025-2"
    fecha_inicio: { 
        type: "timestamp" 
    },
    fecha_fin: { 
        type: "timestamp" 
    },
    estado: {
      type: "enum",
      enum: ["PLANIFICACION", "INSCRIPCION", "SELECCION", "CERRADO"],
      default: "PLANIFICACION",
    },
  },
});