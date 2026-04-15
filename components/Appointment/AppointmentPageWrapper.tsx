"use client";

import dynamic from "next/dynamic";

const AppointmentPage = dynamic(() => import("@/components/Appointment/AppointmentPageClient"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p>Loading...</p>
    </div>
  ),
});

export default AppointmentPage;
