import { LICPlan } from '../backend';

export interface PremiumResult {
  monthly: number;
  quarterly: number;
  halfYearly: number;
  annual: number;
  note?: string;
}

export function calculatePremium(
  age: number,
  sumAssured: number,
  term: number,
  plan: LICPlan
): PremiumResult {
  // If plan has premium rates, use them for calculation
  if (plan.premiumRates.length > 0) {
    // Find the closest age in premium rates
    const closestRate = plan.premiumRates.reduce((prev, curr) => {
      return Math.abs(Number(curr.age) - age) < Math.abs(Number(prev.age) - age) ? curr : prev;
    });

    // Calculate based on sum assured ratio
    const baseSum = 100000; // Assume rates are for ₹1 lakh
    const ratio = sumAssured / baseSum;

    return {
      monthly: Math.round(Number(closestRate.monthlyPremium) * ratio),
      quarterly: Math.round(Number(closestRate.quarterlyPremium) * ratio),
      halfYearly: Math.round(Number(closestRate.halfYearlyPremium) * ratio),
      annual: Math.round(Number(closestRate.annualPremium) * ratio),
      note: `Based on age ${Number(closestRate.age)} premium rates`,
    };
  }

  // Fallback estimation based on plan type
  const basePremiumRate = getBasePremiumRate(plan.id, age, term);
  const annualPremium = Math.round((sumAssured * basePremiumRate) / 100);

  return {
    monthly: Math.round(annualPremium / 12),
    quarterly: Math.round(annualPremium / 4),
    halfYearly: Math.round(annualPremium / 2),
    annual: annualPremium,
    note: 'Estimated premium based on plan characteristics',
  };
}

function getBasePremiumRate(planId: string, age: number, term: number): number {
  // Base premium rate as percentage of sum assured
  const baseRates: Record<string, number> = {
    'jivan-labh': 2.5,
    'jivan-umang': 3.0,
    'jivan-shanti': 0, // Single premium
    'jivan-utsav': 8.5,
    'jivan-lakshya': 3.2,
    'bima-laxmi': 2.0,
  };

  let rate = baseRates[planId] || 3.0;

  // Adjust for age
  if (age > 45) rate *= 1.2;
  else if (age > 35) rate *= 1.1;

  // Adjust for term
  if (term > 25) rate *= 0.95;
  else if (term < 15) rate *= 1.05;

  return rate;
}

export function isPlanEligible(plan: LICPlan, age: number, term: number): boolean {
  // Check age eligibility based on plan characteristics
  const ageEligibility: Record<string, { min: number; max: number }> = {
    'jivan-labh': { min: 18, max: 60 },
    'jivan-umang': { min: 18, max: 55 },
    'jivan-shanti': { min: 30, max: 75 },
    'jivan-utsav': { min: 18, max: 60 },
    'jivan-lakshya': { min: 18, max: 50 },
    'bima-laxmi': { min: 18, max: 55 },
  };

  const eligibility = ageEligibility[plan.id];
  if (eligibility && (age < eligibility.min || age > eligibility.max)) {
    return false;
  }

  // Check term eligibility
  const termEligibility: Record<string, { min: number; max: number }> = {
    'jivan-labh': { min: 10, max: 16 },
    'jivan-umang': { min: 15, max: 30 },
    'jivan-shanti': { min: 0, max: 20 },
    'jivan-utsav': { min: 10, max: 30 },
    'jivan-lakshya': { min: 13, max: 25 },
    'bima-laxmi': { min: 20, max: 25 },
  };

  const termElig = termEligibility[plan.id];
  if (termElig && (term < termElig.min || term > termElig.max)) {
    return false;
  }

  return true;
}
