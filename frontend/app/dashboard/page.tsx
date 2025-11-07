import Link from "next/link";
import { getUserFromCookies } from "@/lib/authServer";
import NavigationCard from "./NavigationCard";

const navigationItems = [
  { id: "employeeDB", title: "Employee Database System", description: "Manage employee records, profiles, and organizational data.", icon: "👥", link: "SubFiles-ADMS/EMP-V1.html", category: "HR" },
  { id: "customerDB", title: "Customer Database System", description: "Centralized CRM with detailed contact and interaction history.", icon: "🤝", link: "SubFiles-ADMS/CDS-V1.html", category: "CRM" },
  { id: "remittanceDB", title: "Remittance Database System", description: "Track and manage financial transfers securely.", icon: "💸", link: "SubFiles-ADMS/RDS-V1.html", category: "Finance" },
  { id: "officeAccounts", title: "Office Accounts Management", description: "Manage office finances, budgets, and reports.", icon: "📊", link: "", category: "Accounting" },
  { id: "agentMFS", title: "Agent (MFS)", description: "Mobile financial services management for agents.", icon: "📱", link: "SubFiles-ADMS/MFS-V1.html", category: "MFS" },
  { id: "inventoryInvoice", title: "Inventory & Invoice Management System", description: "Track invoices with automated billing features.", icon: "🧾", link: "SubFiles-ADMS/INV-V1.html", category: "Billing" },
];

export default async function DashboardPage() {
  const user = await getUserFromCookies();
  if (!user) return null;

  // Example systemAccess object (use actual from user)
  const systemAccess = user.systemsAccess || {
    agentMFS: false,
    customerDB: false,
    employeeDB: false,
    inventoryInvoice: false,
    officeAccounts: false,
    remittanceDB: false,
  };

  return (
    <div className="min-h-screen p-6">
      <div className="mx-auto max-w-5xl w-full bg-white rounded-2xl shadow p-8 mb-8">
        <h1 className="text-2xl font-bold text-emerald-700">Dashboard</h1>
        <p className="mt-4 text-slate-600">
          Welcome back, {user.name || user.username || user.email}.
        </p>
        <div className="mt-6">
          <Link href="/profile" className="text-emerald-700 underline">
            Profile
          </Link>
        </div>
      </div>

      {/* Grid Section */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {navigationItems.map((item) => (
          <NavigationCard
            key={item.id}
            item={item}
            hasAccess={!!systemAccess[item.id as keyof typeof systemAccess]}
          />
        ))}
      </div>
    </div>
  );
}
