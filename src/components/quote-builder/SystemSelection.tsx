'use client'

import React from 'react';
import { Zap } from 'lucide-react';
import { SYSTEM_TYPES } from './Presets';

interface SystemSelectionProps {
  systemType: string;
  systemSize: number;
  desiredPriceRange?: { min: number; max: number };
  onUpdate: (data: Partial<SystemSelectionData>) => void;
}

export interface SystemSelectionData {
  systemType: string;
  systemSize: number;
  desiredPriceRange?: { min: number; max: number };
}

const SystemSelection: React.FC<SystemSelectionProps> = ({
  systemType,
  systemSize,
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

      {/* System Type */}
      <div>
        <label className="text-label text-foreground block mb-3">
          System Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {SYSTEM_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => onUpdate({ systemType: type.value })}
              className={systemType === type.value ? 'selection-btn-active' : 'selection-btn'}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* System Size */}
      <div>
        <label className="text-label text-foreground block mb-3">
          System Size (kW)
        </label>
        <div className="space-y-4">
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={systemSize}
            onChange={(e) => handleSizeChange(parseFloat(e.target.value) || 0)}
            className="form-input w-full px-4 py-3"
          />
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="20"
              step="0.1"
              value={systemSize}
              onChange={(e) => handleSizeChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-background-alt rounded-lg appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-primary
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:shadow-neu-outset
                [&::-moz-range-thumb]:w-4
                [&::-moz-range-thumb]:h-4
                [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-primary
                [&::-moz-range-thumb]:cursor-pointer
                [&::-moz-range-thumb]:border-0
                [&::-moz-range-thumb]:shadow-neu-outset"
            />
            <div className="flex justify-between text-caption text-muted-foreground">
              <span>0 kW</span>
              <span>20 kW</span>
            </div>
          </div>
        </div>
      </div>

      {/* Desired Price Range (Optional) */}
      <div>
        <label className="text-label text-foreground block mb-3">
          Desired Price Range (Optional)
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-caption text-muted-foreground block mb-2">
              Min ($)
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={desiredPriceRange?.min || ''}
              onChange={(e) =>
                onUpdate({
                  desiredPriceRange: {
                    min: parseFloat(e.target.value) || 0,
                    max: desiredPriceRange?.max || 0
                  }
                })
              }
              placeholder="e.g. 5000"
              className="form-input w-full px-4 py-3"
            />
          </div>
          <div>
            <label className="text-caption text-muted-foreground block mb-2">
              Max ($)
            </label>
            <input
              type="number"
              min="0"
              step="1000"
              value={desiredPriceRange?.max || ''}
              onChange={(e) =>
                onUpdate({
                  desiredPriceRange: {
                    min: desiredPriceRange?.min || 0,
                    max: parseFloat(e.target.value) || 0
                  }
                })
              }
              placeholder="e.g. 15000"
              className="form-input w-full px-4 py-3"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSelection;
