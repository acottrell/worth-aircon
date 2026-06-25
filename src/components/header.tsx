import Link from "next/link";
import { SiteIcon } from "./site-icon";

export function Header() {
  return (
    <header className="w-full border-b bg-background sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-5 py-3">
        <Link href="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
          <SiteIcon className="h-5 w-5" />
          <span className="text-lg font-heading font-bold tracking-tight">
            Worth Aircon<span className="text-primary">?</span>
          </span>
        </Link>
      </div>
    </header>
  );
}
