/* VALIDACIONES DE PANEL DE DISPOSITIVOS */
import Joi from 'joi'; // Joi es una biblioteca para la validación de datos en JavaScript, especialmente útil para validar objetos JSON y entradas de formularios.

/* Esquema de validación para agregar un dispositivo */
const SchemaCrearDispositivo = Joi.object({

  // Campo 'nombre' del dispositivo
  nombre: Joi.string()                  // Debe ser una cadena de texto
    .max(75)                            // Longitud máxima: 75 caracteres
    .required()                         // Campo obligatorio
    .messages({                         // Mensajes de error personalizados
      'string.empty': 'El nombre del dispositivo es obligatorio.',
      'string.max': 'El nombre del dispositivo no puede superar los 75 caracteres.'
    }),

  // Campo 'ip' del dispositivo
  ip: Joi.string()                      // Debe ser un string (como llega del input)
    .pattern(/^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.|$)){4}$/)    // Expresión regular para validar una dirección IPv4
    // .ip({ version: ['ipv4'], cidr: 'forbidden' }) // Debe ser una IP IPv4 válida, sin notación CIDR (/24, etc.)
    .required()                         // Campo obligatorio
    .messages({
      'string.empty': 'La IP es obligatoria.',
      // 'string.ip': 'La IP debe ser una dirección IPv4 válida.',
      'any.invalid': 'La IP no es válida.',
      'string.pattern.base': 'La IP no tiene un formato correcto.'
    }),

  // Campo 'económico'
  economico: Joi.string()              // Lo tratamos como string aunque sea numérico, porque llega como texto
    .pattern(/^\d{6}$/)                // Debe coincidir con exactamente 6 dígitos numéricos
    .required()                        // Campo obligatorio
    .messages({
      'string.empty': 'El número económico es obligatorio.',
      'string.pattern.base': 'El número económico debe tener exactamente 6 dígitos.'
    }),

  // Campo 'descripción'
  descripcion: Joi.string()           // Cadena de texto
    .max(100)                         // Hasta 100 caracteres
    .allow('')                        // Permite que el campo se envíe vacío (opcional)
    .messages({
      'string.max': 'La descripción no puede tener más de 100 caracteres.'
    }),

  // Campo 'general'
  general: Joi.string()               // Cadena de texto
    .max(8000)                        // Hasta 8000 caracteres
    .allow('')                        // También es opcional, se puede enviar vacío
    .messages({
      'string.max': 'El campo general no puede tener más de 8000 caracteres.'
    })
});

export { SchemaCrearDispositivo }; 