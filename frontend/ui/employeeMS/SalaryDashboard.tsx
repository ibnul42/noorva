"use client";
import React from "react";
import {
  PencilIcon,
  LockClosedIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import { getAllSalariesAction } from "./actions";
import { Salary } from "./type";

export default function SalaryDashboard() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const { data: salaries = [], isLoading } = useQuery({
    queryKey: ["all-salaries", year, month],
    queryFn: () => getAllSalariesAction({ year, month }),
  });

  console.log(salaries);

  return (
    <div className="bg-gray-50 p-4 space-y-4">
      <section className="flex justify-between items-center w-full">
        <p className="text-2xl font-semibold">Salary List</p>
      </section>

      {isLoading && (
        <div className="py-10 text-center">
          <p>Loading...</p>
        </div>
      )}

      {salaries.length > 0 ? (
        <div className="overflow-x-auto bg-white rounded">
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr className="flex items-center justify-between">
                <th className="px-4 py-3 text-left text-sm font-semibold w-40">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold w-32">
                  Base Salary
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold w-32">
                  Allowances
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold w-32">
                  Deductions
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold w-32">
                  Net Salary
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold w-32">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold w-32">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {salaries.map((salary: Salary) => (
                <tr
                  key={salary._id}
                  className="hover:bg-gray-50 text-sm flex items-center justify-between"
                >
                  <td className="px-4 py-3 text-sm overflow-hidden text-ellipsis w-40">
                    {salary.employeeId.fullName}
                  </td>

                  <td className="px-4 py-3 text-sm overflow-hidden text-ellipsis w-32">
                    {salary.baseSalary.toLocaleString()}
                  </td>

                  <td className="px-4 py-3 text-sm text-green-600 overflow-hidden text-ellipsis w-32">
                    +{salary.totalAllowance.toLocaleString()}
                  </td>

                  <td className="px-4 py-3 text-sm text-red-600 overflow-hidden text-ellipsis w-32">
                    -{salary.totalDeduction.toLocaleString()}
                  </td>

                  <td className="px-4 py-3 text-sm font-semibold overflow-hidden text-ellipsis w-32">
                    {salary.netSalary.toLocaleString()}
                  </td>

                  <td className="px-4 py-3 overflow-hidden text-ellipsis w-32">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        salary.status === "PAID"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {salary.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 w-32">
                    <div className="flex gap-3">
                      {salary.status === "DRAFT" ? (
                        <>
                          <PencilIcon
                            className="w-4 cursor-pointer hover:text-blue-600"
                            title="Edit"
                          />
                          <CreditCardIcon
                            className="w-4 cursor-pointer hover:text-green-600"
                            title="Pay Salary"
                          />
                        </>
                      ) : (
                        <LockClosedIcon
                          className="w-4 text-gray-400"
                          title="Salary Locked"
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No salary records found.</p>
      )}
    </div>
  );
}
