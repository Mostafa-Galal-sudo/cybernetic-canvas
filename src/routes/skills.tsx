import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import {
  Sword,
  ShieldCheck,
  Code2,
  Wrench,
  Cloud,
} from "lucide-react";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills — [Your Name]" },
      {
        name: "description",
        content:
          "Offensive security, defensive engineering, languages, tooling, and cloud — the stack I work with.",
      },
      { property: "og:title", content: "Skills — [Your Name]" },
      {
        property: "og:description",
        content:
          "Offensive security, defensive engineering, languages, tooling, and cloud — the stack I work with.",
      },
    ],
  }),
  component: SkillsPage,
});

type Skill = { name: string; level: number; note: string };
type Category = { Icon: typeof Sword; key: string; title: string; skills: Skill[] };

const CATEGORIES: Category[] = [
  {
    key: "offensive",
    Icon: Sword,
    title: "Offensive Security",
    skills: [
      { name: "Web App Pentesting", level: 95, note: "OWASP Top 10, business logic, auth bypasses." },
      { name: "Red Team Ops", level: 88, note: "C2, AD attack paths, evasion, OPSEC." },
      { name: "Binary Exploitation", level: 78, note: "ROP, heap, kernel basics — CTF-grade." },
      { name: "Mobile (iOS/Android)", level: 72, note: "Frida, Objection, MASTG." },
    ],
  },
  {
    key: "defensive",
    Icon: ShieldCheck,
    title: "Defensive Engineering",
    skills: [
      { name: "Threat Modeling", level: 92, note: "STRIDE, attack trees, ADRs." },
      { name: "Detection Engineering", level: 80, note: "Sigma, Elastic, behavioral rules." },
      { name: "IAM & Zero-Trust", level: 85, note: "Policy as code, scoped tokens." },
      { name: "Secure SDLC", level: 90, note: "SAST/DAST/SCA, paved-road tooling." },
    ],
  },
  {
    key: "languages",
    Icon: Code2,
    title: "Languages",
    skills: [
      { name: "Python", level: 95, note: "Tooling, automation, exploit dev." },
      { name: "Go", level: 85, note: "C2 implants, internal services." },
      { name: "Rust", level: 70, note: "Memory-safe tooling, evasion R&D." },
      { name: "TypeScript", level: 88, note: "Full-stack, dashboards, internal tools." },
    ],
  },
  {
    key: "tooling",
    Icon: Wrench,
    title: "Tooling",
    skills: [
      { name: "Burp Suite", level: 95, note: "Daily driver, custom extensions." },
      { name: "Cobalt Strike / Sliver", level: 82, note: "Engagements & opsec." },
      { name: "Ghidra / IDA", level: 75, note: "Reverse engineering binaries." },
      { name: "Nuclei / Semgrep", level: 88, note: "Custom templates & rules." },
    ],
  },
  {
    key: "cloud",
    Icon: Cloud,
    title: "Cloud & Infra",
    skills: [
      { name: "AWS Security", level: 90, note: "IAM, GuardDuty, attack paths." },
      { name: "Kubernetes", level: 80, note: "Pod security, RBAC, supply chain." },
      { name: "Terraform", level: 85, note: "IaC reviews, policy as code." },
      { name: "Linux Internals", level: 90, note: "eBPF, namespaces, hardening." },
    ],
  },
];

export default SkillsPage;

function SkillsPage() {
  const [active, setActive] = useState<string>(CATEGORIES[0].key);
  const cat = CATEGORIES.find((c) => c.key === active)!;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal>
        <SectionHeading
          eyebrow="capabilities::matrix"
          title="The stack I attack and defend with"
          description="Hover any skill to read context. Switch categories to drill in."
        />
      </Reveal>

      {/* Category tabs */}
      <div className="mt-10 flex flex-wrap gap-2">
        {CATEGORIES.map(({ key, Icon, title }) => {
          const isActive = key === active;
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`group inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all glass-panel gradient-border ${
                isActive ? "text-cyber-cyan shadow-[0_0_24px_oklch(0.85_0.18_200/0.35)]" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {title}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {cat.skills.map((s, i) => (
          <Reveal key={s.name} delay={i * 0.05}>
            <div className="group relative overflow-hidden rounded-2xl p-6 glass-panel gradient-border corner-brackets transition-shadow hover:shadow-[0_0_40px_oklch(0.85_0.18_200/0.25)]">
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-xl font-semibold">{s.name}</h3>
                <span className="font-mono text-xs text-cyber-cyan">{s.level}%</span>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-violet transition-all duration-700 ease-out"
                  style={{ width: `${s.level}%` }}
                />
              </div>
              <p className="mt-4 text-sm text-muted-foreground transition-colors group-hover:text-foreground/80">
                {s.note}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
