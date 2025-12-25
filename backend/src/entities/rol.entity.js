import { EntitySchema } from "typeorm";

export const Rol = new EntitySchema({
  name: "Rol",
  tableName: "roles", // Nombre de la tabla en la base de datos
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
      unique: true, // Para que no se repitan roles como "Profesor"
    },
  },
});