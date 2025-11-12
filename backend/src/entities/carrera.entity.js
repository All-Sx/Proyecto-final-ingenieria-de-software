import { EntitySchema } from "typeorm";

export const Carrera = new EntitySchema({
    name: "Carrera",
    tableName: "carreras",
    columns: {
        codigo: {
            primary: true,
            type: "varchar",
            length: 10,
            unique: true,
            nullable: false,
        },
        nombre: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        duracion: {
            type: "int",
            nullable: false,
        },
        titulo: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        create_at: {
            type: "timestamp",
            createDate: true,
            nullable: false,
        },
        update_at: {
            type: "timestamp",
            updateDate: true,
            nullable: false,
        },
    },
});