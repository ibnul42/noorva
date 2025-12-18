"use client";

import React, { useState, useMemo } from "react";
import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Employee } from "./type";
import { deleteEmployeeAction } from "./actions";
import { useRouter, useSearchParams } from "next/navigation";
import Modal from "@/components/Modal";
import ViewEmployeeDetails from "./ViewEmployeeDetails";
import EditEmployeeForm from "./EditEmployeeForm";

interface EmployeeListClientProps {
  employees: Employee[];
}

export default function EmployeeListClient({
  employees,
}: EmployeeListClientProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null
  );

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isEditOpen, SetIsEditOpen] = useState(false);

  const normalize = (str: string) =>
    str.toLowerCase().trim().replace(/\s+/g, " ");

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

  // Open confirmation modal
  const openDeleteModal = (id: string) => {
    setSelectedEmployeeId(id);
    setIsModalOpen(true);
  };

  // Delete employee
  const handleDelete = async () => {
    if (!selectedEmployeeId) return;

    try {
      await deleteEmployeeAction(selectedEmployeeId);

      setSelectedEmployeeId(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const openViewModal = (emp: Employee) => {
    // setViewEmployee(emp);
    // setIsViewModalOpen(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set("employeeId", emp._id);

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const editModal = (emp: Employee) => {
    setSelectedEmployee(emp);
    SetIsEditOpen(true);
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
                <tr className="flex items-center justify-between">
                  <th className="px-6 py-3 text-left text-sm font-semibold col-2 w-40">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold w-44">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold w-36">
                    Designation
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold w-44">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold w-32">
                    Joining Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold w-32">
                    Base Salary
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold w-28">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold w-36">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp._id}
                    className="hover:bg-gray-50 text-sm flex items-center justify-between"
                  >
                    <td className="px-6 py-4 font-medium w-40">
                      {emp.fullName}
                    </td>
                    <td className="px-6 py-4 w-44">
                      {emp.department || "N/A"}
                    </td>
                    <td className="px-6 py-4 w-36">
                      {emp.designation || "N/A"}
                    </td>
                    <td className="px-6 py-4 w-44">
                      {emp.phoneNumber || "N/A"}
                    </td>
                    <td className="px-6 py-4 w-32">
                      {formatDate(emp.joiningDate)}
                    </td>
                    <td className="px-6 py-4 w-32">
                      {formatSalary(emp.baseSalary)}
                    </td>
                    <td className="px-6 py-4 w-28">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        active
                      </span>
                    </td>
                    <td className="px-6 py-4 flex items-center space-x-3 w-36">
                      <EyeIcon
                        onClick={() => openViewModal(emp)}
                        className="w-5 cursor-pointer hover:text-blue-500"
                      />
                      <PencilIcon
                        onClick={() => editModal(emp)}
                        className="w-5 cursor-pointer hover:text-yellow-500"
                      />
                      <TrashIcon
                        className="w-5 cursor-pointer hover:text-red-600"
                        onClick={() => openDeleteModal(emp._id)}
                      />
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="md"
      >
        <div className="space-y-10">
          <p>Are you sure you want to delete this employee?</p>

          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-gray-300 rounded cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* View employee modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        size="lg"
      >
        {selectedEmployeeId && (
          <ViewEmployeeDetails employeeId={selectedEmployeeId} />
        )}
      </Modal>

      {/* Edit Employee Modal */}
      <Modal isOpen={isEditOpen} onClose={() => SetIsEditOpen(false)} size="lg">
        {selectedEmployee && (
          <EditEmployeeForm
            employee={selectedEmployee}
            onClose={() => SetIsEditOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
}
