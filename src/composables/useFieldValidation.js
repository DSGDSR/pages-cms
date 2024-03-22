import useSchema from '@/composables/useSchema';

const { sanitizeObject } = useSchema();

export default function useFieldValidation() {
  const validateRequired = (schema, value) => {
    let errors = [];
    if (schema.required && !sanitizeObject(value)) {
      errors.push('Este campo es obligatorio.');
    }
    return errors;
  };

  const validateListRange = (schema, value) => {
    let errors = [];
    const sanitizedValue = value.filter(entry => sanitizeObject(entry));
    if (schema.list?.min && sanitizedValue.length < schema.list.min) {
      errors.push(`Esta lista debe contener al menos ${schema.list.min} ${schema.list.min === 1 ? 'entrada' : 'entradas'}.`);
    }
    if (schema.list?.max && sanitizedValue.length > schema.list.max) {
      errors.push(`Esta lista debe contener como máximo ${schema.list.max} ${schema.list.max === 1 ? 'entrada' : 'entradas'}.`);
    }
    return errors;
  }

  const validatePattern = (schema, value) => {
    let errors = [];
    let regex, message;
    const pattern = schema.pattern;

    // `pattern` can be a string or an object
    if (typeof pattern === 'string') {
      regex = new RegExp(pattern);
      message = 'Este campo no cumple con el patrón requerido.';
    } else if (pattern && typeof pattern === 'object' && pattern.regex) {
      regex = new RegExp(pattern.regex);
      message = pattern.message || 'Este campo no cumple con el patrón requerido.';
    }

    if (regex && !regex.test(value)) {
      errors.push(message);
    }

    return errors;
  };

  const validateLength = (schema, value) => {
    let errors = [];
    if (schema.options?.minlength && value.length < schema.options.minlength) {
      errors.push(`Este campo debe contener al menos ${schema.options.minlength} ${schema.options.minlength === 1 ? 'caracter' : 'caracteres'}.`);
    }
    if (schema.options?.maxlength && value.length > schema.options.maxlength) {
      errors.push(`Este campo debe contener como máximo ${schema.options.maxlength} ${schema.options.maxlength === 1 ? 'caracter' : 'caracteres'}.`);
    }
    return errors;
  };

  const validateRange = (schema, value) => {
    let errors = [];
    if (schema.options?.min && value < schema.options.min) {
      errors.push(`Este campo debe tener un valor de al menos ${schema.options.min}.`);
    }
    if (schema.options?.max && value > schema.options.max) {
      errors.push(`Este campo debe tener un valor de ${schema.options.max} máximo.`);
    }
    return errors;
  };

  return { validateRequired, validateListRange, validatePattern, validateLength, validateRange };
}