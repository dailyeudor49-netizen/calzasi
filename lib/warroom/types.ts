// War Room types
export interface GoogleAdsData {
  campaign: string;
  campaign_id: string;
  status: string;
  budget: number;
  spend_today: number;
  spend_7d: number;
  spend_14d: number;
  clicks: number;
  clicks_7d: number;
  impressions: number;
  ctr: number;
  ctr_7d: number;
  cpc: number;
  cpc_7d: number;
  conversions: number;
}

// Lead DB totali globali (non per campagna)
export interface GlobalLeadMetrics {
  total: number;
  today: number;
  last_7d: number;
  confirmed: number;
  rejected: number;
  invalid: number;
  duplicate: number;
  revenue: number;
}

// Campaign settings (DB storage)
export interface CampaignSettings {
  campaign_id: string;
  bidding_strategy: string | null;
  cpl_target: number | null;
  notes: string | null;
  updated_at: string | null;
}

export interface CampaignMetrics {
  campaign: string;
  campaign_id: string;
  status: 'Verde' | 'Giallo' | 'Rosso' | 'Nero';
  budget: number;
  spend_today: number;
  spend_7d: number;
  spend_14d: number;
  ctr: number;
  ctr_7d: number;
  cpc: number;
  cpc_7d: number;
  clicks: number;
  clicks_7d: number;
  conversions: number;
  action: string;
  action_detail?: string;
  // Derived metrics
  leads_7d?: number;
  leads_today?: number;
  cpl_real?: number;
  cpa_confirmed?: number;
  margin?: number;
  cvr?: number;
  confirm_rate?: number;
  // Campaign settings from DB
  bidding_strategy?: string | null;
  cpl_target_custom?: number | null;
  notes?: string | null;
}

export interface WarRoomData {
  campaigns: CampaignMetrics[];
  global_leads: GlobalLeadMetrics;
  last_updated: string;
  cpl_target: number;
}
