import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { Shield, Coffee, Brain, Lock } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Mostafa Galal" },
      {
        name: "description",
        content:
          "Background and principles behind Mostafa Galal's work in offensive security and embedded engineering.",
      },
      { property: "og:title", content: "About — Mostafa Galal" },
      {
        property: "og:description",
        content:
          "Background and principles behind Mostafa Galal's work in offensive security and embedded engineering.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const bioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bioRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const lines = el.querySelectorAll<HTMLElement>("[data-line]");
      gsap.from(lines, {
        opacity: 0,
        y: 20,
        filter: "blur(6px)",
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 75%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const lines = [
    "I'm Mostafa Mohamed Galal — a Communications & Electronics Engineering student with a deep focus on offensive security and red team operations.",
    "My path is unusual: I'm balancing a heavy engineering curriculum (analog filters, RLC circuits, embedded systems) with self-directed cybersecurity training that has earned me eJPT certification and three #1 finishes on TryHackMe leaderboards.",
    "I've shipped hands-on projects across both worlds — from a Smart Recon Vehicle and Butterworth band-pass filters on the engineering side, to the Shadow Core Framework, NM Analyzer, and a Payload Research Toolkit on the offensive side.",
    "I report bugs responsibly (Snapchat SMTP open relay, among others), compete in CyberTalents and CyShield, and study reverse engineering, x86 assembly, and exploit development to keep my low-level skills sharp.",
    "If a system is worth attacking, it's worth doing it well — methodically, ethically, and with an engineer's understanding of the hardware and software underneath.",
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal>
        <SectionHeading
          eyebrow="whoami"
          title="The human behind the terminal"
          description="An engineering student turned offensive security practitioner."
        />
      </Reveal>

      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        {/* Portrait */}
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl glass-panel gradient-border corner-brackets">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, oklch(0.65 0.25 290 / 0.45), transparent 60%), radial-gradient(circle at 70% 80%, oklch(0.85 0.18 200 / 0.35), transparent 60%)",
              }}
            />
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <div className="mx-auto grid h-32 w-32 place-items-center rounded-full glass-panel gradient-border">
                  <span className="font-display text-4xl font-bold text-gradient-cyber">
                    MG
                  </span>
                </div>
                <div className="mt-4 font-mono text-xs uppercase tracking-[0.25em] text-cyber-cyan">
                  Mostafa Galal
                </div>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <span>id::eJPT_certified</span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-2 w-2 animate-pulse-glow rounded-full bg-cyber-cyan" />
                online
              </span>
            </div>
          </div>
        </Reveal>

        {/* Bio */}
        <div ref={bioRef} className="space-y-5">
          {lines.map((line, i) => (
            <p
              key={i}
              data-line
              className="text-lg leading-relaxed text-foreground/90"
            >
              {line}
            </p>
          ))}

          <div className="grid grid-cols-2 gap-3 pt-6 sm:grid-cols-4">
            {[
              { Icon: Shield, label: "Ethics first" },
              { Icon: Brain, label: "Curious" },
              { Icon: Lock, label: "Methodical" },
              { Icon: Coffee, label: "Persistent" },
            ].map(({ Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-lg px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground glass-panel"
              >
                <Icon className="h-3.5 w-3.5 text-cyber-cyan" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Principles */}
      <div className="mt-24">
        <Reveal>
          <SectionHeading
            eyebrow="principles::core"
            title="How I work"
          />
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { t: "Engineer first, hacker second", d: "I understand systems from the transistor up — that's what makes the offensive side click." },
            { t: "Learn by shipping", d: "Every concept becomes a project: from RLC filters to the Shadow Core Framework." },
            { t: "Disclose responsibly", d: "Every bug I find — like the Snapchat SMTP relay — gets reported with a clear PoC and a fix path." },
          ].map((p, i) => (
            <Reveal key={p.t} delay={i * 0.08}>
              <div className="relative h-full rounded-2xl p-6 glass-panel gradient-border corner-brackets">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
                  // 0{i + 1}
                </div>
                <h3 className="mt-2 font-display text-xl font-semibold">{p.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
