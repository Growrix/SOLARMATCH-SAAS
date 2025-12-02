'use client';
import React from 'react';
import QuoteBuilderModal from '@/components/QuoteBuilderModal';

export default function QuoteBuilderTestPage() {
  const mockLead = {
    id: 'TEST_LEAD_ID',
    name: 'Test Lead',
    location: 'Melbourne VIC',
    propertyType: 'Residential',
    systemSize: '6.6',
    estimatedUsage: 'High',
    budget: '$8000-$10000',
    quoteData: {
      postcode: '3000',
      roofType: 'tile',
      roofTilt: 'optimal',
      shadingLevel: 'minimal',
      panelOrientation: ['north'],
      recommendedSize: 6.6,
      usagePattern: 'evening',
      customRetailRate: 0.32,
      customFeedInRate: 0.08,
      budgetRange: '$8000-$10000'
    }
  };

  return (
    <div className="p-4">
      <QuoteBuilderModal
        isOpen={true}
        lead={mockLead as any}
        onClose={() => {}}
        onSubmitQuote={async () => true}
        mode="bid"
      />
    </div>
  );
}
