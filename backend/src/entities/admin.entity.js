import { EntitySchema } from "typeorm";

export const Admin = new EntitySchema({
  name: "Admin",
  tableName: "admin",
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
    apellidos: {
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