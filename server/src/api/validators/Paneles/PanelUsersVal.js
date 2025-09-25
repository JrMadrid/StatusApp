/* VALIDACIONES DE PANEL DE USUARIOS */
import Joi from 'joi';

// Campo común para ID
const id = Joi.string()
  .pattern(/^\d{1,5}$/)
  .required()
  .messages({
    'string.empty': 'El ID es obligatorio.',
    'string.pattern.base': 'El ID debe contener solo números.',
    'string.max': 'El ID debe tener como máximo 5 caracteres.',
  });

// --- Crear Usuario ---
export const SchemaCrearUsuario = Joi.object({
  nickname: Joi.string()
    .max(50)
    .required()
    .messages({
      'string.empty': 'El nombre del usuario es obligatorio.',
      'string.max': 'El nombre no debe tener más de 50 caracteres.',
    }),

  psw: Joi.string()
    .max(50)
    .required()
    .messages({
      'string.empty': 'La contraseña es obligatoria.',
      'string.max': 'La contraseña no debe tener más de 50 caracteres.',
    }),

  tipo: Joi.string()
    .valid('Geografia', 'Aplicativo', 'Administrador')
    .required()
    .messages({
      'any.only': 'El tipo de usuario debe ser Geografia, Aplicativo o Administrador.',
      'string.empty': 'El tipo de usuario es obligatorio.',
    }),
});

// --- Actualizar Usuario ---
export const SchemaActualizarUsuario = Joi.object({
  id, // requerido

  nickname: Joi.string()
    .max(50)
    .allow('')
    .messages({
      'string.max': 'El nombre no debe tener más de 50 caracteres.',
    }),

  psw: Joi.string()
    .max(50)
    .allow('')
    .messages({
      'string.max': 'La contraseña no debe tener más de 50 caracteres.',
    }),

  tipo: Joi.string()
    .valid('Geografia', 'Aplicativo', 'Administrador', '')
    .messages({
      'any.only': 'El tipo de usuario debe ser Geografia, Aplicativo, Administrador o estar vacío.',
    }),
});

// --- Eliminar Usuario ---
export const SchemaEliminarUsuario = Joi.object({
  id, // requerido
});