import { EntitySchema } from "typeorm";

export const Electivo = new EntitySchema({
    name: "Electivo",
    tableName: "electivos",
    columns: {
        codigo: {
            primary: true,
            type: "int",
            unique: true,
            generated: "increment"
        },
        nombre: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        rut_docente: {
            type: "varchar",
            length: 12,
            nullable: false,
            foreignKey: {
                entity: "User",
                column: "rut",
            },
            format: "XXXXXXXX-X",
        },
        creditos: {
            type: "int",
            nullable: false,
        },
        semestre: {
            type: "varchar",
            length: 10,
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