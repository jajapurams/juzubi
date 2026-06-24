"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { HeartIcon } from "./icons";

export default function WishlistButton({
  slug,
  initialSaved = false,
  className,
}: {
  slug: string;
  initialSaved?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (busy) return;
    setBusy(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      if (saved) {
        await supabase.from("wishlists").delete().eq("user_id", user.id).eq("product_slug", slug);
        setSaved(false);
        router.refresh();
      } else {
        await supabase.from("wishlists").insert({ user_id: user.id, product_slug: slug });
        setSaved(true);
      }
    } catch {
      // ignore — keep UI responsive
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title={saved ? "Remove from My List" : "Save to My List"}
      aria-label={saved ? "Remove from My List" : "Save to My List"}
      className={className}
    >
      <HeartIcon className={`h-4 w-4 ${saved ? "text-brand" : ""}`} filled={saved} />
    </button>
  );
}
