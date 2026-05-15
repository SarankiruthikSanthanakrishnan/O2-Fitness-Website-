import React from "react";

const SuperAdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4 text-center text-purple-700">
        Super Admin Dashboard
      </h1>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <p className="text-gray-700">
          Welcome, Super Admin! Here you can manage all admins, view platform-wide analytics, and control system settings.
        </p>
        {/* Add Super Admin features/components here */}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
