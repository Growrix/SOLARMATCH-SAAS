/**
 * Import Preview Modal
 * Shows before/after diff when importing Instant Quote data into Bid Builder
 */

'use client'

import React from 'react';
import Button from './ui/button';
import { X, Download, ArrowRight } from 'lucide-react';

interface ImportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  currentDraft: any;
  mappedData: any;
}

const ImportPreviewModal: React.FC<ImportPreviewModalProps> = ({
  isOpen,
  onClose,
  onAccept,
  currentDraft,
  mappedData
}) => {
  if (!isOpen) return null;

  const renderFieldDiff = (label: string, before: any, after: any) => {
    if (before === after) return null;
    
    return (
      <div className="grid grid-cols-[1fr,auto,1fr] gap-4 py-3 border-b border-border">
        <div>
          <p className="text-caption text-muted-foreground mb-1">{label}</p>
          <p className="text-body text-foreground">
            {before === undefined || before === '' || before === null ? (
              <span className="text-muted-foreground italic">Empty</span>
            ) : (
              String(before)
            )}
          </p>
        </div>
        <div className="flex items-center justify-center">
          <ArrowRight className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-caption text-muted-foreground mb-1">{label}</p>
          <p className="text-body text-accent">
            {after === undefined || after === '' || after === null ? (
              <span className="text-muted-foreground italic">Empty</span>
            ) : (
              String(after)
            )}
          </p>
        </div>
      </div>
    );
  };

  const changes = [];
  
  // System changes
  if (mappedData.system) {
    if (mappedData.system.systemSize !== undefined) {
      changes.push(renderFieldDiff(
        'System Size',
        currentDraft.system.systemSize,
        mappedData.system.systemSize
      ));
    }
    if (mappedData.system.projectType !== undefined) {
      changes.push(renderFieldDiff(
        'Project Type',
        currentDraft.system.projectType,
        mappedData.system.projectType
      ));
    }
  }
  
  // Roof changes
  if (mappedData.roof) {
    if (mappedData.roof.roofType !== undefined) {
      changes.push(renderFieldDiff(
        'Roof Type',
        currentDraft.roof.roofType,
        mappedData.roof.roofType
      ));
    }
    if (mappedData.roof.pitchDeg !== undefined) {
      changes.push(renderFieldDiff(
        'Roof Pitch (degrees)',
        currentDraft.roof.pitchDeg,
        mappedData.roof.pitchDeg
      ));
    }
    if (mappedData.roof.orientations && mappedData.roof.orientations.length > 0) {
      changes.push(renderFieldDiff(
        'Panel Orientation',
        currentDraft.roof.orientations.join(', ') || 'None',
        mappedData.roof.orientations.join(', ')
      ));
    }
    if (mappedData.roof.shadingLevel !== undefined) {
      changes.push(renderFieldDiff(
        'Shading Level',
        currentDraft.roof.shadingLevel,
        mappedData.roof.shadingLevel
      ));
    }
  }
  
  // Assumptions changes
  if (mappedData.assumptions) {
    if (mappedData.assumptions.retailPrice !== undefined) {
      changes.push(renderFieldDiff(
        'Retail Price ($/kWh)',
        currentDraft.assumptions.retailPrice?.toFixed(4) || '0.30',
        mappedData.assumptions.retailPrice.toFixed(4)
      ));
    }
    if (mappedData.assumptions.feedInTariff !== undefined) {
      changes.push(renderFieldDiff(
        'Feed-In Tariff ($/kWh)',
        currentDraft.assumptions.feedInTariff?.toFixed(4) || '0.08',
        mappedData.assumptions.feedInTariff.toFixed(4)
      ));
    }
    if (mappedData.assumptions.selfConsumption !== undefined) {
      changes.push(renderFieldDiff(
        'Self-Consumption',
        `${((currentDraft.assumptions.selfConsumption || 0.5) * 100).toFixed(0)}%`,
        `${(mappedData.assumptions.selfConsumption * 100).toFixed(0)}%`
      ));
    }
  }
  
  // Battery changes
  if (mappedData.products?.battery) {
    changes.push(renderFieldDiff(
      'Battery Included',
      currentDraft.products.battery?.included ? 'Yes' : 'No',
      'Yes'
    ));
    if (mappedData.products.battery.capacity) {
      changes.push(renderFieldDiff(
        'Battery Capacity',
        currentDraft.products.battery?.capacity || 'None',
        `${mappedData.products.battery.capacity} kWh`
      ));
    }
  }
  
  // Addons changes
  if (mappedData.products?.addons && mappedData.products.addons.length > 0) {
    changes.push(renderFieldDiff(
      'Feature Requests',
      currentDraft.products.addons?.map((a: any) => a.label).join(', ') || 'None',
      mappedData.products.addons.map((a: any) => a.label).join(', ')
    ));
  }

  const validChanges = changes.filter(Boolean);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-background rounded-3xl shadow-neu-strong max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Download className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-heading-4 text-foreground">Import from Instant Quote</h2>
              <p className="text-body-small text-muted-foreground">
                Review changes before applying
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {validChanges.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-body text-muted-foreground">
                No changes detected. Your current draft already matches the Instant Quote data.
              </p>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-[1fr,auto,1fr] gap-4 pb-3 border-b-2 border-border">
                <p className="text-label text-foreground">Current Value</p>
                <div />
                <p className="text-label text-foreground">New Value (from Instant Quote)</p>
              </div>
              {validChanges}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onAccept}
            disabled={validChanges.length === 0}
          >
            Accept & Import
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImportPreviewModal;
