import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "juzubi_admin";

export async function isAdmin(): Promise<boolean> {
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass) return false;
  const store = await cookies();
  return store.get(COOKIE)?.value === pass;
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function setAdminCookie(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, process.env.ADMIN_PASSWORD ?? "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}
