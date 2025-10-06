import { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Phone, Mail, MessageCircle } from 'lucide-react';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqCategories = [
    {
      title: 'Application Process',
      faqs: [
        {
          question: 'How long does the application process take?',
          answer: 'The initial application can be completed in 15-30 minutes. Our review process typically takes 24-48 hours, and you\'ll receive email updates throughout. Once approved, your first payment will be processed within 5-7 business days.'
        },
        {
          question: 'What documents do I need to apply?',
          answer: 'You\'ll need a government-issued photo ID (driver\'s license, state ID, or passport), your Social Security number, current address information, and banking details for direct deposit. You\'ll also need to complete biometric verification through our secure system.'
        },
        {
          question: 'Can I apply if I don\'t have a permanent address?',
          answer: 'Yes, you can apply even without a permanent address. You can list a shelter, temporary housing, or any location where you can receive mail. We understand the challenges of homelessness and have designed our system to be accessible.'
        },
        {
          question: 'What if my application is denied?',
          answer: 'If your application is denied, you\'ll receive a detailed explanation of the reasons. You can appeal the decision within 30 days by providing additional documentation or clarification. Our appeals process is handled by an independent review board.'
        }
      ]
    },
    {
      title: 'Funding & Payments',
      faqs: [
        {
          question: 'How much money will I receive each month?',
          answer: 'Monthly assistance ranges from $600-$2,000 based on your age and location. Younger adults (18-25) typically receive $600-1,000, working-age adults (26-54) receive $800-1,500, and seniors (55+) receive $1,000-2,000. High-cost areas receive additional adjustments.'
        },
        {
          question: 'When will I receive my first payment?',
          answer: 'Your first payment will be processed 5-7 business days after approval. Subsequent payments are made on the same date each month via direct deposit to your verified bank account.'
        },
        {
          question: 'Can I receive payments if I don\'t have a bank account?',
          answer: 'A bank account is required for direct deposit. However, we can provide resources to help you open a bank account, including partnerships with credit unions that offer low-cost accounts specifically for program participants.'
        },
        {
          question: 'How long can I receive assistance?',
          answer: 'There\'s no predetermined limit on assistance duration. Your eligibility is reviewed every 6 months to ensure you still meet the criteria. Our goal is to provide support until you achieve stable housing and financial independence.'
        }
      ]
    },
    {
      title: 'Fund Usage & Monitoring',
      faqs: [
        {
          question: 'What can I use the money for?',
          answer: 'Funds can be used for essential needs including food, clothing, housing costs, healthcare, transportation for employment, and personal care items. All approved categories are designed to support your path to stability and independence.'
        },
        {
          question: 'How do you monitor my spending?',
          answer: 'We use automated transaction monitoring that categorizes purchases in real-time. This system flags potentially prohibited purchases and provides reports for compliance review. All monitoring is done with respect for your privacy and dignity.'
        },
        {
          question: 'What happens if I accidentally buy something prohibited?',
          answer: 'First-time minor violations typically result in education and guidance rather than penalties. We understand mistakes happen and focus on helping you understand the guidelines. Serious or repeated violations may result in warnings, temporary suspension, or program termination.'
        },
        {
          question: 'Can I save some of the money for future needs?',
          answer: 'Yes, you\'re encouraged to save money for future needs like security deposits or emergency expenses. Our monitoring system tracks spending patterns but doesn\'t penalize responsible saving behavior.'
        }
      ]
    },
    {
      title: 'Technical & Account Issues',
      faqs: [
        {
          question: 'I forgot my login credentials. How do I reset them?',
          answer: 'You can reset your password using the "Forgot Password" link on the login page. For username recovery or other login issues, contact our support team at 1-800-HOPE-HELP or support@hopehaven.org.'
        },
        {
          question: 'The website isn\'t working properly. What should I do?',
          answer: 'Try refreshing the page, clearing your browser cache, or using a different browser. If problems persist, contact our technical support team. We also offer phone-based application assistance for those with limited internet access.'
        },
        {
          question: 'Can I access the website on my phone?',
          answer: 'Yes, our website is fully mobile-optimized and works on smartphones and tablets. We\'ve designed the interface to be accessible and easy to use on any device with internet access.'
        },
        {
          question: 'Is my personal information secure?',
          answer: 'Absolutely. We use bank-level encryption, are HIPAA compliant, and follow strict data security protocols. Your information is never shared without your consent and is protected by multiple layers of security.'
        }
      ]
    },
    {
      title: 'Eligibility & Requirements',
      faqs: [
        {
          question: 'Do I need to be a US citizen to apply?',
          answer: 'You must be a US citizen or legal permanent resident with valid documentation. We verify immigration status as part of the application process to ensure compliance with federal regulations.'
        },
        {
          question: 'What if I\'m working but still homeless?',
          answer: 'Employment doesn\'t disqualify you from assistance. Many working individuals still experience homelessness due to high housing costs or inadequate wages. We assess your overall housing situation, not just employment status.'
        },
        {
          question: 'Can I apply if I\'m staying with friends or family temporarily?',
          answer: 'Temporary housing situations may qualify depending on stability and duration. If you\'re couch-surfing, staying in overcrowded conditions, or in unstable temporary arrangements, you may be eligible for assistance.'
        },
        {
          question: 'Are there age restrictions for the program?',
          answer: 'You must be 18 or older to apply. For minors experiencing homelessness, we can provide referrals to appropriate youth services and family assistance programs.'
        }
      ]
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-6 text-4xl font-bold text-gray-800 md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Find answers to common questions about our financial assistance program
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-4 pl-12 pr-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {filteredFAQs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="overflow-hidden bg-white rounded-lg shadow-lg">
              <div className="px-6 py-4 text-white bg-blue-600">
                <h2 className="text-2xl font-bold">{category.title}</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {category.faqs.map((faq, faqIndex) => {
                  const globalIndex = categoryIndex * 100 + faqIndex;
                  const isOpen = openItems.includes(globalIndex);
                  
                  return (
                    <div key={faqIndex} className="p-6">
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="flex items-start justify-between w-full text-left rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                      >
                        <h3 className="pr-8 text-lg font-semibold text-gray-800">
                          {faq.question}
                        </h3>
                        <div className="flex-shrink-0">
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                      </button>
                      
                      {isOpen && (
                        <div className="mt-4">
                          <p className="leading-relaxed text-gray-600">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* No Results Message */}
        {filteredFAQs.length === 0 && searchTerm && (
          <div className="py-12 text-center">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-xl font-semibold text-gray-800">No results found</h3>
            <p className="mb-6 text-gray-600">
              We couldn't find any FAQs matching "{searchTerm}". Try a different search term or contact our support team.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="px-6 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Contact Support */}
        <section className="mt-16">
          <div className="p-8 text-white rounded-lg bg-gradient-to-r from-green-600 to-blue-600">
            <div className="mb-8 text-center">
              <MessageCircle className="w-12 h-12 mx-auto mb-4" />
              <h2 className="mb-4 text-3xl font-bold">Still Have Questions?</h2>
              <p className="text-xl">
                Our support team is here to help you with any questions about our assistance program
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="text-center">
                <Phone className="w-8 h-8 mx-auto mb-3" />
                <h3 className="mb-2 text-lg font-semibold">Phone Support</h3>
                <p className="mb-2">1-800-HOPE-HELP</p>
                <p className="text-sm text-blue-100">Available 24/7</p>
              </div>
              
              <div className="text-center">
                <Mail className="w-8 h-8 mx-auto mb-3" />
                <h3 className="mb-2 text-lg font-semibold">Email Support</h3>
                <p className="mb-2">support@hopehaven.org</p>
                <p className="text-sm text-blue-100">Response within 24 hours</p>
              </div>
              
              <div className="text-center">
                <MessageCircle className="w-8 h-8 mx-auto mb-3" />
                <h3 className="mb-2 text-lg font-semibold">Live Chat</h3>
                <p className="mb-2">Available on website</p>
                <p className="text-sm text-blue-100">Monday-Friday, 9am-5pm EST</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FAQ;