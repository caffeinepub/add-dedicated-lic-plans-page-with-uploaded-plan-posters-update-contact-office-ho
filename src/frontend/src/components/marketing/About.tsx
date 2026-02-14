import { Award, Heart, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  const values = [
    {
      icon: Heart,
      title: 'Client-First Approach',
      description: 'Your financial security and peace of mind are our top priorities.'
    },
    {
      icon: Award,
      title: 'Expert Guidance',
      description: 'Certified LIC advisor with deep knowledge of insurance products.'
    },
    {
      icon: Target,
      title: 'Personalized Solutions',
      description: 'Tailored insurance plans that match your unique needs and goals.'
    },
    {
      icon: TrendingUp,
      title: 'Long-term Partnership',
      description: 'We stay with you through every stage of your financial journey.'
    }
  ];

  return (
    <section id="about" className="py-20 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            About Your Trusted LIC Advisor
          </h2>
          <p className="text-lg text-muted-foreground">
            With 1 year of experience in the insurance industry, I'm dedicated to helping 
            families and individuals secure their financial future through comprehensive LIC insurance solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="max-w-4xl mx-auto bg-card rounded-2xl p-8 md:p-12 shadow-lg border border-border">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Why Choose Me?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-muted-foreground">Comprehensive understanding of all LIC products and policies</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-muted-foreground">Personalized service with attention to your unique circumstances</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-muted-foreground">Ongoing support for claims, renewals, and policy updates</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <span className="text-muted-foreground">Transparent advice with no hidden charges or surprises</span>
                </li>
              </ul>
            </div>
            <div className="bg-primary/5 rounded-xl p-6 border border-primary/20">
              <p className="text-foreground italic leading-relaxed">
                "My mission is to empower every client with the knowledge and protection they need 
                to face life's uncertainties with confidence. Your family's security is my commitment."
              </p>
              <p className="text-sm text-muted-foreground mt-4 font-semibold">
                — Your LIC Insurance Advisor
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
