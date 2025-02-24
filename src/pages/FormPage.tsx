import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { FormData, INITIAL_FORM_STATE } from '../types';
import { api } from '../api/api';
import { validateForm } from '../services/formValidator';

const FormPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );
  const [isTouched, setIsTouched] = useState<
    Partial<Record<keyof FormData, boolean>>
  >({});

  // Revalidate the form whenever formData changes
  React.useEffect(() => {
    if (Object.keys(isTouched).length > 0) {
      const newErrors = validateForm(formData);
      setErrors(newErrors);
    }
  }, [formData, isTouched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    setIsTouched(
      Object.keys(formData).reduce(
        (acc, key) => {
          acc[key as keyof FormData] = true;
          return acc;
        },
        {} as Record<keyof FormData, boolean>
      )
    );

    if (Object.keys(newErrors).length === 0) {
      try {
        const submissionData = {
          ...formData,
          submittedAt: new Date().toISOString(),
        };
        const response = await api.submitForm(submissionData);
        console.log('Form submitted:', response);
        navigate('/results');
      } catch (error) {
        console.error('Submission error:', error);
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, privacyConsent: checked }));
    setIsTouched((prev) => ({ ...prev, privacyConsent: true }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="h1">Document Submission Form</CardTitle>
        <CardDescription>
          Submit employee documentation for processing and compliance review
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Employee Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" id="firstNameLabel">
                  First Name
                </label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  tabIndex={0}
                  aria-labelledby="firstNameLabel"
                  aria-invalid={!!errors.firstName}
                />
                {isTouched.firstName && errors.firstName && (
                  <span className="text-red-500 text-sm" aria-live="polite">
                    {errors.firstName}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" id="lastNameLabel">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  aria-labelledby="lastNameLabel"
                  aria-invalid={!!errors.lastName}
                />
                {isTouched.lastName && errors.lastName && (
                  <span className="text-red-500 text-sm" aria-live="polite">
                    {errors.lastName}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="employeeId" id="employeeIdLabel">
                  Employee ID
                </label>
                <Input
                  id="employeeId"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  placeholder="ABC-12345"
                  aria-labelledby="employeeIdLabel"
                  aria-invalid={!!errors.employeeId}
                />
                {isTouched.employeeId && errors.employeeId && (
                  <span className="text-red-500 text-sm" aria-live="polite">
                    {errors.employeeId}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <label htmlFor="phoneNumber" id="phoneNumberLabel">
                  Phone Number
                </label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 555-5555"
                  aria-labelledby="phoneNumberLabel"
                  aria-invalid={!!errors.phoneNumber}
                />
                {isTouched.phoneNumber && errors.phoneNumber && (
                  <span className="text-red-500 text-sm" aria-live="polite">
                    {errors.phoneNumber}
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="salary" id="salaryLabel">
                  Annual Salary
                </label>
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder="Enter annual salary"
                  aria-labelledby="salaryLabel"
                  aria-invalid={!!errors.salary}
                />
                {isTouched.salary && errors.salary && (
                  <span className="text-red-500 text-sm" aria-live="polite">
                    {errors.salary}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="startDate" id="startDateLabel">
                  Start Date
                </label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  aria-labelledby="startDateLabel"
                  aria-invalid={!!errors.startDate}
                />
                {isTouched.startDate && errors.startDate && (
                  <span className="text-red-500 text-sm" aria-live="polite">
                    {errors.startDate}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="supervisorEmail" id="supervisorEmailLabel">
                  Supervisor Email
                </label>
                <Input
                  id="supervisorEmail"
                  name="supervisorEmail"
                  type="email"
                  value={formData.supervisorEmail}
                  onChange={handleInputChange}
                  placeholder="supervisor@the4d.ca"
                  aria-labelledby="supervisorEmailLabel"
                  aria-invalid={!!errors.supervisorEmail}
                />
                {isTouched.supervisorEmail && errors.supervisorEmail && (
                  <span className="text-red-500 text-sm" aria-live="polite">
                    {errors.supervisorEmail}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="costCenter" id="costCenterLabel">
                  Cost Center
                </label>
                <Input
                  id="costCenter"
                  name="costCenter"
                  value={formData.costCenter}
                  onChange={handleInputChange}
                  placeholder="CC-XXX-YYY"
                  aria-labelledby="costCenterLabel"
                  aria-invalid={!!errors.costCenter}
                />
                {isTouched.costCenter && errors.costCenter && (
                  <span className="text-red-500 text-sm" aria-live="polite">
                    {errors.costCenter}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="projectCode" id="projectCodeLabel">
                Project Code
              </label>
              <Input
                id="projectCode"
                name="projectCode"
                value={formData.projectCode}
                onChange={handleInputChange}
                placeholder="PRJ-2024-001"
                aria-labelledby="projectCodeLabel"
                aria-invalid={!!errors.projectCode}
              />
              {isTouched.projectCode && errors.projectCode && (
                <span className="text-red-500 text-sm" aria-live="polite">
                  {errors.projectCode}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="privacyConsent"
                checked={formData.privacyConsent}
                onCheckedChange={handleCheckboxChange}
                tabIndex={0}
                aria-labelledby="privacyConsentLabel"
                aria-invalid={!!errors.privacyConsent}
              />
              <label htmlFor="privacyConsent" id="privacyConsentLabel">
                I acknowledge that this document will be processed according to
                regional privacy policies and data protection regulations
              </label>
            </div>
            {isTouched.privacyConsent && errors.privacyConsent && (
              <span className="text-red-500 text-sm" aria-live="polite">
                {errors.privacyConsent}
              </span>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="border border-transparent hover:border-green-500"
              disabled={Object.keys(errors).length > 0}
              tabIndex={0}
            >
              Submit Document
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormPage;
