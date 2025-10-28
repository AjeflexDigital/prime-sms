// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { 
//   MessageSquare, 
//   Shield, 
//   Zap, 
//   BarChart, 
//   Users, 
//   Globe,
//   ArrowRight,
//   Check,
//   Star,
//   Send,
//   Clock,
//   TrendingUp,
//   Menu,
//   X
// } from 'lucide-react';

// // Header Component
// const Header = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   return (
//     <header className="bg-white shadow-sm sticky top-0 z-50">
//       <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <div className="flex items-center">
//             <MessageSquare className="h-8 w-8 text-red-600 mr-2" />
//             <span className="text-xl font-bold text-gray-900">Prime Sms</span>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:block">
//             <div className="ml-10 flex items-baseline space-x-4">
//               <a href="#features" className="text-gray-600 hover:text-red-600 px-3 py-2 transition-colors">
//                 Features
//               </a>
//               <a href="#pricing" className="text-gray-600 hover:text-red-600 px-3 py-2 transition-colors">
//                 Pricing
//               </a>
//               <a href="#contact" className="text-gray-600 hover:text-red-600 px-3 py-2 transition-colors">
//                 Contact
//               </a>
//             </div>
//           </div>

//           {/* Auth Buttons */}
//           <div className="hidden md:flex items-center space-x-4">
//             <Link
//               to="/login"
//               className="text-gray-600 hover:text-red-600 font-medium transition-colors"
//             >
//               Sign In
//             </Link>
//             <Link
//               to="/register"
//               className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
//             >
//               Get Started
//             </Link>
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden">
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="text-gray-600 hover:text-red-600 focus:outline-none"
//             >
//               {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isMenuOpen && (
//           <div className="md:hidden py-4 border-t">
//             <div className="flex flex-col space-y-2">
//               <a href="#features" className="text-gray-600 hover:text-red-600 px-3 py-2">Features</a>
//               <a href="#pricing" className="text-gray-600 hover:text-red-600 px-3 py-2">Pricing</a>
//               <a href="#contact" className="text-gray-600 hover:text-red-600 px-3 py-2">Contact</a>
//               <hr className="my-2" />
//               <Link to="/login" className="text-gray-600 hover:text-red-600 px-3 py-2">Sign In</Link>
//               <Link to="/register" className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors">
//                 Get Started
//               </Link>
//             </div>
//           </div>
//         )}
//       </nav>
//     </header>
//   );
// };

// // Hero Section
// const HeroSection = () => {
//   return (
//     <section className="bg-gradient-to-br from-red-600 to-red-800 text-white py-20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
//           <div>
//             <div className="inline-flex items-center bg-red-700 bg-opacity-50 rounded-full px-4 py-2 mb-6">
//               <Zap className="h-4 w-4 mr-2" />
//               <span className="text-sm font-medium">Instant SMS Delivery</span>
//             </div>
            
//             <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
//               Reach Your Customers
//               <span className="block text-red-200">Instantly with SMS</span>
//             </h1>
            
//             <p className="text-xl text-red-100 mb-8 leading-relaxed">
//               Send bulk SMS messages to thousands of customers with our reliable, 
//               affordable platform. Start with 100 free credits and transparent pricing.
//             </p>
            
//             <div className="flex flex-col sm:flex-row gap-4">
//               <Link
//                 to="/register"
//                 className="bg-white text-red-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all transform hover:scale-105 flex items-center justify-center"
//               >
//                 Start Free Trial
//                 <ArrowRight className="h-5 w-5 ml-2" />
//               </Link>
//               <a
//                 href="#pricing"
//                 className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-red-600 transition-all flex items-center justify-center"
//               >
//                 View Pricing
//               </a>
//             </div>
            
//             <div className="flex items-center space-x-8 mt-12 text-red-200">
//               <div className="flex items-center">
//                 <Check className="h-5 w-5 mr-2" />
//                 <span>No Setup Fees</span>
//               </div>
//               <div className="flex items-center">
//                 <Check className="h-5 w-5 mr-2" />
//                 <span>99.9% Uptime</span>
//               </div>
//               <div className="flex items-center">
//                 <Check className="h-5 w-5 mr-2" />
//                 <span>24/7 Support</span>
//               </div>
//             </div>
//           </div>
          
//           <div className="relative">
//             <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-20">
//               <div className="text-center mb-6">
//                 <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
//                   <Send className="h-8 w-8" />
//                 </div>
//                 <h3 className="text-xl font-semibold mb-2">Ready to Send?</h3>
//                 <p className="text-red-200">Join thousands of businesses already using our platform</p>
//               </div>
              
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between bg-white bg-opacity-10 rounded-lg p-3">
//                   <span>Messages Sent Today</span>
//                   <span className="font-bold">2.4M+</span>
//                 </div>
//                 <div className="flex items-center justify-between bg-white bg-opacity-10 rounded-lg p-3">
//                   <span>Active Users</span>
//                   <span className="font-bold">15,000+</span>
//                 </div>
//                 <div className="flex items-center justify-between bg-white bg-opacity-10 rounded-lg p-3">
//                   <span>Delivery Rate</span>
//                   <span className="font-bold">99.8%</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// // Features Section
// const FeaturesSection = () => {
//   const features = [
//     {
//       icon: Send,
//       title: "Bulk SMS Sending",
//       description: "Send thousands of messages instantly with CSV upload support and personalization."
//     },
//     {
//       icon: BarChart,
//       title: "Real-time Analytics",
//       description: "Track delivery status, open rates, and campaign performance with detailed reports."
//     },
//     {
//       icon: Clock,
//       title: "Scheduled Messages",
//       description: "Schedule your messages for optimal delivery times and automated campaigns."
//     },
//     {
//       icon: Shield,
//       title: "Secure & Reliable",
//       description: "Bank-level security with 99.9% uptime guarantee and data encryption."
//     },
//     {
//       icon: Users,
//       title: "Contact Management",
//       description: "Organize your contacts with groups, tags, and smart filtering options."
//     },
//     {
//       icon: Globe,
//       title: "Global Reach",
//       description: "Send messages to 200+ countries with competitive international rates."
//     }
//   ];

//   return (
//     <section id="features" className="py-20 bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
//             Everything You Need to Succeed
//           </h2>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             Our comprehensive SMS platform provides all the tools you need to reach, 
//             engage, and convert your audience effectively.
//           </p>
//         </div>
        
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {features.map((feature, index) => {
//             const IconComponent = feature.icon;
//             return (
//               <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
//                 <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-6">
//                   <IconComponent className="h-6 w-6 text-red-600" />
//                 </div>
//                 <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
//                 <p className="text-gray-600 leading-relaxed">{feature.description}</p>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// };

// // Pricing Section
// const PricingSection = () => {
//   const pricingTiers = [
//     {
//       name: "Starter",
//       price: "3.50",
//       range: "1 - 4,999 SMS",
//       features: [
//         "Basic SMS sending",
//         "CSV bulk upload",
//         "Message templates",
//         "Basic analytics",
//         "Email support"
//       ],
//       bonus: "0%",
//       popular: false
//     },
//     {
//       name: "Business",
//       price: "3.00",
//       range: "20,000 - 49,999 SMS",
//       features: [
//         "Everything in Starter",
//         "Scheduled messaging",
//         "Advanced analytics",
//         "Custom sender IDs",
//         "Priority support",
//         "API access"
//       ],
//       bonus: "3%",
//       popular: true
//     },
//     {
//       name: "Enterprise",
//       price: "2.50",
//       range: "100,000+ SMS",
//       features: [
//         "Everything in Business",
//         "Dedicated account manager",
//         "White-label options",
//         "Advanced integrations",
//         "SLA guarantee",
//         "Custom pricing"
//       ],
//       bonus: "10%",
//       popular: false
//     }
//   ];

//   return (
//     <section id="pricing" className="py-20 bg-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
//             Transparent, Affordable Pricing
//           </h2>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             No hidden fees. No setup costs. Pay only for what you use with volume discounts 
//             and bonus credits on every purchase.
//           </p>
//         </div>
        
//         <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
//           {pricingTiers.map((tier, index) => (
//             <div 
//               key={index} 
//               className={`relative bg-white border rounded-2xl p-8 ${
//                 tier.popular 
//                   ? 'border-red-500 shadow-lg transform scale-105' 
//                   : 'border-gray-200 hover:shadow-lg'
//               } transition-all`}
//             >
//               {tier.popular && (
//                 <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
//                   <span className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium">
//                     Most Popular
//                   </span>
//                 </div>
//               )}
              
//               <div className="text-center mb-8">
//                 <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
//                 <div className="mb-4">
//                   <span className="text-4xl font-bold text-red-600">₦{tier.price}</span>
//                   <span className="text-gray-600 ml-2">per SMS</span>
//                 </div>
//                 <p className="text-gray-600">{tier.range}</p>
//                 {tier.bonus !== "0%" && (
//                   <div className="mt-2">
//                     <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
//                       +{tier.bonus} Bonus Credits
//                     </span>
//                   </div>
//                 )}
//               </div>
              
//               <ul className="space-y-4 mb-8">
//                 {tier.features.map((feature, featureIndex) => (
//                   <li key={featureIndex} className="flex items-center">
//                     <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
//                     <span className="text-gray-700">{feature}</span>
//                   </li>
//                 ))}
//               </ul>
              
//               <Link
//                 to="/register"
//                 className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
//                   tier.popular
//                     ? 'bg-red-600 text-white hover:bg-red-700'
//                     : 'bg-gray-900 text-white hover:bg-gray-800'
//                 }`}
//               >
//                 Get Started
//               </Link>
//             </div>
//           ))}
//         </div>
        
//         <div className="mt-12 text-center">
//           <div className="inline-flex items-center bg-blue-50 rounded-lg p-6">
//             <TrendingUp className="h-8 w-8 text-blue-600 mr-4" />
//             <div className="text-left">
//               <h4 className="font-semibold text-blue-900">Volume Discounts Available</h4>
//               <p className="text-blue-700">Need more than 100,000 SMS per month? Contact us for custom pricing.</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// // Trust Section
// const TrustSection = () => {
//   return (
//     <section className="py-16 bg-gray-900 text-white">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold mb-4">Trusted by Leading Businesses</h2>
//           <p className="text-gray-300 text-lg">Join thousands of companies that rely on our platform</p>
//         </div>
        
//         <div className="grid md:grid-cols-4 gap-8">
//           <div className="text-center">
//             <div className="text-3xl font-bold text-red-400 mb-2">99.9%</div>
//             <div className="text-gray-300">Uptime Guarantee</div>
//           </div>
//           <div className="text-center">
//             <div className="text-3xl font-bold text-red-400 mb-2">2.4M+</div>
//             <div className="text-gray-300">Messages Daily</div>
//           </div>
//           <div className="text-center">
//             <div className="text-3xl font-bold text-red-400 mb-2">15K+</div>
//             <div className="text-gray-300">Active Users</div>
//           </div>
//           <div className="text-center">
//             <div className="text-3xl font-bold text-red-400 mb-2">200+</div>
//             <div className="text-gray-300">Countries Served</div>
//           </div>
//         </div>
        
//         <div className="mt-12 grid md:grid-cols-3 gap-8">
//           <div className="bg-gray-800 rounded-lg p-6">
//             <div className="flex items-center mb-4">
//               {[...Array(5)].map((_, i) => (
//                 <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
//               ))}
//             </div>
//             <p className="text-gray-300 mb-4">
//               "SMS Platform has transformed how we communicate with our customers. 
//               The reliability and ease of use are unmatched."
//             </p>
//             <div className="font-semibold">- Marketing Director, TechCorp</div>
//           </div>
          
//           <div className="bg-gray-800 rounded-lg p-6">
//             <div className="flex items-center mb-4">
//               {[...Array(5)].map((_, i) => (
//                 <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
//               ))}
//             </div>
//             <p className="text-gray-300 mb-4">
//               "Outstanding delivery rates and excellent customer support. 
//               Our campaigns have never performed better."
//             </p>
//             <div className="font-semibold">- CEO, RetailPlus</div>
//           </div>
          
//           <div className="bg-gray-800 rounded-lg p-6">
//             <div className="flex items-center mb-4">
//               {[...Array(5)].map((_, i) => (
//                 <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
//               ))}
//             </div>
//             <p className="text-gray-300 mb-4">
//               "The analytics and reporting features give us incredible insights 
//               into our messaging campaigns. Highly recommended!"
//             </p>
//             <div className="font-semibold">- CTO, StartupCo</div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// // Contact Section
// const ContactSection = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     subject: '',
//     message: ''
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle contact form submission
//     console.log('Contact form submitted:', formData);
//     alert('Thank you for your message! We\'ll get back to you soon.');
//     setFormData({ name: '', email: '', subject: '', message: '' });
//   };

//   return (
//     <section id="contact" className="py-20 bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid lg:grid-cols-2 gap-12">
//           <div>
//             <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
//             <p className="text-lg text-gray-600 mb-8">
//               Have questions about our SMS platform? Our team is here to help you 
//               get started and maximize your messaging success.
//             </p>
            
//             <div className="space-y-6">
//               <div className="flex items-start">
//                 <MessageSquare className="h-6 w-6 text-red-600 mr-4 mt-1" />
//                 <div>
//                   <h3 className="font-semibold text-gray-900">Email Support</h3>
//                   <p className="text-gray-600">support@Prime Sms.com</p>
//                   <p className="text-sm text-gray-500">Response within 2 hours</p>
//                 </div>
//               </div>
              
//               <div className="flex items-start">
//                 <Shield className="h-6 w-6 text-red-600 mr-4 mt-1" />
//                 <div>
//                   <h3 className="font-semibold text-gray-900">Security & Compliance</h3>
//                   <p className="text-gray-600">GDPR compliant with bank-level security</p>
//                   <p className="text-sm text-gray-500">Your data is always protected</p>
//                 </div>
//               </div>
              
//               <div className="flex items-start">
//                 <Users className="h-6 w-6 text-red-600 mr-4 mt-1" />
//                 <div>
//                   <h3 className="font-semibold text-gray-900">Account Management</h3>
//                   <p className="text-gray-600">Dedicated support for enterprise clients</p>
//                   <p className="text-sm text-gray-500">Custom solutions available</p>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-xl shadow-sm p-8">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Your Name
//                   </label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.name}
//                     onChange={(e) => setFormData({...formData, name: e.target.value})}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Email Address
//                   </label>
//                   <input
//                     type="email"
//                     required
//                     value={formData.email}
//                     onChange={(e) => setFormData({...formData, email: e.target.value})}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                   />
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Subject
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.subject}
//                   onChange={(e) => setFormData({...formData, subject: e.target.value})}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Message
//                 </label>
//                 <textarea
//                   rows={4}
//                   required
//                   value={formData.message}
//                   onChange={(e) => setFormData({...formData, message: e.target.value})}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                 ></textarea>
//               </div>
              
//               <button
//                 type="submit"
//                 className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold"
//               >
//                 Send Message
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// // Footer Component
// const Footer = () => {
//   return (
//     <footer className="bg-gray-900 text-white py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid md:grid-cols-4 gap-8">
//           <div className="col-span-2 md:col-span-1">
//             <div className="flex items-center mb-4">
//               <MessageSquare className="h-8 w-8 text-red-500 mr-2" />
//               <span className="text-xl font-bold">SMS Platform</span>
//             </div>
//             <p className="text-gray-400 mb-4">
//               The most reliable SMS platform for businesses of all sizes. 
//               Reach your customers instantly with our powerful messaging tools.
//             </p>
//             <div className="flex space-x-4">
//               <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
//               <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
//               <div className="w-8 h-8 bg-gray-800 rounded-full"></div>
//             </div>
//           </div>
          
//           <div>
//             <h3 className="font-semibold mb-4">Product</h3>
//             <ul className="space-y-2 text-gray-400">
//               <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
//               <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
//               <li><a href="/login" className="hover:text-white transition-colors">API Docs</a></li>
//               <li><a href="/login" className="hover:text-white transition-colors">Integrations</a></li>
//             </ul>
//           </div>
          
//           <div>
//             <h3 className="font-semibold mb-4">Company</h3>
//             <ul className="space-y-2 text-gray-400">
//               <li><a href="#contact" className="hover:text-white transition-colors">About Us</a></li>
//               <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
//               <li><a href="#contact" className="hover:text-white transition-colors">Support</a></li>
//               <li><a href="#contact" className="hover:text-white transition-colors">Blog</a></li>
//             </ul>
//           </div>
          
//           <div>
//             <h3 className="font-semibold mb-4">Legal</h3>
//             <ul className="space-y-2 text-gray-400">
//               <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
//               <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
//               <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
//               <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
//             </ul>
//           </div>
//         </div>
        
//         <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
//           <p>&copy; 2025 Prime Sms. All rights reserved. Built with ❤️ for businesses worldwide.</p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// // Main HomePage Component
// function HomePage() {
//   return (
//     <div className="min-h-screen">
//       {/* SEO Meta Tags */}
//       <head>
//         <title>Prime Sms - Reliable Bulk SMS Service for Businesses</title>
//         <meta name="description" content="Send bulk SMS messages to your customers with our reliable, affordable SMS platform. Start with 100 free credits. No setup fees, transparent pricing." />
//         <meta name="keywords" content="bulk sms, sms marketing, business messaging, sms api, nigeria sms, paystack sms, africa talking sms" />
//         <meta name="author" content="Prime Sms" />
//         <meta name="robots" content="index, follow" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
//         {/* Open Graph Meta Tags */}
//         <meta property="og:title" content="SMS Platform - Reliable Bulk SMS Service for Businesses" />
//         <meta property="og:description" content="Send bulk SMS messages with our reliable platform. 100 free credits, transparent pricing, 99.9% uptime." />
//         <meta property="og:type" content="website" />
//         <meta property="og:url" content="https://www.primesms.com.ng" />
//         <meta property="og:image" content="https://www.primesms.com.ng/og-image.jpg" />
//         <meta property="og:site_name" content="Prime Sms" />
        
//         {/* Twitter Card Meta Tags */}
//         <meta name="twitter:card" content="summary_large_image" />
//         <meta name="twitter:title" content="SMS Platform - Reliable Bulk SMS Service" />
//         <meta name="twitter:description" content="Send bulk SMS messages with our reliable platform. 100 free credits, transparent pricing." />
//         <meta name="twitter:image" content="https://www.primesms.com.ng/twitter-image.jpg" />
        
//         {/* Additional SEO */}
//         <link rel="canonical" href="https://www.primesms.com.ng" />
//         <meta name="theme-color" content="#dc2626" />
//       </head>

//       <Header />
//       <HeroSection />
//       <FeaturesSection />
//       <PricingSection />
//       <TrustSection />
//       <ContactSection />
//       <Footer />
//     </div>
//   );
// }

// export default HomePage;























import React, { useState, useEffect } from 'react';
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
  X,
  ChevronRight,
  Sparkles,
  Lock,
  Smartphone,
  Mail,
  Phone,
  Building,
  Target,
  Rocket,
  Play,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime;
    let animationFrame;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      setCount(Math.floor(end * percentage));
      
      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  
  return <span>{count.toLocaleString()}{suffix}</span>;
};

// Header Component with Glass Effect
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-lg shadow-lg' 
        : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center group cursor-pointer">
            <div className="relative">
              <MessageSquare className="h-10 w-10 text-red-600 transition-transform group-hover:scale-110" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="ml-3">
              <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                Prime SMS
              </span>
              <div className="text-xs text-gray-500 -mt-1">Instant Delivery</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <a href="#features" className="px-4 py-2 text-gray-700 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all">
              Features
            </a>
            <a href="#solutions" className="px-4 py-2 text-gray-700 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all">
              Solutions
            </a>
            <a href="#pricing" className="px-4 py-2 text-gray-700 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all">
              Pricing
            </a>
            <a href="#testimonials" className="px-4 py-2 text-gray-700 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all">
              Reviews
            </a>
            <a href="#contact" className="px-4 py-2 text-gray-700 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all">
              Contact
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link to="/login">
               <button className="px-5 py-2.5 text-gray-700 hover:text-red-600 font-medium transition-colors">
              Sign In
            </button>
            </Link>
            <Link to="/register">
                <button className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/50 transition-all transform hover:scale-105 font-medium">
              Get Started 
            </button>
            </Link>
           
            
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t bg-white/95 backdrop-blur-lg">
            <div className="flex flex-col space-y-1">
              <a href="#features" className="px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all">
                Features
              </a>
              <a href="#solutions" className="px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all">
                Solutions
              </a>
              <a href="#pricing" className="px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all">
                Pricing
              </a>
              <a href="#testimonials" className="px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all">
                Reviews
              </a>
              <a href="#contact" className="px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all">
                Contact
              </a>
              <div className="pt-4 border-t space-y-2">
               <Link to="/login">
                 <button className="w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all">
                  Sign In
                </button>
               </Link>
                <Link to="/register">
                   <button className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition-all">
                    Get Started
                  </button>
                </Link>
               
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

// Enhanced Hero Section
const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center rounded-full px-5 py-2 shadow-md border border-red-100 group hover:shadow-lg transition-all cursor-pointer">
              {/* <Sparkles className="h-4 w-4 text-red-600 mr-2 animate-pulse" />
              <span className="text-sm font-semibold text-gray-700">
                100 Free SMS Credits on Signup
              </span>
              <ChevronRight className="h-4 w-4 ml-2 text-red-600 group-hover:translate-x-1 transition-transform" /> */}
            </div>
            
            <div>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="bg-gradient-to-r from-gray-900 via-red-800 to-red-600 bg-clip-text text-transparent">
                  Connect With
                </span>
                <br />
                <span className="text-red-600">Millions Instantly</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Enterprise-grade SMS platform trusted by businesses across Africa. 
                Send personalized messages at scale with <span className="font-semibold text-red-600">99.9% delivery rate</span> and 
                real-time analytics.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold hover:shadow-2xl hover:shadow-red-500/50 transition-all transform hover:scale-105 flex items-center justify-center">
                Start Sending Free
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold border-2 border-gray-200 hover:border-red-600 hover:text-red-600 transition-all flex items-center justify-center">
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-8 pt-4">
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-gray-600">No Credit Card Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-gray-600">Cancel Anytime</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-600" />
                <span className="text-gray-600">24/7 Support</span>
              </div>
            </div>
          </div>
          
          {/* Right Content - Dashboard Preview */}
          <div className="relative">
            {/* Floating Card 1 */}
            <div className="absolute -top-8 -left-8 bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 animate-float">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-xl">
                  <Send className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Messages Sent</div>
                  <div className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter end={2400} suffix="K+" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Dashboard Card */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 shadow-2xl border border-gray-200">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Live Campaign</h3>
                  <span className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                    <span>Active</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Delivery Rate</div>
                    <div className="text-3xl font-bold text-red-600">99.8%</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <div className="text-sm text-gray-600 mb-1">Avg. Speed</div>
                    <div className="text-3xl font-bold text-blue-600">2.3s</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Campaign Progress</span>
                    <span className="font-semibold text-gray-900">8,432 / 10,000</span>
                  </div>
                  <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="absolute h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-1000" 
                         style={{width: '84%'}}></div>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Active Users</span>
                    <span className="font-bold text-gray-900">15,234</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Countries Reached</span>
                    <span className="font-bold text-gray-900">200+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Card 2 */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 animate-float" style={{animationDelay: '1s'}}>
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Uptime</div>
                  <div className="text-2xl font-bold text-gray-900">99.9%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

// Solutions Section (New)
const SolutionsSection = () => {
  const solutions = [
    {
      icon: Building,
      title: "Enterprise",
      description: "Scalable SMS infrastructure for large organizations with dedicated support and custom integrations.",
      features: ["Custom API", "SLA Guarantee", "Dedicated Manager"]
    },
    {
      icon: Target,
      title: "Marketing",
      description: "Drive conversions with targeted campaigns, A/B testing, and detailed performance analytics.",
      features: ["Campaign Builder", "Segmentation", "Analytics"]
    },
    {
      icon: Smartphone,
      title: "Notifications",
      description: "Keep customers informed with transactional alerts, reminders, and status updates.",
      features: ["Auto-Triggers", "Templates", "Real-time"]
    }
  ];

  return (
    <section id="solutions" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-red-50 text-red-600 rounded-full px-4 py-2 mb-4">
            <Rocket className="h-4 w-4 mr-2" />
            <span className="text-sm font-semibold">Solutions</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Built For Every Use Case
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're sending marketing campaigns or securing user accounts, 
            we have the perfect solution for your business needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {solutions.map((solution, index) => {
            const IconComponent = solution.icon;
            return (
              <div key={index} className="group bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-200 hover:border-red-300 hover:shadow-xl transition-all cursor-pointer">
                <div className="bg-red-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <IconComponent className="h-7 w-7 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{solution.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{solution.description}</p>
                <div className="space-y-2">
                  {solution.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Enhanced Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: Send,
      title: "Bulk SMS Sending",
      description: "Upload CSV files with thousands of contacts and send personalized messages instantly with merge tags and dynamic content.",
      stats: "10K+ msgs/min"
    },
    {
      icon: BarChart,
      title: "Advanced Analytics",
      description: "Real-time dashboards with delivery reports, click tracking, conversion metrics, and ROI analysis for data-driven decisions.",
      stats: "Real-time tracking"
    },
    {
      icon: Clock,
      title: "Smart Scheduling",
      description: "Schedule campaigns for optimal send times based on time zones, with recurring messages and automated drip campaigns.",
      stats: "Auto-optimize"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption, GDPR compliance, ISO certified infrastructure with 99.9% uptime SLA and data redundancy.",
      stats: "99.9% uptime"
    },
    {
      icon: Users,
      title: "Contact Management",
      description: "Advanced segmentation with custom fields, smart lists, import/export tools, and automated list cleaning.",
      stats: "Unlimited contacts"
    },
   
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-red-50 text-red-600 rounded-full px-4 py-2 mb-4">
            <Zap className="h-4 w-4 mr-2" />
            <span className="text-sm font-semibold">Powerful Features</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need & More
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Industry-leading features designed to help you reach, engage, and convert your audience with precision and efficiency.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="group relative bg-white p-8 rounded-2xl border border-gray-200 hover:border-red-300 hover:shadow-2xl transition-all">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-t-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
                
                <div className="flex items-start justify-between mb-6">
                  <div className="bg-gradient-to-br from-red-500 to-red-600 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <IconComponent className="h-7 w-7 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                    {feature.stats}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                
                <div className="mt-6">
                 
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Enhanced Pricing Section
const PricingSection = () => {
  const pricingTiers = [
    {
      name: "Starter",
      price: "3.50",
      range: "1 - 4,999 SMS",
      description: "Perfect for small businesses and startups testing SMS marketing",
      features: [
        "Basic SMS sending",
        "CSV bulk upload",
        "Message templates",
        "Basic analytics dashboard",
        "Email support (24h response)",
        "Contact management"
      ],
      bonus: "0%",
      popular: false,
      color: "gray"
    },
    {
      name: "Business",
      price: "3.00",
      range: "20,000 - 49,999 SMS",
      description: "Ideal for growing businesses with regular campaigns",
      features: [
        "Everything in Starter",
        "Scheduled messaging",
        "Advanced analytics & reports",
        "Custom sender IDs",
        "Priority support (2h response)",
        "API access",
        "A/B testing",
        "Link tracking"
      ],
      bonus: "3%",
      popular: true,
      color: "red"
    },
    {
      name: "Enterprise",
      price: "2.50",
      range: "100,000+ SMS",
      description: "For large organizations requiring advanced features",
      features: [
        "Everything in Business",
        "Dedicated account manager",
        "White-label options",
        "Advanced integrations",
        "99.9% SLA guarantee",
        "Custom pricing & contracts",
        "Multiple user accounts",
        "Custom reporting"
      ],
      bonus: "10%",
      popular: false,
      color: "blue"
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-red-50 text-red-600 rounded-full px-4 py-2 mb-4">
            <TrendingUp className="h-4 w-4 mr-2" />
            <span className="text-sm font-semibold">Transparent Pricing</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Simple, Predictable Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            No hidden fees, no setup costs, no surprises. Pay only for what you use with automatic volume discounts and bonus credits on every purchase.
          </p>
          <div className="inline-flex items-center bg-green-50 text-green-700 rounded-lg px-6 py-3 border border-green-200">
            <Check className="h-5 w-5 mr-2" />
            <span className="font-semibold">100 Free SMS Credits on Signup - No Credit Card Required</span>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <div 
              key={index} 
              className={`relative bg-gradient-to-br ${
                tier.popular 
                  ? 'from-red-50 to-orange-50 border-2 border-red-500 shadow-2xl transform scale-105' 
                  : 'from-white to-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-xl'
              } rounded-3xl p-8 transition-all`}
            >
              {tier.popular && (
                <>
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center">
                      <Star className="h-4 w-4 mr-1 fill-current" />
                      Most Popular
                    </span>
                  </div>
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-t-3xl"></div>
                </>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-gray-600 text-sm mb-6">{tier.description}</p>
                <div className="mb-4">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-gray-900">₦{tier.price}</span>
                    <span className="text-gray-600 ml-2">per SMS</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">{tier.range}</div>
                </div>
                {tier.bonus !== "0%" && (
                  <div className="inline-flex items-center bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
                    <Sparkles className="h-4 w-4 mr-1" />
                    +{tier.bonus} Bonus Credits
                  </div>
                )}
              </div>
              
              <div className="space-y-4 mb-8">
                {tier.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-gray-700 ml-3">{feature}</span>
                  </div>
                ))}
              </div>
              
              <button
                className={`w-full py-4 px-6 rounded-xl font-bold transition-all transform hover:scale-105 ${
                  tier.popular
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-2xl hover:shadow-red-500/50'
                    : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg'
                }`}
              >
                Get Started {tier.popular && '→'}
              </button>
            </div>
          ))}
        </div>
        
        {/* Volume Discount Info */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center">
              <div className="bg-blue-500 p-4 rounded-xl mr-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-xl text-gray-900 mb-1">Need More Volume?</h4>
                <p className="text-gray-700">Custom enterprise pricing for 100,000+ SMS per month with dedicated support.</p>
              </div>
            </div>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all whitespace-nowrap border border-blue-200">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Adebayo Oluwaseun",
      role: "Marketing Director",
      company: "TechHub Nigeria",
      avatar: "AO",
      rating: 5,
      text: "Prime SMS has revolutionized our customer engagement. The delivery rate is exceptional, and the analytics help us optimize every campaign. We've seen a 45% increase in customer response rates.",
      metric: "45% ↑ Response Rate"
    },
    {
      name: "Chioma Nwosu",
      role: "CEO",
      company: "RetailMax",
      avatar: "CN",
      rating: 5,
      text: "The bulk SMS feature saved us countless hours. We can now reach 50,000 customers in minutes with personalized messages. The ROI has been outstanding, and customer support is always responsive.",
      metric: "50K customers reached"
    },
    {
      name: "Ibrahim Yusuf",
      role: "CTO",
      company: "FinanceFlow",
      avatar: "IY",
      rating: 5,
      text: "Security and reliability are critical for our 2FA implementation. Prime SMS delivers OTPs instantly with 99.9% uptime. The API integration was seamless, and their documentation is excellent.",
      metric: "99.9% Uptime"
    },
    {
      name: "Funke Adeyemi",
      role: "Operations Manager",
      company: "LogisticsPlus",
      avatar: "FA",
      rating: 5,
      text: "We use Prime SMS for delivery notifications across Nigeria. The scheduled messaging and real-time tracking have improved our customer satisfaction scores by 60%. Absolutely worth it!",
      metric: "60% ↑ Satisfaction"
    },
    {
      name: "Emeka Okafor",
      role: "Growth Lead",
      company: "StartupHub",
      avatar: "EO",
      rating: 5,
      text: "As a startup, the free credits and pay-as-you-go model were perfect for us. The platform is intuitive, and we've scaled from 1,000 to 100,000 messages per month without any issues.",
      metric: "100x Growth"
    },
    {
      name: "Aisha Mohammed",
      role: "Marketing Manager",
      company: "EduLearn",
      avatar: "AM",
      rating: 5,
      text: "The segmentation and personalization features are game-changers. We can target students based on their courses and send relevant updates. Our engagement rates have never been higher!",
      metric: "3x Engagement"
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-yellow-50 text-yellow-700 rounded-full px-4 py-2 mb-4">
            <Star className="h-4 w-4 mr-2 fill-current" />
            <span className="text-sm font-semibold">Customer Stories</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Loved by Businesses Across Africa
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of companies that trust Prime SMS for their communication needs. 
            Here's what they have to say about us.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-red-200 transition-all group"
            >
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              {/* Metric Badge */}
              <div className="inline-flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <TrendingUp className="h-4 w-4 mr-2" />
                {testimonial.metric}
              </div>

              {/* Author Info */}
              <div className="flex items-center pt-6 border-t">
                <div className="bg-gradient-to-br from-red-500 to-orange-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-sm text-red-600 font-semibold">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-white">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">
                <AnimatedCounter end={15000} suffix="+" />
              </div>
              <div className="text-red-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">
                <AnimatedCounter end={2400000} suffix="+" />
              </div>
              <div className="text-red-100">Messages Daily</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">
                <AnimatedCounter end={99} suffix=".9%" />
              </div>
              <div className="text-red-100">Delivery Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">
                <AnimatedCounter end={200} suffix="+" />
              </div>
              <div className="text-red-100">Countries</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Enhanced Contact Section
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    alert('Thank you for reaching out! Our team will contact you within 2 hours.');
    setFormData({ name: '', email: '', phone: '', company: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Support",
      detail: "support@primesms.com.ng",
      subdDetail: "Response within 2 hours",
      color: "red"
    },
    {
      icon: Phone,
      title: "Phone Support",
      detail: "+234 (0) 800 PRIME SMS",
      subdDetail: "Mon-Fri, 8am-6pm WAT",
      color: "blue"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      detail: "Chat with our team",
      subdDetail: "Available 24/7",
      color: "green"
    }
  ];

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-red-50 text-red-600 rounded-full px-4 py-2 mb-4">
            <MessageSquare className="h-4 w-4 mr-2" />
            <span className="text-sm font-semibold">Get In Touch</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            We're Here to Help
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions? Our expert team is ready to help you get started and maximize your SMS success.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {contactInfo.map((info, index) => {
            const IconComponent = info.icon;
            const colorClasses = {
              red: 'bg-red-100 text-red-600',
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600'
            };
            
            return (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all group">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${colorClasses[info.color]}`}>
                  <IconComponent className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">{info.title}</h3>
                <p className="text-gray-900 font-semibold mb-1">{info.detail}</p>
                <p className="text-sm text-gray-600">{info.subdDetail}</p>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Side - Additional Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Prime SMS?</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-lg mr-4 mt-1">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Lightning Fast Setup</h4>
                    <p className="text-gray-600">Get started in under 5 minutes with no technical knowledge required.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-lg mr-4 mt-1">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">24/7 Expert Support</h4>
                    <p className="text-gray-600">Our dedicated team is always available to help you succeed.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-lg mr-4 mt-1">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">No Hidden Fees</h4>
                    <p className="text-gray-600">Transparent pricing with volume discounts and bonus credits.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-lg mr-4 mt-1">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Enterprise-Grade Security</h4>
                    <p className="text-gray-600">Bank-level encryption and GDPR compliance as standard.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                <Shield className="h-5 w-5 text-blue-600 mr-2" />
                Security & Compliance
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white rounded-lg p-3 text-center border border-blue-100">
                  <div className="font-bold text-blue-600">GDPR</div>
                  <div className="text-gray-600 text-xs">Compliant</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-blue-100">
                  <div className="font-bold text-blue-600">ISO 27001</div>
                  <div className="text-gray-600 text-xs">Certified</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-blue-100">
                  <div className="font-bold text-blue-600">SSL</div>
                  <div className="text-gray-600 text-xs">Encrypted</div>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-blue-100">
                  <div className="font-bold text-blue-600">99.9%</div>
                  <div className="text-gray-600 text-xs">Uptime SLA</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="john@company.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="+234 800 000 0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    placeholder="Your Company"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                  placeholder="Tell us about your SMS needs..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 px-6 rounded-xl hover:shadow-2xl hover:shadow-red-500/50 transition-all font-bold transform hover:scale-105 flex items-center justify-center"
              >
                Send Message
                <Send className="h-5 w-5 ml-2" />
              </button>

              <p className="text-sm text-gray-600 text-center">
                We'll respond within 2 hours during business hours
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// Enhanced Footer
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <MessageSquare className="h-10 w-10 text-red-500 mr-3" />
              <div>
                <span className="text-2xl font-bold">Prime SMS</span>
                <div className="text-xs text-gray-400">Powered by Technology</div>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Africa's most reliable SMS platform for businesses of all sizes. 
              Reach your customers instantly with enterprise-grade messaging tools and 99.9% uptime.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                <span className="sr-only">Facebook</span>
                <div className="w-5 h-5 bg-white rounded-full"></div>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                <span className="sr-only">Twitter</span>
                <div className="w-5 h-5 bg-white rounded-full"></div>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <div className="w-5 h-5 bg-white rounded-full"></div>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                <span className="sr-only">Instagram</span>
                <div className="w-5 h-5 bg-white rounded-full"></div>
              </a>
            </div>
          </div>
          
          {/* Product Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="#features" className="text-gray-400 hover:text-red-500 transition-colors flex items-center group">
                <ChevronRight className="h-4 w-4 mr-1 group-hover:translate-x-1 transition-transform" />
                Features
              </a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-red-500 transition-colors flex items-center group">
                <ChevronRight className="h-4 w-4 mr-1 group-hover:translate-x-1 transition-transform" />
                Pricing
              </a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors flex items-center group">
                <ChevronRight className="h-4 w-4 mr-1 group-hover:translate-x-1 transition-transform" />
                API Docs
              </a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors flex items-center group">
                <ChevronRight className="h-4 w-4 mr-1 group-hover:translate-x-1 transition-transform" />
                Integrations
              </a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors flex items-center group">
                <ChevronRight className="h-4 w-4 mr-1 group-hover:translate-x-1 transition-transform" />
                Status
              </a></li>
            </ul>
          </div>
          
          {/* Company Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors flex items-center group">
                <ChevronRight className="h-4 w-4 mr-1 group-hover:translate-x-1 transition-transform" />
                About Us
              </a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-red-500 transition-colors flex items-center group">
                <ChevronRight className="h-4 w-4 mr-1 group-hover:translate-x-1 transition-transform" />
                Contact
              </a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors flex items-center group">
                <ChevronRight className="h-4 w-4 mr-1 group-hover:translate-x-1 transition-transform" />
                Careers
              </a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors flex items-center group">
                <ChevronRight className="h-4 w-4 mr-1 group-hover:translate-x-1 transition-transform" />
                Blog
              </a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors flex items-center group">
                <ChevronRight className="h-4 w-4 mr-1 group-hover:translate-x-1 transition-transform" />
                Partners
              </a></li>
            </ul>
          </div>
          
          {/* Legal Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors flex items-center group">
                <ChevronRight className="h-4 w-4 mr-1 group-hover:translate-x-1 transition-transform" />
                Privacy Policy
              </a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors flex items-center group">
                <ChevronRight className="h-4 w-4 mr-1 group-hover:translate-x-1 transition-transform" />
                Terms of Service
              </a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors flex items-center group">
                <ChevronRight className="h-4 w-4 mr-1 group-hover:translate-x-1 transition-transform" />
                GDPR
              </a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors flex items-center group">
                <ChevronRight className="h-4 w-4 mr-1 group-hover:translate-x-1 transition-transform" />
                Cookie Policy
              </a></li>
              <li><a href="#" className="text-gray-400 hover:text-red-500 transition-colors flex items-center group">
                <ChevronRight className="h-4 w-4 mr-1 group-hover:translate-x-1 transition-transform" />
                Acceptable Use
              </a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 Prime SMS. All rights reserved. Built with ❤️ for businesses worldwide.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-green-500" />
                SSL Secured
              </span>
              <span className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-green-500" />
                GDPR Compliant
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main HomePage Component
function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <SolutionsSection />
      <FeaturesSection />
      <PricingSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default HomePage;