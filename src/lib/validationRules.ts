export const validationRules = {
  required: (value: string) => (!value.trim() ? 'This field is required' : ''),

  lettersOnly: (value: string) =>
    /^[A-Za-z\s]{2,50}$/.test(value)
      ? ''
      : 'Must contain only letters (2-50 characters)',

  email: (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.endsWith('@the4d.ca')
      ? ''
      : 'Must be a valid email with @the4d.ca domain',

  employeeId: (value: string) =>
    /^[A-Z]{3}-\d{5}$/.test(value) ? '' : 'Format: ABC-12345',

  phoneNumber: (value: string) =>
    /^\+1\s\(\d{3}\)\s\d{3}-\d{4}$/.test(value)
      ? ''
      : 'Format: +1 (555) 555-5555',

  salary: (value: string) =>
    /^\d+(\.\d{1,2})?$/.test(value) && Number(value) > 0
      ? ''
      : 'Salary must be a positive number',

  startDate: (value: string) =>
    !isNaN(Date.parse(value)) ? '' : 'Invalid date selection',

  costCenter: (value: string) =>
    /^[A-Z]{2}-\d{3}-[A-Z]{3}$/.test(value) ? '' : 'Format: AB-123-ABC',

  projectCode: (value: string) =>
    /^PRJ-\d{4}-\d{3}$/.test(value) ? '' : 'Format: PRJ-YEAR-001',

  privacyConsent: (value: boolean) =>
    value ? '' : 'You must agree to the privacy policy',
};
