import { redirect } from "next/navigation";
import { isContent, setContentCookie } from "@/lib/content-auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Content Manager sign in — Juzubi" };

async function login(formData: FormData) {
  "use server";
  const pass = String(formData.get("password") ?? "");
  if (pass && pass === process.env.CONTENT_PASSWORD) {
    await setContentCookie();
    redirect("/content");
  }
  redirect("/content/login?error=1");
}

export default async function ContentLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (await isContent()) redirect("/content");
  const { error } = await searchParams;
  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="font-display text-2xl font-extrabold text-ink">Content Manager</h1>
      <p className="mt-1 text-sm text-neutral-500">Sign in to manage the product catalog.</p>
      <form action={login} className="mt-6 flex flex-col gap-3">
        <input
          type="password"
          name="password"
          required
          placeholder="Content manager password"
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
