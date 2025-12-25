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
        length: 100 
    },
    descripcion: { 
        type: "text", 
        nullable: true 
    },
    creditos: { 
        type: "int", 
        default: 5 },
    created_at: { 
        type: "timestamp", 
        createDate: true },
  },
});

export const Seccion = new EntitySchema({
  name: "Seccion",
  tableName: "secciones",
  columns: {
    id: { 
        primary: true, 
        type: "int", 
        generated: "increment" 
    },
    horario: { 
        type: "jsonb", 
        nullable: true 
    }, // Postgres soporta JSON nativo
    sala: { 
        type: "varchar", 
        length: 50, 
        nullable: true 
    },
    cupos_totales_reales: { 
        type: "int" 
    },
  },
  relations: {
    electivo: {
      target: "Electivo",
      type: "many-to-one",
      joinColumn: { name: "electivo_id" },
      nullable: false,
    },
    profesor: {
      target: "Usuario", // Relación con el usuario profesor
      type: "many-to-one",
      joinColumn: { name: "profesor_id" },
      nullable: false,
    },
    periodo: {
      target: "PeriodoAcademico",
      type: "many-to-one",
      joinColumn: { name: "periodo_id" },
      nullable: false,
    },
  },
});