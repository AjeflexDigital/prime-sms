import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Shield, 
  Zap, 
  BarChart, 
  Users, 
  Globe,
  ArrowRight,
  Check,
  Star,
  Send,
  Clock,
  TrendingUp,
  Menu,
  X
} from 'lucide-react';

// Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-red-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">SMS Platform</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#features" className="text-gray-600 hover:text-red-600 px-3 py-2 transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-red-600 px-3 py-2 transition-colors">
                Pricing
              </a>
              <a href="#contact" className="text-gray-600 hover:text-red-600 px-3 py-2 transition-colors">
                Contact
              </a>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-600 hover:text-red-600 font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-red-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              <a href="#features" className="text-gray-600 hover:text-red-600 px-3 py-2">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-red-600 px-3 py-2">Pricing</a>
              <a href="#contact" className="text-gray-600 hover:text-red-600 px-3 py-2">Contact</a>
              <hr className="my-2" />
              <Link to="/login" className="text-gray-600 hover:text-red-600 px-3 py-2">Sign In</Link>
              <Link to="/register" className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

// Hero Section
const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-red-600 to-red-800 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center bg-red-700 bg-opacity-50 rounded-full px-4 py-2 mb-6">
              <Zap className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Instant SMS Delivery</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Reach Your Customers
              <span className="block text-red-200">Instantly with SMS</span>
            </h1>
            
            <p className="text-xl text-red-100 mb-8 leading-relaxed">
              Send bulk SMS messages to thousands of customers with our reliable, 
              affordable platform. Start with 100 free credits and transparent pricing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all transform hover:scale-105 flex items-center justify-center"
              >
                Start Free Trial
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
              <a
                href="#pricing"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-all flex items-center justify-center"
              >
                View Pricing
              </a>
            </div>
            
            <div className="flex items-center space-x-8 mt-12 text-red-200">
              <div className="flex items-center">
                <Check className="h-5 w-5 mr-2" />
                <span>No Setup Fees</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 mr-2" />
                <span>99.9% Uptime</span>
              </div>
              <div className="flex items-center">
                <Check className="h-5 w-5 mr-2" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-20">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                  <Send className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ready to Send?</h3>
                <p className="text-red-200">Join thousands of businesses already using our platform</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-white bg-opacity-10 rounded-lg p-3">
                  <span>Messages Sent Today</span>
                  <span className="font-bold">2.4M+</span>
                </div>
                <div className="flex items-center justify-between bg-white bg-opacity-10 rounded-lg p-3">
                  <span>Active Users</span>
                  <span className="font-bold">15,000+</span>
                </div>
                <div className="flex items-center justify-between bg-white bg-opacity-10 rounded-lg p-3">
                  <span>Delivery Rate</span>
                  <span className="font-bold">99.8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: Send,
      title: "Bulk SMS Sending",
      description: "Send thousands of messages instantly with CSV upload support and personalization."
    },
    {
      icon: BarChart,
      title: "Real-time Analytics",
      description: "Track delivery status, open rates, and campaign performance with detailed reports."
    },
    {
      icon: Clock,
      title: "Scheduled Messages",
      description: "Schedule your messages for optimal delivery times and automated campaigns."
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Bank-level security with 99.9% uptime guarantee and data encryption."
    },
    {
      icon: Users,
      title: "Contact Management",
      description: "Organize your contacts with groups, tags, and smart filtering options."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Send messages to 200+ countries with competitive international rates."
    }
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive SMS platform provides all the tools you need to reach, 
            engage, and convert your audience effectively.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-6">
                  <IconComponent className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Pricing Section
const PricingSection = () => {
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
        "Email support"
      ],
      bonus: "0%",
      popular: false
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
        "API access"
      ],
      bonus: "3%",
      popular: true
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
        "Custom pricing"
      ],
      bonus: "10%",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Transparent, Affordable Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            No hidden fees. No setup costs. Pay only for what you use with volume discounts 
            and bonus credits on every purchase.
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
                  <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium">
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
                <p className="text-gray-600">{tier.range}</p>
                {tier.bonus !== "0%" && (
                  <div className="mt-2">
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      +{tier.bonus} Bonus Credits
                    </span>
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
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
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
              <h4 className="font-semibold text-blue-900">Volume Discounts Available</h4>
              <p className="text-blue-700">Need more than 100,000 SMS per month? Contact us for custom pricing.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Trust Section
const TrustSection = () => {
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Trusted by Leading Businesses</h2>
          <p className="text-gray-300 text-lg">Join thousands of companies that rely on our platform</p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">99.9%</div>
            <div className="text-gray-300">Uptime Guarantee</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">2.4M+</div>
            <div className="text-gray-300">Messages Daily</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">15K+</div>
            <div className="text-gray-300">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">200+</div>
            <div className="text-gray-300">Countries Served</div>
          </div>
        </div>
        
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-300 mb-4">
              "SMS Platform has transformed how we communicate with our customers. 
              The reliability and ease of use are unmatched."
            </p>
            <div className="font-semibold">- Marketing Director, TechCorp</div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-300 mb-4">
              "Outstanding delivery rates and excellent customer support. 
              Our campaigns have never performed better."
            </p>
            <div className="font-semibold">- CEO, RetailPlus</div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-300 mb-4">
              "The analytics and reporting features give us incredible insights 
              into our messaging campaigns. Highly recommended!"
            </p>
            <div className="font-semibold">- CTO, StartupCo</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Contact Section
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle contact form submission
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <p className="text-lg text-gray-600 mb-8">
              Have questions about our SMS platform? Our team is here to help you 
              get started and maximize your messaging success.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <MessageSquare className="h-6 w-6 text-red-600 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Email Support</h3>
                  <p className="text-gray-600">support@smsplatform.com</p>
                  <p className="text-sm text-gray-500">Response within 2 hours</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Shield className="h-6 w-6 text-red-600 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Security & Compliance</h3>
                  <p className="text-gray-600">GDPR compliant with bank-level security</p>
                  <p className="text-sm text-gray-500">Your data is always protected</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Users className="h-6 w-6 text-red-600 mr-4 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Account Management</h3>
                  <p className="text-gray-600">Dedicated support for enterprise clients</p>
                  <p className="text-sm text-gray-500">Custom solutions available</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center mb-4">
              <MessageSquare className="h-8 w-8 text-red-500 mr-2" />
              <span className="text-xl font-bold">SMS Platform</span>
            </div>
            <p className="text-gray-400 mb-4">
              The most reliable SMS platform for businesses of all sizes. 
              Reach your customers instantly with our powerful messaging tools.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
              <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="/login" className="hover:text-white transition-colors">API Docs</a></li>
              <li><a href="/login" className="hover:text-white transition-colors">Integrations</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#contact" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Support</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 SMS Platform. All rights reserved. Built with ❤️ for businesses worldwide.</p>
        </div>
      </div>
    </footer>
  );
};

// Main HomePage Component
function HomePage() {
  return (
    <div className="min-h-screen">
      {/* SEO Meta Tags */}
      <head>
        <title>SMS Platform - Reliable Bulk SMS Service for Businesses</title>
        <meta name="description" content="Send bulk SMS messages to your customers with our reliable, affordable SMS platform. Start with 100 free credits. No setup fees, transparent pricing." />
        <meta name="keywords" content="bulk sms, sms marketing, business messaging, sms api, nigeria sms, paystack sms, africa talking sms" />
        <meta name="author" content="SMS Platform" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="SMS Platform - Reliable Bulk SMS Service for Businesses" />
        <meta property="og:description" content="Send bulk SMS messages with our reliable platform. 100 free credits, transparent pricing, 99.9% uptime." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com" />
        <meta property="og:image" content="https://yourdomain.com/og-image.jpg" />
        <meta property="og:site_name" content="SMS Platform" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SMS Platform - Reliable Bulk SMS Service" />
        <meta name="twitter:description" content="Send bulk SMS messages with our reliable platform. 100 free credits, transparent pricing." />
        <meta name="twitter:image" content="https://yourdomain.com/twitter-image.jpg" />
        
        {/* Additional SEO */}
        <link rel="canonical" href="https://yourdomain.com" />
        <meta name="theme-color" content="#dc2626" />
      </head>

      <Header />
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <TrustSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default HomePage;