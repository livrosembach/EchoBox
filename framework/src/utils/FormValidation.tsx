// Utility functions for form validation

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export type ValidationRule = {
  test: (value: any, formData?: Record<string, any>) => boolean;
  message: string;
};

export type FieldValidation = {
  [field: string]: ValidationRule[];
};

/**
 * Validates form data against a set of validation rules
 * @param formData The form data to validate
 * @param validationRules The validation rules to apply
 * @returns Validation result with isValid flag and any errors
 */
export const validateForm = (
  formData: Record<string, any>,
  validationRules: FieldValidation
): ValidationResult => {
  const errors: ValidationError[] = [];

  // Check each field against its validation rules
  Object.keys(validationRules).forEach(field => {
    const fieldValue = formData[field];
    const rules = validationRules[field];

    // Apply each rule to the field
    rules.forEach(rule => {
      if (!rule.test(fieldValue)) {
        errors.push({
          field,
          message: rule.message
        });
      }
    });
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Common validation rules
export const required = (message = 'Este campo é obrigatório') => ({
  test: (value: any) => value !== undefined && value !== null && value.toString().trim() !== '',
  message
});

export const minLength = (min: number, message = `Deve ter pelo menos ${min} caracteres`) => ({
  test: (value: string) => !!value && value.length >= min,
  message
});

export const maxLength = (max: number, message = `Deve ter no máximo ${max} caracteres`) => ({
  test: (value: string) => !value || value.length <= max,
  message
});

export const pattern = (regex: RegExp, message = 'Formato inválido') => ({
  test: (value: string) => !value || regex.test(value),
  message
});

export const hexColor = (message = 'Deve ser um código de cor hexadecimal válido (#RRGGBB)') => ({
  test: (value: string) => !value || /^#([A-Fa-f0-9]{6})$/.test(value),
  message
});

export const email = (message = 'Email inválido') => ({
  test: (value: string) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  message
});

export const numeric = (message = 'Deve conter apenas números') => ({
  test: (value: string) => !value || /^\d+$/.test(value),
  message
});

export const matchesField = (
  field: string,
  fieldName: string,
  message = `Deve corresponder ao campo ${fieldName}`
) => ({
  test: (value: string, formData: Record<string, any>) => value === formData[field],
  message
});

export const getFirstErrorByField = (
  validationResult: ValidationResult,
  field: string
): string | null => {
  const error = validationResult.errors.find(err => err.field === field);
  return error ? error.message : null;
};
