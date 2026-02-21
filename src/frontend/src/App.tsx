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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'lic-plans'>('home');

  useEffect(() => {
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
        ) : (
          <LICPlans />
        )}
        <Footer />
      </div>
    </QueryClientProvider>
  );
}

export default App;
