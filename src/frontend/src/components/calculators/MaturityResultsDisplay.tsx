import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '../../hooks/useLanguage';
import { LICPlan } from '../../backend';
import { planTranslations } from '../../data/planTranslations';
import { calculateMaturityBenefit } from '../../utils/maturityCalculations';
import { isPlanEligible } from '../../utils/premiumCalculations';

interface MaturityResultsDisplayProps {
  plans: LICPlan[];
  premiumAmount: number;
  term: number;
  age: number;
}

export function MaturityResultsDisplay({ plans, premiumAmount, term, age }: MaturityResultsDisplayProps) {
  const { t } = useLanguage();

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const eligiblePlans = plans.filter(plan => isPlanEligible(plan, age, term));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">
        {t({ mr: 'मोजलेले परिपक्वता लाभ', hi: 'गणना किए गए परिपक्वता लाभ', en: 'Calculated Maturity Benefits' })}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {eligiblePlans.map(plan => {
            const translation = planTranslations[plan.id];
            const maturity = calculateMaturityBenefit(premiumAmount, term, age, plan);

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

                <div className="p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">
                    {t({ mr: 'एकूण परिपक्वता रक्कम', hi: 'कुल परिपक्वता राशि', en: 'Total Maturity Amount' })}
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrency(maturity.totalMaturity)}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-semibold text-sm text-foreground">
                    {t({ mr: 'तपशील', hi: 'विवरण', en: 'Breakdown' })}
                  </h4>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {t({ mr: 'विमा रक्कम', hi: 'बीमा राशि', en: 'Sum Assured' })}
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(maturity.sumAssured)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {t({ mr: 'हमी जोड', hi: 'गारंटीड जोड़', en: 'Guaranteed Additions' })}
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(maturity.guaranteedAdditions)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {t({ mr: 'बोनस', hi: 'बोनस', en: 'Bonuses' })}
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(maturity.bonuses)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-muted-foreground">
                      {t({ mr: 'एकूण भरलेले प्रीमियम', hi: 'कुल भुगतान किया गया प्रीमियम', en: 'Total Premiums Paid' })}
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(maturity.totalPremiumsPaid)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">
                      {t({ mr: 'निव्वळ लाभ', hi: 'शुद्ध लाभ', en: 'Net Gain' })}
                    </span>
                    <span className="text-lg font-bold text-accent">
                      {formatCurrency(maturity.netGain)}
                    </span>
                  </div>
                </div>

                {maturity.note && (
                  <p className="text-xs text-muted-foreground pt-2 border-t">
                    {maturity.note}
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
