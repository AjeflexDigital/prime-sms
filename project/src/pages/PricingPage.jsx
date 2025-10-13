import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Check, ArrowRight, Star, TrendingUp } from 'lucide-react';

function PricingPage() {
  const pricingTiers = [
    {
      name: "Starter",
      price: "3.50",
      range: "1 - 4,999 SMS",
      features: [
        "Basic SMS sending",
        "CSV bulk upload",
        "Message templates",
        "Basic analytics",
        "Email support",
        "Standard delivery speed"
      ],
      bonus: "0%",
      popular: false,
      color: "gray"
    },
    {
      name: "Business",
      price: "3.00",
      range: "20,000 - 49,999 SMS",
      features: [
        "Everything in Starter",
        "Scheduled messaging",
        "Advanced analytics",
        "Custom sender IDs",
        "Priority support",
        "API access",
        "Delivery reports"
      ],
      bonus: "3%",
      popular: true,
      color: "red"
    },
    {
      name: "Enterprise",
      price: "2.50",
      range: "100,000+ SMS",
      features: [
        "Everything in Business",
        "Dedicated account manager",
        "White-label options",
        "Advanced integrations",
        "SLA guarantee",
        "Custom pricing",
        "Priority delivery"
      ],
      bonus: "10%",
      popular: false,
      color: "blue"
    }
  ];

  const features = [
    {
      title: "Transparent Pricing",
      description: "No hidden fees, no setup costs. Pay only for what you use with clear volume-based pricing."
    },
    {
      title: "Instant Delivery",
      description: "Messages delivered within seconds to all major networks in Nigeria and internationally."
    },
    {
      title: "Bonus Credits",
      description: "Get bonus credits on every purchase. Higher volumes get bigger bonuses up to 10%."
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock customer support via email, chat, and phone for all your needs."
    }
  ];

  const faqs = [
    {
      question: "How is SMS pricing calculated?",
      answer: "SMS pricing is based on message pages. Each page contains up to 160 characters. Longer messages are split into multiple pages and charged accordingly."
    },
    {
      question: "What are bonus credits?",
      answer: "Bonus credits are additional SMS credits you receive for free based on your purchase volume. Higher volumes get bigger bonuses."
    },
    {
      question: "Can I get a refund?",
      answer: "SMS credits are non-refundable once purchased. However, we offer a satisfaction guarantee and will work with you to resolve any issues."
    },
    {
      question: "Do you support international SMS?",
      answer: "Yes, we support SMS delivery to over 200 countries worldwide with competitive international rates."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <MessageSquare className="h-8 w-8 text-red-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">Prime Sms</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-red-600 font-medium">
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
            No hidden fees, no setup costs, no monthly subscriptions. 
            Pay only for the SMS messages you send with volume discounts and bonus credits.
          </p>
          <div className="flex items-center justify-center space-x-8 text-red-200">
            <div className="flex items-center">
              <Check className="h-5 w-5 mr-2" />
              <span>No Setup Fees</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 mr-2" />
              <span>Volume Discounts</span>
            </div>
            <div className="flex items-center">
              <Check className="h-5 w-5 mr-2" />
              <span>Bonus Credits</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Volume Tier
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our pricing automatically adjusts based on your purchase volume. 
              The more you buy, the less you pay per SMS.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <div 
                key={index} 
                className={`relative bg-white border rounded-2xl p-8 ${
                  tier.popular 
                    ? 'border-red-500 shadow-lg transform scale-105' 
                    : 'border-gray-200 hover:shadow-lg'
                } transition-all`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-red-600">₦{tier.price}</span>
                    <span className="text-gray-600 ml-2">per SMS</span>
                  </div>
                  <p className="text-gray-600 mb-2">{tier.range}</p>
                  {tier.bonus !== "0%" && (
                    <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +{tier.bonus} Bonus Credits
                    </div>
                  )}
                </div>
                
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  to="/register"
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors text-center block ${
                    tier.popular
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <div className="inline-flex items-center bg-blue-50 rounded-lg p-6">
              <TrendingUp className="h-8 w-8 text-blue-600 mr-4" />
              <div className="text-left">
                <h4 className="font-semibold text-blue-900">Need Custom Pricing?</h4>
                <p className="text-blue-700">Contact us for enterprise volumes over 1 million SMS per month.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide the most reliable and cost-effective SMS solution for businesses of all sizes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Calculator */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Calculate Your Costs</h2>
              <p className="text-gray-600">See exactly how much you'll pay with our transparent pricing</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of SMS Messages
                </label>
                <input
                  type="number"
                  placeholder="e.g., 10000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Length (characters)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 160"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Base Cost</p>
                  <p className="text-2xl font-bold text-gray-900">₦30,000</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bonus Credits</p>
                  <p className="text-2xl font-bold text-green-600">₦900</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Credits</p>
                  <p className="text-2xl font-bold text-red-600">₦30,900</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Link
                to="/register"
                className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold inline-flex items-center"
              >
                Start Sending SMS
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our pricing and service
            </p>
          </div>
          
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Join thousands of businesses already using our platform. 
            Get 100 free credits when you sign up today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-colors inline-flex items-center justify-center"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center mb-4">
                <MessageSquare className="h-8 w-8 text-red-500 mr-2" />
                <span className="text-xl font-bold">Prime Sms</span>
              </div>
              <p className="text-gray-400 mb-4">
                The most reliable SMS platform for businesses of all sizes.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">API Docs</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/" className="hover:text-white transition-colors">About</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/" className="hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Prime Sms. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PricingPage;