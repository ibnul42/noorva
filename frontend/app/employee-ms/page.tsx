import EmployeeMenu from "@/ui/employeeMS/EmployeeMenu";
import StatsCards from "@/ui/employeeMS/StatsCards";
import React from "react";

export default function Employee({ searchParams }: { searchParams?: { tab?: string } }) {
  const activeTab = (searchParams && searchParams.tab) || "employee";

  return (
    <div className="px-3">
      <div className="py-10 space-y-2">
        <h1 className="text-3xl font-semibold">Employee management system</h1>
        <p className="">EMP-V1 • Manage employees, attendance, and salaries</p>
      </div>

      <StatsCards />

      <div className="mt-6">
        <EmployeeMenu activeTab={activeTab} />
      </div>
    </div>
  );
}
