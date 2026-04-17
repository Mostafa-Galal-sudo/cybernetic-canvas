import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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

function ExperiencePage() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement,
            start: "top 70%",
            end: "bottom 70%",
            scrub: true,
          },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <Reveal>
        <SectionHeading
          eyebrow="career::log"
          title="Certifications, training & milestones"
          description="The roles, the courses, and the wins along the way."
        />
      </Reveal>

      <div className="relative mt-16 pl-10 sm:pl-0">
        <div className="absolute left-4 top-0 h-full w-px bg-border sm:left-1/2 sm:-translate-x-1/2">
          <div
            ref={lineRef}
            className="h-full w-full origin-top bg-gradient-to-b from-cyber-cyan via-cyber-violet to-cyber-magenta"
            style={{ boxShadow: "0 0 12px var(--cyber-cyan)" }}
          />
        </div>

        <ul className="space-y-12">
          {TIMELINE.map((item, i) => {
            const right = i % 2 === 1;
            return (
              <li key={item.year + item.role} className="relative">
                <div className="absolute left-4 top-3 -translate-x-1/2 sm:left-1/2">
                  <div className="grid h-4 w-4 place-items-center rounded-full bg-background ring-2 ring-cyber-cyan">
                    <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-cyber-cyan" />
                  </div>
                </div>

                <Reveal
                  className={`sm:w-1/2 ${right ? "sm:ml-auto sm:pl-12" : "sm:pr-12"}`}
                >
                  <div className="relative rounded-2xl p-6 glass-panel gradient-border corner-brackets">
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
                      {item.year}
                    </div>
                    <h3 className="mt-2 font-display text-xl font-semibold">
                      {item.role}
                    </h3>
                    <div className="mt-1 font-mono text-sm text-muted-foreground">
                      @ {item.org}
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                      {item.body}
                    </p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
