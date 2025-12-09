"use client";

import React, { useState } from "react";
import { addEmployeeAction } from "./actions";

export default function AddEmployeeForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    fullName: "",
    employeeId: "",
    department: "",
    designation: "",
    phoneNumber: "",
    email: "",
    joiningDate: "",
    baseSalary: "0",
    gender: "",
    nidNumber: "",
    presentAddress: "",
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

      await addEmployeeAction(cleanData); // ⬅️ Use server action

      // Reset form + close modal
      setFormData({
        fullName: "",
        employeeId: "",
        department: "",
        designation: "",
        phoneNumber: "",
        email: "",
        joiningDate: "",
        baseSalary: "0",
        gender: "",
        nidNumber: "",
        presentAddress: "",
      });

      onClose();

      // ⚡ No need to manually refresh list → server action already revalidated page
    } catch (error) {
      setError("Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">Add New Employee</h2>

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
            placeholder="Enter full name"
            className="w-full px-3 py-2 border border-gray-300 rounded outline-0 focus:border-primary transition-all"
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
            placeholder="Auto-generated if empty"
            className="w-full px-3 py-2 border border-gray-300 rounded outline-0 focus:border-primary transition-all"
            disabled
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
            placeholder="Enter department"
            className="w-full px-3 py-2 border border-gray-300 rounded outline-0 focus:border-primary transition-all"
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
            placeholder="Enter designation"
            className="w-full px-3 py-2 border border-gray-300 rounded outline-0 focus:border-primary transition-all"
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
            placeholder="Enter phone number"
            className="w-full px-3 py-2 border border-gray-300 rounded outline-0 focus:border-primary transition-all"
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
            placeholder="Enter email"
            className="w-full px-3 py-2 border border-gray-300 rounded outline-0 focus:border-primary transition-all"
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
            className="w-full px-3 py-2 border border-gray-300 rounded outline-0 focus:border-primary transition-all"
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
            placeholder="0"
            className="w-full px-3 py-2 border border-gray-300 rounded outline-0 focus:border-primary transition-all"
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
            className="w-full px-3 py-2 border border-gray-300 rounded outline-0 focus:border-primary transition-all bg-white"
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
            placeholder="Enter NID number"
            className="w-full px-3 py-2 border border-gray-300 rounded outline-0 focus:border-primary transition-all"
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
          placeholder="Enter present address"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded outline-0 focus:border-primary transition-all resize-none"
        />
      </div>

      {/* Submit Button */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-2 bg-green-600 text-white font-medium rounded transition-all ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
          }`}
        >
          {loading ? "Adding..." : "Add Employee"}
        </button>
      </div>
    </form>
  );
}
