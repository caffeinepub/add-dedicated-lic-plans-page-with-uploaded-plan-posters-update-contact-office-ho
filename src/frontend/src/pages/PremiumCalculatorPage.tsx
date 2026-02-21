import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageProvider, useLanguage } from '../hooks/useLanguage';
import { LanguageToggle } from '../components/plans/LanguageToggle';
import { PremiumCalculatorForm } from '../components/calculators/PremiumCalculatorForm';
import { PremiumResultsGrid } from '../components/calculators/PremiumResultsGrid';
import { useGetAllLICPlans } from '../hooks/useLICPlans';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

function PremiumCalculatorPageContent() {
  const { t } = useLanguage();
  const { data: plans, isLoading, error } = useGetAllLICPlans();
  const [calculationInputs, setCalculationInputs] = useState<{
    age: number;
    sumAssured: number;
    term: number;
  } | null>(null);

  const goBack = () => {
    window.location.hash = 'lic-plans';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={goBack}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t({ mr: 'परत', hi: 'वापस', en: 'Back' })}
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              {t({ mr: 'प्रीमियम कॅल्क्युलेटर', hi: 'प्रीमियम कैलकुलेटर', en: 'Premium Calculator' })}
            </h1>
            <LanguageToggle />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-64 w-full" />
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>
                {t({ mr: 'योजना लोड करताना त्रुटी', hi: 'योजना लोड करते समय त्रुटि', en: 'Error loading plans' })}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-8">
              <PremiumCalculatorForm
                onCalculate={setCalculationInputs}
              />

              {calculationInputs && plans && (
                <PremiumResultsGrid
                  plans={plans}
                  age={calculationInputs.age}
                  sumAssured={calculationInputs.sumAssured}
                  term={calculationInputs.term}
                />
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function PremiumCalculatorPage() {
  return (
    <LanguageProvider>
      <PremiumCalculatorPageContent />
    </LanguageProvider>
  );
}
