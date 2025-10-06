import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Shield, Globe } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { highContrast, toggleHighContrast, fontSize, increaseFontSize, decreaseFontSize } = useAccessibility();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Apply for Assistance', href: '/apply' },
    { name: 'Funding Information', href: '/funding-info' },
    { name: 'Responsible Use', href: '/responsible-use' },
    { name: 'FAQ', href: '/faq' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`bg-white shadow-lg sticky top-0 z-50 ${highContrast ? 'bg-black text-white' : ''}`}>
      {/* Accessibility Bar */}
      <div className="bg-blue-600 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              Secure & Private
            </span>
            <span className="flex items-center">
              <Globe className="w-4 h-4 mr-1" />
              English | Español
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={decreaseFontSize}
              className="px-2 py-1 bg-blue-700 rounded text-xs"
              aria-label="Decrease font size"
            >
              A-
            </button>
            <button
              onClick={increaseFontSize}
              className="px-2 py-1 bg-blue-700 rounded text-xs"
              aria-label="Increase font size"
            >
              A+
            </button>
            <button
              onClick={toggleHighContrast}
              className="px-2 py-1 bg-blue-700 rounded text-xs"
              aria-label="Toggle high contrast"
            >
              High Contrast
            </button>
          </div>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center space-x-2">
              <Heart className="w-8 h-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-gray-800">Hope Haven</div>
                <div className="text-sm text-gray-600">Financial Assistance Program</div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                } ${item.name === 'Apply for Assistance' ? 'bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700' : ''}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-expanded="false"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  } ${item.name === 'Apply for Assistance' ? 'bg-blue-600 text-white rounded-lg hover:bg-blue-700' : ''}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;