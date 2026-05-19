'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { WarRoomData } from '@/lib/warroom/types';
import { getSemaforoEmoji } from '@/lib/warroom/semaforo';

export default function CampagneListPage() {
  const [data, setData] = useState<WarRoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState<'spend' | 'cpl' | 'margin' | 'status'>('status');

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

  // Sort campaigns
  const sorted = [...data.campaigns].sort((a, b) => {
    if (sortBy === 'spend') return b.spend_7d - a.spend_7d;
    if (sortBy === 'cpl') return (a.cpl_real || 999) - (b.cpl_real || 999);
    if (sortBy === 'margin') return (b.margin ?? 0) - (a.margin ?? 0);
    // status: Nero > Rosso > Giallo > Verde
    const statusOrder = { Nero: 4, Rosso: 3, Giallo: 2, Verde: 1 };
    return statusOrder[b.status] - statusOrder[a.status];
  });

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', background: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Lista Completa Campagne</h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
            {data.campaigns.length} campagne attive
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={fetchData} style={{ padding: '0.625rem 1.25rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
            Aggiorna
          </button>
          <Link href="/war-room" style={{ padding: '0.625rem 1.25rem', background: '#1f2937', color: '#fff', border: 'none', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600, display: 'inline-block' }}>
            War Room
          </Link>
        </div>
      </div>

      {/* Sort controls */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => setSortBy('status')} style={{ padding: '0.5rem 1rem', background: sortBy === 'status' ? '#3b82f6' : '#e5e7eb', color: sortBy === 'status' ? '#fff' : '#1f2937', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem' }}>
          Ordina per Status
        </button>
        <button onClick={() => setSortBy('spend')} style={{ padding: '0.5rem 1rem', background: sortBy === 'spend' ? '#3b82f6' : '#e5e7eb', color: sortBy === 'spend' ? '#fff' : '#1f2937', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem' }}>
          Ordina per Spesa
        </button>
        <button onClick={() => setSortBy('cpl')} style={{ padding: '0.5rem 1rem', background: sortBy === 'cpl' ? '#3b82f6' : '#e5e7eb', color: sortBy === 'cpl' ? '#fff' : '#1f2937', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem' }}>
          Ordina per CPL
        </button>
        <button onClick={() => setSortBy('margin')} style={{ padding: '0.5rem 1rem', background: sortBy === 'margin' ? '#3b82f6' : '#e5e7eb', color: sortBy === 'margin' ? '#fff' : '#1f2937', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem' }}>
          Ordina per Margine
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: '0.5rem', border: '1px solid #e5e7eb', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <Th>St.</Th>
              <Th>Campagna</Th>
              <Th>Budget</Th>
              <Th>Oggi</Th>
              <Th>7gg</Th>
              <Th>14gg</Th>
              <Th>Lead 7gg</Th>
              <Th>CPL</Th>
              <Th>CPA conf.</Th>
              <Th>% Conf.</Th>
              <Th>Margine</Th>
              <Th>CTR</Th>
              <Th>CPC</Th>
              <Th>CVR</Th>
              <Th>Azione</Th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((c) => (
              <tr key={c.campaign_id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <Td><span style={{ fontSize: '1.25rem' }}>{getSemaforoEmoji(c.status)}</span></Td>
                <Td>
                  <Link href={`/war-room/campagna/${c.campaign_id}`} style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 500 }}>
                    {c.campaign}
                  </Link>
                </Td>
                <Td>€{c.budget.toFixed(2)}</Td>
                <Td>€{c.spend_today.toFixed(2)}</Td>
                <Td>€{c.spend_7d.toFixed(2)}</Td>
                <Td>€{c.spend_14d.toFixed(2)}</Td>
                <Td>{c.leads_7d ?? 0}</Td>
                <Td style={{ color: (c.cpl_real ?? 0) > 0 ? '#1f2937' : '#9ca3af' }}>
                  {(c.cpl_real ?? 0) > 0 ? `€${(c.cpl_real ?? 0).toFixed(2)}` : '-'}
                </Td>
                <Td style={{ color: (c.cpa_confirmed ?? 0) > 0 ? '#1f2937' : '#9ca3af' }}>
                  {(c.cpa_confirmed ?? 0) > 0 ? `€${(c.cpa_confirmed ?? 0).toFixed(2)}` : '-'}
                </Td>
                <Td>{(c.confirm_rate ?? 0).toFixed(1)}%</Td>
                <Td style={{ color: (c.margin ?? 0) >= 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                  €{(c.margin ?? 0).toFixed(2)}
                </Td>
                <Td>{c.ctr.toFixed(2)}%</Td>
                <Td>€{c.cpc.toFixed(2)}</Td>
                <Td>{(c.cvr ?? 0).toFixed(2)}%</Td>
                <Td style={{ fontSize: '0.875rem' }}>
                  {c.action}
                  {c.action_detail && <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>{c.action_detail}</div>}
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
    <th style={{ padding: '0.75rem 0.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
      {children}
    </th>
  );
}

function Td({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <td style={{ padding: '0.75rem 0.5rem', fontSize: '0.875rem', ...style }}>
      {children}
    </td>
  );
}
