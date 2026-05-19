'use client';

import { useState, useEffect } from 'react';

interface CampaignEditModalProps {
  campaignId: string;
  campaignName: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function CampaignEditModal({
  campaignId,
  campaignName,
  isOpen,
  onClose,
  onSave,
}: CampaignEditModalProps) {
  const [biddingStrategy, setBiddingStrategy] = useState('');
  const [cplTarget, setCplTarget] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen, campaignId]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/war-room/campaign-settings/${campaignId}`);
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();
      setBiddingStrategy(data.bidding_strategy || '');
      setCplTarget(data.cpl_target?.toString() || '');
      setNotes(data.notes || '');
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/war-room/campaign-settings/${campaignId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bidding_strategy: biddingStrategy || null,
          cpl_target: cplTarget ? parseFloat(cplTarget) : null,
          notes: notes || null,
        }),
      });

      if (!res.ok) throw new Error('Failed to save settings');

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Errore nel salvataggio');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '0.5rem',
          padding: '2rem',
          maxWidth: '500px',
          width: '90%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Modifica Campagna
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          {campaignName}
        </p>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            Caricamento...
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label
                htmlFor="bidding_strategy"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  marginBottom: '0.25rem',
                }}
              >
                Strategia di Offerta
              </label>
              <input
                id="bidding_strategy"
                type="text"
                value={biddingStrategy}
                onChange={(e) => setBiddingStrategy(e.target.value)}
                placeholder="es. Target CPA, Massimizza conversioni"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="cpl_target"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  marginBottom: '0.25rem',
                }}
              >
                CPL Target (€)
              </label>
              <input
                id="cpl_target"
                type="number"
                step="0.01"
                value={cplTarget}
                onChange={(e) => setCplTarget(e.target.value)}
                placeholder="es. 8.00"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <div>
              <label
                htmlFor="notes"
                style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  marginBottom: '0.25rem',
                }}
              >
                Note
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Note aggiuntive sulla campagna..."
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  resize: 'vertical',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button
                onClick={onClose}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: '0.625rem 1.25rem',
                  background: '#fff',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: saving ? 'not-allowed' : 'pointer',
                }}
              >
                Annulla
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  flex: 1,
                  padding: '0.625rem 1.25rem',
                  background: saving ? '#9ca3af' : '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: saving ? 'not-allowed' : 'pointer',
                }}
              >
                {saving ? 'Salvataggio...' : 'Salva'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
