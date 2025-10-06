import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Phone, Mail, MapPin, Shield, Lock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold">Hope Haven</div>
                <div className="text-sm text-gray-400">Financial Assistance Program</div>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Providing secure, dignified financial assistance to homeless individuals across the United States. 
              Our mission is to offer immediate support while maintaining the highest standards of privacy and security.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm">HIPAA Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-green-400" />
                <span className="text-sm">SSL Secured</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/apply" className="text-gray-300 hover:text-blue-400 transition-colors">Apply Now</Link></li>
              <li><Link to="/funding-info" className="text-gray-300 hover:text-blue-400 transition-colors">Funding Information</Link></li>
              <li><Link to="/responsible-use" className="text-gray-300 hover:text-blue-400 transition-colors">Usage Guidelines</Link></li>
              <li><Link to="/faq" className="text-gray-300 hover:text-blue-400 transition-colors">FAQ</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-blue-400 transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">1-800-HOPE-HELP</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">support@hopehaven.org</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">Available Nationwide</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © 2025 Hope Haven Financial Assistance Program. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
              Terms of Service
            </Link>
            <Link to="/accessibility" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;