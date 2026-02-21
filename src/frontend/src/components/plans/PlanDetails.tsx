import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PlanEntry } from '../../backend';
import { getPlanImages } from '../../utils/planImageMapping';
import { isJivanUtsavPlan, getJivanUtsavFallbackContent } from '../../utils/jivanUtsavFallback';

interface PlanDetailsProps {
  plan: PlanEntry;
  onBack: () => void;
}

export function PlanDetails({ plan, onBack }: PlanDetailsProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  // Extract plan ID from title for image mapping
  const planId = plan.metadata.title.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[()]/g, '')
    .replace(/plan-\d+/g, '')
    .trim();
  
  const images = getPlanImages(planId);
  const imagePath = images.primary;
  const fallbackPath = '/assets/generated/lic-plan-default.dim_800x600.png';
  
  // Determine effective content (use fallback for Jivan Utsav if needed)
  const isJivanUtsav = isJivanUtsavPlan(plan.metadata.title);
  const effectiveContent = isJivanUtsav && (!plan.content.analysis || plan.content.analysis.trim().length === 0)
    ? getJivanUtsavFallbackContent()
    : plan.content;
  
  const sections = [
    { title: 'Overview', text: effectiveContent.analysis },
    { title: 'Benefits & Goals', text: effectiveContent.goals },
    { title: 'Coverage Details', text: effectiveContent.hypothesis },
    { title: 'Premium Information', text: effectiveContent.experiment },
    { title: 'Returns & Outcomes', text: effectiveContent.result },
  ].filter(section => section.text && section.text.trim().length > 0);
  
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };
  
  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };
  
  return (
    <div className="min-h-screen pt-20 pb-16">
      <section className="py-8 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Plans
          </Button>
          
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {plan.metadata.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {plan.metadata.description}
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {/* Image Section */}
                <div className="relative w-full bg-muted/30">
                  {imageLoading && (
                    <Skeleton className="w-full h-[400px] md:h-[500px]" />
                  )}
                  <img
                    src={imageError ? fallbackPath : imagePath}
                    alt={`${plan.metadata.title} illustration`}
                    className={`w-full h-auto object-contain max-h-[500px] ${imageLoading ? 'hidden' : 'block'}`}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                </div>
                
                {/* Content Section */}
                <div className="p-6 md:p-8 lg:p-12">
                  {sections.length > 0 ? (
                    <div className="space-y-8">
                      {sections.map((section, index) => (
                        <div key={index}>
                          <h2 className="text-2xl font-semibold text-foreground mb-4 border-b border-border pb-2">
                            {section.title}
                          </h2>
                          <p className="text-muted-foreground whitespace-pre-line leading-relaxed text-base">
                            {section.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground italic">
                        No detailed information available for this plan.
                      </p>
                    </div>
                  )}
                  
                  {/* CTA Section */}
                  <div className="mt-12 pt-8 border-t border-border">
                    <div className="bg-primary/5 rounded-lg p-6 text-center">
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        Interested in {plan.metadata.title}?
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Get personalized advice and a custom quote tailored to your needs.
                      </p>
                      <Button
                        size="lg"
                        onClick={() => {
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
                        }}
                      >
                        Contact Me for Details
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
