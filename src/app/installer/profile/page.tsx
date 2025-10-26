/**
 * Installer Profile Page
 * 
 * Phase 7.5.10 - T329-T334
 * 
 * Features:
 * - Profile overview with completion progress
 * - Company details editing
 * - Service areas management (postcodes)
 * - Contact persons management
 * - Document uploads for verification
 * - Password change
 * - Verification status and actions
 */

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CompanyVerificationModal from '@/components/CompanyVerificationModal';
import {
  BuildingOfficeIcon,
  MapPinIcon,
  UserGroupIcon,
  DocumentTextIcon,
  LockClosedIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';

// Types
interface InstallerProfile {
  id: string;
  companyName: string;
  businessAddress: string;
  postcode: string;
  phone: string;
  email: string;
  abn_number?: string;
  cec_accredited?: boolean;
  license_number?: string;
  insurance_expiry?: string;
  years_in_business?: number;
  installerVerified: boolean;
  phoneVerified: boolean;
  profileCompletion: number;
  verificationStatus?: string;
  servicePostcodes: ServicePostcode[];
  contacts: CompanyContact[];
  documents: CompanyDocument[];
}

interface ServicePostcode {
  id: string;
  postcode: string;
  suburb?: string;
  isActive: boolean;
  createdAt: string;
}

interface CompanyContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  contactType: 'PRIMARY' | 'TECHNICAL' | 'BILLING' | 'SUPPORT';
  isActive: boolean;
}

interface CompanyDocument {
  id: string;
  documentType: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  uploadedAt: string;
  verifiedAt?: string;
}

export default function InstallerProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<InstallerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);

  // Detect if page is loaded in iframe
  useEffect(() => {
    setIsInIframe(window.self !== window.top);
  }, []);

  // Form states
  const [formData, setFormData] = useState({
    companyName: '',
    businessAddress: '',
    postcode: '',
    phone: '',
    abn_number: '',
    cec_accredited: false,
    license_number: '',
    insurance_expiry: '',
    years_in_business: 0,
  });

  // Redirect if not authenticated or not installer
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    } else if (status === 'authenticated' && session?.user?.role !== 'INSTALLER') {
      router.push('/');
    }
  }, [status, session, router]);

  // Fetch profile data
  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status]);

  async function fetchProfile() {
    try {
      setLoading(true);
      const response = await fetch('/api/installer/profile');
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data.profile);
      
      // Initialize form data
      setFormData({
        companyName: data.profile.companyName || '',
        businessAddress: data.profile.businessAddress || '',
        postcode: data.profile.postcode || '',
        phone: data.profile.phone || '',
        abn_number: data.profile.abn_number || '',
        cec_accredited: data.profile.cec_accredited || false,
        license_number: data.profile.license_number || '',
        insurance_expiry: data.profile.insurance_expiry || '',
        years_in_business: data.profile.years_in_business || 0,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfile() {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch('/api/installer/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const data = await response.json();
      setProfile(data.profile);
      setEditMode(false);
      
      // Show success message
      alert('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <p className="text-red-800 dark:text-red-200">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={isInIframe ? "min-h-screen" : "min-h-screen bg-slate-50 dark:bg-slate-900 py-8"}>
      <div className={isInIframe ? "max-w-7xl mx-auto" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}>
        {/* Header */}
        {!isInIframe && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Company Profile
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage your company information, documents, and verification status
            </p>
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Overview Card */}
          <ProfileOverviewCard
            profile={profile}
            formData={formData}
            setFormData={setFormData}
            editMode={editMode}
            setEditMode={setEditMode}
            saving={saving}
            onSave={handleSaveProfile}
          />

          {/* Service Areas Card */}
          <ServiceAreasCard
            postcodes={profile?.servicePostcodes || []}
            onRefresh={fetchProfile}
          />

          {/* Contact Persons Card */}
          <ContactPersonsCard
            contacts={profile?.contacts || []}
            onRefresh={fetchProfile}
          />

          {/* Uploaded Documents Card */}
          <UploadedDocumentsCard
            documents={profile?.documents || []}
            onRefresh={fetchProfile}
          />

          {/* Password Change Card */}
          <PasswordChangeCard />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PROFILE OVERVIEW CARD
// ============================================================================
interface ProfileOverviewCardProps {
  profile: InstallerProfile | null;
  formData: any;
  setFormData: (data: any) => void;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  saving: boolean;
  onSave: () => void;
}

function ProfileOverviewCard({
  profile,
  formData,
  setFormData,
  editMode,
  setEditMode,
  saving,
  onSave,
}: ProfileOverviewCardProps) {
  const inputClasses = "w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent";
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <BuildingOfficeIcon className="h-6 w-6 text-brand-600 dark:text-brand-400" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Company Details
          </h2>
        </div>
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={() => setEditMode(false)}
              className="px-3 py-1 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="px-3 py-1 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Company Name
          </label>
          {editMode ? (
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className={inputClasses}
              required
            />
          ) : (
            <p className="text-slate-900 dark:text-white">{profile?.companyName || '-'}</p>
          )}
        </div>

        {/* Business Address */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Business Address
          </label>
          {editMode ? (
            <input
              type="text"
              value={formData.businessAddress}
              onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
              className={inputClasses}
              required
            />
          ) : (
            <p className="text-slate-900 dark:text-white">{profile?.businessAddress || '-'}</p>
          )}
        </div>

        {/* Postcode and Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Postcode
            </label>
            {editMode ? (
              <input
                type="text"
                value={formData.postcode}
                onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                className={inputClasses}
                maxLength={4}
                pattern="\d{4}"
                required
              />
            ) : (
              <p className="text-slate-900 dark:text-white">{profile?.postcode || '-'}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Phone
            </label>
            {editMode ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={inputClasses}
                required
              />
            ) : (
              <p className="text-slate-900 dark:text-white">{profile?.phone || '-'}</p>
            )}
          </div>
        </div>

        {/* ABN Number */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            ABN Number
          </label>
          {editMode ? (
            <input
              type="text"
              value={formData.abn_number}
              onChange={(e) => setFormData({ ...formData, abn_number: e.target.value })}
              className={inputClasses}
              placeholder="11 digit ABN"
            />
          ) : (
            <p className="text-slate-900 dark:text-white">{profile?.abn_number || '-'}</p>
          )}
        </div>

        {/* License Number */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            License Number
          </label>
          {editMode ? (
            <input
              type="text"
              value={formData.license_number}
              onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
              className={inputClasses}
              placeholder="Electrical license number"
            />
          ) : (
            <p className="text-slate-900 dark:text-white">{profile?.license_number || '-'}</p>
          )}
        </div>

        {/* CEC Accredited and Years in Business */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              CEC Accredited
            </label>
            {editMode ? (
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.cec_accredited}
                  onChange={(e) => setFormData({ ...formData, cec_accredited: e.target.checked })}
                  className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-slate-300 dark:border-slate-600 rounded"
                />
                <span className="text-slate-900 dark:text-white">Yes</span>
              </label>
            ) : (
              <p className="text-slate-900 dark:text-white">
                {profile?.cec_accredited ? 'Yes' : 'No'}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Years in Business
            </label>
            {editMode ? (
              <input
                type="number"
                value={formData.years_in_business}
                onChange={(e) => setFormData({ ...formData, years_in_business: parseInt(e.target.value) || 0 })}
                className={inputClasses}
                min="0"
                max="100"
              />
            ) : (
              <p className="text-slate-900 dark:text-white">{profile?.years_in_business || 0} years</p>
            )}
          </div>
        </div>

        {/* Insurance Expiry */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Insurance Expiry Date
          </label>
          {editMode ? (
            <input
              type="date"
              value={formData.insurance_expiry}
              onChange={(e) => setFormData({ ...formData, insurance_expiry: e.target.value })}
              className={inputClasses}
            />
          ) : (
            <p className="text-slate-900 dark:text-white">
              {profile?.insurance_expiry ? new Date(profile.insurance_expiry).toLocaleDateString() : '-'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SERVICE AREAS CARD
// ============================================================================
interface ServiceAreasCardProps {
  postcodes: ServicePostcode[];
  onRefresh: () => void;
}

function ServiceAreasCard({ postcodes, onRefresh }: ServiceAreasCardProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPostcode, setNewPostcode] = useState('');
  const [newSuburb, setNewSuburb] = useState('');
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleAddPostcode(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setAdding(true);
      
      const response = await fetch('/api/installer/profile/postcodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          postcode: newPostcode,
          suburb: newSuburb || undefined
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add postcode');
      }

      setNewPostcode('');
      setNewSuburb('');
      setShowAddForm(false);
      onRefresh();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setAdding(false);
    }
  }

  async function handleDeletePostcode(id: string) {
    if (!confirm('Remove this service area?')) return;

    try {
      setDeleting(id);
      
      const response = await fetch(`/api/installer/profile/postcodes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove postcode');
      }

      onRefresh();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <MapPinIcon className="h-6 w-6 text-brand-600 dark:text-brand-400" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Service Areas
          </h2>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddPostcode} className="mb-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
          <div className="space-y-3">
            <input
              type="text"
              value={newPostcode}
              onChange={(e) => setNewPostcode(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="Postcode (4 digits)"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              maxLength={4}
              required
            />
            <input
              type="text"
              value={newSuburb}
              onChange={(e) => setNewSuburb(e.target.value)}
              placeholder="Suburb (optional)"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={adding || newPostcode.length !== 4}
                className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50"
              >
                {adding ? 'Adding...' : 'Add'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewPostcode('');
                  setNewSuburb('');
                }}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {postcodes.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
            No service areas added yet
          </p>
        ) : (
          postcodes.map((area) => (
            <div
              key={area.id}
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
            >
              <div>
                <p className="font-medium text-slate-900 dark:text-white">
                  {area.postcode}
                </p>
                {area.suburb && (
                  <p className="text-sm text-slate-600 dark:text-slate-400">{area.suburb}</p>
                )}
              </div>
              <button
                onClick={() => handleDeletePostcode(area.id)}
                disabled={deleting === area.id}
                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ============================================================================
// CONTACT PERSONS CARD
// ============================================================================
interface ContactPersonsCardProps {
  contacts: CompanyContact[];
  onRefresh: () => void;
}

function ContactPersonsCard({ contacts, onRefresh }: ContactPersonsCardProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    contactType: 'TECHNICAL' as 'PRIMARY' | 'TECHNICAL' | 'BILLING' | 'SUPPORT',
  });

  async function handleAddContact(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      setAdding(true);
      
      const response = await fetch('/api/installer/profile/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add contact');
      }

      setFormData({
        name: '',
        email: '',
        phone: '',
        position: '',
        contactType: 'TECHNICAL',
      });
      setShowAddForm(false);
      onRefresh();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setAdding(false);
    }
  }

  async function handleDeleteContact(id: string) {
    if (!confirm('Remove this contact?')) return;

    try {
      setDeleting(id);
      
      const response = await fetch(`/api/installer/profile/contacts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to remove contact');
      }

      onRefresh();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <UserGroupIcon className="h-6 w-6 text-brand-600 dark:text-brand-400" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Contact Persons
          </h2>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddContact} className="mb-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg space-y-3">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Contact name"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            required
          />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Email"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            required
          />
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="Phone"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            required
          />
          <input
            type="text"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            placeholder="Position/Title"
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            required
          />
          <select
            value={formData.contactType}
            onChange={(e) => setFormData({ ...formData, contactType: e.target.value as any })}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="PRIMARY">Primary Contact</option>
            <option value="TECHNICAL">Technical Contact</option>
            <option value="BILLING">Billing Contact</option>
            <option value="SUPPORT">Support Contact</option>
          </select>
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={adding}
              className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50"
            >
              {adding ? 'Adding...' : 'Add Contact'}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {contacts.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
            No contacts added yet
          </p>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-slate-900 dark:text-white">
                      {contact.name}
                    </p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300">
                      {contact.contactType}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{contact.position}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{contact.email}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{contact.phone}</p>
                </div>
                <button
                  onClick={() => handleDeleteContact(contact.id)}
                  disabled={deleting === contact.id}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ============================================================================
// UPLOADED DOCUMENTS CARD
// ============================================================================
interface UploadedDocumentsCardProps {
  documents: CompanyDocument[];
  onRefresh: () => void;
}

function UploadedDocumentsCard({ documents, onRefresh }: UploadedDocumentsCardProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, documentType: string) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only PDF, JPG, and PNG files are allowed');
      return;
    }

    try {
      setUploading(true);

      // Step 1: Get presigned URL
      const response = await fetch('/api/installer/profile/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          documentType,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get upload URL');
      }

      const data = await response.json();

      // Step 2: Upload to S3
      const uploadResponse = await fetch(data.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to S3');
      }

      alert('Document uploaded successfully!');
      onRefresh();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset file input
    }
  }

  async function handleDeleteDocument(id: string) {
    if (!confirm('Delete this document?')) return;

    try {
      setDeleting(id);
      
      const response = await fetch(`/api/installer/profile/documents/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete document');
      }

      onRefresh();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setDeleting(null);
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
            <XCircleIcon className="h-3 w-3 mr-1" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
            <ClockIcon className="h-3 w-3 mr-1" />
            Pending
          </span>
        );
    }
  }

  const documentTypes = [
    { type: 'CEC_ACCREDITATION', label: 'CEC Accreditation' },
    { type: 'BUSINESS_LICENSE', label: 'Business License' },
    { type: 'INSURANCE_CERTIFICATE', label: 'Insurance Certificate' },
    { type: 'ELECTRICAL_LICENSE', label: 'Electrical License' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <DocumentTextIcon className="h-6 w-6 text-brand-600 dark:text-brand-400" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Verification Documents
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {documentTypes.map(({ type, label }) => (
          <div key={type} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              {label}
            </label>
            <label
              className={`flex items-center justify-center px-4 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-brand-500 dark:hover:border-brand-400 transition-colors ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ArrowUpTrayIcon className="h-5 w-5 text-slate-400 mr-2" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {uploading ? 'Uploading...' : 'Upload File'}
              </span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileUpload(e, type)}
                disabled={uploading}
              />
            </label>
          </div>
        ))}
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {documents.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
            No documents uploaded yet
          </p>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-slate-900 dark:text-white text-sm">
                    {doc.fileName}
                  </p>
                  {getStatusBadge(doc.status)}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {doc.documentType.replace('_', ' ')} • {(doc.fileSize / 1024).toFixed(1)} KB • 
                  Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
                >
                  View
                </a>
                {doc.status !== 'APPROVED' && (
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    disabled={deleting === doc.id}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 disabled:opacity-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Required:</strong> Upload all documents before submitting verification request
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// PASSWORD CHANGE CARD
// ============================================================================
function PasswordChangeCard() {
  const [changing, setChanging] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    try {
      setChanging(true);

      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to change password');
      }

      alert('Password changed successfully!');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setChanging(false);
    }
  }

  const inputClasses = "w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-transparent";

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <LockClosedIcon className="h-6 w-6 text-brand-600 dark:text-brand-400" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Change Password
        </h2>
      </div>

      <form onSubmit={handleChangePassword} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Current Password
          </label>
          <input
            type="password"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            className={inputClasses}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            New Password
          </label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            className={inputClasses}
            minLength={8}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className={inputClasses}
            minLength={8}
            required
          />
        </div>

        <button
          type="submit"
          disabled={changing}
          className="w-full px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors"
        >
          {changing ? 'Changing Password...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}
