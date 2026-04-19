import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { HelixSpine, useScrollProgress, useIsMobile } from "@/components/HelixSpine";
import { HelixCard } from "@/components/HelixCard";

export const Route = createFileRoute("/experience")({
  head: () => ({
    meta: [
      { title: "Experience — Mostafa Galal" },
      {
        name: "description",
        content:
          "Certifications, training, and competition milestones of Mostafa Galal — eJPT, ITI, Red Hat, and TryHackMe achievements.",
      },
      { property: "og:title", content: "Experience — Mostafa Galal" },
      {
        property: "og:description",
        content:
          "Certifications, training, and competition milestones of Mostafa Galal — eJPT, ITI, Red Hat, and TryHackMe achievements.",
      },
    ],
  }),
  component: ExperiencePage,
});

const TIMELINE = [
  {
    year: "Feb 2026",
    role: "eJPT — eLearnSecurity Junior Penetration Tester",
    org: "INE / eLearnSecurity",
    body: "Earned the eJPT certification through hands-on, scenario-based assessment covering reconnaissance, network exploitation, web attacks, and post-exploitation.",
  },
  {
    year: "Dec 2025",
    role: "Exploit Development: Buffer Overflows",
    org: "Self-study course",
    body: "Hands-on training on identifying and exploiting stack-based buffer overflow vulnerabilities — instruction pointer control, shellcode, debugging.",
  },
  {
    year: "Dec 2025",
    role: "System Security & x86 Assembly Fundamentals",
    org: "Self-study course",
    body: "OS internals, memory layout, calling conventions, and x86 assembly — foundation for reverse engineering and exploit development.",
  },
  {
    year: "Sep 2025",
    role: "TryHackMe — 1st Place, Sapphire League",
    org: "TryHackMe",
    body: "Achieved Epic-tier 1st place (rarity 0.8%) — completing a three-season streak across Bronze, Gold, and Sapphire leagues.",
  },
  {
    year: "Aug 2025",
    role: "ITI Cybersecurity Training (90 hours)",
    org: "Information Technology Institute (ITI)",
    body: "Completed 90-hour program: Network Fundamentals (24h), Advanced Networking (24h), Intro to Cybersecurity (18h), Ethical Hacking (24h).",
  },
  {
    year: "Jul 2025",
    role: "Red Hat System Administration I",
    org: "Mahara-Tech",
    body: "RHCSA-aligned Linux administration — user management, file permissions, network configuration, system diagnostics.",
  },
  {
    year: "Jul 2025",
    role: "Cybersecurity For Beginners (35h)",
    org: "Mahara-Tech / VMware / MCIT",
    body: "Foundational 8-module cybersecurity program covering network security, threats, and best practices.",
  },
  {
    year: "May 2025",
    role: "Snapchat SMTP Open Relay — Responsibly Disclosed",
    org: "Snapchat Bug Bounty",
    body: "Discovered and reported an SMTP open relay on beta.snappublisher.snapchat.com with full PoC and remediation guidance.",
  },
  {
    year: "Ongoing",
    role: "Communications & Electronics Engineering",
    org: "University Studies",
    body: "Pursuing a degree in Communications & Electronics Engineering — analog filters, RLC circuits, embedded systems, digital logic.",
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

type TimelineItem = (typeof TIMELINE)[number];

function TimelineCard({ item }: { item: TimelineItem }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.03,
        boxShadow: "0 0 60px oklch(0.85 0.18 200 / 0.4)",
      }}
      transition={{ duration: 0.3, ease: EASE }}
      style={{ transformStyle: "preserve-3d" }}
      className="group relative overflow-hidden rounded-2xl p-6 glass-panel gradient-border corner-brackets"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyber-cyan/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />
      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
        {item.year}
      </div>
      <h3 className="mt-2 font-display text-xl font-semibold leading-snug">
        {item.role}
      </h3>
      <div className="mt-1 font-mono text-sm text-muted-foreground">
        @ {item.org}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">
        {item.body}
      </p>
    </motion.div>
  );
}

function ExperiencePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(containerRef);
  const isMobile = useIsMobile();

  return (
    <div ref={containerRef} className="relative" style={{ minHeight: "300vh" }}>
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="career::log"
            title="Certifications, training & milestones"
            description="The roles, the courses, and the wins along the way."
          />
        </Reveal>
      </div>

      {!isMobile && (
        <div
          aria-hidden
          className="pointer-events-none sticky top-0 h-screen w-full"
          style={{ zIndex: 0 }}
        >
          <HelixSpine scrollProgress={progress} />
        </div>
      )}

      <div
        className="relative mx-auto max-w-7xl px-4 sm:px-6"
        style={{
          marginTop: isMobile ? 0 : "-100vh",
          zIndex: 10,
        }}
      >
        <ul className="space-y-20 pb-32 pt-8">
          {TIMELINE.map((item, i) => (
            <li key={item.year + item.role} className="relative">
              {/* Year label floating on the spine centerline (desktop only) */}
              {!isMobile && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 font-mono text-xs uppercase tracking-[0.3em] text-cyber-cyan"
                  style={{ textShadow: "0 0 12px oklch(0.85 0.18 200 / 0.6)" }}
                >
                  {item.year}
                </div>
              )}
              <HelixCard index={i} offset={300}>
                <TimelineCard item={item} />
              </HelixCard>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
