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
      { title: "Experience — [Your Name]" },
      {
        name: "description",
        content:
          "Career timeline of [Your Name] — security roles, milestones, and notable engagements.",
      },
      { property: "og:title", content: "Experience — [Your Name]" },
      {
        property: "og:description",
        content:
          "Career timeline of [Your Name] — security roles, milestones, and notable engagements.",
      },
    ],
  }),
  component: ExperiencePage,
});

const TIMELINE = [
  {
    year: "2024 — present",
    role: "Principal Security Engineer",
    org: "[Company / Self]",
    body: "[Describe scope: red team leadership, platform security, mentorship.]",
  },
  {
    year: "2022 — 2024",
    role: "Senior Offensive Security Engineer",
    org: "[Company]",
    body: "[Engagements led, internal tooling shipped, CVE disclosures.]",
  },
  {
    year: "2020 — 2022",
    role: "Application Security Engineer",
    org: "[Company]",
    body: "[Built secure SDLC, paved-road frameworks, threat modeling practice.]",
  },
  {
    year: "2018 — 2020",
    role: "Security Consultant",
    org: "[Consultancy]",
    body: "[Web, mobile, cloud assessments across industries.]",
  },
  {
    year: "2016 — 2018",
    role: "Software Engineer",
    org: "[Company]",
    body: "[Where I learned to build before I learned to break.]",
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
          title="A timeline of breaking and building"
          description="The roles, the lessons, and the milestones along the way."
        />
      </Reveal>

      <div className="relative mt-16 pl-10 sm:pl-0">
        {/* Center line (desktop) / left line (mobile) */}
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
              <li key={item.year} className="relative">
                {/* Node */}
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
