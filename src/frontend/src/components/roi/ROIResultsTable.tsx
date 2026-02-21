import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '../../hooks/useLanguage';
import { LICPlan } from '../../backend';
import { planTranslations } from '../../data/planTranslations';
import { calculateROI } from '../../utils/roiCalculations';
import { isPlanEligible } from '../../utils/premiumCalculations';

interface ROIResultsTableProps {
  plans: LICPlan[];
  premiumAmount: number;
  term: number;
  age: number;
}

export function ROIResultsTable({ plans, premiumAmount, term, age }: ROIResultsTableProps) {
  const { t } = useLanguage();

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const eligiblePlans = plans.filter(plan => isPlanEligible(plan, age, term));

  const roiData = eligiblePlans.map(plan => {
    const translation = planTranslations[plan.id];
    const roi = calculateROI(premiumAmount, term, age, plan);
    
    return {
      plan,
      translation,
      roi,
    };
  }).sort((a, b) => b.roi.effectiveAnnualROI - a.roi.effectiveAnnualROI);

  const getROIBadge = (roiPercent: number) => {
    if (roiPercent >= 8) {
      return <Badge className="bg-green-600 hover:bg-green-700">{t({ mr: 'उत्कृष्ट', hi: 'उत्कृष्ट', en: 'Excellent' })}</Badge>;
    } else if (roiPercent >= 5) {
      return <Badge className="bg-yellow-600 hover:bg-yellow-700">{t({ mr: 'चांगले', hi: 'अच्छा', en: 'Good' })}</Badge>;
    } else {
      return <Badge variant="secondary">{t({ mr: 'सरासरी', hi: 'औसत', en: 'Average' })}</Badge>;
    }
  };

  if (roiData.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          {t({
            mr: 'तुमच्या निकषांसाठी कोणतीही योजना पात्र नाही',
            hi: 'आपके मानदंडों के लिए कोई योजना पात्र नहीं है',
            en: 'No plans are eligible for your criteria',
          })}
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-6">
        {t({ mr: 'तपशीलवार ROI विश्लेषण', hi: 'विस्तृत ROI विश्लेषण', en: 'Detailed ROI Analysis' })}
      </h2>

      <div className="premium-table-wrapper">
        <table className="premium-table">
          <thead>
            <tr>
              <th>{t({ mr: 'योजना', hi: 'योजना', en: 'Plan' })}</th>
              <th>{t({ mr: 'एकूण प्रीमियम', hi: 'कुल प्रीमियम', en: 'Total Premiums' })}</th>
              <th>{t({ mr: 'परिपक्वता लाभ', hi: 'परिपक्वता लाभ', en: 'Maturity Benefits' })}</th>
              <th>{t({ mr: 'निव्वळ लाभ', hi: 'शुद्ध लाभ', en: 'Net Gain' })}</th>
              <th>{t({ mr: 'वार्षिक ROI', hi: 'वार्षिक ROI', en: 'Annual ROI' })}</th>
              <th>{t({ mr: 'रेटिंग', hi: 'रेटिंग', en: 'Rating' })}</th>
            </tr>
          </thead>
          <tbody>
            {roiData.map(({ plan, translation, roi }) => (
              <tr key={plan.id}>
                <td data-label={t({ mr: 'योजना', hi: 'योजना', en: 'Plan' })}>
                  <span className="font-medium">
                    {translation ? t(translation.name) : plan.name}
                  </span>
                </td>
                <td data-label={t({ mr: 'एकूण प्रीमियम', hi: 'कुल प्रीमियम', en: 'Total Premiums' })}>
                  {formatCurrency(roi.totalPremiumsPaid)}
                </td>
                <td data-label={t({ mr: 'परिपक्वता लाभ', hi: 'परिपक्वता लाभ', en: 'Maturity Benefits' })}>
                  {formatCurrency(roi.maturityBenefits)}
                </td>
                <td data-label={t({ mr: 'निव्वळ लाभ', hi: 'शुद्ध लाभ', en: 'Net Gain' })}>
                  <span className="font-semibold text-accent">
                    {formatCurrency(roi.netGain)}
                  </span>
                </td>
                <td data-label={t({ mr: 'वार्षिक ROI', hi: 'वार्षिक ROI', en: 'Annual ROI' })}>
                  <span className="font-bold text-primary text-lg">
                    {roi.effectiveAnnualROI.toFixed(2)}%
                  </span>
                </td>
                <td data-label={t({ mr: 'रेटिंग', hi: 'रेटिंग', en: 'Rating' })}>
                  {getROIBadge(roi.effectiveAnnualROI)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
