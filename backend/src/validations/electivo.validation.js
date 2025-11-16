import Joi from "joi";

export const electivoBodyValidation = Joi.object({
nombre: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            "string.empty": "El nombre no puede estar vacío.",
            "any.required": "El nombre es obligatorio."
        }),
descripcion: Joi.string()
        .max(500)
        .allow(null, '')
        .optional(),

docente: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            "any.required": "Debes especificar el docente."
        }),

cantidad_alumnos: Joi.number()
        .integer()
        .min(0)
        .required(),
semestre: Joi.string()
        .required(),
}).unknown(false).messages({
    "object.unknown": "No se permiten campos adicionales."
});