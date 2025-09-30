import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess('Thank you for your message! We\'ll get back to you within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <MessageSquare className="h-8 w-8 text-red-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">SMS Platform</span>
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
            Get in Touch
          </h1>
          <p className="text-xl text-red-100 mb-8 max-w-3xl mx-auto">
            Have questions about our SMS platform? Our team is here to help you 
            get started and maximize your messaging success.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mr-4 flex-shrink-0">
                    <Mail className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                    <p className="text-gray-600 mb-1">support@smsplatform.com</p>
                    <p className="text-sm text-gray-500">Response within 2 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4 flex-shrink-0">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone Support</h3>
                    <p className="text-gray-600 mb-1">+234 800 SMS HELP</p>
                    <p className="text-sm text-gray-500">Monday - Friday, 9AM - 6PM WAT</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mr-4 flex-shrink-0">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Office Address</h3>
                    <p className="text-gray-600 mb-1">123 Technology Drive</p>
                    <p className="text-gray-600 mb-1">Victoria Island, Lagos, Nigeria</p>
                    <p className="text-sm text-gray-500">Visit by appointment only</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mr-4 flex-shrink-0">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                    <p className="text-gray-600 mb-1">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600 mb-1">Saturday: 10:00 AM - 4:00 PM</p>
                    <p className="text-sm text-gray-500">Emergency support available 24/7</p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Help</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link
                    to="/pricing"
                    className="p-4 bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-md transition-all"
                  >
                    <h4 className="font-medium text-gray-900 mb-1">Pricing Questions</h4>
                    <p className="text-sm text-gray-600">View our transparent pricing</p>
                  </Link>
                  <Link
                    to="/register"
                    className="p-4 bg-white rounded-lg border border-gray-200 hover:border-red-300 hover:shadow-md transition-all"
                  >
                    <h4 className="font-medium text-gray-900 mb-1">Get Started</h4>
                    <p className="text-sm text-gray-600">Create your free account</p>
                  </Link>
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-1">API Documentation</h4>
                    <p className="text-sm text-gray-600">Integration guides & docs</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-1">Status Page</h4>
                    <p className="text-sm text-gray-600">Check system status</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                  <span className="text-green-700 text-sm">{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="pricing">Pricing Questions</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="partnership">Partnership Opportunities</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers to common questions
            </p>
          </div>
          
          <div className="space-y-8">
            {[
              {
                question: "How quickly can I get started?",
                answer: "You can start sending SMS messages within minutes of signing up. Simply create your account, verify your email, and you'll receive 100 free credits to begin testing our platform."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards, debit cards, and bank transfers through our secure Paystack integration. All transactions are encrypted and secure."
              },
              {
                question: "Do you offer technical support?",
                answer: "Yes! We provide comprehensive technical support via email, live chat, and phone. Our support team is available 24/7 for urgent issues and during business hours for general inquiries."
              },
              {
                question: "Can I integrate with my existing systems?",
                answer: "Absolutely! We offer a comprehensive REST API with detailed documentation, webhooks for delivery reports, and SDKs for popular programming languages."
              },
              {
                question: "What about international SMS?",
                answer: "We support SMS delivery to over 200 countries worldwide with competitive international rates. Contact us for specific country pricing and coverage details."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
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
                <span className="text-xl font-bold">SMS Platform</span>
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
            <p>&copy; 2024 SMS Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ContactPage;