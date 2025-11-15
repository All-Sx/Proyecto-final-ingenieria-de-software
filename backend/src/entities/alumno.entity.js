import { EntitySchema } from "typeorm";

export const Alumno = new EntitySchema({
    name: "Alumno",
    tableName: "alumnos",
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
        carrera: {
            type: "varchar",
            length: 255,
            nullable: false,

        },
        creditos_aprovados: {
            type: "int",
            default: 0,
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