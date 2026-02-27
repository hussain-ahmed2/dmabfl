import Link from "next/link";
import { Bus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg supports-backdrop-filter:bg-background/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex h-16 items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <Bus className="h-4 w-4" />
          </div>
          <div className="leading-tight">
            <span className="block text-sm font-bold tracking-tight">
              Dhaka Bus
            </span>
            <span className="block text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
              Fare & Routes
            </span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">Routes</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/fare-calculator">Fare Calculator</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/fare-chart">Fare Chart</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/about">About</Link>
          </Button>
        </nav>

        {/* Mobile: show only icon links */}
        <div className="flex sm:flex-wrap sm:hidden items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">Routes</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/fare-calculator">Fare</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/fare-chart">Chart</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
