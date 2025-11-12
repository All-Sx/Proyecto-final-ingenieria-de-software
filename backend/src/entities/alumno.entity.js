import { EntitySchema } from "typeorm";

export const Alumno = new EntitySchema({
    name: "Alumno",
    tableName: "alumnos",
    columns: {
        rut: {
            primary: true,
            type: "varchar",
            length: 12,
            unique: true,
            nullable: false,
            format: "XXXXXXXX-X",
            foreignKey: {
                entity: "User",
                column: "rut",
            },
        },
        carrera: {
            type: "varchar",
            length: 255,
            nullable: false,
            foreignKey: {
                entity: "Carrera",
                column: "codigo",
            },
        },
        ingreso: {
            type: "int",
            nullable: false,
            default: Date.now().getFullYear(),
        },
        creditos_aprovados: {
            type: "int",
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