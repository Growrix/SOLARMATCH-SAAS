'use client'

import React, { useState } from 'react';
import { Package, Upload, Plus, Trash2 } from 'lucide-react';
import { INVERTER_TYPES, BATTERY_CHEMISTRY, ADDON_OPTIONS } from './Presets';
import Button from '@/components/ui/button';

interface ProductConfigurationProps {
  panels: PanelConfig;
  inverter: InverterConfig;
  battery?: BatteryConfig;
  addons: AddonConfig[];
  onUpdate: (data: Partial<ProductConfigurationData>) => void;
}

export interface PanelConfig {
  brand: string;
  model: string;
  wattage: number;
  efficiency: number;
  qty: number;
  productWarranty: number;
  performanceWarranty: number;
  tier1: boolean;
  datasheetKey?: string;
}

export interface InverterConfig {
  brand: string;
  model: string;
  type: string;
  capacityKw: number;
  mppts: number;
  warranty: number;
  datasheetKey?: string;
}

export interface BatteryConfig {
  brand: string;
  model: string;
  usableKwh: number;
  powerKw: number;
  expandable: boolean;
  warranty: number;
  chemistry: string;
  backupSupported: boolean;
  backupCircuitRequired: boolean;
  datasheetKey?: string;
}

export interface AddonConfig {
  key: string;
  label: string;
  qty: number;
  unitPrice: number;
}

export interface ProductConfigurationData {
  panels: PanelConfig;
  inverter: InverterConfig;
  battery?: BatteryConfig;
  addons: AddonConfig[];
}

const ProductConfiguration: React.FC<ProductConfigurationProps> = ({
  panels,
  inverter,
  battery,
  addons,
  onUpdate
}) => {
  const [includeBattery, setIncludeBattery] = useState(!!battery);
  const [showAddonSelector, setShowAddonSelector] = useState(false);

  const handlePanelUpdate = (field: keyof PanelConfig, value: any) => {
    onUpdate({ panels: { ...panels, [field]: value } });
  };

  const handleInverterUpdate = (field: keyof InverterConfig, value: any) => {
    onUpdate({ inverter: { ...inverter, [field]: value } });
  };

  const handleBatteryUpdate = (field: keyof BatteryConfig, value: any) => {
    if (battery) {
      onUpdate({ battery: { ...battery, [field]: value } });
    }
  };

  const addAddon = (addonKey: string) => {
    const addon = ADDON_OPTIONS.find((a) => a.key === addonKey);
    if (addon && !addons.find((a) => a.key === addonKey)) {
      onUpdate({
        addons: [
          ...addons,
          { key: addon.key, label: addon.label, qty: 1, unitPrice: addon.defaultPrice }
        ]
      });
    }
    setShowAddonSelector(false);
  };

  const removeAddon = (addonKey: string) => {
    onUpdate({ addons: addons.filter((a) => a.key !== addonKey) });
  };

  const updateAddon = (addonKey: string, field: 'qty' | 'unitPrice', value: number) => {
    onUpdate({
      addons: addons.map((a) => (a.key === addonKey ? { ...a, [field]: value } : a))
    });
  };

  const toggleBattery = () => {
    if (includeBattery) {
      onUpdate({ battery: undefined });
      setIncludeBattery(false);
    } else {
      onUpdate({
        battery: {
          brand: '',
          model: '',
          usableKwh: 10,
          powerKw: 5,
          expandable: false,
          warranty: 10,
          chemistry: 'LFP',
          backupSupported: false,
          backupCircuitRequired: false
        }
      });
      setIncludeBattery(true);
    }
  };

  return (
    <div className="bg-background rounded-2xl shadow-neu-inset p-6 space-y-6">
      <h3 className="text-heading-5 text-foreground flex items-center gap-2">
        <Package className="h-5 w-5 text-primary" />
        Product Configuration
      </h3>

      {/* Solar Panels */}
      <div className="space-y-4">
        <h4 className="text-body text-foreground">Solar Panels</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-label text-foreground block mb-2">Brand</label>
            <input
              type="text"
              value={panels.brand}
              onChange={(e) => handlePanelUpdate('brand', e.target.value)}
              className="form-input w-full px-4 py-3"
              placeholder="e.g. Trina Solar"
            />
          </div>

          <div>
            <label className="text-label text-foreground block mb-2">Model</label>
            <input
              type="text"
              value={panels.model}
              onChange={(e) => handlePanelUpdate('model', e.target.value)}
              className="form-input w-full px-4 py-3"
              placeholder="e.g. Vertex S+ 430W"
            />
          </div>

          <div>
            <label className="text-label text-foreground block mb-2">Wattage (W)</label>
            <input
              type="number"
              value={panels.wattage}
              onChange={(e) => handlePanelUpdate('wattage', parseFloat(e.target.value) || 0)}
              className="form-input w-full px-4 py-3"
              placeholder="e.g. 430"
            />
          </div>

          <div>
            <label className="text-label text-foreground block mb-2">Efficiency (%)</label>
            <input
              type="number"
              step="0.1"
              value={panels.efficiency}
              onChange={(e) => handlePanelUpdate('efficiency', parseFloat(e.target.value) || 0)}
              className="form-input w-full px-4 py-3"
              placeholder="e.g. 21.5"
            />
          </div>

          <div>
            <label className="text-label text-foreground block mb-2">Quantity</label>
            <input
              type="number"
              value={panels.qty}
              onChange={(e) => handlePanelUpdate('qty', parseInt(e.target.value) || 0)}
              className="form-input w-full px-4 py-3"
              placeholder="e.g. 16"
            />
          </div>

          <div>
            <label className="text-label text-foreground block mb-2">Product Warranty (yrs)</label>
            <input
              type="number"
              value={panels.productWarranty}
              onChange={(e) => handlePanelUpdate('productWarranty', parseInt(e.target.value) || 0)}
              className="form-input w-full px-4 py-3"
              placeholder="e.g. 12"
            />
          </div>

          <div>
            <label className="text-label text-foreground block mb-2">Performance Warranty (yrs)</label>
            <input
              type="number"
              value={panels.performanceWarranty}
              onChange={(e) => handlePanelUpdate('performanceWarranty', parseInt(e.target.value) || 0)}
              className="form-input w-full px-4 py-3"
              placeholder="e.g. 25"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-3 cursor-pointer pb-3">
              <input
                type="checkbox"
                checked={panels.tier1}
                onChange={(e) => handlePanelUpdate('tier1', e.target.checked)}
                className="w-5 h-5 rounded border-border bg-background text-primary focus:ring-primary"
              />
              <span className="text-body-small text-foreground">Tier 1 Manufacturer</span>
            </label>
          </div>

          <div className="flex items-end">
            <Button variant="secondary" className="w-full">
              <Upload className="h-4 w-4" />
              Upload Datasheet
            </Button>
          </div>
        </div>
      </div>

      {/* Inverter */}
      <div className="space-y-4">
        <h4 className="text-body text-foreground">Inverter</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-label text-foreground block mb-2">Brand</label>
            <input
              type="text"
              value={inverter.brand}
              onChange={(e) => handleInverterUpdate('brand', e.target.value)}
              className="form-input w-full px-4 py-3"
              placeholder="e.g. Fronius"
            />
          </div>

          <div>
            <label className="text-label text-foreground block mb-2">Model</label>
            <input
              type="text"
              value={inverter.model}
              onChange={(e) => handleInverterUpdate('model', e.target.value)}
              className="form-input w-full px-4 py-3"
              placeholder="e.g. Primo GEN24"
            />
          </div>

          <div>
            <label className="text-label text-foreground block mb-2">Type</label>
            <select
              value={inverter.type}
              onChange={(e) => handleInverterUpdate('type', e.target.value)}
              className="form-select w-full px-4 py-3"
            >
              <option value="">Select type...</option>
              {INVERTER_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-label text-foreground block mb-2">Capacity (kW)</label>
            <input
              type="number"
              step="0.1"
              value={inverter.capacityKw}
              onChange={(e) => handleInverterUpdate('capacityKw', parseFloat(e.target.value) || 0)}
              className="form-input w-full px-4 py-3"
              placeholder="e.g. 5.0"
            />
          </div>

          <div>
            <label className="text-label text-foreground block mb-2">MPPTs</label>
            <input
              type="number"
              value={inverter.mppts}
              onChange={(e) => handleInverterUpdate('mppts', parseInt(e.target.value) || 0)}
              className="form-input w-full px-4 py-3"
              placeholder="e.g. 2"
            />
          </div>

          <div>
            <label className="text-label text-foreground block mb-2">Warranty (yrs)</label>
            <input
              type="number"
              value={inverter.warranty}
              onChange={(e) => handleInverterUpdate('warranty', parseInt(e.target.value) || 0)}
              className="form-input w-full px-4 py-3"
              placeholder="e.g. 10"
            />
          </div>

          <div className="flex items-end">
            <Button variant="secondary" className="w-full">
              <Upload className="h-4 w-4" />
              Upload Datasheet
            </Button>
          </div>
        </div>
      </div>

      {/* Battery */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-body text-foreground">Battery Storage</h4>
          <label className="flex items-center gap-3 cursor-pointer">
            <span className="text-body-small text-muted-foreground">Include Battery</span>
            <input
              type="checkbox"
              checked={includeBattery}
              onChange={toggleBattery}
              className="w-5 h-5 rounded border-border bg-background text-primary focus:ring-primary"
            />
          </label>
        </div>

        {includeBattery && battery && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-label text-foreground block mb-2">Brand</label>
              <input
                type="text"
                value={battery.brand}
                onChange={(e) => handleBatteryUpdate('brand', e.target.value)}
                className="form-input w-full px-4 py-3"
                placeholder="e.g. Tesla"
              />
            </div>

            <div>
              <label className="text-label text-foreground block mb-2">Model</label>
              <input
                type="text"
                value={battery.model}
                onChange={(e) => handleBatteryUpdate('model', e.target.value)}
                className="form-input w-full px-4 py-3"
                placeholder="e.g. Powerwall 2"
              />
            </div>

            <div>
              <label className="text-label text-foreground block mb-2">Usable Capacity (kWh)</label>
              <input
                type="number"
                step="0.1"
                value={battery.usableKwh}
                onChange={(e) => handleBatteryUpdate('usableKwh', parseFloat(e.target.value) || 0)}
                className="form-input w-full px-4 py-3"
                placeholder="e.g. 13.5"
              />
            </div>

            <div>
              <label className="text-label text-foreground block mb-2">Power Output (kW)</label>
              <input
                type="number"
                step="0.1"
                value={battery.powerKw}
                onChange={(e) => handleBatteryUpdate('powerKw', parseFloat(e.target.value) || 0)}
                className="form-input w-full px-4 py-3"
                placeholder="e.g. 5.0"
              />
            </div>

            <div>
              <label className="text-label text-foreground block mb-2">Chemistry</label>
              <select
                value={battery.chemistry}
                onChange={(e) => handleBatteryUpdate('chemistry', e.target.value)}
                className="form-select w-full px-4 py-3"
              >
                {BATTERY_CHEMISTRY.map((chem) => (
                  <option key={chem.value} value={chem.value}>
                    {chem.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-label text-foreground block mb-2">Warranty (yrs)</label>
              <input
                type="number"
                value={battery.warranty}
                onChange={(e) => handleBatteryUpdate('warranty', parseInt(e.target.value) || 0)}
                className="form-input w-full px-4 py-3"
                placeholder="e.g. 10"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer pb-3">
                <input
                  type="checkbox"
                  checked={battery.expandable}
                  onChange={(e) => handleBatteryUpdate('expandable', e.target.checked)}
                  className="w-5 h-5 rounded border-border bg-background text-primary focus:ring-primary"
                />
                <span className="text-body-small text-foreground">Expandable</span>
              </label>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer pb-3">
                <input
                  type="checkbox"
                  checked={battery.backupSupported}
                  onChange={(e) => handleBatteryUpdate('backupSupported', e.target.checked)}
                  className="w-5 h-5 rounded border-border bg-background text-primary focus:ring-primary"
                />
                <span className="text-body-small text-foreground">Backup Supported</span>
              </label>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer pb-3">
                <input
                  type="checkbox"
                  checked={battery.backupCircuitRequired}
                  onChange={(e) => handleBatteryUpdate('backupCircuitRequired', e.target.checked)}
                  className="w-5 h-5 rounded border-border bg-background text-primary focus:ring-primary"
                />
                <span className="text-body-small text-foreground">Backup Circuit Required</span>
              </label>
            </div>

            <div className="flex items-end md:col-span-2 lg:col-span-1">
              <Button variant="secondary" className="w-full">
                <Upload className="h-4 w-4" />
                Upload Datasheet
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add-ons */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-body text-foreground">Add-ons</h4>
          <Button
            variant="secondary"
            onClick={() => setShowAddonSelector(!showAddonSelector)}
          >
            <Plus className="h-4 w-4" />
            Add Item
          </Button>
        </div>

        {showAddonSelector && (
          <div className="border border-border rounded-lg p-4 space-y-2">
            <p className="text-caption text-muted-foreground mb-3">Select add-on to include:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {ADDON_OPTIONS.map((addon) => (
                <button
                  key={addon.key}
                  onClick={() => addAddon(addon.key)}
                  disabled={addons.some((a) => a.key === addon.key)}
                  className={`
                    text-left transition-all
                    ${addons.some((a) => a.key === addon.key)
                      ? 'px-4 py-2 rounded-lg text-body-small bg-background-alt text-muted-foreground cursor-not-allowed'
                      : 'selection-chip'
                    }
                  `}
                >
                  {addon.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {addons.length > 0 && (
          <div className="space-y-3">
            {/* Header Row */}
            <div className="grid grid-cols-12 gap-3 text-caption text-muted-foreground pb-2 border-b border-border">
              <div className="col-span-4">Item</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-2"></div>
            </div>
            
            {/* Data Rows */}
            {addons.map((addon) => (
              <div key={addon.key} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-4 text-body-small text-foreground">{addon.label}</div>
                <div className="col-span-2">
                  <input
                    type="number"
                    min="1"
                    value={addon.qty}
                    onChange={(e) => updateAddon(addon.key, 'qty', parseInt(e.target.value) || 1)}
                    className="form-input w-full px-3 py-2 text-center text-body-small"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="number"
                    min="0"
                    value={addon.unitPrice}
                    onChange={(e) =>
                      updateAddon(addon.key, 'unitPrice', parseFloat(e.target.value) || 0)
                    }
                    className="form-input w-full px-3 py-2 text-right text-body-small"
                  />
                </div>
                <div className="col-span-2 text-right text-body-small text-foreground">
                  ${(addon.qty * addon.unitPrice).toLocaleString()}
                </div>
                <div className="col-span-2 flex justify-end">
                  <button
                    type="button"
                    className="btn-delete"
                    onClick={() => removeAddon(addon.key)}
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductConfiguration;
