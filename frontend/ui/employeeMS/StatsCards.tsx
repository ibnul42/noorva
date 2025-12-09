"use client";

import React from "react";
import {
  UserPlusIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

type CardProps = {
  title: string;
  value: number | string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

function StatCard({ title, value, Icon }: CardProps) {
  return (
    <div className="bg-gray-50 rounded-xl shadow-sm p-4 flex items-center gap-4">
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

export default function StatsCards() {
  return (
    <div className="px-3">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Employees" value={0} Icon={UserPlusIcon} />
        <StatCard title="Active" value={0} Icon={CheckCircleIcon} />
        <StatCard title="Departments" value={0} Icon={CalendarDaysIcon} />
      </div>
    </div>
  );
}
