import Link from "next/link";
import Employee from "./Employee"; 
import { MenuItem } from "./type"; 
import AttendanceDashboard from "./AttendanceDashboard";
import SalaryDashboard from "./SalaryDashboard";

const menuItems: MenuItem[] = [
  { id: "employee", label: "Employees" },
  { id: "attendance", label: "Attendance" },
  { id: "salary", label: "Salary" },
  { id: "reports", label: "Reports" },
];

interface EmployeeMenuProps {
  active: string; 
}

export default function EmployeePage({ active }: EmployeeMenuProps) {

  const renderComponent = () => {
    switch (active) {
      case "employee":
        return <Employee />;
      case "attendance":
        return <AttendanceDashboard />;
      case "salary":
        return <SalaryDashboard />;
      case "reports":
        return <div className="p-6">📥 Import/Export Component</div>;
      default:
        return <div className="p-6">Please select a valid view.</div>;
    }
  };

  return (
    <div className="my-3">
      <div className="w-fit flex items-center gap-2 p-1 bg-gray-100 rounded">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={`?view=${item.id}`}
            className={`flex flex-col items-center text-sm transition-all cursor-pointer p-2 ${
              active === item.id
                ? "text-primary font-semibold bg-white rounded"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-6 bg-white rounded shadow">{renderComponent()}</div>
    </div>
  );
}
