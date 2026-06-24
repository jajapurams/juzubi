import Link from "next/link";
import { SITE, CATEGORIES, waLink } from "@/lib/site";
import { WhatsAppIcon, InstagramIcon, FacebookIcon, YouTubeIcon } from "./icons";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-neutral-200 bg-ink text-neutral-300">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-10 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h3 className="font-display text-2xl font-bold text-white">Join the Juzubi list</h3>
            <p className="mt-1 text-sm text-neutral-400">New arrivals, festive drops & member-only offers.</p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* Link columns */}
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Shop</h4>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="hover:text-white">{c.name}</Link>
              </li>
            ))}
            <li><Link href="/category/sale" className="hover:text-white">Sale</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Help</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/shipping" className="hover:text-white">Shipping & delivery</Link></li>
            <li><Link href="/returns" className="hover:text-white">Returns & exchange</Link></li>
            <li><Link href="/track" className="hover:text-white">Track my order</Link></li>
            <li>
              <a href={waLink(`Hi ${SITE.name}! I need some help.`)} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Contact us
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">About</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-white">Our story</Link></li>
            <li><Link href="/stores" className="hover:text-white">Visit our store</Link></li>
            <li><Link href="/journal" className="hover:text-white">Style journal</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">Connect</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={waLink(`Hi ${SITE.name}!`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white">
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </a>
            </li>
            <li>
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white">
                <InstagramIcon className="h-4 w-4" /> Instagram
              </a>
            </li>
            <li>
              <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white">
                <FacebookIcon className="h-4 w-4" /> Facebook
              </a>
            </li>
            <li>
              <a href={SITE.youtube} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white">
                <YouTubeIcon className="h-4 w-4" /> YouTube
              </a>
            </li>
            <li><a href={`mailto:${SITE.email}`} className="hover:text-white">{SITE.email}</a></li>
            <li className="text-neutral-400">{SITE.city}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p>Made with care for Indian boutique wear.</p>
        </div>
      </div>
    </footer>
  );
}
