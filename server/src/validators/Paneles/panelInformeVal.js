/* VALIDACIONES DE PANEL DE INFORMES */
import Joi from 'joi'; // Joi es una biblioteca para la validación de datos en JavaScript, especialmente útil para validar objetos JSON y entradas de formularios.

/* Esquema de validación para agregar un informe */
const SchemaAgregarInforme = Joi.object({

  // Campo 'económico'
  economico: Joi.string() // Se trata como string porque llega desde el input
    .pattern(/^\d{6}$/) // Debe tener exactamente 6 dígitos
    .required()
    .messages({
      'string.empty': 'El número económico es obligatorio.',
      'string.pattern.base': 'El número económico debe tener exactamente 6 dígitos.'
    }),

  // Campo 'frealizada' (fecha realizada)
  frealizada: Joi.date() // Debe ser una fecha válida
    .required()
    .messages({
      'any.required': 'La fecha de realización es obligatoria.',
      'date.base': 'La fecha debe tener un formato válido.'
    }),

  // Campo 'nombre'
  nombre: Joi.string() // Cadena de texto
    .max(100) // Máximo 100 caracteres
    .allow('') // Opcional: puede enviarse vacío
    .messages({
      'string.max': 'El nombre del informe no puede superar los 100 caracteres.'
    }),

  // Campo 'descripcion'
  descripcion: Joi.string() // Cadena de texto
    .max(100) // Máximo 100 caracteres
    .allow('') // Opcional: puede enviarse vacío
    .messages({
      'string.max': 'La descripción no puede tener más de 100 caracteres.'
    })

});

export default SchemaAgregarInforme;