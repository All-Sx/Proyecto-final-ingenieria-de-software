import { EntitySchema } from "typeorm";

export const Electivo = new EntitySchema({
  name: "Electivo",
  tableName: "electivos",
  columns: {
    id: { 
        primary: true, 
        type: "int", 
        generated: "increment" 
    },
    nombre: { 
        type: "varchar", 
        length: 100,
        unique: true, // Recomendado: evitar dos electivos con el mismo nombre
        nullable: false
    },
    descripcion: { 
        type: "text", 
        nullable: true 
    },
    creditos: { 
        type: "int", 
        default: 5 
    },
    // Aquí agregamos los cupos directamente
    cupos: { 
        type: "int", 
        nullable: false 
    },
    estado: {
        type: "enum",
        enum: ["PENDIENTE", "APROBADO", "RECHAZADO"],
        default: "PENDIENTE",
    },
    // NUEVO: Campo para guardar el nombre del profesor que creó el electivo
    // Esto nos permite saber quién creó cada electivo y filtrarlo después
    nombre_profesor: {
        type: "varchar",      // Tipo texto con longitud máxima
        length: 150,          // Máximo 150 caracteres
        nullable: false       // OBLIGATORIO: siempre debe tener el nombre del profesor
    },
    created_at: { 
        type: "timestamp", 
        createDate: true 
    },
  },
});