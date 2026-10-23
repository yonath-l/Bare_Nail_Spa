import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LoyaltyProvider } from './context/LoyaltyContext';
import { BookingProvider } from './context/BookingContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { GalleryPage } from './pages/GalleryPage';
import { LoyaltyPage } from './pages/LoyaltyPage';
import { BookingPage } from './pages/BookingPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminPage } from './pages/AdminPage';
import { PageTransition } from './components/common/PageTransition';

// Scroll to top or anchor target helper
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const elementId = hash.replace('#', '');
      const scrollToTarget = () => {
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return true;
        }
        return false;
      };

      // Try immediately
      if (!scrollToTarget()) {
        // If navigating from another page, wait briefly for DOM mount
        const timer1 = setTimeout(scrollToTarget, 100);
        const timer2 = setTimeout(scrollToTarget, 300);
        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
        };
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return null;
};

// Layout wrapper for Public Pages vs Admin
const AppLayout: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col font-sans bg-linen text-espresso">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        <PageTransition>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/loyalty" element={<LoyaltyPage />} />
            <Route path="/book" element={<BookingPage />} />
            
            {/* Isolated Admin Route Tree */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </PageTransition>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <LoyaltyProvider>
        <BookingProvider>
          <ScrollToTop />
          <AppLayout />
        </BookingProvider>
      </LoyaltyProvider>
    </BrowserRouter>
  );
};

export default App;
