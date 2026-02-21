import { ArrowLeft, Calculator, TrendingUp, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LanguageProvider, useLanguage } from '../hooks/useLanguage';
import { LanguageToggle } from '../components/plans/LanguageToggle';
import { PlanCard } from '../components/plans/PlanCard';
import { getPlanImages } from '../utils/planImageMapping';
import { uiLabels } from '../data/planTranslations';
import { PlanFilterPanel } from '../components/filters/PlanFilterPanel';
import { usePlanFilters } from '../hooks/usePlanFilters';

function LICPlansContent() {
  const { t } = useLanguage();
  const {
    ageRange,
    budgetRange,
    selectedGoals,
    setAgeRange,
    setBudgetRange,
    setSelectedGoals,
    clearFilters,
    filteredPlans,
  } = usePlanFilters();

  const goHome = () => {
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToContact = () => {
    window.location.hash = '';
    setTimeout(() => {
      const element = document.getElementById('contact');
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }, 100);
  };

  const navigateToComparison = () => {
    window.location.hash = 'comparison';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPremiumCalculator = () => {
    window.location.hash = 'calculator/premium';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToMaturityCalculator = () => {
    window.location.hash = 'calculator/maturity';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToROIAnalysis = () => {
    window.location.hash = 'roi-analysis';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={goHome}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t({ mr: 'मुख्यपृष्ठावर परत', hi: 'मुख्य पृष्ठ पर वापस', en: 'Back to Home' })}
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              {t(uiLabels.sectionTitle)}
            </h1>
            <LanguageToggle />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={navigateToComparison} variant="default" className="gap-2">
              <GitCompare className="h-4 w-4" />
              {t({ mr: 'योजना तुलना करा', hi: 'योजना तुलना करें', en: 'Compare Plans' })}
            </Button>
            <Button onClick={navigateToPremiumCalculator} variant="outline" className="gap-2">
              <Calculator className="h-4 w-4" />
              {t({ mr: 'प्रीमियम मोजा', hi: 'प्रीमियम गणना', en: 'Calculate Premium' })}
            </Button>
            <Button onClick={navigateToMaturityCalculator} variant="outline" className="gap-2">
              <Calculator className="h-4 w-4" />
              {t({ mr: 'परिपक्वता मोजा', hi: 'परिपक्वता गणना', en: 'Calculate Maturity' })}
            </Button>
            <Button onClick={navigateToROIAnalysis} variant="outline" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              {t({ mr: 'ROI विश्लेषण', hi: 'ROI विश्लेषण', en: 'ROI Analysis' })}
            </Button>
          </div>
        </div>
      </section>

      {/* Filter Panel */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <PlanFilterPanel
            ageRange={ageRange}
            budgetRange={budgetRange}
            selectedGoals={selectedGoals}
            onAgeRangeChange={setAgeRange}
            onBudgetRangeChange={setBudgetRange}
            onGoalsChange={setSelectedGoals}
            onClearFilters={clearFilters}
          />
        </div>
      </section>

      {/* Plans Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredPlans.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                {t({
                  mr: 'तुमच्या फिल्टरशी जुळणाऱ्या योजना आढळल्या नाहीत',
                  hi: 'आपके फ़िल्टर से मेल खाने वाली कोई योजना नहीं मिली',
                  en: 'No plans match your filters',
                })}
              </p>
              <Button onClick={clearFilters} variant="outline" className="mt-4">
                {t({ mr: 'फिल्टर साफ करा', hi: 'फ़िल्टर साफ़ करें', en: 'Clear Filters' })}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPlans.map(planId => {
                const images = getPlanImages(planId);
                return (
                  <PlanCard
                    key={planId}
                    planId={planId}
                    primaryImage={images.primary}
                    additionalImages={images.additional}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t({
              mr: 'तुमच्यासाठी योग्य योजना शोधण्यात मदत हवी आहे?',
              hi: 'आपके लिए सही योजना खोजने में मदद चाहिए?',
              en: 'Need help finding the right plan for you?',
            })}
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t({
              mr: 'आमच्या तज्ञांशी संपर्क साधा आणि तुमच्या गरजांसाठी सर्वोत्तम विमा योजना निवडा',
              hi: 'हमारे विशेषज्ञों से संपर्क करें और अपनी आवश्यकताओं के लिए सर्वोत्तम बीमा योजना चुनें',
              en: 'Contact our experts and choose the best insurance plan for your needs',
            })}
          </p>
          <Button size="lg" onClick={scrollToContact}>
            {t(uiLabels.contactUs)}
          </Button>
        </div>
      </section>
    </div>
  );
}

export default function LICPlans() {
  return (
    <LanguageProvider>
      <LICPlansContent />
    </LanguageProvider>
  );
}
