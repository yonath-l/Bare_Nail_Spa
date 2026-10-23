-- ============================================================================
-- Bare Nail Spa Atelier — Production Supabase (PostgreSQL) Schema
-- Location: Malabe 10115, Sri Lanka
-- Includes Row Level Security (RLS), Auto-stamp Triggers & Reward Functions
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. LOYALTY CUSTOMERS
CREATE TABLE IF NOT EXISTS public.loyalty_customers (
    phone VARCHAR(20) PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(160),
    current_visits INT DEFAULT 0 CHECK (current_visits >= 0 AND current_visits <= 10),
    total_historical_visits INT DEFAULT 0,
    preferred_artisan_tea VARCHAR(100) DEFAULT 'Ceylon Silver Tips with Osmanthus',
    silent_session_preference BOOLEAN DEFAULT false,
    notes TEXT,
    last_stamped_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. STAMP AUDIT RECORDS
CREATE TABLE IF NOT EXISTS public.stamps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_phone VARCHAR(20) REFERENCES public.loyalty_customers(phone) ON DELETE CASCADE,
    stamp_number INT NOT NULL CHECK (stamp_number >= 1 AND stamp_number <= 10),
    method VARCHAR(30) NOT NULL CHECK (method IN ('NFC_TAP', 'CAPACITIVE_STAMP', 'STAFF_POS_PIN', 'WELCOME_GIFT', 'PAPER_CARD_MIGRATION')),
    verified_by_staff_id VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. UNLOCKED LOYALTY REWARDS
CREATE TABLE IF NOT EXISTS public.loyalty_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_phone VARCHAR(20) REFERENCES public.loyalty_customers(phone) ON DELETE CASCADE,
    milestone_visit INT NOT NULL CHECK (milestone_visit IN (5, 10)),
    title VARCHAR(120) NOT NULL,
    discount_percentage INT NOT NULL,
    max_cap_lkr INT,
    voucher_code VARCHAR(50) UNIQUE NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    redeemed BOOLEAN DEFAULT false,
    redeemed_at TIMESTAMPTZ,
    redeemed_booking_id VARCHAR(50)
);

-- 4. ATELIER RESERVATIONS
CREATE TABLE IF NOT EXISTS public.bookings (
    id VARCHAR(50) PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(30) DEFAULT 'CONFIRMED' CHECK (status IN ('PENDING_HOLD', 'CONFIRMED', 'IN_SESSION', 'COMPLETED', 'CANCELLED')),
    specialist_id VARCHAR(50) NOT NULL,
    specialist_name VARCHAR(100) NOT NULL,
    service_ids JSONB NOT NULL,
    services_summary JSONB NOT NULL,
    booking_date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL,
    total_duration_minutes INT NOT NULL,
    original_price_lkr INT NOT NULL,
    discount_applied_lkr INT DEFAULT 0,
    final_price_lkr INT NOT NULL,
    applied_reward_id UUID REFERENCES public.loyalty_rewards(id),
    guest_full_name VARCHAR(120) NOT NULL,
    guest_phone VARCHAR(20) NOT NULL,
    guest_email VARCHAR(160),
    preferred_tea VARCHAR(100) DEFAULT 'Ceylon Silver Tips with Osmanthus',
    silent_session BOOLEAN DEFAULT false,
    moodboard_url TEXT,
    special_notes TEXT
);

-- 5. AUTOMATED SMS & WHATSAPP OUTBOX LOG
CREATE TABLE IF NOT EXISTS public.sms_outbox (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_phone VARCHAR(20) NOT NULL,
    message_text TEXT NOT NULL,
    delivered BOOLEAN DEFAULT true,
    dispatched_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.loyalty_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stamps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_outbox ENABLE ROW LEVEL SECURITY;

-- Patrons can look up their own profile via phone number
CREATE POLICY "Public patron phone lookup" ON public.loyalty_customers
    FOR SELECT USING (true);

CREATE POLICY "Public patron insert new member" ON public.loyalty_customers
    FOR INSERT WITH CHECK (true);

-- Stamps readable by all for local device pass display
CREATE POLICY "Public stamps view" ON public.stamps
    FOR SELECT USING (true);

-- Rewards readable by all for local voucher rendering
CREATE POLICY "Public rewards view" ON public.loyalty_rewards
    FOR SELECT USING (true);

-- Bookings can be inserted by public reservation wizard
CREATE POLICY "Public create booking" ON public.bookings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public view bookings" ON public.bookings
    FOR SELECT USING (true);

-- SMS outbox log readable
CREATE POLICY "Public view outbox" ON public.sms_outbox
    FOR SELECT USING (true);

-- ============================================================================
-- TRIGGER: AUTO REWARD CREATION ON STAMP INSERTION
-- ============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_stamp()
RETURNS TRIGGER AS $$
DECLARE
    v_new_visits INT;
BEGIN
    -- Update customer visit count
    SELECT current_visits + 1 INTO v_new_visits
    FROM public.loyalty_customers
    WHERE phone = NEW.customer_phone;

    UPDATE public.loyalty_customers
    SET current_visits = v_new_visits,
        total_historical_visits = total_historical_visits + 1,
        last_stamped_at = NOW(),
        updated_at = NOW()
    WHERE phone = NEW.customer_phone;

    -- Milestone 1: Visit 5 = 50% OFF
    IF v_new_visits = 5 THEN
        INSERT INTO public.loyalty_rewards (
            customer_phone,
            milestone_visit,
            title,
            discount_percentage,
            voucher_code
        ) VALUES (
            NEW.customer_phone,
            5,
            '50% OFF Privilege Voucher',
            50,
            'BARE-50-' || RIGHT(NEW.customer_phone, 4) || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 4))
        );
    END IF;

    -- Milestone 2: Visit 10 = 100% OFF (Capped at 5,000 LKR)
    IF v_new_visits = 10 THEN
        INSERT INTO public.loyalty_rewards (
            customer_phone,
            milestone_visit,
            title,
            discount_percentage,
            max_cap_lkr,
            voucher_code
        ) VALUES (
            NEW.customer_phone,
            10,
            '100% OFF Privilege (Up to Rs. 5,000 Cap)',
            100,
            5000,
            'BARE-100-' || RIGHT(NEW.customer_phone, 4) || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 4))
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_stamp_inserted
    AFTER INSERT ON public.stamps
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_stamp();
