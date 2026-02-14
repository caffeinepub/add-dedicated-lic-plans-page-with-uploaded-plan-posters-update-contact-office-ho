import { Mail, Phone, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'unknown-app';

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/generated/lic-logo.dim_512x512.png" 
                alt="LIC Insurance Advisor Logo" 
                className="h-12 w-12 object-contain"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-foreground">LIC Advisor</span>
                <span className="text-xs text-muted-foreground">Your Financial Partner</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Professional LIC insurance advisor dedicated to securing your family's financial future 
              with expert guidance and personalized solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {['Home', 'About', 'Services', 'Plans', 'FAQ', 'Contact'].map((link) => (
                <li key={link}>
                  <button
                    onClick={() => {
                      const element = document.getElementById(link.toLowerCase());
                      if (element) {
                        const offset = 80;
                        const elementPosition = element.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - offset;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                      }
                    }}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">+91 8668206129</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">vmthakare52@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  05 Sairam Complex, Near Mari Aai Mata Mandir, Makhamalabad Road, Panchavati, Nashik 422003
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-border pt-8 mb-8">
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-foreground mb-2">Important Disclaimer</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This website is maintained by an authorized LIC insurance advisor. All insurance products 
              and services are provided by Life Insurance Corporation of India (LIC). Policy terms, 
              conditions, benefits, and premiums are subject to LIC's official policy documents. 
              Tax benefits are subject to changes in tax laws. Please read all policy documents carefully 
              before purchasing. Past performance is not indicative of future results.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
            © {new Date().getFullYear()}. Built with <Heart className="h-4 w-4 text-destructive fill-destructive" /> using{' '}
            <a 
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
