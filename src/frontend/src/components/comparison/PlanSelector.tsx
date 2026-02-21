import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '../../hooks/useLanguage';
import { LICPlan } from '../../backend';
import { planTranslations } from '../../data/planTranslations';

interface PlanSelectorProps {
  plans: LICPlan[];
  selectedPlanIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function PlanSelector({ plans, selectedPlanIds, onSelectionChange }: PlanSelectorProps) {
  const { t } = useLanguage();

  const togglePlan = (planId: string) => {
    if (selectedPlanIds.includes(planId)) {
      onSelectionChange(selectedPlanIds.filter(id => id !== planId));
    } else {
      onSelectionChange([...selectedPlanIds, planId]);
    }
  };

  const selectAll = () => {
    onSelectionChange(plans.map(p => p.id));
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">
          {t({ mr: 'तुलना करण्यासाठी योजना निवडा', hi: 'तुलना के लिए योजनाएं चुनें', en: 'Select Plans to Compare' })}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={selectAll}>
            {t({ mr: 'सर्व निवडा', hi: 'सभी चुनें', en: 'Select All' })}
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll}>
            {t({ mr: 'साफ करा', hi: 'साफ़ करें', en: 'Clear' })}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map(plan => {
          const translation = planTranslations[plan.id];
          return (
            <div
              key={plan.id}
              className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => togglePlan(plan.id)}
            >
              <Checkbox
                checked={selectedPlanIds.includes(plan.id)}
                onCheckedChange={() => togglePlan(plan.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {translation ? t(translation.name) : plan.name}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {translation ? t(translation.description) : plan.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {selectedPlanIds.length > 0 && selectedPlanIds.length < 2 && (
        <p className="mt-4 text-sm text-destructive">
          {t({
            mr: 'तुलना करण्यासाठी किमान 2 योजना निवडा',
            hi: 'तुलना करने के लिए कम से कम 2 योजनाएं चुनें',
            en: 'Select at least 2 plans to compare',
          })}
        </p>
      )}
    </Card>
  );
}
