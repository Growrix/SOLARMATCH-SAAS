
  lead_price_call_visit: string;
  lead_price_written_quote: string;
}

// ============================================================================
// ICONS
// ============================================================================

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/>
    <path d="M12 5v14"/>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"/>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
  </svg>
);

const LoadingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AdminSettingsPage() {
  const router = useRouter();
  const { theme } = useTheme();
  
  // State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [approvalMode, setApprovalMode] = useState<'MANUAL' | 'AUTO'>('MANUAL');
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [priceCallVisit, setPriceCallVisit] = useState('');
  const [priceWrittenQuote, setPriceWrittenQuote] = useState('');
  
  // Modal states
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);
  
  // Rule form state
  const [ruleName, setRuleName] = useState('');
  const [ruleEnabled, setRuleEnabled] = useState(true);
  const [ruleQuoteType, setRuleQuoteType] = useState<'ANY' | 'CALL_VISIT' | 'WRITTEN_QUOTE'>('ANY');
  const [rulePhoneVerified, setRulePhoneVerified] = useState<boolean | undefined>(undefined);
  const [rulePostcodes, setRulePostcodes] = useState('');
  const [ruleMinBill, setRuleMinBill] = useState('');
  const [ruleMaxBill, setRuleMaxBill] = useState('');
  const [rulePrice, setRulePrice] = useState('');
  const [ruleVisibility, setRuleVisibility] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
  const [ruleAssignTo, setRuleAssignTo] = useState<'ALL'>('ALL');

  // ============================================================================
  // FETCH SETTINGS
  // ============================================================================

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings?keys=approval_mode,automation_rules,lead_price_call_visit,lead_price_written_quote');
      
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      
      const data = await response.json();
      
      // Set approval mode
      setApprovalMode(data.approval_mode?.toUpperCase() || 'MANUAL');
      
      // Parse automation rules
      if (data.automation_rules) {
        try {
          const rules = JSON.parse(data.automation_rules);
          setAutomationRules(Array.isArray(rules) ? rules : []);
        } catch {
          setAutomationRules([]);
        }
      }
      
      // Set pricing
      setPriceCallVisit(data.lead_price_call_visit || '50');
      setPriceWrittenQuote(data.lead_price_written_quote || '75');
    } catch (error) {
      console.error('Error fetching settings:', error);
      alert('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================================
  // SAVE MODE
  // ============================================================================

  const handleSaveMode = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: [
            { key: 'approval_mode', value: approvalMode.toLowerCase() },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save mode');
      }

      alert(`Approval mode switched to ${approvalMode} successfully`);
    } catch (error) {
      console.error('Error saving mode:', error);
      alert('Failed to save mode');
    } finally {
      setSaving(false);
    }
  };

  // ============================================================================
  // SAVE PRICING
  // ============================================================================

  const handleSavePricing = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: [
            { key: 'lead_price_call_visit', value: priceCallVisit },
            { key: 'lead_price_written_quote', value: priceWrittenQuote },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save pricing');
      }

      alert('Pricing saved successfully');
    } catch (error) {
      console.error('Error saving pricing:', error);
      alert('Failed to save pricing');
    } finally {
      setSaving(false);
    }
  };

  // ============================================================================
  // RULE MANAGEMENT
  // ============================================================================

  const openNewRuleModal = () => {
    // Reset form
    setRuleName('');
    setRuleEnabled(true);
    setRuleQuoteType('ANY');
    setRulePhoneVerified(undefined);
    setRulePostcodes('');
    setRuleMinBill('');
    setRuleMaxBill('');
    setRulePrice('');
    setRuleVisibility('PUBLIC');
    setRuleAssignTo('ALL');
    setEditingRule(null);
    setShowRuleModal(true);
  };

  const openEditRuleModal = (rule: AutomationRule) => {
    setRuleName(rule.name);
    setRuleEnabled(rule.enabled);
    setRuleQuoteType(rule.conditions.quoteType || 'ANY');
    setRulePhoneVerified(rule.conditions.phoneVerified);
    setRulePostcodes(rule.conditions.postcodes?.join(', ') || '');
    setRuleMinBill(rule.conditions.minEnergyBill?.toString() || '');
    setRuleMaxBill(rule.conditions.maxEnergyBill?.toString() || '');
    setRulePrice(rule.actions.setPrice?.toString() || '');
    setRuleVisibility(rule.actions.visibility || 'PUBLIC');
    setRuleAssignTo('ALL');
    setEditingRule(rule);
    setShowRuleModal(true);
  };

  const handleSaveRule = async () => {
    if (!ruleName.trim()) {
      alert('Please enter a rule name');
      return;
    }

    const newRule: AutomationRule = {
      id: editingRule?.id || `rule_${Date.now()}`,
      name: ruleName,
      enabled: ruleEnabled,
      conditions: {
        quoteType: ruleQuoteType !== 'ANY' ? ruleQuoteType : undefined,
        phoneVerified: rulePhoneVerified,
        postcodes: rulePostcodes ? rulePostcodes.split(',').map(p => p.trim()).filter(Boolean) : undefined,
        minEnergyBill: ruleMinBill ? parseFloat(ruleMinBill) : undefined,
        maxEnergyBill: ruleMaxBill ? parseFloat(ruleMaxBill) : undefined,
      },
      actions: {
        approve: true,
        setPrice: rulePrice ? parseFloat(rulePrice) : undefined,
        visibility: ruleVisibility,
        assignTo: ruleAssignTo,
      },
    };

    let updatedRules: AutomationRule[];
    if (editingRule) {
      // Update existing rule
      updatedRules = automationRules.map(r => r.id === editingRule.id ? newRule : r);
    } else {
      // Add new rule
      updatedRules = [...automationRules, newRule];
    }

    try {
      setSaving(true);
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: [
            { key: 'automation_rules', value: JSON.stringify(updatedRules) },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save rule');
      }

      setAutomationRules(updatedRules);
      setShowRuleModal(false);
    } catch (error) {
      console.error('Error saving rule:', error);
      alert('Failed to save rule');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) {
      return;
    }

    const updatedRules = automationRules.filter(r => r.id !== ruleId);

    try {
      setSaving(true);
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: [
            { key: 'automation_rules', value: JSON.stringify(updatedRules) },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete rule');
      }

      setAutomationRules(updatedRules);
    } catch (error) {
      console.error('Error deleting rule:', error);
      alert('Failed to delete rule');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleRule = async (ruleId: string) => {
    const updatedRules = automationRules.map(r =>
      r.id === ruleId ? { ...r, enabled: !r.enabled } : r
    );

    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          settings: [
            { key: 'automation_rules', value: JSON.stringify(updatedRules) },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle rule');
      }

      setAutomationRules(updatedRules);
    } catch (error) {
      console.error('Error toggling rule:', error);
      alert('Failed to toggle rule');
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingIcon />
        <span className="ml-2">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-8 ${theme === 'dark' ? 'bg-[#0A0F1E]' : 'bg-gray-50'}`}>
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-4">
          <SettingsIcon />
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            System Settings
          </h1>
        </div>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          Configure approval modes, automation rules, and global pricing
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto space-y-6">
        {/* APPROVAL MODE */}
        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-[#1A1F2E]' : 'bg-white'} shadow-sm`}>
          <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Approval Mode
          </h2>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Switch between Manual Review and Auto-Approval modes. Changes apply to all new leads.
          </p>
          
          <div className="flex gap-4 items-center">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="approvalMode"
                  value="MANUAL"
                  checked={approvalMode === 'MANUAL'}
                  onChange={(e) => setApprovalMode('MANUAL')}
                  className="w-4 h-4"
                />
                <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  Manual Review
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="approvalMode"
                  value="AUTO"
                  checked={approvalMode === 'AUTO'}
                  onChange={(e) => setApprovalMode('AUTO')}
                  className="w-4 h-4"
                />
                <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  Auto-Approval
                </span>
              </label>
            </div>
            
            <button
              onClick={handleSaveMode}
              disabled={saving}
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {saving ? <LoadingIcon /> : <SaveIcon />}
              Save Mode
            </button>
          </div>
        </div>

        {/* GLOBAL PRICING */}
        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-[#1A1F2E]' : 'bg-white'} shadow-sm`}>
          <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Global Default Pricing
          </h2>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Set default prices for each quote type. Used in auto-approval and as defaults for manual approval.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Call/Visit Quote Price (£)
              </label>
              <input
                type="number"
                value={priceCallVisit}
                onChange={(e) => setPriceCallVisit(e.target.value)}
                placeholder="50"
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-[#0A0F1E] border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            
            <div>
              <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Written Quote Price (£)
              </label>
              <input
                type="number"
                value={priceWrittenQuote}
                onChange={(e) => setPriceWrittenQuote(e.target.value)}
                placeholder="75"
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-[#0A0F1E] border-gray-700 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
          </div>
          
          <button
            onClick={handleSavePricing}
            disabled={saving}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {saving ? <LoadingIcon /> : <SaveIcon />}
            Save Pricing
          </button>
        </div>

        {/* AUTOMATION RULES */}
        <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-[#1A1F2E]' : 'bg-white'} shadow-sm`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Automation Rules
              </h2>
              <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Configure rules for auto-approval mode. Rules are evaluated in order.
              </p>
            </div>
            <button
              onClick={openNewRuleModal}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <PlusIcon />
              Add Rule
            </button>
          </div>

          {automationRules.length === 0 ? (
            <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              No automation rules configured. Add a rule to enable auto-approval.
            </div>
          ) : (
            <div className="space-y-4">
              {automationRules.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-4 rounded-lg border ${
                    theme === 'dark' ? 'border-gray-700 bg-[#0A0F1E]' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                          {rule.name}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          rule.enabled
                            ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300'
                        }`}>
                          {rule.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      
                      <div className={`text-sm space-y-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {rule.conditions.quoteType && (
                          <p>• Quote Type: {rule.conditions.quoteType.replace('_', ' ')}</p>
                        )}
                        {rule.conditions.phoneVerified !== undefined && (
                          <p>• Phone Verified: {rule.conditions.phoneVerified ? 'Yes' : 'No'}</p>
                        )}
                        {rule.conditions.postcodes && rule.conditions.postcodes.length > 0 && (
                          <p>• Postcodes: {rule.conditions.postcodes.join(', ')}</p>
                        )}
                        {rule.conditions.minEnergyBill && (
                          <p>• Min Energy Bill: £{rule.conditions.minEnergyBill}</p>
                        )}
                        {rule.conditions.maxEnergyBill && (
                          <p>• Max Energy Bill: £{rule.conditions.maxEnergyBill}</p>
                        )}
                        {rule.actions.setPrice && (
                          <p>• Set Price: £{rule.actions.setPrice}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleRule(rule.id)}
                        className={`px-3 py-1 text-sm rounded ${
                          rule.enabled
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-300'
                            : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-500/20 dark:text-green-300'
                        }`}
                      >
                        {rule.enabled ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => openEditRuleModal(rule)}
                        className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RULE MODAL */}
      {showRuleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 rounded-lg ${
            theme === 'dark' ? 'bg-[#1A1F2E]' : 'bg-white'
          }`}>
            <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {editingRule ? 'Edit Rule' : 'New Rule'}
            </h2>

            <div className="space-y-4">
              {/* Rule Name */}
              <div>
                <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Rule Name *
                </label>
                <input
                  type="text"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  placeholder="e.g., Auto-approve verified homeowners"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-[#0A0F1E] border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              {/* Enabled */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ruleEnabled}
                    onChange={(e) => setRuleEnabled(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                    Enable this rule
                  </span>
                </label>
              </div>

              <h3 className={`text-lg font-semibold mt-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Conditions (all must match)
              </h3>

              {/* Quote Type */}
              <div>
                <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Quote Type
                </label>
                <select
                  value={ruleQuoteType}
                  onChange={(e) => setRuleQuoteType(e.target.value as any)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-[#0A0F1E] border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="ANY">Any</option>
                  <option value="CALL_VISIT">Call/Visit</option>
                  <option value="WRITTEN_QUOTE">Written Quote</option>
                </select>
              </div>

              {/* Phone Verified */}
              <div>
                <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Phone Verified
                </label>
                <select
                  value={rulePhoneVerified === undefined ? 'any' : rulePhoneVerified ? 'yes' : 'no'}
                  onChange={(e) => setRulePhoneVerified(e.target.value === 'any' ? undefined : e.target.value === 'yes')}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-[#0A0F1E] border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="any">Any</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              {/* Postcodes */}
              <div>
                <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Postcodes (comma-separated, e.g., SW1, E1, N1)
                </label>
                <input
                  type="text"
                  value={rulePostcodes}
                  onChange={(e) => setRulePostcodes(e.target.value)}
                  placeholder="SW1, E1, N1 or leave empty for any"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-[#0A0F1E] border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              {/* Energy Bill Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Min Energy Bill (£)
                  </label>
                  <input
                    type="number"
                    value={ruleMinBill}
                    onChange={(e) => setRuleMinBill(e.target.value)}
                    placeholder="Optional"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-[#0A0F1E] border-gray-700 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Max Energy Bill (£)
                  </label>
                  <input
                    type="number"
                    value={ruleMaxBill}
                    onChange={(e) => setRuleMaxBill(e.target.value)}
                    placeholder="Optional"
                    className={`w-full px-4 py-2 rounded-lg border ${
                      theme === 'dark'
                        ? 'bg-[#0A0F1E] border-gray-700 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              <h3 className={`text-lg font-semibold mt-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Actions (when conditions match)
              </h3>

              {/* Set Price */}
              <div>
                <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Set Price (£) - Leave empty to use global default
                </label>
                <input
                  type="number"
                  value={rulePrice}
                  onChange={(e) => setRulePrice(e.target.value)}
                  placeholder="Optional"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-[#0A0F1E] border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              {/* Visibility */}
              <div>
                <label className={`block text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Visibility
                </label>
                <select
                  value={ruleVisibility}
                  onChange={(e) => setRuleVisibility(e.target.value as any)}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-[#0A0F1E] border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="PUBLIC">Public (visible to all installers)</option>
                  <option value="PRIVATE">Private (assigned only)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRuleModal(false)}
                className={`flex-1 px-4 py-2 rounded-lg ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRule}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <LoadingIcon /> : <SaveIcon />}
                Save Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
