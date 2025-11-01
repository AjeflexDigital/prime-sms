/*
  # Prime Sms Database Schema

  1. Core Tables
    - `users` - User accounts with role-based access
    - `profiles` - Extended user profile information
    - `wallets` - User credit balance and transaction history
    - `messages` - SMS logs with delivery status
    - `templates` - Reusable message templates
    - `sender_ids` - Custom sender ID management
    
  2. Admin & Configuration
    - `pricing_tiers` - Volume-based pricing structure
    - `spam_words` - Content filtering rules
    - `system_settings` - Platform configuration
    
  3. Reseller & Payments
    - `resellers` - White-label partner management
    - `payments` - Transaction records and billing
    - `scheduled_messages` - Future SMS delivery
*/

-- Enable UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table with role-based access control
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'reseller', 'user')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('active', 'suspended', 'pending', 'banned')),
    credits DECIMAL(10,2) DEFAULT 0.00,
    trial_credits DECIMAL(10,2) DEFAULT 100.00,
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    last_login TIMESTAMP,
    reseller_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User profiles with extended information
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    company VARCHAR(255),
    address TEXT,
    country VARCHAR(100) DEFAULT 'Nigeria',
    timezone VARCHAR(50) DEFAULT 'Africa/Lagos',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wallet transactions and credit history
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('credit', 'debit', 'bonus', 'refund')),
    amount DECIMAL(10,2) NOT NULL,
    balance DECIMAL(10,2) NOT NULL,
    description TEXT,
    reference VARCHAR(255),
    payment_method VARCHAR(50),
    status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SMS message logs with delivery tracking
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    recipient VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    sender_id VARCHAR(20) DEFAULT 'Prime Sms',
    message_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'queued')),
    pages INTEGER DEFAULT 1,
    cost DECIMAL(8,4) DEFAULT 0.00,
    network VARCHAR(50),
    country_code VARCHAR(5) DEFAULT 'NG',
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    failed_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reusable message templates
CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    variables JSONB DEFAULT '[]',
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Custom sender ID management
CREATE TABLE IF NOT EXISTS sender_ids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    sender_id VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    purpose TEXT,
    admin_notes TEXT,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Volume-based pricing configuration
CREATE TABLE IF NOT EXISTS pricing_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    min_volume INTEGER NOT NULL,
    max_volume INTEGER,
    price_per_unit DECIMAL(8,4) NOT NULL,
    network VARCHAR(50) DEFAULT 'all',
    country_code VARCHAR(5) DEFAULT 'NG',
    bonus_percentage DECIMAL(5,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Spam word filtering system
CREATE TABLE IF NOT EXISTS spam_words (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    word VARCHAR(255) NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
    action VARCHAR(20) DEFAULT 'block' CHECK (action IN ('block', 'flag', 'replace')),
    replacement VARCHAR(255),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System configuration settings
CREATE TABLE IF NOT EXISTS system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(255) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type VARCHAR(50) DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reseller management and white-labeling
CREATE TABLE IF NOT EXISTS resellers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    package VARCHAR(50) DEFAULT 'silver' CHECK (package IN ('silver', 'gold', 'platinum')),
    domain VARCHAR(255),
    logo_url VARCHAR(500),
    brand_name VARCHAR(255),
    brand_colors JSONB DEFAULT '{"primary": "#dc2626", "secondary": "#1f2937"}',
    settings JSONB DEFAULT '{}',
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment transaction records
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reference VARCHAR(255) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(5) DEFAULT 'NGN',
    method VARCHAR(50) DEFAULT 'paystack' CHECK (method IN ('paystack', 'bank_transfer', 'manual')),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'successful', 'failed', 'cancelled')),
    gateway_response JSONB,
    credits_awarded DECIMAL(10,2),
    bonus_credits DECIMAL(10,2) DEFAULT 0.00,
    processed_by UUID REFERENCES users(id),
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scheduled message delivery system
CREATE TABLE IF NOT EXISTS scheduled_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    template_id UUID REFERENCES templates(id),
    recipients TEXT[] NOT NULL,
    content TEXT NOT NULL,
    sender_id VARCHAR(20) DEFAULT 'Prime Sms',
    scheduled_at TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'processing', 'completed', 'failed', 'cancelled')),
    total_recipients INTEGER DEFAULT 0,
    sent_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    estimated_cost DECIMAL(10,2) DEFAULT 0.00,
    actual_cost DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(reference);
CREATE INDEX IF NOT EXISTS idx_scheduled_messages_scheduled_at ON scheduled_messages(scheduled_at);

-- Insert default pricing tiers
INSERT INTO pricing_tiers (min_volume, max_volume, price_per_unit, network, bonus_percentage) VALUES
(1, 4999, 3.50, 'all', 0.00),
(5000, 19999, 3.20, 'all', 2.00),
(20000, 49999, 3.00, 'all', 3.00),
(50000, 99999, 2.80, 'all', 5.00),
(100000, NULL, 2.50, 'all', 10.00);

-- Insert default spam words
INSERT INTO spam_words (word, severity, action) VALUES
('viagra', 'high', 'block'),
('casino', 'high', 'block'),
('lottery', 'high', 'block'),
('winner', 'medium', 'flag'),
('urgent', 'low', 'flag'),
('free', 'low', 'flag');

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('platform_name', 'Prime Sms', 'string', 'Platform display name', TRUE),
('support_email', 'support@primesms.com.ng', 'string', 'Support contact email', TRUE),
('max_message_length', '1000', 'number', 'Maximum characters per message', TRUE),
('sender_id_approval', 'true', 'boolean', 'Require admin approval for sender IDs', FALSE);

-- Create default admin user (password: admin123)
INSERT INTO users (email, password, role, status, credits, email_verified) VALUES
('adminajeflex@primesms.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewCsI.6YgdQNcvGi', 'admin', 'active', 10000.00, TRUE);

-- Create profile for admin user
INSERT INTO profiles (user_id, full_name, phone, company) 
SELECT id, 'System Administrator', '+2348000000000', 'Prime Sms'
FROM users WHERE email = 'adminajeflex@primesms.com';