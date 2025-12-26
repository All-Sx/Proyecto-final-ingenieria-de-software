import { EntitySchema } from "typeorm";

export const Alumno = new EntitySchema({
    name: "Alumno",
    tableName: "alumnos",
    columns: {
        usuario_id: {
            primary: true,
            type: "int",
        },
        anio_ingreso: {
            type: "int"
        },
        creditos_acumulados: {
            type: "int",
            default: 0
        },
        promedio_acumulado: {
            type: "decimal",
            precision: 3,
            scale: 1,
            nullable: true
        },
    },
    relations: {
        usuario: {
            target: "Usuario",
            type: "one-to-one",
            joinColumn: { name: "usuario_id" },
            onDelete: "CASCADE",
        },
        carrera: {
            target: "Carrera",
            type: "many-to-one",
            joinColumn: { name: "carrera_id" },
            nullable: false,
            onDelete: "CASCADE",
        },
    },
});