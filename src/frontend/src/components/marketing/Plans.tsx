import { Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Plans() {
  const plans = [
    {
      name: 'Term Insurance',
      description: 'Pure protection at affordable premiums',
      features: [
        'High coverage at low cost',
        'Flexible policy terms',
        'Tax benefits under 80C',
        'Optional riders available'
      ],
      popular: false
    },
    {
      name: 'Endowment Plans',
      description: 'Protection plus guaranteed savings',
      features: [
        'Life cover + maturity benefit',
        'Guaranteed returns',
        'Bonus accumulation',
        'Loan facility available'
      ],
      popular: true
    },
    {
      name: 'ULIP Plans',
      description: 'Investment linked insurance',
      features: [
        'Market-linked returns',
        'Life insurance coverage',
        'Flexible premium payment',
        'Tax benefits'
      ],
      popular: false
    },
    {
      name: 'Pension Plans',
      description: 'Secure retirement income',
      features: [
        'Regular pension income',
        'Vesting benefit',
        'Annuity options',
        'Tax advantages'
      ],
      popular: false
    }
  ];

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section id="plans" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Popular LIC Insurance Plans
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore our range of LIC insurance plans designed to meet diverse financial goals 
            and protection needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`border-border hover:shadow-xl transition-all relative ${
                plan.popular ? 'border-primary shadow-lg' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={scrollToContact}
                  variant={plan.popular ? 'default' : 'outline'}
                  className="w-full"
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            All plans are subject to LIC policy terms and conditions. Premium amounts and benefits 
            vary based on age, sum assured, and policy term. Contact me for personalized quotes.
          </p>
        </div>
      </div>
    </section>
  );
}
