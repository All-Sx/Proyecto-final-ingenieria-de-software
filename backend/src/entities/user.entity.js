import { EntitySchema } from "typeorm";

export const User = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment",
    },
    rut: {
      primary: true,
      type: "varchar",
      length: 12,
      unique: true,
      format: "XXXXXXXX-X",
      nullable: false,
    },
    nombre: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    primer_apellido: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    segundo_apellido: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    email: {
      type: "varchar",
      length: 255,
      unique: true,
      nullable: false,
    },
    cargo: {
      type: "varchar",
      length: 100,
      nullable: false,
      values: ["alumno", "jefe_carrera", "profesor", "administrador"],
    },
    password: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
    updated_at: {
      type: "timestamp",
      updateDate: true,
      default: () => "CURRENT_TIMESTAMP",
    },
  },
});