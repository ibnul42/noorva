import React from "react";
import EmployeeListClient from "./EmployeeListClient";
import { fetchEmployeesAction } from "./actions";

export default async function EmployeeList() {
  const employees = await fetchEmployeesAction();

  return <EmployeeListClient employees={employees} />;
}
