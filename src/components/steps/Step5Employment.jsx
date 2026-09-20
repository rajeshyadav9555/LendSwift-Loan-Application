import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step5Schema } from '../../schemas/step5Schema';
import { isEmploymentTypeAllowedForLoan } from '../../constants/loanTypes';
import Input from '../common/Input';
import Select from '../common/Select';
import CurrencyInput from '../common/CurrencyInput';
import RadioGroup from '../common/RadioGroup';
import StepNavigation from '../wizard/StepNavigation';

const types = [['salaried', 'Salaried'], ['self-employed-professional', 'Self-employed professional'], ['business-owner', 'Business owner']].map(([value, label]) => ({ value, label }));
const businessTypes = ['Retail', 'Services', 'Manufacturing', 'Professional Practice', 'Other'].map((v) => ({ value: v, label: v }));

export default function Step5Employment({
  formState, onNext, onBack, isFirstStep, isLastStep,
}) {
  const defaultType = formState.employmentType || (formState.loanType === 'business' ? 'business-owner' : 'salaried');
  const {
    control, register, handleSubmit, watch, formState: { errors },
  } = useForm({
    resolver: zodResolver(step5Schema),
    defaultValues: {
      employmentType: defaultType, employerName: formState.employerName, designation: formState.designation, monthlyIncome: formState.monthlyIncome, yearsExperience: formState.yearsExperience, businessName: formState.businessName, businessType: formState.businessType, annualTurnover: formState.annualTurnover, yearsInBusiness: formState.yearsInBusiness, gstNumber: formState.gstNumber, officeAddress: formState.officeAddress,
    },
  });
  const type = watch('employmentType');
  const allowed = types.filter((o) => (formState.loanType === 'business' ? isEmploymentTypeAllowedForLoan('business', o.value) : true));
  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <h2 id="step-heading" tabIndex={-1} className="text-xl font-semibold mb-1">Employment &amp; income</h2>
      <p className="text-sm text-gray-500 mb-6">Provide your employment or business information.</p>
      <Controller name="employmentType" control={control} render={({ field }) => <RadioGroup legend="Employment type" name="employmentType" options={allowed} value={field.value} onChange={field.onChange} error={errors.employmentType?.message} layout="vertical" />} />
      {type === 'salaried' && (
      <div className="space-y-4">
        <Input id="employerName" label="Employer name" required error={errors.employerName?.message} {...register('employerName')} />
        <Input id="designation" label="Designation" required error={errors.designation?.message} {...register('designation')} />
        <Controller name="monthlyIncome" control={control} render={({ field }) => <CurrencyInput id="monthlyIncome" label="Monthly income" required value={field.value} onChange={field.onChange} error={errors.monthlyIncome?.message} />} />
        <Input id="yearsExperience" label="Years of experience" required type="number" min="0" max="50" error={errors.yearsExperience?.message} {...register('yearsExperience', { valueAsNumber: true })} />
      </div>
      )}
      {type !== 'salaried' && (
      <div className="space-y-4">
        <Input id="businessName" label={type === 'self-employed-professional' ? 'Business/practice name' : 'Business name'} required error={errors.businessName?.message} {...register('businessName')} />
        <Select id="businessType" label="Business type" required placeholder="Select type" error={errors.businessType?.message} {...register('businessType')} options={businessTypes} />
        <Controller name="annualTurnover" control={control} render={({ field }) => <CurrencyInput id="annualTurnover" label="Annual turnover" required value={field.value} onChange={field.onChange} error={errors.annualTurnover?.message} />} />
        <Input id="yearsInBusiness" label="Years in business" required type="number" min="0" max="50" error={errors.yearsInBusiness?.message} {...register('yearsInBusiness', { valueAsNumber: true })} />
        {type === 'business-owner' && <Input id="gstNumber" label="GST number" required error={errors.gstNumber?.message} {...register('gstNumber')} />}
        <Controller name="monthlyIncome" control={control} render={({ field }) => <CurrencyInput id="monthlyIncome" label="Average monthly income" required value={field.value} onChange={field.onChange} error={errors.monthlyIncome?.message} />} />
        <Input id="officeAddress" label="Office/practice address" required error={errors.officeAddress?.message} {...register('officeAddress')} />
      </div>
      )}
      <StepNavigation onBack={onBack} onNext={handleSubmit(onNext)} isFirstStep={isFirstStep} isLastStep={isLastStep} />
    </form>
  );
}
