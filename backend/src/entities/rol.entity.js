import { EntitySchema } from "typeorm";

export const Rol = new EntitySchema({
  name: "Rol",
  tableName: "roles", 
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 50,
      nullable: false,
      unique: true, 
    },
  },
});