import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/marketing/Navbar';
import Hero from './components/marketing/Hero';
import About from './components/marketing/About';
import Services from './components/marketing/Services';
import Plans from './components/marketing/Plans';
import FAQ from './components/marketing/FAQ';
import Contact from './components/marketing/Contact';
import Footer from './components/marketing/Footer';
import LICPlans from './pages/LICPlans';
import ComparisonPage from './pages/ComparisonPage';
import PremiumCalculatorPage from './pages/PremiumCalculatorPage';
import MaturityCalculatorPage from './pages/MaturityCalculatorPage';
import ROIAnalysisPage from './pages/ROIAnalysisPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'lic-plans' | 'comparison' | 'calculator-premium' | 'calculator-maturity' | 'roi-analysis'>('home');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === 'lic-plans') {
        setCurrentView('lic-plans');
      } else if (hash === 'comparison') {
        setCurrentView('comparison');
      } else if (hash === 'calculator/premium') {
        setCurrentView('calculator-premium');
      } else if (hash === 'calculator/maturity') {
        setCurrentView('calculator-maturity');
      } else if (hash === 'roi-analysis') {
        setCurrentView('roi-analysis');
      } else {
        setCurrentView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        {currentView === 'home' ? (
          <main>
            <Hero />
            <About />
            <Services />
            <Plans />
            <FAQ />
            <Contact />
          </main>
        ) : currentView === 'comparison' ? (
          <ComparisonPage />
        ) : currentView === 'calculator-premium' ? (
          <PremiumCalculatorPage />
        ) : currentView === 'calculator-maturity' ? (
          <MaturityCalculatorPage />
        ) : currentView === 'roi-analysis' ? (
          <ROIAnalysisPage />
        ) : (
          <LICPlans />
        )}
        <Footer />
      </div>
    </QueryClientProvider>
  );
}

export default App;
