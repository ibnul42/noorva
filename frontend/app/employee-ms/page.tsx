import EmployeeMenu from "@/ui/employeeMS/EmployeeMenu";
import React from "react";

export default function Employee() {
  return (
    <div className="">
      <div className="text-center bg-emerald-600 py-10 space-y-4">
        <h1 className="text-3xl font-medium text-white">
          Employee management system
        </h1>
        <p className="text-white/80">
          Modern, comprehensive employee database with advanced file management
        </p>
      </div>
      <EmployeeMenu />
    </div>
  );
}
