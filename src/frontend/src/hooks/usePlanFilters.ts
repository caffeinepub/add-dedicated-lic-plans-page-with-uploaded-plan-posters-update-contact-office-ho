import { useState, useMemo } from 'react';
import { FinancialGoal } from '../types/filters';
import { filterPlans } from '../utils/planFiltering';

export function usePlanFilters() {
  const [ageRange, setAgeRange] = useState({ min: 18, max: 75 });
  const [budgetRange, setBudgetRange] = useState({ min: 1000, max: 50000 });
  const [selectedGoals, setSelectedGoals] = useState<FinancialGoal[]>([]);

  const filteredPlans = useMemo(() => {
    return filterPlans(ageRange, budgetRange, selectedGoals);
  }, [ageRange, budgetRange, selectedGoals]);

  const clearFilters = () => {
    setAgeRange({ min: 18, max: 75 });
    setBudgetRange({ min: 1000, max: 50000 });
    setSelectedGoals([]);
  };

  return {
    ageRange,
    budgetRange,
    selectedGoals,
    setAgeRange,
    setBudgetRange,
    setSelectedGoals,
    clearFilters,
    filteredPlans,
  };
}
