import { redirect } from "next/navigation";
import { isAdmin, setAdminCookie } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin sign in — Juzubi" };

async function login(formData: FormData) {
  "use server";
  const pass = String(formData.get("password") ?? "");
  if (pass && pass === process.env.ADMIN_PASSWORD) {
    await setAdminCookie();
    redirect("/admin");
  }
  redirect("/admin/login?error=1");
}

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await isAdmin()) redirect("/admin");
  const { error } = await searchParams;
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="font-display text-2xl font-extrabold text-ink">Admin sign in</h1>
      <p className="mt-1 text-sm text-neutral-500">Enter the store admin password.</p>
      <form action={login} className="mt-6 flex flex-col gap-3">
        <input
          type="password"
          name="password"
          required
          placeholder="Admin password"
          className="w-full rounded-md border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-brand"
        />
        {error && <p className="text-sm text-sale">Incorrect password.</p>}
        <button type="submit" className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
          Sign in
        </button>
      </form>
    </div>
  );
}
