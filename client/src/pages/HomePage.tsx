// import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, DollarSign, Shield, Clock, Users, Star } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 text-white bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="mb-6 text-5xl font-bold md:text-6xl">
              Financial Support When You Need It Most
            </h1>
            <p className="max-w-3xl mx-auto mb-8 text-xl text-blue-100 md:text-2xl">
              Hope Haven provides secure, dignified monthly financial assistance ranging from $600-$2000 
              to homeless individuals across the United States. Apply today and take the first step toward stability.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/apply"
                className="flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-200 transform bg-green-500 rounded-lg hover:bg-green-600 hover:scale-105"
              >
                Apply for Assistance <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link
                to="/funding-info"
                className="px-8 py-4 text-lg font-semibold text-white transition-all duration-200 border-2 border-white rounded-lg hover:bg-white hover:text-blue-700"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats */}
      <section className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-4">
            <div className="p-6 rounded-lg bg-blue-50">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-blue-600" />
              <h3 className="mb-2 text-2xl font-bold text-gray-800">$600-$2000</h3>
              <p className="text-gray-600">Monthly assistance based on age and location</p>
            </div>
            <div className="p-6 rounded-lg bg-green-50">
              <Shield className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h3 className="mb-2 text-2xl font-bold text-gray-800">100% Secure</h3>
              <p className="text-gray-600">End-to-end encryption and HIPAA compliance</p>
            </div>
            <div className="p-6 rounded-lg bg-purple-50">
              <Clock className="w-12 h-12 mx-auto mb-4 text-purple-600" />
              <h3 className="mb-2 text-2xl font-bold text-gray-800">24-48 Hours</h3>
              <p className="text-gray-600">Average application review time</p>
            </div>
            <div className="p-6 rounded-lg bg-orange-50">
              <Users className="w-12 h-12 mx-auto mb-4 text-orange-600" />
              <h3 className="mb-2 text-2xl font-bold text-gray-800">50 States</h3>
              <p className="text-gray-600">Available nationwide across the US</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-800">How Our Program Works</h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              A simple, secure process designed to get you the financial assistance you need quickly and with dignity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-blue-600 rounded-full">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="mb-4 text-2xl font-semibold text-gray-800">Complete Application</h3>
              <p className="mb-6 text-gray-600">
                Fill out our secure online application with your personal information, 
                upload required documents, and complete biometric verification for security.
              </p>
              <div className="p-4 bg-white rounded-lg shadow">
                <h4 className="mb-2 font-semibold text-gray-800">Required Documents:</h4>
                <ul className="text-sm text-left text-gray-600">
                  <li>• Government-issued photo ID</li>
                  <li>• Social Security Number</li>
                  <li>• Current address information</li>
                  <li>• Banking information for direct deposit</li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-green-600 rounded-full">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="mb-4 text-2xl font-semibold text-gray-800">Secure Review Process</h3>
              <p className="mb-6 text-gray-600">
                Our team reviews your application within 24-48 hours. We verify your identity 
                and eligibility while maintaining the highest standards of privacy and security.
              </p>
              <div className="p-4 bg-white rounded-lg shadow">
                <h4 className="mb-2 font-semibold text-gray-800">Eligibility Requirements:</h4>
                <ul className="text-sm text-left text-gray-600">
                  <li>• Currently experiencing homelessness</li>
                  <li>• US citizen or legal resident</li>
                  <li>• Age 18 or older</li>
                  <li>• Valid banking information</li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-purple-600 rounded-full">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="mb-4 text-2xl font-semibold text-gray-800">Receive Monthly Support</h3>
              <p className="mb-6 text-gray-600">
                Once approved, you'll receive monthly direct deposits ranging from $600-$2000 
                based on your age and location. Funds are monitored to ensure responsible use.
              </p>
              <div className="p-4 bg-white rounded-lg shadow">
                <h4 className="mb-2 font-semibold text-gray-800">Approved Uses:</h4>
                <ul className="text-sm text-left text-gray-600">
                  <li>• Food and nutrition</li>
                  <li>• Clothing and personal care</li>
                  <li>• Housing and shelter costs</li>
                  <li>• Healthcare and medications</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-800">Success Stories</h2>
            <p className="text-xl text-gray-600">Real people whose lives were changed through our assistance program</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="p-6 rounded-lg bg-blue-50">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="mb-4 text-gray-700">
                "Hope Haven's assistance program helped me get back on my feet after losing my job. 
                The monthly support gave me the stability I needed to find new employment and secure housing."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 mr-3 bg-gray-300 rounded-full"></div>
                <div>
                  <h4 className="font-semibold text-gray-800">Sarah M.</h4>
                  <p className="text-sm text-gray-600">Phoenix, AZ</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-green-50">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="mb-4 text-gray-700">
                "The application process was simple and respectful. Within two days, I was approved 
                and receiving the support I desperately needed. This program saved my life."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 mr-3 bg-gray-300 rounded-full"></div>
                <div>
                  <h4 className="font-semibold text-gray-800">Marcus T.</h4>
                  <p className="text-sm text-gray-600">Detroit, MI</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-purple-50">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="mb-4 text-gray-700">
                "As a senior citizen experiencing homelessness, I felt forgotten. Hope Haven restored 
                my dignity and provided the financial support I needed for healthcare and housing."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 mr-3 bg-gray-300 rounded-full"></div>
                <div>
                  <h4 className="font-semibold text-gray-800">Dorothy R.</h4>
                  <p className="text-sm text-gray-600">Miami, FL</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-white bg-gradient-to-r from-green-600 to-blue-600">
        <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-4 text-4xl font-bold">Ready to Get Started?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-xl">
            Don't wait another day. Take the first step toward financial stability and apply for assistance now. 
            Our team is ready to help you get the support you deserve.
          </p>
          <Link
            to="/apply"
            className="inline-flex items-center px-8 py-4 text-lg font-semibold text-blue-600 transition-all duration-200 transform bg-white rounded-lg hover:bg-gray-100 hover:scale-105"
          >
            Start Your Application <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;