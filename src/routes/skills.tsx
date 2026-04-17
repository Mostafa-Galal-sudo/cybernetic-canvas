import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import {
  Sword,
  ShieldCheck,
  Code2,
  Wrench,
  Cpu,
} from "lucide-react";

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

function SkillsPage() {
  const [active, setActive] = useState<string>(CATEGORIES[0].key);
  const cat = CATEGORIES.find((c) => c.key === active)!;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
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
