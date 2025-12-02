"use client";

import { useState, ReactNode, JSX } from "react";
import {
  UserPlusIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  BanknotesIcon,
  ArrowDownOnSquareIcon,
} from "@heroicons/react/24/outline";
import RegisterEmployee from "./RegisterEmployee";
import ManageEmployee from "./ManageEmployee";

type MenuId = "register" | "search" | "attendance" | "salary" | "import";

interface MenuItem {
  id: MenuId;
  label: string;
  icon: ReactNode;
}

export default function EmployeeMenu() {
  const [active, setActive] = useState<MenuId>("register");

  const menuItems: MenuItem[] = [
    {
      id: "register",
      label: "Register Employee",
      icon: <UserPlusIcon className="w-6 h-6" />,
    },
    {
      id: "search",
      label: "Search & Manage",
      icon: <MagnifyingGlassIcon className="w-6 h-6" />,
    },
    {
      id: "attendance",
      label: "Attendance System",
      icon: <ClockIcon className="w-6 h-6" />,
    },
    {
      id: "salary",
      label: "Salary Management",
      icon: <BanknotesIcon className="w-6 h-6" />,
    },
    {
      id: "import",
      label: "Import/Export",
      icon: <ArrowDownOnSquareIcon className="w-6 h-6" />,
    },
  ];

  const renderComponent = (): JSX.Element => {
    switch (active) {
      case "register":
        return <RegisterEmployee />;
      case "search":
        return <ManageEmployee />;
      case "attendance":
        return <div className="p-6">⏱ Attendance System Component</div>;
      case "salary":
        return <div className="p-6">💰 Salary Management Component</div>;
      case "import":
        return <div className="p-6">📥 Import/Export Component</div>;
      default:
        return <div />;
    }
  };

  return (
    <div className="w-full my-3">
      {/* Top Navigation Menu */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-center gap-16 pb-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`flex flex-col items-center text-sm transition-all cursor-pointer
              ${
                active === item.id
                  ? "text-green-700 font-semibold"
                  : "text-gray-600 hover:text-gray-800"
              }`}
          >
            {item.icon}
            <span>{item.label}</span>

            {/* Bottom border for active */}
            {active === item.id && (
              <div className="w-full h-[3px] bg-green-600 mt-1 rounded"></div>
            )}
          </button>
        ))}
      </div>

      {/* Component Output */}
      <div className="mt-6 bg-white rounded shadow">
        {renderComponent()}
      </div>
    </div>
  );
}
