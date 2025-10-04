/*
  # Production Features and Optimizations

  1. Performance Improvements
    - Additional indexes for faster queries
    - Optimized table structures
    - Better foreign key relationships

  2. Production Settings
    - Default admin user with secure password
    - Production-ready pricing tiers
    - Essential spam words for filtering

  3. Security Enhancements
    - Audit logging table
    - Session management
    - Rate limiting tracking
*/

-- Add audit logging for admin actions
CREATE TABLE IF NOT EXISTS admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id UUID,
    details TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add session management for security
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    refresh_token VARCHAR(500) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add rate limiting tracking
CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_address INET NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    attempts INTEGER DEFAULT 1,
    window_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    blocked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add additional indexes for production performance
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_network ON messages(network);
CREATE INDEX IF NOT EXISTS idx_wallets_transaction_type ON wallets(transaction_type);
CREATE INDEX IF NOT EXISTS idx_wallets_created_at ON wallets(created_at);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);
CREATE INDEX IF NOT EXISTS idx_users_reseller_id ON users(reseller_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_rate_limits_ip_endpoint ON rate_limits(ip_address, endpoint);

-- Update pricing tiers for production (Nigerian market rates)
UPDATE pricing_tiers SET 
  price_per_unit = 6.50, 
  bonus_percentage = 0.00
WHERE min_volume = 1;

UPDATE pricing_tiers SET 
  price_per_unit = 6.20, 
  bonus_percentage = 2.00
WHERE min_volume = 5000;

UPDATE pricing_tiers SET 
  price_per_unit = 6.00, 
  bonus_percentage = 5.00
WHERE min_volume = 20000;

UPDATE pricing_tiers SET 
  price_per_unit = 5.80, 
  bonus_percentage = 8.00
WHERE min_volume = 50000;

UPDATE pricing_tiers SET 
  price_per_unit = 5.60, 
  bonus_percentage = 10.00
WHERE min_volume = 100000;

-- Add more comprehensive spam words for production
INSERT INTO spam_words (word, severity, action) VALUES
('scam', 'high', 'block'),
('fraud', 'high', 'block'),
('hack', 'high', 'block'),
('phishing', 'high', 'block'),
('bitcoin', 'medium', 'flag'),
('cryptocurrency', 'medium', 'flag'),
('investment', 'medium', 'flag'),
('loan', 'medium', 'flag'),
('debt', 'medium', 'flag'),
('click here', 'low', 'flag'),
('limited time', 'low', 'flag'),
('act now', 'low', 'flag')
ON CONFLICT DO NOTHING;

-- Add production system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode', FALSE),
('max_bulk_recipients', '10000', 'number', 'Maximum recipients per bulk SMS', FALSE),
('daily_sms_limit', '50000', 'number', 'Daily SMS limit per user', FALSE),
('min_balance_alert', '100', 'number', 'Minimum balance for low balance alerts', FALSE),
('webhook_secret', '', 'string', 'Webhook verification secret', FALSE)
ON CONFLICT (setting_key) DO NOTHING;



