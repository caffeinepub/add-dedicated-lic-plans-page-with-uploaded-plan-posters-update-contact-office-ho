import { Card } from '@/components/ui/card';
import { useLanguage } from '../../hooks/useLanguage';
import { LICPlan } from '../../backend';
import { planTranslations } from '../../data/planTranslations';

interface ComparisonTableProps {
  plans: LICPlan[];
}

export function ComparisonTable({ plans }: ComparisonTableProps) {
  const { t } = useLanguage();

  const formatCurrency = (amount: bigint) => {
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  return (
    <Card className="p-6 overflow-x-auto">
      <h2 className="text-2xl font-semibold mb-6">
        {t({ mr: 'तुलना सारणी', hi: 'तुलना तालिका', en: 'Comparison Table' })}
      </h2>

      <div className="premium-table-wrapper">
        <table className="premium-table">
          <thead>
            <tr>
              <th className="sticky left-0 bg-primary/10 z-10">
                {t({ mr: 'वैशिष्ट्य', hi: 'विशेषता', en: 'Feature' })}
              </th>
              {plans.map(plan => {
                const translation = planTranslations[plan.id];
                return (
                  <th key={plan.id}>
                    {translation ? t(translation.name) : plan.name}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="sticky left-0 bg-background z-10 font-semibold" data-label={t({ mr: 'वर्णन', hi: 'विवरण', en: 'Description' })}>
                {t({ mr: 'वर्णन', hi: 'विवरण', en: 'Description' })}
              </td>
              {plans.map(plan => {
                const translation = planTranslations[plan.id];
                return (
                  <td key={plan.id} data-label={t({ mr: 'वर्णन', hi: 'विवरण', en: 'Description' })}>
                    {translation ? t(translation.description) : plan.description}
                  </td>
                );
              })}
            </tr>

            <tr>
              <td className="sticky left-0 bg-background z-10 font-semibold" data-label={t({ mr: 'मुख्य फायदे', hi: 'मुख्य लाभ', en: 'Key Benefits' })}>
                {t({ mr: 'मुख्य फायदे', hi: 'मुख्य लाभ', en: 'Key Benefits' })}
              </td>
              {plans.map(plan => {
                const translation = planTranslations[plan.id];
                return (
                  <td key={plan.id} data-label={t({ mr: 'मुख्य फायदे', hi: 'मुख्य लाभ', en: 'Key Benefits' })}>
                    {translation && translation.benefits.length > 0 ? (
                      <ul className="list-disc list-inside space-y-1">
                        {translation.benefits.slice(0, 3).map((benefit, idx) => (
                          <li key={idx} className="text-sm">{t(benefit)}</li>
                        ))}
                      </ul>
                    ) : (
                      plan.benefits
                    )}
                  </td>
                );
              })}
            </tr>

            <tr>
              <td className="sticky left-0 bg-background z-10 font-semibold" data-label={t({ mr: 'प्रीमियम तपशील', hi: 'प्रीमियम विवरण', en: 'Premium Details' })}>
                {t({ mr: 'प्रीमियम तपशील', hi: 'प्रीमियम विवरण', en: 'Premium Details' })}
              </td>
              {plans.map(plan => {
                const translation = planTranslations[plan.id];
                return (
                  <td key={plan.id} data-label={t({ mr: 'प्रीमियम तपशील', hi: 'प्रीमियम विवरण', en: 'Premium Details' })}>
                    {translation ? t(translation.premiumDetails) : plan.premiumDetails}
                  </td>
                );
              })}
            </tr>

            {plans.some(p => p.premiumRates.length > 0) && (
              <tr>
                <td className="sticky left-0 bg-background z-10 font-semibold" data-label={t({ mr: 'नमुना प्रीमियम', hi: 'नमूना प्रीमियम', en: 'Sample Premium' })}>
                  {t({ mr: 'नमुना प्रीमियम', hi: 'नमूना प्रीमियम', en: 'Sample Premium' })}
                </td>
                {plans.map(plan => (
                  <td key={plan.id} data-label={t({ mr: 'नमुना प्रीमियम', hi: 'नमूना प्रीमियम', en: 'Sample Premium' })}>
                    {plan.premiumRates.length > 0 ? (
                      <div className="space-y-1 text-sm">
                        <div>
                          {t({ mr: 'वय', hi: 'आयु', en: 'Age' })}: {Number(plan.premiumRates[0].age)}
                        </div>
                        <div>
                          {t({ mr: 'वार्षिक', hi: 'वार्षिक', en: 'Annual' })}: {formatCurrency(plan.premiumRates[0].annualPremium)}
                        </div>
                        <div>
                          {t({ mr: 'मासिक', hi: 'मासिक', en: 'Monthly' })}: {formatCurrency(plan.premiumRates[0].monthlyPremium)}
                        </div>
                      </div>
                    ) : (
                      t({ mr: 'उपलब्ध नाही', hi: 'उपलब्ध नहीं', en: 'N/A' })
                    )}
                  </td>
                ))}
              </tr>
            )}

            <tr>
              <td className="sticky left-0 bg-background z-10 font-semibold" data-label={t({ mr: 'परिपक्वता तपशील', hi: 'परिपक्वता विवरण', en: 'Maturity Details' })}>
                {t({ mr: 'परिपक्वता तपशील', hi: 'परिपक्वता विवरण', en: 'Maturity Details' })}
              </td>
              {plans.map(plan => {
                const translation = planTranslations[plan.id];
                return (
                  <td key={plan.id} data-label={t({ mr: 'परिपक्वता तपशील', hi: 'परिपक्वता विवरण', en: 'Maturity Details' })}>
                    {translation ? t(translation.maturityDetails) : plan.maturityDetails}
                  </td>
                );
              })}
            </tr>

            {plans.some(p => p.maturityBenefits.length > 0) && (
              <tr>
                <td className="sticky left-0 bg-background z-10 font-semibold" data-label={t({ mr: 'नमुना परिपक्वता', hi: 'नमूना परिपक्वता', en: 'Sample Maturity' })}>
                  {t({ mr: 'नमुना परिपक्वता', hi: 'नमूना परिपक्वता', en: 'Sample Maturity' })}
                </td>
                {plans.map(plan => (
                  <td key={plan.id} data-label={t({ mr: 'नमुना परिपक्वता', hi: 'नमूना परिपक्वता', en: 'Sample Maturity' })}>
                    {plan.maturityBenefits.length > 0 ? (
                      <div className="space-y-1 text-sm">
                        <div>
                          {t({ mr: 'मुदत', hi: 'अवधि', en: 'Term' })}: {Number(plan.maturityBenefits[0].term)} {t({ mr: 'वर्षे', hi: 'वर्ष', en: 'years' })}
                        </div>
                        <div>
                          {t({ mr: 'विमा रक्कम', hi: 'बीमा राशि', en: 'Sum Assured' })}: {formatCurrency(plan.maturityBenefits[0].sumAssured)}
                        </div>
                        <div>
                          {t({ mr: 'बोनस', hi: 'बोनस', en: 'Bonus' })}: {formatCurrency(plan.maturityBenefits[0].bonus)}
                        </div>
                      </div>
                    ) : (
                      t({ mr: 'उपलब्ध नाही', hi: 'उपलब्ध नहीं', en: 'N/A' })
                    )}
                  </td>
                ))}
              </tr>
            )}

            {plans.some(p => p.riskCover) && (
              <tr>
                <td className="sticky left-0 bg-background z-10 font-semibold" data-label={t({ mr: 'जोखीम कवर', hi: 'जोखिम कवर', en: 'Risk Cover' })}>
                  {t({ mr: 'जोखीम कवर', hi: 'जोखिम कवर', en: 'Risk Cover' })}
                </td>
                {plans.map(plan => (
                  <td key={plan.id} data-label={t({ mr: 'जोखीम कवर', hi: 'जोखिम कवर', en: 'Risk Cover' })}>
                    {plan.riskCover ? (
                      <div className="space-y-1 text-sm">
                        <div>
                          {t({ mr: 'नैसर्गिक मृत्यू', hi: 'प्राकृतिक मृत्यु', en: 'Natural Death' })}: {formatCurrency(plan.riskCover.naturalDeathBenefit)}
                        </div>
                        <div>
                          {t({ mr: 'अपघाती मृत्यू', hi: 'दुर्घटना मृत्यु', en: 'Accidental Death' })}: {formatCurrency(plan.riskCover.accidentalDeathBenefit)}
                        </div>
                      </div>
                    ) : (
                      t({ mr: 'उपलब्ध नाही', hi: 'उपलब्ध नहीं', en: 'N/A' })
                    )}
                  </td>
                ))}
              </tr>
            )}

            <tr>
              <td className="sticky left-0 bg-background z-10 font-semibold" data-label={t({ mr: 'अतिरिक्त माहिती', hi: 'अतिरिक्त जानकारी', en: 'Additional Info' })}>
                {t({ mr: 'अतिरिक्त माहिती', hi: 'अतिरिक्त जानकारी', en: 'Additional Info' })}
              </td>
              {plans.map(plan => {
                const translation = planTranslations[plan.id];
                return (
                  <td key={plan.id} data-label={t({ mr: 'अतिरिक्त माहिती', hi: 'अतिरिक्त जानकारी', en: 'Additional Info' })}>
                    {translation ? t(translation.additionalInfo) : plan.additionalInfo}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}
