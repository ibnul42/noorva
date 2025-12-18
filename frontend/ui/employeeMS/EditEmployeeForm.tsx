"use client";

import React, { useState } from "react";
import type { Employee } from "./type";
import { updateEmployeeAction } from "./actions";

export default function EditEmployeeForm({
  employee,
  onClose,
}: {
  employee: Employee;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    fullName: employee.fullName || "",
    employeeId: employee.employeeId || "",
    department: employee.department || "",
    designation: employee.designation || "",
    phoneNumber: employee.phoneNumber || "",
    email: employee.email || "",
    joiningDate: employee.joiningDate || "",
    baseSalary: employee.baseSalary?.toString() || "0",
    gender: employee.gender || "",
    nidNumber: employee.nidNumber || "",
    presentAddress: employee.presentAddress || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const cleanData = {
        ...formData,
        baseSalary: parseInt(formData.baseSalary) || 0,
      };

      await updateEmployeeAction(employee._id, cleanData); // ⬅️ update server action

      onClose(); // close modal
    } catch (error) {
      setError("Failed to update employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Edit Employee</h2>

      {/* Full Name & Employee ID */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded outline-0 focus:border-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Employee ID
          </label>
          <input
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded outline-0 focus:border-primary"
          />
        </div>
      </div>

      {/* Department & Designation */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department
          </label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded outline-0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Designation
          </label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded outline-0"
          />
        </div>
      </div>

      {/* Phone Number & Email */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded outline-0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded outline-0"
          />
        </div>
      </div>

      {/* Joining Date & Base Salary */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Joining Date
          </label>
          <input
            type="date"
            name="joiningDate"
            value={formData.joiningDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded outline-0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Base Salary (BDT)
          </label>
          <input
            type="number"
            name="baseSalary"
            value={formData.baseSalary}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded outline-0"
          />
        </div>
      </div>

      {/* Gender & NID Number */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded bg-white outline-0"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            NID Number
          </label>
          <input
            type="text"
            name="nidNumber"
            value={formData.nidNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded outline-0"
          />
        </div>
      </div>

      {/* Present Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Present Address
        </label>
        <textarea
          name="presentAddress"
          value={formData.presentAddress}
          onChange={handleChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded outline-0 resize-none"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 bg-blue-600 text-white font-medium rounded transition-all ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
