import React from "react";

export default function EmployeeInfo() {
  return (
    <div className="mt-5 space-y-7">
      <div className="flex justify-between items-center">
        <p className="text-xl font-medium">Test</p>
        <p className="text-white bg-green-700 cursor-pointer rounded-md block px-3 py-2">
          ID: test
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <InfoDetail title="Mobile Number" value="017XXXXXXXX" />
        <InfoDetail title="Email" value="example@example.com" />
        <InfoDetail title="Designation" value="Agent" />
        <InfoDetail title="Basic Salary" value="111" />
        <InfoDetail title="Registration Date" value="02/12/2025" />
        <InfoDetail title="Last Updated" value="02/12/2025" />
        <InfoDetail title="Address" value="Bangladesh" />
      </div>

      {/* Documents */}
      <div className="">
        <p className="text-xl font-medium">Documents</p>
        <div className="grid grid-cols-4 gap-4 my-2">
          <SingleDocument icon="📄" name="CV/Resume" label="❌ Not Uploaded" />
          <SingleDocument icon="📋" name="Agreement" label="❌ Not Uploaded" />
          <SingleDocument
            icon="🆔"
            name="National ID"
            label="❌ Not Uploaded"
          />
          <SingleDocument
            icon="📜"
            name="Appointment Letter"
            label="❌ Not Uploaded"
          />
          <SingleDocument
            icon="🔒"
            name="NDA Agreement"
            label="❌ Not Uploaded"
          />
          <SingleDocument
            icon="📋"
            name="Office Order"
            label="❌ Not Uploaded"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button className="px-3 py-2 text-white bg-green-700 hover:bg-green-800 cursor-pointer rounded-md block">
          ✏️ Edit Employee
        </button>
        <button className="px-3 py-2 text-white bg-green-700 hover:bg-green-800 cursor-pointer rounded-md block">
          📁 Manage Files
        </button>
        <button className="px-3 py-2 text-white bg-green-700 hover:bg-green-800 cursor-pointer rounded-md block">
          🚪 Mark Resigned
        </button>
      </div>
    </div>
  );
}

interface InfoDetailProps {
  title: string;
  value: string | number;
}

const InfoDetail: React.FC<InfoDetailProps> = ({ title, value }) => (
  <div className="border-l-[3px] border-green-700 rounded-md pl-4 py-3">
    <p className="opacity-80">{title}</p>
    <p className="font-medium text-sm opacity-70">{value}</p>
  </div>
);

const SingleDocument: React.FC<{
  icon: string;
  name: string;
  label: string;
}> = ({ icon, name, label }) => (
  <div className="bg-red-200 py-5 px-2 text-center rounded space-y-2">
    <p className="text-2xl">{icon}</p>
    <p className="font-semibold text-lg opacity-80">{name}</p>
    <p className="text-sm">{label}</p>
  </div>
);
