import { EntitySchema } from "typeorm";

export const CupoPorCarrera = new EntitySchema({
  name: "CupoPorCarrera",
  tableName: "cupos_por_carrera",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment"
    },
    cantidad_reservada: {
      type: "int",
      nullable: false
    },
  },
  relations: {
    electivo: {
      target: "Electivo",
      type: "many-to-one",
      joinColumn: { name: "electivo_id" },
      onDelete: "CASCADE",
    },
    carrera: {
      target: "Carrera",
      type: "many-to-one",
      joinColumn: { name: "carrera_id" },
      onDelete: "CASCADE",
    },
  },
});

export const SolicitudInscripcion = new EntitySchema({
  name: "SolicitudInscripcion",
  tableName: "solicitudes_inscripcion",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: "increment"
    },
    prioridad: {
      type: "int",
      nullable: false
    },
    fecha_solicitud: {
      type: "timestamp",
      createDate: true
    },
    estado: {
      type: "enum",
      enum: ["PENDIENTE", "ACEPTADO", "RECHAZADO", "LISTA_ESPERA"],
      default: "PENDIENTE",
    },
  },
  relations: {
    alumno: {
      target: "Usuario",
      type: "many-to-one",
      joinColumn: { name: "alumno_id" },
      nullable: false,
      onDelete: "CASCADE",
    },
    electivo: {
      target: "Electivo",
      type: "many-to-one",
      joinColumn: { name: "electivo_id" },
      nullable: false,
      onDelete: "CASCADE",
    },
  },
});