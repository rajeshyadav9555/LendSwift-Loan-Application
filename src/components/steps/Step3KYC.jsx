import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { buildStep3Schema } from '../../schemas/step3Schema';
import MaskedInput from '../common/MaskedInput';
import Input from '../common/Input';
import Checkbox from '../common/Checkbox';
import StepNavigation from '../wizard/StepNavigation';
import { useVerification } from '../../hooks/useVerification';

export default function Step3KYC({formState,onNext,onBack,isFirstStep,isLastStep}) {
  const schema=buildStep3Schema(formState.loanType);
  const {control,register,handleSubmit,watch,setValue,formState:{errors}}=useForm({
    resolver:zodResolver(schema),
    defaultValues:{pan:formState.pan,aadhaar:formState.aadhaar,aadhaarConsent:formState.aadhaarConsent,voterId:formState.voterId,passport:formState.passport}
  });
  const pan=watch('pan'), aadhaar=watch('aadhaar');
  const panVerify=useVerification('pan',formState.loanType), aadhaarVerify=useVerification('aadhaar');
  useEffect(()=>{ if(panVerify.isVerified) setValue('pan',pan.toUpperCase()); },[panVerify.isVerified,pan,setValue]);
  return <form onSubmit={handleSubmit(onNext)} noValidate>
    <h2 id="step-heading" tabIndex={-1} className="text-xl font-semibold mb-1">Identity verification</h2>
    <p className="text-sm text-gray-500 mb-6">Enter your identity details. Verification here is simulated for this demo.</p>
    <div className="space-y-4">
      <Controller name="pan" control={control} render={({field})=><MaskedInput label="PAN" id="pan" value={field.value} onChange={field.onChange} error={errors.pan?.message} isVerified={panVerify.isVerified} isVerifying={panVerify.isVerifying} onBlur={()=>pan && panVerify.verify(pan)}/>}/>
      <button type="button" className="btn-secondary" disabled={!pan || panVerify.isVerifying} onClick={()=>panVerify.verify(pan)}>Verify PAN</button>
      <Controller name="aadhaar" control={control} render={({field})=><MaskedInput label="Aadhaar" id="aadhaar" value={field.value} onChange={field.onChange} error={errors.aadhaar?.message} isVerified={aadhaarVerify.isVerified} isVerifying={aadhaarVerify.isVerifying} maskWhenVerified onBlur={()=>aadhaar && aadhaarVerify.verify(aadhaar)}/>}/>
      <button type="button" className="btn-secondary" disabled={!aadhaar || aadhaarVerify.isVerifying} onClick={()=>aadhaarVerify.verify(aadhaar)}>Verify Aadhaar</button>
      <Controller name="aadhaarConsent" control={control} render={({field})=><Checkbox id="aadhaarConsent" label="I consent to Aadhaar-based verification for this application." checked={field.value} onChange={field.onChange} error={errors.aadhaarConsent?.message}/>}/>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input id="voterId" label="Voter ID" error={errors.voterId?.message} {...register('voterId')}/>
        <Input id="passport" label="Passport" error={errors.passport?.message} {...register('passport')}/>
      </div>
    </div>
    <StepNavigation onBack={onBack} onNext={handleSubmit(onNext)} isFirstStep={isFirstStep} isLastStep={isLastStep}/>
  </form>;
}
