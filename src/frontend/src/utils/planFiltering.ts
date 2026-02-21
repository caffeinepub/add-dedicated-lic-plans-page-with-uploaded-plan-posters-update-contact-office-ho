import { FinancialGoal } from '../types/filters';

const planIds = [
  'jivan-labh',
  'jivan-umang',
  'jivan-shanti',
  'jivan-utsav',
  'jivan-lakshya',
  'bima-laxmi',
];

export function filterPlansByAge(planIds: string[], minAge: number, maxAge: number): string[] {
  const ageEligibility: Record<string, { min: number; max: number }> = {
    'jivan-labh': { min: 18, max: 60 },
    'jivan-umang': { min: 18, max: 55 },
    'jivan-shanti': { min: 30, max: 75 },
    'jivan-utsav': { min: 18, max: 60 },
    'jivan-lakshya': { min: 18, max: 50 },
    'bima-laxmi': { min: 18, max: 55 },
  };

  return planIds.filter(id => {
    const eligibility = ageEligibility[id];
    if (!eligibility) return true;
    
    // Check if user's age range overlaps with plan's eligibility
    return !(maxAge < eligibility.min || minAge > eligibility.max);
  });
}

export function filterPlansByBudget(planIds: string[], minBudget: number, maxBudget: number): string[] {
  // Approximate monthly premium ranges for each plan
  const budgetRanges: Record<string, { min: number; max: number }> = {
    'jivan-labh': { min: 1000, max: 10000 },
    'jivan-umang': { min: 1300, max: 15000 },
    'jivan-shanti': { min: 0, max: 0 }, // Single premium
    'jivan-utsav': { min: 4000, max: 25000 },
    'jivan-lakshya': { min: 1300, max: 12000 },
    'bima-laxmi': { min: 1500, max: 10000 },
  };

  return planIds.filter(id => {
    const range = budgetRanges[id];
    if (!range || range.max === 0) return true; // Include single premium plans
    
    // Check if budget range overlaps with plan's premium range
    return !(maxBudget < range.min || minBudget > range.max);
  });
}

export function filterPlansByGoals(planIds: string[], selectedGoals: FinancialGoal[]): string[] {
  if (selectedGoals.length === 0) return planIds;

  const planGoals: Record<string, FinancialGoal[]> = {
    'jivan-labh': ['savings', 'guaranteedReturns'],
    'jivan-umang': ['pension', 'guaranteedReturns'],
    'jivan-shanti': ['pension'],
    'jivan-utsav': ['guaranteedReturns', 'savings'],
    'jivan-lakshya': ['savings'],
    'bima-laxmi': ['moneyBack', 'savings'],
  };

  return planIds.filter(id => {
    const goals = planGoals[id] || [];
    return selectedGoals.some(goal => goals.includes(goal));
  });
}

export function filterPlans(
  ageRange?: { min: number; max: number },
  budgetRange?: { min: number; max: number },
  financialGoals?: FinancialGoal[]
): string[] {
  let filtered = [...planIds];

  if (ageRange) {
    filtered = filterPlansByAge(filtered, ageRange.min, ageRange.max);
  }

  if (budgetRange) {
    filtered = filterPlansByBudget(filtered, budgetRange.min, budgetRange.max);
  }

  if (financialGoals && financialGoals.length > 0) {
    filtered = filterPlansByGoals(filtered, financialGoals);
  }

  return filtered;
}
