import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step4Schema } from '../../schemas/step4Schema';
import Input from '../common/Input';
import Select from '../common/Select';
import CurrencyInput from '../common/CurrencyInput';
import Checkbox from '../common/Checkbox';
import StepNavigation from '../wizard/StepNavigation';
import { usePinCodeLookup } from '../../hooks/usePinCodeLookup';

const residenceOptions = [['owned', 'Owned'], ['rented', 'Rented'], ['company-provided', 'Company provided'], ['family-owned', 'Family owned']].map(([value, label]) => ({ value, label }));

export default function Step4Address({
  formState, onNext, onBack, isFirstStep, isLastStep,
}) {
  const {
    register, control, handleSubmit, watch, setValue, formState: { errors },
  } = useForm({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      addressLine1: formState.addressLine1, addressLine2: formState.addressLine2, pincode: formState.pincode, city: formState.city, state: formState.state, residenceType: formState.residenceType, rentAmount: formState.rentAmount, yearsAtAddress: formState.yearsAtAddress, sameAsPermanent: formState.sameAsPermanent, permanentAddressLine1: formState.permanentAddressLine1, permanentPincode: formState.permanentPincode, permanentCity: formState.permanentCity, permanentState: formState.permanentState,
    },
  });
  const pincode = watch('pincode'); const same = watch('sameAsPermanent'); const
    residence = watch('residenceType');
  const lookup = usePinCodeLookup(pincode);
  useEffect(() => { if (lookup.city) { setValue('city', lookup.city); setValue('state', lookup.state); } }, [lookup.city, lookup.state, setValue]);
  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <h2 id="step-heading" tabIndex={-1} className="text-xl font-semibold mb-1">Current address</h2>
      <p className="text-sm text-gray-500 mb-6">Enter your residential address.</p>
      <div className="space-y-4">
        <Input id="addressLine1" label="Address line 1" required error={errors.addressLine1?.message} {...register('addressLine1')} />
        <Input id="addressLine2" label="Address line 2" error={errors.addressLine2?.message} {...register('addressLine2')} />
        <div className="grid sm:grid-cols-3 gap-4">
          <Input id="pincode" label="PIN code" required maxLength={6} inputMode="numeric" error={errors.pincode?.message} {...register('pincode')} />
          <Input id="city" label="City" required error={errors.city?.message} {...register('city')} />
          <Input id="state" label="State" required error={errors.state?.message} {...register('state')} />
        </div>
        {lookup.isLoading && <p className="text-xs text-gray-500">Looking up PIN…</p>}
        {lookup.error && <p className="text-xs text-warning">{lookup.error}</p>}
        <Select id="residenceType" label="Residence type" required placeholder="Select residence type" error={errors.residenceType?.message} {...register('residenceType')} options={residenceOptions} />
        {residence === 'rented' && <Controller name="rentAmount" control={control} render={({ field }) => <CurrencyInput id="rentAmount" label="Monthly rent" required value={field.value} onChange={field.onChange} error={errors.rentAmount?.message} />} />}
        <Input id="yearsAtAddress" label="Years at current address" required type="number" min="0" max="50" error={errors.yearsAtAddress?.message} {...register('yearsAtAddress', { valueAsNumber: true })} />
        <Controller name="sameAsPermanent" control={control} render={({ field }) => <Checkbox id="sameAsPermanent" label="Permanent address is the same as current address." checked={field.value} onChange={field.onChange} error={errors.sameAsPermanent?.message} />} />
        {!same && (
        <div className="border-t pt-4 space-y-4">
          <Input id="permanentAddressLine1" label="Permanent address" required error={errors.permanentAddressLine1?.message} {...register('permanentAddressLine1')} />
          <div className="grid sm:grid-cols-3 gap-4">
            <Input id="permanentPincode" label="Permanent PIN code" required error={errors.permanentPincode?.message} {...register('permanentPincode')} />
            <Input id="permanentCity" label="Permanent city" error={errors.permanentCity?.message} {...register('permanentCity')} />
            <Input id="permanentState" label="Permanent state" error={errors.permanentState?.message} {...register('permanentState')} />
          </div>
        </div>
        )}
      </div>
      <StepNavigation onBack={onBack} onNext={handleSubmit(onNext)} isFirstStep={isFirstStep} isLastStep={isLastStep} />
    </form>
  );
}
