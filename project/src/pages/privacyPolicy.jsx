import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Shield, FileText, ChevronDown, ChevronUp } from 'lucide-react';

function PrivacyTermsPage() {
  const [activeTab, setActiveTab] = useState('privacy');
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-red-600" />
              <span className="text-xl font-bold text-gray-900">Prime Sms</span>
            </Link>
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Legal Information</h1>
          <p className="text-lg text-gray-600">
            Our commitment to transparency and your rights
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('privacy')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                activeTab === 'privacy'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Privacy Policy</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('terms')}
              className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                activeTab === 'terms'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Terms of Service</span>
              </div>
            </button>
          </div>

          {/* Content Area */}
          <div className="p-8">
            {activeTab === 'privacy' ? <PrivacyPolicy expandedSections={expandedSections} toggleSection={toggleSection} /> : <TermsOfService expandedSections={expandedSections} toggleSection={toggleSection} />}
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Last updated: October 10, 2025
          </p>
          <p className="text-sm text-gray-600">
            Questions? Contact us at{' '}
            <a href="mailto:legal@Prime Sms.com" className="text-red-600 hover:text-red-700 font-medium">
              legal@PrimeSms.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function PrivacyPolicy({ expandedSections, toggleSection }) {
  const sections = [
    {
      id: 'collection',
      title: 'Information We Collect',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">We collect information that you provide directly to us, including:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Account information (name, email address, phone number, company name)</li>
            <li>Payment information (processed securely through our payment partners)</li>
            <li>SMS messages and contact lists you upload to our platform</li>
            <li>Usage data and analytics to improve our services</li>
            <li>Communications with our support team</li>
          </ul>
          <p className="text-gray-700">
            We automatically collect certain information about your device and how you interact with our services, including IP address, browser type, operating system, and usage patterns.
          </p>
        </div>
      )
    },
    {
      id: 'usage',
      title: 'How We Use Your Information',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">We use the information we collect to:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Provide, maintain, and improve our SMS services</li>
            <li>Process your transactions and send you related information</li>
            <li>Send you technical notices, updates, and support messages</li>
            <li>Respond to your comments, questions, and customer service requests</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
            <li>Detect, prevent, and address technical issues and fraudulent activity</li>
            <li>Comply with legal obligations and enforce our terms</li>
          </ul>
        </div>
      )
    },
    {
      id: 'sharing',
      title: 'Information Sharing',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">We do not sell your personal information. We may share your information in the following circumstances:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li><strong>Service Providers:</strong> We work with third-party service providers who perform services on our behalf, such as payment processing and data analytics</li>
            <li><strong>Legal Requirements:</strong> We may disclose your information if required by law or in response to valid legal requests</li>
            <li><strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of assets, your information may be transferred</li>
            <li><strong>With Your Consent:</strong> We may share your information with your explicit consent</li>
          </ul>
        </div>
      )
    },
    {
      id: 'security',
      title: 'Data Security',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. These measures include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments and updates</li>
            <li>Access controls and authentication requirements</li>
            <li>Secure data centers with physical security measures</li>
            <li>Employee training on data protection practices</li>
          </ul>
          <p className="text-gray-700">
            However, no security system is impenetrable. We cannot guarantee the security of our databases, nor can we guarantee that information you supply will not be intercepted while being transmitted over the Internet.
          </p>
        </div>
      )
    },
    {
      id: 'rights',
      title: 'Your Rights',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">Depending on your location, you may have certain rights regarding your personal information:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
            <li><strong>Deletion:</strong> Request deletion of your personal information</li>
            <li><strong>Portability:</strong> Request a copy of your data in a structured, machine-readable format</li>
            <li><strong>Objection:</strong> Object to our processing of your personal information</li>
            <li><strong>Withdraw Consent:</strong> Withdraw your consent at any time where we rely on consent</li>
          </ul>
          <p className="text-gray-700">
            To exercise these rights, please contact us at privacy@Prime Sms.com. We will respond to your request within 30 days.
          </p>
        </div>
      )
    },
    {
      id: 'retention',
      title: 'Data Retention',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
          </p>
          <p className="text-gray-700">
            Factors we consider in determining retention periods include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>The length of time we have an ongoing relationship with you</li>
            <li>Whether there is a legal obligation to retain the data</li>
            <li>Whether retention is advisable in light of our legal position</li>
          </ul>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <p className="text-gray-700 leading-relaxed">
          At Prime Sms, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our SMS messaging services.
        </p>
      </div>

      {sections.map((section) => (
        <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
          >
            <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
            {expandedSections[section.id] ? (
              <ChevronUp className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-600" />
            )}
          </button>
          {expandedSections[section.id] && (
            <div className="px-6 py-4 bg-white">
              {section.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function TermsOfService({ expandedSections, toggleSection }) {
  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            By accessing or using Prime Sms's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.
          </p>
          <p className="text-gray-700">
            We reserve the right to update or modify these terms at any time without prior notice. Your continued use of the service after any such changes constitutes your acceptance of the new Terms of Service.
          </p>
        </div>
      )
    },
    {
      id: 'account',
      title: 'Account Registration',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">To use our services, you must:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Be at least 18 years old or have parental/guardian consent</li>
            <li>Provide accurate, current, and complete information during registration</li>
            <li>Maintain the security of your account credentials</li>
            <li>Promptly update your account information to keep it accurate</li>
            <li>Accept responsibility for all activities under your account</li>
          </ul>
          <p className="text-gray-700">
            You are responsible for safeguarding your password and any activities or actions under your account. We recommend using a strong, unique password and enabling two-factor authentication when available.
          </p>
        </div>
      )
    },
    {
      id: 'usage',
      title: 'Acceptable Use Policy',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">You agree not to use our services to:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Send spam, unsolicited messages, or violate anti-spam laws</li>
            <li>Send messages containing illegal, harmful, or offensive content</li>
            <li>Violate any applicable local, state, national, or international law</li>
            <li>Impersonate any person or entity or misrepresent your affiliation</li>
            <li>Interfere with or disrupt the services or servers</li>
            <li>Attempt to gain unauthorized access to any portion of the service</li>
            <li>Use the service for fraudulent purposes or phishing attempts</li>
            <li>Harvest or collect user information without consent</li>
          </ul>
          <p className="text-gray-700">
            Violation of this policy may result in immediate termination of your account and legal action.
          </p>
        </div>
      )
    },
    {
      id: 'billing',
      title: 'Billing and Payment',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            Our pricing is based on the number of SMS messages sent and additional features used. Key billing terms include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Charges are based on successfully delivered messages</li>
            <li>Credits purchased do not expire unless specified</li>
            <li>Subscription fees are billed in advance on a recurring basis</li>
            <li>You authorize us to charge your payment method for all fees incurred</li>
            <li>Failed payments may result in service suspension</li>
            <li>Refunds are subject to our refund policy</li>
          </ul>
          <p className="text-gray-700">
            We reserve the right to change our pricing with 30 days notice. Price changes will not affect your current billing cycle.
          </p>
        </div>
      )
    },
    {
      id: 'termination',
      title: 'Termination',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            We may terminate or suspend your account and access to our services immediately, without prior notice or liability, for any reason, including:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Breach of these Terms of Service</li>
            <li>Violation of our Acceptable Use Policy</li>
            <li>Fraudulent activity or suspected abuse</li>
            <li>Non-payment of fees</li>
            <li>Request by law enforcement or government agency</li>
          </ul>
          <p className="text-gray-700">
            You may terminate your account at any time by contacting our support team. Upon termination, your right to use the services will immediately cease. We will retain your data according to our data retention policy.
          </p>
        </div>
      )
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            To the maximum extent permitted by law, Prime Sms shall not be liable for:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Indirect, incidental, special, consequential, or punitive damages</li>
            <li>Loss of profits, revenue, data, or business opportunities</li>
            <li>Service interruptions or delivery failures beyond our control</li>
            <li>Actions of third-party service providers or telecom carriers</li>
            <li>Unauthorized access to or alteration of your transmissions or data</li>
          </ul>
          <p className="text-gray-700">
            Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim. Some jurisdictions do not allow certain liability limitations, so some of the above may not apply to you.
          </p>
        </div>
      )
    },
    {
      id: 'compliance',
      title: 'Legal Compliance',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            You are responsible for ensuring your use of our services complies with all applicable laws and regulations, including but not limited to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
            <li>Telephone Consumer Protection Act (TCPA)</li>
            <li>CAN-SPAM Act</li>
            <li>General Data Protection Regulation (GDPR)</li>
            <li>California Consumer Privacy Act (CCPA)</li>
            <li>Industry-specific regulations applicable to your business</li>
            <li>Obtaining proper consent before sending messages</li>
            <li>Providing opt-out mechanisms in all marketing messages</li>
          </ul>
          <p className="text-gray-700">
            We reserve the right to report any suspected violations to relevant authorities and cooperate with law enforcement investigations.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <p className="text-gray-700 leading-relaxed">
          Welcome to Prime Sms. These Terms of Service govern your use of our SMS messaging platform and services. Please read them carefully.
        </p>
      </div>

      {sections.map((section) => (
        <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection(section.id)}
            className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
          >
            <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
            {expandedSections[section.id] ? (
              <ChevronUp className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-600" />
            )}
          </button>
          {expandedSections[section.id] && (
            <div className="px-6 py-4 bg-white">
              {section.content}
            </div>
          )}
        </div>
      ))}

      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Contact Us</h4>
        <p className="text-blue-800 text-sm">
          If you have any questions about these Terms of Service, please contact us at{' '}
          <a href="mailto:legal@PrimeSms.com" className="font-medium underline">
            legal@PrimeSms.com
          </a>
        </p>
      </div>
    </div>
  );
}

export default PrivacyTermsPage;