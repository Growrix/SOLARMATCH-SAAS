import React from 'react';
import type { LeadFeedItem } from '@/types/lead';

interface Props {
  lead: LeadFeedItem;
  onPurchase?: (id: string) => void;
  loading?: boolean;
}

export function InstallerLeadCard({ lead, onPurchase, loading }: Props) {
  const disabled = loading || !lead.canPurchase || lead.purchasedByOther || lead.purchasedByMe;
  return (
    <div
      className="rounded-md p-4 bg-surface shadow-sm border border-border flex flex-col gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      tabIndex={0}
      role="group"
      aria-disabled={disabled}
      aria-label={`Lead ${lead.id.slice(0,8)} ${lead.purchasedByMe? 'purchased by you' : lead.purchasedByOther? 'purchased by another installer' : 'available for purchase'}`}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-body text-foreground">Lead #{lead.id.slice(0, 8)}</h3>
        {lead.purchasedByMe && <span className="text-caption px-2 py-1 rounded bg-accent text-accent-foreground" aria-label="purchased by you">Purchased</span>}
        {lead.purchasedByOther && <span className="text-caption px-2 py-1 rounded bg-muted text-muted-foreground" aria-label="purchased by another installer">Unavailable</span>}
      </div>
      <div className="text-body-small text-muted-foreground">
        Price: <span className="text-body">${lead.leadPrice.toFixed(2)}</span>
      </div>
      <div className="text-body-small">
        {lead.maskedContact && !lead.purchasedByMe ? (
          <span className="italic text-muted-foreground text-body-small" aria-label="contact information masked">Contact masked until purchase</span>
        ) : lead.contact ? (
          <span className="text-body-small" aria-label="contact unmasked">{lead.contact.name} • {lead.contact.phone}</span>
        ) : (
          <span className="text-muted-foreground text-body-small">No contact info</span>
        )}
      </div>
      <button
        type="button"
        onClick={() => (onPurchase ? onPurchase(lead.id) : null)}
        disabled={disabled}
        className="inline-flex items-center justify-center text-body-small px-3 py-2 rounded bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={lead.purchasedByMe ? 'Lead already purchased by you' : lead.purchasedByOther ? 'Lead purchased by another installer' : lead.canPurchase ? 'Purchase this lead' : 'Cannot purchase this lead'}
        aria-disabled={disabled}
      >
        {lead.purchasedByMe ? 'Purchased' : lead.purchasedByOther ? 'Purchased by another' : 'Purchase'}
      </button>
    </div>
  );
}

export default InstallerLeadCard;
