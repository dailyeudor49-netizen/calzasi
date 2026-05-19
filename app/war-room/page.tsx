'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { WarRoomData, CampaignMetrics } from '@/lib/warroom/types';
import { getSemaforoEmoji } from '@/lib/warroom/semaforo';
import CampaignEditModal from '@/components/WarRoomEditModal';

export default function WarRoomPage() {
  const [data, setData] = useState<WarRoomData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingCampaign, setEditingCampaign] = useState<{ id: string; name: string } | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/war-room/refresh');
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

  if (error) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <p style={{ color: '#ef4444', marginBottom: '1rem' }}>Errore: {error}</p>
        <button
          onClick={fetchData}
          disabled={loading}
          style={{
            padding: '0.625rem 1.25rem',
            background: loading ? '#9ca3af' : '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 600,
          }}
        >
          {loading ? 'Caricamento...' : 'Riprova'}
        </button>
      </div>
    );
  }

  if (!data && !loading) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <p style={{ marginBottom: '1rem' }}>Premi "Aggiorna dati" per caricare le campagne Google Ads.</p>
        <button
          onClick={fetchData}
          disabled={loading}
          style={{
            padding: '0.625rem 1.25rem',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Aggiorna dati
        </button>
      </div>
    );
  }

  // Group campaigns by status
  const scala = data?.campaigns.filter((c) => c.action === 'Scala') || [];
  const nonToccare = data?.campaigns.filter((c) => c.action === 'Non toccare') || [];
  const riduci = data?.campaigns.filter((c) => c.action === 'Riduci budget') || [];
  const problema = data?.campaigns.filter((c) => c.status === 'Nero') || [];
  const creative = data?.campaigns.filter((c) => c.action === 'Aggiungi creative') || [];

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', background: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>War Room Giornaliera</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            {data && `Ultimo aggiornamento: ${new Date(data.last_updated).toLocaleString('it-IT')} | CPL Target: €${data.cpl_target.toFixed(2)}`}
            {loading && 'Aggiornamento in corso...'}
          </p>
          {!loading && (
            <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              Dati aggiornati automaticamente ogni ora da Google Ads
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={fetchData}
            disabled={loading}
            style={{
              padding: '0.625rem 1.25rem',
              background: loading ? '#9ca3af' : '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 600,
            }}
          >
            {loading ? '⏳ Aggiornamento...' : '🔄 Aggiorna dati'}
          </button>
          <Link
            href="/war-room/campagne"
            style={{
              padding: '0.625rem 1.25rem',
              background: '#1f2937',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              fontWeight: 600,
              display: 'inline-block',
            }}
          >
            Lista completa
          </Link>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
            Caricamento dati in corso...
          </p>
        </div>
      )}

      {/* Global lead metrics */}
      {data && data.global_leads && (
        <div style={{ marginBottom: '2rem', background: '#fff', borderRadius: '0.5rem', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Lead DB (Totali Globali)</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <Metric label="Oggi" value={data.global_leads.today.toString()} />
            <Metric label="Ultimi 7gg" value={data.global_leads.last_7d.toString()} />
            <Metric label="Confermate" value={data.global_leads.confirmed.toString()} color="#10b981" />
            <Metric label="Rifiutate" value={data.global_leads.rejected.toString()} color="#ef4444" />
            <Metric label="Ricavo" value={`€${data.global_leads.revenue.toFixed(2)}`} color="#10b981" />
          </div>
        </div>
      )}

      {/* Sections */}
      {data && (
        <>
          {problema.length > 0 && (
            <Section
              title="⚫ Problema Tracking"
              campaigns={problema}
              onEdit={(id, name) => setEditingCampaign({ id, name })}
            />
          )}
          {scala.length > 0 && (
            <Section
              title="🟢 Scala"
              campaigns={scala}
              onEdit={(id, name) => setEditingCampaign({ id, name })}
            />
          )}
          {creative.length > 0 && (
            <Section
              title="🎨 Aggiungi Creative"
              campaigns={creative}
              onEdit={(id, name) => setEditingCampaign({ id, name })}
            />
          )}
          {riduci.length > 0 && (
            <Section
              title="🔴 Riduci"
              campaigns={riduci}
              onEdit={(id, name) => setEditingCampaign({ id, name })}
            />
          )}
          {nonToccare.length > 0 && (
            <Section
              title="⏸️ Non Toccare"
              campaigns={nonToccare}
              onEdit={(id, name) => setEditingCampaign({ id, name })}
            />
          )}
        </>
      )}

      {/* Edit Modal */}
      {editingCampaign && (
        <CampaignEditModal
          campaignId={editingCampaign.id}
          campaignName={editingCampaign.name}
          isOpen={true}
          onClose={() => setEditingCampaign(null)}
          onSave={() => {
            setEditingCampaign(null);
            fetchData(); // Refresh data after save
          }}
        />
      )}
    </div>
  );
}

function Metric({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div>
      <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem', textTransform: 'uppercase' }}>{label}</p>
      <p style={{ fontSize: '1.5rem', fontWeight: 700, color: color || '#1f2937' }}>{value}</p>
    </div>
  );
}

function Section({
  title,
  campaigns,
  onEdit,
}: {
  title: string;
  campaigns: CampaignMetrics[];
  onEdit: (id: string, name: string) => void;
}) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>{title}</h2>
      <div style={{ background: '#fff', borderRadius: '0.5rem', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <Th>St.</Th>
              <Th>Campagna</Th>
              <Th>Budget</Th>
              <Th>Spesa Oggi</Th>
              <Th>Spesa 7gg</Th>
              <Th>Spesa 14gg</Th>
              <Th>Conversioni</Th>
              <Th>CTR</Th>
              <Th>CPC</Th>
              <Th>Azione</Th>
              <Th>&nbsp;</Th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.campaign_id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <Td>
                  <span style={{ fontSize: '1.25rem' }}>{getSemaforoEmoji(c.status)}</span>
                </Td>
                <Td>
                  <Link
                    href={`/war-room/campagna/${c.campaign_id}`}
                    style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}
                  >
                    {c.campaign}
                  </Link>
                </Td>
                <Td>€{c.budget.toFixed(2)}</Td>
                <Td>€{c.spend_today.toFixed(2)}</Td>
                <Td>€{c.spend_7d.toFixed(2)}</Td>
                <Td>€{c.spend_14d.toFixed(2)}</Td>
                <Td>{c.conversions}</Td>
                <Td>{c.ctr.toFixed(2)}%</Td>
                <Td>€{c.cpc.toFixed(2)}</Td>
                <Td style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {c.action}
                  {c.action_detail && (
                    <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{c.action_detail}</div>
                  )}
                </Td>
                <Td>
                  <button
                    onClick={() => onEdit(c.campaign_id, c.campaign)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      background: 'transparent',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '1rem',
                    }}
                    title="Modifica impostazioni campagna"
                  >
                    ✏️
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        padding: '0.75rem 1rem',
        textAlign: 'left',
        fontSize: '0.75rem',
        fontWeight: 600,
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}
    >
      {children}
    </th>
  );
}

function Td({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', ...style }}>
      {children}
    </td>
  );
}
