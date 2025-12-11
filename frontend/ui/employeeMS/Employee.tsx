import React from "react";
import EmployeeList from "./EmployeeList";
import EmployeeActionsClient from "./EmployeeActionsClient";

export default function Employee() {
  return (
    <div className="bg-gray-50 p-4 space-y-4">
      <section className="flex justify-between items-center">
        <EmployeeActionsClient />
      </section>

      <EmployeeList />
    </div>
  );
}
