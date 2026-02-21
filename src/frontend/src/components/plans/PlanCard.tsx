import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '../../hooks/useLanguage';
import { planTranslations, uiLabels } from '../../data/planTranslations';
import { PlanDetailsExpanded } from './PlanDetailsExpanded';

interface PlanCardProps {
  planId: string;
  primaryImage: string;
  additionalImages?: string[];
}

export function PlanCard({ planId, primaryImage, additionalImages = [] }: PlanCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useLanguage();
  const translation = planTranslations[planId];

  if (!translation) {
    return null;
  }

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-premium transition-shadow duration-300">
      <CardHeader className="p-0">
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={primaryImage}
            alt={t(translation.name)}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/assets/generated/lic-plan-default.dim_800x600.png';
            }}
          />
          <div className="absolute top-4 right-4">
            <Badge variant="secondary" className="bg-accent text-accent-foreground font-semibold">
              {t(translation.name).match(/\d{3}/)?.[0] || 'LIC'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-6">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-foreground mb-2">
            {t(translation.name)}
          </h3>
          <p className="text-muted-foreground mb-4">
            {t(translation.description)}
          </p>

          <div className="space-y-3 mb-4">
            <h4 className="font-semibold text-foreground">{t(uiLabels.keyBenefits)}</h4>
            <ul className="space-y-2">
              {translation.benefits.slice(0, 3).map((benefit, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  <span>{t(benefit)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Button
          onClick={toggleExpansion}
          variant={isExpanded ? 'outline' : 'default'}
          className="w-full mt-auto"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" />
              {t(uiLabels.collapseButton)}
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" />
              {t(uiLabels.viewDetailsButton)}
            </>
          )}
        </Button>

        {isExpanded && (
          <div className="mt-6 pt-6 border-t animate-accordion-down">
            <PlanDetailsExpanded
              planId={planId}
              additionalImages={additionalImages}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
