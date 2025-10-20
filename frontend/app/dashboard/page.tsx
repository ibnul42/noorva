"use server";

import Link from "next/link";
import { getUserFromCookies } from "@/lib/authServer";

export default async function DashboardPage() {
  const user = await getUserFromCookies();
  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow p-8">
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
    </div>
  );
}
