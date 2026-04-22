import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Terminal, Home, Network, Crosshair, LayoutGrid, GitBranch, FileWarning, ScrollText, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/about", label: "About", Icon: Network },
  { to: "/skills", label: "Skills", Icon: Crosshair },
  { to: "/projects", label: "Projects", Icon: LayoutGrid },
  { to: "/experience", label: "Experience", Icon: GitBranch },
  { to: "/writeups", label: "Writeups", Icon: FileWarning },
  { to: "/services", label: "Services", Icon: ScrollText },
  { to: "/contact", label: "Contact", Icon: Mail },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouterState();
  const path = router.location.pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "py-3" : "py-5",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="group flex items-center gap-2 font-mono text-sm tracking-wider"
        >
          <span className="grid h-8 w-8 place-items-center rounded-md glass-panel gradient-border">
            <Terminal className="h-4 w-4 text-cyber-cyan" />
          </span>
          <span className="hidden sm:inline">
            <span className="text-cyber-cyan">~/</span>
            <span className="text-foreground">mostafa-galal</span>
            <span className="animate-pulse-glow text-cyber-violet">_</span>
          </span>
        </Link>

        <nav
          className={cn(
            "hidden items-center gap-1 rounded-full px-2 py-1.5 lg:flex",
            "glass-panel gradient-border",
          )}
        >
          {NAV.map((item) => {
            const active =
              item.to === "/" ? path === "/" : path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors",
                  active
                    ? "text-cyber-cyan"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <span
                    className="absolute inset-0 -z-10 rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.85 0.18 200 / 0.18), oklch(0.65 0.25 290 / 0.18))",
                      boxShadow: "inset 0 0 0 1px oklch(0.85 0.18 200 / 0.4)",
                    }}
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          to="/contact"
          className="hidden rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider text-cyber-cyan transition-shadow hover:shadow-[0_0_24px_oklch(0.85_0.18_200/0.5)] glass-panel gradient-border lg:inline-flex"
        >
          Hire me →
        </Link>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-md glass-panel gradient-border lg:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden">
          <div className="mx-4 mt-3 rounded-2xl glass-panel gradient-border p-4">
            <div className="grid gap-1">
              {NAV.map((item) => {
                const active =
                  item.to === "/" ? path === "/" : path.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "rounded-lg px-3 py-2 font-mono text-sm transition-colors",
                      active
                        ? "bg-cyber-cyan/10 text-cyber-cyan"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
