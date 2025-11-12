"use strict";
import Joi from "joi";

export const authQueryValidation = Joi.object({
rut: Joi.string()
    .pattern(/^[0-9]+-[0-9kK]$/) 
    .required()
    .messages({
      "string.empty": "El RUT no puede estar vacío.",
      "string.pattern.base": "El RUT debe tener un formato válido (ej: 12345678-9).",
      "any.required": "El RUT es obligatorio."
    }),

  nombre: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "El nombre no puede estar vacío.",
      "string.min": "El nombre debe tener al menos {#limit} caracteres.",
      "string.max": "El nombre no puede exceder los {#limit} caracteres.",
      "any.required": "El nombre es obligatorio."
    }),

  primer_apellido: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "El primer apellido no puede estar vacío.",
      "string.min": "El primer apellido debe tener al menos {#limit} caracteres.",
      "string.max": "El primer apellido no puede exceder los {#limit} caracteres.",
      "any.required": "El primer apellido es obligatorio."
    }),

  segundo_apellido: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "El segundo apellido no puede estar vacío.",
      "string.min": "El segundo apellido debe tener al menos {#limit} caracteres.",
      "string.max": "El segundo apellido no puede exceder los {#limit} caracteres.",
      "any.required": "El segundo apellido es obligatorio."
    }),

  email: Joi.string()
    .email({ tlds: { allow: false } }) 
    .required()
    .messages({
      "string.empty": "El correo electrónico no puede estar vacío.",
      "string.email": "El correo electrónico debe tener un formato válido.",
      "any.required": "El correo electrónico es obligatorio."
    }),

  password: Joi.string()
    .min(6) 
    .max(100) 
    
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/) 
    .required()
    .messages({
      "string.empty": "La contraseña no puede estar vacía.",
      "string.min": "La contraseña debe tener al menos {#limit} caracteres.",
      "string.max": "La contraseña no puede exceder los {#limit} caracteres.",
      "string.pattern.base": "La contraseña debe contener al menos una mayúscula, una minúscula y un número.",
      "any.required": "La contraseña es obligatoria."
    }),

  cargo: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "El cargo no puede estar vacío.",
      "string.min": "El cargo debe tener al menos {#limit} caracteres.",
      "string.max": "El cargo no puede exceder los {#limit} caracteres.",
      "any.required": "El cargo es obligatorio."
    }),
})
.unknown(false) 
.messages({
  "object.unknown": "No se permiten campos adicionales."
});