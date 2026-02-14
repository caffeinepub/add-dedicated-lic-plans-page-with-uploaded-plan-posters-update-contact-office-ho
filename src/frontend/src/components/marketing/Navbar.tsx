import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    // If we're on the LIC Plans page, navigate home first
    if (window.location.hash === '#lic-plans') {
      window.location.hash = '';
      setTimeout(() => {
        scrollToElement(id);
      }, 100);
    } else {
      scrollToElement(id);
    }
  };

  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false);
    }
  };

  const navigateToLICPlans = () => {
    window.location.hash = 'lic-plans';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Services', id: 'services' },
    { label: 'Plans', id: 'plans' },
    { label: 'LIC Plans', action: navigateToLICPlans },
    { label: 'FAQ', id: 'faq' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/95 backdrop-blur-md shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button 
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img 
              src="/assets/generated/lic-logo.dim_512x512.png" 
              alt="LIC Insurance Advisor Logo" 
              className="h-12 w-12 object-contain"
            />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground">LIC Advisor</span>
              <span className="text-xs text-muted-foreground">Your Financial Partner</span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => link.action ? link.action() : scrollToSection(link.id!)}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {link.label}
              </button>
            ))}
            <Button 
              onClick={() => scrollToSection('contact')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6"
            >
              Get a Quote
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => link.action ? link.action() : scrollToSection(link.id!)}
                  className="text-left text-sm font-medium text-foreground/80 hover:text-primary transition-colors py-2"
                >
                  {link.label}
                </button>
              ))}
              <Button 
                onClick={() => scrollToSection('contact')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold w-full"
              >
                Get a Quote
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
