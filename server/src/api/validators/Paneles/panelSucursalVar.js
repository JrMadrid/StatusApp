/* VALIDACIONES DE PANEL DE SUCURSALES */
import Joi from 'joi';

// Validación para el campo ID usado en actualizar y eliminar
const id = Joi.string()
  .pattern(/^\d{1,5}$/)
  .max(5)
  .required()
  .messages({
    'string.empty': 'El ID es obligatorio.',
    'string.pattern.base': 'El ID debe contener solo números.',
    'string.max': 'El ID debe tener como máximo 5 caracteres.',
  });

// --- Crear Sucursal ---
export const SchemaCrearSucursal = Joi.object({
  economico: Joi.string()
    .length(6)
    .pattern(/^\d+$/)
    .required()
    .messages({
      'string.empty': 'El número económico es obligatorio.',
      'string.length': 'El número económico debe tener exactamente 6 caracteres.',
      'string.pattern.base': 'El número económico debe contener solo números.',
    }),

  canal: Joi.string()
    .max(30)
    .required()
    .messages({
      'string.empty': 'El canal es obligatorio.',
      'string.max': 'El canal no debe tener más de 30 caracteres.',
    }),

  nombre: Joi.string()
    .max(50)
    .required()
    .messages({
      'string.empty': 'El nombre es obligatorio.',
      'string.max': 'El nombre no debe tener más de 50 caracteres.',
    }),

  ingresponsable: Joi.string()
    .max(50)
    .required()
    .messages({
      'string.empty': 'El nombre del ingeniero responsable es obligatorio.',
      'string.max': 'Máximo 50 caracteres para el ingeniero responsable.',
    }),

  rellenar: Joi.string()
    .valid('yes', 'no', '')
    .messages({
      'any.only': 'El valor de "rellenar" debe ser yes, no o vacío.',
    }),
});

// --- Actualizar Sucursal ---
export const SchemaActualizarSucursal = Joi.object({
  id, // requerido

  economico: Joi.string()
    .length(6)
    .pattern(/^\d+$/)
    .allow('')
    .messages({
      'string.length': 'El número económico debe tener exactamente 6 caracteres.',
      'string.pattern.base': 'El número económico debe contener solo números.',
    }),

  canal: Joi.string()
    .max(30)
    .allow('')
    .messages({
      'string.max': 'El canal no debe tener más de 30 caracteres.',
    }),

  nombre: Joi.string()
    .max(50)
    .allow('')
    .messages({
      'string.max': 'El nombre no debe tener más de 50 caracteres.',
    }),

  ingresponsable: Joi.string()
    .max(50)
    .allow('')
    .messages({
      'string.max': 'Máximo 50 caracteres para el ingeniero responsable.',
    }),

  rellenar: Joi.string()
    .valid('yes', 'no', '')
    .messages({
      'any.only': 'El valor de "rellenar" debe ser yes, no o vacío.',
    }),
});

// --- Eliminar Sucursal ---
export const SchemaEliminarSucursal = Joi.object({
  id, // requerido
});