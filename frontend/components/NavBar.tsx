"use client";

import Link from "next/link";
import {  useLayoutEffect, useState } from "react";
import {  usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default function NavBar() {
  type UserType = { role?: string } | null;
  const [user, setUser] = useState<UserType>(null);
  const pathname = usePathname();

  useLayoutEffect(() => {
    let mounted = true;
    // try to read last-known user from localStorage to avoid UI flicker
    try {
      const raw = localStorage.getItem("me");
      if (raw) {
        setUser(JSON.parse(raw));
      }
    } catch {}
    async function fetchMe() {
      try {
        const base =
          typeof process !== "undefined"
            ? process.env.NEXT_PUBLIC_API_BASE
            : "";
        const url = base
          ? `${base.replace(/\/$/, "")}/api/users/me`
          : "/api/users/me";
        const res = await fetch(url, { credentials: "include" });
        if (!mounted) return;
        if (res.ok) {
          const u = await res.json();
          setUser(u);
          // persist last-known user to localStorage synchronously to avoid flicker on reload
          try {
            localStorage.setItem("me", JSON.stringify(u));
          } catch {}
          // notify other listeners (other tabs/components)
          try {
            localStorage.setItem("user-changed", Date.now().toString());
          } catch {}
        } else {
          setUser(null);
          try {
            localStorage.removeItem("me");
            localStorage.setItem("user-changed", Date.now().toString());
          } catch {}
        }
      } catch {}
    }
    fetchMe();

    // also refetch when other tabs signal a change
    function onStorage(e: StorageEvent) {
      if (e.key === "user-changed") fetchMe();
    }

    function onUserChanged() {
      fetchMe();
    }

    window.addEventListener("storage", onStorage);
    window.addEventListener("user:changed", onUserChanged);

    return () => {
      mounted = false;
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("user:changed", onUserChanged);
    };
  }, [pathname]);
  return (
    <header className="bg-primary shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-lg">
          Noorva
        </Link>
        <nav className="space-x-4">
          {user ? (
            <>
              {user.role === "super-user" && (
                <Link
                  href="/dashboard/pending"
                  className="text-slate-700 hover:text-emerald-600"
                >
                  Users
                </Link>
              )}
              <Link
                href="/profile"
                className="text-slate-700 hover:text-emerald-600"
              >
                Profile
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-slate-700 hover:text-emerald-600"
              >
                Sign in
              </Link>
              <Link href="/register" className="text-emerald-700 font-medium">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
