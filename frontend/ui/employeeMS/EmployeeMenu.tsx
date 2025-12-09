import React, { ReactNode, JSX } from "react";
import {
  UserPlusIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  BanknotesIcon,
  ArrowDownOnSquareIcon,
} from "@heroicons/react/24/outline";
import ManageEmployee from "./ManageEmployee";
import Employee from "./Employee";

type MenuId = "employee" | "search" | "attendance" | "salary" | "import";

interface MenuItem {
  id: MenuId;
  label: string;
  // icon: ReactNode;
}

export default function EmployeeMenu({ activeTab }: { activeTab?: MenuId }) {
  const active = activeTab || "employee";

  const menuItems: MenuItem[] = [
    {
      id: "employee",
      label: "Employees",
      // icon: <UserPlusIcon className="w-6 h-6" />,
    },
    // {
    //   id: "search",
    //   label: "Search & Manage",
    //   // icon: <MagnifyingGlassIcon className="w-6 h-6" />,
    // },
    {
      id: "attendance",
      label: "Attendance",
      // icon: <ClockIcon className="w-6 h-6" />,
    },
    {
      id: "salary",
      label: "Salary",
      // icon: <BanknotesIcon className="w-6 h-6" />,
    },
    {
      id: "import",
      label: "Reports",
      // icon: <ArrowDownOnSquareIcon className="w-6 h-6" />,
    },
  ];

  const renderComponent = (): JSX.Element => {
    switch (active) {
      case "employee":
        return <Employee />;
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
    <div className="my-3">
      {/* Top Navigation Menu */}
      <div className="w-fit flex items-center gap-2 p-1 bg-gray-100 rounded">
        {menuItems.map((item) => (
          <a
            key={item.id}
            href={`?tab=${item.id}`}
            className={`flex flex-col items-center text-sm transition-all cursor-pointer p-2
              ${
                active === item.id
                  ? "text-primary font-semibold bg-white rounded"
                  : "text-gray-600 hover:text-gray-800"
              }`}
          >
            <span>{item.label}</span>
          </a>
        ))}
      </div>

      {/* Component Output */}
      <div className="mt-6 bg-white rounded shadow">{renderComponent()}</div>
    </div>
  );
}
