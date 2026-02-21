import { LICPlan } from '../backend';

export interface MaturityResult {
  totalMaturity: number;
  sumAssured: number;
  guaranteedAdditions: number;
  bonuses: number;
  totalPremiumsPaid: number;
  netGain: number;
  note?: string;
}

export function calculateMaturityBenefit(
  premiumAmount: number,
  term: number,
  age: number,
  plan: LICPlan
): MaturityResult {
  // Calculate sum assured based on premium and term
  const sumAssured = calculateSumAssured(premiumAmount, term, plan);
  const totalPremiumsPaid = premiumAmount * term;

  // If plan has maturity benefits data, use it
  if (plan.maturityBenefits.length > 0) {
    const closestBenefit = plan.maturityBenefits.reduce((prev, curr) => {
      return Math.abs(Number(curr.term) - term) < Math.abs(Number(prev.term) - term) ? curr : prev;
    });

    const ratio = sumAssured / Number(closestBenefit.sumAssured);
    const guaranteedAdditions = Math.round(Number(closestBenefit.guaranteedAdditions) * ratio);
    const bonuses = Math.round(Number(closestBenefit.bonus) * ratio);
    const totalMaturity = sumAssured + guaranteedAdditions + bonuses;

    return {
      totalMaturity,
      sumAssured,
      guaranteedAdditions,
      bonuses,
      totalPremiumsPaid,
      netGain: totalMaturity - totalPremiumsPaid,
      note: `Based on ${Number(closestBenefit.term)} year term maturity data`,
    };
  }

  // Fallback estimation
  const { guaranteedAdditions, bonuses } = estimateMaturityComponents(sumAssured, term, plan.id);
  const totalMaturity = sumAssured + guaranteedAdditions + bonuses;

  return {
    totalMaturity,
    sumAssured,
    guaranteedAdditions,
    bonuses,
    totalPremiumsPaid,
    netGain: totalMaturity - totalPremiumsPaid,
    note: 'Estimated maturity benefits based on plan characteristics',
  };
}

function calculateSumAssured(premiumAmount: number, term: number, plan: LICPlan): number {
  // Sum assured multipliers based on plan type
  const multipliers: Record<string, number> = {
    'jivan-labh': 10,
    'jivan-umang': 12,
    'jivan-shanti': 0, // Annuity plan
    'jivan-utsav': 11,
    'jivan-lakshya': 10,
    'bima-laxmi': 50, // Money back plan
  };

  const multiplier = multipliers[plan.id] || 10;
  return premiumAmount * multiplier;
}

function estimateMaturityComponents(
  sumAssured: number,
  term: number,
  planId: string
): { guaranteedAdditions: number; bonuses: number } {
  // Guaranteed additions as percentage of sum assured per year
  const guaranteedRates: Record<string, number> = {
    'jivan-labh': 0.5,
    'jivan-umang': 0.6,
    'jivan-shanti': 0,
    'jivan-utsav': 10, // 10% guaranteed returns
    'jivan-lakshya': 0.55,
    'bima-laxmi': 0.5,
  };

  // Bonus rates as percentage of sum assured per year
  const bonusRates: Record<string, number> = {
    'jivan-labh': 0.4,
    'jivan-umang': 0.5,
    'jivan-shanti': 0,
    'jivan-utsav': 0,
    'jivan-lakshya': 0.45,
    'bima-laxmi': 0.5,
  };

  const guaranteedRate = guaranteedRates[planId] || 0.5;
  const bonusRate = bonusRates[planId] || 0.4;

  const guaranteedAdditions = Math.round((sumAssured * guaranteedRate * term) / 100);
  const bonuses = Math.round((sumAssured * bonusRate * term) / 100);

  return { guaranteedAdditions, bonuses };
}
