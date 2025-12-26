import { EntitySchema } from "typeorm";

export const Usuario = new EntitySchema({
  name: "Usuario",
  tableName: "usuarios",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment"
    },
    rut: {
      type: "varchar",
      length: 12,
      unique: true,
      format: "XXXXXXXX-X",
      nullable: false,
    },
    email: {
      type: "varchar",
      length: 100,
      unique: true,
      nullable: false,
    },
    password_hash: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    nombre_completo: {
      type: "varchar",
      length: 150
    },
    activo: {
      type: "boolean",
      default: true
    },
    created_at: {
      type: "timestamp",
      createDate: true
    },
    updated_at: {
      type: "timestamp",
      updateDate: true
    },
  },
  relations: {
    rol: {
      target: "Rol",
      type: "many-to-one",
      joinColumn: { name: "rol_id" },
      nullable: false,
      onDelete: "CASCADE",
    },
  },
});