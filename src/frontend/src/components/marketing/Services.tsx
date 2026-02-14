import { Shield, PiggyBank, Briefcase, Heart, Home, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Services() {
  const services = [
    {
      icon: Shield,
      title: 'Life Insurance',
      description: 'Comprehensive life coverage to protect your loved ones financially in case of unforeseen events.'
    },
    {
      icon: PiggyBank,
      title: 'Savings Plans',
      description: 'Build wealth systematically with LIC savings plans that offer guaranteed returns and tax benefits.'
    },
    {
      icon: Briefcase,
      title: 'Retirement Planning',
      description: 'Secure your golden years with pension plans that ensure regular income after retirement.'
    },
    {
      icon: Heart,
      title: 'Health Insurance',
      description: 'Medical coverage plans to safeguard against rising healthcare costs and medical emergencies.'
    },
    {
      icon: Home,
      title: 'Mortgage Protection',
      description: 'Ensure your home loan is covered, protecting your family from financial burden.'
    },
    {
      icon: GraduationCap,
      title: 'Child Education Plans',
      description: 'Invest in your child\'s future education with plans designed for long-term growth.'
    }
  ];

  return (
    <section id="services" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comprehensive Insurance Services
          </h2>
          <p className="text-lg text-muted-foreground">
            From life protection to retirement planning, I offer a complete range of LIC insurance 
            solutions tailored to every stage of your life.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="border-border hover:border-primary/50 transition-all hover:shadow-lg group">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Service Icons Visual */}
        <div className="flex justify-center">
          <div className="relative p-8 bg-muted/30 rounded-2xl">
            <img 
              src="/assets/generated/services-icons-set.dim_512x512.png" 
              alt="Insurance services icons" 
              className="h-32 w-auto object-contain opacity-60"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
