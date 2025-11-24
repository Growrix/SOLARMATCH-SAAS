/**
 * Installer Type Definitions
 * 
 * Type definitions for installer profile and assigned leads API responses.
 */

export interface InstallerProfile {
  id: string;
  companyName: string;
  email: string;
  phone: string | null;
  serviceAreas: string[];
  postcodes: string[];
  isApproved: boolean;
  verified: boolean;
  creditBalance: number;
  totalUnlocks: number;
  successRate: number;
}

export interface AssignedLead {
  id: string;
  homeownerId: string;
  status: string;
  quoteType: string;
  postcode: string;
  location: string;
  state: string;
  propertyType: string | null;
  projectType: string;
  leadPrice: number | null;
  expiresAt: string | null;
  createdAt: string;
  assignedAt: string;
  assignmentNotes: string | null;
  homeowner: {
    name: string | null;
    phone: string | null;
  };
  countdown: {
    daysLeft: number;
    hoursLeft: number;
    minutesLeft: number;
    expired: boolean;
  } | null;
}
