"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayoutClient({ children, profile }) {
  // Mobile / Desktop sidebar toggle state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on viewport resize if switching back to desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className={`shopmate-adm-layout-wrapper ${sidebarOpen ? "sidebar-mobile-active" : ""}`}>
      <AdminSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        profile={profile}
      />
      
      <div className="shopmate-adm-main-content">
        <AdminHeader 
          onToggleSidebar={handleToggleSidebar} 
          profile={profile}
        />
        <main className="shopmate-adm-page-body">
          <div className="container-fluid py-4 px-3 px-md-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}