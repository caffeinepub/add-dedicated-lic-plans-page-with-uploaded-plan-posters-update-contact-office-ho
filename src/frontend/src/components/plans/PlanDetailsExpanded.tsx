import { useLanguage } from '../../hooks/useLanguage';
import { planTranslations, uiLabels } from '../../data/planTranslations';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PlanDetailsExpandedProps {
  planId: string;
  additionalImages?: string[];
}

export function PlanDetailsExpanded({ planId, additionalImages = [] }: PlanDetailsExpandedProps) {
  const { t } = useLanguage();
  const translation = planTranslations[planId];

  if (!translation) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Premium Details */}
      <div>
        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
          <span className="text-primary">₹</span>
          {t(uiLabels.premium)}
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t(translation.premiumDetails)}
        </p>
      </div>

      <Separator />

      {/* Maturity Details */}
      <div>
        <h4 className="font-semibold text-foreground mb-2">
          {t(uiLabels.policyTerm)}
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t(translation.maturityDetails)}
        </p>
      </div>

      <Separator />

      {/* Additional Info */}
      <div>
        <h4 className="font-semibold text-foreground mb-2">
          {t(uiLabels.fullDetails)}
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {t(translation.additionalInfo)}
        </p>
      </div>

      {/* Additional Images Gallery */}
      {additionalImages.length > 0 && (
        <>
          <Separator />
          <div>
            <h4 className="font-semibold text-foreground mb-3">
              Additional Information
            </h4>
            <ScrollArea className="w-full">
              <div className="flex gap-4 pb-4">
                {additionalImages.map((image, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-64 h-80 rounded-lg overflow-hidden border border-border"
                  >
                    <img
                      src={image}
                      alt={`${t(translation.name)} detail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </>
      )}
    </div>
  );
}
