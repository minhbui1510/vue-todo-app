// composables/useFormValidation.ts
import { reactive, ref, watch } from 'vue';

type Rule = (value: any) => string | true;

type FormValidationOptions<T> = {
  form: T;
  rules: { [K in keyof T]?: Rule[] };
  validateOn?: 'change' | 'blur' | 'submit'; // mặc định: change
};

export function useFormValidation<T extends Record<string, any>>(
  options: FormValidationOptions<T>
) {
  const { form, rules, validateOn = 'change' } = options;

  const errors = reactive<{ [K in keyof T]?: string }>({});
  const touched = reactive<{ [K in keyof T]?: boolean }>({});
  const isValid = ref(true);

  const validateField = (key: keyof T) => {
    touched[key] = true;
    errors[key] = '';

    const value = form[key];
    const fieldRules = rules[key] || [];
    for (const rule of fieldRules) {
      const result = rule(value);
      if (result !== true) {
        errors[key] = result;
        break;
      }
    }

    return !errors[key];
  };

  const validateAll = () => {
    isValid.value = true;
    for (const key in rules) {
      const valid = validateField(key);
      if (!valid) isValid.value = false;
    }
    return isValid.value;
  };

  const resetErrors = () => {
    for (const key in errors) errors[key] = '';
    for (const key in touched) touched[key] = false;
    isValid.value = true;
  };

  // Auto validate nếu bật validateOn: 'change'
  if (validateOn === 'change') {
    watch(
      () => ({ ...form }),
      () => {
        validateAll();
      },
      { deep: true }
    );
  }

  return {
    errors,
    touched,
    isValid,
    validate: validateAll,
    validateField,
    resetErrors
  };
}
