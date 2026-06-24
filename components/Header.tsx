import Link from "next/link";
import { SITE, waLink } from "@/lib/site";
import { SearchIcon, HeartIcon, UserIcon, WhatsAppIcon, SparkleIcon } from "./icons";
import Logo from "./Logo";
import CartIcon from "./CartIcon";

export default function Header() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:gap-6">
        {/* Logo */}
        <Logo />

        {/* Search (desktop) */}
        <form action="/search" className="hidden flex-1 md:block">
          <div className="flex items-center rounded-md border-2 border-neutral-300 bg-white px-4 py-2.5 focus-within:border-brand">
            <SearchIcon className="h-5 w-5 shrink-0 text-neutral-500" />
            <input
              type="search"
              name="q"
              placeholder="What are you looking for today?"
              className="ml-3 w-full bg-transparent text-sm outline-none placeholder:text-neutral-500"
              aria-label="Search products"
            />
          </div>
        </form>

        {/* Ask Juzubi pill */}
        <a
          href={waLink(`Hi ${SITE.name}! I have a question.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1.5 whitespace-nowrap rounded-full border-2 border-brand px-4 py-2 text-sm font-semibold text-ink hover:bg-brand/5 lg:flex"
        >
          <SparkleIcon className="h-4 w-4 text-brand" />
          Ask Juzubi
        </a>

        {/* Account actions */}
        <div className="ml-auto flex items-center gap-5 sm:gap-6 md:ml-0">
          <Link href="/login" className="flex flex-col items-center gap-0.5 text-[11px] font-medium text-ink hover:text-brand">
            <UserIcon className="h-6 w-6" />
            Sign In
          </Link>
          <Link href="/wishlist" className="flex flex-col items-center gap-0.5 text-[11px] font-medium text-ink hover:text-brand">
            <HeartIcon className="h-6 w-6" />
            My List
          </Link>
          <CartIcon />
          <a
            href={waLink(`Hi ${SITE.name}!`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-0.5 text-[11px] font-medium text-ink hover:text-brand"
          >
            <WhatsAppIcon className="h-6 w-6" />
            WhatsApp
          </a>
        </div>
      </div>

      {/* Search (mobile) */}
      <form action="/search" className="px-4 pb-3 md:hidden">
        <div className="flex items-center rounded-md border-2 border-neutral-300 bg-white px-4 py-2.5">
          <SearchIcon className="h-5 w-5 shrink-0 text-neutral-500" />
          <input
            type="search"
            name="q"
            placeholder="What are you looking for today?"
            className="ml-3 w-full bg-transparent text-sm outline-none placeholder:text-neutral-500"
            aria-label="Search products"
          />
        </div>
      </form>
    </header>
  );
}
