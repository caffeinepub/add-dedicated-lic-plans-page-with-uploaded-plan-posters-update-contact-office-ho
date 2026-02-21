import { LICPlan } from '../backend';
import { calculateMaturityBenefit } from './maturityCalculations';

export interface ROIResult {
  totalPremiumsPaid: number;
  maturityBenefits: number;
  netGain: number;
  effectiveAnnualROI: number;
}

export function calculateROI(
  premiumAmount: number,
  term: number,
  age: number,
  plan: LICPlan
): ROIResult {
  const totalPremiumsPaid = premiumAmount * term;
  const maturity = calculateMaturityBenefit(premiumAmount, term, age, plan);
  const maturityBenefits = maturity.totalMaturity;
  const netGain = maturityBenefits - totalPremiumsPaid;
  
  // Calculate effective annual ROI using compound interest formula
  const effectiveAnnualROI = calculateEffectiveAnnualReturn(
    totalPremiumsPaid,
    maturityBenefits,
    term
  );

  return {
    totalPremiumsPaid,
    maturityBenefits,
    netGain,
    effectiveAnnualROI,
  };
}

export function calculateEffectiveAnnualReturn(
  premiums: number,
  maturity: number,
  years: number
): number {
  if (premiums <= 0 || years <= 0) return 0;
  
  // Using compound interest formula: A = P(1 + r)^n
  // Solving for r: r = (A/P)^(1/n) - 1
  const ratio = maturity / premiums;
  const annualReturn = (Math.pow(ratio, 1 / years) - 1) * 100;
  
  return Math.max(0, annualReturn);
}
