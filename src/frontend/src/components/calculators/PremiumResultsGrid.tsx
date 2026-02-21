import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '../../hooks/useLanguage';
import { LICPlan } from '../../backend';
import { planTranslations } from '../../data/planTranslations';
import { calculatePremium, isPlanEligible } from '../../utils/premiumCalculations';

interface PremiumResultsGridProps {
  plans: LICPlan[];
  age: number;
  sumAssured: number;
  term: number;
}

export function PremiumResultsGrid({ plans, age, sumAssured, term }: PremiumResultsGridProps) {
  const { t } = useLanguage();

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const eligiblePlans = plans.filter(plan => isPlanEligible(plan, age, term));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">
        {t({ mr: 'मोजलेले प्रीमियम', hi: 'गणना किए गए प्रीमियम', en: 'Calculated Premiums' })}
      </h2>

      {eligiblePlans.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            {t({
              mr: 'तुमच्या निकषांसाठी कोणतीही योजना पात्र नाही',
              hi: 'आपके मानदंडों के लिए कोई योजना पात्र नहीं है',
              en: 'No plans are eligible for your criteria',
            })}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eligiblePlans.map(plan => {
            const translation = planTranslations[plan.id];
            const premiums = calculatePremium(age, sumAssured, term, plan);

            return (
              <Card key={plan.id} className="p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {translation ? t(translation.name) : plan.name}
                  </h3>
                  <Badge variant="secondary" className="mt-2">
                    {t({ mr: 'पात्र', hi: 'पात्र', en: 'Eligible' })}
                  </Badge>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {t({ mr: 'मासिक', hi: 'मासिक', en: 'Monthly' })}
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(premiums.monthly)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {t({ mr: 'त्रैमासिक', hi: 'त्रैमासिक', en: 'Quarterly' })}
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(premiums.quarterly)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {t({ mr: 'अर्धवार्षिक', hi: 'अर्धवार्षिक', en: 'Half-Yearly' })}
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(premiums.halfYearly)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium text-foreground">
                      {t({ mr: 'वार्षिक', hi: 'वार्षिक', en: 'Annual' })}
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(premiums.annual)}
                    </span>
                  </div>
                </div>

                {premiums.note && (
                  <p className="text-xs text-muted-foreground pt-2 border-t">
                    {premiums.note}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
