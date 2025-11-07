"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const doLogout = async () => {
    try {
      // Build logout API URL (works both locally and in prod)
      const base =
        typeof process !== "undefined" ? process.env.NEXT_PUBLIC_API_BASE : "";
      const url = base
        ? `${base.replace(/\/$/, "")}/api/users/logout`
        : "/api/users/logout";

      await fetch(url, {
        method: "POST",
        credentials: "include",
      });

      // Clear local cache or signals
      try {
        localStorage.removeItem("me");
        localStorage.setItem("user-changed", Date.now().toString());
      } catch {}

      // ✅ Trigger a re-render of all server components (like NavBar)
      router.refresh();

      // ✅ Navigate home (optional, can be kept or removed)
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <button
      onClick={doLogout}
      className="text-slate-700 hover:text-emerald-600 cursor-pointer"
    >
      Logout
    </button>
  );
}
