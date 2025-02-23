import { validationRules } from '../lib/validationRules';
import { FormData } from '../types';

type ValidationResult = Partial<Record<keyof FormData, string>>;

export const validateForm = (formData: FormData): ValidationResult => {
  const errors: ValidationResult = {};

  errors.firstName =
    validationRules.required(formData.firstName) ||
    validationRules.lettersOnly(formData.firstName);
  errors.lastName =
    validationRules.required(formData.lastName) ||
    validationRules.lettersOnly(formData.lastName);
  errors.supervisorEmail =
    validationRules.required(formData.supervisorEmail) ||
    validationRules.email(formData.supervisorEmail);
  errors.employeeId =
    validationRules.required(formData.employeeId) ||
    validationRules.employeeId(formData.employeeId);
  errors.phoneNumber =
    validationRules.required(formData.phoneNumber) ||
    validationRules.phoneNumber(formData.phoneNumber);
  errors.salary =
    validationRules.required(String(formData.salary)) ||
    validationRules.salary(String(formData.salary));
  errors.startDate =
    validationRules.required(formData.startDate) ||
    validationRules.startDate(formData.startDate);
  errors.costCenter =
    validationRules.required(formData.costCenter) ||
    validationRules.costCenter(formData.costCenter);
  errors.projectCode =
    validationRules.required(formData.projectCode) ||
    validationRules.projectCode(formData.projectCode);

  errors.privacyConsent = validationRules.privacyConsent(
    formData.privacyConsent
  );

  Object.keys(errors).forEach((key) => {
    if (!errors[key as keyof FormData]) {
      delete errors[key as keyof FormData];
    }
  });

  return errors;
};
