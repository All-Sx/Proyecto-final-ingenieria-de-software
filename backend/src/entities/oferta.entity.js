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
        unique: true, 
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
   
    cupos: { 
        type: "int", 
        nullable: false 
    },
    estado: {
        type: "enum",
        enum: ["PENDIENTE", "APROBADO", "RECHAZADO"],
        default: "PENDIENTE",
    },
    nombre_profesor: {
        type: "varchar",      
        length: 150,         
        nullable: false       
    },
    created_at: { 
        type: "timestamp", 
        createDate: true 
    },
  },
});