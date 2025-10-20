"use server";
import Link from "next/link";
import { getUserFromCookies } from "@/lib/authServer";

export default async function ProfilePage() {
  const user = await getUserFromCookies();
  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold text-emerald-700">Profile</h1>
        <p className="mt-4 text-slate-600">
          Name: {user.name || user.username}
        </p>
        <p className="mt-2 text-slate-600">Email: {user.email}</p>
        <div className="mt-6">
          <Link href="/dashboard" className="text-emerald-700 underline">
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
