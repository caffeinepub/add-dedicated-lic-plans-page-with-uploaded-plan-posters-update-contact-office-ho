import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageProvider, useLanguage } from '../hooks/useLanguage';
import { LanguageToggle } from '../components/plans/LanguageToggle';
import { ROIInputForm } from '../components/roi/ROIInputForm';
import { ROIComparisonChart } from '../components/roi/ROIComparisonChart';
import { ROIResultsTable } from '../components/roi/ROIResultsTable';
import { useGetAllLICPlans } from '../hooks/useLICPlans';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

function ROIAnalysisPageContent() {
  const { t } = useLanguage();
  const { data: plans, isLoading, error } = useGetAllLICPlans();
  const [calculationInputs, setCalculationInputs] = useState<{
    premiumAmount: number;
    term: number;
    age: number;
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
              {t({ mr: 'ROI विश्लेषण', hi: 'ROI विश्लेषण', en: 'ROI Analysis' })}
            </h1>
            <LanguageToggle />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-7xl">
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
              <ROIInputForm
                onCalculate={setCalculationInputs}
              />

              {calculationInputs && plans && (
                <>
                  <ROIComparisonChart
                    plans={plans}
                    premiumAmount={calculationInputs.premiumAmount}
                    term={calculationInputs.term}
                    age={calculationInputs.age}
                  />

                  <ROIResultsTable
                    plans={plans}
                    premiumAmount={calculationInputs.premiumAmount}
                    term={calculationInputs.term}
                    age={calculationInputs.age}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ROIAnalysisPage() {
  return (
    <LanguageProvider>
      <ROIAnalysisPageContent />
    </LanguageProvider>
  );
}
