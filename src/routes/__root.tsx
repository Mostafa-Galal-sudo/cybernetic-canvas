import {
  Outlet,
  Link,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CursorGlow } from "@/components/CursorGlow";
import { AmbientBackdrop } from "@/components/AmbientBackdrop";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="font-mono text-xs uppercase tracking-[0.25em] text-cyber-cyan">
          err::404
        </div>
        <h1 className="mt-4 font-display text-7xl font-bold text-gradient-cyber">
          404
        </h1>
        <h2 className="mt-2 text-xl font-semibold text-foreground">
          Signal lost
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This route doesn't exist in the perimeter. Returning to base.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md px-4 py-2 font-mono text-xs uppercase tracking-wider text-cyber-cyan glass-panel gradient-border transition-shadow hover:shadow-[0_0_24px_oklch(0.85_0.18_200/0.5)]"
          >
            ./go-home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#06070B" },
      { title: "Mostafa Galal — Cybersecurity Engineer & Red Teamer" },
      {
        name: "description",
        content:
          "Portfolio of Mostafa Galal — Communications & Electronics engineer, eJPT-certified red teamer, and offensive security researcher.",
      },
      { name: "author", content: "Mostafa Mohamed Galal" },
      { property: "og:title", content: "Mostafa Galal — Cybersecurity Engineer & Red Teamer" },
      {
        property: "og:description",
        content:
          "Premium portfolio: red team work, secure engineering, embedded systems, and bug bounty findings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <SmoothScroll />
      <AmbientBackdrop />
      <CursorGlow />
      <SiteHeader />
      <main className="relative pt-24">
        <Outlet />
      </main>
      <SiteFooter />
    </>
  );
}
