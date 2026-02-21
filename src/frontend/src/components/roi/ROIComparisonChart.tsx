import { Card } from '@/components/ui/card';
import { useLanguage } from '../../hooks/useLanguage';
import { LICPlan } from '../../backend';
import { planTranslations } from '../../data/planTranslations';
import { calculateROI } from '../../utils/roiCalculations';
import { isPlanEligible } from '../../utils/premiumCalculations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ROIComparisonChartProps {
  plans: LICPlan[];
  premiumAmount: number;
  term: number;
  age: number;
}

export function ROIComparisonChart({ plans, premiumAmount, term, age }: ROIComparisonChartProps) {
  const { t } = useLanguage();

  const eligiblePlans = plans.filter(plan => isPlanEligible(plan, age, term));

  const chartData = eligiblePlans.map(plan => {
    const translation = planTranslations[plan.id];
    const roi = calculateROI(premiumAmount, term, age, plan);
    
    return {
      name: translation ? t(translation.name).split('(')[0].trim() : plan.name.split('(')[0].trim(),
      roi: roi.effectiveAnnualROI,
    };
  }).sort((a, b) => b.roi - a.roi);

  if (chartData.length === 0) {
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
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">
        {t({ mr: 'ROI तुलना', hi: 'ROI तुलना', en: 'ROI Comparison' })}
      </h2>

      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fill: 'oklch(var(--foreground))' }}
            />
            <YAxis 
              label={{ 
                value: t({ mr: 'वार्षिक ROI (%)', hi: 'वार्षिक ROI (%)', en: 'Annual ROI (%)' }), 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: 'oklch(var(--foreground))' }
              }}
              tick={{ fill: 'oklch(var(--foreground))' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'oklch(var(--card))',
                border: '1px solid oklch(var(--border))',
                borderRadius: '8px',
                color: 'oklch(var(--foreground))'
              }}
              formatter={(value: number) => [`${value.toFixed(2)}%`, t({ mr: 'ROI', hi: 'ROI', en: 'ROI' })]}
            />
            <Legend 
              wrapperStyle={{ color: 'oklch(var(--foreground))' }}
              formatter={() => t({ mr: 'वार्षिक ROI', hi: 'वार्षिक ROI', en: 'Annual ROI' })}
            />
            <Bar 
              dataKey="roi" 
              fill="oklch(var(--primary))"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
