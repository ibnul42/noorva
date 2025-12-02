"use client";
import React from "react";
import EmployeeInfo from "./EmployeeInfo";

export default function SearchEmployee() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="">
        <p>Employee ID Number</p>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            name="employeeId"
            placeholder="e.g., EMP001"
            // value={form.employeeId}
            // onChange={handleChange}
            className="border border-gray-400 rounded-md p-2 outline-0 focus-within:border focus-within:border-green-700 w-full flex-1"
          />
          <button className="px-2 text-white bg-green-700 hover:bg-green-800 cursor-pointer rounded-md">
            Search
          </button>
          <button className="px-2 text-white bg-green-700 hover:bg-green-800 cursor-pointer rounded-md block">
            Show All
          </button>
        </div>
      </div>
      <EmployeeInfo />
    </div>
  );
}
