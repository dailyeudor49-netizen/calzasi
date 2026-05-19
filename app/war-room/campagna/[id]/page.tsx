'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { WarRoomData, CampaignMetrics } from '@/lib/warroom/types';
import { getSemaforoColor, getSemaforoEmoji } from '@/lib/warroom/semaforo';

export default function CampaignDetailPage() {
  const params = useParams();
  const campaignId = params?.id as string;

  const [data, setData] = useState<WarRoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/war-room/data');
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Errore nel caricamento dati');
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem' }}>Caricamento...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <p style={{ color: '#ef4444' }}>Errore: {error}</p>
        <button onClick={fetchData} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>
          Riprova
        </button>
      </div>
    );
  }

  if (!data) return <div style={{ padding: '2rem' }}>Nessun dato</div>;

  const campaign = data.campaigns.find((c) => c.campaign_id === campaignId);

  if (!campaign) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>Campagna non trovata</p>
        <Link href="/war-room/campagne" style={{ color: '#3b82f6', textDecoration: 'underline', marginTop: '1rem', display: 'inline-block' }}>
          Torna alla lista
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', background: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/war-room/campagne" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'inline-block' }}>
          ← Torna alla lista
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '2rem' }}>{getSemaforoEmoji(campaign.status)}</span>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{campaign.campaign}</h1>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Status: <strong>{campaign.status}</strong> | CPL Target: €{data.cpl_target.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <Card title="Budget" value={`€${campaign.budget.toFixed(2)}`} />
        <Card title="Spesa 7gg" value={`€${campaign.spend_7d.toFixed(2)}`} />
        <Card title="Lead 7gg" value={(campaign.leads_7d ?? 0).toString()} />
        <Card title="CPL reale" value={(campaign.cpl_real ?? 0) > 0 ? `€${(campaign.cpl_real ?? 0).toFixed(2)}` : '-'} />
        <Card title="CPA confermata" value={(campaign.cpa_confirmed ?? 0) > 0 ? `€${(campaign.cpa_confirmed ?? 0).toFixed(2)}` : '-'} />
        <Card
          title="Margine"
          value={`€${(campaign.margin ?? 0).toFixed(2)}`}
          valueColor={(campaign.margin ?? 0) >= 0 ? '#10b981' : '#ef4444'}
        />
      </div>

      {/* Action recommended */}
      <div style={{ background: '#fff', borderRadius: '0.5rem', border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Azione Consigliata</h2>
        <p style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937', marginBottom: '0.25rem' }}>
          {campaign.action}
        </p>
        {campaign.action_detail && (
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{campaign.action_detail}</p>
        )}
      </div>

      {/* Detailed metrics */}
      <div style={{ background: '#fff', borderRadius: '0.5rem', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Metriche Dettagliate</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <MetricRow label="CTR" value={`${campaign.ctr.toFixed(2)}%`} />
          <MetricRow label="CTR 7gg" value={`${campaign.ctr_7d.toFixed(2)}%`} />
          <MetricRow label="CPC" value={`€${campaign.cpc.toFixed(2)}`} />
          <MetricRow label="CPC 7gg" value={`€${campaign.cpc_7d.toFixed(2)}`} />
          <MetricRow label="CVR (Lead/Click)" value={`${(campaign.cvr ?? 0).toFixed(2)}%`} />
          <MetricRow label="% Conferma" value={`${(campaign.confirm_rate ?? 0).toFixed(1)}%`} />
          <MetricRow label="Spesa Oggi" value={`€${campaign.spend_today.toFixed(2)}`} />
          <MetricRow label="Spesa 14gg" value={`€${campaign.spend_14d.toFixed(2)}`} />
          <MetricRow label="Lead Oggi" value={(campaign.leads_today ?? 0).toString()} />
        </div>
      </div>

      {/* Placeholder for trend chart (future enhancement) */}
      <div style={{ background: '#fff', borderRadius: '0.5rem', border: '1px solid #e5e7eb', padding: '1.5rem', marginTop: '2rem', textAlign: 'center', color: '#9ca3af' }}>
        <p>Grafico trend giornaliero (da implementare con dati storici)</p>
      </div>
    </div>
  );
}

function Card({ title, value, valueColor }: { title: string; value: string; valueColor?: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: '0.5rem', border: '1px solid #e5e7eb', padding: '1.25rem' }}>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>{title}</p>
      <p style={{ fontSize: '1.5rem', fontWeight: 700, color: valueColor || '#1f2937' }}>{value}</p>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{label}</span>
      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1f2937' }}>{value}</span>
    </div>
  );
}
