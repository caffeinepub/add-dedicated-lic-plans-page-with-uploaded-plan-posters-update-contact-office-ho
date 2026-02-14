import { Shield, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
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
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />
      
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Secure Your Family's
                <span className="text-primary block mt-2">Financial Future</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Expert LIC insurance solutions tailored to protect what matters most. 
                Get personalized advice and comprehensive coverage for life's every stage.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={scrollToContact}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8"
              >
                Get Free Consultation
              </Button>
              <Button 
                onClick={() => {
                  const element = document.getElementById('plans');
                  if (element) {
                    const offset = 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                  }
                }}
                size="lg"
                variant="outline"
                className="font-semibold"
              >
                View Plans
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div className="flex flex-col items-center text-center">
                <Shield className="h-8 w-8 text-primary mb-2" />
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-xs text-muted-foreground">Secure</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Users className="h-8 w-8 text-primary mb-2" />
                <p className="text-2xl font-bold text-foreground">500+</p>
                <p className="text-xs text-muted-foreground">Happy Clients</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <p className="text-2xl font-bold text-foreground">1</p>
                <p className="text-xs text-muted-foreground">Year Experience</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="/assets/generated/hero-insurance.dim_1600x900.png" 
                alt="Family financial security and insurance protection" 
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/20 rounded-full blur-3xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
