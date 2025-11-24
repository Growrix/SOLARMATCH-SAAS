"use client";
import React, { useEffect, useState } from 'react';
import InstallerLeadCard from './InstallerLeadCard';
import type { LeadFeedItem } from '@/types/lead';

interface FeedResponseShape {
  page?: number;
  limit?: number;
  total?: number;
  items: LeadFeedItem[];
}

export default function InstallerLeadFeed() {
  const [items, setItems] = useState<LeadFeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/installer/leads?quoteType=CALL_VISIT');
        if (!res.ok) throw new Error('Feed request failed');
        const json: FeedResponseShape = await res.json();
        if (!cancelled && json && Array.isArray(json.items)) {
          setItems(json.items);
        }
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Unexpected error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="space-y-4" aria-busy={loading} aria-live="polite">
      <h2 className="text-heading-3 text-foreground">Lead Feed</h2>
      {error && (
        <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-destructive text-body-small">
          {error}
        </div>
      )}
      {loading && !items.length && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" aria-label="loading" />
        </div>
      )}
      {!loading && !error && items.length === 0 && (
        <div className="rounded-md border border-border bg-surface p-6 text-center">
          <p className="text-body-small text-muted-foreground">No leads available.</p>
        </div>
      )}
      <div className="grid gap-3" role="list">
        {items.map(item => (
          <div key={item.id} role="listitem">
            <InstallerLeadCard lead={item} />
          </div>
        ))}
      </div>
    </div>
  );
}