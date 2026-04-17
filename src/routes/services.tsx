import { createFileRoute, Link } from "@tanstack/react-router";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Check, Sword, ShieldCheck, BrainCircuit, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Hire [Your Name]" },
      {
        name: "description",
        content:
          "Pentesting, red team engagements, and security consulting — engagement models and what's included.",
      },
      { property: "og:title", content: "Services — Hire [Your Name]" },
      {
        property: "og:description",
        content:
          "Pentesting, red team engagements, and security consulting — engagement models and what's included.",
      },
    ],
  }),
  component: ServicesPage,
});

const TIERS = [
  {
    Icon: ShieldCheck,
    name: "Pentest",
    tagline: "Time-boxed, scoped assessment of a defined target.",
    bullets: [
      "Web, API, mobile, or cloud target",
      "OWASP-aligned methodology",
      "Engineer-friendly remediation report",
      "Free re-test of fixes within 30 days",
    ],
    cta: "Scope a pentest",
    highlight: false,
  },
  {
    Icon: Sword,
    name: "Red Team Engagement",
    tagline: "Goal-oriented, multi-vector simulation against your org.",
    bullets: [
      "Custom objectives & rules of engagement",
      "Phishing, infra, physical (optional)",
      "Detection & response collaboration",
      "Executive + technical debrief",
    ],
    cta: "Plan engagement",
    highlight: true,
  },
  {
    Icon: BrainCircuit,
    name: "Security Consulting",
    tagline: "Embedded advisory for your roadmap, architecture, and program.",
    bullets: [
      "Threat modeling workshops",
      "Architecture & code reviews",
      "Security program maturity audit",
      "Hiring & team mentoring",
    ],
    cta: "Book consulting",
    highlight: false,
  },
];

function ServicesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal>
        <SectionHeading
          eyebrow="engagements::open"
          title="Three ways to work together"
          description="From a quick pentest to embedded advisory — pick the shape that fits your org."
        />
      </Reveal>

      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        {TIERS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08}>
            <div
              className={`relative flex h-full flex-col overflow-hidden rounded-2xl p-7 glass-panel gradient-border corner-brackets ${
                t.highlight ? "shadow-[0_0_60px_oklch(0.85_0.18_200/0.3)]" : ""
              }`}
            >
              {t.highlight && (
                <div className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-violet px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-background">
                  most asked
                </div>
              )}

              <div className="grid h-12 w-12 place-items-center rounded-xl glass-panel gradient-border">
                <t.Icon className="h-5 w-5 text-cyber-cyan" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold">{t.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.tagline}</p>

              <ul className="mt-6 space-y-2.5">
                {t.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-foreground/85">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyber-cyan" />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-8">
                <Link
                  to="/contact"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-violet px-5 py-3 font-mono text-xs uppercase tracking-wider text-background transition-shadow hover:shadow-[0_0_36px_oklch(0.85_0.18_200/0.55)]"
                >
                  {t.cta}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div className="mt-16 rounded-2xl p-8 text-center glass-panel gradient-border">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
            not sure which fits?
          </div>
          <h3 className="mt-2 font-display text-2xl font-semibold">
            Tell me about your system — I'll tell you what I'd do first.
          </h3>
          <Link
            to="/contact"
            className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-cyber-cyan glass-panel gradient-border"
          >
            Start the conversation <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
