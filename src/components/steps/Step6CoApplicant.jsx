import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step6Schema } from '../../schemas/step6Schema';
import { isCoApplicantStepRequired } from '../../constants/loanTypes';
import Input from '../common/Input';
import Select from '../common/Select';
import CurrencyInput from '../common/CurrencyInput';
import Checkbox from '../common/Checkbox';
import StepNavigation from '../wizard/StepNavigation';

const relationshipOptions = ['spouse', 'parent', 'sibling', 'business-partner'].map((v) => ({ value: v, label: v.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) }));

export default function Step6CoApplicant({
  formState, onNext, onBack, isFirstStep, isLastStep,
}) {
  const required = isCoApplicantStepRequired(formState.loanType, formState.loanAmount);
  const {
    register, control, handleSubmit, formState: { errors },
  } = useForm({
    resolver: zodResolver(step6Schema),
    defaultValues: {
      coApplicantRequired: required || formState.coApplicantRequired, coApplicantName: formState.coApplicantName, relationship: formState.relationship, coApplicantPan: formState.coApplicantPan, coApplicantIncome: formState.coApplicantIncome, coApplicantConsent: formState.coApplicantConsent,
    },
  });
  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <h2 id="step-heading" tabIndex={-1} className="text-xl font-semibold mb-1">Co-applicant</h2>
      <p className="text-sm text-gray-500 mb-6">{required ? 'A co-applicant is required for this application.' : 'Add a co-applicant if you want to.'}</p>
      <Controller name="coApplicantRequired" control={control} render={({ field }) => <Checkbox id="coApplicantRequired" label="I want to include a co-applicant." checked={field.value} onChange={field.onChange} error={errors.coApplicantRequired?.message} />} />
      <div className="mt-4 space-y-4">
        <Input id="coApplicantName" label="Co-applicant name" required={required} error={errors.coApplicantName?.message} {...register('coApplicantName')} />
        <Select id="relationship" label="Relationship" required={required} placeholder="Select relationship" error={errors.relationship?.message} {...register('relationship')} options={relationshipOptions} />
        <Input id="coApplicantPan" label="Co-applicant PAN" required={required} error={errors.coApplicantPan?.message} {...register('coApplicantPan')} />
        <Controller name="coApplicantIncome" control={control} render={({ field }) => <CurrencyInput id="coApplicantIncome" label="Co-applicant monthly income" required={required} value={field.value} onChange={field.onChange} error={errors.coApplicantIncome?.message} />} />
        <Controller name="coApplicantConsent" control={control} render={({ field }) => <Checkbox id="coApplicantConsent" label="Co-applicant has consented to this application." checked={field.value} onChange={field.onChange} error={errors.coApplicantConsent?.message} />} />
      </div>
      <StepNavigation onBack={onBack} onNext={handleSubmit(onNext)} isFirstStep={isFirstStep} isLastStep={isLastStep} />
    </form>
  );
}
