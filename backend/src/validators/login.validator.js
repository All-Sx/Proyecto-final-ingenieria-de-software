import Joi from "joi";

export const loginValidation = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.empty": "El email es obligatorio.",
            "string.email": "Formato de email inválido.",
            "any.required": "El email es obligatorio."
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