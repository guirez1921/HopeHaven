// import React from 'react';
import { Shield, Eye, AlertTriangle, CheckCircle, XCircle, Scale, Phone } from 'lucide-react';

const ResponsibleUse = () => {
  const approvedUses = [
    {
      category: 'Food & Nutrition',
      items: ['Groceries and food purchases', 'Restaurant meals', 'Nutritional supplements', 'Baby formula and food'],
      icon: '🍎'
    },
    {
      category: 'Housing & Shelter',
      items: ['Rent payments', 'Security deposits', 'Temporary lodging', 'Utility bills'],
      icon: '🏠'
    },
    {
      category: 'Healthcare',
      items: ['Medical appointments', 'Prescription medications', 'Mental health services', 'Dental care'],
      icon: '🏥'
    },
    {
      category: 'Clothing & Personal Care',
      items: ['Essential clothing', 'Work attire', 'Personal hygiene products', 'Laundry services'],
      icon: '👕'
    },
    {
      category: 'Transportation',
      items: ['Public transportation', 'Gas for employment', 'Vehicle maintenance', 'Moving expenses'],
      icon: '🚌'
    },
    {
      category: 'Employment & Education',
      items: ['Job search expenses', 'Interview clothing', 'Training programs', 'Educational materials'],
      icon: '💼'
    }
  ];

  const prohibitedUses = [
    {
      category: 'Illegal Substances',
      items: ['Illegal drugs', 'Non-prescribed medications', 'Drug paraphernalia'],
      consequences: 'Immediate program termination, legal referral'
    },
    {
      category: 'Weapons & Violence',
      items: ['Firearms', 'Weapons of any kind', 'Ammunition'],
      consequences: 'Immediate program termination, law enforcement notification'
    },
    {
      category: 'Gambling & Speculation',
      items: ['Casino gambling', 'Lottery tickets', 'Sports betting', 'High-risk investments'],
      consequences: 'Program suspension, financial counseling requirement'
    },
    {
      category: 'Luxury Items',
      items: ['Expensive electronics', 'Jewelry', 'Non-essential entertainment', 'Vacation expenses'],
      consequences: 'Program warning, spending plan requirement'
    },
    {
      category: 'Illegal Services',
      items: ['Prostitution', 'Illegal gambling services', 'Money laundering', 'Tax evasion schemes'],
      consequences: 'Immediate termination, legal consequences'
    }
  ];

  const monitoringMethods = [
    {
      method: 'Transaction Monitoring',
      description: 'Real-time analysis of all card transactions using AI-powered categorization',
      frequency: 'Continuous'
    },
    {
      method: 'Merchant Verification',
      description: 'Automatic blocking of transactions at prohibited merchant types',
      frequency: 'Real-time'
    },
    {
      method: 'Spending Pattern Analysis',
      description: 'Monthly review of spending patterns to identify concerning trends',
      frequency: 'Monthly'
    },
    {
      method: 'Random Audits',
      description: 'Detailed review of receipts and spending for selected recipients',
      frequency: 'Quarterly'
    }
  ];

  const violationProcess = [
    {
      step: 1,
      title: 'Detection',
      description: 'Automated systems or manual review identifies potential violation',
      timeline: 'Immediate to 24 hours'
    },
    {
      step: 2,
      title: 'Investigation',
      description: 'Case review by compliance team, recipient contacted for explanation',
      timeline: '1-3 business days'
    },
    {
      step: 3,
      title: 'Decision',
      description: 'Determination made based on evidence and recipient response',
      timeline: '2-5 business days'
    },
    {
      step: 4,
      title: 'Action',
      description: 'Warning, suspension, or termination implemented with appeal rights',
      timeline: '1 business day'
    }
  ];

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-4xl font-bold text-gray-800 md:text-5xl">
            Responsible Use Policy
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Understanding our fund monitoring system, approved expenses, and consequences for policy violations
          </p>
        </div>

        {/* Overview */}
        <section className="mb-16">
          <div className="p-8 bg-white rounded-lg shadow-lg">
            <div className="flex items-center mb-6">
              <Shield className="w-8 h-8 mr-3 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-800">Policy Overview</h2>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-xl font-semibold text-gray-800">Our Commitment</h3>
                <p className="mb-4 text-gray-600">
                  We are committed to ensuring that assistance funds are used for their intended purpose: 
                  helping homeless individuals achieve stability and improve their quality of life.
                </p>
                <p className="text-gray-600">
                  Our monitoring system is designed to be transparent, fair, and respectful while maintaining 
                  the integrity of the program for all participants.
                </p>
              </div>
              <div>
                <h3 className="mb-4 text-xl font-semibold text-gray-800">Your Rights</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    Privacy protection during monitoring
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    Right to appeal any decisions
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    Clear explanation of any violations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                    Support and guidance for compliance
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Approved Uses */}
        <section className="mb-16">
          <div className="p-8 bg-white rounded-lg shadow-lg">
            <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">Approved Fund Usage</h2>
            <p className="mb-8 text-lg text-center text-gray-600">
              These categories represent appropriate and encouraged uses of your assistance funds
            </p>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {approvedUses.map((use, index) => (
                <div key={index} className="p-6 border border-green-200 rounded-lg bg-green-50">
                  <div className="flex items-center mb-4">
                    <span className="mr-3 text-3xl">{use.icon}</span>
                    <h3 className="text-lg font-semibold text-gray-800">{use.category}</h3>
                  </div>
                  <ul className="space-y-1">
                    {use.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="flex-shrink-0 w-3 h-3 mr-2 text-green-600" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Prohibited Uses */}
        <section className="mb-16">
          <div className="p-8 bg-white rounded-lg shadow-lg">
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-8 h-8 mr-3 text-red-600" />
              <h2 className="text-3xl font-bold text-gray-800">Prohibited Uses & Consequences</h2>
            </div>
            
            <div className="space-y-6">
              {prohibitedUses.map((prohibition, index) => (
                <div key={index} className="p-6 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{prohibition.category}</h3>
                    <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="mb-2 font-medium text-gray-700">Prohibited Items:</h4>
                      <ul className="space-y-1">
                        {prohibition.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm text-gray-600">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 font-medium text-gray-700">Consequences:</h4>
                      <p className="text-sm font-medium text-red-700">{prohibition.consequences}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Monitoring System */}
        <section className="mb-16">
          <div className="p-8 bg-white rounded-lg shadow-lg">
            <div className="flex items-center mb-6">
              <Eye className="w-8 h-8 mr-3 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-800">Fund Monitoring System</h2>
            </div>
            
            <p className="mb-8 text-lg text-gray-600">
              Our comprehensive monitoring system ensures program integrity while respecting your privacy
            </p>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {monitoringMethods.map((method, index) => (
                <div key={index} className="p-6 border border-purple-200 rounded-lg bg-purple-50">
                  <h3 className="mb-3 text-lg font-semibold text-gray-800">{method.method}</h3>
                  <p className="mb-3 text-gray-600">{method.description}</p>
                  <div className="flex items-center">
                    <span className="px-2 py-1 text-sm font-medium text-purple-700 bg-purple-100 rounded">
                      {method.frequency}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 mt-8 border border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="mb-1 font-semibold text-blue-800">Privacy Protection</h4>
                  <p className="text-sm text-blue-700">
                    All monitoring data is encrypted and access is limited to authorized compliance staff. 
                    Your spending information is never shared with unauthorized parties and is used solely 
                    for program compliance purposes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Violation Process */}
        <section className="mb-16">
          <div className="p-8 bg-white rounded-lg shadow-lg">
            <div className="flex items-center mb-6">
              <Scale className="w-8 h-8 mr-3 text-indigo-600" />
              <h2 className="text-3xl font-bold text-gray-800">Violation Investigation Process</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {violationProcess.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-indigo-600 rounded-full">
                    <span className="text-xl font-bold text-white">{step.step}</span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-800">{step.title}</h3>
                  <p className="mb-3 text-sm text-gray-600">{step.description}</p>
                  <span className="px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-100 rounded">
                    {step.timeline}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-2">
              <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                <h4 className="mb-2 font-semibold text-yellow-800">Appeal Rights</h4>
                <p className="text-sm text-yellow-700">
                  You have the right to appeal any violation determination within 10 business days. 
                  Appeals are reviewed by an independent panel and you can provide additional evidence.
                </p>
              </div>
              <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                <h4 className="mb-2 font-semibold text-green-800">Support Available</h4>
                <p className="text-sm text-green-700">
                  We provide financial counseling and budgeting support to help you stay compliant. 
                  Our goal is education and support, not punishment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <div className="p-8 text-white rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="text-center">
              <Phone className="w-12 h-12 mx-auto mb-4" />
              <h2 className="mb-4 text-3xl font-bold">Questions About Our Policy?</h2>
              <p className="mb-6 text-xl">
                Our compliance team is here to help you understand and follow our responsible use guidelines
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <a
                  href="tel:1-800-HOPE-HELP"
                  className="px-6 py-3 font-semibold text-blue-600 transition-colors bg-white rounded-lg hover:bg-gray-100"
                >
                  Call 1-800-HOPE-HELP
                </a>
                <a
                  href="mailto:compliance@hopehaven.org"
                  className="px-6 py-3 font-semibold text-white transition-colors border-2 border-white rounded-lg hover:bg-white hover:text-blue-600"
                >
                  Email Compliance Team
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ResponsibleUse;