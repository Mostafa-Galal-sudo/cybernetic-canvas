import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { Spine, SpineCard } from "@/components/Spine";
import { Sword, ShieldCheck, Code2, Wrench, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills — Mostafa Galal" },
      {
        name: "description",
        content:
          "Offensive security, networking, languages, tooling, and embedded systems — the stack Mostafa Galal works with.",
      },
      { property: "og:title", content: "Skills — Mostafa Galal" },
      {
        property: "og:description",
        content:
          "Offensive security, networking, languages, tooling, and embedded systems — the stack Mostafa Galal works with.",
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
      { name: "Penetration Testing", level: 88, note: "eJPT certified — methodology, recon, exploitation, reporting." },
      { name: "Web Exploitation", level: 85, note: "OWASP Top 10, business logic, real-world bug bounty findings." },
      { name: "Network Reconnaissance", level: 90, note: "Nmap, Subfinder, httpx, custom TCP scanners." },
      { name: "Exploit Development", level: 72, note: "Stack-based buffer overflows, shellcode fundamentals." },
      { name: "Reverse Engineering", level: 70, note: "x86 assembly, ELF analysis, symbol-table heuristics." },
      { name: "Red Team Methodology", level: 80, note: "Adversary emulation, AD labs, post-exploitation." },
    ],
  },
  {
    key: "defensive",
    Icon: ShieldCheck,
    title: "Networking & Defense",
    skills: [
      { name: "Network Fundamentals", level: 92, note: "TCP/IP, routing, switching — 24h ITI training." },
      { name: "Advanced Networking", level: 85, note: "ITI advanced networking module (24h)." },
      { name: "Linux System Admin", level: 88, note: "Red Hat RHCSA-aligned coursework." },
      { name: "Cybersecurity Fundamentals", level: 90, note: "Mahara-Tech / VMware 35h foundational program." },
    ],
  },
  {
    key: "languages",
    Icon: Code2,
    title: "Languages",
    skills: [
      { name: "Python", level: 92, note: "Daily driver — tooling, automation, scanners, ML pipelines." },
      { name: "Embedded C/C++", level: 85, note: "Smart Recon Vehicle, motor drivers, serial comms." },
      { name: "JavaScript", level: 75, note: "Payload research, web exploitation context." },
      { name: "Bash", level: 88, note: "Linux automation, framework deployment scripts." },
      { name: "x86 Assembly", level: 65, note: "Reverse engineering, BOF exploit development." },
    ],
  },
  {
    key: "tooling",
    Icon: Wrench,
    title: "Tooling",
    skills: [
      { name: "Metasploit", level: 85, note: "Exploitation framework — eJPT lab work." },
      { name: "Nmap", level: 92, note: "Service enumeration, OS detection, NSE scripts." },
      { name: "Burp Suite", level: 80, note: "Web app testing, intercept, repeater workflows." },
      { name: "OpenCV", level: 78, note: "Real-time computer vision (FaceBlur Live)." },
      { name: "Subfinder / httpx / swaks", level: 88, note: "Recon and SMTP testing — Snapchat finding." },
    ],
  },
  {
    key: "embedded",
    Icon: Cpu,
    title: "Embedded & Electronics",
    skills: [
      { name: "Analog Filter Design", level: 88, note: "RLC band-pass, 3rd-order Butterworth filters." },
      { name: "Digital Logic Design", level: 85, note: "Logic gates, automation systems (Smart Curtain)." },
      { name: "Frequency Response Analysis", level: 82, note: "Resonance, bandwidth, Q-factor, transfer functions." },
      { name: "Bluetooth / HC-05", level: 80, note: "Wireless control for embedded vehicles." },
      { name: "Circuit Simulation", level: 78, note: "Filter design and validation workflows." },
    ],
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function AnimatedBar({ level }: { level: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });

  return (
    <div ref={ref} className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
      <motion.div
        className="absolute inset-y-0 left-0 origin-left rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-violet"
        style={{ width: `${level}%` }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: inView ? 1 : 0 }}
        transition={{ duration: 1.5, ease: EASE }}
      />
      <motion.div
        className="absolute inset-y-0 left-0 origin-left rounded-full bg-gradient-to-r from-cyber-cyan/60 to-cyber-violet/60 blur-[4px]"
        style={{ width: `${level}%` }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: inView ? 1 : 0 }}
        transition={{ duration: 1.5, ease: EASE, delay: 0.08 }}
      />
    </div>
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <TiltCard
      intensity={7}
      className="group relative h-full overflow-hidden rounded-2xl glass-panel gradient-border corner-brackets cursor-default"
    >
      <div className="p-6">
        <div className="flex items-baseline justify-between">
          <h3 className="font-display text-xl font-semibold transition-colors duration-300 group-hover:text-cyber-cyan">
            {skill.name}
          </h3>
          <span className="font-mono text-xs tabular-nums text-cyber-cyan">{skill.level}%</span>
        </div>
        <AnimatedBar level={skill.level} />
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">
          {skill.note}
        </p>
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), oklch(0.85 0.18 200 / 0.06), transparent 50%)",
        }}
      />
    </TiltCard>
  );
}

function SkillsPage() {
  const [active, setActive] = useState<string>(CATEGORIES[0].key);
  const cat = CATEGORIES.find((c) => c.key === active)!;

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <Reveal>
        <SectionHeading
          eyebrow="capabilities::matrix"
          title="The stack I attack and build with"
          description="Hover any skill to read context. Switch categories to drill in."
        />
      </Reveal>

      <div className="mt-10 flex flex-wrap gap-2">
        {CATEGORIES.map(({ key, Icon, title }) => {
          const isActive = key === active;
          return (
            <motion.button
              key={key}
              onClick={() => setActive(key)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.2, ease: EASE }}
              className={cn(
                "group relative inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider glass-panel gradient-border transition-all duration-300",
                isActive
                  ? "text-cyber-cyan shadow-[0_0_24px_oklch(0.85_0.18_200/0.35)]"
                  : "text-muted-foreground hover:text-foreground hover:shadow-[0_0_12px_oklch(0.85_0.18_200/0.15)]",
              )}
            >
              <motion.span
                animate={{ scale: isActive ? 1.2 : 1 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="flex"
              >
                <Icon className="h-3.5 w-3.5" />
              </motion.span>
              {title}
              {isActive && (
                <motion.span
                  layoutId="active-dot"
                  className="ml-0.5 h-1 w-1 rounded-full bg-cyber-cyan"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="mt-12"
        >
          <Spine>
            <ul className="space-y-12">
              {cat.skills.map((s, i) => (
                <li key={s.name}>
                  <SpineCard index={i}>
                    <SkillCard skill={s} />
                  </SpineCard>
                </li>
              ))}
            </ul>
          </Spine>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
