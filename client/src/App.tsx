import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ApplicationPortal from './pages/ApplicationPortal';
import FundingInfo from './pages/FundingInfo';
import ResponsibleUse from './pages/ResponsibleUse';
import FAQ from './pages/FAQ';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import { AccessibilityProvider } from './contexts/AccessibilityContext';

function App() {
  return (
    <AccessibilityProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Toaster position="top-right" richColors />
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/apply" element={<ApplicationPortal />} />
              <Route path="/funding-info" element={<FundingInfo />} />
              <Route path="/responsible-use" element={<ResponsibleUse />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AccessibilityProvider>
  );
}

export default App;