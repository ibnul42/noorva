"use client";

import React from "react";
import {
  UserPlusIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import type { Employee } from "./type";

type CardProps = {
  title: string;
  value: number | string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

function StatCard({ title, value, Icon }: CardProps) {
  return (
    <div className="bg-gray-50 rounded-xl shadow-sm px-4 py-6 flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
        <Icon className="w-6 h-6 text-green-600" />
      </div>

      <div className="flex-1">
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </div>
    </div>
  );
}

interface StatsCardsProps {
  employees: Employee[];
}

export default function StatsCards({ employees }: StatsCardsProps) {
  const totalEmployees = employees.length;
  const activeEmployees = employees.length;
  const departments = new Set(employees.map((e) => e.department)).size;

  return (
    <div className="px-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Employees"
          value={totalEmployees}
          Icon={UserPlusIcon}
        />
        <StatCard
          title="Active"
          value={activeEmployees}
          Icon={CheckCircleIcon}
        />
        <StatCard
          title="Departments"
          value={departments}
          Icon={CalendarDaysIcon}
        />
      </div>
    </div>
  );
}
