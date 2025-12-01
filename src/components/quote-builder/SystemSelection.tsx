'use client'

import React from 'react';
import { Zap } from 'lucide-react';
import { SYSTEM_TYPES } from './Presets';

interface SystemSelectionProps {
  systemType: string;
  systemSize: number;
  projectType?: string;
  desiredPriceRange?: { min: number; max: number };
  onUpdate: (data: Partial<SystemSelectionData>) => void;
}

export interface SystemSelectionData {
  systemType: string;
  systemSize: number;
  projectType?: string;
  desiredPriceRange?: { min: number; max: number };
}

const SystemSelection: React.FC<SystemSelectionProps> = ({
  systemType,
  systemSize,
  projectType = 'Residential',
  desiredPriceRange,
  onUpdate
}) => {
  const handleSizeChange = (value: number) => {
    onUpdate({ systemSize: value });
  };

  return (
    <div className="bg-background rounded-2xl shadow-neu-inset p-6 space-y-6">
      <h3 className="text-heading-5 text-foreground flex items-center gap-2">
        <Zap className="h-5 w-5 text-primary" />
        System Selection
      </h3>

      {/* Project Type */}
      <div>
        <label className="text-label text-foreground block mb-3">
          Project Type
        </label>
        <select
          value={projectType}
          onChange={(e) => onUpdate({ projectType: e.target.value })}
          className="form-select w-full px-4 py-3"
        >
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
        </select>
      </div>

      {/* System Type */}
      <div>
        <label className="text-label text-foreground block mb-3">
          System Type
        </label>
        <select
          value={systemType}
          onChange={(e) => onUpdate({ systemType: e.target.value })}
          className="form-select w-full px-4 py-3"
        >
          {SYSTEM_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* System Size */}
      <div>
        <label className="text-label text-foreground block mb-3">
          System Size (kW)
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={systemSize}
            onChange={(e) => handleSizeChange(parseFloat(e.target.value) || 0)}
            className="form-input max-w-xs px-4 py-3"
          />
          <span className="text-body text-muted-foreground">kW</span>
        </div>
      </div>
    </div>
  );
};

export default SystemSelection;
