import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink, Github } from "lucide-react";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — [Your Name]" },
      {
        name: "description",
        content:
          "Selected work — security tooling, exploits, platforms, and open-source contributions.",
      },
      { property: "og:title", content: "Projects — [Your Name]" },
      {
        property: "og:description",
        content:
          "Selected work — security tooling, exploits, platforms, and open-source contributions.",
      },
    ],
  }),
  component: ProjectsPage,
});

type Project = {
  id: string;
  code: string;
  status: "shipped" | "active" | "archived";
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  gradient: string;
};

const PROJECTS: Project[] = [
  {
    id: "p01",
    code: "PROJ_01",
    status: "active",
    title: "[Project 01] — C2 Framework",
    tagline: "Lightweight, multi-protocol command-and-control for red team ops.",
    description:
      "[Describe the project. What problem it solves, the unique angle, key wins. Mention scale, performance, or notable techniques used.]",
    tech: ["Go", "WebSockets", "mTLS", "SQLite"],
    gradient:
      "linear-gradient(135deg, oklch(0.85 0.18 200 / 0.4), oklch(0.65 0.25 290 / 0.4))",
  },
  {
    id: "p02",
    code: "PROJ_02",
    status: "shipped",
    title: "[Project 02] — Vuln Scanner",
    tagline: "Template-driven scanner with custom logic for modern web stacks.",
    description:
      "[Describe the project. Detection coverage, false-positive rate, integration story.]",
    tech: ["Python", "asyncio", "Nuclei", "Postgres"],
    gradient:
      "linear-gradient(135deg, oklch(0.7 0.27 330 / 0.4), oklch(0.85 0.18 200 / 0.4))",
  },
  {
    id: "p03",
    code: "PROJ_03",
    status: "shipped",
    title: "[Project 03] — Phishing Sim Platform",
    tagline: "Full-funnel phishing simulation with realistic ML-generated lures.",
    description:
      "[Describe the project. Click rates, training conversion, integrations.]",
    tech: ["TypeScript", "Next.js", "Postgres", "Cloudflare"],
    gradient:
      "linear-gradient(135deg, oklch(0.65 0.25 290 / 0.4), oklch(0.7 0.27 330 / 0.4))",
  },
  {
    id: "p04",
    code: "PROJ_04",
    status: "active",
    title: "[Project 04] — eBPF Detection Engine",
    tagline: "Runtime threat detection at the syscall layer.",
    description:
      "[Describe the project. What it detects, perf overhead, deployment story.]",
    tech: ["Rust", "eBPF", "Linux", "OpenTelemetry"],
    gradient:
      "linear-gradient(135deg, oklch(0.75 0.18 160 / 0.4), oklch(0.85 0.18 200 / 0.4))",
  },
  {
    id: "p05",
    code: "PROJ_05",
    status: "archived",
    title: "[Project 05] — CTF Infra",
    tagline: "Containerized challenge hosting with auto-scaling and isolation.",
    description:
      "[Describe the project. Concurrent players, isolation model, costs.]",
    tech: ["Kubernetes", "Go", "gVisor"],
    gradient:
      "linear-gradient(135deg, oklch(0.78 0.18 80 / 0.4), oklch(0.7 0.27 330 / 0.4))",
  },
  {
    id: "p06",
    code: "PROJ_06",
    status: "shipped",
    title: "[Project 06] — Secrets Hunter",
    tagline: "Pre-commit and CI scanner for leaked credentials and tokens.",
    description:
      "[Describe the project. Detector coverage, perf, IDE plugins.]",
    tech: ["Rust", "Tree-sitter", "GitHub Actions"],
    gradient:
      "linear-gradient(135deg, oklch(0.65 0.25 290 / 0.4), oklch(0.75 0.18 160 / 0.4))",
  },
];

const STATUS_COLOR: Record<Project["status"], string> = {
  active: "bg-cyber-cyan",
  shipped: "bg-emerald-400",
  archived: "bg-muted-foreground",
};

function ProjectsPage() {
  const [open, setOpen] = useState<Project | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal>
        <SectionHeading
          eyebrow="repo::index"
          title="Selected projects, deployed in production"
          description="A small slice of the things I've built. Click any card for details."
        />
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.05}>
            <TiltCard className="group h-full">
              <button
                onClick={() => setOpen(p)}
                className="relative block h-full w-full overflow-hidden rounded-2xl text-left glass-panel gradient-border corner-brackets transition-shadow hover:shadow-[0_0_40px_oklch(0.85_0.18_200/0.3)]"
              >
                <div
                  aria-hidden
                  className="aspect-[16/10] w-full"
                  style={{ background: p.gradient }}
                >
                  <div className="grid h-full place-items-center">
                    <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-foreground/70">
                      {p.code}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    <span>{p.code}</span>
                    <span className="flex items-center gap-1.5">
                      <span className={`inline-block h-2 w-2 animate-pulse-glow rounded-full ${STATUS_COLOR[p.status]}`} />
                      {p.status}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-xl font-semibold leading-snug">
                    {p.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {p.tagline}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tech.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                    {p.tech.length > 3 && (
                      <span className="font-mono text-[10px] text-muted-foreground">
                        +{p.tech.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-2xl glass-panel gradient-border">
          {open && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-cyber-cyan">
                  <span>{open.code}</span>
                  <span className="flex items-center gap-1.5">
                    <span className={`inline-block h-2 w-2 animate-pulse-glow rounded-full ${STATUS_COLOR[open.status]}`} />
                    {open.status}
                  </span>
                </div>
                <DialogTitle className="mt-2 font-display text-3xl">
                  {open.title}
                </DialogTitle>
                <DialogDescription className="text-base text-muted-foreground">
                  {open.tagline}
                </DialogDescription>
              </DialogHeader>
              <div
                aria-hidden
                className="mt-2 aspect-[16/9] w-full overflow-hidden rounded-xl"
                style={{ background: open.gradient }}
              >
                <div className="grid h-full place-items-center">
                  <span className="font-mono text-xs uppercase tracking-[0.4em] text-foreground/70">
                    [Screenshot placeholder]
                  </span>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-foreground/80">
                {open.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {open.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider text-cyber-cyan glass-panel gradient-border"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Live
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider text-foreground glass-panel gradient-border"
                >
                  <Github className="h-3.5 w-3.5" /> Source
                </a>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
