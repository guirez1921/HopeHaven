// import React from 'react';
import { Shield, Lock, Eye, FileText, Globe, Clock } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: FileText,
      content: [
        {
          subtitle: 'Personal Identification Information',
          items: [
            'Full name, date of birth, and Social Security number',
            'Government-issued photo identification',
            'Current and mailing addresses',
            'Phone number and email address',
            'Emergency contact information'
          ]
        },
        {
          subtitle: 'Financial Information',
          items: [
            'Bank account details for direct deposit',
            'Transaction history and spending patterns',
            'Income information and employment status',
            'Previous assistance program participation'
          ]
        },
        {
          subtitle: 'Biometric Data',
          items: [
            'Facial recognition data for identity verification',
            'Digital fingerprints from uploaded documents',
            'Voice patterns from phone verification calls',
            'Encrypted biometric templates for security'
          ]
        },
        {
          subtitle: 'Technical Information',
          items: [
            'IP addresses and device information',
            'Browser type and operating system',
            'Website usage patterns and preferences',
            'Login times and access logs'
          ]
        }
      ]
    },
    {
      id: 'data-usage',
      title: 'How We Use Your Information',
      icon: Eye,
      content: [
        {
          subtitle: 'Program Administration',
          items: [
            'Verify your identity and eligibility for assistance',
            'Process and distribute monthly financial assistance',
            'Monitor fund usage for compliance with program guidelines',
            'Communicate important program updates and changes'
          ]
        },
        {
          subtitle: 'Fraud Prevention & Security',
          items: [
            'Detect and prevent fraudulent applications',
            'Monitor for suspicious account activity',
            'Verify the authenticity of submitted documents',
            'Protect against identity theft and unauthorized access'
          ]
        },
        {
          subtitle: 'Program Improvement',
          items: [
            'Analyze program effectiveness and outcomes',
            'Improve our services and user experience',
            'Conduct research on homelessness and assistance programs',
            'Generate anonymized reports for stakeholders'
          ]
        }
      ]
    },
    {
      id: 'data-sharing',
      title: 'Information Sharing & Disclosure',
      icon: Globe,
      content: [
        {
          subtitle: 'We DO NOT Share Information For',
          items: [
            'Marketing or promotional purposes',
            'Sale to third-party data brokers',
            'Non-program related research',
            'Social media or public posting'
          ]
        },
        {
          subtitle: 'Limited Sharing Occurs Only For',
          items: [
            'Legal compliance and court orders',
            'Fraud investigation by law enforcement',
            'Medical emergencies requiring immediate intervention',
            'Authorized government agency audits'
          ]
        },
        {
          subtitle: 'Service Providers',
          items: [
            'Banking partners for direct deposit processing',
            'Technology vendors for security and hosting',
            'Compliance auditors for program verification',
            'All partners sign strict confidentiality agreements'
          ]
        }
      ]
    },
    {
      id: 'data-protection',
      title: 'Data Protection & Security',
      icon: Shield,
      content: [
        {
          subtitle: 'Encryption & Storage',
          items: [
            'All data encrypted at rest using AES-256 encryption',
            'Data in transit protected by TLS 1.3 protocols',
            'Multi-layer security architecture with regular updates',
            'Secure data centers with physical access controls'
          ]
        },
        {
          subtitle: 'Access Controls',
          items: [
            'Role-based access with principle of least privilege',
            'Multi-factor authentication for all staff accounts',
            'Regular access reviews and permission audits',
            'Immediate access revocation for terminated employees'
          ]
        },
        {
          subtitle: 'Monitoring & Response',
          items: [
            '24/7 security monitoring and threat detection',
            'Incident response team for security breaches',
            'Regular penetration testing and vulnerability assessments',
            'Annual third-party security audits'
          ]
        }
      ]
    },
    {
      id: 'user-rights',
      title: 'Your Privacy Rights',
      icon: Lock,
      content: [
        {
          subtitle: 'Access & Correction',
          items: [
            'Request copies of all personal information we hold',
            'Correct inaccurate or outdated information',
            'Update contact information and preferences',
            'View your data processing history'
          ]
        },
        {
          subtitle: 'Data Control',
          items: [
            'Restrict certain types of data processing',
            'Object to automated decision-making',
            'Request data portability in machine-readable format',
            'Withdraw consent where legally permissible'
          ]
        },
        {
          subtitle: 'Deletion Rights',
          items: [
            'Request deletion of non-essential personal data',
            'Program-required data retained per legal obligations',
            'Account closure and data minimization options',
            'Clear timeline provided for all deletion requests'
          ]
        }
      ]
    },
    {
      id: 'data-retention',
      title: 'Data Retention',
      icon: Clock,
      content: [
        {
          subtitle: 'Active Program Participation',
          items: [
            'Personal and financial data maintained throughout participation',
            'Transaction records kept for compliance monitoring',
            'Biometric data retained for ongoing identity verification',
            'Communication logs preserved for support continuity'
          ]
        },
        {
          subtitle: 'Post-Program Retention',
          items: [
            'Essential records retained for 7 years per federal requirements',
            'Financial transaction data kept for audit purposes',
            'Non-essential data deleted within 90 days of program exit',
            'Anonymized data may be retained for research purposes'
          ]
        },
        {
          subtitle: 'Legal Hold Exceptions',
          items: [
            'Data may be retained longer if subject to legal proceedings',
            'Investigation-related data preserved until resolution',
            'Compliance with government agency information requests',
            'Fraud-related records maintained for law enforcement'
          ]
        }
      ]
    }
  ];

  const lastUpdated = 'January 1, 2025';

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-4xl font-bold text-gray-800 md:text-5xl">
            Privacy Policy
          </h1>
          <p className="max-w-3xl mx-auto mb-4 text-xl text-gray-600">
            Your privacy and data security are fundamental to our mission. This policy explains how we collect, 
            use, protect, and respect your personal information.
          </p>
          <p className="text-sm text-gray-500">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Quick Summary */}
        <div className="p-8 mb-12 border border-blue-200 rounded-lg bg-blue-50">
          <h2 className="mb-4 text-2xl font-bold text-blue-800">Privacy Policy Summary</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-semibold text-blue-800">What We Collect</h3>
              <p className="text-sm text-blue-700">
                Personal identification, financial information, and biometric data necessary for program participation and fraud prevention.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-blue-800">How We Use It</h3>
              <p className="text-sm text-blue-700">
                Verify eligibility, process payments, monitor compliance, and improve our assistance program.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-blue-800">Your Rights</h3>
              <p className="text-sm text-blue-700">
                Access, correct, restrict, or delete your data. Object to processing and request data portability.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-blue-800">Our Protection</h3>
              <p className="text-sm text-blue-700">
                Military-grade encryption, multi-factor authentication, and comprehensive security monitoring.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-12">
          {sections.map((section) => (
            <div key={section.id} className="p-8 bg-white rounded-lg shadow-lg">
              <div className="flex items-center mb-6">
                <div className="p-3 mr-4 bg-blue-100 rounded-lg">
                  <section.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">{section.title}</h2>
              </div>
              
              <div className="space-y-8">
                {section.content.map((subsection, subIndex) => (
                  <div key={subIndex}>
                    <h3 className="mb-4 text-xl font-semibold text-gray-800">{subsection.subtitle}</h3>
                    <ul className="space-y-2">
                      {subsection.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <div className="flex-shrink-0 w-2 h-2 mt-2 mr-3 bg-blue-600 rounded-full"></div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Compliance Certifications */}
        <div className="p-8 mt-12 bg-white rounded-lg shadow-lg">
          <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">Compliance & Certifications</h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-800">HIPAA Compliant</h3>
              <p className="text-sm text-gray-600">Health information privacy and security standards</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full">
                <Lock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-800">SOC 2 Type II</h3>
              <p className="text-sm text-gray-600">Security, availability, and confidentiality audited</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-800">GDPR Ready</h3>
              <p className="text-sm text-gray-600">European data protection regulation compliance</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full">
                <FileText className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="mb-2 font-semibold text-gray-800">CCPA Compliant</h3>
              <p className="text-sm text-gray-600">California consumer privacy act adherence</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-8 mt-12 text-white rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold">Privacy Questions?</h2>
            <p className="mb-6 text-xl">
              Our privacy team is available to address any concerns about your data protection.
            </p>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <h3 className="mb-2 font-semibold">Privacy Officer</h3>
                <p>privacy@hopehaven.org</p>
              </div>
              
              <div>
                <h3 className="mb-2 font-semibold">Data Protection</h3>
                <p>dataprotection@hopehaven.org</p>
              </div>
              
              <div>
                <h3 className="mb-2 font-semibold">General Inquiries</h3>
                <p>1-800-HOPE-HELP</p>
              </div>
            </div>
            
            <div className="pt-6 mt-8 border-t border-blue-400">
              <h3 className="mb-2 font-semibold">Mailing Address</h3>
              <p className="text-blue-100">
                Hope Haven Financial Assistance Program<br/>
                Privacy Department<br/>
                123 Assistance Way<br/>
                Washington, DC 20001
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;