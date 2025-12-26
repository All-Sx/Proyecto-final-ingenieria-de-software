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
    // Estado del electivo: solo "Aprobado" o "Rechazado"
    // El jefe de carrera debe decidir inmediatamente
    estado: {
        type: "enum",
        enum: ["Aprobado", "Rechazado"],
        nullable: true, // null = aún no revisado (pendiente)
        default: null
    },
    created_at: { 
        type: "timestamp", 
        createDate: true 
    },
  },
});