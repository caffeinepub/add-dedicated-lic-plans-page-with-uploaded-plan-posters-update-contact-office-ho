import { useEffect, useState } from 'react';
import Navbar from './components/marketing/Navbar';
import Hero from './components/marketing/Hero';
import About from './components/marketing/About';
import Services from './components/marketing/Services';
import Plans from './components/marketing/Plans';
import FAQ from './components/marketing/FAQ';
import Contact from './components/marketing/Contact';
import Footer from './components/marketing/Footer';
import LICPlans from './pages/LICPlans';
import { Toaster } from './components/ui/sonner';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'lic-plans'>('home');

  useEffect(() => {
    document.title = 'LIC Insurance Advisor | Secure Your Future with Expert Guidance';
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Professional LIC insurance advisor offering comprehensive life insurance solutions, retirement planning, and financial security for you and your family.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Professional LIC insurance advisor offering comprehensive life insurance solutions, retirement planning, and financial security for you and your family.';
      document.head.appendChild(meta);
    }

    // Handle hash-based navigation
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'lic-plans') {
        setCurrentView('lic-plans');
      } else {
        setCurrentView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (currentView === 'lic-plans') {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <LICPlans />
        <Footer />
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Plans />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
