import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Account — Juzubi" };

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();
  const { count } = await supabase
    .from("wishlists")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const name = profile?.full_name?.trim() || user.email;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl font-extrabold text-ink">Hi, {name}</h1>
      <p className="mt-1 text-sm text-neutral-500">{user.email}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link href="/wishlist" className="rounded-xl border border-neutral-200 p-5 hover:border-brand">
          <p className="text-sm font-semibold text-ink">My List</p>
          <p className="mt-1 text-sm text-neutral-500">{count ?? 0} saved {count === 1 ? "item" : "items"}</p>
        </Link>
        <Link href="/" className="rounded-xl border border-neutral-200 p-5 hover:border-brand">
          <p className="text-sm font-semibold text-ink">Keep shopping</p>
          <p className="mt-1 text-sm text-neutral-500">Browse the latest collection</p>
        </Link>
      </div>

      <div className="mt-8">
        <LogoutButton className="rounded-full border border-ink px-6 py-2.5 text-sm font-semibold text-ink hover:bg-ink hover:text-white" />
      </div>
    </div>
  );
}
