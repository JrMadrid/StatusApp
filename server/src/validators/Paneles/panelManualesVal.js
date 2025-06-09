/* VALIDACIONES DE PANEL DE MANUALES */
import Joi from 'joi';

// Esquema de validación para agregar un manual
const SchemaAgregarManual = Joi.object({
  // Nombre del manual (opcional, hasta 100 caracteres)
  nombre: Joi.string()
    .max(100)
    .allow('')
    .messages({
      'string.max': 'El nombre no debe superar los 100 caracteres.',
    }),

  // Nombre del documento del manual 
  documento: Joi.string()
    .max(100)
    .messages({
      'string.max': 'El nombre no debe superar los 100 caracteres.',
    }),

  // Descripción del manual (opcional, hasta 100 caracteres)
  descripcion: Joi.string()
    .max(100)
    .allow('')
    .messages({
      'string.max': 'La descripción no debe superar los 100 caracteres.',
    }),

  manual: Joi.any() // Solo para referencia
});

// Esquema para validar el formulario de actualización de manual
const schemaActualizarManual = Joi.object({
  // Campo obligatorio 'id'
  id: Joi.number() // Debe ser un número
    .integer() // Solo enteros
    .min(1) // Mínimo valor permitido: 1
    .required() // Campo obligatorio
    .messages({
      'any.required': 'El ID es obligatorio.',
      'number.base': 'El ID debe ser un número.',
      'number.min': 'El ID debe ser mayor que 0.'
    }),

  // Campo opcional: string de hasta 100 caracteres
  nombre: Joi.string()
    .max(100)
    .allow('', null) // permite cadena vacía o null
    .messages({
      'string.max': 'El nombre no debe exceder los 100 caracteres.'
    }),

  // Campo opcional: string de hasta 100 caracteres
  descripcion: Joi.string()
    .max(100)
    .allow('', null) // permite cadena vacía o null
    .messages({
      'string.max': 'La descripción no debe exceder los 100 caracteres.'
    })
});
// }).unknown(false); // Prohíbe campos no definidos en el esquema

/* Esquema de validación para eliminar un manual */
const SchemaEliminarManual = Joi.object({

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


export { SchemaAgregarManual, schemaActualizarManual, SchemaEliminarManual };