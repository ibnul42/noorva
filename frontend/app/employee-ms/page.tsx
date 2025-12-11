import React from "react";
import { fetchEmployeesAction } from "@/ui/employeeMS/actions";
import EmployeeMenu from "@/ui/employeeMS/EmployeeMenu";
import StatsCards from "@/ui/employeeMS/StatsCards";
import { VALID_MENU_ID_SET, type Employee, type MenuId } from "@/ui/employeeMS/type";

export default async function Employee({
  searchParams,
}: {
  searchParams?: { view?: MenuId };
}) {
  const resolvedSearchParams = await searchParams;
  const employees: Employee[] = await fetchEmployeesAction();

  const requestedView = resolvedSearchParams?.view;

  const active: MenuId =
    requestedView && VALID_MENU_ID_SET.has(requestedView)
      ? (requestedView as MenuId)
      : "employee";

  return (
    <div className="px-3 w-full max-w-7xl mx-auto">
      <div className="py-10 space-y-2">
        <h1 className="text-3xl font-bold">Employee management system</h1>
        <p className="opacity-70">EMP-V1 • Manage employees, attendance, and salaries</p>
      </div>
      <StatsCards employees={employees} />
      <div className="mt-6">
        <EmployeeMenu active={active} />
      </div>
    </div>
  );
}
