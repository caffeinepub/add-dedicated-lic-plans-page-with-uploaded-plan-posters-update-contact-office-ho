import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageProvider, useLanguage } from '../hooks/useLanguage';
import { LanguageToggle } from '../components/plans/LanguageToggle';
import { PlanSelector } from '../components/comparison/PlanSelector';
import { ComparisonTable } from '../components/comparison/ComparisonTable';
import { useGetAllLICPlans } from '../hooks/useLICPlans';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { uiLabels } from '../data/planTranslations';

function ComparisonPageContent() {
  const { t } = useLanguage();
  const { data: plans, isLoading, error } = useGetAllLICPlans();
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);

  const goBack = () => {
    window.location.hash = 'lic-plans';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectedPlans = plans?.filter(plan => selectedPlanIds.includes(plan.id)) || [];

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
              {t({ mr: 'योजना तुलना', hi: 'योजना तुलना', en: 'Plan Comparison' })}
            </h1>
            <LanguageToggle />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
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
              <PlanSelector
                plans={plans || []}
                selectedPlanIds={selectedPlanIds}
                onSelectionChange={setSelectedPlanIds}
              />

              {selectedPlans.length >= 2 ? (
                <ComparisonTable plans={selectedPlans} />
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <p className="text-muted-foreground">
                    {t({
                      mr: 'तुलना करण्यासाठी किमान 2 योजना निवडा',
                      hi: 'तुलना करने के लिए कम से कम 2 योजनाएं चुनें',
                      en: 'Select at least 2 plans to compare',
                    })}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ComparisonPage() {
  return (
    <LanguageProvider>
      <ComparisonPageContent />
    </LanguageProvider>
  );
}
