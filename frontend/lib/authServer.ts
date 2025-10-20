import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getUserFromCookies() {
  let header: string | undefined;
  try {
    header = cookies().toString();
  } catch {}

  const base = process.env.NEXT_PUBLIC_API_BASE || "";
  const url = base
    ? `${base.replace(/\/$/, "")}/api/users/me`
    : "http://localhost:5000/api/users/me";

  const res = await fetch(url, {
    headers: header ? { cookie: header } : undefined,
    cache: "no-store",
  });

  if (!res.ok) return null;
  try {
    const user = await res.json();
    return user;
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getUserFromCookies();
  if (!user) {
    try {
      redirect("/login");
    } catch {
      return null;
    }
  }
  return user;
}
