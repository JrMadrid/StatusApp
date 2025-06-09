/* VALIDACIONES DE PANEL DE MANTENIMIENTOS */
import Joi from 'joi';

// Esquema de validación para agregar una fecha estimada
const SchemaAgregarMantenimiento = Joi.object({
  // La fecha estimada es obligatoria y debe ser una fecha válida
  festimada: Joi.date()
    .required()
    .messages({
      'date.base': 'La fecha estimada debe ser una fecha válida.',
      'any.required': 'La fecha estimada es obligatoria.',
    }),

  // El número económico es obligatorio, debe ser una cadena de 6 caracteres numéricos exactos
  economico: Joi.string()
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      'string.empty': 'El número económico es obligatorio.',
      'string.pattern.base': 'El número económico debe tener exactamente 6 dígitos.',
      'any.required': 'El número económico es obligatorio.',
    })
});

/* Esquema de validación para eliminar un mantenimiento */
const SchemaEliminarMantenimiento = Joi.object({

  // Campo obligatorio 'id'
  id: Joi.number() // Debe ser un número
    .integer() // Solo enteros
    .min(1) // Mínimo: 1
    .required() // No puede faltar
    .messages({
      'any.required': 'El ID es obligatorio.',
      'number.base': 'El ID debe ser un número.',
      'number.min': 'El ID debe ser mayor a cero.',
      'number.integer': 'El ID debe ser un número entero.'
    })

});

export { SchemaAgregarMantenimiento, SchemaEliminarMantenimiento };