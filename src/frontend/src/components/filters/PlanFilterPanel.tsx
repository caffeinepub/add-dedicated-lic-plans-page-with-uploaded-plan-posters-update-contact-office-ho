import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '../../hooks/useLanguage';
import { FinancialGoal } from '../../types/filters';

interface PlanFilterPanelProps {
  ageRange: { min: number; max: number };
  budgetRange: { min: number; max: number };
  selectedGoals: FinancialGoal[];
  onAgeRangeChange: (range: { min: number; max: number }) => void;
  onBudgetRangeChange: (range: { min: number; max: number }) => void;
  onGoalsChange: (goals: FinancialGoal[]) => void;
  onClearFilters: () => void;
}

export function PlanFilterPanel({
  ageRange,
  budgetRange,
  selectedGoals,
  onAgeRangeChange,
  onBudgetRangeChange,
  onGoalsChange,
  onClearFilters,
}: PlanFilterPanelProps) {
  const { t } = useLanguage();

  const toggleGoal = (goal: FinancialGoal) => {
    if (selectedGoals.includes(goal)) {
      onGoalsChange(selectedGoals.filter(g => g !== goal));
    } else {
      onGoalsChange([...selectedGoals, goal]);
    }
  };

  const goals: { value: FinancialGoal; label: { mr: string; hi: string; en: string } }[] = [
    {
      value: 'savings',
      label: { mr: 'बचत', hi: 'बचत', en: 'Savings' },
    },
    {
      value: 'pension',
      label: { mr: 'पेन्शन', hi: 'पेंशन', en: 'Pension' },
    },
    {
      value: 'moneyBack',
      label: { mr: 'मनी बॅक', hi: 'मनी बैक', en: 'Money Back' },
    },
    {
      value: 'guaranteedReturns',
      label: { mr: 'हमी परतावा', hi: 'गारंटीड रिटर्न', en: 'Guaranteed Returns' },
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          {t({ mr: 'योजना फिल्टर करा', hi: 'योजना फ़िल्टर करें', en: 'Filter Plans' })}
        </h2>
        <Button variant="ghost" size="sm" onClick={onClearFilters}>
          {t({ mr: 'साफ करा', hi: 'साफ़ करें', en: 'Clear All' })}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Age Range */}
        <div className="space-y-3">
          <Label className="text-base font-medium">
            {t({ mr: 'वय श्रेणी', hi: 'आयु सीमा', en: 'Age Range' })}
          </Label>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              min="18"
              max="75"
              value={ageRange.min}
              onChange={(e) => onAgeRangeChange({ ...ageRange, min: parseInt(e.target.value) || 18 })}
              placeholder={t({ mr: 'किमान', hi: 'न्यूनतम', en: 'Min' })}
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="number"
              min="18"
              max="75"
              value={ageRange.max}
              onChange={(e) => onAgeRangeChange({ ...ageRange, max: parseInt(e.target.value) || 75 })}
              placeholder={t({ mr: 'कमाल', hi: 'अधिकतम', en: 'Max' })}
            />
          </div>
        </div>

        {/* Budget Range */}
        <div className="space-y-3">
          <Label className="text-base font-medium">
            {t({ mr: 'मासिक बजेट', hi: 'मासिक बजट', en: 'Monthly Budget' })}
          </Label>
          <div className="flex gap-2 items-center">
            <Input
              type="number"
              min="1000"
              step="1000"
              value={budgetRange.min}
              onChange={(e) => onBudgetRangeChange({ ...budgetRange, min: parseInt(e.target.value) || 1000 })}
              placeholder={t({ mr: 'किमान', hi: 'न्यूनतम', en: 'Min' })}
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="number"
              min="1000"
              step="1000"
              value={budgetRange.max}
              onChange={(e) => onBudgetRangeChange({ ...budgetRange, max: parseInt(e.target.value) || 50000 })}
              placeholder={t({ mr: 'कमाल', hi: 'अधिकतम', en: 'Max' })}
            />
          </div>
        </div>

        {/* Financial Goals */}
        <div className="space-y-3">
          <Label className="text-base font-medium">
            {t({ mr: 'आर्थिक उद्दिष्टे', hi: 'वित्तीय लक्ष्य', en: 'Financial Goals' })}
          </Label>
          <div className="space-y-2">
            {goals.map(goal => (
              <div key={goal.value} className="flex items-center space-x-2">
                <Checkbox
                  id={goal.value}
                  checked={selectedGoals.includes(goal.value)}
                  onCheckedChange={() => toggleGoal(goal.value)}
                />
                <label
                  htmlFor={goal.value}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {t(goal.label)}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
