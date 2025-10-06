// import React from 'react';
import { DollarSign, MapPin, Calendar, Users, AlertCircle, CheckCircle } from 'lucide-react';

const FundingInfo = () => {
  const eligibilityRequirements = [
    'Currently experiencing homelessness or housing instability',
    'US citizen or legal permanent resident',
    'Age 18 or older',
    'Valid government-issued photo identification',
    'Active bank account for direct deposit',
    'Willing to participate in fund monitoring program',
  ];

  const approvedExpenses = [
    { category: 'Food & Nutrition', description: 'Groceries, meals, nutritional supplements' },
    { category: 'Clothing', description: 'Essential clothing items, shoes, winter gear' },
    { category: 'Housing', description: 'Rent, security deposits, temporary lodging' },
    { category: 'Healthcare', description: 'Medical expenses, prescription medications, mental health services' },
    { category: 'Transportation', description: 'Public transit, gas for job searches, vehicle maintenance' },
    { category: 'Personal Care', description: 'Hygiene products, basic toiletries, laundry services' },
  ];

  const fundingTiers = [
    {
      ageRange: '18-25 years',
      baseAmount: '$600-800',
      highCostAreas: '$800-1,000',
      description: 'Young adults beginning their independence journey'
    },
    {
      ageRange: '26-54 years',
      baseAmount: '$800-1,200',
      highCostAreas: '$1,200-1,500',
      description: 'Working-age adults seeking stability and employment'
    },
    {
      ageRange: '55+ years',
      baseAmount: '$1,000-1,500',
      highCostAreas: '$1,500-2,000',
      description: 'Seniors with additional healthcare and mobility needs'
    }
  ];

  const locationFactors = [
    { factor: 'High-Cost Metropolitan Areas', adjustment: '+25-30%', examples: 'NYC, SF, LA, DC, Boston' },
    { factor: 'Standard Metropolitan Areas', adjustment: 'Base Amount', examples: 'Atlanta, Phoenix, Denver' },
    { factor: 'Rural Areas', adjustment: '-10 to +10%', examples: 'Based on local cost of living' },
  ];

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-4xl font-bold text-gray-800 md:text-5xl">
            Funding Information & Eligibility
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Understanding your potential monthly assistance, eligibility requirements, and how our funding program works
          </p>
        </div>

        {/* Funding Tiers */}
        <section className="mb-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-800">Monthly Assistance Amounts</h2>
            <p className="text-lg text-gray-600">
              Your monthly assistance is determined by age and location to ensure fair, needs-based support
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {fundingTiers.map((tier, index) => (
              <div key={index} className="overflow-hidden bg-white rounded-lg shadow-lg">
                <div className="p-6 text-white bg-gradient-to-r from-blue-600 to-blue-700">
                  <h3 className="mb-2 text-xl font-bold">{tier.ageRange}</h3>
                  <p className="text-sm text-blue-100">{tier.description}</p>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                      <span className="font-semibold text-gray-800">Standard Areas</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{tier.baseAmount}</p>
                    <p className="text-sm text-gray-600">per month</p>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex items-center mb-2">
                      <MapPin className="w-5 h-5 mr-2 text-purple-600" />
                      <span className="font-semibold text-gray-800">High-Cost Areas</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{tier.highCostAreas}</p>
                    <p className="text-sm text-gray-600">per month</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Location Adjustments */}
        <section className="mb-16">
          <div className="p-8 bg-white rounded-lg shadow-lg">
            <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">Location-Based Adjustments</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 font-semibold text-left text-gray-800 border border-gray-200">Location Type</th>
                    <th className="px-6 py-4 font-semibold text-left text-gray-800 border border-gray-200">Adjustment</th>
                    <th className="px-6 py-4 font-semibold text-left text-gray-800 border border-gray-200">Examples</th>
                  </tr>
                </thead>
                <tbody>
                  {locationFactors.map((factor, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-800 border border-gray-200">{factor.factor}</td>
                      <td className="px-6 py-4 text-gray-700 border border-gray-200">{factor.adjustment}</td>
                      <td className="px-6 py-4 text-gray-600 border border-gray-200">{factor.examples}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Eligibility Requirements */}
        <section className="mb-16">
          <div className="p-8 bg-white rounded-lg shadow-lg">
            <div className="flex items-center mb-6">
              <Users className="w-8 h-8 mr-3 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-800">Eligibility Requirements</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {eligibilityRequirements.map((requirement, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">{requirement}</p>
                </div>
              ))}
            </div>
            
            <div className="p-4 mt-8 border border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="mb-1 font-semibold text-blue-800">Important Note</h4>
                  <p className="text-sm text-blue-700">
                    All eligibility requirements must be met and verified during the application process. 
                    False information will result in application denial and potential legal consequences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Approved Expenses */}
        <section className="mb-16">
          <div className="p-8 bg-white rounded-lg shadow-lg">
            <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">Approved Fund Usage</h2>
            <p className="mb-8 text-lg text-center text-gray-600">
              Your assistance funds can be used for these essential categories
            </p>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {approvedExpenses.map((expense, index) => (
                <div key={index} className="p-6 rounded-lg bg-gray-50">
                  <h3 className="mb-3 text-lg font-semibold text-gray-800">{expense.category}</h3>
                  <p className="text-sm text-gray-600">{expense.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Payment Schedule */}
        <section className="mb-16">
          <div className="p-8 bg-white rounded-lg shadow-lg">
            <div className="flex items-center mb-6">
              <Calendar className="w-8 h-8 mr-3 text-purple-600" />
              <h2 className="text-3xl font-bold text-gray-800">Payment Schedule & Timeline</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-xl font-semibold text-gray-800">Application to First Payment</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-3 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">Application Review: 24-48 hours</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-3 bg-green-600 rounded-full"></div>
                    <span className="text-gray-700">Verification Process: 1-3 business days</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-3 bg-purple-600 rounded-full"></div>
                    <span className="text-gray-700">First Payment: 5-7 business days after approval</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="mb-4 text-xl font-semibold text-gray-800">Ongoing Payments</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-3 bg-orange-600 rounded-full"></div>
                    <span className="text-gray-700">Monthly payments on the same date</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-3 bg-teal-600 rounded-full"></div>
                    <span className="text-gray-700">Direct deposit to your verified account</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 mr-3 bg-indigo-600 rounded-full"></div>
                    <span className="text-gray-700">Automatic renewal for eligible recipients</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="p-8 text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
            <h2 className="mb-4 text-3xl font-bold">Ready to Apply?</h2>
            <p className="mb-6 text-xl">
              Take the first step toward financial stability. Our application process is secure, 
              confidential, and designed to respect your dignity throughout.
            </p>
            <a
              href="/apply"
              className="inline-block px-8 py-3 text-lg font-semibold text-blue-600 transition-colors bg-white rounded-lg hover:bg-gray-100"
            >
              Start Your Application
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FundingInfo;