import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { buildStep1Schema } from '../../schemas/step1Schema';
import { LOAN_TYPES } from '../../constants/loanTypes';
import { calculateAge } from '../../utils/validators';
import RadioGroup from '../common/RadioGroup';
import Select from '../common/Select';
import CurrencyInput from '../common/CurrencyInput';
import Input from '../common/Input';
import StepNavigation from '../wizard/StepNavigation';
import {
  formatINR, getLoanSummary, formatINRCurrency, checkEmiAffordability,
} from '../../utils/emiCalculator';

export default function Step1LoanType({
  formState, onNext, onBack, onSaveDraft, isFirstStep, isLastStep,
}) {
  const schema = buildStep1Schema({ applicantAge: calculateAge(formState.dob) });
  const {
    control, register, handleSubmit, watch, formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      loanType: formState.loanType || undefined, loanAmount: formState.loanAmount, loanTenure: formState.loanTenure, loanPurpose: formState.loanPurpose, referralCode: formState.referralCode,
    },
  });
  const loanType = watch('loanType');
  const loanAmount = Number(watch('loanAmount')) || 0;
  const loanTenure = Number(watch('loanTenure')) || 12;
  const config = LOAN_TYPES[loanType];
  const summary = config ? getLoanSummary(loanType, loanAmount || config.minAmount, loanTenure || config.minTenure) : null;
  const affordability = summary ? checkEmiAffordability(summary.emi, formState.monthlyIncome || 45000) : null;

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <h2 id="step-heading" tabIndex={-1} className="mb-1 text-xl font-semibold text-slate-900">What loan are you applying for?</h2>
      <p className="mb-6 text-sm text-slate-500">Your options adjust based on the loan type you pick.</p>
      <Controller
        name="loanType"
        control={control}
        render={({ field }) => (
          <RadioGroup
            legend="Loan type"
            name="loanType"
            value={field.value}
            onChange={field.onChange}
            error={errors.loanType?.message}
            options={Object.entries(LOAN_TYPES).map(([value, cfg]) => ({ value, label: cfg.label }))}
          />
        )}
      />
      {config && (
      <>
        <Controller
          name="loanAmount"
          control={control}
          render={({ field }) => (
            <CurrencyInput
              id="loanAmount"
              label="Loan amount"
              required
              value={field.value}
              onChange={field.onChange}
              error={errors.loanAmount?.message}
              helpText={`Range: ₹${formatINR(config.minAmount)} – ₹${formatINR(config.maxAmount)}`}
            />
          )}
        />
        <Select
          id="loanTenure"
          label="Loan tenure (months)"
          required
          error={errors.loanTenure?.message}
          {...register('loanTenure', { valueAsNumber: true })}
          options={Array.from({ length: Math.floor((config.maxTenure - config.minTenure) / 12) + 1 }, (_, i) => config.minTenure + i * 12).map((m) => ({ value: m, label: `${m} months` }))}
        />
        <Select
          id="loanPurpose"
          label="Purpose of loan"
          required
          placeholder="Select purpose"
          error={errors.loanPurpose?.message}
          {...register('loanPurpose')}
          options={config.purposes.map((p) => ({ value: p, label: p }))}
        />

        <div className="mt-6 overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 via-white to-emerald-50 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Loan estimate</p>
              <h3 className="mt-1 text-lg font-bold text-slate-800">Quick approval snapshot</h3>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${affordability?.withinLimit ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {affordability?.withinLimit ? 'Affordable' : 'Check income'}
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Estimated EMI</p>
              <p className="mt-1 text-lg font-bold text-slate-800">{formatINRCurrency(summary.emi)}</p>
            </div>
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Interest rate</p>
              <p className="mt-1 text-lg font-bold text-slate-800">
                {summary.annualRate}
                %
              </p>
            </div>
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Total payable</p>
              <p className="mt-1 text-lg font-bold text-slate-800">{formatINRCurrency(summary.totalPayable)}</p>
            </div>
          </div>

          <p className="mt-3 text-sm text-slate-600">
            {affordability && affordability.ratio
              ? `This EMI is about ${Math.round(affordability.ratio * 100)}% of a ₹${formatINR(formState.monthlyIncome || 45000)} monthly income.`
              : 'Enter your monthly income later to check affordability more accurately.'}
          </p>
        </div>
      </>
      )}
      <Input id="referralCode" label="Referral code" error={errors.referralCode?.message} {...register('referralCode')} />
      <StepNavigation onBack={onBack} onNext={handleSubmit(onNext)} onSaveDraft={onSaveDraft} isFirstStep={isFirstStep} isLastStep={isLastStep} />
    </form>
  );
}
