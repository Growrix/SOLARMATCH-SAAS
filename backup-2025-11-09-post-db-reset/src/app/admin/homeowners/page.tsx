import React from "react";
import AdminHomeownersList from "@/components/AdminHomeownersList";

export default function AdminHomeownersPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Page Title & Subtitle */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Homeowners Management</h1>
        <p className="text-lg text-muted-foreground">View and manage all registered homeowners.</p>
      </div>
      <AdminHomeownersList />
    </div>
  );
}
