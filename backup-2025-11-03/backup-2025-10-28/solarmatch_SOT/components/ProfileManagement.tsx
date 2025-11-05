import React, { useState, useRef } from 'react';
import type { UserProfile } from '../types';

// --- Icon Components ---
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const AlertTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>;

interface ProfileManagementProps {
  user: UserProfile;
  onUpdate: (updatedUser: UserProfile) => void;
  onDeleteClick: () => void;
}

const ProfileManagement: React.FC<ProfileManagementProps> = ({ user, onUpdate, onDeleteClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(user);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    // A generic, consistent placeholder for removed avatars.
    setFormData(prev => ({ ...prev, avatar: 'https://picsum.photos/seed/default-avatar/200' }));
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
  };

  const baseInputClasses = "w-full bg-gray-100 dark:bg-slate-900/50 border border-gray-300 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors disabled:opacity-70 disabled:cursor-not-allowed";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile Picture Card */}
      <div className="theme-card p-6">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <img src={formData.avatar} alt="Profile Avatar" className="w-24 h-24 rounded-full object-cover" />
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Profile Picture</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Upload a new photo to personalize your account.</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
            />
            <div className="mt-4 flex space-x-2 justify-center sm:justify-start">
              <button 
                onClick={() => fileInputRef.current?.click()} 
                disabled={!isEditing}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload New
              </button>
              <button 
                onClick={handleRemoveImage}
                disabled={!isEditing}
                className="bg-gray-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove
              </button>
            </div>
            {!isEditing && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Click 'Edit' below to change your photo.</p>}
          </div>
        </div>
      </div>

      {/* Personal Information Card */}
      <div className="theme-card">
        <div className="p-6 border-b border-gray-200 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Personal Information</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your personal details.</p>
          </div>
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/20 transition-colors">Edit</button>
          )}
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <UserIcon />
              <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} disabled={!isEditing} placeholder="Full Name" className={baseInputClasses} />
            </div>
            <div className="relative">
              <MailIcon />
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} disabled={!isEditing} placeholder="Email Address" className={baseInputClasses} />
            </div>
            <div className="relative">
              <PhoneIcon />
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} disabled={!isEditing} placeholder="Phone Number" className={baseInputClasses} />
            </div>
            <div className="relative">
              <MapPinIcon />
              <input type="text" name="address" value={formData.address} onChange={handleInputChange} disabled={!isEditing} placeholder="Property Address" className={baseInputClasses} />
            </div>
          </div>
        </div>
        {isEditing && (
          <div className="p-6 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-800 rounded-b-2xl flex justify-end space-x-2">
            <button onClick={handleCancel} className="bg-gray-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors">Cancel</button>
            <button onClick={handleSave} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm">Save Changes</button>
          </div>
        )}
      </div>

      {/* Security Card */}
      <div className="theme-card">
        <div className="p-6 border-b border-gray-200 dark:border-slate-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Security</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Change your password.</p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <LockIcon />
              <input type="password" placeholder="Current Password" className={baseInputClasses.replace('disabled:opacity-70 disabled:cursor-not-allowed','')} />
            </div>
            <div className="relative">
              <LockIcon />
              <input type="password" placeholder="New Password" className={baseInputClasses.replace('disabled:opacity-70 disabled:cursor-not-allowed','')} />
            </div>
            <div className="relative md:col-span-2">
                <LockIcon />
                <input type="password" placeholder="Confirm New Password" className={baseInputClasses.replace('disabled:opacity-70 disabled:cursor-not-allowed','')} />
            </div>
        </div>
         <div className="p-6 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-800 rounded-b-2xl flex justify-end">
            <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors shadow-sm">Change Password</button>
        </div>
      </div>
      
      {/* Danger Zone Card */}
      <div className="theme-card border-red-500/30 dark:border-red-500/50">
         <div className="p-6">
            <h3 className="text-xl font-bold text-red-500 dark:text-red-400">Danger Zone</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-4">
                Deleting your account is a permanent action and cannot be undone. All your quote requests, bids, and personal data will be removed.
            </p>
            <button onClick={onDeleteClick} className="bg-red-500/10 text-red-500 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-500/20 hover:text-red-400 transition-colors flex items-center">
                <AlertTriangleIcon />
                Delete My Account
            </button>
         </div>
      </div>
    </div>
  );
};

export default ProfileManagement;