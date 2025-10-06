// import React from 'react';
import { Heart, Users, Shield, Award, Target, Globe } from 'lucide-react';

const AboutUs = () => {
  const teamMembers = [
    {
      name: 'Sarah Chen',
      title: 'Executive Director',
      bio: 'Former director of homeless services with 15 years of experience in social work and program development.',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    {
      name: 'Marcus Rodriguez',
      title: 'Program Manager',
      bio: 'Expert in case management and direct services with lived experience of homelessness and recovery.',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    {
      name: 'Dr. Amanda Foster',
      title: 'Chief Medical Officer',
      bio: 'Board-certified physician specializing in healthcare for vulnerable populations and trauma-informed care.',
      image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    {
      name: 'James Thompson',
      title: 'Technology Director',
      bio: 'Cybersecurity expert focused on protecting sensitive data and ensuring accessible technology solutions.',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Dignity & Respect',
      description: 'Every individual deserves to be treated with dignity and respect, regardless of their housing situation.'
    },
    {
      icon: Shield,
      title: 'Security & Privacy',
      description: 'We protect your personal information with the highest standards of security and confidentiality.'
    },
    {
      icon: Users,
      title: 'Community Support',
      description: 'Building a community of support that helps individuals achieve long-term stability and independence.'
    },
    {
      icon: Target,
      title: 'Results-Focused',
      description: 'Measuring our success by the positive outcomes in the lives of those we serve.'
    }
  ];

  const milestones = [
    { year: '2020', event: 'Hope Haven founded with initial pilot program in 3 cities' },
    { year: '2021', event: 'Expanded to 15 cities, served 1,000+ individuals' },
    { year: '2022', event: 'Launched biometric security system and mobile app' },
    { year: '2023', event: 'Reached 10,000+ program participants across 30 states' },
    { year: '2024', event: 'Achieved 85% housing stability rate among long-term participants' },
    { year: '2025', event: 'Expanding to all 50 states with enhanced support services' }
  ];

  const certifications = [
    {
      name: 'HIPAA Compliant',
      description: 'Certified for handling protected health information',
      icon: Shield
    },
    {
      name: 'SOC 2 Type II',
      description: 'Audited for security, availability, and confidentiality',
      icon: Award
    },
    {
      name: '501(c)(3) Nonprofit',
      description: 'IRS-recognized charitable organization',
      icon: Globe
    },
    {
      name: 'GuideStar Gold Seal',
      description: 'Highest level of transparency in nonprofit reporting',
      icon: Target
    }
  ];

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-4xl font-bold text-gray-800 md:text-5xl">
            About Hope Haven
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Dedicated to providing dignified, secure financial assistance to homeless individuals across the United States
          </p>
        </div>

        {/* Mission Statement */}
        <section className="mb-16">
          <div className="p-8 bg-white rounded-lg shadow-lg lg:p-12">
            <div className="mb-8 text-center">
              <Heart className="w-16 h-16 mx-auto mb-4 text-blue-600" />
              <h2 className="mb-4 text-3xl font-bold text-gray-800">Our Mission</h2>
            </div>
            <div className="max-w-4xl mx-auto">
              <p className="mb-6 text-lg leading-relaxed text-gray-700">
                Hope Haven exists to provide immediate, dignified financial assistance to individuals experiencing 
                homelessness while maintaining the highest standards of security, privacy, and respect. We believe 
                that everyone deserves access to basic necessities and the opportunity to rebuild their lives.
              </p>
              <p className="text-lg leading-relaxed text-gray-700">
                Our approach combines direct financial support with comprehensive monitoring to ensure funds are 
                used effectively, creating a pathway from homelessness to housing stability. We serve as a bridge 
                during one of life's most challenging periods, offering not just financial assistance but hope for a better future.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-800">Our Core Values</h2>
            <p className="text-lg text-gray-600">The principles that guide every aspect of our work</p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {values.map((value, index) => (
              <div key={index} className="p-8 bg-white rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <value.icon className="w-8 h-8 mr-3 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-800">{value.title}</h3>
                </div>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Story Timeline */}
        <section className="mb-16">
          <div className="p-8 bg-white rounded-lg shadow-lg">
            <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">Our Journey</h2>
            
            <div className="relative">
              <div className="absolute w-1 h-full transform -translate-x-1/2 bg-blue-200 left-1/2"></div>
              
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`flex items-center ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}>
                    <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                      <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                        <span className="text-2xl font-bold text-blue-600">{milestone.year}</span>
                        <p className="mt-2 text-gray-700">{milestone.event}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-center w-2/12">
                      <div className="w-4 h-4 bg-blue-600 border-4 border-white rounded-full shadow-lg"></div>
                    </div>
                    
                    <div className="w-5/12"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="mb-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-800">Meet Our Team</h2>
            <p className="text-lg text-gray-600">Experienced professionals dedicated to serving our community</p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="overflow-hidden bg-white rounded-lg shadow-lg">
                <div className="h-48 bg-gray-200">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-1 text-xl font-bold text-gray-800">{member.name}</h3>
                  <p className="mb-3 font-medium text-blue-600">{member.title}</p>
                  <p className="text-sm text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications & Compliance */}
        <section className="mb-16">
          <div className="p-8 bg-white rounded-lg shadow-lg">
            <h2 className="mb-8 text-3xl font-bold text-center text-gray-800">Certifications & Compliance</h2>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {certifications.map((cert, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
                    <cert.icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-800">{cert.name}</h3>
                  <p className="text-sm text-gray-600">{cert.description}</p>
                </div>
              ))}
            </div>
            
            <div className="p-6 mt-8 rounded-lg bg-gray-50">
              <h3 className="mb-3 text-xl font-semibold text-center text-gray-800">Transparency & Accountability</h3>
              <p className="text-center text-gray-600">
                We publish annual reports detailing our impact, financials, and program outcomes. 
                All certifications are independently audited and verified. Our commitment to transparency 
                ensures that both participants and donors can trust in our mission and methods.
              </p>
            </div>
          </div>
        </section>

        {/* Impact Statistics */}
        <section className="mb-16">
          <div className="p-8 text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 lg:p-12">
            <div className="mb-8 text-center">
              <h2 className="mb-4 text-3xl font-bold">Our Impact by the Numbers</h2>
              <p className="text-xl text-blue-100">Real results in the lives of real people</p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold">15,000+</div>
                <div className="text-blue-100">Individuals Served</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold">85%</div>
                <div className="text-blue-100">Housing Stability Rate</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold">$12M+</div>
                <div className="text-blue-100">Direct Assistance Provided</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold">50</div>
                <div className="text-blue-100">States Served</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <div className="p-8 bg-white rounded-lg shadow-lg">
            <div className="text-center">
              <h2 className="mb-6 text-3xl font-bold text-gray-800">Get in Touch</h2>
              <p className="mb-8 text-lg text-gray-600">
                Have questions about our program or want to learn more about our work?
              </p>
              
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div>
                  <h3 className="mb-2 font-semibold text-gray-800">General Inquiries</h3>
                  <p className="text-gray-600">info@hopehaven.org</p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-gray-800">Program Support</h3>
                  <p className="text-gray-600">1-800-HOPE-HELP</p>
                </div>
                <div>
                  <h3 className="mb-2 font-semibold text-gray-800">Media & Press</h3>
                  <p className="text-gray-600">press@hopehaven.org</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;