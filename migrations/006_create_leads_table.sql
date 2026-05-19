-- Migration 006: Create leads table (totali giornalieri, senza campaign tracking)
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'nuova' CHECK (status IN ('nuova', 'confermata', 'rifiutata', 'invalida', 'doppia')),
  product TEXT,
  payout DECIMAL(10, 2) DEFAULT 0,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  email TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
