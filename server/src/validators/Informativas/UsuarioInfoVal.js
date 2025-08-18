/* VALIDACIONES DE PAGINA INFORMATIVA DE USUARIOS */
import Joi from "joi";

// Esquema general para un usuario
export const userSchema = Joi.object({
  id: Joi.number() // Debe ser un número
    .integer() // Solo enteros
    .min(1) // Mínimo valor permitido: 1
    .required() // Campo obligatorio
    .messages({
      'any.required': 'El ID es obligatorio.',
      'number.base': 'El ID debe ser un número.',
      'number.min': 'El ID debe ser mayor que 0.'
    }),

  cedula: Joi.string()
    .pattern(/^\d{4}-\d{4}-\d{5}$/)
    .max(15)
    .messages({
      "string.pattern.base": "La cédula debe tener el formato ####-####-#####.",
      "string.max": "La cédula no puede exceder los 15 caracteres."
    }),

  localidad: Joi.string()
    .max(100)
    .messages({
      "string.max": "La localidad no puede exceder los 100 caracteres."
    }),

  fecha_nacimiento: Joi.date()
    .iso()
    .less("now")
    .messages({
      "date.base": "La fecha de nacimiento debe ser válida.",
      "date.format": "La fecha de nacimiento debe estar en formato ISO (YYYY-MM-DD).",
      "date.less": "La fecha de nacimiento no puede ser futura."
    }),

  sexo: Joi.string()
    .valid("M", "F")
    .messages({
      "any.only": "El sexo debe ser 'M' (Masculino) o 'F' (Femenino)."
    }),

  fecha_contratacion: Joi.date()
    .iso()
    .less("now")
    .messages({
      "date.base": "La fecha de contratación debe ser válida.",
      "date.format": "La fecha de contratación debe estar en formato ISO (YYYY-MM-DD).",
      "date.less": "La fecha de contratación no puede ser futura."
    }),

  descripcion: Joi.string()
    .max(3000)
    .messages({
      "string.max": "La descripción no puede exceder los 3000 caracteres."
    }),

  grado_academico: Joi.string()
    .max(100)
    // .allow('', null)
    .messages({
      "string.max": "El grado académico no puede exceder los 100 caracteres."
    }),

  puesto: Joi.string()
    .max(100)
    .messages({
      "string.max": "El puesto no puede exceder los 100 caracteres."
    }),

  activo: Joi.boolean()
    .messages({
      "boolean.base": "El campo activo debe ser verdadero o falso."
    }),

  nombre: Joi.string()
    .max(200)
    .messages({
      "string.max": "El nombre no puede exceder los 200 caracteres."
    }),

  telefono: Joi.string()
    .max(20)
    .messages({
      "string.max": "El teléfono no puede exceder los 20 caracteres."
    }),
});