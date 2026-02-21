export type FinancialGoal = 'savings' | 'pension' | 'moneyBack' | 'guaranteedReturns';

export interface PlanFilterCriteria {
  ageRange?: {
    min: number;
    max: number;
  };
  budgetRange?: {
    min: number;
    max: number;
  };
  financialGoals?: FinancialGoal[];
}
