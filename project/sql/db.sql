-- prime_sms_combined.sql
-- Combined and harmonized schema + data from both files (production pricing chosen)
-- SAFE / IDEMPOTENT where possible. Test on a copy first.

-- 0) ensure uuid extension (used by DEFAULT uuid_generate_v4())
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1) Core tables (create in dependency order)

-- users
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

-- profiles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    company VARCHAR(255),
    address TEXT,
    country VARCHAR(100) DEFAULT 'Nigeria',
    timezone VARCHAR(50) DEFAULT 'Africa/Lagos',
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- wallets
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

-- messages
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

-- templates
CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    variables JSONB DEFAULT '[]'::jsonb,
    usage_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- sender_ids
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

-- pricing_tiers
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

-- spam_words
CREATE TABLE IF NOT EXISTS spam_words (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    word VARCHAR(255) NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
    action VARCHAR(20) DEFAULT 'block' CHECK (action IN ('block', 'flag', 'replace')),
    replacement VARCHAR(255),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- system_settings
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

-- resellers
CREATE TABLE IF NOT EXISTS resellers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    package VARCHAR(50) DEFAULT 'silver' CHECK (package IN ('silver', 'gold', 'platinum')),
    domain VARCHAR(255),
    logo_url VARCHAR(500),
    brand_name VARCHAR(255),
    brand_colors JSONB DEFAULT '{"primary": "#dc2626", "secondary": "#1f2937"}'::jsonb,
    settings JSONB DEFAULT '{}'::jsonb,
    commission_rate DECIMAL(5,2) DEFAULT 10.00,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- payments
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

-- scheduled_messages
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

-- admin_logs
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

-- user_sessions
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

-- rate_limits
CREATE TABLE IF NOT EXISTS rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip_address INET NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    attempts INTEGER DEFAULT 1,
    window_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    blocked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2) Indexes (idempotent)
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

-- 3) Pricing tiers: choose PRODUCTION values (higher Ajeflex margins)
-- Update existing rows if present, then insert missing ones (idempotent)
UPDATE pricing_tiers
SET price_per_unit = 6.50, bonus_percentage = 0.00, updated_at = CURRENT_TIMESTAMP
WHERE min_volume = 1;

UPDATE pricing_tiers
SET price_per_unit = 6.20, bonus_percentage = 2.00, updated_at = CURRENT_TIMESTAMP
WHERE min_volume = 5000;

UPDATE pricing_tiers
SET price_per_unit = 6.00, bonus_percentage = 5.00, updated_at = CURRENT_TIMESTAMP
WHERE min_volume = 20000;

UPDATE pricing_tiers
SET price_per_unit = 5.80, bonus_percentage = 8.00, updated_at = CURRENT_TIMESTAMP
WHERE min_volume = 50000;

UPDATE pricing_tiers
SET price_per_unit = 5.60, bonus_percentage = 10.00, updated_at = CURRENT_TIMESTAMP
WHERE min_volume = 100000;

INSERT INTO pricing_tiers (min_volume, max_volume, price_per_unit, network, bonus_percentage, is_active, created_at, updated_at)
SELECT 1, 4999, 6.50, 'all', 0.00, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM pricing_tiers WHERE min_volume = 1);

INSERT INTO pricing_tiers (min_volume, max_volume, price_per_unit, network, bonus_percentage, is_active, created_at, updated_at)
SELECT 5000, 19999, 6.20, 'all', 2.00, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM pricing_tiers WHERE min_volume = 5000);

INSERT INTO pricing_tiers (min_volume, max_volume, price_per_unit, network, bonus_percentage, is_active, created_at, updated_at)
SELECT 20000, 49999, 6.00, 'all', 5.00, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM pricing_tiers WHERE min_volume = 20000);

INSERT INTO pricing_tiers (min_volume, max_volume, price_per_unit, network, bonus_percentage, is_active, created_at, updated_at)
SELECT 50000, 99999, 5.80, 'all', 8.00, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM pricing_tiers WHERE min_volume = 50000);

INSERT INTO pricing_tiers (min_volume, max_volume, price_per_unit, network, bonus_percentage, is_active, created_at, updated_at)
SELECT 100000, NULL, 5.60, 'all', 10.00, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM pricing_tiers WHERE min_volume = 100000);

-- 4) Spam words: insert both file sets, ON CONFLICT DO NOTHING
INSERT INTO spam_words (word, severity, action, replacement, created_by)
VALUES
('viagra', 'high', 'block', NULL, NULL),
('casino', 'high', 'block', NULL, NULL),
('lottery', 'high', 'block', NULL, NULL),
('winner', 'medium', 'flag', NULL, NULL),
('urgent', 'low', 'flag', NULL, NULL),
('free', 'low', 'flag', NULL, NULL)
ON CONFLICT (word) DO NOTHING;

INSERT INTO spam_words (word, severity, action, replacement, created_by)
VALUES
('scam', 'high', 'block', NULL, NULL),
('fraud', 'high', 'block', NULL, NULL),
('hack', 'high', 'block', NULL, NULL),
('phishing', 'high', 'block', NULL, NULL),
('bitcoin', 'medium', 'flag', NULL, NULL),
('cryptocurrency', 'medium', 'flag', NULL, NULL),
('investment', 'medium', 'flag', NULL, NULL),
('loan', 'medium', 'flag', NULL, NULL),
('debt', 'medium', 'flag', NULL, NULL),
('click here', 'low', 'flag', NULL, NULL),
('limited time', 'low', 'flag', NULL, NULL),
('act now', 'low', 'flag', NULL, NULL)
ON CONFLICT (word) DO NOTHING;

-- 5) System settings: insert if not present
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public, created_at, updated_at)
VALUES
('platform_name', 'Prime Sms', 'string', 'Platform display name', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public, created_at, updated_at)
VALUES
('support_email', 'support@primesms.com.ng', 'string', 'Support contact email', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public, created_at, updated_at)
VALUES
('max_message_length', '1000', 'number', 'Maximum characters per message', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public, created_at, updated_at)
VALUES
('sender_id_approval', 'true', 'boolean', 'Require admin approval for sender IDs', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (setting_key) DO NOTHING;

-- production system settings from other file
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public, created_at, updated_at)
VALUES
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public, created_at, updated_at)
VALUES
('max_bulk_recipients', '10000', 'number', 'Maximum recipients per bulk SMS', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public, created_at, updated_at)
VALUES
('daily_sms_limit', '50000', 'number', 'Daily SMS limit per user', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public, created_at, updated_at)
VALUES
('min_balance_alert', '100', 'number', 'Minimum balance for low balance alerts', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public, created_at, updated_at)
VALUES
('webhook_secret', '', 'string', 'Webhook verification secret', FALSE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (setting_key) DO NOTHING;

-- 6) Admin user insert (safe)
-- Use email unique constraint to avoid duplicate admin creation. Adjust password hash as needed.
INSERT INTO users (email, password, role, status, credits, email_verified, created_at, updated_at)
SELECT 'adminajeflex@primesms.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewCsI.6YgdQNcvGi', 'admin', 'active', 10000.00, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'adminajeflex@primesms.com');

-- Create profile for admin user if missing
INSERT INTO profiles (user_id, full_name, phone, company, created_at)
SELECT u.id, 'System Administrator', '+2348000000000', 'Prime Sms', CURRENT_TIMESTAMP
FROM users u
WHERE u.email = 'adminajeflex@primesms.com'
  AND NOT EXISTS (SELECT 1 FROM profiles p WHERE p.user_id = u.id);

-- 7) Cleanup duplicates for pricing_tiers (only if duplicates exist) and add unique constraint
-- NOTE: run this section only if you're comfortable removing duplicate pricing rows for the same min_volume.
-- It's safe but irreversible without a backup. I wrap it in a transaction.
DO $$
BEGIN
  -- Remove exact duplicate min_volume rows keeping the one with smallest id
  IF (SELECT COUNT(*) FROM pricing_tiers) > 0 THEN
    -- create temp table with ids to keep
    CREATE TEMP TABLE tmp_keep AS
      SELECT MIN(id) AS id FROM pricing_tiers GROUP BY min_volume;
    -- delete duplicates not in tmp_keep
    DELETE FROM pricing_tiers WHERE id NOT IN (SELECT id FROM tmp_keep);
    DROP TABLE tmp_keep;
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Skipping duplicate cleanup due to: %', SQLERRM;
END
$$;

-- Add unique constraint on min_volume if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    WHERE c.contype = 'u' AND t.relname = 'pricing_tiers' AND array_to_string(c.conkey, ',') LIKE '%min_volume%'
  ) THEN
    BEGIN
      ALTER TABLE pricing_tiers ADD CONSTRAINT uq_pricing_min_volume UNIQUE(min_volume);
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Could not add unique constraint on pricing_tiers.min_volume: %', SQLERRM;
    END;
  END IF;
END
$$;

-- 8) Final notes inserts/updates already performed above

-- End of combined schema + data script
