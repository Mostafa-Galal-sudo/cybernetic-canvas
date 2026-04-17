import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowRight, ChevronDown, Shield, Cpu, Terminal, Zap } from "lucide-react";
import { Hero3D } from "@/components/Hero3D";
import { Reveal } from "@/components/Reveal";
import { Counter } from "@/components/Counter";
import { SectionHeading } from "@/components/SectionHeading";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "[Your Name] — Cybersecurity Engineer & Red Teamer" },
      {
        name: "description",
        content:
          "Premium portfolio of [Your Name]. Offensive security, red team operations, secure engineering, and CTF writeups.",
      },
      { property: "og:title", content: "[Your Name] — Cybersecurity Engineer & Red Teamer" },
      {
        property: "og:description",
        content:
          "Premium portfolio of [Your Name]. Offensive security, red team operations, secure engineering, and CTF writeups.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const chars = el.querySelectorAll<HTMLElement>("[data-char]");
      gsap.from(chars, {
        yPercent: 110,
        opacity: 0,
        rotateX: -45,
        stagger: 0.025,
        duration: 1,
        ease: "power4.out",
        delay: 0.2,
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const title = "Cybersecurity Engineer / Red Teamer";

  return (
    <>
      {/* HERO */}
      <section className="relative -mt-24 flex min-h-[100svh] items-center overflow-hidden">
        <Hero3D />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[11px] uppercase tracking-[0.25em] text-cyber-cyan glass-panel gradient-border">
              <span className="inline-block h-1.5 w-1.5 animate-pulse-glow rounded-full bg-cyber-cyan" />
              v1.0 — accepting engagements
            </div>

            <h1
              ref={titleRef}
              className="font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl lg:text-[5.5rem]"
              aria-label={title}
            >
              <span className="block overflow-hidden pb-2">
                {"Cybersecurity".split("").map((c, i) => (
                  <span key={`a${i}`} data-char className="inline-block">
                    {c}
                  </span>
                ))}
              </span>
              <span className="block overflow-hidden pb-2 text-gradient-cyber">
                {"Engineer".split("").map((c, i) => (
                  <span key={`b${i}`} data-char className="inline-block">
                    {c}
                  </span>
                ))}
                <span data-char className="inline-block px-3 text-foreground">/</span>
                {"Red Teamer".split("").map((c, i) => (
                  <span key={`c${i}`} data-char className="inline-block">
                    {c === " " ? "\u00A0" : c}
                  </span>
                ))}
              </span>
            </h1>

            <Reveal delay={0.8}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                I break things on purpose so they don't break by accident.
                [Your one-line bio describing what you do, who you help, and the
                outcome you deliver.]
              </p>
            </Reveal>

            <Reveal delay={1}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/projects"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-violet px-6 py-3 font-mono text-xs uppercase tracking-wider text-background transition-shadow hover:shadow-[0_0_40px_oklch(0.85_0.18_200/0.6)]"
                >
                  View work
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-xs uppercase tracking-wider text-foreground glass-panel gradient-border hover:text-cyber-cyan"
                >
                  ./contact
                </Link>
              </div>
            </Reveal>

            <Reveal delay={1.2}>
              <div className="mt-12 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
                {[
                  { Icon: Shield, label: "Red Team Ops" },
                  { Icon: Cpu, label: "Secure Eng" },
                  { Icon: Terminal, label: "CTF Player" },
                  { Icon: Zap, label: "0-day Hunter" },
                ].map(({ Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    <Icon className="h-3.5 w-3.5 text-cyber-cyan" />
                    {label}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-cyber-cyan">
          <ChevronDown className="h-5 w-5 animate-scroll-hint" />
        </div>
      </section>

      {/* STATS */}
      <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="metrics::live"
            title="Numbers from the field"
            description="A snapshot of impact across engagements, research, and competition."
          />
        </Reveal>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { n: 47, suffix: "+", label: "CVEs disclosed" },
            { n: 132, suffix: "", label: "Boxes pwned" },
            { n: 28, suffix: "", label: "CTFs won" },
            { n: 8, suffix: " yrs", label: "In the trenches" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="relative rounded-2xl p-6 glass-panel gradient-border corner-brackets">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
                  // 0{i + 1}
                </div>
                <div className="mt-2 font-display text-4xl font-bold sm:text-5xl">
                  <Counter to={s.n} suffix={s.suffix} />
                </div>
                <div className="mt-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="modules::loaded"
            title="What I do, in modules"
            description="Each module is a deep-dive — explore the dedicated pages."
          />
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { to: "/about", k: "01", t: "About", d: "Background, principles, and how I think about security." },
            { to: "/skills", k: "02", t: "Skills", d: "Offensive, defensive, languages, tooling, cloud." },
            { to: "/projects", k: "03", t: "Projects", d: "Selected work — tools, exploits, platforms." },
            { to: "/experience", k: "04", t: "Experience", d: "Career timeline and key milestones." },
            { to: "/writeups", k: "05", t: "Writeups", d: "CTF solves and security research notes." },
            { to: "/services", k: "06", t: "Services", d: "Pentesting, red teaming, secure engineering." },
          ].map((m, i) => (
            <Reveal key={m.to} delay={i * 0.06}>
              <Link
                to={m.to}
                className="group relative block h-full overflow-hidden rounded-2xl p-6 glass-panel gradient-border transition-shadow hover:shadow-[0_0_40px_oklch(0.85_0.18_200/0.25)]"
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
                  // {m.k}
                </div>
                <div className="mt-2 font-display text-2xl font-semibold">{m.t}</div>
                <p className="mt-2 text-sm text-muted-foreground">{m.d}</p>
                <div className="mt-6 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-cyber-cyan">
                  Open <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-5xl px-4 py-24 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl p-10 text-center glass-panel gradient-border sm:p-16">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 opacity-60"
              style={{
                background:
                  "radial-gradient(circle at 30% 20%, oklch(0.65 0.25 290 / 0.35), transparent 50%), radial-gradient(circle at 80% 80%, oklch(0.85 0.18 200 / 0.3), transparent 55%)",
              }}
            />
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-cyber-cyan">
              ready to engage
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-5xl">
              Have a system worth <span className="text-gradient-cyber">defending</span>?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Let's talk about your threat model, your roadmap, and how we
              harden it before someone else tries.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-violet px-7 py-3.5 font-mono text-xs uppercase tracking-wider text-background transition-shadow hover:shadow-[0_0_40px_oklch(0.85_0.18_200/0.6)]"
              >
                Start engagement
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
