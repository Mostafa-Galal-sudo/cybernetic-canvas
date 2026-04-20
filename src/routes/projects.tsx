import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { TiltCard } from "@/components/TiltCard";
import { SpineColumn, useSpineScrollProgress, useIsSmall } from "@/components/SpineColumn";
import { SpineCard } from "@/components/SpineCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink, Github, Lock } from "lucide-react";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Mostafa Galal" },
      {
        name: "description",
        content:
          "Hands-on projects by Mostafa Galal — security tooling, payload research, embedded systems, and analog electronics.",
      },
      { property: "og:title", content: "Projects — Mostafa Galal" },
      {
        property: "og:description",
        content:
          "Hands-on projects by Mostafa Galal — security tooling, payload research, embedded systems, and analog electronics.",
      },
    ],
  }),
  component: ProjectsPage,
});

type Project = {
  name: string;
  description: string;
  full_description: string;
  key_takeaways: string;
  tech: string[];
  category: "security" | "technical";
  image: string | null;
  github: string;
  demo: string;
  status: "completed" | "private" | "wip";
};

const PROJECTS: Project[] = [
  {
    name: "Smart Recon Vehicle",
    description: "A smart vehicle combining embedded systems, automation, and remote Bluetooth control.",
    full_description:
      "Smart Recon Vehicle is an embedded systems project building a remotely controlled and semi-autonomous vehicle integrating a motor driver, multiple motors, Bluetooth control via HC-05, and laptop-side monitoring.",
    key_takeaways:
      "Designed modular embedded control system; hands-on with motor drivers, Bluetooth communication, and automation logic.",
    tech: ["Embedded C/C++", "Motor Driver", "HC-05 Bluetooth", "Serial Communication"],
    category: "technical",
    image: "/assets/smart.jpeg",
    github: "https://github.com/youssefsalama-11/Smart-Car-Project/blob/main/Smart_Car.ino",
    demo: "",
    status: "completed",
  },
  {
    name: "Shadow Core Framework",
    description: "Modular core framework for staged payload delivery and controlled listener orchestration.",
    full_description:
      "Shadow Core manages configuration, staged delivery, and controlled execution flows. Backbone for multiple experimental security modules.",
    key_takeaways:
      "Designed modular infrastructure framework demonstrating staged execution and configuration-driven behavior.",
    tech: ["Python", "Bash", "JSON", "Linux", "Deployment Scripts"],
    category: "security",
    image: null,
    github: "",
    demo: "",
    status: "private",
  },
  {
    name: "Payload Research Toolkit",
    description: "Multi-platform payload research toolkit for studying delivery mechanisms and obfuscation.",
    full_description:
      "Researches payload formats across OSes — generation, lightweight obfuscation, delivery simulation, and listener-side handling for controlled lab environments.",
    key_takeaways:
      "Deep insight into payload lifecycle analysis, cross-platform behavior, and delivery-chain modeling.",
    tech: ["Python", "JavaScript", "Bash", "Linux", "Obfuscation Techniques"],
    category: "security",
    image: null,
    github: "",
    demo: "",
    status: "private",
  },
  {
    name: "Endpoint Telemetry Logger",
    description: "Client-server telemetry tool for capturing and analyzing user input patterns in controlled environments.",
    full_description:
      "Explores endpoint-level telemetry by hiding inside a game and transmitting structured logs to a central server for analysis.",
    key_takeaways:
      "Built client-server telemetry system demonstrating endpoint monitoring and data transport.",
    tech: ["Python", "Sockets", "File I/O", "Client-Server Architecture"],
    category: "security",
    image: "/assets/keylogg.png",
    github: "",
    demo: "",
    status: "completed",
  },
  {
    name: "FaceBlur Live",
    description: "Real-time computer vision app detecting and blurring faces in live video streams.",
    full_description:
      "Detects human faces from live camera feed and applies dynamic blurring to protect identity in real time.",
    key_takeaways:
      "Built real-time computer vision system showcasing video streams and detection pipelines.",
    tech: ["Python", "OpenCV", "Computer Vision", "Real-Time Processing"],
    category: "security",
    image: "/assets/livefaceblur.png",
    github: "",
    demo: "/assets/livefaceblur.mp4",
    status: "completed",
  },
  {
    name: "TCP Full Scan Tool",
    description: "Custom TCP-based network scanning tool for analyzing exposed services and port states.",
    full_description:
      "Implements TCP full-connect scanning to enumerate open, closed, and filtered ports emphasizing low-level networking.",
    key_takeaways:
      "Demonstrated networking fundamentals by implementing a custom TCP scanning engine.",
    tech: ["Python", "TCP Sockets", "Networking Fundamentals"],
    category: "security",
    image: "/assets/tcp_full_scan.png",
    github: "",
    demo: "/assets/tcp_full_scan.mp4",
    status: "completed",
  },
  {
    name: "Series RLC Band-Pass Filter",
    description: "Passive band-pass filter using series RLC circuit for precise frequency selection.",
    full_description:
      "Allows signals around a defined center frequency to pass while attenuating low/high frequencies. Emphasizes resonance, bandwidth, and frequency response analysis.",
    key_takeaways:
      "Deep understanding of resonance, center frequency, bandwidth, quality factor, and passive filter design.",
    tech: ["RLC Circuits", "Analog Electronics", "Filters", "Frequency Response"],
    category: "technical",
    image: "/assets/bandpass.png",
    github: "",
    demo: "/assets/bandpass.mp4",
    status: "completed",
  },
  {
    name: "Smart Curtain System",
    description: "Logic-gate-based smart curtain control system for automated opening and closing.",
    full_description:
      "Controls curtain movement based on logical conditions using pure logic gates — no microcontrollers — simulating smart home automation at hardware level.",
    key_takeaways:
      "Applied digital logic to automation; designed control logic using gates; hardware-level decision-making.",
    tech: ["Logic Gates", "Digital Logic Design", "Automation Fundamentals"],
    category: "technical",
    image: "/assets/curtain.png",
    github: "",
    demo: "",
    status: "completed",
  },
  {
    name: "NM Analyzer",
    description: "Static analysis tool for Linux Kernel Modules using symbol table heuristics to detect malicious patterns.",
    full_description:
      "Automates ELF binary inspection by parsing symbol tables. Uses semantic heuristics to categorize symbols into risk groups: Syscall Hooking, Privilege Escalation.",
    key_takeaways:
      "Built security-focused binary analysis tool; heuristic-based kernel-level threat detection; ELF symbol table mastery.",
    tech: ["Python", "ELF Analysis", "Linux Kernel Internals", "Heuristic Analysis"],
    category: "security",
    image: "/assets/nm_analyzer.png",
    github: "",
    demo: "/assets/nm.mp4",
    status: "completed",
  },
  {
    name: "TikTok Media Downloader",
    description: "Lightweight tool for downloading TikTok videos without watermarks or ads.",
    full_description:
      "Clean minimal media downloader retrieving TikTok videos without embedded watermarks or ads.",
    key_takeaways:
      "Media extraction tool demonstrating HTTP workflows and content parsing.",
    tech: ["Python", "HTTP Requests", "Media Parsing"],
    category: "technical",
    image: "/assets/tiktok.png",
    github: "",
    demo: "/assets/tiktok.mp4",
    status: "completed",
  },
  {
    name: "3rd Order Butterworth Band-Pass Filter",
    description: "Passive 3rd-order Butterworth BPF with flat passband and precise frequency selection.",
    full_description:
      "Maximally flat magnitude response within the passband. Center frequency 1 MHz, bandwidth 10 kHz. Third-order design balances passband flatness with roll-off steepness.",
    key_takeaways:
      "Butterworth filter characteristics, filter order trade-offs, passive RLC design, transfer function analysis.",
    tech: ["Analog Filters", "Butterworth Design", "RLC Circuits", "Frequency Response", "Circuit Simulation"],
    category: "technical",
    image: "/assets/butterworth_bpf.jpeg",
    github: "",
    demo: "/assets/filter3rd.mp4",
    status: "completed",
  },
];

const STATUS_COLOR: Record<Project["status"], string> = {
  completed: "bg-cyber-cyan",
  private: "bg-cyber-violet",
  wip: "bg-amber-400",
};

const EASE = [0.22, 1, 0.36, 1] as const;

const tagVariants = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

function ProjectCard({
  project,
  onOpen,
  ready,
}: {
  project: Project;
  onOpen: () => void;
  ready: boolean;
}) {
  const isPrivate = project.status === "private";

  return (
    <motion.div
      whileHover={{ scale: 1.02, boxShadow: "0 0 40px oklch(0.85 0.18 200 / 0.4)" }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      <TiltCard className="group h-full" intensity={6}>
        <button
          onClick={onOpen}
          className="relative block h-full w-full overflow-hidden rounded-2xl text-left glass-panel gradient-border corner-brackets"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyber-cyan/8 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full z-10"
          />
          {project.image ? (
            <div className="aspect-[16/10] w-full overflow-hidden bg-black/40">
              <img
                src={project.image}
                alt={project.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ) : (
            <div
              aria-hidden
              className="aspect-[16/10] w-full"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.65 0.25 290 / 0.5), oklch(0.7 0.27 330 / 0.5))",
              }}
            >
              <div className="flex h-full flex-col items-center justify-center gap-3">
                <Lock className="h-10 w-10 text-cyber-violet" />
                <span className="font-mono text-xs uppercase tracking-[0.4em] text-foreground/80">
                  Classified
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Sorry — can not show
                </span>
              </div>
            </div>
          )}
          <div className="p-5">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <span>{project.category}</span>
              <span className="flex items-center gap-1.5">
                <span
                  className={`inline-block h-2 w-2 animate-pulse-glow rounded-full ${STATUS_COLOR[project.status]}`}
                />
                {project.status}
              </span>
            </div>
            <h3 className="mt-3 font-display text-xl font-semibold leading-snug">
              {project.name}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {project.description}
            </p>
            <motion.div
              initial="hidden"
              animate={ready ? "show" : "hidden"}
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
              }}
              className="mt-4 flex flex-wrap gap-1.5"
            >
              {project.tech.slice(0, 3).map((t) => (
                <motion.span
                  key={t}
                  variants={tagVariants}
                  className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                >
                  {t}
                </motion.span>
              ))}
              {project.tech.length > 3 && (
                <motion.span
                  variants={tagVariants}
                  className="font-mono text-[10px] text-muted-foreground"
                >
                  +{project.tech.length - 3}
                </motion.span>
              )}
            </motion.div>
            {isPrivate && (
              <div className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-cyber-violet">
                <Lock className="h-3 w-3" /> source not public
              </div>
            )}
          </div>
        </button>
      </TiltCard>
    </motion.div>
  );
}

function ProjectSlot({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) {
  const [ready, setReady] = useState(false);
  return (
    <SpineCard index={index} onSettled={() => setReady(true)}>
      <ProjectCard project={project} onOpen={onOpen} ready={ready} />
    </SpineCard>
  );
}

function ProjectsPage() {
  const [open, setOpen] = useState<Project | null>(null);
  const [filter, setFilter] = useState<"all" | "security" | "technical">("all");
  const containerRef = useRef<HTMLDivElement>(null);
  const progress = useSpineScrollProgress(containerRef);
  const isSmall = useIsSmall();

  const filtered = PROJECTS.filter((p) => filter === "all" || p.category === filter);

  return (
    <div ref={containerRef} className="relative" style={{ minHeight: "420vh" }}>
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="repo::index"
            title="11 projects across security & engineering"
            description="From red team tooling to analog filters — click any card for the full breakdown."
          />
        </Reveal>

        <div className="relative z-20 mt-10 flex flex-wrap gap-2">
          {(["all", "security", "technical"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all glass-panel gradient-border ${
                filter === k
                  ? "text-cyber-cyan shadow-[0_0_24px_oklch(0.85_0.18_200/0.35)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {!isSmall && (
        <div
          aria-hidden
          className="pointer-events-none sticky top-0 hidden h-screen w-full sm:block"
          style={{ zIndex: 0 }}
        >
          <SpineColumn scrollProgress={progress} />
        </div>
      )}

      <div
        className="relative mx-auto max-w-7xl px-4 sm:px-6"
        style={{
          marginTop: isSmall ? 0 : "-100vh",
          zIndex: 10,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.ul
            key={filter}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="space-y-16 pb-32 pt-8 sm:space-y-24"
          >
            {filtered.map((p, i) => (
              <li key={p.name}>
                <ProjectSlot project={p} index={i} onOpen={() => setOpen(p)} />
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-2xl glass-panel gradient-border">
          {open && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-cyber-cyan">
                  <span>{open.category}</span>
                  <span className="flex items-center gap-1.5">
                    <span
                      className={`inline-block h-2 w-2 animate-pulse-glow rounded-full ${STATUS_COLOR[open.status]}`}
                    />
                    {open.status}
                  </span>
                </div>
                <DialogTitle className="mt-2 font-display text-3xl">
                  {open.name}
                </DialogTitle>
                <DialogDescription className="text-base text-muted-foreground">
                  {open.description}
                </DialogDescription>
              </DialogHeader>
              {open.image ? (
                <div className="mt-2 aspect-[16/9] w-full overflow-hidden rounded-xl bg-black/40">
                  <img
                    src={open.image}
                    alt={open.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div
                  aria-hidden
                  className="mt-2 aspect-[16/9] w-full overflow-hidden rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.65 0.25 290 / 0.5), oklch(0.7 0.27 330 / 0.5))",
                  }}
                >
                  <div className="flex h-full flex-col items-center justify-center gap-2">
                    <Lock className="h-8 w-8 text-cyber-violet" />
                    <span className="font-mono text-xs uppercase tracking-[0.4em] text-foreground/80">
                      Classified
                    </span>
                  </div>
                </div>
              )}
              <p className="text-sm leading-relaxed text-foreground/80">
                {open.full_description}
              </p>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyber-cyan">
                  key takeaways
                </div>
                <p className="mt-2 text-sm text-foreground/80">{open.key_takeaways}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {open.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
              {open.status !== "private" && (open.github || open.demo) && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {open.demo && (
                    <a
                      href={open.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider text-cyber-cyan glass-panel gradient-border"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Demo
                    </a>
                  )}
                  {open.github && (
                    <a
                      href={open.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider text-foreground glass-panel gradient-border"
                    >
                      <Github className="h-3.5 w-3.5" /> Source
                    </a>
                  )}
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
