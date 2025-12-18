"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchEmployeeByIdAction } from "./actions";
import { Employee } from "./type";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import clsx from "clsx";
import { formatDateYYYYMMDD } from "@/lib/formatDate";
import EmployeeDocuments from "./EmployeeDocuments";

type Tab = "details" | "documents" | "history";

interface Props {
  employeeId: string;
}

export default function ViewEmployeeDetailsClient({ employeeId }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("details");

  const { data: employee, isError } = useQuery<Employee | null>({
    queryKey: ["employee", employeeId],
    queryFn: () => fetchEmployeeByIdAction(employeeId),
  });

  if (isError || !employee) {
    return (
      <div className="py-10 flex gap-5">
        <button onClick={() => router.push("/employee-ms")}>
          <ArrowLeftIcon className="w-5 hover:text-primary" />
        </button>
        <p className="flex-1 text-sm text-center text-red-500">
          Employee not found
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 py-10">
      {/* Header */}
      <section className="flex gap-5 items-center">
        <button onClick={() => router.push("/employee-ms")}>
          <ArrowLeftIcon className="w-5 hover:text-primary" />
        </button>

        <section>
          <p className="text-3xl font-bold">{employee.fullName}</p>
          <p className="opacity-70">{employee.designation || "-"}</p>
        </section>
      </section>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 w-fit p-1 mt-7">
        {(["details", "documents", "history"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={clsx(
              "pb-2 text-sm capitalize transition py-1.5 px-4 rounded cursor-pointer",
              activeTab === tab
                ? "bg-white font-medium"
                : "opacity-60"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "details" && <Details employee={employee} />}
      {activeTab === "documents" && <EmployeeDocuments employeeId={employeeId} />}
      {activeTab === "history" && <History />}
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string | number }) {
  return (
    <article>
      <p className="opacity-80">{label}</p>
      <p>{value || "--"}</p>
    </article>
  );
}

function Details({ employee }: { employee: Employee }) {
  return (
    <section className="bg-gray-100 grid grid-cols-1 md:grid-cols-2 gap-5 p-4 rounded border border-gray-200">
      <Info label="Employee ID" value={employee.employeeId} />
      <Info label="Phone" value={employee.phoneNumber} />
      <Info label="Email" value={employee.email} />
      <Info label="NID Number" value={employee.nidNumber} />
      <Info label="Joining Date" value={formatDateYYYYMMDD(employee.joiningDate)} />
      <Info label="Gender" value={employee.gender} />
      <Info label="Base Salary" value={employee.baseSalary} />
      <Info label="Present Address" value={employee.presentAddress} />
    </section>
  );
}

function History() {
  return (
    <div className="p-4 bg-gray-50 rounded">
      <p className="text-sm text-gray-600">No history available.</p>
    </div>
  );
}
