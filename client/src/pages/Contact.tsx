import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    subject: '',
    message: '',
    urgent: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    { value: '', label: 'Select a category' },
    { value: 'application', label: 'Application Support' },
    { value: 'technical', label: 'Technical Issues' },
    { value: 'payment', label: 'Payment Questions' },
    { value: 'compliance', label: 'Fund Usage Questions' },
    { value: 'appeal', label: 'Appeal Process' },
    { value: 'general', label: 'General Inquiry' },
    { value: 'emergency', label: 'Emergency Assistance' }
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: '24/7 Support Hotline',
      primary: '1-800-HOPE-HELP',
      secondary: '(1-800-467-3435)',
      description: 'Available 24 hours a day, 7 days a week for immediate assistance',
      availability: 'Always Available'
    },
    {
      icon: Mail,
      title: 'Email Support',
      primary: 'support@hopehaven.org',
      secondary: 'Response within 24 hours',
      description: 'For non-urgent questions and detailed inquiries',
      availability: 'Mon-Fri, 9am-5pm EST'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      primary: 'Available on website',
      secondary: 'Instant responses',
      description: 'Chat with our support team in real-time',
      availability: 'Mon-Fri, 9am-5pm EST'
    },
    {
      icon: MapPin,
      title: 'Regional Offices',
      primary: 'Nationwide Coverage',
      secondary: 'Local support available',
      description: 'Connect with local representatives in your area',
      availability: 'By appointment only'
    }
  ];

  const emergencyContacts = [
    {
      situation: 'Mental Health Crisis',
      contact: '988 Suicide & Crisis Lifeline',
      number: '988',
      available: '24/7'
    },
    {
      situation: 'Emergency Shelter',
      contact: '211 Community Services',
      number: '211',
      available: '24/7'
    },
    {
      situation: 'Food Assistance',
      contact: 'Feeding America Hotline',
      number: '1-800-771-2303',
      available: 'Mon-Fri 8am-5pm'
    },
    {
      situation: 'Healthcare Emergency',
      contact: 'Emergency Services',
      number: '911',
      available: '24/7'
    }
  ];

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after successful submission
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        category: '',
        subject: '',
        message: '',
        urgent: false
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Contact & Support
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're here to help you every step of the way. Choose the support method that works best for you.
          </p>
        </div>

        {/* Emergency Banner */}
        <div className="mb-12">
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
            <div className="flex items-start">
              <Phone className="w-6 h-6 text-red-500 mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Need Immediate Help?</h3>
                <p className="text-red-700 mb-4">
                  If you're experiencing a crisis or emergency situation, please contact appropriate emergency services 
                  or our 24/7 hotline immediately.
                </p>
                <a
                  href="tel:1-800-467-3435"
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors inline-block"
                >
                  Call Emergency Hotline
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Methods */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Get Support</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <method.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{method.title}</h3>
                    <p className="text-sm text-gray-600">{method.availability}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-lg font-semibold text-gray-800">{method.primary}</p>
                  <p className="text-gray-600">{method.secondary}</p>
                </div>
                
                <p className="text-gray-700">{method.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Send Us a Message</h2>
            
            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                <p className="text-gray-600">
                  Thank you for contacting us. We'll respond within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="(Optional)"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {categories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief subject line"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
                    placeholder="Please provide as much detail as possible to help us assist you effectively"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="urgent"
                    checked={formData.urgent}
                    onChange={(e) => handleInputChange('urgent', e.target.checked)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="urgent" className="ml-2 text-sm text-gray-700">
                    This is an urgent matter requiring immediate attention
                  </label>
                </div>
                
                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-8 py-3 rounded-lg text-lg font-semibold transition-colors ${
                      isSubmitting
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 inline mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Emergency Resources */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Emergency Resources</h2>
            <p className="text-lg text-gray-600 text-center mb-8">
              If you need immediate assistance beyond our program, these resources are available 24/7
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {emergencyContacts.map((emergency, index) => (
                <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{emergency.situation}</h3>
                  <p className="text-gray-700 mb-2">{emergency.contact}</p>
                  <div className="flex justify-between items-center">
                    <a
                      href={`tel:${emergency.number}`}
                      className="text-xl font-bold text-red-600 hover:text-red-700"
                    >
                      {emergency.number}
                    </a>
                    <span className="text-sm text-gray-600">{emergency.available}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Office Hours */}
        <section>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
            <div className="text-center">
              <Clock className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-6">Support Hours</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Phone Support</h3>
                  <p className="text-blue-100">24 hours a day</p>
                  <p className="text-blue-100">7 days a week</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Live Chat & Email</h3>
                  <p className="text-blue-100">Monday - Friday</p>
                  <p className="text-blue-100">9:00 AM - 5:00 PM EST</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2">Emergency Line</h3>
                  <p className="text-blue-100">24 hours a day</p>
                  <p className="text-blue-100">7 days a week</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;