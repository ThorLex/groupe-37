"use client";

import Sidebar from "@/components/SideBar";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar isCollapsed={isCollapsed} toggleCollapse={() => setIsCollapsed(!isCollapsed)} />
      <main
        className={`
          flex-1
          transition-all duration-300
          ${isCollapsed ? "ml-20" : "ml-64"}
          bg-slate-800 text-slate-100
          p-6
        `}
      >
        {children}
      </main>
    </div>
  );
}
