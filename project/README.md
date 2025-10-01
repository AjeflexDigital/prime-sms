# 📱 SMS Platform - Bulk SMS Service MVP

A comprehensive bulk SMS platform built with Node.js, Express.js, PostgreSQL, and React. This MVP provides everything needed to run a professional SMS service with user management, payment processing, reseller functionality, and admin controls.

atsk_034c32d1d55d98e7b9ff481c862375b2f714392c7f234a94b6dc6b59cdad7ca0add6f377

## 🚀 Features

### 📊 Core Functionality
- **Single & Bulk SMS**: Send individual messages or bulk campaigns via CSV upload
- **Message Templates**: Create and manage reusable message templates
- **Scheduled Messaging**: Schedule SMS campaigns for future delivery
- **Delivery Tracking**: Real-time message status and delivery reports
- **Contact Management**: Organize recipients with advanced filtering

### 🏢 User Management
- **Multi-Role System**: Admin, Reseller, and User roles
- **JWT Authentication**: Secure login with access/refresh tokens
- **Email Verification**: Account verification via email
- **Password Security**: Bcrypt hashing with strong password policies

### 💰 Billing & Payments
- **Credit System**: Prepaid credit balance with transaction history
- **Paystack Integration**: Secure payment processing
- **Tiered Pricing**: Volume-based pricing with automatic bonuses
- **Transparent Billing**: Clear pricing rules and no hidden fees

### 🏪 Reseller Program
- **White-Label Solution**: Custom branding and domain support
- **Sub-User Management**: Resellers can manage their own customers
- **Commission Structure**: Configurable profit margins
- **Package Tiers**: Silver, Gold, Platinum reseller packages

### 🛡️ Security & Compliance
- **Rate Limiting**: Protection against API abuse
- **Input Validation**: Comprehensive data sanitization
- **SQL Injection Prevention**: Parameterized queries
- **Spam Filtering**: Configurable content filtering system
- **Audit Logging**: Complete transaction and activity logs

### 📈 Analytics & Reporting
- **Dashboard Analytics**: SMS usage, success rates, and trends
- **Network Analysis**: Delivery performance by mobile network
- **Financial Reports**: Credit usage and payment history
- **Export Capabilities**: Download reports in various formats

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js framework
- **PostgreSQL** database with connection pooling
- **JWT** authentication with refresh tokens
- **Bcrypt** for password hashing
- **Helmet.js** for security headers
- **Express Rate Limit** for API protection

### Frontend
- **React** with functional components and hooks
- **Tailwind CSS** for responsive styling
- **Lucide React** for icons
- **Axios** for API communication
- **React Router** for navigation

### External Services
- **Africa's Talking SMS API** for message delivery
- **Paystack** for payment processing
- **Nodemailer** for email notifications
- **PostgreSQL** for data persistence

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- NPM or Yarn package manager

### 1. Clone Repository
```bash
git clone <repository-url>
cd bulk-sms-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sms_platform
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here

# SMS API Configuration
AFRICAS_TALKING_API_KEY=your_api_key_here
AFRICAS_TALKING_USERNAME=your_username_here

# Payment Configuration
PAYSTACK_SECRET_KEY=your_paystack_secret_key

# Email Configuration
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 4. Database Setup
Create the PostgreSQL database and run migrations:

```bash
createdb sms_platform
npm run migrate
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📁 Project Structure

```
bulk-sms-platform/
├── server/                     # Backend application
│   ├── config/                 # Database and configuration files
│   ├── middleware/             # Authentication and security middleware
│   ├── routes/                 # API route handlers
│   ├── services/               # Business logic services
│   ├── migrations/             # Database schema migrations
│   └── uploads/                # File upload directory
├── src/                        # Frontend React application
│   ├── components/             # Reusable UI components
│   ├── pages/                  # Page components
│   ├── contexts/               # React context providers
│   ├── hooks/                  # Custom React hooks
│   └── utils/                  # Utility functions
├── public/                     # Static assets
└── docs/                       # Documentation files
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset

### SMS Operations
- `POST /api/sms/send-single` - Send single SMS
- `POST /api/sms/send-bulk` - Send bulk SMS via CSV
- `GET /api/sms/messages` - Get message history
- `GET /api/sms/stats` - Get SMS statistics

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/wallet` - Get wallet balance and transactions
- `POST /api/user/templates` - Create message template

### Admin Operations
- `GET /api/admin/users` - Manage users
- `GET /api/admin/messages` - View all messages
- `POST /api/admin/spam-words` - Manage spam filter
- `PUT /api/admin/pricing` - Update pricing tiers

## 🔒 Security Features

### Authentication & Authorization
- JWT tokens with configurable expiration
- Refresh token rotation for enhanced security
- Role-based access control (RBAC)
- Password strength requirements

### API Protection
- Rate limiting per IP address
- Request validation and sanitization
- SQL injection prevention
- XSS protection headers

### Data Security
- Encrypted sensitive data storage
- Secure file upload validation
- Audit trails for all operations
- GDPR compliance features

## 💳 Payment Integration

### Paystack Integration
The platform integrates with Paystack for secure payment processing:

```javascript
// Example payment initialization
const initializePayment = async (amount, email) => {
  const response = await axios.post('/api/payment/initialize', {
    amount: amount * 100, // Convert to kobo
    email: email,
    currency: 'NGN'
  });
  
  return response.data.authorization_url;
};
```

### Credit System
- Automatic credit allocation after successful payment
- Bonus credit calculation based on volume tiers
- Real-time balance updates during SMS sending
- Comprehensive transaction history

## 📱 SMS Service Integration

### Africa's Talking API
Messages are sent through Africa's Talking SMS gateway:

```javascript
// Example SMS sending
const sendSMS = async (recipient, message, senderId) => {
  const response = await axios.post(AT_API_URL, {
    username: AT_USERNAME,
    to: recipient,
    message: message,
    from: senderId
  }, {
    headers: { 'apiKey': AT_API_KEY }
  });
  
  return response.data;
};
```

### Features
- Delivery status tracking
- Network detection and routing
- Message length calculation
- Character encoding support

## 👥 User Roles & Permissions

### Admin
- Full system access
- User management and suspension
- Pricing and configuration control
- System analytics and reports
- Spam filter management

### Reseller
- White-label branding options
- Customer management
- Pricing markup control
- Reseller analytics
- Sub-user creation

### User
- SMS sending and templates
- Wallet management
- Message history and analytics
- Profile management
- Contact organization

## 📊 Database Schema

### Core Tables
- `users` - User accounts and authentication
- `profiles` - Extended user information
- `messages` - SMS message logs and status
- `wallets` - Credit transactions and balance
- `templates` - Message templates
- `payments` - Payment transactions

### Administrative Tables
- `pricing_tiers` - Volume-based pricing rules
- `spam_words` - Content filtering rules
- `resellers` - White-label configurations
- `sender_ids` - Custom sender ID approvals

## 🚀 Deployment

### Production Checklist
1. **Environment Variables**: Secure all API keys and secrets
2. **Database**: Configure production PostgreSQL instance
3. **SSL Certificate**: Enable HTTPS for all endpoints
4. **Monitoring**: Set up logging and error tracking
5. **Backups**: Configure automated database backups

### Recommended Hosting
- **Backend**: Railway, Heroku, or DigitalOcean
- **Database**: Railway PostgreSQL, Heroku Postgres, or AWS RDS
- **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront

## 🧪 Testing

Run the test suite:
```bash
npm test
```

### Test Coverage
- Authentication flows
- SMS sending functionality
- Payment processing
- User role permissions
- Database operations

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For technical support or business inquiries:
- Email: support@smsplatform.com
- Documentation: [Link to docs]
- Issues: [GitHub Issues]

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Africa's Talking for SMS gateway services
- Paystack for payment processing
- PostgreSQL team for the robust database
- React and Node.js communities
- All contributors and testers

---

**Built with ❤️ for businesses worldwide** 🌍





Good question ⚡ — those two values (Google Client ID and Client Secret) come from creating an app in the Google Cloud Console. Here’s how you get them step by step:

🔑 Steps to Get Google OAuth Credentials
1. Go to Google Cloud Console

Visit 👉 https://console.cloud.google.com/

Log in with your Google account.

2. Create a New Project (or Select Existing)

At the top, click the project dropdown → New Project.

Give it a name (e.g., BulkSMSApp).

Click Create.

3. Enable the OAuth Consent Screen

In the left sidebar → APIs & Services → OAuth consent screen.

Choose External (so normal users can log in).

Fill in:

App name (your app’s name)

User support email

Developer email

Save.

4. Create OAuth Credentials

Go to APIs & Services → Credentials.

Click Create Credentials → OAuth Client ID.

Select Web Application.

Enter name (e.g., BulkSMS Web Login).

Under Authorized JavaScript Origins, add:

http://localhost:5173 (for local dev)

Your production domain (e.g., https://yoursite.com)

Under Authorized Redirect URIs, add:

http://localhost:5173/auth/callback (or your actual callback route)

https://yoursite.com/auth/callback

5. Copy Credentials

After creating, Google will show:

Client ID → paste into GOOGLE_CLIENT_ID

Client Secret → paste into GOOGLE_CLIENT_SECRET

📌 Example .env Setup
GOOGLE_CLIENT_ID=1234567890-abc123def456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-XYZ987654321


⚠️ Important Notes

If you’re only testing locally, you can just add http://localhost:5173 as redirect URI.

Once you deploy, update Google Console with your real domain.

Don’t expose the Client Secret in frontend — only backend should use it.
osarumwenseosasere90@gmail.com