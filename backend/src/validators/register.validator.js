import Joi from "joi";

export const registerValidation = Joi.object({
    rut: Joi.string()
        .pattern(/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/)
        .required()
        .messages({
            "string.pattern.base": "El RUT debe tener formato XX.XXX.XXX-X.",
            "string.empty": "El RUT es obligatorio.",
            "any.required": "El RUT es obligatorio."
        }),

    nombre_completo: Joi.string()
        .min(5)
        .required()
        .messages({
            "string.empty": "El nombre completo es obligatorio.",
            "string.min": "El nombre completo es demasiado corto.",
            "any.required": "El nombre completo es obligatorio."
        }),

    email: Joi.string()
        .pattern(
            /^([a-z]+)\.([a-z]+)(\d{2})0([12])@alumnos\.ubiobio\.cl$/
        )
        .required()
        .messages({
            "string.pattern.base":
                "El correo debe ser institucional (alumnos.ubiobio.cl).",
            "string.empty": "El correo es obligatorio.",
            "any.required": "El correo es obligatorio."
        }),

    password: Joi.string()
        .min(8)
        .max(100)
        .pattern(/^[a-zA-Z0-9]+$/)
        .required()
        .messages({
            "string.empty": "La contraseña no puede estar vacía.",
            "any.required": "La contraseña es obligatoria.",
            "string.base": "La contraseña solo puede contener letras y números.",
            "string.min": "La contraseña debe tener al menos {8} caracteres.",
            "string.max": "La contraseña no puede exceder los {100} caracteres.",
            "string.pattern.base": "La contraseña solo puede contener letras y números.",
        })
}).unknown(false);