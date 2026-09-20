export const INTEREST_RATES = { personal: 10.5, home: 8.5, business: 14.0 };

export function formatINR(amount) {
  const n = Math.round(Number(amount) || 0);
  return n.toLocaleString('en-IN');
}
export function formatINRCurrency(amount) { return `₹${formatINR(amount)}`; }

export function calculateEMI(principal, annualRatePct, tenureMonths) {
  const P = Number(principal) || 0;
  const n = Number(tenureMonths) || 1;
  const r = (Number(annualRatePct) || 0) / 12 / 100;
  if (r === 0) return P / n;
  const factor = (1 + r) ** n;
  return (P * r * factor) / (factor - 1);
}

export function calculateProcessingFee(principal) {
  const fee = 0.01 * (Number(principal) || 0);
  return Math.min(Math.max(fee, 2000), 25000);
}

export function getLoanSummary(loanType, principal, tenureMonths) {
  const rate = INTEREST_RATES[loanType] ?? INTEREST_RATES.personal;
  const emi = calculateEMI(principal, rate, tenureMonths);
  const totalPayable = emi * tenureMonths;
  return {
    principal: Number(principal) || 0,
    annualRate: rate,
    tenureMonths: Number(tenureMonths) || 0,
    emi: Math.round(emi),
    totalPayable: Math.round(totalPayable),
    totalInterest: Math.round(totalPayable - principal),
    processingFee: Math.round(calculateProcessingFee(principal)),
  };
}

export function checkEmiAffordability(emi, monthlyIncome) {
  const income = Number(monthlyIncome) || 0;
  if (income <= 0) return { withinLimit: false, ratio: null };
  const ratio = emi / income;
  return { withinLimit: ratio <= 0.5, ratio };
}
