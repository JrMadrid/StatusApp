/* VALIDACIONES DE LA INFORMACIÓN DE LOS MANTENIMIENTOS */
import Joi from 'joi';

// Esquema de validación para agregar una constancia de mantenimiento
const SchemaAgregarConstanciaMantenimiento = Joi.object({
  // Fecha en la que se realizó el mantenimiento, obligatoria y debe ser válida
  frealizada: Joi.date()
    .required()
    .messages({
      'date.base': 'La fecha realizada debe ser una fecha válida.',
      'any.required': 'La fecha realizada es obligatoria.',
    }),

  // ID del dispositivo al que se le realizó mantenimiento, entre 1 y 5 dígitos
  id: Joi.string()
    .pattern(/^\d{1,5}$/)
    .required()
    .messages({
      'string.empty': 'El ID es obligatorio.',
      'string.pattern.base': 'El ID debe contener entre 1 y 5 dígitos numéricos.',
      'any.required': 'El ID es obligatorio.',
    }),

  // Descripción opcional del mantenimiento, hasta 8000 caracteres
  descripcion: Joi.string()
    .max(8000)
    .allow('')
    .messages({
      'string.max': 'La descripción no debe exceder los 8000 caracteres.',
    }),

});

export { SchemaAgregarConstanciaMantenimiento };