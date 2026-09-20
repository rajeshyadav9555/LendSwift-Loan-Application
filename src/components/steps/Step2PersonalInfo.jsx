import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step2Schema } from '../../schemas/step2Schema';
import Input from '../common/Input';
import Select from '../common/Select';
import StepNavigation from '../wizard/StepNavigation';

const genderOptions = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }];
const maritalOptions = ['single', 'married', 'divorced', 'widowed'].map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) }));

export default function Step2PersonalInfo({
  formState, onNext, onBack, isFirstStep, isLastStep,
}) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      fullName: formState.fullName, dob: formState.dob, gender: formState.gender, maritalStatus: formState.maritalStatus, fatherName: formState.fatherName, motherName: formState.motherName, email: formState.email, mobile: formState.mobile, alternateMobile: formState.alternateMobile,
    },
  });
  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <h2 id="step-heading" tabIndex={-1} className="text-xl font-semibold mb-1">Personal information</h2>
      <p className="text-sm text-gray-500 mb-6">Tell us about the primary applicant.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input id="fullName" label="Full name" required error={errors.fullName?.message} {...register('fullName')} />
        <Input id="dob" label="Date of birth" required type="date" error={errors.dob?.message} {...register('dob')} />
        <Select id="gender" label="Gender" required placeholder="Select gender" error={errors.gender?.message} {...register('gender')} options={genderOptions} />
        <Select id="maritalStatus" label="Marital status" required placeholder="Select status" error={errors.maritalStatus?.message} {...register('maritalStatus')} options={maritalOptions} />
        <Input id="fatherName" label="Father's full name" required error={errors.fatherName?.message} {...register('fatherName')} />
        <Input id="motherName" label="Mother's full name" required error={errors.motherName?.message} {...register('motherName')} />
        <Input id="email" label="Email" required type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Input id="mobile" label="Mobile number" required inputMode="numeric" maxLength={10} error={errors.mobile?.message} {...register('mobile')} />
        <Input id="alternateMobile" label="Alternate mobile" inputMode="numeric" maxLength={10} error={errors.alternateMobile?.message} {...register('alternateMobile')} />
      </div>
      <StepNavigation onBack={onBack} onNext={handleSubmit(onNext)} isFirstStep={isFirstStep} isLastStep={isLastStep} />
    </form>
  );
}
