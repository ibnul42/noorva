import React from "react";
import { useState } from "react";

interface EmployeeFormData {
  employeeId: string;
  fullName: string;
  mobile: string;
  email: string;
  designation: string;
  salary: string;
  address: string;
}

export default function RegisterEmployee() {
  const [form, setForm] = useState<EmployeeFormData>({
    employeeId: "",
    fullName: "",
    mobile: "",
    email: "",
    designation: "",
    salary: "",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <form className="w-full space-y-6" onSubmit={handleSubmit}>
      <h2 className="ml-5 text-2xl font-semibold">Register New Employee</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white rounded-xl shadow-sm">
        {/* Employee ID */}
        <div className="flex flex-col gap-1">
          <label className="font-medium opacity-70">Employee ID Number *</label>
          <input
            type="text"
            name="employeeId"
            placeholder="e.g., EMP001"
            value={form.employeeId}
            onChange={handleChange}
            className="border border-gray-400 rounded-md p-2 outline-0 focus-within:border focus-within:border-green-700 w-full"
          />
        </div>

        {/* Full Name */}
        <div className="flex flex-col gap-1">
          <label className="font-medium opacity-70">Full Name *</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter full name"
            value={form.fullName}
            onChange={handleChange}
            className="border border-gray-400 rounded-md p-2 outline-0 focus-within:border focus-within:border-green-700 w-full"
          />
        </div>

        {/* Mobile */}
        <div className="flex flex-col gap-1">
          <label className="font-medium opacity-70">Mobile Number *</label>
          <input
            type="text"
            name="mobile"
            placeholder="+1234567890"
            value={form.mobile}
            onChange={handleChange}
            className="border border-gray-400 rounded-md p-2 outline-0 focus-within:border focus-within:border-green-700 w-full"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="font-medium opacity-70">Email Address *</label>
          <input
            type="email"
            name="email"
            placeholder="employee@company.com"
            value={form.email}
            onChange={handleChange}
            className="border border-gray-400 rounded-md p-2 outline-0 focus-within:border focus-within:border-green-700 w-full"
          />
        </div>

        {/* Designation */}
        <div className="flex flex-col gap-1">
          <label className="font-medium opacity-70">Designation *</label>
          <select
            name="designation"
            value={form.designation}
            onChange={handleChange}
            className="border border-gray-400 rounded-md p-2 outline-0 focus-within:border focus-within:border-green-700 w-full"
          >
            <option value="">Select Designation</option>
            <option value="Manager">Manager</option>
            <option value="Developer">Developer</option>
            <option value="Accountant">Accountant</option>
          </select>
        </div>

        {/* Salary */}
        <div className="flex flex-col gap-1">
          <label className="font-medium opacity-70">Basic Salary *</label>
          <input
            type="number"
            name="salary"
            placeholder="Enter basic salary"
            value={form.salary}
            onChange={handleChange}
            className="border border-gray-400 rounded-md p-2 outline-0 focus-within:border focus-within:border-green-700 w-full"
          />
        </div>

        {/* Address */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-1">
          <label className="font-medium opacity-70">Address *</label>
          <textarea
            name="address"
            placeholder="Enter complete address"
            value={form.address}
            onChange={handleChange}
            className="border border-gray-400 rounded-md p-2 outline-0 focus-within:border focus-within:border-green-700 w-full h-24"
          ></textarea>
        </div>
      </div>
      {/* Upload Documents Section */}
      <div className="p-4 bg-white rounded-xl shadow-sm">
        <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
          <span role="img" aria-label="folder">
            📁
          </span>{" "}
          Upload Documents
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "CV/Resume", name: "cv" },
            { label: "Agreement", name: "agreement" },
            { label: "National ID (NID)", name: "nid" },
            { label: "Appointment Letter", name: "appointmentLetter" },
            { label: "NDA Agreement", name: "nda" },
            { label: "Office Order", name: "officeOrder" },
          ].map((item) => (
            <div
              key={item.name}
              className="rounded-md p-4 flex flex-col border border-transparent hover:border-green-600 transition-all"
            >
              <label className="font-medium opacity-70 mb-2 flex items-center gap-2">
                {item.label}
              </label>

              <label
                htmlFor={item.name}
                className="w-full border border-dashed border-gray-400 rounded-md p-2 cursor-pointer"
              >
                Choose File
              </label>

              <input
                id={item.name}
                type="file"
                name={item.name}
                onChange={(e) => console.log(e.target.files?.[0])}
                className="hidden"
              />
              <p className="text-red-900 bg-red-200 text-sm font-medium text-center p-2 mt-2">
                Not uploaded
              </p>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="ml-5 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 cursor-pointer"
      >
        <span role="img" aria-label="sparkles">
          ✨
        </span>{" "}
        Register Employee
      </button>
    </form>
  );
}
