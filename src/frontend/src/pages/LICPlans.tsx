import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LanguageProvider, useLanguage } from '../hooks/useLanguage';
import { LanguageToggle } from '../components/plans/LanguageToggle';
import { PlanCard } from '../components/plans/PlanCard';
import { getPlanImages } from '../utils/planImageMapping';
import { uiLabels } from '../data/planTranslations';

function LICPlansContent() {
  const { t } = useLanguage();

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

  // Define the 6 plans in order
  const planIds = [
    'jivan-labh',
    'jivan-umang',
    'jivan-shanti',
    'jivan-utsav',
    'jivan-lakshya',
    'bima-laxmi',
  ];

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
            Back to Home
          </Button>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t(uiLabels.sectionTitle)}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Discover comprehensive insurance solutions designed to secure your family's future
              and achieve your life goals with confidence.
            </p>
            <LanguageToggle />
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {planIds.map((planId) => {
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Secure Your Future?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get personalized advice and find the perfect insurance plan for your needs.
            Contact us today for a free consultation.
          </p>
          <Button size="lg" onClick={scrollToContact} className="text-lg px-8">
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
