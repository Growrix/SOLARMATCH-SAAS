'use client'

import React, { useState } from 'react';
import { Home, Upload, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { ROOF_TYPES, ORIENTATIONS, SHADING_LEVELS, PHASE_TYPES } from './Presets';
import Button from '@/components/ui/button';

interface RoofSiteDetailsProps {
  roofType: string;
  pitchDeg: number;
  arrays: number;
  orientations: string[];
  shadingLevel: number;
  phaseType: string;
  switchboardUpgrade: boolean;
  smartMeterRequired: boolean;
  distanceToSwitchboardM: number;
  notes: string;
  photos: string[];
  arrayLayoutNotes?: string;
  roofAccessNotes?: string;
  structuralNotes?: string;
  mountingSystemPreferred?: string;
  conduitRunComplexity?: 'low' | 'medium' | 'high';
  inverterLocationNotes?: string;
  prefilledFields?: string[];
  onUpdate: (data: Partial<RoofSiteDetailsData>) => void;
}

export interface RoofSiteDetailsData {
  roofType: string;
  pitchDeg: number;
  arrays: number;
  orientations: string[];
  shadingLevel: number;
  phaseType: string;
  switchboardUpgrade: boolean;
  smartMeterRequired: boolean;
  distanceToSwitchboardM: number;
  notes: string;
  photos: string[];
  arrayLayoutNotes?: string;
  roofAccessNotes?: string;
  structuralNotes?: string;
  mountingSystemPreferred?: string;
  conduitRunComplexity?: 'low' | 'medium' | 'high';
  inverterLocationNotes?: string;
}

const RoofSiteDetails: React.FC<RoofSiteDetailsProps> = ({
  roofType,
  pitchDeg,
  arrays,
  orientations,
  shadingLevel,
  phaseType,
  switchboardUpgrade,
  smartMeterRequired,
  distanceToSwitchboardM,
  notes,
  photos,
  arrayLayoutNotes,
  roofAccessNotes,
  structuralNotes,
  mountingSystemPreferred,
  conduitRunComplexity,
  inverterLocationNotes,
  prefilledFields = [],
  onUpdate
}) => {
  const [showInstallerDetails, setShowInstallerDetails] = useState(false);
  
  const toggleOrientation = (orientation: string) => {
    const newOrientations = orientations.includes(orientation)
      ? orientations.filter((o) => o !== orientation)
      : [...orientations, orientation];
    onUpdate({ orientations: newOrientations });
  };

  return (
    <div className="bg-background rounded-2xl shadow-neu-inset p-6 space-y-6">
      <h3 className="text-heading-5 text-foreground flex items-center gap-2">
        <Home className="h-5 w-5 text-primary" />
        Roof & Site Details
      </h3>

      {/* Row 1: Roof Type, Pitch, Arrays */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-label text-foreground block mb-2">
            Roof Type
          </label>
          <select
            value={roofType}
            onChange={(e) => onUpdate({ roofType: e.target.value })}
            className="form-select w-full px-4 py-3"
          >
            <option value="">Select type...</option>
            {ROOF_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {prefilledFields.includes('roof.roofType') && (
            <p className="text-caption text-muted-foreground mt-1">
              Prefilled from homeowner Instant Quote
            </p>
          )}
        </div>

        <div>
          <label className="text-label text-foreground block mb-2 flex items-center gap-2">
            Roof Pitch (degrees)
            <div className="group relative">
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              <div className="absolute left-0 top-6 w-72 p-3 bg-surface border border-border rounded-lg shadow-neu-outset-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
                <p className="text-caption text-foreground">
                  Roof angle in degrees. Optimal pitch for most Australian locations is 20-30°. Flat roofs ~5°, steep roofs 40°+.
                </p>
              </div>
            </div>
          </label>
          <input
            type="number"
            min="0"
            max="90"
            value={pitchDeg}
            onChange={(e) => onUpdate({ pitchDeg: parseFloat(e.target.value) || 0 })}
            className="form-input w-full px-4 py-3"
            placeholder="e.g. 22"
          />
          {prefilledFields.includes('roof.pitchDeg') && (
            <p className="text-caption text-muted-foreground mt-1">
              Prefilled from homeowner Instant Quote
            </p>
          )}
        </div>

        <div>
          <label className="text-label text-foreground block mb-2">
            Number of Arrays
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={arrays}
            onChange={(e) => onUpdate({ arrays: parseInt(e.target.value) || 1 })}
            className="form-input w-full px-4 py-3"
          />
        </div>
      </div>

      {/* Row 2: Orientations (Multi-select chips) */}
      <div>
        <label className="text-label text-foreground block mb-3 flex items-center gap-2">
          Array Orientations
          <div className="group relative">
            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            <div className="absolute left-0 top-6 w-72 p-3 bg-surface border border-border rounded-lg shadow-neu-outset-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
              <p className="text-caption text-foreground">
                North-facing panels typically generate 100% efficiency in Australia. Other orientations may have 80-95% efficiency. Multiple orientations can be selected for complex roofs.
              </p>
            </div>
          </div>
        </label>
        <div className="flex flex-wrap gap-2">
          {ORIENTATIONS.map((orientation) => (
            <button
              key={orientation}
              onClick={() => toggleOrientation(orientation)}
              className={orientations.includes(orientation) ? 'selection-chip-active' : 'selection-chip'}
            >
              {orientation}
            </button>
          ))}
        </div>
        <p className="text-caption text-muted-foreground mt-2">
          Select all orientations where panels will be installed
        </p>
        {prefilledFields.includes('roof.orientations') && (
          <p className="text-caption text-muted-foreground mt-1">
            Prefilled from homeowner Instant Quote
          </p>
        )}
      </div>

      {/* Row 3: Shading Level */}
      <div>
        <label className="text-label text-foreground block mb-2 flex items-center gap-2">
          Shading Level
          <div className="group relative">
            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            <div className="absolute left-0 top-6 w-72 p-3 bg-surface border border-border rounded-lg shadow-neu-outset-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-10">
              <p className="text-caption text-foreground">
                None: No shade throughout the day. Minimal: &lt;10% shading. Partial: 10-30%. Moderate: 30-50%. Heavy: &gt;50% during peak hours.
              </p>
            </div>
          </div>
        </label>
        <select
          value={shadingLevel}
          onChange={(e) => onUpdate({ shadingLevel: parseFloat(e.target.value) })}
          className="form-select w-full px-4 py-3"
        >
          {SHADING_LEVELS.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
        {prefilledFields.includes('roof.shadingLevel') && (
          <p className="text-caption text-muted-foreground mt-1">
            Prefilled from homeowner Instant Quote
          </p>
        )}
      </div>

      {/* Row 4: Metering & Switchboard */}
      <div className="space-y-4">
        <h4 className="text-body text-foreground">Metering & Switchboard</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-label text-foreground block mb-2">
              Phase Type
            </label>
            <select
              value={phaseType}
              onChange={(e) => onUpdate({ phaseType: e.target.value })}
              className="form-select w-full px-4 py-3"
            >
              {PHASE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-label text-foreground block mb-2">
              Distance to Switchboard (m)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={distanceToSwitchboardM}
              onChange={(e) =>
                onUpdate({ distanceToSwitchboardM: parseFloat(e.target.value) || 0 })
              }
              className="form-input w-full px-4 py-3"
              placeholder="e.g. 15"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={switchboardUpgrade}
              onChange={(e) => onUpdate({ switchboardUpgrade: e.target.checked })}
              className="w-5 h-5 rounded border-border bg-background text-primary focus:ring-primary"
            />
            <span className="text-body-small text-foreground">
              Switchboard Upgrade Required
            </span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={smartMeterRequired}
              onChange={(e) => onUpdate({ smartMeterRequired: e.target.checked })}
              className="w-5 h-5 rounded border-border bg-background text-primary focus:ring-primary"
            />
            <span className="text-body-small text-foreground">
              Smart Meter Required
            </span>
          </label>
        </div>
      </div>

      {/* Row 5: Site Notes */}
      <div>
        <label className="text-label text-foreground block mb-2">
          Site Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => onUpdate({ notes: e.target.value })}
          rows={4}
          className="form-input w-full px-4 py-3 resize-none"
          placeholder="Any special considerations, access issues, or site-specific requirements..."
        />
      </div>

      {/* Row 6: Photos Upload (Stub) */}
      <div>
        <label className="text-label text-foreground block mb-2">
          Site Photos
        </label>
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center space-y-3">
          <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
          <div>
            <p className="text-body-small text-foreground mb-1">
              Upload site photos
            </p>
            <p className="text-caption text-muted-foreground">
              Roof, switchboard, obstructions, etc.
            </p>
          </div>
          <Button variant="secondary" className="mx-auto">
            Choose Files
          </Button>
        </div>
        {photos.length > 0 && (
          <div className="mt-3 text-body-small text-foreground">
            {photos.length} photo(s) uploaded
          </div>
        )}
      </div>

      {/* Installer Technical Details (Collapsible) */}
      <div className="border-t border-border pt-6">
        <button
          onClick={() => setShowInstallerDetails(!showInstallerDetails)}
          className="flex items-center gap-2 text-body text-foreground hover:text-primary transition-colors w-full"
        >
          {showInstallerDetails ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
          <span>Installer Technical Details</span>
          <span className="text-caption text-muted-foreground ml-auto">
            Optional installer-only fields
          </span>
        </button>

        {showInstallerDetails && (
          <div className="mt-6 space-y-6">
            {/* Array Layout Notes */}
            <div>
              <label className="text-label text-foreground block mb-2">
                Array Layout Notes
              </label>
              <textarea
                value={arrayLayoutNotes}
                onChange={(e) => onUpdate({ arrayLayoutNotes: e.target.value })}
                rows={3}
                className="form-input w-full px-4 py-3 resize-none"
                placeholder="String configuration, combiner placement, array-specific notes..."
              />
            </div>

            {/* Roof Access Notes */}
            <div>
              <label className="text-label text-foreground block mb-2">
                Roof Access Notes
              </label>
              <textarea
                value={roofAccessNotes}
                onChange={(e) => onUpdate({ roofAccessNotes: e.target.value })}
                rows={3}
                className="form-input w-full px-4 py-3 resize-none"
                placeholder="Ladder required, scaffold access, safety considerations, access constraints..."
              />
            </div>

            {/* Structural Notes */}
            <div>
              <label className="text-label text-foreground block mb-2">
                Structural Notes
              </label>
              <textarea
                value={structuralNotes}
                onChange={(e) => onUpdate({ structuralNotes: e.target.value })}
                rows={3}
                className="form-input w-full px-4 py-3 resize-none"
                placeholder="Truss spacing, batten type, tile condition, penetrations, load-bearing concerns..."
              />
            </div>

            {/* Mounting System & Conduit Complexity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-label text-foreground block mb-2">
                  Mounting System Preferred
                </label>
                <input
                  type="text"
                  value={mountingSystemPreferred}
                  onChange={(e) => onUpdate({ mountingSystemPreferred: e.target.value })}
                  className="form-input w-full px-4 py-3"
                  placeholder="e.g., Clenergy, SunLock, IronRidge"
                />
              </div>

              <div>
                <label className="text-label text-foreground block mb-2">
                  Conduit Run Complexity
                </label>
                <select
                  value={conduitRunComplexity}
                  onChange={(e) => onUpdate({ conduitRunComplexity: e.target.value as 'low' | 'medium' | 'high' })}
                  className="form-select w-full px-4 py-3"
                >
                  <option value="low">Low (straight run, short distance)</option>
                  <option value="medium">Medium (some obstacles, moderate distance)</option>
                  <option value="high">High (complex routing, long distance)</option>
                </select>
              </div>
            </div>

            {/* Inverter Location Notes */}
            <div>
              <label className="text-label text-foreground block mb-2">
                Inverter Location Notes
              </label>
              <textarea
                value={inverterLocationNotes}
                onChange={(e) => onUpdate({ inverterLocationNotes: e.target.value })}
                rows={3}
                className="form-input w-full px-4 py-3 resize-none"
                placeholder="Indoor/outdoor, ventilation requirements, proximity to switchboard, shading considerations..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoofSiteDetails;
