import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { SpineColumn, useSpineScrollProgress, useIsSmall } from "@/components/SpineColumn";
import { SpineCard } from "@/components/SpineCard";
import { ExternalLink, Trophy } from "lucide-react";

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
    image: "/assets/ejpt.png",
    verification:
      "https://certs.ine.com/bdf79a3b-3819-422f-b284-44dec448edb1#acc.dEjlnfeV",
    body: "Earned the eJPT certification through hands-on scenario-based assessment covering reconnaissance, network exploitation, web attacks, and post-exploitation.",
  },
  {
    year: "Dec 2025",
    role: "Exploit Development: Buffer Overflows",
    org: "Self-study course",
    image: "/assets/bof.png",
    verification: "",
    body: "Hands-on training on identifying and exploiting stack-based buffer overflow vulnerabilities — instruction pointer control, shellcode, debugging.",
  },
  {
    year: "Dec 2025",
    role: "System Security & x86 Assembly Fundamentals",
    org: "Self-study course",
    image: "/assets/x86.png",
    verification: "",
    body: "OS internals, memory layout, calling conventions, and x86 assembly — foundation for reverse engineering and exploit development.",
  },
  {
    year: "Sep 2025",
    role: "TryHackMe — 1st Place, Sapphire League (Epic Tier 0.8%)",
    org: "TryHackMe",
    image: "",
    verification: "",
    body: "Three-season streak: Bronze 1st (5.2%), Gold 1st (1.7%), Sapphire 1st (0.8% Epic). Daily labs across web exploitation, AD, and red team methodology.",
  },
  {
    year: "Aug 2025",
    role: "ITI Cybersecurity Training (90 hours)",
    org: "Information Technology Institute (ITI)",
    image: "/assets/iti_cybersecurity.png",
    verification: "",
    body: "Network Fundamentals (24h), Advanced Networking (24h), Intro to Cybersecurity (18h), Ethical Hacking (24h).",
  },
  {
    year: "Jul 2025",
    role: "Red Hat System Administration I",
    org: "Mahara-Tech",
    image: "/assets/redhat.png",
    verification: "https://maharatech.gov.eg/certificates/SmqfO4ljdQ",
    body: "RHCSA-aligned Linux administration — user management, file permissions, network configuration, system diagnostics.",
  },
  {
    year: "Jul 2025",
    role: "Cybersecurity For Beginners (35h)",
    org: "Mahara-Tech / VMware / MCIT",
    image: "/assets/cyber.png",
    verification: "https://maharatech.gov.eg/certificates/KJCFdlaQhL",
    body: "8-module foundational program covering network security, threats, and best practices.",
  },
  {
    year: "May 2025",
    role: "Snapchat SMTP Open Relay — Responsibly Disclosed",
    org: "Snapchat Bug Bounty",
    image: "",
    verification: "",
    body: "Discovered and reported an SMTP open relay on beta.snappublisher.snapchat.com with full PoC (telnet + swaks) and remediation guidance.",
  },
  {
    year: "Ongoing",
    role: "Communications & Electronics Engineering",
    org: "University Studies",
    image: "",
    verification: "",
    body: "Pursuing a degree in Communications & Electronics Engineering — analog filters, RLC circuits, embedded systems, digital logic.",
  },
];

const CTF_ACHIEVEMENTS = [
  { event: "CyberTalents (Solo)", place: "20th", total: "250 participants", note: "Won an eJPT exam voucher" },
  { event: "CyberTalents (Team)", place: "4th", total: "", note: "With team DARKVIEL" },
  { event: "ZinadCTF", place: "11th", total: "100+ teams", note: "With team DARKVIEL" },
  { event: "LuxorCTF — Qualifiers", place: "10th", total: "100 teams", note: "Advanced to finals" },
  { event: "LuxorCTF — Finals", place: "7th", total: "Top 10", note: "AI was prohibited" },
  { event: "HackTheBox Global CTF", place: "23rd", total: "1,600+ teams", note: "Global event — taken seriously" },
  { event: "HackTheBox Platform", place: "Hacker rank", total: "", note: "Other globals — usually top 200 (not taken seriously)" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

type TimelineItem = (typeof TIMELINE)[number];

function TimelineCard({ item }: { item: TimelineItem }) {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        boxShadow: "0 0 60px oklch(0.85 0.18 200 / 0.4)",
      }}
      transition={{ duration: 0.25, ease: EASE }}
      className="group relative overflow-hidden rounded-2xl glass-panel gradient-border corner-brackets"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyber-cyan/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
      />
      {item.image && (
        <div className="aspect-[16/9] w-full overflow-hidden bg-black/40">
          <img
            src={item.image}
            alt={item.role}
            loading="lazy"
            className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
          {item.year}
        </div>
        <h3 className="mt-2 font-display text-xl font-semibold leading-snug">
          {item.role}
        </h3>
        <div className="mt-1 font-mono text-sm text-muted-foreground">
          @ {item.org}
        </div>
        <p className="mt-3 text-sm leading-relaxed text-foreground/80">{item.body}</p>
        {item.verification && (
          <a
            href={item.verification}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-cyber-cyan hover:underline"
          >
            <ExternalLink className="h-3 w-3" /> verify
          </a>
        )}
      </div>
    </motion.div>
  );
}

function ExperiencePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useSpineScrollProgress(containerRef);
  const isSmall = useIsSmall();

  return (
    <>
      <div ref={containerRef} className="relative" style={{ minHeight: "320vh" }}>
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="career::log"
              title="Certifications, training & milestones"
              description="The roles, the courses, and the wins along the way."
            />
          </Reveal>
        </div>

        {!isSmall && (
          <div
            aria-hidden
            className="pointer-events-none sticky top-0 hidden h-screen w-full sm:block"
            style={{ zIndex: 0 }}
          >
            <SpineColumn progressRef={progress} />
          </div>
        )}

        <div
          className="relative mx-auto max-w-7xl px-4 sm:px-6"
          style={{
            marginTop: isSmall ? 0 : "-100vh",
            zIndex: 10,
          }}
        >
          <ul className="space-y-16 pb-24 pt-8 sm:space-y-24">
            {TIMELINE.map((item, i) => (
              <li key={item.year + item.role} className="relative">
                {!isSmall && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-2 z-20 -translate-x-1/2 font-mono text-xs uppercase tracking-[0.3em] text-cyber-cyan"
                    style={{ textShadow: "0 0 12px oklch(0.85 0.18 200 / 0.6)" }}
                  >
                    {item.year}
                  </div>
                )}
                <SpineCard index={i}>
                  <TimelineCard item={item} />
                </SpineCard>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTF Achievements — separate sub-section */}
      <section className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="ctf::scoreboard"
            title="Competition placements"
            description="Selected results across global and regional CTF events."
          />
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CTF_ACHIEVEMENTS.map((c, i) => (
            <Reveal key={`${c.event}-${i}`} delay={i * 0.04}>
              <motion.div
                whileHover={{ scale: 1.03, boxShadow: "0 0 30px oklch(0.85 0.18 200 / 0.3)" }}
                transition={{ duration: 0.25, ease: EASE }}
                className="rounded-xl p-5 glass-panel gradient-border"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-cyber-cyan">
                    <Trophy className="h-3 w-3" /> {c.place}
                  </div>
                  {c.total && (
                    <div className="font-mono text-[10px] text-muted-foreground">
                      / {c.total}
                    </div>
                  )}
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold">{c.event}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{c.note}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
