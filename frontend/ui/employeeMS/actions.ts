"use server";

import axios from "axios";
import { revalidateTag } from "next/cache";
import { AttendanceQuery, Employee, Salary, SalaryAdjustment } from "./type";
import { EmployeeHistory } from "./constants";

const apiUrl = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

export async function fetchEmployeesAction(): Promise<Employee[]> {
  try {
    const response = await fetch(`${apiUrl}/api/employees`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60, tags: ["employee-list"] },
    });

    if (!response.ok) return [];

    const data = await response.json();
    return data.employees || [];
  } catch (err) {
    console.error("Failed to fetch employees:", err);
    return [];
  }
}

export async function fetchEmployeeByIdAction(
  employeeId: string
): Promise<Employee | null> {
  try {
    const response = await fetch(`${apiUrl}/api/employees/${employeeId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: {
        revalidate: 60,
        tags: ["employee-list", `employee-${employeeId}`],
      },
    });

    if (!response.ok) return null;

    const data: Employee = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch employee:", err);
    return null;
  }
}

export async function addEmployeeAction(formData: any) {
  const response = await fetch(`${apiUrl}/api/employees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error("Failed to add employee");
  }
  revalidateTag("employee-list");
}

export async function updateEmployeeAction(id: string, formData: any) {
  const response = await fetch(`${apiUrl}/api/employees/${id}`, {
    method: "PUT", // or PATCH depending on your API
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error("Failed to update employee");
  }

  revalidateTag("employee-list");
}

export async function deleteEmployeeAction(id: string) {
  const response = await fetch(`${apiUrl}/api/employees/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete employee");
  }

  // Revalidate the employee list tag
  revalidateTag("employee-list");
}

export async function fetchAttendanceAction(query: AttendanceQuery = {}) {
  try {
    const params = new URLSearchParams();

    if (query.employeeId) params.append("employeeId", query.employeeId);
    if (query.date) params.append("date", query.date);

    const response = await fetch(
      `${apiUrl}/api/attendance?${params.toString()}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 60, tags: [`attendance-${query.employeeId}`] },
      }
    );

    if (!response.ok) return [];

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Failed to fetch attendance:", error);
    return [];
  }
}

export async function updateAttendanceAction(
  id: string,
  data: Record<string, any>,
  employeeId?: string
) {
  try {
    const response = await fetch(`${apiUrl}/api/attendance/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error("Failed to update attendance");
    }

    const updated = await response.json();

    // Revalidate the dynamic employee tag
    if (employeeId) {
      revalidateTag(`attendance-${employeeId}`);
    }

    return updated;
  } catch (err) {
    console.error("Update attendance failed:", err);
    return null;
  }
}

// Employee History Actions
// Fetch history by employee ID
export async function fetchEmployeeHistoryAction(
  employeeId: string
): Promise<EmployeeHistory[]> {
  try {
    const response = await fetch(
      `${apiUrl}/api/employee-history/employee/${employeeId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        next: {
          revalidate: 0,
          tags: [`employee-history-${employeeId}`],
        },
      }
    );

    if (!response.ok) return [];

    const data = await response.json();
    return data || [];
  } catch (err) {
    console.error("Failed to fetch employee history:", err);
    return [];
  }
}

// Create history
export async function createEmployeeHistoryAction(
  payload: Omit<EmployeeHistory, "_id" | "createdAt" | "updatedAt">
): Promise<EmployeeHistory | null> {
  try {
    const response = await fetch(`${apiUrl}/api/employee-history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) return null;

    const data = await response.json();

    // ✅ SERVER-SIDE INVALIDATION
    revalidateTag(`employee-history-${payload.employee}`);

    return data;
  } catch (err) {
    console.error("Failed to create employee history:", err);
    return null;
  }
}

// Update History
export async function updateEmployeeHistoryAction(
  id: string,
  payload: Partial<EmployeeHistory>
): Promise<EmployeeHistory | null> {
  try {
    const response = await fetch(`${apiUrl}/api/employee-history/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) return null;

    return await response.json();
  } catch (err) {
    console.error("Failed to update employee history:", err);
    return null;
  }
}

// Delete History
export async function deleteEmployeeHistoryAction(
  id: string
): Promise<boolean> {
  try {
    const response = await fetch(`${apiUrl}/api/employee-history/${id}`, {
      method: "DELETE",
    });

    return response.ok;
  } catch (err) {
    console.error("Failed to delete employee history:", err);
    return false;
  }
}

// Create Salary
export async function createSalaryAction(payload: {
  employeeId: string;
  year: number;
  month: number;
}): Promise<boolean> {
  try {
    const response = await fetch(`${apiUrl}/api/salary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return response.ok;
  } catch (err) {
    console.error("Failed to create salary:", err);
    return false;
  }
}

// Get all salaries
export async function getAllSalariesAction(params?: {
  year?: number;
  month?: number;
}) {
  try {
    const response = await axios.get(`${apiUrl}/api/salary`, {
      params,                // 👈 axios builds the query string
      withCredentials: true, // 👈 sends HTTP-only cookies
    });

    return response.data;
  } catch (err) {
    console.error("Failed to fetch salaries:", err);
    return [];
  }
}

// Get salary list of an employee
export async function getEmployeeSalariesAction(
  employeeId: string
): Promise<Salary[]> {
  try {
    const response = await fetch(
      `${apiUrl}/api/salary/employee/${employeeId}`,
      { cache: "no-store" }
    );

    if (!response.ok) return [];

    return await response.json();
  } catch (err) {
    console.error("Failed to fetch salaries:", err);
    return [];
  }
}

// Update salary adjustments
export async function updateSalaryAdjustmentsAction(
  salaryId: string,
  data: {
    allowances?: SalaryAdjustment[];
    deductions?: SalaryAdjustment[];
  }
): Promise<boolean> {
  try {
    const response = await fetch(
      `${apiUrl}/api/salary/${salaryId}/adjustments`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    return response.ok;
  } catch (err) {
    console.error("Failed to update salary:", err);
    return false;
  }
}

// Pay salary
export async function paySalaryAction(salaryId: string): Promise<boolean> {
  try {
    const response = await fetch(`${apiUrl}/api/salary/${salaryId}/pay`, {
      method: "POST",
    });

    return response.ok;
  } catch (err) {
    console.error("Failed to pay salary:", err);
    return false;
  }
}
