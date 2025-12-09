"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { Employee } from "./type";

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
