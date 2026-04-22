import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Reveal } from "@/components/Reveal";
import { Sword, ShieldCheck, BrainCircuit, Check, ArrowRight, FileText, Clock, Target, Package } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Hire Mostafa Galal" },
      {
        name: "description",
        content:
          "Scope-of-work documents for pentesting, red team labs, and security mentoring with Mostafa Galal — eJPT certified.",
      },
      { property: "og:title", content: "Services — Hire Mostafa Galal" },
      {
        property: "og:description",
        content:
          "Scope-of-work documents for pentesting, red team labs, and security mentoring.",
      },
    ],
  }),
  component: ServicesPage,
});

type Phase = { day: string; label: string; detail: string };

const SERVICES = [
  {
    Icon: ShieldCheck,
    code: "SOW-PT-01",
    name: "Penetration Testing",
    tagline: "Time-boxed, scoped assessment of a defined web or network target.",
    duration: "1–2 weeks",
    objective:
      "Identify exploitable vulnerabilities in the agreed scope and deliver an engineer-friendly remediation report.",
    phases: [
      { day: "Day 0",      label: "Scoping & ROE",       detail: "Asset inventory, rules of engagement, success criteria, contact tree." },
      { day: "Day 1–3",    label: "Reconnaissance",      detail: "Subdomain enumeration, service fingerprinting, attack-surface mapping." },
      { day: "Day 3–7",    label: "Exploitation",        detail: "OWASP Top 10, business logic flaws, network exploitation paths." },
      { day: "Day 7–10",   label: "Reporting",           detail: "Findings with PoC, severity, remediation steps, and re-test plan." },
    ] as Phase[],
    deliverables: [
      "Executive summary",
      "Detailed technical findings (with PoC)",
      "Remediation playbook",
      "Free re-test of fixes within 30 days",
    ],
    cta: "Scope a pentest",
  },
  {
    Icon: Sword,
    code: "SOW-RT-02",
    name: "Red Team Lab Engagement",
    tagline: "Goal-oriented, multi-vector simulation in lab/staging environments.",
    duration: "2–4 weeks",
    objective:
      "Simulate a goal-driven adversary against your lab/staging environment to validate detection, response, and exposure.",
    phases: [
      { day: "Week 0",  label: "Objective design",      detail: "Crown jewels, win conditions, ROE, deconfliction channels with blue team." },
      { day: "Week 1",  label: "Initial access",        detail: "External recon, social-vector simulation (lab only), perimeter exploitation." },
      { day: "Week 2",  label: "Post-exploitation",     detail: "AD enumeration, lateral movement, privilege escalation, persistence." },
      { day: "Week 3",  label: "Objective + debrief",   detail: "Reach objectives, document detections seen/missed, executive + technical debrief." },
    ] as Phase[],
    deliverables: [
      "Custom rules of engagement",
      "Full attack chain narrative",
      "Defender collaboration notes",
      "Executive + technical debrief",
    ],
    cta: "Plan engagement",
    highlighted: true,
  },
  {
    Icon: BrainCircuit,
    code: "SOW-MT-03",
    name: "Mentoring & CTF Coaching",
    tagline: "1:1 mentoring for students and engineers entering offensive security.",
    duration: "Monthly",
    objective:
      "Build a focused study path, review CTF + bug bounty workflow, and prepare for the eJPT exam.",
    phases: [
      { day: "Week 1", label: "Diagnostic",       detail: "Skill review, gap analysis, goal setting (CTF tier / cert / bug bounty)." },
      { day: "Week 2", label: "Plan & resources", detail: "Custom TryHackMe / HTB study path, recommended tooling and labs." },
      { day: "Week 3", label: "Live working",     detail: "Box walkthrough sessions, methodology coaching, writeup feedback." },
      { day: "Week 4", label: "Review",           detail: "Progress check, next-month plan, optional eJPT readiness assessment." },
    ] as Phase[],
    deliverables: [
      "Custom study plan",
      "Weekly 1:1 sessions",
      "Box / writeup feedback",
      "eJPT exam readiness review",
    ],
    cta: "Book mentoring",
  },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

type Service = (typeof SERVICES)[number];

function SOWDocument({ s }: { s: Service }) {
  const highlighted = "highlighted" in s && s.highlighted;
  return (
    <motion.article
      initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative"
    >
      {highlighted && (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, oklch(0.85 0.18 200 / 0.18), transparent 70%)",
          }}
        />
      )}
      <div className="overflow-hidden rounded-2xl glass-panel gradient-border">
        {/* document header */}
        <div className="border-b border-white/5 bg-black/30 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
            <span className="inline-flex items-center gap-2">
              <FileText className="h-3 w-3" /> scope of work — {s.code}
            </span>
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <Clock className="h-3 w-3" /> {s.duration}
            </span>
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold leading-tight sm:text-3xl">
            {s.name}
            {highlighted && (
              <span className="ml-3 align-middle rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-violet px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-background">
                most asked
              </span>
            )}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{s.tagline}</p>
        </div>

        <div className="grid gap-0 sm:grid-cols-[1.2fr_1fr]">
          {/* left: phases */}
          <div className="border-b border-white/5 p-6 sm:border-b-0 sm:border-r">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
              <Target className="mr-1 inline h-3 w-3" /> objective
            </div>
            <p className="mt-2 text-sm text-foreground/80">{s.objective}</p>

            <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
              engagement timeline
            </div>
            <ol className="mt-3 space-y-3">
              {s.phases.map((p, i) => (
                <motion.li
                  key={p.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.4, ease: EASE, delay: i * 0.06 }}
                  className="relative pl-6"
                >
                  <span className="absolute left-0 top-1.5 grid h-3 w-3 place-items-center rounded-full bg-cyber-cyan ring-2 ring-cyber-cyan/30 shadow-[0_0_10px_oklch(0.85_0.18_200/0.6)]" />
                  {i < s.phases.length - 1 && (
                    <span aria-hidden className="absolute left-[5px] top-5 h-full w-px bg-gradient-to-b from-cyber-cyan/40 to-transparent" />
                  )}
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-cyber-cyan">{p.day}</span>
                    <span className="font-display text-sm font-semibold">{p.label}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{p.detail}</p>
                </motion.li>
              ))}
            </ol>
          </div>

          {/* right: deliverables + CTA */}
          <div className="flex flex-col p-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
              <Package className="mr-1 inline h-3 w-3" /> deliverables
            </div>
            <ul className="mt-3 space-y-2.5">
              {s.deliverables.map((d, i) => (
                <motion.li
                  key={d}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.4, ease: EASE, delay: i * 0.06 }}
                  className="flex items-start gap-2 text-sm text-foreground/85"
                >
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyber-cyan" />
                  {d}
                </motion.li>
              ))}
            </ul>

            <div className="mt-auto pt-6">
              <Link to="/contact">
                <motion.span
                  whileHover={{ scale: 1.03, boxShadow: "0 0 30px oklch(0.85 0.18 200 / 0.5)" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.22, ease: EASE }}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-violet px-5 py-3 font-mono text-xs uppercase tracking-wider text-background"
                >
                  {s.cta}
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-flex"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </motion.span>
              </Link>
            </div>
          </div>
        </div>

        {/* footer / signature line */}
        <div className="flex items-center justify-between border-t border-white/5 bg-black/20 px-6 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <s.Icon className="h-3 w-3 text-cyber-cyan" /> issued by mostafa_galal
          </span>
          <span>v1 — current</span>
        </div>
      </div>
    </motion.article>
  );
}

function ServicesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <Reveal>
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-cyber-cyan">
            <span className="h-px w-8 bg-gradient-to-r from-cyber-cyan to-transparent" />
            engagements::open
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
            Three <span className="text-gradient-cyber">scopes of work</span>
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Each engagement is documented like a real SOW — objective, phased timeline, deliverables, and a clear CTA.
          </p>
        </div>
      </Reveal>

      <div className="mt-14 space-y-12">
        {SERVICES.map((s) => (
          <SOWDocument key={s.code} s={s} />
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-16 rounded-2xl p-8 text-center glass-panel gradient-border">
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
            not sure which fits?
          </div>
          <h3 className="mt-2 font-display text-2xl font-semibold">
            Tell me about your system — I'll tell you what I'd test first.
          </h3>
          <Link to="/contact">
            <motion.span
              whileHover={{ scale: 1.05, boxShadow: "0 0 24px oklch(0.85 0.18 200 / 0.4)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-cyber-cyan glass-panel gradient-border"
            >
              Start the conversation <ArrowRight className="h-3.5 w-3.5" />
            </motion.span>
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
