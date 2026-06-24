import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "juzubi_content";

export async function isContent(): Promise<boolean> {
  const pass = process.env.CONTENT_PASSWORD;
  if (!pass) return false;
  const store = await cookies();
  return store.get(COOKIE)?.value === pass;
}

export async function requireContent(): Promise<void> {
  if (!(await isContent())) redirect("/content/login");
}

export async function setContentCookie(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, process.env.CONTENT_PASSWORD ?? "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearContentCookie(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}
