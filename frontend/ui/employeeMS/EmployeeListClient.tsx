"use client";

import React, { useState, useMemo } from "react";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Employee } from "./type";

interface EmployeeListClientProps {
  employees: Employee[];
}

export default function EmployeeListClient({
  employees,
}: EmployeeListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Normalize text for better matching
  const normalize = (str: string) =>
    str.toLowerCase().trim().replace(/\s+/g, " ");

  // Filter employees by name based on search query
  const filteredEmployees = useMemo(() => {
    const query = normalize(searchQuery);
    if (!query) return employees;

    return employees.filter((emp) => normalize(emp.fullName).includes(query));
  }, [employees, searchQuery]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <section>
        <div className="relative">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white w-full rounded outline-0 border border-gray-300 px-10 py-2 focus:border-primary transition-all"
            placeholder="Search employees..."
          />

          <svg
            className="absolute left-3 top-3 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </section>

      {/* Employee Table */}
      <section className="bg-white rounded-lg shadow overflow-hidden">
        {filteredEmployees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Designation
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Joining Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Base Salary
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{emp.fullName}</td>
                    <td className="px-6 py-4">{emp.department || "N/A"}</td>
                    <td className="px-6 py-4">{emp.designation || "N/A"}</td>
                    <td className="px-6 py-4">{emp.phoneNumber || "N/A"}</td>
                    <td className="px-6 py-4">{formatDate(emp.joiningDate)}</td>
                    <td className="px-6 py-4">
                      {formatSalary(emp.baseSalary)}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        active
                      </span>
                    </td>

                    <td className="px-6 py-4 flex items-center space-x-2">
                      <EyeIcon className="w-5 cursor-pointer hover:text-blue-500" />
                      <PencilIcon className="w-5 cursor-pointer hover:text-yellow-500" />
                      <TrashIcon className="w-5 cursor-pointer hover:text-red-600" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center py-12 text-gray-500">
            {searchQuery.trim()
              ? "No employees found for this search."
              : "No employees available."}
          </p>
        )}
      </section>
    </div>
  );
}
