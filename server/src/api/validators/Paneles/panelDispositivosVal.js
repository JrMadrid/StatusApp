/* VALIDACIONES DE PANEL DE DISPOSITIVOS */
import Joi from 'joi'; // Joi es una biblioteca para la validación de datos en JavaScript, especialmente útil para validar objetos JSON y entradas de formularios.

/* Esquema de validación para agregar un dispositivo */
const SchemaCrearDispositivo = Joi.object({

  // Campo 'nombre' del dispositivo
  nombre: Joi.string() // Debe ser una cadena de texto
    .max(75) // Longitud máxima: 75 caracteres
    .required() // Campo obligatorio
    .messages({ // Mensajes de error personalizados
      'string.empty': 'El nombre del dispositivo es obligatorio.',
      'string.max': 'El nombre del dispositivo no puede superar los 75 caracteres.'
    }),

  // Campo 'ip' del dispositivo
  ip: Joi.string() // Debe ser un string (como llega del input)
    .pattern(/^(000|001|((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)))\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/) // Expresión regular para validar una dirección IPv4
    // .ip({ version: ['ipv4'], cidr: 'forbidden' }) // Debe ser una IP IPv4 válida, sin notación CIDR (/24, etc.)
    .required() // Campo obligatorio
    .messages({
      'string.empty': 'La IP es obligatoria.',
      // 'string.ip': 'La IP debe ser una dirección IPv4 válida.',
      'any.invalid': 'La IP no es válida.',
      'string.pattern.base': 'La IP debe ser válida o una IP especial que empiece con 000. o 001.',
    }),

  // Campo 'económico'
  economico: Joi.string() // Lo tratamos como string aunque sea numérico, porque llega como texto
    .pattern(/^\d{6}$/) // Debe coincidir con exactamente 6 dígitos numéricos
    .required() // Campo obligatorio
    .messages({
      'string.empty': 'El número económico es obligatorio.',
      'string.pattern.base': 'El número económico debe tener exactamente 6 dígitos.'
    }),

  // Campo 'descripción'
  descripcion: Joi.string() // Cadena de texto
    .max(100) // Hasta 100 caracteres
    .allow('') // Permite que el campo se envíe vacío (opcional)
    .messages({
      'string.max': 'La descripción no puede tener más de 100 caracteres.'
    }),

  // Campo 'general'
  general: Joi.string() // Cadena de texto
    .max(8000) // Hasta 8000 caracteres
    .allow('') // También es opcional, se puede enviar vacío
    .messages({
      'string.max': 'El campo general no puede tener más de 8000 caracteres.'
    })
});

/* Esquema de validación para actualizar un dispositivo */
const SchemaActualizarDispositivo = Joi.object({

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

  // Campo 'nombre' del dispositivo
  nombre: Joi.string() // Debe ser una cadena de texto
    .max(75) // Longitud máxima: 75 caracteres
    .allow('') // Campo opcional, se permite vacío
    .messages({
      'string.max': 'El nombre no puede superar los 75 caracteres.'
    }),

  // Campo 'ip' del dispositivo
  ip: Joi.string() // Debe ser un string (como llega del input)
    .pattern(/^(000|001|((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)))\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/) // Expresión regular para IPv4 válida o IP especial que inicia con 000. o 001.
    .allow('') // Campo opcional, se permite vacío
    .messages({
      'string.pattern.base': 'La IP debe ser válida o una IP especial que empiece con 000. o 001.'
    }),

  // Campo 'económico'
  economico: Joi.string() // Lo tratamos como string aunque sea numérico, porque llega como texto
    .pattern(/^\d{6}$/) // Debe tener exactamente 6 dígitos
    .allow('') // Campo opcional, se permite vacío
    .messages({
      'string.pattern.base': 'El número económico debe tener exactamente 6 dígitos.'
    }),

  // Campo 'descripción'
  descripcion: Joi.string() // Cadena de texto
    .max(100) // Hasta 100 caracteres
    .allow('') // Se permite vacío
    .messages({
      'string.max': 'La descripción no puede tener más de 100 caracteres.'
    }),

  // Campo 'general'
  general: Joi.string() // Cadena de texto
    .max(8000) // Hasta 8000 caracteres
    .allow('') // Se permite vacío
    .messages({
      'string.max': 'El campo general no puede tener más de 8000 caracteres.'
    }),

  // Campo 'reiniciar'
  reiniciar: Joi.string() // Cadena de texto
    .valid('', 'yes', 'no') // Solo se permiten estos valores: vacío, "yes", "no"
    .messages({
      'any.only': 'El campo reiniciar debe ser "yes", "no" o vacío.'
    })

});

/* Esquema de validación para eliminar un dispositivo */
const SchemaEliminarDispositivo = Joi.object({

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

export { SchemaCrearDispositivo, SchemaActualizarDispositivo, SchemaEliminarDispositivo }; 